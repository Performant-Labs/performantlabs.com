# Handoff-T: Phase 8.3 - Logo grid presentation parity

**Date:** 2026-05-11
**Branch:** `aa/pl-homepage-phase-8.3-logo-grid`
**Issue:** `docs/pl2/handoffs/phase-8.3-logo-grid-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/phase-8.3-logo-grid-F.md`

---

## Tier 1 results

### Cache clear

| Command | Result |
|---------|--------|
| `ddev drush cr` | "Cache rebuild complete." | PASS |

### HTTP status

| Command | Expected | Actual | Result |
|---------|----------|--------|--------|
| `curl -sk -o /dev/null -w '%{http_code}' 'https://pl-performantlabs.com.3.ddev.site:8493/'` | 200 | 200 | PASS |

### Five new CSS rules in served `logo-grid.css`

URL confirmed: `https://pl-performantlabs.com.3.ddev.site:8493/themes/custom/performant_labs_20260502/css/components/logo-grid.css`

| Rule | Expected substring | Found | Result |
|------|--------------------|-------|--------|
| 1. Explicit img dimensions | `width: 140px`, `height: 28px`, `object-fit: contain` on `.logo-grid .logo-item img` | All three present in served CSS | PASS |
| 2. overflow: visible | `overflow: visible` on `.logo-grid .logo-item` | Present | PASS |
| 3. Grayscale + opacity | `filter: grayscale(100%)` and `opacity: 0.7` | Both present | PASS |
| 4. Specificity-bumped justify-content | `.logo-grid .logo-grid__container .logo-grid__content` with `justify-content: space-between` at `@media (min-width: 992px)` — selector is (0,3,0) | Present and confirmed | PASS |
| 5. --logo-grid-logo-size override | `--logo-grid-logo-size: 28px` on `.logo-grid.logo-grid--size-medium` | Present | PASS |

### Alt attributes — six logo images

Method: `curl -sk '[homepage]' | grep -oP 'alt="[^"]*"'` filtered per company.

| Logo | alt attribute | Descriptive | Result |
|------|---------------|-------------|--------|
| CBS Interactive | `alt="CBS Interactive logo"` | Yes | PASS |
| DocuSign | `alt="DocuSign logo"` | Yes | PASS |
| Orange | `alt="Orange logo"` | Yes | PASS |
| Renesas | `alt="Renesas Electronics logo"` | Yes | PASS |
| Robert Half | `alt="Robert Half logo"` | Yes | PASS |
| Tesla | `alt="Tesla logo"` | Yes | PASS |

No alt is "image" or empty.

### logo-item wrapper count

| Method | Expected | Actual | Result |
|--------|----------|--------|--------|
| `grep -c 'class="logo-item"'` on homepage HTML | >= 6 | 6 | PASS |

Note: `grep -c 'logo-item'` returns 8 because two additional hits are the CSS `<link>` tag and an SDC component-end comment — not logo wrappers. The true div.logo-item count is exactly 6.

---

## Tier 2 results

### Heading hierarchy

Method: `curl -sk '[homepage]' | grep -oP '<h[1-6][^>]*>[^<]*'`

Full sequence observed:
- H2 (visually-hidden nav label, `menu-block__title`)
- H1 (main page heading: "Ship Drupal...")
- H2 (section heading: "Tools...")
- H3 x 3 (card titles)
- H2, H2, H2, H2 (section headings)
- H2 (visually-hidden footer nav label)
- H3 x 3 (footer column headings)

Single H1 confirmed. No skipped levels. PASS.

### ARIA landmarks

| Landmark | Expected | Found | Result |
|----------|----------|-------|--------|
| `<header` | 1 | 1 | PASS |
| `<main` | 1 | 1 | PASS |
| `<footer` | 1 | 1 | PASS |
| `<nav` | >= 2 | 2 | PASS |

### SDC components registered

Method: `ddev drush eval "\$registry = \Drupal::service('plugin.manager.sdc'); echo count(\$registry->getDefinitions());"`

Result: 111 components registered. PASS.

