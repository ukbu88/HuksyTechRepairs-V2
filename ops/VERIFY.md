# Verification log

Per milestone: routes checked, viewports, screenshot paths, issues found and fixed.
Viewports: 390×844 (mobile) and 1440×900 (desktop), production build, Chromium via Playwright.

## M1 — Foundation

Routes: `/` (placeholder home, replaced in M2), `/nope` (404), mobile menu open state.
Screenshots: `ops/screenshots/M1/`.

Checked against Canon §16–17, §29; Build Command §3; BUILD_PLAN §5.

- Fonts load self-hosted (Bricolage display, Inter body, JetBrains Mono labels); no FOUT on the screenshots, no Google Fonts request.
- Header: logo mark + wordmark, primary nav (Repair · Motherboard repairs), persistent signal "Start a repair". No disabled division appears anywhere in nav/footer under `repair-core`.
- Mobile header at 390px: wordmark hidden, mark + "Start a repair" + Menu all ≥ 44px targets. Menu is a native `<details>` so it works without JS; opening state screenshot confirms it overlays correctly.
- Footer: only confirmed facts render (trading name, city). Contact column falls back to the enquiry link. Fixed: removed "We reply by email" — an operational promise nobody has confirmed (Canon §29).
- 404: mascot (confused pose), "didn't survive the drop test", links generated from the nav model, action button. Reads as Husky, not a template.
- ImageSlot placeholder: deliberate shadow box with mono tag and brief; holds its 4:3 ratio at both widths.
- Palette: unit test proves ink-on-signal 5.63:1 and every text/background pair ≥ 4.5:1.
- Not yet judged for "Bench Pop" feel: the home is a placeholder; that judgement is M2's gate.

Issues found and fixed: footer promise (above); mobile header lost the persistent action under 560px (now always visible). Open: none.

## M2 — Brand slice

Routes: `/` (repair-core composition), `/motherboard-repair`, explainer with "Data" selected.
Screenshots: `ops/screenshots/M2/`.

Judged against Canon §16–17, §29; Build Command §3.1; BUILD_PLAN §5. Question asked of every screenshot: Bench Pop or template?

- Home hero: "Keep good technology alive." at hero scale, lead copy from Canon Appendix B, signal primary + outline secondary, bench photo slot with three tilted symptom stickers. Reads as Husky, not a SaaS hero: no gradient, no centred blob, no pill row.
- Capability rail: one mono strip of three true statements (device types, board-level diagnosis, case reference). Replaced the usual icon-card row. Fixed: text raised to 16px.
- Problem tiles: symptom sticker leads, device name follows; "Something else" tile in solid orange with "SOMETHING WEIRD?". Six tiles are not identical: stickers, tilts and the orange outlier break the grid.
- Motherboard proof: dark band carrying the Canon §4.2 pattern (familiar story → why it fails → what we do). Fixed: headline was five lines at h1 scale; reduced to a 3.75rem cap.
- Second-diagnosis band: full-bleed orange with ink text (5.6:1). One message, one action.
- Process: four steps with orange mono counters. Fixed: implicit grid rows were stretching, so step titles sat at different heights across columns (`align-content: start`). Fixed: band changed from warm to white so the page is not dark/orange/warm/dark in a row.
- Final CTA: dark band with the single mascot moment (neutral pose) and two actions.
- Mobile (390): hero stacks with the headline at 2.75rem, buttons full width, stickers under the photo. Tiles stack one per row with 44px+ targets. Nothing is squashed; nothing scrolls horizontally.
- `/motherboard-repair`: Build Command §15 structure complete (hero, what board-level means + explainer, faults, second-diagnosis path, five-step process with photo slots, limits, trade note, FAQ, CTA). Case-file slot renders nothing because no cases exist.
- Explainer: radio chips drive CSS `:has()` highlights on a code-drawn board; all four notes stay visible. Fixed: CSS Modules hashed the `#area-*` ids, so `:has()` never matched (wrapped in `:global()`). Fixed: DISPLAY and CHARGING labels collided with the Data callout. Works with JS disabled (radios + CSS) and reduced motion (durations collapse to 0).
- Invented facts check: no price, hours, address, turnaround, fee or warranty appears. "Nothing goes ahead until you say so" and "you approve before any repair work starts" follow the Canon's defined process (§8.2 steps 5–6); the exact quote/fee wording stays a config TODO and is only rendered when supplied.
- Links to `/book` 404 until M4 (expected).

Open: none for this milestone. M2 verdict: looks like Bench Pop. Keep the restraint: no new bands on later pages without a content reason.

## M3 — Repair

