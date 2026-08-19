# Phase 8.4 — Rework: feature-card grid must collapse to 1-col at 768 (match preview, not brief)

**Branch:** `aa/pl-homepage-phase-8.4-card-grid-desktop`
**Pipeline:** O → F-rework → T → S → O
**References:**
- Original issue: [`phase-8.4-card-grid-desktop-issue.md`](phase-8.4-card-grid-desktop-issue.md)
- F handoff (round 1): [`phase-8.4-card-grid-desktop-F.md`](phase-8.4-card-grid-desktop-F.md)
- S audit (round 1, PASS with surfaced contradiction): [`phase-8.4-card-grid-desktop-S.md`](phase-8.4-card-grid-desktop-S.md)

---

## Operator's directive

The S audit returned PASS for round 1, but surfaced a brief-vs-preview contradiction at 768:

- **Brief** (`pl_design_brief.md` §"Responsive behavior") specifies feature cards: 3 → 2 at md → 1 at sm.
- **Preview** (`docs/pl2/Previews/homepage.html`) collapses straight to 1-col at 768.

The operator decided **preview is canonical, mechanically.** Live must match the preview at 768 — that is, **1-col at md (768)**, skipping the 2-col stage.

The brief is now out of date for the homepage feature-card section. Updating the brief is out of scope for this sub-cycle; flag it as a follow-up advisory note. F's job here is the CSS / structural change to make 768 render 1-col.

## Objective

Revise the responsive behavior of the homepage feature-card grid so it renders:
- **1280:** 3-col single row (no change — keep)
- **768:** **1-col** (change from current 2+1)
- **375:** 1-col (no change — keep)

## Scope decision F must make on its own

The 2-col-at-tablet behavior currently comes from the existing `.grid-wrapper--3col` rules in `web/themes/custom/performant_labs_20260502/css/components/grid-wrapper.css` at `@media (min-width: 768px) and (max-width: 991px)`. Two paths to the fix:

1. **Modify the existing helper class.** Change `.grid-wrapper--3col` at the 768-991 range from 2-col to 1-col directly in `grid-wrapper.css`. Cleanest if `.grid-wrapper--3col` is used only on the homepage (or only in places where 1-col-at-tablet is acceptable).

2. **Introduce a new modifier class.** Add e.g. `.grid-wrapper--3col-stack-md` that collapses to 1-col at md instead of 2-col, and switch the homepage Canvas assembly to use the new class. Required if other pages use `.grid-wrapper--3col` and depend on the current 2-col-at-md behavior.

**F decides between these by grepping the codebase first** (`rg "grid-wrapper--3col"` across `web/`, `config/`, `content-exports/`). If the homepage is the only consumer, take path 1. If anything else uses it, take path 2. Document the decision in the rework handoff under §"Layer decisions".

## Acceptance criteria

- [ ] Step-3 trace + the path-1-vs-path-2 decision surfaced in the rework handoff before any CSS / Canvas change is made.
- [ ] Live homepage at 768 renders the three feature cards in a **1-column stack**.
- [ ] Live homepage at 1280 still renders 3-col single row (no regression).
- [ ] Live homepage at 375 still renders 1-col stack (no regression).
- [ ] Other consumers of `.grid-wrapper--3col` (if any) remain unchanged. If path 2 is taken, the homepage Canvas assembly is updated to reference the new modifier class; the original `.grid-wrapper--3col` rules are unchanged.
- [ ] No horizontal overflow at any of 1280 / 768 / 375 (re-confirm — 8.2 fixes must not regress).
- [ ] No `!important`. Files staged by explicit path. `component_version` retention rule from round 1 still applies (do NOT NULL it; Canvas requires the exact hash).

## Inputs (in addition to round-1 inputs)

1. `docs/pl2/handoffs/phase-8.4-card-grid-desktop-S.md` §"Per-section delta description" — S's measurement notes for the feature-card crop at 768.
2. The preview HTML at `docs/pl2/Previews/homepage.html` — open at 768 and inspect the feature-card section's computed `grid-template-columns` to confirm 1-col.

## Handoff location

Write your rework handoff to: `docs/pl2/handoffs/phase-8.4-card-grid-desktop-F-rework.md`

## Operating rules

- Same as round 1.
- Do not pause to ask permission. The operator has decided; just execute.
- The "preview is canonical" rule applies to the implementation. The brief's outdated 2-col-at-md spec is documented as a known follow-up; do not edit the brief in this sub-cycle.
- Run T1 + T2 yourself before writing the rework handoff. Do NOT run T3.

## Advisory note for the rework handoff

In your §"Advisory notes" section, flag that the brief at `pl_design_brief.md` §"Responsive behavior" disagrees with the preview at 768 for feature cards (brief says 2-col, preview/now-live says 1-col). Recommend updating the brief in a separate documentation cycle so future work doesn't re-trip on this.
