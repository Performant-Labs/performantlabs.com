# Handoff-F: Phase 8.6 - Polish rework (nav-cluster horizontal alignment)

**Date:** 2026-05-11
**Branch:** `aa/pl-homepage-phase-8.6-polish`
**Issue:** `docs/pl2/handoffs/phase-8.6-polish-rework-issue.md`

## What was done

- `web/themes/custom/performant_labs_20260502/css/components/header.css` -- four CSS fixes in the `@media (width > 1000px)` block, plus two token adjustments on `.site-header`, to align the nav-cluster horizontal position and width with the canonical preview at 1280px.

Specific rules added/changed:

1. `.site-header .primary-menu__link--level-1[class]` at (0,3,0): sets font-size: 15px, font-family: Poppins, padding: 0, color: var(--theme-text-color-primary). Beats neonbyte's `.primary-menu__link--level-1[class]` at (0,2,0) regardless of load order.

2. `.site-header .primary-menu__list--level-1` at (0,2,0): sets gap: 32px. Matches preview's `--space-xl`.

3. `.site-header .header-navigation-wrapper__third:not(:has(*))` at (0,2,0): sets display: none. Removes the empty CTA slot from flex layout so space-between produces a two-child layout (logo + nav) matching preview.

4. `.site-header { --header-padding-inline: 14px; --header-padding-block: 22px; }` inside `@media (width > 1000px)`: Inline padding reduced from 20px to 14px to close the residual container-width delta (neonbyte shadow 1178px vs preview 1200px). Block padding increased from 16px to 22px to restore 73px header height after zeroing nav-link padding (22 + 28 logo + 22 = 72px content + 1px border = 73px).

5. Removed the prior standalone `.primary-menu__link--level-1 { font-family: ... }` rule at (0,1,0) -- consolidated into the new (0,3,0) rule above.

6. Updated file header comments: corrected specificity documentation (attribute selector [class] = (0,1,0), same as class selector; .X[class] = (0,2,0) not (0,1,1)), documented four-part root cause.

## Layer decisions

### Item 6 rework: Nav-cluster horizontal alignment at 1280

**Status: IMPLEMENTED**

Pass 1 (bottom-up): Playwright measurement at 1280 revealed four contributing root causes:

(a) **Font-size 16px instead of 15px.** Our prior token override `--top-level-link-font-size: 15px` on `.primary-menu` at (0,1,0) was overridden by neonbyte's `primary-menu-wide.theme.css` which loads AFTER our `header.css` (link position 65 vs 59) and re-declares the same token at the same specificity. The `[class]` attribute selector in `.primary-menu__link--level-1[class]` gives specificity (0,2,0) -- attribute selectors count as (0,1,0), same as class selectors. Our `.site-header .primary-menu__link--level-1` at (0,2,0) was EQUAL to neonbyte's (0,2,0), with neonbyte winning by later load order. Confirmed by injecting a `<style>` tag with the identical rule (which loads after all `<link>` tags): the 15px value took effect.

(b) **Link padding 8px 16px.** Neonbyte's `primary-menu-wide.css` sets `padding: var(--padding-y) var(--padding-x)` on `.primary-menu__link` at (0,1,0). Each link gets 32px horizontal padding, adding 192px total across 6 links. Preview uses zero padding with gap: 32px on the parent.

(c) **Container-width delta.** Neonbyte's `.site-header__shadow` uses `width: min(92cqw, 1440px)` = 1178px at 1280. Preview's `.container` uses `max-width: 1200px` = 1200px. Delta = 22px. With `--header-padding-inline` at 20px on live vs 24px on preview, the right content edge delta was ~15px. Reducing to 14px brings the nav right edge delta to ~9px.

(d) **Third flex child.** The `.header-navigation-wrapper__third` (empty CTA slot, disabled via block config) still renders in the DOM as a third flex child of `.site-header__content`. With `justify-content: space-between`, three children means the nav sits in the middle, not at the right edge. Preview has only two children (brand + nav).

Pass 2 (top-down):
- L1: not config (CSS layout/typography). RULED OUT.
- L2: not OKLCH-derived. RULED OUT.
- L3: not a theme token override. RULED OUT.
- L5: correct. All overrides scoped to `.site-header` or descendants. The `--header-padding-inline` and `--header-padding-block` overrides are on `.site-header` inside `@media (width > 1000px)` -- header-scoped, does not affect body containers or other pages' layout grids.

Layer: L5, `css/components/header.css`.

### Cross-page consideration

The `--header-padding-inline: 14px` and `--header-padding-block: 22px` overrides apply to the header on ALL pages at wide viewports. This is a deliberate trade-off: the header container width is a cross-page neonbyte structural feature (`min(92cqw, 1440px)`) that cannot be changed without affecting all pages. The padding adjustment is the least-invasive way to close the 22px container-width delta. No changes were made to `.container`, `--container-width`, or `.site-header__shadow`'s `max-width` -- those are shared infrastructure.

The `.header-navigation-wrapper__third:not(:has(*))` rule uses `:not(:has(*))` to ensure it only hides the slot when it has no element children. If the CTA block is re-enabled, children will appear and the rule will stop matching automatically.

## Deviations from spec

None. The nav-cluster position and width match the acceptance criteria.

## Verification results (T1 + T2)

