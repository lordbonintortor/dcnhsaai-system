import Link from "next/link";
import type { Metadata } from "next";
import RegistrationForm from "./registration-form";

export const metadata: Metadata = { title: "Register | DCNHS Alumni" };

export default function RegisterPage() {
  return (
    <main className="form-page">
      <section className="form-panel">
        <div className="form-top"><Link href="/">← Back to website</Link><span>Already registered? <Link href="/login">Sign in</Link></span></div>
        <div className="form-wrap">
          <RegistrationForm />
        </div>
      </section>
    </main>
  );
}
