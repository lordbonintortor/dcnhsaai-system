"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import ProfileAvatar from "@/app/profile-avatar";
import { professionLabel, type AlumniProfile } from "@/lib/alumni-profile";
import { reviewDate, verificationLabels, verificationReferences, type VerificationReference, type VerificationStatus } from "@/lib/application-review";
import { reviewDemoApplication } from "@/lib/demo-account";
import styles from "./officer.module.css";

export default function ApplicationDetails({ profile, onSaved }: { profile: AlumniProfile; onSaved: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [status, setStatus] = useState<VerificationStatus | "">("");
  const [reference, setReference] = useState<VerificationReference | "">("");
  const [referenceNote, setReferenceNote] = useState("");
  const [message, setMessage] = useState("");
  const [confirmsGraduation, setConfirmsGraduation] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    if (window.matchMedia("(max-width: 760px)").matches) heading.current?.scrollIntoView({ block: "start" });
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!status) { setError("Choose a review decision."); return; }
    try {
      reviewDemoApplication(profile, { status, message, reference: reference || undefined, referenceNote, confirmsGraduation });
      onSaved();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save this decision. Please try again."); }
  }

  const fields = [
    ["Batch year", profile.batchYear], ["Middle / maiden name", profile.middleName],
    ["Section", profile.section], ["Class adviser", profile.adviser],
    ["Email address", profile.email], ["Mobile number", profile.mobile],
    ["Profession / occupation", professionLabel(profile)], ["Employers / businesses", profile.employers],
  ];

  return (
    <section className={styles.details} aria-label="Application details">
      <div className={styles.identity}><ProfileAvatar profile={profile} size={72} /><div><p className={styles.eyebrow}>Graduate application</p><h2 ref={heading} tabIndex={-1}>{profile.firstName} {profile.lastName}</h2><span className={styles.status} data-status={profile.verification}>{verificationLabels[profile.verification]}</span></div></div>
      <p className={styles.submitted}>Registered {reviewDate(profile.createdAt)} · Philippine time</p>
      <dl className={styles.detailsGrid}>{fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "Not provided"}</dd></div>)}</dl>
      <form className={styles.reviewForm} onSubmit={submit}>
        <h3>Record a decision</h3><p>Graduates only. Record the reference checked before approving. These are demonstration decisions.</p>
        <label>Decision *<select name="decision" value={status} onChange={event => { setStatus(event.target.value as VerificationStatus); setError(""); }} required><option value="">Choose a decision</option><option value="verified" disabled={profile.verification === "verified"}>Approve graduate</option><option value="needs_information" disabled={profile.verification === "needs_information"}>Request more information</option><option value="rejected" disabled={profile.verification === "rejected"}>Reject application</option><option value="pending" disabled={profile.verification === "pending"}>Return to pending review</option></select></label>
        {status === "verified" && <>
          <label>Graduation reference *<select name="graduationReference" value={reference} onChange={event => setReference(event.target.value as VerificationReference)} required><option value="">Select a reference</option>{Object.entries(verificationReferences).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label>Reference details — visible to officers *<input name="referenceNote" value={referenceNote} onChange={event => setReferenceNote(event.target.value)} maxLength={300} placeholder="e.g. Demo graduation list, Batch 2008, entry 12" required /><small>Use fictional reference details. No document is uploaded through this demo.</small></label>
          <label className={styles.confirmation}><input name="confirmsGraduation" type="checkbox" checked={confirmsGraduation} onChange={event => setConfirmsGraduation(event.target.checked)} required /><span>I confirm that the reference supports graduation from Davao City National High School. *</span></label>
        </>}
        <label>Message to applicant *<textarea name="reviewMessage" rows={3} value={message} onChange={event => setMessage(event.target.value)} maxLength={1000} placeholder={status === "needs_information" ? "Explain what needs clarification, such as the name used during schooling or section." : "Explain the decision and any next steps."} required /><small>This message appears on the applicant’s dashboard. Email delivery is not connected.</small></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="submit" className="button">Save decision <span aria-hidden="true">✓</span></button>
      </form>
      <section className={styles.history} aria-label="Review history"><h3>Review history</h3>
        {!profile.reviewHistory?.length ? <p>No review decisions recorded yet.{profile.verification === "verified" ? " This is the original sample verified account." : ""}</p> : <ol>{[...profile.reviewHistory].reverse().map(entry => <li key={entry.id}><div><span className={styles.status} data-status={entry.status}>{verificationLabels[entry.status]}</span><time dateTime={entry.reviewedAt}>{reviewDate(entry.reviewedAt)}</time></div><strong>{entry.reviewer} · {entry.actor === "officer" ? "Officer" : "Applicant"}</strong><p>{entry.message}</p>{entry.reference && <p className={styles.reference}><strong>{verificationReferences[entry.reference]}</strong><br />{entry.referenceNote}</p>}</li>)}</ol>}
      </section>
    </section>
  );
}
