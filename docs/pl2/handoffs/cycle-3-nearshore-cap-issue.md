# Sprint 6 — Cycle 3 — § nearshore container-cap (FU-S5-5)

**Branch:** `aa/pl-sprint-6-cycle-3-nearshore-cap`
**Pipeline:** O → F → T → S → O
**Mode:** autonomous

## Objective

`/services` § nearshore H2 currently wraps at the page-level container width (~1140 px) at 1280; the canonical preview at `docs/pl2/Previews/services.html` wraps within a content-cap of ~640 px. Apply path (a) per Sprint 6 PC-3: add a Canvas-class marker via Canvas content edit, then a small L5 block to scope a `max-width: ~640px; margin-inline: auto; text-wrap: balance` rule.

## Input documents

- [ ] `docs/pl2/handoffs/sprint-5-wrap.md` §"Follow-up backlog" FU-S5-5
- [ ] `docs/pl2/handoffs/cycle-1-audit-services-S.md` §"§ nearshore" — original N2 finding
- [ ] `docs/pl2/Previews/services.html` — find `<section class="nearshore">` and inspect H2 container styling
- [ ] `docs/pl2/briefs/pl_design_brief.md`
- [ ] `web/themes/custom/performant_labs_20260502/css/components/dy-section.css`
- [ ] Sprint 5 cycle 4 (`scripts/sprint5-cycle4-proof-wordmark.php`) for an example of Canvas-content patching pattern using `modifier_classes`
- [ ] `docs/pl2/pl-plan--sprint-6-services-polish-and-recon.md`

## Scope (in)

1. **Canvas content edit** on entity `canvas_page` id=3 (uuid `b2613e35-516b-4d7c-86b8-75eb8a5d5356`, alias `/services`): identify the nearshore `dy-section` component and add a marker class to its `modifier_classes` prop (e.g., `nearshore-section`). Capture in `scripts/sprint6-cycle3-nearshore-marker.php`.

2. **L5 CSS** in `dy-section.css` (preferred) or a new `nearshore.css` if F judges separation cleaner: scope a content-cap rule under the new marker class:
   - H2 `max-width: ~640px; margin-inline: auto; text-wrap: balance`
   - Body text inherits the same content-cap container if appropriate (verify against preview)
   - Container padding unchanged

## Out of scope

- Other sections.
- Pre-existing accepted deviations.

## Acceptance criteria

- [ ] `/services` § nearshore H2 at 1280: wraps within a ~640 px content-cap, matching preview's wrap pattern.
- [ ] `text-wrap: balance` applied to H2 (memory `feedback_no_orphan_words.md`).
- [ ] `/services` § nearshore at 768 + 375: unchanged (already MATCH).
- [ ] No regression on other `dy-section` instances on `/services` or other pages — F confirms the marker class is scoped to nearshore only.
- [ ] No `!important`.
- [ ] T1 + T2 PASS.
- [ ] Canvas content edit captured in `scripts/sprint6-cycle3-nearshore-marker.php`.
- [ ] Canvas `component_version` non-NULL constraint applies (per Sprint 5 Cycles 2/3/4).

## Handoff locations

- F: `docs/pl2/handoffs/cycle-3-nearshore-cap-F.md`
- T: `docs/pl2/handoffs/cycle-3-nearshore-cap-T.md`
- S: `docs/pl2/handoffs/cycle-3-nearshore-cap-S.md`
- Report: `docs/pl2/handoffs/cycle-3-nearshore-cap-report.html`
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-6-cycle-3/`

## Operating rules

Per F canonical prompt. Source-of-truth precedence: brief tokens > preview > content > live.

## Commit message (O will commit on S PASS)

`feat(services): cycle 3 — § nearshore container-cap via Canvas-class marker (FU-S5-5)`
