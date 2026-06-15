# Handoff-F: Phase 8.3 - Logo grid presentation parity

**Date:** 2026-05-11
**Branch:** `aa/pl-homepage-phase-8.3-logo-grid`
**Issue:** `docs/pl2/handoffs/phase-8.3-logo-grid-issue.md`

## What was done

- **`web/themes/custom/performant_labs_20260502/css/components/logo-grid.css`** -- Updated with Phase 8.3 overrides: reduced logo cell height from 110px to 28px, removed padding, added grayscale(100%) + opacity 0.7, changed justify-content to space-between at desktop, set explicit img dimensions (140x28) with object-fit: contain for Canvas srcset compatibility, added 3-rows-of-2 mobile breakpoint rule.

## Layer decisions

### Change 1: --logo-grid-logo-size 110px to 28px

**Bottom-up trace:**
```
.logo-item height = 110px
  <- var(--logo-item-height) (logo-item.css:20)
  <- var(--logo-grid-logo-size) (logo-item.css:7)
  <- .logo-grid--size-medium { --logo-grid-logo-size: 110px } (logo-grid.css:18)
```

**Top-down:**
- L1: CSS variable, not Drupal config. RULED OUT.
- L2: Not OKLCH. RULED OUT.
- L3: Not a theme token. RULED OUT.
- L5: Component-scoped on `.logo-grid.logo-grid--size-medium` (0,2,0). CORRECT LAYER.

**Fix:** `.logo-grid.logo-grid--size-medium { --logo-grid-logo-size: 28px; }` -- specificity (0,2,0) beats Dripyard's (0,1,0).

### Change 2: .logo-item padding/height/overflow reset

**Bottom-up trace:**
```
.logo-item padding: var(--sp2) var(--sp4) = 16px 32px (logo-item.css:17)
.logo-item overflow: clip (logo-item.css:21)
.logo-item height: var(--logo-item-height) (logo-item.css:20)
```
Dripyard's `logo-item.css` loads AFTER our subtheme CSS in the cascade (confirmed by inspecting `<link>` order in rendered HTML). Same-specificity declarations in logo-item.css win by source order.

**Top-down:** L5 correct. Override at `.logo-grid .logo-item` (0,2,0) to beat Dripyard's `.logo-item` (0,1,0).

**Critical finding:** `overflow: visible` is required because Canvas responsive images use `sizes="auto 100vw"` on `<img>` elements. With `overflow: clip` (Dripyard default), when the `.logo-item` container shrinks (due to removing padding), Chromium's auto-sizes resolver collapses to 0px and no srcset entry loads -- images render at 0x0. Confirmed by measurement: `naturalWidth: 0, naturalHeight: 0` with clip; `naturalWidth: 140` with visible.

### Change 3: .logo-item img presentation (grayscale, opacity, dimensions)

**Bottom-up trace:**
```
.logo-item img { width: auto; height: calc(var(--logo-grid-logo-size) - padding*2) }
  (logo-item.css:23-25, nested inside .logo-item{})
```
With --logo-grid-logo-size: 28px and padding: 0, this resolves to height: 28px. But Dripyard's rule loads after ours at same specificity (0,1,1).

**Top-down:** L5 correct. Override at `.logo-grid .logo-item img` (0,2,1) to beat Dripyard's `.logo-item img` (0,1,1).

**Explicit width required:** Set `width: 140px; height: 28px; object-fit: contain` instead of preview's `width: auto`. The preview uses simple `<img src>` without srcset; live uses Canvas responsive images with `sizes="auto 100vw"`. Without an explicit CSS width, the auto-sizes resolver has no layout width to work with and the srcset fails. The 140x28 box with `object-fit: contain` means each logo's content scales proportionally within the box -- visual difference from preview's variable-width images is minimal (each logo is centered within its 140px cell).

### Change 4: justify-content: space-between at desktop

**Bottom-up trace:**
```
.logo-grid__content { justify-content: start } (logo-grid.css:67)
.logo-grid--layout-center .logo-grid__content { justify-content: center } (logo-grid.css:72-73)
```
Our old media query used `.logo-grid__content` (0,1,0), defeated by Dripyard's `.logo-grid--layout-center .logo-grid__content` (0,2,0).

**Fix:** `.logo-grid .logo-grid__container .logo-grid__content` at (0,3,0) beats (0,2,0).

### Change 5: Mobile 3-rows-of-2 at xs (<576px)

Pre-fix at 375px: 5 rows (1+1+1+1+2) due to `.logo-item` being 204px wide (with 32px padding each side + 140px img), too wide for two per row in 331px container.

Post-fix: `.logo-grid .logo-item { flex: 0 1 calc(50% - 0.75rem); max-width: calc(50% - 0.75rem); }` ensures exactly 2 per row. Images set to `width: 100%; max-width: 100%` to scale within the cell.

## Deviations from spec

1. **Fixed 140x28 img box vs preview's variable-width images.** Preview uses `width: auto` so each logo has a different width (CBS: 145px, Tesla: 22px). Live must use explicit `width: 140px` because Canvas responsive images require a definite CSS layout width for `sizes="auto"` to resolve. The visual difference is that each logo is centered within a uniform 140px cell (via `object-fit: contain`) rather than having variable-width cells. This is an infrastructure constraint, not a design deviation.

2. **768 wrap pattern is 4+2, not 2x3.** Brief says "two rows of three" but the canonical preview also renders 4+2 at 768px. Since preview is canonical, 4+2 is the correct behavior. The 4+2 pattern occurs because 4 cells at 140px + 3 gaps at 32px = 656px < 693px container, while 5 cells would need 796px > 693px. This matches preview's behavior.

## Verification results (T1 + T2)

