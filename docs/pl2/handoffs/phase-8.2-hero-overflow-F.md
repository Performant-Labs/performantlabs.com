# Handoff-F: Phase 8.2 - Hero typography overflow fix

**Date:** 2026-05-09
**Branch:** `aa/pl-homepage-phase-8.2-hero-overflow`
**Issue:** `docs/pl2/handoffs/phase-8.2-hero-overflow-issue.md`

## Critical finding: this is not a typography problem

The original issue (from S's Phase 8 audit) framed this as a hero H1 typography problem: "H1 renders ~120 px (display-2xl-like)" at desktop and "H1 overflows past the right viewport edge" at 768px. **The trace found neither claim to be accurate.** The hero heading typography was already correct at all three viewports before any Phase 8.2 changes were made:

| Viewport | Property | Live value (pre-fix) | Spec (brief/preview) | Status |
|----------|----------|---------------------|----------------------|--------|
| 1280 | font-size | 72px | 72px (display-xl) | MATCH |
| 1280 | letter-spacing | -2px | -2px | MATCH |
| 1280 | line-height | 1.05 (75.6px) | 1.05 | MATCH |
| 1280 | font-weight | 500 | 500 | MATCH |
| 768 | font-size | 72px | 72px | MATCH |
| 768 | h1 width | 693px | fits in container | MATCH (no text overflow) |
| 375 | font-size | 44px | 44px (typography-mobile) | MATCH |
| 375 | letter-spacing | -1px | -1px | MATCH |

S's "~120 px" estimate appears to have been a visual measurement from screenshots. The Playwright-measured computed `fontSize` is definitively `72px` at 1280px. S's "H1 overflows past the right viewport edge" was also a misattribution: the horizontal overflow at 768px came from layout issues (see next section), not from the heading text.

**The actual root cause of the 768px horizontal overflow is layout, not typography.** Two structural CSS bugs combined to push `document.scrollWidth` (803px) past `document.clientWidth` (768px):

1. **Hero padding-inline: 80px** (from neonbyte's `@container (width > 700px)` rule). At 768px viewport, the hero is 693px wide (border-box). The 80px left + 80px right padding leaves a 533px content box. But `.hero__container.container` calculates its width from `92cqw` of the ancestor `.query-container` (753px), yielding 693px -- which overflows the hero's 533px content box by 160px.

2. **Logo-grid `flex-wrap: nowrap` at `min-width: 577px`**. Six logos at max-width 140px + gap 2rem need approximately 1000px. At 768px the container is only 693px. The nowrap forced the logo row to 934px, overflowing by 241px.

Both bugs were present in the pre-Phase-8.2 codebase. Neither is a typography issue.

## Layer decisions

### Fix 1: Hero padding-inline (hero.css)

**Trace (Step 2):**

Pass 1 -- Bottom-up:
```
Property:      padding-inline on .hero
Current value: 80px (each side)
Declared by:   neonbyte/components/hero/hero.css @container (width > 700px) {
                 padding-inline: var(--spacing-component-internal);
               }
Resolves to:   --spacing-component-internal = var(--spacing-xl) = var(--sp8) = 64px
               (but @container > 700px override: --spacing-component-internal = var(--spacing-xxl) = 80px)
```

Pass 2 -- Top-down:
```
L1: padding-inline not config-driven. RULED OUT.
L2: not OKLCH-derived. RULED OUT.
L3: padding-inline is not a --theme-* token. RULED OUT.
L5: component-scoped on .hero.theme--white. CORRECT LAYER.
    Specificity (0,2,0) on .hero.theme--white beats neonbyte's
    .hero @container rule which targets .hero (0,1,0).
    Preview spec: .hero { padding: 120px 0 var(--space-section) } -- zero inline padding.
```

**Layer chosen: L5** (hero.css, component-scoped override via libraries-extend on core/components.neonbyte--hero).

**Change:** Added `padding-inline: 0` to the existing `.hero.theme--white` rule block, matching the preview's zero horizontal padding.

### Fix 2: Logo-grid flex-wrap breakpoint (logo-grid.css)

**Trace (Step 2):**

Pass 1 -- Bottom-up:
```
Property:      flex-wrap on .logo-grid__content
Current value: nowrap (at min-width: 577px)
Declared by:   performant_labs_20260502/css/components/logo-grid.css @media (min-width: 577px)
Problem:       6 logos at max-width 140px + gap 2rem = ~1000px minimum.
               At 768px the container is 693px. 1000 - 693 = 307px overflow.
```

Pass 2 -- Top-down:
```
L1: not config. RULED OUT.
L2: not OKLCH. RULED OUT.
L3: not a theme token. RULED OUT.
L5: component-scoped to .logo-grid__content. CORRECT LAYER.
```

**Layer chosen: L5** (logo-grid.css, component-scoped override via libraries-extend on core/components.dripyard_base--logo-grid).

**Change:** Raised the `flex-wrap: nowrap` breakpoint from `min-width: 577px` to `min-width: 992px` (the `lg` breakpoint). Added an explicit tablet range rule (`min-width: 577px and max-width: 991px`) with `flex-wrap: wrap`. Logos now wrap into multiple rows at tablet (3+3 or similar) and only go single-row at desktop where there is sufficient room (1164px container at 1280px viewport).

**Scope overlap with Phase 8.3:** The logo-grid responsive strategy is also flagged as sub-cycle 8.3 in S's audit. This Phase 8.2 fix addresses only the `flex-wrap` overflow bug. Phase 8.3 will handle the remaining work: the preview's text-fallback strategy (text logos at narrow widths vs bitmap logos on live). The two are independent changes -- this wrap fix does not constrain 8.3's options.

## What was done

- `css/components/hero.css` -- Added `padding-inline: 0` to `.hero.theme--white` rule to eliminate the 160px content-box overflow caused by neonbyte's `@container` padding. Updated file header comments with the Phase 8.2 trace and root-cause explanation.
- `css/components/logo-grid.css` -- Changed `flex-wrap: nowrap` breakpoint from `min-width: 577px` to `min-width: 992px`. Added tablet range rule (`577px-991px`) with `flex-wrap: wrap`. Updated file header comments documenting the breakpoint change and 8.3 scope overlap.
- `docs/pl2/css-change-log.md` -- Two new entries appended (hero padding-inline fix, logo-grid breakpoint fix).

## Deviations from spec

The issue stated the hero H1 renders at "~120 px (display-2xl-like)" and specified "weight 800" in the acceptance table. The trace found:
- Font-size is 72px (display-xl), not 120px. No font-size change was needed.
- Font-weight is 500 per the design brief (`pl_design_brief.md` display-xl: fontWeight 500) and the preview (`homepage.html` .hero h1: font-weight 500). The issue's "weight 800" was incorrect; no weight change was needed.

No typography CSS was changed. The fix is entirely structural (padding and flex-wrap).

## Verification results (T1 + T2)

### T1 -- Headless (curl + grep + Playwright computed styles)

**CSS file presence:**
```
curl hero.css | grep -c "padding-inline: 0"  → 1 (present)
curl logo-grid.css | grep -c "min-width: 992px"  → 2 (present, tablet range + nowrap)
```

**Horizontal overflow eliminated at all three viewports:**

| Viewport | docScrollW | docClientW | hasHorizontalScroll |
|----------|-----------|------------|---------------------|
| 1280 | 1265 | 1280 | false |
| 768 | 753 | 768 | false |
| 375 | 360 | 375 | false |

**Hero heading computed styles (post-fix, confirmed via Playwright):**

| Viewport | fontSize | letterSpacing | lineHeight | fontWeight | h1Width | heroPadInline |
|----------|----------|--------------|------------|------------|---------|---------------|
| 1280 | 72px | -2px | 75.6px | 500 | 720px | 0px |
| 768 | 72px | -2px | 75.6px | 500 | 693px | 0px |
| 375 | 44px | -1px | 46.2px | 500 | 331px | 0px |

**Hero content position at 768px (all within viewport):**

| Element | left | right | width | Within 768px? |
|---------|------|-------|-------|---------------|
| .hero | 30 | 723 | 693 | yes |
| .hero__container | 30 | 723 | 693 | yes |
| .hero__content | 30 | 723 | 693 | yes |
| h1 | 30 | 723 | 693 | yes |

H1 wraps to 2 lines (height 140px / line-height 75.6px).

**Logo-grid at 768px:** `flex-wrap: wrap` (correct -- 992px breakpoint not met).
**Logo-grid at 1280px:** `flex-wrap: nowrap`, all 6 logos on one line, `allOnOneLine: true` (no regression).

### T2 -- Structural checks

**Heading hierarchy:** Single H1 ("Ship Drupal releases with confidence.") followed by H2s for each section, H3s for cards and footer columns. No skipped levels.

**ARIA landmarks:** `<header>`, `<nav aria-labelledby="...">`, `<main>`, `<footer>`, `<section role="group">` (accordion) -- all present.

**Mobile CTA touch targets (375px):**
- "Book a testing review" -- 56px x 331px (exceeds 44x44 WCAG minimum)
- "See how we test this site" -- 56px x 331px (exceeds 44x44 WCAG minimum)

Both buttons stack vertically at full container width below sm breakpoint, per design brief spec.

## WCAG contrast ratios

No surface-color or text-color changes were made in this phase. All contrast ratios documented in the existing hero.css header remain valid:

| Element | Foreground | Background | Ratio | Pass/Fail |
|---------|-----------|------------|-------|-----------|
| Headline | #1F1A14 (--theme-text-color-loud) | #FFFFFF | 17.29:1 | AAA pass |
| Subhead | #5C544C (--theme-text-color-medium) | #FFFFFF | 7.07:1 | AAA pass |
| Kicker | #8E4A2A (--pl-accent-deep) | #FFFFFF | 6.69:1 | AA pass |
| Focus ring | #1893b4 | #FFFFFF | 3.58:1 | non-text 3:1 pass |

## Mobile responsive behavior

No new responsive overrides were written. The existing responsive behavior (44px hero heading at mobile, full-width stacked CTAs below 576px) was verified as unchanged:

- **375px:** H1 at 44px/-1px, CTAs stack full-width at 56px height. No horizontal scroll.
- **768px:** H1 at 72px/-2px, wraps to 2 lines within container. Logos wrap into multi-row grid. No horizontal scroll.
- **1280px:** H1 at 72px/-2px on a single line within 720px max-width. Logos in single row. No horizontal scroll.

## Known issues

None. All six acceptance criteria are met:

1. Step-3 trace surfaced in handoff before CSS written -- yes (see "Critical finding" and "Layer decisions" above).
2. Desktop (1280) H1 renders at 72px -- yes (was already correct; confirmed via Playwright).
3. Tablet (768) H1 wraps within viewport, no horizontal scroll -- yes (`hasHorizontalScroll: false`, all hero elements within viewport).
4. Mobile (375) H1 at 44px, no regression -- yes (confirmed).
5. WCAG contrast unchanged, no new touch-target issues -- yes (no color changes; CTAs at 56px height).
6. No `!important`, files staged by explicit path, Canvas component_version unchanged -- yes.

## Files changed

1. `web/themes/custom/performant_labs_20260502/css/components/hero.css` -- added `padding-inline: 0`
2. `web/themes/custom/performant_labs_20260502/css/components/logo-grid.css` -- raised flex-wrap nowrap breakpoint from 577px to 992px; added tablet wrap rule
3. `docs/pl2/css-change-log.md` -- two new entries appended
