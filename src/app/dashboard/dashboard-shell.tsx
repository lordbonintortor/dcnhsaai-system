"use client";

import Link from "next/link";
import Image from "next/image";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { type AlumniProfile } from "@/lib/alumni-profile";
import { signOut as signOutAccount } from "@/lib/account-api";
import { useAccount } from "@/lib/use-account";
import ProfileAvatar from "@/app/profile-avatar";
import styles from "./dashboard.module.css";

const ProfileContext = createContext<AlumniProfile | null>(null);

export function useAlumniProfile() {
  const profile = useContext(ProfileContext);
  if (!profile) throw new Error("An alumni profile is required to display this page.");
  return profile;
}

export default function DashboardShell({ children }: { children: ReactNode }) {
  const { profile, officer, ready, error } = useAccount();
  const [signOutError, setSignOutError] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const pathname = usePathname();
  const inDirectory = pathname === "/dashboard/directory" || pathname.startsWith("/dashboard/directory/");
  const router = useRouter();

  useEffect(() => {
    if (ready && !error && !profile) router.replace("/login");
  }, [ready, profile, error, router]);

  async function signOut() {
    setSigningOut(true); setSignOutError("");
    try { await signOutAccount(); router.replace("/login"); }
    catch (cause) { setSignOutError(cause instanceof Error ? cause.message : "Unable to sign out."); setSigningOut(false); }
  }

  if (error) return <main className={styles.loading}><p className="form-error" role="alert">{error}</p><Link href="/login">Go to sign in</Link></main>;

  if (!ready || !profile) return <main className={styles.loading}><p role="status">Opening your alumni portal…</p><Link href="/login">Go to sign in</Link></main>;

  return (
    <ProfileContext.Provider value={profile}>
      <div className={styles.portal}>
        <aside className={styles.sidebar}>
          <Link className={`brand ${styles.brand}`} href="/"><Image className="brand-logo" src="/branding/dcnhsaai-logo.svg" alt="DCNHS Alumni Association seal" width={48} height={48} /><span><strong>DCNHS Alumni</strong><small>Association, Inc.</small></span></Link>
          <p className={styles.navLabel}>Alumni portal</p>
          <nav className={styles.navigation} aria-label="Alumni portal">
            <Link href="/dashboard" aria-current={pathname === "/dashboard" ? "page" : undefined}><span aria-hidden="true">⌂</span> Overview</Link>
            <Link href="/dashboard/application" aria-current={pathname === "/dashboard/application" ? "page" : undefined}><span aria-hidden="true">✓</span> Application status</Link>
            <Link href="/dashboard/directory" aria-current={inDirectory ? "page" : undefined}><span aria-hidden="true">⌕</span> Alumni directory</Link>
            <Link href="/dashboard/profile" aria-current={pathname === "/dashboard/profile" ? "page" : undefined}><span aria-hidden="true">◎</span> My profile</Link>
            {officer && <Link href="/admin"><span aria-hidden="true">⚙</span> Officer dashboard</Link>}
            <Link href="/alumni-association-events"><span aria-hidden="true">◷</span> Alumni activities</Link>
            <Link href="/"><span aria-hidden="true">↗</span> Public website</Link>
          </nav>
          <div className={styles.sidebarBottom}><p><strong>{profile.firstName} {profile.lastName}</strong><span>Batch {profile.batchYear}</span></p><button type="button" onClick={signOut} disabled={signingOut}>{signingOut ? "Signing out…" : "Sign out"} <span aria-hidden="true">→</span></button>{signOutError && <p role="alert">{signOutError}</p>}</div>
        </aside>
        <div className={styles.workspace}>
          <header className={styles.topbar}><span>{pathname === "/dashboard/application" ? "Application status" : pathname === "/dashboard/profile" ? "My profile" : inDirectory ? "Alumni directory" : "Dashboard overview"}</span><div>{officer && <Link className={styles.officerLink} href="/admin">Officer access</Link>}<ProfileAvatar profile={profile} size={36} /></div></header>
          <main className={styles.main}>{children}</main>
          <div className={styles.footer}>DCNHS Alumni Association, Inc. <span>Alumni portal</span></div>
        </div>
      </div>
    </ProfileContext.Provider>
  );
}
