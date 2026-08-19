# Project Profile — pl2 (performantlabs.com)

> Instance config for the **Website Front-End Pipeline**
> (`~/Projects/playbook/pipelines/website-frontend/`). The local `~/.claude/agents/*`
> compose core role + the `drupal-canvas-sdc` adapter + this profile. Distinct from the
> coding pipelines.

## Identity
- **Project / slug:** `pl2` (performantlabs.com)
- **Canonical repo:** `~/Sites/pl-performantlabs.com` (origin `git@github.com:Performant-Labs/performantlabs.com.git`, deploys to Pantheon)
- **Adapter:** `drupal-canvas-sdc`
- **Local site URL:** `https://performant-labs.ddev.site:8493`
- **Theme machine name (V2, active on branch):** `performant_labs_v2` *(installed, not yet default — V1 `performant_labs` is current default)*
- **Theme inheritance chain:** `dripyard_base → neonbyte → performant_labs_v2`

## Paths
- **V2 subtheme root (scan target — our code):** `web/themes/custom/performant_labs_v2`
- **Parent theme roots (context-only — pristine, never edited):** `web/themes/dripyard_themes/neonbyte`, `web/themes/dripyard_themes/dripyard_base`
- **Token files:** `web/themes/dripyard_themes/neonbyte/css/themes/*.css`, `web/themes/dripyard_themes/neonbyte/css/_variables/`
- **Component roots (reuse source):** `web/themes/dripyard_themes/dripyard_base/components/`, `web/themes/dripyard_themes/neonbyte/components/`
- **Custom components:** `web/themes/custom/performant_labs_v2/components/`
- **Component schema:** each component's `.component.yml` (source of truth)
- **Handoff dir:** `docs/pl2/handoffs/`
- **Runbook:** `docs/pl2/pl-plan--<page>-overhaul.md`
- **CSS change workflow (7-step):** `docs/pl2/theme-change--workflow.md`
- **Layer/override strategy:** `docs/pl2/theme-change.md`
- **Design brief:** `docs/pl2/Briefs/pl_design_brief.md` (mobile type scale: its `typography-mobile` block)

> **Parent theme policy:** findings inside `web/themes/dripyard_themes/*` are **advisory-upstream** —
> report to DripYard if desired, never auto-fix. Only the subtheme is fixable.

## Verification config
- **css-scan roots:** `web/themes/custom/performant_labs_v2` (primary); parents as context-only
- **css-scan injected prefixes:** `--injected-prefix=--theme-setting- --injected-prefix=--drupal-displace- --injected-prefix=--offset-from-header`
- **render-inspect themeVars:** `--theme-surface --theme-text-color-loud --space-for-fixed-header --spacing-component-internal`
- **render-inspect navSelector:** `[data-drupal-selector="mobile-nav-button"]`
- **axe base URL:** the local site URL above (`AXE_BASE_URL`)
- **Stateful-surface inventory:** `docs/pl2/stateful-surfaces.md` + `scripts/state-invariants.config.json`
- **Nav breakpoint:** re-validate W-06 against pristine 1.1.4 (see elevation runbook Stage 5)

## Tools — single-source from the playbook / website-audit repos (no copies in this project)

Tool engines are **not** copied into this repo. **Audit** tools live in the extracted Website
Audit repo (`~/Projects/website-audit/core/tools/`); **build** tools (axe, state-invariants) live
in the playbook front-end pipeline (`~/Projects/playbook/pipelines/website-frontend/core/tools/`).
Node tools resolve
their deps from this project's `node_modules` via `NODE_PATH`. Run all commands from the
project root (`~/Sites/pl-performantlabs.com`).

- **Audit pre-scan (css-scan, pure Python):**
  `python3 ~/Projects/website-audit/core/tools/css-scan.py --cwd "$PWD" --root web/themes/custom/performant_labs_v2 --injected-prefix=--theme-setting- --injected-prefix=--drupal-displace- --injected-prefix=--offset-from-header --out <run-dir>/css-scan.json`
- **Audit render data (render-inspect, node):**
  `NODE_PATH="$PWD/node_modules" node ~/Projects/website-audit/core/tools/render-inspect.cjs <url> <run-dir>/render-config.json > <run-dir>/render-data.json`
- **Build T accessibility (axe, node):**
  `AXE_BASE_URL=<url> NODE_PATH="$PWD/node_modules" node ~/Projects/playbook/pipelines/website-frontend/core/tools/axe-check.cjs / /articles`
- **Build T interaction (state-invariants):**
  `STATE_INVARIANTS_CONFIG=scripts/state-invariants.config.json npx playwright test ~/Projects/playbook/pipelines/website-frontend/core/tools/state-invariants.spec.js`

Node deps (`playwright`, `@axe-core/playwright`, `@playwright/test`) stay installed in this
project's `node_modules` (see `package.json`). `scripts/state-invariants.config.json` is
project data (the real surface inventory) and stays here.

## Audit run isolation — one timestamped folder per run

Every audit run gets its **own** directory so artifacts never mix between runs and you can work
within a single run:

```
docs/pl2/handoffs/audits/<YYYYMMDD-HHMMSS>-<slug>/
  audit-scope.md          render-config.json     css-scan.json
  render-data.json        website-audit-<slug>-<phase>.html
  triage.md               issues/                # decomposed fix issues for THIS run
```

O creates the dir at the start of a run: `RUN=docs/pl2/handoffs/audits/$(date +%Y%m%d-%H%M%S)-<slug>; mkdir -p "$RUN/issues"`. All scope, scan, render, report, triage, and decomposed-issue files for that run live inside it. *(Pre-convention artifacts — `docs/pl2/handoffs/audits/render-001/` and `docs/pl2/handoffs/website-audits/` — are left in place as history.)*

## Posture
- **Repo posture:** canonical production repo with real remote; branch work on `aa/theme-v2-elevation`;
  push branch, **do not merge to `main`** until explicit cutover approval.
- **Mode default:** autonomous (see core `modes.md`).

## Pipeline-improvement runbook
`docs/pl2/pl-plan--pipeline-v2.md` (all stages done 2026-06-12).
