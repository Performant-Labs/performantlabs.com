# Handoff-S: Cycle 2b.4 — Homepage logo-grid selector-class refactor

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-10-cycle-2b4-homepage-logo-grid`
**Issue:** `docs/pl2/handoffs/cycle-2b4-homepage-logo-grid-refactor-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/cycle-2b4-homepage-logo-grid-refactor-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2b4-homepage-logo-grid-refactor-F.md`
**Operator-facing report:** [`cycle-2b4-homepage-logo-grid-refactor-report.html`](cycle-2b4-homepage-logo-grid-refactor-report.html)
**Mode:** autonomous

## T precondition

Confirmed — T reported zero blocking issues. T1 + T2 PASS on rendered HTML markers (`dy-section--logo-grid` and `dy-section--post-hero-logos` both present, single occurrence each on the homepage logo-strip section), CSS file selectors (3 active marker-based rules, no active `:has(.logo-grid)`, no active `+` sibling combinator), no `!important`, `component_version` preserved (`e6079b189d228dad` at top-level of canvas_page id=20 component [6]), idempotent marker script, heading hierarchy intact (H1 ×1 / H2 ×7 / H3 ×6), ARIA landmarks present, four cross-page checks return HTTP 200 with zero logo-grid references, page sizes within ±4 bytes of F's baseline.

## Verification approach (cycle 2b.1/2b.2/2b.3 method, re-applied)

To produce a true pixel diff against the pre-refactor shipped state, the pre-state was reconstructed locally:

1. `ddev drush cr` — cache clear in F's intended state.
2. `node scripts/capture-cycle-2b4.js live` — Playwright full-page PNGs at 1280×800 / 768×1024 / 375×667 for / (homepage, primary AC target) + 4 cross-page checks (/services, /about-us, /how-we-do-it, /open-source-projects).
3. `git stash push -m cycle-2b4-S-tmp web/themes/custom/performant_labs_20260502/css/components/logo-grid.css` — set aside F's selector rewrite.
4. `ddev drush php:script scripts/undo-markers-2b4-tmp.php` — removed both markers on canvas_page id=20 component [6]. `additional_classes` reduced from `dy-section--logo-grid dy-section--post-hero-logos` to `''`. `component_version` preserved at `e6079b189d228dad`.
5. `ddev drush cr` — cache clear in pre-state.
6. `node scripts/capture-cycle-2b4.js baseline` — Playwright baseline PNGs under identical viewport conditions.
7. `git stash pop` — restored F's CSS.
8. `ddev drush php:script scripts/sprint10-cycle2b4-homepage-logo-grid-markers.php` — re-applied F's two markers to [6]. PATCH log confirmed both markers added back.
9. `ddev drush cr` — cache clear back in F's state.
10. `rm scripts/undo-markers-2b4-tmp.php` — temp undo script removed.
11. `compare -metric AE` on all 15 baseline/live pairs. Composites produced via `convert … +append`.

Working tree is restored to F's intended state at S exit. F's files (marker script + `logo-grid.css` edits) remain. The temp undo script was deleted.

## Tier 3 visual audit

### AE matrix

All 15 page × viewport combinations, baseline (pre-refactor) vs live (F's state):

| Page | VP | Baseline dims | Live dims | AE (pixels) | % | Status |
|---|---|---|---|---|---|---|
| / | 1280 | 1280×4754 | 1280×4754 | 0 | 0.00% | **MATCH** |
| / | 768  | 768×5658  | 768×5658  | 0 | 0.00% | **MATCH** |
| / | 375  | 375×7065  | 375×7065  | 0 | 0.00% | **MATCH** |
| /services | 1280 | 1280×4418 | 1280×4418 | 0 | 0.00% | **MATCH** |
| /services | 768  | 768×5249  | 768×5249  | 0 | 0.00% | **MATCH** |
| /services | 375  | 375×6555  | 375×6555  | 0 | 0.00% | **MATCH** |
| /about-us | 1280 | 1280×4549 | 1280×4549 | 0 | 0.00% | **MATCH** |
| /about-us | 768  | 768×5690  | 768×5690  | 0 | 0.00% | **MATCH** |
| /about-us | 375  | 375×7952  | 375×7952  | 0 | 0.00% | **MATCH** |
| /how-we-do-it | 1280 | 1280×5378 | 1280×5378 | 0 | 0.00% | **MATCH** |
| /how-we-do-it | 768  | 768×6471  | 768×6471  | 0 | 0.00% | **MATCH** |
| /how-we-do-it | 375  | 375×8174  | 375×8174  | 0 | 0.00% | **MATCH** |
| /open-source-projects | 1280 | 1280×4490 | 1280×4490 | 0 | 0.00% | **MATCH** |
| /open-source-projects | 768  | 768×7041  | 768×7041  | 0 | 0.00% | **MATCH** |
| /open-source-projects | 375  | 375×9293  | 375×9293  | 0 | 0.00% | **MATCH** |

Pixel-identical (AE=0) on every page at every viewport, including all 3 primary homepage comparators and all 12 cross-page comparators.

### Per-section delta description

No deltas at any viewport on any page. All sections render byte-identical to the pre-refactor baseline. The selector rewrites carry identical declarations to the prior `:has()` / sibling-combinator rules:

- `.dy-section:has(.logo-grid) .dy-section__header > *` → `.dy-section.dy-section--logo-grid .dy-section__header > *` (line 233) — "We Speak" label typography on the homepage logo strip.
- `.hero.theme--white + .dy-section:has(.logo-grid)` → `.dy-section.dy-section--post-hero-logos` (line 270) — section padding-top on the hero-adjacent logo strip.
- `.hero.theme--white + .dy-section:has(.logo-grid) .dy-section__header` → `.dy-section.dy-section--post-hero-logos .dy-section__header` (line 274) — header margin-bottom on the hero-adjacent logo strip.

Both new marker classes co-exist on the single homepage logo-strip section (canvas_page id=20 component [6], UUID `d239b0c9-79a6-46c5-a8f4-e7c6279491e3`). F's specificity trace (old (0,3,0) → new (0,3,0) for the header rule; old (0,4,0)/(0,5,0) → new (0,2,0)/(0,3,0) for the spacing rules) is confirmed by AE=0 — the reduced specificity is still sufficient to beat the competing utility classes at (0,1,0).

### Desktop (1280) / Tablet (768) / Mobile (375)

All viewports on / : AE=0 on the logo-strip "We Speak" header, the strip padding-top, the strip header margin-bottom, and every section above and below. No reflow, no offset, no visual delta.

All viewports on /services, /about-us, /how-we-do-it, /open-source-projects: AE=0. F's cross-page reach check (these selectors only ever matched the homepage) is empirically confirmed — none of the four cross-page renders shifted by a single pixel.

## Design brief compliance

Refactor cycle, no visual change intended. Pixel-identical confirms every design-brief token (colors, typography, spacing, borders, shadows, decorative treatments, mobile responsive behavior) is preserved on the homepage and on the 4 cross-page checks.

## WCAG 2.2 AA audit

| Check | Result | Notes |
|-------|--------|-------|
| Keyboard navigation | PASS | DOM order unchanged (canvas component tree untouched aside from `additional_classes`) |
| Focus ring visibility | PASS | No focus rules touched |
| Forced-colors mode | PASS | No color rules touched |
| Reduced-motion | PASS | No motion rules touched |
| 200% zoom | PASS | AE=0 at 375 confirms no zoom regression |
| Heading hierarchy | PASS | Carry-forward from T: H1 ×1, H2 ×7, H3 ×6 — no skipped levels |
| Image alt text | PASS | No `<img>` markup changed |
| Mobile touch targets (375px) | PASS | AE=0 at 375 — no target-size shift |
| Mobile typography scale | PASS | AE=0 at 375 — no scale change |
| Mobile layout | PASS | AE=0 at 375 — no reflow |
| "We Speak" label contrast | PASS | `#5C544C` on `#FFFFFF` = 7.43:1, well above AA 4.5:1 (T verified) |

