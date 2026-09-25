"use client";

import Link from "next/link";
import { useCallback, useMemo, useSyncExternalStore } from "react";
import ProfileAvatar from "@/app/profile-avatar";
import { demoMemberProfile } from "@/lib/demo-account";
import type { MemberDirectoryProfile } from "@/lib/member-directory";
import { subscribeToDemoChanges } from "@/lib/use-demo-account";
import { useAlumniProfile } from "../dashboard-shell";
import styles from "./member-profile.module.css";

const serverSnapshot = () => undefined;

export default function MemberProfile({ id }: { id: string }) {
  const viewer = useAlumniProfile();
  const snapshot = useCallback(() => {
    try { return JSON.stringify(demoMemberProfile(id)); }
    catch { return "unavailable"; }
  }, [id]);
  const stored = useSyncExternalStore<string | undefined>(subscribeToDemoChanges, snapshot, serverSnapshot);
  const profile = useMemo<MemberDirectoryProfile | null>(() => stored && stored !== "unavailable" ? JSON.parse(stored) : null, [stored]);

  return (
    <section className={styles.profile}>
      <Link className={styles.back} href="/dashboard/directory">← Back to alumni directory</Link>
      {stored === undefined ? <p role="status">Loading alumni profile…</p> : !profile ? (
        <div className={styles.empty}>
          <h1>{stored === "unavailable" ? "Profile unavailable" : "Profile not found"}</h1>
          <p>{stored === "unavailable" ? "We could not load this profile. Check that browser storage is available, then reload the page." : "This profile is no longer available in this browser’s directory. Return to the directory to find another alumnus."}</p>
        </div>
      ) : (
        <>
          <div className={styles.identity}>
            <ProfileAvatar profile={profile} size={88} />
            <div><p className={styles.eyebrow}>Alumni member profile</p><h1>{profile.name}</h1><p className={styles.batch}>Batch {profile.batchYear}</p></div>
          </div>
          <dl className={styles.details}>
            <div><dt>Batch year</dt><dd>{profile.batchYear}</dd></div>
            <div><dt>Profession / occupation</dt><dd>{profile.profession || "Not provided"}</dd></div>
          </dl>
          <p className={styles.note}>This profile is available to signed-in alumni. The public directory displays only names and batch years.</p>
          {viewer.id === profile.id && <Link className={`button button-outline ${styles.edit}`} href="/dashboard/profile">Edit my profile</Link>}
        </>
      )}
    </section>
  );
}
