# Handoff-S: Cycle 2b.3 — /how-we-do-it selector-class refactor

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-10-cycle-2b3-how-we-do-it`
**Issue:** `docs/pl2/handoffs/cycle-2b3-how-we-do-it-refactor-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/cycle-2b3-how-we-do-it-refactor-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2b3-how-we-do-it-refactor-F.md`
**Operator-facing report:** [`cycle-2b3-how-we-do-it-refactor-report.html`](cycle-2b3-how-we-do-it-refactor-report.html)
**Mode:** autonomous

## T precondition

Confirmed — T reported zero blocking issues. T1 + T2 PASS across rendered HTML markers, CSS file selectors, no active `:has(.kicker--inline)` rules, no active sibling combinator, no `!important`, `component_version` preserved (`e6079b189d228dad` on [4]/[10]/[14]/[22]), idempotent marker script, single H1, ARIA landmarks, and cross-page HTTP 200 on /services, /about-us, /open-source-projects, /, /contact-us.

## Verification approach (cycle 2b.1/2b.2 method, re-applied)

To produce a true pixel diff against the pre-refactor shipped state, the pre-state was reconstructed locally:

1. `ddev drush cr` — cache clear in F's intended state.
2. `node scripts/capture-cycle-2b3.js live` — Playwright full-page PNGs at 1280×800 / 768×1024 / 375×667 for /how-we-do-it + 4 cross-page checks (/services, /about-us, /open-source-projects, /).
3. `git stash push -m cycle-2b3-S-tmp web/themes/.../css/components/dy-section.css` — set aside F's selector rewrite.
4. `ddev drush php:script scripts/undo-markers-2b3-tmp.php` — removed the 4 markers on canvas_page id=4 (idx 4/10/14/22). `component_version` preserved.
5. `ddev drush cr` — cache clear in pre-state.
6. `node scripts/capture-cycle-2b3.js baseline` — Playwright baseline PNGs under identical viewport conditions.
7. `git stash pop` — restored F's CSS.
8. `ddev drush php:script scripts/sprint10-cycle2b3-how-we-do-it-markers.php` — re-applied F's 4 markers.
9. `ddev drush cr` — cache clear back in F's state.
10. `rm scripts/undo-markers-2b3-tmp.php` — temp script removed.
11. `compare -metric AE` on all 15 baseline/live pairs. Composites produced via `magick +append`.

Working tree is restored to F's intended state at S exit. F's files (marker script + dy-section.css edits) remain. The temp undo script was deleted.

## Tier 3 visual audit

### AE matrix

All 15 page×viewport combinations, baseline (pre-refactor) vs live (F's state):

| Page | VP | Baseline dims | Live dims | AE (pixels) | % | Status |
|---|---|---|---|---|---|---|
| /how-we-do-it | 1280 | 1280×5378 | 1280×5378 | 0 | 0.00% | **MATCH** |
| /how-we-do-it | 768  | 768×6471  | 768×6471  | 0 | 0.00% | **MATCH** |
| /how-we-do-it | 375  | 375×8174  | 375×8174  | 0 | 0.00% | **MATCH** |
| /services | 1280 | 1280×4418 | 1280×4418 | 0 | 0.00% | **MATCH** |
| /services | 768  | 768×5249  | 768×5249  | 0 | 0.00% | **MATCH** |
| /services | 375  | 375×6555  | 375×6555  | 0 | 0.00% | **MATCH** |
| /about-us | 1280 | 1280×4549 | 1280×4549 | 0 | 0.00% | **MATCH** |
| /about-us | 768  | 768×5690  | 768×5690  | 0 | 0.00% | **MATCH** |
| /about-us | 375  | 375×7952  | 375×7952  | 0 | 0.00% | **MATCH** |
| /open-source-projects | 1280 | 1280×4490 | 1280×4490 | 0 | 0.00% | **MATCH** |
| /open-source-projects | 768  | 768×7041  | 768×7041  | 0 | 0.00% | **MATCH** |
| /open-source-projects | 375  | 375×9293  | 375×9293  | 0 | 0.00% | **MATCH** |
| / | 1280 | 1280×4754 | 1280×4754 | 0 | 0.00% | **MATCH** |
| / | 768  | 768×5658  | 768×5658  | 0 | 0.00% | **MATCH** |
| / | 375  | 375×7065  | 375×7065  | 0 | 0.00% | **MATCH** |

Pixel-identical (AE=0) on every page at every viewport.

### Per-section delta description

No deltas at any viewport on any page. All sections render byte-identical to the pre-refactor baseline. The selector rewrites (old `:has(.kicker--inline)` and `theme--secondary +` sibling combinator → new `.dy-section--kicker-inline` / `.dy-section--tight-header` marker selectors) carry identical `display: block` and `margin-bottom: 2rem` declarations and apply to the same 4 sections of /how-we-do-it.

### Desktop (1280) / Tablet (768) / Mobile (375)

All viewports: AE=0 on /how-we-do-it Week 1 / Week 2 / Week 3+ / "What we don't do" header blocks, and AE=0 on every cross-page comparator. No reflow, no offset, no visual delta.

## Design brief compliance

Refactor cycle, no visual change intended. Pixel-identical confirms every design-brief token (colors, typography, spacing, borders, shadows, decorative treatments, mobile responsive behavior) is preserved on /how-we-do-it and on the 4 cross-page checks.

## WCAG 2.2 AA audit

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | PASS | DOM order unchanged (canvas component tree untouched aside from `additional_classes`) |
| Focus ring visibility | PASS | No focus rules touched |
| Forced-colors mode | PASS | No color rules touched |
| Reduced-motion | PASS | No motion rules touched |
| 200% zoom | PASS | AE=0 at 375 (≈ 1280 at 200% reflow) confirms no zoom regression |
| Heading hierarchy | PASS | Carry-forward from T: H1 ×1, H2 ×4, H3 ×3 — no skipped levels |
| Image alt text | PASS | No `<img>` added or modified |
| Mobile touch targets (375) | PASS | No button rules touched; pixel-identical |
| Mobile typography scale | PASS | No typography rules touched |
| Mobile layout | PASS | AE=0 at 375 on /how-we-do-it and on all 4 cross-page checks |
| ARIA landmarks | PASS | `<header>` `<nav>` `<main>` `<footer>` confirmed by T |
| Color contrast | PASS | No color values changed; prior contrast ratios remain valid |
| No `!important` in active rules | PASS | T verified 2 occurrences, both in comments; zero active |
| **Visual parity: /how-we-do-it pixel-identical at 1280/768/375** | **PASS** | AE=0 |
| Visual parity: no regression on /services | PASS | AE=0 at 1280/768/375 |
| Visual parity: no regression on /about-us | PASS | AE=0 at 1280/768/375 |
| Visual parity: no regression on /open-source-projects | PASS | AE=0 at 1280/768/375 |
| Visual parity: no regression on / | PASS | AE=0 at 1280/768/375 |

## Static preview comparison

No static preview exists in `docs/pl2/Previews/` for /how-we-do-it. The pre-cycle shipped state is the canonical reference; the AE matrix above is the canonical comparison.

## Acceptance criteria status

| Criterion | Evidence | Result |
|---|---|---|
| Markers on affected sections of /how-we-do-it | T's grep + F's drush dump confirm 3× `dy-section--kicker-inline` ([4]/[10]/[14]) + 1× `dy-section--tight-header` ([22]) | PASS |
| P5 + P6 rewritten as marker-based | Git diff: 2 old selectors removed, 2 new marker selectors added; identical declarations | PASS |
| **/how-we-do-it AE = 0 at 1280/768/375 vs pre-refactor** | AE=0 at all 3 viewports | **PASS** |
| No regression on other pages | AE=0 on /services, /about-us, /open-source-projects, / at all 3 viewports | PASS |
| No `!important` | Served CSS verified by T; 0 active occurrences | PASS |
| `component_version` preserved | All 4 indices at `e6079b189d228dad` | PASS |
| T1 + T2 PASS | T handoff confirms | PASS |

## Verdict

**PASS** — all 7 acceptance criteria met. /how-we-do-it pixel-identical (AE=0) at 1280×800, 768×1024, and 375×667 against the pre-refactor baseline. No regression on the 4 cross-page checks (/services, /about-us, /open-source-projects, /). Ready for O to commit.

## Advisory notes (non-blocking)

1. The P6 specificity reduction from (0,4,0) sibling combinator to (0,3,0) marker is safe in the current cascade — no competing rule targets `margin-bottom` on `.dy-section__header` at (0,2,0)+ in this context — but if a future cycle introduces a higher-specificity utility rule on the section header, the marker selector may need the `.dy-section.dy-section--tight-header` doubling pattern used in cycle 2b.2 P10.

2. The marker class additions are now the canonical mechanism for "this section uses kicker-inline" and "this section needs the tight-header treatment." Any new section using inline kickers must receive the marker explicitly; the old `:has(.kicker--inline)` safety net is removed.

## Files produced by S

- `docs/pl2/handoffs/cycle-2b3-how-we-do-it-refactor-S.md` (this file)
- `docs/pl2/handoffs/cycle-2b3-how-we-do-it-refactor-report.html`
- `docs/pl2/handoffs/screenshots/sprint-10-cycle-2b3/` — 60 PNGs (15 baseline + 15 live + 15 diff + 15 composite)
- `scripts/capture-cycle-2b3.js` (Playwright capture helper, kept for reproducibility)
- `scripts/undo-markers-2b3-tmp.php` — created and deleted during the verification run; not retained
