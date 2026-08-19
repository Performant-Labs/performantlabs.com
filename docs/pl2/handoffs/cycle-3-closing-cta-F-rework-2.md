# Handoff-F: Cycle 3 (REWORK 2) - Closing CTA max-width Clamp Fix

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-5-cycle-3-closing-cta`
**Issue:** `docs/pl2/handoffs/cycle-3-closing-cta-rework-2-issue.md`

## Confirmation table (autonomous mode)

| Field | Value |
|---|---|
| Page | `/services`, `/about-us` (primary), `/` (regression check) |
| Issue | `docs/pl2/handoffs/cycle-3-closing-cta-rework-2-issue.md` |
| Branch | `aa/pl-sprint-5-cycle-3-closing-cta` |
| Runbook phase | Sprint 5, Cycle 3 (rework 2) |
| Input documents read | cycle-3-closing-cta-rework-2-issue.md, cycle-3-closing-cta-F-rework.md, cycle-3-closing-cta-S-rework.md (referenced), dy-section.css |
| Acceptance criteria count | 6 |
| Handoff document path | `docs/pl2/handoffs/cycle-3-closing-cta-F-rework-2.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | N/A (CSS-only fix, no component changes) |

## What was done

1. **`web/themes/custom/performant_labs_20260502/css/components/dy-section.css` (line 567):** Added `max-width: none;` to the `.dy-section.theme--dark .dy-section__content:has(> .button + .button) > :not(.button)` rule, alongside the existing `flex-basis: 100%; width: 100%;`. This defeats the `max-width: 640px` inherited from the `.text` rule (line 521-523) so the flex item truly occupies 100% of the row, forcing buttons to wrap below.

2. **`web/themes/custom/performant_labs_20260502/css/components/dy-section.css` (lines 532-539):** Added a new `.dy-section.theme--dark .dy-section__content .text p` rule that pushes the 640px visual cap down to the `<p>` element inside `.text`. Since `max-width: none` on the parent `.text` div removes the 640px constraint at the flex-item level, the `<p>` inherits no max-width and would span the full ~1140px container width (approximately 142 chars/line at body-m size). The new rule restores `max-width: 640px; margin-inline: auto` on the `<p>` so body text remains readable at approximately 75 chars/line while the `.text` flex item still claims the full row for stacking purposes.

## Layer decisions

### max-width: none on :not(.button) flex items
**Layer:** L5 (component-scoped CSS in `dy-section.css`)

- **Bottom-up:** `.text` element inside `.dy-section.theme--dark .dy-section__content` has `max-width: 640px` (from line 521-523, specificity 0,4,0). The flex parent applies `flex-direction: row; flex-wrap: wrap` at >=577px. The existing `flex-basis: 100%; width: 100%` on `:not(.button)` children is defeated because CSS spec says `max-width` clamps the computed `width`, so the `.text` flex item resolves to 640px, leaving ~500px of residual space for buttons to squeeze into on a ~1140px row.
- **Top-down:** L1 not config. L2 not OKLCH. L3: not a `--theme-*` token. L5: scoped to `.dy-section.theme--dark .dy-section__content:has(> .button + .button)`. CORRECT.
- **Fix:** Adding `max-width: none` (specificity 0,5,0 > 0,4,0) overrides the `.text` max-width clamp. The flex item now occupies 100% of the row, pushing buttons to the next flex line.

### p-level max-width for readability
**Layer:** L5 (component-scoped CSS in `dy-section.css`)

- **Rationale:** With `max-width: none` on the `.text` flex item, the `<p>` inside would span the full container width (~1140px at desktop). At body-m (16px, Rubik), that is approximately 142 characters per line -- well outside the 45-75 chars/line readability optimum. Pushing `max-width: 640px; margin-inline: auto` to the `<p>` constrains the visible text to ~75 chars/line while the outer `.text` div remains full-width for flex stacking.
- **Specificity:** `.dy-section.theme--dark .dy-section__content .text p` = (0,4,1). No competing `max-width` rule on `p`. Safe.

## Deviations from spec

The rework-2 issue prescribed `max-width: none` as the sole addition, with a fallback to "inner span with `display: inline-block; max-width: 640px`" if line lengths looked bad. Since we cannot add HTML (CSS-only fix), I applied the equivalent CSS-only approach: pushing the 640px visual cap down to the existing `<p>` element inside `.text`. This achieves the same readability constraint without requiring markup changes.

## Verification results (T1 + T2)

### T1 -- Headless (curl + grep)

```
ddev drush cr
[success] Cache rebuild complete.

# All three pages render HTTP 200
/services: HTTP 200
/about-us: HTTP 200
/: HTTP 200

# CSS file served with both new rules
max-width: none present in :not(.button) rule: YES
.text p { max-width: 640px } rule present: YES

# theme--dark section present
/services: 1 theme--dark section
/about-us: 1 theme--dark section

# Both pages have two buttons in theme--dark (selector matches)
/services: 2 buttons (button--primary + button--outline)
/about-us: 2 buttons (button--primary + button--outline)

# No !important in rules (2 matches are in comments only)
!important in rules: 0
```

**Result: PASS**

### T2 -- Structural

```
# Heading hierarchy
/services:  1 H1, 8 H2, 7 H3 — no skips (PASS)
/about-us:  1 H1, 7 H2, 7 H3 — no skips (PASS)
/:          1 H1, 7 H2, 6 H3 — no skips (PASS)

# /services closing CTA element order
kicker kicker--centered kicker--dark
heading h2 heading--centered
text text-content text--centered body-m color--medium
button button--primary button--large
button button--outline button--small button--ghost-on-dark
ORDER: CORRECT

# /about-us closing CTA element order
kicker kicker--centered kicker--dark
heading h2 heading--centered
text text-content body-l color--soft
button button--primary button--large
button button--outline button--large button--ghost-on-dark
ORDER: CORRECT

# Homepage regression: title-cta SDC renders (6 references)
title-cta present: YES (6)
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

N/A -- no responsive overrides added in this rework. The `max-width: none` is inside the `@media (min-width: 577px)` block and does not affect mobile. The `.text p` max-width rule is unconditional but at mobile widths (375px, 768px) the container is already narrower than 640px, so `max-width: 640px` has no visible effect.

## Autonomous decisions

1. **Readability fallback applied proactively.** The rework-2 issue said to try `max-width: none` first and fall back to an inner-element constraint if line lengths looked bad. I computed that the ~1140px container width at 16px body-m would yield ~142 chars/line (nearly double the 75-char readability ceiling). Rather than leave the readability regression for S to catch, I applied the fallback immediately: pushing `max-width: 640px` to the `<p>` inside `.text`. This is the CSS-only equivalent of the issue's "inner span with `display: inline-block; max-width: 640px`" fallback, adapted because we cannot add HTML markup.

## Known issues

None.

## Files changed

1. `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` -- added `max-width: none;` to line 567 (one-line addition in `:not(.button)` rule) and added new `.text p` max-width rule at lines 532-539 (readability constraint).
