import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { alumniProjects } from "@/lib/alumni-projects";

type Props = { params: Promise<{ year: string }> };

export function generateStaticParams() {
  return Object.keys(alumniProjects).map((year) => ({ year }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  return { title: `Alumni Projects ${year} | DCNHS Alumni Association, Inc.` };
}

export default async function AlumniProjectsYearPage({ params }: Props) {
  const { year } = await params;
  const projects = alumniProjects[year];
  if (!projects) notFound();

  return (
    <main className="content-page">
      <header className="site-header content-header">
        <Link className="brand" href="/">
          <Image className="brand-logo" src="/branding/dcnhsaai-logo.svg" alt="DCNHS Alumni Association seal" width={52} height={52} priority />
          <span><strong>DCNHS Alumni</strong><small>Association, Inc.</small></span>
        </Link>
        <Link className="back-link" href="/alumni-projects">← All project years</Link>
        <Link className="button button-small" href="/register">Join the registry</Link>
      </header>

      <section className="content-hero">
        <div>
          <p className="eyebrow">Alumni Association Projects</p>
          <h1>{year} Projects</h1>
          <p>Projects completed by the DCNHS Alumni Association in {year}.</p>
        </div>
      </section>

      <section className="project-detail-body">
        {projects.map((project, index) => (
          <article className="project-detail-card" key={project.title}>
            <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
            </div>
          </article>
        ))}
      </section>

      <footer className="simple-footer"><span>DCNHS Alumni Association, Inc.</span><span>{year} projects</span></footer>
    </main>
  );
}
