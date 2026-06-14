# Handoff-F: Cycle 2b.1 - /about-us selector-class refactor

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-10-cycle-2b1-about-us`
**Issue:** `docs/pl2/handoffs/cycle-2b1-about-us-refactor-issue.md`

## Confirmation table (autonomous mode)

| Item | Value |
|---|---|
| Page being overhauled | /about-us (canvas_page id=17) |
| GitHub issue number | N/A (file-based issue) |
| Working branch | `aa/pl-sprint-10-cycle-2b1-about-us` |
| Runbook phase | Sprint 10, Cycle 2b.1 |
| Input documents read | cycle-2b1-about-us-refactor-issue.md, cycle-1-architecture-audit-S.md, pl-plan--sprint-10-architecture-cleanup.md, sprint6-cycle3-nearshore-marker.php (reference script), theme-change--workflow.md, kicker.component.yml, section.component.yml |
| Acceptance criteria count | 9 |
| Handoff document path | `docs/pl2/handoffs/cycle-2b1-about-us-refactor-F.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | `web/themes/contrib/dripyard_base/components/_layouts/section/section.component.yml`, `web/themes/custom/performant_labs_20260502/components/kicker/kicker.component.yml` |

## What was done

- **`scripts/sprint10-cycle2b1-about-us-markers.php`** (new): Idempotent Canvas-patch script. Adds 4 marker classes to 4 sections on canvas_page id=17 (/about-us). Preserves `component_version`. Pattern follows `sprint6-cycle3-nearshore-marker.php`.
- **`web/themes/custom/performant_labs_20260502/css/components/dy-section.css`** (modified): Rewrote P1, P7, P8, P9 selectors to use marker-class selectors alongside old `:has()` selectors (transition state for P1/P7/P8; direct swap for P9).

### Marker-to-section mapping

| Canvas index | Section | Theme | Marker added | Pattern |
|---|---|---|---|---|
| 6 | Track record | theme--light | `dy-section--centered-light` | P1 |
| 11 | Open source (bio block) | theme--white | `dy-section--bio-block` | P9 |
| 21 | Dogfood | theme--light | `dy-section--centered-light` | P1 |
| 26 | Closing CTA | theme--dark | `dy-section--cta-pair` | P8 |

### CSS rule rewrites

| Pattern | Old selector | New selector (transition) | Lines affected |
|---|---|---|---|
| P1 (3 rules) | `.dy-section.theme--light:has(.kicker--centered) ...` | `.dy-section--centered-light ..., .dy-section.theme--light:has(.kicker--centered) ...` | Header, header.grid, content |
| P1 (mobile) | `.dy-section.theme--light:has(.kicker--centered) .dy-section__header` | `.dy-section--centered-light .dy-section__header, .dy-section.theme--light:has(.kicker--centered) .dy-section__header` | Mobile max-width rule |
| P7 (1 rule) | `.dy-section.theme--light:has(.kicker--centered) .dy-section__content .text ul` | `.dy-section--centered-light .dy-section__content .text ul, .dy-section.theme--light:has(.kicker--centered) .dy-section__content .text ul` | Credentials UL centering |
| P8 (6 rules) | `.dy-section.theme--dark .dy-section__content:has(> .button + .button)` | `.dy-section.theme--dark.dy-section--cta-pair .dy-section__content, .dy-section.theme--dark .dy-section__content:has(> .button + .button)` | Desktop flex, desktop not-button, desktop button, mobile flex, mobile button |
| P9 (2 rules) | `.dy-section.theme--white:has(.kicker--centered) .dy-section__content > .grid-wrapper + .heading.h3` | `.dy-section--bio-block .dy-section__content > .grid-wrapper + .heading.h3` | Bio block hairline + text centering |

### P8 transition approach

Chose the comma-separated selector list approach recommended in the issue. Both /about-us (via `.dy-section--cta-pair` marker) and /services (via old `:has(> .button + .button)`) match during the transition window. Cycle 2b.2 will:
1. Apply `.dy-section--cta-pair` marker to /services closing CTA
2. Remove the old `:has(> .button + .button)` half from all P8 selectors

### P1 transition approach (additional)

