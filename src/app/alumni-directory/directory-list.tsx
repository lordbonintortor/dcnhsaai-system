"use client";

import Link from "next/link";
import { useState } from "react";
import { filterDirectory, type DirectoryEntry } from "@/lib/alumni-directory";
import { useResource } from "@/lib/use-account";
import styles from "./directory.module.css";

export default function DirectoryList({ myBatchYear, memberProfiles = false }: { myBatchYear?: string; memberProfiles?: boolean }) {
  const [query, setQuery] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const { data, ready, error } = useResource<{ entries: DirectoryEntry[] }>("/api/directory");
  const entries = data?.entries ?? [];
  const years = [...new Set([...entries.map(entry => entry.batchYear), ...(myBatchYear ? [myBatchYear] : []), ...(batchYear ? [batchYear] : [])])].sort((a, b) => Number(b) - Number(a));
  const results = filterDirectory(entries, query, batchYear);
  const hasFilters = Boolean(query || batchYear);

  function resetFilters() { setQuery(""); setBatchYear(""); }

  return (
    <section className={styles.directory}>
      <div className={styles.heading}>
        <div><p className={styles.eyebrow}>Find your City High community</p><h1>Alumni directory</h1><p>{memberProfiles ? "Find fellow alumni by name or batch year. Select a name to view their member profile." : "Search across batches. Only alumni names and batch years appear here."}</p></div>
        {myBatchYear && <Link href="/dashboard/profile">Edit my profile <span aria-hidden="true">↗</span></Link>}
      </div>
      <form className={`${styles.filters} ${!myBatchYear ? styles.publicFilters : ""}`} role="search" aria-label="Search alumni directory" onSubmit={event => event.preventDefault()}>
        <label>Search by name or batch year<input name="directorySearch" type="search" placeholder="e.g. Santos or 2008" value={query} onChange={event => setQuery(event.target.value)} /></label>
        <label>Batch year<select name="batchFilter" value={batchYear} onChange={event => setBatchYear(event.target.value)}><option value="">All batches</option>{years.map(year => <option key={year} value={year}>{year}</option>)}</select></label>
        {myBatchYear && <button type="button" className="button button-outline" onClick={() => { setQuery(""); setBatchYear(myBatchYear); }}>My batch · {myBatchYear}</button>}
      </form>
      <div className={styles.resultBar}>
        <p role="status" aria-live="polite">{!ready ? "Loading directory…" : error ? "Directory unavailable" : `${results.length} ${results.length === 1 ? "result" : "results"}${batchYear ? ` · Batch ${batchYear}` : " · All batches"}`}</p>
        {hasFilters && <button type="button" onClick={resetFilters}>Clear filters</button>}
      </div>
      {error ? <p className="form-error" role="alert">{error}</p> : ready && results.length === 0 ? (
        <div className={styles.empty}><h2>No alumni found</h2><p>Try another name or batch year.</p><button type="button" className="button button-outline" onClick={resetFilters}>Show all alumni</button></div>
      ) : (
        <table className={styles.table}>
          <caption>Alumni names and batch years</caption>
          <thead><tr><th scope="col">Name</th><th scope="col">Batch year</th></tr></thead>
          <tbody>{results.map(entry => <tr key={entry.id}><td>{memberProfiles ? <Link className={styles.memberLink} href={`/dashboard/directory/${encodeURIComponent(entry.id)}`} aria-label={`View profile of ${entry.name}`} prefetch={false}>{entry.name}<span aria-hidden="true"> ↗</span></Link> : entry.name}</td><td>{entry.batchYear}</td></tr>)}</tbody>
        </table>
      )}
      <p className={styles.note}>The directory lists approved alumni. Public listings show only names and batch years.</p>
    </section>
  );
}
