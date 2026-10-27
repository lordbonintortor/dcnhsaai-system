"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import PasswordField from "@/app/password-field";
import { signIn } from "@/lib/account-api";
import { useAccount } from "@/lib/use-account";

export default function OfficerLoginForm() {
  const router = useRouter();
  const { officer, ready } = useAccount();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (ready && officer) router.replace("/admin"); }, [ready, officer, router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    try { await signIn(username, password, false, true); router.replace("/admin"); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to open the officer portal."); setBusy(false); }
  }

  return (
    <>
      <form onSubmit={submit}>
        <label>Officer username<input name="username" type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} maxLength={30} value={username} onChange={event => setUsername(event.target.value)} required /></label>
        <PasswordField id="officerPassword" label="Password" value={password} onChange={setPassword} autoComplete="current-password" minLength={1} />
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="submit" className="button submit-button" disabled={busy}>{busy ? "Opening officer portal…" : "Sign in as officer"} <span aria-hidden="true">→</span></button>
      </form>
    </>
  );
}
