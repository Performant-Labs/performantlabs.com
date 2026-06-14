# Handoff-F: Sprint 6 Cycle 2 Rework - Card internal layout at 768

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-6-cycle-2-grid-collapse`
**Issue:** `docs/pl2/handoffs/cycle-2-grid-collapse-rework-issue.md`

## Confirmation table

| Field | Value |
|---|---|
| Page | /services |
| Issue | cycle-2-grid-collapse-rework-issue.md |
| Working branch | aa/pl-sprint-6-cycle-2-grid-collapse |
| Runbook phase | Sprint 6 Cycle 2 Rework |
| Input documents read | cycle-2-grid-collapse-rework-issue.md, cycle-2-grid-collapse-S.md, cycle-2-grid-collapse-F.md, theme-change--workflow.md, Dripyard card.css (contrib), custom card.css (L5) |
| Acceptance criteria count | 6 |
| Handoff document path | docs/pl2/handoffs/cycle-2-grid-collapse-F-rework.md |
| CSS workflow path | docs/pl2/theme-change--workflow.md |
| Component schema source of truth | N/A (no component prop/slot referenced; pure CSS layout override) |

## What was done

- **Modified** `web/themes/custom/performant_labs_20260502/css/components/card.css` -- added `@media (max-width: 991px)` block with two rules:
  1. `.grid-wrapper--2col .card__layout { display: flex; flex-direction: column; }` -- resets the card internal layout from Dripyard's 2-col grid back to single-column flexbox when the engagement grid has collapsed.
  2. `.grid-wrapper--2col .card[class*="theme"] .card__layout { padding-inline: 0; }` -- removes the asymmetric padding-inline that Dripyard sets for the 2-col image+content layout.
- **Updated** `docs/pl2/css-change-log.md` -- appended the rework entry.

## Layer decisions

**Property:** display, flex-direction on `.grid-wrapper--2col .card__layout`; padding-inline on `.grid-wrapper--2col .card[class*="theme"] .card__layout`

**Pass 1 (bottom-up):**
- At 768px viewport, `.card` is ~693px wide (full grid column after cycle 2's 1-col collapse).
- `.card` has `container-type: inline-size` (Dripyard base card.css line 17).
- 693 > 600, so `@container (width > 600px)` fires on `.card__layout`:
  - `display: grid`
  - `grid-template-columns: repeat(2, minmax(0, 1fr))`
  - `.card[class*="theme"] .card__layout { padding-inline: 0 var(--card-layout-gap) }`
- The engagement cards have **no `.card__top`** (image element). Only `.card__bottom` exists as a child.
- `.card__bottom` occupies column 1 of the 2-col grid = ~305px out of ~693px (44%).
- At 375px: card is ~343px < 600px, so container query does not fire. `.card__layout` stays flex-column. Content fills card. Correct.
- At 1280px: cards are ~566px in the 2-col grid. 566 < 600, so container query does not fire. Correct.

**DOM inspection gate:**
- Tier 1: `.grid-wrapper--2col` renders on /services only (0 matches on 6 other pages).
- Tier 1: `.card__layout` renders 4 times on /services; `.card__top` renders 0 times (no images).
- Tier 1: `.card__bottom` renders 4 times on /services (sole child of each `.card__layout`).

**Pass 2 (top-down):**
- L1: not config. Container query is hardcoded in Dripyard CSS. RULED OUT.
- L2: not OKLCH-derived. RULED OUT.
- L3: not a theme token. Display/grid-template-columns are structural properties. RULED OUT.
- L5: component-scoped override on `.grid-wrapper--2col .card__layout`. Selector specificity (0,2,0) beats Dripyard's `.card__layout` (0,1,0) inside `@container`. **CORRECT LAYER.**

**Cross-page risk analysis:**
- `.grid-wrapper--2col` is services-only (T1 confirmed on all 7 pages: zero matches elsewhere).
- `/open-source-projects` has 7 cards with 6 `.card__top` (images) -- those cards use different grid wrappers and are unaffected by this selector.
- `/`, `/about-us`, `/how-we-do-it`, `/contact-us` have cards but no `.grid-wrapper--2col`. Unaffected.

## Deviations from spec

None.

## Verification results (T1 + T2)

### T1 -- Headless (curl + grep)

```
$ ddev drush cr
[success] Cache rebuild complete.

