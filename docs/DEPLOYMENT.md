# Supabase deployment: Render first, Hostinger later

This replaces browser-only accounts with Supabase Auth, PostgreSQL records, and private photo storage. The current checkout is not deployed until the service account setup and live verification below are completed.

## Account workflow

Registration collects the graduate declaration and consent, then creates a pending alumni profile. Both alumni and officers sign in with a username and password. Email is not collected, displayed, searched, or accepted as a website sign-in identifier. Officer review checks alumni eligibility. Applicants sign in to read decisions, correct details, and resubmit when asked.

Usernames use 3–30 letters, numbers, or underscores, starting with a letter, and are case-insensitive. They cannot be edited from the profile. Existing accounts receive unique usernames during the migration; their passwords, officer access, profile IDs, status, and review history are retained. The migration removes the old profile email column. It returns a list of assigned usernames for the operator to distribute privately.

Supabase's password API still needs an internal email-shaped identifier ([API reference](https://supabase.com/docs/reference/javascript/auth-signinwithpassword)). New accounts use `username@alumni.dcnhsaai.invalid`; existing Auth identities remain untouched. The server privately resolves the supplied username to an Auth user ID and retrieves that user's identifier with [getUserById](https://supabase.com/docs/reference/javascript/auth-admin-getuserbyid). Password verification then uses the regular Supabase Auth client. Neither the lookup nor Auth addresses are returned to the browser. All profile, review, and storage operations continue to use the user's RLS-protected client.

The username lookup requires a server-only `SUPABASE_SECRET_KEY` ([Supabase key guidance](https://supabase.com/docs/guides/getting-started/api-keys)). Never put it in a `NEXT_PUBLIC_` variable, source control, or chat. Confirmation and recovery emails remain disabled; account recovery is assisted by the association. Do not send mail to internal identifiers.

Only approved alumni appear in the public directory. That directory returns names and batch years. Approved alumni can view fellow approved members’ names, batch years, photos, and professions. Pending applicants can access their own profile and application. This is the initial production listing/access rule, pending association feedback.

Officers use real Supabase accounts with a separately assigned database role. No demo credentials or browser demo records are used by the website. Application decisions and history are saved together in a database transaction. Stale forms/decisions are rejected instead of overwriting newer changes. Changes to an approved name or batch year return the application to pending review.

Sessions use HTTP-only cookies. Remember me persists the session cookie for up to 30 days; otherwise it is a browser-session cookie. All tabs on the same website share the signed-in identity. Test alumni/officer flows in separate browser profiles or private windows. The server checks the user and the database checks permissions for every protected operation.

## 1. Supabase project

Use an association-owned project. If a project already exists, inspect its schema and storage policies before applying this migration.

1. Apply [202610260001_alumni_registry.sql](../supabase/migrations/202610260001_alumni_registry.sql) through the Supabase SQL editor or as a Supabase migration. It creates alumni profiles, officer roles, application history, access policies, controlled mutation functions, and the private `alumni-photos` bucket. It does not import fictional demo accounts.
   Then apply [202610270002_username_only.sql](../supabase/migrations/202610270002_username_only.sql) and [202610270003_contact_email.sql](../supabase/migrations/202610270003_contact_email.sql). If the earlier migrations are already applied, run only these new files in SQL Editor. The contact-email migration keeps username sign-in while adding email to profile details; phone numbers remain optional. Existing members should add an email from **My profile**. Keep the returned usernames for your existing accounts. Apply the database updates before deploying this code. Health returns 503 until the database and server key are configured.
2. In Supabase Authentication, enable email/password sign-in and registration. Disable **Confirm email** for the selected no-automated-email workflow. Set the minimum password length to eight characters. Registration checks the authentication settings before creating an account and refuses to proceed if email confirmation is enabled.
3. Set the Auth Site URL to the website’s HTTPS origin. Disable unused social, anonymous, and phone providers. Keep Supabase Auth rate limits enabled.
4. Create each authorized officer through Supabase Authentication → Users. Use an auto-confirmed account with an internal identifier such as `chosen_officer@alumni.dcnhsaai.invalid` and deliver its initial password privately. The signup trigger assigns a temporary username; set the intended username in the next step. Do not publish credentials in the source repository.
5. Assign officer access with the exact user UUID:

   ```sql
   insert into public.officers (user_id, display_name)
   values ('EXACT-AUTH-USER-UUID', 'Authorized officer name');

   select private.set_account_username('EXACT-AUTH-USER-UUID', 'chosen_officer');
   ```

   Officer membership is managed by the project operator, never through a public form or user-editable metadata. Removing the row revokes application access. An officer may also have an alumni profile: assign the `officers` row to that existing alumni user's UUID, then their normal sign-in opens the alumni portal with an **Officer dashboard** link. Separate officer-only accounts remain supported.

6. For a new environment, copy `.env.example` to `.env.local`. For an existing environment, retain its values and add `SUPABASE_SECRET_KEY` from Supabase Project Settings → API Keys → Secret keys. Use the secret key (`sb_secret_...`), not the publishable key. Restart the development server after saving. Never share this key in chat or commit it.

   ```dotenv
   SUPABASE_URL=https://PROJECT.supabase.co
   SUPABASE_PUBLISHABLE_KEY=PROJECT-PUBLISHABLE-KEY
   SUPABASE_SECRET_KEY=PROJECT-SECRET-KEY
   APP_URL=http://localhost:3000
   ```

7. Run `npm run dev`, then check `/api/health`. HTTP 200 with `{"status":"ok"}` confirms that the directory database function, username migration, and private username lookup are reachable and email confirmation is disabled. HTTP 503 means the application is not ready. This endpoint does not verify every role, storage policy, or officer assignment; complete the functional checks below.

Photos are validated by the server and stored in a private bucket. Profile responses use short-lived signed URLs; a link already issued remains usable until it expires. Deleting or replacing a photo removes the previous object after the profile update succeeds.

## 2. Validate the local source

```bash
npm ci
npm run lint
npm test
npm run build -- --webpack
```

The database tests execute the actual migration in embedded PostgreSQL with minimal Supabase Auth/Storage schema fixtures. Run `TEST_PREVIOUS_USERNAME_MIGRATION=1 node --conditions=react-server --test tests/registry.test.mjs` as well to check upgrading from the optional-email version. They check signup validation, row-level access, role escalation, decision messages/history, stale edits, resubmission, directory projections, and private-photo rules. They do not replace integration checks against Supabase Auth and Storage.

## 3. Temporary Render deployment

The user selected Render's free tier for temporary testing after considering Vercel's plan restrictions. The same Supabase project provides Auth, database records, and photos on Render and later on Hostinger. No data migration or new user registration is needed when changing the web host.

[Render's free web services](https://render.com/docs/free) sleep after 15 minutes without incoming traffic and take approximately one minute to wake up. Free services have usage limits and are intended for previews/testing. All persistent application data is in Supabase, so Render restarts do not erase accounts or uploaded photos. No Render database or disk is required.

### Recommended: deploy the Blueprint

1. Sign in at [Render](https://dashboard.render.com/) using GitHub. Connect the Render plugin if the assistant will manage deployment.
2. Choose **New → Blueprint**, connect `lordbonintortor/dcnhsaai-system`, select `main`, and use the root `render.yaml` file. The application source is committed; ensure the selected commit also contains the Render configuration.
3. Confirm the Blueprint creates one **Free** Node.js web service in Singapore. Supply the three requested values privately from `.env.local`: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SECRET_KEY`. These credentials are not stored in `render.yaml` or committed to Git.
4. Create the Blueprint and let the service build. The start command sets `APP_URL` from Render's automatically assigned `RENDER_EXTERNAL_URL`, unless a custom `APP_URL` was explicitly configured. Leave `APP_URL` unset in Render for the initial onrender.com address; do not copy the local `http://localhost:3000` value. This sets the exact trusted origin without accepting arbitrary request headers.
5. Open the assigned HTTPS URL and check `/api/health` for HTTP 200 and `{"status":"ok"}`. Update Supabase's Auth Site URL to that same origin and keep email confirmation disabled. Complete the live checks below, including photo upload, before inviting users.

The Blueprint uses Node.js 24, `npm ci --include=dev && npm run build -- --webpack`, and `APP_URL="${APP_URL:-$RENDER_EXTERNAL_URL}" npm run start -- --hostname 0.0.0.0`. Next.js reads Render's supplied `PORT`. `/api/health` verifies the backend connection for deployment health checks. New commits to the linked branch trigger deployment.

### Manual alternative

Choose **New → Web Service**, connect the same repository/branch, select Node and Singapore, and select the **Free** instance. Use the Blueprint's build/start commands and `/api/health` health-check path. Set `NODE_VERSION=24` and the three Supabase environment variables. Then deploy and follow steps 4–5 above. This is a full Node.js web service because account routes require a running backend ([Render's Next.js guide](https://render.com/docs/deploy-nextjs-app)).

Render account connection, service creation, and public URL verification are pending. No paid hosting has been activated.

## 4. Later move to Hostinger

The intended stack is Hostinger domain and Node.js web hosting with Supabase. The project quotation includes one website deployment but names no particular hosting plan. Hosting, domain, and database charges are separate client expenses.

Use a Hostinger plan that includes **Node.js Web Apps**, or a suitable VPS. Hostinger’s [Node.js deployment guide](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/) explains the currently supported plans and GitHub deployment. A static-file/PHP-only deployment cannot run this account backend.

For a managed Node.js web app:

1. Add a Node.js web app in hPanel and connect the repository `lordbonintortor/dcnhsaai-system`. Select the reviewed deployment branch/commit. Local uncommitted changes will not be available to GitHub deployment.
2. Select Next.js, repository root `.`, and Node.js 24 LTS where available (Node.js 22 is also supported by this project’s dependencies).
3. Install with `npm ci`. Build with `npm run build -- --webpack`. Start with `npm run start` and allow Hostinger to supply `PORT`; Next.js reads this variable. Do not deploy `next dev`.
4. Add runtime environment variables `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, and `APP_URL`. Set `APP_URL` to the exact HTTPS origin visitors use, without a path. Configure the same variables at build time if hPanel uses a separate build environment. This app reads backend credentials at request time, so compilation alone does not verify the connection.
5. Enable HTTPS and redirect alternate domains (such as `www`) to the canonical `APP_URL`. Mutation requests must have a matching Origin. Update the Supabase Auth Site URL to that origin.
6. Ensure any hosting/CDN cache bypasses `/api/*`; these responses also send `Cache-Control: private, no-store` and `Vary: Cookie`. Never cache authenticated JSON or responses setting authentication cookies.
7. Deploy, inspect runtime logs, and check `/api/health` on the live URL before inviting users.

When moving from Render, deploy the same reviewed source and Supabase environment values to Hostinger, set `APP_URL` and Supabase's Auth Site URL to the new canonical domain, and verify the account flows before switching domain traffic. Users keep their usernames, passwords, status, and photos; they may need to sign in again on a different domain. Retire the old Render deployment after the new site has passed checks and the switch is complete. The Hostinger app can use `npm run build -- --webpack` and `npm run start`; it does not depend on Render APIs.

## 5. Live verification before opening registrations

Use fictional test information and two independent browsers/devices:

- Register a fictional graduate with a username; confirm there is no email field. Confirm pending status, sign in with the username (also test uppercase), reload, sign out, and sign in from a second device. Duplicate usernames and wrong passwords must be rejected.
- Use the migration’s assigned usernames with existing alumni and officer passwords. Confirm email addresses are rejected at both sign-in pages and absent from profile/application responses. Check that alumni and officers cannot claim the same username.
- Sign in as an authorized officer separately. Confirm a normal alumnus cannot open the queue or submit decisions directly to `/api/applications`.
- Request details with a message; confirm it appears on the applicant’s device. Save a correction and resubmit. Approve, confirm directory visibility, and reject/reopen with a message. Confirm private contact details are absent from directory API responses.
- Check that pending applicants can read their own status while other member profiles require approval. Change an approved name/batch and confirm it returns to pending and leaves the public directory.
- Upload, replace, and remove a photo. Check the private bucket, signed-in member views, public-directory exclusion, and failure messages.
- Open the same application in two officer sessions and save conflicting decisions. The second stale decision must be rejected. A stale profile form must not overwrite a newer officer review.
- Verify Remember me, sign-out, role revocation, phone/desktop layouts, HTTPS, and disabled email notices.

## Account recovery and remaining content

For the requested fresh start during setup, sign out of the website, remove uploaded files from the `alumni-photos` bucket through Supabase Storage (retain the bucket), then delete the existing accounts through Authentication → Users. Supabase blocks user deletion while that user owns Storage objects ([user management guide](https://supabase.com/docs/guides/auth/managing-user-data#deleting-users)). Deleting all Auth users also removes alumni profiles, usernames, officer assignments, and application reviews through this project's foreign-key cascades. Keep the database tables, functions, policies, and migrations.

After deletion, this read-only SQL verifies the reset:

```sql
select 'auth_users' as record_type, count(*) as remaining from auth.users
union all select 'alumni_profiles', count(*) from public.alumni_profiles
union all select 'account_usernames', count(*) from public.account_usernames
union all select 'officers', count(*) from public.officers
union all select 'application_reviews', count(*) from public.application_reviews;
```

All counts should be zero before creating the fresh account. Configure `SUPABASE_SECRET_KEY` and verify health first. Create alumni accounts through `/register` so they receive an alumni profile and graduation consent record. Create officer-only accounts using steps 4–5 above. Passwords are entered privately by the operator or applicant. Account deletion and replacement have not been performed by the assistant.

The sign-in page directs users to contact the association for account-access help. It does not send email recovery links or submit reset requests. After the association confirms a user’s identity, an authorized officer can open that alumni application and choose **Issue temporary password**. The generated password is shown only in that officer session; deliver it to the verified account holder through a separate private channel and do not save it in messages or records. On the next sign-in, the user is sent to the password-change screen and cannot open the dashboard until a new password is saved.

The recovery action requires the server-only `SUPABASE_SECRET_KEY`, which is already required for username lookup. The key must be configured in local and Render runtime environments and must never be exposed as a `NEXT_PUBLIC_*` variable. If an account is not associated with an alumni profile, or the officer cannot verify the user’s identity, do not issue a temporary password.

Events, projects, reports, awardees, and donation account details still need approved content. The public page placeholders remain visible. Browser demo accounts are not transferred automatically; use newly registered test accounts for integration checks.

## Deployment status

Current status, October 27: the user reported that fresh username-based alumni registration/sign-in, officer sign-in, and approval passed after the reset. The approval test covered the officer decision, Verified status in the alumni portal, and name/batch visibility in the public directory. Earlier read-only checks verified the new pending alumni record and a healthy local website. These latest interactive results are user-reported. Hosting plan/domain details, photo checks, and final validation on the deployed website remain outstanding. The entries below retain the earlier setup history.

Local validation on October 26, 2026: lint passed; all 17 database/request/photo tests passed; the Webpack production build and TypeScript checks passed; and the dependency audit reported zero vulnerabilities after upgrading Next.js to 16.4.3 and applying compatible dependency fixes. Built-server smoke checks confirmed seven main routes return HTTP 200, unconfigured account/database APIs return uncached HTTP 503 responses, cross-site mutation requests are rejected, and demo officer credentials are absent from the served login page and client bundles. Interactive browser and live Supabase integration checks are still pending.

Supabase setup has now been completed by the user: project creation, migration application, authentication configuration, and local environment variables. Read-only checks verified email/password sign-in and registration are enabled, confirmation emails are disabled, and the directory database function is reachable. After restarting a stale development process, the website’s `/api/health` returned HTTP 200 with `{"status":"ok"}`; session/public-directory endpoints and registration/sign-in pages loaded, while protected endpoints rejected signed-out requests. No test accounts were created by these checks. Full registration/sign-in, photo, and officer-review integration checks remain pending.

No hosting purchase, DNS change, Git push, or production deployment has been performed. Completing deployment requires the hosting account/domain and authorized officer identities.

October 27, 2026: the user reported that the guided registration test passed, covering creation of a pending account, sign-in, application status, and the corresponding Auth user and alumni profile records. The user subsequently reported that officer login passed, including access to the application queue, and that the request-details → correction → resubmission → approval workflow passed, including history and public-directory visibility. These are user-reported checks. Hosting setup is next; photo uploads and the final checks on the hosted site remain pending before opening registrations.

Later October 27: the user requested username-only accounts, replacing the optional-contact-email plan. Email fields and legacy email sign-in have been removed from the application; a private server lookup preserves existing Auth accounts/passwords. The new `202610270002_username_only.sql` migration and `SUPABASE_SECRET_KEY` must be configured before hosted integration testing. The earlier migration is superseded for manual setup; the new migration supports both prior schema states. No production database or environment secrets have been changed by this update.

Local validation of the username-only update: all 22 tests, ESLint, and the production build/TypeScript checks passed. The 12 database tests also passed when upgrading from the optional-email migration. Upgrade checks preserve existing Auth rows, an approved profile's status/version, officer access, and review history. Hosted username sign-in remains pending database/key setup and integration testing.

The user subsequently reported that the username-only SQL succeeded and requested removing the existing accounts for a fresh start. The server secret key is still absent from the local configuration. Account deletion, replacement-account creation, and username sign-in testing remain pending.

After the user cleared the accounts and saved the server secret key, read-only checks confirmed successful Auth admin access, zero Auth users and username records, the username-only migration capability, and disabled email confirmation. The running local website returned HTTP 200 with `{"status":"ok"}` from `/api/health`. No accounts were created by these checks. Fresh alumni registration, officer provisioning, and username sign-in integration tests are next.
