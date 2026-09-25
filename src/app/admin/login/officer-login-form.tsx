"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import PasswordField from "@/app/password-field";
import { DEMO_OFFICER_EMAIL, DEMO_OFFICER_PASSWORD, signInDemoOfficer } from "@/lib/demo-account";
import { useDemoOfficer } from "@/lib/use-demo-officer";

export default function OfficerLoginForm() {
  const router = useRouter();
  const { name, ready } = useDemoOfficer();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (ready && name) router.replace("/admin"); }, [ready, name, router]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    try { signInDemoOfficer(email, password); router.replace("/admin"); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to open the officer demo."); setBusy(false); }
  }

  return (
    <>
      <form onSubmit={submit}>
        <label>Officer email<input name="email" type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} required /></label>
        <PasswordField id="officerPassword" label="Password" value={password} onChange={setPassword} autoComplete="current-password" minLength={1} />
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="submit" className="button submit-button" disabled={busy}>{busy ? "Opening officer portal…" : "Sign in as officer"} <span aria-hidden="true">→</span></button>
      </form>
      <details className="officer-demo-access"><summary>Demo access details</summary><p>Email: <code>{DEMO_OFFICER_EMAIL}</code><br />Password: <code>{DEMO_OFFICER_PASSWORD}</code></p><p>For fictional information only. This browser demo does not provide production access protection.</p></details>
    </>
  );
}
