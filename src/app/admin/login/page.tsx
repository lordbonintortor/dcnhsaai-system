import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import OfficerLoginForm from "./officer-login-form";

export const metadata: Metadata = { title: "Officer sign in | DCNHS Alumni" };

export default function OfficerLoginPage() {
  return (
    <main className="login-page">
      <section className="login-card">
        <Link className="brand" href="/"><Image className="brand-logo" src="/branding/dcnhsaai-logo.svg" alt="DCNHS Alumni Association seal" width={58} height={58} loading="eager" /><span><strong>DCNHS Alumni</strong><small>Association, Inc.</small></span></Link>
        <div><p className="eyebrow gold">Officer portal · Browser demo</p><h1>Review the next chapter.</h1><p>Sign in to try the graduate verification workflow with sample information.</p></div>
        <OfficerLoginForm />
        <p className="login-foot">Looking for your alumni account? <Link href="/login">Alumni sign in</Link></p>
        <Link className="back-home" href="/">← Return to website</Link>
      </section>
    </main>
  );
}
