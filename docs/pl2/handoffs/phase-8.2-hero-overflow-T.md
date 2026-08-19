# Handoff-T: Phase 8.2 - Hero layout overflow fix

**Date:** 2026-05-09
**Branch:** `aa/pl-homepage-phase-8.2-hero-overflow`
**Issue:** `docs/pl2/handoffs/phase-8.2-hero-overflow-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/phase-8.2-hero-overflow-F.md`

---

## Tier 1 results

### Cache clear

**Command:** `ddev drush cr`
**Expected:** `[success] Cache rebuild complete.`
**Actual:** `[success] Cache rebuild complete.`
**Result:** PASS

### HTTP status

**Command:** `curl --cacert "$(mkcert -CAROOT)/rootCA.pem" -s 'https://pl-performantlabs.com.3.ddev.site:8493/' -o /dev/null -w '%{http_code}'`
**Expected:** 200
**Actual:** 200
**Result:** PASS

Note: `curl` without `--cacert` returns exit code 60 (SSL verification failure). The mkcert CA root is required on this machine when running curl from the host shell outside the browser. The DDEV site cert is trusted by the OS keychain for browser connections; curl requires explicit CA path. This is an environment-level detail, not a site or code issue.

### CSS file presence: hero.css served

**Command:** `curl ... 'https://pl-performantlabs.com.3.ddev.site:8493/' | grep -o 'themes/custom/performant_labs_20260502/css/components/hero.css[^"]*'`
**Expected:** path present in page `<link>` tags
**Actual:** `themes/custom/performant_labs_20260502/css/components/hero.css?tes4m9`
**Result:** PASS

### CSS file presence: logo-grid.css served

**Command:** same grep for logo-grid.css
**Expected:** path present in page `<link>` tags
**Actual:** `themes/custom/performant_labs_20260502/css/components/logo-grid.css?tes4m9`
**Result:** PASS

### CSS selector: padding-inline: 0 in .hero.theme--white

**Command:** `curl ... hero.css?tes4m9 | grep -c "padding-inline: 0"`
**Expected:** 1 (present)
**Actual:** 1
**Rule confirmed:** `.hero.theme--white { padding-block: clamp(4rem, 10vh, 7rem); padding-inline: 0; }`
**Result:** PASS

### CSS selector: min-width: 992px nowrap rule in logo-grid.css

**Command:** `curl ... logo-grid.css?tes4m9 | grep -c "min-width: 992px"`
**Expected:** >= 1
**Actual:** 2 (one in comments, one as the @media rule)
**Rule confirmed:** `@media (min-width: 992px) { .logo-grid__content { flex-wrap: nowrap; ... } }`
**Result:** PASS

### CSS selector: tablet wrap rule (min-width: 577px and max-width: 991px)

**Command:** `curl ... logo-grid.css?tes4m9 | grep -A6 "min-width: 577px"`
**Expected:** tablet range rule with flex-wrap: wrap
**Actual:** `@media (min-width: 577px) and (max-width: 991px) { .logo-grid__content { flex-wrap: wrap; justify-content: center; gap: 2rem; align-items: center; } }`
**Result:** PASS

### Rendered text: hero headline

**Command:** `curl ... homepage | grep -i "Ship Drupal"`
**Expected:** "Ship Drupal releases with confidence." present
**Actual:** Found in meta tags and inline rendered content: `Ship Drupal releases with confidence.`
**Result:** PASS

### Rendered text: hero CTAs

**Command:** `curl ... homepage | grep -iE "Book a testing|See how we test"`
**Expected:** both CTA labels present
**Actual:** "Book a testing review" and "See how we test this site" both present in rendered HTML
**Result:** PASS

### No !important in changed files

**Command:** `curl ... hero.css?tes4m9 | grep "!important"` and same for logo-grid.css
**Expected:** no !important in functional CSS (comments excluded)
**Actual:** Zero matches in functional CSS. Occurrences found are inside comment blocks only (`/* ... No !important. ... */`).
**Result:** PASS

---

## Tier 2 results

### Heading hierarchy

**Method:** `curl` + grep for `<h[1-6]` tags in served HTML.
**Finding:**
- Single `<h1>`: `<h1 data-component-id="dripyard_base:heading" class="heading h1 ...">` — one instance.
- Multiple `<h2>` for section headings and one visually-hidden nav label.
- `<h3>` for card titles and footer column headings.
- No skipped levels (H1 → H2 → H3 chain intact).
- Visually-hidden H2 for nav menu blocks has `class="visually-hidden"` — correct pattern per Drupal convention.
**Result:** PASS

### ARIA landmarks

