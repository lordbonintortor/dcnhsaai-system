import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { association, associationHistory } from "@/lib/association";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About the Association | DCNHS Alumni Association, Inc.",
  description:
    "Discover the history of DCNHSAAI, from its founding in 2016 to the City High centennial, alumni connections, and generations of leadership.",
};

export default function AboutPage() {
  return (
    <main className="content-page">
      <header className="site-header content-header">
        <Link className="brand" href="/" aria-label="DCNHS Alumni home">
          <Image className="brand-logo" src="/branding/dcnhsaai-logo.svg" alt="DCNHS Alumni Association seal" width={52} height={52} priority />
          <span><strong>DCNHS Alumni</strong><small>Association, Inc.</small></span>
        </Link>
        <Link className="back-link" href="/">← Back to home</Link>
        <Link className="button button-small" href="/register">Join the registry</Link>
      </header>

      <section className={`content-hero ${styles.hero}`} aria-labelledby="about-title">
        <div>
          <p className="eyebrow">About the alumni association</p>
          <h1 id="about-title">A shared history.<br /><em>A continuing legacy.</em></h1>
          <p>{association.introduction}</p>
          <a className="secondary-link" href="#our-history">Discover our story <span aria-hidden="true">↓</span></a>
        </div>
        <Image className={styles.seal} src="/branding/dcnhsaai-logo.svg" alt="" width={250} height={250} />
      </section>

      <dl className={styles.facts} aria-label="Association at a glance">
        <div><dt>Association founded</dt><dd>{association.founded}</dd></div>
        <div><dt>Officially registered</dt><dd>{association.registered}</dd></div>
        <div><dt>Our organization</dt><dd>Non-stock, non-profit</dd></div>
      </dl>

      <div className={styles.storyLayout}>
        <section id="our-history" className={styles.history} aria-labelledby="history-title">
          <p className="eyebrow gold">Through the years</p>
          <h2 id="history-title">Rooted in service.<br />Connected by City High.</h2>
          <p className={styles.intro}>{association.summary}</p>
          <ol className={styles.timeline}>
            {associationHistory.map((milestone) => (
              <li key={milestone.year}>
                <span className={styles.year}>{milestone.year}</span>
                <h3>{milestone.title}</h3>
                {milestone.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </li>
            ))}
          </ol>
          <p className={styles.source}>Based on the association’s history, updated {association.sourceDate}.</p>
        </section>

        <aside className={styles.aside} aria-label="Leadership and contact information">
          <section className={styles.leadership}>
            <p className="eyebrow">Continuing the legacy</p>
            <span className={styles.batch}>Batch {association.president.batch}</span>
            <h2>{association.president.name}</h2>
            <p>Association President<br />Serving since {association.president.since}</p>
            <Link className={`secondary-link ${styles.profileLink}`} href="/board-of-trustees/niceforo-solis">Read his profile <span aria-hidden="true">↗</span></Link>
            <span className={styles.asOf}>As of {association.sourceDate}</span>
          </section>
          <section className={styles.contact}>
            <p className="eyebrow gold">Stay connected</p>
            <h2>Your association.<br />Your community.</h2>
            <address>
              <div><span>Visit our office</span><p>{association.contact.office}<br />Davao City National High School<br />Davao City, Philippines</p></div>
              <div><span>Email us</span><a href={`mailto:${association.contact.email}`}>{association.contact.email}</a></div>
              <div><span>Call us</span><a href={association.contact.phoneHref}>{association.contact.phone}</a></div>
            </address>
          </section>
        </aside>
      </div>

      <section className={styles.join} aria-labelledby="join-title">
        <div><p className="eyebrow gold">Every batch belongs</p><h2 id="join-title">Be part of the next chapter.</h2><p>Reconnect with the community that shares your City High story.</p></div>
        <Link className="button" href="/register">Explore alumni registration <span aria-hidden="true">↗</span></Link>
      </section>
      <footer className="simple-footer"><Link href="/">← Back to home</Link><span>DCNHS Alumni Association, Inc.</span><span>Prototype for review · 2026</span></footer>
    </main>
  );
}
