# Phase 8.2 — Hero typography overflow fix

**Branch:** `aa/pl-homepage-phase-8.2-hero-overflow`
**Pipeline:** O → F → T → S → O
**Parent:** Phase 8 visual parity audit ([`phase-8-visual-parity-S.md`](phase-8-visual-parity-S.md), §"Hero band — REWORK")

---

## Operator's directive

The operator-approved preview at `docs/pl2/Previews/homepage.html` is canonical. The live homepage must match the preview. **No "is this right?" questions back to the operator** — when in doubt about a token or treatment, the preview wins.

---

## Objective

Fix the hero H1 typography so the live homepage matches the preview at desktop (1280), tablet (768), and mobile (375).

## Problem (from S audit)

| Viewport | Live | Preview / brief | Status |
|---|---|---|---|
| 1280 | H1 renders ~120 px (display-2xl-like) | display-xl 72 px / ls -2 px / weight 800 | OVERSIZED |
| 768  | H1 **overflows past the right viewport edge** ("Ship Drupal releases" cut off mid-word) | wraps cleanly within container | LAYOUT BROKEN |
| 375  | ~44 px (matches `typography-mobile` block) | ~44 px | MATCH — preserve |

The 768 overflow is the only currently-broken layout in the entire homepage and is therefore the highest-priority sub-cycle.

## Scope

1. Trace the `.hero h1` cascade (7-step Step 2): where does the ~120 px desktop value originate? Is it Dripyard's display-2xl token leaking through, a missing override, or a wrong selector specificity? Surface the trace in your handoff before writing CSS.
2. Bring desktop H1 to **display-xl 72 px / line-height 1.05 / letter-spacing -2 px / weight 800** per `docs/pl2/Briefs/pl_design_brief.md`.
3. Resolve the 768 overflow. Two likely causes per S's read: missing `max-width` on the hero text container, or a font-size that doesn't taper between desktop and the `sm` breakpoint. Diagnose with the trace, fix at the highest correct layer.
4. **Preserve mobile (375).** The `typography-mobile` block is already correct — verify your changes don't regress it.

## Acceptance criteria

- [ ] Step-3 trace surfaced in F handoff before any CSS is written; layer chosen and justified.
- [ ] Desktop (1280) H1 renders at 72 px per brief (curl + grep computed value via the served stylesheet, or measure via Tier 2 SDC explorer / Twig render).
- [ ] Tablet (768) H1 wraps within the viewport — no horizontal scroll, no clipped words. Verify via Playwright capture at 768 (the same workflow S used).
- [ ] Mobile (375) H1 still renders ~44 px (no regression).
- [ ] WCAG: contrast unchanged (text/surface tokens unchanged), no new touch-target issues.
- [ ] No `!important`. Files staged by explicit path. Canvas component_version unchanged (this is theme-layer work, not Canvas).

## Inputs (read all before writing code)

1. `docs/pl2/handoffs/phase-8-visual-parity-S.md` §"Hero band" — the audit findings.
2. `docs/pl2/Previews/homepage.html` — canonical visual reference (open in browser; inspect the hero H1 computed style).
3. `docs/pl2/Briefs/pl_design_brief.md` — `display-xl` token spec and `typography-mobile` block.
4. `docs/pl2/Briefs/pl_homepage_components.md` — hero component mapping.
5. `docs/pl2/theme-change--workflow.md` — the 7-step CSS workflow (mandatory).
6. `docs/pl2/theme-change.md` — Layer 1–5 system; pick the highest correct layer.
7. `~/Projects/playbook/themes/dripyard-guidance.md` — for cascading typography token discovery.

## Handoff location

Write your handoff to: `docs/pl2/handoffs/phase-8.2-hero-overflow-F.md`

## Operating rules

- Follow the 7-step CSS change workflow.
- Override at the highest correct layer (typography token at L3 / `base.css` if the issue is the token itself; component-specific override at L5 / `css/components/hero.css` if the issue is hero-specific).
- Read `.component.yml` before referencing any prop name.
- Stage files by explicit path. No `git add .`.
- No `!important`.
- Set Canvas `component_version` to `NULL` only if you touch a Canvas assembly script (you should not need to for this issue).
- Run T1 + T2 yourself before writing the handoff. Do NOT run T3 (S's job).
