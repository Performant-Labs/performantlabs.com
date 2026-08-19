# Handoff-T: Sprint 18 Cycle 2 — `/articles` preview-doc batch

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-18-cycle-2-preview-doc-batch`
**Issue:** `docs/pl2/handoffs/sprint-18-cycle-2-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/sprint-18-cycle-2-F.md`

---

## Tier 1 results

This is a preview-doc cycle (static HTML, no Drupal/DDEV). T1 checks adapted accordingly:
`ddev drush cr` and HTTP-status curl against DDEV are not applicable. A local Python HTTP
server was started on port 7788 to serve the Previews directory and confirmed HTTP 200.

| Check | Command | Expected | Actual | Result |
|---|---|---|---|---|
| HTTP 200 | `curl -s -o /dev/null -w "%{http_code}" http://localhost:7788/articles.html` | 200 | 200 | PASS |
| Changed files — docs-only | `git diff --name-only main` | Only `docs/pl2/Previews/articles.html` + Sprint 18 cycle artifacts + runbook/scripts | Confirmed: no live theme files changed | PASS |
| Fix A — active color defined | `grep -nE '#005AA0' articles.html` | `--primary-deep: #005AA0` in `:root` | Found at line 16 | PASS |
| Fix A — `.chip.is-active` uses `var(--primary-deep)` | `grep -n -A3 '\.chip\.is-active'` | `background: var(--primary-deep)` | Lines 294-296 | PASS |
| Fix A — `.pagination .is-current` uses `var(--primary-deep)` | `grep -n -A3 '\.pagination .is-current'` | `background: var(--primary-deep)` | Lines 407-409 | PASS |
| Fix B — `--card-border: #8E867A` defined | `grep -nE '#8E867A' articles.html` | Present in `:root` | Line 40 | PASS |
| Fix B — `.article-card` uses `var(--card-border)` | `grep -n -A5 '\.article-card {'` | `border: 1px solid var(--card-border)` | Line 312 | PASS |
| Fix C — `--espresso: #1F1A14` defined | `grep -nE '#1F1A14' articles.html` | Present in `:root` | Line 28 | PASS |
| Fix C — `.article-card h3 a` uses `var(--espresso)` | `grep -n '\.article-card h3 a'` | `color: var(--espresso)` | Line 363 | PASS |
| Fix D — chip order | DOM order grep | All, Automated Testing, Cypress, Open source, Talks | Lines 544-548: All / Automated Testing / Cypress / Open source / Talks | PASS |
| Fix E — mobile chip padding | `grep -n 'chip.*padding.*15'` | `.chip { padding: 15px 16px; }` inside `@media (max-width: 767px)` | Line 469 | PASS |
| Fix F — skip-link href | `grep -n '#main-content'` | `href="#main-content"` | Line 482 | PASS |
| Fix F — skip-link target in DOM | `grep -n 'id="main-content"'` | `<a id="main-content" tabindex="-1">` inside `<main>` | Line 517 | PASS |
| Fix F — `<main>` has no `id="main"` | `grep -n '<main'` | `<main role="main">` without id attribute | Line 516: `<main role="main">` — no id | PASS |
| No `!important` | `grep -i '!important' articles.html \| wc -l` | 0 | 0 | PASS |
| Old skip-link target absent | `grep -n 'href="#main"'` | 0 matches | 0 matches | PASS |
| Old hairline border on `.article-card` absent | `grep -n 'hairline' \| grep -i 'article-card'` | 0 matches | 0 matches | PASS |

---

## Tier 2 results

Browser probes run at `http://localhost:7788/articles.html` via Chrome MCP. Viewport set to
1280x900 for desktop probes; mobile CSS verified via CSSOM stylesheet inspection.

### 1280px desktop probes

