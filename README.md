# DCNHS Alumni Association Website

Website and alumni registry for the Davao City National High School Alumni Association, Inc.

Deployment target: Vercel for now, with Hostinger planned later. Both use the same Supabase project. Local Vercel build configuration is prepared; deployment and account/team setup are pending. See [deployment steps and plan requirements](docs/DEPLOYMENT.md).

## Current development — October 26, 2026

**October 27 username-only update:** Alumni and officers now use username/password sign-in. Account email fields have been removed. The user applied [the username-only migration](supabase/migrations/202610270002_username_only.sql), cleared the old accounts, and saved the server secret key. Read-only checks verified the connection and a healthy local website. The user then reported successful fresh alumni registration/sign-in, officer sign-in, approval, Verified status, and public-directory visibility. Production hosting and the remaining live checks are pending. For a new environment, follow [the deployment guide](docs/DEPLOYMENT.md); the username-only migration supports both earlier schema states.

The account screens now use server APIs backed by Supabase Auth, PostgreSQL, and private photo storage. Registration starts at pending review. Officers can approve, request details, or reject; applicants sign in to read messages and resubmit. Automated emails remain disabled. Approved alumni appear in the public name-and-batch directory and can view other approved members’ basic profiles.

**Local Supabase connection verified; production deployment is pending.** The user has created the project, applied the migration, configured authentication, and saved local connection variables. The website health, public-directory endpoint, and signed-out access checks pass. On October 27, the user reported that the guided registration/sign-in, officer-login, and request-details/resubmission/approval tests passed, including approved-directory visibility. Hosting setup and final checks on the hosted site are next. Missing configuration returns a service error; the website does not fall back to browser-only accounts. The historical demo credentials below do not work in this version.

Use Node.js 22 or 24. For a new environment, copy `.env.example` to `.env.local` and follow [the deployment guide](docs/DEPLOYMENT.md) for Supabase configuration, Hostinger setup, and live verification. The Supabase migration has been applied by the user; production hosting has not been deployed yet.

```bash
npm ci
npm run lint
npm test
npm run build -- --webpack
npm run dev
```

The sections below document the earlier presentation prototype and remain as historical reference.

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
- `/alumni-directory` — public name-and-batch directory with search and batch filtering; no sign-in required
- `/dashboard` — alumni overview, registry status, profile summary, and sample community updates
- `/dashboard/application` — application status, officer messages, history, and correction/resubmission guidance without automated emails
- `/dashboard/profile` — edit and save the current demo account's alumni information
- `/dashboard/directory` — search alumni by name or batch year, filter batches, and jump to your own batch; directory rows show only names and batch years
- `/dashboard/directory/[id]` — signed-in alumni can view a fellow alumnus's name, batch year, profile photo, and profession
- `/admin/login` — separate officer demo sign-in
- `/admin` — graduate application queue, search and filters, review decisions, and review history
- `/alumni-association-events`, `/alumni-projects`, `/management-reports`, and `/outstanding-student-and-alumni-awardees` — public page layouts awaiting official content

The Association dropdown contains Alumni Activities, Alumni Projects, Board of Trustees, Management Reports, and Outstanding Student and Alumni Awardees, and closes on an outside click or tap. The duplicate homepage community cards have been removed; the sample news content remains. Both former activity URLs redirect to the combined events page; `/projects-and-benefactors` redirects to `/alumni-projects`.

This version is frontend-only. Registration, sign-in, profile editing, sign-out, and officer review work as a browser demo. Account data is stored in this browser, with no server or shared database. Production authentication, school-record verification, email verification, password recovery, and proof-document storage are not connected.

## Sample account

### Pending application sample

**Jamie Reyes, Batch 2015** starts at **Pending review** and appears automatically in the officer queue, without registration. Sign in at `/login` with `pending.demo@example.com` / `Pending2026!`. Review Jamie at `/admin` using the officer demo account below. Decisions and profile edits persist on the same browser; signing in again does not reset the sample to pending. The original Alex Santos sample remains available separately. These are fictional browser-demo accounts.

Open `/login` and sign in with:

- Email: `alumni.demo@example.com`
- Password: `CityHigh2026!`

The sample profile is **Alex Santos, Batch 2008**, with a clearly marked demo verified status. New registrations show **Pending review**. Registration requires alumni information and consent, then matching passwords of at least eight characters. Existing inputs are retained when returning to the first step. Use sample details and a demo-only password.

Registration also accepts an **optional profile photo** (JPG, PNG, or WebP, up to 5 MB), with a circular preview and change/remove controls. Photos are center-cropped and resized to a 256×256 JPEG before being saved with the browser demo account. The photo carries through both registration steps and appears in the dashboard header and profile summary. **My profile** lets users replace or remove it and save their changes. Accounts without photos retain initials; existing browser accounts remain compatible. Photos stay on this browser and are not included in directory listings. Production photo storage remains part of the backend phase.

The public **Alumni Directory** appears immediately after **Association** in the homepage navigation and opens `/alumni-directory` without requiring sign-in. Its entries display only first/last names and batch years, with name/year search and a batch filter. Public rows have no profile links or photos, including when a visitor already has an alumni session. The signed-in portal retains its directory and **Find your batch** shortcut, with **My batch** and **Edit my profile** controls available there. Both tables use the same projected entries, containing only an internal row ID, display name, and batch year, and search only names and years.

