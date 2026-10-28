"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/account-api";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 8 || password.length > 128) return setError("Use a password with 8–128 characters.");
    if (password !== confirmation) return setError("Your passwords do not match.");
    setBusy(true);
    setError("");
    try {
      await api("/api/account/change-password", "POST", { password });
      router.replace("/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Your password could not be changed.");
      setBusy(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <Link className="brand" href="/"><Image className="brand-logo" src="/branding/dcnhsaai-logo.svg" alt="DCNHS Alumni Association seal" width={58} height={58} /><span><strong>DCNHS Alumni</strong><small>Association, Inc.</small></span></Link>
        <div><p className="eyebrow gold">Account security</p><h1>Choose a new password</h1><p>Your temporary password has been accepted. Create a private password before continuing.</p></div>
        <form onSubmit={submit}>
          <p className="field-help">Password requirements: use 8–128 characters. For better security, use a mix of uppercase and lowercase letters, numbers, and special characters.</p>
          <label>New password<input type="password" autoComplete="new-password" minLength={8} maxLength={128} value={password} onChange={event => setPassword(event.target.value)} required /></label>
          <label>Confirm new password<input type="password" autoComplete="new-password" minLength={8} maxLength={128} value={confirmation} onChange={event => setConfirmation(event.target.value)} required /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="button submit-button" disabled={busy}>{busy ? "Saving…" : "Save new password"} <span aria-hidden="true">→</span></button>
        </form>
      </section>
    </main>
  );
}
