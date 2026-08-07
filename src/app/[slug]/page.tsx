import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const pages = {
  "board-of-trustees": {
    eyebrow: "Leadership and governance",
    title: "Board of Trustees",
    intro: "The Board of Trustees provides direction, accountability, and stewardship for the Davao City National High School Alumni Association, Inc.",
    emptyTitle: "Trustee profiles are being prepared",
    emptyText: "Official names, positions, photographs, terms of office, and biographies will be published after confirmation by the association.",
  },
  "management-reports": {
    eyebrow: "Transparency and accountability",
    title: "Management Reports",
    intro: "A central place for approved reports on the association’s operations, accomplishments, finances, and organizational progress.",
    emptyTitle: "Reports will be available here",
    emptyText: "The association will confirm which reports are intended for public access and which should be restricted to authorized members.",
  },
  "projects-and-benefactors": {
    eyebrow: "Impact made together",
    title: "Projects and Benefactors",
    intro: "Learn about association-led projects and recognize the individuals, batches, organizations, and partners who make this work possible.",
    emptyTitle: "Project stories are coming soon",
    emptyText: "Confirmed projects, outcomes, photographs, and benefactor acknowledgements will be added by authorized association officers.",
  },
  "association-activities": {
    eyebrow: "The association in action",
    title: "Association Activities",
    intro: "Updates from general assemblies, sponsored seminars and occasions, charitable works, fund-raising activities, and other association programs.",
    emptyTitle: "No activities published yet",
    emptyText: "Upcoming and completed association activities will appear here once their dates, details, and photographs are approved.",
  },
  "alumni-activities": {
    eyebrow: "Reconnect and remember",
    title: "Alumni Activities",
    intro: "Stay connected through annual homecomings, batch reunions, alumni gatherings, and other community-led activities.",
    emptyTitle: "Alumni activity announcements are coming soon",
    emptyText: "Batch representatives and authorized officers will be able to submit confirmed activity details for publication.",
  },
  "outstanding-student-and-alumni-awardees": {
    eyebrow: "Celebrating excellence",
    title: "Outstanding Student and Alumni Awardees",
    intro: "Honoring students and alumni whose achievements, leadership, and service inspire the wider City High community.",
    emptyTitle: "Awardee profiles are being prepared",
    emptyText: "Official award categories, recipients, citations, photographs, and award years will be published after association approval.",
  },
} as const;

type PageSlug = keyof typeof pages;

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export default async function AssociationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug as PageSlug];
  if (!page) notFound();

  return (
    <main className="content-page">
      <header className="site-header content-header">
        <Link className="brand" href="/">
          <Image className="brand-logo" src="/branding/dcnhsaai-logo.svg" alt="DCNHS Alumni Association seal" width={52} height={52} priority />
          <span><strong>DCNHS Alumni</strong><small>Association, Inc.</small></span>
        </Link>
        <Link className="back-link" href="/">← Back to home</Link>
        <Link className="button button-small" href="/register">Join the registry</Link>
      </header>

      <section className="content-hero">
        <div><p className="eyebrow">{page.eyebrow}</p><h1>{page.title}</h1><p>{page.intro}</p></div>
      </section>

      <section className="content-body">
        <div className="content-empty">
          <span className="empty-seal"><Image src="/branding/dcnhsaai-logo.svg" alt="" width={80} height={80} /></span>
          <p className="prototype-label">Presentation prototype</p>
          <h2>{page.emptyTitle}</h2>
          <p>{page.emptyText}</p>
          <Link href="/">Return to homepage <span>→</span></Link>
        </div>
        <aside>
          <p className="eyebrow gold">About this page</p>
          <h3>Officer-managed content</h3>
          <p>In the completed system, authorized officers will manage this page through a protected administration dashboard.</p>
          <div className="status-card"><span>Status</span><strong>Awaiting official content</strong></div>
        </aside>
      </section>

      <footer className="simple-footer"><span>DCNHS Alumni Association, Inc.</span><span>Prototype for review · 2026</span></footer>
    </main>
  );
}
