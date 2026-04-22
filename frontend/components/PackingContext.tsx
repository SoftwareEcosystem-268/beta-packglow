"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useTrips } from "./TripContext";
import {
  PackingItem as PackingItemType,
  ChecklistItem,
  ChecklistTemplate,
  ChecklistTemplateItem,
  PackingAssistantResponse,
  getPackingItems,
  createPackingItem,
  getChecklists,
  createChecklistItem,
  updateChecklist,
  deleteChecklistItem,
  bulkSaveChecklist,
  getTemplates,
  createTemplate,
  deleteTemplate,
  generatePackingList,
  createTrip,
} from "@/lib/api";

const categoryMap: Record<string, string> = {
  clothes: "เสื้อผ้า",
  personal: "ของใช้ส่วนตัว",
  health: "ยาและสุขภาพ",
  electronics: "อุปกรณ์อิเล็กทรอนิกส์",
  documents: "เอกสาร",
  others: "อื่น ๆ",
};

export type CheckListItemDisplay = ChecklistItem & {
  display_name: string;
  category: string;
};

type PackingContextType = {
  items: Record<string, CheckListItemDisplay[]>;
  loading: boolean;
  checklistItems: ChecklistItem[];
  togglePacked: (checklistId: string, currentPacked: boolean) => Promise<void>;
  addCustomItemToTrip: (categoryId: string, name: string) => Promise<boolean>;
  removeChecklistItem: (checklistId: string) => Promise<void>;
  categoryMap: Record<string, string>;
  isDirty: boolean;
  saving: boolean;
  saveChecklist: () => Promise<boolean>;
  totalItemCount: number;
  templates: ChecklistTemplate[];
  refreshTemplates: () => Promise<void>;
  saveAsTemplate: (name: string) => Promise<boolean>;
  loadTemplate: (template: ChecklistTemplate) => Promise<boolean>;
  removeTemplate: (templateId: string) => Promise<void>;
  generatedResult: PackingAssistantResponse | null;
  generating: boolean;
  generateSmartList: () => Promise<PackingAssistantResponse | null>;
};

const PackingContext = createContext<PackingContextType | null>(null);

function groupChecklistByCategory(
  checklistItems: ChecklistItem[],
  catalogLookup: Map<string, PackingItemType>
): Record<string, CheckListItemDisplay[]> {
  const grouped: Record<string, CheckListItemDisplay[]> = {};
  Object.keys(categoryMap).forEach((key) => {
    grouped[key] = [];
  });

  checklistItems.forEach((ci) => {
    let display_name = ci.custom_item_name || "Unknown";
    let category = "others";

    if (ci.item_id) {
      const catalogItem = catalogLookup.get(ci.item_id);
      if (catalogItem) {
        display_name = catalogItem.name;
        category = catalogItem.category;
      }
    }

    if (!grouped[category]) grouped[category] = [];
    grouped[category].push({ ...ci, display_name, category });
  });

  return grouped;
}

