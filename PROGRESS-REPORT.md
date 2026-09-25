# DCNHSAAI Website Progress Report

**Date:** September 9, 2026  
**Current stage:** Working frontend demo with registration, sign-in, alumni dashboard, profile photos, officer review, profile updates, and content integration. Backend development is scheduled for a later phase. September 25 additions are recorded at the end of this report.

## Completed in this update

- Replaced the homepage’s About placeholder with an introduction based on **ABOUT THE ALUMNI ASSOCIATION (Aug 2026).pdf**.
- Added `/about` with a chronological history: the 2016 founding and registration, 2018 leadership transition, 2022 centennial, 2023–2024 initiatives, and leadership beginning in 2025.
- Added President Atty. Niceforo V. Solis Jr., Batch 1994, with the information explicitly dated August 2026.
- Added the official mobile number and office location alongside the association’s email, with clickable phone and email links.
- Distinguished the school’s founding in 1922 from the association’s founding in 2016.
- Connected About links to the full history and corrected the footer’s Projects, Activities, and Awardees destinations.
- Added layouts for the new About content at desktop and mobile widths.
- Simplified registration to one centered form panel, removing the green sidebar. All existing fields and the profession “Other” option remain, with Back to website and Sign in links visible on phones. Desktop and phone previews confirmed a centered form with no horizontal overflow at 320/390/768/1440px; lint and the production build passed.
- Replaced the Board of Trustees placeholder with a photo overview and individual career-profile pages for Atty. Niceforo V. Solis Jr. (President, Batch 1994), Merle G. Bobilles (Treasurer, Batch 1971), and Ruth Ulac Arancel (Corporate Secretary, Batch 1982).
- Incorporated the supplied 2026 brief biographies and matching portraits from `public/profile`, with links between profiles and from the About page’s president card.
- Combined alumni and association activities under **Alumni & Association Events**, renamed projects to **Alumni Projects**, and reordered the dropdown and homepage cards: Board of Trustees → Alumni & Association Events → Alumni Projects → Management Reports → Outstanding Student and Alumni Awardees. Old activity and project links redirect to their new pages.
- Following the presentation revision, removed only the homepage **A community in action** section and its five cards. The Association dropdown remains, with the shorter **Alumni Activities** label. Sample news cards and the existing page wording and banners are retained.
- Replaced the homepage hero's campus image with a three-slide people carousel covering the entire hero, with the original text and registration links over a dark green photo overlay. Slides advance every two seconds. Added arrows, slide indicators, keyboard navigation, and mobile swipes. The pause/play button and changing caption beside the arrows were removed as requested. Hovering over photos keeps rotation running; hovering over controls or focusing the hero pauses it temporarily. Rotation resumes when hover and focus leave. Reduced-motion preferences disable automatic rotation by default.
- Added AI-generated sample imagery for alumni connections, community service, and mentoring. The visible “Sample imagery” badge was removed at the user’s request. These fictional scenes can be replaced with approved alumni photographs; saved asset paths and generation prompts are recorded in `docs/hero-imagery.md`.

- Completed registration with two steps: alumni information, then account setup. Required fields, at least one profession, consent, duplicate emails, and matching passwords are checked; Back preserves the information entered.
- Added browser account storage and a registration-complete screen. New accounts show **Pending review** and can sign in using the password created during registration.
- Added a sample alumni account: **Alex Santos, Batch 2008**. Sign in at `/login` using `alumni.demo@example.com` / `CityHigh2026!`. The sample-account panel has been removed from the login page as requested.
- Added `/dashboard` with personal profile information, registry status, batch and occupation cards, community previews, navigation, and sign-out. `/dashboard/profile` saves edited alumni details to the current demo account.
- Added sign-in errors, password visibility controls, Remember me, reload persistence, and a redirect to sign-in for visitors without a demo session. Recovery and officer verification are clearly identified as future backend features.
- Added **Alumni directory** at `/dashboard/directory`, available from the alumni navigation and **Find your batch** dashboard shortcut. Search accepts names or batch years, the year filter narrows results, and **My batch** uses the signed-in account's batch year. Rows show only first and last names and batch years.
- Added a saved directory-listing preview to **My profile**. The directory reflects registered browser accounts and saved name/year changes alongside fictional sample entries. Other alumni's contact, employment, middle/maiden-name, and credential information is not shown or searched in directory results.

