import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { association } from "@/lib/association";
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
          <h2 id="donation-accounts-title">Ways to donate</h2>
          <p className={styles.intro}>Choose a convenient way to support the Association’s alumni and school community programs.</p>
          <div className={styles.accounts}>
            <article className={styles.account}>
              <div className={styles.paymentIcon}><Image src="/branding/bdo-icon.png" alt="BDO" width={58} height={58} /></div>
              <div>
                <p className={styles.paymentLabel}>Bank transfer</p>
                <h3>BDO</h3>
                <dl>
                  <div><dt>Account name</dt><dd>Davao City National High School Alumni Assoc., Inc.</dd></div>
                  <div><dt>SA account number</dt><dd className={styles.number}>000861135814</dd></div>
                  <div><dt>Branch</dt><dd>BDO SM City, GF Main Extension, Davao City</dd></div>
                </dl>
              </div>
            </article>
            <article className={styles.account}>
              <div className={styles.paymentIcon}><Image src="/branding/gcash-icon-new.png" alt="GCash" width={58} height={58} /></div>
              <div>
                <p className={styles.paymentLabel}>Mobile wallet</p>
                <h3>GCash</h3>
                <dl>
                  <div><dt>Account number</dt><dd className={styles.number}>0917 589 1190</dd></div>
                  <div><dt>Account name</dt><dd>Merle Bobilles</dd></div>
                </dl>
              </div>
            </article>
          </div>
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
