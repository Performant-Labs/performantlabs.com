# Handoff-T: Phase 8.7 - Primary brand color + global section padding

**Date:** 2026-05-11
**Branch:** `aa/pl-homepage-phase-8.7-color-spacing`
**Issue:** `docs/pl2/handoffs/phase-8.7-color-spacing-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/phase-8.7-color-spacing-F.md`

---

## Tier 1 results

### Cache clear

| Command | Expected | Actual | Result |
|---|---|---|---|
| `ddev drush cr` | "Cache rebuild complete." | "[success] Cache rebuild complete." | PASS |

### HTTP status

| Command | Expected | Actual | Result |
|---|---|---|---|
| `curl -sk 'https://pl-performantlabs.com.3.ddev.site:8493/' -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |

### CSS token presence — base.css (Item A: primary palette)

Served from: `/themes/custom/performant_labs_20260502/css/base.css`

| Token / Rule | Expected | Actual | Result |
|---|---|---|---|
| `--pl-primary: #1893b4` in `:root` | Present | Present | PASS |
| `--pl-primary-light: #62BBCB` in `:root` | Present | Present | PASS |
| `--pl-primary-deep: #005AA0` in `:root` | Present | Present | PASS |
| `--theme-link-color: var(--pl-primary)` in `html .theme--white` | Present | Present | PASS |
| `--theme-link-color: var(--pl-primary)` in `html .theme--light` | Present | Present | PASS |
| `--theme-link-color: var(--pl-primary)` in `html .theme--secondary` | Present | Present | PASS |
| `--theme-link-color-hover: var(--pl-primary-deep)` (3x zones) | Present | Present | PASS |
| `--theme-focus-ring-color: var(--pl-primary)` (3x zones) | Present | Present | PASS |
| Dark/black zones: `--theme-link-color: #5DC6E8` unchanged | Unchanged | Unchanged | PASS |

### CSS token presence — button.css (Item A: button rewire)

Served from: `/themes/custom/performant_labs_20260502/css/components/button.css`

| Token / Rule | Expected | Actual | Result |
|---|---|---|---|
| `.button--primary --button-background-color: var(--pl-primary-light)` | Present | Present | PASS |
| `.button--primary --button-background-color-hover: var(--pl-primary)` | Present | Present | PASS |
| `.button--primary --button-text-color: #FFFFFF` | Present | Present | PASS |
| Dark/black zone override uses `var(--theme-link-color)` | Present | Present | PASS |

### CSS token presence — base.css (Item B: spacing)

| Token / Rule | Expected | Actual | Result |
|---|---|---|---|
| `:root --spacing-component: var(--sp8)` (mobile-first 64px) | Present | Present | PASS |
| `:root --spacing-component-internal: var(--sp6)` (mobile-first 48px) | Present | Present | PASS |
| `@media (width > 700px) --spacing-component: calc(12 * var(--sp))` (96px) | Present | Present | PASS |
| `@media (width > 700px) --spacing-component-internal: var(--sp6)` (48px) | Present | Present | PASS |
| `@media (max-width: 576px)` block does NOT contain `--spacing-component` | Absent | Absent | PASS |

### Rendered HTML structure

| Check | Expected | Actual | Result |
|---|---|---|---|
| Homepage HTTP 200 | 200 | 200 | PASS |
| Six main-nav links | 6 | 6 (Services, How we do it, Articles, Open source projects, About us, Contact us) | PASS |
| `button--primary` occurrences | >= 1 | 2 | PASS |
| `<footer>` present | Present | Present | PASS |
| `<main>` present | Present | Present | PASS |

---

## Tier 2 results

### Heading hierarchy

| Level | Content | Result |
|---|---|---|
| H2 | Main navigation (visually hidden) | expected |
| H1 | Ship Drupal releases with confidence. | single H1 — PASS |
| H2 | Tools, AI, and experts. All there. | PASS |
| H3 | Tools the Drupal community uses | PASS |
| H3 | Tests that heal themselves | PASS |
| H3 | Experts alongside your team | PASS |
| H2 | We heal our own tests nightly. | PASS |
| H2 | Built for the whole Drupal team. | PASS |
| H2 | Frequently asked questions. | PASS |
| H2 | Ready for a release you don't have to babysit? | PASS |
| H2 | Footer (visually hidden) | PASS |
| H3 | Services / Resources / Company | PASS |

Single H1: PASS. No skipped levels (H1 → H2 → H3 only, no H4+ in content): PASS.

### ARIA landmarks

| Landmark | Present | Result |
|---|---|---|
| `<header>` | `<header class="theme--white site-header">` | PASS |
| `<nav>` (main menu) | `<nav id="block-performant-labs-20260502-main-menu">` | PASS |
| `<main>` | `<main class="site-main">` | PASS |
| `<footer>` | `<footer data-component-id="neonbyte:footer">` | PASS |
| `<nav>` (footer) | `<nav id="block-performant-labs-20260502-footer">` | PASS |

