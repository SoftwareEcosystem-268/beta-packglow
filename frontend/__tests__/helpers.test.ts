import { getCategoryStats } from "@/lib/data/helpers";

describe("getCategoryStats", () => {
  const items = {
    clothes: [
      { is_packed: true },
      { is_packed: false },
    ],
    electronics: [
      { is_packed: true },
    ],
  };

  it("returns totals across all categories when id is 'all'", () => {
    const result = getCategoryStats("all", items);
    expect(result).toEqual({ completed: 2, total: 3 });
  });

  it("returns stats for specific category", () => {
    const result = getCategoryStats("clothes", items);
    expect(result).toEqual({ completed: 1, total: 2 });
  });

  it("returns zeros for unknown category", () => {
    const result = getCategoryStats("nonexistent", items);
    expect(result).toEqual({ completed: 0, total: 0 });
  });

  it("handles empty items", () => {
    const result = getCategoryStats("all", {});
    expect(result).toEqual({ completed: 0, total: 0 });
  });
});
