import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { alumniProjects } from "@/lib/alumni-projects";
import ActivityPost from "@/app/activity-post";
import { tionkoDayActivity } from "@/lib/activity-post";

type AssociationDocument = {
  title: string;
  description: string;
  href: string;
};

type AssociationPage = {
  eyebrow: string;
  title: string;
  intro: string;
  emptyTitle: string;
  emptyText: string;
  documents?: AssociationDocument[];
  reports?: AssociationDocument[];
  projectYears?: string[];
  activity?: typeof tionkoDayActivity;
};

const pages: Record<string, AssociationPage> = {
  "management-reports": {
    eyebrow: "Transparency and accountability",
    title: "Management Reports",
    intro: "A central place for approved reports on the association’s operations, accomplishments, finances, and organizational progress.",
    emptyTitle: "Financial reports",
    emptyText: "Approved financial reports are available to authorized association officers.",
    reports: [
      {
        title: "2025 Financial Report",
        description: "Annual financial report of the DCNHS Alumni Association, Inc.",
        href: "/api/documents/management-reports/2025-financial-report-dcnhsaai",
      },
    ],
  },
  "association-documents": {
    eyebrow: "Official association records",
    title: "Association Documents",
    intro: "Access official registration and compliance documents of the Davao City National High School Alumni Association, Inc.",
    emptyTitle: "Official documents",
    emptyText: "View or download the association’s current registration and tax compliance records.",
    documents: [
      {
        title: "SEC Certificate of Incorporation",
        description: "Official SEC Certificate of Incorporation for the DCNHS Alumni Association, Inc.",
        href: "/documents/sec-coi-dcnhsaai.pdf",
      },
      {
        title: "BIR Form 2023 COR",
        description: "BIR Certificate of Registration document for signed-in alumni and officers.",
        href: "/api/documents/bir-form-2023-cor",
      },
    ],
  },
  "alumni-projects": {
    eyebrow: "Impact made together",
    title: "Alumni Projects",
    intro: "Discover projects led by alumni and the association, and recognize the individuals, batches, organizations, and partners who make this work possible.",
    emptyTitle: "Projects by year",
    emptyText: "Select a year to explore the projects completed by the Alumni Association.",
    projectYears: Object.keys(alumniProjects).reverse(),
  },
  "alumni-association-events": {
    eyebrow: "Our community in action",
    title: "Alumni & Association Events",
    intro: "Stay connected through annual homecomings, batch reunions, general assemblies, seminars, charitable works, fund-raising activities, and other alumni and association gatherings.",
    emptyTitle: "Activity posts",
    emptyText: "Read the association's activity posts, celebrations, and community events.",
    activity: tionkoDayActivity,
  },
  "outstanding-student-and-alumni-awardees": {
    eyebrow: "Celebrating excellence",
    title: "Outstanding Student and Alumni Awardees",
    intro: "Honoring students and alumni whose achievements, leadership, and service inspire the wider City High community.",
    emptyTitle: "Awardee profiles are being prepared",
    emptyText: "Recognizing students and alumni for achievement, leadership, and service.",
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
          {!page.activity && <><h2>{page.emptyTitle}</h2><p>{page.emptyText}</p></>}
          {page.documents || page.reports ? (
            <div className="document-list">
              {(page.documents ?? page.reports ?? []).map((document) => (
                <div className="document-card" key={document.href}>
                  <div>
                    <h3>{document.title}</h3>
                    <p>{document.description}</p>
                  </div>
                  <a href={document.href} target="_blank" rel="noreferrer">
                    View document <span>↗</span>
                  </a>
                </div>
              ))}
            </div>
          ) : page.projectYears ? (
            <div className="project-year-grid">
              {page.projectYears.map((year) => (
                <Link className="project-year-card" href={`/alumni-projects/${year}`} key={year}>
                  <span className="project-year-label">Projects completed</span>
                  <strong>{year}</strong>
                  <span className="project-year-link">View projects <span aria-hidden="true">↗</span></span>
                </Link>
              ))}
            </div>
          ) : page.activity ? (
            <article className="activity-article">
              <p className="eyebrow gold">{page.activity.date}</p>
              <h2>{page.activity.title}</h2>
              <p className="activity-lead">{page.activity.summary}</p>
              <p>{page.activity.body}</p>
              <ActivityPost slug={page.activity.slug} images={page.activity.images} />
            </article>
          ) : (
            <Link href="/">Return to homepage <span>→</span></Link>
          )}
        </div>
        <aside>
          <p className="eyebrow gold">About this page</p>
          <h3>Association information</h3>
          <p>Official information and updates from the DCNHS Alumni Association.</p>
          <div className="status-card"><span>Access</span><strong>{page.documents ? "Public and member access" : page.reports ? "Officer access only" : "Public information"}</strong></div>
        </aside>
      </section>

      <footer className="simple-footer"><span>DCNHS Alumni Association, Inc.</span><span>2026</span></footer>
    </main>
  );
}
