# Handoff-S: Phase 8.4 — Feature-card grid renders 3-column at desktop

**Date:** 2026-05-09
**Branch:** `aa/pl-homepage-phase-8.4-card-grid-desktop`
**Issue:** `docs/pl2/handoffs/phase-8.4-card-grid-desktop-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/phase-8.4-card-grid-desktop-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/phase-8.4-card-grid-desktop-F.md`
**Operator-facing report:** [`phase-8.4-card-grid-desktop-report.html`](phase-8.4-card-grid-desktop-report.html)
**Audit scope:** sub-cycle 8.4 only — feature-card section + 8.2 regression check.

---

## T precondition

Confirmed: T reported zero blocking issues. All 7 acceptance criteria PASS in T1+T2.

## Tool preconditions (S environment)

- Playwright resolved at `node_modules/playwright/package.json` — confirmed.
- ImageMagick `compare` available at `/opt/homebrew/bin/compare` — confirmed.
- Static preview server at `http://localhost:8765/homepage.html` returned HTTP 200 (started during this audit from `docs/pl2/Previews/`).
- Live URL `https://pl-performantlabs.com.3.ddev.site:8493/` returned HTTP 200 with the mkcert root CA.
- Screenshots captured at 1280×800, 768×1024, 375×667 for both live and preview via Playwright (`chromium.launch({ headless: true })` with `ignoreHTTPSErrors`). Saved to `docs/pl2/handoffs/screenshots/cycle-8.4/`.

---

## Tier 3 visual audit

### Whole-page diff results (informational; whole-page deltas remain in line with cycle-8.2 because other sections are unaddressed sub-cycles)

| Viewport | Live PNG | Preview PNG | Diff PNG | Composite | Pixels different (5% fuzz) | Whole-page delta |
|---|---|---|---|---|---|---|
| 1280×800  | `t3-homepage-1280-live-20260509.png`  | `t3-homepage-1280-preview-20260509.png`  | `t3-homepage-1280-diff-20260509.png`  | `t3-homepage-1280-composite-20260509.png`  | 3,883,900 | 54.62% |
| 768×1024  | `t3-homepage-768-live-20260509.png`   | `t3-homepage-768-preview-20260509.png`   | `t3-homepage-768-diff-20260509.png`   | `t3-homepage-768-composite-20260509.png`   | 2,233,280 | 44.42% |
| 375×667   | `t3-homepage-375-live-20260509.png`   | `t3-homepage-375-preview-20260509.png`   | `t3-homepage-375-diff-20260509.png`   | `t3-homepage-375-composite-20260509.png`   | 1,312,360 | 44.30% |

These whole-page numbers are not the verdict input. They are dominated by sections that are out of scope for sub-cycle 8.4 — header (8.1), hero whitespace at 1280 (8.5), footer-CTA / FAQ icons / footer casing (8.6). Whole-page deltas are nearly identical in magnitude to cycle-8.2's report, confirming that no new whole-page regressions were introduced.

### Feature-card section crops — verdict input

| Viewport | Live crop | Preview crop | Crop diff | Crop composite | Pixels different (5% fuzz) | Section delta |
|---|---|---|---|---|---|---|
| 1280 | `t3-homepage-features-1280-live-crop-20260509.png` | `t3-homepage-features-1280-preview-crop-20260509.png` | `t3-homepage-features-1280-diff-20260509.png` | `t3-homepage-features-1280-composite-20260509.png` | 56,550 | 9.56% |
| 768  | `t3-homepage-features-768-live-crop-20260509.png`  | `t3-homepage-features-768-preview-crop-20260509.png`  | `t3-homepage-features-768-diff-20260509.png`  | `t3-homepage-features-768-composite-20260509.png`  | 59,459 | 7.53% |
| 375  | `t3-homepage-features-375-live-crop-20260509.png`  | `t3-homepage-features-375-preview-crop-20260509.png`  | `t3-homepage-features-375-diff-20260509.png`  | `t3-homepage-features-375-composite-20260509.png`  | 59,043 | 10.73% |

The 7–11% per-section deltas are entirely **content-height** deltas (live cards include richer chrome — kicker bar, "01 / TOOLS"-style eyebrows, corner arrow icon — that the simpler preview HTML does not reproduce). They are NOT layout-pattern deltas. Layout-pattern correctness is verified directly via card-position measurement below.

### Layout-pattern verification (card-position measurement, Playwright `getBoundingClientRect`)

| Viewport | Card 1 (Tools) y/x/w | Card 2 (AI) y/x/w | Card 3 (People) y/x/w | Layout pattern | Spec | Result |
|---|---|---|---|---|---|---|
| 1280 | 1744 / 71  / 305 | 1744 / 480 / 305 | 1744 / 889 / 305 | 3-column single row | 3 cols at desktop | MATCH |
| 768  | 1926 / 50  / 278 | 1926 / 425 / 278 | 2476 / 50  / 278 | 2 + 1 (cards 01 & 02 row 1; card 03 row 2) | 2 cols at md (768) | MATCH |
| 375  | 2245 / 34  / 291 | 2771 / 34  / 291 | 3273 / 34  / 291 | 1 column stacked | 1 col at sm | MATCH |