$ curl -sk ".../themes/custom/performant_labs_20260502/css/components/card.css" | grep -A8 "max-width: 991px"
@media (max-width: 991px) {
  .grid-wrapper--2col .card__layout {
    display: flex;
    flex-direction: column;
  }

  .grid-wrapper--2col .card[class*="theme"] .card__layout {
    padding-inline: 0;
  }

$ curl -sk ".../themes/custom/performant_labs_20260502/css/components/card.css" | grep -c "important"
0
```

**T1 PASS:** New `@media (max-width: 991px)` rules present in served CSS. No `!important`.

### T2 -- Structural checks

```
Cross-page .grid-wrapper--2col usage:
  /                      : 0
  /about-us              : 0
  /articles              : 0
  /open-source-projects  : 0
  /how-we-do-it          : 0
  /contact-us            : 0
  /services              : 1 (target page)

Card count on /services: 4 <article> elements with card__layout (correct)
card__top on /services: 0 (no images — confirms the 2-col grid layout was serving no purpose)
Heading hierarchy: h1 > h2 x 4 > h3 x 4 (card titles) — unchanged
No !important in card.css: confirmed (grep count = 0)
```

**T2 PASS:** No cross-page regression. DOM structure intact. Heading hierarchy unchanged.

## WCAG contrast ratios

No color, typography, or contrast changes in this rework. Layout change only (display, flex-direction, padding-inline). All existing contrast ratios preserved.

| Element | Foreground | Background | Ratio | Pass/Fail |
|---|---|---|---|---|
| N/A | -- | -- | -- | N/A -- no color changes |

## Mobile responsive behavior

| Breakpoint | Behavior | Verification |
|---|---|---|
| >= 992px | 2x2 grid; cards ~566px wide; container query does NOT fire (566 < 600); card__layout stays flex-column | Unchanged -- no new rule in this range |
| 601px -- 991px | **REWORK FIX:** 1-col stack; cards ~693px wide; Dripyard container query WOULD fire but is now overridden: `.grid-wrapper--2col .card__layout { display: flex; flex-direction: column }` forces single-column internal layout; `.card__bottom` fills full card width | New rule added |
| <= 600px | 1-col stack; cards < 600px; container query does not fire; card__layout stays flex-column | Unchanged |

Touch targets: not affected (card elements are block-level, well above 44x44 CSS px at all viewports).

## Autonomous decisions

- **Selector scoping:** Scoped the fix to `.grid-wrapper--2col .card__layout` rather than a global `.card__layout` override. Rationale: although `.grid-wrapper--2col` is currently services-only, other pages have cards with `.card__top` (images) where the 2-col internal layout is intentional (e.g., `/open-source-projects` with 6 image cards). The scoped selector prevents accidental regression if `.grid-wrapper--2col` is added to other pages in the future.
- **padding-inline reset:** Added `.grid-wrapper--2col .card[class*="theme"] .card__layout { padding-inline: 0 }` alongside the display fix. Dripyard's `@container (width > 600px)` also sets `padding-inline: 0 var(--card-layout-gap)` on themed card layouts for the 2-col image+content arrangement. With the layout reset to flex-column, this asymmetric padding would create an unintended right gap. Zeroing it is the conservative choice.
- **File placement:** Placed the rule in `card.css` (the L5 card override file) rather than `grid-wrapper.css`, because the constraint being defeated originates in Dripyard's card component CSS (the `@container` query on `.card__layout`), and the fix is about card-internal layout behavior.

## Known issues

None.

## Files changed

- `web/themes/custom/performant_labs_20260502/css/components/card.css` (modified -- added @media block at end of file)
- `docs/pl2/css-change-log.md` (modified -- appended rework entry)
- `docs/pl2/handoffs/cycle-2-grid-collapse-F-rework.md` (created -- this file)
