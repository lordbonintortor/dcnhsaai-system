import type { AlumniProfile } from "./alumni-profile";

export type DirectoryEntry = { id: string; name: string; batchYear: string; suffix?: string };

export function toDirectoryEntry(profile: Pick<AlumniProfile, "id" | "firstName" | "lastName" | "suffix" | "batchYear">): DirectoryEntry {
  return { id: profile.id, name: `${profile.firstName.trim()} ${profile.lastName.trim()}${profile.suffix ? `, ${profile.suffix.trim()}` : ""}`, batchYear: profile.batchYear, suffix: profile.suffix };
}

// Fictional entries for exploring different batches in the frontend presentation.
export const sampleDirectoryEntries: DirectoryEntry[] = [
  { id: "directory-sample-01", name: "Elena Mercado", batchYear: "1982", suffix: "" },
  { id: "directory-sample-02", name: "Roberto Dela Cruz", batchYear: "1994" },
  { id: "directory-sample-03", name: "Carmen Villanueva", batchYear: "1994" },
  { id: "directory-sample-04", name: "Paolo Mendoza", batchYear: "2000" },
  { id: "directory-sample-05", name: "Maria Dela Peña", batchYear: "2008" },
  { id: "directory-sample-06", name: "Miguel Reyes", batchYear: "2008" },
  { id: "directory-sample-07", name: "Angela Navarro", batchYear: "2012" },
  { id: "directory-sample-08", name: "Daniel Bautista", batchYear: "2015" },
  { id: "directory-sample-09", name: "Bea Castillo", batchYear: "2015" },
  { id: "directory-sample-10", name: "Gabriel Flores", batchYear: "2020" },
  { id: "directory-sample-11", name: "Sofia Ramos", batchYear: "2024" },
];

function searchable(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export function filterDirectory(entries: DirectoryEntry[], query: string, batchYear: string) {
  const terms = searchable(query).split(/\s+/).filter(Boolean);
  return entries.filter(entry => {
    const text = searchable(`${entry.name} ${entry.batchYear}`);
    return (!batchYear || entry.batchYear === batchYear) && terms.every(term => text.includes(term));
  });
}
