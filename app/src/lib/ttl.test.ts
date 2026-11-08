import { describe, expect, it } from "vitest";
import { formatTimeRemaining } from "@/lib/ttl";

const NOW = new Date("2026-01-01T12:00:00Z");

function inSeconds(seconds: number): string {
  return new Date(NOW.getTime() + seconds * 1000).toISOString();
}

describe("formatTimeRemaining", () => {
  it("reports past dates as expired", () => {
    expect(formatTimeRemaining(inSeconds(-1), NOW)).toBe("Expirado");
  });

  it("treats the exact expiration instant as expired", () => {
    expect(formatTimeRemaining(inSeconds(0), NOW)).toBe("Expirado");
  });

  it("rounds under half a minute to less than one minute", () => {
    expect(formatTimeRemaining(inSeconds(20), NOW)).toBe("Expira em menos de 1 min");
  });

  it("formats minutes below one hour", () => {
    expect(formatTimeRemaining(inSeconds(30 * 60), NOW)).toBe("Expira em 30 min");
  });

  it("omits minutes on a whole hour", () => {
    expect(formatTimeRemaining(inSeconds(2 * 3600), NOW)).toBe("Expira em 2h");
  });

  it("formats hours and minutes", () => {
    expect(formatTimeRemaining(inSeconds(90 * 60), NOW)).toBe("Expira em 1h 30min");
  });
});