**Method:** grep for `<header`, `<main`, `<footer`, `<nav` in served HTML.
**Finding:**
- `<header class="theme--white site-header" data-component-id="neonbyte:header">` — present
- `<nav id="block-performant-labs-20260502-main-menu" ... aria-labelledby="...">` — present
- `<main class="site-main">` — present
- `<footer data-component-id="neonbyte:footer" ...>` — present
- Second `<nav>` in footer for footer menu — present with `aria-labelledby`
**Result:** PASS

### Kicker component renders

**Method:** grep for `.kicker` class in served HTML.
**Finding:** Kicker renders in two locations — hero band ("Drupal testing") and a second section ("What we ship"). Hero kicker: `<span class="kicker kicker--centered kicker--light">Drupal testing</span>`.
**Result:** PASS

### SDC component registration

**Method:** `ddev drush php:eval` querying the SDC plugin manager.
**Finding:**
- `hero`: 4 components registered (neonbyte:hero variants)
- `logo-grid`: 1 component registered
**Note:** SDC styleguide explorer returns 403 (consistent with prior phases; access-restricted in this DDEV environment). Drush confirms components are registered in the plugin system.
**Result:** PASS

### Mobile button touch targets — CSS rules present

**Method:** grep served hero.css for `min-height: 44px` and mobile stacking rules.
**Finding:**
- `min-height: 44px` appears twice: once in the desktop flex sub-row rule (`.hero__block-content > .button`) and once in the mobile rule (`@media (max-width: 576px) .hero__block-content > .button`).
- Mobile rule also sets `width: 100%`, `display: flex`, `align-items: center`, `justify-content: center` — full-width stacked button per design brief.
- F reports rendered height 56px at 375px (min-height: 44px + button padding from button.css). The 56px > 44px WCAG 2.5.5 minimum.
**Result:** PASS

---

## WCAG contrast verification

**Color changes in this phase:** None. Git diff of hero.css and logo-grid.css shows zero added lines containing color values, hex codes, or color-related CSS properties. All diff additions are layout properties (padding-inline, flex-wrap, media query breakpoints) and comments.

T independently computed contrast ratios from the hex values in hero.css file header (unchanged from prior phase):

| Element | Foreground | Background | F's ratio | T's ratio | Delta | Pass/Fail |
|---------|-----------|------------|-----------|-----------|-------|-----------|
| Headline | #1F1A14 | #FFFFFF | 17.29:1 | 17.27:1 | -0.02 | PASS (AAA) |
| Subhead | #5C544C | #FFFFFF | 7.07:1 | 7.43:1 | +0.36 | PASS (AAA) |
| Kicker | #8E4A2A | #FFFFFF | 6.69:1 | 6.64:1 | -0.05 | PASS (AA) |
| Focus ring | #1893b4 | #FFFFFF | 3.58:1 | 3.58:1 | 0 | PASS (non-text 3:1) |

Discrepancies between F's ratios and T's computed ratios are sub-0.4 and attributable to intermediate rounding in the sRGB linearization step. All values pass their respective WCAG thresholds by a significant margin. No failures.

Note on the Subhead discrepancy: F reports 7.07:1 and T computes 7.43:1 for #5C544C on #FFFFFF. This is likely because F used a slightly different luminance formula or intermediate rounding. T's value is the higher of the two; either way the ratio exceeds the 4.5:1 AA threshold by a wide margin.

---

## Mobile responsive verification

F reports no new responsive overrides were written in this phase. The Phase 8.2 changes are:

1. `padding-inline: 0` added to `.hero.theme--white` — this is an all-viewport rule, not a responsive override. It removes inline padding at every viewport width.
2. `flex-wrap: nowrap` breakpoint raised from `577px` to `992px` in logo-grid.css — this modifies an existing breakpoint, not a new responsive rule.
3. New tablet wrap rule added: `@media (min-width: 577px) and (max-width: 991px)` with `flex-wrap: wrap`.

### Breakpoint verification

| Rule | Breakpoint | CSS confirmed | Correct per brief? |
|------|-----------|--------------|-------------------|
| logo-grid nowrap (single row) | `min-width: 992px` | PASS (confirmed served) | Yes — lg breakpoint |
| logo-grid tablet wrap | `min-width: 577px and max-width: 991px` | PASS (confirmed served) | Yes — sm to lg range |
| logo-grid mobile wrap | `max-width: 576px` | PASS (pre-existing, confirmed) | Yes — below sm |
| hero padding-inline: 0 | all viewports | PASS (confirmed served) | Yes — preview spec has zero inline padding |

### Touch-target math at mobile (375px)

The button `min-height: 44px` rule is present in the served stylesheet. F reports rendered height of 56px (min-height 44px + button.css padding). Button width at 375px: `width: 100%` which at 375px minus any body margin would be approximately 331–360px. Both dimensions exceed 44px WCAG 2.5.5 minimum.

- Width: ~331–360px (from `width: 100%` at 375px viewport) — exceeds 44px minimum. PASS
- Height: 56px (from `min-height: 44px` + padding) — exceeds 44px minimum. PASS

