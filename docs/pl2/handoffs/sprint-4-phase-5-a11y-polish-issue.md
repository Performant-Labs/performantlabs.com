# Sprint 4 — Cycle 5: Site-wide a11y polish bundle (J.2 + A.2 + A.3 + D.4)

**Mode:** autonomous
**Branch:** `aa/pl-sprint-4-phase-5-a11y-polish` (off `aa/pl-sprint-4-pre-services-foundation`)
**Sprint runbook:** [`pl-plan--sprint-4-pre-services-foundation.md`](../pl-plan--sprint-4-pre-services-foundation.md) §"Cycle 5 — Site-wide a11y polish bundle"
**Upstream source:** [`GET-BACK-TO-THESE.md`](../GET-BACK-TO-THESE.md) §A.2, §A.3, §D.4, §J.2

## Objective

Resolve four site-wide a11y items that are individually small and collectively meaningful, before Services Phase 1 brings new templates into the mix.

## Scope (four items)

1. **J.2 — Move `<section class="page-title">` inside `<main>`.** Currently sits between `page.highlighted` (breadcrumb) and `<main>`, above the main landmark. Fix: edit the page-level template (likely `page.html.twig` or a region-template override) so the page-title section renders *inside* `<main>`. Cross-page — affects every page.

2. **A.2 — Verify `<h2>Main navigation</h2>` is truly `.visually-hidden`.** Confirm the nav-labeling h2 (first heading on every page before page h1) is invisible to sighted users and properly scoped for screen-reader landmark identification. If it IS visually-hidden, document and close. If it leaks visually anywhere, ship a fix.

3. **A.3 — Add `aria-current="page"` to the active pager `<li>`.** Affects every paginated listing (today: `/articles-2`, `/articles`). Fix: theme-level pager template override at `templates/navigation/pager.html.twig` (or equivalent for the active theme's parent — `dripyard_base` / `neonbyte`) that adds `aria-current="page"` on the `.is-active` item.

4. **D.4 — Breadcrumb audit across page types.** Curl one URL per page type (book interior, Canvas page, article detail, Views page, user-facing account page if available) and grep for `<nav … aria-label="breadcrumb">` or the `.breadcrumb` DOM hook. If any page type is missing breadcrumbs: **per operator kickoff pre-commitment, document the gap as a follow-up backlog item; do not widen Easy Breadcrumb / block placement autonomously** (cross-site ripple risk).

## Sprint pre-commitments relevant to this cycle

- **D.4 missing-breadcrumb response:** follow-up backlog only; no autonomous widening.
- **Scope split:** F may split into **5a (template work: J.2 + A.3)** and **5b (verify-only: A.2 + D.4)** at its discretion without escalating. Both must land before sprint wrap. If F splits, file 5b as a follow-up issue at `docs/pl2/handoffs/sprint-4-phase-5b-a11y-verify-issue.md` and proceed with 5a in this cycle; the operator log will pick it up.

## Input documents

Read before starting:

- [ ] [Sprint runbook §Cycle 5](../pl-plan--sprint-4-pre-services-foundation.md)
- [ ] `web/themes/custom/performant_labs_20260502/templates/` — what page-level / pager templates already exist
- [ ] Parent theme templates (`web/themes/custom/dripyard_base/templates/` or `neonbyte` — wherever the canonical templates live) for the J.2 + A.3 baselines you'll override
- [ ] `/articles-2` rendered HTML — to see the current pager structure

## Files expected to change

- `web/themes/custom/performant_labs_20260502/templates/layout/page.html.twig` (J.2 — likely new override file)
- `web/themes/custom/performant_labs_20260502/templates/navigation/pager.html.twig` (A.3 — new file)
- Potentially `config/sync/block.block.breadcrumbs.yml` or `config/sync/easy_breadcrumb.settings.yml` if D.4 surfaces a missing page type — **but per pre-commitment, defer this to follow-up rather than widen autonomously**
- No file change expected for A.2 if the existing `visually-hidden` rule is correct (verify-only)

## Acceptance criteria (verbatim from runbook)

- [ ] `<section class="page-title">` renders inside `<main>` on every page tested
- [ ] Nav h2 confirmed visually-hidden (or fix shipped if not)
- [ ] Active pager `<li>` carries `aria-current="page"` on `/articles-2` and `/articles`
- [ ] Breadcrumb audit table: every page type has or explicitly does-not-need breadcrumbs (with rationale)
- [ ] Pa11y on `/`, `/articles`, `/contact-us` shows 0 errors

## Operator decision

None (D.4 missing-breadcrumb pre-commitment covers the only branch that needed an operator call).

## Handoff location

Write your handoff to: `docs/pl2/handoffs/sprint-4-phase-5-a11y-polish-F.md` (or `-5a-` / `-5b-` if you split).

## Operating rules

- **Mode: autonomous** — Step 3 layer trace is self-approved (L1 config for breadcrumb if you go there, but you shouldn't per pre-commitment; L2 templates for J.2 + A.3; L2 verify for A.2).
- **Pre-flight per Cycles 1, 4 pattern:** check whether each of the 4 items is already done before assuming work is needed. The active theme is `performant_labs_20260502`, scaffolded fresh — A.2 and D.4 might already be clean.
- **Read `.html.twig` parent templates before authoring overrides** — don't guess template variable names. The parent themes (`dripyard_base`, `neonbyte`) own the originals.
- Stage files by explicit path.
- Mandatory handoff section: **Autonomous decisions** — including whether you split and what your reasoning was.

## Verification environment

| Item | Value |
|---|---|
| DDEV URL | `https://pl-performantlabs.com.3.ddev.site:8493/` |
| SSL workaround | `ddev exec curl http://localhost/<path>` |
| Cache clear | `ddev drush cr` before every T1/T2 run; **also after every Twig template change** (Drupal aggressively caches Twig) |
| Pa11y | Run from host against `/`, `/articles`, `/contact-us` as part of T |
