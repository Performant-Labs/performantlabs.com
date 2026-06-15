# Handoff-F: Phase 8.4 — Feature-card grid renders 2+1 at desktop, must be 3-column

**Date:** 2026-05-09
**Branch:** `aa/pl-homepage-phase-8.4-card-grid-desktop`
**Issue:** `docs/pl2/handoffs/phase-8.4-card-grid-desktop-issue.md`

## Layer decisions

### Step-3 trace (completed before any change was made)

**CHANGE:** Feature-card grid renders 2 + 1 at 1280px desktop instead of 3 columns in a single row.

**Pass 1 -- Bottom-up trace (find the origin):**

```
Property:      grid-template-columns on .grid-wrapper__grid (feature-card section)
Current value: repeat(6, minmax(0, 1fr)) [default] / repeat(12, minmax(0, 1fr)) [>600px container]
Declared by:   grid-wrapper.css (dripyard_base) — default 6-col, @container (width > 600px) -> 12-col
Grid-cell:     grid-column: span var(--grid-cell-columns-large, ...) at @container (width > 1200px)
               Each cell has inline style: --grid-cell-columns-large: 4  (= 4/12 = 3 cards per row)
Problem:       @container (width > 1200px) does NOT fire at 1280px viewport because:
               - html inline style sets --theme-setting-container-max-pixel: 1440px
               - .container width = min(92cqw, 1440px) = min(~1178px, 1440px) = ~1178px
               - Section padding further reduces .grid-wrapper's container width
               - 1178px < 1200px -> "large" container query breakpoint never activates
               - Cards stay at "medium": --grid-cell-columns-medium: 6 -> span 6 of 12 -> 2 per row
               - Result: 2 + 1 layout
```

**DOM inspection evidence (T1):**
```
- [x] Tier 1: .grid-wrapper exists in rendered HTML (curl confirmed, class="grid-wrapper")
- [x] Tier 1: container-width chain traced:
      <html> --theme-setting-container-max-pixel: 1440px (inline)
      .container { width: min(92cqw, 1440px) } -> ~1178px at 1280 viewport
      .grid-wrapper { container-type: inline-size } -> container is ~1178px
      @container (width > 1200px) -> FALSE at 1178px
- [ ] N/A — change is not Layer 1 or Layer 3
```

**Pass 2 -- Top-down eligibility (rule out higher layers):**

```
Layer 1 check: Is a config value wrong?
               -> --theme-setting-container-max-pixel is 1440px (correct for the site).
               Changing it would affect every section on every page. NOT the fix.

Layer 2 check: Is an OKLCH-derived shade involved?
               -> No. This is a layout/grid problem, not a color problem. NOT applicable.

Layer 3 check: Can a theme token override fix this?
               -> No. There is no --theme-* token for grid-template-columns.
               NOT applicable.

Layer 4 check: Should the base theme's grid-cell container query breakpoint change?
               -> The @container (width > 1200px) breakpoint is a Dripyard design choice.
               Modifying the base theme CSS is out of scope. We do not patch Layer 4.

Layer 5 check: Can a component-scoped override fix this?
               -> YES. The subtheme already has css/components/grid-wrapper.css with
               viewport-based (@media) rules for .grid-wrapper--3col that correctly
               implement: 3-up at >=992px, 2-up at 768-991px, 1-up at <768px.
               These rules are loaded via libraries-extend on
               core/components.dripyard_base--grid-wrapper.
               The problem: the Canvas assembly does not apply the grid-wrapper--3col
               class to the homepage feature-card grid-wrapper component.

-> Root cause: Canvas assembly omits the additional_classes prop.
   The CSS fix already exists at Layer 5. The assembly just needs the class.
   Fix: set additional_classes: "grid-wrapper--3col" on the grid-wrapper
   component (delta 18, Canvas page 20, UUID 81cfc250-10bf-45ce-bfb5-52676606e33e).
```

**Chosen layer:** Layer 5 -- Canvas assembly configuration change (connecting existing CSS to the correct HTML element via the `additional_classes` prop). No new CSS written. No `!important`.

## What was done

- **Canvas database update:** Updated `canvas_page__components` and `canvas_page_revision__components` for entity_id 20 (Homepage v2), delta 18, to set `components_inputs` from `{"column_gutter":"large","row_gutter":"medium"}` to `{"column_gutter":"large","row_gutter":"medium","additional_classes":"grid-wrapper--3col"}`. This adds the `grid-wrapper--3col` CSS class to the feature-card grid-wrapper, activating the existing viewport-based `@media` responsive rules in `css/components/grid-wrapper.css`.
- **Overlay YAML created:** `content-exports/homepage-phase-8.4-card-grid.overlay.yml` -- reproducible apply script for this Canvas change, compatible with `scripts/apply-canvas-page.php`.
- **component_version retained:** Set to `ba954a2accbc0f5c` (the only available version for `sdc.dripyard_base.grid-wrapper`). Canvas requires this exact hash; empty string causes a 500 error (`OutOfRangeException`). The "set to NULL" protocol does not apply when Canvas component versions are immutable config entities with a single active version.

## Deviations from spec

