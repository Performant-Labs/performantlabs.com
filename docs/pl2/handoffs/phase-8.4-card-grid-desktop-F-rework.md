# Handoff-F: Phase 8.4 Rework — Feature-card grid collapses to 1-col at 768 (match preview)

**Date:** 2026-05-09
**Branch:** `aa/pl-homepage-phase-8.4-card-grid-desktop`
**Issue:** `docs/pl2/handoffs/phase-8.4-card-grid-desktop-rework-issue.md`

## What was done

- **CSS (new modifier class):** Added `.grid-wrapper--3col-stack-md` rules to `web/themes/custom/performant_labs_20260502/css/components/grid-wrapper.css`. This variant is identical to `--3col` except the tablet range (768-991px) renders `grid-template-columns: 1fr` (1-col) instead of `repeat(2, 1fr)` (2-col). The existing `--3col` rules are untouched.
- **Canvas database update:** Updated `canvas_page__components` and `canvas_page_revision__components` for entity_id 20 (Homepage v2), delta 18, to change `additional_classes` from `"grid-wrapper--3col"` to `"grid-wrapper--3col-stack-md"`.
- **Overlay YAML updated:** `content-exports/homepage-phase-8.4-card-grid.overlay.yml` now references `grid-wrapper--3col-stack-md` instead of `grid-wrapper--3col`.

## Layer decisions

### Path 1 vs Path 2 decision

**Chosen: Path 2 -- new modifier class.**

Rationale: `rg "grid-wrapper--3col"` found three consumers:
- `content-exports/homepage-phase-8.4-card-grid.overlay.yml` (homepage)
- `content-exports/open-source-projects-rework-cycle1.overlay.yml` (two deltas: Testing tools section)
- `content-exports/how-we-do-it-rewrite-pass-3.overlay.yml`

The open-source-projects and how-we-do-it pages depend on the current 2-col-at-tablet behavior from `--3col`. Modifying `--3col` directly (path 1) would regress those pages. Path 2 introduces a new class (`--3col-stack-md`) that the homepage uses exclusively, leaving `--3col` unchanged for the other consumers.

### Step-3 trace (completed before any CSS / Canvas change)

**CHANGE:** Feature-card grid at 768 must render 1-col (preview-canonical) instead of 2+1 (brief-specified).

**Pass 1 -- Bottom-up trace:**
```
Property:      grid-template-columns on .grid-wrapper__grid (feature-card section)
Current value: repeat(2, 1fr) at @media (min-width: 768px) and (max-width: 991px)
Declared by:   .grid-wrapper--3col rules in grid-wrapper.css (subtheme L5)
Problem:       --3col correctly implements the BRIEF's 2-col-at-md spec, but the
               PREVIEW renders 1-col at 768. Operator ruled preview canonical.
```

**Pass 2 -- Top-down eligibility:**
```
Layer 1 check: Not config. RULED OUT.
Layer 2 check: Not OKLCH-derived. RULED OUT.
Layer 3 check: No --theme-* token for grid layout. RULED OUT.
Layer 4 check: Not patching base theme. RULED OUT.
Layer 5 check: YES. New modifier class in the subtheme's grid-wrapper.css,
               applied via the Canvas additional_classes prop. CORRECT LAYER.
```

**DOM inspection evidence:**
```
- [x] Tier 1: .grid-wrapper.grid-wrapper--3col-stack-md exists in rendered HTML
- [x] Tier 1: subtheme grid-wrapper.css served with new rules (5 occurrences of selector)
- [ ] N/A — change is not Layer 1 or Layer 3
```

**Chosen layer:** Layer 5 -- component-scoped CSS + Canvas assembly prop change.

## Deviations from spec

The design brief at `pl_design_brief.md` "Responsive behavior" specifies feature cards: 3-col at desktop, 2-col at md, 1-col at sm. This rework intentionally deviates from the brief at the md (768-991) range by rendering 1-col instead of 2-col. This is per the operator's directive: the preview is canonical for Phase 8, and the preview renders 1-col at 768. See advisory notes below for the recommended follow-up.

## Verification results (T1 + T2)

### T1 -- Headless checks

**Cache clear:**
```
ddev drush cr -> [success] Cache rebuild complete.
```

**New class in rendered HTML:**
```
curl + grep: "grid-wrapper--3col-stack-md" found in rendered HTML
Only this variant present (old --3col no longer on homepage)
```
PASS.

**CSS file served with new rules:**
```
curl grid-wrapper.css: 5 occurrences of "grid-wrapper--3col-stack-md"
  - @media (min-width: 992px): repeat(3, 1fr) + grid-column: auto
  - @media (min-width: 768px) and (max-width: 991px): 1fr + grid-column: auto
  - @media (max-width: 767px): 1fr
```
PASS.

### T2 -- Structural checks (Playwright-measured)

