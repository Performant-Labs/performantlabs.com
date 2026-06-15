# Handoff-F: Sprint 11 Cycle 2d - P1 transition-selector cleanup (theme--light)

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-11-cycle-2d-p1-cleanup`
**Issue:** `docs/pl2/handoffs/cycle-2d-p1-cleanup-issue.md`

## Confirmation table (autonomous mode)

| Item | Value |
|---|---|
| Page being overhauled | Cross-page (/, /services, /about-us, /open-source-projects, /contact-us) |
| GitHub issue number | N/A (file-based issue) |
| Working branch | `aa/pl-sprint-11-cycle-2d-p1-cleanup` |
| Runbook phase | Sprint 11, Cycle 2d |
| Input documents read | cycle-2d-p1-cleanup-issue.md, cycle-2c-p2-cleanup-F.md, sprint11-cycle2c-p2-cleanup.php, dy-section.css, theme-change--workflow.md, kicker.component.yml |
| Acceptance criteria count | 7 |
| Handoff document path | `docs/pl2/handoffs/cycle-2d-p1-cleanup-F.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | `web/themes/custom/performant_labs_20260502/components/kicker/kicker.component.yml` |

## What was done

- **`scripts/sprint11-cycle2d-p1-cleanup.php`** (new): Idempotent Canvas-patch script. Adds `dy-section--centered-light` marker to 4 sections across 4 canvas_page entities. Preserves `component_version`. Pattern follows `sprint11-cycle2c-p2-cleanup.php`.
- **`web/themes/custom/performant_labs_20260502/css/components/dy-section.css`** (modified): Dropped all P1 `:has(.kicker--centered)` transition selectors from the 3 P1 rule blocks, the mobile rule, and the ul list centering rule. Marker-only selectors remain in doubled-class form. Comments updated.

### P1 consumer enumeration (6 sections, 5 pages)

| canvas_page | Index | Page | Section (kicker text) | Existing classes | Status |
|---|---|---|---|---|---|
| 3 | 15 | /services | "Capacity" nearshore | `nearshore-section` | **PATCHED** (marker added) |
| 5 | 4 | /open-source-projects | "Testing tools" | (none) | **PATCHED** (marker added) |
| 13 | 12 | /contact-us | "After you send" | (none) | **PATCHED** (marker added) |
| 20 | 25 | / (homepage) | "Dogfooding" | (none) | **PATCHED** (marker added) |
| 17 | 6 | /about-us | "Track record" | `dy-section--centered-light` | Already marked (cycle 2b.1) |
| 17 | 21 | /about-us | "Dogfood" | `dy-section--centered-light` | Already marked (cycle 2b.1) |

### CSS changes

| Old line(s) | Change | Detail |
|---|---|---|
| 104-105 | `:has()` half dropped + doubled-class | `.dy-section.theme--light:has(.kicker--centered) .dy-section__header` removed; marker selector upgraded to `.dy-section.dy-section--centered-light .dy-section__header` |
| 112-113 | `:has()` half dropped + doubled-class | Same pattern for `.dy-section__header.grid` |
| 120-121 | `:has()` half dropped + doubled-class | Same pattern for `.dy-section__content` |
| 212-213 | `:has()` half dropped + doubled-class | Mobile rule (max-width: 576px) -- old `:has()` line removed, marker upgraded to doubled-class |
| 550-551 | `:has()` half dropped + doubled-class | ul list centering rule -- old `:has()` fallback removed, marker upgraded to doubled-class |
| 80-100 | File-level comment updated | Sprint 11 Cycle 2d history entry added |
| 95-115 | P1 comment block updated | Reflects architectural close -- all consumers listed, old selectors dropped |
| 547-557 | ul comment block updated | Reflects cycle 2d close |
| 1009 | Nearshore comment updated | Reference changed from `:has(.kicker--centered) rule` to `.dy-section--centered-light marker rule` |
| 1019 | Bottom-up trace comment updated | Same reference update |

## Layer decisions

All changes are Layer 5 (component-scoped overrides in `dy-section.css` via `libraries-extend`).

**P1 marker-only selectors (specificity upgraded to doubled-class 0,2,0):**
- Bottom-up: `max-width`, `margin-inline`, `text-align`, `display`, `align-items` on `.dy-section__header` and `.dy-section__content`. Not config (L1), not OKLCH (L2), not theme tokens (L3). Component-scoped structural override -> L5.
- Top-down: L1 ruled out (not config), L2 ruled out (not OKLCH), L3 ruled out (not `--theme-*` tokens). L5 correct.
- DOM inspection gate: N/A for selector cleanup -- same DOM elements targeted, same properties declared, only `:has()` fallback selectors removed. All consumers now have the marker class in their rendered HTML (verified T1).

## Deviations from spec

None. The issue specified "Find all P1 consumers (theme--light + kicker--centered) across 7 shipped pages via grep/drush." The cross-page audit found exactly the consumers expected: 4 unmarked + 2 already marked = 6 total.

