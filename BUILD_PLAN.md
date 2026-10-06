# Husky Tech Repairs — Build Plan (v2)

Owner: Prince. Executor: Fable 5.1 (single agent; may spawn subagents for independent verification only).
Status: DRAFT. Sections are agreed one at a time; only sections marked AGREED are binding.

| § | Section | Status |
|---|---|---|
| 0 | How to use this plan | DRAFT |
| 1 | Working rules | DRAFT |
| 2 | Launch scope and naming overrides | AGREED (scope) / DRAFT (detail) |
| 3 | Business facts register | DRAFT — mostly unknown |
| 4 | Stack and architecture | DRAFT |
| 5 | Visual direction — "Bench Pop" | AGREED (direction) / DRAFT (detail) |
| 6 | Image slots (no stock photography) | AGREED (approach) / DRAFT (detail) |
| 7 | Launch pages | AGREED (list) / DRAFT (detail) |
| 8 | Later divisions (built, flagged off) | DRAFT |
| 9 | Milestones and gates | DRAFT |
| 10 | Definition of done | DRAFT |

## Build progress

Current stage: M2 — Brand slice — IN PROGRESS
Last updated: 2026-10-05T23:50:00Z · Last commit: (see git log)

| Milestone | Status | Gate result | Notes |
|---|---|---|---|
| M1 Foundation | DONE | lint ✓ typecheck ✓ test ✓ build ✓ screenshots ✓ | shell, flags, config, routes, slots, mascot |
| M2 Brand slice | IN PROGRESS | — | |
| M3 Repair | TODO | — | |
| M4 Enquiry | TODO | — | |
| M5 Supporting + discovery | TODO | — | |
| M6 Flagged divisions | TODO | — | |
| M7 Hardening | TODO | — | |

### Current milestone checklist
- [ ] Home launch composition (`repair-core`): hero with mascot moment, problem-first tiles, motherboard proof section, second-diagnosis orange band, how it works, final CTA
- [ ] Home `motherboard-only` composition via typed composition rules (no JSX ternary soup)
- [ ] Homepage composition unit tests across profiles
- [ ] `/motherboard-repair` per Build Command §15: hero, what board-level means, faults, second-diagnosis path, process, limits, FAQ, CTA
- [ ] Motherboard explainer: code-drawn board with tap areas (power, charging, display, data), static without JS, reduced-motion safe
- [ ] Shared page sections: ProblemTiles, SecondDiagnosisBand, ProcessSteps, FAQ (details), FinalCta
- [ ] Gate: lint/typecheck/test/build, screenshots in `ops/screenshots/M2/`, iterate until it looks like Bench Pop, review in `ops/VERIFY.md`

### Blocked / deferred
- `git push origin main` refused with 403 (Claude GitHub App not installed on ukbu88/HuksyTechRepairs-V2; API connector is read-only) — all work is committed locally and the push is retried at every gate — unblocked by installing the app at https://github.com/apps/claude/installations/select_target or reconnecting GitHub at https://claude.ai/connect-github
- Neon adapter untested against a real database — needs `DATABASE_URL` (M4)
- Resend notifier untested against the real API — needs `RESEND_API_KEY` + recipient (M4)
- About page content — needs Prince's real story (M5)

---

## 0. How to use this plan

Read order before writing any code:

1. `BUILD_PLAN.md` (this file) — **highest authority for execution and for the explicit overrides in §2**.
2. `source/CANON.md` — **brand and product authority**: positioning, voice, message library, page structures, "never do" list (§29), open decisions (§32). Apart from the overrides listed in §2, this plan never changes the brand. If something here seems to contradict the Canon, stop and log it in `ops/DECISIONS.md`.
3. `source/BUILD_COMMAND.md` — **engineering standards**. Binding sections: anti-slop rules (§3), feature architecture (§8), design system (§10), accessibility (§11), performance (§12), content/data (§13), booking (§14), the Board Lab page spec (§15, applied to Motherboard repairs), SEO/GEO (§20), voice (§21), conversion (§22), config (§24), security (§25), testing (§26–27), acceptance gates (§29), docs (§38).
   - **Superseded:** §4–6 and §40 steps 2–4 (the four-agent Band room, worktrees, room preparation). There is one executor. Ignore all Band/Codex orchestration instructions.

The `.docx` files in `source/` are the originals; the `.md` files are faithful conversions for reading.

Working records (short; they exist to stop re-litigating, not as deliverables):

- `ops/DECISIONS.md` — one line per real decision: what, why, date.
- `ops/VERIFY.md` — per milestone: routes checked, viewports, screenshot paths, issues found and fixed.

