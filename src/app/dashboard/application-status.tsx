"use client";

import Link from "next/link";
import { useState } from "react";
import { reviewDate, verificationLabels } from "@/lib/application-review";
import { resubmitApplication } from "@/lib/account-api";
import { useAlumniProfile } from "./dashboard-shell";
import styles from "./dashboard.module.css";

export default function ApplicationStatus() {
  const profile = useAlumniProfile();
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const history = profile.reviewHistory ?? [];
  const latest = history[history.length - 1];

  async function resubmit() {
    if (busy) return;
    setBusy(true);
    setError("");
    try { await resubmitApplication(); setSent(true); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to resubmit. Please try again."); }
    finally { setBusy(false); }
  }

  return (
    <section className={`${styles.card} ${styles.applicationStatus}`} aria-label="Application review">
      <p className={styles.eyebrow}>Your application</p>
      <h2>{verificationLabels[profile.verification]}</h2>
      <p>Sign in here to check your application and read officer messages. No automatic email notifications are sent.</p>
      {profile.verification === "pending" && <p>Your application is awaiting officer review. You do not need to register again. Keep your details accurate and return here for updates.</p>}
      {profile.verification === "verified" && <p>Your graduate application has been approved. You can continue keeping your alumni profile up to date.</p>}
      {!latest && <p>No officer message yet.</p>}
      {latest && <>{latest.message && <p className={styles.reviewMessage}>{latest.message}</p>}<p className={styles.reviewMeta}>{latest.actor === "officer" ? "Reviewed" : "Updated"} by {latest.reviewer} · {reviewDate(latest.reviewedAt)} (Philippine time)</p></>}
      {profile.verification === "needs_information" && <><p>An officer has requested further details. Contact the association to clarify what is needed, update and save your profile, then resubmit it. Document uploads are not available.</p><div className="form-actions"><Link href="/dashboard/profile" className="button button-outline">Update my details</Link><button type="button" className="button" onClick={resubmit} disabled={busy}>{busy ? "Resubmitting…" : "Resubmit for review →"}</button></div></>}
      {profile.verification === "rejected" && <p>If the decision needs clarification, <Link href="/about#contact">contact the association</Link>. An officer can review your application again.</p>}
      {sent && profile.verification === "pending" && <p className="form-success" role="status">Your saved details have been resubmitted for review.</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      {history.length > 1 && <details className={styles.applicationHistory}><summary>View application history</summary><ol>{[...history].reverse().map(entry => <li key={entry.id}><strong>{verificationLabels[entry.status]}</strong>{entry.message && <p>{entry.message}</p>}<small>{entry.reviewer} · {reviewDate(entry.reviewedAt)}</small></li>)}</ol></details>}
    </section>
  );
}
