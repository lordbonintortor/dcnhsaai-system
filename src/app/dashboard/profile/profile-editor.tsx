"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { normalizeProfile, type ProfileDetails } from "@/lib/alumni-profile";
import { updateDemoProfile } from "@/lib/demo-account";
import { toDirectoryEntry } from "@/lib/alumni-directory";
import AlumniFields from "@/app/register/alumni-fields";
import { useAlumniProfile } from "../dashboard-shell";
import styles from "../dashboard.module.css";

export default function ProfileEditor() {
  const profile = useAlumniProfile();
  const listing = toDirectoryEntry(profile);
  const [details, setDetails] = useState<ProfileDetails>(profile);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
        <div><h2>Your directory listing</h2><p>Other alumni see your name and batch year in the directory.</p></div>
        <dl><div><dt>Name</dt><dd>{listing.name}</dd></div><div><dt>Batch year</dt><dd>{listing.batchYear}</dd></div></dl>
        <Link href="/dashboard/directory">Open alumni directory <span aria-hidden="true">↗</span></Link>
      </section>
      <form className="form-wrap" onSubmit={submit}>
        <AlumniFields value={details} emailReadOnly onChange={value => { setDetails(value); setSaved(false); setError(""); }} />
        {error && <p className="form-error" role="alert">{error}</p>}
        {saved && <p className="form-success" role="status">Your profile changes have been saved.</p>}
        <div className="form-actions"><button type="submit" className="button">Save changes <span aria-hidden="true">✓</span></button><Link className="button button-outline" href="/dashboard">Back to dashboard</Link></div>
      </form>
    </section>
  );
}
