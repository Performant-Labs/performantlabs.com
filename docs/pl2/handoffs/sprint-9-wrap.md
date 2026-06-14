# Sprint 9 — A11y debt sweep — Wrap

**Sprint:** Sprint 9
**Runbook:** [`../pl-plan--sprint-9-a11y-debt.md`](../pl-plan--sprint-9-a11y-debt.md)
**Integration branch:** `aa/pl-sprint-9-a11y-debt`
**Mode:** autonomous
**Started + Wrapped:** 2026-05-12 (same-day)
**Cycles:** 2 (Cycle 1 audit + Cycle 2 single-fix bundle). Final cycle skipped — Cycle 2 contained 3 independent pa11y-ci sweeps (F + T + S) which already serve as baseline.

## Outcomes

| Cycle | Slug | Outcome | Rework |
|---|---|---|---|
| 1 | A11y debt audit (S-only) | **PASS** — clean carve | 0 |
| 2 | FU-3 pa11y allowlist + FU-7b articles heading hierarchy | **PASS** | 0 |

## What shipped

Real code/config this time (unlike Sprints 7+8):

- **`.pa11yci.json`** (NEW at repo root) — pa11y-ci config with surgical `hideElements` allowlist for the two pre-existing operator-approved brand-color deviations (`.button--primary` family + `.breadcrumb__link`). Run via `npx --yes pa11y-ci --config .pa11yci.json`. Replaces the **PC-5 wording workaround** in use since Sprint 5 ("0 *new* errors"). From Sprint 9 forward: **0 errors with allowlist applied** is the standard.
- **`web/themes/custom/performant_labs_20260502/templates/views/views-view-unformatted--articles--page-1.html.twig`** (EDITED) — inserted `<h2 class="visually-hidden">{{ 'Articles'|t }}</h2>` in the else-branch + promoted existing if-branch `<h3>` → `<h2>`. Per-page scope; the `article-card` SDC is unchanged so the 5 other pages consuming it (`/`, `/services`, `/about-us`, `/how-we-do-it`, `/open-source-projects`) are not affected.

Plus standard docs:

- `pl-plan--sprint-9-a11y-debt.md` runbook
- `handoffs/sprint-9-orchestrator-log.md`
- `cycle-1-a11y-debt-audit-{S,report}` + `cycle-2-a11y-fixes-{F,T,S,report}` handoffs
- `tech-debt-register.md` — FU-3 + FU-7b marked CLOSED; Bundle 4 marked CLOSED in triage view; Sprint 9 pattern note appended

## Verification baseline (citable by future sprints)

At 2026-05-12 on integration branch `aa/pl-sprint-9-a11y-debt`:

- **`pa11y-ci` 7-URL sweep (`/`, `/services`, `/about-us`, `/articles`, `/contact-us`, `/how-we-do-it`, `/open-source-projects`):** **0 errors** with `.pa11yci.json` allowlist applied. Verified independently by F, T, S.
- **Heading hierarchy on `/articles`:** H1 → H2(visually-hidden) → H3 — no skip; WCAG 1.3.1 + 2.4.6 PASS.
- **`/articles` visual:** no layout shift; "Articles" H2 properly clipped 1×1 px off-screen via Drupal core `.visually-hidden` recipe (no new CSS authored).
- **Cross-page regression:** none. All 6 non-`/articles` shipped pages unchanged in DOM heading structure.
- **No `!important` introduced.**

## Key autonomous decisions

1. **`hideElements` format over rule-ID `ignore`.** F's call. `hideElements` surgically removes the four CSS selectors from pa11y's DOM evaluation; rule-ID `ignore` would have globally suppressed all contrast failures (over-broad). Sound choice — preserves WCAG enforcement everywhere except the operator-approved exceptions.

2. **Per-page views template fix over SDC promotion.** Cycle 1 audit's pivotal recommendation. The runbook default was "promote h3 to h2" in the SDC; audit found the SDC is correctly emitting h3 for 5 other pages where there IS an intervening h2. The skip is `/articles`-specific (page renders cards directly under H1 with no section H2). Fix at the per-page views template, not the shared SDC.

3. **Final cycle skipped.** Sprint 7+8 ran a separate Final cycle as baseline. Sprint 9's Cycle 2 already contained 3 independent pa11y-ci runs (F + T + S) — that's the baseline. Adding a Final cycle would have been ceremony without information value.

## Tech-debt register status (post-Sprint 9)

Bundle 4 closed. Remaining buckets:

- **Bundle 6 — Architectural cleanup (low priority):** ADV-3 (selector-class refactor in `dy-section.css`), `component_version` workflow doc.
- **Bundle 7 — Hygiene (low priority):** FU-4 mkcert env fix, merged cycle-branch cleanup (Sprints 4–9), FU-5 spot-check, orphan-theme directories `performant_labs_20260411` + `_20260418` (surfaced by Sprint 8).

Both are low-priority codebase-hygiene. No user-facing impact. The site's user-facing tech-debt is effectively closed as of Sprint 9.

## Pattern note

Sprint 9 differs from Sprints 7+8 (which were no-op audits closing stale debt) — Sprint 9 produced real code/config because the items were genuinely open. But the audit-first opener still paid off: it picked the smaller, more correct fix path. **The audit-first rule survives.**

## Posture

Local-only; never pushed. `--no-ff` per cycle into integration; integration `--no-ff` into local `main` at wrap.
