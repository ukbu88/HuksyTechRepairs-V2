# Husky Tech Repairs — website

The public website for Husky Tech Repairs (Brisbane): consumer repairs, motherboard repairs, the repair enquiry, and the Privacy / GrapheneOS pages. Other divisions (Business, Recycling, Knowledge, Refurbished, Repair tracking, pickup and mail-in) are built and switched off behind feature flags.

Next.js 16 (App Router, React Server Components), strict TypeScript, CSS Modules on design tokens, Zod at every boundary, Vitest + Playwright, deployed on Vercel. No CMS, no UI kit, no Tailwind.

- `BUILD_PLAN.md` — the build plan and the progress tracker
- `source/CANON.md` — brand authority
- `source/BUILD_COMMAND.md` — engineering standards
- `ops/DECISIONS.md`, `ops/VERIFY.md`, `ops/screenshots/` — working records
- `docs/` — operating docs (below)

## Prerequisites

- Node.js 20.9+ (22 recommended) and npm
- For e2e: Playwright 1.56 browsers (`npx playwright install chromium` on a machine without them)

## Local setup

```bash
npm install
cp .env.example .env.local      # then edit; see "Environment variables"
npm run dev                      # http://localhost:3000
```

For a working enquiry form locally without a database:

```bash
HUSKY_ENQUIRY_STORE=memory npm run dev
```

The in-memory store is a clearly labelled test adapter. It is refused on a production deployment.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build. Runs the preflight (see below) and regenerates `docs/SHOT_LIST.md` |
| `npm start` | Serve the production build |
| `npm run lint` / `typecheck` / `format:check` | Static checks (zero warnings allowed) |
| `npm test` | Vitest unit tests (flags, routes, enquiry, SEO, content discipline) |
| `npm run test:e2e` | Playwright: smoke + axe on every route, 404s, leakage, keyboard-only and no-JS enquiry, reflow, reduced motion. Builds must exist (`npm run build` first) |
| `npm run test:e2e:profiles` | Builds `motherboard-only` into its own dist dir and runs the leakage/smoke specs against it |
| `npm run shot-list` | Regenerate `docs/SHOT_LIST.md` from the image-slot registry |
| `node scripts/screenshot.mts M8 / /repair` | Milestone screenshots at 390 and 1440 px (production server on port 3000) |

## Environment variables

Copy `.env.example`. Everything is read in one place, `src/config/env.ts`.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | production | Canonical origin for metadata, sitemap, robots, JSON-LD. `https://…`, no trailing slash |
| `HUSKY_LAUNCH_PROFILE` | no (default `launch`) | Launch profile preset: `motherboard-only`, `repair-core`, `launch` (repair-core + Privacy/GrapheneOS), `repair-plus-business`, `full-minus-refurb`, `full` |
| `HUSKY_FEATURE_<KEY>` | no | Per-feature override, `on`/`off`, wins over the profile. Example: `HUSKY_FEATURE_BUSINESS=on` |
| `HUSKY_FLAGS_JSON` | no | A JSON document `{ "profile": …, "features": { … } }` for a remote flag store adapter |
| `DATABASE_URL` | production | Neon Postgres connection string. Run `db/migrations/0001_enquiries.sql` once |
| `RESEND_API_KEY` | production | Resend API key for the new-enquiry notification |
| `ENQUIRY_NOTIFY_TO` | production | Address that receives new-enquiry notifications |
| `ENQUIRY_NOTIFY_FROM` | recommended | Verified sender, e.g. `Husky Tech Repairs <enquiries@your-domain>` |
| `HUSKY_ENQUIRY_STORE` | dev/test only | `memory` to use the in-memory test adapter. Refused in production |
| `HUSKY_PREFLIGHT` | no | `strict` to make a local build fail like a production one; `skip` to bypass (CI builds of other profiles) |

### The preflight

`next.config.ts` runs `src/config/preflight.ts` on every build. On a Vercel production deployment (or `HUSKY_PREFLIGHT=strict`) it fails the build when a business fact looks like a placeholder, the site URL is localhost, a production credential is missing, or the memory store is selected. Elsewhere it prints warnings. The goal: a placeholder or a fake-success enquiry path can never ship by accident.

