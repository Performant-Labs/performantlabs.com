# Sprint 8 — Footer + contact webform sweep — Wrap

**Sprint:** Sprint 8
**Runbook:** [`../pl-plan--sprint-8-footer-and-contact.md`](../pl-plan--sprint-8-footer-and-contact.md)
**Integration branch:** `aa/pl-sprint-8-footer-and-contact`
**Mode:** autonomous
**Started + Wrapped:** 2026-05-12 (same-day)
**Cycles:** 2 actually run (Cycle 1 audit + Final baseline). Pre-committed Cycles 2..N closed as no-op.

## Outcomes

| Cycle | Slug | Outcome | Rework |
|---|---|---|---|
| 1 | Footer + contact audit (S-only) | **PASS** — Bundle 3 empirically resolved; no fix needed | 0 |
| 2..N | Per-item fix cycles | **No-op closure** — no defect to fix | — |
| Final | Footer + contact regression baseline (T + S) | **PASS** — 147-link inventory clean | 0 |

## Surprise finding (Sprint 7 déjà vu)

All four Bundle 3 items were empirically resolved before Sprint 8 opened:

- **F.8** — Footer menu link (`menu_link_content` id=35) and `/services` card both use `#test-suite-takeover`. Matched.
- **F.9** — Every rendered footer link points to `/contact-us` directly; zero `/contact` references in rendered HTML.
- **ADV-C1** — `/form/contact` does not 404. Drupal redirect entity id=90 serves 301 → `/contact-us`. Zero rendered links point to `/form/contact` anyway.
- **ADV-CU1** — `/contact-us` has exactly one body H1; heading hierarchy clean per WCAG 2.4.6.

The original tech-debt entries were stale — they described the state at the end of the `/services` overhaul, and intervening sprint work (Sprint 3 J.2 page-title fix; Sprint 5 cycle 1 `/contact-us` route shift; etc.) resolved each item without explicitly closing them in the register.

## What shipped

Documentation and a regression-prevention baseline. **Zero code changes.**

- `docs/pl2/pl-plan--sprint-8-footer-and-contact.md` — Sprint 8 runbook
- `docs/pl2/handoffs/sprint-8-orchestrator-log.md`
- `docs/pl2/handoffs/cycle-1-footer-contact-audit-S.md` + `cycle-1-footer-contact-audit-report.html`
- `docs/pl2/handoffs/cycle-final-footer-contact-baseline-T.md` + `cycle-final-footer-contact-baseline-S.md` + `cycle-final-footer-contact-baseline-report.html`
- Probe scripts + 7 page-source snapshots + 4 full-page baseline screenshots
- `docs/pl2/tech-debt-register.md` — F.8, F.9, ADV-C1, ADV-CU1 all marked CLOSED with citation; Bundle 3 marked CLOSED in triage view; Sprint 7+8 pattern noted at register tail

## Regression baseline (citable by future sprints)

At 2026-05-12 on integration branch `aa/pl-sprint-8-footer-and-contact`:

- **All 7 shipped pages return HTTP 200** (`/`, `/services`, `/about-us`, `/articles`, `/contact-us`, `/how-we-do-it`, `/open-source-projects`).
- **147 rendered hrefs** across header / footer / signature CTAs on all 7 pages — zero 404, zero direct 301-hops (only legacy redirect safety nets at `/contact` + `/form/contact` return 301 → 200, and no rendered link uses those paths).
- **All 4 Services-section footer anchors** (`#test-suite-takeover`, `#embedded-testing-engineer`, `#autonomous-healing-pilot`, `#accessibility-testing`) match live `id=` attributes on `/services`.
- **H1 count = 1** on every shipped page.
- **Pa11y: 12 errors site-wide, 0 new** — all on the PC-5 brand-color allowlist (button `--primary` 2.21:1; breadcrumb 3.12:1).

## Surfaced for follow-up

**Orphan-theme hygiene candidate (Bundle 7).** Two old theme directories still exist in the repo with embedded `<a href="/contact">` strings in dead `page--*.html.twig` files: `web/themes/custom/performant_labs_20260411/` and `web/themes/custom/performant_labs_20260418/`. The active theme is `performant_labs_20260502`. Since the older themes are not installed/rendered, their template strings are dead code. The Sprint 8 audit observed this but excluded from scope (Bundle 7 hygiene). Candidates for cleanup:
- Confirm both old themes are uninstalled (drush config check).
- Delete the directories entirely, OR fix the dead `/contact` references in place (low value vs delete).

## Calibration note (Sprint 7 + 8 pattern)

Sprint 7 (R8 mobile hero overflow) and Sprint 8 (Bundle 3 footer + contact) both opened with audit cycles and discovered the tech-debt items were already resolved. **This is now a pattern worth codifying:** when picking up older tech-debt entries, always audit first.

Reasoning:
- Tech-debt items are point-in-time observations. Intervening sprints often resolve contributing factors without explicitly closing the original ticket.
- Audit cost (~30 min of S agent time) is small compared to running fix cycles against a non-defect.
- Audits produce regression baselines as a useful by-product.

Updated tech-debt register §"Quick triage view" tail now codifies this: "open every remaining bundle with an audit cycle first."

## Tech-debt register status (post-Sprint 8)

Bundle 3 closed. Remaining bundles:

- **Bundle 4 — A11y debt sweep:** FU-3 (pa11y allowlist install), FU-7b (article H3 skip), optional re-eval of ADV-S5 / brk-3 brand exceptions.
- **Bundle 6 — Architectural cleanup:** ADV-3 (selector-class refactor in `dy-section.css`), `component_version` workflow doc.
- **Bundle 7 — Hygiene:** FU-4 (mkcert env), merged cycle-branch cleanup (Sprints 4–8), FU-5 (spot-check `/` header at 1280), **orphan-theme directory cleanup** (new candidate from Sprint 8 audit).

Bundle 4 has the most codebase-hygiene value (real `.pa11yci.json` install replaces PC-5 wording workaround). Bundle 7's orphan-theme cleanup is the next-most-obvious operational win.

## Posture

Local-only; never pushed. `--no-ff` per cycle into integration; integration `--no-ff` into local `main` at wrap.
