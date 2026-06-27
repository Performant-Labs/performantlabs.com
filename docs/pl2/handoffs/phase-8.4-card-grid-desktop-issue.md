# Phase 8.4 — Feature-card grid renders 2+1 at desktop, must be 3-column

**Branch:** `aa/pl-homepage-phase-8.4-card-grid-desktop`
**Pipeline:** O → F → T → S → O
**Parent:** Phase 8 visual parity audit ([`phase-8-visual-parity-S.md`](phase-8-visual-parity-S.md), §"Feature cards — REWORK")

---

## Operator's directive

The operator-approved preview at `docs/pl2/Previews/homepage.html` is canonical. Match it. **Do not pause to ask permission** — execute. Surface decisions only when the brief and the preview genuinely contradict each other.

The standing rule for all of Phase 8: preview wins.

---

## Objective

The "Tools, AI, and experts. All there." feature-card section must render as a single 3-column row at desktop (1280), matching the preview. Currently it renders as **2 cards on row 1, 1 card alone on row 2** at 1280 — a 2+1 layout that contradicts both the brief and the preview.

## Problem (from S audit)

| Viewport | Live | Preview / brief | Status |
|---|---|---|---|
| 1280 | 2 + 1 layout (cards 01 & 02 row 1; card 03 alone row 2) | Single 3-column row | LAYOUT WRONG |
| 768 | 2-column (per S audit, not directly cropped) | 2-column per brief responsive table | LIKELY MATCH |
| 375 | 1-column | 1-column | MATCH |

Brief's responsive behavior table (`docs/pl2/Briefs/pl_design_brief.md` §"Responsive behavior"):
- Feature cards: **3 columns at desktop, 3 → 2 at md (768px), 2 → 1 at sm (576px)**.

The card chrome itself (kicker bar, "01 / TOOLS" eyebrow, corner arrow icon) already MATCHES preview per S — so the `card` SDC override from Phase 4.1 is correct. **This sub-cycle is purely a grid-template / container-width problem, not a card-component problem.**

## Likely diagnosis directions (for F's trace)

S's audit suggests "the grid is collapsing to a 2-column track at 1280". Most likely root causes:

1. **Wrong grid-template at desktop.** The grid container may declare `grid-template-columns: repeat(2, 1fr)` somewhere that takes effect at desktop, or `repeat(3, 1fr)` is missing. Check the Canvas assembly, the `card` parent wrapper, and any `grid-wrapper--3col` or equivalent helper class.

2. **Container max-width forcing 2-up.** The grid container may have a max-width below the natural 3-card width, or each card has a min-width too large for 3 to fit.

3. **Media query boundary wrong.** The "3 cols at desktop" rule may be guarded by a `min-width: 1440px` or larger breakpoint when it should be `min-width: 992px` (lg) or even `min-width: 768px` (md).

Trace upward (Pass 1 bottom-up, Pass 2 top-down) per the 7-step workflow. Find the root, fix at the highest correct layer.

## Acceptance criteria

- [ ] Step-3 trace surfaced in F handoff before any CSS is written; root cause and chosen layer documented.
- [ ] Desktop (1280) renders the three feature cards as a **single 3-column row** (no wrap to row 2).
- [ ] Tablet (768) renders **2 columns** (preserve — verify no regression).
- [ ] Mobile (375) renders **1 column** (preserve — verify no regression).
- [ ] No horizontal overflow at any viewport (re-confirm post-change; 8.2 fixed this and we must not regress).
- [ ] Card chrome unchanged (kicker, eyebrow, corner arrow — these match per S, no Phase-4.1 work needed).
- [ ] No `!important`. Files staged by explicit path. Canvas `component_version` set to `NULL` only if you touch a Canvas assembly script.

## Inputs (read all before writing code)

1. `docs/pl2/handoffs/phase-8-visual-parity-S.md` §"Feature cards" — the audit findings.
2. `docs/pl2/Previews/homepage.html` — canonical visual reference. Inspect the feature-card grid container's `grid-template-columns` at 1280 / 768 / 375.
3. `docs/pl2/Briefs/pl_design_brief.md` §"Responsive behavior" — feature-card grid spec.
4. `docs/pl2/Briefs/pl_homepage_components.md` — feature-card component mapping.
5. `docs/pl2/theme-change--workflow.md` — the 7-step CSS workflow (mandatory).
6. `docs/pl2/theme-change.md` — Layer 1–5 system.
7. `~/Projects/playbook/themes/dripyard-guidance.md` — for grid-helper class discovery (e.g. `grid-wrapper--3col` if used).
8. The Canvas assembly script for the homepage (find via `grep -r "Tools, AI, and experts" config/`) — useful if the grid template is set there rather than in CSS.

## Handoff location

Write your handoff to: `docs/pl2/handoffs/phase-8.4-card-grid-desktop-F.md`

## Operating rules (per the F prompt)

- Follow the 7-step CSS change workflow.
- Override at the highest correct layer.
- Do NOT pause to ask permission. Decisions like "which layer" are yours; surface only if the brief and preview contradict each other.
- Read `.component.yml` before referencing any prop or slot name.
- Stage files by explicit path. No `git add .`.
- No `!important`.
- Set Canvas `component_version` to `NULL` if you touch a Canvas assembly script.
- Run T1 + T2 yourself before writing the handoff. Do NOT run T3 (S's job).
