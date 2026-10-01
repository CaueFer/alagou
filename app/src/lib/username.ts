export const USERNAME_MAX_LENGTH = 40;

const DISALLOWED = /[^\p{L}\p{N} _-]/gu;

// Typed input: only drop what the API rejects, never insert characters the user did not type.
export function filterUsernameInput(value: string): string {
  return value.replace(DISALLOWED, "").slice(0, USERNAME_MAX_LENGTH);
}

// Account names come from e-mail or Google, where "." and "+" stand in for word boundaries.
export function sanitizeAccountName(value: string): string | null {
  const cleaned = value
    .replace(DISALLOWED, " ")
    .replace(/\s+/g, " ")
    .slice(0, USERNAME_MAX_LENGTH)
    .trim();
  return cleaned.length > 0 ? cleaned : null;
}
