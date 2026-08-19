# Handoff-T: FU-2 - Hero H1 Live-CSS Reconciliation

**Date:** 2026-05-11
**Branch:** `aa/pl-fu2-hero-h1-live-reconciliation`
**Issue:** `docs/pl2/handoffs/fu2-hero-h1-live-reconciliation-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/fu2-hero-h1-live-reconciliation-F.md`

## Tier 1 results

### Cache clear

Command: `/opt/homebrew/bin/ddev drush cr`
Expected: "Cache rebuild complete."
Actual: "[success] Cache rebuild complete."
Result: PASS

### HTTP status — all pages

Command: `ddev exec curl -s -o /dev/null -w '%{http_code}' http://localhost/<path>`

| Path | Expected | Actual | Result |
|---|---|---|---|
| `/` | 200 | 200 | PASS |
| `/services` | 200 | 200 | PASS |
| `/how-we-do-it` | 200 | 200 | PASS |
| `/open-source-projects` | 200 | 200 | PASS |
| `/articles` | 200 | 200 | PASS |
| `/contact-us` | 200 | 200 | PASS |
| `/about-us` | 200 | 200 | PASS |

All 7 paths return 200. No 5xx or broken pages from the Canvas content patch. PASS.

### CSS rule presence in served stylesheet

Command: `ddev exec curl -s http://localhost/themes/custom/performant_labs_20260502/css/components/dy-section.css | grep -c "landing-hero"`
Expected: > 0
Actual: 12 occurrences
Result: PASS

Command: `... | grep -A3 '.landing-hero .heading.h1 {'`
Actual output confirms three rule blocks present:
- Base (all viewports): `letter-spacing: -2px; line-height: 1.05; text-wrap: balance`
- Desktop `@media (min-width: 577px)`: `font-size: 4.5rem; letter-spacing: -2px`
- Mobile `@media (max-width: 576px)`: `font-size: 2.75rem; letter-spacing: -1px; line-height: 1.05`
Result: PASS

## Tier 2 results

### DOM class verification — target pages have `landing-hero`

Command: `ddev exec curl -s http://localhost/<path> | grep -o 'class="[^"]*landing-hero[^"]*"'`

| Page | Expected class substring | Actual | Result |
|---|---|---|---|
| `/services` | `landing-hero` | `class="dy-section landing-hero theme--white container dy-section--section-max-width margin-top--0 margin-bottom--0 padding-top--l padding-bottom--l"` | PASS |
| `/how-we-do-it` | `landing-hero` | `class="dy-section landing-hero theme--white container dy-section--section-max-width margin-top--0 margin-bottom--0 padding-top--l padding-bottom--l"` | PASS |
| `/open-source-projects` | `landing-hero` | `class="dy-section landing-hero theme--white container dy-section--section-max-width margin-top--0 margin-bottom--0 padding-top--l padding-bottom--l"` | PASS |

### DOM class verification — non-target pages do NOT have `landing-hero`

Command: `ddev exec curl -s http://localhost/<path> | grep -c "landing-hero"`

| Page | Expected count | Actual count | Result |
|---|---|---|---|
| `/about-us` | 0 | 0 | PASS |
| `/contact-us` | 0 | 0 | PASS |

Contact-us retains its `contact-us-hero` class (verified count: 1). PASS.

### Articles heading check

Command: `ddev exec curl -s http://localhost/articles | grep -c "landing-hero"`
Actual: 0 — PASS

