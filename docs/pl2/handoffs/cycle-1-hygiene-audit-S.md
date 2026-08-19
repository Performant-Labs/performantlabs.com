# Handoff-S: Sprint 11 — Cycle 1 — Hygiene audit

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-11-cycle-1-audit`
**Issue:** `docs/pl2/handoffs/cycle-1-hygiene-audit-issue.md`
**Runbook:** `docs/pl2/pl-plan--sprint-11-hygiene.md`
**Pipeline:** O → S → O (audit-only)
**Mode:** autonomous
**Operator-facing report:** [`cycle-1-hygiene-audit-report.html`](cycle-1-hygiene-audit-report.html)

## T precondition

N/A — audit-only cycle, no F/T work to verify.

## Thread A — Orphan theme directories

### Install state (binding: `drush pm:list --type=theme`)

| Theme | core.extension entry | pm:list status | Default? |
|---|---|---|---|
| `performant_labs_20260411` | listed (weight 0) | **Enabled** | no |
| `performant_labs_20260418` | listed (weight 0) | **Enabled** | no |
| `performant_labs_20260502` | listed (weight 0) | Enabled | **default** (per `system.theme`) |
| `performant_labs` | listed (weight 0) | Enabled | no |

**Correction to prior assumption.** The `0` value in `core.extension.yml` under `theme:` is the *weight*, not the install flag — presence under the `theme:` key means installed. `drush pm:list` confirms `performant_labs_20260411` and `performant_labs_20260418` are still **Enabled**. They are not the default theme, but they are not uninstalled.

### Disk impact

| Path | Size | File count |
|---|---|---|
| `web/themes/custom/performant_labs_20260411` | 1.8M | 45 |
| `web/themes/custom/performant_labs_20260418` | 976K | 39 |

### Live consumers (grep across active theme + modules + `config/sync/`)

- Active theme `performant_labs_20260502`: 3 hits — **comments only** in `css/components/footer.css` and `templates/content/node--article--teaser.html.twig` (historical implementation notes; no live `@import`, `library` ref, or template include).
- `web/modules/custom/`: 0 hits.
- `config/sync/`: **22 hits across 22 orphan `block.block.performant_labs_2026041{1,8}_*.yml` files** + the `core.extension.yml` `theme:` entries. These are block placements bound to the orphan themes; they are inert because the themes are not default, but they are not orphan-content-free — exporting config after a clean uninstall would purge them.

### Recommendation

**Not safe to delete the directories as-is.** Required sequence:

1. `ddev exec drush theme:uninstall performant_labs_20260411 performant_labs_20260418` — this also removes the 22 orphan block configs and the two `core.extension.yml` `theme:` entries.
2. `ddev exec drush cex -y` to write the cleaned config to `config/sync/`.
3. `rm -rf web/themes/custom/performant_labs_20260411 web/themes/custom/performant_labs_20260418` — frees 2.8M total, 84 files.
4. Commit the disk + config sync changes together so a future `drush cim` does not re-reference the directories.

Doc-only branch in Cycle 2a is feasible but the cycle is **not "doc-only-ish"** as the runbook §Cycle 2a optimistically described. It touches: 2 theme dirs deleted (84 files), ~24 yml deletions in `config/sync/`, and 2 lines removed from `core.extension.yml`. Still single-operator-applicable (O direct, no F), no functional Twig/CSS edit — but the diff is non-trivial and AE binding at 1280/768/375 on the homepage is recommended before merge to confirm zero visual impact.

## Thread B — Merged cycle branches

`git branch --merged main | grep aa/pl-sprint-` returned 34 branches; all are genuinely merged.

### Classification

**Cycle / phase branches (safe to delete, 30):**
```
aa/pl-sprint-1-conversion-repair
aa/pl-sprint-10-cycle-1-audit
aa/pl-sprint-10-cycle-2a-doc-fix
aa/pl-sprint-10-cycle-2b1-about-us
aa/pl-sprint-10-cycle-2b2-services
aa/pl-sprint-10-cycle-2b3-how-we-do-it
aa/pl-sprint-10-cycle-2b4-homepage-logo-grid
aa/pl-sprint-2-mobile-aa-sweep
aa/pl-sprint-3-footer-sweep
aa/pl-sprint-4-phase-2-tokens-on-root
aa/pl-sprint-4-phase-3-hero-h1-reconciliation
aa/pl-sprint-4-phase-5-a11y-polish
aa/pl-sprint-4-pre-services-foundation
aa/pl-sprint-5-cycle-1-audit
aa/pl-sprint-5-cycle-2-engagements
aa/pl-sprint-5-cycle-3-closing-cta
aa/pl-sprint-5-cycle-4-proof
aa/pl-sprint-5-cycle-final-verification
aa/pl-sprint-6-cycle-1-recon
aa/pl-sprint-6-cycle-2-grid-collapse
aa/pl-sprint-6-cycle-3-nearshore-cap
aa/pl-sprint-7-cycle-1-audit
aa/pl-sprint-7-cycle-final-verification
aa/pl-sprint-7-mobile-hero-overflow
aa/pl-sprint-8-cycle-1-audit
aa/pl-sprint-8-cycle-final-verification
aa/pl-sprint-8-footer-and-contact
aa/pl-sprint-9-a11y-debt
aa/pl-sprint-9-cycle-1-audit
aa/pl-sprint-9-cycle-2-fixes
```

**Integration / sprint-umbrella branches (safe to delete, also merged, 4):**
```
aa/pl-sprint-10-architecture-cleanup
aa/pl-sprint-5-services-fidelity
aa/pl-sprint-6-services-polish-and-recon
aa/pl-sprint-11-hygiene
```

**Current working branch (do not delete):**
```
aa/pl-sprint-11-cycle-1-audit
```

### Spot-checks (`git log <branch> --oneline | head -5`)

- `aa/pl-sprint-10-cycle-2b4-homepage-logo-grid` → tip `87831a290 refactor(architecture): cycle 2b.4 — homepage logo-grid selector-class markers (ADV-3)` — clearly a cycle artifact.
- `aa/pl-sprint-11-hygiene` → tip `a2e761952 Merge Sprint 10 architectural cleanup ... into main` — integration branch, content already in main.
- `aa/pl-sprint-1-conversion-repair` → tip `7bd2d62b8 chore(sprint-1): remove deploy script — DB pushed to prod directly` — historical cycle artifact.

### Recommendation

Delete all 34 listed branches via `git branch -d <name>` (safe-delete; refuses if not merged). Use `-d` not `-D`. Per memory `project_local_only_main`, this is local-only — no remote push needed.

Cycle 2a one-liner:
```bash
git branch --merged main | grep -E "aa/pl-sprint-" | grep -v "aa/pl-sprint-11-cycle-1-audit" | xargs -n1 git branch -d
```

## Thread C — FU-5 homepage §J.4 "How we do it" header wrap at 1280

**Verdict: CLEAN. No regression.**

### Probe

Playwright headed render at 1280×800, full page:
- File: `screenshots/sprint-11-cycle-1/t3-home-1280-live-20260512.png`
- Header crop: `screenshots/sprint-11-cycle-1/t3-home-1280-header-20260512.png`

### Computed nav geometry at 1280

| Label | x | y | width | height |
|---|---|---|---|---|
| Services | 526.30 | 24.75 | 62.05 | 22.5 |
| **How we do it** | **620.34** | **24.75** | **94.80** | **22.5** |
| Articles | 747.14 | 24.75 | 54.78 | 22.5 |
| Open source projects | 833.92 | 24.75 | 160.63 | 22.5 |
| About us | 1026.55 | 24.75 | 66.36 | 22.5 |
| Contact us | 1124.91 | 24.75 | 82.39 | 22.5 |

All six labels share `y=24.75`, `height=22.5` (single text line; computed `line-height` ≈ 22.5). No wrap, no overflow. Header wrapper bounding box: `width=1265, height=73` (well within viewport).

Visual crop confirms single-line header — consistent with `design_header_nav_breakpoint` (`navbar-expand-lg` ≥ 992 px inline). FU-5 J.4 closed: phase-8.6 header rework resolved it; no follow-up cycle needed.

## Thread D — `/open-source-projects` Community section P2 marker

### Entity + section identification (binding: `canvas_page__components`)

- Page node id (legacy): 5 (`node_field_data.title = "Open Source Projects"`)
- Canvas page id: 5 (`canvas_page_field_data.title = "Open Source Projects"`)
- Path aliases: `/open-source-projects` → `/page/5`; `/open-source-projects-0` → `/node/5`

### Section + kicker map for `canvas_page` id=5

| delta | component | inputs |
|---|---|---|
| 0 | `sdc.dripyard_base.section` | `theme:white`, additional_classes:`landing-hero` |
| 1 | `kicker` | text:`Open source`, variant:**centered** |
| 4 | `section` | `theme:light` |
| 5 | `kicker` | text:`Testing tools`, variant:centered |
| **11** | **`section`** | **`theme:white`** (no `additional_classes`) |
| **12** | **`kicker`** | **text:`Community`, variant:centered** |
| 18 | `section` | `theme:white`, additional_classes:`dy-section--other-modules` |
| 22 | `section` | `theme:dark` |
| 23 | `kicker` | text:`Contribute`, variant:centered |

### Selector reach verification

Community section = canvas page **id=5, delta=11** (section) + delta=12 (kicker text "Community", variant centered).

Current state (`web/themes/custom/performant_labs_20260502/css/components/dy-section.css`):
- New marker `.dy-section--centered-white` is defined (lines 132, 140, 151).
- Old `:has(.kicker--centered)` half retained for `.theme--white` (lines 133, 141, 152) — explicitly to catch this unmarked Community section.
- Section delta=0 ("Open source") also matches the old `:has` selector against `.theme--white` — but the legacy `landing-hero` `additional_classes` likely overrides centering via its own scoped rules. Worth confirming during Cycle 2b implementation.

Section delta=18 already carries `dy-section--other-modules` (its own marker) — not a P2 consumer.

### Recommendation

Single Cycle 2b mini-refactor:

1. **Add the marker.** In Canvas page id=5, edit section at delta=11 and add `dy-section--centered-white` to `additional_classes`. Verify delta=0 ("Open source") behavior unchanged after fix — if its hero rules don't override and removing `:has()` from P2 breaks it, add the marker there too. Most likely outcome: only delta=11 needs the marker.
2. **Drop the old `:has` half of P2.** In `dy-section.css`, remove lines 133, 141, 152 (the `.theme--white:has(...)` selectors) leaving only the marker-class selectors.
3. **AE=0 binding** on `/open-source-projects` at 1280 / 768 / 375 (full page) per Sprint 10 method.

Pre-committed runbook §Cycle 2b carve stands. No revision needed.

## Thread E — FU-4 mkcert SSL chain

### Verification

| Probe | Result |
|---|---|
| `mkcert -CAROOT` | `/Users/andreangelantoni/Library/Application Support/mkcert` |
| Root CA exists? | `/Users/andreangelantoni/Library/Application Support/mkcert/rootCA.pem` (1883 bytes, present) |
| `curl https://...ddev.site:8493/` (host shell, no env) | **`curl: (60) SSL certificate problem: unable to get local issuer certificate`** |
| `CURL_CA_BUNDLE=... curl ...` (host shell) | **HTTP 200** |

