"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileAvatar from "@/app/profile-avatar";
import { verificationLabels, type VerificationStatus } from "@/lib/application-review";
import { signOutDemoOfficer } from "@/lib/demo-account";
import { useDemoApplications, useDemoOfficer } from "@/lib/use-demo-officer";
import ApplicationDetails from "./application-details";
import styles from "./officer.module.css";

const PAGE_SIZE = 10;
const statuses = Object.keys(verificationLabels) as VerificationStatus[];
const searchable = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export default function OfficerDashboard() {
  const officer = useDemoOfficer();
  const router = useRouter();
  useEffect(() => { if (officer.ready && !officer.name) router.replace("/admin/login"); }, [officer.ready, officer.name, router]);

  function signOut() { signOutDemoOfficer(); router.replace("/admin/login"); }

  if (!officer.ready || !officer.name) return <main className={styles.loading}><p role="status">Opening officer portal…</p><Link href="/admin/login">Officer sign in</Link></main>;

  return (
    <div className={styles.portal}>
      <header className={styles.header}>
        <Link className={`brand ${styles.brand}`} href="/"><Image className="brand-logo" src="/branding/dcnhsaai-logo.svg" alt="DCNHS Alumni Association seal" width={48} height={48} loading="eager" /><span><strong>DCNHS Alumni</strong><small>Officer portal</small></span></Link>
        <div className={styles.headerActions}><span>{officer.name}</span><button type="button" onClick={signOut}>Sign out</button></div>
      </header>
      <main className={styles.main}>
        <div className={styles.heading}><div><p className={styles.eyebrow}>Alumni registry · Officer review</p><h1>Every graduate, accounted for.</h1><p>Review applications, request clarification, and keep a record of each decision.</p></div><span className={styles.demoBadge}>Browser demo</span></div>
        <aside className={styles.policy} aria-label="Verification policy"><strong>Eligibility: DCNHS graduates only.</strong><p>Use fictional information to try this workflow. Reference sources and retention rules still need association approval. Proof uploads and email notices are not enabled.</p></aside>
        <ApplicationQueue />
      </main>
      <div className={styles.footer}><span>DCNHS Alumni Association, Inc.</span><span>Demo decisions and accounts stay on this browser.</span></div>
    </div>
  );
}

function ApplicationQueue() {
  const { applications, ready, error } = useDemoApplications();
  const [status, setStatus] = useState<VerificationStatus | "all">("pending");
  const [query, setQuery] = useState("");
  const [batch, setBatch] = useState("");
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const terms = searchable(query).split(/\s+/).filter(Boolean);
  const filtered = applications.filter(profile => (status === "all" || profile.verification === status)
    && (!batch || profile.batchYear === batch)
    && terms.every(term => searchable(`${profile.firstName} ${profile.middleName} ${profile.lastName} ${profile.email} ${profile.batchYear}`).includes(term)));
  const years = [...new Set(applications.map(profile => profile.batchYear))].sort((a, b) => Number(b) - Number(a));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const visible = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
  const selected = applications.find(profile => profile.id === selectedId);

  function resetSelection() { setPage(0); setSelectedId(null); setSuccess(""); }
  function clearFilters() { setStatus("all"); setQuery(""); setBatch(""); resetSelection(); }

  if (!ready) return <p role="status">Loading applications…</p>;
  if (error) return <p className="form-error" role="alert">Applications could not be loaded. Check browser storage and sign in to the officer demo again.</p>;

  return (
    <>
      <div className={styles.stats} aria-label="Application counts">
        {statuses.map(value => <button type="button" key={value} aria-pressed={status === value} onClick={() => { setStatus(value); resetSelection(); }}><span>{verificationLabels[value]}</span><strong>{applications.filter(profile => profile.verification === value).length}</strong><small>{value === "pending" ? "Awaiting a decision" : value === "needs_information" ? "Waiting for the applicant" : value === "verified" ? "Approved in this demo" : "Review completed"}</small></button>)}
      </div>
      <section className={styles.filters} aria-label="Filter applications">
        <label>Search applications<input type="search" name="applicationSearch" placeholder="Name, email, or batch year" value={query} onChange={event => { setQuery(event.target.value); resetSelection(); }} /></label>
        <label>Review status<select name="reviewStatusFilter" value={status} onChange={event => { setStatus(event.target.value as VerificationStatus | "all"); resetSelection(); }}><option value="all">All statuses</option>{statuses.map(value => <option key={value} value={value}>{verificationLabels[value]}</option>)}</select></label>
        <label>Batch year<select name="applicationBatch" value={batch} onChange={event => { setBatch(event.target.value); resetSelection(); }}><option value="">All batches</option>{years.map(year => <option key={year} value={year}>{year}</option>)}</select></label>
        <button type="button" onClick={clearFilters}>Clear filters</button>
      </section>
      {success && <p className="form-success" role="status">{success}</p>}
      <div className={styles.workbench}>
        <section className={styles.queue} aria-label="Applications">
          <div className={styles.queueHeading}><h2>Applications</h2><span role="status">{filtered.length} {filtered.length === 1 ? "result" : "results"}</span></div>
          {!visible.length ? <div className={styles.empty}><h3>No matching applications</h3><p>Adjust the filters, or register a fictional graduate to try the review process.</p><Link href="/register">Create a demo registration →</Link></div> : (
            <ul className={styles.applicationList}>{visible.map(profile => <li key={profile.id}><button type="button" aria-pressed={selectedId === profile.id} onClick={() => { setSelectedId(profile.id); setSuccess(""); }}><ProfileAvatar profile={profile} size={42} /><span className={styles.rowInfo}><strong>{profile.firstName} {profile.lastName}</strong><span>Batch {profile.batchYear}</span><span className={styles.status} data-status={profile.verification}>{verificationLabels[profile.verification]}</span></span><span aria-hidden="true">↗</span></button></li>)}</ul>
          )}
          <div className={styles.pagination}><button type="button" disabled={currentPage === 0} onClick={() => { setPage(currentPage - 1); setSelectedId(null); }}>Previous</button><span>Page {currentPage + 1} of {totalPages}</span><button type="button" disabled={currentPage + 1 >= totalPages} onClick={() => { setPage(currentPage + 1); setSelectedId(null); }}>Next</button></div>
          <p className={styles.queueNote}>{applications.length} demo {applications.length === 1 ? "account" : "accounts"} on this browser. Fictional directory-only entries are not applications.</p>
        </section>
        {selected ? <ApplicationDetails key={`${selected.id}:${selected.updatedAt ?? selected.createdAt}`} profile={selected} onSaved={() => setSuccess("Decision saved. The applicant’s dashboard now shows the updated status and message on this browser.")} /> : <section className={styles.selectionEmpty}><span aria-hidden="true">◎</span><h2>A considered decision starts here.</h2><p>Select an application to see the graduate’s details, review history, and available actions.</p><p className={styles.selectionHint}>A photo or email address alone does not confirm graduation.</p></section>}
      </div>
    </>
  );
}
