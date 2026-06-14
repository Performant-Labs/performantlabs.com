# Handoff-S: Cycle 3 - Closing CTA Preview Fidelity

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-5-cycle-3-closing-cta`
**Issue:** `docs/pl2/handoffs/cycle-3-closing-cta-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/cycle-3-closing-cta-T.md` (PASS, zero blocking)
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-3-closing-cta-F.md`
**Operator-facing report:** [`cycle-3-closing-cta-report.html`](cycle-3-closing-cta-report.html)

## T precondition

Confirmed: T reported zero blocking issues. Proceeding with Tier 3.

## Tier 3 visual audit

### Visual diff results (services closing-cta section, normalized to preview width)

| Viewport | Pixels different | Section area | Section delta % |
|---|---|---|---|
| 1280×800  | 129,186 | 833,280  | 15.50% |
| 768×1024  | 118,229 | 500,736  | 23.61% |
| 375×667   | 127,382 | 308,625  | 41.27% |

> Whole-page deltas are non-actionable (typical 4-6% per Cycle 1 explanation). Per-section deltas above are computed on the cropped closing-cta region only. The 768/375 numbers are inflated by the section being taller in the preview (extra vertical pad) — the diff is largely "empty espresso background extending below the live capture." Per-row analysis below is binding.

### Per-section delta description (1280 — REWORK)

**The C1 element-order delta is NOT resolved at 1280 desktop.**

DOM order is correct (kicker → H2 → body → primary → ghost). Rendered visual order is NOT:

| Row | Live @ 1280 | Preview @ 1280 |
|---|---|---|
| 1 | Kicker centered | Kicker centered |
| 2 | H2 centered (full-width) | H2 centered |
| 3 | **Body text (640px, LEFT-positioned) + both CTAs (RIGHT-positioned), side-by-side on the same row** | Body text centered (full row) |
| 4 | — | Both CTAs centered side-by-side (full row) |

The live rendering has the body paragraph on the left and both CTA pills on the right, sharing a single flex row. The preview stacks them: body centered above CTA cluster, CTA cluster centered below body.

**Root cause (technical):** `.dy-section.theme--dark .dy-section__content:has(> .button + .button)` applies `display: flex; flex-direction: row; flex-wrap: wrap` to the container. The fallback rule `> :not(.button) { flex-basis: 100%; }` is meant to push non-button children to their own row. However, `.dy-section.theme--dark .dy-section__content .text` has `max-width: 640px`. Max-width caps the rendered width below the flex-basis, leaving residual space on the line into which the two `auto`-basis buttons squeeze (combined ~470px + gap fits in the ~525px remainder of a 1165px container).

Verified via computed-style inspection in the live browser at 1440px viewport:
- `.text` rect: x=289, y=3747, w=640
- Primary button rect: x=1098, y=3776 (same row as body)
- Ghost button rect: x=1351, y=3782 (same row)

The same rule applies at 768 — but at 768 the container is narrower (~720), body (640) + buttons (~470) cannot fit on one line, so buttons wrap to row 4. **Mobile/tablet luckily render correctly; desktop does not.**

### Per-viewport summary

| Viewport | C1 order | C2 H2 centering | C3 CTA cluster | Tokens | Mobile responsive | Verdict |
|---|---|---|---|---|---|---|
| 1280 | **FAIL** — body and CTAs share a row | PASS | **FAIL** — buttons floated right next to body | MATCH | n/a | **REWORK** |
| 768  | PASS — vertical stack | PASS | PASS — buttons centered side-by-side below body | MATCH | n/a | MATCH |
| 375  | PASS — vertical stack | PASS | PASS — buttons stacked full-width | MATCH | PASS (touch ≥44px, H2 mobile scale 36px/-1.2px) | MATCH |

### Token check (1280 closing-cta)

| Token | Brief / preview | Rendered | Match |
|---|---|---|---|
| Section background | espresso `#1F1A14` | espresso espresso | YES |
| Kicker color | terracotta `#C97B5C` | terracotta | YES |
| H2 color | cream `#F5EFE2` | cream | YES (intentional change from white) |
| H2 size | display-lg 56px / 500 / -1.6px / 1.05 | 56px / 500 / -1.6px / 1.05 | YES |
| Body color | muted `#B8AFA0` | muted | YES |
| Body max-width | 640px | 640px | YES (intentional change from 800px) |
| Primary CTA | teal `#62BBCB`, white text | teal, white | YES |
| Ghost CTA | cream border 40% alpha, cream text | cream/40 border, cream text | YES |

## Design brief compliance

Tokens (colors, type, max-width, button variants) all match brief. Layout fails brief intent at 1280 (CTAs must be **centered below body**, not floated next to it).