The mkcert root CA exists at the standard macOS location but is not in `curl`'s default CA bundle search path. Pointing `CURL_CA_BUNDLE` at it resolves SSL error 60.

### Exact fix — add to `~/.zshrc`

```bash
# mkcert CA for host-side curl (DDEV HTTPS chain) — Sprint 11 FU-4
export CURL_CA_BUNDLE="$(mkcert -CAROOT)/rootCA.pem"
```

Re-source: `source ~/.zshrc` (or open a new terminal). Verify with `curl -sS -o /dev/null -w "%{http_code}\n" https://pl-performantlabs.com.3.ddev.site:8493/` → expect `200`.

### Why not F/O-applicable

`~/.zshrc` lives outside the repo and cannot be edited from inside the project's git tree. The operator must apply this change in their shell config. Document in `sprint-11-wrap.md` as an action item.

## Cycle 2 carve recommendation

Pre-committed carve in `pl-plan--sprint-11-hygiene.md` §Cycles 2..N stands, with one clarification.

| Cycle | Pipeline | Scope | Notes |
|---|---|---|---|
| **2a — Theme + branch cleanup** | O direct | (1) `drush theme:uninstall performant_labs_20260411 performant_labs_20260418` → `drush cex -y`. (2) `rm -rf` the two theme dirs. (3) `git branch -d` 34 merged branches. | **Not "doc-only-ish"**: ~26 files deleted from `config/sync/`, 2 lines removed from `core.extension.yml`, 84 files removed from disk. Bind with 1280 homepage AE check before merge. |
| **2b — `/open-source-projects` marker + P2 cleanup** | O → F → T → S → O | Add `dy-section--centered-white` to canvas id=5 delta=11; drop old `:has()` half of P2 in `dy-section.css`. | AE=0 at 1280/768/375 on `/open-source-projects`. Per Sprint 10 codification convention. |
| **2c — FU-4 + FU-5 docs** | O direct | FU-4: shell-config fix in wrap as operator action. FU-5: closed (Thread C clean) — wrap entry "closed, no action". | Doc-only. |
| **Final — Zero-debt verification baseline** | T + S | Tech-debt register at zero open. Pa11y 0 errors with allowlist. AE 1280/768/375 across touched pages. | Standard Sprint-9 standard. |

## Verdict

**PASS — audit complete, all five threads resolved with binding signals.**

Cycle 2 carve approved as pre-committed in the runbook, with one clarification (Cycle 2a touches config/sync — not strictly doc-only). Operator may proceed to Cycle 2a.

## Advisory notes

- After Cycle 2a runs, also consider `drush theme:uninstall performant_labs` (the plain-name legacy theme) if it has no consumers. Out of scope for this sprint — flag for a future register entry only if needed.
- `web/sites/default/files/sync/` contains a stale `config/sync` snapshot (likely a historical export). Not in scope here; flag for future hygiene.
