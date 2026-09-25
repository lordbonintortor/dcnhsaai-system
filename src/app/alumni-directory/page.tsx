import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import DirectoryList from "./directory-list";
import styles from "./directory.module.css";

export const metadata: Metadata = {
  title: "Alumni directory | DCNHS Alumni",
  description: "Find DCNHS alumni by name and batch year. Browse the public alumni directory without signing in.",
};

export default function PublicDirectoryPage() {
  return (
    <main className={styles.publicPage}>
      <header className="site-header content-header">
        <Link className="brand" href="/" aria-label="DCNHS Alumni home"><Image className="brand-logo" src="/branding/dcnhsaai-logo.svg" alt="DCNHS Alumni Association seal" width={52} height={52} loading="eager" /><span><strong>DCNHS Alumni</strong><small>Association, Inc.</small></span></Link>
        <Link className="back-link" href="/">← Back to home</Link>
        <Link className="button button-small" href="/register">Join the registry</Link>
      </header>
      <div className={styles.publicContent}><DirectoryList /></div>
      <footer className="simple-footer"><Link href="/">← Back to home</Link><span>DCNHS Alumni Association, Inc.</span><span>Prototype for review · 2026</span></footer>
    </main>
  );
}
