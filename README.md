# DCNHS Alumni Association Website

Presentation prototype for the Davao City National High School Alumni Association, Inc.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Prototype routes

- `/` — public website concept
- `/about` — association history, leadership, and contact information from the August 2026 association document
- `/board-of-trustees` — overview of the three trustees in the supplied 2026 brief biographies
- `/board-of-trustees/niceforo-solis`, `/board-of-trustees/merle-bobilles`, and `/board-of-trustees/ruth-arancel` — individual portraits and career profiles
- `/register` — alumni registration concept
- `/login` — alumni sign-in concept
- `/alumni-association-events`, `/alumni-projects`, `/management-reports`, and `/outstanding-student-and-alumni-awardees` — public page layouts awaiting official content

The Association dropdown follows this order: Board of Trustees, Alumni Activities, Alumni Projects, Management Reports, and Outstanding Student and Alumni Awardees. The duplicate homepage community cards have been removed; the sample news content remains. Both former activity URLs redirect to the combined events page; `/projects-and-benefactors` redirects to `/alumni-projects`.

This version is intentionally frontend-only. Form data is not submitted or saved.

See [PROGRESS-REPORT.md](PROGRESS-REPORT.md) for the September 9, 2026 update, recovered changes, and presentation talking points. About content is maintained in `src/lib/association.ts`; the source PDF is not included in the public website. The 2024 portal launch described in the history refers to the association’s earlier website.

Trustee biographies are maintained in `src/lib/trustees.ts`, based on `BOT Brief Bio-2026  BOT.pdf`. The supplied portraits are served from `public/profile`. The 2026 label identifies the source edition, not an inferred term of office.

## Proposed production stack

- Next.js and TypeScript
- PostgreSQL, authentication, and file storage through Supabase
- Vercel deployment

## Before production development

The August 2026 association history and official contact details have been supplied and incorporated. Remaining decisions include the other pages’ official content, branding permissions, final registration fields, verification process, authorized administrators, privacy policy, and rules for publishing reports and donation information.
