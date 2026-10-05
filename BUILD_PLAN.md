# Husky Tech Repairs — Build Plan (v2)

Owner: Prince. Executor: Fable 5.1 (single agent, may spawn subagents for verification only).
Status: DRAFT. Sections are agreed one at a time; only sections marked AGREED are binding.

| § | Section | Status |
|---|---|---|
| 0 | How to use this plan | DRAFT |
| 1 | Lessons from v1 and what changes | DRAFT |
| 2 | Launch scope and profile | OPEN — needs Prince |
| 3 | Business facts register | OPEN — needs Prince/Luke |
| 4 | Stack and architecture | DRAFT |
| 5 | Visual direction | OPEN |
| 6 | Global shell (header, footer, nav, 404) | TODO |
| 7 | Launch pages (page-by-page) | TODO |
| 8 | Later divisions | TODO |
| 9 | Milestones and gates | TODO |
| 10 | Definition of done | TODO |

---

## 0. How to use this plan

Read order before writing any code:

1. `BUILD_PLAN.md` (this file) — **highest authority for execution**. Where it conflicts with the Build Command, this file wins.
2. `source/CANON.md` — **brand and product authority**. Positioning, voice, message library, page structures, "never do" list (§29), open decisions (§32). This plan never overrides the Canon on brand; if it seems to, stop and flag it in `DECISIONS.md`.
3. `source/BUILD_COMMAND.md` — **engineering standards**. Read for: anti-slop rules (§3), feature architecture (§8), design system (§10), accessibility (§11), performance (§12), content/data (§13), booking (§14), Board Lab (§15), SEO (§20), testing (§26–27), acceptance gates (§29), docs (§38).
   - **Superseded:** §4–6 (four-agent Band room, worktrees, receipts), §40 steps 2–4. There is one executor. Ignore Band/Codex instructions.

The `.docx` files in `source/` are the originals; the `.md` files are faithful conversions for reading.

Working records (keep them short — these exist to stop re-litigating, not as deliverables):

- `ops/DECISIONS.md` — one line per real decision: what, why, date.
- `ops/VERIFY.md` — per milestone: routes checked, viewports, screenshots path, issues found/fixed.

## 1. Lessons from v1 and what changes

A previous Band run lives at `Desktop/husky-tech-repairs` (156 commits, 29–30 Sep 2026). It is **reference only**; do not edit it.

What it got right (keep):

- Feature system design: 15 typed keys, dependency rules, launch profiles, one resolved snapshot per request, disabled routes return a real 404, every nav/CTA/sitemap/JSON-LD entry filtered from the same catalogue. See v1 `ops/band/PLAN.md` and decisions D-003 → D-014, D-029 → D-031.
- Business-facts config with no invented defaults; production preflight that refuses placeholders.
- Enquiry flow that never reports success without real persistence; works without JavaScript.
- Accessibility baseline: 16px+ body, 44px targets, two-tone focus ring, 320px reflow, 200% zoom.

What went wrong (avoid):

- Roughly 90% of effort went into process (receipts, ledgers, role boundaries, merge protocol). Output: four text-only pages.
- Pages ended up as "text and rules only" — correct, accessible, and visually forgettable. The Canon asks for a recognisable identity built from real repair evidence and a small number of signature interactions.
- Content was hand-authored into page-model files, so pages read like structured data rather than written pages.

Rules for v2:

1. **Pages first, system second.** The feature system is required, but it is plumbing. Build it in the first milestone, then spend the rest of the run on pages that look and read like Husky.
2. **No ceremony.** No receipts, no role ownership tables, no merge protocol. Commit in small logical steps with clear messages.
3. **Verify by looking.** At the end of every milestone, run the site, screenshot each page at 390px and 1440px, and look at the screenshots critically against the Canon and Build Command §3 before moving on.
4. Porting code from v1 is allowed where it's clearly good (see §4), but re-read and simplify it — don't copy its abstraction depth.

## 2. Launch scope and profile

_OPEN — to agree with Prince._

## 3. Business facts register

_OPEN — to agree with Prince._

## 4. Stack and architecture

_DRAFT — to confirm._

- Next.js (current stable, App Router), React Server Components by default, strict TypeScript, npm, Vercel.
- Styling: CSS custom-property tokens + CSS Modules (as v1). No UI kit. No Tailwind unless agreed.
- Validation: Zod at every boundary (config, content, enquiry).
- Content: typed local content (TS for services/devices/repairs/FAQ, MDX for Knowledge) behind one access layer. No CMS.
- Feature flags: one typed registry + resolver; static/env provider now; Vercel Flags adapter behind the same interface later. Port from v1 `src/features/registry.ts`, `resolver.ts`, `profiles.ts`, `src/lib/flags/*` after review.
- Enquiry persistence and notifications: _OPEN_ (see §3).
- Tests: Vitest for flag/resolver/enquiry logic; Playwright + axe for route smoke, profile leakage, keyboard enquiry.
- Motion: CSS by default. GSAP only for the Board Lab explainer if it earns its place, route-split.

## 5. Visual direction

_OPEN._

## 6. Global shell

_TODO._

## 7. Launch pages

_TODO._

## 8. Later divisions

_TODO._

## 9. Milestones and gates

_TODO._

## 10. Definition of done

_TODO._
