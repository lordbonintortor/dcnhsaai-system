import type { Metadata } from "next";
import ApplicationStatus from "../application-status";
import styles from "../dashboard.module.css";

export const metadata: Metadata = { title: "Application status | DCNHS Alumni" };

export default function ApplicationPage() {
  return (
    <>
      <h1>Application status</h1>
      <p className={styles.intro}>Follow your graduate application, read the officer’s decision, and respond to requests for information.</p>
      <ApplicationStatus />
    </>
  );
}
