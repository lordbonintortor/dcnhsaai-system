# Website Concept Presentation

For the latest completed work and a short script for the September 9 presentation, see [PROGRESS-REPORT.md](PROGRESS-REPORT.md).

## Suggested opening

“Based on the initial document, I translated the request into two connected parts: a public association website and a secure alumni registration portal. Today’s prototype is meant to confirm the direction and requirements before the database is built.”

## What to demonstrate

1. Open the homepage and explain the public information area. Select **Read our story** to show the association history, leadership, and official contact details added from the August 2026 document.
2. Open **Board of Trustees** and demonstrate the three supplied photo profiles and individual biographies. The dropdown now groups activities under **Alumni & Association Events**, followed by **Alumni Projects**, **Management Reports**, and **Outstanding Student and Alumni Awardees**. These four content areas await their material; officer-managed publishing is a later backend feature.
3. Select **Join the registry**, enter sample alumni details, and complete **Account setup** with matching demo passwords. Show the registration-complete screen and pending-review status.
4. Sign in with the account you just created. Show the dashboard, update a profile detail, return to the overview, then sign out and sign in again to demonstrate browser persistence.
5. For a quick walkthrough, open **Sign in** and enter `alumni.demo@example.com` / `CityHigh2026!`. This loads Alex Santos, Batch 2008, with a demo verified status. The sample-account panel has been removed from the login page. Account and profile data stay on this browser; real authentication, email verification, password recovery, and officer review remain backend work.
6. Open **Alumni directory**, search by name or year, choose a batch, and use **My batch**. Point out that each result shows only the alumni's name and batch year. Open **My profile** to show the saved directory-listing preview. This demo uses fictional sample entries and accounts registered on the same browser.
7. Resize the browser or use a phone to show the responsive layout.

## Decisions needed from the association

### Branding and content

- Association name and history are now available in the August 2026 document; the website uses the expanded name and preserves the registered abbreviation in the history.
- May the website use the school seal or association logo?
- History, office location, email, and mobile number have been incorporated. Are there approved mission/vision statements, additional photographs, and final brand guidelines?
- Who supplies and approves page content?

### Registration

- Who qualifies to register: graduates only, former students, teachers, or staff?
- How will officers verify alumni status?
- Is a supporting document required? If so, what type?
- The current form requires email and makes mobile optional. Confirm this design before implementing authentication; email delivery and phone-based access are not implemented.
- Is “Middle/Maiden Name” really mandatory?
- What does “upload options” mean in the original request?
- The requested directory lets signed-in alumni search other batches and displays only names and batch years. Confirm the production eligibility rules for directory listings during the backend phase.

### Administration

- Who will be an administrator and who can approve registrations?
- Who may publish reports, activities, projects, trustees, and awardees?
- Does the association already have an alumni spreadsheet to import?
- Which reports are public and which are restricted?

### Privacy and security

- Who is responsible for privacy compliance or acts as Data Protection Officer?
- How long should rejected applications and uploaded documents be retained?
- What information may be shared with other alumni?
- Should bank details be public, or should the site show controlled donation instructions instead?

## Proposed first release

- Public informational pages
- News, events, projects, reports, trustees, and awardees
- Alumni registration and email verification
- Officer review and approval
- Alumni login and profile updates
- Administrator dashboard and basic exports

Online payments, messaging, job postings, and a public alumni directory should be considered later, after the core registry is secure and working.

## Suggested closing

“The browser demo now covers registration, sign-in, an alumni dashboard, and profile updates. The next phase connects this flow to real authentication, a shared database, email verification, and officer approval.”
