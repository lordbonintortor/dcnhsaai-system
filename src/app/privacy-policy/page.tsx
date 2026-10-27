import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | DCNHS Alumni Association, Inc.",
  description: "How the DCNHS Alumni Association collects, uses, protects, and shares personal information.",
};

export default function PrivacyPolicyPage() {
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
      <section className="legal-hero"><p className="eyebrow gold">Your information matters</p><h1>Privacy Policy</h1><p>How the DCNHS Alumni Association, Inc. handles information shared through this website.</p></section>
      <article className="legal-content">
        <p className="legal-updated">Effective date: October 27, 2026</p>
        <p>This policy explains how the Davao City National High School Alumni Association, Inc. (“the Association,” “we,” or “us”) collects and uses information when you visit this website, register an alumni account, or interact with Association content.</p>
        <h2>Information we collect</h2>
        <p>When you register or maintain an account, we may collect your name, graduation batch and school information, contact email, optional mobile number, profession, employer information, profile photo, username, and password. We also receive information you provide when you contact the Association or submit content for publication.</p>
        <h2>How we use information</h2>
        <ul><li>To create and maintain the alumni registry.</li><li>To verify alumni applications and manage accounts.</li><li>To help alumni reconnect through approved directory information.</li><li>To communicate with you about your account and Association activities.</li><li>To protect the website, prevent misuse, and maintain reliable services.</li></ul>
        <h2>What is visible to others</h2>
        <p>The public directory is designed to show limited information, such as an approved alumnus’s name and batch year. Additional profile information is available only through the authenticated alumni experience according to the Association’s access controls. Documents and records marked for officers are not public.</p>
        <h2>Photos and published content</h2>
        <p>Photos and information published in public activity, project, award, or trustee pages may be viewed by anyone. Please provide only content that the Association is authorized to publish. Contact us if you believe a published image or personal information should be corrected or removed.</p>
        <h2>Storage and service providers</h2>
        <p>Account information is processed through the website’s application and database services. Public website files are delivered through the application host. Private documents and account-related information are protected by server-side access checks. We do not sell personal information.</p>
        <h2>Your choices and requests</h2>
        <p>You may request correction of inaccurate account information or ask about the handling of your information by contacting the Association. We may need to verify your identity before completing a request. Some records may need to be retained to meet legal, security, or administrative obligations.</p>
        <h2>Updates to this policy</h2>
        <p>We may update this policy when the website or the Association’s information practices change. The effective date above identifies the current version.</p>
        <h2>Contact</h2>
        <p>For privacy questions or requests, contact the Association through the details listed on the <Link href="/about#contact">About the Association page</Link>.</p>
      </article>
      <footer className="simple-footer"><Link href="/">← Back to home</Link><span>DCNHS Alumni Association, Inc.</span><span><Link href="/privacy-policy">Privacy Policy</Link> · <Link href="/terms-of-use">Terms of Use</Link></span></footer>
    </main>
  );
}
