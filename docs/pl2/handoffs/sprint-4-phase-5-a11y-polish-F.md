# Handoff-F: Phase 5 - Site-wide a11y polish bundle (J.2 + A.2 + A.3 + D.4)

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-4-phase-5-a11y-polish`
**Issue:** `docs/pl2/handoffs/sprint-4-phase-5-a11y-polish-issue.md`

## Confirmation table (informational)

| Item | Value |
|---|---|
| Page being overhauled | Site-wide (articles page template + cross-page audit) |
| GitHub issue number | sprint-4-phase-5-a11y-polish-issue.md (local) |
| Working branch | `aa/pl-sprint-4-phase-5-a11y-polish` |
| Runbook phase | Sprint 4, Cycle 5 |
| Input documents read | Issue, neonbyte `page.html.twig`, child `page--articles.html.twig`, child `pager.html.twig`, `performant_labs_20260502.info.yml` |
| Acceptance criteria count | 5 |
| Handoff document path | `docs/pl2/handoffs/sprint-4-phase-5-a11y-polish-F.md` |
| CSS workflow path | N/A (template-only changes, no CSS modifications) |
| Component schema source of truth | N/A (no component props referenced) |

## Pre-flight results (per Cycles 1, 4 pattern)

| Item | Status before this cycle | Action needed |
|---|---|---|
| J.2 — page-title inside main | BROKEN: `<section class="page-title">` rendered outside `<main>` on /articles | Fix: move inside `<main>` |
| A.2 — nav h2 visually-hidden | ALREADY CLEAN: `<h2 class="visually-hidden h3 menu-block__title">Main navigation</h2>` present on all pages | Verify-only, no fix |
| A.3 — pager aria-current | ALREADY DONE: `<span class="is-current" aria-current="page">` present in existing `pager.html.twig` override | Verify-only, no fix |
| D.4 — breadcrumb audit | CLEAN: all non-homepage page types have breadcrumbs | Audit-only, no fix |

## What was done

- **`web/themes/custom/performant_labs_20260502/templates/layout/page--articles.html.twig`** — moved `<section class="page-title">` from between `{{ page.highlighted }}` and `<main>` to inside `<main>`, after the skip-nav anchor. Updated file comment to document the J.2 fix. No markup changes other than position.

No other files were created or modified. A.2, A.3, and D.4 required no code changes.

## Layer decisions

**J.2:** Layer 2 (template override). The `page--articles.html.twig` is already a child-theme template override of `neonbyte/templates/layout/page.html.twig`. The fix is purely structural (moving a block of markup from outside `<main>` to inside `<main>`). No CSS changes needed -- the page-title section's styling is position-independent. Trace: child theme template override (L2) is the correct layer because the markup structure is the concern, not a config value (L1), theme token (L3), or component stylesheet (L5).

## Deviations from spec

- **`/articles-2` does not exist.** The issue mentions `/articles-2` as a test URL for A.3 (pager aria-current). This URL returns a 404. The Drupal pager uses `?page=N` query parameters (e.g., `/articles?page=1` for page 2). Verified `aria-current="page"` on both `/articles` (page 1) and `/articles?page=1` (page 2). This is not a deviation from spec -- the URL format in the issue was incorrect but the acceptance criterion is met.

## Verification results (T1 + T2)

### T1: J.2 — page-title inside main

After `ddev drush cr`, verified with curl + grep on `/articles`:

```
Line 456:  <main class="site-main">
Line 459:        <section class="page-title">
Line 829:  </main>
```

`<section class="page-title">` now renders at line 459, inside `<main>` (line 456). PASS.

Cross-checked other pages (`/`, `/contact-us`, `/articles/why-drupal`): none have a `<section class="page-title">` outside `<main>`. The custom section only exists in the articles template. PASS.

### T1: A.2 — nav h2 visually-hidden

Confirmed on `/`, `/articles`, `/contact-us`:

```html
<h2 class="visually-hidden h3 menu-block__title" id="heading-...">
    Main navigation
