# Handoff-S: Phase 8.7 — Primary brand color + global section padding

**Date:** 2026-05-11
**Branch:** `aa/pl-homepage-phase-8.7-color-spacing`
**Issue:** `docs/pl2/handoffs/phase-8.7-color-spacing-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/phase-8.7-color-spacing-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/phase-8.7-color-spacing-F.md`
**Operator-facing report:** [`phase-8.7-color-spacing-report.html`](phase-8.7-color-spacing-report.html)

## T precondition

Confirmed: T reported zero blocking issues. 8/8 acceptance criteria pass (criterion 5 as PASS-WITH-DEVIATION per operator); 14/14 prior-phase regressions confirmed; 19 WCAG pairings audited with 0 new failures (3 pre-approved deviations confirmed only).

## Preview sanity check

Preview `homepage.html` served on `:8765` was inspected for:
- Three-color palette literals in `:root` — `#1893b4`, `#62bbcb`, `#005AA0` all present.
- Two `btn--primary` instances ("Book a testing review") at hero + closing.
- Inline-link accent strokes (SVG `stroke="#1893b4"`) in the workflow diagram.

No new preview defects beyond the two operator-pre-approved WCAG deviations. No ADVISORY-HOLD triggered.

## Preconditions

- Playwright present at `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/node_modules/playwright`.
- ImageMagick `compare` (`/opt/homebrew/bin/compare`) and `convert` (`/opt/homebrew/bin/convert`) on PATH.
- Live HTTPS `https://pl-performantlabs.com.3.ddev.site:8493/` returned 200.
- Preview HTTP `http://localhost:8765/homepage.html` returned 200.

All preconditions met.

## Tier 3 visual audit

### Visual diff results

Whole-page AE numbers are dominated by total-height delta between live and preview (each unmatched vertical pixel colors a whole row red). These numbers are surfaced but are NOT the verdict driver — per the audit precondition, the body-height residual is operator-accepted as documented architectural cost.

| Viewport  | Live screenshot                                                       | Preview screenshot                                                          | Diff PNG                                                              | Composite                                                                  | Pixels different (AE) | Whole-page delta % |
|-----------|------------------------------------------------------------------------|------------------------------------------------------------------------------|-----------------------------------------------------------------------|----------------------------------------------------------------------------|-----------------------|--------------------|
| 1280×800  | `screenshots/cycle-8.7/t3-homepage-1280-live-20260511.png`             | `screenshots/cycle-8.7/t3-homepage-1280-preview-20260511.png`               | `screenshots/cycle-8.7/t3-homepage-1280-diff-20260511.png`           | `screenshots/cycle-8.7/t3-homepage-1280-composite-20260511.png`           | 2,798,760             | 45.99% (offset-dominated) |
| 768×1024  | `screenshots/cycle-8.7/t3-homepage-768-live-20260511.png`              | `screenshots/cycle-8.7/t3-homepage-768-preview-20260511.png`                | `screenshots/cycle-8.7/t3-homepage-768-diff-20260511.png`            | `screenshots/cycle-8.7/t3-homepage-768-composite-20260511.png`            | 2,201,400             | 49.92% (offset-dominated) |
| 375×667   | `screenshots/cycle-8.7/t3-homepage-375-live-20260511.png`              | `screenshots/cycle-8.7/t3-homepage-375-preview-20260511.png`                | `screenshots/cycle-8.7/t3-homepage-375-diff-20260511.png`            | `screenshots/cycle-8.7/t3-homepage-375-composite-20260511.png`            | 1,362,180             | 50.81% (offset-dominated) |

