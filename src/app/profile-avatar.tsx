import Image from "next/image";
import type { ProfileDetails } from "@/lib/alumni-profile";
import { isProfilePhoto } from "@/lib/profile-photo";
import styles from "./profile-photo.module.css";

export default function ProfileAvatar({ profile, size = 40 }: {
  profile: Pick<ProfileDetails, "firstName" | "lastName" | "photoDataUrl">;
  size?: number;
}) {
  const name = `${profile.firstName} ${profile.lastName}`.trim();
  const photo = profile.photoDataUrl;
  const dimensions = { width: size, height: size, fontSize: size * 0.35 };
  if (photo && (photo.startsWith("https://") || photo.startsWith("/api/") || isProfilePhoto(photo))) {
    return <Image className={styles.avatar} style={dimensions} src={photo} width={size} height={size} unoptimized alt={name ? `Profile photo of ${name}` : "Profile photo preview"} />;
  }
  const initials = `${profile.firstName.trim()[0] ?? ""}${profile.lastName.trim()[0] ?? ""}`.toUpperCase();
  return (
    <span className={styles.avatar} style={dimensions} role="img" aria-label={name ? `Avatar for ${name}` : "No profile photo selected"}>
      {initials || <svg width="48%" height="48%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></svg>}
    </span>
  );
}
