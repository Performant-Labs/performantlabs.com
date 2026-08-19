# Handoff-F: Cycle 2b.3 - /how-we-do-it selector-class refactor

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-10-cycle-2b3-how-we-do-it`
**Issue:** `docs/pl2/handoffs/cycle-2b3-how-we-do-it-refactor-issue.md`

## Confirmation table (autonomous mode)

| Item | Value |
|---|---|
| Page being overhauled | /how-we-do-it |
| GitHub issue number | N/A (file-based issue) |
| Working branch | `aa/pl-sprint-10-cycle-2b3-how-we-do-it` |
| Runbook phase | Sprint 10, Cycle 2b.3 |
| Input documents read | cycle-2b3-how-we-do-it-refactor-issue.md, cycle-1-architecture-audit-S.md (P5+P6), cycle-2b2-services-refactor-F-rework.md, theme-change--workflow.md, theme-change.md, dy-section.css, section.component.yml, kicker.component.yml, sprint10-cycle2b2-services-markers.php (template) |
| Acceptance criteria count | 7 |
| Handoff document path | `docs/pl2/handoffs/cycle-2b3-how-we-do-it-refactor-F.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | `web/themes/contrib/dripyard_base/components/_layouts/section/section.component.yml` |

## What was done

- **`scripts/sprint10-cycle2b3-how-we-do-it-markers.php`** (new): Idempotent Canvas-patch script. Adds markers to 4 sections on canvas_page id=4 (/how-we-do-it):
  - [4] `dy-section--kicker-inline` (Week 1, theme--light)
  - [10] `dy-section--kicker-inline` (Week 2, theme--white)
  - [14] `dy-section--kicker-inline` (Week 3+, theme--secondary)
  - [22] `dy-section--tight-header` ("What we don't do", theme--light)
  - Preserves `component_version` at `e6079b189d228dad` on all 4 sections.

- **`web/themes/custom/performant_labs_20260502/css/components/dy-section.css`** (modified): Rewrote 2 fragile selectors to marker-based:
  - P5: `.dy-section:has(.kicker--inline) .dy-section__header.grid` -> `.dy-section.dy-section--kicker-inline .dy-section__header.grid`
  - P5+P6 combined: `.dy-section:has(.kicker--inline) .dy-section__header, .dy-section.theme--secondary + .dy-section .dy-section__header` -> `.dy-section.dy-section--kicker-inline .dy-section__header, .dy-section.dy-section--tight-header .dy-section__header`
  - Added cycle 2b.3 entry to file header comment with cross-page check rationale.

## Cross-page reach check

Performed before deciding swap vs transition approach (per 2b.1 + 2b.2 lessons).

**P5 — kicker--inline consumers:**

| Page | kicker--inline count | Inside dy-section? | P5 matched? |
|---|---|---|---|
| / | 0 | N/A | No |
| /services | 0 | N/A | No |
| /how-we-do-it | 3 | Yes | Yes |
| /open-source-projects | 0 | N/A | No |
| /about-us | 0 | N/A | No |
| /contact-us | 1 | No (inside flex-wrapper) | No |

**Verdict:** P5 old selector only ever matched /how-we-do-it. Direct swap safe.

**P6 — theme--secondary consumers:**

| Page | theme--secondary count |
|---|---|
| / | 0 |
| /services | 0 |
| /how-we-do-it | 1 |
| /open-source-projects | 0 |
| /about-us | 0 |
| /contact-us | 0 |

**Verdict:** P6 old selector only ever matched /how-we-do-it. Direct swap safe.

## Layer decisions

Both changes remain at Layer 5 (component-scoped overrides in `dy-section.css` via `libraries-extend`).

**P5 (kicker--inline header grid + header margin-bottom):**
- Bottom-up: `display: block` on `.dy-section__header.grid` and `margin-bottom: 2rem` on `.dy-section__header` in sections with inline kickers. Not config (L1), not OKLCH (L2), not theme tokens (L3). Component-scoped structural override. L5 correct.
- Top-down: Same ruling. No layer change from prior implementation.
- Trace: old `.dy-section:has(.kicker--inline)` (0,2,0) replaced by `.dy-section.dy-section--kicker-inline` (0,2,0). Specificity maintained at (0,4,0) for header.grid rule and (0,3,0) for header margin-bottom rule.

