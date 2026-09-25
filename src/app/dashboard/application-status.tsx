"use client";

import Link from "next/link";
import { useState } from "react";
import { reviewDate, verificationLabels } from "@/lib/application-review";
import { resubmitDemoApplication } from "@/lib/demo-account";
import { useAlumniProfile } from "./dashboard-shell";
import styles from "./dashboard.module.css";

export default function ApplicationStatus() {
  const profile = useAlumniProfile();
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const history = profile.reviewHistory ?? [];
  const latest = history[history.length - 1];
  if (!latest && profile.verification !== "needs_information" && profile.verification !== "rejected") return null;

  function resubmit() {
    setError("");
    try { resubmitDemoApplication(); setSent(true); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to resubmit. Please try again."); }
  }

  return (
    <section className={`${styles.card} ${styles.applicationStatus}`} aria-label="Application review">
      <p className={styles.eyebrow}>Your application · Browser demo</p>
      <h2>{verificationLabels[profile.verification]}</h2>
      {latest && <><p className={styles.reviewMessage}>{latest.message}</p><p className={styles.reviewMeta}>{latest.actor === "officer" ? "Reviewed" : "Updated"} by {latest.reviewer} · {reviewDate(latest.reviewedAt)} (Philippine time)</p></>}
      {profile.verification === "needs_information" && <><p>Review the request, update and save your profile, then resubmit it. Document uploads are not enabled in this demo.</p><div className="form-actions"><Link href="/dashboard/profile" className="button button-outline">Update my details</Link><button type="button" className="button" onClick={resubmit}>Resubmit for review →</button></div></>}
      {profile.verification === "rejected" && <p>If the decision needs clarification, <Link href="/about#contact">contact the association</Link>. An officer can return your application to pending review.</p>}
      {sent && profile.verification === "pending" && <p className="form-success" role="status">Your saved details have been resubmitted for review.</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      {history.length > 1 && <details className={styles.applicationHistory}><summary>View application history</summary><ol>{[...history].reverse().map(entry => <li key={entry.id}><strong>{verificationLabels[entry.status]}</strong><p>{entry.message}</p><small>{entry.reviewer} · {reviewDate(entry.reviewedAt)}</small></li>)}</ol></details>}
    </section>
  );
}