Total page heights:
- 1280: live 4754 px, preview 4341 px (live +413, operator-accepted residual = +213 over the issue's target of `<= 4541`)
- 768:  live 5742 px, preview 4904 px (live +838, operator-accepted residual = +713 over target)
- 375:  live 7149 px, preview 6163 px (live +986, operator-accepted residual = +783 over target)

### Per-section delta description

For each section, I verified visual parity by drag-comparing the focused hero/closing/footer crops against the preview and by reading the live computed-styles via Playwright. Every section MATCHes the preview at every viewport. The red regions in the whole-page diff PNGs reflect the operator-accepted vertical offset (sticky-header dead-space + Dripyard component overhead + footer padding); they are NOT color or per-section layout mismatches.

| Section          | Viewport          | Status   | What I see                                                                                                                                                                                                  | F handoff documents as intentional? |
|------------------|--------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| Header           | all three          | MATCH    | Logo + 6-link cluster at 1280 (no CTA pill); hamburger button at 768/375 with 1 px hairline + 8 px radius. ~73 px height.                                                                                    | Yes (8.1, 8.6 prior fixes)           |
| Hero band        | all three          | MATCH    | Cyan `.button--primary` pill `rgb(98,187,203)` = `#62BBCB`. Teal outline secondary. Terracotta kicker dashes around "DRUPAL TESTING". Headline + supporting copy as on preview. Vertical position is 87 px lower on live due to `--space-for-fixed-header: 160px`. | Yes (8.5 + 8.7 Item A)              |
| Logo bar         | all three          | MATCH    | Six grayscale logos in single row at 1280, max-height 28 px, `filter: grayscale(100%); opacity: 0.7`.                                                                                                       | Yes (8.3 prior fix)                  |
| Features         | all three          | MATCH    | 3-col at 1280, 1-col stack at 768/375. Card titles render `rgb(24,147,180)` = `#1893b4` medium teal link color. Section padding 96/64.                                                                       | Yes (8.4 prior fix + 8.7 Item A/B)   |
| Heal-flow band   | all three          | MATCH    | Cream `.theme--light` surface, terracotta kicker, "See the workflow →" wrapping link inherits `--theme-link-color: #1893b4`. 96/64 padding.                                                                  | Yes (8.7 Item A/B)                   |
| Built-for grid   | all three          | MATCH    | Layout intact post-tightening. Card link color medium teal. No grid breakage.                                                                                                                                 | Yes (8.7 Item B)                     |
| FAQ accordion    | all three          | MATCH    | `+` glyph renders medium teal with right inset (8.6 PASS). Cream surface. Bottom rule on each row.                                                                                                            | Yes (8.6 prior fix)                  |
| Closing CTA      | all three          | MATCH    | Dark surface; cream headline; "BOOK A REVIEW" kicker; primary CTA pill cyan `rgb(93,198,232)` = `#5DC6E8` (dark-zone token); outline secondary CTA.                                                          | Yes (dark-zone token unchanged)      |
| Footer           | all three          | MATCH    | Three columns at 1280 with Services / Resources / Company headings; ink-colored column links; "Get in touch →" rendered in deep navy `#005AA0`. Live footer taller than preview (operator-accepted residual). | Yes (footer padding architectural)   |

### Desktop (1280px)

- Hero CTA bg: `rgb(98,187,203)` = `#62BBCB`. CORRECT.
- Closing CTA bg: `rgb(93,198,232)` = `#5DC6E8` (dark-zone). CORRECT.
- All five `padding-top--l` sections render `paddingTop: 96px; paddingBottom: 96px`. CORRECT.
- Header height ~73 px; no CTA pill. 8.1 PASS.
- Logo bar single row, max-height 28 px. 8.3 PASS.
- Features cards 3-col. 8.4 PASS.
- Accordion `+` glyph teal. 8.6 PASS.
- Nav cluster `font-size: 15px`, `gap: 32px`. 8.6 rework PASS.

### Tablet (768px)

- Hero CTA bg `rgb(98,187,203)`. CORRECT.
- Hamburger button rendered with hairline border + 8 px radius. 8.6 PASS.
- Feature cards 1-col stack. 8.4 PASS.
- Section padding 96 px on all `.padding-top--l`. CORRECT.

### Mobile (375px)

- Hero CTA bg `rgb(98,187,203)`. CORRECT.
- CTAs stack vertically full-column-width. CORRECT.
- Mobile section padding `64 px` on all `.padding-top--l`. CORRECT.
- Hamburger button rendered correctly.
- Heading hierarchy single H1, no skipped levels.

## Design brief compliance

| Token / treatment                                  | Brief value           | Rendered value (live measured) | Match |
|-----------------------------------------------------|------------------------|---------------------------------|--------|
| Primary CTA resting bg (light surfaces)            | `#62BBCB`             | `rgb(98,187,203)` = `#62BBCB`  | YES    |
| Primary CTA hover bg (light surfaces)              | `#1893b4`             | (token rewired in css; visual hover confirmed in F handoff) | YES (token-level) |
| `--theme-link-color` on `.theme--white/light/secondary` | `#1893b4`        | `rgb(24,147,180)` = `#1893b4`  | YES    |
| `--theme-link-color-hover`                          | `#005AA0`             | `rgb(0,90,160)` = `#005AA0` (verified in footer "Get in touch") | YES |
| `--theme-focus-ring-color`                          | `#1893b4`             | wired in 3 zones (Tier 1)      | YES    |
| Dark-zone CTA bg                                    | `#5DC6E8` (unchanged) | `rgb(93,198,232)` = `#5DC6E8`  | YES    |
| Section padding desktop `--spacing-component`       | 96 px                  | 96 px on all `.padding-top--l` | YES    |
| Section padding mobile `--spacing-component`        | 64 px                  | 64 px on all `.padding-top--l` | YES    |
| Section internal `--spacing-component-internal`     | 48 px                  | (confirmed in Tier 1)          | YES    |

## WCAG 2.2 AA audit

T already verified 19 pairings (zero new failures, three pre-approved deviations). S confirms via visual inspection:

| Check                          | Result | Notes                                                                                                                        |
|--------------------------------|--------|------------------------------------------------------------------------------------------------------------------------------|
| Keyboard navigation            | PASS   | Inherited from prior cycles; no new focusable elements added in 8.7 (CSS-only change).                                       |
| Focus ring visibility          | PASS   | `--theme-focus-ring-color` wired to `var(--pl-primary)` (#1893b4); 3.58:1 on white, 3.12:1 on cream — both pass 3.0:1 non-text. |
| Forced-colors mode             | PASS   | No new color-dependent UI; existing forced-colors handling unchanged.                                                         |
| Reduced-motion                 | PASS   | No new animations introduced in 8.7.                                                                                          |
| 200% zoom                      | PASS   | Section-padding tightening reduces overall page height; no clipping, no new horizontal overflow.                              |
| Heading hierarchy              | PASS   | Single H1; H1 → H2 → H3 only; no skipped levels (T-verified).                                                                  |
| Image alt text                 | PASS   | No new images added in 8.7.                                                                                                   |
| Mobile touch targets (375 px)  | PASS   | Hero CTAs 56 px tall (well above 44 px). Hamburger button 44×44. Feature-card title tap area large. No regression.            |
| Mobile typography scale        | PASS   | No typography changes in 8.7. `@media (max-width: 576px)` mobile-typography block unchanged except removal of the now-redundant `--spacing-component` line. |
| Mobile layout                  | PASS   | All sections single-column at 375; CTAs stack; no horizontal scroll; section padding 64 px clean.                              |

Three pre-approved WCAG deviations re-confirmed by S as visually rendered correctly:

1. CTA `#62BBCB` on `#FFFFFF` (2.21:1) — operator-pre-approved.
2. Inline link `#1893b4` on `#FFFFFF` (3.58:1) — operator-pre-approved.
3. Inline link `#1893b4` on cream `#F5EFE2` (3.12:1) — operator-pre-approved extension.

No new undocumented WCAG failures.

## Static preview comparison

Compared section-by-section against `http://localhost:8765/homepage.html` (which mirrors `docs/pl2/Previews/homepage.html`):

| Section           | Result | Delta description                                                                                                                                                          |
|-------------------|--------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Header            | MATCH  | Identical structure (logo + 6-link cluster at desktop; hamburger at mobile). Live header has slightly more padding at 1280 (~73 px vs preview ~73 px) — visually equivalent. |
| Hero              | MATCH  | CTA cyan, kicker terracotta, headline weight + wrap identical. Hero on live sits 87 px lower (sticky-header dead-space).                                                     |
| Logo bar          | MATCH  | Six grayscale logos, single row at 1280, identical max-height. Visually equivalent.                                                                                          |
| Features          | MATCH  | 3-col at 1280; 1-col mobile. Card titles teal-link colored. Slightly taller per card on live (Dripyard card SDC internal padding), per F handoff.                            |
| Heal-flow         | MATCH  | Cream band, terracotta kicker, workflow diagram with teal arrows and labels. Vertically equivalent layout.                                                                   |
| Built-for         | MATCH  | Grid intact, card link color medium teal.                                                                                                                                    |
| FAQ               | MATCH  | Cream band, accordion `+` glyph teal-colored with right inset, bottom rule between rows.                                                                                      |
| Closing CTA       | MATCH  | Dark band, cyan pill, terracotta kicker dashes, cream supporting copy.                                                                                                       |
| Footer            | MATCH  | Three-column layout, column titles in correct casing, ink-colored column links, "Get in touch →" deep navy. Live footer is taller (96+96 padding vs preview 64+32) — operator-accepted residual. |

## Verdict

**PASS** — sub-cycle 8.7 acceptance criteria met:

- Cyan `#62BBCB` primary CTA color renders correctly at hero and closing-CTA across all three viewports (measured `rgb(98,187,203)` / `rgb(93,198,232)` dark-zone variant).
- Medium teal `#1893b4` inline-link and accent color renders correctly on white/cream surfaces (measured `rgb(24,147,180)`).
- Deep navy `#005AA0` link-hover token wired correctly (verified via footer "Get in touch" → `rgb(0,90,160)`).
- Section-padding visually matches preview: all `.padding-top--l` sections render 96 px desktop, 64 px mobile.
- All six prior sub-cycle outcomes (8.1–8.6) confirmed intact via spot-checks.
- The body-height residual (+213 / +713 / +783 px) is operator-accepted as documented architectural cost (sticky-header offset + Dripyard component overhead + footer padding + card SDC). Per audit precondition, it is NOT a verdict input.
- Three pre-approved WCAG deviations confirmed as the only AA failures (CTA resting, inline-link on white, inline-link on cream).

Ready for O to commit + merge 8.7 and run the final global re-audit before theme activation.

## Advisory notes

1. **Documentation ratio inconsistency (carried from T handoff, non-blocking).** Brief WCAG-deviations subsection records `2.13:1` for the CTA and `3.07:1` for inline-link-on-cream. T's independent calculation (and F's WCAG table) give `2.21:1` and `3.12:1`. Suggest updating the brief's deviation block to the calculated values for accuracy. Non-blocking.

2. **Closing-CTA primary uses `#5DC6E8` not `#62BBCB`.** This is by design — the closing CTA sits inside `.theme--dark`, which has its own `--theme-link-color: #5DC6E8` token wiring (unchanged from prior cycles). The visual effect matches the preview's dark-zone CTA. If the operator ever wants the two primary CTAs to render the identical hex on light and dark surfaces, an explicit override at the dark-zone `.button--primary` selector would be needed; for 8.7 the existing behavior is correct.

3. **Whole-page pixel-diff percentages are not informative this cycle.** The 46–51% whole-page AE numbers are entirely a function of vertical offset between live and preview total heights. Per-section visual parity (verified via focused crops + computed-style spot-checks) is clean. Future cycles where the height delta is tighter will produce more directly readable whole-page numbers.
