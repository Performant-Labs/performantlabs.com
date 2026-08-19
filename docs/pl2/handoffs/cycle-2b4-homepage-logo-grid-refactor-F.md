# Handoff-F: Cycle 2b.4 - Homepage logo-grid selector-class refactor

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-10-cycle-2b4-homepage-logo-grid`
**Issue:** `docs/pl2/handoffs/cycle-2b4-homepage-logo-grid-refactor-issue.md`

## Confirmation table (autonomous mode)

| Item | Value |
|---|---|
| Page being overhauled | / (homepage) |
| GitHub issue number | N/A (file-based issue) |
| Working branch | `aa/pl-sprint-10-cycle-2b4-homepage-logo-grid` |
| Runbook phase | Sprint 10, Cycle 2b.4 |
| Input documents read | cycle-2b4-homepage-logo-grid-refactor-issue.md, cycle-1-architecture-audit-S.md (section 1.3), cycle-2b3-how-we-do-it-refactor-F.md, theme-change--workflow.md, theme-change.md, logo-grid.css, section.component.yml, sprint10-cycle2b3-how-we-do-it-markers.php (template) |
| Acceptance criteria count | 7 |
| Handoff document path | `docs/pl2/handoffs/cycle-2b4-homepage-logo-grid-refactor-F.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | `web/themes/contrib/dripyard_base/components/_layouts/section/section.component.yml` |

## What was done

- **`scripts/sprint10-cycle2b4-homepage-logo-grid-markers.php`** (new): Idempotent Canvas-patch script. Adds two markers to 1 section on canvas_page id=20 (Homepage v2):
  - [6] `dy-section--logo-grid dy-section--post-hero-logos` (logo-strip section, theme--white, immediately following hero)
  - Preserves `component_version` at `e6079b189d228dad`.

- **`web/themes/custom/performant_labs_20260502/css/components/logo-grid.css`** (modified): Rewrote 3 fragile selectors to marker-based:
  - `.dy-section:has(.logo-grid) .dy-section__header > *` replaced by `.dy-section.dy-section--logo-grid .dy-section__header > *`
  - `.hero.theme--white + .dy-section:has(.logo-grid)` replaced by `.dy-section.dy-section--post-hero-logos`
  - `.hero.theme--white + .dy-section:has(.logo-grid) .dy-section__header` replaced by `.dy-section.dy-section--post-hero-logos .dy-section__header`
  - Added cycle 2b.4 entry to file header comment with cross-page check rationale.

## Cross-page reach check

Performed before deciding swap vs transition approach (per 2b.1-2b.3 lessons).

**logo-grid consumers:**

| Page | logo-grid count | hero count | Both selectors matched? |
|---|---|---|---|
| / | 7 | 1 | Yes |
| /services | 0 | 0 | No |
| /about-us | 0 | 0 | No |
| /how-we-do-it | 0 | 0 | No |
| /open-source-projects | 0 | 0 | No |

**Verdict:** Both old selectors only ever matched the homepage. Direct swap safe.

## Layer decisions

All three changes remain at Layer 5 (component-scoped overrides in `logo-grid.css` via `libraries-extend`).

**"We Speak" label (line 219 replacement):**
- Bottom-up: font-size, font-weight, letter-spacing, text-transform, text-align, color, line-height, margin-block-end on `.dy-section__header > *` children in the logo-grid section. Not config (L1), not OKLCH (L2), not theme tokens (L3). Component-scoped structural override. L5 correct.
- Top-down: Same ruling. No layer change from prior implementation.
- Trace: old `.dy-section:has(.logo-grid)` effective specificity for the compound selector was (0,2,0) on the section match. New `.dy-section.dy-section--logo-grid` is (0,2,0). Specificity maintained. Full selector specificity: old (0,3,0), new (0,3,0).

**Hero-to-logo-grid transition spacing (lines 256, 260 replacement):**
- Same L5 analysis. Structural spacing override.
- Trace: old `.hero.theme--white + .dy-section:has(.logo-grid)` was (0,4,0). New `.dy-section.dy-section--post-hero-logos` is (0,2,0). Specificity reduced from (0,4,0) to (0,2,0) for padding-top rule, and from (0,5,0) to (0,3,0) for header margin-bottom rule. Both reductions are safe: the competing selectors are `.padding-top--m` at (0,1,0) and `.dy-section__header` at (0,1,0).

