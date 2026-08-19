# Issue: Sprint 14 Cycle 3 — Mobile `display-xl` L1 token raise + cross-page sweep (F-NEW-2)

**Branch:** `aa/pl-sprint-14-cycle-3-mobile-display-xl-token`
**Sprint:** 14
**Mode:** Autonomous
**Pipeline:** F → T → S (S includes mandatory cross-page sweep per PC-3)

## Objective

Raise mobile (< 576 px) `display-xl` from 36 px (live) to 44 px (brief) in the active theme `performant_labs_20260502`, plus raise the corresponding preview rule in `docs/pl2/Previews/about-us.html` from 40 to 44 px so live and preview both match brief. Mandatory cross-page S sweep before merge — every landing page that uses `display-xl` for the hero will gain ~8 px (live) / ~4 px (preview) of vertical headline height at mobile, which may reflow hero CTA stacking.

## Input documents

- [ ] `docs/pl2/handoffs/sprint-14-cycle-1-audit.md` §"F-NEW-2" — finding details, measured values, layer-trace pointer
- [ ] `docs/pl2/briefs/pl_design_brief.md` §"Responsive behavior" + `typography-mobile` block — brief mobile scale (display-xl 44 px at < 576)
- [ ] `docs/pl2/theme-change--workflow.md` — mandatory 7-step CSS workflow
- [ ] `docs/pl2/pl-plan--sprint-14-about-us-fidelity-hq.md` — runbook (PC-3 cross-page sweep requirement)
- [ ] `docs/pl2/Previews/about-us.html` — preview file (`.hero h1` mobile rule, around line 514)

## Acceptance criteria

- [ ] **F-NEW-2 (live L1).** Mobile `display-xl` typography rule in `web/themes/custom/performant_labs_20260502/` (or the appropriate theme CSS file — trace it via the 7-step workflow) raised from 36 px to **44 px** at the `< 576` (or comparable Bootstrap `sm`) breakpoint. Letter-spacing per brief mobile scale.
- [ ] **F-NEW-2 (preview).** Preview mobile rule `.hero h1 { font-size: 40px }` at ~line 514 of `docs/pl2/Previews/about-us.html` raised to 44 px to match brief.
- [ ] Desktop `display-xl` rule (72 px) is **unchanged** (Cycle 2 already set the preview at 72 px desktop; live has been 72 px since pre-Sprint-13).
- [ ] No `!important`. Standard 7-step layer trace; L1 token is the documented layer per PC-3.
- [ ] T1 + T2 verification: cache-clear `ddev drush cr`; curl-grep confirm the new value is in the served CSS; structural HTML unchanged.
- [ ] **Cross-page sweep (S, mandatory).** S re-captures every landing page that uses `display-xl` for the hero at 375 px: at minimum `/`, `/services`, `/how-we-do-it`, `/open-source-projects`, `/about-us`. For each: confirm the H1 now reads 44 px / lh per brief; confirm hero CTA stacking is not disrupted; confirm no horizontal scroll introduced; flag any layout breakage as REWORK.

## Constraints

- L1 token only. Do NOT add page-specific or marker-class scoping unless trace reveals it's required.
- No `!important`.
- Stage by explicit path.
- Live theme files live under `web/themes/custom/performant_labs_20260502/`. Preview lives under `docs/pl2/Previews/about-us.html`.
- Per memory `feedback_no_orphan_words.md` — at 44 px mobile, verify the hero H1 still wraps without a single-word orphan on each page touched by the cross-page sweep.
- Per memory `feedback_visual_diff_mandatory.md` — S must produce pixel-level diffs (live-pre-fix vs live-post-fix at 375) per page in the cross-page sweep. Re-use `scripts/sprint-14-cycle-1-capture.mjs` adapted for multiple URLs, or write a small per-page script under `scripts/sprint-14-cycle-3-*.mjs`.

## Handoff locations

- F handoff: `docs/pl2/handoffs/sprint-14-cycle-3-F.md`
- T handoff: `docs/pl2/handoffs/sprint-14-cycle-3-T.md`
- S handoff: `docs/pl2/handoffs/sprint-14-cycle-3-S.md`
- S operator report: `docs/pl2/handoffs/sprint-14-cycle-3-report.html`
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-14-cycle-3/`

## Notes for F

The mobile typography scale in the brief (`typography-mobile` block) is the source of truth for every mobile size. F-NEW-2 specifically raises `display-xl`. The trace should reveal whether the theme defines `display-xl` via a top-level CSS variable (e.g. `--font-size-display-xl`) with a media-query override, or directly inside an `@media` block on a heading selector. Either layer is L1 — Sprint 5 Cycle 2 codified that typography tokens live at L1 / Layer 3 (`html .theme--white { }`). If the trace surprises (e.g. shows that other tokens cascade off this rule), bring it back to O before committing — that is a scope-change trigger.
