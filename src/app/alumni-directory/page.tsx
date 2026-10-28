import Link from "next/link";
import type { Metadata } from "next";
import DirectoryList from "./directory-list";
import styles from "./directory.module.css";
import AssociationDropdown from "../association-dropdown";
import PublicHeader from "../public-header";

export const metadata: Metadata = {
  title: "Alumni directory | DCNHS Alumni",
  description: "Find DCNHS alumni by name and batch year. Browse the public alumni directory without signing in.",
};

export default function PublicDirectoryPage() {
  return (
    <main className={styles.publicPage}>
      <PublicHeader>
        <AssociationDropdown>
          <Link href="/alumni-association-events">Alumni Activities</Link>
          <Link href="/alumni-projects">Alumni Projects</Link>
          <Link href="/board-of-trustees">Board of Trustees</Link>
          <Link href="/management-reports">Management Reports</Link>
          <Link href="/association-documents">Association Documents</Link>
          <Link href="/outstanding-student-and-alumni-awardees">Outstanding Student and Alumni Awardees</Link>
        </AssociationDropdown>
        <Link href="/alumni-directory">Alumni Directory</Link>
        <Link className="button button-small donate-button" href="/donate">Donate</Link>
      </PublicHeader>
      <div className={styles.publicContent}><DirectoryList /></div>
      <footer className="simple-footer"><Link href="/">← Back to home</Link><span>DCNHS Alumni Association, Inc.</span><span>2026</span></footer>
    </main>
  );
}