| Check | Method | Expected | Actual | Result |
|---|---|---|---|---|
| Chip active `background-color` | `getComputedStyle(.chip.is-active).backgroundColor` | `rgb(0, 90, 160)` | `rgb(0, 90, 160)` | PASS |
| Chip active `border-color` | `getComputedStyle(.chip.is-active).borderTopColor` | `rgb(0, 90, 160)` | `rgb(0, 90, 160)` | PASS |
| Chip active `color` | `getComputedStyle(.chip.is-active).color` | `rgb(255, 255, 255)` | `rgb(255, 255, 255)` | PASS |
| Pagination current `background-color` | `getComputedStyle(.pagination .is-current).backgroundColor` | `rgb(0, 90, 160)` | `rgb(0, 90, 160)` | PASS |
| Card `border-color` | `getComputedStyle(.article-card).borderTopColor` | `rgb(142, 134, 122)` | `rgb(142, 134, 122)` | PASS |
| H3 link `color` | `getComputedStyle(.article-card h3 a).color` | `rgb(31, 26, 20)` | `rgb(31, 26, 20)` | PASS |
| Chip order (DOM) | `querySelectorAll('.chip')` text values | All, Automated Testing, Cypress, Open source, Talks | All, Automated Testing, Cypress, Open source, Talks | PASS |
| Skip-link `href` | `querySelector('.skip-link').getAttribute('href')` | `#main-content` | `#main-content` | PASS |
| Skip-link target tag | `getElementById('main-content').tagName` | `A` | `A` | PASS |
| Skip-link target `tabindex` | `getElementById('main-content').getAttribute('tabindex')` | `-1` | `-1` | PASS |
| `<main>` has no `id="main"` | `querySelector('main').getAttribute('id')` | `null` | `null` | PASS |
| H1 count | `querySelectorAll('h1').length` | 1 | 1 | PASS |
| `<header>` present | `!!querySelector('header')` | `true` | `true` | PASS |
| `<main>` present | `!!querySelector('main')` | `true` | `true` | PASS |
| `<footer>` present | `!!querySelector('footer')` | `true` | `true` | PASS |
| `<nav>` present | `!!querySelector('nav')` | `true` | `true` | PASS |
| No horizontal scroll | `scrollWidth > clientWidth` | `false` | `false` | PASS |
| Hamburger `aria-expanded` | Source: line 499 `aria-expanded="false"` | Present | Confirmed in source | PASS |

### Heading hierarchy

| Level | Count | Text |
|---|---|---|
| H1 | 1 | "Articles." |
| H2 | 0 | — (skipped) |
| H3 | 6 | Article card titles |
| H4 | 3 | Footer column headings |

H1 → H3 skips H2; H3 → H4 is correct. The H2 skip is pre-existing across all preview-docs
in this project (the `page-title` section uses H1 and the view cards use H3 directly).
No H2 was removed or added by Cycle 2 changes. Advisory note filed below.

---

## WCAG contrast verification

Ratios computed independently using the WCAG 2.1 relative luminance formula (`sRGB → linear → L`).

| Element | Foreground | Background | F's ratio | T's ratio | Standard | Result |
|---|---|---|---|---|---|---|
| Chip active text | #FFFFFF | #005AA0 | 7.07:1 | 7.07:1 | 4.5:1 (1.4.3, 14px text) | PASS |
| Pagination active text | #FFFFFF | #005AA0 | 7.07:1 | 7.07:1 | 4.5:1 (1.4.3, 14px text) | PASS |
| Card border vs white surface | #8E867A | #FFFFFF | 3.60:1 | 3.60:1 | 3.0:1 (1.4.11 non-text) | PASS |
| H3 link on white card | #1F1A14 | #FFFFFF | 17.27:1 | 17.27:1 | 4.5:1 (1.4.3) | PASS |
| H3 link on cream card | #1F1A14 | #F5EFE2 | 15.07:1 | 15.07:1 | 4.5:1 (1.4.3) | PASS |

