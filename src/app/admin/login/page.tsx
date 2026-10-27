import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Sign in | DCNHS Alumni" };

export default function OfficerLoginPage() {
  redirect("/login");
}
