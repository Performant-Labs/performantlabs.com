# Sprint 4 — Cycle 2: Brand tokens on `:root`

**Mode:** autonomous
**Branch:** `aa/pl-sprint-4-phase-2-tokens-on-root` (off `aa/pl-sprint-4-pre-services-foundation`)
**Sprint runbook:** [`pl-plan--sprint-4-pre-services-foundation.md`](../pl-plan--sprint-4-pre-services-foundation.md) §"Cycle 2 — Brand tokens on `:root` (L.4)"
**Upstream source:** [`GET-BACK-TO-THESE.md`](../GET-BACK-TO-THESE.md) §L.4

## Objective

Declare the brand-canonical token values (`--ink`, `--body`, `--cream`, `--primary`, `--accent`, etc.) on `:root` in [`base.css`](../../web/themes/custom/performant_labs_20260502/css/base.css) so any code that reads them outside a `.theme--*` zone receives the brand values instead of falling through to a legacy `--primary: #0000d9` from a Dripyard / Tailwind ancestor.

## Why this matters (context for F)

Today, `getComputedStyle(document.documentElement).getPropertyValue('--ink')` returns empty. `:root --primary` resolves to `#0000d9` (legacy). Everything currently renders correctly **only because** component CSS hardcodes colors or stays inside themed zones. Any future component that reads a token at the root level — JS-driven, third-party, or a new SDC — receives the wrong value silently. This is the foundational pre-Services fix to prevent every future page's F session from re-encountering it.

## Input documents

Read before starting:

- [ ] [Sprint runbook §Cycle 2](../pl-plan--sprint-4-pre-services-foundation.md) — objective, scope, acceptance criteria
- [ ] [`web/themes/custom/performant_labs_20260502/css/base.css`](../../web/themes/custom/performant_labs_20260502/css/base.css) — existing `html .theme--white`, `html .theme--light`, etc. blocks; identify all brand tokens and their canonical (white-surface) values
- [ ] [`docs/pl2/briefs/pl_design_brief.md`](../briefs/pl_design_brief.md) — brand color tokens table (source of truth for canonical values)
- [ ] [`docs/pl2/theme-change.md`](../theme-change.md) — Layer system reference
- [ ] [`docs/pl2/theme-change--workflow.md`](../theme-change--workflow.md) — 7-step workflow

## Scope (per runbook)

1. Read the existing brand token definitions inside `html .theme--white`, `html .theme--light`, etc. in `base.css`.
2. Determine the canonical default values (brand-white surface is the most common; use those as the `:root` defaults).
3. Add a `:root { … }` block at the top of `base.css` declaring every brand token with its canonical default.
4. **Verification step:** spot-check every existing component that reads a brand token still resolves to the intended value after the change. Themed-zone overrides should still cascade correctly.

## Files expected to change

- `web/themes/custom/performant_labs_20260502/css/base.css` — add a `:root { … }` block at the top declaring every brand token with its brand-canonical default

## Acceptance criteria (verbatim from runbook)

- [ ] `:root` block defines every brand token with its brand-canonical default
- [ ] `getComputedStyle(document.documentElement).getPropertyValue('--ink')` returns the brand ink color (not empty)
- [ ] `getComputedStyle(document.documentElement).getPropertyValue('--primary')` returns brand teal (not `#0000d9`)
- [ ] Visual diff against current live shows zero delta on `/`, `/articles`, `/contact-us`, `/open-source-projects` (themed zones override correctly)
- [ ] T1 grep confirms `:root` selectors land in served CSS
- [ ] No regressions on any themed surface

## Operator decision

None — deterministic fix; values come from the existing `.theme--white` block in `base.css`.

## Handoff location

Write your handoff to: `docs/pl2/handoffs/sprint-4-phase-2-tokens-on-root-F.md`

## Operating rules

- **Mode: autonomous** — Step 3 layer trace is self-approved (record in handoff "Layer decisions"). This is L3 (theme token layer in `base.css`). Specificity matters: `:root` is lower than `html .theme--white`, so the existing themed-zone overrides MUST continue to take precedence.
- Follow the 7-step CSS change workflow.
- Stage files by explicit path. No `!important`.
- Mandatory handoff section: **Autonomous decisions** — list every decision you made that would have surfaced to the operator in human-in-the-loop mode.

## Verification environment

| Item | Value |
|---|---|
| DDEV URL | `https://pl-performantlabs.com.3.ddev.site:8493/` |
| Port | `8493` (from host) |
| SSL | mkcert-trusted; **note:** host-shell curl currently rejects the cert chain (see orchestrator log, Cycle 1 verification-env note). **Workaround:** use `ddev exec curl http://localhost/` for T1 path checks. Do **not** use `-k` or `--insecure`. |
| Cache clear | `ddev drush cr` before every T1/T2 run |

## Cross-page verification expectation

Per runbook S4-R3, this cycle touches site-wide tokens, so T3 must screenshot at least `/`, `/articles`, and `/contact-us` (Services not yet live) at 1280 + 375 to confirm zero visual delta. Themed-zone overrides should mean zero pixel change anywhere; if anything moves visually, that's a specificity regression and S returns REWORK.