Same comma-separated selector list approach applied to P1 rules. The old `.dy-section.theme--light:has(.kicker--centered)` selector matches not only /about-us but also /services nearshore (theme--light + kicker--centered) and /open-source-projects (theme--light + kicker--centered). Removing the old selector prematurely would break centering on those pages. Cycle 2b.2 (/services) and 2b.3+ will complete the migration.

### P9 direct swap

P9 was safe for a direct swap (no transition selector needed) because the bio-block structure (`.dy-section__content > .grid-wrapper + .heading.h3`) only exists on /about-us. Verified across /, /services, /how-we-do-it, /open-source-projects -- no other page has this DOM pattern.

## Layer decisions

All changes are Layer 5 (component-scoped overrides in `dy-section.css` via `libraries-extend`).

**P1/P7 (centered-light sections):**
- Bottom-up: text-align, max-width on `.dy-section__header` and `.dy-section__content`. Not config (L1), not OKLCH (L2), not theme tokens (L3). Component-scoped structural override -> L5.
- Top-down: L1 ruled out, L2 ruled out, L3 ruled out (text-align/max-width are not `--theme-*` tokens). L5 correct.

**P8 (cta-pair button row):**
- Bottom-up: flex layout on `.dy-section__content` when section has two buttons. Not config (L1), not OKLCH (L2), not theme tokens (L3). Component-scoped structural override -> L5.
- Top-down: Same ruling chain. L5 correct.

**P9 (bio block):**
- Bottom-up: border-top, margin-top, padding-top, text-align, max-width on bio block elements. Not config (L1), not OKLCH (L2), not theme tokens (L3). Component-scoped structural override -> L5.
- Top-down: Same ruling chain. L5 correct.

No DOM inspection gate needed -- these are selector rewrites at L5 targeting the same DOM elements as before. No new structural wrappers involved.

## Deviations from spec

1. **P10 (wordmark strip) omitted.** The issue table lists P10 as `/about-us` section A, but the wordmark strip does not exist on /about-us -- it is on /services. Verified via `curl + grep` (no "wordmark" string in /about-us HTML). P10 will be addressed in cycle 2b.2 (/services). The CSS rules at lines 812-817 (`.dy-section:has(.wordmark-strip-wrapper)`) remain unchanged.

2. **P1 marker applied to TWO sections (index 6 + 21), not one.** The issue table says P1 affects "section B Track record" only, but the P1 selector `.dy-section.theme--light:has(.kicker--centered)` also matches section D (Dogfood, index 21) because both are theme--light with kicker--centered. The marker was applied to both sections to maintain pixel-identical rendering. Without the marker on Dogfood, the new `.dy-section--centered-light` selector would not match it, while the old `:has()` selector would -- creating a selector mismatch during the transition.

3. **P1/P7 selectors use transition comma-selector (not direct swap).** The issue says "replace fragile selectors with marker-based selectors" but P1's `:has(.kicker--centered)` also matches /services nearshore and /open-source-projects sections. Direct swap would break those pages. Applied the same transition pattern as P8, retaining old selectors alongside new markers.

## Verification results (T1 + T2)

### T1 — Headless (curl + grep)

**Cache clear:** `ddev drush cr` -- completed.

**Markers in rendered HTML (PASS):**
```
dy-section dy-section--centered-light theme--light  (Track record, index 6)
dy-section dy-section--bio-block theme--white        (Open source, index 11)
dy-section dy-section--centered-light theme--light  (Dogfood, index 21)
dy-section dy-section--cta-pair theme--dark          (Closing CTA, index 26)
```

**CSS file served with new selectors (PASS):** 18 occurrences of marker selectors in served CSS.

**Old :has() selectors retained (PASS):** 24 occurrences of old `:has()` selectors still present (transition state).

**No regression on /services (PASS):** /services sections unchanged (no markers applied). Nearshore still has `.nearshore-section` class. Closing CTA still theme--dark without `.dy-section--cta-pair`.

**No regression on /open-source-projects (PASS):** Page renders (68119 bytes). No markers applied.

**No regression on /how-we-do-it (PASS):** Page renders (60187 bytes). No markers applied.