### T1 -- Headless (curl + grep)

```
$ ddev drush cr
 [success] Cache rebuild complete.

$ curl -sk .../themes/custom/performant_labs_20260502/css/components/logo-grid.css | grep -c 'grayscale(100%)'
4

$ curl -sk .../themes/custom/performant_labs_20260502/css/components/logo-grid.css | grep -c 'opacity: 0.7'
1

$ curl -sk .../themes/custom/performant_labs_20260502/css/components/logo-grid.css | grep -c 'max-height: 28px'
1

$ curl -sk .../themes/custom/performant_labs_20260502/css/components/logo-grid.css | grep -c 'justify-content: space-between'
4

$ curl -sk .../  | grep -oP 'alt="[^"]*logo[^"]*"'
alt="CBS Interactive logo"
alt="DocuSign logo"
alt="Orange logo"
alt="Renesas Electronics logo"
alt="Robert Half logo"
alt="Tesla logo"
```

All rules present in served CSS. All six logo images have descriptive alt text.

### T1 -- Playwright measurements (post-fix)

**1280px:**
- Content container: 1164x28, flexWrap: nowrap, justifyContent: space-between, gap: 32px
- Rows: 1, pattern: 6
- Each logo: 140x28, filter: grayscale(1), opacity: 0.7, objectFit: contain

**768px:**
- Content container: 693x88, flexWrap: wrap, justifyContent: center, gap: 32px
- Rows: 2, pattern: 4+2
- Each logo: 140x28, grayscale, opacity 0.7

**375px:**
- Content container: 331x132, flexWrap: wrap, justifyContent: space-between, gap: 24px
- Rows: 3, pattern: 2+2+2
- Each logo: 154x28 (fills 50% - 0.75rem cell), grayscale, opacity 0.7

### T2 -- Structural checks

**Heading hierarchy:** H2 (Main navigation) -> H1 (Ship Drupal...) -> H2 (Tools...) -> H3x3 -> H2 (We heal...) -> H2 (Built for...) -> H2 (FAQ) -> H2 (Ready for...) -> H2 (Footer) -> H3x3. No skipped levels. PASS.

**ARIA:** Logo images have descriptive `alt` attributes (company name + "logo"). No empty or generic alt values. PASS.

**Alt text quality:** Each alt follows the pattern "[Company Name] logo" -- descriptive and concise. None says "image" or is empty. PASS.

### Regression checks

| Check | Result | Detail |
|-------|--------|--------|
| 8.1: No "Book a testing review" pill | PASS | Not found in rendered header HTML |
| 8.1: Header height 73px | PASS | Measured 73px at 1280 |
| 8.1: Hamburger at <992 | PASS | `.mobile-nav-button` visible at 768 with text "Menu" |
| 8.2: Hero padding-inline: 0 | PASS | Computed paddingLeft: 0px, paddingRight: 0px |
| 8.2: Logo-grid nowrap at desktop | PASS | flexWrap: nowrap at 1280 |
| 8.2: Logo-grid wrap at tablet | PASS | flexWrap: wrap at 768 |
| 8.4: .grid-wrapper--3col-stack-md | PASS | Class found in rendered DOM |
| 8.5: Hero min-height auto/0 | PASS | Computed minHeight: 0px |
| 8.5: Hero-to-logo padding-top 48px | PASS | Computed paddingTop: 48px |

## WCAG contrast ratios

| Element | Foreground | Background | Ratio | Pass/Fail |
|---------|-----------|------------|-------|-----------|
| "Trusted by teams at" label | #5C544C (--theme-text-color-medium) | #FFFFFF | 7.43:1 | PASS (AA) |
| Logo images | N/A (decorative filter) | #FFFFFF | N/A | N/A -- grayscale + opacity are decorative treatment; alt text provides accessibility |

No backdrop changes were made. The grayscale filter and opacity are decorative treatments on company logos and do not affect text contrast. All logos have descriptive alt text for screen readers.

## Mobile responsive behavior

| What changes | Breakpoint | How verified |
|-------------|------------|-------------|
| 6 logos in 1 row (nowrap, space-between) | >= 992px | Playwright: 1 row x 6 at 1280, each 140x28 |
| Logos wrap to 2 rows (4+2, centered) | 577-991px | Playwright: 2 rows at 768, pattern 4+2, each 140x28 |
| Logos wrap to 3 rows of 2 (space-between) | <= 576px | Playwright: 3 rows at 375, pattern 2+2+2, each 154x28 |
| Logo images scale to cell width at xs | <= 576px | width: 100%, max-width: 100% in mobile media query |
| Touch targets | All viewports | Logo images at 28px height (not interactive links, just images -- no tap target concern) |

## Known issues

1. **Fixed 140px img width vs preview's variable widths.** This is a necessary accommodation for Canvas's `sizes="auto 100vw"` responsive image system. Without an explicit CSS width, the srcset resolver fails and images render at 0x0. The visual impact is uniform cell spacing instead of variable spacing. If pixel-perfect variable widths are required, the solution would be to either (a) modify the Canvas image template to remove `sizes="auto"` for logo-grid context, or (b) use Dripyard's media field with a non-responsive image style. Both require L4 Twig changes, which are out of scope for this CSS-only phase.

2. **768 wrap is 4+2, not 3+3.** This matches the preview's behavior at 768 but differs from the brief's "two rows of three" specification. The preview is canonical, so 4+2 is the accepted behavior. If 3+3 is desired, each `.logo-item` would need a `flex-basis: calc(33.33% - gap)` at the tablet breakpoint, forcing 3 per row -- but this would deviate from the preview.

## Files changed

- `web/themes/custom/performant_labs_20260502/css/components/logo-grid.css`
