import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTrustee, trustees } from "@/lib/trustees";
import styles from "../profiles.module.css";

type ProfileProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return trustees.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ProfileProps): Promise<Metadata> {
  const { slug } = await params;
  const trustee = getTrustee(slug);
  if (!trustee) notFound();

  return {
    title: `${trustee.name} | Board of Trustees | DCNHSAAI`,
    description: `${trustee.role} · Batch ${trustee.batch}. ${trustee.summary}`,
  };
}

export default async function TrusteeProfile({ params }: ProfileProps) {
  const { slug } = await params;
  const trustee = getTrustee(slug);
  if (!trustee) notFound();

  return (
    <main className={styles.profilePage}>
      <div className={styles.breadcrumb}>
        <Link href="/board-of-trustees">← All trustee profiles</Link>
        <span>2026 board and officers</span>
      </div>
      <article className={styles.profile} aria-labelledby="profile-name">
        <header className={styles.profileIntro}>
          <p className="eyebrow gold">Board of Trustees · {trustee.role}</p>
          <h1 id="profile-name">{trustee.name}</h1>
          <p className={styles.profileLead}>{trustee.summary}</p>
        </header>
        <aside className={styles.profileAside} aria-label="Portrait and professional background">
          <div className={`${styles.portrait} ${styles.profilePortrait}`}>
            <Image src={trustee.photo} alt={`Portrait of ${trustee.name}`} fill sizes="(max-width: 640px) 88vw, (max-width: 900px) 360px, 32vw" quality={80} loading="eager" />
          </div>
          <div className={styles.profileFacts}>
            <dl><div><dt>Association role</dt><dd>{trustee.role}</dd></div><div><dt>City High batch</dt><dd>{trustee.batch}</dd></div></dl>
            <p>Professional background</p>
            <ul>{trustee.areas.map((area) => <li key={area}>{area}</li>)}</ul>
          </div>
        </aside>
        <section className={styles.biography} aria-labelledby="biography-title">
          <h2 id="biography-title">A life of experience and service.</h2>
          {trustee.biography.map((paragraph) => <p className={paragraph.startsWith("•") ? styles.bullet : undefined} key={paragraph}>{paragraph}</p>)}
        </section>
      </article>
      <section className={styles.moreProfiles} aria-labelledby="more-profiles-title">
        <div className={styles.sectionHeading}><h2 id="more-profiles-title">Meet the other trustees</h2><Link href="/board-of-trustees">View all profiles <span aria-hidden="true">→</span></Link></div>
        <div className={styles.otherGrid}>
          {trustees.filter((person) => person.slug !== trustee.slug).map((person) => (
            <Link className={styles.otherProfile} key={person.slug} href={`/board-of-trustees/${person.slug}`}>
              <div className={styles.otherPortrait}><Image src={person.photo} alt="" fill sizes="76px" quality={70} /></div>
              <div><p className={styles.role}>{person.role}</p><h3>{person.name}</h3><p>Batch {person.batch}</p></div>
              <span className={styles.otherArrow} aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
