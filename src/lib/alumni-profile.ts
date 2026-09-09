export const professions = ["Legal", "Medical", "Engineering", "Finance", "Information Technology", "Entrepreneur", "Retired", "Other"] as const;

export type ProfileDetails = {
  batchYear: string;
  section: string;
  adviser: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  mobile: string;
  professions: string[];
  otherProfession: string;
  employers: string;
};

export type AlumniProfile = ProfileDetails & {
  id: string;
  createdAt: string;
  verification: "pending" | "verified";
};

export const emptyProfile: ProfileDetails = {
  batchYear: "", section: "", adviser: "", firstName: "", middleName: "", lastName: "",
  email: "", mobile: "", professions: [], otherProfession: "", employers: "",
};

export function normalizeProfile(profile: ProfileDetails): ProfileDetails {
  return {
    ...Object.fromEntries(Object.entries(profile).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value])),
    email: profile.email.trim().toLowerCase(),
    professions: [...new Set(profile.professions)],
    otherProfession: profile.professions.includes("Other") ? profile.otherProfession.trim() : "",
  } as ProfileDetails;
}

export function profileError(profile: ProfileDetails): string | null {
  const year = Number(profile.batchYear);
  if (!Number.isInteger(year) || year < 1922 || year > new Date().getFullYear()) return "Enter a valid batch year from 1922 to the current year.";
  if (!profile.firstName.trim() || !profile.lastName.trim()) return "Enter your first and last name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) return "Enter a valid email address.";
  if (!profile.professions.length || profile.professions.some(value => !professions.includes(value as typeof professions[number]))) return "Select at least one profession or occupation.";
  if (profile.professions.includes("Other") && !profile.otherProfession.trim()) return "Specify your other profession or occupation.";
  return null;
}

export function professionLabel(profile: ProfileDetails) {
  return profile.professions.map(value => value === "Other" ? profile.otherProfession : value).join(", ");
}
