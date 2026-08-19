# Handoff-T: Phase 8.5 - Hero whitespace below CTAs

**Date:** 2026-05-10
**Branch:** `aa/pl-homepage-phase-8.5-hero-spacing`
**Issue:** `docs/pl2/handoffs/phase-8.5-hero-spacing-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/phase-8.5-hero-spacing-F.md`

---

## Tier 1 results

### T1.1 — Cache clear

| Command | Expected | Actual | Result |
|---|---|---|---|
| `ddev drush cr` | `[success] Cache rebuild complete.` | `[success] Cache rebuild complete.` | PASS |

### T1.2 — HTTP status

The mkcert CA is installed at `/Users/andreangelantoni/Library/Application Support/mkcert/rootCA.pem`.
HTTPS was verified using `--cacert` (no `-k`). HTTP port 8090 also returns 200 as a secondary check.

| Command | Expected | Actual | Result |
|---|---|---|---|
| `curl --cacert rootCA.pem https://pl-performantlabs.com.3.ddev.site:8493/ -w '%{http_code}'` | 200 | 200 | PASS |

### T1.3 — hero.css: Phase 8.5 values present in served file

Served URL: `https://pl-performantlabs.com.3.ddev.site:8493/themes/custom/performant_labs_20260502/css/components/hero.css`

| Check | Expected | Grep result | Line | Result |
|---|---|---|---|---|
| `min-height: auto` in `.hero.theme--white` block | present | `min-height: auto;` | 81 | PASS |
| `height: auto` in `.hero.theme--white` block | present | `height: auto;` | 82 | PASS |
| `padding-block: 120px 96px` | present | `padding-block: 120px 96px;` | 83 | PASS |
| `@media (max-width: 767px)` wrapping mobile rule | present | `@media (max-width: 767px) {` | 88 | PASS |
| `padding-block: 64px` inside mobile media query | present | `padding-block: 64px;` | 90 | PASS |

### T1.4 — logo-grid.css: Phase 8.5 sibling-combinator rules present in served file

Served URL: `https://pl-performantlabs.com.3.ddev.site:8493/themes/custom/performant_labs_20260502/css/components/logo-grid.css`

| Check | Expected | Grep result | Line | Result |
|---|---|---|---|---|
| `.hero.theme--white + .dy-section:has(.logo-grid)` selector | present | selector line | 204 | PASS |
| `.hero.theme--white + .dy-section:has(.logo-grid) .dy-section__header` selector | present | selector line | 208 | PASS |
| `padding-top: 3rem` (48px) on section | present | `padding-top: 3rem;` | 205 | PASS |
| `margin-bottom: 2rem` (32px) on header | present | `margin-bottom: 2rem;` | 209 | PASS |

### T1.5 — No `!important` in served CSS (code declarations)

| File | Command | Result |
|---|---|---|
| hero.css | `curl ... \| grep "!important" \| grep -v "^\s*\*"` | 1 match — comment line only (`* - No !important.`). Zero code declarations. | PASS |
| logo-grid.css | `curl ... \| grep "!important" \| grep -v "^\s*\*"` | 0 matches | PASS |

---

## Tier 2 results

### T2.1 — Heading hierarchy

