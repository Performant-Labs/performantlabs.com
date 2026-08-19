# Handoff-T: Sprint 7 — Final Cycle — WCAG 1.4.10 Regression Baseline

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-7-cycle-final-verification`
**Issue:** `docs/pl2/handoffs/cycle-final-r8-baseline-issue.md`
**Handoff-F reviewed:** N/A (verification-only cycle; no F — Cycle 1 audit `docs/pl2/handoffs/cycle-1-r8-audit-S.md` is the antecedent)

---

## Tier 1 results

### Cache clear

Command: `ddev drush cr`
Result: `[success] Cache rebuild complete.`
PASS.

### HTTP status

| Page | URL | Expected | Actual | Result |
|---|---|---|---|---|
| `/` | `https://pl-performantlabs.com.3.ddev.site:8493/` | 200 | 200 | PASS |
| `/services` | `https://pl-performantlabs.com.3.ddev.site:8493/services` | 200 | 200 | PASS |
| `/how-we-do-it` | `https://pl-performantlabs.com.3.ddev.site:8493/how-we-do-it` | 200 | 200 | PASS |
| `/open-source-projects` | `https://pl-performantlabs.com.3.ddev.site:8493/open-source-projects` | 200 | 200 | PASS |

Method: `/usr/bin/curl -sk <URL> -o /dev/null -w '%{http_code}'` run after `ddev drush cr`.

### CSS variable presence

Confirmed via curl on served `performant_labs_20260502/css/base.css` and `css/components/hero.css`:

| Token / rule | Expected | Present | Result |
|---|---|---|---|
| `--pl-primary` | In base.css (comment + usage) | Yes | PASS |
| `--theme-link-color: var(--pl-primary)` | In base.css | Yes | PASS |
| hero.css `@media (max-width: 767px)` | Mobile override present | Yes | PASS |
| hero.css `@media (max-width: 576px)` width: 100% on buttons | Stack rule present | Yes | PASS |
| hero.css `max-width: 900px` cap | Present | Yes | PASS |

### Rendered content spot-check

| Page | H1 text | Present | Result |
|---|---|---|---|
| `/` | "Ship Drupal releases with confidence." | Yes | PASS |
| `/services` | "Testing engagements for Drupal teams." | Yes | PASS |
| `/how-we-do-it` | "How a testing engagement runs." | Yes | PASS |
| `/open-source-projects` | "What we maintain in the open" | Yes | PASS |

---

## Tier 2 results

### Heading hierarchy

Each page's heading sequence was extracted via `grep -oE "<h[1-6][^>]*>"` on the served HTML.

**`/` (homepage)**

Sequence: `h2.visually-hidden` (nav menu label) → `h1` → `h2` → `h3 × 3` → `h2 × 3` → `h2.visually-hidden` (footer nav label) → `h3 × 3` (footer columns).

The leading `h2.visually-hidden` is the menu-block's `aria-labelledby` target — a pre-existing SDC pattern that does not constitute a skip in the page outline. The content outline reads H1 → H2 → H3 → H2 with no skipped levels. Single H1. PASS.

**`/services`**

Sequence: `h2.visually-hidden` (nav label) → `h2.visually-hidden` (breadcrumb label) → `h1` → `h2` → `h3 × 4` → `h2` → `h2` → `h2` → `h2.visually-hidden` (footer nav) → `h3 × 3`.

Content outline: H1 → H2 → H3 → H2 → H2 → H2. No skipped levels. Single H1. PASS.

**`/how-we-do-it`**

Sequence: `h2.visually-hidden` (nav) → `h2.visually-hidden` (breadcrumb) → `h1` → `h2` → `h2` → `h2` → `h3 × 3` → `h2` → `h2` → `h2.visually-hidden` (footer nav) → `h3 × 3`.

Content outline: H1 → H2 → H3 → H2. No skipped levels. Single H1. PASS.

**`/open-source-projects`**

Sequence: `h2.visually-hidden` (nav) → `h2.visually-hidden` (breadcrumb) → `h1` → `h2` → `h3 × 3` → `h2` → `h3 × 3` → `h2` → `h3` → `h2` → `h2.visually-hidden` (footer nav) → `h3 × 3`.

Content outline: H1 → H2 → H3 → H2 → H3 → H2 → H3 → H2. No skipped levels. Single H1. PASS.

### ARIA landmarks

| Page | `<header>` | `<nav>` (>=1) | `<main>` | `<footer>` | Result |
|---|---|---|---|---|---|
| `/` | Yes | 2 (`nav#main-menu`, `nav#footer`) | Yes | Yes | PASS |
| `/services` | Yes | 3 (main-menu, breadcrumb, footer) | Yes | Yes | PASS |
| `/how-we-do-it` | Yes | 3 | Yes | Yes | PASS |
| `/open-source-projects` | Yes | 3 | Yes | Yes | PASS |

