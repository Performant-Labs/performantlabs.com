# Handoff-T: Phase 8.6 - Polish batch (final Phase 8 sub-cycle)

**Date:** 2026-05-11
**Branch:** `aa/pl-homepage-phase-8.6-polish`
**Issue:** `docs/pl2/handoffs/phase-8.6-polish-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/phase-8.6-polish-F.md`

---

## Tier 1 results

| Check | Command | Expected | Actual | Result |
|-------|---------|----------|--------|--------|
| Cache clear | `ddev drush cr` | success | "[success] Cache rebuild complete." | PASS |
| HTTP status | `curl -sk https://pl-performantlabs.com.3.ddev.site:8493/ -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| accordion.css served | `curl -sk .../accordion.css \| grep "display: none"` | rule present | `.accordion-item__summary svg { display: none; }` at line 84 | PASS |
| accordion.css +indicator | `curl -sk .../accordion.css \| grep 'content: "+"'` | rule present | `.accordion-item__summary::after { content: "+"; }` at line 94 | PASS |
| accordion.css − indicator | `curl -sk .../accordion.css \| grep '2212'` | rule present | `.accordion-item[open] > .accordion-item__summary::after { content: "\2212"; }` at line 105 | PASS |
| header.css border rule | `curl -sk .../header.css \| grep 'border:.*theme-border-color'` | rule present | `border: 1px solid var(--theme-border-color);` inside `@media (max-width: 991px)` at line 244 | PASS |
| header.css border-radius | `curl -sk .../header.css \| grep 'border-radius: 8px'` | rule present | `border-radius: 8px;` at line 245 | PASS |
| header.css 44x44 | `curl -sk .../header.css \| grep 'width: 44px\|height: 44px'` | both present | `width: 44px;` line 242, `height: 44px;` line 243 | PASS |
| Item 1 footer casing | grep `.footer-column__link` text from rendered page | sentence case | "Testing-suite takeover", "Embedded testing engineer", "Autonomous healing pilot", "Accessibility testing", "Privacy policy" — all sentence case | PASS |
| Item 3 CTA arrow absence | grep `→` / `&#8594;` / `&rarr;` near "Book a testing review" | zero in CTA | `Book a testing review  </a>` — no arrow. Two `&rarr;` on page are in ATK workflow paragraph and footer signature, not the CTA pill. | PASS |
| Item 4 checklist periods | grep `.icon-list-item__content` text | all 4 end with `.` | "Dev teams catch regressions before users do." / "Engineers deploy with confidence, not anxiety." / "Manual test cycles drop as automated runs cover the regression surface." / "Leadership ships on schedule and on budget." | PASS |
| No `!important` | grep `!important` in accordion.css and header.css | 0 occurrences | 0 occurrences in rules (comment-only mention in header.css line 39 is in a doc comment) | PASS |

---

## Tier 2 results

| Check | Method | Result |
|-------|--------|--------|
| Single H1 | `grep -c "<h1"` on rendered page | 1 — "Ship Drupal releases with confidence." | PASS |
| H2 present, no skipped levels | grep H2 blocks from rendered HTML | 5 visible H2s: "Tools, AI, and experts. All there." / "We heal our own tests nightly." / "Built for the whole Drupal team." / "Frequently asked questions." / "Ready for a release you don't have to babysit?". Two visually-hidden H2s for nav regions. H3s present for cards/footer. No H4. No skipped levels. | PASS |
| `<header>` landmark | grep rendered HTML | `<header class="theme--white site-header" data-component-id="neonbyte:header">` | PASS |
| `<nav>` landmark | grep rendered HTML | Two `<nav>` elements: main-menu and footer, both with `aria-labelledby` | PASS |
| `<main>` landmark | grep rendered HTML | `<main class="site-main">` | PASS |
| `<footer>` landmark | grep rendered HTML | `<footer data-component-id="neonbyte:footer" class="site-footer theme--white">` | PASS |
| Accordion native disclosure ARIA | grep `<details>/<summary>` in rendered HTML | 4 `<details class="accordion-item">` + 4 `<summary class="accordion-item__summary">`. Native `<details>/<summary>` provides open/closed disclosure state via the `open` attribute — no `aria-expanded` or `aria-controls` needed. SVG has `aria-hidden="true"`. Correct behavior. | PASS |
| Item 2 ARIA preservation | CSS change is visual-only | SVG was `aria-hidden="true"` before; CSS `display: none` on the SVG removes it from layout but the `::after` pseudo-element content is not announced by screen readers, leaving semantic state entirely on the native `<details>` open attribute. No ARIA regression. | PASS |
| SDC component registrations | `grep` in `performant_labs_20260502.info.yml` | `libraries-extend` maps `core/components.dripyard_base--accordion-item` → `performant_labs_20260502/accordion` and `core/components.neonbyte--header` → `performant_labs_20260502/header`. Both registered correctly. | PASS |
| CSS load order — accordion | line numbers from rendered `<link>` tags | Dripyard `accordion-item.css` at line 62, our `accordion.css` at line 63. Override loads after — cascade wins. | PASS |
| CSS load order — header | line numbers from rendered `<link>` tags | Our `header.css` at line 90; neonbyte `mobile-nav-button.css` at line 93. Additionally, `.site-header .mobile-nav-button` (0,2,0) beats `.mobile-nav-button` (0,1,0) regardless of load order. | PASS |

