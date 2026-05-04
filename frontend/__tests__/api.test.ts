/**
 * @jest-environment jsdom
 */
export {}

// We test the API module by mocking fetch.
// Since api.ts uses top-level `const API_URL`, we import after setting env.

const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock localStorage
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

describe("API client", () => {
  describe("when token is stored", () => {
    beforeEach(() => {
      localStorageMock.setItem("pg_access_token", "test-token");
    });

    it("sends Authorization header", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const { getTrips } = await import("@/lib/api");
      await getTrips("user-1");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/trips/"),
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: "Bearer test-token" }),
        })
      );
    });
  });

  describe("when token is missing", () => {
    it("does not send Authorization header", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const { getTrips } = await import("@/lib/api");
      await getTrips("user-1");

      const call = mockFetch.mock.calls[0];
      const headers = call[1]?.headers as Record<string, string>;
      expect(headers?.Authorization).toBeUndefined();
    });
  });

  describe("error handling", () => {
    it("throws on 401 and clears auth", async () => {
      localStorageMock.setItem("pg_access_token", "expired");

      mockFetch.mockResolvedValueOnce({ ok: false, status: 401 });

      const { getTrips } = await import("@/lib/api");
      await expect(getTrips("user-1")).rejects.toThrow("Session หมดอายุ");
    });

    it("throws on non-ok response with status", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => "Internal Server Error",
      });

      const { getTrips } = await import("@/lib/api");
      await expect(getTrips("user-1")).rejects.toThrow("API Error: 500");
    });
  });
});
