import type { Metadata } from "next";
import MemberProfile from "../member-profile";

export const metadata: Metadata = { title: "Alumni profile | DCNHS Alumni" };

export default async function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MemberProfile id={id} />;
}