All five expected landmark elements present: PASS.

### SDC component registration

F did not add new SDC components in this phase — changes are CSS-only (L3 base.css, L5 button.css). No SDC Styleguide check required. PASS (N/A — no new components).

### Design brief WCAG deviations subsection

File: `docs/pl2/briefs/pl_design_brief.md`
Method: `git diff main` review + direct file read.

The `### Documented WCAG deviations` subsection is present in the diff and confirmed in the live file at line 310. It lists both pre-approved failures with hex pairs, computed ratios, and the operator rationale. PASS.

Note: The brief documents the CTA resting ratio as `2.13:1` (matching the issue spec verbatim) and the cream link ratio as `3.07:1`. T's independent calculation gives `2.21:1` and `3.12:1` respectively (see WCAG section below). Neither discrepancy changes the pass/fail categorization — both are within the pre-approved set. The css-change-log entry for Item A correctly records `2.21:1`. The brief inconsistency is advisory (see Advisory notes).

---

## WCAG contrast verification

All ratios computed independently using the WCAG relative luminance formula. Hex values sourced directly from served CSS files.

| Element | Foreground | Background | F's ratio | T's ratio | Threshold | Status |
|---|---|---|---|---|---|---|
| Primary CTA resting `.button--primary` bg/text | #62BBCB | #FFFFFF | 2.21:1 | **2.21:1** | 3.0:1 large / 4.5:1 body | PRE-APPROVED FAIL |
| Primary CTA hover bg/text | #1893b4 | #FFFFFF | 3.58:1 | **3.58:1** | 3.0:1 large | PASS (large-text) |
| Inline link on white | #1893b4 | #FFFFFF | 3.58:1 | **3.58:1** | 4.5:1 body | PRE-APPROVED FAIL |
| Inline link on cream | #1893b4 | #F5EFE2 | 3.12:1 | **3.12:1** | 4.5:1 body | PRE-APPROVED FAIL (extension) |
| Inline link on warm | #1893b4 | #F2EFED | 3.12:1 | **3.12:1** | 4.5:1 body | PRE-APPROVED FAIL (extension) |
| Link hover on white | #005AA0 | #FFFFFF | 7.07:1 | **7.07:1** | 4.5:1 | PASS |
| Link hover on cream | #005AA0 | #F5EFE2 | 6.17:1 | **6.17:1** | 4.5:1 | PASS |
| Link hover on warm | #005AA0 | #F2EFED | 6.18:1 | **6.18:1** | 4.5:1 | PASS |
| Focus ring on white (non-text) | #1893b4 | #FFFFFF | 3.58:1 | **3.58:1** | 3.0:1 non-text | PASS |
| Focus ring on cream (non-text) | #1893b4 | #F5EFE2 | 3.12:1 | **3.12:1** | 3.0:1 non-text | PASS |
| Secondary button resting on white | #005AA0 | #FFFFFF | 7.07:1 | **7.07:1** | 4.5:1 | PASS |
| Secondary button hover on white | #003D6F | #FFFFFF | 11.07:1 | **11.07:1** | 4.5:1 | PASS |
| Dark zone link on espresso | #5DC6E8 | #1F1A14 | 8.81:1 | **8.81:1** | 4.5:1 | PASS |
| Dark zone link hover | #7AD0E8 | #1F1A14 | 9.88:1 | **9.88:1** | 4.5:1 | PASS |
| Dark zone CTA bg+text | #5DC6E8 bg + #1F1A14 text | -- | 8.81:1 | **8.81:1** | 4.5:1 | PASS |
| Card hover border (non-text) on white | #1893b4 | #FFFFFF | 3.58:1 | **3.58:1** | 3.0:1 non-text | PASS |
| Dark zone focus ring (non-text) | #62bbcb | #1F1A14 | 7.80:1 | **7.80:1** | 3.0:1 non-text | PASS |
| Hero headline (unchanged) | #1F1A14 | #FFFFFF | n/a | **17.27:1** | 4.5:1 | PASS |
| Hero kicker terracotta (unchanged) | #8C4E33 | #FFFFFF | n/a | **6.46:1** | 4.5:1 | PASS |

**T/F agreement:** Full agreement on all computed ratios. No discrepancy between F's WCAG table values and T's independent calculation.

**Pre-approved failures:** Three pairings fail AA. All three are within the documented pre-approved deviation set:
1. CTA resting `#62BBCB` on `#FFFFFF` (2.21:1) — pre-approved per operator decision 2026-05-11.
2. Inline link `#1893b4` on `#FFFFFF` (3.58:1) — pre-approved per operator decision 2026-05-11.
3. Inline link `#1893b4` on cream/warm (3.12:1) — extension of #2, same token on slightly different surface; both pass large-text 3.0:1 threshold; pre-approved as part of the same deviation.

