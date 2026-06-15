# Handoff-F: Cycle 3 (REWORK) - Closing CTA Desktop Stacking Fix

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-5-cycle-3-closing-cta`
**Issue:** `docs/pl2/handoffs/cycle-3-closing-cta-rework-issue.md`

## Confirmation table (autonomous mode)

| Field | Value |
|---|---|
| Page | `/services`, `/about-us` (bonus), `/` (regression check) |
| Issue | `docs/pl2/handoffs/cycle-3-closing-cta-rework-issue.md` |
| Branch | `aa/pl-sprint-5-cycle-3-closing-cta` |
| Runbook phase | Sprint 5, Cycle 3 (rework) |
| Input documents read | cycle-3-closing-cta-rework-issue.md, cycle-3-closing-cta-F.md, cycle-3-closing-cta-S.md, theme-change--workflow.md |
| Acceptance criteria count | 6 |
| Handoff document path | `docs/pl2/handoffs/cycle-3-closing-cta-F-rework.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | N/A (CSS-only fix, no component changes) |

## What was done

1. **`web/themes/custom/performant_labs_20260502/css/components/dy-section.css` (line 566):** Added `width: 100%;` to the `.dy-section.theme--dark .dy-section__content:has(> .button + .button) > :not(.button)` rule, alongside the existing `flex-basis: 100%`. This forces non-button flex children (specifically `.text` with `max-width: 640px`) to claim the full row width, preventing CTA buttons from squeezing alongside the body paragraph at desktop widths.

## Layer decisions

### Desktop stacking fix
**Layer:** L5 (component-scoped CSS in `dy-section.css`)

- **Bottom-up:** `.text` element inside `.dy-section.theme--dark .dy-section__content` has `max-width: 640px`. The flex parent applies `flex-direction: row; flex-wrap: wrap`. The existing `flex-basis: 100%` on `:not(.button)` children is defeated because `max-width` caps rendered width below the basis, leaving ~525px of residual space for buttons to squeeze into.
- **Top-down:** L1 not config. L2 not OKLCH. L3: not a `--theme-*` token. L5: scoped to `.dy-section.theme--dark .dy-section__content:has(> .button + .button)`. CORRECT.
- **Fix:** Adding `width: 100%` forces the flex item to occupy 100% of the row regardless of `max-width`. The `max-width: 640px` still constrains the content visually within that row, but the flex item itself claims the full line, pushing buttons to the next row.
- **DOM inspection gate:** N/A for this change -- modifying an existing L5 rule, not targeting a new structural wrapper. The DOM structure was verified in the prior F handoff.

## Deviations from spec

None.

## Verification results (T1 + T2)

### T1 -- Headless (curl + grep)

```
ddev drush cr
[success] Cache rebuild complete.

# dy-section.css loaded and served
/services:  dy-section.css loaded (25 DOM references)
/about-us:  dy-section.css loaded (1 reference)
/:          dy-section.css loaded (1 reference)

# CSS rule verified in served file
.dy-section.theme--dark .dy-section__content:has(> .button + .button) > :not(.button) {
    flex-basis: 100%;
    width: 100%;          <-- NEW
    text-align: center;
}

# No !important (2 matches are in comments only)
!important count: 0 (in rules)

# theme--dark section present
/services: 1 theme--dark section
/about-us: 1 theme--dark section
```

**Result: PASS**

### T2 -- Structural

```
# /services element order in theme--dark section
kicker kicker--centered kicker--dark
heading h2 heading--centered
text text-content text--centered body-m color--medium
button button--primary button--large
button button--outline button--small button--ghost-on-dark
ORDER: CORRECT (body on own row, buttons below)

# /services heading hierarchy
H1 count: 1 (PASS)
H2 sequence: no skips (PASS)

# /about-us theme--dark section
kicker kicker--centered kicker--dark
heading h2 heading--centered
text text-content body-l color--soft
button button--primary button--large
button button--outline button--large button--ghost-on-dark
STRUCTURE: CORRECT (same fix applies)

# Homepage regression
H1 count: 1 (PASS)
title-cta SDC rendered: 1 (PASS, unchanged)
```

**Result: PASS**

## WCAG contrast ratios

No color changes in this rework. All contrast ratios unchanged from prior F handoff:

| Element | Foreground | Background | Ratio | Pass/Fail |
|---|---|---|---|---|
| H2 (cream on espresso) | #F5EFE2 | #1F1A14 | 13.07:1 | PASS (AAA) |
| Body text (muted on espresso) | #B8AFA0 | #1F1A14 | 7.39:1 | PASS (AA) |
| Kicker (terracotta on espresso) | #C97B5C | #1F1A14 | 4.47:1 | PASS (large text) |
| Primary CTA (white on teal) | #FFFFFF | #62BBCB | 2.13:1 | PRE-EXISTING (operator-approved) |
| Ghost CTA text (cream on espresso) | #F5EFE2 | #1F1A14 | 15.07:1 | PASS (AAA) |
| Focus ring | #62BBCB | #1F1A14 | 7.80:1 | PASS (non-text) |

## Mobile responsive behavior

N/A -- no responsive overrides in this rework. The fix targets the desktop flex-row behavior only. Mobile (768 and 375) was already correct per S's findings; the `width: 100%` addition does not alter the `@media (max-width: 576px)` block which switches to `flex-direction: column`.

## Autonomous decisions

None -- issue was fully specified. The rework issue prescribed Option B with exact CSS to add (`width: 100%; flex-basis: 100%;`), and `flex-basis: 100%` was already present. The only implementation decision was inserting `width: 100%` on the line after the existing `flex-basis: 100%`, which is the natural position.

## Known issues

None.

## Files changed

1. `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` -- added `width: 100%;` to the `:not(.button)` rule at line 566 (one-line addition)
