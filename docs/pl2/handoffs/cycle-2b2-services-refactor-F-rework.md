# Handoff-F: Cycle 2b.2 Rework - /services selector-class refactor

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-10-cycle-2b2-services`
**Issue:** `docs/pl2/handoffs/cycle-2b2-services-refactor-rework-issue.md`

## Confirmation table (autonomous mode)

| Item | Value |
|---|---|
| Page being overhauled | /services + /about-us (rework) |
| GitHub issue number | N/A (file-based issue) |
| Working branch | `aa/pl-sprint-10-cycle-2b2-services` |
| Runbook phase | Sprint 10, Cycle 2b.2 rework |
| Input documents read | cycle-2b2-services-refactor-rework-issue.md, cycle-2b2-services-refactor-S.md, cycle-2b2-services-refactor-F.md, sprint10-cycle2b2-services-markers.php, sprint10-cycle2b1-about-us-markers.php, dy-section.css |
| Acceptance criteria count | 5 |
| Handoff document path | `docs/pl2/handoffs/cycle-2b2-services-refactor-F-rework.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | `web/themes/contrib/dripyard_base/components/_layouts/section/section.component.yml` |

## What was done

Two fixes applied, matching the two issues S identified:

### Fix 1 -- /about-us hero gets `dy-section--cta-pair` marker

- **`scripts/sprint10-cycle2b2-rework-about-us-hero-marker.php`** (new): Idempotent Canvas-patch script. Adds `dy-section--cta-pair` to /about-us hero (canvas_page id=17, index 0, uuid `a1e7c3b4-1d2f-4a5b-9c6d-7e8f9a0b1c2d`). Preserves `component_version` (`e6079b189d228dad`). Pattern follows existing marker scripts.

**Root cause:** F's prior pass claimed "P4 is /services-only" but the /about-us hero is also a `dy-section.theme--white` section with two consecutive `.button` direct children. The P4 direct swap from `:has(> .button + .button)` to `.dy-section--cta-pair` dropped /about-us hero coverage because it lacked the marker.

**Decision rationale:** Chose marker-script approach over restoring the P4 transition selector. Adding the marker is cleaner because: (a) it completes the refactor rather than leaving a transition state, (b) it is consistent with the marker pattern used across all other sections, (c) it is idempotent and preserves component_version.

### Fix 2 -- /services P10 wordmark-strip specificity fix

- **`web/themes/custom/performant_labs_20260502/css/components/dy-section.css`** (modified): Changed `.dy-section--wordmark-strip` to `.dy-section.dy-section--wordmark-strip` in two selectors (section padding and header display:none).

**Root cause:** The old P10 selector `.dy-section:has(.wordmark-strip-wrapper)` had specificity (0,2,0) from `.dy-section` (0,1,0) + `:has()` (0,1,0). The direct swap to `.dy-section--wordmark-strip` dropped specificity to (0,1,0). The section's `padding-top--l` and `padding-bottom--l` utility classes also have (0,1,0) specificity. At equal specificity, source order in Dripyard's base CSS put the padding utilities later, so they won. The section rendered with 120px padding instead of 48px -- a 144px total difference, explaining the 96px height drift (partial overlap with content).

**Fix:** Doubled the class as `.dy-section.dy-section--wordmark-strip` to restore (0,2,0) specificity. Both selectors (section padding override + header collapse) were updated. The `.dy-section__header` rule was also bumped for consistency, even though it did not have a competing selector at (0,1,0).

## Layer decisions

Both fixes remain at Layer 5 (component-scoped overrides in `dy-section.css` via `libraries-extend`).

**Fix 1 (marker script):**
- Not a CSS change -- Canvas `additional_classes` patch. No layer change.

**Fix 2 (specificity bump):**
- Bottom-up: `padding-top` / `padding-bottom` on `.dy-section` wordmark strip section. Not config (L1), not OKLCH (L2), not theme tokens (L3). Component-scoped structural override. L5 correct.
- Top-down: Same ruling chain. The specificity bump from (0,1,0) to (0,2,0) is within L5 -- no layer escalation needed.
- Trace: `.dy-section--wordmark-strip` { padding-top: 3rem } was losing to `.padding-top--l` { padding-top: var(--spacing-component) } because both (0,1,0) and `.padding-top--l` is later in source order. Fix: `.dy-section.dy-section--wordmark-strip` (0,2,0) beats `.padding-top--l` (0,1,0).

## Deviations from spec

None. Both fixes match the rework issue's recommended approaches exactly.

## Verification results (T1 + T2)

### T1 -- Headless (curl + grep)

**Cache clear:** `ddev drush cr` -- completed.

**Fix 1 -- /about-us hero marker in rendered HTML (PASS):**
```
dy-section dy-section--cta-pair theme--white container ...  (Hero, index 0)
```
Total cta-pair occurrences on /about-us: 2 (hero + closing CTA). Correct.