**New undocumented failures:** None found. Every pairing outside the pre-approved set meets or exceeds its applicable threshold.

**Ratio discrepancy note:** The issue spec cites `2.13:1` for the CTA resting ratio and the brief's WCAG deviations section documents `2.13:1`. Both F and T independently calculate `2.21:1`. The spec/brief figure appears to be an earlier approximation. The css-change-log entry for Item A correctly records `2.21:1`. This is an advisory-level documentation inconsistency only — the pass/fail determination is unchanged.

Similarly, the CSS code comment in `html .theme--light` and the brief's deviations subsection cite `3.07:1` for inline-link-on-cream, while F's WCAG table and T's calculation both give `3.12:1`. The brief figure is slightly low. Advisory only.

---

## Mobile responsive verification

F reports no responsive overrides added in Phase 8.7. The spacing token changes are at `:root` and `@media (width > 700px)` — both consumed by Dripyard's existing responsive utilities. The `@media (max-width: 576px)` typography block had its now-redundant `--spacing-component: var(--sp8)` line removed (confirmed absent in the served file).

No new responsive media queries were introduced. No new touch-target rules. No new typography-mobile values.

**Result: N/A — no responsive overrides in this phase.** Existing responsive behavior is inherited and unchanged.

---

## Body-height check (informational — operator-accepted deviation)

Measured via Playwright `document.body.scrollHeight` on the live homepage:

| Viewport | Issue target | F reported | T measured | Delta vs target | Status |
|---|---|---|---|---|---|
| 1280px | <= 4541px | 4754px | **4754px** | +213px | OPERATOR-ACCEPTED DEVIATION |
| 768px | <= 5029px | 5742px | **5742px** | +713px | OPERATOR-ACCEPTED DEVIATION |
| 375px | <= 6366px | 7149px | **7149px** | +783px | OPERATOR-ACCEPTED DEVIATION |

T's measurements match F's exactly. The residual delta is documented architectural cost (sticky-header offset 87px, Dripyard component rendering overhead ~274px, footer padding 96px, card height delta ~108px at 1280). Per operator direction at phase handoff, this criterion is accepted as PASS-WITH-DEVIATION and is not blocking.

---

## Git diff scope

Files changed vs `main` (per `git diff main --name-only`):

| File | Expected by F | Confirmed | Note |
|---|---|---|---|
| `web/themes/custom/performant_labs_20260502/css/base.css` | Yes | Yes | L3 token overrides |
| `web/themes/custom/performant_labs_20260502/css/components/button.css` | Yes | Yes | L5 CTA rewire |
| `docs/pl2/briefs/pl_design_brief.md` | Yes | Yes | YAML token + WCAG deviations |
| `docs/pl2/css-change-log.md` | Yes | Yes | Three new entries |

No unexpected files in diff. No `!important` found in any diff line (`grep "^+" | grep -i "important"` returned no matches across all changed CSS files).

---

## Regression checks — phases 8.1–8.6

| Phase | Check | Method | Result |
|---|---|---|---|
| 8.1 | No "Book a testing review" CTA pill in header region | HTML grep for pill text in `<header>` | PASS |
| 8.1 | Hamburger button present at `<= 991px` | `mobile-nav-button` element in header HTML; header.css `@media (max-width: 991px)` confirms `width: 44px; height: 44px; border: 1px solid var(--theme-border-color); border-radius: 8px` | PASS |
| 8.2 | Hero `padding-inline: 0` on `.hero.theme--white` | hero.css direct read: `.hero.theme--white { padding-inline: 0 }` | PASS |
| 8.2 | Logo-grid `flex-wrap: nowrap` at `min-width: 992px` | logo-grid.css `@media (min-width: 992px)` block confirmed | PASS |
| 8.3 | `.logo-item img` `width: 140px; height: 28px; object-fit: contain; filter: grayscale(100%); opacity: 0.7` | logo-grid.css `.logo-grid .logo-item img` block confirmed | PASS |
| 8.4 | Homepage emits `grid-wrapper--3col-stack-md` | HTML count = 1 | PASS |
| 8.4 | `/open-source-projects` emits `grid-wrapper--3col` (not stack-md) | HTML on /open-source-projects: `grid-wrapper--3col` count = 2, `grid-wrapper--3col-stack-md` count = 0 | PASS |
| 8.5 | Hero `min-height: auto; height: auto; padding-block: 120px 96px` desktop | hero.css `.hero.theme--white` block confirmed | PASS |
| 8.5 | Hero mobile `padding-block: 64px` | hero.css `@media (max-width: 767px)` block confirmed | PASS |
| 8.5 | dy-section sibling combinator rule for logo bar spacing | logo-grid.css `.hero.theme--white + .dy-section:has(.logo-grid)` confirmed | PASS |
| 8.6 | Accordion `+/-` glyph rules (`.accordion-item__summary::after`) | accordion.css `content: "+"` / `content: "\2212"` on `[open]` confirmed | PASS |
| 8.6 | Hamburger border rule `@media (max-width: 991px)` | header.css `border: 1px solid var(--theme-border-color); border-radius: 8px` confirmed | PASS |
| 8.6 | Nav-cluster `font-size: 15px` at (0,3,0) specificity | header.css `.site-header .primary-menu__link--level-1[class] { font-size: 15px }` confirmed | PASS |
| 8.6 | Nav-cluster `gap: 32px` on `.site-header .primary-menu__list--level-1` | header.css confirmed | PASS |