Command: `ddev exec curl -s http://localhost/articles | grep -o '<h1[^>]*>'`
Actual: `<h1>` (no class attribute — not matched by F's `h1.heading` Playwright selector)

The articles `<h1>` is a bare `<h1>` inside the page-title block (not inside `.landing-hero`, no `.heading` class). No regression. PASS.

### Homepage code path independent from landing-hero

The homepage `/` renders its hero via `neonbyte:hero` (`.hero.theme--white` class), not via `dripyard_base:section`. The homepage has zero occurrences of `landing-hero` in its HTML. Homepage H1 typography comes from `hero.css` via the `.hero.theme--white` scope, which is a separate code path. The Playwright desktop result of 72px / -2px / 1.05 on `/` is correctly sourced from `hero.css`, not from the new `dy-section.css` rules. PASS.

### Playwright computed-style — desktop 1280x800

Command: `node scripts/fu2-verify-h1.js`

| Page | font-size | font-weight | line-height | letter-spacing | LS OK | LH OK |
|---|---|---|---|---|---|---|
| `/` | 72px | 500 | 75.6px (1.0500) | -2px | true | true |
| `/services` | 72px | 500 | 75.6px (1.0500) | -2px | true | true |
| `/how-we-do-it` | 72px | 500 | 75.6px (1.0500) | -2px | true | true |
| `/open-source-projects` | 72px | 500 | 75.6px (1.0500) | -2px | true | true |
| `/articles` | H1 present = false | — | — | — | — | — |

All four landing pages report brief-canonical values. No regression on homepage. Articles has no `.heading` H1. PASS.

### Playwright computed-style — mobile 375x812

Command: `node scripts/fu2-verify-h1-mobile.js`

| Page | font-size | letter-spacing | line-height ratio | Result |
|---|---|---|---|---|
| `/` | 44px | -1px | 1.0500 | PASS |
| `/services` | 44px | -1px | 1.0500 | PASS |
| `/how-we-do-it` | 44px | -1px | 1.0500 | PASS |
| `/open-source-projects` | 44px | -1px | 1.0500 | PASS |

All four pages match the brief's `typography-mobile.display-xl` (44px / -1px). PASS.

### Heading hierarchy check

The H1 inside `.landing-hero` on the three target pages is the sole H1 on each page (it is the hero section heading). No heading hierarchy skip was introduced. PASS.

### CSS change log (AC5 trace requirement)

`docs/pl2/css-change-log.md` line 87-88 contains the FU-2 entry with full layer ruling. The CSS file (`dy-section.css`) includes a block comment beginning at line 556 titled "FU-2: Landing-hero H1 — display-xl typography reconciliation" with complete bottom-up and top-down traces. PASS.

## WCAG contrast verification

F reported `#1F1A14` (--theme-text-color-loud) on `#FFFFFF`. Verified via `color--loud` class on the h1 in DOM (`class="heading h1 heading--centered margin-top--0 margin-bottom--s color--loud"`). Token value confirmed in `css/base.css` lines 66, 80, 94, 108: `--theme-text-color-loud: #1F1A14` for all white/light/secondary zones.

Independent computation (WCAG relative luminance formula):

| Element | Foreground | Background | F's ratio | T's ratio | Discrepancy | Result |
|---|---|---|---|---|---|---|
| Hero H1 (72px desktop, weight 500) | #1F1A14 | #FFFFFF | 17.29:1 | 17.27:1 | 0.02 (rounding) | PASS |
| Hero H1 (44px mobile, weight 500) | #1F1A14 | #FFFFFF | 17.29:1 | 17.27:1 | 0.02 (rounding) | PASS |

T's computed values: FG luminance 0.010806, BG luminance 1.0, ratio = (1.05) / (0.060806) = 17.27:1.

The 0.02 discrepancy between F's 17.29 and T's 17.27 is a rounding artifact (hex-to-decimal precision). Both results confirm AAA compliance at large text threshold (3:1). PASS.

No color properties were changed in this cycle. Letter-spacing and line-height are not contrast-bearing. Focus ring and link color are not affected. No contrast degradation introduced.

## Mobile responsive verification

F reported responsive overrides in this phase. Verified against `docs/pl2/briefs/pl_design_brief.md` `typography-mobile` block:

| Override | Breakpoint | Brief target | CSS rule | Playwright result | Result |
|---|---|---|---|---|---|
| `font-size` | `@media (max-width: 576px)` | 44px | `font-size: 2.75rem` (44px) | 44px confirmed | PASS |
| `letter-spacing` | `@media (max-width: 576px)` | -1px | `letter-spacing: -1px` | -1px confirmed | PASS |
| `line-height` | `@media (max-width: 576px)` | 1.05 (inherited — brief does not specify mobile override) | `line-height: 1.05` (explicit) | 1.0500 confirmed | PASS |
| `font-size` desktop | `@media (min-width: 577px)` | 72px | `font-size: 4.5rem` (72px) | 72px confirmed at 1280 | PASS |

Brief's mobile breakpoint is 576px. CSS uses `max-width: 576px` / `min-width: 577px` — matches exactly. PASS.

Touch targets: H1 headings are non-interactive elements. No touch target requirement applies to the heading text itself. Interactive elements in hero section (CTA buttons) were covered by prior phases and remain unchanged. PASS.

## Acceptance criteria status

| AC | Criterion | Evidence | Result |
|---|---|---|---|
| AC1 | Playwright 1280 reports -2px / 1.05 on /services, /how-we-do-it, /open-source-projects | Playwright output: all three pages letter-spacing OK: true, line-height OK: true (ratio 1.0500) | PASS |
| AC2 | Homepage `/` still reports -2px / 1.05 (no regression) | Playwright output: `/` letter-spacing OK: true, line-height OK: true (ratio 1.0500) | PASS |
| AC3 | Visual diff (S handles T3) | Not T's responsibility | N/A — deferred to S |
| AC4 | No regression on /articles or other non-landing pages | /articles: H1 present = false in Playwright; no `landing-hero` class; HTTP 200; /contact-us and /about-us confirmed without `landing-hero` class | PASS |
| AC5 | Trace comment in CSS + change log | css-change-log.md line 87-88 FU-2 entry; dy-section.css block comment lines 556-607 with full bottom-up/top-down trace | PASS |

## Blocking issues

None. All checks pass.

## Advisory notes

1. The Playwright scripts (`scripts/fu2-verify-h1.js` and `scripts/fu2-verify-h1-mobile.js`) target `h1.heading` as one of their selectors. The articles `<h1>` has no `.heading` class, which is why the script correctly reports `H1 present = false` for `/articles`. This is not a bug in the script — it is the intended behavior. If a future page adds a hero-style H1 with the `.heading` class inside a non-landing-hero section, the selector would need updating.

2. F's reported contrast ratio of 17.29:1 vs T's computed 17.27:1: the 0.02 difference is attributable to intermediate rounding in hex-to-linear RGB conversion. Both values confirm identical WCAG outcome (AAA, far exceeding all thresholds).

3. The `@media (min-width: 577px)` desktop block in `dy-section.css` explicitly re-asserts `letter-spacing: -2px` as a guard against token shadowing at the breakpoint boundary. This is defensive and correct.