The history’s June 1, 2024 website launch describes the association’s earlier website. The current registration flow is a frontend demo that saves sample data on this browser only; it is not connected to a shared registry.

## Earlier changes recovered from the project

These items are supported by the current code and Git commit `11eba87` (August 8, 2026). They are a recovery of implemented changes, not a complete record of meeting comments.

| Item | Status |
| --- | --- |
| Required email address, with verification/sign-in/recovery explanation | Required for browser demo sign-in; real email verification and recovery are not connected yet |
| Optional mobile number | Present |
| Multiple profession choices | Present |
| Selecting “Other” reveals a required text field | Present |
| At least one profession requested | Validated before continuing to account setup |
| Consent checkbox spacing and alignment | Existing local CSS adjustment preserved |

## What can be demonstrated

1. Start at `/` and show the people carousel, two-second automatic rotation, arrows, and slide indicators. Explain that its images are samples pending actual alumni group photographs.
2. Scroll to About Us and select **Read our story**.
3. Walk through the history timeline, dated leadership card, and official contact links.
4. Select **Read his profile** on the president’s card, then **All trustee profiles**. Show the three portrait cards and open the Treasurer and Corporate Secretary biographies.
5. Return home and demonstrate the reordered Association dropdown. Explain that the four remaining public page layouts await their own official content.
6. Open `/register`, enter sample details, choose a profession, and confirm consent. Continue to account setup, demonstrate the Back button preserving information, then create the demo account.
7. Sign in with that account and show its dashboard and **Pending review** status. Edit a profile detail, save it, and return to the overview.
8. Sign out and sign in again to show that the account and edits persist on this browser.
9. For the ready-made example, sign in at `/login` with `alumni.demo@example.com` / `CityHigh2026!`. Show Alex Santos, Batch 2008, and the sample verified status. Explain that real authentication, email delivery, and officer review are deferred.
10. Open **Alumni directory**, search by name and batch year, filter another batch, and select **My batch**. Show that results contain only names and batch years. Open **My profile** to show the directory-listing preview and explain that it follows saved profile changes.

## Short speaking script

“The public website structure and registration screens are in place. I have incorporated the association’s August 2026 history, leadership milestones, and official contact details. The Board of Trustees section now also has photos and individual career profiles for the President, Treasurer, and Corporate Secretary, based on the supplied biographies. Earlier registration form improvements are preserved. The frontend now demonstrates registration, sign-in, an alumni dashboard, profile updates, and sign-out using data saved on this browser. A sample alumni account is also ready for demonstration. Real authentication, shared storage, email verification, and officer approval will be implemented in the backend phase. The next content milestone is collecting the material for the remaining trustees and public pages.”

## Open items recovered from the presentation notes

These are questions already recorded in `PRESENTATION-NOTES.md`; they should not be presented as newly received feedback.

- **Other public content:** any additional trustee profiles and the full roster/term dates, approved reports, projects and benefactors, association activities, alumni activities, and awardees. The supplied trustee document contains three biographies and does not specify full term dates; the website labels these as 2026 profiles.
- **About and branding:** mission/vision statements if the association wants to publish them, final branding permissions, and approved photographs. No mission or vision was supplied in the August document.
- **Eligibility and verification:** who may register, how officers verify applicants, and whether supporting documents are required.
- **Registration details:** final required fields and meaning of the earlier “upload options” request. A name-and-batch-only alumni directory has now been requested and implemented in the browser demo; production listing eligibility remains for the backend phase.
- **Administration:** administrator identities, approval/publication permissions, and any existing alumni spreadsheet to import.
- **Privacy and publication:** privacy-policy owner, retention rules, report visibility, and donation-information publication. The source PDF includes bank details; this About update does not introduce a donation section or publish the PDF itself.

