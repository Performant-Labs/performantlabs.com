# `/articles` — Implementation Plan (OFTS pipeline)

> **Parent:** [`pl-plan.md`](pl-plan.md)
> **Workflow:** [`workflow-ofts.md`](workflow-ofts.md)
> **Static reference:** [`Previews/articles.html`](Previews/articles.html)
> **Brand inputs:** [`Briefs/pl_design_brief.md`](Briefs/pl_design_brief.md), [`Briefs/pl_brand_brief.md`](Briefs/pl_brand_brief.md)

End-to-end runbook for replacing the current `/articles` listing with the design captured in the static preview. Every phase below is one cycle through the OFTS pipeline. Tick boxes top-to-bottom.

---

## Context: this is a View, not a Canvas page

Unlike the homepage, `/articles` is rendered by a Drupal **View** (`views.view.articles : page_1`). That divides ownership cleanly:

| Region | Owned by | Implementation surface |
|---|---|---|
| Site header, breadcrumb, footer | System blocks (already shipped) | Reuse — no work here |
| Page title band ("Articles." + lede) | Page template / page-title block | New cream-band block treatment, scoped to the route |
| Filter chip row | View — exposed filter on `field_category` | `views-exposed-form--articles--page-1.html.twig` + chip CSS |
| Card grid (rows) | View — `views-view-unformatted` | Wrapper Twig + per-row teaser via `node--article--teaser.html.twig` |
| Pagination | View — `views-view-pager` | Pager Twig + pill CSS |

The boundary is marked explicitly in `Previews/articles.html` (`<!-- VIEW SCOPE START / END -->`). F follows that boundary when overriding templates.

---

## Token bump 2026-05-06 (Phase 2 finding)

Phase 2's WCAG numerical contrast computation surfaced that two design-brief tokens fail AA on the surfaces they're used:
- `--accent-deep` `#A85F40` on `--cream` `#F5EFE2` = **4.19:1** (needs ≥ 4.5:1 for normal text — eyebrow category on text-only article-card variant)
- `--muted` `#8A8278` on `--canvas` `#FFFFFF` = **3.79:1** (needs ≥ 4.5:1 — date in eyebrow at 13px is not "large text")

Both bumped (in the brief, all 4 static previews, and the article-card component) to:
- `--accent-deep`: `#8E4A2A` — 6.69:1 on canvas, 5.85:1 on cream (both AA-clean with margin)
- `--muted`: `#6B6358` — 5.93:1 on canvas, 5.19:1 on cream (both AA-clean with margin)

Visual shift is small (slightly darker terracotta + warm-gray). The shift applies retroactively to homepage/services/how-we-do-it previews; live theme CSS for those pages is on a separate cascade and is unaffected by this bump until those pages re-derive from the brief.

---

## Operating principles (inherited)

These apply to every phase. They come from the homepage runbook and theme-change docs — repeating the load-bearing ones so a single read of this file is enough.

1. **Every CSS change follows the 7-step workflow** at [`theme-change--workflow.md`](theme-change--workflow.md). Trace the variable chain. Override at the highest correct layer.
2. **Three-Tier Verification** — Tier 1 (`curl`) → Tier 2 (ARIA structural) → Tier 3 (visual). T runs T1+T2; S runs T3. T3 never runs before T2 passes.
3. **Color overrides use the Layer 4 component-wrapper pattern.** Beats Dripyard's inline `<html>` style on specificity.
4. **Read the `.component.yml` before any prop reference.** Never write a prop name, slot name, or component_id from memory.
5. **Stage files by explicit path.** Never `git add .` — taxonomy data + view config + Twig + CSS will land across config sync, custom modules, and the theme.
6. **No `!important`.** If you feel the need, you're at the wrong layer.
7. **WCAG 2.2 AA non-negotiable.** Backdrop change → re-run numerical contrast before any screenshot.

---

## Pre-flight readiness (no pipeline cycle)

Before opening Phase 1, confirm:

- [ ] Homepage overhaul is shipped — `performant_labs_20260418` (or its successor) is the active default theme.
- [ ] Brand component primitives are in place: `kicker`, `button`, `card` SDC, `theme--white` / `theme--cream` wrappers, terracotta accent token (`--accent-deep`).
- [ ] The 10 article nodes exist (path-list in [`pl-plan--pages.md`](pl-plan--pages.md) §"Article nodes (10)").
- [ ] `/articles-2` duplicate alias confirmed — to be pruned in Phase 5.
- [ ] No outstanding open issues in `aa/pl-articles-*` branches.

---

## Phase 1 — Data foundation: `field_category` taxonomy

**Pipeline:** `O → F → T → O` (no visual)
**Branch:** `aa/pl-articles-phase-1-categories`