</h2>
```

The `visually-hidden` class is present. The h2 is inside a `<nav>` element with matching `aria-labelledby`. PASS.

### T1: A.3 — pager aria-current

On `/articles`:
```html
<span class="is-current" aria-current="page">1</span>
```

On `/articles?page=1`:
```html
<span class="is-current" aria-current="page">2</span>
```

Both show `aria-current="page"` on the active page number. PASS.

### T2: Heading hierarchy on /articles

```
h2.visually-hidden — "Breadcrumb" (breadcrumb nav label)
h2.visually-hidden — "Main navigation" (nav label)
h1 — "Articles." (page title, inside <main>)
h3 — article teaser titles (x6)
h3 — "Company" (footer column)
```

h1 is inside `<main>`. Visually-hidden h2s are correctly scoped as landmark labels. h3 article cards skip h2 (pre-existing pattern, not in scope). PASS.

### T2: ARIA landmarks on /articles

```
<header> — site-header with neonbyte:header component
<nav aria-labelledby="..."> — Main navigation
<nav aria-labelledby="..."> — Breadcrumb
<main class="site-main"> — main content (contains page-title + articles)
<nav aria-label="Articles pagination"> — pager
<footer> — site-footer
<nav aria-labelledby="..."> — Footer menu
```

All landmarks properly labeled. PASS.

## D.4 — Breadcrumb audit table

| Page type | Test URL | Breadcrumb present | Rationale |
|---|---|---|---|
| Homepage | `/` | No | Correct: homepage is the breadcrumb root; no trail to display |
| Articles listing (Views) | `/articles` | Yes | `<nav class="breadcrumb">` with structured data |
| Article detail | `/articles/why-drupal` | Yes | Breadcrumb nav present with structured data |
| Book root | `/layout-builder-kit` | Yes | Breadcrumb nav present |
| Book interior | `/campaign-kit` | Yes | Breadcrumb nav present |
| Basic page | `/privacy-policy` | Yes | Breadcrumb nav present (confirmed via follow-redirect from /node/1) |
| Contact form | `/contact-us` | Yes | Breadcrumb nav present |
| User login | `/user/login` | N/A | Uses admin theme (Gin); not a front-end page type |

**Result:** All front-end page types have breadcrumbs or correctly omit them (homepage). No gaps found. No follow-up backlog items needed for D.4.

## WCAG contrast ratios

N/A -- no backdrop, color, or visual changes were made in this cycle. The only change was structural (moving existing markup inside `<main>`).

## Mobile responsive behavior

N/A -- no responsive overrides in this phase. The page-title section's CSS is unchanged; only its position in the DOM was moved.

## Autonomous decisions

1. **No scope split.** All four items fit comfortably in one cycle: J.2 required a single template edit (moving 13 lines of markup); A.2, A.3, and D.4 were verify-only (no code changes needed). Total files changed: 1. This is well under the 6-file scope cap, so splitting into 5a/5b would have been unnecessary overhead.

2. **A.3 already implemented.** The existing `pager.html.twig` override (from a prior phase) already includes `aria-current="page"`. Verified rather than re-implemented.

3. **A.2 already clean.** The dripyard_base menu-block component renders `<h2 class="visually-hidden">` by default. No fix needed.

4. **`/articles-2` URL interpretation.** The issue mentions `/articles-2` as a test URL. This is a 404. Interpreted the acceptance criterion as requiring pager verification on paginated article listings, which I verified on `/articles` and `/articles?page=1`. Conservative interpretation: the criterion is met.

5. **Page-title block in highlighted region on non-articles pages.** On pages using the default neonbyte `page.html.twig`, the Drupal page-title block renders inside `{{ page.highlighted }}` which is before `<main>`. However, J.2 specifically scopes to `<section class="page-title">` (the custom cream-band section), which only exists in `page--articles.html.twig`. The highlighted-region page-title block on other page types is a separate structural concern not covered by J.2. Did not widen scope.

## Known issues

- **`/articles-2` is a 404.** The issue references this URL but it does not resolve. Paginated articles use `/articles?page=N`. This pre-dates this cycle.
- **h2-to-h3 heading skip in article teasers.** Article cards on `/articles` use h3 without an intervening h2. Pre-existing; not in scope for this cycle.

## Files changed

- `web/themes/custom/performant_labs_20260502/templates/layout/page--articles.html.twig` (modified)
