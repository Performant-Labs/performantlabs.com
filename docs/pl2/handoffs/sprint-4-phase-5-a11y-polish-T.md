# Handoff-T: Sprint 4 Cycle 5 - Site-wide a11y polish bundle (J.2 + A.2 + A.3 + D.4)

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-4-phase-5-a11y-polish`
**Issue:** `docs/pl2/handoffs/sprint-4-phase-5-a11y-polish-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/sprint-4-phase-5-a11y-polish-F.md`

---

## Tier 1 results

### Cache clear

```
ddev drush cr
```

Expected: `[success] Cache rebuild complete.`
Actual: `[success] Cache rebuild complete.`
Result: PASS

### HTTP status checks

| Command | Expected | Actual | Result |
|---|---|---|---|
| `ddev exec curl -s http://localhost/ -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| `ddev exec curl -s http://localhost/articles -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| `ddev exec curl -s http://localhost/contact-us -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| `ddev exec curl -s http://localhost/articles/why-drupal -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| `ddev exec curl -s "http://localhost/articles?page=1" -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| `ddev exec curl -s http://localhost/articles-2 -o /dev/null -w '%{http_code}'` | 404 (expected — F documented) | 404 | PASS (expected non-existent) |

### J.2 — page-title inside main on /articles

Command: `ddev exec curl -s http://localhost/articles | grep -nE '<main|section class="page-title"|</main'`

```
456:  <main class="site-main">
459:        <section class="page-title">
829:  </main>
```

`<main` opens at line 456. `<section class="page-title">` opens at line 459 (inside main). `</main>` closes at line 829. Section is inside main. PASS.

### J.2 cross-checks — no page-title section outside main on other pages

| Page | Result |
|---|---|
| `/` — no `<section class="page-title">` in output | PASS |
| `/contact-us` — no `<section class="page-title">` in output | PASS |
| `/articles/why-drupal` — no `<section class="page-title">` in output | PASS |

---

## Tier 2 results

### J.2 — template structure review

`web/themes/custom/performant_labs_20260502/templates/layout/page--articles.html.twig` was read. The template confirms the order: `{{ page.highlighted }}` (breadcrumb region) precedes `<main class="site-main">`, and `<section class="page-title">` appears at line 38 of the file, inside `<main>`. The comment at the top of the file documents the J.2 fix. Structure is correct.

Result: PASS

### A.2 — visually-hidden nav h2

Independent verification via curl + grep on three pages:

| Page | Result | Evidence |
|---|---|---|
| `/` | `<h2 class="visually-hidden h3 menu-block__title" id="heading-33728557">` at line 243, content "Main navigation" at line 244 | PASS |
| `/articles` | `<h2 class="visually-hidden h3 menu-block__title" id="heading-2083094662">` at line 233 | PASS |
| `/contact-us` | `<h2 class="visually-hidden h3 menu-block__title" id="heading-657621850">` at line 246 | PASS |

CSS verification: the `.visually-hidden` class is defined in Drupal core at `web/core/themes/stable9/css/system/components/hidden.module.css`. The full definition is:

```css
.visually-hidden {
  position: absolute !important;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  width: 1px;
  height: 1px;
  word-wrap: normal;
}
```

This uses `position: absolute`, `width: 1px`, `height: 1px`, `overflow: hidden`, and `clip`. It is missing `white-space: nowrap` from the canonical recipe but `word-wrap: normal` with `width: 1px` is functionally equivalent for all practical screen reader pairings. This is Drupal core's shipped definition; it is not a deficiency introduced by F.

Result: PASS

### A.3 — pager aria-current

| Page | Command | Result |
|---|---|---|
| `/articles` | `grep -n "aria-current\|is-current"` | Line 791: `<span class="is-current" aria-current="page">1</span>` — PASS |
| `/articles?page=1` | same grep | Line 733: `<span class="is-current" aria-current="page">2</span>` — PASS |

The custom pager template at `templates/navigation/pager.html.twig` is confirmed active (HTML debug comment on line 785 of /articles output: `BEGIN CUSTOM TEMPLATE OUTPUT from 'themes/custom/performant_labs_20260502/templates/navigation/pager.html.twig'`).

Result: PASS

### Heading hierarchy on /articles

Headings found (independent grep, line numbers from live output):

```
line 233 — h2.visually-hidden "Main navigation" (nav landmark label)
line 431 — h2.visually-hidden "Breadcrumb" (breadcrumb nav label)
line 463 — h1 "Articles." (inside <main>)
lines 595–766 — h3 x6 article teaser titles
lines 864, 880, 900, 914 — h2.visually-hidden footer nav label + h3 x3 footer columns
```

Single H1 present, inside `<main>`. Visually-hidden h2s correctly scope landmark labels. The h2-to-h3 skip on article cards is a pre-existing pattern noted in F's known issues; it is not in scope for this cycle.

Result: PASS

### ARIA landmarks on /articles

| Landmark | HTML element | Line | Label |
|---|---|---|---|
| `<header>` | `<header class="theme--white site-header">` | 152 | site-header |
| `<nav>` | `aria-labelledby="heading-..."` | 231 | Main navigation |
| `<nav>` | `aria-labelledby="system-breadcrumb-..."` | 429 | Breadcrumb |
| `<main>` | `<main class="site-main">` | 456 | (main landmark) |
| `<nav>` | `aria-label="Articles pagination"` | 786 | Articles pagination |
| `<footer>` | `<footer data-component-id="neonbyte:footer">` | 831 | site-footer |
| `<nav>` | `aria-labelledby="heading-..."` | 862 | Footer nav |

All expected landmarks present and labeled.

Result: PASS

---

## WCAG contrast verification

F reported no new color or visual changes in this cycle. Contrast analysis is advisory only (no new values introduced). Pa11y surfaced two findings that require documentation against pre-approved deviations.

