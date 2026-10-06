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
