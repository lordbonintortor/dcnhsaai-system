"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import type { ProfileDetails } from "@/lib/alumni-profile";
import { prepareProfilePhoto } from "@/lib/profile-photo";
import ProfileAvatar from "./profile-avatar";
import styles from "./profile-photo.module.css";

export default function ProfilePhotoField({ profile, onChange, onBusyChange }: {
  profile: Pick<ProfileDetails, "firstName" | "lastName" | "photoDataUrl">;
  onChange: (photo: string) => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const active = useRef(true);
  const processing = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    active.current = true;
    return () => { active.current = false; };
  }, []);

  async function selectPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || processing.current) return;
    processing.current = true;
    setError("");
    setStatus("");
    setBusy(true);
    onBusyChange(true);
    try {
      const photo = await prepareProfilePhoto(file);
      if (active.current) {
        onChange(photo);
        setStatus("Photo ready.");
      }
    } catch (cause) {
      if (active.current) setError(cause instanceof Error ? cause.message : "Unable to open this photo. Please try another file.");
    } finally {
      processing.current = false;
      if (active.current) {
        setBusy(false);
        onBusyChange(false);
      }
    }
  }

  function removePhoto() {
    onChange("");
    setError("");
    setStatus("Photo removed.");
  }

  return (
    <fieldset className={styles.field}>
      <legend>Profile photo <span className={styles.optional}>(optional)</span></legend>
      <div className={styles.upload} aria-busy={busy}>
        <ProfileAvatar profile={profile} size={96} />
        <div className={styles.controls}>
          <p id={`${id}-help`} className={styles.help}>Add a photo for your alumni profile. JPG, PNG, or WebP, up to 5 MB. Your photo will be cropped to fit the circle.</p>
          <div className={styles.actions}>
            <button type="button" className="button button-outline" disabled={busy} onClick={() => input.current?.click()} aria-describedby={`${id}-help`}>{busy ? "Preparing photo…" : profile.photoDataUrl ? "Change photo" : "Upload photo"}</button>
            {profile.photoDataUrl && <button type="button" className={styles.remove} disabled={busy} onClick={removePhoto}>Remove photo</button>}
          </div>
          <input ref={input} type="file" name="profilePhoto" accept="image/jpeg,image/png,image/webp" aria-label="Profile photo" aria-describedby={`${id}-help`} onChange={selectPhoto} disabled={busy} hidden />
          <p className={styles.status} role="status">{busy ? "Preparing your photo…" : status}</p>
          {error && <p className="form-error" role="alert">{error}</p>}
        </div>
      </div>
    </fieldset>
  );
}
