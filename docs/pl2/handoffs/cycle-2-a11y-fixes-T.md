# Handoff-T: Cycle 2 - pa11y allowlist + articles heading hierarchy (FU-3 + FU-7b)

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-9-cycle-2-fixes`
**Issue:** `docs/pl2/handoffs/cycle-2-a11y-fixes-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2-a11y-fixes-F.md`

## Tier 1 results

| Check | Command | Expected | Actual | Result |
|---|---|---|---|---|
| Cache clear | `ddev drush cr` | `[success] Cache rebuild complete.` | `[success] Cache rebuild complete.` | PASS |
| HTTP / | `curl -sk .../` | 200 | 200 | PASS |
| HTTP /services | `curl -sk .../services` | 200 | 200 | PASS |
| HTTP /about-us | `curl -sk .../about-us` | 200 | 200 | PASS |
| HTTP /articles | `curl -sk .../articles` | 200 | 200 | PASS |
| HTTP /contact-us | `curl -sk .../contact-us` | 200 | 200 | PASS |
| HTTP /how-we-do-it | `curl -sk .../how-we-do-it` | 200 | 200 | PASS |
| HTTP /open-source-projects | `curl -sk .../open-source-projects` | 200 | 200 | PASS |
| visually-hidden h2 in DOM | curl /articles + python regex | `<h2 class="visually-hidden">Articles</h2>` present | Found exactly once | PASS |
| No bare `<h2>Articles</h2>` | python regex for bare tag | 0 occurrences | 0 | PASS |
| .pa11yci.json present at repo root | `ls -la .pa11yci.json` | file exists, non-empty | 773 bytes, dated 2026-05-12 | PASS |
| No `!important` in .pa11yci.json | grep | 0 matches | 0 | PASS |
| No `!important` in twig template | grep | 0 matches | 0 | PASS |

### /articles heading sequence (T-observed from live DOM)

```
H2 [visually-hidden]: Breadcrumb            (system, pre-existing)
H1: Articles.
H2 [visually-hidden]: Articles              (FU-7b insertion)
H3: CTRFHub: building a CTRF-native...
H3: Version 1.0 of Automated Testing Kit Is Ready!
H3: Introducing Automated Testing Kit
H3: Cypress on Drupal Cheat Sheet
H3: BADCamp 2020-Components Can Break Your Site
H3: Our talk at DrupalCon...
```

H1 -> H2 (visually-hidden) -> H3. No skip. PASS.

## Tier 2 results

### ARIA landmarks on /articles

| Landmark | Count | Result |
|---|---|---|
| `<header` | 1 | PASS |
| `<main` | 1 | PASS |
| `<footer` | 1 | PASS |
| `<nav` | 4 | PASS |

### .visually-hidden class definition

Verified in `web/core/modules/system/css/components/hidden.module.css`. The class uses the standard off-screen clip recipe:
- `position: absolute !important`
- `overflow: hidden`
- `clip: rect(1px, 1px, 1px, 1px)`
- `width: 1px; height: 1px`

This is the Drupal core standard. No new CSS was written for this component. PASS.

### git diff structural check

The diff for `views-view-unformatted--articles--page-1.html.twig` matches F's description exactly:
- `<h3>{{ title }}</h3>` promoted to `<h2>{{ title }}</h2>` in the `{% if title %}` branch.
- `{% else %}` branch added with `<h2 class="visually-hidden">{{ 'Articles'|t }}</h2>`.
- File-header comment added documenting FU-7b.
- No other structural changes.

PASS.

### .pa11yci.json content check

`hideElements` value present at repo root: `"a.button.button--primary, button.button.button--primary, #edit-actions-submit.button--primary, .breadcrumb__link"`. Matches the issue spec selector list exactly. All 7 URLs present. `standard: WCAG2AA`. F added `"wait": 500` and `chromeLaunchConfig --ignore-certificate-errors` (documented as autonomous decisions; required for ddev self-signed cert). PASS.

### Cross-page heading hierarchy (6 non-articles pages)

Each page verified by curl + python heading extraction.

| Page | Single H1 | H2 before first H3 | H4+ skip | Result |
|---|---|---|---|---|
| `/` | Yes | Yes (section H2s) | No | PASS |
| `/services` | Yes | Yes (section H2s) | No | PASS |
| `/about-us` | Yes | Yes (section H2s) | No | PASS |
| `/contact-us` | Yes | Yes (section H2s) | No | PASS |
| `/how-we-do-it` | Yes | Yes (section H2s) | No | PASS |
| `/open-source-projects` | Yes | Yes (section H2s) | No | PASS |

No regression on any page that consumes the article-card SDC. article-card H3s are properly subordinate to section H2s on all consuming pages. PASS.

### pa11y-ci run (T-executed independently)

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

PASS. T ran this independently; result matches F's reported output.

## WCAG contrast verification

No color, background, or foreground values were changed in this cycle. The visually-hidden `<h2>` renders at 1x1px off-screen with no visible surface. The `.pa11yci.json` is a tooling configuration file, not a rendered asset. N/A.

## Mobile responsive verification

N/A - no responsive overrides in this phase. The visually-hidden `<h2>` is invisible at all viewports. The `.pa11yci.json` is a tooling file, not a rendered asset.

## Acceptance criteria status

| Criterion | Evidence | Result |
|---|---|---|
| `.pa11yci.json` present at repo root with allowlist for `.button--primary` family + `.breadcrumb__link` | File at root, `hideElements` contains `a.button.button--primary, button.button.button--primary, #edit-actions-submit.button--primary, .breadcrumb__link` | PASS |
| `pa11y-ci` runs and produces 0 errors | T-executed `npx --yes pa11y-ci --config .pa11yci.json` — 7/7 URLs passed | PASS |
| `/articles` DOM contains an `<h2>` between H1 and article-card `<h3>`s, visually-hidden | `<h2 class="visually-hidden">Articles</h2>` confirmed in live DOM between H1 and H3s | PASS |
| Heading hierarchy clean on `/articles`: H1 -> H2 -> H3, no skip | Observed sequence: H1 "Articles." -> H2 [visually-hidden] "Articles" -> H3 cards | PASS |
| No `!important` | Grep on both changed files: 0 matches | PASS |
| T1 + T2 PASS on `/articles` + cross-page spot-check | All T1 and T2 checks above passed | PASS |
| No regression on other pages consuming `article-card` SDC | 6-page heading check: single H1, H2 before H3, no skip on all pages | PASS |

## Blocking issues

None.

## Advisory notes

- The homepage (`/`) renders an H2 (visually-hidden nav block title "Main navigation") before the H1. This is a pre-existing pattern from the nav block template, not introduced by this cycle, and pa11y-ci reports 0 errors on it. Not a blocking issue for this cycle.
- F's choice of `hideElements` over rule-ID `ignore` is the more surgical approach and appropriate for the approved deviations. The `wait: 500` and `--ignore-certificate-errors` additions (autonomous decision 3) are justified for the ddev environment and do not affect what WCAG rules are evaluated.
