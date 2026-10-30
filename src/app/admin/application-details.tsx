"use client";

import { useEffect, useRef, useState } from "react";
import ProfileAvatar from "@/app/profile-avatar";
import { professionLabel, type AlumniProfile } from "@/lib/alumni-profile";
import { reviewDate, verificationLabels, type OfficerDecision } from "@/lib/application-review";
import { api, reviewApplication } from "@/lib/account-api";
import styles from "./officer.module.css";

export default function ApplicationDetails({ profile, onSaved }: { profile: AlumniProfile; onSaved: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [decision, setDecision] = useState<Exclude<OfficerDecision, "verified"> | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const messageValid = message.trim().length > 0 && message.trim().length <= 1000;
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    if (window.matchMedia("(max-width: 760px)").matches) heading.current?.scrollIntoView({ block: "start" });
  }, []);

  useEffect(() => {
    if (decision) dialog.current?.showModal();
    else dialog.current?.close();
  }, [decision]);

  function openMessage(status: Exclude<OfficerDecision, "verified">) {
    setError("");
    setMessage("");
    setDecision(status);
  }

  function cancelMessage() {
    if (busy) return;
    setDecision(null);
    setMessage("");
    setError("");
  }

  async function issueTemporaryPassword() {
    if (resetBusy || !window.confirm(`Issue a temporary password for ${profile.firstName} ${profile.lastName}?`)) return;
    setResetBusy(true);
    setError("");
    setTemporaryPassword("");
    try {
      const result = await api<{ temporaryPassword: string }>("/api/account/reset-password", "POST", { userId: profile.id });
      setTemporaryPassword(result.temporaryPassword);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to issue a temporary password.");
    } finally {
      setResetBusy(false);
    }
  }

  async function decide(status: OfficerDecision) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await reviewApplication(profile, status, message);
      dialog.current?.close();
      setDecision(null);
      setMessage("");
      onSaved();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save this decision. Please try again."); }
    finally { setBusy(false); }
  }

  const fields = [
    ["Batch year", profile.batchYear], ["Middle / maiden name", profile.middleName],
    ["Suffix", profile.suffix], ["Country of current residence", profile.country],
    ["Section", profile.section], ["Class adviser", profile.adviser],
    ["Username", profile.username || "Not assigned"], ["Email address", profile.email], ["Mobile number", profile.mobile],
    ["Profession / occupation", professionLabel(profile)], ["Employers / businesses", profile.employers],
  ];

  return (
    <section className={styles.details} aria-label="Application details">
      <div className={styles.identity}><ProfileAvatar profile={profile} size={72} /><div><p className={styles.eyebrow}>Graduate application</p><h2 ref={heading} tabIndex={-1}>{profile.firstName} {profile.lastName}</h2><span className={styles.status} data-status={profile.verification}>{verificationLabels[profile.verification]}</span></div></div>
      <p className={styles.submitted}>Registered {reviewDate(profile.createdAt)} · Philippine time</p>
      <dl className={styles.detailsGrid}>{fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "Not provided"}</dd></div>)}</dl>
      <div className={styles.reviewForm}>
        {!decision && error && <p className="form-error" role="alert">{error}</p>}
        <div className={styles.decisionActions} role="group" aria-label="Application decision">
          <button type="button" className="button" disabled={busy || profile.verification === "verified"} onClick={() => decide("verified")}>Approve</button>
          <button type="button" className="button button-outline" disabled={busy || profile.verification === "needs_information"} onClick={() => openMessage("needs_information")}>Request further details</button>
          <button type="button" className="button button-outline" disabled={busy || profile.verification === "rejected"} onClick={() => openMessage("rejected")}>Reject</button>
        </div>
        <button type="button" className="button button-outline" disabled={resetBusy} onClick={issueTemporaryPassword}>{resetBusy ? "Issuing…" : "Issue temporary password"}</button>
        {temporaryPassword && <p role="status">Temporary password: <strong>{temporaryPassword}</strong><br />Give this to the account holder securely. It will be replaced when they sign in.</p>}
      </div>
      <dialog ref={dialog} className={styles.messageDialog} aria-labelledby="decision-dialog-title" aria-describedby="decision-dialog-help" onCancel={event => { if (busy) event.preventDefault(); else cancelMessage(); }}>
        <form className={styles.reviewForm} onSubmit={event => { event.preventDefault(); if (decision && messageValid) decide(decision); }}>
          <h3 id="decision-dialog-title">{decision === "rejected" ? "Reject application" : "Request further details"}</h3>
          <p id="decision-dialog-help">Write a message for {profile.firstName} {profile.lastName}. The decision and message will appear on their dashboard only after you press Send.</p>
          <label>Message to applicant *
            <textarea name="reviewMessage" rows={4} value={message} onChange={event => setMessage(event.target.value)} maxLength={1000} required disabled={busy} />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className={styles.decisionActions}>
            <button type="button" className="button button-outline" onClick={cancelMessage} disabled={busy}>Cancel</button>
            <button type="submit" className="button" disabled={!messageValid || busy}>{busy ? "Sending…" : "Send"}</button>
          </div>
        </form>
      </dialog>
      <section className={styles.history} aria-label="Review history"><h3>Review history</h3>
        {!profile.reviewHistory?.length ? <p>No review decisions recorded yet.</p> : <ol>{[...profile.reviewHistory].reverse().map(entry => <li key={entry.id}><div><span className={styles.status} data-status={entry.status}>{verificationLabels[entry.status]}</span><time dateTime={entry.reviewedAt}>{reviewDate(entry.reviewedAt)}</time></div><strong>{entry.reviewer} · {entry.actor === "officer" ? "Officer" : "Applicant"}</strong>{entry.message && <p>{entry.message}</p>}</li>)}</ol>}
      </section>
    </section>
  );
}
