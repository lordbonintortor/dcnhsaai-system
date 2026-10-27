"use client";

import Link from "next/link";
import { professionLabel } from "@/lib/alumni-profile";
import { verificationLabels } from "@/lib/application-review";
import ProfileAvatar from "@/app/profile-avatar";
import { useAlumniProfile } from "./dashboard-shell";
import ApplicationStatus from "./application-status";
import styles from "./dashboard.module.css";

export default function DashboardOverview() {
  const profile = useAlumniProfile();
  const verified = profile.verification === "verified";
  return (
    <>
      <section className={styles.welcome}>
        <div><p className={styles.eyebrow}>Your City High community</p><h1>Welcome, {profile.firstName}.</h1><p>Keep your profile up to date and stay connected with your alumni community.</p><Link className="button" href="/dashboard/profile">View my profile <span aria-hidden="true">↗</span></Link></div>
        <div className={styles.batchArt} aria-hidden="true"><span>Class of</span><strong>{profile.batchYear}</strong><span>City High · Davao</span></div>
      </section>

      <section className={styles.stats} aria-label="Your alumni information">
        <div><span>Registry status</span><strong className={verified ? styles.verified : styles.pending}>{verificationLabels[profile.verification]}</strong><p>{verified ? "Graduate application approved" : profile.verification === "needs_information" ? "Check the request below" : profile.verification === "rejected" ? "See the officer’s decision below" : "Awaiting officer review"}</p></div>
        <div><span>Batch year</span><strong>{profile.batchYear}</strong><p>{profile.section ? `Section ${profile.section}` : "Section not added yet"}</p></div>
        <div><span>Profession / occupation</span><strong className={styles.occupation}>{professionLabel(profile)}</strong><p>Your connection to the alumni network</p></div>
      </section>

      <ApplicationStatus />

      <div className={styles.contentGrid}>
        <section className={styles.card}>
          <div className={styles.cardHeading}><h2>Your alumni profile</h2><Link href="/dashboard/profile">Edit profile <span aria-hidden="true">↗</span></Link></div>
          <div className={styles.profileIdentity}><ProfileAvatar profile={profile} size={58} /><div><h3>{profile.firstName} {profile.lastName}</h3><p>DCNHS · Batch {profile.batchYear}</p></div></div>
          <dl className={styles.profileDetails}><div><dt>Username</dt><dd>{profile.username || "Not assigned"}</dd></div><div><dt>Mobile number</dt><dd>{profile.mobile || "Not added"}</dd></div><div><dt>Section</dt><dd>{profile.section || "Not added"}</dd></div><div><dt>Employer / business</dt><dd>{profile.employers || "Not added"}</dd></div></dl>
        </section>
        <section className={`${styles.card} ${styles.nextSteps}`}>
          <p className={styles.eyebrow}>Make yourself at home</p><h2>Your next steps</h2>
          <ol><li><span>01</span><div><Link href="/dashboard/profile">Review your profile →</Link><p>Add a section, mobile number, or employer.</p></div></li><li><span>02</span><div><Link href="/dashboard/directory">Find your batch →</Link><p>Search alumni by name or batch year.</p></div></li><li><span>03</span><div><Link href="/alumni-projects">Discover alumni projects →</Link><p>Learn where the community can contribute.</p></div></li></ol>
        </section>
      </div>

      <section className={styles.card}>
        <div className={styles.cardHeading}><h2>From the community</h2><span className={styles.sampleLabel}>Sample updates</span></div>
        <div className={styles.updates}>
          <article><span className={styles.updateNumber} aria-hidden="true">01</span><div><p className={styles.updateTag}>Alumni activities</p><h3>Reconnect with your batch</h3><p>Homecomings and batch gatherings will appear here when the association publishes them.</p><details><summary>View preview <span aria-hidden="true">↓</span></summary><p>This sample shows where a future activity’s date, venue, and contact person will appear. No event is scheduled through this demo.</p><Link href="/alumni-association-events">Go to alumni activities →</Link></details></div></article>
          <article><span className={styles.updateNumber} aria-hidden="true">02</span><div><p className={styles.updateTag}>Community projects</p><h3>Give back to City High</h3><p>Discover upcoming opportunities to share your time and experience with the community.</p><details><summary>View preview <span aria-hidden="true">↓</span></summary><p>Project announcements and participation details will be added by association officers. This is sample presentation content.</p><Link href="/alumni-projects">Explore alumni projects →</Link></details></div></article>
        </div>
      </section>
    </>
  );
}
