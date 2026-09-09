import type { Metadata } from "next";
import AlumniDirectory from "./alumni-directory";

export const metadata: Metadata = { title: "Alumni directory | DCNHS Alumni" };

export default function DirectoryPage() { return <AlumniDirectory />; }