---

## WCAG contrast verification

| Element | Foreground | Background | F's ratio | T's ratio | Pass/Fail |
|---------|-----------|------------|-----------|-----------|-----------|
| Accordion +/− on cream (FAQ band) | #0F6F8A (`--theme-link-color`) | #F3EADA (F's stated bg) | 4.24:1 | 4.81:1 | PASS (body text ≥ 4.5:1) |
| Accordion +/− on cream (FAQ band) — actual token | #0F6F8A (`--theme-link-color`) | #F5EFE2 (actual `--theme-surface` in `.theme--light`) | not stated | 5.01:1 | PASS (AA ≥ 4.5:1) |
| Accordion +/− on white | #0F6F8A (`--theme-link-color`) | #FFFFFF | 5.74:1 | 5.74:1 | PASS (AA) |
| Hamburger icon lines | #1F1A14 (`--theme-text-color-loud`) | #FFFFFF | 17.29:1 | 17.27:1 | PASS (AAA) |
| Hamburger border | #E5E1DC (`--theme-border-color`) | #FFFFFF | 1.23:1 | 1.30:1 | N/A — decorative hairline; functional affordance from icon lines (17.27:1) and accessible label "Menu" |

**Discrepancy notes:**

1. F reported the cream FAQ band surface as `#F3EADA`. The actual `--theme-surface` token in `.theme--light` (checked in `base.css` line 38) is `#F5EFE2`. Both surfaces are light cream and both give ratios above 4.5:1, so the pass/fail outcome is unchanged. F's background hex was incorrect.

2. F reported the accordion +/− ratio on `#F3EADA` as 4.24:1. T computes 4.81:1 for that same hex. With the corrected actual hex `#F5EFE2`, T computes 5.01:1. All three values pass AA 4.5:1. The pass/fail outcome is unchanged, but F's stated ratio of 4.24:1 is arithmetically incorrect even for the hex F cited.

3. Hamburger border ratio: F 1.23:1, T 1.30:1 — minor floating-point variance, both correctly classified as decorative/N/A.

---

## Mobile responsive verification

### Item 2 (accordion +/− indicator)

No responsive override. The `::after` pseudo-element inherits Dripyard's flex layout on `.accordion-item__summary` (display: flex; gap: 20px). `flex-shrink: 0` and `margin-inline: auto 0` on the `::after` preserve correct positioning at all viewports. No breakpoint-specific rules needed. CSS confirmed in served stylesheet.

### Item 5 (hamburger border)

- Breakpoint: `@media (max-width: 991px)` — confirmed correct. Neonbyte hides `.mobile-nav-button` above 1000px via `display: none`; the border rule is scoped to exactly the viewport range where the button is visible.
- Touch target: `width: 44px; height: 44px` confirmed in served stylesheet (lines 242–243). `border-box` is global (Dripyard base reset), so the 1px border is included within the outer 44×44px dimensions. Touch target meets WCAG 2.5.5 (44×44 CSS px minimum).
- No additional responsive overrides needed.

---

## Acceptance criteria status

| Criterion (from issue) | Evidence | Result |
|------------------------|----------|--------|
| 1. Step-3 trace surfaced; root cause + chosen layer documented per item | F handoff documents L5/L1/L1/L1/L5 per item with full bottom-up and top-down trace. Item 6 documents container-width calculation showing ~7px delta sub-threshold. | PASS |
| 2. All six items match canonical preview at appropriate viewports (1–4 full-width; item 5 < 992px only; item 6 acknowledged no-op) | Items 1/3/4/6: verified via curl — sentence-case labels, no CTA arrow, checklist periods present, nav offset ~7px documented as sub-threshold per issue's own < 10px guidance. Item 2: CSS rules confirmed in served stylesheet. Item 5: border + radius confirmed in served stylesheet at correct breakpoint. | PASS |
| 3. No regressions on prior fixes (8.1 / 8.2 / 8.3 / 8.4 / 8.5) | See regression checks section below — all five sub-cycles verified. | PASS |
| 4. No `!important`; stage files by explicit path; `component_version` retention applies | Zero `!important` declarations in accordion.css or header.css rules. F handoff names explicit file paths. `component_version` not applicable (CSS-only changes, no SDC YAML modified). | PASS |
| 5. WCAG: icon-only changes preserve hit areas and labels; footer link text changes preserve link semantics | Accordion: `aria-hidden="true"` on SVG preserved; `::after` pseudo-element is decorative (not announced); native `<details>` open attribute provides disclosure state. Hamburger: 44×44 touch target preserved (border-box). Footer: links retain `class="footer-column__link"` anchor elements with sentence-case text; semantics unchanged. | PASS |

