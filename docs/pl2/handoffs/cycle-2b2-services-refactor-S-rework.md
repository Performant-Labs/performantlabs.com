# Handoff-S (rework): Cycle 2b.2 — /services selector-class refactor

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-10-cycle-2b2-services`
**Issue:** `docs/pl2/handoffs/cycle-2b2-services-refactor-rework-issue.md`
**Handoff-F (rework) reviewed:** `docs/pl2/handoffs/cycle-2b2-services-refactor-F-rework.md`
**Prior S (REWORK) reviewed:** `docs/pl2/handoffs/cycle-2b2-services-refactor-S.md`
**Operator-facing report:** [`cycle-2b2-services-refactor-report.html`](cycle-2b2-services-refactor-report.html)
**Mode:** autonomous

## T precondition

Confirmed — prior T cycle reported zero blocking issues. F's rework adds no
new templates and changes no DOM beyond canvas `additional_classes`; T1 + T2
in F's rework handoff cover the structural deltas (marker present in served
HTML, CSS specificity served, idempotency, no `!important`, no horizontal
overflow on any page at any viewport, component_version preserved).

## Verification approach (cycle 2b.1 method, re-applied)

The branch already contains both of F's rework fixes:
1. The new `scripts/sprint10-cycle2b2-rework-about-us-hero-marker.php` (run, idempotent).
2. The doubled-class specificity bump in `dy-section.css` (`.dy-section.dy-section--wordmark-strip` for §-padding and header-collapse rules).

To produce a true pixel diff, the pre-refactor state was reconstructed locally:

1. `node scripts/capture-cycle-2b2-rework.js live` — Playwright captured full-page PNGs at 1280×800, 768×1024, 375×667 for /services, /about-us, /how-we-do-it, /open-source-projects, / with F's rework state applied.
2. `git stash` saved F's `dy-section.css` edits.
3. `scripts/undo-markers-2b2-rework-tmp.php` (idempotent, one-shot, temp) removed:
   - 4 service markers from canvas_page id=3 (indices 0, 3, 4, 5).
   - The hero `dy-section--cta-pair` marker from canvas_page id=17 index 0.
4. `ddev drush cr` cleared cache.
5. `node scripts/capture-cycle-2b2-rework.js baseline` captured pre-refactor PNGs under identical conditions.
6. `git stash pop` restored F's CSS; `scripts/sprint10-cycle2b2-services-markers.php` and `scripts/sprint10-cycle2b2-rework-about-us-hero-marker.php` re-applied markers; `ddev drush cr` cleared cache; the temporary undo script was deleted.
7. ImageMagick `compare -metric AE` ran against each baseline/live pair. Composites produced for all 15 pairs.

Working tree restored to F's intended state at S exit. The temp undo script is removed. The two rework artifacts F created (marker script + CSS specificity bump) remain in place.

## Tier 3 visual audit

### AE matrix

All 15 page×viewport combinations:

| Page | VP | Baseline dims | Live dims | AE (pixels) | % | Status |
|---|---|---|---|---|---|---|
| /services | 1280 | 1280×4418 | 1280×4418 | 0 | 0.00% | **MATCH** |
| /services | 768 | 768×5249 | 768×5249 | 0 | 0.00% | **MATCH** |
| /services | 375 | 375×6555 | 375×6555 | 0 | 0.00% | **MATCH** |
| /about-us | 1280 | 1280×4549 | 1280×4549 | 0 | 0.00% | **MATCH** |
| /about-us | 768 | 768×5690 | 768×5690 | 0 | 0.00% | **MATCH** |
| /about-us | 375 | 375×7952 | 375×7952 | 0 | 0.00% | **MATCH** |
| /how-we-do-it | 1280 | 1280×5378 | 1280×5378 | 0 | 0.00% | **MATCH** |
| /how-we-do-it | 768 | 768×6471 | 768×6471 | 0 | 0.00% | **MATCH** |
| /how-we-do-it | 375 | 375×8174 | 375×8174 | 0 | 0.00% | **MATCH** |
| /open-source-projects | 1280 | 1280×4490 | 1280×4490 | 0 | 0.00% | **MATCH** |
| /open-source-projects | 768 | 768×7041 | 768×7041 | 0 | 0.00% | **MATCH** |
| /open-source-projects | 375 | 375×9293 | 375×9293 | 0 | 0.00% | **MATCH** |
| / | 1280 | 1280×4754 | 1280×4754 | 0 | 0.00% | **MATCH** |
| / | 768 | 768×5658 | 768×5658 | 0 | 0.00% | **MATCH** |
| / | 375 | 375×7065 | 375×7065 | 0 | 0.00% | **MATCH** |

Pixel-identical (AE=0) on every page at every viewport. Both prior-S regressions resolved:

- **/about-us (was 15.5–17.0%)** → 0.00%. Hero CTAs now render side-by-side at desktop after the `dy-section--cta-pair` marker patch.
- **/services (was 4.5–6.6%)** → 0.00%. Wordmark-strip padding restored after specificity bump `.dy-section.dy-section--wordmark-strip` (0,2,0) reclaims the cascade from the `padding-top--l` / `padding-bottom--l` utilities (0,1,0).

No new regression introduced on /how-we-do-it, /open-source-projects, or /. AE=0 preserved.

### Per-section delta description

No deltas at any viewport on any page. All sections render byte-identical to the pre-refactor baseline.

## Design brief compliance

Refactor cycle, no visual change intended. Pixel-identical confirms every design-brief token (colors, typography, spacing, borders, shadows, decorative treatments) is preserved.

## WCAG 2.2 AA audit

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | PASS | DOM order unchanged (canvas component tree untouched aside from `additional_classes`) |
| Focus ring visibility | PASS | No focus rules touched |
| Forced-colors mode | PASS | No color rules touched |
| Reduced-motion | PASS | No motion rules touched |
| 200% zoom | PASS | No layout regression; pixel-identical at all 3 viewports |
| Heading hierarchy | PASS | Carry-forward from prior T |
| Image alt text | PASS | No `<img>` added or modified |
| Mobile touch targets (375) | PASS | `min-height: 44px` preserved on all P4/P8 button rules |
| Mobile typography scale | PASS | No typography rules touched |
| Mobile layout | PASS | /about-us mobile stacks identically; AE=0 |
| ARIA landmarks | PASS | Carry-forward |
| Color contrast | PASS | No color values changed; ratios unchanged from prior T's recomputation |
| No `!important` in active rules | PASS | Confirmed in served CSS; 0 active occurrences |
| **Visual parity: /services pixel-identical at 1280/768/375** | **PASS** | AE=0 |
| **Visual parity: no regression on /about-us** | **PASS** | AE=0 |
| Visual parity: no regression on /how-we-do-it | PASS | AE=0 |
| Visual parity: no regression on /open-source-projects | PASS | AE=0 |
| Visual parity: no regression on / | PASS | AE=0 |

## Static preview comparison

No static preview exists in `docs/pl2/Previews/` for /services in this state. The pre-cycle shipped state is the canonical reference; the AE matrix above is the canonical comparison.

## Cross-page regression check

- /how-we-do-it: AE=0 at 1280/768/375 — **PASS**
- /open-source-projects: AE=0 at 1280/768/375 — **PASS**
- / (home): AE=0 at 1280/768/375 — **PASS**
- /about-us: AE=0 at 1280/768/375 — **PASS** (was REWORK)

## Acceptance criteria status

| Criterion | Evidence | Result |
|---|---|---|
| All affected /services sections + /about-us hero have correct markers | F's T1 grep of rendered HTML; S confirmed via curl | PASS |
| P2 + P4 + P10 use marker selectors; P3 removed | T verified prior cycle; rework adds specificity (0,2,0) to P10 selectors | PASS |
| P8 old `:has()` half removed | Confirmed | PASS |
| **/services renders pixel-identical at 1280/768/375 vs pre-refactor** | AE=0 at all 3 viewports | **PASS** |
| **No regression on /about-us (hero + closing CTA)** | AE=0 at all 3 viewports | **PASS** |
| No regression on /how-we-do-it, /open-source-projects, / | AE=0 at all 3 viewports each | PASS |
| No `!important` | Served CSS verified | PASS |
| Canvas `component_version` preserved | F verified id=17 idx=0 retains `e6079b189d228dad`; prior T verified id=3 sections | PASS |

## Verdict

**PASS** — both rework targets resolved; pixel-identical (AE=0) on /services, /about-us, /how-we-do-it, /open-source-projects, and / at 1280×800, 768×1024, and 375×667. All AC met. Ready for O to commit.

### Notes on the two fixes

1. **About-us hero marker (Fix 1).** F chose the marker-script path (option a in the rework issue) over restoring a transition selector. The marker is the intended end state and is consistent with the marker pattern used across all other sections; this completes the refactor cleanly rather than leaving a transition.
2. **P10 specificity bump (Fix 2).** Root cause was correctly identified: `.dy-section--wordmark-strip` (0,1,0) was losing to `.padding-top--l` / `.padding-bottom--l` utility classes (also 0,1,0) by source order. Doubling the class to `.dy-section.dy-section--wordmark-strip` (0,2,0) restores parity with the old `.dy-section:has(.wordmark-strip-wrapper)` selector's specificity. No `!important` required.

## Advisory notes (non-blocking)

1. The marker pattern remains brittle in the general case: any new `dy-section.theme--white` section with two consecutive direct `.button` children must explicitly receive `dy-section--cta-pair`, because the old `:has(> .button + .button)` safety net is no longer in place. Worth a brief audit in a future cycle across `/contact-us`, `/articles`, `/privacy`, and any future landing pages.
2. The doubled-class specificity pattern (e.g. `.dy-section.dy-section--wordmark-strip`) is a fine local fix, but if future markers also need to outrank `padding-*--l` utilities, consider moving the marker-driven padding overrides into a higher-specificity layer or scope them under a parent selector consistently rather than ad-hoc doubling. Non-blocking.

## Files produced by S (rework)

- `docs/pl2/handoffs/cycle-2b2-services-refactor-S-rework.md` (this file)
- `docs/pl2/handoffs/cycle-2b2-services-refactor-report.html` (updated)
- `docs/pl2/handoffs/screenshots/sprint-10-cycle-2b2-rework/` — 60 PNGs (15 baseline + 15 live + 15 diff + 15 composite)
- `scripts/capture-cycle-2b2-rework.js` (Playwright capture helper, kept for reproducibility)
- `scripts/undo-markers-2b2-rework-tmp.php` — created and deleted during the verification run; not retained
