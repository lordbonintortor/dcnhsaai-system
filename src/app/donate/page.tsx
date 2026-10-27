import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { association } from "@/lib/association";
import { donationAccounts } from "@/lib/donations";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Donate | DCNHS Alumni Association",
  description: "Support the DCNHS Alumni Association through its published donation bank accounts.",
};

export default function DonatePage() {
  return (
    <main className="content-page">
      <header className="site-header content-header">
        <Link className="brand" href="/" aria-label="DCNHS Alumni home">
          <Image className="brand-logo" src="/branding/dcnhsaai-logo.svg" alt="DCNHS Alumni Association seal" width={52} height={52} priority />
          <span><strong>DCNHS Alumni</strong><small>Association, Inc.</small></span>
        </Link>
        <Link className="back-link" href="/">← Back to home</Link>
      </header>
      <section className="content-hero">
        <div><p className="eyebrow">Give back to City High</p><h1>Make a donation.</h1><p>Support the Davao City National High School Alumni Association and its work for our alumni and school community.</p></div>
      </section>
      <section className={styles.body} aria-labelledby="donation-accounts-title">
        <div>
          <p className="eyebrow gold">Bank deposits &amp; transfers</p>
          <h2 id="donation-accounts-title">Donation bank accounts</h2>
          {donationAccounts.length > 0 ? <>
            <p className={styles.intro}>You may send your donation through any of the association’s accounts listed below.</p>
            <div className={styles.accounts}>{donationAccounts.map(account => (
              <article className={styles.account} key={account.id}>
                <h3>{account.bankName}</h3>
                <dl><div><dt>Account name</dt><dd>{account.accountName}</dd></div><div><dt>Account number</dt><dd className={styles.number}>{account.accountNumber}</dd></div></dl>
              </article>
            ))}</div>
          </> : <div className={styles.empty}><h3>Bank account details will be posted here</h3><p>Please contact the association for donation instructions while the official account details are being prepared.</p></div>}
        </div>
        <aside className={styles.contact}>
          <p className="eyebrow gold">We’re here to help</p><h3>Donation inquiries</h3>
          <p>For assistance or to share your transfer confirmation, contact the association directly.</p>
          <a href={`mailto:${association.contact.email}`}>{association.contact.email}</a>
          <a href={association.contact.phoneHref}>{association.contact.phone}</a>
          <Link href="/">← Return to homepage</Link>
        </aside>
      </section>
      <footer className="simple-footer"><span>DCNHS Alumni Association, Inc.</span><span>Thank you for your support.</span></footer>
    </main>
  );
}