All three cards share `top` Y at 1280 → single row. Cards 01 & 02 share `top` Y at 768 (1926) and card 03 wraps to row 2 (2476) → 2+1. All three cards have distinct `top` values at 375 → stacked.

### Per-section delta description (red-region narrative)

- **Feature cards 1280**: red bands in the diff appear as horizontal stripes between card top and card bottom, tracking the height delta between live cards (422 px tall) and preview cards (314 px tall). No horizontal misalignment of column boundaries — cards are vertically aligned and equally spaced left, center, right. F documented this content-richness delta implicitly via the Phase-4.1 card-chrome work that is unchanged. **MATCH for layout.**
- **Feature cards 768**: red region traces the cumulative height difference. Live: 2+1 (matches brief). Preview: 1-column stacked (the static HTML mockup uses a different responsive rule). The brief and the issue both specify 2 columns at 768; live correctly follows the brief. **MATCH for brief; preview/brief contradiction is a known issue with the preview file.**
- **Feature cards 375**: red region is again pure height delta. Live and preview both stack 1-column. **MATCH.**

### Brief / issue contradiction surfaced

The static preview at 768 collapses to 1 column for the feature-card section. The brief's "Responsive behavior" table and the issue's acceptance criteria both specify 2 columns at 768. The live render correctly follows the brief. Recommend: either the preview file is updated in a future maintenance cycle to render 2-col at 768, or this divergence is documented in the brief as "preview is a 1280-only mockup." Non-blocking for this audit; the issue's acceptance criterion (#3) explicitly says "Tablet (768) renders 2 columns (preserve)" so the brief is authoritative here.

### Desktop (1280px)

- Feature-card grid: three cards land at left positions 71 / 480 / 889 px, each 305 px wide, all at top Y 1744. Single 3-column row confirmed. MATCH.
- No horizontal overflow: document scroll width 1265 px (< 1280). MATCH.
- Card chrome (kicker, eyebrow, corner arrow): rendered correctly per F handoff and T2-4 verification. MATCH.

### Tablet (768px)

- Feature-card grid: 2+1 layout (cards 01 & 02 row 1 at top 1926; card 03 row 2 at top 2476). Matches brief's 2-column responsive spec. MATCH.
- No horizontal overflow: document scroll width 753 px (< 768). MATCH.
- Hero band: byte-identical to cycle-8.2 live screenshot (verified via 0 px diff). 8.2's `.hero.theme--white { padding-inline: 0 }` fix preserved. MATCH.
- Logo grid: whole-page 768 live image is byte-identical to cycle-8.2 live image, so logo-grid `flex-wrap: nowrap` at `min-width: 992px` is preserved. (Note: logo-grid wraps below 992 by design — at 768 it wraps; at 1280 it does not.) MATCH for non-regression.

### Mobile (375px)

- Feature-card grid: 1-column stack. Tops 2245 / 2771 / 3273. MATCH.
- No horizontal overflow: document scroll width 360 px (< 375). MATCH.
- Touch targets: not changed in this phase; cards are full-width with H3-link pattern unchanged. MATCH (no new interactive elements).

## Design brief compliance (feature-card section only)

