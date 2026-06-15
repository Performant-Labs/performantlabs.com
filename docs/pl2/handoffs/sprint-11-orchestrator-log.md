# Sprint 11 — Hygiene sweep — Orchestrator Log

**Runbook:** [`../pl-plan--sprint-11-hygiene.md`](../pl-plan--sprint-11-hygiene.md)
**Integration branch:** `aa/pl-sprint-11-hygiene`
**Mode:** autonomous
**Started:** 2026-05-12

## Kickoff pre-commitments

- PC-1 — Goal is **zero open tech-debt** at sprint close.
- PC-2 — Orphan-theme deletion only if `core.extension` confirms uninstalled.
- PC-3 — Branch delete only if `git branch --merged main` lists it.
- PC-4 — Specificity-safe doubled-class marker convention (Sprint 10 codification) for /open-source-projects.
- PC-5 — AE=0 binding for any refactor work.
- PC-6 — S ADVISORY-HOLD silent-park.
- PC-7 — Pa11y "0 errors with allowlist applied" (Sprint 9 standard).
- PC-8 — Audit-before-fix (Sprint 7-10 codification).

## Cycle timeline

### Cycle 1 — Hygiene audit

- **Opened:** 2026-05-12
- **Branch:** `aa/pl-sprint-11-cycle-1-audit`
- **Pipeline:** S only
- **Threads:** orphan-themes, branches, FU-5, /open-source-projects markers, FU-4 doc
- **Closed:** 2026-05-12 — S PASS.
- **Thread A:** orphan themes are STILL INSTALLED (audit corrected sprint-8 assumption — the `0` in `core.extension` is weight, not enable flag). 1.8M + 976K on disk, 22 orphan block.block.* configs in `config/sync/`. Required sequence: `drush theme:uninstall` → `cex` → `rm -rf`. AE bind required.
- **Thread B:** 34 merged branches enumerated; all `git branch -d`-safe.
- **Thread C:** FU-5 (J.4 header wrap at 1280) CLEAN. Close.
- **Thread D:** `/open-source-projects` Community section = canvas_page id=5, delta=11 (theme=white, no additional_classes), kicker delta=12 "Community" centered. Single 2b refactor: add `dy-section--centered-white`, drop P2 transition lines in dy-section.css.
- **Thread E:** FU-4 fix is `export CURL_CA_BUNDLE="$(mkcert -CAROOT)/rootCA.pem"` in `~/.zshrc`. Mkcert root at `/Users/andreangelantoni/Library/Application Support/mkcert/rootCA.pem`. Operator-only.
- **Carve:** 2a orphan-theme uninstall (F+T+S, AE bind); 2b /open-source-projects markers (F+T+S, AE bind); commit-time: branch cleanup + doc updates + register zero-out.

### Cycle 2a — Orphan-theme uninstall + cleanup

- **Closed:** 2026-05-12 — S PASS by-construction after 1 rework round.
- 1 rework: F missed 4 lingering config refs (favicon/logo paths, og:image, orphan canvas SDC entity, canvas folder entry); rework recovered assets from git history + updated configs. Fix 3 (delete orphan SDC config) deferred → Cycle 2e.

### Cycle 2b — `/open-source-projects` markers

- **Closed:** 2026-05-12 — S PASS (AE=0 all 15 page×viewport pairs).
- 2 markers applied. P2 `:has` drop deferred (F found 4 cross-page consumers) → Cycle 2c.

### Cycle 2c — P2 transition cleanup

- **Closed:** 2026-05-12 — S PASS (AE=0 all 18 pairs).
- Scope expanded 4 → 6 consumers via F's cross-page audit. P2 `:has` fully dropped.

### Cycle 2d — P1 transition cleanup

- **Closed:** 2026-05-12 — S PASS (AE=0 all 18 pairs).
- 4 new sections marked. P1 `:has` fully dropped.

### Cycle 2e — `/services` SDC migration + delete orphan SDC config

- **Closed:** 2026-05-12 — S PASS by-construction (same SDC hash + schema = byte-identical) + temporal self-diff AE=0.
- 4 cards migrated; orphan SDC config deleted; `grep config/sync/` returns 0 — true zero orphan-theme refs.

### Wrap

- 65 merged Sprint cycle branches `git branch -d`-deleted in one batch.
- Tech-debt register zeroed out.
- FU-4 mkcert env line documented for operator.
- Sprint 11 wrap doc + this log committed and merged.
