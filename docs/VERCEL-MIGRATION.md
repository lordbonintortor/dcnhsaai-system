# Move the web application from Render to Vercel

Migration preparation, November 11, 2026. The existing Render site remains at <https://dcnhsaai-system.onrender.com>. A Vercel deployment and traffic switch have not been performed by this preparation.

The same Supabase project continues to provide accounts, alumni records, review history, reactions, and profile photos. Changing the web host requires no database reset, account import, or repeat registration. Users will need to sign in on the new domain.

## Plan and project setup

Vercel [supports Next.js applications](https://vercel.com/docs/frameworks/full-stack/nextjs). Its [fair-use guidelines](https://vercel.com/docs/limits/fair-use-guidelines) restrict Hobby to personal, noncommercial use. Donation requests alone are exempt from its commercial-use definition, but receiving payment to create, update, or host a site counts as commercial use and requires Pro or Enterprise. Choose the appropriate plan before deploying; this preparation does not activate a paid plan.

1. Push the reviewed source to GitHub yourself. Import `lordbonintortor/dcnhsaai-system` through **Vercel → Add New → Project** using an account authorized to access the repository.
2. Select the **Next.js** framework preset, repository root `./`, and production branch `main`.
3. Retain the existing `vercel.json` build command: `npm run build -- --webpack`. Let the Next.js preset manage the output directory and server functions; do not configure a static export or Render's `next start` command.
4. Use a supported Node.js version. The current `package.json` permits Node.js 22 and later. Vercel's [Node.js documentation](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions) explains that an open-ended engine range can select its newest supported version, overriding a lower dashboard selection. To require Node.js 24 to match Render, change `engines.node` to `24.x` in a reviewed source update before deploying.

## Environment variables

Add the existing values privately in Vercel's [environment-variable settings](https://vercel.com/docs/environment-variables), scoped to **Production**:

| Variable | Value |
| --- | --- |
| `SUPABASE_URL` | Existing Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Existing publishable key |
| `SUPABASE_SECRET_KEY` | Existing server-only secret key |
| `APP_URL` | Exact stable HTTPS origin visitors will use on Vercel |

Use the same Supabase values as Render. Do not paste secrets into chat or commit them, and do not add a `NEXT_PUBLIC_` prefix. Render's `RENDER_EXTERNAL_URL`, `PORT`, and `NODE_VERSION` are not needed in Vercel environment settings.

If the Vercel production domain is not known until the first deployment, deploy with the three Supabase variables, obtain the assigned stable production domain from the project's Domains settings, then set `APP_URL` and redeploy before functional verification. Use an origin such as `https://YOUR-ACTUAL-PROJECT.vercel.app`, without a path. Use the actual assigned domain, not an assumed project name or a deployment-specific URL.

Do not copy Render's origin or `http://localhost:3000` into Vercel's `APP_URL`: account mutations require an Origin matching this value. If Preview deployments are enabled, configure their backend and origin separately; a production-only `APP_URL` will reject mutations originating on a Preview domain.

Environment-variable changes apply to subsequent deployments, so redeploy after changing them. Once the final domain is chosen, update the Supabase Auth Site URL to the same HTTPS origin. When adding a custom domain later, update `APP_URL`, redeploy, and update Supabase's Site URL again.

## Verify before switching visitors

- Confirm the Vercel deployment is Ready and `/api/health` returns HTTP 200 with `{"status":"ok"}`.
- Open Home, About Us, activities, projects, trustee profiles, the alumni directory, and Donate. Check the activity images and the Home navigation link.
- Use separate alumni and officer browser sessions to check registration, sign-in/out, application review, correction/resubmission, and approved-directory visibility. Check photo upload/replacement/removal and the officer-assisted temporary-password flow using test accounts.
- Confirm contact email and country are absent from the public directory API. Signed-out requests must be denied member profiles and private documents. Confirm an authorized member can read the BIR PDF and an officer can read financial reports.
- Check phone and desktop layouts and any custom-domain HTTPS configuration.

The current Next.js build traces include `private/documents/bir-form-2023-cor.pdf` and both files in `private/documents/management-reports/`. Vercel bundles traced files with their server functions. Keep these documents under `private/`; their API routes enforce access. Verify downloads on Vercel because a local build alone does not confirm the deployed bundles.

Keep Render available while validating Vercel. Share the new URL or switch an owned custom domain only after the checks pass. The `onrender.com` address belongs to Render and does not move to Vercel. Suspend or retire the Render service separately once the migration is accepted. The existing `render.yaml` enables deployment on commits; disable that in Render if you no longer want both hosts deploying from the same branch.

The operator handles Git pushes. This guide does not push code, create a Vercel project, change Supabase settings, alter DNS, or stop the Render service.
