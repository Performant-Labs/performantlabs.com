# Handoff-F: Phase 8.5 - Hero whitespace below CTAs

**Date:** 2026-05-10
**Branch:** `aa/pl-homepage-phase-8.5-hero-spacing`
**Issue:** `docs/pl2/handoffs/phase-8.5-hero-spacing-issue.md`

## Layer decisions

### Trace 1: Hero min-height and padding-block

**Pass 1 -- Bottom-up:**

```
Property:      min-height on .hero (computed: 800px)
Declared by:   .hero--height-medium { min-height: 800px }
               neonbyte/components/hero/hero.css line 47-48
Source:        Canvas prop height="medium" on the hero component
               (hero.component.yml enum: small/medium/large/full-screen)

Property:      padding-block on .hero (computed: 112px 112px)
Declared by:   .hero.theme--white { padding-block: clamp(4rem, 10vh, 7rem) }
               performant_labs_20260502/css/components/hero.css (Phase 8.2)
               At 1280px viewport: clamp(64, 128, 112) = 112px
Preview spec:  padding: 120px 0 var(--space-section) = 120px top, 96px bottom
```

**Pass 2 -- Top-down eligibility:**

```
L1 check: Can height="medium" be changed to eliminate min-height?
           → hero.component.yml enum: small (400px), medium (800px),
             large (90dvh), full-screen (100dvh). NO "auto" or "none" option.
             L1 CANNOT produce intrinsic sizing. RULED OUT.

L1 check: Can padding be changed via config?
           → padding-block is CSS, not a Canvas prop. RULED OUT.

L2 check: Not OKLCH-derived. RULED OUT.

L3 check: min-height and padding-block are not --theme-* tokens. RULED OUT.

L5 check: Component-scoped override on .hero.theme--white.
           Specificity (0,2,0) matches .hero.hero--height-medium (0,2,0).
           Subtheme CSS loads after component CSS via libraries-extend,
           so cascade order wins at equal specificity.
           → CORRECT LAYER.

Proposed fix:
  .hero.theme--white {
    min-height: auto;
    height: auto;
    padding-block: 120px 96px;
  }
  @media (max-width: 767px) {
    .hero.theme--white { padding-block: 64px; }
  }
  File: css/components/hero.css
```

### Trace 2: Hero-to-logo-grid section transition spacing

**DOM inspection evidence (required for L5 structural fix):**

```
[x] Tier 1: .hero and .dy-section:has(.logo-grid) are direct siblings
    inside .block-system-main-block (verified via Playwright evaluate)
[x] Tier 1: .dy-section has class "padding-top--m" which resolves to
    var(--spacing-component-internal) = 80px at >700px viewport
[x] Tier 1: .dy-section__header has margin-bottom: 80px from
    dripyard_base/components/_layouts/section/section.css
```

**Pass 1 -- Bottom-up:**

```
Property:      padding-top on .dy-section wrapping logo-grid (computed: 80px)
Declared by:   .padding-top--m { padding-top: var(--spacing-component-internal) }
               dripyard_base/css/utilities/layout-utilities.css
               --spacing-component-internal at >700px = --spacing-xxl = 80px
Source:        Canvas section padding_top prop = "m"

Property:      margin-bottom on .dy-section__header (computed: 80px)
Declared by:   .dy-section__header { margin-bottom: var(--spacing-component-internal) }
               dripyard_base/components/_layouts/section/section.css
Preview spec:  .logo-bar { padding: var(--space-2xl) 0 } = 48px top/bottom
               .logo-bar__label { margin-bottom: var(--space-xl) } = 32px
```

**Pass 2 -- Top-down eligibility:**

```
L1 check: Can padding_top be changed via Canvas to produce 48px?
           → dy-section YAML padding enum: none (0), s (8px), m (80px), l (120px).
             NO value matches 48px. L1 CANNOT produce correct value. RULED OUT.

L2 check: Not OKLCH-derived. RULED OUT.

L3 check: padding-top and margin-bottom are not --theme-* tokens. RULED OUT.

L5 check: Component-scoped via adjacent-sibling combinator:
           .hero.theme--white + .dy-section:has(.logo-grid)
           Specificity (0,4,0) beats .padding-top--m (0,1,0).
           Scoped to homepage hero-to-logo transition only.
           → CORRECT LAYER.

Proposed fix:
  .hero.theme--white + .dy-section:has(.logo-grid) {
    padding-top: 3rem;  /* 48px */
  }
  .hero.theme--white + .dy-section:has(.logo-grid) .dy-section__header {
    margin-bottom: 2rem;  /* 32px */
  }
  File: css/components/logo-grid.css
```

## What was done

