# Handoff-T: Cycle 3 - Closing CTA Preview Fidelity

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-5-cycle-3-closing-cta`
**Issue:** `docs/pl2/handoffs/cycle-3-closing-cta-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-3-closing-cta-F.md`

---

## Tier 1 results

### T1-1: Cache clear

```
Command: ddev drush cr
Expected: [success] Cache rebuild complete.
Actual:   [success] Cache rebuild complete.
```

Result: PASS

### T1-2: HTTP 200 — /services

```
Command: curl -sk 'https://pl-performantlabs.com.3.ddev.site:8493/services' -o /dev/null -w '%{http_code}'
Expected: 200
Actual:   200
```

Result: PASS

### T1-3: HTTP 200 — / (homepage regression)

```
Command: curl -sk 'https://pl-performantlabs.com.3.ddev.site:8493/' -o /dev/null -w '%{http_code}'
Expected: 200
Actual:   200
```

Result: PASS

### T1-4: HTTP 200 — /about-us (regression)

```
Command: curl -sk 'https://pl-performantlabs.com.3.ddev.site:8493/about-us' -o /dev/null -w '%{http_code}'
Expected: 200
Actual:   200
```

Result: PASS

### T1-5: dy-section.css loaded on /services

```
Method: grep -c 'dy-section\.css' /tmp/services-page.html
Expected: >= 1
Actual:   1
```

Result: PASS

### T1-6: title-cta.css NOT loaded on /services

```
Method: grep -c 'title-cta\.css' /tmp/services-page.html
Expected: 0
Actual:   0
```

Result: PASS (correct — no title-cta SDC on /services after Cycle 3 restructure)

### T1-7: button.css loaded on /services

```
Method: grep -c 'button\.css' /tmp/services-page.html
Expected: >= 1
Actual:   3
```

Result: PASS

### T1-8: title-cta SDC not rendered on /services

```
Method: grep -c 'data-component-id="dripyard_base:title-cta"' /tmp/services-page.html
Expected: 0
Actual:   0
```

Result: PASS

### T1-9: Closing-CTA section present on /services (theme--dark)

```
Method: grep -c 'theme--dark' /tmp/services-page.html
Expected: 1
Actual:   1
```

Result: PASS

### T1-10: heading--centered class count on /services

```
Method: grep -c 'heading--centered' /tmp/services-page.html
Expected: >= 1
Actual:   2 (hero H1 + closing-CTA H2)
```

Result: PASS

### T1-11: No !important in dy-section.css or title-cta.css

```
Method: grep -n '!important' dy-section.css title-cta.css
Actual:  Only in comment text ("No !important.") — no live declarations
```

Result: PASS

### T1-12: Homepage title-cta.css loaded

```
Method: grep -c 'title-cta\.css' /tmp/homepage.html
Expected: >= 1
Actual:   2 (dripyard_base + performant_labs_20260502)
```

Result: PASS

### T1-13: Homepage title-cta SDC rendered

```
Method: grep -c 'data-component-id="dripyard_base:title-cta"' /tmp/homepage.html
Expected: 1
Actual:   1
```

Result: PASS

---

## Tier 2 results

### T2-1: Element order in DOM — closing-CTA section on /services

Verified via `sed -n '824,870p'` of fetched HTML.

Actual order in `.dy-section.theme--dark .dy-section__content`:
1. `<span class="kicker kicker--centered kicker--dark">Book a review</span>`
2. `<h2 class="heading h2 heading--centered ...">Not sure which shape fits?...</h2>`
3. `<div class="text ... body-m color--medium">` (body paragraph)
4. `<a class="button button--primary button--large" href="/contact-us?intent=testing-review">`
5. `<a class="button button--outline button--small button--ghost-on-dark" href="/open-source-projects">`

Expected: kicker → H2 → body text → primary button → ghost-on-dark button

Result: PASS

### T2-2: H2 centering — CSS rule + DOM class

CSS rule present in `dy-section.css` line 485:
```css
.dy-section.theme--dark .dy-section__content {
  text-align: center;
}
```

H2 in DOM has `heading--centered` class (added via Canvas `center: true` input).
Both the container-level `text-align: center` and the SDC `heading--centered` class center the H2.

Result: PASS

### T2-3: Both CTAs side-by-side at desktop (flex container)

CSS rule in `dy-section.css` lines 554-572 (inside `@media (min-width: 577px)`):
```
.dy-section.theme--dark .dy-section__content:has(> .button + .button) {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  column-gap: 0.75rem;
}
```

Both buttons are direct children of `.dy-section__content`. The `:has(> .button + .button)` selector activates and lays them side-by-side at >= 577px viewport.

Result: PASS

### T2-4: Mobile button stacking + heading mobile scale

Mobile rules in `dy-section.css` lines 573-590 (inside `@media (max-width: 576px)`):
- Buttons: `flex-direction: column; width: 100%; min-height: 44px`
- H2: `font-size: 2.25rem (36px); letter-spacing: -1.2px`

These match design brief `typography-mobile.display-lg = 36px / -1.2px` (brief line 125).

Result: PASS

### T2-5: Touch targets at mobile

Both buttons have `min-height: 44px` at `@media (max-width: 576px)` (dy-section.css lines 582, confirmed).
Desktop buttons have `min-height: 44px` at `@media (min-width: 577px)` (dy-section.css line 570).
Kicker is non-interactive. H2 is non-interactive.
WCAG 2.5.8 minimum = 44x44 CSS px — satisfied.

Result: PASS

### T2-6: Heading hierarchy — /services

Single H1: 1 (`<h1 class="heading h1 ...">Testing engagements for Drupal teams.</h1>`)
H2 count: 7 visible (+ 2 visually-hidden nav headings)
Chain: H1 → H2 (sections) → H3 (engagement cards, footer columns) — no skipped levels.

Result: PASS

### T2-7: ARIA landmarks — /services

- `<header class="theme--white site-header">` — present (line 164)
- `<nav id="block-performant-labs-20260502-main-menu" ...>` — present (line 243)
- `<main class="site-main">` — present (line 468)
- `<footer data-component-id="neonbyte:footer" ...>` — present (line 884)

Result: PASS

### T2-8: Semantic structure

- Lists: no `<ul>` or `<ol>` relevant to closing-CTA. Footer columns use standard `<ul><li>` (pre-existing).
- Buttons vs links: CTAs are `<a>` elements with `href` attributes — correct (not `<button>` without href).
- SVG icons in buttons: `aria-hidden="true"` present on all icon SVGs in closing-CTA buttons — correct (text label carries meaning).
- Toggles: none in closing-CTA.

Result: PASS

### T2-9: Homepage regression check — heading hierarchy

Single H1 on homepage: confirmed (line 479).
H2 chain: H1 → H2 (sections) → H3 (feature cards, footer) — no skipped levels.

Result: PASS

### T2-10: About-us regression check

Single H1: confirmed (line 522).
`theme--dark` section: confirmed present with buttons intact.
`button--ghost-on-dark` class: confirmed on second CTA.
`button--primary`: confirmed on first CTA.

Result: PASS (structural integrity maintained)

### T2-11: canvas component_version values — non-NULL

From `web/content-exports/b2613e35-516b-4d7c-86b8-75eb8a5d5356.yml`:

New heading component (uuid `482b5d03-...`): `component_version: 69804e3c5ff45a2b`
New ghost-on-dark button (uuid `c25a6886-...`): `component_version: 3155d0acceef4faf`

Both non-NULL, matching peer component versions as documented in Cycle 2 finding.
Page renders correctly at 200 with all components present — Canvas OutOfRangeException not triggered.

Result: PASS (documented deviation per issue AC)

### T2-12: File scope cap

Files changed (confirmed via `git status --short`):
1. `web/themes/custom/performant_labs_20260502/css/components/dy-section.css`
2. `web/themes/custom/performant_labs_20260502/css/components/title-cta.css`
3. Canvas entity (database change, exported to `web/content-exports/b2613e35-516b-4d7c-86b8-75eb8a5d5356.yml`)

Total: 3 files (2 CSS + 1 content export). Within the 6-file cap. One component family (section/closing-cta).

Result: PASS

---

## WCAG contrast verification

All hex values sourced from CSS files and design brief — not screenshots.
F's ratios cross-checked independently using WCAG luminance formula.

| Element | Foreground | Background | F's ratio | T's ratio | Pass/Fail |
|---|---|---|---|---|---|
| H2 cream on espresso | #F5EFE2 | #1F1A14 | 13.07:1 | 15.07:1 | PASS (AAA, large text >=3:1) [NOTE 1] |
| Body muted on espresso | #B8AFA0 | #1F1A14 | 7.39:1 | 7.96:1 | PASS (AA body >=4.5:1) [NOTE 2] |
| Kicker terracotta on espresso | #C97B5C 	| #1F1A14 | 4.47:1 | 5.32:1 | PASS (large text >=3:1) [NOTE 2] |
| Primary CTA white on teal | #FFFFFF | #62BBCB | 2.13:1 | 2.21:1 | PRE-EXISTING DEVIATION (operator-approved) |
| Ghost CTA cream text on espresso | #F5EFE2 | #1F1A14 | 15.07:1 | 15.07:1 | PASS (AAA) |
| Focus ring teal on espresso | #62BBCB | #1F1A14 | 7.80:1 | 7.80:1 | PASS (non-text >=3:1) |
| Ghost CTA border composited | #746F66 | #1F1A14 | 4.60:1 | 3.46:1 | PASS (non-text >=3:1) [NOTE 3] |

**NOTE 1:** F's table shows 13.07:1 for "H2 cream on espresso" and 15.07:1 for "Ghost CTA cream text on espresso" — both use the same #F5EFE2/#1F1A14 pair. T independently computes 15.07:1 for both. F appears to have swapped or rounded the ratio for the H2 row. The correct T-computed value is 15.07:1. This is a documentation discrepancy only — the actual ratio passes AAA and is unchanged from prior cycles.

**NOTE 2:** T computes slightly higher ratios than F for body muted (7.96 vs 7.39) and terracotta (5.32 vs 4.47). Both pass their thresholds by wide margins. The discrepancy may reflect F using a different contrast tool or intermediate rounding. No PASS/FAIL impact.

**NOTE 3:** T computes the rgba(245,239,226,0.4) composite on #1F1A14 as #746F66 (alpha 0.4 linear blend), giving 3.46:1. F reports ~#7E7568 and 4.60:1. T's calculation: R = round(0.4×245 + 0.6×31) = 116 = 0x74; G = round(0.4×239 + 0.6×26) = 111 = 0x6F; B = round(0.4×226 + 0.6×20) = 102 = 0x66 → #746F66 at 3.46:1. The threshold for non-text WCAG 1.4.11 is 3:1. T's value passes (3.46 > 3.0). F's higher reported value would also pass. No FAIL either way.

All color pairs pass their applicable WCAG thresholds. No new contrast pairs introduced.

---

## Mobile responsive verification

F reports no new responsive overrides written in this cycle.

Pre-existing responsive rules in `dy-section.css` handle:

| Override | Breakpoint | CSS rule confirmed | Touch target | Typography-mobile match |
|---|---|---|---|---|
| H2 mobile scale | `@media (max-width: 576px)` | `font-size: 2.25rem; letter-spacing: -1.2px` (dy-section.css line 587) | N/A (non-interactive) | PASS — brief display-lg mobile = 36px / -1.2px (brief line 125) |
| Button stacking | `@media (max-width: 576px)` | `flex-direction: column; width: 100%` (dy-section.css line 574-583) | `min-height: 44px` on each button | N/A |
| Desktop side-by-side | `@media (min-width: 577px)` | `flex-direction: row; justify-content: center` (dy-section.css line 555-571) | `min-height: 44px` on each button | N/A |

No new `@media` rules introduced. All pre-existing rules carry forward correctly.

---

## Acceptance criteria status

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | § closing-cta at /services matches preview at 1280×800 | PASS (T1/T2) | Element order, centering, CTA layout all confirmed in DOM |
| AC-2 | Element order: kicker → H2 → body → CTAs (C1) | PASS | DOM verified: lines 831→833→836→841→852 in served HTML |
| AC-3 | H2 centered within espresso panel (C2) | PASS | CSS `text-align: center` on container + `heading--centered` class on element |
| AC-4 | Both CTAs side-by-side at 1280, stack at 375 (C3) | PASS | `:has(> .button + .button)` flex-row at >=577px; column at <=576px |
| AC-5 | Mobile 375 unchanged from current MATCH (or improves) | PASS | Pre-existing button-stack rules retained; mobile H2 scale added (improvement) |
| AC-6 | No `!important` introduced | PASS | grep confirms zero live `!important` declarations in changed files |
| AC-7 | Tier 1 + Tier 2 PASS on /services | PASS | All T1 and T2 checks above pass |
| AC-8 | WCAG contrast unchanged or improved | PASS | All pairs pass applicable thresholds; no new pairs; cream vs pure-white on about-us is advisory only |
| AC-9 | `component_version` non-NULL constraint documented | PASS | F documented in Deviations section; rendered correctly confirmed |
| AC-10 | Files staged by explicit path | PASS (asserted) | git status shows only the 2 CSS files modified + content export; no unintended files |
| AC-11 | F scope cap respected (≤ 6 files; one component family) | PASS | 3 files total (2 CSS + 1 content export) |

---

## Blocking issues

None. All acceptance criteria pass. All T1 and T2 checks pass.

---

## Advisory notes

**ADV-1: Cross-page H2 color side effect on /about-us (non-blocking)**

The new rule `.dy-section.theme--dark .dy-section__content > .heading { color: var(--theme-text-color-primary) }` (dy-section.css, specificity 0,3,0) overrides the about-us closing-CTA H2's `color--loud` class (specificity 0,1,0). In the dark zone `--theme-text-color-primary` = `#F5EFE2` (cream) and `--theme-text-color-loud` = `#FFFFFF` (pure white). The about-us H2 previously rendered as white and will now render as cream.

