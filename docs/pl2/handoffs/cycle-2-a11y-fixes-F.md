# Handoff-F: Cycle 2 - pa11y allowlist + articles heading hierarchy (FU-3 + FU-7b)

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-9-cycle-2-fixes`
**Issue:** `docs/pl2/handoffs/cycle-2-a11y-fixes-issue.md`

## Confirmation table (autonomous mode)

| Field | Value |
|---|---|
| Page being overhauled | Site-wide (a11y debt); `/articles` heading fix |
| Issue | `docs/pl2/handoffs/cycle-2-a11y-fixes-issue.md` |
| Working branch | `aa/pl-sprint-9-cycle-2-fixes` |
| Runbook phase | Sprint 9, Cycle 2 |
| Input documents read | cycle-2-a11y-fixes-issue.md, cycle-1-a11y-debt-audit-S.md, pl-plan--sprint-9-a11y-debt.md, theme-change--workflow.md |
| Acceptance criteria count | 7 |
| Handoff document path | `docs/pl2/handoffs/cycle-2-a11y-fixes-F.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | N/A -- no component schema referenced (Twig template edit + config file creation only) |

## What was done

- **NEW: `.pa11yci.json`** (repo root) -- pa11y-ci configuration with `hideElements` allowlist for the two operator-approved brand-color deviations (`.button--primary` family + `.breadcrumb__link`). Uses `hideElements` approach rather than rule-ID `ignore` because `hideElements` surgically removes the specific DOM elements from pa11y's evaluation while preserving all other WCAG checks on those pages.
- **EDIT: `web/themes/custom/performant_labs_20260502/templates/views/views-view-unformatted--articles--page-1.html.twig`** -- Inserted a visually-hidden `<h2>` ("Articles") to restore H1 -> H2 -> H3 heading hierarchy on `/articles`. Promoted the existing `{% if title %}` branch from `<h3>` to `<h2>` per audit advisory note 3. Added file-header comment documenting the Sprint 9 FU-7b change.

## Layer decisions

### FU-3 (.pa11yci.json)

No CSS change -- this is a tooling configuration file. No layer trace required.

### FU-7b (views template heading)

**Change:** Insert `<h2 class="visually-hidden">Articles</h2>` in the views template.

This is a **Twig template edit**, not a CSS change. The 7-step CSS workflow does not apply. The `visually-hidden` class is provided by Drupal core (`web/core/themes/stable9/css/system/components/hidden.module.css`) -- no new CSS was written.

**Why not modify the article-card SDC:** The `<h3>` in `article-card.twig` is correct in every other context (homepage, services, about-us, how-we-do-it, open-source-projects, contact-us) because those pages have section `<h2>` headings wrapping the card groups. Only `/articles` lacks an intervening `<h2>`. Inserting a visually-hidden `<h2>` in the per-page view template is the smallest-surface fix with zero cascade risk.

## Deviations from spec

- **`{% if title %}` branch promoted from `<h3>` to `<h2>`**: The audit advisory note 3 recommended preserving the branch but promoting it. The issue content sketch showed only the else-branch `<h2>`. I followed the audit recommendation (promote both branches) as the more-conservative interpretation -- if a future view configuration sets a row-group title, it renders at the correct heading level.

## Verification results (T1 + T2)

### T1: Cache clear + curl heading check

```
ddev drush cr -> [success] Cache rebuild complete.
```

**`/articles` heading hierarchy:**
```
<h2 id="system-breadcrumb-..." class="visually-hidden">Breadcrumb</h2>
<h1>Articles.</h1>
<h2 class="visually-hidden">Articles</h2>
<h3><a href="/articles/building-ctrfhub-in-the-open">CTRFHub: ...</a></h3>
<h3><a href="/articles/version-10-automated-testing-kit-ready">Version 1.0 ...</a></h3>
<h3><a href="/articles/introducing-automated-testing-kit">Introducing ...</a></h3>
<h3><a href="/articles/cypress-drupal-cheat-sheet">Cypress ...</a></h3>
<h3><a href="/articles/badcamp-2020-...">BADCamp 2020 ...</a></h3>
<h3><a href="/articles/our-talk-drupalcon-...">Our talk at DrupalCon ...</a></h3>
```

H1 -> H2 (visually-hidden) -> H3. No skip. PASS.

### T1: Cross-page regression check

All 6 other pages checked via curl heading grep. No heading hierarchy changes detected on any page:

| Page | H1 | H2 present | H3 skip | Result |
|---|---|---|---|---|
| `/` | Yes | Yes (multiple section H2s) | No | PASS |
| `/services` | Yes (implicit) | Yes (breadcrumb) | No | PASS |
| `/about-us` | Yes (implicit) | Yes (breadcrumb) | No | PASS |
| `/contact-us` | Yes (implicit) | Yes (breadcrumb) | No | PASS |
| `/how-we-do-it` | Yes (implicit) | Yes (breadcrumb) | No | PASS |
| `/open-source-projects` | Yes (implicit) | Yes (breadcrumb) | No | PASS |

### T2: pa11y-ci run (structural WCAG check)

```
npx --yes pa11y-ci --config .pa11yci.json

Running Pa11y on 7 URLs:
 > https://pl-performantlabs.com.3.ddev.site:8493/ - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/services - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/about-us - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/articles - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/contact-us - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/how-we-do-it - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/open-source-projects - 0 errors

7/7 URLs passed
```

PASS -- 0 errors across all 7 pages.

## WCAG contrast ratios

No color/backdrop changes made in this cycle. The visually-hidden `<h2>` has `display:none`-equivalent styling (Drupal core `.visually-hidden`) and produces no visible surface. N/A.

## Mobile responsive behavior

N/A -- no responsive overrides in this phase. The visually-hidden `<h2>` is invisible at all viewports. The `.pa11yci.json` is a tooling file, not a rendered asset.

## Autonomous decisions

1. **`hideElements` chosen over rule-ID `ignore`**: pa11y-ci supports both. `hideElements` is more surgical -- it removes specific DOM elements from evaluation entirely, so all other WCAG rules still apply to the rest of the page. Rule-ID `ignore` would suppress *all* instances of a rule globally (e.g., all contrast failures, not just the approved ones). The issue explicitly offered either approach; I chose the safer one.

2. **`{% if title %}` branch promoted to `<h2>`**: The issue content sketch showed only the else-branch visually-hidden `<h2>`. The audit advisory note 3 recommended also promoting the if-branch from `<h3>` to `<h2>` so a future view-title renders at the correct heading level. I followed the audit recommendation as the more-conservative interpretation.

3. **`wait: 500` and `chromeLaunchConfig` included from audit sketch**: The audit's `.pa11yci.json` sketch included `"wait": 500` and `"chromeLaunchConfig": {"args": ["--ignore-certificate-errors"]}`. The issue sketch omitted these. I included them because (a) the ddev site uses a self-signed certificate, so `--ignore-certificate-errors` is required for Chromium to load the pages, and (b) `wait: 500` gives JS-rendered elements time to settle.

## Known issues

None.

## Files changed

1. `.pa11yci.json` (NEW)
2. `web/themes/custom/performant_labs_20260502/templates/views/views-view-unformatted--articles--page-1.html.twig` (EDITED)