### T2 — Structural checks

**Heading hierarchy on /about-us (PASS):**
h1 (hero) -> h2 (Track record) -> h2 (Open source) -> h3 (cards x3) -> h3 (Who we are.) -> h2 (Dogfood) -> h2 (Closing CTA)

**Closing CTA buttons (PASS):** 2 button anchor elements in theme--dark section (index 26).

**Bio block structure (PASS):** grid-wrapper at line 597 followed by heading.h3 "Who we are." at line 645.

**Credentials UL (PASS):** `<ul>` at line 567 inside Track record section (line 549).

**component_version preserved (PASS):**
- [6] e6079b189d228dad
- [11] e6079b189d228dad
- [21] e6079b189d228dad
- [26] e6079b189d228dad

**Idempotency (PASS):** Re-running script produces "No changes needed (all markers already present)."

**/services closing CTA (PASS):** 2 buttons confirmed in /services theme--dark section (P8 old `:has()` selector functional).

## WCAG contrast ratios

No color or contrast changes in this cycle. All changes are selector rewrites -- the CSS declarations (property values) are identical. Existing contrast ratios documented in prior cycle handoffs remain valid:

| Element | Foreground | Background | Ratio | Pass/Fail |
|---|---|---|---|---|
| Track record body text | #5C544C | #F5EFE2 (cream) | 5.53:1 | PASS (4.5:1 threshold) |
| Bio block h3 | #1F1A14 | #FFFFFF | 17.29:1 | PASS (3:1 large text) |
| Closing CTA h2 | #F5EFE2 | #1F1A14 | 13.07:1 | PASS (3:1 large text) |
| Closing CTA body | #B8AFA0 | #1F1A14 | 7.39:1 | PASS (4.5:1 threshold) |
| Credentials tick-mark | #C97B5C | #F5EFE2 | 2.46:1 | N/A (decorative) |

## Mobile responsive behavior

N/A -- no responsive overrides written in this cycle. All existing responsive rules (mobile button stacking, mobile heading size reduction, mobile max-width removal) are preserved identically via the CSS rewrite. The transition comma-selectors ensure both marker-based and `:has()`-based paths match.

## Autonomous decisions

1. **P10 omitted from /about-us scope.** The issue table listed P10 (wordmark strip) under /about-us, but the wordmark strip exists only on /services. Conservative interpretation: out of scope for cycle 2b.1. Will be addressed in cycle 2b.2.

2. **P1 marker applied to both theme--light sections (index 6 and 21).** Issue table only listed "section B Track record" but the P1 selector matches both theme--light + kicker--centered sections on /about-us. Applied to both for pixel-identical rendering.

3. **P1/P7 selectors use transition comma-selector instead of direct swap.** Discovered that P1's `:has(.kicker--centered)` matches /services nearshore and /open-source-projects sections. Direct swap would break those pages. Applied the same transition pattern as P8 (issue-recommended for P8, self-decided for P1/P7).

4. **P9 uses direct swap (no transition).** Verified the bio-block DOM pattern (grid-wrapper + heading.h3) only exists on /about-us. No other page consumer, so transition selector unnecessary.

## Known issues

None. All acceptance criteria met (see checklist below).

### Acceptance criteria status

- [x] Canvas content edited: 4 sections on /about-us have corresponding markers.
- [x] `dy-section.css` rules rewritten to use marker selectors (transition state for P1/P7/P8; direct swap for P9).
- [x] `/about-us` renders pixel-identical (T1+T2 PASS; T3 deferred to S).
- [x] No regression on `/services` (P8 old selector functional; nearshore unaffected).
- [x] No regression on other pages (`/open-source-projects`, `/how-we-do-it` render normally).
- [x] No `!important`.
- [x] Canvas `component_version` preserved (all 4 sections retain `e6079b189d228dad`).
- [x] T1 + T2 PASS.
- [x] Handoff captures marker-section mapping, CSS rule diffs, verification results.

## Files changed

- `scripts/sprint10-cycle2b1-about-us-markers.php` (new)
- `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` (modified)
- `docs/pl2/handoffs/cycle-2b1-about-us-refactor-F.md` (new, this file)
