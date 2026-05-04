const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("pg_access_token");
}

function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("pg_access_token");
  localStorage.removeItem("pg_current_user");
  localStorage.removeItem("pg_user_tier");
  localStorage.removeItem("pg_subscription_expires");
  if (!window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/signup")) {
    window.location.href = (process.env.NEXT_BASE_PATH || "") + "/login";
  }
}

async function fetchWithRetry(url: string, options?: RequestInit, retries = 2): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetch(url, options);
    } catch {
      if (attempt === retries) throw new Error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่");
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  throw new Error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetchWithRetry(`${API_URL}${path}`, { headers: authHeaders(), ...options });

  if (res.status === 401) {
    clearAuth();
    throw new Error("Session หมดอายุ กรุณาเข้าสู่ระบบใหม่");
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`API Error: ${res.status} — ${detail}`);
  }
  return res.json();
}

async function apiFetchRaw(path: string, options?: RequestInit): Promise<Response> {
  const res = await fetchWithRetry(`${API_URL}${path}`, { headers: authHeaders(), ...options });

  if (res.status === 401) {
    clearAuth();
    throw new Error("Session หมดอายุ กรุณาเข้าสู่ระบบใหม่");
  }

  return res;
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
  apiFetchRaw(`/trips/${tripId}`, { method: "DELETE" });

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
  apiFetchRaw(`/packing-items/${itemId}`, { method: "DELETE" });

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
  apiFetchRaw(`/saved-outfits/${savedId}`, { method: "DELETE" });

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
  apiFetchRaw(`/checklists/${id}`, { method: "DELETE" });

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
  apiFetchRaw(`/templates/${templateId}`, { method: "DELETE" });

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

// =============================================================================
// Weather — real OpenWeatherMap with fallback data
// =============================================================================
export type WeatherData = {
  destination_type: string;
  location?: string;
  source?: string;
  temp_c: number;
  feels_like_c: number;
  humidity: number;
  rain_chance: number;
  wind_kph: number;
  condition: string;
  condition_th: string;
  icon: string;
  clothing_tips: string[];
};

export const getWeather = (destinationType: string, city?: string) => {
  const params = city ? `?city=${encodeURIComponent(city)}` : "";
  return apiFetch<WeatherData>(`/weather/${destinationType}${params}`);
};
