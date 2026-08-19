# Phase 8.3 — Logo grid presentation parity (bitmap)

**Branch:** `aa/pl-homepage-phase-8.3-logo-grid`
**Pipeline:** O → F → T → S → O
**Parent:** Phase 8 visual parity audit ([`phase-8-visual-parity-S.md`](phase-8-visual-parity-S.md), §"Logo grid — REWORK").

The canonical preview was updated in commit `6f21f8aac` on this branch to use the same six bitmap client logos as live (operator decided real logos > text labels; the original audit's "preview uses bitmaps" claim was a mis-read of text spans, but the operator's preference is bitmaps so we made the preview match). F's job is to align the live's bitmap logo presentation to the preview's spacing, sizing, grayscale treatment, and responsive wrapping.

---

## Operator's directive

Preview is canonical. Match it. Do not pause to ask permission.

## Objective

Align the live homepage's "Trusted by teams at" logo bar to the preview's bitmap logo presentation. The six logos (CBS Interactive, DocuSign, Orange, Renesas, Robert Half, Tesla) are already present on both sides — the work is in sizing / styling / responsive wrapping.

## Spec (from preview + brief)

- Six bitmap PNGs from `web/sites/default/files/client-logos-png/` (already in use on live).
- **max-height 28px** per `pl_design_brief.md` §"Per-section mobile behavior" §"Logo bar".
- **filter: grayscale(100%)** per brief; preview applies `opacity: 0.7` in addition for a softer treatment — confirm whether opacity also belongs on live or if grayscale alone is sufficient. Operator decision is "match preview", so apply both.
- **width: auto, object-fit: contain** so logos don't distort when constrained by max-height.
- Responsive behavior (already partially fixed by 8.2's flex-wrap breakpoint change):
  - ≥992 (lg+): single row of 6, evenly spaced.
  - 768–991 (md, post-8.2): wraps. Brief says "two rows of three at `md`" — verify live wraps to 2×3.
  - <576 (xs): "three rows of two" per brief. Currently live's logo-grid may not enforce this — verify and adjust if needed.

## Problem (from the original Phase 8 audit, with caveats)

The original audit observations need re-verification post-8.2:

| Viewport | Original audit said | Likely current state post-8.2 | Status |
|---|---|---|---|
| 1280 | Both use bitmaps; spacing/cell sizes differ; live cells taller | unchanged | needs sizing/spacing alignment |
| 768 | Live overflows row (last logo clipped) | **likely fixed by 8.2** (flex-wrap raised to 992) | re-verify; if not 2×3, fix |
| 375 | Live: tall vertical column of bitmaps | **likely fixed by 8.2** | re-verify; if not 3×2, fix |

F should re-capture live at all three viewports during the trace to confirm the actual current state before deciding what to change.

## Acceptance criteria

- [ ] Step-3 trace surfaced; root cause(s) and chosen layer(s) documented per change.
- [ ] **1280**: six logos in a single row, evenly spaced via `space-between` or equivalent, max-height 28 px, grayscale + opacity treatment matching preview.
- [ ] **768**: six logos wrap to **2 rows of 3** (per brief), max-height 28 px, grayscale.
- [ ] **375**: six logos wrap to **3 rows of 2** (per brief), max-height 28 px, grayscale. If they currently render in a different wrap pattern (e.g. 2×3 or 6×1), adjust.
- [ ] No regressions on prior fixes:
  - 8.1: header has no "Book a testing review" pill; header height 73 px; hamburger at <992.
  - 8.2: hero `padding-inline: 0` still served; logo-grid `min-width: 992px` nowrap rule still served (the flex-wrap that 8.2 added).
  - 8.4: feature cards `grid-wrapper--3col-stack-md` class still rendered (3/1/1 cols).
  - 8.5: hero `min-height: auto` + dy-section sibling-combinator rule still served.
- [ ] No `!important`. Files staged by explicit path. `component_version` retention rule applies.
- [ ] WCAG: alt-text on each logo image is descriptive (not "image"). Verify via curl + grep.

## Inputs (read all before writing code)

1. `docs/pl2/handoffs/phase-8-visual-parity-S.md` §"Logo grid" — original audit findings (with mis-read caveats).
2. `docs/pl2/Previews/homepage.html` — canonical reference. The preview's `.logo-bar__row img` rules are the binding spec (max-height 28 px, grayscale, opacity 0.7, object-fit contain).
3. `docs/pl2/Briefs/pl_design_brief.md` §"Per-section mobile behavior" §"Logo bar" — the responsive wrap spec (1 → 2×3 at md → 3×2 at xs).
4. `web/themes/custom/performant_labs_20260502/css/components/logo-grid.css` — the current subtheme override (Phase 4.4 work + 8.2 patch).
5. `docs/pl2/theme-change--workflow.md` — 7-step workflow.

## Handoff location

`docs/pl2/handoffs/phase-8.3-logo-grid-F.md`

## Operating rules

- 7-step CSS workflow. Trace before coding.
- Override at the highest correct layer (likely L5 in logo-grid.css since 8.2 already established the pattern there).
- No `!important`. No `git add .`.
- `component_version` retention applies.
- T1 + T2 yourself. Do NOT run T3.
- Do not pause to ask permission. Just execute.