## Deferred backend work

Shared database and storage, production authentication and authorization, email verification and password recovery, school-record integration, private proof storage, and production officer administration. Registration, sign-in, profile editing, and the September 25 officer review addition operate only against browser demo records. Client-side session checks are demo navigation guards, not server authorization. New passwords use salted PBKDF2 verifiers in browser storage; this does not make the frontend demo suitable for real alumni data.

## Validation

- Directory checks — signed-out redirects, name/year-only results, name and accent-insensitive search, combined batch filters, empty results, reset, and **My batch** passed. Saved profile changes and newly registered browser accounts appear in the directory; private contact, employment, and credential details are absent from its results. The directory fits 320/390/768/1024/1440px without horizontal overflow, and no browser page errors occurred.
- Account flow checks — required fields and profession selection, preservation when returning to the first step, password mismatch and visibility, duplicate email detection, registration completion, wrong-password handling, sample and registered account sign-in, pending and sample-verified status, reload persistence, profile saving, sign-out, and signed-out redirects passed. Passwords for newly registered accounts were absent from plaintext storage. Registration, login, dashboard, and profile editor fit 320/390/768/1024/1440px without horizontal overflow; no browser page errors occurred.

- `npm run lint` — passed.
- `npm run build -- --webpack` — passed, including TypeScript and page generation.
- Chrome checks — homepage-to-About navigation, About content and metadata, phone link, no horizontal overflow at 390/768/1024/1440px, mobile homepage layout, profession “Other” toggle, and existing public/login routes passed. No browser page errors were observed.
- Desktop and phone screenshots were reviewed for the new About content.
- Board of Trustees checks — all three supplied portrait mappings, roles, batch years, individual page titles, profile/back/related/About navigation, and layouts at 360/390/768/1024/1440px passed. Unknown trustee URLs return 404, and the five remaining public pages still load. No browser or image-loading errors were observed. Final desktop and phone screenshots were reviewed.
- Navigation update checks — exact five-item dropdown order, matching homepage cards, combined events and renamed projects pages, redirects from all three former URLs, and mobile homepage layout passed. Lint and the Webpack production build also passed after this update.
- Hero carousel checks — all three images load; arrows wrap correctly; indicators, keyboard arrows, exact two-second rotation, photo hover without stopping, control hover pause, focus pause, reduced motion, and mobile swipes pass. After removing the pause/play button, desktop and phone checks confirmed two-second rotation, arrows, indicators, focus pause and automatic resume, and reduced-motion behavior. Vertical swipes still scroll. At eight widths from 320 to 1920px, the photos cover the full hero and the text stays within it, with no horizontal overflow or clipped controls. Homepage sample news and registration links remain; the removed homepage card section stays absent. Desktop and phone screenshots were reviewed, and no browser page errors occurred.
- The default Turbopack production build encountered the same environment restriction as the earlier check: its CSS processing worker could not bind a local port. Webpack provided the successful production-build check; the project’s default build configuration was not changed.

## September 25, 2026 — Profile photos

- Added an optional profile photo upload to registration, including a circular preview, replacement/removal controls, and a preview during account setup. Returning to the first step preserves the selection.
- Accepts JPG, PNG, and WebP files up to 5 MB. Images are center-cropped and resized to a 256×256 JPEG before browser storage. Invalid, oversized, empty, and unreadable files show errors without replacing an existing selection.
- The saved photo appears in the dashboard header and profile summary. My profile supports replacing or removing it with Save changes. Existing accounts without photos retain their initials, and directory listings still expose only names and batch years.
- Browser checks passed for registration with and without a photo, all three image formats, selection errors, back/continue navigation, sign-in/reload persistence, profile replacement/removal, sample and older accounts, edits while an image is being processed, and a simulated storage-quota failure. Registration, profile editing, and the dashboard fit 320/390/768/1024/1440px with no horizontal overflow. Desktop/mobile registration screenshots were reviewed; no browser page errors occurred.
- Lint and the default production build passed, including TypeScript and page generation. Photos remain part of the browser demo; shared photo storage is deferred to the backend phase.