| Token | Brief value | Rendered value | Match |
|---|---|---|---|
| Grid columns at desktop (≥992) | `repeat(3, 1fr)` | `345.266px × 3` (per F's Playwright; verified visually) | YES |
| Grid columns at md (768–991) | `repeat(2, 1fr)` | `317.516px × 2` (per F's Playwright; verified visually) | YES |
| Grid columns at sm (<768) | `1fr` | full-width single column | YES |
| Card chrome (kicker bar, eyebrow, corner arrow) | preserved from Phase 4.1 | rendered correctly on all 3 cards | YES |
| No `!important` | required | confirmed: `git diff main -- '*.css'` empty (zero CSS file changes) | YES |
| No horizontal overflow | required | document width < viewport at 1280 / 768 / 375 | YES |

Color and typography tokens are out of scope for this sub-cycle (no color or font changes were made; F's `git diff main -- '*.css'` is empty).

## WCAG 2.2 AA audit (delta from cycle-8.2 baseline)

This sub-cycle made no CSS or markup-structure changes (only a Canvas DB additional_classes update). All WCAG-relevant structural checks are unchanged from cycle-8.2 and re-confirmed by T's T2 pass.

| Check | Result | Notes |
|-------|--------|-------|
| Keyboard navigation | PASS (unchanged from 8.2) | No new focusable elements introduced |
| Focus ring visibility | PASS (unchanged from 8.2) | No focus-style changes in this phase |
| Forced-colors mode | PASS (unchanged from 8.2) | No new component CSS |
| Reduced-motion | PASS (unchanged from 8.2) | No animation changes |
| 200% zoom | PASS | No new content; layout reflows correctly via existing media queries |
| Heading hierarchy | PASS | Single H1, no skipped levels — re-verified by T2-1 |
| Image alt text | PASS (unchanged from 8.2) | No new images |
| Mobile touch targets (375px) | N/A | No new interactive elements; cards retained from prior cycles |
| Mobile typography scale | PASS | No typography changes; 375 layout matches brief |
| Mobile layout | PASS | 1-column stack at 375; no horizontal scroll (doc 360 < viewport 375) |

## Static preview comparison (section-by-section, in scope)

| Section | Live vs Preview | Status |
|---|---|---|
| Feature-card grid at 1280 | Both render 3 cards in a single row. Live cards taller due to richer chrome (kicker, eyebrow, corner arrow); preview cards are simpler. Layout pattern matches. | MATCH (layout); content-height delta is non-blocking and expected. |
| Feature-card grid at 768 | Live: 2+1. Preview: 1-column stacked. The brief specifies 2 columns at 768; live follows the brief. The preview file's responsive rule for 768 is a 1-column collapse, which is a known divergence between the static preview and the design brief. | MATCH brief; the preview file should be the next-touched item if visual parity to the preview at 768 is required. |
| Feature-card grid at 375 | Both render 1-column stacks. Live cards taller due to chrome. Layout pattern matches. | MATCH. |

## Regression check vs Phase 8.2

| Check | Result | Evidence |
|---|---|---|
| Hero band 768: `.hero.theme--white { padding-inline: 0 }` not regressed | PASS | Hero-band crop diff between cycle-8.2 live PNG and cycle-8.4 live PNG: **0 differing pixels**. The whole-page 768 live PNG is byte-identical between cycles. |
| Logo-grid 768: `flex-wrap: nowrap` at `min-width: 992px` not regressed | PASS | Whole-page 768 live PNG is byte-identical between cycle-8.2 and cycle-8.4. CSS file is unchanged on this branch (`git diff main -- '*.css'` empty). |
| 1280 horizontal overflow not reintroduced | PASS | Document width 1265 px < 1280 (Playwright measurement). |
| 1280 changes isolated to feature-card section | PASS | Diff between cycle-8.2 and cycle-8.4 1280 live PNGs starts at row 1744 (feature-card top) and below; all visible bands below that are pure y-shift consequences of the page becoming 229 px shorter (cards collapsed from 2 rows to 1 row). No new visual changes elsewhere on the page. |

Saved regression diff: `docs/pl2/handoffs/screenshots/cycle-8.4/t3-homepage-1280-regression-vs-8.2-20260509.png`.

## Acceptance criteria check (issue document)

| # | Criterion | S verdict |
|---|---|---|
| 1 | Step-3 trace surfaced before any CSS change. | PASS — F handoff documents the bottom-up + top-down trace. |
| 2 | Desktop 1280 renders single 3-column row. | PASS — three cards at top Y 1744, left 71/480/889, width 305 each. |
| 3 | Tablet 768 renders 2 columns. | PASS — 2+1 with cards 01 & 02 at row 1, card 03 at row 2. |
| 4 | Mobile 375 renders 1 column. | PASS — three cards stacked at distinct top Y values. |
| 5 | No horizontal overflow at any viewport. | PASS — doc widths 1265 / 753 / 360. |
| 6 | Card chrome unchanged. | PASS — kicker / eyebrow / corner arrow preserved per T2-4. |
| 7 | No `!important`; explicit-path staging; component_version handling. | PASS with advisory: F retained `component_version` (rationale documented in T's advisory note — empty value triggers Canvas 500). Acceptable deviation. |

## Verdict

**PASS** — all sub-cycle 8.4 acceptance criteria met. Feature-card grid renders 3 / 2+1 / 1 columns at 1280 / 768 / 375. Phase 8.2 hero-band and logo-grid fixes preserved (0 px regression). No horizontal overflow at any viewport. Ready for O to commit (overlay YAML + handoff docs) and merge.

## Advisory notes

- **Out-of-scope deltas remain.** Whole-page deltas at 44–55% are dominated by sections still pending in sub-cycles 8.1 (header), 8.5 (hero whitespace at 1280), and 8.6 (footer CTA / FAQ icons / footer casing). These are expected and do not block this verdict.
- **Preview at 768 contradicts the brief.** The static preview file at `docs/pl2/Previews/homepage.html` collapses the feature-card grid to 1 column at 768, while the brief and issue specify 2 columns. The live correctly follows the brief; the preview file is the divergent artifact. Non-blocking. Suggest a maintenance task at some point to bring `homepage.html` preview's `.features__grid` 768 rule in line with the brief, so the preview reflects the operator-approved spec end-to-end.
- **`component_version` retention.** Documented in T's advisory note. The retained hash `ba954a2accbc0f5c` is the only valid value for the `sdc.dripyard_base.grid-wrapper` config entity at this time; setting it to NULL produces a 500 error. Acceptable deviation from the "set to NULL on Canvas-script touch" rule.
- **Overlay YAML is untracked.** `content-exports/homepage-phase-8.4-card-grid.overlay.yml` exists on disk but is not yet staged. Operator should stage it explicitly during the merge commit (per T's advisory note).
