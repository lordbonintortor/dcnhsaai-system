import type { Metadata } from "next";
import DashboardShell from "./dashboard-shell";

export const metadata: Metadata = { title: "Alumni dashboard | DCNHS Alumni", robots: { index: false, follow: false } };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
