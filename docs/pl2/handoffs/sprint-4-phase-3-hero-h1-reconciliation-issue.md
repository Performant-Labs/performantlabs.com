# Sprint 4 — Cycle 3: Hero H1 size reconciliation

**Mode:** autonomous
**Branch:** `aa/pl-sprint-4-phase-3-hero-h1-reconciliation` (off `aa/pl-sprint-4-pre-services-foundation`)
**Sprint runbook:** [`pl-plan--sprint-4-pre-services-foundation.md`](../pl-plan--sprint-4-pre-services-foundation.md) §"Cycle 3 — Hero H1 size reconciliation (L.1)"
**Upstream source:** [`GET-BACK-TO-THESE.md`](../GET-BACK-TO-THESE.md) §L.1

## Operator pre-commitment

🛑 **S4-3 = Path A** (locked at sprint kickoff 2026-05-11; see runbook §"Operator pre-commitments (autonomous mode)").

Reconcile previews UP to 72px. Brief stays unchanged (already has `display-xl: 72px`). Live stays unchanged at 72px (Dripyard `--h1-size: 4.5rem`). Brief codifies `display-xl` as the standard landing-page hero size.

**Do not present option A/B/C menus.** Execute path A.

## Objective

Reconcile the hero H1 size discrepancy across all four landing-page heroes. Today: live renders 72px, previews specify 64px, brief has no 64px token. After this cycle: previews specify 72px / -1.8px tracking; brief gets a clarifying note codifying `display-xl` as the canonical landing-hero size.

## Why this matters

Services Phase 1 will hit this exact same discrepancy on its hero. Better to set the baseline once, in a sprint that's explicitly pre-Services, than re-litigate during Services.

## Input documents

Read before starting:

- [ ] [Sprint runbook §Cycle 3](../pl-plan--sprint-4-pre-services-foundation.md) — objective, scope, acceptance criteria
- [ ] [`docs/pl2/briefs/pl_design_brief.md`](../briefs/pl_design_brief.md) — locate the `display-xl` token entry in the typography scale; add the clarifying note here
- [ ] [`docs/pl2/Previews/homepage.html`](../Previews/homepage.html), [`services.html`](../Previews/services.html), [`how-we-do-it.html`](../Previews/how-we-do-it.html), [`open-source-projects.html`](../Previews/open-source-projects.html) — the four files to update

## Scope (path A)

1. In each of the four preview HTML files, locate the hero H1 styling. The change is `font-size: 64px` → `font-size: 72px` and `letter-spacing` (or `tracking`) from whatever-was-set-for-64px to `-1.8px`. Inspect the existing previews to confirm the current selector and rule before editing.
2. In [`docs/pl2/briefs/pl_design_brief.md`](../briefs/pl_design_brief.md), under the `display-xl` token (in the typography scale or wherever the token is documented), add a one-line clarifying note: `display-xl` is the standard hero size for landing-page hero H1s (homepage, services, how-we-do-it, open-source-projects). 72px / -1.8px tracking.

## Files expected to change

- `docs/pl2/Previews/homepage.html`
- `docs/pl2/Previews/services.html`
- `docs/pl2/Previews/how-we-do-it.html`
- `docs/pl2/Previews/open-source-projects.html`
- `docs/pl2/briefs/pl_design_brief.md` (one-line note under `display-xl`)

## Acceptance criteria (verbatim from runbook)

- [ ] All four landing-page heroes render the same H1 size — 72px (path A)
- [ ] Previews match live (cross-page T3 at 1280)
- [ ] Brief is consistent with rendered output
- [ ] No regressions on non-hero H1 contexts (e.g. article body H1)

## Operator decision

Already decided — path A locked at sprint kickoff. **Do not surface back.**

## Handoff location

Write your handoff to: `docs/pl2/handoffs/sprint-4-phase-3-hero-h1-reconciliation-F.md`

## Operating rules

- **Mode: autonomous** — Step 3 layer trace is self-approved. This cycle is NOT a CSS change at all — it's preview HTML + brief documentation. The 7-step CSS workflow applies only if you find yourself touching CSS (which you should not — live is already 72px and is the source of truth this cycle aligns to).
- Stage files by explicit path.
- Mandatory handoff section: **Autonomous decisions** — list every decision you made that would have surfaced to the operator in human-in-the-loop mode (e.g. exact wording of the brief annotation; resolution of any inconsistency between the four preview files).

## Pre-flight check (Cycle 1 / 2 pattern)

Before editing, run the same pre-flight check as Cycles 1 and 2: verify the work isn't already done. Grep each preview file for `font-size: 64px` or `font-size: 72px` in hero H1 context. If any preview already has 72px, note it in the handoff (the cycle may be partial or fully-complete from prior work — Cycle 1 was already-complete; Cycle 2 added new code).

## Verification environment

Standard. Cycle 3 is preview-files-only — T1/T2 are file-grep based, not curl-based. T3 will compare preview renderings to live at 1280.

| Item | Value |
|---|---|
| Live URL (for T3 cross-check) | `https://pl-performantlabs.com.3.ddev.site:8493/` |
| Live hero H1 size (current truth) | 72px / Dripyard `--h1-size: 4.5rem` |
| SSL workaround for shell curl | `ddev exec curl http://localhost/<path>` |
