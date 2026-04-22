const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`API Error: ${res.status} — ${detail}`);
  }
  return res.json();
}

// =============================================================================
// Trips
// =============================================================================
export type Trip = {
  id: string;
  user_id: string;
  title: string;
  destination_type: string;
  destination: string | null;
  duration_days: number;
  activities: string[];
  start_date: string | null;
  end_date: string | null;
  status: string;
  created_at: string;
  updated_at: string | null;
};

export const getTrips = (userId: string) =>
  apiFetch<Trip[]>(`/trips/?user_id=${userId}`);

export const createTrip = (data: Omit<Trip, "id" | "created_at" | "updated_at">) =>
  apiFetch<Trip>("/trips/", { method: "POST", body: JSON.stringify(data) });

export const deleteTrip = (tripId: string) =>
  fetch(`${API_URL}/trips/${tripId}`, { method: "DELETE" });

export const updateTrip = (tripId: string, data: Partial<Pick<Trip, "title" | "destination_type" | "destination" | "duration_days" | "activities" | "start_date" | "end_date" | "status">>) =>
  apiFetch<Trip>(`/trips/${tripId}`, { method: "PATCH", body: JSON.stringify(data) });

// =============================================================================
// Packing Items
// =============================================================================
export type PackingItem = {
  id: string;
  name: string;
  category: string;
  destination_types: string[];
  is_weather_dependent: boolean;
  user_id: string | null;
};

export const getPackingItems = (userId?: string) =>
  apiFetch<PackingItem[]>(`/packing-items/${userId ? `?user_id=${userId}` : ""}`);

export const createPackingItem = (data: Omit<PackingItem, "id">) =>
  apiFetch<PackingItem>("/packing-items/", { method: "POST", body: JSON.stringify(data) });

export const deletePackingItem = (itemId: string) =>
  fetch(`${API_URL}/packing-items/${itemId}`, { method: "DELETE" });

// =============================================================================
// Outfit Suggestions
// =============================================================================
export type Outfit = {
  id: string;
  destination_type: string;
  occasion: string;
  weather_condition: string | null;
  description: string | null;
  image_url: string | null;
  style_tags: string[];
  gender: string;
  season: string;
  created_at: string;
};

export const getOutfits = () =>
  apiFetch<Outfit[]>("/outfit-suggestions/");

// =============================================================================
// Saved Outfits
// =============================================================================
export type SavedOutfit = {
  id: string;
  user_id: string;
  outfit_id: string;
  saved_at: string;
  outfit: Outfit;
};

export const getSavedOutfits = (userId: string) =>
  apiFetch<SavedOutfit[]>(`/saved-outfits/?user_id=${userId}`);

export const saveOutfit = (userId: string, outfitId: string) =>
  apiFetch<SavedOutfit>(`/saved-outfits/?user_id=${userId}`, {
    method: "POST",
    body: JSON.stringify({ outfit_id: outfitId }),
  });

export const deleteSavedOutfit = (savedId: string) =>
  fetch(`${API_URL}/saved-outfits/${savedId}`, { method: "DELETE" });

// =============================================================================
// Checklists
// =============================================================================
export type ChecklistItem = {
  id: string;
  trip_id: string;
  item_id: string | null;
  is_packed: boolean;
  custom_note: string | null;
  quantity: number;
  custom_item_name: string | null;
  sort_order: number;
};

export const getChecklists = (tripId: string) =>
  apiFetch<ChecklistItem[]>(`/checklists/?trip_id=${tripId}`);

export const createChecklistItem = (data: {
  trip_id: string;
  item_id?: string | null;
  is_packed?: boolean;
  custom_note?: string | null;
  quantity?: number;
  custom_item_name?: string | null;
  sort_order?: number;
}) =>
  apiFetch<ChecklistItem>("/checklists/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateChecklist = (id: string, data: { is_packed?: boolean; custom_note?: string; quantity?: number; custom_item_name?: string; sort_order?: number }) =>
  apiFetch<ChecklistItem>(`/checklists/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteChecklistItem = (id: string) =>
  fetch(`${API_URL}/checklists/${id}`, { method: "DELETE" });

export const bulkSaveChecklist = (tripId: string, items: ChecklistItem[]) =>
  apiFetch<ChecklistItem[]>(`/checklists/bulk?trip_id=${tripId}`, {
    method: "PUT",
    body: JSON.stringify({ items }),
  });

// =============================================================================
// Checklist Templates
// =============================================================================
export type ChecklistTemplateItem = {
  name: string;
  category: string;
  quantity: number;
};

export type ChecklistTemplate = {
  id: string;
  user_id: string;
  name: string;
  items: ChecklistTemplateItem[];
  created_at: string;
};

export const getTemplates = (userId: string) =>
  apiFetch<ChecklistTemplate[]>(`/templates/?user_id=${userId}`);

export const createTemplate = (data: {
  user_id: string;
  name: string;
  items: ChecklistTemplateItem[];
}) =>
  apiFetch<ChecklistTemplate>("/templates/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteTemplate = (templateId: string) =>
  fetch(`${API_URL}/templates/${templateId}`, { method: "DELETE" });

// =============================================================================
// Packing Assistant
// =============================================================================
export type PackingAssistantRequest = {
  destination_type: "beach" | "mountain" | "city" | "abroad" | "ceremony";
  duration_days: number;
  activities: string[];
  user_tier: "free" | "pro";
};

export type OutfitRecommendation = {
  name: string;
  items: string[];
  style: string;
  match_reason: string;
};

export type PackingAssistantResponse = {
  packing_list: {
    clothes: string[];
    personal: string[];
    health: string[];
    electronics: string[];
    documents: string[];
    others: string[];
  };
  custom_suggestions: string[];
  outfits: OutfitRecommendation[];
};

export const generatePackingList = (data: PackingAssistantRequest) =>
  apiFetch<PackingAssistantResponse>("/packing-assistant/generate", {
    method: "POST",
    body: JSON.stringify(data),
  });