Routes: `/repair`, `/repair/phones`, `/repair/laptops`, `/repair/other` (desktop + mobile). `/repair/watches` → real 404 (dynamicParams off).
Screenshots: `ops/screenshots/M3/`.

- `/repair` landing: breadcrumb, problem-first hero, device tiles, "repairs we see most" as a three-column ruled list (Canon §7.1), board escalation band (only when motherboardRepair is on), process, logistics, second-diagnosis band, FAQ, CTA.
- Category pages follow Canon §7.2 in order: symptoms → causes → diagnosis → options → data → logistics → (cases) → FAQ → next action. Pricing shows the quote path only; turnaround and warranty are omitted; parts categories render only when configured.
- Fixed: long category headlines at hero scale left the photo slot looking small; added a `large` hero size for descriptive headlines (repair pages keep `hero` scale for the two brand pages only).
- Fixed: warm/white bands alternated every section on category pages; sections are now white with a top rule and only logistics sits on warm.
- Mobile: single column, two-column sections collapse to heading-then-list; CTAs full width; nothing clipped.
- Copy tests: a unit test rejects slop phrases and invented prices/turnaround/warranty across all category content, and the "repair anything" claim.
- Links to `/book?...` still 404 until M4.

Open: none.

## M4 — Enquiry

Routes: `/book` (every step), `/book/done`. Flow exercised end to end on a 390px viewport with JavaScript enabled and with JavaScript disabled, against the in-memory test store. Also the storage-unavailable, validation and tampered-logistics paths.
Screenshots: `ops/screenshots/M4/` (help, device with errors, symptoms, logistics, contact, done; desktop help and contact).

- One question per screen, mono progress "02 / 06" with an orange track, big tappable choices (56px), "I don't know" paths on every step (category unknown, model unknown, "not sure" prior repair, "arrange it" logistics).
- GET steps keep every answer in the URL, so Back and the summary's "Change" links never lose progress; contact details are posted and never appear in a URL.
- Validation: per-step on the server; errors show in a summary (`role="alert"`) and next to the field; only the step just submitted shows errors (a deep link to step 6 with nothing filled shows step 1 quietly).
- With JS disabled: identical behaviour. The final step posts to the server action; the reference HUS-001002 came back on a plain redirect.
- Confirmation: real reference from the store (never shown before insert), what happens next without any turnaround promise, what to do now, the magnifier mascot. Direct visit without a result cookie shows an honest "no recent enquiry" state.
- Fixed: the reference sticker overflowed at 390px; scaled with clamp.
- Logistics: launch profile offers only "arrange it with me" (no drop-off, mail-in or pickup facts exist). A forged `logistics=pickup` is rejected on both the GET step and the POST.
- Spam: honeypot, minimum 2.5s on the contact step, 5 submissions / 10 minutes per client address. All server-side.
- Production safety: no DATABASE_URL → storage throws → the user sees "we couldn't save your enquiry" and nothing claims success; memory store refused in production by the preflight and the container; Resend required in production.
- Invented-fact check: no response time, fee or drop-off address appears. "We reply by email" is the mechanism the form exists for, not a service-level promise.

Open: Neon and Resend adapters are tested against fakes only (no credentials in the build). Noted in Blocked / deferred.

## M5 — Supporting + discovery

Routes: `/contact`, `/policies/privacy`, `/policies/repair-terms`, `/about` (404 by design: no content yet), `/sitemap.xml`, `/robots.txt`, `/opengraph-image`.
Screenshots: `ops/screenshots/M5/`.

- `/contact` with no confirmed facts: honest headline ("The quickest way in is the enquiry."), the action, the HUS reply note and policy links. Nothing invented. Phone / email / hours / address / drop-off blocks are wired and render only when configured.
- Policies: both carry a visible DRAFT notice (warning tint, mono tag), `noindex` while unreviewed, and are excluded from the sitemap until `POLICY_STATUS.*.reviewed` is true. Every unconfirmed business term is an explicit italic "to be confirmed by Husky" line rather than invented wording.
- `/about` returns a real 404 and is absent from nav and sitemap; the template renders the moment `business.about` exists.
- Sitemap under `repair-core`: home, repair + six categories, motherboard repairs, book, contact. No disabled division, no draft policy, no /book/done (also disallowed in robots).
- JSON-LD verified in rendered HTML: Organization (not LocalBusiness: no public address), Service on /repair, the six category pages and /motherboard-repair, BreadcrumbList on inner pages. No telephone/address/hours/rating fields emitted.
- OG image: code-drawn, orange with ink Bricolage at 800, the logo mark, three label chips. Inspected at 1200×630.
- Canonicals on every page via `pageMetadata`; `metadataBase` from NEXT_PUBLIC_SITE_URL (localhost until Prince supplies the domain, flagged by the preflight).
- `docs/SHOT_LIST.md` regenerated on build (20 slots).

