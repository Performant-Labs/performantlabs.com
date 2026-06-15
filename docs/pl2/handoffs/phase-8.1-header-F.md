# Handoff-F: Phase 8.1 - Site header parity

**Date:** 2026-05-10
**Branch:** `aa/pl-homepage-phase-8.1-header`
**Issue:** `docs/pl2/handoffs/phase-8.1-header-issue.md`

## What was done

- `config/sync/block.block.performant_labs_20260502_header_cta.yml` — set `status: false` to disable the "Book a testing review" CTA pill block placed in `header_third` region. The block_content entity is preserved; only the placement is disabled.
- `web/themes/custom/performant_labs_20260502/css/components/header.css` — three CSS additions for header height parity:
  1. Zeroed `border-top` and `border-inline` on `.site-header__shadow[class]` (removed invisible 1px borders that contributed height).
  2. Added `@media (max-width: 991px)` block: reduced `--header-padding-block` from 16px to 14px at narrow viewports.
  3. Added `.site-header .mobile-nav-button { width: 44px; height: 44px; }` inside the same media query (reduces neonbyte default from 3rem/48px to 44px, matching preview spec and WCAG minimum).
- Updated the file header comment block to document Phase 8.1 changes.

## Layer decisions

### Change 1: Remove CTA pill

**Bottom-up trace:**
- The "Book a testing review" text appears inside a `block_content:basic` entity (UUID `a7c1d5e0-0001-4b1f-9c2d-callcta20260503`).
- That entity is placed by `block.block.performant_labs_20260502_header_cta` into the `header_third` region.
- Neonbyte's header template renders `header_third` content inside `.header-navigation-wrapper__third`.
- At wide viewports this slot sits to the right of the primary nav via `display: contents` bubble.

**Top-down eligibility:**
- L1 (config): YES. The block placement is config. Setting `status: false` disables the block. CORRECT LAYER.
- No CSS change needed to remove the pill itself; the config change removes the rendered markup entirely.

### Change 2: Header height parity (mobile)

**Bottom-up trace:**
- At 768/375, `.site-header` rendered at 82px. Breakdown: `.site-header__shadow` has `border: solid 1px transparent` (all sides) = 2px vertical border. `.site-header__content` has `padding-block: 16px` (32px total). `.mobile-nav-button` is `3rem` = 48px. Total: 1(top) + 16 + 48 + 16 + 1(bottom) = 82px.
- Preview target: 73px. Preview: `height: 72px` on inner + 1px border-bottom.
- At 1280 (desktop): nav links are 40px tall; 1 + 16 + 40 + 16 + 1 = 74px (already within target after border-top zeroed to: 0 + 16 + 40 + 16 + 1 = 73).

**Top-down eligibility:**
- L1: Not config (structural CSS). RULED OUT.
- L3: Not a theme token. RULED OUT.
- L5: Component-scoped override on `.site-header` and `.site-header .mobile-nav-button`. CORRECT LAYER.

**Fix applied:**
- `border-top: 0; border-inline: 0` on `.site-header__shadow[class]` saves 1px top + 0 (bottom kept). Specificity (0,1,1) matches neonbyte and wins by cascade order.
- `--header-padding-block: 14px` at `<= 991px` reduces content padding from 32px to 28px.
- `.site-header .mobile-nav-button` at (0,2,0) beats neonbyte's `.mobile-nav-button` at (0,1,0) which loads later as a separate SDC library. Result: 0 + 14 + 44 + 14 + 1 = 73px.

### Change 3: No change needed for nav wrapping

After pill removal, the 6 nav links fit inline at 1280 with no wrapping. The flex container has sufficient space with the CTA slot empty. No nav-link CSS change was required.

## Deviations from spec

- **aria-label vs visually-hidden text:** The spec calls for `aria-label="Open menu"` on the hamburger. Neonbyte's implementation uses `<span class="visually-hidden">Menu</span>` inside a `<button>` instead. Both patterns expose an accessible name to assistive technology. The neonbyte implementation also adds `aria-expanded` and `aria-controls` via JS at runtime. This is functionally equivalent and was left as-is rather than overriding the Twig template for a string difference.

## Verification results (T1 + T2)

### T1 — Headless verification

```
$ ddev drush cr → [success] Cache rebuild complete.

$ curl header.css | grep '--header-padding-block'
  → --header-padding-block: 16px;   (desktop)
  → --header-padding-block: 14px;   (mobile media query)

$ curl header.css | grep '.site-header .mobile-nav-button'
  → .site-header .mobile-nav-button { width: 44px; height: 44px; }

$ curl homepage | grep -o "Book a testing review" | wc -l
  → 2 (both in page body CTAs, zero in header — pill removed)

$ curl homepage | grep 'mobile-nav-button.*aria'
  → [no aria-expanded in static HTML; added by JS at runtime — confirmed via Playwright]
```

