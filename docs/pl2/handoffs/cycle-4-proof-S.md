# Handoff-S: Cycle 4 - § proof / wordmark strip preview fidelity

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-5-cycle-4-proof`
**Issue:** `docs/pl2/handoffs/cycle-4-proof-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/cycle-4-proof-T-rework.md` (PASS)
**Handoff-F reviewed (initial):** `docs/pl2/handoffs/cycle-4-proof-F.md`
**Handoff-F reviewed (rework):** `docs/pl2/handoffs/cycle-4-proof-F-rework.md`
**Operator-facing report:** [`cycle-4-proof-report.html`](cycle-4-proof-report.html)

## T precondition

Confirmed: T's rework handoff reports zero blocking issues. The original T blocker (wordmark contrast 4.47:1 at opacity 0.8) was resolved by F's rework (opacity removed → 7.43:1). All 10 AC marked PASS.

## Preview sanity check

The preview's own `.logo-bar__row span` rule uses `opacity: 0.8`, which is the root cause of the WCAG contrast violation that T blocked. F correctly deviated from the preview to satisfy WCAG (precedence: brief tokens & WCAG > preview). Logged as an advisory below; not a blocker since F+T have already resolved correctly.

## Tier 3 visual audit

Screenshots captured via Playwright at 1280×800, 768×1024, 375×667 for both live (`/services`) and preview (`docs/pl2/Previews/services.html`). Diffs and composites generated via ImageMagick.

### Visual diff results

| Viewport | Live screenshot | Preview screenshot | Diff PNG | Composite | Pixels different | Whole-page delta % |
|---|---|---|---|---|---|---|
| 1280×800 | `t3-proof-1280-live-20260511.png` | `t3-proof-1280-preview-20260511.png` | `t3-proof-1280-diff-20260511.png` | `t3-proof-1280-composite-20260511.png` | 210,944 / 1,054,720 | 20.0% |
| 768×1024 | `t3-proof-768-live-20260511.png` | `t3-proof-768-preview-20260511.png` | `t3-proof-768-diff-20260511.png` | `t3-proof-768-composite-20260511.png` | 163,262 / 648,192 | 25.2% |
| 375×667 | `t3-proof-375-live-20260511.png` | `t3-proof-375-preview-20260511.png` | `t3-proof-375-diff-20260511.png` | `t3-proof-375-composite-20260511.png` | 86,341 / 382,500 | 22.6% |

Whole-page deltas are in the 20–25% range. Per S protocol, that triggers a per-section decomposition. The deltas decompose entirely into four known, documented deltas (none of which is a regression of cycle-4 scope):

### Per-section delta description

| Section | Viewports | What's different | F documented as intentional? | Status |
|---|---|---|---|---|
| Vertical section padding | 1280, 768, 375 | Live's `dy-section` wrapper adds ~10–40 px more top padding than preview's `section.proof`. Causes a vertical shift that propagates through the rest of the diff. | Out of scope (theme-level section padding, not cycle-4 scope) | DELTA — out of scope |
| Dogfooding H2 line breaks | 1280, 768, 375 | Same text, different break points (fractional font-size/letter-spacing). | Out of scope (typography tokens are theme-level) | DELTA — out of scope |
| Dogfooding CTA button shape | 1280, 768, 375 | Live renders the canonical site primary-CTA pill with inset orange arrow chip; preview renders a minimal text pill. Same href, same label. | Out of scope (site-wide button theme) | DELTA — out of scope |
| Wordmark color | 1280, 768, 375 | Live wordmarks darker than preview because F removed `opacity: 0.8` to satisfy WCAG (T blocker). | YES — F-rework handoff §"WCAG contrast ratios"; T re-verified at 7.43:1 | INTENTIONAL — accepted |
| Wordmark wrap at 375 | 375 | Live wraps 4+2 (Drupal Playwright Cypress PHP / JavaScript React); preview wraps 3+3. | F-handoff §"Mobile responsive behavior" says "wraps to ~3 rows of 2" but actual render is 4+2; AC4 defers wrap pattern to F's judgment ("F decides based on preview behavior"). | DELTA — within AC4 latitude |
| Wordmark set + order | 1280, 768, 375 | Drupal, Playwright, Cypress, PHP, JavaScript, React — matches preview exactly. | YES — explicit in issue ("preview wins on 6 vs 8") | MATCH |
| "WE SPEAK" small-caps label | 1280, 768, 375 | Centered above wordmarks, 12px, 1.6 px letter-spacing, uppercase, #5C544C — matches preview. | YES | MATCH |
| Hairline strip borders | 1280, 768, 375 | `.wordmark-strip` carries 0.625 px solid #E5E1DC top + bottom; preview uses 1 px solid `--hairline`. Sub-pixel visual difference. | Not explicitly noted but within design-token interpretation | MATCH (negligible) |

### Desktop (1280px)

| Check | Result | Notes |
|---|---|---|
| Hairline-bounded strip renders | PASS | `.wordmark-strip` has top + bottom borders 0.625 px solid #E5E1DC |
| "WE SPEAK" small-caps label centered above wordmarks | PASS | 12px, 1.6px tracking, uppercase, #5C544C |
| 6 text wordmarks horizontally distributed | PASS | Drupal, Playwright, Cypress, PHP, JavaScript, React on a single row, evenly spaced |
| No raster logo images | PASS | 0 `<img>` in proof section per JS DOM audit |
| Dogfooding H2 + body + CTA preserved above strip | PASS | All three elements render; CTA functional |
| Wordmark color matches brief | PASS | #5C544C (--theme-text-color-medium) at full opacity |
| Wordmark typography matches preview tokens | PASS | Rubik 500 / 18px / -0.4px letter-spacing (preview specifies var(--font-display)/500/18px/-0.4px) |

### Tablet (768px)

| Check | Result | Notes |
|---|---|---|
| Wordmark row remains legible | PASS | Single-row layout retained (matches preview at 768) |
| No horizontal page scroll | PASS | Content fits in viewport |
| Hairline strip + label preserved | PASS | Visible and centered |

### Mobile (375px)

| Check | Result | Notes |
|---|---|---|
| Wordmark row wraps legibly | PASS | All 6 wordmarks legible; wraps to 4+2 |
| Mobile font-size override applied | PASS | 16px at <=576px per F's responsive CSS |
| No horizontal page scroll | PASS | Content fits |
| Hairline strip + label preserved | PASS | Padding reduces proportionally |
| Wrap matches preview exactly | DELTA | Live 4+2 vs preview 3+3. Within AC4 latitude ("F decides based on preview behavior"). |

## Design brief compliance

| Token | Brief value | Rendered value | Match |
|---|---|---|---|
| Wordmark color | --theme-text-color-medium (#5C544C) | rgb(92, 84, 76) = #5C544C | YES |
| Wordmark font family | --font-display (Rubik) | Rubik, Poppins, sans-serif | YES |
| Wordmark font weight | 500 | 500 | YES |
| Wordmark font size (desktop) | 18px | 18px | YES |
| Wordmark font size (mobile) | (not specified) | 16px | N/A — F discretion |
| Wordmark letter-spacing | -0.4px | -0.4px | YES |
| Label color | --theme-text-color-medium | rgb(92, 84, 76) | YES |
| Label font size | 12px | 12px | YES |
| Label letter-spacing | 1.6px | 1.6px | YES |
| Label text-transform | uppercase | uppercase | YES |
| Strip hairline color | --theme-border-color (#E5E1DC) | rgb(229, 225, 220) = #E5E1DC | YES |
| Strip padding (desktop) | not specified | 48px 0 | N/A — preview shows similar |
| Strip background | --canvas | white (default) | YES |

## WCAG 2.2 AA audit

| Check | Result | Notes |
|-------|--------|-------|
| Keyboard navigation | PASS | One focusable element in section (CTA link). Wordmarks are decorative `<div>` (no tabindex, no role). |
| Focus ring visibility | PASS | Inherits site-theme CTA focus ring (verified in Cycle 1 audit; unchanged). |
| Forced-colors mode | PASS | Wordmarks rely on `color` only; system text and border colors apply. No background-image-only or color-conveys-meaning patterns. |
| Reduced-motion | PASS | No transitions or animations on the wordmark strip CSS. |
| 200% zoom | PASS | Wordmarks reflow via flex-wrap; no clipping observed at 200% at 1280. |
| Heading hierarchy | PASS | Single H1; H1 → H2 → H3 with no skipped levels. Proof section is label-only (correct — preview has no `<h2>` in the wordmark strip). |
| Image alt text | PASS | No images in section (logo-grid removed by design). |
| Mobile touch targets (375px) | PASS | CTA: 56×255 px. Wordmarks: decorative, not subject to touch-target rule. |
| Mobile typography scale | PASS | 18px → 16px at <=576px per F's responsive override. |
| Mobile layout | PASS | No horizontal page scroll. Strip padding reduces 48→32 px; label margin 32→24 px proportional. |
| Wordmark text contrast | PASS | 7.43:1 vs white. Independently re-verified by T. AA threshold 4.5:1. Margin +2.93. |
| Label text contrast | PASS | 7.43:1 vs white. |

## Static preview comparison

Section by section against `docs/pl2/Previews/services.html` § `<section class="proof">` + `<div class="logo-bar">`:

| Section | Match status | Notes |
|---|---|---|
| Dogfooding kicker "DOGFOODING" | MATCH | Same text, same color (terracotta), same letter-spacing band, hairline rules on either side. |
| Dogfooding H2 | DELTA (out of scope) | Same text; wraps at different word boundaries due to fractional font-size/letter-spacing. |
| Dogfooding body paragraph | MATCH | Same text, same color, same width treatment. |
| Dogfooding CTA pill | DELTA (out of scope) | Live: canonical site primary-CTA pill with arrow chip. Preview: minimal text pill. Same label & href. Site-wide button theme; not in cycle-4 scope. |
| "WE SPEAK" label | MATCH | Same text, same small-caps treatment, centered. |
| Wordmark row (desktop) | MATCH | 6 wordmarks in correct order on a single row, evenly distributed. |
| Wordmark row (tablet) | MATCH | Single row retained. |
| Wordmark row (mobile) | DELTA (within AC4 latitude) | Live wraps 4+2 vs preview's 3+3. Both legible. |
| Hairline strip borders | MATCH (sub-pixel) | Live 0.625 px vs preview 1 px. Visually equivalent at 1× DPR. |
| Wordmark color (intentional WCAG-driven) | INTENTIONAL DEVIATION | Preview uses opacity 0.8 (4.47:1, WCAG fail). Live uses opacity 1.0 (7.43:1, WCAG pass). Brief tokens + WCAG > preview. |

## Verdict

**PASS** — all 10 acceptance criteria met, visual design intent matches preview, WCAG AA clean with 7.43:1 contrast margin, no `!important`, no regressions on /services /, /about-us per T's regression sweep. Ready for O to commit.

The whole-page pixel deltas (20–25%) decompose entirely into four expected differences: (1) section vertical padding from the theme's `dy-section` wrapper, (2) heading line-break variance from typography tokens, (3) the canonical site CTA-pill treatment, and (4) the intentional WCAG-driven wordmark color deviation. None is a regression of cycle-4 scope.

## Advisory notes

1. **Preview itself violates AA contrast.** `docs/pl2/Previews/services.html` line 354 sets `opacity: 0.8` on `.logo-bar__row span`, yielding 4.47:1. Consider updating the preview to remove opacity so the canonical reference is WCAG-clean and future S audits do not have to negotiate a "preview vs WCAG" precedence call.

2. **Brief is silent on services-page wordmark wrap at mobile.** The brief's "Logo bar" mobile note (line 484) explicitly describes the homepage component. The services-page wordmark wrap pattern is undefined. Live's 4+2 and preview's 3+3 are both legible; if a canonical wrap is desired for consistency, specify it in the brief or preview.

3. **CTA button styling.** The dogfooding CTA renders the site-wide primary-CTA pill (orange arrow chip). If a minimal text-only treatment is wanted specifically for the dogfooding section, that should be a separate cycle. Consistent with /services's other CTAs.

4. **F's mobile responsive doc vs actual render.** F's handoff §"Mobile responsive behavior" describes 6 items wrapping to "~3 rows of 2, centered" at 375 px, but actual render is 4+2 (two rows). Not a functional regression — items are legible and the section behaves correctly — but the description was imprecise. Worth a one-line correction in the handoff record if cycle work is re-audited later.

## File index

Screenshots (all `docs/pl2/handoffs/screenshots/sprint-5-cycle-4/`):
- `t3-proof-1280-live-20260511.png`, `t3-proof-1280-preview-20260511.png`, `t3-proof-1280-diff-20260511.png`, `t3-proof-1280-composite-20260511.png`
- `t3-proof-768-live-20260511.png`, `t3-proof-768-preview-20260511.png`, `t3-proof-768-diff-20260511.png`, `t3-proof-768-composite-20260511.png`
- `t3-proof-375-live-20260511.png`, `t3-proof-375-preview-20260511.png`, `t3-proof-375-diff-20260511.png`, `t3-proof-375-composite-20260511.png`
- Per-section crops: `t3-proof-{cta,strip}-{1280,768,375}-crop-20260511.png`
- Full-page captures retained as `*-full-*.png` for reference.

Report: `docs/pl2/handoffs/cycle-4-proof-report.html`
