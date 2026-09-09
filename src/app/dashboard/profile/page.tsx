import type { Metadata } from "next";
import ProfileEditor from "./profile-editor";

export const metadata: Metadata = { title: "My alumni profile | DCNHS Alumni" };
export default function ProfilePage() { return <ProfileEditor />; }
