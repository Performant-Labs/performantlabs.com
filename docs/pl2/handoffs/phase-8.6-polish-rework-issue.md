# Phase 8.6 — Rework: nav-cluster horizontal offset at 1280

**Branch:** `aa/pl-homepage-phase-8.6-polish`
**Pipeline:** O → F-rework → T → S → O
**References:**
- Original issue: [`phase-8.6-polish-issue.md`](phase-8.6-polish-issue.md)
- F round 1: [`phase-8.6-polish-F.md`](phase-8.6-polish-F.md)
- S round 1 (PASS on items 1–5, REWORK on item 6): [`phase-8.6-polish-S.md`](phase-8.6-polish-S.md)

---

## Operator's directive

Items 1–5 of the original 8.6 batch PASSED — leave those changes in place (accordion.css plus/minus glyph; header.css hamburger border). Item 6 is the only round-2 work.

## Item 6 — correct diagnosis

F round 1 noted "~7 px sub-threshold offset" by measuring the logo's left edge against preview. The logo's left edge *does* match preview within 2 px. The actual visual offset lives on the **right side of the header**, where the nav cluster sits — S round 1 measured:

- Nav-cluster **right edge**: 160 px delta between live and preview.
- Nav-cluster **left edge**: 194 px delta between live and preview.

The asymmetric deltas (right vs left differ by 34 px) mean the nav cluster itself is also a different *width* between live and preview — not just shifted. Live's nav is approximately 34 px narrower or wider than preview's.

## Objective

Align the nav-cluster horizontal position and width on live to match preview at 1280.

## Likely diagnosis directions (for F's trace)

1. **Container width / max-width mismatch.** Compare `.site-header__inner`'s computed width on live vs preview at 1280. Preview uses `.container { width: min(92cqw, 1440px) }` style. Live's `.container` may use a different max-width or padding-inline.
2. **Nav internal spacing.** Preview's `.site-header__nav { gap: var(--space-xl) }` produces a specific cluster width. Live's gap may differ (subtheme override, or Dripyard default).
3. **Nav link typography.** If live's nav links are at a slightly different font size or letter-spacing than preview, the cluster width changes. Preview spec: `15 px` text per the canonical header CSS.
4. **`justify-content` mismatch.** Both should be `space-between` on `.site-header__inner`. Verify.

Trace with the corrected measurement approach (measure the RIGHT side of the header, not just the left):
- Live's `.site-header__nav` (or whichever element wraps the inline nav links) — measure `getBoundingClientRect()` for left, right, width at 1280.
- Preview's `.site-header__nav` — same measurement.
- Compare.

## Acceptance criteria

- [ ] Nav-cluster **right edge** within 10 px of preview's right edge at 1280.
- [ ] Nav-cluster **left edge** within 10 px of preview's left edge at 1280.
- [ ] (Implicit) Nav-cluster width within ~10 px of preview's.
- [ ] No regressions on items 1–5 from round 1, nor on any of the prior phases (8.1 – 8.5).
- [ ] No `!important`. `component_version` retention applies.

## Inputs

1. [`phase-8.6-polish-S.md`](phase-8.6-polish-S.md) — S round 1's measurement detail.
2. [`phase-8.6-polish-F.md`](phase-8.6-polish-F.md) §"Item 6" — round 1's (incorrect) trace, for context.
3. `docs/pl2/Previews/homepage.html` — canonical header markup + CSS. Open at 1280 in a browser and inspect `.site-header__inner`, `.site-header__nav`, computed widths and positions.
4. The live header HTML/CSS — `web/themes/custom/performant_labs_20260502/css/components/header.css` plus whatever neonbyte emits for `.site-header__inner` (or its equivalent class — confirm name via DOM inspection).

## Handoff location

`docs/pl2/handoffs/phase-8.6-polish-F-rework.md`

## Operating rules

- Trace before coding. Use corrected measurement (right-edge focus).
- L5 expected; CSS in subtheme `header.css`.
- No `!important`.
- Run T1 + T2. Do NOT run T3.
- Do not pause to ask permission.
- If the trace shows the fix is non-trivial (e.g. needs to touch the Dripyard / neonbyte container max-width which would affect other pages), surface it before implementing — that's a real cross-page concern that needs operator confirmation.