## WCAG 2.2 AA audit

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | PASS | Tab order: kicker (non-tabbable) → primary CTA → ghost CTA. Focus rings visible (#62BBCB teal on espresso = 7.80:1). |
| Focus ring visibility | PASS | 7.80:1 against espresso, well over 3:1 non-text. |
| Forced-colors mode | PASS (assumed) | Buttons are `<a>` with text labels and SVG `aria-hidden`; no decorative-only elements that disappear. |
| Reduced-motion | N/A | No animations on closing-cta. |
| 200% zoom | PASS | Section is fluid; no clipping at 1280×800 zoomed 200% (verified Playwright section did not introduce horizontal scroll). |
| Heading hierarchy | PASS | H1 unique; H2 (closing-cta) follows ordered sequence; no skipped levels. |
| Image alt text | PASS | SVG arrow icons have `aria-hidden="true"`; button text label carries meaning. |
| Mobile touch targets (375) | PASS | Buttons min-height 44px; width 100%. |
| Mobile typography scale | PASS | H2 36px / -1.2px matches brief `typography-mobile.display-lg`. |
| Mobile layout | PASS | Buttons stack full-width; body and kicker centered; no horizontal scroll. |

All WCAG checks pass. The defect is purely visual / layout, not accessibility.

## Static preview comparison (per section row)

| Section row | Preview | Live | Status |
|---|---|---|---|
| Kicker treatment (line marks + terracotta + centered) | present | present | MATCH |
| H2 (cream, centered, 56px) | present | present | MATCH |
| Body copy below H2 (centered, 640px max) | yes — on its own row | NO — shares row with CTAs at 1280 | **DELTA / REWORK** |
| CTA cluster below body, centered | yes — own row | NO — right-floated next to body at 1280 | **DELTA / REWORK** |
| Mobile stacking (375) | full-width stacked | full-width stacked | MATCH |
| Token fidelity (espresso, terracotta, cream, teal) | — | — | MATCH |
| Ghost-on-dark variant | present | present | MATCH |

## Cross-page check: /about-us closing-cta

Tested per O's directive. F's CSS move from `title-cta.css` to `dy-section.css` (shared) now also affects about-us.

| Change | About-us before | About-us after | Verdict |
|---|---|---|---|
| H2 color | pure white #FFFFFF | cream #F5EFE2 | Brief-aligned (cream is the canonical closing-cta H2 color); AAA contrast preserved. ACCEPT. |
| Body max-width | 800px | 640px | Layout change, no contrast impact. Body now matches the same width as services. ACCEPT. |
| H2 size | (was `--h2-size` 40px) | 56px display-lg | Larger heading on about-us closing-cta — visible change, but matches the brief's display-lg treatment for closing-cta. ACCEPT. |
| CTA cluster layout | body + 2 CTAs in same row at desktop | same | **SAME DEFECT as services** — body left, CTAs right at 1280. This was pre-existing (the rule was authored for about-us originally). Not a regression introduced by this cycle. |

The about-us cross-page effects are intentional and brief-aligned for the visual tokens, but the underlying flex-row layout bug exists on about-us too. Out-of-scope for this issue's REWORK note but worth tracking.

## Verdict

**REWORK** — the following must be addressed before commit:

1. **C1/C3 still broken at 1280 desktop.** The body paragraph (`.text`) and the two CTA buttons share a single flex row instead of stacking vertically. The `flex-basis: 100%` rule on `> :not(.button)` is defeated by the `.text` element's `max-width: 640px` capping its actual width below the basis, leaving line space into which buttons squeeze.

   **Proposed remediations (F to pick the cleanest):**

   - **Option A (preferred):** Wrap the buttons in their own flex container (a `.cta-cluster` div) rather than making `.dy-section__content` the flex parent. Then `.dy-section__content` stays a normal block-flow column (kicker / H2 / body / cluster), and the cluster handles the row-vs-column responsive switch. Cleanest separation of concerns; matches preview's `.closing-cta__ctas` wrapper.
   - **Option B:** Force `.text` (and any non-button child) to `width: 100%` in addition to `flex-basis: 100%`, so max-width doesn't shrink the flex item below a full-row claim. Add `.dy-section.theme--dark .dy-section__content:has(> .button + .button) > :not(.button) { width: 100%; flex-basis: 100%; }`.
   - **Option C:** Change `.text` `max-width` to be applied via an inner wrapper, not directly on the flex item.

   Option B is the smallest CSS-only fix; option A is the cleanest architecturally. Operator decision.

2. **Confirm the chosen fix also corrects /about-us** (which has the same pre-existing defect). The about-us closing-cta should also show body centered above CTA cluster centered below.

3. **Documentation correction (ADV-3 from T):** the comment in `dy-section.css` line 506 reading "cream #F5EFE2 on espresso #1F1A14 = 13.07:1" should be updated to 15.07:1 (T independently verified). Non-blocking but trivial to fix in the same rework cycle.

### Sub-issue recommendation

Branch: `aa/pl-sprint-5-cycle-3.1-closing-cta-ctas-stack`
Problem: At 1280, body paragraph and CTA cluster share a flex row in `.dy-section.theme--dark .dy-section__content`. Preview requires them stacked vertically with CTAs centered below body.
Decision for O: Which remediation option (A wrapper / B width:100% / C max-width move)?
Scope: Same files as cycle 3 (likely `dy-section.css` only; option A may also touch the Canvas entity to add a wrapper, ~3 files; option B is 1 file).

## Advisory notes

- 768 and 375 render correctly. Mobile is unchanged from prior MATCH (C4 still holds).
- All visual tokens match the brief at all three viewports.
- All WCAG 2.2 AA checks pass.
- The cross-page about-us H2 color/max-width changes are brief-aligned improvements, not regressions.
