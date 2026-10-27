import Image from "next/image";
import Link from "next/link";

export default function BoardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="content-page">
      <header className="site-header content-header">
        <Link className="brand" href="/" aria-label="DCNHS Alumni home">
          <Image className="brand-logo" src="/branding/dcnhsaai-logo.svg" alt="DCNHS Alumni Association seal" width={52} height={52} />
          <span><strong>DCNHS Alumni</strong><small>Association, Inc.</small></span>
        </Link>
        <Link className="back-link" href="/">← Back to home</Link>
        <Link className="button button-small" href="/about">About the association</Link>
      </header>
      {children}
      <footer className="simple-footer">
        <Link href="/">← Back to home</Link>
        <span>DCNHS Alumni Association, Inc.</span>
        <span>2026</span>
      </footer>
    </div>
  );
}