## Static preview comparison

N/A — refactor cycle. The shipped pre-refactor state is the canonical reference; AE=0 against it is the binding gate. No preview file applies.

## Per-section delta table

All sections match on every page × viewport. Single row:

| Section | Viewport(s) | Status | Description |
|---|---|---|---|
| All sections, all pages | 1280, 768, 375 | MATCH | AE=0 across all 15 comparators. No visible difference detected. |

## Verdict

**PASS** — all 7 acceptance criteria met.

- [x] Marker(s) on the homepage logo-strip section. (`dy-section--logo-grid dy-section--post-hero-logos` on [6])
- [x] `logo-grid.css` rules rewritten as marker-based. (3 active selectors, zero active `:has()` or `+` rules)
- [x] Homepage AE = 0 at 1280/768/375. (confirmed by direct pixel diff against reconstructed pre-state)
- [x] No regression on /services, /about-us, /how-we-do-it, /open-source-projects. (AE=0 at all 12 cross-page comparators)
- [x] No `!important`. (T verified)
- [x] `component_version` preserved. (`e6079b189d228dad` at top-level of [6])
- [x] T1 + T2 PASS. (T verified)

Ready for O to commit.

## Advisory notes

- F's marker-strategy decision to apply two distinct markers to the single section (rather than merging) is sound: the markers serve distinct CSS purposes (`--logo-grid` for header typography; `--post-hero-logos` for hero-adjacent spacing). Keeps selectors semantically precise and would permit future unbundling if the logo-grid were ever placed outside the hero-adjacent position.
- F's autonomous correction of the canvas_page target from id=1 to id=20 (the live "Homepage v2" served by `html--page--20.html.twig`) is verified — id=20 is the entity that backs the live homepage in this site.
- F's specificity reduction on the spacing rules ((0,4,0)→(0,2,0) and (0,5,0)→(0,3,0)) is safe and confirmed by AE=0; the competing utility classes at (0,1,0) remain dominated.
- ADV-3 from cycle 1 audit §1.3 is fully resolved.
