# Handoff-S: Sprint 4 Cycle 5 — Site-wide a11y polish bundle (J.2 + A.2 + A.3 + D.4)

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-4-phase-5-a11y-polish`
**Issue:** `docs/pl2/handoffs/sprint-4-phase-5-a11y-polish-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/sprint-4-phase-5-a11y-polish-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/sprint-4-phase-5-a11y-polish-F.md`
**Operator-facing report:** [`sprint-4-phase-5-a11y-polish-report.html`](sprint-4-phase-5-a11y-polish-report.html)

## T precondition

T returned blocking on AC5 only (pa11y 4 errors across `/`, `/articles`, `/contact-us`). Operator-issued precondition override applies: all four pa11y errors are pre-existing operator-approved brand-color deviations recorded in `web/themes/custom/performant_labs_20260502/css/base.css` (button --primary 2.21:1 + breadcrumb link 3.12:1). These predate Cycle 5 and were not introduced by J.2/A.2/A.3/D.4 work. Per autonomous-mode recalibration ("AC literal-text vs cycle objective"), the cycle's stated objective is met; AC5's literal "0 errors" was authored without accounting for the operator's standing approved deviations.

**S treats T's AC5 block as non-blocking.** All other T checks passed cleanly. S proceeds with the focused audit per operator's spawn-prompt scope.

## Tier 3 visual audit

Visual regression check on `/articles` only. The single code change is a DOM-parent move of `<section class="page-title">` from sibling-of-`<main>` to first-content-child-of-`<main>`. F asserts `.page-title` CSS is position-independent; this audit confirms that assertion via pixel-level diff.

Method: stash the template change to capture **baseline**, restore to capture **cycle-5**, ImageMagick `compare -metric AE`. DDEV cache cleared between captures.

### Visual diff results

| Viewport | Baseline | Cycle-5 | Diff PNG | Composite | Pixels different | Whole-page delta |
|---|---|---|---|---|---|---|
| 1280 × 800 | `screenshots/cycle-5/t3-articles-1280-baseline-20260511.png` | `screenshots/cycle-5/t3-articles-1280-cycle5-20260511.png` | `screenshots/cycle-5/t3-articles-1280-diff-20260511.png` | `screenshots/cycle-5/t3-articles-1280-composite-20260511.png` | **0** | **0.0000%** |
| 375 × 667  | `screenshots/cycle-5/t3-articles-375-baseline-20260511.png`  | `screenshots/cycle-5/t3-articles-375-cycle5-20260511.png`  | `screenshots/cycle-5/t3-articles-375-diff-20260511.png`  | `screenshots/cycle-5/t3-articles-375-composite-20260511.png`  | **0** | **0.0000%** |

768 viewport omitted: F introduced no responsive overrides; with 0-pixel delta at both desktop and mobile bookends, an intermediate breakpoint would not change verdict.

### Per-section delta description

All sections MATCH. No red regions in either diff PNG. Cream-band page-title section, kicker, H1, lede, category filters, and all six article cards render in pixel-identical positions before and after the DOM-parent change.

### Desktop (1280px)

- Header / breadcrumb: MATCH
- Page-title cream band (kicker + H1 + lede): MATCH (this is the section moved inside `<main>`; visual output identical)
- Category filter row: MATCH
- Article card grid (6 cards): MATCH
- Pager: MATCH (active page `<span aria-current="page">1</span>` confirmed by T)
- Footer: MATCH

### Mobile (375px)

- Same per-section MATCH as desktop. No mobile-specific regressions.

## Design brief compliance

N/A for this cycle. No new visual tokens introduced; no colors, type, or spacing modified. The change is purely structural (DOM parent only).

## WCAG 2.2 AA audit

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | PASS | Tab from top: skip-link → logo → 6 header nav links → breadcrumb "Home" → 5 category filters (in main) → 6 article-card titles (in main). Logical, no traps, no off-screen focus stops. |
| Focus ring visibility | PASS | Existing focus styles retained; no CSS modified. |
| Forced-colors mode | N/A (no new styles) | Cycle introduces no color or background changes. |
| Reduced-motion | N/A (no new motion) | Cycle introduces no transitions or animations. |
| 200% zoom | N/A (no layout change) | Page-title CSS position-independent; zoom behavior unchanged. |
| Heading hierarchy | PASS | Single H1 ("Articles.") inside `<main>`. Visually-hidden H2s scope landmark labels. H2-to-H3 skip on article cards pre-existing, out of scope. |
| Image alt text | N/A | Cycle modifies no images. |
| Mobile touch targets (375px) | PASS | No interactive elements added or modified. Existing targets unchanged. |
| Mobile typography scale | PASS (unchanged) | No type changes. |
| Mobile layout | PASS (unchanged) | 0-pixel delta vs baseline. |

## Static preview comparison

N/A — Cycle 5 has no static preview. The work is structural a11y polish, not a brief-driven visual overhaul.

## Acceptance criteria (S's scope per spawn prompt)

| # | Criterion | Status |
|---|---|---|
| 1 | `<section class="page-title">` renders inside `<main>` on `/articles` | PASS — DOM line 459 inside main 456–829; confirmed by independent curl + sed inspection |
| 2 | No visual regression on `/articles` from the DOM move | PASS — 0 pixels different at 1280 and 375 |
| 3 | Heading hierarchy clean | PASS — single H1 in `<main>`; visually-hidden H2 landmarks; no new skips |
| 4 | Keyboard focus order logical | PASS — Tab order matches visual reading order; page-title section correctly contributes zero focus stops (static text) |

## Verdict

**PASS** — Cycle 5's DOM-parent change for `<section class="page-title">` is visually zero-impact (0 px / 0.0000% delta at both 1280 and 375), the moved section sits correctly inside `<main>` between the skip-target anchor and the article listing, heading hierarchy is clean (single H1 in main), and Tab focus order is logical. T's AC5 block is non-blocking per operator's precondition override (pre-existing approved deviations). Ready for O to commit.

## Advisory notes

1. **base.css contrast-comment inaccuracies** carried forward from T's advisories — `#1893b4` on cream is 3.12:1 (comment says 3.07:1); `#62BBCB` bg + white is 2.21:1 (comment says 2.13:1). Minor; correct comments in a future cycle.
2. **`/articles-2` 404** — issue URL was wrong; F's substitution to `/articles?page=1` is correct.
3. **h2-to-h3 skip on article cards** — pre-existing, not in scope. Worth a future backlog item but no action this cycle.
4. **Pa11y CI ignore-list for approved deviations** — future hygiene: add `.pa11yci.json` with `ignore` selectors for the two pre-approved deviation tokens so AC5-style "0 errors" criteria can be evaluated literally going forward. This would prevent the AC-literal-vs-objective reinterpretation needed here.
