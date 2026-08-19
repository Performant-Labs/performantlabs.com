# Handoff-F: Sprint 18 Cycle 2 — `/articles` preview-doc batch

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-18-cycle-2-preview-doc-batch`
**Issue:** `docs/pl2/handoffs/sprint-18-cycle-2-issue.md`

## Confirmation table (autonomous mode)

| Field | Value |
|---|---|
| Page | `/articles` preview doc |
| Issue | sprint-18-cycle-2-issue.md |
| Branch | `aa/pl-sprint-18-cycle-2-preview-doc-batch` |
| Runbook phase | Preview-doc fixes (docs-only) |
| Input documents read | sprint-18-cycle-2-issue.md, articles.html |
| Acceptance criteria count | 7 (6 fixes + no-!important) |
| Handoff path | `docs/pl2/handoffs/sprint-18-cycle-2-F.md` |
| CSS workflow | N/A (preview-doc inline styles, not live CSS layers) |
| Component schema SoT | N/A (preview-doc, no .component.yml) |

## What was done

- **`docs/pl2/Previews/articles.html`** — six fixes applied:
  - **A.** Chip + pagination active-state color: `.chip.is-active` and `.pagination .is-current` backgrounds changed from `var(--primary)` (#1893B4) to `var(--primary-deep)` (#005AA0), matching DDEV live computed `rgb(0, 90, 160)`.
  - **B.** Card border: `.article-card` border changed from `var(--hairline)` (#E5E1DC) to new `--card-border: #8E867A` token. Live DDEV computed value confirmed as `rgb(142, 134, 122)` = `#8E867A` (audit estimate was exact).
  - **C.** Card H3 link color: `.article-card h3 a` changed from `var(--ink)` (#2A2520) to `var(--espresso)` (#1F1A14), applying Sprint 13-16 sitewide ink-strong canonicalization.
  - **D.** Chip order: swapped "Talks" and "Open source" to match live ordering (All, Automated Testing, Cypress, Open source, Talks).
  - **E.** Mobile chip padding: added `@media (max-width: 767px)` rule `.chip { padding: 15px 16px; }` so chip height reaches 46px (above 44px WCAG 2.5.8 floor).
  - **F.** Skip-link: changed `href="#main"` to `href="#main-content"`. Replaced `<main id="main" role="main">` with `<main role="main">` plus `<a id="main-content" tabindex="-1"></a>` inside, matching live Drupal's skip-link target pattern.

## Layer decisions

All changes are in a preview-doc (static HTML with inline `<style>`). No live CSS layers involved. The 7-step workflow does not apply to docs-only preview files.

## Deviations from spec

None.

## Verification results (T1 + T2)

### T1: grep checks

```
A: .chip.is-active bg/border = var(--primary-deep) -- confirmed lines 294-296
A: .pagination .is-current bg/border = var(--primary-deep) -- confirmed lines 407-409
B: --card-border: #8E867A defined line 40, used line 312
C: .article-card h3 a { color: var(--espresso) } -- confirmed line 363
D: Chip order: Automated Testing, Cypress, Open source, Talks -- lines 545-548
E: .chip { padding: 15px 16px } in mobile MQ -- line 469
F: href="#main-content" -- line 482; id="main-content" -- line 517
Negative: no old values (is-active+primary without -deep: 0, href="#main" without -content: 0, article-card+hairline: 0)
```

### T2: Playwright at 1280px

```
Chip active bg:        rgb(0, 90, 160) -- PASS (matches live)
Pagination active bg:  rgb(0, 90, 160) -- PASS (matches live)
Card border-color:     rgb(142, 134, 122) -- PASS (matches live)
H3 link color:         rgb(31, 26, 20) -- PASS (#1F1A14 ink-strong)
Chip order:            ["Automated Testing","Cypress","Open source","Talks"] -- PASS
Skip-link href:        #main-content, target exists (<A> tag) -- PASS
```

### T2: Playwright at 375px

```
Chip heights: All=46px, Automated Testing=46px, Cypress=46px, Open source=46px, Talks=46px
All >= 44px: PASS
No orphan words: all chip labels fit single-line at 375px width
Card border at 375: rgb(142, 134, 122) -- PASS (consistent across viewports)
```

## WCAG contrast ratios

| Element | Foreground | Background | Ratio | Requirement | Pass/Fail |
|---|---|---|---|---|---|
| Chip active text | #FFFFFF | #005AA0 | 7.07:1 | 4.5:1 (14px body) | PASS |
| Pagination active text | #FFFFFF | #005AA0 | 7.07:1 | 4.5:1 (14px body) | PASS |
| Card border vs surface | #8E867A | #FFFFFF | 3.60:1 | 3.0:1 (1.4.11 non-text) | PASS |
| H3 link on white card | #1F1A14 | #FFFFFF | 17.27:1 | 4.5:1 (body text) | PASS |
| H3 link on cream card | #1F1A14 | #F5EFE2 | 15.07:1 | 4.5:1 (body text) | PASS |

## Mobile responsive behavior

- **Fix E: chip tap-target padding.** At `@media (max-width: 767px)`, `.chip` padding changed from 9px to 15px vertical. Computed chip height = 46px at 375px viewport, exceeding the 44px WCAG 2.5.8 minimum. All chip labels remain single-line at 375px -- no orphan-word risk. Font-size (14px) and line-height (1) unchanged.

## Autonomous decisions

1. **Card border token strategy.** Added a new CSS custom property `--card-border: #8E867A` in `:root` rather than hardcoding `#8E867A` directly in the `.article-card` rule. This follows the existing variable-first pattern in the preview doc (e.g., `--hairline`, `--canvas`). The `.article-card--text` variant retains `border-color: transparent` and is unaffected.

2. **Skip-link target pattern.** Live Drupal uses `<a id="main-content" tabindex="-1"></a>` as a separate anchor element inside `<main>`, rather than an `id` on `<main>` itself. Matched this pattern exactly: removed `id="main"` from the `<main>` tag and added the anchor element.

3. **Probed DDEV local (port 8493) rather than production** for card border color, since the DDEV site is the implementation target. The computed value `rgb(142, 134, 122)` = `#8E867A` confirmed the audit estimate exactly.

## Known issues

None.

## Files changed

- `docs/pl2/Previews/articles.html`
