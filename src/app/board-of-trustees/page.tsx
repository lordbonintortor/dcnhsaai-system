import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { trustees } from "@/lib/trustees";
import styles from "./profiles.module.css";

export const metadata: Metadata = {
  title: "Board of Trustees | DCNHS Alumni Association, Inc.",
  description: "Meet the 2026 DCNHSAAI Board of Trustees and officers.",
};

export default function BoardPage() {
  return (
    <main>
      <section className={`content-hero ${styles.hero}`} aria-labelledby="board-title">
        <div>
          <p className="eyebrow">Leadership and governance</p>
          <h1 id="board-title">Board of Trustees</h1>
          <p>City High alumni bringing their experience, care, and commitment to the community that shaped them.</p>
          <span className={styles.edition}>2026 board and officers</span>
        </div>
      </section>

      <section className={styles.directory} aria-labelledby="trustees-title">
        <div className={styles.sectionHeading}>
          <div><p className="eyebrow gold">Our people, our community</p><h2 id="trustees-title">A shared commitment to serve.</h2></div>
          <p>Get to know the people behind the roles, their professional journeys, and their City High roots.</p>
        </div>
        <div className={styles.grid}>
          {trustees.map((trustee) => (
            <article className={styles.card} key={trustee.slug}>
              <Link className={styles.cardLink} href={`/board-of-trustees/${trustee.slug}`} aria-label={`View ${trustee.name}’s profile`}>
                <div className={styles.portrait}>
                  <Image src={trustee.photo} alt={`Portrait of ${trustee.name}`} fill sizes="(max-width: 640px) 88vw, (max-width: 1000px) 42vw, 28vw" />
                  <span className={styles.batch}>Batch {trustee.batch}</span>
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.role}>{trustee.role}</p>
                  <h3>{trustee.name}</h3>
                  <p className={styles.summary}>{trustee.summary}</p>
                  <span className={styles.readProfile}>Read profile <span aria-hidden="true">↗</span></span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.historyCallout}>
        <div><p className="eyebrow gold">The story we share</p><h2>Generations of alumni.<br />One continuing legacy.</h2><p>Discover how the association has grown from its founding in 2016.</p></div>
        <Link className="secondary-link dark" href="/about">Read our association’s story <span aria-hidden="true">↗</span></Link>
      </section>
    </main>
  );
}
