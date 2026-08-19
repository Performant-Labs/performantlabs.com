# Sprint 9 — A11y debt sweep — Orchestrator Log

**Runbook:** [`../pl-plan--sprint-9-a11y-debt.md`](../pl-plan--sprint-9-a11y-debt.md)
**Integration branch:** `aa/pl-sprint-9-a11y-debt`
**Mode:** autonomous
**Started:** 2026-05-12

## Kickoff pre-commitments

- PC-1 — WCAG 2.2 AA wins absolutely; brief tokens > preview > live.
- PC-2 — FU-3 default install format: minimal `.pa11yci.json` config-only artifact. Upgrade to `pa11y-ci` install only if it slots cleanly into existing tooling.
- PC-3 — FU-7b default fix: promote `<h3>` → `<h2>`. Hidden `<h2>` fallback if visual-design impact.
- PC-4 — Brand-exception re-eval surfaced as new tech-debt entry; not shipped in Sprint 9.
- PC-5 — After FU-3 lands, switch pa11y wording: "0 errors with allowlist applied."
- PC-6 — Hard-stop floor: env / availability / new regression / schema deletion.
- PC-7 — Audit-before-fix pattern (Sprint 7+8 codification): Cycle 1 audit confirms which items still need work.

## Cycle timeline

### Cycle 1 — A11y debt audit

- **Opened:** 2026-05-12
- **Branch:** `aa/pl-sprint-9-cycle-1-audit`
- **Pipeline:** S only
- **Closed:** 2026-05-12 — S PASS.
- **FU-3 path:** `.pa11yci.json` config-only at repo root (no `package.json` exists; adding npm lifecycle for one tool not worth it). Run via `npx --yes pa11y-ci --config .pa11yci.json`. Allowlist: 2 entries (`.button--primary` family + `.breadcrumb__link`).
- **FU-7b path:** insert visually-hidden `<h2>` in `web/themes/custom/performant_labs_20260502/templates/views/views-view-unformatted--articles--page-1.html.twig` — per-page scope, not SDC promotion (which would cascade to 5 other consuming pages).
- **Accumulated items:** none new. 12 pa11y errors site-wide all fold into the two known brand exceptions.
- **Brand-exception re-eval:** KEEP both; token tweak surfaced as future tech-debt only.
- **Carve:** single Cycle 2 (FU-3 + FU-7b together, 2 files).

### Cycle 2 — FU-3 pa11y allowlist + FU-7b articles heading fix

- **Opened:** 2026-05-12
- **Branch:** `aa/pl-sprint-9-cycle-2-fixes`
- **Pipeline:** O → F → T → S → O
- **Closed:** 2026-05-12 — S PASS. pa11y-ci 7/7 URLs 0 errors (independently re-run by F, T, and S). `/articles` heading hierarchy clean (H1 → H2 visually-hidden → H3). No regression on 5 other `article-card`-consuming pages.
- **Files changed:** `.pa11yci.json` (new at repo root; `hideElements` allowlist surgical to the two known brand exceptions) + `views-view-unformatted--articles--page-1.html.twig` (visually-hidden h2 inserted in else-branch; existing if-branch h3 → h2).
- **Format choice:** `hideElements` over rule-ID `ignore`. Reasoning: `hideElements` removes the specific selectors from pa11y's DOM evaluation, preserving all other WCAG rule checks on those pages. Rule-ID `ignore` would have globally suppressed all contrast failures.
- **No-op Final cycle:** independent pa11y-ci runs by F + T + S in Cycle 2 already constitute the baseline. Skipping a separate Final cycle.