This is not a WCAG failure (cream on espresso = 15.07:1, white on espresso = 17.29:1, both AAA), and cream is actually the design-brief-specified color for closing-CTA headings. However, it is an undocumented behavioral change to /about-us. S should be aware for visual diff.

**ADV-2: About-us body text max-width change on /about-us (non-blocking)**

Same scope extension: the new rule `.dy-section.theme--dark .dy-section__content .text { max-width: 640px }` also applies to the about-us closing-CTA body text. Previously the old `title-cta.css` capped it at 800px. The about-us body text in the dark section is now capped at 640px. No contrast impact. S's visual diff will capture whether this creates a layout difference worth addressing.

**ADV-3: F contrast table documentation discrepancy (non-blocking)**

F's handoff reports 13.07:1 for "H2 cream on espresso" and 15.07:1 for "Ghost CTA cream text on espresso" — both are the same color pair (#F5EFE2 on #1F1A14). T computes 15.07:1 for both. F appears to have transposed or miscopied the ratio in the H2 row. The inline comment in dy-section.css also states 13.07:1 for this pair. This is a documentation error only; the rendered contrast exceeds all thresholds by a wide margin. No code change needed, but the comment in dy-section.css at line 506 reads "cream #F5EFE2 on espresso #1F1A14 = 13.07:1" which is inaccurate. S should note when reviewing.

---

T complete, no blocking issues. Ready for S.
