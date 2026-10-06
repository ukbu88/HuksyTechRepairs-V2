# Deploying to Vercel

## 1. Create the project

1. Vercel → Add New → Project → import `ukbu88/HuksyTechRepairs-V2`.
2. Framework preset: Next.js (auto-detected). Root directory: repository root. Build command `npm run build`, output default. Node.js 22.x.
3. Do not deploy to production yet; set the environment first.

## 2. Database (Neon)

1. Vercel → Storage (Marketplace) → Neon → create a database and connect it to the project. It adds `DATABASE_URL` to the project environment.
2. Run the migration once against that database:
   ```bash
   psql "$DATABASE_URL" -f db/migrations/0001_enquiries.sql
   ```
   (Or paste the file into the Neon SQL editor.) It creates the `enquiries` table and the `HUS-` reference sequence.
3. Preview deployments can share the same database or use a Neon branch. Never set `HUSKY_ENQUIRY_STORE=memory` on production; the build refuses it.

## 3. Email (Resend)

1. Create a Resend account and API key; add and verify the sending domain.
2. Set `RESEND_API_KEY`, `ENQUIRY_NOTIFY_TO` (where new-enquiry notifications go) and `ENQUIRY_NOTIFY_FROM` (a verified sender such as `Husky Tech Repairs <enquiries@your-domain>`).

## 4. Environment variables

Set these in Vercel → Project → Settings → Environment Variables. Production values are required; Preview can reuse them.

| Variable | Production | Preview |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://<your-domain>` | the preview URL or the production URL |
| `HUSKY_LAUNCH_PROFILE` | `launch` | as needed (`full` to review flagged divisions) |
| `DATABASE_URL` | from Neon | from Neon |
| `RESEND_API_KEY` | from Resend | from Resend |
| `ENQUIRY_NOTIFY_TO` | Husky's inbox | a test inbox |
| `ENQUIRY_NOTIFY_FROM` | verified sender | verified sender |

`VERCEL_ENV=production` is set by Vercel and switches the preflight to strict.

## 5. Domain

Add the production domain in Vercel → Domains, then set `NEXT_PUBLIC_SITE_URL` to match (https, no trailing slash) and redeploy. Canonicals, the sitemap, robots and JSON-LD all derive from it.

## 6. Deploy and verify

1. Push to `main` → Vercel builds. If the preflight fails, the log names the missing variable or placeholder.
2. Open the site: `/`, `/repair`, `/motherboard-repair`, `/book`.
3. Submit a real test enquiry on a phone. Confirm: a `HUS-` reference on the confirmation page, a row in Neon, a notification email in `ENQUIRY_NOTIFY_TO`.
4. Check `/sitemap.xml` and `/robots.txt` show the production origin.
5. Share `/` on a chat app to see the Open Graph image.

## Changing scope (flags)

Set `HUSKY_LAUNCH_PROFILE` and/or `HUSKY_FEATURE_<KEY>` in the environment and redeploy. See `docs/FEATURES.md`. Example to add Business without a code change: `HUSKY_FEATURE_BUSINESS=on`, `HUSKY_FEATURE_SCHOOLS=on`, `HUSKY_FEATURE_TRADE_PARTNERS=on`.

## Operational notes

- Enquiry notifications that fail to send are recorded on the row (`notification_error`); the enquiry is still stored. Check Neon for rows with `notified_at IS NULL` if Resend misbehaves.
- The rate limiter is in-memory per serverless instance: a soft brake. If abuse appears, add Vercel's WAF rules or a shared store (the limiter is one function in `src/enquiries/rate-limit.ts`).
- Security headers are set in `next.config.ts`. No analytics provider is installed; `src/analytics/events.ts` is the typed contract for when a consent-aware one is chosen.
- `npm audit`: one high advisory in a dev-only ESLint dependency chain (`braces`); not shipped.

## Pre-launch checklist

- [ ] `docs/UNRESOLVED_BUSINESS_FACTS.md` worked through; `src/config/business.ts` filled with real facts only
- [ ] Policies reviewed; `POLICY_STATUS` flipped to reviewed
- [ ] About story supplied (`business.about`)
- [ ] Photos dropped per `docs/SHOT_LIST.md` (at least hero, motherboard scope, repair bench)
- [ ] Mascot/logo replaced if an illustrator version exists (same filenames in `public/brand/`)
- [ ] Test enquiry end to end on production (reference, Neon row, email)
- [ ] `NEXT_PUBLIC_SITE_URL` set to the real domain
