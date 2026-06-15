# Handoff-T: Sprint 12 Cycle 2 — About-us bio re-nest inside §C + hairline above (R9 restore)

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-12-cycle-2-about-us-bio-renest`
**Issue:** `docs/pl2/handoffs/cycle-2-about-us-bio-renest-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2-about-us-bio-renest-F.md`

---

## Tier 1 results

### T1-0 — Cache rebuild

```
$ ddev drush cr
 [success] Cache rebuild complete.
```

**Expected:** success. **Actual:** success. **PASS**

---

### T1-0b — Active theme verification

```
$ ddev drush cget system.theme default
'system.theme:default': performant_labs_20260502
```

**Expected:** `performant_labs_20260502`. **Actual:** `performant_labs_20260502`. **PASS**

---

### T1-0c — HTTP status: /about-us

```
$ ddev exec curl -s http://localhost/about-us -o /dev/null -w '%{http_code}'
200
```

**Expected:** 200. **Actual:** 200. **PASS**

---

### T1-1 — Marker removed: `dy-section--bio-block` count = 0

```
$ ddev exec curl -s http://localhost/about-us | grep -c 'dy-section--bio-block'
0
```

**Expected:** 0. **Actual:** 0. **PASS**

---

### T1-2 — Bio heading present: "Who we are." renders exactly once

```
$ ddev exec curl -s http://localhost/about-us | grep -c 'Who we are'
1
```

**Expected:** 1. **Actual:** 1. **PASS**

---

### T1-3 — Replacement marker: `dy-section--centered-white` count = 2

```
$ ddev exec curl -s http://localhost/about-us | grep -c 'dy-section--centered-white'
2
```

**Expected:** 2 (§A hero + §C Open source). **Actual:** 2. **PASS**

Note: §A hero carries both `dy-section--cta-pair` and `dy-section--centered-white` as expected.

---

### T1-4 — Section count: 5 `dripyard_base:section` component-start comments

```
$ ddev exec curl -s http://localhost/about-us | grep -c 'Component start: dripyard_base:section'
5
```

**Expected:** 5 (Hero, Track record, Open source, Dogfood, Closing CTA). **Actual:** 5. **PASS**

Confirmed section labels in rendered HTML:
- §A: kicker "About" + h1 "Drupal testing, done by the people who wrote the tools."
- §B: kicker "Track record" + h2 "On drupal.org since 2006."
- §C: kicker "Open source" + h2 "The tools we wrote." + 3-up grid + h3 "Who we are."
- §D: kicker "Dogfood" + h2 "We test what we ship."
- §E: kicker "Get started" + h2 "Want to talk testing?"

---

### T1-5 — CSS asset served: rewritten selectors present

```
$ ddev exec curl -s 'http://localhost/themes/custom/performant_labs_20260502/css/components/dy-section.css' | grep -n 'centered-white.*grid-wrapper\|grid-wrapper.*centered-white'
162:.dy-section.dy-section--centered-white:not(:has(.grid-wrapper)) .dy-section__content {
717:.dy-section--centered-white .dy-section__content > .grid-wrapper + .heading.h3 {
725:.dy-section--centered-white .dy-section__content > .grid-wrapper + .heading.h3 + .text {
```

**Expected:** selectors at lines 717 and 725 matching F's rewrite. **Actual:** both present at correct lines. No remaining `dy-section--bio-block` active selector:

```
$ ddev exec curl -s 'http://localhost/themes/custom/performant_labs_20260502/css/components/dy-section.css' | grep -n 'bio-block'
710: * Sprint 10 Cycle 2b.1: selector originally .dy-section--bio-block.
711: * Sprint 12 Cycle 2: dy-section--bio-block marker removed from §C per R9
```

Only comment references remain; zero active `dy-section--bio-block` selectors in served CSS. **PASS**

---

### T1-6 — Sibling pages: /services and /open-source-projects

```
$ ddev exec curl -s -o /dev/null -w '%{http_code}' http://localhost/services
200

$ ddev exec curl -s -o /dev/null -w '%{http_code}' http://localhost/open-source-projects
200

$ ddev exec curl -s http://localhost/services | grep -c 'dy-section--bio-block'
0

$ ddev exec curl -s http://localhost/open-source-projects | grep -c 'dy-section--bio-block'
0
```

**Expected:** both 200, both 0 bio-block occurrences. **Actual:** both 200, both 0. **PASS**

---

### T1-7 — Drupal error log: no new Cycle 2 errors from /about-us

```
$ ddev drush watchdog:show --count=20 --severity=3
```

Two errors from today (12/May) are present in the log:

- wid 5086 (12/May 10:07) — `AssertionError` in `ComponentTreeItemList.php`. Location: `/services`. Not from /about-us; pre-existing Canvas module assertion issue on /services triggered by an anonymous browse.
- wid 5084 (12/May 07:23) — `LogicException: additional_classes prop is not defined`. Location: `/` (homepage). Component UUID `82f14b06-e93a-4c27-9b58-3d7e2a14f6cb` is on the homepage, not on /about-us. Pre-existing Canvas schema validation issue unrelated to Cycle 2.

All errors pre-date or are unrelated to the Cycle 2 canvas_page 17 patch. The /about-us component uuid patched is `c155cd5d-a6b7-43e4-25f6-06172839415a`, confirmed different from the erroring component. Both sibling pages return 200 in T1-6 above. **PASS** (no new Cycle 2 errors from /about-us)

---

### T1-8 — Active theme verified

See T1-0b above. **PASS**

---

### T1-9 — Idempotency replay

```
$ ddev drush php:script /var/www/html/scripts/sprint12-cycle2-about-us-bio-renest.php

Pre-patch verification passed.
  [11] sdc.dripyard_base.section  uuid=c155cd5d-a6b7-43e4-25f6-06172839415a
  component_version: e6079b189d228dad
  Current additional_classes: 'dy-section--centered-white'
  Current theme: white

SKIP: 'dy-section--bio-block' not found in additional_classes. Already patched.
No changes made.
```

**Expected:** "SKIP: already patched" with zero changes. **Actual:** exactly that output. **PASS**

---

## Tier 2 results

### T2-1 — Heading hierarchy

Extracted from rendered HTML:

| Level | Count | Elements |
|---|---|---|
| h1 | 1 | "Drupal testing, done by the people who wrote the tools." |
| h2 | 5 visible + 3 visually-hidden | Nav label (VH), Breadcrumb (VH), "On drupal.org since 2006.", "The tools we wrote.", "We test what we ship.", "Want to talk testing?", Footer nav (VH) |
| h3 | 6 | card__title × 3 (ATK, Testor, Other tools), "Who we are." (bio), footer-column__heading × 2 |
| h4–h6 | 0 | None present |

Single h1: confirmed. No skipped levels (h1 → h2 → h3; no h4+). **PASS**

---

### T2-2 — DOM placement: bio h3 inside §C, not standalone

Rendered HTML lines 579–660 inspected. Confirmed structure:

```
Line 579: <div class="dy-section dy-section--centered-white theme--white ...">  ← §C section opens
Line 590:   <div class="dy-section__content">
Line 595:     <!-- grid-wrapper start -->
Line 597:     <div class="grid-wrapper grid-wrapper--3col">  ← 3-up card grid
Line 644:     <!-- grid-wrapper end -->
Line 645:     <h3 class="heading h3 ...">  ← bio h3 immediately follows
Line 646:       Who we are.
Line 657: <!-- §C section ends --><!-- §D section starts -->
```

The h3 "Who we are." is the direct next sibling after the `.grid-wrapper` close, inside the same `.dy-section__content` of the `.dy-section--centered-white` §C section. No standalone bio section exists between §B (Track record, line 549–578) and §C (Open source, line 579–657). **PASS**

---

### T2-3 — Hairline present: border-top 1px solid #E5E1DC

CSS served at lines 717–723 of `dy-section.css`:

```css
.dy-section--centered-white .dy-section__content > .grid-wrapper + .heading.h3 {
  border-top: 1px solid var(--theme-border-color);
  margin-top: 4rem;
  padding-top: 3rem;
  text-align: center;
  max-width: var(--prose-max, 720px);
  margin-inline: auto;
}
```

Token resolution confirmed from served `base.css`:

```css
html .theme--white {
  --theme-border-color: #E5E1DC;
  ...
}
```

The §C section carries `theme--white`, so `var(--theme-border-color)` resolves to `#E5E1DC` in this context. **PASS**

---

### T2-4 — ARIA landmarks

| Landmark | Element | Attribute | Line |
|---|---|---|---|
| banner | `<header class="... site-header">` | implicit landmark | 160 |
| navigation (main) | `<nav id="block-...main-menu">` | `aria-labelledby="heading-1475924401"` | 239 |
| navigation (breadcrumb) | `<nav class="breadcrumb ...">` | `aria-labelledby="system-breadcrumb-177212457"` | 437 |
| main | `<main class="site-main">` | implicit landmark | 464 |
| contentinfo | `<footer class="site-footer ...">` | implicit landmark | 743 |
| navigation (footer) | `<nav id="block-...footer">` | `aria-labelledby="heading-2046512350"` | 774 |

All four required landmarks present. Both nav elements have accessible names via `aria-labelledby`. Breadcrumb nav is labeled. **PASS**

---

### T2-5 — Contrast (see WCAG section below)

Verified numerically. **PASS**

---

### T2-6 — No `!important` introduced

```
$ grep '!important' web/themes/custom/performant_labs_20260502/css/components/dy-section.css | grep -v '\*'
(no output)
```

The two occurrences of "!important" in the file appear only inside block comment text (`* No !important.`). Zero `!important` in active CSS rules. **PASS**

---

### T2-7 — Pa11y (PC-5)

```
$ npx pa11y-ci --config .pa11yci.json

Running Pa11y on 7 URLs:
 > https://pl-performantlabs.com.3.ddev.site:8493/ - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/services - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/about-us - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/articles - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/contact-us - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/how-we-do-it - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/open-source-projects - 0 errors

7/7 URLs passed
```

Allowlist (`hideElements` in `.pa11yci.json`) applied as-is; not edited. 0 errors on all 7 URLs including /about-us. **PASS** (PC-5 satisfied)

---

## WCAG contrast verification

Computation method: relative luminance per WCAG 2.2 formula — `L = 0.2126 * sRGB(R) + 0.7152 * sRGB(G) + 0.0722 * sRGB(B)` where `sRGB(c) = c/12.92` if `c <= 0.04045` else `((c + 0.055) / 1.055)^2.4`. Contrast ratio = `(L_lighter + 0.05) / (L_darker + 0.05)`. Hex values sourced from served `base.css` and `dy-section.css`.

| Element | Foreground | Background | F's ratio | T's computed ratio | Required | PASS/FAIL |
|---|---|---|---|---|---|---|
| Bio h3 "Who we are." | #2A2520 (ink) | #FFFFFF (canvas) | 15.17:1 | 15.17:1 | >= 4.5:1 (AA normal text) | PASS |
| Bio body text | #5C544C (body) | #FFFFFF (canvas) | 7.43:1 | 7.43:1 | >= 4.5:1 (AA normal text) | PASS |
| Hairline rule | #E5E1DC | #FFFFFF | 1.30:1 | 1.30:1 | N/A (decorative) | N/A |
| Focus ring (teal) | #1893B4 (primary) | #FFFFFF (canvas) | 3.58:1 | 3.58:1 | >= 3:1 (non-text) | PASS |

No discrepancy between F's reported ratios and T's independently computed ratios.

Token sources confirmed:
- `#2A2520` from `--theme-text-color-primary` in `.theme--white` block in `base.css`
- `#5C544C` from `--theme-text-color-soft` in `.theme--white` block in `base.css`
- `#1893B4` from `--pl-primary` (comment-confirmed in `--theme-focus-ring-color`)
- `#E5E1DC` from `--theme-border-color` in `.theme--white` block in `base.css`

---

## Mobile responsive verification

N/A — no responsive overrides in this cycle. F reported correctly: the hairline rule and bio centering apply at all viewports via `border-top`, `margin-top`, `padding-top`, `text-align: center`, `max-width: 720px`, `margin-inline: auto` — all viewport-independent properties. No breakpoint-specific CSS was added. The CSS asset confirms no media queries in the modified selectors (lines 717–730 of served `dy-section.css`). No new touch target regressions possible (no new interactive elements introduced).

---

## Acceptance criteria status

| # | Criterion | Evidence | Status |
|---|---|---|---|
| 1 | Live /about-us no longer renders a standalone bio section between §B and §C; bio sits inside §C below the 3-up tools card grid | DOM confirms: §C (line 579–657) contains grid-wrapper (line 597–644) then h3 "Who we are." (line 645). No section between §B (ends 578) and §C (starts 579). | PASS |
| 2 | A horizontal hairline rule appears immediately above the bio h3 at all three viewports, matching the preview's terracotta/grey treatment | `border-top: 1px solid var(--theme-border-color)` served at CSS line 718; token resolves to `#E5E1DC` in `.theme--white`; no breakpoint restriction | PASS |
| 3 | `dy-section--bio-block` markup is no longer present on live; orphan CSS diff recorded in handoff-F | grep count = 0 on rendered HTML; CSS diff in handoff-F confirms selector rewrite; only comment references remain | PASS |
| 4 | Canvas patch script is idempotent (second run = zero changes) | T1-9 replay output: "SKIP: 'dy-section--bio-block' not found in additional_classes. Already patched. No changes made." | PASS |
| 5 | `component_version` preserved on every Canvas component edited (PC-6); patch does NOT set version to NULL | Script output (both runs): `component_version: e6079b189d228dad`; script source confirms it is never set to NULL, only read and echo'd | PASS |
| 6 | No regression on /services or /open-source-projects | T1-6: both 200; both 0 bio-block occurrences; /services grid-wrapper confirmed not followed by h3 inside centered-white sections | PASS |
| 7 | Tier 1 (curl/grep) and Tier 2 (ARIA / structural) pass at T | All T1 and T2 checks above: PASS | PASS |
| 8 | Tier 3 visual at 1280 / 768 / 375 at S | Out of scope for T; routed to S | N/A (S scope) |
| 9 | Pa11y with existing allowlist applied: 0 errors (PC-5). Allowlist NOT edited | `npx pa11y-ci`: 7/7 URLs passed, 0 errors on /about-us; `.pa11yci.json` not modified | PASS |
| 10 | WCAG 2.2 AA contrast on bio h3 + body | Bio h3: 15.17:1; body: 7.43:1; focus ring: 3.58:1 — all above floors | PASS |
| 11 | No `!important`; correct layer choice (PC-3); L5 preferred | Zero active `!important`; layer choice is L5 (component-scoped `dy-section.css`) | PASS |

---

## Blocking issues

None. All T1 and T2 checks pass.

---

## Advisory notes

1. **Pre-existing errors in watchdog unrelated to Cycle 2.** wid 5086 (AssertionError on /services at 10:07) and wid 5084 (LogicException: `additional_classes` prop not defined on the homepage at 07:23) are both pre-existing Canvas module issues on different pages and components. Neither involves canvas_page 17 or the Cycle 2 patch uuid. Both sibling pages return 200. These errors are not introduced by Cycle 2.

2. **Selector breadth advisory (non-blocking).** F flagged this in handoff: the replacement selector `.dy-section--centered-white .dy-section__content > .grid-wrapper + .heading.h3` is broader than `.dy-section--bio-block` was. T verified via DOM inspection that: (a) §A hero's `dy-section--centered-white` section contains h1, not h3, and has no `.grid-wrapper`; (b) `/services` `dy-section--centered-white` section has a `.grid-wrapper` but it is not followed by `.heading.h3`. No false matches exist on any currently-active page. Advisory only: if future content adds a `.heading.h3` immediately after a `.grid-wrapper` inside any `dy-section--centered-white` section on any page, it would inadvertently receive the hairline + centering treatment. F documented this risk; no action required at T.

3. **Dead CSS at dy-section.css line 483.** `.dy-section.theme--white .dy-section__content > .text + .heading.h3` — pre-existing from before the corrected rebuild per F's handoff. No DOM match exists on any page. Not introduced by Cycle 2. Recommend cleanup in a future housekeeping cycle.

4. **"Who we are." orphan-word check.** The three-word heading renders on a single line in source; `text-align: center` and `max-width: 720px` apply at all viewports. No orphan word risk at any breakpoint for this heading.

---

T complete, no blocking issues. Ready for S.