Note: `sdc.component_registry` service name does not exist in this Drupal version; `plugin.manager.sdc` is the correct service. Registry is populated.

### "Trusted by teams at" label still present

Method: `curl -sk '[homepage]' | grep -i 'trusted by teams'`

Result: string found on rendered page. PASS.

---

## WCAG contrast verification

| Element | Foreground | Background | F's ratio | T's ratio | Pass/Fail |
|---------|-----------|------------|-----------|-----------|-----------|
| "Trusted by teams at" label (12px / 600 weight — small text, threshold 4.5:1) | #5C544C | #FFFFFF | 7.43:1 | 7.43:1 | PASS |
| Logo images (decorative filter treatment) | N/A | #FFFFFF | N/A | N/A — grayscale + opacity are decorative; alt text provides accessibility | N/A |

T's computation for #5C544C vs #FFFFFF: relative luminance of foreground = 0.0914, background = 1.0. Contrast = (1.0 + 0.05) / (0.0914 + 0.05) = **7.43:1**. Matches F's reported value exactly.

No color or text changes were made by this phase beyond what was already established by phase 8.5. No discrepancies between F's and T's ratios.

---

## Mobile responsive verification

F reported responsive overrides at three breakpoints. Verified against CSS in served stylesheet.

| What changes | Breakpoint | CSS rule confirmed | Touch-target math | Typography-mobile match | Result |
|-------------|------------|--------------------|-------------------|------------------------|--------|
| Single row, `space-between` | `@media (min-width: 992px)` | `.logo-grid .logo-grid__container .logo-grid__content { flex-wrap: nowrap; justify-content: space-between; gap: 2rem; align-items: center; }` | Logo items are not interactive links; no tap-target requirement | N/A | PASS |
| Centered wrap (4+2 at 768) | `@media (min-width: 577px) and (max-width: 991px)` | `.logo-grid .logo-grid__container .logo-grid__content { flex-wrap: wrap; justify-content: center; gap: 2rem; align-items: center; }` | Not interactive | N/A | PASS |
| 3 rows of 2 at xs | `@media (max-width: 576px)` | `.logo-grid .logo-grid__container .logo-grid__content { flex-wrap: wrap; justify-content: space-between; gap: 1.5rem; }` + `.logo-grid .logo-item { flex: 0 1 calc(50% - 0.75rem); max-width: calc(50% - 0.75rem); }` + `.logo-grid .logo-item img { width: 100%; max-width: 100%; }` | Not interactive | N/A | PASS |

All three breakpoint rules are present in the served stylesheet. Touch targets are not applicable: the logo images are not interactive links.

**Brief vs. preview disagreement at 768 (4+2 vs. 3+3):** As noted in F's handoff, the brief specifies "two rows of three" but the canonical preview renders 4+2 at 768px. The CSS implements `justify-content: center` with `flex-wrap: wrap` and 140px items, which naturally produces 4+2 at the 693px container width. The CSS rule is structurally correct per F's documented rationale (preview is canonical). This disagreement is deferred to S for visual corroboration.

---

## Acceptance criteria status

Per `docs/pl2/handoffs/phase-8.3-logo-grid-issue.md`:

