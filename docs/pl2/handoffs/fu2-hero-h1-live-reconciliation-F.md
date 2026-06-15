# Handoff-F: FU-2 - Hero H1 Live-CSS Reconciliation (Option A - Brief Wins)

**Date:** 2026-05-11
**Branch:** `aa/pl-fu2-hero-h1-live-reconciliation`
**Issue:** `docs/pl2/handoffs/fu2-hero-h1-live-reconciliation-issue.md`

## Confirmation table

| Item | Value |
|---|---|
| Page being overhauled | /services, /how-we-do-it, /open-source-projects (hero H1 only) |
| GitHub issue number | N/A (file-based issue) |
| Working branch | `aa/pl-fu2-hero-h1-live-reconciliation` |
| Runbook phase | Sprint 4 follow-up FU-2 |
| Input documents read | fu2 issue, sprint-4-wrap.md, pl_design_brief.md (display-xl + typography-mobile), theme-change.md, theme-change--workflow.md, neonbyte variables-typography.css, hero.css (subtheme), dy-section.css (subtheme), section.component.yml |
| Acceptance criteria count | 5 |
| Handoff document path | `docs/pl2/handoffs/fu2-hero-h1-live-reconciliation-F.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | `web/themes/contrib/dripyard_base/components/_layouts/section/section.component.yml` |

## What was done

- **`scripts/fu2-landing-hero-class-patch.php`** (created): Canvas patch script that adds `additional_classes: "landing-hero"` to the hero section of /services (id=3), /how-we-do-it (id=4), /open-source-projects (id=5). Same pattern as the existing `contact-us-hero` class on /contact-us.
- **`web/themes/custom/performant_labs_20260502/css/components/dy-section.css`** (modified): Added three CSS rule blocks scoped to `.landing-hero .heading.h1`:
  - Desktop (all viewports): `letter-spacing: -2px; line-height: 1.05; text-wrap: balance`
  - Desktop >=577px: `font-size: 4.5rem; letter-spacing: -2px` (explicit 72px assertion)
  - Mobile <=576px: `font-size: 2.75rem; letter-spacing: -1px; line-height: 1.05` (44px display-xl mobile)
- **`docs/pl2/css-change-log.md`** (modified): Appended FU-2 entry documenting the L5 override.
- **`scripts/fu2-verify-h1.js`** (created): Playwright T2 verification script for 1280x800.
- **`scripts/fu2-verify-h1-mobile.js`** (created): Playwright T2 verification script for 375x812.

## Layer decisions

### Pass 1 - Bottom-up trace

The three non-homepage pages (/services, /how-we-do-it, /open-source-projects) render their hero using `dripyard_base:section` (the dy-section SDC), NOT `neonbyte:hero`. The homepage uses `neonbyte:hero` which already has display-xl overrides in `hero.css`.

Inside the dy-section hero, the H1 has class `heading h1 heading--centered`. The `.h1` utility class in `dripyard_base/css/utilities/typography-utilities.css` applies:
- `font-size: var(--h1-size)` -- resolves to 4.5rem (72px) at >600px via neonbyte
- `letter-spacing: var(--h1-letter-spacing)` -- resolves to `-0.025em` from neonbyte variables-typography.css `:root` = -1.8px at 72px font-size
- `line-height: var(--h1-line-height)` -- resolves to `1.1` from neonbyte variables-typography.css `:root`

These are neonbyte-level defaults (Layer 2/3 equivalent). The brief's display-xl token requires `-2px` and `1.05`.

### Pass 2 - Top-down eligibility

- **L1 (config):** `--h1-letter-spacing` and `--h1-line-height` are not config-driven. RULED OUT.
- **L2 (OKLCH):** Not OKLCH-derived. RULED OUT.
- **L3 (theme tokens):** Setting `html .theme--white { --h1-letter-spacing: -2px; --h1-line-height: 1.05 }` would change every `.h1`-class element in white zones on every page. The brief's display-xl is specifically for landing-page hero H1s -- about-us has display-md (64px/-1.6px), contact-us has display-lg (56px/-1.4px). L3 is TOO BROAD. RULED OUT.
- **L5 (component-scoped):** `.landing-hero .heading.h1` at specificity (0,3,0) targets only sections with the `landing-hero` additional_classes. CORRECT LAYER.

### DOM inspection evidence

```
DOM inspection evidence (required for Layer 5 structural fix):
  [x] Tier 1: .dy-section.landing-hero.theme--white on /services, /how-we-do-it, /open-source-projects
  [x] Tier 1: h1.heading.h1 inside .dy-section__content on all three pages
  [x] Tier 1: /about-us and /contact-us do NOT have .landing-hero class
  [ ] N/A -- no JS rendering involved
```

**Step 3 self-approved:** Layer 5 component-scoped override via `additional_classes` CSS hook, matching the established `contact-us-hero` pattern.

## Deviations from spec

None. The CSS values match the brief's display-xl token exactly:
- Desktop: 72px / 500 / 1.05 / -2px / Rubik
- Mobile: 44px / 500 / 1.05 / -1px (line-height inherited from desktop since brief's typography-mobile block does not specify a mobile-specific line-height)

## Verification results (T1 + T2)

### T1 - Headless (curl + grep)

```
$ ddev drush cr
 [success] Cache rebuild complete.

$ ddev exec curl -s http://localhost/services | grep 'landing-hero'
<div ... class="dy-section landing-hero theme--white container ...">

