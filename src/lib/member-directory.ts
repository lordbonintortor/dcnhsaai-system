import { professionLabel, type AlumniProfile } from "./alumni-profile";
import { toDirectoryEntry, type DirectoryEntry } from "./alumni-directory";

// An explicit member-facing projection; never pass whole account records to this view.
export type MemberDirectoryProfile = DirectoryEntry & {
  firstName: string;
  lastName: string;
  suffix?: string;
  country: string;
  email: string;
  photoDataUrl: string;
  profession: string;
};

export function toMemberDirectoryProfile(profile: AlumniProfile): MemberDirectoryProfile {
  return {
    ...toDirectoryEntry(profile),
    firstName: profile.firstName,
    lastName: profile.lastName,
    suffix: profile.suffix,
    country: profile.country,
    email: profile.email,
    photoDataUrl: profile.photoDataUrl ?? "",
    profession: professionLabel(profile),
  };
}
