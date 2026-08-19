# Sprint 6 — Cycle 2 — `/services` engagement grid 768 collapse (FU-S5-1)

**Branch:** `aa/pl-sprint-6-cycle-2-grid-collapse`
**Pipeline:** O → F → T → S → O
**Mode:** autonomous

## Objective

At ≤ 991 px, the `/services` engagement-cards grid currently renders 2×2; the canonical preview at `docs/pl2/Previews/services.html` collapses to 1-col. Bring live in line with preview at 768.

This is FU-S5-1 from the Sprint 5 wrap and is the single open layout gap from Sprint 5 cycle 2 (which audited at 768 as MATCH but Cycle 2's S advisory later flagged the misclassification).

## Input documents

- [ ] `docs/pl2/handoffs/sprint-5-wrap.md` §"Follow-up backlog" FU-S5-1
- [ ] `docs/pl2/handoffs/cycle-2-engagements-S.md` (Sprint 5 — original S finding)
- [ ] `docs/pl2/Previews/services.html` (find `<section class="engagements">` and inspect grid CSS at 768)
- [ ] `docs/pl2/briefs/pl_design_brief.md` §"Per-section mobile behavior" — feature cards spec
- [ ] `web/themes/custom/performant_labs_20260502/css/components/grid-wrapper.css` — current state (Sprint 5 cycle 2 added `row-gap: 1.5rem`)
- [ ] `docs/pl2/theme-change--workflow.md`
- [ ] `docs/pl2/pl-plan--sprint-6-services-polish-and-recon.md`

## Scope (in)

Single targeted L5 rule on `.grid-wrapper--2col .grid-wrapper__grid`:

- Below 992 px: `grid-template-columns: 1fr` (1-col, all 4 cards stacked).
- At 992 px and above: existing 2-col rule unchanged.

**Cross-page risk to assess:** `.grid-wrapper--2col` is shared. Sprint 5 Cycle 2 T verified it appears only on `/services` (zero matches on `/`, `/articles`). Re-confirm during Step-3 layer trace; if a new cross-page user has appeared, scope the rule to the engagement section specifically (e.g., a section-marker class, or `:not(.grid-wrapper--n)` etc.).

## Out of scope

- Other sections.
- Pre-existing accepted deviations.

## Acceptance criteria

- [ ] `/services` § engagements at 768×1024: 1-col, 4 cards stacked vertically.
- [ ] `/services` § engagements at 992+: unchanged 2×2.
- [ ] `/services` § engagements at 375: unchanged 1-col.
- [ ] No regression on `/`, `/about-us`, `/articles`, or other pages — F traces `.grid-wrapper--2col` cross-page usage in handoff.
- [ ] No `!important`.
- [ ] T1 + T2 PASS on `/services` (and any other page using `.grid-wrapper--2col`, if found).
- [ ] WCAG unchanged (no color/typography touched).

## Handoff locations

- F: `docs/pl2/handoffs/cycle-2-grid-collapse-F.md`
- T: `docs/pl2/handoffs/cycle-2-grid-collapse-T.md`
- S: `docs/pl2/handoffs/cycle-2-grid-collapse-S.md`
- Report: `docs/pl2/handoffs/cycle-2-grid-collapse-report.html`
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-6-cycle-2/`

## Operating rules

Per F canonical prompt. Source-of-truth precedence: brief tokens > preview > live (Sprint 5 carry-over). No `!important`. Stage by explicit path.

## Commit message (O will commit on S PASS)

`feat(services): cycle 2 — § engagements 768 grid collapse (FU-S5-1)`