## September 25, 2026 — Graduate application review

- Confirmed eligibility with the user: **DCNHS graduates only**. Registration now states this rule and includes it in the applicant declaration.
- Added `/admin/login` and `/admin` with a separate officer demo session. Credentials: `officer.demo@example.com` / `Review2026!`. The queue shows registered browser accounts and the existing sample profile, with counts, name/email/year search, status and batch filters, pagination, photos, and application details.
- Added approval, requests for more information, rejection, and return to pending review. Every decision requires an applicant message; approval also requires a reference type, reference description, and explicit graduation confirmation. Proposed references are not connected to real school records.
- Recorded decision history with reviewer, time, message, and approval reference. Applicants see their status and messages, can save corrections, and can resubmit applications marked Needs information. Officer reference details are omitted from the applicant UI. All browser records remain client-controlled.
- Limited profile normalization to editable fields so a stale profile form cannot overwrite an officer decision or review history. Name or batch changes on a verified account return it to pending; contact and photo edits preserve status. Failed storage writes preserve the previous account and history.
- Service checks passed for officer guards, required approval evidence, metadata isolation, stale decisions, preservation of reviews during profile saves, identity changes, storage failures, resubmission, rejection/reopening, and officer sign-out. Browser checks passed for the full graduate registration → clarification → correction → resubmission → approval flow, live updates across tabs, rejection and reopening, persistence, search/filtering/pagination, and officer/alumni session separation. Existing photo-upload checks also passed.
- Officer sign-in, the review screen, and applicant status views fit 320/390/768/1024/1440px without horizontal overflow. No browser page errors were observed. Lint and production-build checks passed.
- Final desktop/mobile screenshots, including the approval-reference controls, were reviewed. The existing approximately 15 MB SVG logo triggered an automated Chrome cache-write failure; it decoded correctly with caching disabled. The source logo asset was not changed.
- This remains a workflow demonstration. Shared accounts, server-enforced officer permissions, school-record access, private proof storage, retention rules, and email notices are the next backend work. No proof upload has been added.

## September 25, 2026 — Public alumni directory

- Added **Alumni Directory** immediately after **Association** in the homepage navigation. It opens `/alumni-directory` without requiring sign-in.
- Public listings display only alumni names and batch years, with name/year search and a batch filter. Photos, contact information, employment details, review records, and private profile links are absent from listings and search.
- Shared the directory component with the existing member directory, preserving its **My batch** and profile-edit controls. Public listings still use sample entries and accounts saved in the current browser; shared records require the backend.
- Lint, production build, and browser checks passed for anonymous navigation/reload, search/filter/reset, private-field exclusion, protected profile access, and member-directory behavior. The header fits 901–1440px, and the directory fits 320–1440px without horizontal overflow. No browser page errors occurred. Desktop and phone screenshots were reviewed.

## September 25, 2026 — Member directory profiles

- Added profile links inside the signed-in alumni directory and `/dashboard/directory/[id]` pages showing name, batch year, photo/initials, and profession. Used these basic fields as the initial scope while awaiting any further field preferences. Public directory results remain names and batch years only, with no profile links, even for signed-in visitors.
- Added an explicit member-profile projection and alumni-session check. Contact details, employer, middle/maiden name, section/adviser, credentials, and application-review records are excluded. Officer-only sessions cannot open the alumni profile view. Fictional name-only samples show profession as not provided; missing profiles have a return-to-directory state.
- Added visibility explanations to registration and profile editing, plus a preview of the saved member profile. Profile changes update the member view, and the directory navigation remains selected on profile pages.
- Lint, production build, service checks, and browser checks passed. Verified member links, photo loading and initials fallback, allowed/excluded fields, direct URLs, reload and sign-out, sample/missing profiles, own-profile editing, batch filters, and public-directory isolation. Layouts fit 320/390/768/1024/1440px; desktop and phone screenshots were reviewed, with no browser page errors.
- Access checks remain part of the browser demo. The shared backend must enforce member authorization and field-level visibility before production use.
