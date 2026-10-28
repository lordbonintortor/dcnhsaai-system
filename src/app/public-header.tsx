"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { signOut } from "@/lib/account-api";
import { useAccount } from "@/lib/use-account";
import ProfileAvatar from "./profile-avatar";

export default function PublicHeader({ children }: { children: React.ReactNode }) {
  const { profile, ready } = useAccount();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    setSignOutError("");
    try {
      await signOut();
    } catch (cause) {
      setSignOutError(cause instanceof Error ? cause.message : "Unable to sign out.");
      setSigningOut(false);
    }
  }

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="DCNHS Alumni home">
        <Image className="brand-logo" src="/branding/dcnhsaai-logo.svg" alt="DCNHS Alumni Association seal" width={52} height={52} priority />
        <span>
          <strong>DCNHS Alumni</strong>
          <small>Association, Inc.</small>
        </span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        <Link href="/about">About Us</Link>
        {children}
      </nav>
      <div className="header-actions">
        {ready && profile ? (
          <div className="public-profile">
            <Link className="public-profile-link" href="/dashboard/profile" aria-label={`Open ${profile.firstName} ${profile.lastName}'s profile`}>
              <ProfileAvatar profile={profile} size={36} />
              <span className="public-profile-copy"><strong>{profile.firstName} {profile.lastName}</strong><small>My profile</small></span>
            </Link>
            <button type="button" className="public-sign-out" onClick={handleSignOut} disabled={signingOut}>
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
            {signOutError && <span className="public-sign-out-error" role="alert">{signOutError}</span>}
          </div>
        ) : (
          <>
            <Link className="text-link" href="/login">Sign in</Link>
            <Link className="button button-small" href="/register">Join the registry</Link>
          </>
        )}
      </div>
      <button className="mobile-menu-button" type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>
        <span className="visually-hidden">Toggle navigation</span>
        <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
      </button>
      {menuOpen && (
        <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation" onClick={(event) => {
          if ((event.target as HTMLElement).closest("a")) setMenuOpen(false);
        }}>
          <Link href="/about">About Us</Link>
          {children}
        </nav>
      )}
    </header>
  );
}
