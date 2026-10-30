"use client";

import Link from "next/link";
import ProfileAvatar from "@/app/profile-avatar";
import type { MemberDirectoryProfile } from "@/lib/member-directory";
import { useResource } from "@/lib/use-account";
import { useAlumniProfile } from "../dashboard-shell";
import styles from "./member-profile.module.css";

export default function MemberProfile({ id }: { id: string }) {
  const viewer = useAlumniProfile();
  const { data, ready, error } = useResource<{ profile: MemberDirectoryProfile | null }>(`/api/directory/${encodeURIComponent(id)}`);
  const profile = data?.profile;

  return (
    <section className={styles.profile}>
      <Link className={styles.back} href="/dashboard/directory">← Back to alumni directory</Link>
      {!ready ? <p role="status">Loading alumni profile…</p> : !profile ? (
        <div className={styles.empty}>
          <h1>{error ? "Profile unavailable" : "Profile not found"}</h1>
          <p>{error || "This profile is no longer available. Return to the directory to find another alumnus."}</p>
        </div>
      ) : (
        <>
          <div className={styles.identity}>
            <ProfileAvatar profile={profile} size={88} />
            <div><p className={styles.eyebrow}>Alumni member profile</p><h1>{profile.name}</h1><p className={styles.batch}>Batch {profile.batchYear}</p></div>
          </div>
          <dl className={styles.details}>
            <div><dt>Batch year</dt><dd>{profile.batchYear}</dd></div>
            <div><dt>Email address</dt><dd>{profile.email || "Not provided"}</dd></div>
            <div><dt>Country of current residence</dt><dd>{profile.country || "Not provided"}</dd></div>
            <div><dt>Profession / occupation</dt><dd>{profile.profession || "Not provided"}</dd></div>
          </dl>
          <p className={styles.note}>Member profiles are available to approved alumni. Email and country of current residence are shown here instead of in the directory list.</p>
          {viewer.id === profile.id && <Link className={`button button-outline ${styles.edit}`} href="/dashboard/profile">Edit my profile</Link>}
        </>
      )}
    </section>
  );
}
