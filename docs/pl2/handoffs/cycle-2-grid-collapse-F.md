# Handoff-F: Sprint 6 Cycle 2 - /services engagement grid 768 collapse (FU-S5-1)

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-6-cycle-2-grid-collapse`
**Issue:** `docs/pl2/handoffs/cycle-2-grid-collapse-issue.md`

## Confirmation table

| Field | Value |
|---|---|
| Page | /services |
| Issue | cycle-2-grid-collapse-issue.md |
| Working branch | aa/pl-sprint-6-cycle-2-grid-collapse |
| Runbook phase | Sprint 6 Cycle 2 |
| Input documents read | cycle-2-grid-collapse-issue.md, sprint-6 runbook, theme-change--workflow.md, grid-wrapper.css (current state), services.html preview (grep for engagements grid CSS), css-change-log.md |
| Acceptance criteria count | 7 |
| Handoff document path | docs/pl2/handoffs/cycle-2-grid-collapse-F.md |
| CSS workflow path | docs/pl2/theme-change--workflow.md |
| Component schema source of truth | N/A (no component prop/slot referenced; pure CSS layout override) |

## What was done

- **Modified** `web/themes/custom/performant_labs_20260502/css/components/grid-wrapper.css` -- added `@media (max-width: 991px)` rule block for `.grid-wrapper--2col` that sets `grid-template-columns: 1fr` on `.grid-wrapper__grid` and `grid-column: auto` on children. This collapses the engagement cards from 2x2 to 1-col at viewports below 992px, matching the canonical preview.
- **Updated** `docs/pl2/css-change-log.md` -- appended the FU-S5-1 entry with full layer ruling.

## Layer decisions

**Property:** grid-template-columns on `.grid-wrapper--2col .grid-wrapper__grid`; grid-column on `.grid-wrapper--2col .grid-wrapper__grid > *`

**Pass 1 (bottom-up):**
- At 768px viewport, the container is >600px, so the `@container (width > 600px)` rule fires.
- Children get `grid-column: span 6` (2 per row in a 12-col grid).
- Result: 2x2 layout at tablet -- does not match preview's 1-col.

**DOM inspection gate:** N/A for the gate's intent -- this is a Layer 5 component-scoped override on a selector already established in this file. The DOM structure (`.grid-wrapper.grid-wrapper--2col > .grid-wrapper__grid > article.card x 4`) was re-confirmed via T1 curl.

**Pass 2 (top-down):**
- L1: not config. RULED OUT.
- L2: not OKLCH-derived. RULED OUT.
- L3: not a theme token. RULED OUT.
- L5: component-scoped override on `.grid-wrapper--2col .grid-wrapper__grid`. Selector specificity (0,2,0). **CORRECT LAYER.**

**Cross-page risk:** T1 grep (2026-05-11) confirmed `.grid-wrapper--2col` appears on `/services` only (zero matches on `/`, `/articles`, `/about-us`, `/open-source-projects`, `/how-we-do-it`, `/contact-us`). The rule is safe to apply globally on the class.

## Deviations from spec

None.

## Verification results (T1 + T2)

### T1 -- Headless (curl + grep)

```
$ ddev drush cr
[success] Cache rebuild complete.

$ curl -sk ".../services" | grep -c "grid-wrapper--2col"
1

$ curl -sk ".../services" | grep -oP 'class="[^"]*grid-wrapper[^"]*"'
class="grid-wrapper grid-wrapper--2col"
class="grid-wrapper__grid    gutter-column--l    gutter-row--l"

$ curl -sk ".../themes/custom/performant_labs_20260502/css/components/grid-wrapper.css" | grep -A4 "max-width: 991px" | head -10
 * the canonical preview collapses to 1-col at max-width: 991px.
 ...
@media (max-width: 991px) {
  .grid-wrapper--2col .grid-wrapper__grid {
    grid-template-columns: 1fr;
  }
```

**T1 PASS:** New `@media (max-width: 991px)` rule is present in the served CSS file. `.grid-wrapper--2col` renders on /services with the expected DOM structure.

### T2 -- Structural checks

```
Cross-page --2col usage:
  /           : 0 instances
  /about-us   : 0 instances
  /articles   : 0 instances
  /open-source-projects : 0 instances
  /how-we-do-it : 0 instances
  /contact-us : 0 instances

Card count on /services: 4 <article> elements (correct)
Heading hierarchy: h2 (breadcrumb, visually-hidden) > h3 x 4 (card titles) > h3 (footer) -- unchanged
No !important in grid-wrapper.css: confirmed (grep count = 0)
```

**T2 PASS:** No cross-page regression. DOM structure intact. Heading hierarchy unchanged.

## WCAG contrast ratios

No color, typography, or contrast changes in this cycle. Layout change only (grid-template-columns and grid-column). All existing contrast ratios are preserved.

| Element | Foreground | Background | Ratio | Pass/Fail |
|---|---|---|---|---|
| N/A | -- | -- | -- | N/A -- no color changes |

## Mobile responsive behavior

| Breakpoint | Behavior | Verification |
|---|---|---|
| >= 992px | 2x2 grid (existing `@container (width > 600px)` rule, `grid-column: span 6`) | Unchanged -- no new rule in this range |
| 601px -- 991px | **NEW:** 1-col stack (`grid-template-columns: 1fr`, `grid-column: auto`) | `@media (max-width: 991px)` rule added; matches preview's `@media (max-width: 991px) { .engagements__grid { grid-template-columns: 1fr; } }` |
| <= 600px | 1-col stack (Dripyard base 6-col grid + existing `span 6` rule) | Unchanged -- existing `@media (max-width: 576px)` rule preserved |

Touch targets: not affected (card elements are block-level, well above 44x44 CSS px at all viewports).

## Autonomous decisions

- **Cross-page scope:** Confirmed `.grid-wrapper--2col` is services-only via T1 grep on all 6 other pages. Applied the rule globally on the class (not scoped to a section marker), consistent with the issue's guidance ("if shared widely, add a more-scoped selector... otherwise global is fine"). Since it is not shared, global on the class is correct.
- **grid-column: auto on children:** Added alongside `grid-template-columns: 1fr` to defeat neonbyte's `:where([class*="grid"]) > * { grid-column: 1 / -1 }` catch-all. This follows the established pattern used by `--3col` and `--3col-stack-md` in the same file. Without this, children could inherit `1 / -1` from the catch-all, though on a `1fr` grid that is functionally equivalent. Added defensively for consistency with the established pattern.

## Known issues

None.

## Files changed

- `web/themes/custom/performant_labs_20260502/css/components/grid-wrapper.css` (modified -- added @media block at lines 113-119)
- `docs/pl2/css-change-log.md` (modified -- appended FU-S5-1 entry)
- `docs/pl2/handoffs/cycle-2-grid-collapse-F.md` (created -- this file)
