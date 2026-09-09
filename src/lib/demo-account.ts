import { type AlumniProfile, type ProfileDetails, normalizeProfile, profileError } from "./alumni-profile";
import { sampleDirectoryEntries, toDirectoryEntry, type DirectoryEntry } from "./alumni-directory";

// Frontend demonstration only. These browser records are not authentication or officer verification.
export const DEMO_EMAIL = "alumni.demo@example.com";
export const DEMO_PASSWORD = "CityHigh2026!";
const ACCOUNTS_KEY = "dcnhsaai.demo.accounts.v1";
const SESSION_KEY = "dcnhsaai.demo.session.v1";
const SAMPLE_KEY = "dcnhsaai.demo.sample-profile.v1";
export const DEMO_CHANGE_EVENT = "dcnhsaai-demo-change";

export const sampleProfile: AlumniProfile = {
  id: "DEMO-2008-001", firstName: "Alex", middleName: "", lastName: "Santos",
  email: DEMO_EMAIL, batchYear: "2008", section: "Rizal", adviser: "",
  mobile: "", professions: ["Information Technology"], otherProfession: "",
  employers: "Sample Technology Studio", verification: "verified", createdAt: "2026-09-09T00:00:00.000Z",
};

type StoredAccount = { profile: AlumniProfile; salt: string; verifier: string };

function isProfile(value: unknown): value is AlumniProfile {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return ["id", "createdAt", "batchYear", "section", "adviser", "firstName", "middleName", "lastName", "email", "mobile", "otherProfession", "employers"].every(key => typeof record[key] === "string")
    && Array.isArray(record.professions) && record.professions.every(item => typeof item === "string")
    && (record.verification === "pending" || record.verification === "verified");
}

function readAccounts(): StoredAccount[] {
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((account): account is StoredAccount => account && isProfile(account.profile) && typeof account.salt === "string" && typeof account.verifier === "string");
  } catch { return []; }
}

function notify() { window.dispatchEvent(new Event(DEMO_CHANGE_EVENT)); }

function saveAccounts(accounts: StoredAccount[]) {
  try { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts)); }
  catch { throw new Error("Your browser could not save the demo account. Check that browser storage is available and try again."); }
}

function startSession(id: string, remember: boolean) {
  try {
    if (remember) {
      localStorage.setItem(SESSION_KEY, id);
      sessionStorage.removeItem(SESSION_KEY);
    } else {
      sessionStorage.setItem(SESSION_KEY, id);
      localStorage.removeItem(SESSION_KEY);
    }
    notify();
  } catch { throw new Error("Your browser could not start the demo session. Allow browser storage and try signing in again."); }
}

async function passwordVerifier(password: string, salt: string) {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bytes = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: new TextEncoder().encode(salt), iterations: 100000, hash: "SHA-256" }, material, 256);
  return Array.from(new Uint8Array(bytes), value => value.toString(16).padStart(2, "0")).join("");
}

export function emailExists(email: string) {
  const normalized = email.trim().toLowerCase();
  return normalized === DEMO_EMAIL || readAccounts().some(account => account.profile.email === normalized);
}

export async function registerDemoAccount(details: ProfileDetails, password: string): Promise<AlumniProfile> {
  const normalized = normalizeProfile(details);
  const error = profileError(normalized);
  if (error) throw new Error(error);
  if (password.length < 8) throw new Error("Use a password with at least 8 characters.");
  if (emailExists(normalized.email)) throw new Error("This email already has a demo account on this browser. Sign in or use another email.");
  const salt = crypto.randomUUID();
  const verifier = await passwordVerifier(password, salt);
  // Re-read after hashing so another registration does not overwrite a newly saved account.
  const accounts = readAccounts();
  if (accounts.some(account => account.profile.email === normalized.email)) throw new Error("This email already has a demo account. Please sign in.");
  const profile: AlumniProfile = { ...normalized, id: crypto.randomUUID(), createdAt: new Date().toISOString(), verification: "pending" };
  saveAccounts([...accounts, { profile, salt, verifier }]);
  notify();
  return profile;
}

export async function signInDemo(email: string, password: string, remember = false) {
  const normalized = email.trim().toLowerCase();
  if (normalized === DEMO_EMAIL && password === DEMO_PASSWORD) {
    startSession(sampleProfile.id, remember);
    return;
  }
  const account = readAccounts().find(item => item.profile.email === normalized);
  if (!account || await passwordVerifier(password, account.salt) !== account.verifier) throw new Error("The email or password does not match a demo account on this browser.");
  startSession(account.profile.id, remember);
}

function readSampleProfile(): AlumniProfile {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(SAMPLE_KEY) ?? "null");
    if (isProfile(saved) && saved.id === sampleProfile.id) return saved;
  } catch { /* Use the original sample when a saved preview is invalid. */ }
  return sampleProfile;
}

export function demoDirectory(): DirectoryEntry[] {
  return [
    ...sampleDirectoryEntries,
    toDirectoryEntry(readSampleProfile()),
    ...readAccounts().map(account => toDirectoryEntry(account.profile)),
  ].sort((a, b) => Number(b.batchYear) - Number(a.batchYear) || a.name.localeCompare(b.name));
}

export function currentDemoProfile(): AlumniProfile | null {
  const id = sessionStorage.getItem(SESSION_KEY) ?? localStorage.getItem(SESSION_KEY);
  if (id === sampleProfile.id) return readSampleProfile();
  return readAccounts().find(account => account.profile.id === id)?.profile ?? null;
}

export function signOutDemo() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
  notify();
}

export function updateDemoProfile(details: ProfileDetails) {
  const current = currentDemoProfile();
  if (!current) throw new Error("Please sign in again to update your profile.");
  const normalized = normalizeProfile({ ...details, email: current.email });
  const error = profileError(normalized);
  if (error) throw new Error(error);
  const updated = { ...current, ...normalized };
  if (current.id === sampleProfile.id) localStorage.setItem(SAMPLE_KEY, JSON.stringify(updated));
  else saveAccounts(readAccounts().map(account => account.profile.id === current.id ? { ...account, profile: updated } : account));
  notify();
}
