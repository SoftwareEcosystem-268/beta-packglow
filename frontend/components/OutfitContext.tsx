"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { Outfit, SavedOutfit, getOutfits, getSavedOutfits, saveOutfit, deleteSavedOutfit } from "@/lib/api";

type OutfitContextType = {
  outfits: Outfit[];
  savedOutfits: SavedOutfit[];
  loading: boolean;
  toggleSave: (outfitId: string) => Promise<void>;
  isSaved: (outfitId: string) => boolean;
};

const OutfitContext = createContext<OutfitContextType | null>(null);

export function OutfitProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch outfits + saved outfits
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [outfitData, savedData] = await Promise.all([
          getOutfits(),
          user ? getSavedOutfits(user.id) : Promise.resolve([]),
        ]);
        setOutfits(outfitData);
        setSavedOutfits(savedData);
      } catch {
        setOutfits([]);
        setSavedOutfits([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const isSaved = useCallback(
    (outfitId: string) => savedOutfits.some((s) => s.outfit_id === outfitId),
    [savedOutfits]
  );

  const toggleSave = useCallback(
    async (outfitId: string) => {
      if (!user) {
        window.location.href = "/login";
        return;
      }
      const existing = savedOutfits.find((s) => s.outfit_id === outfitId);
      if (existing) {
        await deleteSavedOutfit(existing.id);
        setSavedOutfits((prev) => prev.filter((s) => s.outfit_id !== outfitId));
      } else {
        const saved = await saveOutfit(user.id, outfitId);
        setSavedOutfits((prev) => [...prev, saved]);
      }
    },
    [user, savedOutfits]
  );

  return (
    <OutfitContext.Provider value={{ outfits, savedOutfits, loading, toggleSave, isSaved }}>
      {children}
    </OutfitContext.Provider>
  );
}

export function useOutfits() {
  const context = useContext(OutfitContext);
  if (!context) throw new Error("useOutfits must be used within an OutfitProvider");
  return context;
}
