import type { Metadata } from "next";
import "./globals.css";
import "./forms.css";

export const metadata: Metadata = {
  title: "DCNHS Alumni Association, Inc.",
  description: "The digital home of the Davao City National High School alumni community.",
  icons: { icon: "/branding/dcnhsaai-logo.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