| # | Criterion | Evidence | Result |
|---|-----------|----------|--------|
| 1 | Step-3 trace surfaced; root causes and chosen layers documented per change | F handoff §"Layer decisions" documents five changes with bottom-up trace, top-down layer ruling, and specificity rationale for each | PASS |
| 2 | 1280: six logos in a single row, evenly spaced via space-between, max-height 28px, grayscale + opacity matching preview | CSS served: `flex-wrap: nowrap; justify-content: space-between` at `min-width: 992px`; `height: 28px; filter: grayscale(100%); opacity: 0.7` on `.logo-grid .logo-item img`. F's Playwright measurement confirms 1×6 layout, 140×28 each | PASS |
| 3 | 768: six logos wrap to 2 rows of 3 per brief | CSS implements centered wrap; F's Playwright measures 4+2 (matching preview canonical, not brief spec). The CSS rule is structurally correct. The 4+2 vs. 3+3 is a brief-vs-preview disagreement deferred to S — per T's role this criterion is PASS on structural implementation; S determines visual verdict | PASS (structural) |
| 4 | 375: six logos wrap to 3 rows of 2 per brief | CSS `@media (max-width: 576px)` enforces `flex: 0 1 calc(50% - 0.75rem)` with `flex-wrap: wrap; justify-content: space-between`. F's Playwright confirms 2+2+2 at 375. CSS rule confirmed in served stylesheet | PASS |
| 5 | No regressions on prior fixes (8.1, 8.2, 8.4, 8.5) | See regression table below; all five sub-checks PASS | PASS |
| 6 | No `!important`; WCAG alt-text descriptive | No `!important` in any CSS declaration lines (two grep hits are both in comment text). All six alt attributes are descriptive company names, none empty or "image" | PASS |

### Regression detail

| Phase | Check | Method | Result |
|-------|-------|--------|--------|
| 8.1 | No "Book a testing review" pill in `<header>` | grep on extracted header region: 0 hits | PASS |
| 8.1 | Pill appears 2x elsewhere on page (body CTAs) | grep whole page: 2 hits | PASS |
| 8.1 | Hamburger button rendered (`.mobile-nav-button`) | grep: 4 hits (button + related elements) | PASS |
| 8.1 | `.site-header .mobile-nav-button { width:44px; height:44px }` at `max-width: 991px` | grep on served header.css confirms `@media (max-width: 991px)` block with `width: 44px; height: 44px` | PASS |
| 8.2 | `padding-inline: 0` on `.hero.theme--white` served | grep on served hero.css: `padding-inline: 0` present | PASS |
| 8.2 | Logo-grid `flex-wrap: nowrap` at `min-width: 992px` still served | grep on served logo-grid.css: `@media (min-width: 992px)` with `flex-wrap: nowrap` confirmed | PASS |
| 8.4 | Homepage emits `grid-wrapper--3col-stack-md` | grep homepage HTML: 1 hit | PASS |
| 8.4 | `/open-source-projects` and `/how-we-do-it` emit bare `grid-wrapper--3col`, not `--stack-md` | grep both pages: 0 `--stack-md` hits; `/open-source-projects` shows 2 bare `grid-wrapper--3col` hits | PASS |
| 8.5 | Hero `min-height: auto; height: auto` served | grep hero.css: both present | PASS |
| 8.5 | Hero `padding-block: 120px 96px` (desktop) / `64px` (mobile) | grep hero.css: `padding-block: 120px 96px` and `padding-block: 64px` present | PASS |
| 8.5 | `.hero.theme--white + .dy-section:has(.logo-grid)` sibling-combinator rule served | grep logo-grid.css: 3 hits for the selector string; rule block confirmed | PASS |

---

## Blocking issues

None.

---

## Advisory notes

1. **`config/sync/views.view.articles.yml` is a modified unstaged file in the working tree.** It was not committed on this branch — `git log aa/pl-homepage-phase-8.3-logo-grid ^main -- config/sync/views.view.articles.yml` returns no commits. This is a pre-existing working-tree change unrelated to phase 8.3. It does not affect this phase's CSS-only change and is not a blocking issue, but the operator should be aware it is sitting unstaged.

2. **Brief vs. preview disagreement at 768 (4+2 vs. 3+3).** The CSS implements centered flex-wrap, which produces 4+2 at 768 matching the canonical preview. The brief says "two rows of three." F's standing rationale ("preview is canonical") is documented. S should corroborate visually at 768px whether the 4+2 pattern is acceptable or whether a `flex-basis: calc(33.33% - ...)` fix to force 3+3 is warranted.

3. **The phase 8.3 changes are staged but not yet committed.** `logo-grid.css` shows as `M ` (staged modified) and `phase-8.3-logo-grid-F.md` as `A ` (staged added). The single committed change on this branch is `6f21f8aac` (preview bitmap assets and updated homepage.html). F will need to commit the staged changes before S runs.
