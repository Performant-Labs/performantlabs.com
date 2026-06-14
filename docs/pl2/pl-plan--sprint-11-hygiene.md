# Sprint 11 — Hygiene sweep — Runbook

> **Parent:** [`pl-plan.md`](pl-plan.md)
> **Workflow:** [`workflow-ofts.md`](workflow-ofts.md)
> **Mode:** autonomous
> **Predecessor:** Sprint 10 ([wrap](handoffs/sprint-10-wrap.md))
> **Tech-debt source:** [`tech-debt-register.md`](tech-debt-register.md) §G + Bundle 7.

## Goal

**Drive tech-debt register to zero open items.** Final hygiene sweep.

## Items in scope

1. **FU-4** — Host-shell `curl` rejects mkcert chain (SSL error 60). Env-side fix.
2. **FU-5** — Spot-check `/` at 1280 for J.4 header wrap (Sprint 4 carry-over).
3. **FU-8** + carry — Merged cycle branches across Sprints 4–10 not deleted.
4. **Orphan-theme directories** — `performant_labs_20260411` + `performant_labs_20260418` (surfaced Sprint 8). Confirm uninstalled, delete.
5. **P2 transition-selector cleanup** — `/open-source-projects` Community section needs `.dy-section--centered-white` marker; then drop the old `:has` half of P2's transition selector in `dy-section.css`.

## Sources of truth

1. Live shipped state (no regressions).
2. Drupal config (theme install state).
3. Git state (branch list).

## Cycles

### Cycle 1 — Hygiene audit

**Pipeline:** O → S → O.

**Threads:**
- **A** — verify orphan themes are uninstalled in active Drupal config (`drush config:get core.extension`); enumerate their disk size + file count.
- **B** — list every merged cycle branch (`git branch --merged main`); confirm each is genuinely merged.
- **C** — visual spot-check `/` at 1280 for J.4 "How we do it" header label wrap (Sprint 4 FU-5).
- **D** — verify `/open-source-projects` Community section selector reach — does it actually depend on P2's `:has` half? If yes, identify the entity ID + section index to mark.
- **E** — FU-4 mkcert chain: document the operator-side fix (one-line `.zshrc` addition). Cannot be applied by O without operator-shell access.

**Acceptance.**
- [ ] Orphan themes confirmed uninstalled (or flagged still-installed).
- [ ] Merged branch list enumerated with deletion safety per branch.
- [ ] FU-5 J.4 header verdict: clean / regressed.
- [ ] /open-source-projects Community section entity ID + index recorded.
- [ ] FU-4 fix steps documented for the wrap.
- [ ] Cycle 2 carve recommendation.

### Cycle 2..N — Fix cycles

Pre-committed carve (audit may revise):

- **Cycle 2a — Orphan-theme + branch cleanup (O direct, no F).** Delete orphan-theme directories if confirmed uninstalled. Delete merged cycle branches via `git branch -d`. Doc-only-ish — does touch disk but with high confidence after audit. O applies directly per Sprint 6 cycle 1 + Sprint 10 cycle 2a precedent.

- **Cycle 2b — `/open-source-projects` markers + P2 cleanup** (O → F → T → S → O). Real CSS + Canvas-content change. AE=0 binding.

- **Cycle 2c — FU-4 + FU-5 documentation only.** FU-4 documented as operator action item in wrap. FU-5 — if Cycle 1 finds it regressed, open a micro-cycle; if clean, close.

### Final cycle — Zero-debt verification baseline (T + S)

Confirm: tech-debt register has zero open items; live state pixel-identical at 1280/768/375 on all touched pages; pa11y 0 errors with allowlist.

## Approval Checkpoints (pre-committed)

| Checkpoint | Pre-commitment |
|---|---|
| Cycle 1 carve | O carves per audit. |
| Orphan-theme deletion safety | Apply only if `core.extension` confirms uninstalled. Otherwise leave + log. |
| Branch deletion safety | Apply only to branches that `git branch --merged main` lists. Never force-delete. |
| Open-source-projects refactor | Specificity-safe convention (Sprint 10 codification): `.dy-section.dy-section--centered-white`. |
| AE binding | /open-source-projects pixel-identical at 1280/768/375 per the established Sprint 10 verification method. |
| S ADVISORY-HOLD | Silent park. |
| Pa11y | 0 errors with allowlist (Sprint 9 standard). |

## Hard-stop floor

Env / availability / new WCAG regression / config schema deletion.

## Sprint posture

Local-only; `--no-ff` per cycle into integration; integration `--no-ff` into local `main` at wrap.

## Out of scope

- Any new tech-debt items not in the register at sprint kickoff.
- Site visual changes.
