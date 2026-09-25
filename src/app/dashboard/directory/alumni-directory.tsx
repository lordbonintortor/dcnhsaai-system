"use client";

import DirectoryList from "@/app/alumni-directory/directory-list";
import { useAlumniProfile } from "../dashboard-shell";

export default function AlumniDirectory() {
  const profile = useAlumniProfile();
  return <DirectoryList myBatchYear={profile.batchYear} memberProfiles />;
}
