# Sprint 11 — Hygiene sweep — Wrap

**Sprint:** Sprint 11
**Runbook:** [`../pl-plan--sprint-11-hygiene.md`](../pl-plan--sprint-11-hygiene.md)
**Integration branch:** `aa/pl-sprint-11-hygiene` (deleted at wrap)
**Mode:** autonomous
**Started + Wrapped:** 2026-05-12 (same-day)
**Cycles:** 6 (Cycle 1 audit + 5 fix cycles). 1 rework round (2a).

## Outcomes

| Cycle | Slug | Outcome | Rework |
|---|---|---|---|
| 1 | Hygiene audit (S-only) | **PASS** — 5 threads resolved | 0 |
| 2a | Orphan-theme uninstall + cleanup | **PASS** | 1 (4 lingering config refs) |
| 2b | `/open-source-projects` markers | **PASS** | 0 (P2 :has drop deferred → 2c) |
| 2c | P2 transition cleanup | **PASS** | 0 (6 consumers vs 4 audited) |
| 2d | P1 transition cleanup | **PASS** | 0 |
| 2e | `/services` SDC migration + orphan SDC delete | **PASS** | 0 |

## Tech-debt items closed (Sprint 11)

- **FU-4** — Documented operator-side mkcert env fix: `echo 'export CURL_CA_BUNDLE="$(mkcert -CAROOT)/rootCA.pem"' >> ~/.zshrc && source ~/.zshrc`. Operator action when convenient.
- **FU-5** — `/` header at 1280 verified clean (Sprint 11 cycle 1 Thread C).
- **FU-8 + carry** — 65 merged cycle branches `git branch -d`-deleted in one batch.
- **Orphan themes** `performant_labs_20260411` + `performant_labs_20260418` fully uninstalled, on-disk dirs deleted, 30+ orphan config files removed, asset references re-pointed.
- **ADV-3 P1 + P2 transition selectors** fully dropped — all `:has(.kicker--centered)` and `:has(.dy-section__header .kicker--centered)` shape-sniffing patterns removed from `dy-section.css`. Replaced by `.dy-section.dy-section--centered-light` (6 sections) and `.dy-section.dy-section--centered-white` (8 sections) markers.
- **/services SDC migration** — 4 engagement cards migrated from `sdc.performant_labs_20260418.card-canvas` to `sdc.dripyard_base.card-canvas`. Schema identical (same version hash, same props); byte-identical render. Closed cycle 2a's deferred Fix 3.

**Final grep:** `grep -rl 'performant_labs_20260418\|performant_labs_20260411' config/sync/` returns **0**. **True zero orphan-theme refs achieved.**

## What shipped

**Real architectural change.** ~14 sections gained marker classes; ~5 fragile `:has` rules dropped; 1 orphan SDC config deleted; 30+ orphan block/asset configs removed; ~2.8 MB of dead theme code removed from disk.

Files touched at sprint level:

- `config/sync/system.theme.global.yml`, `metatag.metatag_defaults.global.yml`, `metatag.metatag_defaults.front.yml`, `canvas.folder.4bf98081-...yml` — orphan-asset paths corrected.
- `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` — 9 selector rewrites, 5 `:has` lines dropped.
- `web/themes/custom/performant_labs_20260502/favicon.svg`, `assets/og-image.png` — recovered from `0ec999538` git history.
- `web/themes/custom/performant_labs_20260411/` + `performant_labs_20260418/` — deleted entirely.
- Canvas content (entities 3, 4, 5, 13, 17, 20) — 18 marker applications + SDC migration via 5 idempotent scripts.
- 25 orphan config files removed via `drush cex`.

## Verification baseline (citable by future sprints)

After Sprint 11 close on `main`:

- **All 7 shipped pages return HTTP 200** (`/`, `/services`, `/about-us`, `/articles`, `/contact-us`, `/how-we-do-it`, `/open-source-projects`).
- **Pa11y `npx --yes pa11y-ci --config .pa11yci.json`:** 7/7 URLs, 0 errors (allowlist applied).
- **WCAG 2.2 AA:** every row PASS per S audits across all cycles.
- **Heading hierarchy:** single H1 on every shipped page; no skipped levels.
- **Mobile scroll (WCAG 1.4.10):** `scrollWidth ≤ clientWidth` at 320 + 375 on all four landing pages (Sprint 7 baseline carried forward).
- **Zero `:has(.kicker--centered)` and zero `:has(.dy-section__header .kicker--centered)` shape-sniffing in `dy-section.css`.**
- **Zero orphan-theme refs in `config/sync/`.**
- **Local branch state:** only `main` + 3 long-lived branches (`main-backup-pre-reconcile-2026-05-06`, `apply-designa-homepage`, `vc/homepage-comparison`). 65 merged Sprint cycle branches deleted.

## Tech-debt register: zero open

Per `docs/pl2/tech-debt-register.md`: **Status: ZERO open items.** Two operator-approved brand-color exceptions remain documented on the pa11y allowlist as live design choices, not debt.

Operator-side action items (documented, not blockers):
- FU-4 mkcert env line in `~/.zshrc`.
- Optional brand-color token-tweak re-eval for `--primary` teal + breadcrumb link.

## Calibration notes

1. **Closing tech-debt generates new items as a function of audit thoroughness.** Sprint 11 started with 5 threads; cycle 2a surfaced 4 missed config refs; cycle 2b surfaced 4 missed P2 consumers; cycle 2c surfaced 2 more; T's cycle 2c advisory surfaced P1's mirror problem. Each audit catches more.

2. **The "audit-before-fix" pattern (Sprints 7-10 codification) holds.** Each Sprint 11 fix cycle was preceded by a small audit step in F's pre-flight check. F's autonomous scope expansions (cycle 2c finding 6 vs 4; cycle 2d finding 6 sections; cycle 2e finding the byte-identical replacement SDC) were sound and prevented regressions.

3. **Asymptote.** Eventually every fix surfaces zero new debt. Sprint 11 cycle 2e was that point — the last `grep config/sync/` returned zero. Closing achievable.

4. **Specificity-safe convention** (Sprint 10 codification) survived: all new markers used the doubled-class form.

## Sprint history (10 sprints, 2026-05-11 → 2026-05-12)

| Sprint | Focus | Outcome |
|---|---|---|
| 4 | Pre-Services foundation + FU-2 hero | Shipped |
| 5 | `/services` preview-fidelity | Shipped (1 nearshore deferred → S6) |
| 6 | Services polish + recon | Shipped (3 follow-ups closed) |
| 7 | R8 mobile hero overflow | No-op (empirically resolved) + baseline |
| 8 | Footer + contact webform | No-op (empirically resolved) + baseline |
| 9 | A11y debt | Shipped (pa11y allowlist + /articles h2) |
| 10 | Architectural cleanup | Shipped (12 selectors → 9 markers) |
| 11 | Hygiene + zero close | Shipped (orphans + transitions + SDC migration) |

## Posture

Local-only; never pushed. Sprint 11 cycle branches and integration branch all deleted post-merge. Tech-debt register at zero.