---

## Regression checks (all five prior sub-cycles)

| Sub-cycle | Check | Method | Result |
|-----------|-------|--------|--------|
| 8.1 | No "Book a testing review" pill in header region | `grep -c "header.*button--primary"` on rendered page → 0 | PASS |
| 8.1 | `--header-padding-block: 14px` at `≤ 991px` | `grep "padding-block: 14px"` in served `header.css` | PASS |
| 8.1 | Hamburger 44×44 WITH border | `grep "width: 44px; height: 44px"` + `border: 1px solid var(--theme-border-color)` in served `header.css` at `@media (max-width: 991px)` | PASS |
| 8.2 | Hero `padding-inline: 0` on `.hero.theme--white` | `grep "padding-inline: 0"` in served `hero.css` → line 84 | PASS |
| 8.2 | Logo-grid `min-width: 992px` nowrap rule | `grep "992px\|nowrap"` in served `logo-grid.css` → `@media (min-width: 992px) { flex-wrap: nowrap }` at line 154–156 | PASS |
| 8.3 | `.logo-item img` `width: 140px; height: 28px; object-fit: contain; filter: grayscale(100%); opacity: 0.7` | `grep` in served `logo-grid.css` → lines 131–137 | PASS |
| 8.4 | Homepage emits `grid-wrapper--3col-stack-md` | `grep -c "grid-wrapper--3col-stack-md"` on rendered homepage → 1 | PASS |
| 8.4 | `/open-source-projects` emits `grid-wrapper--3col` (no `-stack-md`) | curl `/open-source-projects` → 2 instances of `grid-wrapper--3col`, 0 of `-stack-md` | PASS |
| 8.4 | `/how-we-do-it` emits `grid-wrapper--3col` (no `-stack-md`) | curl `/how-we-do-it` → 1 instance of `grid-wrapper--3col`, 0 of `-stack-md` | PASS |
| 8.5 | Hero `min-height: auto; height: auto` in served `hero.css` | `grep "min-height: auto\|height: auto"` → lines 81–82 | PASS |
| 8.5 | Hero `padding-block: 120px 96px` (desktop) | `grep "padding-block"` in served `hero.css` → line 83 | PASS |
| 8.5 | Hero `padding-block: 64px` (tablet/mobile) | `grep "padding-block: 64px"` in served `hero.css` → line 90 | PASS |
| 8.5 | Sibling-combinator rule `.hero.theme--white + .dy-section:has(.logo-grid)` | `grep` in served `logo-grid.css` → lines 256 and 260 | PASS |

---

## Git diff scope

`git diff main --name-only` produces 4 files:

1. `config/sync/views.view.articles.yml` — **pre-existing branch-wide diff**, not introduced by phase 8.6. Confirmed by `git diff aa/pl-homepage-phase-8.5-hero-spacing..aa/pl-homepage-phase-8.6-polish --name-only` which does not include this file. The views.yml modification originates in commit `46b6db1c2` (feat(articles)) from earlier pipeline work.
2. `docs/pl2/css-change-log.md` — two new entries appended for items 2 and 5. Confirmed.
3. `web/themes/custom/performant_labs_20260502/css/components/accordion.css` — SVG hide + ::after indicator rules. Confirmed.
4. `web/themes/custom/performant_labs_20260502/css/components/header.css` — border + border-radius added to `.site-header .mobile-nav-button` inside `@media (max-width: 991px)`. Confirmed.

The F handoff lists exactly the three files that are phase-8.6-specific. The `views.view.articles.yml` entry in the broader diff is not within scope of this phase and was not part of any phase-8.6 change. The diff scope for phase 8.6 is clean — F's handoff is accurate.

Note: F's handoff also mentions the handoff file itself as a changed file; the handoff doc is not a code artifact and not tracked in the file-scope check.

---

## Blocking issues

None.

---

## Advisory notes

1. **F's cream surface hex is incorrect.** F's WCAG table states the accordion +/− indicator sits on `#F3EADA`. The actual `--theme-surface` token for `.theme--light` zones (the FAQ band) in `base.css` line 38 is `#F5EFE2`. Both surfaces yield ratios above 4.5:1 for `#0F6F8A` (5.01:1 on the actual token), so this is a documentation error only — no fix needed before S proceeds.

2. **F's stated accordion contrast ratio is arithmetically wrong.** F reports 4.24:1 for `#0F6F8A` on `#F3EADA`. T's independent calculation of that same pair gives 4.81:1. The discrepancy is large enough to warrant noting. Since the actual surface is `#F5EFE2` and the computed ratio is 5.01:1, the WCAG outcome is a clear pass regardless. No code change required.

3. **`views.view.articles.yml` in main diff.** This file appears in `git diff main` but was modified in prior work (commit `46b6db1c2`, articles pipeline). It is not within scope of phase 8.6 and requires no action for S to proceed on the homepage overhaul.
