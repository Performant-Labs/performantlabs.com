# Sprint 11 — Cycle 2e — /services SDC migration + delete orphan SDC config

**Branch:** `aa/pl-sprint-11-cycle-2e-services-sdc`
**Pipeline:** O → F → T → S → O
**Mode:** autonomous

## Objective

Migrate the 4 Canvas components on `/services` that still bind to `sdc.performant_labs_20260418.card-canvas` over to `sdc.dripyard_base.card-canvas` (or whichever the active replacement is). Then delete `canvas.component.sdc.performant_labs_20260418.card-canvas.yml` from `config/sync/`. **Closes the cycle 2a deferred Fix 3.**

After this cycle, `grep -rl 'performant_labs_20260418\|performant_labs_20260411' config/sync/` returns 0 — true zero orphan-theme refs.

## Sources

- `docs/pl2/handoffs/cycle-2a-orphan-themes-F-rework.md` — describes the 4-component blocker on /services entity id=3.
- `config/sync/canvas.component.sdc.performant_labs_20260418.card-canvas.yml` — the orphan with `status: false`.
- `config/sync/canvas.component.sdc.dripyard_base.card-canvas.yml` (or similar) — verify the replacement exists with compatible schema.

## Method

F's steps:

1. Read both SDC configs side-by-side. Confirm `dripyard_base.card-canvas` exists and has compatible props/slots (or document any schema delta).
2. Read /services entity id=3 — find the 4 components binding to `sdc.performant_labs_20260418.card-canvas`. Note each component's `inputs`/`additional_classes`.
3. Idempotent script that rewrites the 4 components' `component_id` from `sdc.performant_labs_20260418.card-canvas` to `sdc.dripyard_base.card-canvas` (or the active replacement). Preserve `inputs`, `slots`, `additional_classes`, `component_version` — BUT note `component_version` is bound to the old SDC's version hash; F must use the replacement SDC's valid hash (read from its `.component.yml` or copy from an existing dripyard_base.card-canvas instance on `/`).
4. Verify /services returns 200 + renders the 4 engagement cards correctly.
5. After /services renders cleanly, delete `canvas.component.sdc.performant_labs_20260418.card-canvas.yml`.
6. Run `drush cex -y` to confirm clean state.
7. Verify `grep -rl 'performant_labs_20260418\|performant_labs_20260411' config/sync/` returns 0.

## Acceptance criteria

- [ ] /services HTTP 200; 4 engagement cards render with correct copy + styling.
- [ ] /services AE=0 at 1280/768/375 (cards must look identical to current shipped state).
- [ ] `canvas.component.sdc.performant_labs_20260418.card-canvas.yml` deleted from `config/sync/`.
- [ ] `grep -rl 'performant_labs_20260418\|performant_labs_20260411' config/sync/` returns 0.
- [ ] No regression on other shipped pages.
- [ ] No `!important`.
- [ ] `component_version` preserved (replacement's valid hash used).
- [ ] Idempotent migration script.

## Hard-stop / advisory triggers

- If `dripyard_base.card-canvas` (or whichever active replacement) has a schema delta that breaks the 4 components' `inputs` → ADVISORY-HOLD. Operator decides between (a) accept schema break with content adaptation, or (b) keep `status: false` orphan as-is.
- If migration produces visual regression (cards render differently) → REWORK.

## Handoff

- F: `docs/pl2/handoffs/cycle-2e-services-sdc-F.md`
- T: `docs/pl2/handoffs/cycle-2e-services-sdc-T.md`
- S: `docs/pl2/handoffs/cycle-2e-services-sdc-S.md`
- Report: `docs/pl2/handoffs/cycle-2e-services-sdc-report.html`
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-11-cycle-2e/`

## Commit message

`refactor(architecture): cycle 2e — /services SDC migration + delete orphan canvas config (true zero-orphan close)`
