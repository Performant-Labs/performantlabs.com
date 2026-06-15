# Sprint 10 — Architectural cleanup — Runbook

> **Parent:** [`pl-plan.md`](pl-plan.md)
> **Workflow:** [`workflow-ofts.md`](workflow-ofts.md)
> **Mode:** autonomous
> **Predecessor:** Sprint 9 ([wrap](handoffs/sprint-9-wrap.md))
> **Tech-debt source:** [`tech-debt-register.md`](tech-debt-register.md) §E "Architecture / fragility" + Bundle 6.

## Goal

Resolve two architectural-rot items:

- **ADV-3** — `dy-section.css` uses DOM-shape-sniffing selectors (`:not(:has(.grid-wrapper))`, `:has(> .button + .button)`) — work but fragile. Sprint 3+5+6 added more (now including `> :not(.button) { max-width: none }`). Replace with class-based markers (`dy-section--centered`, `dy-section--has-cta-pair`, etc.) so the cascade is readable and future-edit-safe.
- **component_version** — Canvas throws `OutOfRangeException` on NULL `component_version`. The F canonical workflow says "set to NULL" (in `workflow-ofts.md` + theme-change docs). F has been quietly working around this since Sprint 5. Update workflow doc to reflect platform constraint.

## Sources of truth (precedence)

1. WCAG 2.2 AA — non-negotiable.
2. Live shipped state — Sprint 5/6/9 already-merged work is canonical; refactor must preserve it.
3. `docs/pl2/briefs/pl_design_brief.md` — token authority for any CSS touched.
4. Brief tokens > preview > content > live (Sprint 5 carry-over).

## Cycles

### Cycle 1 — Architectural-debt audit

**Pipeline:** O → S → O.

**Objective.**

1. **ADV-3 audit.** Enumerate every fragile selector in `dy-section.css` (and any other shared component CSS file with similar patterns). For each: which page/component currently relies on the selector? What class-based marker would replace it cleanly? Estimate Canvas-content edits required (one marker per affected section across all Canvas pages).
2. **`component_version` audit.** Read the canonical workflow doc(s) — `~/.claude/agents/feature-implementor.md`, `docs/pl2/workflow-ofts.md`, `docs/pl2/theme-change--workflow.md`, any others. Find every place that says "set to NULL". Recommend updated wording reflecting the Canvas platform constraint (leave the field's existing non-NULL value untouched, or document the actual contract).
3. **Carve recommendation.** Selector refactor has real shipped-state risk; doc edit is trivial. Default carve: 2a doc edit (low-risk, do first), 2b selector refactor (real risk, scope cap may require split per-component).

**Scope.**
- `dy-section.css` selectors used by `/services` + `/about-us` + any other Canvas-page consumer.
- All workflow-doc locations referencing `component_version`.

**Acceptance.**
- [ ] ADV-3 inventory: every fragile selector listed with current consumer + proposed class marker.
- [ ] `component_version` doc audit: every file + line mentioning NULL, with proposed wording.
- [ ] Refactor strategy: single sweeping cycle vs per-selector micro-cycles vs no-op (if Sprint 7+8 pattern repeats and the refactor is already done somewhere).
- [ ] Risk assessment for selector refactor: which shipped pages would re-render and need visual diff verification.
- [ ] Verdict PASS.

### Cycle 2..N — Fix cycles

**Pipeline:** O → F → T → S → O.

Pre-committed carve:

- **Cycle 2a — `component_version` workflow doc fix (doc-only).** O may apply directly (Sprint 6 cycle 1 precedent for doc-only edits). Edit each canonical workflow file to reflect the platform constraint discovered in Sprint 5+. No code touched.
- **Cycle 2b — ADV-3 selector-class refactor.** F-driven. Audit decides whether this is one cycle (≤ 6 files, single sweep) or split per affected section/component. The work is:
  - For each fragile selector, add a Canvas-class marker to the affected component's `modifier_classes` / `additional_classes` prop (Canvas content edit, idempotent script).
  - Replace the fragile CSS selector with the new class-based selector in `dy-section.css`.
  - Verify shipped pages render identically (T3 visual diff).
  - Single-cycle expected; F may scope-split.

### Final cycle — Cross-page regression baseline (T + S)

**Pipeline:** O → T → S → O.

**Objective.** After selector refactor lands, verify shipped state on `/services`, `/about-us`, and any other Canvas-page consumer is pixel-identical at 1280/768/375. Pa11y 0 errors with allowlist (Sprint 9 standard).

May be skipped per Sprint 9 pattern if Cycle 2b naturally produces an independent verification baseline.

## Approval Checkpoints (pre-committed)

| Checkpoint | Pre-commitment |
|---|---|
| Cycle 1 carve | O carves per audit. |
| Doc-only cycle (2a) | O applies directly; no F/T/S overhead (per Sprint 6 cycle 1 precedent). |
| Selector-refactor scope | F splits if > 6 files or > 1 component family. |
| Brief ↔ preview ↔ live divergence | Refactor must preserve shipped state pixel-identical at 1280/768/375. Any divergence = REWORK. |
| S ADVISORY-HOLD | Silent park. |
| Pa11y | "0 errors with allowlist applied" (Sprint 9 standard). |
| Canvas content edits | Idempotent scripts; `component_version` non-NULL constraint observed (this sprint codifies that). |

## Hard-stop floor

Env / availability / new WCAG regression / unexpected config schema deletion.

## Sprint posture

Local-only; `--no-ff` per cycle → integration → main. Standard log + wrap.

## Out of scope

- Bundle 7 (hygiene + orphan-theme cleanup) — separate sprint.
- User-facing fidelity changes — refactor must be pixel-identical to shipped.
- L3 token changes — refactor is L5 + content only.
