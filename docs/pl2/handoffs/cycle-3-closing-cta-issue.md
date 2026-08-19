# Sprint 5 — Cycle 3 — § closing-cta preview fidelity

**Branch:** `aa/pl-sprint-5-cycle-3-closing-cta`
**Pipeline:** O → F → T → S → O
**Mode:** autonomous

## Objective

Bring `/services` § closing-cta visually in line with `docs/pl2/Previews/services.html` § `<section class="closing-cta">`. Resolve audit deltas C1, C2, C3 from `docs/pl2/handoffs/cycle-1-audit-services-S.md` §"§ closing-cta."

## Input documents

- [ ] `docs/pl2/handoffs/cycle-1-audit-services-S.md` §"§ closing-cta" — delta catalog (C1–C6)
- [ ] `docs/pl2/Previews/services.html` — find `<section class="closing-cta">`
- [ ] `docs/pl2/briefs/pl_design_brief.md` — token authority
- [ ] `docs/pl2/theme-change--workflow.md` — 7-step layer trace
- [ ] `docs/pl2/pl-plan--sprint-5-services-fidelity.md` — sprint runbook

## Scope (in) — from Cycle 1 catalog

| ID | Delta | Remediation |
|---|---|---|
| C1 | Element order: preview is `kicker → H2 → body copy → CTA cluster (both buttons)`. Live is `kicker → body copy → H2 → CTA split: primary beside H2, secondary alone below`. | Canvas content (reorder fields on entity id=3) + L5 (override title-cta or scoped closing-cta CSS) |
| C2 | H2 alignment: preview centers H2; live left-aligns with primary CTA pushed beside. | L5 — title-cta override or scoped closing-cta CSS, center the H2. |
| C3 | CTA cluster: preview shows both buttons side-by-side centered below body copy (primary teal pill + ghost-on-dark outlined pill). Live splits them. | L5 — flex container, justify-content:center, gap. |

C4 mobile MATCH; C5 tokens MATCH; C6 ghost-on-dark variant MATCH. No work on those.

## Out of scope

- Other sections.
- Ghost-on-dark button variant — already exists and renders correctly (C6 MATCH).
- Espresso bg + terracotta kicker token — MATCH (C5).
- Pre-existing accepted deviations.

## Acceptance criteria

- [ ] § closing-cta at `/services` matches preview at 1280×800 (768/375 may be MATCH already per C4).
- [ ] Element order matches preview: `kicker → H2 → body → CTAs` (C1).
- [ ] H2 is centered within the espresso panel (C2).
- [ ] Both CTAs render side-by-side centered below body copy at 1280; stack at 375 (C3).
- [ ] Mobile 375 unchanged from current MATCH (or improves).
- [ ] No `!important` introduced.
- [ ] Tier 1 + Tier 2 PASS on `/services`.
- [ ] WCAG contrast unchanged or improved (espresso bg / cream H2 / terracotta kicker — all unchanged).
- [ ] All Canvas patches set `component_version: NULL` where possible; if Canvas constraint forces non-NULL (per cycle 2 finding), document.
- [ ] Files staged by explicit path.
- [ ] F scope cap respected (≤ 6 files; one component family).

## Handoff locations

- F: `docs/pl2/handoffs/cycle-3-closing-cta-F.md`
- T: `docs/pl2/handoffs/cycle-3-closing-cta-T.md`
- S: `docs/pl2/handoffs/cycle-3-closing-cta-S.md`
- Report: `docs/pl2/handoffs/cycle-3-closing-cta-report.html`
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-5-cycle-3/`

## Operating rules

Per F canonical prompt. Highlights:
- 7-step CSS workflow.
- Read `.component.yml` before referencing prop names.
- Highest correct layer; no L4 patches.
- No `!important`.
- Stage by explicit path.
- Source-of-truth precedence: brief tokens > preview layout > live. If preview's CSS values differ from the issue's prose description, preview wins (per Cycle 2 precedent).

## Commit message (O will commit on S PASS)

`feat(services): cycle 3 — § closing-cta preview fidelity (element order + H2 centering + CTA cluster)`
