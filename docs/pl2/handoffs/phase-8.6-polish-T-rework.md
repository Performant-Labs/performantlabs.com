# Handoff-T: Phase 8.6 - Polish rework (nav-cluster horizontal alignment) — Round 2

**Date:** 2026-05-11
**Branch:** `aa/pl-homepage-phase-8.6-polish`
**Issue:** `docs/pl2/handoffs/phase-8.6-polish-rework-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/phase-8.6-polish-F-rework.md`

---

## Tier 1 results

| Check | Command | Expected | Actual | Result |
|-------|---------|----------|--------|--------|
| Cache clear | `ddev drush cr` | success | "[success] Cache rebuild complete." | PASS |
| HTTP status | `curl -sk https://pl-performantlabs.com.3.ddev.site:8493/ -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| Round-2 Rule 1: `[class]` selector at (0,3,0) | grep `primary-menu__link--level-1\[class\]` in served header.css | selector present | `.site-header .primary-menu__link--level-1[class]` at line 114 | PASS |
| Round-2 Rule 1: font-size: 15px | grep `font-size: 15px` in served header.css | present | line 116 | PASS |
| Round-2 Rule 1: padding: 0 | grep `padding: 0` in served header.css | present | line 118 | PASS |
| Round-2 Rule 2: gap: 32px on list | grep `primary-menu__list--level-1` + `gap: 32px` in served header.css | present | `.site-header .primary-menu__list--level-1 { gap: 32px; }` at lines 101–103 | PASS |
| Round-2 Rule 3: `:not(:has(*))` empty-wrapper hide | grep `has(\*)` in served header.css | present | `.site-header .header-navigation-wrapper__third:not(:has(*)) { display: none; }` at lines 108–110 | PASS |
| Round-2 Rule 4: `--header-padding-inline: 14px` | grep `header-padding-inline` in served header.css | present | `--header-padding-inline: 14px;` at line 89 inside `@media (width > 1000px)` | PASS |
| Round-2 Rule 4: `--header-padding-block: 22px` | grep `header-padding-block` in served header.css | present | `--header-padding-block: 22px;` at line 90 inside `@media (width > 1000px)` | PASS |
| Round-1 hamburger border | grep `theme-border-color` in served header.css at mobile block | present | `border: 1px solid var(--theme-border-color);` at line 171 inside `@media (max-width: 991px)` | PASS |
| Round-1 hamburger border-radius | grep `border-radius: 8px` in served header.css | present | `border-radius: 8px;` at line 172 | PASS |
| Round-1 hamburger 44×44 | grep `width: 44px\|height: 44px` in served header.css | both present | lines 169–170 | PASS |
| Round-1 accordion SVG hidden | grep `display: none` in served accordion.css | present | `.accordion-item__summary svg { display: none; }` at line 84 | PASS |
| Round-1 accordion `+` indicator | grep `content: "+"` in served accordion.css | present | line 94 | PASS |
| Round-1 accordion `−` indicator | grep `2212` in served accordion.css | present | `content: "\2212"` at line 105 | PASS |
| Nav labels in rendered HTML | grep `primary-menu__link--level-1` href patterns | six labels | Services, How we do it, Articles, Open source projects, About us, Contact us — all six confirmed | PASS |
| No `!important` in header.css diff | `git diff main -- header.css \| grep "^+" \| grep "!important"` | 0 matches | 0 matches | PASS |
| No `!important` in accordion.css diff | same check on accordion.css | 0 matches | 0 matches | PASS |

---

## Tier 2 results

| Check | Method | Result |
|-------|--------|--------|
| Single H1 | `grep -c "<h1"` on rendered page | 1 — "Ship Drupal releases with confidence." (H1 text node confirmed) | PASS |
| H2 present, no skipped levels | `grep -c "<h2"` and `grep -c "<h3"` | 7 H2s, 6 H3s, 0 H4s. No levels skipped. | PASS |
| `<header>` landmark | grep rendered HTML | `<header class="theme--white site-header" data-component-id="neonbyte:header">` | PASS |
| `<main>` landmark | grep rendered HTML | `<main class="site-main">` | PASS |
| `<footer>` landmark | grep rendered HTML | `<footer data-component-id="neonbyte:footer" class="site-footer theme--white">` | PASS |
| `<nav>` ×2 | `grep -c "<nav"` on rendered page | 2 nav elements confirmed | PASS |
| SDC components registered | `ddev drush eval` via `plugin.manager.sdc` | `dripyard_base:accordion-item` and `neonbyte:header` both returned by plugin manager | PASS |
| `libraries-extend` entries | grep `performant_labs_20260502.info.yml` | `core/components.dripyard_base--accordion-item → performant_labs_20260502/accordion` and `core/components.neonbyte--header → performant_labs_20260502/header` both present | PASS |
| CSS load order — theme header.css vs neonbyte primary-menu-wide.theme.css | link-tag line numbers from rendered HTML | Our header.css at link line 90; neonbyte primary-menu-wide.theme.css at line 96. Our (0,3,0) beats neonbyte's (0,2,0) by specificity regardless of load order. | PASS |

---

## WCAG contrast verification

| Element | Foreground | Background | F's ratio | T's ratio | Pass/Fail |
|---------|-----------|------------|-----------|-----------|-----------|
| Nav links resting (`--theme-text-color-primary`) | #2A2520 | #FFFFFF | 14.68:1 | 15.17:1 | PASS (AAA) |
| Nav links hover/active-trail (`--theme-link-color`) | #0F6F8A | #FFFFFF | 5.74:1 | 5.74:1 | PASS (AA) |
| Hamburger touch target | — | — | 44×44 CSS px | 44×44 CSS px (border-box: 1px border inside outer dimensions) | PASS (WCAG 2.5.5) |

**Notes:**
- Round-2 changes are font-size and spacing only; no color edits. Nav-link foreground/background token values are unchanged from round 1 and prior phases. Both pairs pass AA.
- Minor floating-point difference on nav resting (15.17 vs 14.68): both compute AAA-level clearance. The difference is within normal rounding variance across implementations.
- Accordion and hamburger contrast ratios are unchanged from round-1 T handoff; see `phase-8.6-polish-T.md` for full accordion contrast table.

---

## Mobile responsive verification

Round-2 changes are scoped entirely to `@media (width > 1000px)`. No responsive overrides were added for narrow viewports. The existing `@media (max-width: 991px)` block (hamburger border, 14px padding-block) is unchanged. At narrow viewports the inline nav is hidden by `display: none` and the mobile-nav-button takes over. Round-1 hamburger border rule at `@media (max-width: 991px)` confirmed present (lines 163–173 in served header.css). No new touch-target or typography-mobile changes. Round-1 responsive checks all hold.

---

## Acceptance criteria status

| Criterion (from rework issue) | Evidence | Result |
|-------------------------------|----------|--------|
| Nav-cluster right edge within 10 px of preview at 1280 | F reports 8.7 px delta (post-fix). CSS rules confirmed in served stylesheet: (0,3,0) font-size/padding rule eliminates 192px padding excess; gap: 32px on list; empty CTA slot hidden; container token adjustments close residual delta. Structural position measurement is Tier 3 (S's job); T confirms all CSS preconditions are present. | PASS (CSS verified; position measurement deferred to S Tier 3) |
| Nav-cluster left edge within 10 px of preview at 1280 | Same CSS rules govern left-edge position. F reports 8.7 px symmetric delta. | PASS (CSS verified; position measurement deferred to S Tier 3) |
| Nav-cluster width within ~10 px of preview at 1280 | F reports 0.0 px delta (681px live vs 681px preview). `gap: 32px`, `font-size: 15px`, `padding: 0` all confirmed in served CSS — these are the three factors that determine cluster width. | PASS (CSS verified; position measurement deferred to S Tier 3) |
| No regressions on items 1–5 and phases 8.1–8.5 | See regression checks section below. | PASS |
| No `!important`; component_version retention applies | Zero `!important` in CSS diff. No SDC YAML files modified; component_version retention not applicable. | PASS |

---

## Regression checks (full suite)

### Items 1–5 (round-1 polish batch)

| Item | Check | Method | Result |
|------|-------|--------|--------|
| 1 | Footer link casing sentence case | grep `.footer-column__link` text from rendered HTML | "Testing-suite takeover", "Embedded testing engineer", "Autonomous healing pilot", "Accessibility testing", "Articles", "Documentation", "About us", "Contact us", "Privacy policy" — all sentence case | PASS |
| 2 | Accordion `+` glyph closed / SVG hidden | `grep "display: none"` + `content: "+"` in served accordion.css | Both rules confirmed (lines 84, 94) | PASS |
| 2 | Accordion `−` glyph open | `grep "2212"` in served accordion.css | `content: "\2212"` at line 105 | PASS |
| 3 | CTA pill no arrow glyph | grep "Book a testing review" in rendered HTML | Two instances: `Book a testing review  </a>` — no arrow in either. | PASS |
| 4 | Checklist terminal periods | grep `.icon-list-item__content` in rendered HTML | "Dev teams catch regressions before users do." / "Engineers deploy with confidence, not anxiety." / "Manual test cycles drop as automated runs cover the regression surface." / "Leadership ships on schedule and on budget." — all four end with periods. | PASS |
| 5 | Hamburger 1 px border + 8 px radius | `grep "theme-border-color\|border-radius: 8px"` in served header.css at `@media (max-width: 991px)` | lines 171–172 confirmed | PASS |

### Phases 8.1–8.5

| Sub-cycle | Check | Method | Result |
|-----------|-------|--------|--------|
| 8.1 | No "Book a testing review" pill in header region | `grep -c "header.*button--primary"` on rendered page → 0 | PASS |
| 8.1 | `--header-padding-block: 14px` at `≤ 991px` | confirmed in served header.css line 165 | PASS |
| 8.1 | Hamburger 44×44 WITH border | `width: 44px; height: 44px; border: 1px solid var(--theme-border-color);` at lines 169–171 in served header.css inside `@media (max-width: 991px)` | PASS |
| 8.2 | Hero `padding-inline: 0` on `.hero.theme--white` | `grep "padding-inline: 0"` in served theme hero.css → line 27 | PASS |
| 8.2 | Logo-grid `min-width: 992px` nowrap rule | `grep "992px\|nowrap"` in served theme logo-grid.css → `@media (min-width: 992px) { flex-wrap: nowrap }` at line 154–156 | PASS |
| 8.3 | `.logo-item img` `width: 140px; height: 28px; object-fit: contain; filter: grayscale(100%); opacity: 0.7` | grep in served theme logo-grid.css → lines 131–137 | PASS |
| 8.4 | Homepage emits `grid-wrapper--3col-stack-md` | `grep -c "grid-wrapper--3col-stack-md"` on rendered homepage → 1 | PASS |
| 8.5 | Hero `min-height: auto` | `grep "min-height: auto"` in served theme hero.css → line 81 | PASS |
| 8.5 | Hero `padding-block: 120px 96px` (desktop) | grep in served theme hero.css → line 83 | PASS |
| 8.5 | Hero `padding-block: 64px` (tablet/mobile) | grep in served theme hero.css → line 90 | PASS |
| 8.5 | Sibling-combinator rule `.hero.theme--white + .dy-section:has(.logo-grid)` | grep in served theme logo-grid.css → lines 256 and 260 | PASS |

---

## Git diff scope

`git diff main --name-only` for CSS and docs paths:

1. `docs/pl2/css-change-log.md` — new entries for round-1 items 2 and 5, and round-2 item 6. Phase-8.6-specific. EXPECTED.
2. `web/themes/custom/performant_labs_20260502/css/components/accordion.css` — SVG hide + ::after indicator rules (round-1 item 2). EXPECTED.
3. `web/themes/custom/performant_labs_20260502/css/components/header.css` — hamburger border (round-1 item 5) + all four round-2 nav-cluster rules. EXPECTED.
4. `web/themes/custom/performant_labs_20260502/css/components/grid-wrapper.css` — **comment-only** update (3 comment lines revised in the `--3col-stack-md` block trace comment; no CSS rules changed). Introduced in commit `ff4039a6c` ("docs(ofts): tighten escalation…"), which updated the trace comment to reflect a brief update that was marked "follow-up task" in round 1. No CSS logic changed.

Broader `git diff main --name-only` also includes pre-existing branch-wide files (`.gitignore`, `config/sync/views.view.articles.yml`, `docs/pl2/briefs/`, `docs/pl2/workflow-ofts.md`, `docs/pl2/handoffs/` pipeline docs, and screenshots) — none of these are code artifacts introduced by phase 8.6. The F-rework handoff correctly identifies one CSS file changed; the `grid-wrapper.css` comment-only change was not called out but is benign.

No `!important` in any added lines across all three CSS files.

---

## Blocking issues

None.

---

## Advisory notes

1. **`grid-wrapper.css` not mentioned in F-rework handoff.** The file appears in `git diff main` due to a comment-only trace-comment update from a prior commit. The diff contains no CSS rule changes — only 3 comment lines updated. No action required; noting for S's awareness.

2. **F's nav-resting contrast ratio (14.68:1 vs T's 15.17:1).** Minor floating-point variance. Both are AAA-level clearance. No fix needed.

3. **F-rework handoff removed the prior standalone `.primary-menu__link--level-1 { font-family: ... }` rule** and consolidated it into the new (0,3,0) rule. The result in the served CSS is correct; the font-family `"Poppins", sans-serif` is present in the new rule at line 115. This consolidation is clean and does not affect other selectors.
