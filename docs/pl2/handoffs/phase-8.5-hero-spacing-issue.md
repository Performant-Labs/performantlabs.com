# Phase 8.5 — Hero whitespace below CTAs

**Branch:** `aa/pl-homepage-phase-8.5-hero-spacing`
**Pipeline:** O → F → T → S → O
**Parent:** Phase 8 visual parity audit ([`phase-8-visual-parity-S.md`](phase-8-visual-parity-S.md), §"Hero band — REWORK") and the 8.4 S handoff (which observed a "vertical-offset signature from the hero-whitespace issue" as the residual delta after 8.4's fix).

---

## Operator's directive

The preview at `docs/pl2/Previews/homepage.html` is canonical. Match it. **Preview wins** on contradictions; brief is secondary. Do NOT pause to ask permission — execute. Confirmation tables are unnecessary friction.

---

## Objective

Eliminate the excess vertical whitespace between the hero CTAs and the next band (logo grid) on the live homepage. Live currently has approximately 600 px of empty space below the CTAs at 1280 desktop; the preview transitions to the logo grid immediately after the CTAs.

## Problem (from S audit + 8.4 follow-on)

| Viewport | Live | Preview | Status |
|---|---|---|---|
| 1280 | ~600 px empty whitespace between CTAs and logo band | CTAs flow directly into next band | OVERSIZED |
| 768  | similar excess (vertical-offset signature in 8.2 + 8.4 reports) | tight transition | OVERSIZED |
| 375  | live has more vertical space than preview | tight transition | OVERSIZED |

Hero band typography, CTA shapes, and content alignment are all already correct (verified by F in 8.2 and by S in 8.2 + 8.4). The remaining hero delta is purely vertical spacing.

The preview's hero CSS sets `padding: 120px 0 var(--space-section)` at desktop. F should compare what neonbyte / Dripyard actually emit on `.hero` and identify which token / rule produces the extra whitespace on live.

## Likely diagnosis directions (for F's trace)

1. **`padding-block` on `.hero`** is too large on live. Possibly Dripyard's default hero `padding-block` token resolves to a larger value than the preview spec (`120px 0 var(--space-section)`).
2. **`min-height` on `.hero`** may be set to a screen-height value (e.g. `100vh`, `--hero-min-height`, etc.). The preview has no such constraint.
3. **Trailing margin on `.hero__content` or its children**. The CTA group may have `margin-block-end` that's too large.
4. **Section-spacing collision.** The hero's bottom padding plus the next section's top padding may be doubling up; the preview presumably manages with `var(--space-section)` once.

Trace upward (Pass 1 bottom-up, Pass 2 top-down). Find the root, fix at the highest correct layer.

## Acceptance criteria

- [ ] Step-3 trace surfaced in F handoff before any CSS / Canvas change is made; root cause and chosen layer documented.
- [ ] Hero whitespace below CTAs at **1280** matches preview (no excess; the next band visibly transitions immediately after the CTAs as in the preview).
- [ ] Hero whitespace at **768** matches preview.
- [ ] Hero whitespace at **375** matches preview.
- [ ] No regressions on prior fixes:
  - 8.2: hero `padding-inline: 0` on `.hero.theme--white` still served; 768 has no horizontal overflow.
  - 8.2: logo-grid `min-width: 992px` nowrap rule still served.
  - 8.4: feature cards 3 / 1 / 1 columns at 1280 / 768 / 375 still hold.
- [ ] No `!important`. Files staged by explicit path. `component_version` retention rule applies.

## Inputs (read all before writing code)

1. `docs/pl2/handoffs/phase-8-visual-parity-S.md` §"Hero band — REWORK" — the original audit findings.
2. `docs/pl2/handoffs/phase-8.2-hero-overflow-F.md` and `phase-8.4-card-grid-desktop-S-rework.md` — both reference the hero-whitespace residual; useful prior trace.
3. `docs/pl2/Previews/homepage.html` — canonical visual reference. Inspect `.hero` computed styles — `padding`, `min-height`, any `margin-block-end` on `.hero__content`.
4. `docs/pl2/Briefs/pl_design_brief.md` — hero spacing tokens.
5. `docs/pl2/theme-change--workflow.md` — the 7-step CSS workflow (mandatory).
6. `web/themes/custom/performant_labs_20260502/css/components/hero.css` — current subtheme hero override (you'll likely add to or modify this).

## Handoff location

Write your handoff to: `docs/pl2/handoffs/phase-8.5-hero-spacing-F.md`

## Operating rules

- 7-step CSS workflow.
- Override at the highest correct layer.
- No `!important`. Files staged by explicit path.
- `component_version` retention applies (do NOT NULL it).
- Run T1 + T2 yourself; do NOT run T3.
- **Do not pause to ask permission.** When the trace is complete and the layer is chosen, execute. Surface decisions only when the brief and preview genuinely contradict each other.