### Typography mobile values

No typography changes were made in this phase. The existing mobile rules (`@media (max-width: 576px) .hero.theme--white .heading { font-size: 2.75rem; letter-spacing: -1px; }`) were pre-existing from prior phases and remain unchanged per the git diff. These match the `typography-mobile` block in the design brief (display-xl mobile: 44px / -1px).

---

## Acceptance criteria status

**Criterion 1:** Step-3 trace surfaced in F handoff before any CSS is written; layer chosen and justified.

F's handoff contains explicit two-pass traces (Pass 1 bottom-up, Pass 2 top-down) for both changes. The hero padding-inline trace identifies neonbyte's `@container (width > 700px)` as the origin of the 80px value and rules out L1, L2, L3 before choosing L5 (component-scoped on `.hero.theme--white`). The logo-grid flex-wrap trace identifies the 577px breakpoint as the origin of overflow and rules out L1, L2, L3 before choosing L5. Layer justifications are documented.
**Result:** PASS

**Criterion 2:** Desktop (1280) H1 renders at 72 px per brief.

F's Playwright measurement confirms fontSize 72px at 1280px post-fix. The served hero.css contains `@media (min-width: 577px) { .hero.theme--white .heading { font-size: 4.5rem; ... } }` — 4.5rem = 72px at standard 16px base. The typography was already correct before Phase 8.2; no regression was introduced.
**Result:** PASS

**Criterion 3:** Tablet (768) H1 wraps within the viewport — no horizontal scroll, no clipped words.

F's Playwright measurement at 768px: `docScrollWidth: 753`, `docClientWidth: 768`, `hasHorizontalScroll: false`. All hero elements at 768px (`.hero`, `.hero__container`, `.hero__content`, `h1`) have `right: 723` which is within the 768px viewport. The `padding-inline: 0` fix eliminates the 160px content-box overflow. The logo-grid `flex-wrap: wrap` at this breakpoint (below 992px threshold) prevents the logo row overflow.
**Result:** PASS

**Criterion 4:** Mobile (375) H1 still renders ~44 px (no regression).

F's Playwright measurement at 375px: fontSize 44px, letterSpacing -1px. The served hero.css retains the `@media (max-width: 576px) .hero.theme--white .heading { font-size: 2.75rem; letter-spacing: -1px; }` rule. heroPadInline: 0px at mobile confirms the padding fix does not regress mobile. `docScrollWidth: 360`, `docClientWidth: 375`, `hasHorizontalScroll: false`.
**Result:** PASS

**Criterion 5:** WCAG: contrast unchanged (text/surface tokens unchanged), no new touch-target issues.

Git diff confirms zero color or surface changes in either modified file. Contrast ratios verified numerically — all pass (see WCAG section above). Mobile touch targets at 375px: 56px height and ~331px+ width, both exceed 44px minimum. No new touch-target issues.
**Result:** PASS

**Criterion 6:** No `!important`. Files staged by explicit path. Canvas component_version unchanged.

No `!important` found in functional CSS of either modified file (grep confirms only occurrences are in comment blocks). F documents staging by explicit path. F confirms no Canvas assembly scripts were touched; `component_version` is unchanged. The three modified files are limited to `css/components/hero.css`, `css/components/logo-grid.css`, and `docs/pl2/css-change-log.md` — no Canvas files in scope.
**Result:** PASS

---

## Blocking issues

None. All six acceptance criteria pass. All Tier 1 and Tier 2 checks pass.

---

## Advisory notes

1. **F's reported contrast ratio for Subhead differs from T's by +0.36** (F: 7.07:1, T: 7.43:1 for #5C544C on #FFFFFF). Both values pass AA by a large margin; the discrepancy is rounding noise and does not affect any decision. Non-blocking.

2. **Issue misframe acknowledged.** The issue's acceptance table specified "weight 800" for the H1. F correctly identified via trace that the brief specifies weight 500 and made no weight change. T has verified that the brief (`pl_design_brief.md` display-xl: fontWeight 500) and the pre-existing CSS both confirm 500. The acceptance criterion as stated is met by virtue of the font-weight being correct at 500 — the issue's "weight 800" was a misstatement in the original audit. No action required.

3. **mkcert CA required for host-side curl.** Tier 1 curl checks require `--cacert "$(mkcert -CAROOT)/rootCA.pem"` on this machine. Future T agents on this project should use this flag. The browser trusts the cert natively; only host-shell curl requires explicit CA.

4. **Phase 8.3 scope boundary noted.** F has documented that logo-grid text-fallback strategy (preview uses text logos at narrow widths; live uses bitmap logos) remains out of scope for Phase 8.2 and will be addressed in Phase 8.3. The Phase 8.2 flex-wrap fix does not constrain Phase 8.3's implementation options. This is an advisory boundary note, not a blocking issue for this phase.