Inside the alumni portal, selecting a name opens a **member profile** with name, batch year, photo (or initials), and profession. Member-profile lookup requires an alumni demo session and returns an explicit subset of fields; it excludes contact details, middle/maiden names, employer, section/adviser, credentials, and application-review records. Fictional name-only samples show “Not provided” for profession. **My profile** explains both audiences and links to a preview of the saved member profile; registration also explains this visibility. Unknown profiles show a return-to-directory state, and signed-out visits redirect to alumni sign-in.

The directory combines fictional sample entries with accounts registered on this browser; saving profile details updates the corresponding listing and member profile. This remains a browser demo: records and sessions are client-controlled. The backend must enforce membership access to member profiles and return only names and batch years to public visitors before real alumni data is used.

Normal sessions use session storage; **Remember me** keeps the demo session in local storage. Accounts and profile edits persist on the same browser until site data is cleared. New passwords are stored as salted PBKDF2 verifiers rather than plaintext. Demo sessions and records are client-controlled and are not production authentication or authorization. The backend phase must replace them before real alumni information is collected. Code is in `src/lib/demo-account.ts`; all storage keys start with `dcnhsaai.demo.`.

See [PROGRESS-REPORT.md](PROGRESS-REPORT.md) for the September 9 and September 25, 2026 updates, recovered changes, and presentation talking points. About content is maintained in `src/lib/association.ts`; the source PDF is not included in the public website. The 2024 portal launch described in the history refers to the association’s earlier website.

Trustee biographies are maintained in `src/lib/trustees.ts`, based on `BOT Brief Bio-2026  BOT.pdf`. The supplied portraits are served from `public/profile`. The 2026 label identifies the source edition, not an inferred term of office.

## Officer review demo

**October 15 simplification:** Officers now use three direct actions: **Approve**, **Request further details**, and **Reject**. Request further details and Reject open a message dialog. Send remains disabled until a nonblank message is entered; only Send saves the decision and displays the message on the applicant dashboard. Cancel or Escape closes the dialog without saving. Approve works without a message and does not send a drafted message. Reference fields and the confirmation checkbox remain removed. Decisions record the officer and time. Repeating the current status is disabled. Historical records remain readable; the earlier multi-decision walkthrough below describes the previous form.

Eligibility is **DCNHS graduates only**, confirmed September 25, 2026. Registration states this requirement and includes it in the applicant declaration. A declaration, email address, or avatar does not establish graduation.

Open `/admin/login` (also linked from alumni sign-in) with:

- Email: `officer.demo@example.com`
- Password: `Review2026!`

Register a fictional graduate in the same browser, then review the application at `/admin`. The queue includes actual browser demo accounts and the original Alex Santos sample, not the directory's fictional name-only rows. Search by name, email, or batch; combine status and batch filters; use pagination for longer queues. New accounts start at **Pending review**.

Officers can approve, request more information, reject, or return an application to pending review. Every decision requires a message to the applicant. Approval additionally requires a graduation-reference type, a reference description, and explicit confirmation that it supports graduation. Use fictional reference information: the listed sources are proposed options, not connected or association-approved records. The history records the decision, reviewer, reference where applicable, message, and Philippine date/time.

The applicant dashboard shows decisions and messages; reference details appear only in the officer UI. An applicant with **Needs information** can save corrected profile details and select **Resubmit for review**. Rejected applications can be reopened by an officer. Changing a verified profile's name or batch year returns it to pending review; contact and avatar changes preserve its review status. Saving a previously opened profile form preserves newer officer decisions and history.

Officer sessions are separate from alumni sessions and last in the current tab. All records and checks remain client-controlled: the demo session guard and history are not production authorization or a tamper-proof audit log. The backend must enforce roles and access, keep private reviewer data separate, and support shared accounts before real use. Reference access, retention rules, and authorized officers still need confirmation. Proof uploads and email notices remain disabled; no real documents should be collected through this prototype.

## Proposed production stack

- Next.js and TypeScript
- PostgreSQL, authentication, and file storage through Supabase
- Hostinger Node.js hosting (current intended deployment target)

## Before production development

The August 2026 association history and official contact details have been supplied and incorporated. Remaining decisions include the other pages’ official content, branding permissions, final registration fields, verification process, authorized administrators, privacy policy, and rules for publishing reports and donation information.

## October 15, 2026 — Application status without automated emails

Registration completion now directs applicants to sign in and check **Application status**. The new portal page is available before the first officer message and explains pending, verified, needs-information, and rejected states. The same status panel remains on the overview. Officer decisions still update through the existing browser-demo review flow.

Automated email verification and decision notifications are outside the selected first-release workflow. Email remains the existing sign-in identifier; this change does not verify ownership of that address or replace it with a username. Forgot-password help links to the association's contact details and explains identity verification and officer assistance. No recovery request is submitted and no officer-assisted reset has been implemented yet.

The intended production setup is Hostinger domain/Next.js hosting with Supabase authentication, database, and photo storage. These services are not connected yet. See [the October 15 progress update](docs/PROGRESS-2026-10-15.md) for demo steps and outstanding work.
