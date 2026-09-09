import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const pages = {
  "management-reports": {
    eyebrow: "Transparency and accountability",
    title: "Management Reports",
    intro: "A central place for approved reports on the association’s operations, accomplishments, finances, and organizational progress.",
    emptyTitle: "Reports will be available here",
    emptyText: "The association will confirm which reports are intended for public access and which should be restricted to authorized members.",
  },
  "alumni-projects": {
    eyebrow: "Impact made together",
    title: "Alumni Projects",
    intro: "Discover projects led by alumni and the association, and recognize the individuals, batches, organizations, and partners who make this work possible.",
    emptyTitle: "Project stories are coming soon",
    emptyText: "Confirmed projects, outcomes, photographs, and benefactor acknowledgements will be added by authorized association officers.",
  },
  "alumni-association-events": {
    eyebrow: "Our community in action",
    title: "Alumni & Association Events",
    intro: "Stay connected through annual homecomings, batch reunions, general assemblies, seminars, charitable works, fund-raising activities, and other alumni and association gatherings.",
    emptyTitle: "Community events are coming soon",
    emptyText: "Upcoming and completed events from alumni batches and the association will appear here once their dates, details, and photographs are approved.",
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