None. The brief says 3 columns at desktop, 2 at md, 1 at sm. The existing `--3col` CSS rules implement exactly this via viewport media queries. The only missing piece was the class on the HTML element.

## Verification results (T1 + T2)

### T1 -- Headless checks

**Cache clear:**
```
ddev drush cr -> [success] Cache rebuild complete.
```

**HTTP status:**
```
curl -sk homepage -> 200 (85,474 bytes)
```

**grid-wrapper--3col class present in rendered HTML:**
```
<div data-component-id="dripyard_base:grid-wrapper" class="grid-wrapper grid-wrapper--3col">
```
PASS.

**CSS file served with 3col rules:**
```
<link rel="stylesheet" media="all" href="/themes/custom/performant_labs_20260502/css/components/grid-wrapper.css?tescjz">
```
File contains `repeat(3, 1fr)` at `@media (min-width: 992px)`, `repeat(2, 1fr)` at `@media (min-width: 768px) and (max-width: 991px)`, and `1fr` at `@media (max-width: 767px)`. PASS.

### T2 -- Structural checks (Playwright-measured)

**Desktop (1280):**
```
grid-template-columns: 345.266px 345.266px 345.266px  (3 equal columns)
cell count: 3
cell 0: grid-column=auto, width=345.3px
cell 1: grid-column=auto, width=345.3px
cell 2: grid-column=auto, width=345.3px
body scrollWidth=1265, viewport=1280, overflow=false
```
PASS -- three cards in a single 3-column row. No overflow.

**Tablet (768):**
```
grid-template-columns: 317.516px 317.516px  (2 columns)
cell count: 3
cell 0: grid-column=auto, width=317.5px
cell 1: grid-column=auto, width=317.5px
cell 2: grid-column=auto, width=317.5px
body scrollWidth=753, viewport=768, overflow=false
```
PASS -- two cards on row 1, one card on row 2. No overflow. Phase 8.2 fix preserved.

**Mobile (375):**
```
cell count: 3
cell 0: grid-column=span 6, width=331.2px (full width)
cell 1: grid-column=span 6, width=331.2px (full width)
cell 2: grid-column=span 6, width=331.2px (full width)
body scrollWidth=360, viewport=375, overflow=false
```
PASS -- three cards stacked full-width, one per row. No overflow.

**Heading hierarchy:**
```
H2: Main navigation
H1: Ship Drupal releases with confidence.
H2: Tools, AI, and experts. All there.
  H3: Tools the Drupal community uses
  H3: Tests that heal themselves
  H3: Experts alongside your team
H2: We heal our own tests nightly.
H2: Built for the whole Drupal team.
H2: Frequently asked questions.
H2: Ready for a release you don't have to babysit?
H2: Footer
  H3: Services
  H3: Resources
  H3: Company
```
Single H1, no skipped levels, feature card titles correctly at H3 under the H2 section heading. PASS.

**ARIA landmarks:** 1 `<header>`, 1 `<main>`, 1 `<footer>`, 2 `<nav>`. PASS.

**Card chrome intact:**
- Eyebrow text: "01 / Tools", "02 / AI", "03 / People" -- PASS
- Card titles: "Tools the Drupal community uses", "Tests that heal themselves", "Experts alongside your team" -- PASS
- Corner arrow SVG icon: present on all three cards -- PASS

## WCAG contrast ratios

No surface-color or text-color changes in this phase. The change is purely structural (adding a CSS class to the grid-wrapper element). No contrast recomputation needed.

| Element | Foreground | Background | Ratio | Pass/Fail |
|---------|-----------|------------|-------|-----------|
| N/A -- no color changes | -- | -- | -- | N/A |

Confirmed via `git diff main -- '*.css'`: zero CSS file changes.

## Mobile responsive behavior

No new responsive CSS overrides were written. The existing `css/components/grid-wrapper.css` rules for `.grid-wrapper--3col` were already correct:

| Breakpoint | Rule | Behavior | Verified |
|-----------|------|----------|----------|
| >= 992px (desktop) | `grid-template-columns: repeat(3, 1fr)` | 3 cards per row | Playwright: 345.3px x 3 at 1280 |
| 768-991px (tablet) | `grid-template-columns: repeat(2, 1fr)` | 2 + 1 cards | Playwright: 317.5px x 2 at 768 |
| < 768px (mobile) | `grid-template-columns: 1fr` | 1 card per row | Playwright: 331.2px full-width at 375 |

No horizontal overflow at any viewport (body.scrollWidth < viewport width at all three breakpoints).

## Known issues

None. All acceptance criteria met.

## Files changed

1. **Canvas database** (not a file on disk): `canvas_page__components` and `canvas_page_revision__components` for entity_id 20, delta 18 -- updated `components_inputs` to add `"additional_classes":"grid-wrapper--3col"`.
2. `content-exports/homepage-phase-8.4-card-grid.overlay.yml` -- overlay YAML for reproducible application of the Canvas change via `scripts/apply-canvas-page.php`.

**Files to stage for commit:**
- `content-exports/homepage-phase-8.4-card-grid.overlay.yml`
- `docs/pl2/handoffs/phase-8.4-card-grid-desktop-F.md`
- `docs/pl2/handoffs/phase-8.4-card-grid-desktop-issue.md`
