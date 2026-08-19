# Handoff-S: Cycle 3 (REWORK) - Closing CTA Desktop Stacking Fix

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-5-cycle-3-closing-cta`
**Issue:** `docs/pl2/handoffs/cycle-3-closing-cta-rework-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/cycle-3-closing-cta-T-rework.md` (PASS, zero blocking)
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-3-closing-cta-F-rework.md`
**Prior S handoff:** `docs/pl2/handoffs/cycle-3-closing-cta-S.md` (returned REWORK)
**Operator-facing report:** [`cycle-3-closing-cta-report.html`](cycle-3-closing-cta-report.html)

---

## Verdict: REWORK

**The Option B fix did NOT resolve the 1280 desktop stacking defect on either `/services` or `/about-us`.** Rendered layout at 1280 is unchanged from the prior cycle: body text on the left, both CTA buttons squeezed onto the same row on the right. The 768 and 375 viewports remain correct.

## T precondition

Confirmed: T reported zero blocking issues. Proceeded with Tier 3.

---

## Tier 3 visual audit

### Per-section delta results (closing-cta cropped region, page+viewport)

| Page | Viewport | AE (pixels) | Section area | Delta % | Verdict |
|---|---|---:|---:|---:|---|
| /services | 1280 | 131,461 | 605,440 | **13.15%** | REWORK |
| /services | 768  | 131,460 | 446,208 | 13.15% (inflated; preview taller than live — see note) | MATCH |
| /services | 375  | 95,572  | 250,500 | 95.57% (inflated; preview is wider than live, see note) | MATCH |
| /about-us | 1280 | 59,393  | 526,080 | **5.94%**  | REWORK |
| /about-us | 768  | 58,339  | 380,928 | 5.83% (cosmetic spacing only) | MATCH |
| /about-us | 375  | 53,244  | 197,625 | 53.24% (inflated, see note) | MATCH |

> Note on inflated 768/375 deltas: the static preview's closing section has more vertical pad than the live rendering, so crops differ in aspect even after height-clamping. Visual inspection of side-by-side composites (in the operator report) confirms layout MATCHES at 768 and 375 — the delta is purely empty espresso background and minor font-rendering noise.

### Computed-layout verification at 1280 (Playwright, viewport 1280×800)

**`/services` `.dy-section.theme--dark .dy-section__content` children at 1280 (parent width 1164px):**

| Child | x | y | width | flex-basis | css width | max-width |
|---|---:|---:|---:|---|---|---|
| kicker | 51 | 3669 | 1164 | 100% | 1163.8px | none |
| H2 | 233 | 3710 | 800 | 100% | 800px | 800px |
| **text** | **65** | **3842** | **640** | **100%** | **640px** | **640px** |
| primary CTA | **736** | **3872** | 233 | auto | 233.141px | none |
| ghost CTA | **989** | **3878** | 221 | auto | 221.219px | none |

**`/about-us` same shape:** text at (70, 3890, 640px); primary at (746, 3897); ghost at (999, 3897).

The body `.text` element renders at **640px wide**, sharing the row with both buttons (same y-band ±30px). This is the same defect as the prior cycle.

### Root cause of the failed fix

CSS spec: `max-width` always wins over `width`. The rule

```css
.dy-section.theme--dark .dy-section__content:has(> .button + .button) > :not(.button) {
  flex-basis: 100%;
  width: 100%;          /* added by F this cycle */
  text-align: center;
}
```

resolves `.text`'s width as `min(100%, 640px) = 640px` because `.dy-section.theme--dark .dy-section__content .text` carries `max-width: 640px` from an earlier rule. The flex item claims only 640px on the row, leaving ~525px of residual space — into which the two `flex-basis: auto` buttons (~470px combined) squeeze.

The rework issue's Option B was authored on the assumption `width: 100%` would force a full-row claim. It cannot, because `max-width` clamps `width`. **Option B as written is not viable; F implemented it faithfully but the CSS contract makes it a no-op for layout.**

### Per-viewport visual verdict