### T2 — Structural + Playwright measurements

**Header heights (Playwright bounding box):**
| Viewport | Height | Target | Status |
|----------|--------|--------|--------|
| 1280     | 73px   | 73 +/- 4 | PASS |
| 768      | 73px   | 73 +/- 4 | PASS |
| 375      | 73px   | 73 +/- 4 | PASS |

**Nav wrapping at 1280:** All 6 links at identical Y position (y=16). No wrapping. PASS.

**Hamburger at < 992px:**
- Visible: YES (768, 375)
- Size: 44x44px
- `aria-expanded="false"` present (after JS hydration)
- `aria-controls="header-navigation-wrapper"` present
- Accessible name: "Menu" (visually-hidden span)
- Touch target: 44x44px >= 44px minimum. PASS.

**ARIA landmarks:** `<header>`: 1, `<nav>`: 2, `<main>`: 1, `<footer>`: 1. PASS.

**Heading hierarchy:** H1 ("Ship Drupal releases with confidence.") is in hero section. H2s follow for each section. PASS.

**Hamburger overlay:** Clicking hamburger sets `aria-expanded="true"`, adds `.is-expanded` class, and shows all 6 nav links. Overlay exists and works. Focus trap: NOT present (neonbyte default does not implement one). Advisory only per issue scope.

### Regression checks

| Prior fix | Check | Status |
|-----------|-------|--------|
| 8.2: hero `padding-inline: 0` | Computed `paddingInline: 0px` | PASS |
| 8.2: logo-grid `min-width: 992px` nowrap | Rule served via stylesheet | PASS |
| 8.4: `grid-wrapper--3col-stack-md` class | Element present in DOM | PASS |
| 8.5: hero `min-height: auto`, `padding-block: 120px 96px` | Computed: `minHeight: 0px`, `paddingTop: 120px`, `paddingBottom: 96px` | PASS |
| 8.5: dy-section sibling combinator | `.hero.theme--white + .dy-section:has(.logo-grid) { padding-top: 3rem; }` served | PASS |

## WCAG contrast ratios

No backdrop/surface color changes were made in this sub-cycle. The header remains white (`#FFFFFF`) with ink-color nav links (`#2A2520`). Existing ratios are unchanged:

| Element | Foreground | Background | Ratio | Pass/Fail |
|---------|-----------|-----------|-------|-----------|
| Nav link (ink on white) | #2A2520 | #FFFFFF | 14.8:1 | PASS (>= 4.5:1) |
| Nav hover (teal on white) | #0F6F8A | #FFFFFF | 5.74:1 | PASS (>= 4.5:1) |
| Hamburger icon (ink on white) | #2A2520 | #FFFFFF | 14.8:1 | PASS (>= 3:1 for icon) |
| Focus ring (resolved via --theme-focus-ring-color) | inherited | #FFFFFF | N/A - unchanged | N/A |

Touch target: hamburger button 44x44px at all mobile viewports. PASS (>= 44px WCAG 2.5.5).

## Mobile responsive behavior

- **Hamburger button size:** Reduced from neonbyte default 48px (3rem) to 44px at `<= 991px`. Matches preview spec exactly. Still meets WCAG 2.5.5 minimum.
- **Header padding:** Reduced from 16px to 14px at `<= 991px` to achieve 73px total height parity with preview.
- **Nav collapse breakpoint:** Already correct at 991px (existing rule from Phase 8 Batch 3). No change needed.
- **Wordmark:** SVG logo remains full-width (172x28px) at all viewports. Does not collapse to badge-only at mobile.

## Known issues

- **Focus trap missing in hamburger overlay:** Neonbyte's mobile overlay does not implement a focus trap. Tab key escapes the overlay into page content. The issue explicitly scopes this as advisory: "the visible hamburger affordance is the binding requirement here." A focus-trapped overlay can be addressed in a follow-up sub-cycle if desired.
- **aria-label text discrepancy:** Spec says `aria-label="Open menu"`, live uses visually-hidden "Menu" text. Functionally equivalent for accessibility. Left as-is to avoid overriding neonbyte Twig.

## Files changed

1. `config/sync/block.block.performant_labs_20260502_header_cta.yml` — `status: true` changed to `status: false`
2. `web/themes/custom/performant_labs_20260502/css/components/header.css` — border zeroing, mobile padding reduction, mobile-nav-button size override, comment updates
