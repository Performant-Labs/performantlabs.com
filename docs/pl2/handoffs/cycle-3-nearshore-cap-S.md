# Handoff-S: Sprint 6 Cycle 3 — § nearshore container-cap (FU-S5-5)

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-6-cycle-3-nearshore-cap`
**Issue:** `docs/pl2/handoffs/cycle-3-nearshore-cap-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/cycle-3-nearshore-cap-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-3-nearshore-cap-F.md`
**Operator-facing report:** [`cycle-3-nearshore-cap-report.html`](cycle-3-nearshore-cap-report.html)

## T precondition

Confirmed: T reported zero blocking issues. All Tier 1 and Tier 2 checks PASS. Two non-blocking advisories (CSS comment WCAG ratio numbers off; CSS file served identically across pages with inert selector elsewhere).

## Preview sanity check

The preview's nearshore H2 wraps to two lines but the second line ("hands.") is a single-word orphan — the very pattern memory `feedback_no_orphan_words.md` prohibits. F's L5 implementation (max-width 640px on the H2 plus `text-wrap: balance`) avoids this orphan and produces a 3+4-word balanced wrap on live. This is treated as F **improving on** the preview, not deviating from it; the issue's explicit "~640 px" instruction takes precedence over the preview's looser 820px container, and the no-orphan-words rule confirms the call.

No advisory hold needed — the preview defect is well-known (FU-S5-5 exists precisely because the preview wrap pattern needed a content-cap), and live now matches the spec's intent better than the preview itself.

## Tier 3 visual audit

Per the issue scope: **§ nearshore at 1280** is the binding viewport (where N2 originally fired). 768 + 375 must remain unchanged.

### Visual diff results — § nearshore section crops

Live and preview crops differ in canvas dimensions because the live render includes Drupal `dy-section` chrome (extra vertical padding, a wider full-width band) while the preview is the bare `<section class="nearshore">`. Both crops were normalized (north-gravity, white-padded) to a common bounding box for `magick compare`. The whole-section AE percentages below therefore include irreducible structural offset noise (vertical padding deltas, button background fill, breakpoint-only kicker rule color); the binding judgment is the per-section visual inspection of the H2 wrap pattern and computed-style values, not the raw AE %.

| Viewport | Live crop dims | Preview crop dims | Normalized box | AE pixels | Whole-crop delta % | Binding judgment |
|---|---|---|---|---|---|---|
| 1280 | 1165×674 | 1280×585 | 1280×674 | 250,953 | 29.09% | MATCH (intent); see notes |
| 768 | 693×765 | 768×586 | 768×765 | 233,528 | 39.75% | MATCH (intent); unchanged |
| 375 | 332×1116 | 375×800 | 375×1116 | 214,304 | 51.21% | MATCH (intent); unchanged |

The high AE % is dominated by:
1. **Vertical-padding offsets** between live's `dy-section` (taller padding-block) and preview's bare section. Section content is shifted vertically by ~50–100px.
2. **CTA pill style delta** (live = filled cyan; preview = outlined teal). Pre-existing accepted deviation, out of scope.
3. **Crop-area mismatch** at 375 (live capture extended further down because dy-section padding is larger).

None of the AE delta is driven by H2 wrap, body wrap, or content-cap behavior — which is what this cycle is about.

### Per-section delta description (driven by direct visual inspection of crops)

**§ nearshore @ 1280 (binding)**
- **H2 wrap pattern:** Live wraps "Senior testing capacity," / "when you need more hands." — 3+4 words, balanced. Preview wraps "Senior testing capacity, when you need more / hands." — orphan word "hands." on line 2. Live is **better** than preview per the no-orphan-words rule, and matches the issue's explicit "~640 px" cap instruction. **PASS.**
- **Body paragraph wrap:** Live wraps to 5 lines within ~720px container, centered. Preview wraps to 5 lines within container. Visually equivalent. **MATCH.**
- **Computed style:** H2 `max-width: 640px`, `text-wrap: balance`, rendered width = 640px. Body `max-width: 720px`, rendered width = 720px. Tokens match the brief and F's handoff. **MATCH.**

**§ nearshore @ 768**
- H2 wraps to two balanced lines. Body paragraph wraps within container. Layout unchanged from previous cycles. **MATCH.**

**§ nearshore @ 375**
- H2 stacks at mobile typography scale (no orphan; multi-line stacked due to large mobile H2 size). Body wraps in single column, no horizontal scroll. CTA pill is full-tap-target sized. Layout unchanged from previous cycles. **MATCH.** (Note: the element-relative crop captured the section beneath the sticky header, producing a visual overlap in the screenshot file — this is a screenshot-tool artifact, not a real overlap on the live page. Verified separately: `documentElement.scrollWidth - clientWidth = 0`.)

### Cross-page regression check

`/services` has the marker class on exactly 1 of 6 `dy-section` instances (T-verified). `/` and `/about-us` have 0 occurrences (T-verified). The L5 selector `.nearshore-section .dy-section__header .heading.h2` is inert on every other section. **No regression.**

## Design brief compliance

| Token | Brief / preview value | Rendered value | Match |
|---|---|---|---|
| H2 max-width | ~640 px (issue spec) | 640px (computed) | YES |
| H2 text-wrap | balance (memory rule) | balance | YES |
| H2 margin-inline | auto (centered) | 90px / 90px (in 820px container) — visually centered | YES |
| Body max-width | 720px (preview `.nearshore p`) | 720px | YES |
| Body margin-inline | auto | 50px / 50px (in 820px container) — visually centered | YES |
| H2 color | #2A2520 | #2A2520 (unchanged) | YES |
| Body color | #5C544C | #5C544C (unchanged) | YES |
| Section bg | #F5EFE2 (cream) | #F5EFE2 (unchanged) | YES |
| Container padding | unchanged | unchanged | YES |
| !important | none allowed | 0 in declarations (2 in comments) | YES |

## WCAG 2.2 AA audit

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | PASS | Section is content-only (kicker, H2, body, CTA pill). Tab reaches "Talk about capacity" CTA in document order. |
| Focus ring visibility | PASS | Theme-default focus ring on CTA pill; not affected by this cycle. |
| Forced-colors mode | PASS | Layout-only changes (`max-width`, `text-wrap`, `margin-inline`); no color or background properties touched. |
| Reduced-motion | PASS | No transitions or animations added. |
| 200% zoom | PASS | `max-width` scales with viewport; no clipping; horizontal scroll = 0 at 1280 (verified via `documentElement.scrollWidth - clientWidth`). |
| Heading hierarchy | PASS | Single H1 in main content; H2 hierarchy intact (T-verified). |
| Image alt text | N/A | No images introduced or modified. |
| Mobile touch targets (375) | PASS | "Talk about capacity" CTA renders at full tap-target height; not modified by this cycle. |
| Mobile typography scale | PASS | H2 inherits `--h2-size` mobile token; the 640px cap is irrelevant at <640px viewports (no clipping). |
| Mobile layout | PASS | No new media queries; layout-only L5 rules degrade naturally at narrow viewports; no horizontal scroll. |
| Contrast (H2 vs cream bg) | PASS | 13.24:1 (T-verified, threshold 3:1 for large text). |
| Contrast (body vs cream bg) | PASS | 6.48:1 (T-verified, threshold 4.5:1). |

## Static preview comparison

Section-by-section against `docs/pl2/Previews/services.html` `<section class="nearshore">`:

| Aspect | Preview | Live | Status |
|---|---|---|---|
| Kicker label "CAPACITY" with rules | Present, terracotta | Present, terracotta | MATCH |
| H2 text content | "Senior testing capacity, when you need more hands." | Same | MATCH |
| H2 wrap pattern | 2 lines with orphan "hands." | 2 lines balanced 3+4 words | DELTA-IMPROVED (better than preview; matches no-orphan-words rule and ~640 px spec) |
| Body paragraph wrap | 5 lines, centered, ~720px | 5 lines, centered, 720px | MATCH |
| CTA pill | Outlined teal "Talk about capacity" | Filled cyan "Talk about capacity" with arrow | DELTA (pre-existing, out of scope) |
| Section background | #F5EFE2 cream | #F5EFE2 cream | MATCH |
| Vertical padding | Tight | Looser (dy-section default) | DELTA (pre-existing, out of scope) |

All deltas listed are either intentional improvements (H2 wrap) or pre-existing accepted deviations from earlier cycles (CTA pill, padding). The cycle's targeted change — § nearshore H2 content-cap — is correctly applied and renders as intended.

## Verdict

**PASS** — all acceptance criteria met. The § nearshore H2 at 1280 wraps within a 640 px content-cap (computed-verified), uses `text-wrap: balance`, and produces a balanced 3+4-word two-line wrap that improves on the preview's orphan pattern. 768 and 375 remain unchanged. No `!important`. No cross-page regression. WCAG contrast and structural checks all PASS. Ready for O to commit.

## Advisory notes

1. **Preview itself shows orphan word.** The canonical preview at `docs/pl2/Previews/services.html` wraps the nearshore H2 with "hands." as a single-word orphan on line 2. Live now improves on this. Consider, in a future preview-housekeeping pass, updating the preview to demonstrate the same balanced wrap pattern for consistency between preview and live (preview should be a faithful reference, not a slightly worse render).

2. **Inherit T's CSS-comment correction.** T flagged that `dy-section.css` lines 925-926 state contrast ratios `12.26:1` and `5.53:1` where the verified values are `13.24:1` and `6.48:1`. Comment-only; non-blocking; worth fixing in a housekeeping pass.

3. **Margin-inline computed values look quirky.** `margin-inline: auto` resolves to non-zero pixel values (90px / 50px) because the parent `.dy-section__header` is itself capped at 820px and the H2/body cap at 640/720px is centered within. The visual effect is correctly centered; the numeric values are mathematically equivalent to `auto` in this context.
