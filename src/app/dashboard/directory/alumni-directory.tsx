"use client";

import DirectoryList from "@/app/alumni-directory/directory-list";
import { useAlumniProfile } from "../dashboard-shell";

export default function AlumniDirectory() {
  const profile = useAlumniProfile();
  return <><p>{profile.verification === "verified" ? "Select an alumnus to view their member profile." : "You can view fellow alumni’s member profiles after your application is approved."}</p><DirectoryList myBatchYear={profile.batchYear} memberProfiles={profile.verification === "verified"} /></>;
}