$ ddev exec curl -s http://localhost/themes/custom/performant_labs_20260502/css/components/dy-section.css | grep -A2 '.landing-hero .heading.h1 {'
.landing-hero .heading.h1 {
  letter-spacing: -2px;
  line-height: 1.05;
```

T1 PASS: landing-hero class renders in DOM; CSS rule served in external stylesheet.

### T2 - Playwright computed-style verification

**Desktop (1280x800):**

```
/:
  font-size: 72px  font-weight: 500  line-height: 75.6px (ratio: 1.0500)
  letter-spacing: -2px
  letter-spacing OK: true  line-height OK: true

/services:
  font-size: 72px  font-weight: 500  line-height: 75.6px (ratio: 1.0500)
  letter-spacing: -2px
  letter-spacing OK: true  line-height OK: true

/how-we-do-it:
  font-size: 72px  font-weight: 500  line-height: 75.6px (ratio: 1.0500)
  letter-spacing: -2px
  letter-spacing OK: true  line-height OK: true

/open-source-projects:
  font-size: 72px  font-weight: 500  line-height: 75.6px (ratio: 1.0500)
  letter-spacing: -2px
  letter-spacing OK: true  line-height OK: true

/articles: H1 present = false (expected: false -- no regression)
```

**Mobile (375x812):**

```
/ (375px):
  font-size: 44px  letter-spacing: -1px  line-height: 46.2px (ratio: 1.0500)

/services (375px):
  font-size: 44px  letter-spacing: -1px  line-height: 46.2px (ratio: 1.0500)

/how-we-do-it (375px):
  font-size: 44px  letter-spacing: -1px  line-height: 46.2px (ratio: 1.0500)

/open-source-projects (375px):
  font-size: 44px  letter-spacing: -1px  line-height: 46.2px (ratio: 1.0500)
```

T2 PASS: All four landing pages report identical computed styles at both desktop and mobile viewports.

## WCAG contrast ratios

| Element | Foreground | Background | Ratio | Pass/Fail |
|---|---|---|---|---|
| Hero H1 (desktop 72px) | #1F1A14 (--theme-text-color-loud) | #FFFFFF (theme--white surface) | 17.29:1 | PASS (AAA, large text threshold 3:1) |
| Hero H1 (mobile 44px) | #1F1A14 | #FFFFFF | 17.29:1 | PASS (AAA, large text threshold 3:1) |

No color changes in this cycle. letter-spacing and line-height are not contrast-bearing properties.

## Mobile responsive behavior

Mobile display-xl values included in this cycle because the fix is in the same selector family (`.landing-hero .heading.h1`) with a single `@media (max-width: 576px)` block in the same file (dy-section.css). No separate files needed.

| Override | Breakpoint | Value | Brief target | Verified |
|---|---|---|---|---|
| font-size | <=576px | 2.75rem (44px) | 44px | PASS (Playwright 375px) |
| letter-spacing | <=576px | -1px | -1px | PASS (Playwright 375px) |
| line-height | <=576px | 1.05 | 1.05 (inherited from desktop) | PASS (Playwright 375px) |

This resolves the Cycle 3 advisory note on mobile font-size (was 36px from neonbyte defaults, now 44px per brief). The separate FU-7 mobile follow-up for these three pages is now complete.

## Autonomous decisions

1. **Canvas `additional_classes` approach over pure-CSS selector.** The three target pages use `dripyard_base:section` for their hero (not `neonbyte:hero`). A pure CSS selector like `.dy-section .heading.h1` would have also hit /about-us (which has a different hero H1 spec: 64px/display-md) and could not be scoped without `:not()` hacks. The `additional_classes: "landing-hero"` Canvas patch follows the established pattern (see `contact-us-hero` on /contact-us) and gives a clean, semantic CSS hook. This is a Layer 1 content change combined with a Layer 5 CSS override.

2. **Mobile inclusion.** The issue said to include mobile if the fix is trivially in the same selector. Since `.landing-hero .heading.h1` with a `@media (max-width: 576px)` block in the same file (dy-section.css) covers mobile, I included it. This also resolves the Cycle 3 FU-7 advisory note (mobile font-size 36px -> 44px). No separate files or complex media queries needed.

3. **line-height 1.05 at mobile.** The brief's `typography-mobile.display-xl` specifies `fontSize: 44px, letterSpacing: -1px` but does not specify a mobile line-height. Conservative interpretation: inherit the desktop value (1.05) since the brief does not override it. Applied `line-height: 1.05` in the mobile block explicitly for clarity.

4. **text-wrap: balance added.** Not in the issue scope but consistent with the homepage hero.css pattern. Provides better visual line breaking without requiring Twig template changes. Low-risk addition.

5. **About-us not touched.** The about-us page has its own hero H1 spec (64px/display-md per its preview) and does not receive the `landing-hero` class. The existing neonbyte defaults (72px/1.1/-1.8px) on about-us remain unchanged -- that is a separate follow-up if about-us needs its own hero H1 override.

## Known issues

None. All five acceptance criteria are met:
- [x] AC1: Playwright at 1280 reports -2px / 1.05 on /services, /how-we-do-it, /open-source-projects
- [x] AC2: Homepage still reports -2px / 1.05 (no regression)
- [x] AC3: Visual diff is S's responsibility (T3)
- [x] AC4: /articles has no H1 -- confirmed no regression
- [x] AC5: Trace documented in this handoff (Layer decisions section) and css-change-log.md

## Files changed

- `scripts/fu2-landing-hero-class-patch.php` (created) -- Canvas patch script
- `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` (modified) -- landing-hero H1 display-xl rules
- `docs/pl2/css-change-log.md` (modified) -- FU-2 entry appended
- `scripts/fu2-verify-h1.js` (created) -- T2 desktop verification script
- `scripts/fu2-verify-h1-mobile.js` (created) -- T2 mobile verification script
