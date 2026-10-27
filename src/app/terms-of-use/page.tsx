import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | DCNHS Alumni Association, Inc.",
  description: "Terms for using the DCNHS Alumni Association website and alumni registry.",
};

export default function TermsOfUsePage() {
  return (
    <main className="legal-page">
      <header className="site-header content-header">
        <Link className="brand" href="/" aria-label="DCNHS Alumni home">
          <Image className="brand-logo" src="/branding/dcnhsaai-logo.svg" alt="DCNHS Alumni Association seal" width={52} height={52} priority />
          <span><strong>DCNHS Alumni</strong><small>Association, Inc.</small></span>
        </Link>
        <Link className="back-link" href="/">← Back to home</Link>
        <Link className="button button-small" href="/register">Join the registry</Link>
      </header>
      <section className="legal-hero"><p className="eyebrow gold">Using our website</p><h1>Terms of Use</h1><p>The terms that apply when you visit or use the DCNHS Alumni Association website.</p></section>
      <article className="legal-content">
        <p className="legal-updated">Effective date: October 27, 2026</p>
        <p>By using this website, you agree to use it responsibly and in accordance with these terms. If you do not agree, please do not create an account or use account-only services.</p>
        <h2>Account responsibilities</h2>
        <ul><li>Provide accurate information when registering or updating your profile.</li><li>Keep your username and password confidential.</li><li>Notify the Association if you believe your account has been used without authorization.</li><li>Use only your own account and do not impersonate another person.</li></ul>
        <h2>Alumni registry</h2>
        <p>The registry helps verified alumni connect with the City High community. Public directory information is limited, and access to additional profile information may require an account or other authorization. Account approval and access decisions are handled by authorized Association officers.</p>
        <h2>Acceptable use</h2>
        <p>You may use the website to learn about the Association, register as an alumnus, view published activities and projects, access authorized documents, and participate in available features such as reactions. You must not misuse the website, attempt to bypass access controls, upload harmful material, submit fraudulent information, scrape private information, or interfere with the website’s operation.</p>
        <h2>Published content</h2>
        <p>Association names, logos, activity materials, photographs, biographies, and documents may be protected by applicable rights. Do not copy, alter, or republish content in a misleading or commercial manner without permission from the Association or the relevant rights holder.</p>
        <h2>Content and account action</h2>
        <p>The Association may correct, remove, or restrict content and may suspend or close an account when necessary to protect members, comply with law, or prevent misuse. We will handle account-related requests through the Association’s available contact channels.</p>
        <h2>Website availability</h2>
        <p>We work to keep the website accurate and available, but online services may occasionally be interrupted for maintenance, security, or technical reasons. Published information may be updated over time.</p>
        <h2>Changes to these terms</h2>
        <p>We may update these terms when the website or Association practices change. The effective date above identifies the current version.</p>
        <h2>Contact</h2>
        <p>Questions about these terms may be sent through the contact information on the <Link href="/about#contact">About the Association page</Link>.</p>
      </article>
      <footer className="simple-footer"><Link href="/">← Back to home</Link><span>DCNHS Alumni Association, Inc.</span><span><Link href="/privacy-policy">Privacy Policy</Link> · <Link href="/terms-of-use">Terms of Use</Link></span></footer>
    </main>
  );
}
