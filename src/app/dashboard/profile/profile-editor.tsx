"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { normalizeProfile, type ProfileDetails } from "@/lib/alumni-profile";
import { updateProfile } from "@/lib/account-api";
import { toDirectoryEntry } from "@/lib/alumni-directory";
import AlumniFields from "@/app/register/alumni-fields";
import ProfilePhotoField from "@/app/profile-photo-field";
import { useAlumniProfile } from "../dashboard-shell";
import styles from "../dashboard.module.css";

export default function ProfileEditor() {
  const profile = useAlumniProfile();
  const listing = toDirectoryEntry(profile);
  const [details, setDetails] = useState<ProfileDetails>(() => normalizeProfile(profile));
  const [original, setOriginal] = useState(profile);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (photoBusy || busy) return;
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      const updated = await updateProfile(details, original);
      setDetails(updated);
      setOriginal(updated);
      setSaved(true);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save your profile. Please try again."); }
    finally { setBusy(false); }
  }

  return (
    <section className={`${styles.card} ${styles.profileEditor}`}>
      <p className={styles.eyebrow}>Your alumni information</p><h1>My profile</h1><p className={styles.intro}>Keep your alumni details current.</p>
      <section className={styles.directoryPreview} aria-label="Your directory listing">
        <div><h2>Your directory listing</h2><p>After approval, your name and batch year appear in the public alumni directory. Approved alumni can also see your profile photo and profession.</p></div>
        <dl><div><dt>Name</dt><dd>{listing.name}</dd></div><div><dt>Batch year</dt><dd>{listing.batchYear}</dd></div></dl>
        <Link href={`/dashboard/directory/${encodeURIComponent(profile.id)}`}>Preview my member profile <span aria-hidden="true">↗</span></Link>
      </section>
      <form className="form-wrap" onSubmit={submit}>
        {profile.username && <p className="demo-note">Your sign-in username: <strong>{profile.username}</strong>.</p>}
        {profile.verification === "verified" && <p className="demo-note">Changing your name or batch year returns your application to pending review.</p>}
        <fieldset disabled={busy}>
        <ProfilePhotoField profile={details} onChange={photoDataUrl => { setDetails(current => ({ ...current, photoDataUrl })); setSaved(false); setError(""); }} onBusyChange={setPhotoBusy} />
        <AlumniFields value={details} onChange={value => { setDetails(value); setSaved(false); setError(""); }} />
        </fieldset>
        {error && <p className="form-error" role="alert">{error}</p>}
        {saved && <p className="form-success" role="status">Your profile changes have been saved.</p>}
        {saved && profile.verification === "needs_information" && <p className="demo-note">Your changes are ready. <Link href="/dashboard">Return to your dashboard to resubmit for review.</Link></p>}
        <div className="form-actions"><button type="submit" className="button" disabled={photoBusy || busy}>{photoBusy ? "Preparing photo…" : busy ? "Saving…" : "Save changes"} <span aria-hidden="true">✓</span></button><Link className="button button-outline" href="/dashboard">Back to dashboard</Link></div>
      </form>
    </section>
  );
}
