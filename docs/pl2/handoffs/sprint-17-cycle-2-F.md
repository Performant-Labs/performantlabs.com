# Handoff-F: Sprint 17 Cycle 2 — Preview-doc batch (CARD + A + B + D)

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-17-cycle-2-preview-doc-batch`
**Issue:** `docs/pl2/handoffs/sprint-17-cycle-2-issue.md`

## Confirmation table (autonomous mode)

| Field | Value |
|---|---|
| Page | `/open-source-projects` |
| Issue | `sprint-17-cycle-2-issue.md` |
| Branch | `aa/pl-sprint-17-cycle-2-preview-doc-batch` |
| Sprint / cycle | Sprint 17 / Cycle 2 |
| Input documents read | sprint-17-cycle-2-issue.md, sprint-17-cycle-1-audit.md, open-source-projects.html (preview), live `/open-source-projects` (curl) |
| Acceptance criteria count | 7 |
| Handoff path | `docs/pl2/handoffs/sprint-17-cycle-2-F.md` |
| CSS workflow path | N/A (preview-doc only; no live theme CSS) |
| Component schema source | N/A (preview-doc only) |

## What was done

- **`docs/pl2/Previews/open-source-projects.html`** — single file, four fixes:

1. **F-NEW-17-CARD (title-as-link restructure):** Replaced all 6 existing project-card footer links (`<a class="project-card__link">Read the docs</a>` / `View on Drupal.org` / `Read the build notes`) with title-as-link pattern: `<a class="project-card__title-link" href="..."><h3>Title</h3></a>`. Removed the `.project-card__link` CSS rules (footer link + arrow pseudo-element). Added `.project-card__title-link` CSS rules (`color: inherit`, hover to primary, no underline). All 7 cards now use this pattern (including Payment Stripe in section D).

2. **F-NEW-17-A (heading color token):** Added `--ink-strong: #1F1A14` CSS variable to `:root`. Changed `.hero h1` color from `var(--ink)` to `var(--ink-strong)`. Added explicit `color: var(--ink-strong)` to `.project-card h3` rule. All H1 + card H3 elements now compute `rgb(31, 26, 20)` matching live sitewide baseline.

3. **F-NEW-17-B (hero container width):** Changed `.hero__inner` max-width from `920px` to `1040px`. Hero H1 "What we maintain in the open" now fits on 1 line at 1280 viewport, matching live behavior.

4. **F-NEW-17-D (Payment Stripe card):** Converted the existing `module-chip` in section D to a `project-card` with title-as-link pattern. Removed all `.module-chip` CSS rules (no longer referenced). The card links to `https://www.drupal.org/project/payment_stripe` with body text "Stripe plugin for the Payment module." matching live content. Total project-card count is now 7.

## Layer decisions

All four fixes are preview-doc layer (static HTML file edit). No live theme files, no Drupal config, no component CSS touched. The preview file is a standalone HTML document with embedded `<style>` — all changes are within that single file.

| Fix | Layer | Rationale |
|---|---|---|
| CARD | Preview-doc (HTML + embedded CSS) | Structural HTML change to card markup + CSS class swap |
| A | Preview-doc (embedded CSS variable + rule) | Added `--ink-strong` token, pointed heading rules at it |
| B | Preview-doc (embedded CSS rule) | Widened `.hero__inner` max-width value |
| D | Preview-doc (HTML restructure) | Converted module-chip to project-card; removed orphaned CSS |

## Deviations from spec

1. **Card link URLs preserved from preview, not changed to match live.** Live ATK links to `drupal.org/project/automated_testing_kit`; preview links to `/automated-testing-kit`. Live Testor links to `github.com/Performant-Labs/testor`; preview links to `/testor`. The issue scope is "restructure cards to title-as-link" (structure), not "change link destinations" (content). Conservative interpretation: preserve existing preview URLs. The title-as-link structure matches live.

2. **Module-chip CSS removed entirely.** The `.module-chip` class is no longer referenced in the HTML after converting section D to use `project-card`. Removed the CSS rules to avoid dead code. The module-chip visual treatment (smaller padding, no logo placeholder) is replaced by the project-card treatment, which matches the card component pattern used across sections B and C.

3. **Section D project-card has no logo placeholder or lead paragraph.** Live's Payment Stripe card also has no logo image and no lead/strong text — just title + body. The preview matches live's minimal card content structure.

## Verification results (T1 + T2)

### T1: grep checks

```
$ grep -nE '#1F1A14|#2A2520' docs/pl2/Previews/open-source-projects.html
27:      --espresso: #1F1A14;
28:      --espresso-tint: #2A2520;
31:      --ink: #2A2520;
32:      --ink-strong: #1F1A14;
```
PASS — `#2A2520` only in variable definitions (ink, espresso-tint). `#1F1A14` in `--ink-strong` and `--espresso`. No heading rules reference `#2A2520` directly.

