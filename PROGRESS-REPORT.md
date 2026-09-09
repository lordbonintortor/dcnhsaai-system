# DCNHSAAI Website Progress Report

**Date:** September 9, 2026  
**Current stage:** Frontend prototype and content integration. Backend development is scheduled for a later phase.

## Completed in this update

- Replaced the homepage’s About placeholder with an introduction based on **ABOUT THE ALUMNI ASSOCIATION (Aug 2026).pdf**.
- Added `/about` with a chronological history: the 2016 founding and registration, 2018 leadership transition, 2022 centennial, 2023–2024 initiatives, and leadership beginning in 2025.
- Added President Atty. Niceforo V. Solis Jr., Batch 1994, with the information explicitly dated August 2026.
- Added the official mobile number and office location alongside the association’s email, with clickable phone and email links.
- Distinguished the school’s founding in 1922 from the association’s founding in 2016.
- Connected About links to the full history and corrected the footer’s Projects, Activities, and Awardees destinations.
- Added layouts for the new About content at desktop and mobile widths.
- Replaced the Board of Trustees placeholder with a photo overview and individual career-profile pages for Atty. Niceforo V. Solis Jr. (President, Batch 1994), Merle G. Bobilles (Treasurer, Batch 1971), and Ruth Ulac Arancel (Corporate Secretary, Batch 1982).
- Incorporated the supplied 2026 brief biographies and matching portraits from `public/profile`, with links between profiles and from the About page’s president card.
- Combined alumni and association activities under **Alumni & Association Events**, renamed projects to **Alumni Projects**, and reordered the dropdown and homepage cards: Board of Trustees → Alumni & Association Events → Alumni Projects → Management Reports → Outstanding Student and Alumni Awardees. Old activity and project links redirect to their new pages.
- Following the presentation revision, removed only the homepage **A community in action** section and its five cards. The Association dropdown remains, with the shorter **Alumni Activities** label. Sample news cards and the existing page wording and banners are retained.
- Replaced the homepage hero's campus image with a three-slide people carousel covering the entire hero, with the original text and registration links over a dark green photo overlay. Slides advance every two seconds. Added arrows, slide indicators, pause/play, keyboard navigation, and mobile swipes. Hovering over photos keeps rotation running; hovering over controls pauses it, and keyboard interaction stops it. Reduced-motion preferences disable automatic rotation by default.
- Added clearly labeled AI-generated sample imagery for alumni connections, community service, and mentoring. These fictional scenes can be replaced with approved alumni photographs; saved asset paths and generation prompts are recorded in `docs/hero-imagery.md`.

The history’s June 1, 2024 website launch describes the association’s earlier website. It does **not** mean registration works in this new prototype.

## Earlier changes recovered from the project

These items are supported by the current code and Git commit `11eba87` (August 8, 2026). They are a recovery of implemented changes, not a complete record of meeting comments.

| Item | Status |
| --- | --- |
| Required email address, with verification/sign-in/recovery explanation | Present in the registration form; those services are not connected yet |
| Optional mobile number | Present |
| Multiple profession choices | Present |
| Selecting “Other” reveals a required text field | Present |
| At least one profession requested | Instruction is present; submission validation is not implemented |
| Consent checkbox spacing and alignment | Existing local CSS adjustment preserved |

## What can be demonstrated

1. Start at `/` and show the people carousel, arrows, slide indicators, and pause/play control. Explain that its images are samples pending actual alumni group photographs.
2. Scroll to About Us and select **Read our story**.
3. Walk through the history timeline, dated leadership card, and official contact links.
4. Select **Read his profile** on the president’s card, then **All trustee profiles**. Show the three portrait cards and open the Treasurer and Corporate Secretary biographies.
5. Return home and demonstrate the reordered Association dropdown. Explain that the four remaining public page layouts await their own official content.
6. Open `/register`, show the proposed alumni fields, and select **Other** under profession.
7. Open `/login` and clearly describe it as a screen preview.

## Short speaking script

“The public website structure and registration screens are in place. I have incorporated the association’s August 2026 history, leadership milestones, and official contact details. The Board of Trustees section now also has photos and individual career profiles for the President, Treasurer, and Corporate Secretary, based on the supplied biographies. Earlier registration form improvements are preserved. The project remains a frontend prototype, so registration, login, officer approval, and saved profiles will be implemented in the backend phase. The next content milestone is collecting the material for the remaining trustees and public pages.”

## Open items recovered from the presentation notes

These are questions already recorded in `PRESENTATION-NOTES.md`; they should not be presented as newly received feedback.

- **Other public content:** any additional trustee profiles and the full roster/term dates, approved reports, projects and benefactors, association activities, alumni activities, and awardees. The supplied trustee document contains three biographies and does not specify full term dates; the website labels these as 2026 profiles.
- **About and branding:** mission/vision statements if the association wants to publish them, final branding permissions, and approved photographs. No mission or vision was supplied in the August document.
- **Eligibility and verification:** who may register, how officers verify applicants, and whether supporting documents are required.
- **Registration details:** final required fields, meaning of the earlier “upload options” request, and whether alumni profiles should be searchable.
- **Administration:** administrator identities, approval/publication permissions, and any existing alumni spreadsheet to import.
- **Privacy and publication:** privacy-policy owner, retention rules, report visibility, and donation-information publication. The source PDF includes bank details; this About update does not introduce a donation section or publish the PDF itself.

## Deferred backend work

Database and storage, account creation, email verification, login/password recovery, officer review and approval, alumni profile editing, and an administration dashboard. Registration and sign-in buttons currently do not complete these actions.

## Validation

- `npm run lint` — passed.
- `npm run build -- --webpack` — passed, including TypeScript and page generation.
- Chrome checks — homepage-to-About navigation, About content and metadata, phone link, no horizontal overflow at 390/768/1024/1440px, mobile homepage layout, profession “Other” toggle, and existing public/login routes passed. No browser page errors were observed.
- Desktop and phone screenshots were reviewed for the new About content.
- Board of Trustees checks — all three supplied portrait mappings, roles, batch years, individual page titles, profile/back/related/About navigation, and layouts at 360/390/768/1024/1440px passed. Unknown trustee URLs return 404, and the five remaining public pages still load. No browser or image-loading errors were observed. Final desktop and phone screenshots were reviewed.
- Navigation update checks — exact five-item dropdown order, matching homepage cards, combined events and renamed projects pages, redirects from all three former URLs, and mobile homepage layout passed. Lint and the Webpack production build also passed after this update.
- Hero carousel checks — all three images load; arrows wrap correctly; indicators, keyboard arrows, exact two-second rotation, photo hover without stopping, control hover pause, pause/play, focus pause, reduced motion, and mobile swipes pass. Vertical swipes still scroll. At eight widths from 320 to 1920px, the photos cover the full hero and the text stays within it, with no horizontal overflow or clipped controls. Homepage sample news and registration links remain; the removed homepage card section stays absent. Desktop and phone screenshots were reviewed, and no browser page errors occurred.
- The default Turbopack production build encountered the same environment restriction as the earlier check: its CSS processing worker could not bind a local port. Webpack provided the successful production-build check; the project’s default build configuration was not changed.
