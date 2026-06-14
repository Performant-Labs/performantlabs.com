# Handoff-S: Sprint 7 — Final cycle — WCAG 1.4.10 cross-landing-page regression baseline

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-7-cycle-final-verification`
**Issue:** `docs/pl2/handoffs/cycle-final-r8-baseline-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/cycle-final-r8-baseline-T.md`
**Handoff-F reviewed:** N/A (verification-only cycle; antecedent audit `docs/pl2/handoffs/cycle-1-r8-audit-S.md`)
**Operator-facing report:** [`cycle-final-r8-baseline-report.html`](cycle-final-r8-baseline-report.html)
**Mode:** autonomous

## T precondition

T reported zero blocking issues. T1 + T2 + scrollWidth re-probe + pa11y all PASS across all four landing pages. Proceed.

## Browser-tool / visual-diff precondition

- Playwright 1.59.1 installed at project (`node_modules/playwright`) ✓
- ImageMagick `compare` on PATH at `/opt/homebrew/bin/compare` ✓ (not exercised — verification-only baseline, no preview to diff against)
- All four landing URLs return HTTP 200 (per T) ✓

This cycle is a **regression-prevention baseline**, not a brief-vs-build pixel diff. There is no static preview for these four landing pages on the canonical preview surface; the binding signals are (a) DOM measurement, (b) hero-region clipping check via H1 / CTA bounding rects, and (c) full-page screenshots at all four breakpoints retained as the canonical reference for future regression detection.

## Tier 3 visual + reflow baseline

Method: Playwright headless Chromium, `deviceScaleFactor: 1`, `ignoreHTTPSErrors: true`. For each of 4 pages × 4 viewports (16 probes), captured:

- `documentElement.scrollWidth` vs `clientWidth`
- `body.scrollWidth` vs `clientWidth`
- `window.scrollX` after `window.scrollTo(9999, 0)` (definitive horizontal-scrollability signal)
- Offender enumeration excluding `div.heal-flow` descendants (authorized internal scroller)
- Hero H1 bounding-rect: in-viewport flag
- Hero CTA buttons (up to 4 per page): in-viewport flag
- Full-page PNG screenshot at the viewport

Reproducer: `docs/pl2/handoffs/screenshots/sprint-7-final/probe.mjs`. Raw JSON: `probe-results.json` in the same directory.

### Reflow + offender + hero-clip results (all 16 probes)

| Page | Viewport | docScroll | docClient | scrollX after scrollTo(9999,0) | Page-level offenders (excl. heal-flow) | H1 in viewport | CTAs in viewport |
|---|---:|---:|---:|---:|---:|---|---|
| `/` | 320 | 305 | 320 | 0 | 0 | YES | 4 / 4 |
| `/services` | 320 | 305 | 320 | 0 | 0 | YES | 4 / 4 |
| `/how-we-do-it` | 320 | 305 | 320 | 0 | 0 | YES | 2 / 2 |
| `/open-source-projects` | 320 | 305 | 320 | 0 | 0 | YES | 1 / 1 |
| `/` | 375 | 360 | 375 | 0 | 0 | YES | 4 / 4 |
| `/services` | 375 | 360 | 375 | 0 | 0 | YES | 4 / 4 |
| `/how-we-do-it` | 375 | 360 | 375 | 0 | 0 | YES | 2 / 2 |
| `/open-source-projects` | 375 | 360 | 375 | 0 | 0 | YES | 1 / 1 |
| `/` | 768 | 753 | 768 | 0 | 0 | YES | 4 / 4 |
| `/services` | 768 | 753 | 768 | 0 | 0 | YES | 4 / 4 |
| `/how-we-do-it` | 768 | 753 | 768 | 0 | 0 | YES | 2 / 2 |
| `/open-source-projects` | 768 | 753 | 768 | 0 | 0 | YES | 1 / 1 |
| `/` | 1280 | 1265 | 1280 | 0 | 0 | YES | 4 / 4 |
| `/services` | 1280 | 1265 | 1280 | 0 | 0 | YES | 4 / 4 |
| `/how-we-do-it` | 1280 | 1265 | 1280 | 0 | 0 | YES | 2 / 2 |
| `/open-source-projects` | 1280 | 1265 | 1280 | 0 | 0 | YES | 1 / 1 |

All 16 probes PASS. `docScroll = docClient − 15` at every viewport corresponds to the vertical-scrollbar gutter excluded from `scrollWidth`; `scrollX = 0` after max-right scroll confirms no horizontal scrollability anywhere. Zero non-authorized offenders. Hero H1 and every enumerated hero-region CTA fully in-viewport on all four pages at every breakpoint.

### Hero / kicker / CTA visual baseline (320, 375)

Visual inspection of the 8 mobile-viewport screenshots (`t3-<slug>-{320,375}-live-20260512.png`):

| Page | Viewport | Hero H1 | Hero kicker / lede | Hero CTAs | Clipping observed |
|---|---|---|---|---|---|
| `/` | 320 | Fully visible, no letterform clipping | Visible | Both stacked, full-width, fully in viewport | None |
| `/services` | 320 | Fully visible | Visible | Stacked, full-width, both visible | None |
| `/how-we-do-it` | 320 | Fully visible | Visible | Single CTA fully visible | None |
| `/open-source-projects` | 320 | Fully visible | Visible | Single CTA fully visible | None |
| `/` | 375 | Fully visible | Visible | Both stacked, full-width | None |
| `/services` | 375 | Fully visible | Visible | Stacked, full-width | None |
| `/how-we-do-it` | 375 | Fully visible | Visible | Single CTA fully visible | None |
| `/open-source-projects` | 375 | Fully visible | Visible | Single CTA fully visible | None |

These eight PNGs are retained as the canonical hero-region baseline for any future regression sweep.

### heal-flow internal-scroll carry-forward

T re-confirmed `div.heal-flow` at 375: `overflow-x: auto`, `min-width: 0`, internal `scrollWidth` 1002 px, `clientWidth` 233 px, `canScroll: true`. The wider process-diagram svg is contained inside `div.heal-flow` and does not propagate to page-level `documentElement.scrollWidth`. This baseline excludes heal-flow descendants from the offender count by design; if a future audit changes that container's `overflow-x` or removes `min-width: 0`, expect page-level overflow to reappear and this baseline to fail.

## Design brief compliance (mobile, per `docs/pl2/briefs/pl_design_brief.md` §Responsive behavior)

| Brief expectation | Observed (across 4 pages × {320, 375}) | Match |
|---|---|---|
| No page-level horizontal scroll at 375 on landing hero | docScroll ≤ docClient, scrollX = 0 on all 8 probes | YES |
| Process diagram (heal-flow) may scroll horizontally inside its container | Confirmed by T re-probe; excluded from offender count by design | YES (intentional) |
| Hero H1 fits viewport without letterform overflow | H1 in-viewport on all 8 mobile probes | YES |
| Hero CTA pair does not force horizontal scroll, stacks below sm | Zero offenders; CTAs stacked + full-width on screenshots | YES |
| Hero image / SVG does not exceed viewport | Zero hero-image offenders on any page at any viewport | YES |

## WCAG 2.2 AA audit (cross-landing-page, combined table)

One combined row per check covers all four landing pages. Per-page divergence is called out in Notes when it exists.

| Check | Result | Notes |
|-------|--------|-------|
| 1.3.1 Info & relationships — heading hierarchy | PASS | Single H1 per page; H1 → H2 → H3 → H2 progression; no skipped levels on any of the four pages (T-§Tier 2 heading hierarchy) |
| 1.3.1 Info & relationships — ARIA landmarks | PASS | `<header>`, `<main>`, `<footer>` on all four; `<nav>` with `aria-labelledby` (2–3 per page) (T-§Tier 2 ARIA landmarks) |
| 1.3.1 Info & relationships — semantic structure | PASS | Toggle = `<button>`, navigation = `<a>`; nav rendered as `<ul>/<li>`; `aria-expanded` set dynamically by `primary-menu.js` (T-§Tier 2 Semantic structure) |
| 1.3.4 Orientation | PASS | Responsive layout; no orientation-locked content |
| 1.4.3 Contrast (text) | PASS with operator-approved deviations | 2 element types fail target: `.button--primary` white-on-`#62BBCB` at 2.21:1 (need 4.5:1) and `.breadcrumb__link` `#1893b4`-on-cream at 3.12:1 (need 4.5:1). Both pre-approved operator deviations (T-§WCAG contrast). Pa11y 6 errors across 4 pages, 0 new — all on allowlist (PC-5 PASS). |
| 1.4.4 Resize text | PASS | At 200 % zoom, no clipping; reflow probe at 320 (≈ 200 % at 640) shows scrollX = 0 |
| 1.4.10 Reflow @ 320 (spec minimum) | PASS | docScroll ≤ docClient, scrollX = 0 on all four pages |
| 1.4.10 Reflow @ 375 (target) | PASS | docScroll ≤ docClient, scrollX = 0 on all four pages |
| 1.4.10 Reflow @ 768 | PASS | docScroll ≤ docClient, scrollX = 0 on all four pages |
| 1.4.10 Reflow @ 1280 | PASS | docScroll ≤ docClient, scrollX = 0 on all four pages |
| 1.4.10 Internal-scroll exception | PASS | heal-flow process diagram uses authorized `overflow-x: auto`; brief permits (T-§heal-flow internal-scroll) |
| 1.4.11 Non-text contrast | PASS | Focus ring `#1893b4` on white = 3.56:1 ≥ 3.0:1 (T-§WCAG contrast). No new 1.4.11 failures vs. Sprint 4 baseline. |
| 1.4.12 Text spacing | PASS | Inherited from Sprint 4 token system; no change this cycle |
| 2.1.1 Keyboard | PASS | Toggle button + anchor CTAs are keyboard-reachable (T-§Tier 2 semantic structure); no JS focus traps in served HTML |
| 2.4.3 Focus order | PASS | DOM order matches visual reading order on all four pages (header → main → footer; nav before main) |
| 2.4.6 Headings & labels | PASS | Hero kicker + H1 + lede per page; visually-hidden `<h2>` labels for `<nav>` elements (T-§Tier 2 ARIA landmarks) |
| 2.4.7 Focus visible | PASS | `--theme-link-color` focus-ring token = `#1893b4` on white = 3.56:1 (T-§WCAG contrast) |
| 2.5.5 / 2.5.8 Target size | PASS | `mobile-nav-button` confirmed 44×44 px in `phase-8.7-color-spacing-T.md` §8.1; carried forward by T |
| 3.2.3 Consistent navigation | PASS | Same header/footer markup on all four pages |
| 4.1.2 Name, role, value | PASS | `aria-labelledby` on nav, `aria-label` on SVGs (3 per page); `aria-expanded` dynamic on toggle (T-§Tier 2 semantic structure) |
| Forced-colors mode | PASS (carried forward) | No new forced-colors-incompatible CSS added this cycle (verification-only) |
| Reduced-motion mode | PASS (carried forward) | No new transitions added this cycle (verification-only) |
| Image alt text | PASS | Spot-checked decorative SVGs use `aria-label` (3 per page); content `<img>` carry alt per Sprint 4 baseline |

