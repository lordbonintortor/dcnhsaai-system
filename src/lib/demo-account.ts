import { type AlumniProfile as CurrentAlumniProfile, type ProfileDetails as CurrentProfileDetails, normalizeProfile as normalizeCurrentProfile, profileError } from "./alumni-profile";
import { sampleDirectoryEntries, toDirectoryEntry, type DirectoryEntry } from "./alumni-directory";
import { toMemberDirectoryProfile, type MemberDirectoryProfile } from "./member-directory";
import { isProfilePhoto } from "./profile-photo";
import { isApplicationReview, isVerificationStatus, type ApplicationReview, type OfficerDecision } from "./application-review";

// Historical demo types are isolated from the production username-only account model.
type ProfileDetails = CurrentProfileDetails & { email: string };
type AlumniProfile = CurrentAlumniProfile & { email: string };
const normalizeProfile = (details: ProfileDetails): ProfileDetails => ({ ...normalizeCurrentProfile(details), email: details.email.trim().toLowerCase() });

// Frontend demonstration only. These browser records are not production authentication or evidence of graduation.
export const DEMO_EMAIL = "alumni.demo@example.com";
export const DEMO_PASSWORD = "CityHigh2026!";
export const PENDING_DEMO_EMAIL = "pending.demo@example.com";
export const PENDING_DEMO_PASSWORD = "Pending2026!";
const PENDING_SAMPLE_KEY = "dcnhsaai.demo.pending-profile.v1";
const ACCOUNTS_KEY = "dcnhsaai.demo.accounts.v1";
const SESSION_KEY = "dcnhsaai.demo.session.v1";
const SAMPLE_KEY = "dcnhsaai.demo.sample-profile.v1";
const OFFICER_SESSION_KEY = "dcnhsaai.demo.officer-session.v1";
export const DEMO_OFFICER_EMAIL = "officer.demo@example.com";
export const DEMO_OFFICER_PASSWORD = "Review2026!";
const DEMO_OFFICER = { id: "DEMO-OFFICER-001", name: "Demo reviewing officer" };
export const DEMO_CHANGE_EVENT = "dcnhsaai-demo-change";

export const sampleProfile: AlumniProfile = {
  id: "DEMO-2008-001", firstName: "Alex", middleName: "", lastName: "Santos", suffix: "", country: "Philippines",
  email: DEMO_EMAIL, batchYear: "2008", section: "Rizal", adviser: "",
  mobile: "", professions: ["Information Technology"], otherProfession: "",
  employers: "Sample Technology Studio", verification: "verified", createdAt: "2026-09-09T00:00:00.000Z",
};

export const pendingSampleProfile: AlumniProfile = {
  id: "DEMO-PENDING-2015-001", firstName: "Jamie", middleName: "", lastName: "Reyes", suffix: "", country: "Philippines",
  email: PENDING_DEMO_EMAIL, batchYear: "2015", section: "Sampaguita", adviser: "",
  mobile: "", professions: ["Engineering"], otherProfession: "",
  employers: "Fictional Engineering Studio", verification: "pending", createdAt: "2026-10-15T00:00:00.000Z",
};

type StoredAccount = { profile: AlumniProfile; salt: string; verifier: string };

function isProfile(value: unknown): value is AlumniProfile {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return ["id", "createdAt", "batchYear", "section", "adviser", "firstName", "middleName", "lastName", "email", "mobile", "otherProfession", "employers"].every(key => typeof record[key] === "string")
    && Array.isArray(record.professions) && record.professions.every(item => typeof item === "string")
    && (record.photoDataUrl === undefined || isProfilePhoto(record.photoDataUrl))
    && isVerificationStatus(record.verification)
    && (record.updatedAt === undefined || typeof record.updatedAt === "string")
    && (record.reviewHistory === undefined || (Array.isArray(record.reviewHistory) && record.reviewHistory.every(isApplicationReview)));
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
  return normalized === DEMO_EMAIL || normalized === PENDING_DEMO_EMAIL || readAccounts().some(account => account.profile.email === normalized);
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
  if (normalized === PENDING_DEMO_EMAIL && password === PENDING_DEMO_PASSWORD) {
    startSession(pendingSampleProfile.id, remember);
    return;
  }
  const account = readAccounts().find(item => item.profile.email === normalized);
  if (!account || await passwordVerifier(password, account.salt) !== account.verifier) throw new Error("The email or password does not match a demo account on this browser.");
  startSession(account.profile.id, remember);
}

function readSampleProfile(fallback: AlumniProfile = sampleProfile, key = SAMPLE_KEY): AlumniProfile {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(key) ?? "null");
    if (isProfile(saved) && saved.id === fallback.id) return saved;
  } catch { /* Use the original sample when a saved preview is invalid. */ }
  return fallback;
}

export function demoDirectory(): DirectoryEntry[] {
  return [
    ...sampleDirectoryEntries,
    toDirectoryEntry(readSampleProfile()),
    toDirectoryEntry(readSampleProfile(pendingSampleProfile, PENDING_SAMPLE_KEY)),
    ...readAccounts().map(account => toDirectoryEntry(account.profile)),
  ].sort((a, b) => Number(b.batchYear) - Number(a.batchYear) || a.name.localeCompare(b.name));
}

export function currentDemoProfile(): AlumniProfile | null {
  const id = sessionStorage.getItem(SESSION_KEY) ?? localStorage.getItem(SESSION_KEY);
  if (id === sampleProfile.id) return readSampleProfile();
  if (id === pendingSampleProfile.id) return readSampleProfile(pendingSampleProfile, PENDING_SAMPLE_KEY);
  return readAccounts().find(account => account.profile.id === id)?.profile ?? null;
}