## 1. Working rules

1. **Clean slate.** Start a new repository in this folder. Do not reference, copy from or inspect any other Husky folder on this machine.
2. **Pages first, system second.** The feature-flag system is mandatory but it is plumbing: build it lean in the first milestone, then spend most of the run on pages that look and read like Husky.
3. **No ceremony.** No receipts, ownership tables or merge protocols. Commit in small logical steps with clear messages on `main`.
4. **Verify by looking.** At the end of every milestone, run the production build, screenshot every page at 390px and 1440px, and judge the screenshots against Canon §16–17 and Build Command §3 before moving on. Record findings in `ops/VERIFY.md`.
5. **Write like a person.** Page copy is written as prose by a copywriter following the Canon's voice, not assembled from data fragments. Structured data drives facts, routes and flags — not every sentence.
6. **Never invent business facts** (Canon §29, §32). Unknowns stay as clearly marked TODOs in config, and the UI omits anything not confirmed.

## 2. Launch scope and naming overrides

### 2.1 Launch set — AGREED

Launch enabled: **consumer repair + motherboard repair + enquiry (booking)**.

Built behind feature flags, switched **off** at launch: refurbished + builder, privacy + GrapheneOS, business (+ schools, trade partners), recycling, knowledge, repair tracking, pickup, mail-in. How far each of these is built is decided in §8.

The homepage, nav, footer, sitemap, structured data and enquiry options must present the launch set as a complete, intentional site — no gaps where the other divisions would be.

### 2.2 Naming override: "Board Lab" → "Motherboard repairs" — AGREED

Prince's direction: no "Board Lab" brand. Use the plain name. This is consistent with the Canon's own naming rule (§6: plain names in navigation, no invented branded names for services).

Apply everywhere the Canon or Build Command says "Board Lab":

| Canon / Build Command | v2 |
|---|---|
| Board Lab (division name, nav label) | Motherboard repairs |
| `/board-lab` | `/motherboard-repair` |
| feature key `boardLab` | `motherboardRepair` |
| launch profile `board-lab-only` | `motherboard-only` |
| CTA "Send it to Board Lab" | "Send it for motherboard repair" |
| "Husky Board Lab" in headings/copy | "motherboard repair" / "board-level repair", in plain sentences |

Unchanged: the capability, the second-diagnosis pathway ("Already been told it's dead? Get a second diagnosis."), the message "When replacing parts stops working, diagnosis begins.", the page structure in Build Command §15, and the trade-escalation audience. "Board-level" and "microsoldering" remain allowed as descriptive terms in explanatory copy, never as a brand.

### 2.3 Enquiries — AGREED

Every submitted enquiry is stored in Postgres and triggers an email notification.

- Persistence: Postgres via **Neon** (provisioned through the Vercel Marketplace), behind an `EnquiryRepository` interface.
- Notification: **Resend**, behind a `Notifier` interface. A failed email never loses or duplicates the stored enquiry.
- Case reference: issued by the database on insert, format `HUS-` + 6 digits (Canon §14.1). Shown only after a successful insert.
- Local/dev/test: an in-memory adapter that is clearly labelled as a test and cannot run in production. Production refuses to report success without a real database write.
- Credentials (`DATABASE_URL`, `RESEND_API_KEY`, notification recipient address) are supplied by Prince; the build documents them and fails visibly, not silently, when absent.

## 3. Business facts register

_DRAFT — currently none confirmed. Prince to fill what he can; anything left blank stays a TODO in config and is omitted from the site._

Facts live in one typed config file (`src/config/business.ts`), validated by Zod. Unknown = absent, never a fake default. A production preflight fails the build if a placeholder-looking value ships.

| Fact | Needed for | Status |
|---|---|---|
| Trading name / legal name / ABN | footer, policies, structured data | TODO |
| Public address, or drop-off point, or "non-public" | contact, footer, LocalBusiness schema | TODO |
| Phone | header/footer contact, click-to-call | TODO |
| Email (public) | contact | TODO |
| Enquiry notification recipient email | Resend | TODO |
| Opening / support hours | contact, schema | TODO |
| Drop-off availability and process | enquiry logistics step | TODO |
| Mail-in (flagged off at launch) | — | later |
| Pickup (flagged off at launch) | — | later |
| Diagnostic fee policy | motherboard repair page, enquiry confirmation | TODO |
| Quote approval rule ("we quote before any work") | repair + motherboard pages | TODO |
| Pricing for common repairs (or "quote on enquiry") | repair pages | TODO — default: quote path only |
| Parts categories used (genuine / aftermarket grades) | repair pages | TODO |
| Warranty terms | repair pages, footer | TODO |
| Data handling / backup guidance | repair pages, privacy policy | TODO |
| Trade-escalation model (referral vs white-label) | motherboard repair page trade block | TODO |
| Production domain | canonical URLs, sitemap | TODO |
| Logo / wordmark | header, favicon, OG image | TODO — v0 mark drawn by Fable, see §5.4 |
| About story (Luke / Husky background, real facts only) | `/about` | TODO — Prince supplying |

