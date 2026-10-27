"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { emptyProfile, normalizeProfile, profileError, type AlumniProfile } from "@/lib/alumni-profile";
import { registerAccount } from "@/lib/account-api";
import { normalizedUsername, USERNAME_HELP, USERNAME_PATTERN } from "@/lib/username";
import AlumniFields from "./alumni-fields";
import PasswordField from "../password-field";
import ProfilePhotoField from "../profile-photo-field";
import ProfileAvatar from "../profile-avatar";

export default function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState({ ...emptyProfile });
  const [consent, setConsent] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [created, setCreated] = useState<AlumniProfile | null>(null);
  const [warning, setWarning] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => { if (step !== 1) heading.current?.focus(); }, [step]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (busy || photoBusy) return;
    if (step === 1) {
      const normalized = normalizeProfile(details);
      const validation = profileError(normalized);
      if (validation) { setError(validation); return; }
      if (!consent) { setError("Please confirm your information and consent before continuing."); return; }
      setDetails(normalized);
      setStep(2);
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    const chosenUsername = normalizedUsername(username);
    if (!chosenUsername) { setError(USERNAME_HELP); return; }
    if (password.length < 8) { setError("Use at least 8 characters for your password."); return; }
    if (password !== confirmation) { setError("Your passwords do not match."); return; }
    setBusy(true);
    try {
      const result = await registerAccount(details, chosenUsername, password, consent);
      setCreated(result.profile);
      setWarning(result.warning);
      setPassword("");
      setConfirmation("");
      setStep(3);
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not create your account. Please try again.");
    } finally { setBusy(false); }
  }

  if (created) return (
    <div className="registration-success">
      <span className="success-mark" aria-hidden="true">✓</span>
      <p className="step-label">Registration complete</p>
      <h1 ref={heading} tabIndex={-1}>You’re part of the story, {created.firstName}.</h1>
      <p>Your application is pending officer review. Sign in and open Application status to check for decisions or requests for information. You do not need to register again.</p>
      <dl className="account-summary"><div><dt>Username</dt><dd>{created.username}</dd></div><div><dt>Batch</dt><dd>{created.batchYear}</dd></div><div><dt>Registry status</dt><dd>Pending officer review</dd></div></dl>
      <p className="demo-note">Sign in with your username to check your application updates.</p>
      {warning && <p className="form-error" role="status">{warning}</p>}
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
      <p className="form-intro">{step === 1 ? "Fields marked with * are required." : "Choose a username and a password with at least 8 characters."}</p>
      {step === 1 && <p className="eligibility-note">For graduates of Davao City National High School. Your alumni status is subject to officer review.</p>}
      <form onSubmit={submit}>
        {step === 1 ? (
          <>
            <ProfilePhotoField profile={details} onChange={photoDataUrl => setDetails(current => ({ ...current, photoDataUrl }))} onBusyChange={setPhotoBusy} />
            <AlumniFields value={details} onChange={setDetails} />
            <p className="demo-note">After approval, the public directory shows your name and batch year. Approved alumni can also view your profile photo and profession.</p>
            <label className="consent"><input name="consent" type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} required /> <span>I confirm that I graduated from Davao City National High School, that the information above is accurate, and consent to its use for alumni verification and association purposes. *</span></label>
          </>
        ) : (
          <>
            {details.photoDataUrl && <div className="account-photo-preview"><ProfileAvatar profile={details} size={72} /><p>Your profile photo</p></div>}
            <dl className="account-summary"><div><dt>Alumnus</dt><dd>{details.firstName} {details.lastName}</dd></div><div><dt>Batch</dt><dd>{details.batchYear}</dd></div></dl>
            <label>Username *<input name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} minLength={3} maxLength={30} pattern={USERNAME_PATTERN} value={username} onChange={event => setUsername(event.target.value)} aria-describedby="username-help" required /><small id="username-help">{USERNAME_HELP} Choose carefully; your username cannot be changed in your profile.</small></label>
            <div className="field-grid account-passwords">
              <PasswordField id="password" label="Password *" value={password} onChange={setPassword} />
              <PasswordField id="confirmPassword" label="Confirm password *" value={confirmation} onChange={setConfirmation} />
            </div>
            <p className="demo-note">Sign in with your username after registration. For account-access help, contact the association.</p>
          </>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-actions">
          {step === 2 && <button type="button" className="button button-outline" disabled={busy} onClick={() => { setStep(1); setError(""); window.scrollTo({ top: 0, behavior: "instant" }); }}>← Back to information</button>}
          <button className="button" type="submit" disabled={busy || photoBusy}>{photoBusy ? "Preparing photo…" : busy ? "Creating account…" : step === 1 ? "Continue to account setup" : "Create account"} <span aria-hidden="true">→</span></button>
        </div>
      </form>
    </>
  );
}