- `web/themes/custom/performant_labs_20260502/css/components/hero.css` -- Replaced `padding-block: clamp(4rem, 10vh, 7rem)` with `min-height: auto; height: auto; padding-block: 120px 96px;` on `.hero.theme--white`. Added `@media (max-width: 767px)` rule for `padding-block: 64px`. Neutralizes `hero--height-medium` min-height: 800px and sets preview-exact padding values.
- `web/themes/custom/performant_labs_20260502/css/components/logo-grid.css` -- Added `.hero.theme--white + .dy-section:has(.logo-grid)` padding-top override (80px to 48px) and `.dy-section__header` margin-bottom override (80px to 32px). Closes the remaining gap between hero and logo band to match the preview's tight transition.
- `docs/pl2/css-change-log.md` -- Added two entries for the Phase 8.5 fixes.

## Deviations from spec

None. All values match the preview exactly:
- Desktop: hero padding 120px / 96px, section gap 48px + 32px label margin (preview: logo-bar 48px + label 32px)
- Mobile (<=767px): hero padding 64px (preview: var(--space-3xl) = 64px)

## Verification results (T1 + T2)

### T1: CSS delivery

```
$ ddev drush cr → [success] Cache rebuild complete.

$ curl hero.css | grep "min-height: auto"
  min-height: auto;                    ✓

$ curl hero.css | grep "padding-block: 120px 96px"
  padding-block: 120px 96px;           ✓

$ curl hero.css | grep "padding-block: 64px"
    padding-block: 64px;               ✓ (inside @media max-width: 767px)

$ curl logo-grid.css | grep "hero.theme--white"
.hero.theme--white + .dy-section:has(.logo-grid) {      ✓
.hero.theme--white + .dy-section:has(.logo-grid) .dy-section__header {  ✓
```

### T1: Playwright computed value measurements

| Viewport | hero min-height | hero padding-top | hero padding-bottom | CTA-to-label gap | Preview target |
|----------|----------------|-----------------|--------------------|-----------------:|---------------:|
| 1280px   | 0px            | 120px           | 96px               | 144px            | 144px          |
| 768px    | 0px            | 120px           | 96px               | 144px            | 144px          |
| 375px    | 0px            | 64px            | 64px               | 112px            | 112px          |

All three viewports match the preview target exactly.

### T1: Regression checks

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| 8.2: hero padding-inline at 768px | 0px | 0px | PASS |
| 8.2: no horizontal overflow at 768px | scrollWidth <= viewport | 753 <= 768 | PASS |
| 8.2: logo-grid nowrap at 1280px | nowrap | nowrap | PASS |
| 8.4: feature cards at 1280px | 3 per row | 3 | PASS |
| 8.4: feature cards at 768px | 1 per row | 1 | PASS |
| 8.4: feature cards at 375px | 1 per row | 1 | PASS |

### T2: Structural

| Check | Result |
|-------|--------|
| H1 count | 1 (PASS) |
| Heading hierarchy | H1 > H2 > H3, no skips (PASS) |
| Main landmark present | Yes (PASS) |
| Banner landmark present | Yes (PASS) |
| Contentinfo landmark present | Yes (PASS) |

## WCAG contrast ratios

No surface-color or text-color changes in this phase. All existing contrast ratios from Phase 8.2 remain unchanged:

| Element | Foreground | Background | Ratio | Pass/Fail |
|---------|-----------|------------|------:|-----------|
| Hero headline | #1F1A14 | #FFFFFF | 17.29:1 | AAA |
| Hero subhead | #5C544C | #FFFFFF | 7.07:1 | AAA |
| Hero kicker | #8E4A2A | #FFFFFF | 6.69:1 | AA |
| Focus ring | #1893b4 | #FFFFFF | 3.58:1 | non-text 3:1 pass |

## Mobile responsive behavior

| Breakpoint | Change | Verification |
|-----------|--------|--------------|
| <= 767px | Hero padding-block: 120px 96px reduced to 64px (matching preview's `var(--space-3xl)`) | Playwright at 375px: padding-top=64px, padding-bottom=64px. CTA-to-label gap=112px matches preview. |
| All viewports | min-height: auto (neutralizes hero--height-medium 800px) | Playwright confirms min-height=0px at all three viewports. Hero sizes intrinsically. |

Touch targets: unaffected (CTA buttons retain min-height: 44px from Phase 8.2 rules).

## Known issues

None. All acceptance criteria met.

## Files changed

- `web/themes/custom/performant_labs_20260502/css/components/hero.css`
- `web/themes/custom/performant_labs_20260502/css/components/logo-grid.css`
- `docs/pl2/css-change-log.md`
