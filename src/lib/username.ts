export const USERNAME_PATTERN = "[a-zA-Z][a-zA-Z0-9_]{2,29}";
export const USERNAME_HELP = "Use 3–30 letters, numbers, or underscores, starting with a letter. Usernames are not case-sensitive.";

export function normalizedUsername(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const username = value.trim().toLowerCase();
  return /^[a-z][a-z0-9_]{2,29}$/.test(username) ? username : null;
}

// Supabase password authentication needs an email-shaped identifier. This reserved,
// non-deliverable domain is an internal identifier, never a contact address.
export function usernameAuthEmail(username: string): string {
  const normalized = normalizedUsername(username);
  if (!normalized) throw new Error("Invalid username");
  return `${normalized}@alumni.dcnhsaai.invalid`;
}