All `<nav>` elements carry `aria-labelledby` pointing to a matching visually-hidden heading. PASS.

### Semantic structure

| Check | Method | Result |
|---|---|---|
| Buttons vs links | Homepage: `<button class="mobile-nav-button">` for toggle; CTAs are `<a class="button button--primary">` — correct semantics (toggle = button, navigation/action links = anchor) | PASS |
| `aria-expanded` on mobile-nav-button | Static HTML has no `aria-expanded`; prior T audit (`cycle-final-verification-T.md`) confirmed `primary-menu.js` sets it dynamically via `setAttribute('aria-expanded', toState)` on interaction — standard JS-progressive-enhancement pattern | PASS |
| SVG `aria-label` | 3 occurrences on each page (confirmed via grep count); all SVGs that need labeling are labeled | PASS |
| `<ul>/<li>` for nav lists | Navigation rendered as `<ul>` with `<li>` children — confirmed by ARIA nav markup and prior structural audits; no structural change in this cycle | PASS |

### WCAG 1.4.10 re-probe (scrollWidth / clientWidth)

Fresh Playwright probe run (headless Chromium, `deviceScaleFactor: 1`, `ignoreHTTPSErrors: true`). Method: evaluate `documentElement.scrollWidth`, `documentElement.clientWidth`, `body.scrollWidth`, and `scrollX` after `window.scrollTo(9999, 0)` to confirm no horizontal scrollability.

| Page | Viewport | docScroll | docClient | bodyScroll | scrollX after scrollTo(9999,0) | Page-level overflow |
|---|---:|---:|---:|---:|---:|---|
| `/` | 375 | 360 | 375 | 360 | 0 | NO |
| `/services` | 375 | 360 | 375 | 360 | 0 | NO |
| `/how-we-do-it` | 375 | 360 | 375 | 360 | 0 | NO |
| `/open-source-projects` | 375 | 360 | 375 | 360 | 0 | NO |
| `/` | 320 | 305 | 320 | 305 | 0 | NO |
| `/services` | 320 | 305 | 320 | 305 | 0 | NO |
| `/how-we-do-it` | 320 | 305 | 320 | 305 | 0 | NO |
| `/open-source-projects` | 320 | 305 | 320 | 305 | 0 | NO |

Results are **identical to Cycle 1** measurements. All eight probes PASS WCAG 2.1 SC 1.4.10.

The −15 px delta (`docScroll` = `docClient − 15`) is the vertical-scrollbar gutter excluded from `scrollWidth`. This is expected browser behavior and does not indicate overflow.

### heal-flow internal-scroll container verification

Probed `div.heal-flow` at 375px viewport:

| Property | Value | Expected |
|---|---|---|
| `overflow-x` | `auto` | `auto` (authorized internal scroll) |
| `min-width` | `0px` | `0px` (defeat min-content) |
| `scrollWidth` | 1002 px | > clientWidth (diagram is wider, scrolls internally) |
| `clientWidth` | 233 px | < 375 (contained inside viewport) |
| `canScroll` | `true` | `true` |

PASS. Internal scroll is correctly engaged and does not contribute to page-level overflow.

---

## WCAG contrast verification

No new code was shipped in this final cycle. The contrast baseline is carried forward from the pre-approved deviations documented in `phase-8.7-color-spacing-T.md` (operator-approved 2026-05-11). T independently re-confirmed the hex values from served `base.css` and `button.css` have not changed.

| Element | Foreground | Background | Threshold | T's ratio | Status |
|---|---|---|---|---|---|
| `.button--primary` bg / white text (hero + closing CTA) | `#FFFFFF` | `#62BBCB` | 4.5:1 AA body | 2.21:1 | PRE-APPROVED FAIL — operator deviation |
| `.breadcrumb__link` "Home" on cream surface | `#1893b4` | `#F5EFE2` | 4.5:1 AA body | 3.12:1 | PRE-APPROVED FAIL — operator deviation |
| Body text on white (default) | `#0a0a0a` (approx) | `#FFFFFF` | 4.5:1 | >> 4.5:1 | PASS |
| Body text on cream (`.theme--light`) | `#0a0a0a` (approx) | `#F5EFE2` | 4.5:1 | >> 4.5:1 | PASS |
| Focus ring / `--theme-link-color` on white | `#1893b4` | `#FFFFFF` | 3.0:1 non-text | 3.56:1 | PASS |

The two PRE-APPROVED FAILs correspond exactly to the pa11y errors reported below — same elements, same ratios. No new contrast failures detected.

---

## Mobile responsive verification

