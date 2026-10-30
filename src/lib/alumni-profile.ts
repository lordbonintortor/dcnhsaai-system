import { isProfilePhoto } from "./profile-photo";
import type { ApplicationReview, VerificationStatus } from "./application-review";

export const professions = ["Legal", "Medical", "Engineering", "Finance", "Information Technology", "Entrepreneur", "Retired", "Other"] as const;

export type ProfileDetails = {
  batchYear: string;
  section: string;
  adviser: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  country: string;
  email: string;
  mobile: string;
  professions: string[];
  otherProfession: string;
  employers: string;
  photoDataUrl?: string;
};

export type AlumniProfile = ProfileDetails & {
  username?: string | null;
  id: string;
  createdAt: string;
  verification: VerificationStatus;
  updatedAt?: string;
  reviewHistory?: ApplicationReview[];
  version?: number;
};

export const emptyProfile: ProfileDetails = {
  batchYear: "", section: "", adviser: "", firstName: "", middleName: "", lastName: "", suffix: "", country: "", email: "",
  mobile: "", professions: [], otherProfession: "", employers: "", photoDataUrl: "",
};

export function normalizeProfile(profile: ProfileDetails): ProfileDetails {
  return {
    // Only editable details belong here; a stale editor must not overwrite a review.
    batchYear: profile.batchYear.trim(),
    section: profile.section.trim(),
    adviser: profile.adviser.trim(),
    firstName: profile.firstName.trim(),
    middleName: profile.middleName.trim(),
    lastName: profile.lastName.trim(),
    suffix: profile.suffix?.trim() ?? "",
    country: profile.country?.trim() ?? "",
    email: profile.email?.trim().toLowerCase() ?? "",
    mobile: profile.mobile?.trim() ?? "",
    employers: profile.employers.trim(),
    photoDataUrl: profile.photoDataUrl ?? "",
    professions: [...new Set(profile.professions)],
    otherProfession: profile.professions.includes("Other") ? profile.otherProfession.trim() : "",
  };
}

export function profileError(profile: ProfileDetails): string | null {
  if (profile.photoDataUrl !== undefined && !isProfilePhoto(profile.photoDataUrl)) return "Please remove the profile photo and choose another JPG, PNG, or WebP image.";
  const year = Number(profile.batchYear);
  if (!Number.isInteger(year) || year < 1922 || year > new Date().getFullYear()) return "Enter a valid batch year from 1922 to the current year.";
  if (!profile.firstName.trim() || !profile.lastName.trim()) return "Enter your first and last name.";
  if (!profile.country.trim()) return "Enter your current country of residence.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) return "Enter a valid email address.";
  if (!profile.professions.length || profile.professions.some(value => !professions.includes(value as typeof professions[number]))) return "Select at least one profession or occupation.";
  if (profile.professions.includes("Other") && !profile.otherProfession.trim()) return "Specify your other profession or occupation.";
  return null;
}

export function professionLabel(profile: ProfileDetails) {
  return profile.professions.map(value => value === "Other" ? profile.otherProfession : value).join(", ");
}