## 4. Stack and architecture

_DRAFT — to confirm._

- Next.js (current stable at build time, App Router), React Server Components by default, strict TypeScript, npm, Vercel.
- Styling: CSS custom-property design tokens + CSS Modules. No UI kit. No Tailwind.
- Validation: Zod at every boundary (config, content, enquiry).
- Content: typed local content (TS for services, device categories, repair types, FAQs; MDX for Knowledge when enabled) behind one access layer. No CMS.
- Feature flags: one typed registry of keys with dependencies, launch profiles as presets, one resolved snapshot per request consumed by nav, routes, homepage composition, CTAs, sitemap, JSON-LD and enquiry options. Disabled routes return a real 404. Static/env provider now; Vercel Flags adapter behind the same interface, enabled once the Vercel project exists.
- Data: Neon Postgres + Resend (§2.3). Use a light query layer (e.g. Drizzle or plain `@neondatabase/serverless`) with one migration for the `enquiries` table. Fable decides and logs it.
- Tests: Vitest for flag resolution and enquiry validation/persistence logic; Playwright + axe for route smoke, flag leakage per profile, keyboard-only enquiry, 404s.
- Motion: CSS by default. GSAP only for the motherboard explainer if it earns its place, and only loaded on that route.

## 5. Visual direction — "Bench Pop"

_AGREED: Prince wants a modern, fun site that stands out, because most local competitors have weak sites. Direction chosen: **Bench Pop**._

### 5.1 How "fun" fits the Canon

Canon §17 asks for "precise, industrial, editorial" with "one restrained accent" and warns against neon repair-shop and gamer palettes. Bench Pop keeps the Canon's discipline but turns the volume up in a few places:

- **One signature colour, used boldly but rarely.** Big flat blocks of colour for a handful of moments (hero highlight, the second-diagnosis band, the final CTA), not sprinkled on every element. Logged in `ops/DECISIONS.md` as an interpretation of Canon §17: the colour is still single and purposeful, just confident.
- **Personality comes from type, copy and interactions**, not decoration: chunky expressive display type, witty but plain-English microcopy, sticker-style tags, and small interactions that teach something.
- Still forbidden (Build Command §3.1): gradient blobs, glassmorphism, six identical icon cards, neon purple/blue, fake metrics/logos, animation for its own sake, giant pill buttons everywhere.

### 5.2 Palette

| Token role | Direction |
|---|---|
| Canvas | Clean white / very light warm white |
| Ink | Near-black for text and heavy rules |
| Signature | **Signal orange** — saturated, warm, not neon. Fable picks the exact value and proves contrast: ink text on orange must be ≥ 4.5:1; never white body text on orange unless it passes |
| Supporting neutrals | 2–3 greys for rules, muted text (≥ 4.5:1 on canvas), surfaces |
| Status | Error / success / warning colours, always paired with text |

Dark sections: allowed sparingly (e.g. the motherboard explainer) only with their own tested contrast tokens.

### 5.3 Type

- Display: **Bricolage Grotesque** (OFL), heavy weights for headlines, tight but legible.
- Body: a highly readable sans — Bricolage at text sizes if it reads well at 16–18px, otherwise pair with **Inter** or **Instrument Sans**. Fable tests both and logs the choice.
- Labels and technical values: a mono (**JetBrains Mono** or **IBM Plex Mono**) for tags, case references (`HUS-000123`), part names and status stickers.
- Self-host via `next/font`. Body ≥ 16px on mobile, key explanatory copy 17–19px, no ultra-light weights (Build Command §10.2).

### 5.4 Mascot — original husky

- An **original** husky character, drawn as clean SVG in the Bench Pop style (flat shapes, ink outlines, signature orange accents). It must not resemble any existing brand mascot or known character.
- Fable draws a **v0 mascot and logo mark** so the site has one from day one. Both live in `public/brand/` as standalone SVGs so an illustrator can replace them later without code changes.
- Where the mascot appears (sparingly): logo mark, 404 page ("this page didn't survive the drop test"), enquiry confirmation, empty states, maybe one hero moment. Not on every section.
- Poses needed: neutral/logo, holding a screwdriver or magnifier (confirmation), confused (404). Fable keeps the same character across poses.

