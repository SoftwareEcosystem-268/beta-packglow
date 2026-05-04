import { destinations, destCategories } from "@/lib/data/destinations";
import { packingCategories } from "@/lib/data/packing";
import { outfitFilters, outfitStyleNameMap, outfitDestFilters } from "@/lib/data/outfits";
import { partners } from "@/lib/data/partners";
import { freeFeatures, proFeatures } from "@/lib/data/pricing";

describe("destinations data", () => {
  it("has at least 8 destinations", () => {
    expect(destinations.length).toBeGreaterThanOrEqual(8);
  });

  it("each destination has required fields", () => {
    for (const d of destinations) {
      expect(d).toHaveProperty("id");
      expect(d).toHaveProperty("name");
      expect(d).toHaveProperty("location");
      expect(d).toHaveProperty("category");
      expect(d).toHaveProperty("destinationType");
      expect(d).toHaveProperty("suggestedActivities");
    }
  });

  it("destCategories has 'all' as first option", () => {
    expect(destCategories[0].id).toBe("all");
  });
});

describe("packingCategories", () => {
  it("has 'all' as first option", () => {
    expect(packingCategories[0].id).toBe("all");
  });

  it("includes essential categories", () => {
    const ids = packingCategories.map(c => c.id);
    expect(ids).toContain("clothes");
    expect(ids).toContain("electronics");
  });
});

describe("outfit data", () => {
  it("outfitStyleNameMap has expected styles", () => {
    expect(outfitStyleNameMap.casual).toBe("Smart Casual");
    expect(outfitStyleNameMap.beach).toBe("Beach Vibes");
  });

  it("outfitDestFilters covers destination types", () => {
    const ids = outfitDestFilters.map(f => f.id);
    expect(ids).toContain("beach");
    expect(ids).toContain("city");
  });
});

describe("partners data", () => {
  it("has at least 3 partners", () => {
    expect(partners.length).toBeGreaterThanOrEqual(3);
  });
});

describe("pricing data", () => {
  it("free features includes basic items", () => {
    const names = freeFeatures.map(f => f.name);
    expect(names).toContain("Destination Picker");
    expect(names).toContain("Basic Packing List");
  });

  it("all pro features are included", () => {
    expect(proFeatures.every(f => f.included)).toBe(true);
  });

  it("free tier has some locked features", () => {
    const locked = freeFeatures.filter(f => !f.included);
    expect(locked.length).toBeGreaterThan(0);
  });
});
