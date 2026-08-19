# Sprint 7 — Mobile hero overflow (R8) — Wrap

**Sprint:** Sprint 7
**Runbook:** [`../pl-plan--sprint-7-mobile-hero-overflow.md`](../pl-plan--sprint-7-mobile-hero-overflow.md)
**Integration branch:** `aa/pl-sprint-7-mobile-hero-overflow`
**Mode:** autonomous
**Started + Wrapped:** 2026-05-12 (same-day)
**Cycles:** 2 actually run (Cycle 1 audit + Final baseline). Pre-committed Cycles 2..N closed as no-op.

## Outcomes

| Cycle | Slug | Outcome | Rework |
|---|---|---|---|
| 1 | R8 mobile-hero overflow audit (S-only) | **PASS** — empirically resolved; no fix needed | 0 |
| 2..N | Per-page fix cycles | **No-op closure** — no defect to fix | — |
| Final | Cross-landing-page WCAG 1.4.10 regression baseline (T + S) | **PASS** — 16 probes clean | 0 |

## Surprise finding

R8 / ADV-S1 was a real WCAG 2.1 SC 1.4.10 (Reflow) failure when originally identified during the `/services` overhaul. Intervening commits resolved it before Sprint 7 even opened:

- `d8622f6` — Cycle-debt Phase 1: `.heal-flow` `min-width: 0` + `width: 100%` (homepage flex-min-content trap)
- `26026741d` — mobile hero overflow + a11y
- `40a4b0511` — 768 hero + logo grid
- `4256e1f07` — articles 1.4.10
- `51b2ba340` — FU-2 hero H1 reconciliation

By the time Sprint 7's Cycle 1 audit ran, all four landing pages (`/`, `/services`, `/how-we-do-it`, `/open-source-projects`) cleared `scrollWidth ≤ clientWidth` at both 375 and 320 CSS px.

## What shipped

Documentation and a regression-prevention baseline:

- `docs/pl2/pl-plan--sprint-7-mobile-hero-overflow.md` — Sprint 7 runbook
- `docs/pl2/handoffs/sprint-7-orchestrator-log.md` — orchestrator log
- `docs/pl2/handoffs/cycle-1-r8-audit-S.md` + `cycle-1-r8-audit-report.html` — audit catalog
- `docs/pl2/handoffs/cycle-final-r8-baseline-T.md` + `cycle-final-r8-baseline-S.md` + `cycle-final-r8-baseline-report.html` — baseline
- Screenshots under `docs/pl2/handoffs/screenshots/sprint-7-cycle-1/` and `sprint-7-final/` — 24 PNGs total (4 pages × 4 viewports for the baseline + 4 pages × 1 viewport for the audit) + Playwright probe scripts
- `docs/pl2/tech-debt-register.md` — R8 marked CLOSED with citation

**Zero code changes.** No CSS, Twig, YAML, or Canvas content was modified.

## Regression baseline (citable by future sprints)

At 2026-05-12, the four landing pages produced these `scrollWidth / clientWidth` measurements:

| Page | 320×568 | 375×667 | 768×1024 | 1280×800 |
|---|---|---|---|---|
| `/` | 305 / 320 | 360 / 375 | 753 / 768 | 1265 / 1280 |
| `/services` | 305 / 320 | 360 / 375 | 753 / 768 | 1265 / 1280 |
| `/how-we-do-it` | 305 / 320 | 360 / 375 | 753 / 768 | 1265 / 1280 |
| `/open-source-projects` | 305 / 320 | 360 / 375 | 753 / 768 | 1265 / 1280 |

(All scroll widths uniformly 15 px less than client widths — that's the system scrollbar reservation, not horizontal overflow. `scrollTo(9999, 0)` followed by `scrollX === 0` on every probe confirms no horizontal scroll.)

Internal `overflow-x: auto` containers (homepage `.heal-flow`) continue to engage correctly: `scrollWidth ≈ 1002` vs `clientWidth ≈ 233` at 375 — working as designed.

Pa11y: 6 total errors across 4 landing pages, 0 new. All on the PC-5 brand-color allowlist.

## Calibration note

Autonomous mode handled the surprise outcome cleanly: when Cycle 1 found the defect didn't exist, O closed the fix-cycle carve as no-op and proceeded directly to the runbook's pre-committed Final cycle as a regression baseline — no operator surface required. This mirrors Sprint 4 Cycles 1 + 4 (no-op closures when pre-flight found prior commits had already done the work).

Lesson worth keeping: stale tech-debt items should be **audited before fixing**, not assumed-still-true. The R8 entry in the register sat across multiple intervening sprints that each resolved a contributing factor; no sprint was tasked with explicitly closing R8 until Sprint 7.

## Tech-debt register status (post-Sprint 7)

Bundle 5 (R8 cycle-debt) closed. Remaining bundles from the register's quick-triage view:

- **Bundle 3 — Footer + contact webform sweep** (F.8, F.9, ADV-C1, ADV-CU1). Cross-cutting; user-facing 404 on global nav CTAs.
- **Bundle 4 — A11y debt sweep** (FU-3 pa11y allowlist install; FU-7b article H3 skip; optional re-eval of ADV-S5 + brk-3 brand exceptions).
- **Bundle 6 — Architectural cleanup** (ADV-3 selector-class refactor; `component_version` workflow doc update).
- **Bundle 7 — Hygiene** (FU-4 mkcert env fix; merged cycle branches across Sprints 4/5/6/7 not deleted; FU-5 spot-check).

Next-most-valuable next sprint: Bundle 3 (real user-facing 404s in production CTAs) or Bundle 4 (codebase hygiene + a11y).

## Posture

Local-only; never pushed. `--no-ff` per cycle into integration; integration `--no-ff` into local `main` at wrap.