export function PackingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { currentTrip, setCurrentTrip } = useTrips();
  const [catalogLookup, setCatalogLookup] = useState<Map<string, PackingItemType>>(new Map());
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<PackingAssistantResponse | null>(null);
  const [generating, setGenerating] = useState(false);

  const totalItemCount = Object.values(
    groupChecklistByCategory(checklistItems, catalogLookup)
  ).reduce((s, c) => s + c.length, 0);
  const currentTripRef = useRef(currentTrip);
  currentTripRef.current = currentTrip;
  const userIdRef = useRef(user?.id);
  userIdRef.current = user?.id;

  const ensureTrip = useCallback(async () => {
    if (currentTripRef.current) return currentTripRef.current;
    const uid = userIdRef.current || null;
    const trip = await createTrip({
      user_id: uid || "guest",
      title: "Packing List",
      destination_type: "city",
      destination: null,
      duration_days: 3,
      activities: [],
      start_date: null,
      end_date: null,
      status: "planned",
    });
    setCurrentTrip(trip);
    return trip;
  }, [setCurrentTrip]);

  // Whether currentTrip has been hydrated from localStorage
  const [tripHydrated, setTripHydrated] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("pg_current_trip");
  });
  useEffect(() => {
    if (!tripHydrated && currentTrip) setTripHydrated(true);
  }, [currentTrip, tripHydrated]);

  // Fetch packing item catalog
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const data = await getPackingItems(user?.id);
        const lookup = new Map<string, PackingItemType>();
        data.forEach((item) => lookup.set(item.id, item));
        setCatalogLookup(lookup);
      } catch {
        setCatalogLookup(new Map());
      }
    };
    fetchCatalog();
  }, [user]);

  // Fetch checklist items for current trip
  useEffect(() => {
    if (!tripHydrated) return;
    if (!currentTrip) {
      setChecklistItems([]);
      return;
    }
    const fetchChecklist = async () => {
      setLoading(true);
      try {
        const data = await getChecklists(currentTrip.id);
        setChecklistItems(data);
      } catch {
        setChecklistItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchChecklist();
  }, [currentTrip, tripHydrated]);

  const items = groupChecklistByCategory(checklistItems, catalogLookup);

  const togglePacked = useCallback(async (checklistId: string, currentPacked: boolean) => {
    setIsDirty(true);
    setChecklistItems((prev) =>
      prev.map((ci) => (ci.id === checklistId ? { ...ci, is_packed: !currentPacked } : ci))
    );
    try {
      await updateChecklist(checklistId, { is_packed: !currentPacked });
    } catch {
      setChecklistItems((prev) =>
        prev.map((ci) => (ci.id === checklistId ? { ...ci, is_packed: currentPacked } : ci))
      );
    }
  }, []);

  const addCustomItemToTrip = useCallback(
    async (categoryId: string, name: string): Promise<boolean> => {
      try {
        const trip = await ensureTrip();

        const packingItem = await createPackingItem({
          name,
          category: categoryId,
          destination_types: [],
          is_weather_dependent: false,
          user_id: userIdRef.current || null,
        });

        const checklistEntry = await createChecklistItem({
          trip_id: trip.id,
          item_id: packingItem.id,
          is_packed: false,
          quantity: 1,
          sort_order: 0,
        });

        setCatalogLookup((prev) => {
          const next = new Map(prev);
          next.set(packingItem.id, packingItem);
          return next;
        });
        setChecklistItems((prev) => [...prev, checklistEntry]);
        setIsDirty(true);
        return true;
      } catch (e) {
        console.error("[PackingContext] addCustomItemToTrip failed:", e);
        return false;
      }
    },
    [ensureTrip]
  );

  const removeChecklistItem = useCallback(async (checklistId: string) => {
    setIsDirty(true);
    setChecklistItems((prev) => prev.filter((ci) => ci.id !== checklistId));
    try {
      await deleteChecklistItem(checklistId);
    } catch {
      // Already removed from UI
    }
  }, []);

  // --- Templates ---
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);

  const refreshTemplates = useCallback(async () => {
    const uid = userIdRef.current;
    if (!uid) return;
    try {
      const data = await getTemplates(uid);
      setTemplates(data);
    } catch {
      setTemplates([]);
    }
  }, []);

  const saveAsTemplate = useCallback(
    async (name: string): Promise<boolean> => {
      const uid = userIdRef.current;
      if (!uid || checklistItems.length === 0) return false;

      const seen = new Set<string>();
      const templateItems: ChecklistTemplateItem[] = [];
      for (const ci of checklistItems) {
        let itemName = ci.custom_item_name || "Unknown";
        let category = "others";
        if (ci.item_id) {
          const catalog = catalogLookup.get(ci.item_id);
          if (catalog) {
            itemName = catalog.name;
            category = catalog.category;
          }
        }
        const key = `${category}:${itemName}`;
        if (seen.has(key)) continue;
        seen.add(key);
        templateItems.push({ name: itemName, category, quantity: ci.quantity });
      }

      if (templateItems.length === 0) return false;

      try {
        const tpl = await createTemplate({ user_id: uid, name, items: templateItems });
        setTemplates((prev) => [tpl, ...prev]);
        return true;
      } catch (e) {
        console.error("[PackingContext] saveAsTemplate failed:", e);
        return false;
      }
    },
    [checklistItems, catalogLookup]
  );

  const loadTemplate = useCallback(
    async (template: ChecklistTemplate): Promise<boolean> => {
      let success = true;
      for (const tplItem of template.items) {
        const ok = await addCustomItemToTrip(tplItem.category, tplItem.name);
        if (!ok) success = false;
      }
      return success;
    },
    [addCustomItemToTrip]
  );

  const removeTemplate = useCallback(async (templateId: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId));
    try {
      await deleteTemplate(templateId);
    } catch {}
  }, []);

  const saveChecklist = useCallback(async (): Promise<boolean> => {
    const trip = currentTripRef.current;
    if (!trip || checklistItems.length === 0) return false;
    setSaving(true);
    try {
      const updated = await bulkSaveChecklist(trip.id, checklistItems);
      setChecklistItems(updated);
      setIsDirty(false);
      return true;
    } catch (e) {
      console.error("[PackingContext] saveChecklist failed:", e);
      return false;
    } finally {
      setSaving(false);
    }
  }, [checklistItems]);

  const generateSmartList = useCallback(async (): Promise<PackingAssistantResponse | null> => {
    setGenerating(true);
    try {
      const trip = await ensureTrip();

      const tier = typeof window !== "undefined"
        ? (localStorage.getItem("pg_user_tier") as "free" | "pro") || "free"
        : "free";
      const result = await generatePackingList({
        destination_type: (trip.destination_type || "city") as "beach" | "mountain" | "city" | "abroad" | "ceremony",
        duration_days: trip.duration_days || 1,
        activities: trip.activities || [],
        user_tier: tier as "free" | "pro",
      });
      setGeneratedResult(result);

      const existingNames = new Set<string>();
      checklistItems.forEach((ci) => {
        const name = ci.custom_item_name || catalogLookup.get(ci.item_id || "")?.name || "";
        existingNames.add(name);
      });

      const categories = Object.keys(result.packing_list) as Array<keyof typeof result.packing_list>;
      for (const category of categories) {
        for (const itemName of result.packing_list[category]) {
          if (existingNames.has(itemName)) continue;
          existingNames.add(itemName);
          await addCustomItemToTrip(category, itemName);
        }
      }
      return result;
    } catch (e) {
      console.error("[PackingContext] generateSmartList failed:", e);
      return null;
    } finally {
      setGenerating(false);
    }
  }, [checklistItems, catalogLookup, addCustomItemToTrip, ensureTrip]);

  return (
    <PackingContext.Provider
      value={{
        items, loading, checklistItems, togglePacked, addCustomItemToTrip,
        removeChecklistItem, categoryMap, isDirty, saving, saveChecklist,
        totalItemCount, templates, refreshTemplates,
        saveAsTemplate, loadTemplate, removeTemplate,
        generatedResult, generating, generateSmartList,
      }}
    >
      {children}
    </PackingContext.Provider>
  );
}

export function usePacking() {
  const context = useContext(PackingContext);
  if (!context) throw new Error("usePacking must be used within a PackingProvider");
  return context;
}
