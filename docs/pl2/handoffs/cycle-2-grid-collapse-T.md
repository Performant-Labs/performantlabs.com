# Handoff-T: Sprint 6 Cycle 2 - /services engagement grid 768 collapse (FU-S5-1)

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-6-cycle-2-grid-collapse`
**Issue:** `docs/pl2/handoffs/cycle-2-grid-collapse-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2-grid-collapse-F.md`

## Tier 1 results

| Check | Command | Expected | Actual | Result |
|---|---|---|---|---|
| Cache rebuild | `ddev drush cr` | `[success] Cache rebuild complete.` | `[success] Cache rebuild complete.` | PASS |
| HTTP /services | `curl -sk .../services -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| HTTP / | `curl -sk .../ -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| HTTP /about-us | `curl -sk .../about-us -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| HTTP /articles | `curl -sk .../articles -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| New @media in served CSS | `curl -sk .../grid-wrapper.css \| grep -A6 "max-width: 991px"` | `@media (max-width: 991px) { .grid-wrapper--2col .grid-wrapper__grid { grid-template-columns: 1fr; } .grid-wrapper--2col .grid-wrapper__grid > * { grid-column: auto; } }` | Exact match | PASS |
| No `!important` | `curl -sk .../grid-wrapper.css \| grep -c "!important"` | 0 | 0 | PASS |
| `.grid-wrapper--2col` on /services | `curl -sk .../services \| grep -c "grid-wrapper--2col"` | 1 | 1 | PASS |
| `.grid-wrapper--2col` absent on / | `curl -sk .../ \| grep -c "grid-wrapper--2col"` | 0 | 0 | PASS |
| `.grid-wrapper--2col` absent on /about-us | `curl -sk .../about-us \| grep -c "grid-wrapper--2col"` | 0 | 0 | PASS |
| `.grid-wrapper--2col` absent on /articles | `curl -sk .../articles \| grep -c "grid-wrapper--2col"` | 0 | 0 | PASS |
| `.grid-wrapper--2col` absent on /open-source-projects | `curl -sk .../open-source-projects \| grep -c "grid-wrapper--2col"` | 0 | 0 | PASS |
| `.grid-wrapper--2col` absent on /how-we-do-it | `curl -sk .../how-we-do-it \| grep -c "grid-wrapper--2col"` | 0 | 0 | PASS |
| `.grid-wrapper--2col` absent on /contact-us | `curl -sk .../contact-us \| grep -c "grid-wrapper--2col"` | 0 | 0 | PASS |
| DOM wrapper classes | grep class attributes containing `grid-wrapper` | `class="grid-wrapper grid-wrapper--2col"` and `class="grid-wrapper__grid gutter-column--l gutter-row--l"` | Exact match | PASS |
| Card count | `curl -sk .../services \| grep -c "<article"` | 4 | 4 | PASS |
| row-gap rule preserved | grep for `row-gap` in served CSS | `row-gap: 1.5rem` present | Present | PASS |

## Tier 2 results

| Check | Method | Result |
|---|---|---|
| Single H1 on /services | `curl -sk .../services \| grep -c '<h1'` → 1 | PASS |
| Heading hierarchy on /services (no skipped levels) | grep all h-tags: h2(visually-hidden) → h1 → h2 → h3 x 4 → h2 x n → h3(footer). Visually-hidden h2 elements are nav/breadcrumb skip targets, not document headings. Document structure: H1 → H2 → H3 — no level skipped. | PASS |
| ARIA `<header>` present | grep count on /services → 1 | PASS |
| ARIA `<main>` present | grep count on /services → 1 | PASS |
| ARIA `<footer>` present | grep count on /services → 1 | PASS |
| ARIA `<nav>` present | grep count on /services → 3 | PASS |
| Cross-page regression: /services only | curl grep on 7 pages: /services=1, all others=0 | PASS |
| Source order: @container before new @media | Source line 46 vs line 113 — @media (max-width: 991px) appears after @container (width > 600px) | PASS |
| Cascade at <=576px: no regression | `@media (max-width: 991px)` (line 113) overrides `@media (max-width: 576px)` (line 53) `grid-column: span 6` with `grid-column: auto`. On a `grid-template-columns: 1fr` grid, `auto` children still stack 1-col. End result identical to prior behavior (full-width single column). | PASS |
| row-gap 1.5rem not clobbered | `@media (max-width: 991px)` rule does not declare `row-gap`; existing bare `.grid-wrapper--2col .grid-wrapper__grid { row-gap: 1.5rem }` at line 78 remains and is unaffected. | PASS |
| Files changed match F's declaration | `git status --short` + `git diff HEAD`: only `grid-wrapper.css` and `css-change-log.md` modified; handoff and issue files are untracked new files. No unexpected changes. | PASS |

## WCAG contrast verification

No color, typography, or contrast properties were changed in this cycle. The change is limited to `grid-template-columns` and `grid-column` layout properties on `.grid-wrapper--2col`.

| Element | Foreground | Background | F's ratio | T's ratio | Result |
|---|---|---|---|---|---|
| (no color change) | — | — | N/A | N/A | N/A — layout only |

All pre-existing contrast ratios are preserved. No independent computation required.

## Mobile responsive verification

F reported responsive overrides. Verified against `grid-wrapper.css` source.

| Breakpoint | Behavior | CSS rule confirmed | Result |
|---|---|---|---|
| >= 992px (desktop) | 2-col via existing `@container (width > 600px)` → `grid-column: span 6` | New `@media (max-width: 991px)` does not fire at >=992px; @container rule at line 46 governs | PASS |
| 601–991px (tablet) | NEW: 1-col stack (`grid-template-columns: 1fr`, `grid-column: auto`) | `@media (max-width: 991px)` block at lines 113-120 | PASS |
| <= 600px (mobile) | 1-col stack (functionally same result via different path: 1fr grid + auto children instead of 6-col grid + span 6 children) | New rule at lines 113-120 overrides old `@media (max-width: 576px)` rule at lines 53-57 by source order; end visual result identical (single column) | PASS |

Touch targets: engagement cards are block-level elements; no touch-target regression possible from a `grid-template-columns` change. Consistent with F's assessment.

## Acceptance criteria status

| Criterion | Evidence | Result |
|---|---|---|
| `/services` engagements at 768×1024: 1-col, 4 cards stacked | `@media (max-width: 991px)` rule confirmed in served CSS; 4 `<article>` elements confirmed via curl; 768px is within max-width: 991px range | PASS |
| `/services` engagements at 992+: unchanged 2×2 | New rule does not fire at >=992px; existing `@container (width > 600px)` → `span 6` governs; source order confirmed | PASS |
| `/services` engagements at 375: unchanged 1-col | At 375px both the old and new paths produce 1-col stack (verified via cascade analysis above); functionally equivalent | PASS |
| No regression on `/`, `/about-us`, `/articles`, or other pages | T-independent grep on all 7 pages: zero `grid-wrapper--2col` matches outside `/services` | PASS |
| No `!important` | `grep -c "!important"` on served CSS → 0 | PASS |
| T1 + T2 PASS on `/services` | All T1 and T2 checks above pass | PASS |
| WCAG unchanged (no color/typography touched) | Diff confirms layout-only change: `grid-template-columns` and `grid-column` only | PASS |

## Blocking issues

None.

## Advisory notes

The existing `@media (max-width: 576px)` rule at lines 53-57 (which set `grid-column: span 6` on children) is now silently superseded by the new `@media (max-width: 991px)` rule at lines 113-120 (`grid-column: auto`). The visual outcome at <=576px is identical (1-col stack), but the old 576px child rule is now a dead rule — it fires but is immediately overridden. This is harmless and consistent with F's defensive rationale. It could be cleaned up in a future housekeeping pass, but is not blocking.
