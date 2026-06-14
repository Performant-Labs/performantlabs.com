# Handoff-F: Phase 8.7 - Primary brand color + global section padding

**Date:** 2026-05-11
**Branch:** `aa/pl-homepage-phase-8.7-color-spacing`
**Issue:** `docs/pl2/handoffs/phase-8.7-color-spacing-issue.md`

## What was done

- `web/themes/custom/performant_labs_20260502/css/base.css` -- Item A: added three-color primary palette tokens (`--pl-primary`, `--pl-primary-light`, `--pl-primary-deep`) to `:root`; rewired `--theme-link-color` in white/light/secondary zones from `#0F6F8A` to `var(--pl-primary)` (#1893b4); rewired `--theme-link-color-hover` to `var(--pl-primary-deep)` (#005AA0); rewired `--theme-focus-ring-color` to `var(--pl-primary)`. Item B: added `--spacing-component` and `--spacing-component-internal` overrides at `:root` (mobile-first 64px/48px) and `@media (width > 700px)` (96px/48px), replacing Dripyard's 120px/80px desktop defaults. Removed now-redundant `--spacing-component: var(--sp8)` from the `@media (max-width: 576px)` block.
- `web/themes/custom/performant_labs_20260502/css/components/button.css` -- Item A: rewired `.button--primary` resting bg from `var(--theme-link-color)` to `var(--pl-primary-light)` (#62BBCB); hover bg from `var(--theme-link-color-hover)` to `var(--pl-primary)` (#1893b4). Dark/black zone overrides updated to use `var(--theme-link-color)` (#5DC6E8) for dark-zone CTAs. Primary zone override unchanged.
- `docs/pl2/Briefs/pl_design_brief.md` -- Item A: added `primary-deep: "#005AA0"` token to YAML front matter; updated "Brand teal" prose to document three-token palette; added "Documented WCAG deviations" subsection after "Semantic" with two pre-approved failures.
- `docs/pl2/css-change-log.md` -- appended three entries for Phase 8.7 (two Item A, one Item B).

## Layer decisions

### Item A -- Three-color primary palette

**Trace (bottom-up, Pass 1):**
```
Property:       background-color on .button--primary (CTA pill)
Current value:  #0F6F8A (computed via var(--theme-link-color))
Declared by:    button.css .button--primary { --button-background-color: var(--theme-link-color) }
Comes from:     base.css html .theme--white { --theme-link-color: #0F6F8A } (Layer 3)
```

**DOM inspection gate:** N/A -- change is Layer 3 (--theme-* token override) + Layer 5 (button component).

**Trace (top-down, Pass 2):**
```
L1: base_primary_color is config. Changing it would regenerate OKLCH palette
    unpredictably. RULED OUT.
L2: OKLCH-derived shades. Not directly settable. RULED OUT.
L3: --theme-link-color in html .theme--white/light/secondary. YES -- deliberate
    brand palette adoption. Correct for inline links, focus rings, kicker accents.
L5: .button--primary needs separate rewire because CTA resting bg is --primary-light
    (#62BBCB), NOT the inline-link color (#1893b4). L5 correct for CTA bg.
```

**Approved layers:**
- Layer 3 (base.css): `--theme-link-color`, `--theme-link-color-hover`, `--theme-focus-ring-color` in white/light/secondary zones.
- Layer 5 (button.css): `--button-background-color` and `--button-background-color-hover` on `.button--primary`.

### Item B -- Global section-padding tightening

**Trace (bottom-up, Pass 1):**
```
Property:       padding-top / padding-bottom on .dy-section with .padding-top--l
Current value:  120px at >700px (via var(--spacing-component) = var(--spacing-xxxl) = calc(15 * var(--sp)))
Declared by:    layout-utilities.css .padding-top--l { padding-top: var(--spacing-component) }
Comes from:     variables-layout.css @media (width > 700px) { --spacing-component: var(--spacing-xxxl) }
```

**DOM inspection gate:** N/A -- change is Layer 3 (:root token override).

**Trace (top-down, Pass 2):**
```
L1: --spacing-component is not in Drupal config. RULED OUT.
L2: Not OKLCH-derived. RULED OUT.
L3: :root override of --spacing-component and --spacing-component-internal. YES.
    Global change is intended (operator-confirmed trigger-3 escalation).
    Affects all pages using the theme.

Target values:
  Desktop (>700px): --spacing-component: calc(12 * var(--sp)) = 96px (was 120px)
  Desktop (>700px): --spacing-component-internal: var(--sp6) = 48px (was 80px)
  Mobile (<=700px): --spacing-component: var(--sp8) = 64px (was 80px)
  Mobile (<=700px): --spacing-component-internal: var(--sp6) = 48px (was 64px)
```

**Approved layer:** Layer 3 (base.css :root + @media).

## Deviations from spec

### Item B: Height targets not met within +/-200px tolerance

The issue targets were:
- 1280: <=4541 px. Actual: 4754 px (+213 over target).
- 768: <=5029 px. Actual: 5742 px (+713 over target).
- 375: <=6366 px. Actual: 7149 px (+783 over target).

**Root cause:** The section-padding tokens are now correctly set to match the preview's values (96px desktop, 64px mobile). The remaining height delta is NOT from section padding but from structural differences between Dripyard's rendered HTML and the preview's static HTML:

1. **`--space-for-fixed-header: 160px`** -- Neonbyte injects 160px of dead space above `<main>` to accommodate the sticky header. This adds 87px of visible gap between the header bottom (73px) and the hero top (160px). The preview has no such offset. (+87px at all viewports)

2. **Dripyard section headers** -- Each dy-section has a `.dy-section__header` block (kicker + h2) with a `margin-bottom: 48px` gap to content. The preview's sections embed their headings differently, often with less structural overhead. The features section on live is 780px vs 506px on the preview, a +274px delta driven by card rendering height and header structure.

3. **Footer padding** -- Neonbyte's footer uses `padding-block: var(--spacing-component)` = 96+96=192px. The preview footer uses 64+32=96px. (+96px)

4. **Card component rendering** -- Dripyard's card SDC renders at 422px per card vs the preview's 314px per card (at 1280), a +108px delta from different internal padding and content structure.

These are all structural/component-level differences that cannot be resolved by a single spacing token change. Reducing `--spacing-component` further would over-compress the content sections. The section padding now matches the preview's `--space-section: 96px` exactly.

**Height savings achieved:**
- Before: 5266 / 6254 / 7261 (at 1280 / 768 / 375)
- After: 4754 / 5742 / 7149
- Saved: 512 / 512 / 112 px

The savings at 1280 and 768 come from: 5 sections * 2 * (120-96) = 240px from `--spacing-component`, plus logo bar 2 * (80-48) = 64px, plus section headers 5 * (80-48) = 160px from `--spacing-component-internal`, plus other cascading effects = ~512px total.

The 375px viewport shows less savings (112px) because the mobile `--spacing-component` went from 80px to 64px (a smaller delta) and the preview itself uses 96px section padding at 375px for some sections while using 64px for others (hero, cream, closing-cta). The Dripyard utility classes apply the same `--spacing-component` token to all `--l` sections uniformly, unlike the preview's per-section variation.

**Recommendation to operator:** The remaining delta is structural. To close the gap further would require:
- Footer-specific padding override (L5, saves ~96px)
- Card height reduction (L5, saves ~108px at 1280 only)
- Disabling `--space-for-fixed-header` (risky -- affects sticky header behavior)
These are scope-expansion items beyond "single shared section-padding token."

## Verification results (T1 + T2)

### T1 -- Headless (curl + grep + Playwright)

**Item A: Primary palette tokens in served CSS:**
```
base.css --pl-primary: #1893b4 .............. PRESENT
base.css --pl-primary-light: #62BBCB ........ PRESENT
base.css --pl-primary-deep: #005AA0 ......... PRESENT
base.css --theme-link-color: var(--pl-primary) (3x: white/light/secondary) .. PRESENT
base.css --theme-link-color-hover: var(--pl-primary-deep) (3x) .............. PRESENT
base.css --theme-focus-ring-color: var(--pl-primary) (3x) ................... PRESENT
button.css --button-background-color: var(--pl-primary-light) ............... PRESENT
button.css --button-background-color-hover: var(--pl-primary) ............... PRESENT
```

**Item A: Computed values on live page (Playwright):**
```
.dy-section.theme--white: --theme-link-color = #1893b4 .............. CORRECT
.dy-section.theme--light: --theme-link-color = #1893b4 .............. CORRECT
.theme--dark: --theme-link-color = #5DC6E8 .......................... UNCHANGED
.hero .button--primary: backgroundColor = rgb(98,187,203) = #62bbcb . CORRECT
.button--secondary: color = rgb(0,90,160) = #005AA0 ................. CORRECT
```

**Item B: Spacing tokens in served CSS:**
```
base.css --spacing-component: var(--sp8) [mobile-first] ............. PRESENT
base.css --spacing-component-internal: var(--sp6) [mobile-first] .... PRESENT
base.css @media (width > 700px) --spacing-component: calc(12 * var(--sp)) .. PRESENT
base.css @media (width > 700px) --spacing-component-internal: var(--sp6) ... PRESENT
```

**Item B: Computed section padding (Playwright, 1280):**
```
Section 0 (logo bar, padding-top--m): pT=48px pB=48px .............. CORRECT
Section 1 (features, padding-top--l):  pT=96px pB=96px .............. CORRECT
Section 2 (heal-flow, padding-top--l): pT=96px pB=96px .............. CORRECT
Section 3 (built-for, padding-top--l): pT=96px pB=96px .............. CORRECT
Section 4 (FAQ, padding-top--l):       pT=96px pB=96px .............. CORRECT
Section 5 (CTA, padding-top--l):       pT=96px pB=96px .............. CORRECT
```

**Item B: Body scroll heights (Playwright):**
```
1280: 4754px (target <=4541, delta +213 -- see Deviations)
768:  5742px (target <=5029, delta +713 -- see Deviations)
375:  7149px (target <=6366, delta +783 -- see Deviations)
```

### T2 -- Structural checks

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
  H3: Services / Resources / Company
```
Single H1, no skipped levels. PASS.

**ARIA landmarks:** 7 landmark elements present (header, nav, main, footer, etc.). PASS.

**Regression checks (8.1--8.6):**
```
8.1 Header: exists, no CTA pill .......... PASS
8.2 No horizontal overflow ............... PASS
8.3 Logo grid present .................... PASS
8.4 Feature cards (3) .................... PASS
8.5 Hero intrinsic height (min-height: 0) . PASS
8.6 Accordion +/- indicator .............. PASS
```

**Cross-page spot-checks (1280, post-tightening):**
```
/open-source-projects: 4515px -- OK, no visual breakage
/how-we-do-it:        5382px -- OK, no visual breakage
/contact-us:          3391px -- OK, no visual breakage
/services:            4589px -- OK, no visual breakage
/about-us:            4508px -- OK, no visual breakage
/articles:            2866px -- OK, no visual breakage
```
No negative content heights, no zero-height sections, no overlapping content on any page.

## WCAG contrast ratios

| Element | Foreground | Background | Ratio | Threshold | Pass/Fail |
|---|---|---|---|---|---|
| Primary CTA resting (white/light) | #62BBCB | #FFFFFF | 2.21:1 | 3.0:1 (large) | **FAIL** (pre-approved) |
| Primary CTA hover | #1893b4 | #FFFFFF | 3.58:1 | 3.0:1 (large) | PASS |
| Inline link on white | #1893b4 | #FFFFFF | 3.58:1 | 4.5:1 (body) | **FAIL** (pre-approved) |
| Inline link on cream | #1893b4 | #F5EFE2 | 3.12:1 | 4.5:1 (body) | **FAIL** (pre-approved) |
| Inline link on warm | #1893b4 | #F2EFED | 3.12:1 | 4.5:1 (body) | **FAIL** (pre-approved) |
| Link hover on white | #005AA0 | #FFFFFF | 7.07:1 | 4.5:1 | PASS |
| Link hover on cream | #005AA0 | #F5EFE2 | 6.17:1 | 4.5:1 | PASS |
| Link hover on warm | #005AA0 | #F2EFED | 6.18:1 | 4.5:1 | PASS |
| Focus ring on white | #1893b4 | #FFFFFF | 3.58:1 | 3.0:1 (non-text) | PASS |
| Focus ring on cream | #1893b4 | #F5EFE2 | 3.12:1 | 3.0:1 (non-text) | PASS |
| Sec button resting on white | #005AA0 | #FFFFFF | 7.07:1 | 4.5:1 | PASS |
| Sec button hover on white | #003D6F | #FFFFFF | 11.07:1 | 4.5:1 | PASS |
| Dark zone link on espresso | #5DC6E8 | #1F1A14 | 8.81:1 | 4.5:1 | PASS |
| Dark zone link hover | #7AD0E8 | #1F1A14 | 9.88:1 | 4.5:1 | PASS |
| Dark zone CTA bg + text | #5DC6E8 bg + #1F1A14 text | -- | 8.81:1 | 4.5:1 | PASS |
| Card hover border on white | #1893b4 | #FFFFFF | 3.58:1 | 3.0:1 (non-text) | PASS |

### Pre-approved WCAG deviations (operator decision 2026-05-11)

1. **Primary CTA pill**: `#62BBCB` bg + `#FFFFFF` text = **2.21:1** -- fails AA at all thresholds. The issue stated 2.13:1; the 0.08 difference is from rounding in the issue. Accepted as intentional brand deviation.

2. **Inline link text**: `#1893b4` on `#FFFFFF` = **3.58:1** -- fails body-text AA (4.5:1), passes large-text AA (3.0:1). The issue stated 3.5:1. On cream `#F5EFE2` the ratio drops to **3.12:1** and on warm `#F2EFED` to **3.12:1** -- both still pass large-text AA (3.0:1) but fail body-text AA. These cream/warm failures are the same fundamental deviation as the white failure, applied to the same `--theme-link-color` token across all light-surface zones.

### Additional WCAG findings (not pre-approved)

**No new third or fourth contrast failure found.** All non-CTA, non-inline-link pairings pass their applicable thresholds. The secondary button, focus rings, dark-zone links, and hover states all meet or exceed AA. The cream/warm inline-link failures (3.12:1) are extensions of the pre-approved inline-link deviation, not new failures -- they flow from the same `--theme-link-color: var(--pl-primary)` token applied to zones with slightly darker surfaces.

## Mobile responsive behavior

N/A -- no responsive overrides added in this phase. The spacing token changes apply at the `:root` level and are consumed by existing responsive breakpoints in `variables-layout.css` and our `@media (width > 700px)` block. The `@media (max-width: 576px)` typography block in base.css was updated to remove the now-redundant `--spacing-component: var(--sp8)` line (it's now set as the mobile-first default at `:root`).

## Known issues

1. **Height targets not met.** Homepage body heights exceed the +/-200px tolerance at all three viewports. Section padding tokens match the preview exactly (96px desktop, 64px mobile, 48px internal). The remaining delta is structural (sticky header offset, Dripyard component rendering overhead, footer padding). See "Deviations from spec" for full analysis. Operator decision needed on whether to pursue component-level fixes or accept the structural delta.

2. **`<html>` element inherits neonbyte OKLCH values.** The `html .theme--white` selector correctly overrides descendant `.theme--white` elements (dy-sections, hero) but does NOT match `<html class="theme--white">` itself (since `<html>` is not a descendant of `<html>`). This means `<html>` retains neonbyte's OKLCH-derived `--theme-link-color`. In practice this has no visible effect because all rendered content lives inside descendant `.theme--*` elements that DO match our overrides. This is an existing architectural fact, not a regression.

## Files changed

1. `web/themes/custom/performant_labs_20260502/css/base.css` -- L3 token overrides (primary palette + spacing)
2. `web/themes/custom/performant_labs_20260502/css/components/button.css` -- L5 CTA button rewire
3. `docs/pl2/Briefs/pl_design_brief.md` -- YAML primary-deep token + WCAG deviations subsection
4. `docs/pl2/css-change-log.md` -- three new entries
5. `docs/pl2/handoffs/phase-8.7-color-spacing-F.md` -- this handoff
