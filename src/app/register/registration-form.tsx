"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { emptyProfile, normalizeProfile, profileError, type AlumniProfile } from "@/lib/alumni-profile";
import { emailExists, registerDemoAccount } from "@/lib/demo-account";
import AlumniFields from "./alumni-fields";
import PasswordField from "../password-field";

export default function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState({ ...emptyProfile });
  const [consent, setConsent] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<AlumniProfile | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => { if (step !== 1) heading.current?.focus(); }, [step]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (busy) return;
    if (step === 1) {
      const normalized = normalizeProfile(details);
      const validation = profileError(normalized);
      if (validation) { setError(validation); return; }
      if (!consent) { setError("Please confirm your information and consent before continuing."); return; }
      try {
        if (emailExists(normalized.email)) { setError("This email already has a demo account. Sign in or use another email."); return; }
      } catch { setError("Browser storage is unavailable. Allow storage to continue this demo."); return; }
      setDetails(normalized);
      setStep(2);
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    if (password.length < 8) { setError("Use at least 8 characters for your password."); return; }
    if (password !== confirmation) { setError("Your passwords do not match."); return; }
    setBusy(true);
    try {
      const account = await registerDemoAccount(details, password);
      setCreated(account);
      setPassword("");
      setConfirmation("");
      setStep(3);
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not create the demo account. Please try again.");
    } finally { setBusy(false); }
  }

  if (created) return (
    <div className="registration-success">
      <span className="success-mark" aria-hidden="true">✓</span>
      <p className="step-label">Registration complete · Demo</p>
      <h1 ref={heading} tabIndex={-1}>You’re part of the story, {created.firstName}.</h1>
      <p>Your demo account is ready. Sign in to see your alumni dashboard.</p>
      <dl className="account-summary"><div><dt>Sign-in email</dt><dd>{created.email}</dd></div><div><dt>Batch</dt><dd>{created.batchYear}</dd></div><div><dt>Registry status</dt><dd>Pending officer review</dd></div></dl>
      <p className="demo-note">Saved on this browser only. Officer review and email verification are not connected yet.</p>
      <Link className="button submit-button" href="/login">Sign in to your account <span aria-hidden="true">→</span></Link>
    </div>
  );

  return (
    <>
      <ol className="registration-steps" aria-label="Registration progress">
        <li aria-current={step === 1 ? "step" : undefined}><span>{step === 2 ? "✓" : "1"}</span> Alumni information</li>
        <li aria-current={step === 2 ? "step" : undefined}><span>2</span> Account setup</li>
      </ol>
      <p className="step-label">Step {step} of 2 · {step === 1 ? "Alumni information" : "Account setup"}</p>
      <h1 ref={heading} tabIndex={-1}>{step === 1 ? "Join the alumni registry" : "Set up your account"}</h1>
      <p className="form-intro">{step === 1 ? "Fields marked with * are required. Use sample details for this browser demo." : "Choose a demo password with at least 8 characters."}</p>
      <form onSubmit={submit}>
        {step === 1 ? (
          <>
            <AlumniFields value={details} onChange={setDetails} />
            <label className="consent"><input name="consent" type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} required /> <span>I confirm that the information above is accurate and consent to its use for alumni verification and association purposes. *</span></label>
          </>
        ) : (
          <>
            <dl className="account-summary"><div><dt>Alumnus</dt><dd>{details.firstName} {details.lastName}</dd></div><div><dt>Batch</dt><dd>{details.batchYear}</dd></div><div><dt>Sign-in email</dt><dd>{details.email}</dd></div></dl>
            <div className="field-grid account-passwords">
              <PasswordField id="password" label="Password *" value={password} onChange={setPassword} />
              <PasswordField id="confirmPassword" label="Confirm password *" value={confirmation} onChange={setConfirmation} />
            </div>
            <p className="demo-note">This is a demo account saved on this browser. Use a password made for this demo.</p>
          </>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-actions">
          {step === 2 && <button type="button" className="button button-outline" disabled={busy} onClick={() => { setStep(1); setError(""); window.scrollTo({ top: 0, behavior: "instant" }); }}>← Back to information</button>}
          <button className="button" type="submit" disabled={busy}>{busy ? "Creating account…" : step === 1 ? "Continue to account setup" : "Create demo account"} <span aria-hidden="true">→</span></button>
        </div>
      </form>
    </>
  );
}
