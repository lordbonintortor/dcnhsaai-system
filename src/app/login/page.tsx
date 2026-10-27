import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = { title: "Sign in | DCNHS Alumni" };

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-card">
        <Link className="brand" href="/"><Image className="brand-logo" src="/branding/dcnhsaai-logo.svg" alt="DCNHS Alumni Association seal" width={58} height={58} /><span><strong>DCNHS Alumni</strong><small>Association, Inc.</small></span></Link>
        <div><p className="eyebrow gold">Welcome</p><h1>Sign in to your account</h1><p>Access your alumni profile and community updates.</p></div>
        <LoginForm />
        <p className="login-foot">Not registered yet? <Link href="/register">Join the alumni registry</Link></p>
        <Link className="back-home" href="/">← Return to website</Link>
      </section>
    </main>
  );
}
