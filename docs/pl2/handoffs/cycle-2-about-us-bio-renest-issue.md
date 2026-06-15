# Cycle 2 — `/about-us` Bio block re-nest inside §C + hairline above

**Sprint:** 12
**Branch:** `aa/pl-sprint-12-cycle-2-about-us-bio-renest`
**Pipeline:** O → F → T → S → O
**Mode:** autonomous

## Objective

Restore R9 compliance on live `/about-us`. The bio block "Who we are." currently ships as its own promoted section (`dy-section--bio-block theme--white`, ~1395 px tall) between §B (Track record) and §C (Open source). Per R9 in `pl-plan--about-us.md` line 54 and per `Previews/about-us.html`, the bio must sit **inside §C** (after the 3-up tools card grid), separated from the card grid by a terracotta/grey hairline rule above the bio's h3.

## Background — Cycle 1 audit finding

S's Cycle 1 audit ([`cycle-1-about-us-audit-S.md`](cycle-1-about-us-audit-S.md)) found this row as **REWORK**:

> Live has promoted the bio block to its own `dy-section--bio-block theme--white` section (height 1395 px). The preview embeds the bio inside §C with a thin terracotta-grey hairline rule above it, and locked decision R9 in `pl-plan--about-us.md` says the bio "stays inside §C (not promoted to its own section), separated by a hairline rule above." Live violates R9; the hairline rule above the h3 is also missing.

Section-cluster carve absorbed: "Bio (§C tail)" REWORK row from Cycle 1's delta table.

## Input documents

Read these before starting:

- [ ] `docs/pl2/pl-plan--sprint-12-about-us-fidelity.md` — sprint runbook (PC table; relevant: PC-1, PC-6, PC-7)
- [ ] `docs/pl2/pl-plan--about-us.md` — page runbook; R9 line 54
- [ ] `docs/pl2/Previews/about-us.html` — canonical visual reference for the bio block placement + hairline treatment
- [ ] `docs/pl2/briefs/pl_design_brief.md` — kicker / hairline token tables
- [ ] `docs/pl2/handoffs/cycle-1-about-us-audit-S.md` — full Cycle 1 audit + sibling-fit context
- [ ] `docs/pl2/handoffs/sprint-12-orchestrator-log.md` — sprint state; note FB-4 (orphan-CSS sweep advisory)
- [ ] `docs/pl2/workflow-ofts.md` §"F — Feature Implementor" (7-step workflow)

## Operating environment

- **Live URL:** `https://pl-performantlabs.com.3.ddev.site:8493/about-us`
- **Active theme:** `performant_labs_20260502`
- **DDEV:** port 8493; mkcert-trusted, no `-k` flags needed
- **Canvas-content edits:** PHP via `ddev drush php:script`. Patch script MUST preserve `component_version` (PC-6) — never set to NULL. Reference idempotent pattern: `scripts/sprint6-cycle3-nearshore-marker.php`.
- **Markers:** any new section marker must follow `.dy-section.dy-section--<marker>` (0,2,0) specificity-safe form (PC-7) — but this cycle is **removing** a promoted section, not adding one.

## Scope

**In scope:**

1. **Canvas-content patch (idempotent PHP script).** Demote the bio block from its own section into the tail of §C's content. Preferred shape: bio paragraph + headshot become the trailing content within the same §C component as the 3-up tools card grid. Preserve `component_version` on every edited component (PC-6). Place script under `scripts/sprint12-cycle2-about-us-bio-renest.php`.
2. **L5 component CSS.** Add the hairline-above treatment between the tools card grid and the bio h3. Tokens: `--hairline` (`#E5E1DC`) is the family chrome hairline; preview spec calls for a terracotta-grey rule — F to trace which token the preview uses and match it. Hairline lives in the §C / bio component CSS; scope strictly to about-us context to avoid sibling regression.
3. **Orphan CSS sweep (FB-4 from orchestrator log).** Once re-nest lands, identify whether `.dy-section--bio-block` selector and any companion rules have other consumers. If unique to /about-us, retire the CSS in the same commit. If used elsewhere, leave + flag.
4. **Idempotency.** Re-running the PHP script must be a no-op. Patch detects existing re-nest state and exits cleanly.

**Out of scope:**

- Hero (§A) edits (FU-2 hero exception)
- Kicker terracotta token normalization (deferred to Cycle 3)
- Card-canvas outer padding (deferred to Cycle 4)
- Any sibling page (`/services`, `/open-source-projects`, homepage)
- New brand tokens
- New SDCs

## Acceptance criteria

- [ ] Live `/about-us` no longer renders a standalone bio section between §B and §C; bio sits inside §C below the 3-up tools card grid.
- [ ] A horizontal hairline rule appears immediately above the bio h3 ("Who we are.") at all three viewports, matching the preview's terracotta/grey treatment.
- [ ] `dy-section--bio-block` markup is no longer present on live; if any orphan CSS is removed, the diff is recorded in handoff-F.
- [ ] Canvas patch script is idempotent (second run = zero changes).
- [ ] `component_version` is preserved on every Canvas component edited (PC-6); patch does NOT set version to NULL.
- [ ] No regression on `/services` or `/open-source-projects` (shared-CSS spot check at T).
- [ ] Tier 1 (curl/grep) and Tier 2 (ARIA / structural) pass at T.
- [ ] Tier 3 visual at 1280 / 768 / 375 at S: per-section delta for §C-tail flips from REWORK → MATCH. Whole-page AE per PC-8 is informative, not binding.
- [ ] Pa11y with existing allowlist applied: 0 errors (PC-5). Allowlist NOT edited.
- [ ] WCAG 2.2 AA table at S re-runs clean (keyboard nav, focus rings, heading hierarchy, contrast on bio h3 + body, etc.). No new orphan words on the bio h3.
- [ ] No `!important`; correct layer choice per Step-3 layer trace (PC-3); L5 preferred.

## Handoff locations

- `docs/pl2/handoffs/cycle-2-about-us-bio-renest-F.md`
- `docs/pl2/handoffs/cycle-2-about-us-bio-renest-T.md`
- `docs/pl2/handoffs/cycle-2-about-us-bio-renest-S.md`

## Layer-choice guidance (PC-3, autonomous)

F's Step-3 layer trace is autonomous in this mode. Expected outcome: L5 for the hairline-above CSS scoped to the §C/bio context; Canvas-content patch for the structural demotion. L3 token only justified if F discovers the hairline color is a missing token that should be added cross-page (flag at handoff if so).

## Pre-commitments inherited from sprint kickoff

PC-1..PC-10 in `docs/pl2/pl-plan--sprint-12-about-us-fidelity.md`. Especially relevant: PC-1 (brief/preview > live for structure), PC-3 (autonomous layer trace), PC-6 (component_version), PC-8 (per-section AE binding).

## Commit message (drafted by O at cycle close)

`refactor(about-us): cycle 2 — re-nest bio inside §C + hairline above (R9 restore)`