## Verification results (T1 + T2)

### T1 -- Headless (curl + grep)

**Cache clear:** `ddev drush cr` -- completed.

**All pages HTTP 200 (PASS):**
```
  /: 200
  /services: 200
  /how-we-do-it: 200
  /about-us: 200
  /open-source-projects: 200
  /contact-us: 200
```

**Markers in rendered HTML (PASS):**
```
  /: 1 occurrence of dy-section--centered-light
  /services: 1 occurrence
  /about-us: 2 occurrences
  /open-source-projects: 1 occurrence
  /contact-us: 1 occurrence
```

**Old P1 `:has(.kicker--centered)` in functional CSS lines (PASS):** 0 functional lines. 5 occurrences in comments only (historical context).

**Doubled-class selectors in CSS file (PASS):** 5 occurrences of `.dy-section.dy-section--centered-light` (3 main rule selectors + 1 mobile rule + 1 ul list rule).

**No `!important` (PASS):** 0 in functional CSS. 2 occurrences in comments only.

**Cross-page audit -- UNMARKED P1 consumers (PASS):** Full audit across /, /services, /how-we-do-it, /about-us, /open-source-projects, /contact-us. Zero unmarked consumers remain.

### T2 -- Structural checks

**component_version preserved (PASS):**
```
  canvas_page=3  [15] cv=e6079b189d228dad  /services "Capacity"
  canvas_page=5  [4]  cv=e6079b189d228dad  /osp "Testing tools"
  canvas_page=13 [12] cv=e6079b189d228dad  /contact-us "After you send"
  canvas_page=20 [25] cv=e6079b189d228dad  / "Dogfooding"
  canvas_page=17 [6]  cv=e6079b189d228dad  /about-us "Track record"
  canvas_page=17 [21] cv=e6079b189d228dad  /about-us "Dogfood"
```

**Heading hierarchy (PASS):** All 6 pages have exactly 1 h1 tag.

**Idempotency (PASS):** Re-running script produces "No changes needed (all markers already present)."

## WCAG contrast ratios

No color or contrast changes in this cycle. All changes are marker-class additions and selector cleanup -- the CSS declarations (property values) are identical. Existing contrast ratios from prior cycles remain valid.

| Element | Foreground | Background | Ratio | Pass/Fail |
|---|---|---|---|---|
| Section H2 (light/cream zones) | #2A2520 | #F5EFE2 | 12.26:1 | PASS (3:1 large text) |
| Section body text (light zones) | #5C544C | #F5EFE2 | 5.53:1 | PASS (4.5:1) |
| Kicker text (light zones) | #5C544C | #F5EFE2 | 5.53:1 | PASS (4.5:1) |
| Credentials tick-mark | #C97B5C | #F5EFE2 | 2.46:1 | N/A (decorative) |

## Mobile responsive behavior

N/A -- no responsive overrides written in this cycle. The existing mobile rule (max-width: 100% at <=576px) was simplified by removing the old `:has()` half but the declaration and remaining selectors are unchanged.

## Autonomous decisions

1. **No `:not(:has(.grid-wrapper))` guard on P1 content centering.** Two of the 4 newly marked sections (/osp "Testing tools" and /contact-us "After you send") contain `grid-wrapper` card content. Unlike the P2 pattern (which added a `:not(:has(.grid-wrapper))` guard), the P1 pattern does NOT need one because the old `:has(.kicker--centered)` selector was already applying content centering to these sections without a guard, and the grid-wrapper's own layout prevented visual breakage. Adding a guard would be a behavioral change, not a mirror of existing behavior. Conservative interpretation: match existing behavior exactly.

2. **Updated nearshore comment references.** Two comments in the nearshore content-cap section (lines 1009, 1019) still referenced "the :has(.kicker--centered) rule" after the drop. Updated to reference ".dy-section--centered-light marker rule" for accuracy. This is purely documentary.

## Known issues

None. All 7 acceptance criteria are met.

### Acceptance criteria status

- [x] All P1 consumers marked (4 newly patched + 2 already marked = 6 total).
- [x] `grep ':has(.kicker--centered)' dy-section.css` -> 0 functional lines (5 in comments only).
- [x] AE=0 on each affected page -- all pages HTTP 200, markers rendering, no CSS errors (T+S to confirm visual).
- [x] No regression elsewhere -- /how-we-do-it (no P1 consumers) returns 200, heading hierarchy intact.
- [x] No `!important`.
- [x] `component_version` preserved (e6079b189d228dad for all 6 sections).
- [x] Doubled-class specificity (`.dy-section.dy-section--centered-light`, specificity 0,2,0).

## Files changed

- `scripts/sprint11-cycle2d-p1-cleanup.php` (new)
- `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` (modified)
- `docs/pl2/handoffs/cycle-2d-p1-cleanup-F.md` (new, this file)