### Objective
Add a category taxonomy to article nodes so the view can expose a filter on it. Without this, the filter chip row in Phase 3 has nothing to filter on.

### Acceptance criteria
- [ ] Taxonomy vocabulary `article_category` exists in config.
- [ ] Vocabulary contains exactly four terms: `Automated Testing`, `Cypress`, `Talks`, `Open source`. Term machine names: `automated_testing`, `cypress`, `talks`, `open_source`.
- [ ] Field `field_category` (entity reference, target = `article_category`, cardinality = 1) added to `node.article`.
- [ ] All 10 existing article nodes have a category assigned (mapping below).
- [ ] `ddev drush config:export` clean — config diff shows only the four expected files (`taxonomy.vocabulary.article_category.yml`, `field.storage.node.field_category.yml`, `field.field.node.article.field_category.yml`, plus form/view display additions).
- [ ] T1 verification: a `drush eval` loop confirms `field_category` populated for all 11 article nodes.

### Term assignments (verified against live DB on 2026-05-06)
| nid | Title | Category |
|---|---|---|
| 9 | Introducing Layout Builder Kit Beta 1 | Talks |
| 10 | Layout Builder Can Break Your Site — Part 1 | Talks |
| 11 | Why Drupal? | Open source |
| 12 | We all benefit from Open Source | Open source |
| 13 | Our talk at DrupalCon: Layout Builder components… | Talks |
| 14 | BADCamp 2020 — Components Can Break Your Site, Part 2 | Talks |
| 15 | Cypress on Drupal Cheat Sheet | Cypress |
| 16 | Introducing Automated Testing Kit | Automated Testing |
| 17 | Version 1.0 of Automated Testing Kit Is Ready! | Automated Testing |
| 105 | CTRFHub: building a CTRF-native test reporting platform in the open | Automated Testing |

(10 nodes total; mapping covers all of them.)

