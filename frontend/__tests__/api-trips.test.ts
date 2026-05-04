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

describe("Trips API", () => {
  it("getTrips fetches with user_id query param", async () => {
    localStorageMock.setItem("pg_access_token", "tok");
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    const { getTrips } = await import("@/lib/api");
    await getTrips("user-1");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/trips/?user_id=user-1"),
      expect.any(Object)
    );
  });

  it("createTrip sends POST with body", async () => {
    localStorageMock.setItem("pg_access_token", "tok");
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: "1" }) });

    const { createTrip } = await import("@/lib/api");
    await createTrip({
      user_id: "user-1",
      title: "Test Trip",
      destination_type: "beach",
      destination: "Phuket",
      duration_days: 5,
      activities: ["swimming"],
      start_date: null,
      end_date: null,
      status: "planned",
    });

    const call = mockFetch.mock.calls[0];
    expect(call[1]?.method).toBe("POST");
    const body = JSON.parse(call[1]?.body as string);
    expect(body.title).toBe("Test Trip");
  });

  it("updateTrip sends PATCH", async () => {
    localStorageMock.setItem("pg_access_token", "tok");
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: "1", duration_days: 10 }) });

    const { updateTrip } = await import("@/lib/api");
    await updateTrip("trip-1", { duration_days: 10 });

    const call = mockFetch.mock.calls[0];
    expect(call[0]).toContain("/trips/trip-1");
    expect(call[1]?.method).toBe("PATCH");
  });

  it("deleteTrip sends DELETE via apiFetchRaw", async () => {
    localStorageMock.setItem("pg_access_token", "tok");
    mockFetch.mockResolvedValueOnce({ ok: true, status: 204 });

    const { deleteTrip } = await import("@/lib/api");
    await deleteTrip("trip-1");

    const call = mockFetch.mock.calls[0];
    expect(call[0]).toContain("/trips/trip-1");
    expect(call[1]?.method).toBe("DELETE");
  });
});

describe("Packing Items API", () => {
  it("getPackingItems fetches all when no userId", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    const { getPackingItems } = await import("@/lib/api");
    await getPackingItems();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/packing-items/"),
      expect.any(Object)
    );
    expect(mockFetch.mock.calls[0][0]).not.toContain("user_id");
  });

  it("getPackingItems fetches with userId filter", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    const { getPackingItems } = await import("@/lib/api");
    await getPackingItems("user-1");

    expect(mockFetch.mock.calls[0][0]).toContain("?user_id=user-1");
  });

  it("createPackingItem sends POST", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: "item-1" }) });

    const { createPackingItem } = await import("@/lib/api");
    await createPackingItem({
      name: "Sunscreen",
      category: "health",
      destination_types: ["beach"],
      is_weather_dependent: true,
      user_id: "user-1",
    });

    expect(call().method).toBe("POST");
  });

  it("deletePackingItem sends DELETE", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 204 });

    const { deletePackingItem } = await import("@/lib/api");
    await deletePackingItem("item-1");

    expect(call().method).toBe("DELETE");
  });
});

function call() {
  return mockFetch.mock.calls[0][1] as RequestInit;
}