### Pre-fix measurements (Playwright, getBoundingClientRect at 1280)

|               | Live (pre-fix) | Preview    | Delta   |
|---------------|---------------|------------|---------|
| Nav left edge | 325 px        | 535 px     | 210 px  |
| Nav right edge| 1072 px       | 1216 px    | 144 px  |
| Nav width     | 748 px        | 681 px     | 67 px   |
| Font-size     | 16px          | 15px       | 1px     |
| Link padding  | 8px 16px      | 0px        | 16px/side |
| List gap      | 0px           | 32px       | 32px    |

### Post-fix measurements (Playwright, getBoundingClientRect at 1280)

|               | Live (post-fix) | Preview    | Delta   | Pass? |
|---------------|----------------|------------|---------|-------|
| Nav left edge | 526.3 px       | 535.0 px   | 8.7 px  | PASS  |
| Nav right edge| 1207.3 px      | 1216.0 px  | 8.7 px  | PASS  |
| Nav width     | 681.0 px       | 681.0 px   | 0.0 px  | PASS  |
| Header height | 73 px          | 73 px      | 0 px    | PASS  |
| Font-size     | 15px           | 15px       | 0       | PASS  |
| Link padding  | 0px            | 0px        | 0       | PASS  |
| List gap      | 32px           | 32px       | 0       | PASS  |

The 8.7px residual delta on both edges is symmetric and stems entirely from the container-width difference (neonbyte shadow 1178px at `min(92cqw, 1440px)` vs preview 1200px flat container). Both edges are within the 10px acceptance threshold.

### T1: CSS served correctly
- `curl` confirms `header.css` loaded at link position 59.
- `.site-header .primary-menu__link--level-1[class]` selector present.
- `font-size: 15px`, `padding: 0`, `gap: 32px`, `display: none`, `--header-padding-inline: 14px`, `--header-padding-block: 22px` all confirmed in served CSS.
- Accordion `display: none` on SVG confirmed (item 2 regression).
- Hamburger `border: 1px solid var(--theme-border-color); border-radius: 8px` confirmed (item 5 regression).

### T1: Items 1-5 regression
- Item 1 (footer casing): "Testing-suite takeover", "Embedded testing engineer", "Autonomous healing pilot", "Accessibility testing" -- all sentence case. PASS.
- Item 2 (accordion glyph): `.accordion-item__summary svg { display: none }` and `::after { content: "+" }` confirmed. PASS.
- Item 3 (CTA no arrow): "Book a testing review" with no arrow glyph. PASS.
- Item 4 (checklist periods): all four items end with periods. PASS.
- Item 5 (hamburger border): `border: 1px solid rgb(229, 225, 220)`, `border-radius: 8px`, 44x44px at 768. PASS.

### T2: Structural checks
- **Heading hierarchy:** H1 ("Ship Drupal releases with confidence."), H2s for each section, H3s for cards and footer columns. No skipped levels. PASS.
- **ARIA landmarks:** `role="group"` on accordion, `role="img"` with aria-label on heal-flow SVG, `aria-labelledby` on nav regions. All intact. PASS.
- **Header height consistency:** 73px at 1280, 768, 375. PASS.

### Phases 8.1-8.5 regression
- 8.1 header: header.css loaded, 73px at all viewports. PASS.
- 8.2 hero: hero.css loaded, no overflow at 768. PASS.
- 8.3 logo grid: logo-grid.css loaded, 6 logos. PASS.
- 8.4 card grid: card.css loaded, 3 cards. PASS.
- 8.5 hero spacing: dy-section.css loaded, min-height: 0px (auto). PASS.
- All 16 custom theme CSS files loaded on homepage. PASS.

## WCAG contrast ratios

| Element | Foreground | Background | Ratio | Pass/Fail |
|---------|-----------|------------|-------|-----------|
| Nav links (resting) | #2A2520 (--theme-text-color-primary) | #FFFFFF | 14.68:1 | PASS (AAA) |
| Nav links (hover) | #0F6F8A (--theme-link-color) | #FFFFFF | 5.74:1 | PASS (AA) |
| Active-trail link | #0F6F8A (--theme-link-color) | #FFFFFF | 5.74:1 | PASS (AA) |

No backdrop changes in this rework. All text-on-surface pairs retained from prior phases.

## Mobile responsive behavior

N/A -- no responsive overrides in this rework. The nav-cluster alignment fix applies only at `@media (width > 1000px)`. At narrow viewports (<= 1000px), the inline nav is hidden by `display: none` and the mobile-nav-button takes over. The `--header-padding-block: 14px` at `@media (max-width: 991px)` is unchanged. Header height confirmed at 73px at 768 and 375.

## Known issues

None. All three acceptance criteria met:
- Nav-cluster right edge within 10px: delta = 8.7px. PASS.
- Nav-cluster left edge within 10px: delta = 8.7px. PASS.
- Nav-cluster width within 10px: delta = 0.0px (exact match). PASS.

No regressions on items 1-5 or phases 8.1-8.5.

## Files changed

1. `web/themes/custom/performant_labs_20260502/css/components/header.css` -- nav-cluster alignment fix: (0,3,0) font-size/padding/color override, gap on menu list, empty CTA slot hidden, header token adjustments for padding-inline and padding-block at wide viewport.