Open: none. Production origin still localhost in this environment (expected; strict preflight will refuse to ship it).

## M6 — Flagged divisions

Built under `HUSKY_LAUNCH_PROFILE=full` for screenshots: `ops/screenshots/M6-full/` (home, business, schools, privacy, grapheneos, devices, recycle, knowledge, refurbished, build, track; plus dev-mode captures of the builder with fixtures and the article template).

- Full homepage: the launch composition plus five division sections in one consistent shape (problem → belief → proof → action, mono proof labels, ink button). Nav: Repair · Motherboard repairs · Business · Privacy · Refurbished · Knowledge + Start a repair. Footer gains Track a repair and Recycling. It reads as one site, not five brochures.
- Business: four pages. Zero SLAs, response times, loan devices or capacity promises (unit-tested against those words). Trade model text follows `business.tradeEscalationModel` and says "decided per partner" while undecided.
- Privacy: three pages. No anonymity or "untraceable" claims; the opposite is stated. Compatible devices are dated records; the list is empty and the page says so rather than guessing. Hardware modifications are explicitly "not currently offered" until confirmed.
- Recycling: hierarchy ladder (reuse first, recycle last) with the first two rungs in orange; no environmental outcome claims.
- Knowledge: index says "Nothing published yet" in production. The template fixture renders only in development (`draft: true` → 404 in the production build, verified), and carries a visible "Development fixture" line.
- Refurbished: storefront and builder read from one inventory function. Production returns no stock (verified: "No devices are available to build from yet"); development fixtures carry no price and a "not real stock" label. Builder options are limited to what the chosen unit supports; the build sheet updates live and renders server-side without JS.
- Track: lookup needs reference + email; returns the Canon §14.2 status with its meaning. Storage-unavailable state is honest.
- Enquiry under `full`: logistics offers mail-in, pickup and arrange; "Several devices for a business or school" and "Old devices to reuse or recycle" appear as help options; the action rejects those values when the division is off.
- Leakage under `repair-core` (rebuilt, served, probed): every division route 404s, including the dev fixture article; no `href` to any division on home, repair, category, motherboard, contact or book; `/book` offers no fleet/recycle option; sitemap has 11 entries, none from a division.
- Fixed during the gate: none in product code. A dev-only capture issue (Next dev blocks client chunks for non-`localhost` origins) was a test-harness detail.

Open: Vercel/Neon credentials still absent; division copy awaits Prince's facts before any division is switched on.

## M7 — Hardening (part 1: automated)

- Playwright, launch profile, desktop + mobile projects: 126 passed. Covers every enabled route (status 200, one h1, no console errors, axe with WCAG 2.0/2.1/2.2 AA tags), every disabled route (404 with the mascot page), unknown category 404, sitemap/robots, Organization JSON-LD without unconfirmed facts, header nav equals the catalogue, rendered-HTML leakage of six divisions, enquiry options per profile, enquiry steps axe-clean with announced errors, back keeps progress, keyboard-only enquiry to a real reference, JS-disabled enquiry to a real reference, tampered logistics bounced, honeypot swallowed, /book/done honesty, 320px reflow on six routes, 200% zoom (720 CSS px) reflow, reduced motion (explainer still works; transitions collapse to ~0), 44px targets on header and tiles, mobile menu open/close on navigation, skip link.
- `motherboard-only` profile built into its own dist dir and tested on rendered pages: 38 passed (no /repair anywhere, nav = Motherboard repairs only, homepage coherent, enquiry has no phone/tablet/… tiles leaking from repair content).
- Fixed during the gate: field-level fieldset errors had an id with spaces and a second `role="alert"` (now one alert, valid ids); the no-JS mobile test raced a full-page navigation (test fixed to submit via focus + Enter, which is also the keyboard path).
- Perf (gzipped, from the production build): app CSS 7–9 kB per route; fonts 185 kB total (three variable WOFF2, preloaded by next/font with size-adjusted fallbacks); client JS is the Next 16 + React 19 runtime only (~136 kB gz: react-dom ≈ 69, app router ≈ 44, small shared chunks) plus a polyfill bundle served `nomodule` for legacy browsers only. The app ships one client component on launch routes (`CloseOnNavigate`, under 1 kB); the refurb builder is the only other and is flagged off. No motion library, no icon library, no analytics script. HTML 32–80 kB.
- `npm audit`: one high advisory (`braces`, via eslint-config-next's dev-only chain). Not in the shipped bundle; documented in README and DEPLOY.
