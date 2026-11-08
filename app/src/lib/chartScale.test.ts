import { describe, expect, it } from "vitest";
import { buildAxisScale, parseCalendarDate, pluralizeAlerts } from "@/lib/chartScale";

describe("buildAxisScale", () => {
  it.each([
    [0, 4, [0, 2, 4]],
    [4, 4, [0, 2, 4]],
    [5, 8, [0, 4, 8]],
    [9, 20, [0, 10, 20]],
    [21, 40, [0, 20, 40]],
  ])("scales %i to a maximum of %i", (largestValue, max, ticks) => {
    expect(buildAxisScale(largestValue)).toEqual({ max, ticks });
  });
});

describe("parseCalendarDate", () => {
  it("keeps the calendar day regardless of timezone", () => {
    const date = parseCalendarDate("2026-03-09");
    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2026, 2, 9]);
  });
});

describe("pluralizeAlerts", () => {
  it("uses the singular only for one", () => {
    expect(pluralizeAlerts(1)).toBe("1 alerta");
    expect(pluralizeAlerts(0)).toBe("0 alertas");
    expect(pluralizeAlerts(2)).toBe("2 alertas");
  });
});
