# Editing content

Everything the site says comes from typed files under `src/config` and `src/content`. No CMS. Zod validates each file at build; a mistake fails the build with a message rather than shipping.

Rule for all of it (Canon §29): never type a guess. If a fact is unknown, leave it `undefined` and the site omits it.

## Business facts — `src/config/business.ts`

The register from BUILD_PLAN §3. Fill in the fields as they become real:

- `legalName`, `abn` → footer and policies
- `addressPolicy: 'public' | 'non-public'`, `address` → contact page, footer, LocalBusiness JSON-LD (only when public)
- `phone`, `publicEmail`, `openingHours` → contact page, footer, JSON-LD
- `dropOff` → logistics blocks and the enquiry's logistics step
- `diagnosticFeePolicy`, `quoteApprovalRule`, `partsCategories`, `warrantyTerms`, `dataHandlingGuidance` → repair pages, motherboard FAQ, repair terms
- `tradeEscalationModel` → repair-partners page
- `cases` → case-file cards on `/motherboard-repair`, `/repair` and category pages (absent = no cards)
- `about` → publishes `/about` (headline + paragraphs)

The preflight rejects values that look like placeholders (`TODO`, `lorem`, `555-…`, `example.com`, …).

## Services and division copy

- Repair categories (the six tiles): `src/content/device-categories.ts` (name, sticker, summary) and `src/content/repair/<slug>.ts` (symptoms, causes, diagnosis, options, data note, FAQ). Keep the Canon §7.2 order; the template handles layout.
- Common repairs list: `COMMON_REPAIRS` in `src/content/repair/index.ts`.
- Process copy: `src/content/process.ts`.
- Motherboard faults: `BOARD_FAULTS` in `src/components/motherboard/FaultList.tsx`; explainer notes: `src/components/motherboard/board-areas.ts`.
- CTAs: `src/content/cta.ts` (Canon Appendix A with the Motherboard override).
- Business: `src/content/business.ts`. Privacy services and device records: `src/content/privacy-devices.ts`.

## Device models and repair types

Not yet: launch is category level. The route catalogue (`src/routes/catalogue.ts`) is where `/repair/<brand>/<model>/<repair>` entries will be added, driven by a future `src/content/devices.ts`. Until records exist there are no model pages, by design (no thin pages).

## FAQs — `src/content/faq.ts`

`motherboardFaq(business)` and `repairFaq(business)`. Items that depend on a fact are added only when the fact exists (fee policy, quote rule, warranty).

## Knowledge articles — `src/content/knowledge/`

1. Create `src/content/knowledge/<slug>.ts` exporting a `KnowledgeArticle` (see `schema.ts`): slug, title, the one-sentence `answer`, summary, category, author/reviewer, dates, entities, related services, and a `body` of blocks (`paragraph`, `heading`, `list`, `note`, `imageSlot`).
2. Add it to `ALL` in `index.ts`.
3. `draft: true` keeps it out of production, the index and the sitemap. Remove the flag to publish.

Write from a real repair. Say what could not be proven. No AI-generated article goes live without factual review (Canon Appendix D).

## Proof and case studies

Real cases go in `business.cases` (id, device, symptom, finding, outcome, date). They render as case-file records, never as testimonial cards. Until they exist the slot is absent.

## Photos — `src/content/image-slots.ts` and `docs/SHOT_LIST.md`

Each slot has an id, page, aspect ratio, brief and alt text. `docs/SHOT_LIST.md` is generated from it on every build. Drop the file at `public/photos/<id>.jpg|webp|png` and it replaces the placeholder automatically.

To add a slot: register it, place `<ImageSlot id="…" />` in the page, rebuild. Unregistered ids fail the build.

## Refurbished inventory — `src/content/refurbished/`

`InventoryDeviceSchema` is the record: SKU, model, storage, colour, grade, and a dated provenance record per component (display, battery, housing, cameras, logic board), inspection, options the unit supports, price in cents (absent = quote). Real records go in `listInventory()`; fixtures are development only. Grade definitions and provenance labels live in `schema.ts` and must be confirmed before launch.

## Policies — `src/app/policies/*` and `src/content/policies.ts`

Edit the page text directly; it is prose. When Husky has reviewed a policy, set `reviewed: true` with the date in `POLICY_STATUS`. That removes the DRAFT banner, allows indexing and adds the page to the sitemap.

## Voice checklist before committing copy (Build Command §21.2)

Would a normal person understand it on the first read? Does it answer a real doubt? Could a competitor copy it unchanged? Is the claim evidenced? Is the technical word necessary? Is the next action obvious? `tests/unit/repair-content.test.ts` rejects the common slop phrases and invented prices, turnaround and warranties.
