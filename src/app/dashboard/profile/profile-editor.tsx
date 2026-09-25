"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { normalizeProfile, type ProfileDetails } from "@/lib/alumni-profile";
import { updateDemoProfile } from "@/lib/demo-account";
import { toDirectoryEntry } from "@/lib/alumni-directory";
import AlumniFields from "@/app/register/alumni-fields";
import ProfilePhotoField from "@/app/profile-photo-field";
import { useAlumniProfile } from "../dashboard-shell";
import styles from "../dashboard.module.css";

export default function ProfileEditor() {
  const profile = useAlumniProfile();
  const listing = toDirectoryEntry(profile);
  const [details, setDetails] = useState<ProfileDetails>(profile);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (photoBusy) return;
    setError("");
    setSaved(false);
    try {
      updateDemoProfile(details);
      setDetails(normalizeProfile(details));
      setSaved(true);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save your profile. Please try again."); }
  }

  return (
    <section className={`${styles.card} ${styles.profileEditor}`}>
      <p className={styles.eyebrow}>Your alumni information</p><h1>My profile</h1><p className={styles.intro}>Keep your details current. Changes are saved to this demo account on this browser.</p>
      <section className={styles.directoryPreview} aria-label="Your directory listing">
        <div><h2>Your directory listing</h2><p>Your name and batch year appear in the public alumni directory. Signed-in alumni can also see your profile photo and profession.</p></div>
        <dl><div><dt>Name</dt><dd>{listing.name}</dd></div><div><dt>Batch year</dt><dd>{listing.batchYear}</dd></div></dl>
        <Link href={`/dashboard/directory/${encodeURIComponent(profile.id)}`}>Preview my member profile <span aria-hidden="true">↗</span></Link>
      </section>
      <form className="form-wrap" onSubmit={submit}>
        {profile.verification === "verified" && <p className="demo-note">Changing your name or batch year returns this demo application to pending review.</p>}
        <ProfilePhotoField profile={details} onChange={photoDataUrl => { setDetails(current => ({ ...current, photoDataUrl })); setSaved(false); setError(""); }} onBusyChange={setPhotoBusy} />
        <AlumniFields value={details} emailReadOnly onChange={value => { setDetails(value); setSaved(false); setError(""); }} />
        {error && <p className="form-error" role="alert">{error}</p>}
        {saved && <p className="form-success" role="status">Your profile changes have been saved.</p>}
        {saved && profile.verification === "needs_information" && <p className="demo-note">Your changes are ready. <Link href="/dashboard">Return to your dashboard to resubmit for review.</Link></p>}
        <div className="form-actions"><button type="submit" className="button" disabled={photoBusy}>{photoBusy ? "Preparing photo…" : "Save changes"} <span aria-hidden="true">✓</span></button><Link className="button button-outline" href="/dashboard">Back to dashboard</Link></div>
      </form>
    </section>
  );
}