**Fix 2 -- CSS served with bumped selectors (PASS):**
```
.dy-section.dy-section--wordmark-strip {    (section padding)
.dy-section.dy-section--wordmark-strip .dy-section__header {   (header collapse)
```

**Idempotency (PASS):** Re-running marker script: "SKIP [0]: 'dy-section--cta-pair' already present. No changes needed."

**No `!important` (PASS):** Only in comments.

**Cross-page render sizes (PASS):**
- /how-we-do-it: 60187 bytes
- /open-source-projects: 68115 bytes
- / (homepage): 82574 bytes

### T2 -- Structural checks

**component_version preserved (PASS):** /about-us hero [0] retains `e6079b189d228dad`.

**/about-us hero buttons side-by-side at 1280 (PASS):**
- "Book a testing review": x=405, y=748, w=233, h=56
- "See the site test itself": x=650, y=748, w=210, h=56
- Same y-coordinate confirms flex-row layout.

**No horizontal overflow (PASS):** scrollWidth <= clientWidth on all pages at all viewports.

### T3-style dimension check (scrollWidth + per-section + page height)

**Page height comparison (baseline from S's AE matrix vs rework):**

| Page | VP | S baseline | Rework | Match |
|---|---|---|---|---|
| /services | 1280 | 4418 | 4418 | EXACT |
| /services | 768 | 5249 | 5249 | EXACT |
| /services | 375 | 6555 | 6555 | EXACT |
| /about-us | 1280 | 4549 | 4549 | EXACT |
| /about-us | 768 | 5690 | 5690 | EXACT |
| /about-us | 375 | 7952 | 7952 | EXACT |
| /how-we-do-it | 1280 | 5378 | 5378 | EXACT |
| /open-source-projects | 1280 | 4490 | 4490 | EXACT |
| / | 1280 | 4754 | 4754 | EXACT |

**Per-section dimensions at 1280 (/services):**

| Index | y | h | w | Classes |
|---|---|---|---|---|
| 0 | 269 | 613 | 1164 | landing-hero dy-section--cta-pair theme--white |
| 1 | 882 | 1015 | 1164 | theme--white (cards) |
| 2 | 1897 | 672 | 1164 | nearshore-section theme--light |
| 3 | 2569 | 600 | 1164 | dy-section--centered-white theme--white (Dogfooding) |
| 4 | 3169 | 272 | 1164 | dy-section--wordmark-strip theme--white |
| 5 | 3441 | 561 | 1164 | dy-section--cta-pair theme--dark (Closing CTA) |

**Per-section dimensions at 1280 (/about-us):**

| Index | y | h | w | Classes |
|---|---|---|---|---|
| 0 | 269 | 631 | 1164 | dy-section--cta-pair theme--white (hero) |
| 1 | 900 | 870 | 1265 | dy-section--centered-light theme--light |
| 2 | 1770 | 1395 | 1265 | dy-section--bio-block theme--white |
| 3 | 3165 | 473 | 1265 | dy-section--centered-light theme--light |
| 4 | 3638 | 496 | 1265 | dy-section--cta-pair theme--dark (Closing CTA) |

## WCAG contrast ratios

No color or contrast changes in this rework. All changes are:
- Fix 1: marker class addition (no CSS change)
- Fix 2: selector specificity bump (same declarations, same values)

Existing contrast ratios from prior F handoff remain valid. No recomputation needed.

## Mobile responsive behavior

N/A -- no responsive overrides written in this rework. Fix 1 adds a marker class (no CSS impact on mobile -- the P4 mobile rules already existed). Fix 2 bumps specificity on the wordmark strip padding which applies at all viewports. Page heights confirmed matching baseline at 768 and 375.

## Autonomous decisions

1. **Fix 1: chose marker-script approach over transition selector.** The rework issue offered two options: (a) extend the marker script to add `dy-section--cta-pair` to /about-us hero, or (b) restore the P4 transition selector keeping both old `:has()` and new marker. Chose (a) because it completes the refactor cleanly -- the marker is the intended end state, and adding it is simpler than maintaining a transition selector that would need cleanup later.

2. **Fix 2: identified root cause as P10 specificity drop, not P2/P3 ordering.** The rework issue suggested bisecting P2, P3, P10 as potential drift sources. I traced the issue directly: `.dy-section--wordmark-strip` (0,1,0) vs `.dy-section:has(.wordmark-strip-wrapper)` (0,2,0). The 144px total padding difference (120px - 48px on top + bottom) produces the observed height drift. The doubled-class fix `.dy-section.dy-section--wordmark-strip` (0,2,0) restores the pre-refactor specificity.

## Known issues

None. All page heights match S's baseline measurements exactly at all three viewports.

## Files changed

- `scripts/sprint10-cycle2b2-rework-about-us-hero-marker.php` (new)
- `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` (modified -- 2 selector changes + comment updates)
- `docs/pl2/handoffs/cycle-2b2-services-refactor-F-rework.md` (new, this file)