### 5.5 Signature elements

1. **Sticker tags** — mono-type label stickers with a slight rotation ("CRACKED SCREEN?", "WON'T CHARGE?", "FIXED", "DIAGNOSING") on problem tiles and case examples. Used sparingly.
2. **Signature colour band** — the full-bleed orange band for the second-diagnosis message ("Already been told it's dead? Get a second diagnosis.").
3. **Problem-first tiles** — device category tiles lead with the symptom, not the device icon, with a playful "something weird?" tile for unusual devices (Canon: "If it has a motherboard, ask us.").
4. **Motherboard explainer** — an interactive, code-drawn board illustration on `/motherboard-repair` (tap areas: power, charging, display, data) with plain-English labels first. Must work as static content without JS and with reduced motion.
5. **Case-file cards** — for real repair cases once Prince supplies them; until then the slots are absent, never faked.

### 5.6 Motion

CSS hover/press feedback with a bit of bounce on tiles and stickers. One signature interaction (the motherboard explainer). Everything respects `prefers-reduced-motion`. No scroll-jacking, no text animations.

## 6. Image slots (no stock photography)

_AGREED (approach): there are no real photos yet; Prince is organising them. No stock, AI-generated or illustrative substitute imagery anywhere._

- Every place a photo belongs gets an `ImageSlot` component: a box at the final aspect ratio with a soft shadow and a short centred caption describing exactly what the photo should show, e.g. "Close-up: iPhone logic board under the microscope, mid-repair".
- Each slot has a stable id and is registered in one file (`src/content/image-slots.ts`: id, page, aspect ratio, caption/brief, alt text to use once filled).
- When a file exists at `public/photos/<slot-id>.jpg` (or `.webp`), the slot renders the real image via `next/image` automatically; otherwise it renders the placeholder box. No code change to swap.
- The build generates `docs/SHOT_LIST.md` from the registry so Prince has a single shot list to work through.
- Placeholders must look deliberate in the layout (correct size and position), so screenshots still show the real composition.

## 7. Launch pages

_DRAFT — page list for Prince to review. Detailed section-by-section content comes next._

| Route | Page | Purpose | Notes |
|---|---|---|---|
| `/` | Home | Say what Husky does in seconds and route people to the right next step | Repair-led composition (Canon §20.1 trimmed to the launch set) |
| `/repair` | Repair | Problem-first entry into consumer repairs | Canon §7, §20.2 |
| `/repair/[category]` | Phones, tablets, laptops, desktops/PCs, consoles, other devices | What we fix for that device type, common problems, how it works | Six categories. Category level at launch; brand/model/repair-level routes architected but no model records yet |
| `/motherboard-repair` | Motherboard repairs | Second-diagnosis path, what board-level repair is, process, limits | Build Command §15 structure; the brand-proof page |
| `/book` | Start a repair | Multi-step enquiry → DB + email → case reference | One question at a time; works without JS |
| `/about` | About | The real story behind Husky | Prince supplies the story; page is gated on that content existing — no invented biography |
| `/contact` | Contact | How to reach Husky | Only renders facts that are confirmed; otherwise points to `/book` |
| `/policies/privacy` | Privacy policy | Required because the enquiry collects personal info | Clearly marked DRAFT — needs Luke's review, not AI-approved legal text |
| `/policies/repair-terms` | Repair terms | Quotes, approval, warranty, data | Same: DRAFT until reviewed |
| 404 | Not found | Helpful way back | Renders from the nav model |

Primary nav at launch: **Repair · Motherboard repairs · About** + persistent **Start a repair** button. Footer: contact, policies, and the "If it has a motherboard, ask us." line.

## 8. Later divisions (built, flagged off)

_DRAFT._ These ship in the codebase, switched off, so turning one on later is a config change plus real facts — not a rebuild. None of them may leak into the launch site (nav, homepage, footer, sitemap, JSON-LD, enquiry options, copy).

