"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInDemo } from "@/lib/demo-account";
import PasswordField from "../password-field";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
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
      await signInDemo(email, password, remember);
      router.replace("/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in. Please try again.");
      setBusy(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void login(); }

  return (
    <>
      <form onSubmit={submit}>
        <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)} required /></label>
        <PasswordField id="loginPassword" label="Password" value={password} onChange={setPassword} autoComplete="current-password" minLength={1} />
        <div className="login-options"><label><input type="checkbox" checked={remember} onChange={event => setRemember(event.target.checked)} /> Remember me</label><button type="button" className="inline-button" aria-expanded={showHelp} onClick={() => setShowHelp(!showHelp)}>Forgot password?</button></div>
        {showHelp && <p className="demo-note" role="status">Password recovery is not connected in this demo. You can register another demo account to continue.</p>}
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="submit" className="button submit-button" disabled={busy}>{busy ? "Signing in…" : "Sign in"} <span aria-hidden="true">→</span></button>
      </form>
    </>
  );
}
