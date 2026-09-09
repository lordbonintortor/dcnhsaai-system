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
- `/register` — two-step demo registration, validation, and completion screen
- `/login` — sign in with a registered browser account or the sample account
- `/dashboard` — alumni overview, registry status, profile summary, and sample community updates
- `/dashboard/profile` — edit and save the current demo account's alumni information
- `/dashboard/directory` — search alumni by name or batch year, filter batches, and jump to your own batch; directory rows show only names and batch years
- `/alumni-association-events`, `/alumni-projects`, `/management-reports`, and `/outstanding-student-and-alumni-awardees` — public page layouts awaiting official content

The Association dropdown contains Alumni Activities, Alumni Projects, Board of Trustees, Management Reports, and Outstanding Student and Alumni Awardees, and closes on an outside click or tap. The duplicate homepage community cards have been removed; the sample news content remains. Both former activity URLs redirect to the combined events page; `/projects-and-benefactors` redirects to `/alumni-projects`.

This version is frontend-only. Registration, sign-in, profile editing, and sign-out work as a browser demo. Account data is stored in this browser, with no server or shared database. Email verification, password recovery, and officer review are not connected.

## Sample account

Open `/login` and sign in with:

- Email: `alumni.demo@example.com`
- Password: `CityHigh2026!`

The sample profile is **Alex Santos, Batch 2008**, with a clearly marked demo verified status. New registrations show **Pending review**. Registration requires alumni information and consent, then matching passwords of at least eight characters. Existing inputs are retained when returning to the first step. Use sample details and a demo-only password.

The **Alumni directory** appears in the signed-in portal navigation and the dashboard's **Find your batch** shortcut. **My profile** includes a preview of the saved directory listing. The directory combines fictional sample entries with accounts registered on this browser; saving a first name, last name, or batch year updates its listing. Entries contain only an internal row ID, display name, and batch year, and have no links to other alumni's private profile editors. Contact information, middle/maiden names, occupation, employment, and credentials are not rendered or searched by the directory. This is still a browser demo; the backend must provide an authorized shared directory that returns only the allowed fields.

Normal sessions use session storage; **Remember me** keeps the demo session in local storage. Accounts and profile edits persist on the same browser until site data is cleared. New passwords are stored as salted PBKDF2 verifiers rather than plaintext. Demo sessions and records are client-controlled and are not production authentication or authorization. The backend phase must replace them before real alumni information is collected. Code is in `src/lib/demo-account.ts`; all storage keys start with `dcnhsaai.demo.`.

See [PROGRESS-REPORT.md](PROGRESS-REPORT.md) for the September 9, 2026 update, recovered changes, and presentation talking points. About content is maintained in `src/lib/association.ts`; the source PDF is not included in the public website. The 2024 portal launch described in the history refers to the association’s earlier website.

Trustee biographies are maintained in `src/lib/trustees.ts`, based on `BOT Brief Bio-2026  BOT.pdf`. The supplied portraits are served from `public/profile`. The 2026 label identifies the source edition, not an inferred term of office.

## Proposed production stack

- Next.js and TypeScript
- PostgreSQL, authentication, and file storage through Supabase
- Vercel deployment

## Before production development

The August 2026 association history and official contact details have been supplied and incorporated. Remaining decisions include the other pages’ official content, branding permissions, final registration fields, verification process, authorized administrators, privacy policy, and rules for publishing reports and donation information.
