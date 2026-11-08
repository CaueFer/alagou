import { describe, expect, it } from "vitest";
import { calculateDistanceMeters, formatDistance } from "@/lib/distance";

describe("calculateDistanceMeters", () => {
  it("is zero for the same point", () => {
    const point = { lat: -26.3, lng: -48.85 };
    expect(calculateDistanceMeters(point, point)).toBe(0);
  });

  it("measures one degree of latitude", () => {
    const distance = calculateDistanceMeters({ lat: -26, lng: -48 }, { lat: -27, lng: -48 });
    expect(distance).toBeCloseTo(111_195, -1);
  });

  it("is symmetric", () => {
    const a = { lat: -26.3, lng: -48.85 };
    const b = { lat: -26.25, lng: -48.8 };
    expect(calculateDistanceMeters(a, b)).toBeCloseTo(calculateDistanceMeters(b, a), 6);
  });
});

describe("formatDistance", () => {
  it("keeps meters below one kilometer", () => {
    expect(formatDistance(999.4, "km")).toBe("999 m");
  });

  it("switches to kilometers with a pt-BR decimal separator", () => {
    expect(formatDistance(1500, "km")).toBe("1,5 km");
  });

  it("always uses meters when that unit is selected", () => {
    expect(formatDistance(1500, "m")).toBe("1500 m");
  });
});
