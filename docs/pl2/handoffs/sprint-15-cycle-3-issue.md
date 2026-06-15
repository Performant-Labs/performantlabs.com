# Issue: Sprint 15 Cycle 3 — `display-md` H2 mobile at 375 (F-NEW-15-A)

**Branch:** `aa/pl-sprint-15-cycle-3-display-md-mobile`
**Sprint:** 15
**Mode:** Autonomous
**Pipeline:** F → T → S (S includes mandatory cross-page sweep per PC-3 IF live CSS rule changes)

## Objective

Bring `display-md` H2 mobile size at 375 to brief value (~32 px) on both live and preview. Both renders deviate today: live §B H2 = 40 px (overshoots brief by 8 px), preview §B H2 = 30 px (undershoots brief by 2 px).

## Input documents

- [ ] `docs/pl2/handoffs/sprint-15-cycle-1-audit.md` §"F-NEW-15-A" + brief-compliance §B row (line 184, 198)
- [ ] `docs/pl2/briefs/pl_design_brief.md` `typography-mobile` block / responsive section — brief `display-md` mobile value
- [ ] `docs/pl2/theme-change--workflow.md` — 7-step CSS workflow
- [ ] `docs/pl2/handoffs/sprint-14-cycle-3-F.md` — precedent for layer-trace-driven scope narrowing (an apparent L1 issue turned out to be a Canvas marker)

## Acceptance criteria

- [ ] **Live** §B/§C/§D/§E H2 at 375 reads the brief's `display-md` mobile value (verify the exact value from brief — likely 32 px / lh ≤ 1.10). Confirm via Playwright computed-style probe.
- [ ] **Preview** equivalent rule in `docs/pl2/Previews/how-we-do-it.html` matches the same brief value.
- [ ] Desktop `display-md` H2 (40 px, lh 1.05–1.10) **unchanged** on both renders.
- [ ] §F H2 (`display-lg`) **unchanged** on both renders.
- [ ] No `!important`. Standard 7-step layer trace; document the chosen layer in the handoff.
- [ ] T1 + T2 verification: cache-clear `ddev drush cr`; curl-grep confirm the new value lands in served CSS; structural HTML unchanged.
- [ ] **Cross-page sweep (S, MANDATORY IF live CSS rule changes).** S re-captures every page that renders `display-md` for section H2s at 375 px: at minimum `/`, `/services`, `/about-us`, `/open-source-projects`, `/how-we-do-it`. For each: confirm H2 now reads brief value; no layout breakage; no horizontal scroll. If F's fix is scoped narrower (e.g. Canvas marker or page-specific selector), document this and S can run a narrower sweep.

## Constraints

- Trace before assuming layer. Sprint 14 Cycle 3 lesson: an apparent "live too big at mobile" finding turned out to be a Canvas marker mechanism, not an L1 token. F's 7-step trace may reveal:
  - L1 token (theme typography rule for `display-md` mobile breakpoint)
  - L5 marker (some pages may already have a marker firing a correct rule)
  - Component-specific (the `.heading.h2` utility class behavior)
- No `!important`. Stage by explicit path.
- Per memory `feedback_no_orphan_words.md` — at the new H2 size, verify no orphan-word regression on §B/§C/§D/§E across the cross-page sweep.

## Handoff locations

- F: `docs/pl2/handoffs/sprint-15-cycle-3-F.md`
- T: `docs/pl2/handoffs/sprint-15-cycle-3-T.md`
- S: `docs/pl2/handoffs/sprint-15-cycle-3-S.md`
- S report: `docs/pl2/handoffs/sprint-15-cycle-3-report.html`
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-15-cycle-3/`
- Scripts: `scripts/sprint-15-cycle-3-*.mjs` (per-cycle output dirs to avoid clobbering baselines — Sprint 14/15 Cycle 2 lesson)

## Notes for F

If your 7-step trace reveals the fix needs to be L1 (sitewide theme CSS rule), surface that to the orchestrator log via your handoff — the cross-page sweep at S becomes the gating signal. If the fix can be scoped to a marker class or smaller layer, prefer that (PC-3 explicitly prefers L5).

**The first priority is reading the brief carefully** — confirm the exact `display-md` mobile value (the audit guessed ~32; verify). Brief precedence per PC-1: if brief is unambiguous, that's the target. If brief is silent or ambiguous on the mobile reduction, surface as a spec-ambiguity escalation trigger (operator-decision threshold trigger 2).