| Element | Foreground | Background | F's ratio | T's independent ratio | Pa11y ratio | Pre-approved deviation? | Result |
|---|---|---|---|---|---|---|---|
| Breadcrumb link "Home" on /articles | #1893b4 | #F5EFE2 (cream, computed by pa11y from rendered page) | 3.07:1 (base.css comment) | 3.12:1 | 3.12:1 | Yes — base.css line 97: "pre-approved deviation" | See note |
| Button--primary bg / white text (homepage CTA, contact submit) | #FFFFFF | #62BBCB | 2.13:1 (base.css comment) | 2.21:1 | 2.21:1 | Yes — base.css line 35: "FAIL AA — intentional" | See note |

Note on breadcrumb link: T's computed ratio is 3.12:1 (matches pa11y). The base.css inline comment says 3.07:1 — that comment is slightly inaccurate (it likely reflects an earlier hex value or a rounding difference). The pre-approved deviation record exists but the documented ratio is off by 0.05. This is a minor advisory, not a blocking issue.

Note on button primary: T's computed ratio is 2.21:1 (matches pa11y). The base.css inline comment says 2.13:1 — also slightly inaccurate. Pre-approved deviation record exists.

Neither finding is new to this cycle; neither was introduced by J.2. Both were pre-approved by the operator in a prior phase (base.css records "FAIL AA — intentional" / "pre-approved deviation").

---

## Mobile responsive verification

N/A — no responsive overrides in this phase. The only code change was moving existing markup inside `<main>`. No CSS was added or modified. No mobile verification required.

---

## Acceptance criteria status

| # | Criterion (from issue) | Status | Evidence |
|---|---|---|---|
| AC1 | `<section class="page-title">` renders inside `<main>` on every page tested | PASS | Grep confirms: `<main>` opens line 456, `<section class="page-title">` at line 459, `</main>` at line 829 on /articles. No `<section class="page-title">` present on /, /contact-us, or /articles/why-drupal. |
| AC2 | Nav h2 confirmed visually-hidden (or fix shipped if not) | PASS | `<h2 class="visually-hidden h3 menu-block__title">` confirmed on /, /articles, /contact-us. CSS recipe (Drupal core) uses position:absolute, 1px dimensions, clip, overflow:hidden. |
| AC3 | Active pager `<li>` carries `aria-current="page"` on `/articles-2` and `/articles` | PASS (with substitution) | `/articles-2` is a 404; Drupal pager uses `?page=N`. Verified `aria-current="page"` on `/articles` (page 1 active) and `/articles?page=1` (page 2 active). F's substitution is correct — the issue URL was wrong. |
| AC4 | Breadcrumb audit table: every page type has or explicitly does-not-need breadcrumbs | PASS | D.4 spot-check confirms: article detail (/articles/why-drupal) — breadcrumb present; basic page (/privacy-policy) — breadcrumb present; contact form (/contact-us) — breadcrumb present. Matches F's full 8-row table. |
| AC5 | Pa11y on `/`, `/articles`, `/contact-us` shows 0 errors | FAIL | Pa11y (installed at /opt/homebrew/bin/pa11y) returned 1 error on /, 1 error on /articles, 2 errors on /contact-us. All 4 pa11y errors are WCAG2AA 1.4.3 contrast failures covered by pre-existing pre-approved operator deviations. See blocking issues section. |

---

## Blocking issues

**AC5 — Pa11y reports non-zero errors on all three pages.**

Pa11y exit code 2 on each URL. Errors found:

1. `/` — `button.button--primary` ("Book a testing review") contrast 2.21:1 (bg #62BBCB, text white). WCAG2AA 1.4.3.
2. `/articles` — `a.breadcrumb__link` ("Home") contrast 3.12:1 (link #1893b4, bg #F5EFE2). WCAG2AA 1.4.3.
3. `/contact-us` — same breadcrumb link as above (3.12:1) plus `button#edit-actions-submit` ("Send message") contrast 2.21:1 (same button--primary token).

The acceptance criterion states "Pa11y on `/`, `/articles`, `/contact-us` shows 0 errors" without qualification. The errors are real WCAG2AA failures — they are not false positives. They are covered by pre-approved operator deviations recorded in `base.css` (Phase 8.7 / autonomous-default decision log). However, the acceptance criterion as written is binary: 0 errors means 0 errors.

**Decision required:** Either (a) F must add pa11y configuration to suppress the pre-approved deviation selectors (e.g., a `.pa11yci.json` ignore list) so that the tool reports 0 errors on those pages, or (b) the operator must explicitly amend AC5 to read "Pa11y shows 0 errors excluding pre-approved contrast deviations." T cannot make this call. S must not proceed until the AC5 discrepancy is resolved.

---

## Advisory notes

1. **base.css contrast comment inaccuracies.** The inline comments in `base.css` record `#1893b4 on cream = 3.07:1` (actual: 3.12:1) and `#62BBCB bg + white text = 2.13:1` (actual: 2.21:1). Neither is blocking but they will cause confusion in future audits. F should correct the comments to match independently computed values in a future cycle.

2. **`/articles-2` URL in issue.** Confirmed 404. F's interpretation that the issue meant `/articles?page=1` is correct; the Drupal pager uses query parameters. The AC3 criterion is met via the correct URL. No action needed beyond the note already in F's handoff.

3. **h2-to-h3 heading skip on article cards.** Pre-existing; not introduced by this cycle. Article teasers on /articles use `h3` without an intervening `h2` inside `<main>`. Flagged for awareness — not blocking for this cycle.

4. **`visually-hidden` missing `white-space: nowrap`.** Drupal core's canonical definition omits this property. Not a regression introduced by this cycle. No action required here.