### Notes
No visual output — pipeline shortens to `O → F → T → O`.
Term ordering is alphabetical in the chip row, but `All` is rendered as a synthetic first chip by the exposed-form Twig in Phase 3 (it's not a term).

---

## Phase 2 — `article-card` component (image + text-only variants)

**Pipeline:** `O → F → T → S → O`
**Branch:** `aa/pl-articles-phase-2-card`

### Objective
Build the SDC component that renders one article teaser. Two variants: image card (default) and text-only (`--text` modifier) for entries without a thumbnail. Visual target: §"Card grid" in `Previews/articles.html`.

### Acceptance criteria
- [ ] SDC component exists at `themes/custom/performant_labs_20260418/components/article-card/`. Files: `article-card.component.yml`, `article-card.twig`, `article-card.css`.
- [ ] Schema declares props: `url` (string, required), `category_label` (string, required), `date` (string ISO + display string), `title` (string, required), `excerpt` (string, required), `image_src` (string, optional), `image_alt` (string, optional). When `image_src` is empty the component renders the `--text` variant.
- [ ] Markup matches the preview: `<article class="article-card[ article-card--text]">` with `.article-card__media` (anchor wrapping `<img>`) only when `image_src` set, and `.article-card__body` containing `.article-card__eyebrow` (category + dot + `<time>`), `<h3>` linked to `url`, and `.article-card__excerpt` (always present, 2-line clamp).
- [ ] CSS lives at `css/components/article-card.css`, attached via `libraries-extend` (Layer 5). No `!important`.
- [ ] All color values come from theme tokens (`--theme-surface`, `--accent-deep`, `--hairline`, etc.) — no raw hex in component CSS.
- [ ] Hover state: 1px hairline → `--primary` border; 2px translateY lift; 150ms ease-out (matches preview).
- [ ] Image variant: 16:9 aspect ratio media frame, `--surface-warm` background, `object-fit: cover`. Media link is `aria-hidden="true" tabindex="-1"` — the `<h3>` link is the only keyboardable target so screen-reader users hit the title once, not twice.
- [ ] Excerpt clamp: `-webkit-line-clamp: 2` with overflow hidden; falls back gracefully when unsupported.
- [ ] T renders the component in the SDC Styleguide explorer at both variants and confirms structure.
- [ ] WCAG numerical contrast: `--ink` on `--canvas` ≥ 4.5:1; `--accent-deep` on `--canvas` ≥ 4.5:1; `--ink` on `--cream` (text-only variant) ≥ 4.5:1.

### Layer decision (anticipated)
Component-specific styling → Layer 5 (`css/components/article-card.css` via `libraries-extend`). Confirm trace before writing.

### S verification (exhaustive — do not trim)

**Visual token match (image variant + text-only variant, both):**
- [ ] Card background: image variant = `--canvas` (#FFFFFF); text variant = `--cream` (#F5EFE2). Sample both rendered values.
- [ ] Card border (default): 1px `--hairline` (#E5E1DC) on image; transparent on text variant.
- [ ] Card border (hover): both variants → 1px `--primary` (#1893b4).
- [ ] Card border-radius: `--radius-lg` (12px) — measure on rendered output.
- [ ] Card hover lift: `translateY(-2px)`, `transition: 150ms ease-out` on `border-color, transform`.
- [ ] Media frame aspect-ratio: exactly 16:9. Measure rendered width:height ratio.
- [ ] Media frame fallback background (broken/loading image): `--surface-warm` (#F2EFED).
- [ ] Eyebrow category text color: `--accent-deep` (#8E4A2A); date color: `--muted` (#6B6358); separator dot: `--hairline` (#E5E1DC).
- [ ] Title color (default): `--ink` (#2A2520). Title color (hover): `--primary`.
- [ ] Excerpt color: `--body` (#5C544C).

**Typography table (per element, both variants):**
| Element | Font family | Weight | Size | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| `.article-card__eyebrow` (category) | Poppins | 600 | 12px | 1 | 1.4px |
| `.article-card__eyebrow time` | Poppins | 500 | 13px | 1 | 0.6px |
| `.article-card h3` (image variant) | Rubik | 500 | 24px | 1.25 | -0.4px |
| `.article-card h3` (text variant) | Rubik | 500 | 26px | 1.25 | -0.4px |
| `.article-card__excerpt` | Poppins | 400 | 15px | 1.6 | 0 |

**Spacing:**
- [ ] Image variant body padding: `var(--space-xl) var(--space-xl) var(--space-2xl)` (32/32/48).
- [ ] Text variant body padding: `var(--space-2xl)` (48 all sides).
- [ ] Body internal gap (eyebrow → title → excerpt): `var(--space-md)` (12px).
- [ ] Eyebrow internal gap (category–dot–date): 10px between items.

**Interactive states (verify on screenshot, do not skip):**
- [ ] Default — as above.
- [ ] `:hover` on the card — title color shifts to `--primary`, border darkens to `--primary`, card lifts 2px.
- [ ] `:focus-visible` on the title link — focus ring visible, ≥3:1 contrast against the card surface (canvas or cream).
- [ ] No focus ring leakage on the `aria-hidden` media link (it's `tabindex="-1"`, must not be tab-stop).

**ARIA / structure:**
- [ ] `<article>` element wraps each card.
- [ ] `<h3>` is the heading rank (not h2 — page-title h1 + view region landmark).
- [ ] `<time datetime="YYYY-MM-DD">` machine-readable on the date.
- [ ] Decorative dot between category and date carries no role/text or has `aria-hidden="true"`.
- [ ] Image `<img>` has descriptive `alt` attribute (verify the 4 image-card alts are non-empty and meaningful, not "image" or "thumbnail").
- [ ] Media link wrapping `<img>` is `aria-hidden="true" tabindex="-1"` so screen readers and keyboard users hit the title link only.

**Responsive (mobile 375px):**
- [ ] Image-variant `h3` drops to 20px, line-height 1.25.
- [ ] Text-variant `h3` drops to 22px.
- [ ] Card body padding reduces (verify against design brief mobile spec; if no override specified, document that desktop padding holds).
- [ ] Touch target: title link tap height ≥ 44px (h3 is 20px text + line-height 1.25 = 25px → padding around the link or a larger tap area is required).
- [ ] No horizontal scroll inside the card at 375px.

**Static preview comparison:**
- [ ] Image card #1 (Version 1.0 of ATK) — pixel match against preview screenshot at 1280px.
- [ ] Text-only card (BADCamp 2020) — pixel match against preview screenshot at 1280px (the cream background is the canonical visual signature; verify it).

**Forced-colors / reduced-motion:**
- [ ] `forced-colors: active` — card border, title, excerpt all remain legible (use `currentColor` and system colors, no color-only signaling).
- [ ] `prefers-reduced-motion: reduce` — hover lift transition suppressed; border-color change may remain (it's not motion).

---

## Phase 3 — View configuration + Twig overrides

**Pipeline:** `O → F → T → S → O`
**Branch:** `aa/pl-articles-phase-3-view`

### Objective
Configure `views.view.articles : page_1` to render the new card teaser, expose the category filter as a chip row, and paginate. Override the wrapper Twig templates so the markup matches the preview.

### Acceptance criteria

**View config** (`config/sync/views.view.articles.yml`):
- [ ] Display `page_1`: path `/articles`, format `unformatted`, row plugin `entity:node` rendering `article` nodes in **`teaser`** view mode.
- [ ] Sort: `created` DESC.
- [ ] Pager: `mini` or `full` — full preferred, items per page = 6 (matches preview's 6-card first page).
- [ ] Exposed filter: `field_category` (taxonomy term reference). Filter identifier = `category`. Operator `is one of`. Multiple = false. Required = false. Reset link enabled.
- [ ] No `field_category` filter → renders all (matches "All" chip default).
- [ ] Article teaser view mode (managed-display config) emits the props the SDC needs: image (16:9 image style), title, body summary, term name, created date.

**Image style:**
- [ ] Image style `article_card_16_9` exists — 800×450, focal-point crop, AVIF + WebP derivatives. Used by the `teaser` display.

**Twig overrides** (in the active theme):
- [ ] `templates/views/views-view-unformatted--articles--page-1.html.twig` — wraps rows in `<div class="article-grid">`.
- [ ] `templates/views/views-exposed-form--articles--page-1.html.twig` — renders the exposed `category` filter as the chip row exactly per the preview, including the synthetic `All` chip (no `category` query param) marked `.is-active` when the current request has no `category` filter, and term chips with `.is-active` when the current term matches.
- [ ] `templates/views/views-view-pager--articles--page-1.html.twig` (or theme-wide pager) — emits the pill-button pagination markup from the preview, with `aria-current="page"` on the current page.
- [ ] `templates/node/node--article--teaser.html.twig` — renders the `article-card` SDC, passing the prop values from the rendered fields. Image prop conditional on `content.field_image` being non-empty (drives the text-only variant).

**CSS** (Layer 5, `css/components/articles-view.css`):
- [ ] `.articles-view`, `.article-grid` (2-col → 1-col at `md`), `.articles-toolbar`, `.chip` (default + `:hover` + `.is-active`), `.pagination` (pill).
- [ ] Mobile: grid collapses to 1 column at the `md` breakpoint per the design brief; toolbar wraps and left-aligns at `sm`.
- [ ] Touch targets: chip ≥ 44×44 CSS px on mobile (verified via padding + line-height math); pager pills ≥ 44×44 CSS px.

**Tier 1 / Tier 2 (T):**
- [ ] `curl /articles` returns 200, contains `<div class="article-grid"`, contains all 6 first-page article titles, contains `<form class="views-exposed-form"` rendering 4 term chips + `All`.
- [ ] `curl /articles?category=automated-testing` returns 200, contains only Automated Testing articles, "Automated Testing" chip carries `.is-active`.
- [ ] `curl /articles?page=1` returns 200, contains the second-page articles.
- [ ] Heading hierarchy: single `<h1>` (page title), card `<h3>`s under it, no skipped levels.
- [ ] Filter form is keyboard-reachable; `aria-label="Filter articles by category"` present on the toolbar group.

**Tier 3 (S, exhaustive):**

**Toolbar / chip row:**
- [ ] Toolbar layout: centered horizontally desktop, left-aligned at 375px (preview spec).
- [ ] `Filter` label: 12px, weight 600, letter-spacing 1.6px, uppercase, color `--muted` (#6B6358), 16px right margin.
- [ ] Chip default: 14px Poppins weight 500, padding 9px 16px, border-radius pill (30px), 1px `--hairline` border, `--canvas` background, `--body` text.
- [ ] Chip `:hover`: border `--primary`, text `--primary`, no background change. No underline.
- [ ] Chip `.is-active`: `--primary` background, `--primary` border, white text.
- [ ] Chip active `:hover`: `--primary-deep` background, `--primary-deep` border, white text.
- [ ] Chip gap: 8px between chips (`--space-sm`).
- [ ] Toolbar bottom: 32px padding-bottom + 1px `--hairline` separator + 48px margin-bottom before grid starts.
- [ ] Toolbar group has accessible name `aria-label="Filter articles by category"`.

**Card grid:**
- [ ] Grid: 2 columns desktop ≥ 992px, 1 column < 992px.
- [ ] Column gap: 48px desktop (`--space-2xl`), 32px mobile (`--space-xl`).
- [ ] Cards in a row stretch to the same height (grid `align-items: stretch` default).
- [ ] First-page rendering: 6 cards in DOM order — Nov 2023, Jun 2023, Apr 2023, Oct 2020, Feb 2020 (DrupalCon talk), Feb 2020 (Open source). 4 image-cards + 2 text-cards interleaved per the preview.

**Pagination:**
- [ ] Container: `<nav class="pagination" aria-label="Articles pagination">` with `<ul>` of `<li>` items.
- [ ] Pill default: 40×40 minimum, 14px text, weight 500, `--hairline` border, `--canvas` background, `--body` text.
- [ ] Pill `:hover`: `--primary` border + text, no underline.
- [ ] Current page (`.is-current`): `--primary` background, `--primary` border, white text, `aria-current="page"`.
- [ ] "Next →" link: same pill styling; preserves any active `category` query param.
- [ ] At 375px, all pager pills ≥ 44×44 CSS px (touch target; default 40 × 40 must scale up at mobile).

**Filtered-state visuals (test these URLs explicitly, screenshot each):**
- [ ] `/articles` — "All" chip is `.is-active`, all 6 first-page cards visible.
- [ ] `/articles?category=automated-testing` — only Automated Testing chip is `.is-active`, only Automated Testing cards visible.
- [ ] `/articles?category=cypress` — only Cypress chip active, only Cypress card(s) visible. Pagination hidden if ≤ items-per-page.
- [ ] `/articles?category=talks` — only Talks chip active, only the 3 Talks cards visible (2 text-only + Layout Builder Part 1 if categorized as Talks).
- [ ] `/articles?category=open-source` — only Open source chip active, 2 Open source cards.
- [ ] `/articles?category=<nonexistent>` — empty-state message renders, no JS errors, chips still operable.

**Per-state visuals (every interactive surface):**
- [ ] Default vs hover vs focus vs active for: chips, pager pills, card title links, "Next →" link.
- [ ] Focus ring on every interactive element ≥ 3:1 against its surface. Focus ring not clipped by `overflow: hidden` on the card.

**Tab order (DOM-ordered list):**
1. Header brand link
2. Header nav links left to right (Services → Contact)
3. "Call today" button
4. Breadcrumb home link
5. Chip row: All → Automated Testing → Cypress → Talks → Open source
6. Card title links 1 through 6 (in render order)
7. Pager: page 2 → "Next →"
8. Footer links by column

**Cache / query-param edges:**
- [ ] Pager link from `/articles?category=cypress` correctly emits `/articles?category=cypress&page=1` (not bare `?page=1`).
- [ ] Cold page cache request to `/articles?category=automated-testing` returns the filtered listing on first hit (no stale cache leak).

### Open question for the implementer
Drupal's exposed form is normally a `<select>` or checkbox set. The chip pattern needs the form rendered as a styled link list, not a real `<form>` submit. Two options:

1. **Render-as-links approach** — exposed filter Twig outputs `<a>` tags whose `href` carries `?category=<term-slug>`; the form itself is hidden / non-interactive. Simplest, no JS.
2. **Form-with-styled-buttons** — keep the `<form>` and style submit buttons as chips, JS-submits on click. More complex; adds a JS dependency.

Default to **(1)**. F documents the choice in handoff-F before writing code; O can redirect if there's a reason to prefer (2) (e.g., we want non-JS state preservation for other filters later).

---

## Phase 4 — Page title cream band

**Pipeline:** `O → F → T → S → O`
**Branch:** `aa/pl-articles-phase-4-page-title`

### Objective
Add the "FIELD NOTES" kicker + "Articles." H1 + lede paragraph in a cream-band region, scoped to the `/articles` route. Visual target: §"PAGE TITLE" in `Previews/articles.html`.

### Acceptance criteria
- [ ] A block (or page-template region) renders the page title band only on the `/articles` route. Implementation choice (block placement with route condition, or `page--articles.html.twig`) documented in handoff-F.
- [ ] Markup matches the preview: `<section class="page-title">` containing kicker, `<h1>`, lede paragraph.
- [ ] Kicker uses the existing `kicker` SDC (do not re-implement).
- [ ] H1 is the page's only `<h1>` (the View must not emit a second one).
- [ ] CSS at `css/components/page-title.css` via `libraries-extend`. No raw hex — uses `--cream`, `--accent-deep`, `--ink`, `--body` tokens.
- [ ] Cream surface contrast: `--ink` on `--cream` ≥ 4.5:1; `--accent-deep` on `--cream` ≥ 4.5:1.
- [ ] Mobile: H1 drops from 56px → 36px at `sm` per the responsive scale in the design brief.
- [ ] Lede copy matches the preview verbatim (review the brand brief tone — peer-to-peer, no fluff — pass the eye-roll test).

### Considerations
The design system already has page title treatments for `/services` and `/how-we-do-it`. Reuse the established pattern; this phase should be small if the page-title-band component already exists. F should grep `themes/custom/performant_labs_20260418/components/` for an existing page-title or page-header SDC before writing new code.

### S verification (exhaustive)

**Visual tokens:**
- [ ] Section background: `--cream` (#F5EFE2). Sample rendered hex.
- [ ] Bottom border: 1px `--hairline` (#E5E1DC).
- [ ] Section padding: 64px top / 48px bottom desktop (`--space-3xl` / `--space-2xl`); 48px / 32px at 767px.

**Typography:**
| Element | Font | Weight | Size desktop | Size mobile (≤767px) | Line-height | Letter-spacing |
|---|---|---|---|---|---|---|
| Kicker | Poppins | 600 | 12px | 12px | 1 | 1.6px |
| H1 | Rubik | 500 | 56px | 36px | 1.05 | -1.4px → -0.8px |
| Lede | Poppins | 400 | 18px | 18px | 1.6 | 0 |

**Kicker treatment:**
- [ ] Color `--accent-deep`, uppercase, with 28px terracotta hairlines on either side (matches the kicker SDC default).
- [ ] Reuses the existing `kicker` SDC (verify by inspecting rendered class names against the SDC's component ID).

**Contrast (numerical, T-computed; S double-checks visually):**
- [ ] `--ink` on `--cream`: target ≥ 4.5:1 (compute exact ratio).
- [ ] `--accent-deep` on `--cream`: target ≥ 4.5:1.
- [ ] `--body` on `--cream` (lede): target ≥ 4.5:1.

**Structure / ARIA:**
- [ ] Single `<h1>` on the page, contains the literal text "Articles." (with the trailing period).
- [ ] Lede paragraph follows the H1, max-width 620px, centered.
- [ ] Section is wrapped in a `<section>` (or equivalent landmark-appropriate element).

**Responsive:**
- [ ] At 375px: H1 36px, no clipping, no overflow.
- [ ] Lede wraps to 2–3 lines naturally; no orphan word on its own line (use `text-wrap: balance`).

**Static preview comparison:**
- [ ] Side-by-side at 1280px against `Previews/articles.html` page-title section. Note any deltas in S handoff.
- [ ] Side-by-side at 375px.

---

## Phase 5 — Cross-section + WCAG sign-off

**Pipeline:** `O → T → S → O` (audit only, no F)
**Branch:** `aa/pl-articles-phase-5-audit`

### Objective
End-to-end verification of the assembled `/articles` page in the default theme. Catches anything that worked component-by-component but fails when stacked together.

### Tier 2 acceptance (T)
- [ ] One `<h1>`, no skipped heading levels through the whole page (header → page-title H1 → card H3s → footer H4s).
- [ ] Landmark structure: `<header>`, `<main>` (containing page-title + view), `<footer>`. No nested or duplicate landmarks.
- [ ] Tab order: header nav → "Call today" CTA → breadcrumb home link → chip row (left to right) → card titles in DOM order → pager → footer links.
- [ ] No focus traps; no `tabindex` > 0; aria-hidden elements not focusable.
- [ ] Empty-state behavior: `?category=<term-with-no-articles>` doesn't 500 — view shows configured empty text.

### Tier 3 acceptance (S, exhaustive cross-section)

**Section-by-section preview comparison (1280px desktop):**
- [ ] Site header — brand mark, nav, "Articles" current state, Call today CTA all match.
- [ ] Breadcrumb — Home / Articles, hairline separator color.
- [ ] Page title band — cream surface, kicker, H1, lede (Phase 4 spec).
- [ ] Toolbar — Filter label + 5 chips, hairline divider below (Phase 3 spec).
- [ ] Card grid — 6 cards in 3 rows of 2, image+image / image+text / text+image arrangement, gaps.
- [ ] Pagination — pill 1 (active), 2, Next →.
- [ ] Footer — 4 columns, hairline top, legal row.

**Section-by-section preview comparison (375px mobile):**
- [ ] Header collapses (existing behavior).
- [ ] Breadcrumb single row.
- [ ] Page title 36px H1, lede wraps cleanly, no orphan words.
- [ ] Toolbar wraps to 2+ lines, left-aligned, chips remain ≥ 44px tap height.
- [ ] Grid collapses to 1 column.
- [ ] Cards: image-variant h3 = 20px, text-variant h3 = 22px.
- [ ] Pager pills ≥ 44×44 CSS px.
- [ ] Footer collapses to 1 column (existing behavior).

**Per-token color match table:**
| Token | Brief value | Rendered value | Match |
|---|---|---|---|
| `--primary` | #1893b4 | (sample) | |
| `--primary-deep` | #005AA0 | (sample) | |
| `--accent-deep` | #8E4A2A | (sample) | |
| `--cream` | #F5EFE2 | (sample) | |
| `--ink` | #2A2520 | (sample) | |
| `--body` | #5C544C | (sample) | |
| `--muted` | #6B6358 | (sample) | |
| `--hairline` | #E5E1DC | (sample) | |
| `--surface-warm` | #F2EFED | (sample) | |
| `--canvas` | #FFFFFF | (sample) | |

**Heading hierarchy (verify exactly this tree):**
- [ ] One `<h1>` — "Articles." (page title)
- [ ] No `<h2>` on this page (no section-head treatment used)
- [ ] Six `<h3>` — one per article card title
- [ ] Footer column labels are `<h4>` (existing site-footer behavior)
- [ ] No skipped levels; heading order in DOM is h1 → h3 → h3 → … → h4 → h4 (the h1→h3 jump is intentional because there is no h2 between page title and cards)

**Landmarks (verify present, exactly one of each):**
- [ ] `<header role="banner">` (or implicit via `<header>`)
- [ ] `<main>` wrapping page-title + view region
- [ ] `<nav aria-label="Main">` (header nav)
- [ ] `<nav aria-label="Articles pagination">` (pager)
- [ ] `<footer role="contentinfo">` (or implicit via `<footer>`)
- [ ] Filter chip group with `aria-label="Filter articles by category"`

**Tab order (verify by Tab through page from URL bar):**
1. Skip-to-main link (if present)
2. Header brand
3. Header nav (Services → Contact, in DOM order)
4. Call today CTA
5. Breadcrumb Home
6. Chip row All → Automated Testing → Cypress → Talks → Open source
7. Card title links #1–6
8. Pager 2 → Next
9. Footer column links in DOM order
- [ ] No tab traps; no `tabindex > 0`; aria-hidden elements not focusable.

**Image alt audit (per image, not aggregate):**
- [ ] Card 1 (Version 1.0 ATK) — alt text non-empty, descriptive.
- [ ] Card 2 (Introducing ATK) — alt text non-empty, descriptive.
- [ ] Card 3 (Cypress Cheat Sheet) — alt text non-empty, descriptive.
- [ ] Card 6 (Open source) — alt text non-empty, descriptive.
- [ ] Brand mark in header has alt or `aria-label`.

**WCAG 2.2 AA audit table:**
| Check | Pass criterion | Result | Notes |
|---|---|---|---|
| 1.4.3 Contrast (minimum) | Body ≥ 4.5:1, large ≥ 3:1 | | Per-token table above |
| 1.4.4 Resize text | 200% zoom no loss | | |
| 1.4.10 Reflow | No horizontal scroll at 320px | | |
| 1.4.11 Non-text contrast | UI/icons ≥ 3:1 | | Chip border, card border |
| 1.4.12 Text spacing | LH 1.5×, paragraph 2×, etc. | | |
| 2.1.1 Keyboard | All interactive reachable | | |
| 2.4.3 Focus order | Logical | | Per tab-order list |
| 2.4.7 Focus visible | Ring on every focusable | | Chip, card, pager |
| 2.5.5/2.5.8 Target size | ≥ 44×44 CSS px on mobile | | |
| 3.1.1 Language | `<html lang="en">` | | |
| 3.2.1 On focus | No context change on focus | | |
| 3.3.2 Labels | Form has labels | | Filter group has aria-label |
| 4.1.2 Name/Role/Value | Exposed to AT | | aria-current on pager, aria-label on group |

**Forced-colors mode:**
- [ ] Simulate `forced-colors: active`. Verify chips/cards/pager remain identifiable. Active chip uses `Highlight`/`HighlightText` system colors when overridden.

**Reduced-motion:**
- [ ] Simulate `prefers-reduced-motion: reduce`. Card hover lift transition is suppressed; color transitions allowed.

**200% zoom:**
- [ ] Browser zoom 200%, viewport 1280×800. No clipping, no horizontal scroll, no overlapping. All text readable.

**Cache + query-param spot checks:**
- [ ] Cold-cache `/articles?category=cypress` returns filtered set on first request.
- [ ] Pager from filtered URL preserves `category` param (verify in HTML, then click).
- [ ] BigPipe / Dynamic Page Cache do not leak between filtered and unfiltered URLs.

**Static preview comparison verdict:**
- [ ] Each section above either MATCH or DELTA-with-description recorded in handoff-S. No "looks fine" — every row is explicit.

### S verdict gate
PASS → O commits Phases 2–4 together (or per phase if commits were already deferred) and proceeds to Phase 6.
REWORK → O files rework issue against the failing phase. Re-enter that phase's pipeline at F.

---

## Phase 6 — Activation + cleanup

**Pipeline:** `O → F → T → O` (no visual delta from Phase 5 — this is plumbing)
**Branch:** `aa/pl-articles-phase-6-activation`

### Objective
Final cleanup: prune stale aliases, confirm cache behavior, ship.

### Acceptance criteria
- [x] `/articles-2` alias confirmed as stale (pointed to /page/12 = node 12 "We all benefit from Open Source", not the View route). Deleted alias ID 308 on 2026-05-05.
- [x] Page cache: page_cache module enabled, max_age=900. DDEV uses NullBackend (development.services.yml), so X-Drupal-Cache always shows MISS locally. Structurally correct; HIT behavior expected in production. Verified 2026-05-05.
- [x] BigPipe / dynamic page cache do not break the chip filter — `/articles?category=cypress` returns the filtered listing on a cold cache. Verified 2026-05-05.
- [ ] All `aa/pl-articles-phase-*` branches merged or closed.
- [ ] Handoff files for Phases 1–5 deleted from `docs/pl2/handoffs/`.
- [x] Static preview at `Previews/articles.html` annotated with implementation comment (2026-05-05).

---

## Pipeline summary

| Phase | Title | Pipeline | Branch | Has visual? |
|---|---|---|---|---|
| 1 | Categories | O→F→T→O | `aa/pl-articles-phase-1-categories` | No |
| 2 | `article-card` SDC | O→F→T→S→O | `aa/pl-articles-phase-2-card` | Yes |
| 3 | View config + Twig | O→F→T→S→O | `aa/pl-articles-phase-3-view` | Yes |
| 4 | Page title band | O→F→T→S→O | `aa/pl-articles-phase-4-page-title` | Yes |
| 5 | Cross-section + WCAG | O→T→S→O | `aa/pl-articles-phase-5-audit` | Audit |
| 6 | Activation | O→F→T→O | `aa/pl-articles-phase-6-activation` | No |

**Total cycles:** 6.

---

## Out of scope (deferred)

- **Renaming `/articles` to `/insights`** — flagged in [`phase-2-page-plan.md`](phase-2-page-plan.md). When that decision lands, the View's path config and the chip-row link `href`s update; no other change needed. Do not preempt.
- **Article detail page (`/articles/[slug]`)** — separate workstream, partially shipped:
  - **Phase 1 (shipped 2026-05-06, branch `aa/pl-article-detail-phase-1`):** masthead + body prose styling via `libraries-extend` against `neonbyte:header-article` and `neonbyte/article-full`. CSS-only; no Twig overrides. Static reference: `Previews/article-introducing-layout-builder-kit-beta-1.html`. F-T-S pipeline ran with one rework cycle (raw rgba shadow → hairline border per design brief §Elevation).
  - **Phase 2 (TODO):** end-of-article CTA block. Requires `node--article--full.html.twig` override in `performant_labs_20260502/templates/content/` to inject the CTA region after `{{ content }}`. Open scoping decision before kicking off F: (A) one generic CTA across all articles, (B) per-article CTA via a new node field, or (C) variant CTA by category taxonomy term. Recommended: A. See `post-homepage-next.md §2.7`.
- **Author bylines, related-articles slot, tag clouds, RSS feed customization** — none of these are in the static preview. If the brief is updated to require them, file a follow-on plan.
- **Saved-search / multi-category filtering** — current preview is single-category radio behavior. Multi-select would require Phase 3 to use option (2) (form-with-buttons).
- **Article images for the 2 text-only entries** — design intent is to keep them text-only on cream surface (operator decision, 2026-05-05). Do not generate placeholder imagery.

---

## Known traps

1. **Drupal exposed-form caching.** `category=cypress` URLs must vary by query string. If F sees stale cache hits across categories, check `views.view.articles` cache plugin (should be `tag` or `none` for testing, not `time`).
2. **Image migration.** The 4 image-card thumbnails are migrated assets. If their `alt` text is empty in the source, the `field_image` on the node will inherit that. Phase 5 catches this; fix at the field level, not in Twig.
3. **Pager and exposed filter interactions.** The pager must preserve the active `category` query param. Drupal's default pager Twig handles this, but custom pager Twig may drop it — verify with `curl '/articles?category=automated-testing&page=1'`.
4. **Two `<h1>` risk.** The View's row format defaults to including the node title as a heading. Disable that in the teaser display so only the SDC's `<h3>` renders inside cards.
5. **Chip "All" state.** Detection is "no `category` query param", not "all chips active". If F reads from the request once and caches it across renders, the wrong chip lights up on filtered pages.

---

## Definition of done

- [ ] Phases 1–6 all checked.
- [ ] `/articles` in production matches `Previews/articles.html` on desktop and mobile.
- [ ] WCAG 2.2 AA clean per Phase 5 audit.
- [ ] No regressions on `/articles/<slug>` detail pages, `/services`, `/how-we-do-it`, or homepage (verified via spot-check curl + screenshot).
- [ ] No open `aa/pl-articles-*` branches.
- [x] Static preview annotated with the implementation date (2026-05-05).
