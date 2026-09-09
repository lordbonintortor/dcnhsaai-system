"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { filterDirectory, type DirectoryEntry } from "@/lib/alumni-directory";
import { demoDirectory } from "@/lib/demo-account";
import { subscribeToDemoChanges } from "@/lib/use-demo-account";
import { useAlumniProfile } from "../dashboard-shell";
import styles from "./directory.module.css";

function snapshot(): string {
  try { return JSON.stringify(demoDirectory()); }
  catch { return "storage-error"; }
}
const serverSnapshot = () => undefined;

export default function AlumniDirectory() {
  const profile = useAlumniProfile();
  const [query, setQuery] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const stored = useSyncExternalStore<string | undefined>(subscribeToDemoChanges, snapshot, serverSnapshot);
  const entries = useMemo<DirectoryEntry[]>(() => stored && stored !== "storage-error" ? JSON.parse(stored) : [], [stored]);
  const years = [...new Set([...entries.map(entry => entry.batchYear), profile.batchYear, ...(batchYear ? [batchYear] : [])])].sort((a, b) => Number(b) - Number(a));
  const results = filterDirectory(entries, query, batchYear);
  const hasFilters = Boolean(query || batchYear);

  function resetFilters() { setQuery(""); setBatchYear(""); }

  return (
    <section className={styles.directory}>
      <div className={styles.heading}>
        <div><p className={styles.eyebrow}>Find your City High community</p><h1>Alumni directory</h1><p>Search across batches. Only alumni names and batch years appear here.</p></div>
        <Link href="/dashboard/profile">Edit my profile <span aria-hidden="true">↗</span></Link>
      </div>
      <form className={styles.filters} role="search" aria-label="Search alumni directory" onSubmit={event => event.preventDefault()}>
        <label>Search by name or batch year<input name="directorySearch" type="search" placeholder="e.g. Santos or 2008" value={query} onChange={event => setQuery(event.target.value)} /></label>
        <label>Batch year<select name="batchFilter" value={batchYear} onChange={event => setBatchYear(event.target.value)}><option value="">All batches</option>{years.map(year => <option key={year} value={year}>{year}</option>)}</select></label>
        <button type="button" className="button button-outline" onClick={() => { setQuery(""); setBatchYear(profile.batchYear); }}>My batch · {profile.batchYear}</button>
      </form>
      <div className={styles.resultBar}>
        <p role="status" aria-live="polite">{stored === undefined ? "Loading directory…" : stored === "storage-error" ? "Directory unavailable" : `${results.length} ${results.length === 1 ? "result" : "results"}${batchYear ? ` · Batch ${batchYear}` : " · All batches"}`}</p>
        {hasFilters && <button type="button" onClick={resetFilters}>Clear filters</button>}
      </div>
      {stored === "storage-error" ? <p className="form-error" role="alert">The demo directory could not be loaded. Check that browser storage is available, then reload the page.</p> : stored !== undefined && results.length === 0 ? (
        <div className={styles.empty}><h2>No alumni found</h2><p>Try another name or batch year.</p><button type="button" className="button button-outline" onClick={resetFilters}>Show all alumni</button></div>
      ) : (
        <table className={styles.table}>
          <caption>Alumni names and batch years</caption>
          <thead><tr><th scope="col">Name</th><th scope="col">Batch year</th></tr></thead>
          <tbody>{results.map(entry => <tr key={entry.id}><td>{entry.name}</td><td>{entry.batchYear}</td></tr>)}</tbody>
        </table>
      )}
      <p className={styles.note}>Demo directory · Sample entries and accounts saved on this browser.</p>
    </section>
  );
}