export function demoMemberProfile(id: string): MemberDirectoryProfile | null {
  // This browser-demo guard must become server authorization with the real database.
  if (!currentDemoProfile()) throw new Error("Sign in to your alumni account to view member profiles.");
  const profile = id === sampleProfile.id ? readSampleProfile() : id === pendingSampleProfile.id ? readSampleProfile(pendingSampleProfile, PENDING_SAMPLE_KEY) : readAccounts().find(account => account.profile.id === id)?.profile;
  if (profile) return toMemberDirectoryProfile(profile);
  const entry = sampleDirectoryEntries.find(item => item.id === id);
  // Name-only presentation samples have no additional personal information.
  return entry ? { ...entry, firstName: entry.name, lastName: "", country: "", email: "", photoDataUrl: "", profession: "" } : null;
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
  let updated: AlumniProfile = { ...current, ...normalized, updatedAt: new Date().toISOString() };
  const identityChanged = (["firstName", "middleName", "lastName", "batchYear"] as const).some(key => current[key] !== normalized[key]);
  if (identityChanged && current.verification === "verified") {
    updated = withReview(updated, {
      status: "pending", actor: "applicant", reviewer: `${updated.firstName} ${updated.lastName}`,
      message: "Name or batch year changed. The application has returned to officer review.",
    });
  }
  saveProfile(updated);
  notify();
}

function saveProfile(profile: AlumniProfile) {
  if (profile.id === sampleProfile.id || profile.id === pendingSampleProfile.id) {
    const key = profile.id === sampleProfile.id ? SAMPLE_KEY : PENDING_SAMPLE_KEY;
    try { localStorage.setItem(key, JSON.stringify(profile)); }
    catch { throw new Error("Your browser could not save the demo profile. Check that browser storage is available and try again."); }
  } else {
    const accounts = readAccounts();
    if (!accounts.some(account => account.profile.id === profile.id)) throw new Error("This demo application is no longer available.");
    saveAccounts(accounts.map(account => account.profile.id === profile.id ? { ...account, profile } : account));
  }
}

function withReview(profile: AlumniProfile, entry: Omit<ApplicationReview, "id" | "reviewedAt">): AlumniProfile {
  const reviewedAt = new Date().toISOString();
  return {
    ...profile, verification: entry.status, updatedAt: reviewedAt,
    reviewHistory: [...(profile.reviewHistory ?? []), { ...entry, id: crypto.randomUUID(), reviewedAt }],
  };
}

// A separate browser-demo session keeps the officer screens out of the alumni flow.
// These client-side checks must be replaced with server authorization in production.
export function currentDemoOfficer() {
  return sessionStorage.getItem(OFFICER_SESSION_KEY) === DEMO_OFFICER.id ? DEMO_OFFICER : null;
}

export function signInDemoOfficer(email: string, password: string) {
  if (email.trim().toLowerCase() !== DEMO_OFFICER_EMAIL || password !== DEMO_OFFICER_PASSWORD) throw new Error("The email or password does not match the demo officer account.");
  try { sessionStorage.setItem(OFFICER_SESSION_KEY, DEMO_OFFICER.id); }
  catch { throw new Error("Your browser could not start the officer demo. Allow browser storage and try again."); }
  notify();
}

export function signOutDemoOfficer() {
  sessionStorage.removeItem(OFFICER_SESSION_KEY);
  notify();
}

function requireDemoOfficer() {
  const officer = currentDemoOfficer();
  if (!officer) throw new Error("Sign in to the officer demo to review applications.");
  return officer;
}

export function demoApplications(): AlumniProfile[] {
  requireDemoOfficer();
  // Never return the stored password verifiers to the review components.
  return [readSampleProfile(), readSampleProfile(pendingSampleProfile, PENDING_SAMPLE_KEY), ...readAccounts().map(account => account.profile)]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function reviewDemoApplication(expected: AlumniProfile, status: OfficerDecision, message = "") {
  const officer = requireDemoOfficer();
  if (!["verified", "needs_information", "rejected"].includes(status)) throw new Error("Choose a valid review decision.");
  const applicantMessage = status === "verified" ? "" : message.trim();
  if (status !== "verified" && (!applicantMessage || applicantMessage.length > 1000)) throw new Error("Enter a message to the applicant using 1–1,000 characters.");
  const current = demoApplications().find(profile => profile.id === expected.id);
  if (!current) throw new Error("This demo application is no longer available.");
  if (JSON.stringify(current) !== JSON.stringify(expected)) throw new Error("This application changed. Reopen it and check the latest details before saving your decision.");
  if (current.verification === status) throw new Error("This application already has that status.");
  const updated = withReview(current, {
    status, actor: "officer", reviewer: officer.name, message: applicantMessage,
  });
  saveProfile(updated);
  notify();
}

export function resubmitDemoApplication() {
  const current = currentDemoProfile();
  if (!current) throw new Error("Sign in again to resubmit your application.");
  if (current.verification !== "needs_information") throw new Error("Only applications needing information can be resubmitted.");
  const error = profileError(current);
  if (error) throw new Error(error);
  saveProfile(withReview(current, {
    status: "pending", actor: "applicant", reviewer: `${current.firstName} ${current.lastName}`,
    message: "The applicant resubmitted their saved details for officer review.",
  }));
  notify();
}