| Check | Method | Result |
|---|---|---|
| Single H1 | `grep -c "<h1"` on homepage HTML | 1 — PASS |
| Heading levels present | `grep -o '<h[1-6]...'` + uniq | h1×1, h2×7, h3×6 — no skipped levels, no h4-h6 jumps — PASS |
| Feature-card H3 count | `grep -c "<h3"` | 6 (two groups of 3 cards, both viewports' SDC renders) — PASS |

H1 content: `Ship Drupal releases with confidence.`

### T2.2 — ARIA landmarks

| Landmark | Expected | `grep -c` result | Result |
|---|---|---|---|
| `<header` | ≥1 | 1 | PASS |
| `<main` | ≥1 | 1 | PASS |
| `<footer` | ≥1 | 1 | PASS |
| `<nav` | ≥1 | 2 (primary nav + footer nav) | PASS |

### T2.3 — SDC components registered

`neonbyte:hero` present in `data-component-id` attributes on homepage HTML — PASS.

Full set confirmed present: `neonbyte:hero`, `dripyard_base:logo-grid`, `dripyard_base:grid-wrapper`, `dripyard_base:section`, `neonbyte:header`, `neonbyte:footer`.

---

## WCAG contrast verification

No surface-color or text-color changes were made in Phase 8.5. The diff adds only spacing/layout properties (`min-height`, `height`, `padding-block`, `padding-top`, `margin-bottom`) and comment text. No `color`, `background`, `background-color`, or opacity properties were added or modified in either CSS file.

Contrast ratios from Phase 8.2 are unchanged and carry forward:

| Element | Foreground | Background | F's ratio | T's ratio | Result |
|---|---|---|---|---|---|
| Hero headline | #1F1A14 | #FFFFFF | 17.29:1 | 17.29:1 | AAA PASS |
| Hero subhead | #5C544C | #FFFFFF | 7.07:1 | 7.07:1 | AAA PASS |
| Hero kicker | #8E4A2A | #FFFFFF | 6.69:1 | 6.69:1 | AA PASS |
| Focus ring | #1893b4 | #FFFFFF | 3.58:1 | 3.58:1 | Non-text 3:1 PASS |

T's ratios are not independently recomputed here — no color values changed in this phase, so there is nothing to cross-check against. The Phase 8.2 T handoff already independently verified all four ratios.

---

## Mobile responsive verification

F reported two responsive overrides.

### Override 1: `@media (max-width: 767px)` — hero padding-block: 64px

| Check | Detail | Result |
|---|---|---|
| Breakpoint | max-width: 767px | Confirmed in served hero.css line 88 |
| CSS rule | `padding-block: 64px` | Confirmed in served hero.css line 90 |
| F-reported computed value at 375px | padding-top=64px, padding-bottom=64px | Consistent with rule; T does not run Playwright |
| Design brief match | preview `var(--space-3xl)` = 64px at mobile | Rule uses literal 64px; matches token value |

PASS — rule present and value consistent with brief.

### Override 2: `min-height: auto; height: auto` — all viewports

| Check | Detail | Result |
|---|---|---|
| Rule scope | `.hero.theme--white` (no media query — all viewports) | Confirmed in served hero.css lines 81-82 |
| Neutralizes | `neonbyte .hero--height-medium { min-height: 800px }` at all viewport widths | Logic confirmed via specificity: subtheme loads after contrib; equal specificity (0,2,0); cascade order wins |
| Touch targets | CTA buttons: `min-height: 44px` from Phase 8.2 rules — unaffected by 8.5 | hero.css line 303: `min-height: 44px` — PASS |

PASS — all viewports covered.

---

## Acceptance criteria status

Issue file: `docs/pl2/handoffs/phase-8.5-hero-spacing-issue.md`

### AC1 — Step-3 trace surfaced in F handoff before any CSS/Canvas change; root cause and chosen layer documented

**Evidence:** F handoff §"Trace 1" and §"Trace 2" present complete bottom-up/top-down traces for both fixes, with L1–L5 ruling at each layer, before any code was shown. hero.css file header comment also documents both traces (lines 1–79). Root cause (neonbyte `.hero--height-medium { min-height: 800px }`) and chosen layer (L5, component-scoped) are explicit.

**PASS**

### AC2 — Hero whitespace at 1280 matches preview (no excess)

**Evidence:** Served hero.css contains `min-height: auto; height: auto; padding-block: 120px 96px` on `.hero.theme--white`. F's Playwright table shows min-height=0px and padding-top=120px, padding-bottom=96px at 1280px, matching preview's `padding: 120px 0 var(--space-section)`. T cannot run Playwright (Tier 3 reserved for S), but the CSS rules underpinning the fix are confirmed present in the served stylesheet.

**PASS** (CSS layer confirmed; computed-value verification is S-tier)

### AC3 — Hero whitespace at 768 matches preview

**Evidence:** The `@media (max-width: 767px)` rule is scoped to ≤767px, leaving 768px governed by the base `.hero.theme--white` rule: `padding-block: 120px 96px`. F's Playwright table shows 768px: padding-top=120px, padding-bottom=96px. CSS rules confirmed served.

**PASS** (CSS layer confirmed)

### AC4 — Hero whitespace at 375 matches preview

**Evidence:** 375px falls under `@media (max-width: 767px)`. Served hero.css line 90 confirms `padding-block: 64px`. F's Playwright table: 375px padding-top=64px, padding-bottom=64px, CTA-to-label gap=112px matches preview target.

**PASS** (CSS layer confirmed)

### AC5 — No regressions on prior fixes; no `!important`; files staged by explicit path

Sub-checks:

| Regression | Evidence | Result |
|---|---|---|
| 8.2: hero `padding-inline: 0` still served | `grep "padding-inline: 0"` → hero.css line 84 present | PASS |
| 8.2: no horizontal overflow at 768 | `padding-inline: 0` confirmed; no width > viewport set on `.hero.theme--white` | PASS (CSS) |
| 8.2: logo-grid `min-width: 992px` nowrap rule still served | `grep "@media (min-width: 992px)"` → logo-grid.css line 119 present | PASS |
| 8.4: feature cards `grid-wrapper--3col-stack-md` on homepage | `grep -c "grid-wrapper--3col-stack-md"` → 1 | PASS |
| 8.4: `/open-source-projects` emits `grid-wrapper--3col` | `grep -c "grid-wrapper--3col"` → 2 | PASS |
| 8.4: `/how-we-do-it` emits `grid-wrapper--3col` | `grep -c "grid-wrapper--3col"` → 1 | PASS |
| No `!important` in staged diff (code declarations) | `git diff --cached ... \| grep "^+" \| grep "!important"` → 0 lines | PASS |
| Files staged by explicit path | `git diff --cached --name-only` → exactly `docs/pl2/css-change-log.md`, `docs/pl2/handoffs/phase-8.5-hero-spacing-F.md`, `css/components/hero.css`, `css/components/logo-grid.css` — no extra staged files | PASS |

**PASS**

---

## Blocking issues

None.

---

## Advisory notes

**Unstaged dirty file: `config/sync/views.view.articles.yml`**
`git diff main --name-only` shows this file as changed, but `git status --short` confirms it is unstaged (` M`) — not committed or staged by F. The change is a YAML key-order resequencing (no value changes: `quantity: 5` moved, `type`/`limit` fields reordered), consistent with a Drupal config-export side effect from a prior session. It is unrelated to Phase 8.5 and does not affect any CSS or rendering. This is not a blocker for S but should be staged or reverted before a merge to main.

**logo-grid.css comment: unicode rendering artifact**
Line 45 in the served logo-grid.css contains a replacement character (`───────────────────────────────────���──`) in a comment. This was present before Phase 8.5 (visible in the `- /* ─── Logo visual consistency ──────────────────────────────────────` removal line in the diff). It is a cosmetic comment artifact with no functional impact.

**`grid-wrapper--3col-stack-md` count**
The homepage returns a count of 1 for `grid-wrapper--3col-stack-md`. This is consistent with Phase 8.4 (the grid is rendered once). No regression.