All six prior-phase regression checks: PASS.

---

## Cross-page sanity

| Page | HTTP status | `base.css` linked | `button.css` linked | Single H1 | `<main>` + `<footer>` | Result |
|---|---|---|---|---|---|---|
| `/open-source-projects` | 200 | Yes | Yes | 1 | Both present | PASS |
| `/services` | 200 | Yes | Yes | 1 | Both present | PASS |

Both pages serve the same `base.css` containing all three `--pl-*` tokens and the `--spacing-component` overrides. No zero-height sections, no missing landmarks detected.

---

## Acceptance criteria status

Per `phase-8.7-color-spacing-issue.md`:

| Criterion | Status | Evidence |
|---|---|---|
| 1. Step-3 trace surfaced; root cause + layer + cross-page impact documented | PASS | F handoff §Layer decisions fully documents bottom-up/top-down trace for both items |
| 2. Primary brand color is cyan `#62BBCB` on hero primary CTA and closing CTA; `--theme-link-color` wired to `var(--pl-primary)` (#1893b4) | PASS | Confirmed in served `base.css` (3x zones) and `button.css` (`.button--primary`) |
| 3. WCAG compliance preserved: all pairings meet AA except pre-approved deviations; no undocumented failures surfaced | PASS | 19 pairings checked; 3 fail (all pre-approved); 0 new undocumented failures |
| 4. Brief updated: cyan as primary, three-token palette documented, `§Documented WCAG deviations` subsection present | PASS | `git diff main -- docs/pl2/briefs/pl_design_brief.md` confirms YAML `primary-deep` token added and deviations subsection added |
| 5. Homepage live heights within ±200px of preview at 1280 / 768 / 375 | PASS-WITH-DEVIATION | Actual deltas: +213 / +713 / +783 px. Operator accepted as structural architectural cost per phase handoff precondition |
| 6. Other pages render acceptably post-tightening (open-source-projects, how-we-do-it, contact-us, services, about-us, articles) | PASS | F spot-checked all 6 pages; T independently verified /open-source-projects and /services — both return 200, correct CSS linked, single H1, landmarks present |
| 7. No regressions on any prior sub-cycle (8.1–8.6) | PASS | All 14 regression checks confirmed (see Tier 2 regression table) |
| 8. No `!important`; files staged by explicit path | PASS | `git diff main` grepped for `!important` — no matches across all changed CSS files; diff touches only the four expected files |

**8 of 8 criteria: PASS (criterion 5 as PASS-WITH-DEVIATION per operator direction).**

---

## Blocking issues

None.

---

## Advisory notes

1. **CTA resting ratio documented inconsistently.** The issue spec, brief WCAG deviations subsection, and the CSS code comment in `:root` all cite `2.13:1`. F's WCAG table, the css-change-log, and T's independent calculation all give `2.21:1`. The `2.21:1` figure is mathematically correct for `#62BBCB` on `#FFFFFF`. The brief's deviation documentation should be updated from `2.13:1` to `2.21:1` for accuracy. Non-blocking (both are below the 3.0:1 large-text threshold).

2. **Cream link ratio inconsistency in code comment.** The CSS comment in `html .theme--light` (`base.css` line 64) states `3.07:1` for `#1893b4` on cream. T's independent calculation gives `3.12:1` (matching F's WCAG table). The brief deviations subsection also says `3.07:1`. The correct value is `3.12:1`. Non-blocking (both pass the 3.0:1 large-text threshold).

3. **`<html>` element retains Neonbyte OKLCH tokens.** F noted this existing architectural fact: `html .theme--white` selectors apply to descendant elements only, not to `<html>` itself. In practice all rendered content lives inside descendant `.theme--*` elements that match the overrides. No visible or functional impact confirmed. Pre-existing condition, not introduced in 8.7.
