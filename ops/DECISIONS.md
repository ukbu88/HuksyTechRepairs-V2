# Decisions

One line per decision: date — decision — reason.

- 2026-10-06 — Clean-slate v2 repo; no code or reference from any earlier Husky build — Prince's direction.
- 2026-10-06 — Launch set: consumer repair + motherboard repair + enquiry; other divisions built behind flags, off — Prince's direction.
- 2026-10-06 — "Board Lab" renamed "Motherboard repairs" (`/motherboard-repair`, key `motherboardRepair`) — Prince's direction; consistent with Canon §6 plain-naming rule.
- 2026-10-06 — Enquiries persist to Neon Postgres and notify via Resend; `HUS-######` reference issued on insert — Prince's direction.
- 2026-10-06 — No stock or generated imagery; labelled shadow-box image slots until real photos are supplied — Prince's direction.
- 2026-10-06 — Visual direction "Bench Pop": white/ink + one bold signal-orange signature colour used in a few big blocks, Bricolage Grotesque display, mono labels, sticker tags — Prince wants modern and fun to beat weak competitor sites; read as a confident interpretation of Canon §17's single accent.
- 2026-10-06 — Original husky mascot; Fable draws v0 SVG mascot + logo mark, replaceable later — Prince's direction.
- 2026-10-06 — /about at launch, gated on Prince supplying the real story — Prince's direction.
- 2026-10-06 — Repair categories: phones, tablets, laptops, desktops/PCs, consoles, other — Prince's direction.
- 2026-10-06 — Next.js 16.3 App Router, React 19, strict TS 5.9, npm; CSS Modules + custom-property tokens, no Tailwind — BUILD_PLAN §4.
- 2026-10-06 — Fonts self-hosted from @fontsource-variable packages via next/font/local (Bricolage Grotesque opsz for display, Inter for body, JetBrains Mono for labels) — Google Fonts blocked in the build container; Inter chosen for body because Bricolage at 16–17px reads as display-y in the shell test.
- 2026-10-06 — Signal orange is #F25C05; ink text on it is 5.63:1, white on it fails (3.33:1), so orange blocks always carry ink text. #C24A00 ("signal-deep") is the only orange used as text on white (4.91:1). Enforced by tests/unit/tokens.test.ts — BUILD_PLAN §5.2.
- 2026-10-06 — Feature provider = env (HUSKY_LAUNCH_PROFILE + HUSKY_FEATURE_*) with a JSON-document provider as the seam for Vercel Flags/Global Config; the Vercel Flags SDK itself is not installed until a Vercel project exists — BUILD_PLAN §4.
- 2026-10-06 — Dependency enforcement: a feature whose dependency is off is forced off and recorded in `snapshot.suppressed`; tradePartners depends on business + motherboardRepair; pickup/mailIn/repairTracking depend on booking.
- 2026-10-06 — /about is gated on real content (`business.about`) rather than a feature flag; nav, sitemap and route all read the same gate.
- 2026-10-06 — Production preflight runs inside next.config.ts (strict on VERCEL_ENV=production or HUSKY_PREFLIGHT=strict): fails on placeholder-looking facts, missing DATABASE_URL / RESEND_API_KEY / ENQUIRY_NOTIFY_TO, localhost site URL, or the in-memory enquiry store.
- 2026-10-06 — Build scripts (shot list, screenshots) are `.mts` run by Node 22's native type stripping; no tsx/ts-node dependency.
- 2026-10-06 — Playwright pinned to 1.56.1 to match the preinstalled Chromium build in the container; e2e runs against the production server.
- 2026-10-06 — Mobile menu is a native <details>/<summary>; one tiny client component closes it on navigation. Works with JS off.
- 2026-10-06 — Mascot v0: flat ink/white husky with orange inner ears and collar, cheek tufts; poses neutral / magnifier / confused. Original drawing, not derived from any existing character.
- 2026-10-06 — Homepage is a typed composition (`composeHome` → ordered section kinds); page.tsx only maps kinds to renderers. `motherboard-only` leads with the division message and the second-diagnosis band; repair-led mode leads with the master line and problem tiles — Build Command §8.6.
- 2026-10-06 — Approval before work is rendered as part of the Canon-defined process (§8.2 steps 5–6: explanation → approval → repair). The fee policy and exact quote wording remain business-fact TODOs and only render when configured.
- 2026-10-06 — The trade-escalation audience stays on `/motherboard-repair` as one paragraph and one FAQ (BUILD_PLAN §2.2 keeps it); the Business division and its routes remain flagged off.
- 2026-10-06 — Board explainer is CSS-only (radio group + `:has()`), no GSAP; it degrades to a labelled static board with four always-visible notes. GSAP was not needed and is not installed.
- 2026-10-06 — Mascot appears on: logo mark, 404, home final CTA (the one hero moment), enquiry confirmation (M4). Nowhere else.
- 2026-10-06 — Enquiry steps 1–5 are GET forms (state in the URL, native back, no JS); only the contact step POSTs to a server action. Outcome and failed drafts cross the redirect in short-lived httpOnly cookies scoped to /book, so personal details never enter a URL.
- 2026-10-06 — Persistence is plain SQL over `@neondatabase/serverless` (no Drizzle): one table, one migration, and the `HUS-######` reference is a column default from a Postgres sequence starting at 1001 — the database issues it, never the app.
- 2026-10-06 — Notification is Husky-only (ENQUIRY_NOTIFY_TO). A customer acknowledgement email is deliberately not sent until a verified sending domain and reviewed wording exist; the confirmation page is the acknowledgement.
- 2026-10-06 — Rate limiting is in-memory per instance (5 per 10 minutes per client address) plus a honeypot and a minimum time-on-step. Documented as a soft brake, not a security boundary.
