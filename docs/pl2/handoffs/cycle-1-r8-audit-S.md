# Handoff-S: Sprint 7 Cycle 1 — R8 / ADV-S1 mobile-hero overflow audit (S-only)

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-7-cycle-1-audit`
**Issue:** `docs/pl2/handoffs/cycle-1-r8-audit-issue.md`
**Runbook:** `docs/pl2/pl-plan--sprint-7-mobile-hero-overflow.md`
**Mode:** autonomous, audit-only (no F, no T, no commit)
**Operator-facing report:** [`cycle-1-r8-audit-report.html`](cycle-1-r8-audit-report.html)

## T precondition
N/A — no T ran this cycle (audit-only). Skipped per issue instructions.

## Browser-tool precondition
- Playwright 1.59.1 available via `npx playwright` ✓
- ImageMagick `compare` on PATH at `/opt/homebrew/bin/compare` ✓
- All four landing URLs return HTTP 200 ✓

## Method

Probed each landing page in headless Chromium at viewport widths 375×667 and 320×667 with `deviceScaleFactor: 1`. For each, measured:
- `document.documentElement.scrollWidth` vs `document.documentElement.clientWidth` (page-level horizontal-overflow indicator).
- `document.body.scrollWidth` vs `clientWidth`.
- After `window.scrollTo(9999, 0)`, observed `window.scrollX`. If 0, no horizontal scrollability exists.
- Enumerated every element where `getBoundingClientRect().right > viewport.width + 1`, captured selector, computed `display`/`min-width`/`overflow-x`/`white-space`, and the three nearest ancestors with their `display` / `overflow-x` / `min-width`.

Full-page screenshots stored at `docs/pl2/handoffs/screenshots/sprint-7-cycle-1/` (`t3-<slug>-<vw>-live-20260512.png`). Raw JSON results at `probe-results.json` in the same directory. Reproducer scripts: `probe.mjs` (with offender enumeration) and `probe-scroll.mjs` (with `scrollTo` confirmation).

## Page-level measurements

WCAG 2.1 SC 1.4.10 (Reflow) — the binding criterion — passes when `documentElement.scrollWidth <= clientWidth` at 320 CSS px (no horizontal scrollbar). The −15 px delta below corresponds to the vertical-scrollbar gutter excluded from `scrollWidth`; in every case `scrollX` remains 0 after a maximum-right scroll attempt, confirming no horizontal scrollability.

| Page | Viewport | docScroll | docClient | bodyScroll | scrollX after scrollTo(9999,0) | Page-level overflow? |
|---|---:|---:|---:|---:|---:|---|
| `/` (homepage) | 375 | 360 | 375 | 360 | 0 | NO |
| `/services` | 375 | 360 | 375 | 360 | 0 | NO |
| `/how-we-do-it` | 375 | 360 | 375 | 360 | 0 | NO |
| `/open-source-projects` | 375 | 360 | 375 | 360 | 0 | NO |
| `/` (homepage) | 320 | 305 | 320 | 305 | 0 | NO |
| `/services` | 320 | 305 | 320 | 305 | 0 | NO |
| `/how-we-do-it` | 320 | 305 | 320 | 305 | 0 | NO |
| `/open-source-projects` | 320 | 305 | 320 | 305 | 0 | NO |

**All eight probes PASS WCAG 2.1 SC 1.4.10.** No page-level horizontal scroll on any landing page at either 375 or 320.

## Offender enumeration

Per-page enumeration of any element whose `getBoundingClientRect().right` exceeds viewport width, regardless of whether an ancestor clips it. Page-level overflow is the binding signal — these are diagnostic.

### `/services` @ 375 and @ 320
Zero offenders. No descendant exceeds viewport.right.

### `/how-we-do-it` @ 375 and @ 320
Zero offenders.

### `/open-source-projects` @ 375 and @ 320
Zero offenders.

### `/` (homepage) @ 375
Thirteen offenders, all SVG descendants. Top three:

| # | Selector | rect.right | width | overflowBy | min-width | overflow-x |
|---|---|---:|---:|---:|---|---|
| 1 | `svg` | 1049 | 970 | 674 | `970px` | `hidden` |
| 2 | `rect` (inside svg) | 1039 | 200 | 664 | `0px` | `visible` |
| 3 | `text` (inside svg) | 991 | 132 | 616 | `0px` | `visible` |

Parent chain of offender #1:
- `p0`: `div.heal-flow` — `display: block`, `overflow-x: auto`, `min-width: 0px`
- `p1`: `div.dy-section__content` — `display: flex`, `overflow-x: visible`, `min-width: auto`
- `p2`: `div.grid` — `display: grid`, `overflow-x: visible`, `min-width: 0px`

The svg is the heal-flow process-diagram, intentionally wider than the viewport. It is clipped/scrolled inside `div.heal-flow` (`overflow-x: auto`) — the same internal-scroll container resolved in commit `d8622f6` (Cycle-debt Phase 1: heal-flow). The svg's `right` exceeds the viewport in absolute coordinates, but the heal-flow ancestor prevents it from contributing to the page's `documentElement.scrollWidth`. This is the **expected** design behavior: a process diagram that the user scrolls horizontally inside its own container while the page itself does not scroll horizontally.

### `/` (homepage) @ 320
Sixteen offenders, same pattern as 375 (same svg descendants, slightly more text labels exceed the narrower viewport). All inside `div.heal-flow` with `overflow-x: auto`. Same conclusion.

## Root-cause hypothesis

**There is no page-level mobile-hero overflow to fix.** The R8 / ADV-S1 finding from the original `/services` overhaul has been resolved by intervening work, most likely:

- `d8622f67e` — `fix(heal-flow): eliminate mobile page-level horizontal scroll` (Cycle-debt Phase 1). `min-width: 0` + `width: 100%` on the flex item to defeat the `min-content` default.
- `26026741d` — `fix(a11y): mobile hero overflow + dark-zone link contrast + title-cta token + header radius`.
- `40a4b0511` — `fix(theme): eliminate 768px hero overflow and tablet logo-grid clipping`.
- `4256e1f07` — `fix(articles): WCAG 1.4.10/1.4.11 mobile reflow + 1.4.11 UI boundary contrast + double-escape`.
- `51b2ba340` — `feat(theme): FU-2 hero H1 live-CSS reconciliation` (Sprint 4 hero tracking) — narrowed hero H1 to brief tokens, which would have reduced any letterform-driven hero overflow.

The remaining homepage offenders are the intentional heal-flow process-diagram SVG and its descendants, all clipped by `div.heal-flow { overflow-x: auto }` — internal horizontal-scroll behavior that the design brief authorizes for the process diagram. This does not implicate the page's reflow budget.

## Design brief compliance (mobile, 375)

Spot-check against `docs/pl2/briefs/pl_design_brief.md` §"Responsive behavior" §"Per-section mobile behavior":

| Brief expectation | Observed | Match |
|---|---|---|
| No page-level horizontal scroll at 375 on landing hero | Confirmed on all four pages | YES |
| Process diagram (heal-flow) may scroll horizontally inside its container | `div.heal-flow { overflow-x: auto }`, content extends to ~1049 px right | YES (intentional) |
| Hero H1 fits viewport without letterform overflow | Top offender list contains no hero-section elements on any page | YES |
| Hero CTA pair does not force horizontal scroll | Zero hero-section offenders | YES |
| Hero image / SVG does not exceed viewport | Zero hero-image offenders; only heal-flow svg (separate section) appears | YES |

## WCAG 2.2 AA audit (relevant items only — this is overflow audit scope)

| Check | Result | Notes |
|---|---|---|
| 1.4.10 Reflow @ 320 (spec minimum) | PASS | All four landing pages: `scrollWidth ≤ clientWidth`, `scrollX = 0` |
| 1.4.10 Reflow @ 375 (target) | PASS | All four landing pages: same |
| 1.4.10 Internal-scroll exception | PASS | heal-flow process diagram uses an authorized internal `overflow-x: auto`; brief permits this for diagrams |

Other 2.2 AA checks (focus rings, forced-colors, reduced-motion, zoom 200 %, headings, alt text) are not in scope for this audit-only cycle — they belong to the Sprint 7 final-cycle WCAG sweep.

## Static preview comparison

Not run. Pixel-diff against preview is secondary for this audit per issue instructions; the binding signal is DOM measurement, which is unambiguous. The four live captures and the offender enumeration are sufficient to verdict.

## Cycle 2 carve recommendation

**Recommendation: do NOT carve any Cycle 2 fix cycle. Sprint 7 may close after this audit cycle, OR proceed directly to the final-cycle cross-landing-page WCAG 1.4.10 sweep already defined in the runbook.**

Rationale:
- Page-level overflow at 375 and 320 is zero on all four landing pages.
- The R8 / ADV-S1 tech-debt item is empirically resolved by prior commits (`d8622f6`, `26026741d`, `40a4b0511`).
- The only remaining "offenders" are the intentional heal-flow internal-scroll svg on homepage — brief-authorized behavior, not a defect.
- Carving Cycle 2 to "fix" a non-defect would consume an F-T-S cycle producing no measurable improvement.

Operator decision needed: (a) close Sprint 7 with this audit as the resolution record + a tech-debt-register update marking R8 / ADV-S1 RESOLVED; or (b) keep Sprint 7's pre-committed final-cycle WCAG sweep as a regression-prevention checkpoint. Either is defensible. The runbook §"Final cycle" verification work is cheap (T+S only) and would harden the result against future regression, so (b) has marginal value.

## Verdict

**PASS** — audit complete; no fix cycle needed. R8 / ADV-S1 (mobile-hero overflow / WCAG 1.4.10) is RESOLVED on the shipped state of all four landing pages at both 375 and 320. Recommend marking the tech-debt-register entry RESOLVED and either closing Sprint 7 or proceeding directly to the final-cycle WCAG sweep without intermediate fix cycles.

## Advisory notes

- Tech-debt-register §A R8 / ADV-S1 should be moved to RESOLVED with citation of commit `d8622f6` (primary) + this audit handoff (verification).
- The heal-flow internal-scroll behavior on the homepage process diagram is intentional and should be documented as such if not already — at 375 the svg extends to ~1049 px (over by ~674 px) inside its `overflow-x: auto` container. That is correct behavior, but if a future audit accidentally flags it as "overflow", this handoff is the authoritative reference.
- Re-running this audit after any hero or heal-flow restructuring (especially anything that changes flex parent of heal-flow, or removes its `overflow-x: auto`) is cheap (one `node probe.mjs` run, ~30 s) and recommended as a regression check.

## Artifacts

- `docs/pl2/handoffs/screenshots/sprint-7-cycle-1/probe.mjs` — Playwright probe + offender enumeration.
- `docs/pl2/handoffs/screenshots/sprint-7-cycle-1/probe-scroll.mjs` — scrollTo confirmation script.
- `docs/pl2/handoffs/screenshots/sprint-7-cycle-1/probe-results.json` — raw JSON of all eight probes.
- `docs/pl2/handoffs/screenshots/sprint-7-cycle-1/t3-<slug>-<vw>-live-20260512.png` — eight full-page screenshots.
- `docs/pl2/handoffs/cycle-1-r8-audit-report.html` — operator-facing HTML report.