Note: The spawn-prompt brief cited `#005AA0 on white = 7.66:1`. T's independent computation
and F's handoff both produce **7.07:1**. The 7.66 figure in the brief appears to be an error.
Both 7.07 and 7.66 are well above the 4.5:1 threshold — the discrepancy does not affect pass/fail.

---

## Mobile responsive verification

Fix E: chip tap-target padding at `@media (max-width: 767px)`.

- **Breakpoint:** `max-width: 767px` — matches project's mobile breakpoint (767px boundary).
- **CSS rule confirmed:** `.chip { padding: 15px 16px; }` at line 469, confirmed present in
  parsed CSSOM `CSSMediaRule` for `(max-width: 767px)`.
- **Touch-target height math:**
  - `font-size: 14px`, `line-height: 1` → rendered line = 14px
  - padding-top: 15px + padding-bottom: 15px = 30px
  - border-top: 1px + border-bottom: 1px = 2px
  - Total: 14 + 30 + 2 = **46px** ≥ 44px WCAG 2.5.8 floor
- **Viewport meta:** `width=device-width, initial-scale=1` — standard, no fixed-width override.
- **H1 orphan-word:** H1 text is "Articles." (single word + punctuation). No multi-word orphan
  risk. `text-wrap: balance` confirmed active on heading elements.
- **No horizontal scroll:** `document.documentElement.scrollWidth` not wider than viewport
  at 1280px; no fixed-width elements found. At 375px the mobile MQ fires, reducing padding
  and stacking the grid to 1-column — no overflow-inducing rules introduced by Cycle 2.

Note: The browser window could not be resized below ~1265px client width during this session
(OS window constraints). Live computed chip height at current viewport reads 34px (9px padding,
MQ not firing). The mobile MQ rule and height math are verified via CSSOM and source code;
the 46px figure is analytically confirmed, not via live computed style at 375px.

---

## Acceptance criteria status

| Criterion | Evidence | Result |
|---|---|---|
| F-NEW-18-A: chip + pagination active color `#1893B4` → `#005AA0` | `.chip.is-active` and `.pagination .is-current` use `var(--primary-deep)`; computed `rgb(0, 90, 160)` confirmed in DOM | PASS |
| F-NEW-18-B: card border `#E5E1DC` → `#8E867A` (exact live value) | `--card-border: #8E867A` in `:root`; `.article-card` uses `var(--card-border)`; computed `rgb(142, 134, 122)` confirmed in DOM | PASS |
| F-NEW-18-C: card H3 color `#2A2520` → `#1F1A14` | `.article-card h3 a` uses `var(--espresso)`; computed `rgb(31, 26, 20)` confirmed in DOM | PASS |
| F-NEW-18-D: swap last two chips to match live order | DOM order: All, Automated Testing, Cypress, Open source, Talks — confirmed | PASS |
| F-NEW-18-E: mobile chip padding 9px → 15px for ≥44px tap target | Rule present in `@media (max-width: 767px)`; computed height = 46px (math-verified) | PASS |
| F-NEW-18-F: skip-link target `#main` → `#main-content` | `href="#main-content"`, `<a id="main-content" tabindex="-1">` inside `<main>`; `<main>` has no `id` attribute | PASS |
| No `!important` | `grep -i '!important' articles.html \| wc -l` = 0 | PASS |

---

## Blocking issues

None.

---

## Advisory notes

1. **Heading hierarchy H1 → H3 (no H2).** Pre-existing across all preview-docs in the project.
   The articles listing page has no section title between the page H1 and the article-card H3s.
   This is not introduced by Cycle 2 but is worth tracking for the live Drupal implementation.

2. **O's brief cited `7.66:1` for `#005AA0` on white.** Correct value is `7.07:1` (confirmed by
   both F's handoff and T's independent computation). Both values pass 4.5:1 — no action required,
   but the brief figure should be corrected in future cycles.

3. **`article-card--text` variant retains `border-color: transparent`.** This is correct and
   intentional per F's autonomous decision note. Cream-surface cards use the cream background
   as visual differentiation rather than a border. No action required.