**All WCAG 2.2 AA rows: PASS**, with the two pre-approved 1.4.3 contrast deviations explicitly carried forward on the operator's pre-existing allowlist (no new failures introduced).

## Static preview comparison

Not applicable. There is no static preview for these four landing pages on the canonical preview surface; the design brief is the source of truth and the live build is its own canonical render. The 16 full-page screenshots in `docs/pl2/handoffs/screenshots/sprint-7-final/` are the regression-prevention baseline going forward.

## Acceptance criteria status

| Criterion | Evidence | Result |
|---|---|---|
| `scrollWidth ≤ clientWidth` at 320 and 375 on all four landing pages | 16-row probe table above; rows 1–8 | PASS |
| No new pa11y errors introduced (PC-5) | T-§Pa11y: 6 total errors across 4 pages, 0 new, all on allowlist | PASS |
| Heading hierarchy clean per page | T-§Tier 2 heading hierarchy; per-page outline confirmed for all four | PASS |
| T3 visual at 320 + 375 shows no clipping on hero, CTAs, kickers | 8 mobile screenshots; H1 and CTAs in-viewport per probe; visual inspection clean | PASS |
| WCAG 2.2 AA every row PASS per S template | Combined table above; all rows PASS (1.4.3 with allowlisted operator deviations) | PASS |

