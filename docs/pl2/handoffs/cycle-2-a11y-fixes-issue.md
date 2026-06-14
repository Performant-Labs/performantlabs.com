# Sprint 9 — Cycle 2 — FU-3 pa11y allowlist + FU-7b articles heading fix

**Branch:** `aa/pl-sprint-9-cycle-2-fixes`
**Pipeline:** O → F → T → S → O
**Mode:** autonomous

## Objective

Two related a11y fixes in one cycle:

1. **FU-3** — Add `.pa11yci.json` at repo root with allowlist for the two operator-approved brand-color deviations. Replaces the PC-5 wording workaround used since Sprint 5.
2. **FU-7b** — Insert a visually-hidden `<h2>` in the articles listing view template to restore heading hierarchy on `/articles`. Per-page scope only — do NOT modify the article-card SDC (would cascade to 5 other consuming pages).

## Input documents

- [ ] `docs/pl2/handoffs/cycle-1-a11y-debt-audit-S.md` — audit findings (read this first; carries the concrete allowlist + fix locations)
- [ ] `docs/pl2/pl-plan--sprint-9-a11y-debt.md` — sprint runbook
- [ ] `docs/pl2/briefs/pl_design_brief.md` — for `.visually-hidden` utility convention if F needs to confirm class name

## Files to change

1. **NEW:** `.pa11yci.json` at repo root.
2. **EDIT:** `web/themes/custom/performant_labs_20260502/templates/views/views-view-unformatted--articles--page-1.html.twig` — insert one `<h2 class="visually-hidden">Articles</h2>` (or similar) before the list of card-rendering rows.

## FU-3 — `.pa11yci.json` content sketch (audit-recommended)

```json
{
  "defaults": {
    "standard": "WCAG2AA",
    "timeout": 30000,
    "ignore": [],
    "hideElements": "a.button.button--primary, button.button.button--primary, #edit-actions-submit.button--primary, .breadcrumb__link"
  },
  "urls": [
    "https://pl-performantlabs.com.3.ddev.site:8493/",
    "https://pl-performantlabs.com.3.ddev.site:8493/services",
    "https://pl-performantlabs.com.3.ddev.site:8493/about-us",
    "https://pl-performantlabs.com.3.ddev.site:8493/articles",
    "https://pl-performantlabs.com.3.ddev.site:8493/contact-us",
    "https://pl-performantlabs.com.3.ddev.site:8493/how-we-do-it",
    "https://pl-performantlabs.com.3.ddev.site:8493/open-source-projects"
  ]
}
```

F may adjust:
- The `hideElements` selector list if pa11y-ci treats it differently from per-element `ignore`. The intent is: these selectors are pre-approved deviations, do not flag.
- The exact rule-ID `ignore` entries if the `hideElements` approach doesn't match pa11y-ci's idiom. Either approach is acceptable provided the same set of pa11y findings gets suppressed.

F documents the chosen approach in handoff with the `npx pa11y-ci --config .pa11yci.json` invocation line.

## FU-7b — views template content sketch

Add a visually-hidden h2 inside `views-view-unformatted--articles--page-1.html.twig`, before the row loop, so the H1→H3 skip becomes H1→H2(hidden)→H3:

```twig
<h2 class="visually-hidden">{{ 'Articles'|t }}</h2>
{# ... existing row loop ... #}
```

(F adapts to the actual Twig structure of the template.)

## Acceptance criteria

- [ ] `.pa11yci.json` present at repo root with allowlist for `.button--primary` family + `.breadcrumb__link`.
- [ ] `pa11y-ci` runs (via `npx --yes pa11y-ci --config .pa11yci.json`) and produces 0 errors. F captures output in handoff.
- [ ] `/articles` DOM contains an `<h2>` between the H1 and the article-card `<h3>`s. Visually-hidden (no visual change).
- [ ] Heading hierarchy clean on `/articles`: H1 → H2 → H3, no skip.
- [ ] No `!important`.
- [ ] T1 + T2 PASS on `/articles` + cross-page spot-check.
- [ ] No regression on other pages consuming `article-card` SDC.

## Handoff

- F: `docs/pl2/handoffs/cycle-2-a11y-fixes-F.md`
- T: `docs/pl2/handoffs/cycle-2-a11y-fixes-T.md`
- S: `docs/pl2/handoffs/cycle-2-a11y-fixes-S.md`

## Commit message (O on S PASS)

`feat(a11y): cycle 2 — pa11y allowlist + articles heading hierarchy (FU-3 + FU-7b)`