| Division | Feature keys | Build to | Notes |
|---|---|---|---|
| Business, schools, IT providers, repair partners | `business`, `schools`, `tradePartners` | Full pages written and styled | Canon §12, §20.9. No SLAs, volumes or response times |
| Privacy / GrapheneOS | `privacy`, `grapheneOs` | Full pages; device compatibility as dated data records | Canon §10. No absolute security claims; hardware mods are Husky services, not GrapheneOS features |
| Recycling | `recycling` | Full page | Canon §11 lifecycle hierarchy; no unproven environmental outcomes |
| Knowledge | `knowledge` | Index + article template (MDX), zero published articles | Real articles come from real repairs later |
| Refurbished + builder | `refurbished`, `refurbBuilder` | Inventory schema + builder UI shell with live build sheet, dev-only fixture data | Canon §9. No checkout; no offers without real inventory |
| Repair tracking | `repairTracking` | Architecture only | Possible later: lookup by HUS reference + email against the enquiries table |
| Pickup / mail-in | `pickup`, `mailIn` | Logistics options in the enquiry flow, config-driven | Off until real areas, fees and addresses exist |

Priority if time runs short: Business → Privacy → Recycling → Knowledge → Refurbished. The launch set always comes first.

## 9. Milestones and gates

_DRAFT._ Each milestone ends with: `npm run lint`, `typecheck`, `test`, `build` all passing; the production build running locally; screenshots of every touched page at 390px and 1440px saved to `ops/screenshots/<milestone>/`; a critical review against Canon §16–17, §29 and Build Command §3 written into `ops/VERIFY.md`; fixes made before moving on; commit and push.

| # | Milestone | Contents |
|---|---|---|
| M1 | Foundation | Next.js scaffold, strict TS, lint/format/test tooling, `.env.example`; design tokens + fonts; feature registry, dependencies, profiles (`motherboard-only`, `repair-core` = launch, `full`, etc.), resolver, one snapshot per request; business-facts config + production preflight; route catalogue with real 404s; root layout, header, footer, mobile nav; `ImageSlot` + registry; v0 logo and mascot |
| M2 | Brand slice | Home (launch composition + `motherboard-only` composition) and `/motherboard-repair` including the explainer. This milestone decides whether the site feels like Husky — iterate on screenshots until it does |
| M3 | Repair | `/repair` and the six category pages, content written per Canon §7.2 |
| M4 | Enquiry | `/book` multi-step flow (one question at a time, "I don't know" paths, back without losing progress, works without JS), Zod validation both sides, Neon repository + migration, Resend notifier, in-memory test adapter, `HUS-######` reference, honest confirmation page, spam protection (honeypot + rate limit) |
| M5 | Supporting + discovery | `/about` (gated on content), `/contact`, draft policies, 404 with mascot; metadata, canonicals, OG image, sitemap, robots, JSON-LD (Organization/LocalBusiness only with confirmed facts, Service, BreadcrumbList); generated `docs/SHOT_LIST.md` |
| M6 | Flagged divisions | Everything in §8, in priority order |
| M7 | Hardening | Profile-leakage tests across all profiles; Playwright + axe on every route; keyboard-only enquiry; 320px reflow and 200% zoom; reduced motion; Lighthouse/perf pass; docs (README, `docs/FEATURES.md`, `docs/CONTENT.md`, `docs/DEPLOY.md`, `docs/UNRESOLVED_BUSINESS_FACTS.md`); final independent review by a fresh subagent that has not seen the build |

Push to `origin main` (https://github.com/ukbu88/HuksyTechRepairs-V2) at the end of every milestone.

## 10. Definition of done

_DRAFT._ The build is done when all of these are true:

1. The launch profile (`repair-core`: repair + motherboard repair + booking) renders a complete, intentional site with no trace of disabled divisions in nav, homepage, footer, copy, sitemap, JSON-LD or enquiry options — proven by automated tests.
2. `motherboard-only` and `full` profiles also render coherent sites (tested), so the business can change scope with config alone.
3. An enquiry submitted on mobile, keyboard-only, and with JS disabled is stored in Postgres, triggers an email, and shows a real `HUS-` reference. With no database configured, production refuses to fake success.
4. No invented business facts anywhere. Every unknown is listed in `docs/UNRESOLVED_BUSINESS_FACTS.md`; the production preflight fails on placeholders.
5. No stock or generated photography; every photo spot is a labelled `ImageSlot` and appears in `docs/SHOT_LIST.md`.
6. The site looks like Bench Pop, not a template: a fresh reviewer comparing screenshots against Build Command §3.1 finds no generic-SaaS patterns.
7. WCAG 2.2 AA in practice: axe clean, keyboard complete, visible focus, 44px targets, 16px+ body, reflow at 320px, 200% zoom, reduced motion respected.
8. Lint, typecheck, unit tests, e2e tests and production build all pass on a clean clone.
9. README and the docs explain setup, env vars (Neon, Resend, site URL), feature flags and launch profiles, content editing, swapping in photos/mascot, and Vercel deployment.
10. Everything is pushed to GitHub `main`.