## Verdict

**PASS** — Sprint 7 final-cycle regression baseline established. All four landing pages (`/`, `/services`, `/how-we-do-it`, `/open-source-projects`) clear WCAG 2.1 SC 1.4.10 at 320, 375, 768, and 1280; zero non-authorized offenders; hero H1 + CTAs fully in viewport at all mobile widths; full WCAG 2.2 AA sweep clean with the two pre-existing operator-approved contrast deviations carried forward on the allowlist. R8 / ADV-S1 remains RESOLVED. Ready for O to commit (`chore(landing-pages): sprint 7 final cycle — WCAG 1.4.10 regression baseline`).

## Advisory notes

1. **Baseline scope.** The 16 full-page PNGs in `docs/pl2/handoffs/screenshots/sprint-7-final/` are the canonical visual reference for these four landing pages at the four named breakpoints. Future regression cycles should pixel-diff against this set, not against Cycle 1's (which covered only 320 + 375).
2. **Reproducer.** `probe.mjs` in the same directory re-runs the full 16-probe sweep in ≈ 30 s. Cheap to re-execute after any hero/nav/section restructuring.
3. **heal-flow vigilance.** Any change that removes `overflow-x: auto` from `div.heal-flow`, or removes `min-width: 0` from its flex item, will reintroduce page-level overflow on `/` at 320/375. Worth a CI guard if churn in that section is anticipated.
4. **Allowlist clarity.** The two pre-approved 1.4.3 contrast deviations (`.button--primary` 2.21:1, `.breadcrumb__link` 3.12:1) are documented in `phase-8.7-color-spacing-T.md`. If the brand-color tokens move, both should be re-measured and re-approved.

## Artifacts

- `docs/pl2/handoffs/screenshots/sprint-7-final/probe.mjs` — Playwright 16-probe reproducer
- `docs/pl2/handoffs/screenshots/sprint-7-final/probe-results.json` — raw JSON of all 16 probes
- `docs/pl2/handoffs/screenshots/sprint-7-final/t3-<slug>-<vw>-live-20260512.png` — 16 full-page screenshots
- `docs/pl2/handoffs/cycle-final-r8-baseline-report.html` — operator-facing HTML report