```
$ grep -nE 'max-width:\s*1040px' docs/pl2/Previews/open-source-projects.html
245:    .hero__inner { max-width: 1040px; margin: 0 auto; text-align: center; }
```
PASS — hero wrapper at 1040px.

```
$ grep -c 'class="project-card"' docs/pl2/Previews/open-source-projects.html
7
```
PASS — 7 project-card articles.

```
$ grep -c 'project-card__link\|Read the docs\|Read the build notes\|View on Drupal.org' docs/pl2/Previews/open-source-projects.html
0
```
PASS — no old footer links remain.

```
$ grep -c 'module-chip' docs/pl2/Previews/open-source-projects.html
0
```
PASS — no module-chip references remain.

### T2: Playwright probe at 1280

```
H1 color: rgb(31, 26, 20)                          PASS (matches live #1F1A14)
H1 line count (getClientRects): 1                   PASS (1 line at 1280)
H1 text: "What we maintain in the open"             PASS (no orphan)
Hero inner max-width: 1040px                        PASS
Total project-card count: 7                         PASS
Payment Stripe cards: 1                             PASS
Title-link <a> count: 7                             PASS (all cards have title-as-link)
Old footer .project-card__link count: 0             PASS
§D project-card count: 1                            PASS

All 7 card H3s compute color: rgb(31, 26, 20)       PASS

Heading hierarchy: H1 -> H2 -> H3 (correct)        PASS
All title links have descriptive accessible names   PASS (WCAG 2.4.4 improvement)
```

### T2: Structural checks

- Heading hierarchy: H1 (hero) -> 4x H2 (sections) -> 7x H3 (cards). Single H1. Correct.
- ARIA: Skip link present. Hamburger has `aria-label` + `aria-expanded`. SVG placeholders have `aria-hidden="true"`.
- No `!important` in file.
- No orphan word on H1 at 1280 (single line, 7 words).

## WCAG contrast ratios

| Element | Foreground | Background | Ratio | Requirement | Pass/Fail |
|---|---|---|---|---|---|
| Hero H1 (ink-strong on canvas) | `#1F1A14` | `#FFFFFF` | 17.27:1 | 4.5:1 (body) / 3.0:1 (large) | PASS |
| Card H3 on canvas (sections B, C) | `#1F1A14` | `#FFFFFF` | 17.27:1 | 3.0:1 (large, 22px 500wt) | PASS |
| Card H3 on cream (section B) | `#1F1A14` | `#F5EFE2` | 15.07:1 | 3.0:1 (large) | PASS |
| Title-link hover (primary on canvas) | `#1893B4` | `#FFFFFF` | 3.58:1 | 3.0:1 (large, 22px heading) | PASS |
| Title-link hover (primary on cream) | `#1893B4` | `#F5EFE2` | 3.12:1 | 3.0:1 (large, 22px heading) | PASS |
| Focus ring (primary outline) | `#1893B4` | `#FFFFFF` | 3.58:1 | 3.0:1 | PASS |

## Mobile responsive behavior

N/A — no responsive overrides added in this cycle. All four fixes operate on base (desktop) styles. The existing mobile breakpoint rules (991px, 767px, 575px) are unchanged and continue to apply. The H1 at mobile sizes (44px at <=767px) is unaffected by the `--ink-strong` color change and the `max-width: 1040px` hero container (which is wider than mobile viewports, so `max-width` has no mobile effect).

## Autonomous decisions

1. **CARD link URL preservation.** Live uses different link destinations for ATK (`drupal.org/project/automated_testing_kit` vs preview `/automated-testing-kit`) and Testor (`github.com/Performant-Labs/testor` vs preview `/testor`). The issue scope says "restructure cards to title-as-link (remove separate footer)" — this is a structural change, not a content/URL change. Conservative interpretation: keep existing preview URLs. Would have asked the operator in human-in-the-loop mode.

2. **Module-chip to project-card conversion in section D.** The existing Payment Stripe entry used a `module-chip` class with different visual treatment (smaller padding, no logo placeholder). Converting it to `project-card` matches the card component pattern across the page and satisfies the acceptance criteria grep for `project-card` count = 7. The module-chip CSS was removed as dead code. Would have confirmed the visual treatment change with the operator in human-in-the-loop mode.

3. **Section D card content — minimal (no logo, no lead).** Live's Payment Stripe card has no logo image and no bold lead paragraph — just title link + body text. Matched live's minimal content rather than adding a logo placeholder + lead that live does not have. Would have confirmed in human-in-the-loop mode.

4. **Removed module-chip CSS.** With the HTML conversion, the `.module-chip` rules became dead code. Removed them to keep the file clean. No functional impact since no HTML references the class.

## Known issues

None. All 7 acceptance criteria are met.

## Files changed

- `docs/pl2/Previews/open-source-projects.html` — preview-doc: 4 fixes (CARD restructure, A color token, B hero width, D Payment Stripe card conversion)
