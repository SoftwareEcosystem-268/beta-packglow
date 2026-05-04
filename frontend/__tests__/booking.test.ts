import { computeBookingStatus, fmtDate, fmtDateRange, daysUntil } from "@/lib/data/booking";

describe("computeBookingStatus", () => {
  it("returns 'cancelled' when status is cancelled", () => {
    expect(computeBookingStatus({ status: "cancelled", start_date: null, end_date: null })).toBe("cancelled");
  });

  it("returns 'completed' when end_date is in the past", () => {
    const past = new Date();
    past.setDate(past.getDate() - 5);
    expect(computeBookingStatus({ status: "planned", start_date: "2025-01-01", end_date: past.toISOString().slice(0, 10) })).toBe("completed");
  });

  it("returns 'ongoing' when today is between start and end", () => {
    const today = new Date();
    const start = new Date(); start.setDate(today.getDate() - 2);
    const end = new Date(); end.setDate(today.getDate() + 2);
    expect(computeBookingStatus({
      status: "planned",
      start_date: start.toISOString().slice(0, 10),
      end_date: end.toISOString().slice(0, 10),
    })).toBe("ongoing");
  });

  it("returns 'pending' when start_date is in the future", () => {
    const future = new Date(); future.setDate(future.getDate() + 30);
    expect(computeBookingStatus({ status: "planned", start_date: future.toISOString().slice(0, 10), end_date: null })).toBe("pending");
  });

  it("returns 'pending' when no dates provided", () => {
    expect(computeBookingStatus({ status: "planned", start_date: null, end_date: null })).toBe("pending");
  });
});

describe("fmtDate", () => {
  it("returns '-' for null", () => {
    expect(fmtDate(null)).toBe("-");
  });

  it("formats a date string in Thai locale", () => {
    const result = fmtDate("2025-04-15");
    expect(result).toBeTruthy();
    expect(result).not.toBe("-");
  });
});

describe("fmtDateRange", () => {
  it("returns 'ยังไม่กำหนดวัน' when both null", () => {
    expect(fmtDateRange(null, null)).toBe("ยังไม่กำหนดวัน");
  });

  it("returns formatted range when both provided", () => {
    const result = fmtDateRange("2025-04-15", "2025-04-20");
    expect(result).toContain("—");
  });
});

describe("daysUntil", () => {
  it("returns null for null input", () => {
    expect(daysUntil(null)).toBeNull();
  });

  it("returns positive number for future date", () => {
    const future = new Date(); future.setDate(future.getDate() + 7);
    const result = daysUntil(future.toISOString().slice(0, 10));
    expect(result).toBeGreaterThan(0);
  });

  it("returns negative number for past date", () => {
    expect(daysUntil("2020-01-01")).toBeLessThan(0);
  });
});
