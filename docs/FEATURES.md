# Feature flags

One registry (`src/features/registry.ts`), five launch profiles (`src/features/profiles.ts`), one resolver (`src/features/resolve.ts`). A disabled feature cascades everywhere: navigation, footer, homepage sections, CTAs, routes (real 404), sitemap, JSON-LD, enquiry options.

## How to switch

1. In Vercel → Project → Settings → Environment Variables, set `HUSKY_LAUNCH_PROFILE` (a preset) and any `HUSKY_FEATURE_<KEY>=on|off` overrides.
2. Redeploy. Flags resolve at build time with the environment provider, so a change needs a deploy.
3. Locally: the same variables in `.env.local`.

Overrides win over the profile. A feature whose dependency is off is forced off and recorded in `snapshot.suppressed` (visible in unit tests; nothing renders half-enabled).

### Remote flags later

`src/features/provider.ts` is the seam. `createJsonFeatureProvider` already accepts a `{ profile, features }` document (also via `HUSKY_FLAGS_JSON`). A Vercel Flags / Global Config adapter fetches that document and hands it to the same resolver; nothing above the provider changes.

## Profiles

| Profile | Enabled |
|---|---|
| `motherboard-only` | motherboardRepair, booking |
| `repair-core` | repair, motherboardRepair, booking |
| `launch` (default) | repair, motherboardRepair, booking, privacy, grapheneOs |
| `repair-plus-business` | + business, schools, tradePartners |
| `full-minus-refurb` | everything except refurbished, refurbBuilder |
| `full` | everything |

## Features

| Key | Env var | Default (launch) | Routes | Nav impact | Sitemap / SEO | Depends on | Notes |
|---|---|---|---|---|---|---|---|
| `repair` | `HUSKY_FEATURE_REPAIR` | on | `/repair`, `/repair/{phones,tablets,laptops,desktops,consoles,other}` | Primary "Repair"; problem tiles on home | Routes + Service JSON-LD | — | Category level at launch; brand/model routes are architected in the catalogue, no records yet |
| `motherboardRepair` | `HUSKY_FEATURE_MOTHERBOARD_REPAIR` | on | `/motherboard-repair` | Primary "Motherboard repairs"; proof section + second-diagnosis band on home | Route + Service JSON-LD | — | "Board Lab" renamed everywhere (BUILD_PLAN §2.2). Carries the site alone in `motherboard-only` |
| `booking` | `HUSKY_FEATURE_BOOKING` | on | `/book`, `/book/done` | Persistent "Start a repair" button | `/book` in sitemap; `/book/done` noindex | — | Off removes every CTA to `/book`; pages fall back to contact |
| `business` | `HUSKY_FEATURE_BUSINESS` | off | `/business` | Primary "Business"; home section | Route | — | No SLAs/volumes/response times (Canon §12) |
| `schools` | `HUSKY_FEATURE_SCHOOLS` | off | `/business/schools` | Link from `/business` | Route | business | |
| `tradePartners` | `HUSKY_FEATURE_TRADE_PARTNERS` | off | `/business/it-providers`, `/business/repair-partners` | Links from `/business` | Routes | business, motherboardRepair | Trade model (referral/white-label) from `business.tradeEscalationModel` |
| `privacy` | `HUSKY_FEATURE_PRIVACY` | on | `/privacy` | Primary "Privacy"; home section | Route | — | No absolute claims; hardware mods listed only when confirmed |
| `grapheneOs` | `HUSKY_FEATURE_GRAPHENE_OS` | on | `/privacy/grapheneos`, `/privacy/devices` | Links from `/privacy` | Routes | privacy | Device list is dated records in `src/content/privacy-devices.ts` |
| `recycling` | `HUSKY_FEATURE_RECYCLING` | off | `/recycle` | Footer "Recycling"; home section; enquiry option | Route | — | Hierarchy only; no outcome claims |
| `knowledge` | `HUSKY_FEATURE_KNOWLEDGE` | off | `/knowledge`, `/knowledge/[slug]` | Primary "Knowledge"; home section | Index + Article JSON-LD for published articles | — | Zero published articles; draft fixture is dev-only |
| `refurbished` | `HUSKY_FEATURE_REFURBISHED` | off | `/refurbished` | Primary "Refurbished"; home section | Route | — | Production shows real inventory only (none yet) |
| `refurbBuilder` | `HUSKY_FEATURE_REFURB_BUILDER` | off | `/refurbished/build` | "Build a device" CTA | Route | refurbished | No checkout; the build sheet is the record |
| `repairTracking` | `HUSKY_FEATURE_REPAIR_TRACKING` | off | `/track` | Footer "Track a repair" | Route | booking | Lookup by reference + email; status is `submitted` until operations update rows |
| `pickup` | `HUSKY_FEATURE_PICKUP` | off | — | Enquiry logistics option; repair-page logistics block | — | booking | Needs service area/fees (facts) before enabling |
| `mailIn` | `HUSKY_FEATURE_MAIL_IN` | off | — | Enquiry logistics option; repair-page logistics block | — | booking | Needs the mail-in address/process (facts) before enabling |

## Content gates (not flags)

- `/about` is published only when `business.about` exists (`src/config/business.ts`).
- `/policies/*` are served always but noindex and out of the sitemap until `POLICY_STATUS.*.reviewed` is true (`src/content/policies.ts`).

## Tests that hold this together

- `tests/unit/features.test.ts`, `routes.test.ts`, `home-composition.test.ts`, `seo.test.ts`: resolution, nav, composition, sitemap and JSON-LD per profile.
- `tests/e2e/leakage.spec.ts`: rendered HTML under the built profile has no trace of a disabled division; `npm run test:e2e:profiles` runs it against `motherboard-only`.