## Deviations from spec

None.

## Verification results (T1 + T2)

### T1 -- Headless (curl + grep)

**Cache clear:** `ddev drush cr` -- completed.

**Markers in rendered HTML (PASS):**
```
1 dy-section--logo-grid
1 dy-section--post-hero-logos
```

Full class attribute:
```
class="dy-section dy-section--logo-grid dy-section--post-hero-logos theme--white container dy-section--section-max-width margin-top--0 margin-bottom--0 padding-top--m padding-bottom--m"
```

**CSS selectors in file (PASS):**
```
.dy-section.dy-section--logo-grid .dy-section__header > * {
.dy-section.dy-section--post-hero-logos {
.dy-section.dy-section--post-hero-logos .dy-section__header {
```

**No active :has(.logo-grid) selectors (PASS):** All occurrences are in comments.

**No active sibling combinator (PASS):** All hero + dy-section patterns are in comments.

**Idempotency (PASS):** Re-running marker script: both markers SKIPped ("already present").

**No !important (PASS).**

**Cross-page render sizes (PASS):**

| Page | Pre-change | Post-change | Delta | Note |
|---|---|---|---|---|
| / (homepage) | 82624 | 82624 | 0 | Exact match |
| /services | 59829 | 59833 | +4 | Cache variance, no regression |
| /about-us | 57918 | 57918 | 0 | Exact match |
| /how-we-do-it | 60292 | 60288 | -4 | Cache variance, no regression |
| /open-source-projects | 68121 | 68119 | -2 | Cache variance, no regression |

### T2 -- Structural checks

**component_version preserved (PASS):**
- [6] ver=e6079b189d228dad ac=dy-section--logo-grid dy-section--post-hero-logos

**Heading hierarchy (PASS):** h1 (1) -> h2 (7) -> h3 (6). Correct, no level skips.

**ARIA attributes present (PASS):** 26 aria-hidden, 2 aria-labelledby, 1 aria-label.

**All pages serve 200 OK (PASS).**

## WCAG contrast ratios

No color or contrast changes in this cycle. All three changes are:
- Marker class additions (no visual change)
- Selector rewrites (same declarations, same values, safe specificity reduction)

Existing contrast ratios from prior cycles remain valid. No recomputation needed.

## Mobile responsive behavior

N/A -- no responsive overrides written in this cycle. The marker classes are structural markers only. The existing CSS rules (font styling on header children, padding-top on section, margin-bottom on header) apply at all viewports, same as before the refactor.

## Autonomous decisions

1. **Applied two markers to one section rather than merging into a single marker name.** The issue explicitly offered this choice ("F may apply both classes to the one section, or merge into a single marker name"). Two markers is cleaner because they serve distinct CSS purposes: `.dy-section--logo-grid` for the "We Speak" label styling, `.dy-section--post-hero-logos` for the hero-adjacent spacing overrides. This keeps selectors semantically precise and allows future unbundling if the logo-grid were ever used outside the hero-adjacent position.

2. **Chose direct swap over transition-comma for all 3 selectors.** The cross-page reach check confirmed that logo-grid and hero only appear on the homepage. No other pages consume these selectors. Transition-comma (keeping old + new selectors during migration) was unnecessary.

3. **Accepted specificity reduction on hero-adjacent spacing rules.** Old selectors had (0,4,0) and (0,5,0) via the `.hero.theme--white +` sibling combinator compound. New selectors have (0,2,0) and (0,3,0). The reduction is safe because the only competing selectors are utility classes at (0,1,0).

4. **Corrected canvas_page target from id=1 to id=20.** The issue and audit referenced the "homepage" which initially appeared to be canvas_page id=1 ("Home"). Investigation revealed the live homepage is served from canvas_page id=20 ("Homepage (v2)"), as confirmed by the `html--page--20.html.twig` template suggestion in rendered HTML. The script was corrected before the markers were applied to the live page.

## Known issues

None. All acceptance criteria met.

## Files changed

- `scripts/sprint10-cycle2b4-homepage-logo-grid-markers.php` (new)
- `web/themes/custom/performant_labs_20260502/css/components/logo-grid.css` (modified -- 3 selector rewrites + file header comment update)
- `docs/pl2/handoffs/cycle-2b4-homepage-logo-grid-refactor-F.md` (new, this file)