| Viewport | Stacking (body / CTA cluster) | Verdict |
|---|---|---|
| 1280 /services | body LEFT + CTAs RIGHT on same row | **REWORK** |
| 1280 /about-us | body LEFT + CTAs RIGHT on same row | **REWORK** |
| 768 /services  | body centered, CTAs centered below | MATCH |
| 768 /about-us  | body centered, CTAs centered below | MATCH |
| 375 /services  | body centered, CTAs stacked full-width | MATCH |
| 375 /about-us  | body centered, CTAs stacked full-width | MATCH |

---

## Design brief compliance

All visual tokens (espresso, terracotta, cream, teal, type sizes, button variants) remain correct, as in the prior cycle. The token check is unchanged from `cycle-3-closing-cta-S.md`. The defect is purely layout/flow, not token fidelity.

## WCAG 2.2 AA audit

No changes from prior cycle. All checks remain PASS (keyboard, focus ring, forced-colors, reduced-motion, 200% zoom, heading hierarchy, image alt, mobile touch targets, mobile type scale, mobile layout). The defect is layout, not accessibility.

## Static preview comparison

| Section row | Preview | Live (1280) | Status |
|---|---|---|---|
| Kicker treatment | present | present | MATCH |
| H2 (cream, centered) | present | present | MATCH |
| Body row (full-width row, centered text) | own row | shares row with CTAs | **DELTA / REWORK** |
| CTA cluster row (centered, below body) | own row | floated right beside body | **DELTA / REWORK** |
| Mobile stacking (375) | full-width stacked | full-width stacked | MATCH |
| Tablet stacking (768) | centered stacked | centered stacked | MATCH |
| Token fidelity | — | — | MATCH |

## Cross-page check: /about-us

Same defect as `/services` at 1280. The `width: 100%` addition did not help here either, for the same reason.

---

## Required remediations (in priority order)

1. **The `:not(.button)` rule alone cannot defeat `max-width: 640px`.** Either:
   - **Option B-corrected:** add `max-width: none` (or a large explicit value) alongside the existing `width: 100%` on the `:not(.button)` selector, so the flex item claims the full row. The inner content can remain visually constrained via an inner wrapper or via `margin-inline: auto` on a child.
   - **Option A (architecturally cleaner):** wrap the two CTA buttons in a `.cta-cluster` div in the SDC template / canonical markup, then remove the `:has(> .button + .button)` flex hack on `.dy-section__content` for this case and let normal block flow (kicker / H2 / body / cluster) handle stacking. The cluster handles its own row-vs-column at responsive breakpoints.
   - **Option C:** lift `.text`'s `max-width: 640px` off the flex item and apply it to an inner wrapper, so the flex item is unconstrained while content remains visually capped.

   Operator decision required. Option B-corrected is the smallest CSS change; Option A is the cleanest and would likely benefit other sections using the same pattern.

2. **The fix must also resolve `/about-us`** (same selector, same defect).

3. **(Carried forward from prior S)** Documentation correction (ADV-3): the comment in `dy-section.css` line 506 reading "cream #F5EFE2 on espresso #1F1A14 = 13.07:1" should read 15.07:1. Non-blocking but trivial.

## Sub-issue recommendation

- **Branch:** `aa/pl-sprint-5-cycle-3.2-closing-cta-ctas-stack`
- **Problem:** Adding `width: 100%` without overriding `max-width: 640px` on `.text` cannot force the flex item to claim a full row. Live `/services` and `/about-us` closing-CTA at 1280 still show body left + CTAs right on the same row.
- **Decision for O:** which remediation — Option B-corrected (add `max-width: none`), Option A (wrap cluster), or Option C (lift max-width to inner wrapper)?
- **Scope:** Option B-corrected = 1 line in `dy-section.css`. Option A = SDC template + CSS. Option C = restructured `.text` rule.

## Advisory notes

- The `width: 100%` change is harmless — it costs nothing and may be retained or removed depending on which option ships. It is not actively breaking anything.
- 768 and 375 remain correct.
- All visual tokens still match the brief.
- All WCAG 2.2 AA checks still pass.
