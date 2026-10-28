"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/account-api";
import PasswordField from "../password-field";

export default function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  async function login() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await signIn(identifier, password, remember);
      router.replace(result.mustChangePassword ? "/change-password" : "/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in. Please try again.");
      setBusy(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void login(); }

  return (
    <>
      <form onSubmit={submit}>
        <label>Username<input name="username" type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} maxLength={30} placeholder="Your username" value={identifier} onChange={event => setIdentifier(event.target.value)} required /></label>
        <PasswordField id="loginPassword" label="Password" value={password} onChange={setPassword} autoComplete="current-password" minLength={1} />
        <div className="login-options"><label><input type="checkbox" checked={remember} onChange={event => setRemember(event.target.checked)} /> Remember me</label><button type="button" className="inline-button" aria-expanded={showHelp} onClick={() => setShowHelp(!showHelp)}>Forgot password?</button></div>
        {showHelp && <div className="demo-note" role="status"><p>For help accessing your account, <Link href="/about#contact">contact the association</Link>. An authorized officer will need to verify your identity before assisting with account recovery. Never share your password.</p><p>This page does not submit a recovery request.</p></div>}
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="submit" className="button submit-button" disabled={busy}>{busy ? "Signing in…" : "Sign in"} <span aria-hidden="true">→</span></button>
      </form>
    </>
  );
}
