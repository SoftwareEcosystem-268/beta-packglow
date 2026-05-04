/**
 * @jest-environment jsdom
 */
export {}

const mockFetch = jest.fn();
global.fetch = mockFetch;

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, val: string) => { store[key] = val; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
  mockFetch.mockReset();
});

function lastCall() {
  return mockFetch.mock.calls[0];
}

describe("Outfits API", () => {
  it("getOutfits fetches all outfits", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    const { getOutfits } = await import("@/lib/api");
    await getOutfits();

    expect(lastCall()[0]).toContain("/outfit-suggestions/");
  });

  it("getSavedOutfits fetches with user_id", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    const { getSavedOutfits } = await import("@/lib/api");
    await getSavedOutfits("user-1");

    expect(lastCall()[0]).toContain("/saved-outfits/?user_id=user-1");
  });

  it("saveOutfit sends POST", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "saved-1", user_id: "user-1", outfit_id: "outfit-1" }),
    });

    const { saveOutfit } = await import("@/lib/api");
    await saveOutfit("user-1", "outfit-1");

    const [url, opts] = lastCall();
    expect(url).toContain("/saved-outfits/");
    expect(opts?.method).toBe("POST");
    const body = JSON.parse(opts?.body as string);
    expect(body.outfit_id).toBe("outfit-1");
  });

  it("deleteSavedOutfit sends DELETE", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 204 });

    const { deleteSavedOutfit } = await import("@/lib/api");
    await deleteSavedOutfit("saved-1");

    expect(lastCall()[0]).toContain("/saved-outfits/saved-1");
    expect(lastCall()[1]?.method).toBe("DELETE");
  });
});

describe("Checklists API", () => {
  it("getChecklists fetches with trip_id", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    const { getChecklists } = await import("@/lib/api");
    await getChecklists("trip-1");

    expect(lastCall()[0]).toContain("/checklists/?trip_id=trip-1");
  });

  it("createChecklistItem sends POST with data", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: "cl-1" }) });

    const { createChecklistItem } = await import("@/lib/api");
    await createChecklistItem({
      trip_id: "trip-1",
      custom_item_name: "Sunglasses",
      quantity: 2,
    });

    const [, opts] = lastCall();
    expect(opts?.method).toBe("POST");
    const body = JSON.parse(opts?.body as string);
    expect(body.custom_item_name).toBe("Sunglasses");
    expect(body.quantity).toBe(2);
  });

  it("updateChecklist sends PATCH", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: "cl-1", is_packed: true }) });

    const { updateChecklist } = await import("@/lib/api");
    await updateChecklist("cl-1", { is_packed: true });

    const [url, opts] = lastCall();
    expect(url).toContain("/checklists/cl-1");
    expect(opts?.method).toBe("PATCH");
  });

  it("deleteChecklistItem sends DELETE", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 204 });

    const { deleteChecklistItem } = await import("@/lib/api");
    await deleteChecklistItem("cl-1");

    expect(lastCall()[1]?.method).toBe("DELETE");
  });

  it("bulkSaveChecklist sends PUT with items array", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    const { bulkSaveChecklist } = await import("@/lib/api");
    await bulkSaveChecklist("trip-1", [
      { id: "cl-1", trip_id: "trip-1", item_id: "i1", is_packed: true, custom_note: null, quantity: 1, custom_item_name: null, sort_order: 0 },
    ]);

    const [url, opts] = lastCall();
    expect(url).toContain("/checklists/bulk?trip_id=trip-1");
    expect(opts?.method).toBe("PUT");
    const body = JSON.parse(opts?.body as string);
    expect(body.items).toHaveLength(1);
  });
});

describe("Templates API", () => {
  it("getTemplates fetches with user_id", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    const { getTemplates } = await import("@/lib/api");
    await getTemplates("user-1");

    expect(lastCall()[0]).toContain("/templates/?user_id=user-1");
  });

  it("createTemplate sends POST", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: "tpl-1" }) });

    const { createTemplate } = await import("@/lib/api");
    await createTemplate({
      user_id: "user-1",
      name: "Beach Trip",
      items: [{ name: "Swimsuit", category: "clothes", quantity: 2 }],
    });

    const [, opts] = lastCall();
    expect(opts?.method).toBe("POST");
  });

  it("deleteTemplate sends DELETE", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 204 });

    const { deleteTemplate } = await import("@/lib/api");
    await deleteTemplate("tpl-1");

    expect(lastCall()[0]).toContain("/templates/tpl-1");
    expect(lastCall()[1]?.method).toBe("DELETE");
  });
});

describe("Packing Assistant API", () => {
  it("generatePackingList sends POST with destination data", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ packing_list: {}, custom_suggestions: [], outfits: [] }) });

    const { generatePackingList } = await import("@/lib/api");
    await generatePackingList({
      destination_type: "beach",
      duration_days: 5,
      activities: ["swimming"],
      user_tier: "pro",
    });

    const [url, opts] = lastCall();
    expect(url).toContain("/packing-assistant/generate");
    expect(opts?.method).toBe("POST");
    const body = JSON.parse(opts?.body as string);
    expect(body.destination_type).toBe("beach");
    expect(body.user_tier).toBe("pro");
  });
});