**P6 (tight-header margin-bottom):**
- Same analysis as P5. L5 correct.
- Trace: old `.dy-section.theme--secondary + .dy-section` (0,3,0 for the section compound) replaced by `.dy-section.dy-section--tight-header` (0,2,0). Overall specificity reduced from (0,4,0) to (0,3,0) but safe -- no competing selector at (0,2,0)+ targets `margin-bottom` on `.dy-section__header` in this context.

## Deviations from spec

None.

## Verification results (T1 + T2)

### T1 -- Headless (curl + grep)

**Cache clear:** `ddev drush cr` -- completed.

**Markers in rendered HTML (PASS):**
```
3 dy-section--kicker-inline
1 dy-section--tight-header
```

Full class attributes:
```
class="dy-section dy-section--kicker-inline theme--light container ..."  (Week 1)
class="dy-section dy-section--kicker-inline theme--white container ..."  (Week 2)
class="dy-section dy-section--kicker-inline theme--secondary container ..."  (Week 3+)
class="dy-section dy-section--tight-header theme--light container ..."  ("What we don't do")
```

**CSS selectors in file (PASS):**
```
.dy-section.dy-section--kicker-inline .dy-section__header.grid {
.dy-section.dy-section--kicker-inline .dy-section__header,
.dy-section.dy-section--tight-header .dy-section__header {
```

**Idempotency (PASS):** Re-running marker script: all 4 SKIPped ("already present").

**No !important (PASS):** Only 2 occurrences, both in comments.

**No active :has(.kicker--inline) selectors (PASS):** All occurrences are in comments.

**No active theme--secondary sibling combinator (PASS):** All occurrences are in comments.

**Cross-page render sizes (PASS):**

| Page | Pre-change | Post-change | Delta | Note |
|---|---|---|---|---|
| /how-we-do-it | 60191 | 60292 | +101 | Expected: 4 marker classes added to HTML |
| /services | 59837 | 59833 | -4 | Cache variance, no regression |
| /about-us | 57920 | 57916 | -4 | Cache variance, no regression |
| / (homepage) | 82572 | 82572 | 0 | Exact match |
| /open-source-projects | 68117 | 68119 | +2 | Cache variance, no regression |

### T2 -- Structural checks

**component_version preserved (PASS):**
- [4] ver=e6079b189d228dad ac=dy-section--kicker-inline
- [10] ver=e6079b189d228dad ac=dy-section--kicker-inline
- [14] ver=e6079b189d228dad ac=dy-section--kicker-inline
- [22] ver=e6079b189d228dad ac=dy-section--tight-header

**Heading hierarchy (PASS):** h1 -> h2 (x4) -> h3 (cards). Correct.

**Page serves 200 OK (PASS).**

## WCAG contrast ratios

No color or contrast changes in this cycle. Both changes are:
- Marker class additions (no CSS change)
- Selector rewrites (same declarations, same values, same specificity or safe reduction)

Existing contrast ratios from prior cycles remain valid. No recomputation needed.

## Mobile responsive behavior

N/A -- no responsive overrides written in this cycle. The marker classes are structural markers only. The existing CSS rules (display: block on header.grid, margin-bottom: 2rem on header) apply at all viewports, same as before the refactor.

## Autonomous decisions

1. **Chose direct swap over transition-comma for both P5 and P6.** The cross-page reach check confirmed that both old selectors only ever matched /how-we-do-it sections. P5's `:has(.kicker--inline)` appeared on /contact-us but inside a `flex-wrapper`, not a `dy-section`, so the old selector never matched there. P6's `theme--secondary` appeared only on /how-we-do-it. With no cross-page consumers, transition-comma was unnecessary.

2. **Accepted P6 specificity reduction from (0,4,0) to (0,3,0).** The old sibling combinator `.dy-section.theme--secondary + .dy-section .dy-section__header` had (0,4,0) total specificity. The new `.dy-section.dy-section--tight-header .dy-section__header` has (0,3,0). This reduction is safe because no other selector at (0,2,0) or higher targets `margin-bottom` on `.dy-section__header` in this context. The base theme's default `margin-bottom` on `.dy-section__header` uses a lower-specificity selector.

## Known issues

None. All acceptance criteria met.

## Files changed

- `scripts/sprint10-cycle2b3-how-we-do-it-markers.php` (new)
- `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` (modified -- 2 selector rewrites + file header comment update)
- `docs/pl2/handoffs/cycle-2b3-how-we-do-it-refactor-F.md` (new, this file)