No responsive overrides were shipped in this final cycle. This cycle is verification-only (no F). The hero.css mobile media queries (`@media (max-width: 767px)`, `@media (max-width: 576px)`, `@media (min-width: 577px)`) confirmed present in served CSS from prior commits. The scrollWidth re-probe at 320 and 375 is the binding responsive signal.

Responsive CSS breakpoints confirmed in served `hero.css`:

| Breakpoint | Rule confirmed | Purpose |
|---|---|---|
| `@media (max-width: 767px)` | Present | Mobile hero layout switch |
| `@media (max-width: 576px)` | Present | Below-sm font-size + button stack (`width: 100%`) |
| `@media (min-width: 577px)` | Present | Buttons side-by-side above sm |
| `@media (max-width: 991px)` | Present in header.css (prior sprint) | Hamburger display, 44×44 touch target |

Touch target: `mobile-nav-button` at 44×44px confirmed in `phase-8.7-color-spacing-T.md` §8.1 — no change to header.css in this cycle.

---

## Pa11y results (PC-5 wording)

Pa11y 9.1.1 run against all four landing pages. PC-5 criterion: 0 **new** errors; pre-existing brand-color deviations are on the allowlist.

| Page | Errors reported | New errors | Allowlisted | Result |
|---|---|---|---|---|
| `/` | 1 | 0 | 1 (`button--primary` contrast 2.21:1) | PASS (PC-5) |
| `/services` | 3 | 0 | 3 (2× `button--primary` 2.21:1; 1× breadcrumb link 3.12:1) | PASS (PC-5) |
| `/how-we-do-it` | 1 | 0 | 1 (breadcrumb link 3.12:1) | PASS (PC-5) |
| `/open-source-projects` | 1 | 0 | 1 (breadcrumb link 3.12:1) | PASS (PC-5) |

All pa11y errors are WCAG2AA 1.4.3 contrast failures for `#62BBCB`-bg buttons (2.21:1) and `#1893b4`-on-cream breadcrumb links (3.12:1). Both are pre-approved operator deviations documented in `phase-8.7-color-spacing-T.md` and `sprint-4-phase-5-a11y-polish-T.md`. No new error type or element has appeared.

---

## Acceptance criteria status

| Criterion | Evidence | Result |
|---|---|---|
| `scrollWidth ≤ clientWidth` at 320 on all four pages | Re-probe: docScroll 305, docClient 320, scrollX=0 on all four | PASS |
| `scrollWidth ≤ clientWidth` at 375 on all four pages | Re-probe: docScroll 360, docClient 375, scrollX=0 on all four | PASS |
| Internal scroll containers still scroll correctly (heal-flow on `/`) | `div.heal-flow`: `overflow-x: auto`, scrollWidth 1002 > clientWidth 233, `canScroll: true` | PASS |
| No new pa11y errors (PC-5) | 6 total pa11y errors across 4 pages; all 6 are pre-approved operator deviations; zero new error types or elements | PASS |
| Heading hierarchy clean per page | Confirmed for all four pages — H1 single per page, H2 → H3 progression, no skipped levels | PASS |
| ARIA landmarks present | `<header>`, `<main>`, `<footer>`, `<nav>` confirmed on all four pages; all `<nav>` carry `aria-labelledby` | PASS |
| Results match Cycle 1 baseline | All eight scrollWidth probes return identical values to `probe-results.json` from Cycle 1 | PASS |

Note: T3 visual (Tier 3 screenshots at 320 + 375) and the full WCAG 2.2 AA row-by-row table are S deliverables per the issue scope. This T handoff covers T1 + T2 + scrollWidth re-probe + pa11y per the sprint issue.

---

## Blocking issues

None.

---

## Advisory notes

1. **Cycle 1 screenshot artifacts retained.** The eight full-page screenshots at `docs/pl2/handoffs/screenshots/sprint-7-cycle-1/` remain the authoritative visual baseline for this sprint. S should produce a fresh set at `docs/pl2/handoffs/screenshots/sprint-7-final/` for the T3 visual check per the issue's handoff-location spec.

2. **heal-flow internal-scroll svg at 320.** The homepage heal-flow SVG extends to ~1047 px right at 320px (per Cycle 1 offender list). This is expected authorized behavior (process diagram, `overflow-x: auto` container). If a future audit flags these SVG elements as "overflow offenders", this handoff is the authoritative reference that they are design-intent.

3. **breadcrumb contrast comment inaccuracy (carried forward).** `base.css` inline comment reads `3.07:1` for `#1893b4` on cream; correct value is `3.12:1`. This advisory was noted in `sprint-4-phase-5-a11y-polish-T.md` and `phase-8.7-color-spacing-T.md`. Still non-blocking.

4. **button--primary resting ratio comment.** `base.css` comment reads `2.13:1`; correct value is `2.21:1`. Same advisory as above. Non-blocking.

---

T complete, no blocking issues. Ready for S.