**Desktop (1280):**
```
grid-template-columns: 345.266px 345.266px 345.266px  (3 equal columns)
cell count: 3
cell 0: top=1724, left=51, width=345, grid-column=auto
cell 1: top=1724, left=460, width=345, grid-column=auto
cell 2: top=1724, left=869, width=345, grid-column=auto
body scrollWidth=1265, viewport=1280, overflow=false
```
PASS -- three cards in a single 3-column row. No overflow. Round-1 fix preserved.

**Tablet (768):**
```
grid-template-columns: 692.75px  (1 column)
cell count: 3
cell 0: top=1906, left=30, width=693, grid-column=auto
cell 1: top=2288, left=30, width=693, grid-column=auto
cell 2: top=2670, left=30, width=693, grid-column=auto
body scrollWidth=753, viewport=768, overflow=false
```
PASS -- three cards in a 1-column stack. All at the same left (30), each at a distinct top. This is the rework fix: was 2+1, now 1-col. Matches preview at 768.

**Mobile (375):**
```
cell count: 3
cell 0: top=2225, left=14, width=331, grid-column=span 6
cell 1: top=2751, left=14, width=331, grid-column=span 6
cell 2: top=3253, left=14, width=331, grid-column=span 6
body scrollWidth=360, viewport=375, overflow=false
```
PASS -- three cards stacked full-width, one per row. No overflow. Unchanged from round 1.

### Regression checks vs 8.2 and round-1 8.4

| Check | Result | Evidence |
|---|---|---|
| Hero `padding-inline: 0` on `.hero.theme--white` (8.2 fix) | PASS | Playwright at 768: paddingInlineStart=0px, paddingInlineEnd=0px. Rule confirmed in hero.css line 75. |
| Logo-grid `flex-wrap: nowrap` at `min-width: 992px` (8.2 fix) | PASS | Rule confirmed in logo-grid.css line 114. Playwright at 1280: flexWrap=nowrap. |
| 1280 feature-card layout still 3-col single row (round-1 8.4 fix) | PASS | Playwright: 345.266px x 3, all cards at top=1724. |
| No horizontal overflow at any viewport | PASS | scrollWidth < viewport at 1280 (1265<1280), 768 (753<768), 375 (360<375). |
| Other consumers of `--3col` unchanged | PASS | `--3col` CSS rules untouched in grid-wrapper.css (lines 114-140). open-source-projects and how-we-do-it overlays still reference `grid-wrapper--3col`. |

## WCAG contrast ratios

No surface-color or text-color changes in this rework. The change is purely structural (new CSS modifier class + Canvas class swap). No contrast recomputation needed.

| Element | Foreground | Background | Ratio | Pass/Fail |
|---------|-----------|------------|-------|-----------|
| N/A -- no color changes | -- | -- | -- | N/A |

## Mobile responsive behavior

| Breakpoint | Rule | Behavior | Verified |
|-----------|------|----------|----------|
| >= 992px (desktop) | `grid-template-columns: repeat(3, 1fr)` | 3 cards per row | Playwright: 345.3px x 3 at 1280 |
| 768-991px (tablet) | `grid-template-columns: 1fr` | 1 card per row (rework change) | Playwright: 692.75px x 1 at 768 |
| < 768px (mobile) | `grid-template-columns: 1fr` | 1 card per row | Playwright: full-width at 375 |

No horizontal overflow at any viewport. Touch targets unchanged (cards are full-width block links).

## Advisory notes

**Brief-vs-preview contradiction at 768 for feature cards.** The design brief at `pl_design_brief.md` "Responsive behavior" specifies 2-col at md (768-991) for feature cards. The preview HTML at `docs/pl2/Previews/homepage.html` renders 1-col at 768. The operator ruled preview canonical for Phase 8. Live now matches the preview (1-col at 768). Recommend updating the brief's "Responsive behavior" table in a separate documentation cycle to reflect the operator's decision, so future work does not re-trip on this contradiction.

## Known issues

None. All acceptance criteria met.

## Files changed

1. `web/themes/custom/performant_labs_20260502/css/components/grid-wrapper.css` -- added `.grid-wrapper--3col-stack-md` rules (3 breakpoints: desktop 3-col, tablet 1-col, mobile 1-col). Existing `--3col` rules untouched.
2. `content-exports/homepage-phase-8.4-card-grid.overlay.yml` -- updated `additional_classes` from `grid-wrapper--3col` to `grid-wrapper--3col-stack-md`.
3. **Canvas database** (not a file on disk): `canvas_page__components` and `canvas_page_revision__components` for entity_id 20, delta 18 -- updated `components_inputs` to swap `grid-wrapper--3col` for `grid-wrapper--3col-stack-md`.

**Files to stage for commit:**
- `web/themes/custom/performant_labs_20260502/css/components/grid-wrapper.css`
- `content-exports/homepage-phase-8.4-card-grid.overlay.yml`
- `docs/pl2/handoffs/phase-8.4-card-grid-desktop-F-rework.md`
- `docs/pl2/handoffs/phase-8.4-card-grid-desktop-rework-issue.md`