## Feature flags and launch profiles

One typed registry: `src/features/registry.ts`. Profiles: `src/features/profiles.ts`. Resolution (profile → overrides → dependency enforcement): `src/features/resolve.ts`. One snapshot per request: `src/features/snapshot.ts`.

Everything that can show a division reads that snapshot: navigation and footer (`src/routes/catalogue.ts`), homepage composition (`src/features/home-composition.ts`), route gating (`src/routes/gate.ts`, real 404s), sitemap, JSON-LD, CTAs and enquiry options. There is no second list anywhere.

To change scope: set `HUSKY_LAUNCH_PROFILE` and/or `HUSKY_FEATURE_*` in the Vercel project's environment and redeploy. No code edit. Details per feature: `docs/FEATURES.md`.

## Content editing

See `docs/CONTENT.md`. Short version: business facts in `src/config/business.ts` (never guess; unknown stays `undefined`), repair copy in `src/content/repair/*.ts`, FAQs in `src/content/faq.ts`, image slots in `src/content/image-slots.ts`, knowledge articles in `src/content/knowledge/`, refurbished inventory in `src/content/refurbished/`.

## Photos, mascot, logo

- Photos: drop a file at `public/photos/<slot-id>.jpg` (or `.webp`/`.png`) for any slot in `docs/SHOT_LIST.md`. The site picks it up on the next build; no code change.
- Mascot and logo: standalone SVGs in `public/brand/` (`logo-mark.svg`, `favicon.svg`, `mascot-neutral.svg`, `mascot-magnifier.svg`, `mascot-confused.svg`). Replace the files; keep the names.

## Enquiries (booking provider setup)

Flow: `/book` (six steps, works without JavaScript) → server action `src/app/book/actions.ts` → `createEnquiry` in `src/enquiries/service.ts` → `EnquiryRepository` (Neon) → `Notifier` (Resend) → `/book/done` with the `HUS-######` reference issued by the database.

1. Create a Neon database (Vercel Marketplace → Neon). Copy the connection string to `DATABASE_URL`.
2. Run the migration once: `psql "$DATABASE_URL" -f db/migrations/0001_enquiries.sql`.
3. Create a Resend API key; verify a sending domain; set `RESEND_API_KEY`, `ENQUIRY_NOTIFY_TO`, `ENQUIRY_NOTIFY_FROM`.
4. Deploy. The build fails if any of those are missing on production; at runtime, a storage failure shows the customer an honest error and never a fake reference.

Spam protection: honeypot field, minimum time on the contact step, and a per-address rate limit (in-memory, per instance). See `docs/DEPLOY.md` for the production notes.

## Deployment

`docs/DEPLOY.md` is the runbook: Vercel project, environment variables per environment, the migration, the launch profile, and the pre-launch checklist.

## Testing

- Unit (`npm test`): feature resolution and profiles, route catalogue/nav, homepage composition, preflight, palette contrast, image-slot registry, repair content discipline (no slop, no invented facts), enquiry schema/adapters/service/rate limit/flow, SEO (sitemap, JSON-LD), divisions.
- E2E (`npm run build && npm run test:e2e`): every enabled route at desktop and mobile with axe (WCAG 2.2 AA tags), disabled routes 404, profile leakage on rendered HTML, keyboard-only enquiry, JS-disabled enquiry, tampering, honeypot, 320 px reflow, 200 % zoom, reduced motion, touch targets, mobile menu, skip link.
- `npm run test:e2e:profiles` proves `motherboard-only` on rendered pages.

## Unresolved TODOs

`docs/UNRESOLVED_BUSINESS_FACTS.md` lists every fact Husky still has to supply. Until a fact exists, the site omits it rather than guessing.

## Security notes

`npm audit` reports a high-severity advisory in `braces` via `eslint-config-next`'s dev-only dependency chain. It is not part of the shipped bundle; it clears when the upstream package updates.
