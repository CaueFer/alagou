import { describe, expect, it } from "vitest";
import { USERNAME_MAX_LENGTH, filterUsernameInput, sanitizeAccountName } from "@/lib/username";

describe("filterUsernameInput", () => {
  it("drops disallowed characters without inserting spaces", () => {
    expect(filterUsernameInput("a.b c_d-1!")).toBe("ab c_d-1");
  });

  it("keeps accented letters", () => {
    expect(filterUsernameInput("João")).toBe("João");
  });

  it("enforces the maximum length", () => {
    expect(filterUsernameInput("a".repeat(USERNAME_MAX_LENGTH + 5))).toHaveLength(USERNAME_MAX_LENGTH);
  });
});

describe("sanitizeAccountName", () => {
  it("turns separators into single spaces", () => {
    expect(sanitizeAccountName("joao.silva+tag")).toBe("joao silva tag");
  });

  it("returns null when nothing valid remains", () => {
    expect(sanitizeAccountName("...")).toBeNull();
  });
});
