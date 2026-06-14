# `/automated-testing-kit` Book Pages Overhaul — Runbook

> **Parent:** [`pl-plan.md`](pl-plan.md)
> **Workflow:** [`workflow-ofts.md`](workflow-ofts.md) (O-F-T-S 4-agent pipeline)
> **Visual references:** [`Previews/automated-testing-kit.html`](Previews/automated-testing-kit.html) (title page, written 2026-05-08, operator-approved) and [`Previews/automated-testing-kit-introduction.html`](Previews/automated-testing-kit-introduction.html) (interior page, written 2026-05-08, operator-approved)
> **Live (current state):** title page `https://pl-performantlabs.com.3.ddev.site:8493/automated-testing-kit` ; interior `https://pl-performantlabs.com.3.ddev.site:8493/automated-testing-kit/introduction`

---

## Status

| Item | State |
|---|---|
| Active theme | `performant_labs_20260502` (verified `drush cget system.theme default`). Has no book CSS today — none of the prior `_20260418` Pass 3.A theme files (template override, `book-landing.css`) carried forward to the active theme. |
| Page entity | **Book hierarchy.** Root: `node 20` "Automated Testing Kit" (alias `/automated-testing-kit`). 19 child chapters at depth 2 (one nested grandchild — "Tests (FedRAMP)" — under nid 37 "Tests"). All children resolve via `book.bid = 20`. |
| Page type | `node--type-book` (full view mode). NOT a Canvas page. Implementation lives in fields + theme overrides + a custom SDC, not a Canvas component tree. |
| Surviving prior work | Three things shipped against `_20260418` survive as data: (a) `display_submitted: false` on the `book` content type; (b) breadcrumb block enabled (`block.block.performant_labs_20260418_breadcrumbs.yml` — but the active theme uses `..._20260502_breadcrumbs.yml`, so re-verify); (c) `book_navigation_without_tree` extra-field on `node.book.default` view display (renders the bottom prev/up/next nav). The body field on nid 20 holds editor-pasted hero markup that survived `content_format`'s `<div>`+`class=` strip. |
| Strategy | **Theme rebuild + new SDC + one new field.** No URL changes. Book hierarchy stays as-is. Add `field_chapter_summary` (text plain) to `book` content type. New SDC `chapter-index` queries `book.manager` and renders the children. Theme override `node--book--landing.html.twig` for the book root only; existing `node--book--full.html.twig` (or stock fallback) for interior pages. |
| Branch | `aa/pl-atk` (single branch, ~2 commits, single `--no-ff` merge to local `main` at end). Per memory `project_local_only_main.md`: local-only, no push, no PR. |
| GitHub issues | Skipped — issue bodies live as `docs/pl2/handoffs/cycle-N-atk-issue.md` (mirrors `pl-contact-us` precedent). |
| **Status** | ✅ Cycle 1 complete (`24b5c5dfd`, 2026-05-08). ✅ Cycle 2 complete (`0d5752955`, 2026-05-09) — passed operator gate after 3 OFTS rework rounds (T blockers on `.book-pager` wrapper + hero seam + mobile `<details>` open; S REWORK on docs-grid stacking; round-3 S REWORK surfaced by the new Playwright + ImageMagick visual-diff protocol on a latent chapter-grid cascade collision that prior audits had missed). |

---

## Architecture discoveries (2026-05-08)

### Discovery 1 — Active theme has no book CSS

The previous-cycle plan (`_20260418` era) shipped four files for the title page hero (`hook_theme_suggestions_node_alter` in `.theme`, `node--book--landing.html.twig`, `book-landing.css`, library entry). None exist in the active theme `performant_labs_20260502`. The theme files were never carried forward when the operator forked `_20260418` → `_20260502`. So this cycle reimplements them from scratch — there is no backport pressure.

### Discovery 2 — Book hierarchy + body field state

T1 audit on `/automated-testing-kit` (2026-05-08):
- `<article class="node container node--type-book node--view-mode-full">` is the article wrapper.
- Body field renders the editor-pasted hero markup (the `<div class="book-landing-hero">` / BEM hooks were stripped by `content_format`'s `filter_html`; what survives is `<p><strong>Drupal Module</strong></p>` + `<h2>` value-prop + lede + 3 anchor links + `<h2>"What's inside"` + `<ul>` features + `<em>` parallel-libraries caveat).
- A separate block — `block-block-content4d857326-…` — renders below the body and contains the existing "Book a testing review" `<a class="button button--primary button--large">`. Block placement is presumably scoped to the book root only. F's Step-3 trace must confirm visibility conditions.
- The book-traversal nav (`<nav aria-label="Book traversal links for Automated Testing Kit">` with `<ul class="book-traversal__list">`) ships at the bottom of the node, currently with browser-default styling. This comes from `book_navigation_without_tree` on the view display (Pass 2 of the prior cycle).
- The breadcrumb block exists and renders with the `_20260502` theme suffix in the rendered HTML (`id="block-performant-labs-20260502-breadcrumbs"`). Either the breadcrumb block was re-created for the active theme on a prior phase, or this is an active-theme placement we haven't tracked. Either way: breadcrumb is live; no work needed there.
- The `block-book-navigation` (the left-sidebar TOC) appears in the rendered HTML but **without** any `.docs-sidebar` / `.docs-content` grid wrapper. The previous theme's grid layout did not carry forward. Interior pages currently stack the 19-link sidebar below the page-title and above the body, in a single column.

### Discovery 3 — Children query order

T-side check: `book.weight` orders the 19 children from `-50` (Introduction) to `-31` (Troubleshooting), with the title page at weight `0`. One grandchild ("Tests (FedRAMP)", nid 73) sits under nid 37 at depth 3. Cycle 1's chapter-index renders depth-2 only (the 19 first-level chapters). Grandchildren are out of scope for the index view (they remain accessible via the chapter sidebar on interior pages, which renders the full tree).

---

## Source-of-truth visual delta

**Title page (`/automated-testing-kit`)** — preview vs live, 2026-05-08:

1. **Hero band missing.** Preview specifies cream band with terracotta kicker "Drupal Module" → 56px h1 → 24px deck (the body's first `<h2>` becomes the deck) → lede → primary "Read the introduction" + secondary "Install" pill buttons. Live renders the same content but as plain prose, no band, no kicker treatment, no deck-vs-h1 hierarchy.
2. **"What's inside" features list is unstyled.** Preview promotes the body's `<ul>` to a 3-up grid of feature cards with terracotta letter marks, hairline borders, hover lift. Live renders a plain `<ul>` with disc bullets.
3. **Chapter index does not exist.** Preview adds a 19-chapter index in a 2-col card grid on `--surface-warm` band, each card with a 48px terracotta-tinted square holding the index number, chapter title, one-liner summary, and an amber `›` arrow. Live has nothing here — readers can only reach chapters via the sidebar TOC or the prev/next pager at the bottom.
4. **Closing-CTA copy is button-only.** Preview specifies a cream band with h2 "Want a second pair of eyes on your suite?" + paragraph + the "Book a testing review" button. Live ships only the button (the `block-block-content` carries no h2 or paragraph).
5. **Page-title-block + breadcrumb chrome match the preview** at the structural level. No work needed there in Cycle 1 beyond integrating the band styling.

**Interior pages (e.g. `/automated-testing-kit/introduction`)** — preview vs live, 2026-05-08:

6. **No docs grid.** Preview specifies a 260px sticky chapter sidebar + ~720px prose column at `≥992px`. Live renders the sidebar block and content stacked single-column with no grid wrapper.
7. **Sidebar has no active-item treatment.** Preview specifies left amber border + accent-deep text + 500 weight on the current page's `<a>` (which already carries `is-active` in the rendered DOM). Live has no CSS rule on `.is-active` in the active theme.
8. **Sidebar items have no chapter numbering.** Preview shows `01` / `02` / … via CSS `counter-increment` + `decimal-leading-zero`. Live shows just titles.
9. **Page header is too heavy.** Preview specifies a compact chapter header — small terracotta kicker "Chapter NN · Automated Testing Kit" + 40px h1 — flush on canvas, no cream band. Live inherits whatever the page-title-block + page chrome do today (the audit shows browser-default treatment, no kicker, no cream band — so live is closer to preview than the title page is, but still needs the kicker and the typography ramp).
10. **Prev/up/next pager renders as plain links.** Preview specifies three rounded tile cards: "Previous" + chapter title (left), "Up" pill (center), "Next chapter" + chapter title (right), with kicker labels and arrow-direction semantics. Live ships the `book_navigation_without_tree` default `<ul>`.
11. **Note callout is a flat paragraph.** Preview specifies a `.callout` pattern — cream band, terracotta left-rule, accent-deep "Note:" strong-text. Live renders the body's NOTE: paragraph as ordinary text.
12. **Mobile sidebar above content.** Preview at `<992px` collapses the sidebar into a `<details>` disclosure with the current chapter pre-filled in `<summary>`. Live (when the grid is gone) stacks the 19-link sidebar above the prose — readers scroll past the entire TOC before reaching the body.

Header, footer, and breadcrumb chrome on live already match the preview shell (shipped on prior pages). No work there beyond making sure the breadcrumb block is placed for `_20260502` (currently present in DOM — verify).

---

## Locked decisions

| ID | Decision | Source |
|---|---|---|
| R1 | **Branch + push policy.** Local-only. `aa/pl-atk` merges to local `main` with `--no-ff`. No push to `origin`. No PR. | memory `project_local_only_main.md` |
| R2 | **Active theme `performant_labs_20260502`.** All implementation lives there. Prior `_20260418` Pass 3.A files do not exist and are not backported — reimplement fresh. | this runbook §Architecture §Discovery 1 |
| R3 | **New SDC `chapter-index`.** Path: `web/themes/custom/performant_labs_20260502/components/chapter-index/`. Schema props: `chapters` (array of `{ url, title, summary, index }`), `book_title` (string, optional), `total` (int, optional). Self-sufficient — chapters auto-update when book pages are added/reordered/edited. | operator decision 2026-05-08 |
| R4 | **New field `field_chapter_summary`** on the `book` content type. Type: `string` (plain text), max 200 chars, single-value, optional, default empty. Form display: shown below body. View display: not rendered in `default` (the SDC pulls it via preprocess). Lives in `config/sync/field.field.node.book.field_chapter_summary.yml` + `config/sync/field.storage.node.field_chapter_summary.yml`. | operator decision 2026-05-08 |
| R5 | **Cycle 1 backfills the 19 chapter summaries** via a one-shot `drush php-eval` populator (`scripts/atk-populate-chapter-summaries.php`) using copy from the title-page preview's `.chapter-card__meta` strings. F-authored, run once, file kept under `scripts/` for repeatability. Operator can edit summaries via admin UI afterward — they are field data, not code. | preview file as canonical source |
| R6 | **Theme suggestion `node--book--landing`** added via `hook_theme_suggestions_node_alter` in `performant_labs_20260502.theme`. Triggers only when the rendered node is the book root: `node.book.bid === node.id()`. Interior chapters fall through to `node.html.twig` (or `node--book--full.html.twig` if Cycle 2 adds one). | OFTS workflow + prior `_20260418` Pass 3.A.3 |
| R7 | **Template override `node--book--landing.html.twig`** at `web/themes/custom/performant_labs_20260502/templates/content/`. Wraps `{{ content.body }}` in `<div class="book-landing">`, then renders `{% include 'performant_labs_20260502:chapter-index' with { ... } %}`, then `{{ content|without('body') }}` so the existing closing-CTA block, the book-traversal pager, and any other content children render in their normal positions. Attaches `book-landing` library via `{{ attach_library('performant_labs_20260502/book-landing') }}`. | preview structure |
| R8 | **Hero band styling uses positional CSS** against `.book-landing > .field--name-body > *:nth-of-type(N)` because `content_format`'s `filter_html` strips `<div>` + `class=` from authored body HTML. Documented inline in `book-landing.css`. Promote to a different format or dedicated fields if editorial drift bites — out of scope for Cycle 1. | T1 audit 2026-05-08 + prior `_20260418` Pass 3.A.3 lessons |
| R9 | **Closing-CTA block** — edit the existing `block-block-content` (uuid `4d857326-…` per Cycle-1 trace) to add the preview's h2 ("Want a second pair of eyes on your suite?") + paragraph + button. Block placement and visibility conditions stay untouched. Block content edit goes into `config/sync/block_content.block_content.<uuid>.yml`. | T1 audit 2026-05-08 |
| R10 | **Component vocabulary.** Existing components only — `dripyard_base:button`, `dripyard_base:heading`, `dripyard_base:text` for the closing-CTA block; new SDC `chapter-index` for the chapter index. No paragraph types, no Layout Builder. | sibling-page conventions |
| R11 | **No `!important`.** Stage files by explicit path (never `git add .`). All Canvas patches **preserve `component_version`** (do NOT set to NULL — Canvas throws `OutOfRangeException`; corrected 2026-05-12 per Sprint 10 cycle 2a). | OFTS workflow |
| R12 | **Mobile-first responsive.** Match preview rules: title-page feature grid `3→2→1` at `lg`/`md`, chapter grid `2→1` at `md`, chapter cards remain tappable (≥44px) at all viewports. Interior page docs grid collapses to single-column at `<992px` with sidebar in a `<details>` disclosure (Cycle 2). | preview mobile spec |
| R13 | **WCAG AA.** Body text ≥ 4.5:1, large text ≥ 3.0:1, focus ring ≥ 3:1, touch targets ≥ 44×44 CSS px. Per-cycle T runs numerical contrast checks on every backdrop change; S runs page-level audit. | OFTS workflow |
| R14 | **Cycle 1 ships nothing for interior pages.** Theme suggestion fires only on the book root. Interior pages keep stock rendering until Cycle 2. (S audits this in Cycle 1 as a no-regression check.) | scope guard |

---

## Cycle plan

Two cycles, one branch (`aa/pl-atk`), one commit per cycle. Approval Checkpoint between cycles.

### Cycle 1 — Title-page rebuild

**Pipeline:** O → F → T → S → O

**Objective:** Reshape `/automated-testing-kit` to match `Previews/automated-testing-kit.html` at desktop (1280px) AND mobile (375px). Adds the `chapter-index` SDC, the `field_chapter_summary` field + backfill, the `node--book--landing` theme suggestion + template, and the CSS for the hero band, features grid, chapter index, and closing-CTA. Closing-CTA block content is edited to add the preview's h2 + paragraph copy. Interior pages get **zero changes** — Cycle 2 owns them.

**Scope:**

1. **Field config.** Add `field_chapter_summary` to the `book` content type (R4). Two new yml files in `config/sync`. Configure form display so editors see the field below body. Configure view display: hidden by default (SDC consumes it via preprocess). Apply via `drush cim`.
2. **Backfill.** Run `scripts/atk-populate-chapter-summaries.php` (F-authored) via `ddev drush php-eval`. Populates all 19 chapter pages with the summary copy from the preview. Title page (nid 20) gets empty/null summary (it's the root — not in the index). Idempotent — script re-runs without error if values already present.
3. **SDC `chapter-index`.** New component at `web/themes/custom/performant_labs_20260502/components/chapter-index/`. Files: `chapter-index.component.yml` (schema with `chapters` array prop, `book_title` string, `total` int), `chapter-index.twig` (BEM markup matching preview: `.chapters` wrapper → `.chapters__heading` (h2 + total caption) → `.chapter-grid` → per-chapter `.chapter-card` with `__num` + `__body` (`__title` + `__meta`) + `__arrow`), `css/chapter-index.css` (card grid, hairlines, terracotta `--accent-wash` numbers, hover lift, mobile collapse).
4. **Preprocess hook.** Add `pl_book_get_children($bid)` helper or inline logic in `performant_labs_20260502_preprocess_node__book__landing(&$variables)` that calls `\Drupal::service('book.manager')->bookTreeAllData($bid)`, filters to depth 2 (immediate children), sorts by `weight`, and assembles the SDC's `chapters` array — each entry: `url` (alias path), `title`, `summary` (from `field_chapter_summary`, default `''`), `index` (zero-padded position, "01"–"19").
5. **Theme suggestion.** `hook_theme_suggestions_node_alter` in `performant_labs_20260502.theme` — adds `node__book__landing` only when `node.book.bid === node.id()`.
6. **Template override.** `templates/content/node--book--landing.html.twig` — wraps `{{ content.body }}` in `<div class="book-landing">`, emits the chapter-index SDC (after the body, before any other content children), then `{{ content|without('body') }}` so the closing-CTA block + book-traversal nav render in their natural slots. Attaches `book-landing` library.
7. **CSS — `book-landing.css`** at `css/components/book-landing.css`. Positional selectors against `.book-landing > .field--name-body > *:nth-of-type(N)` (per R8) for the hero band: cream background, kicker (`<p><strong>Drupal Module</strong>` becomes `.book-hero__kicker`), 56px h1 (page-title-block lives outside `.book-landing` — F decides whether to extend this rule out to `.page-title-block` or move the page title into the band; recommended path is to keep page-title-block as h1 and treat the body's first slab as the deck/lede/CTAs only). Then features grid styling (the body's `<h2>"What's inside"` + following `<ul>`), and the trailing italic caveat. Closing-CTA block gets cream-band styling (`.block-block-content...` selector — F's Step-3 trace finds the right hook).
8. **CSS — `chapter-index.css`** lives inside the SDC dir, registered as the SDC's CSS via the `.component.yml` `libraryOverrides` block.
9. **Library.** Register `performant_labs_20260502/book-landing` in the theme's `libraries.yml` — points at `css/components/book-landing.css`.
10. **Closing-CTA block edit.** Update `config/sync/block_content.block_content.<uuid>.yml` (uuid `4d857326-…`, F's Step-3 trace confirms exact uuid) to replace the button-only body with: `<h2>` "Want a second pair of eyes on your suite?" + `<p>` paragraph copy from preview + the existing button. Apply via `drush cim`. Block placement and visibility unchanged.
11. **Mobile responsive.** `book-landing.css` includes `<991px` (feature grid 3→2) and `<767px` (everything stacks 1, chapter cards single-column, hero typography drops). `chapter-index.css` collapses chapter grid 2→1 at `<767px`.
12. **No interior-page changes.** Theme suggestion's scope guard ensures only the root re-templates. Verify with a curl of `/automated-testing-kit/introduction` — DOM unchanged from pre-cycle baseline.

**Acceptance criteria:**

- [ ] `field_chapter_summary` exists on `book` content type per R4 (machine name, type `string`, max 200, optional, default empty); two yml files committed in `config/sync`
- [ ] All 19 chapter pages have non-empty `field_chapter_summary` after running the populator (verified via `drush sql:query`); operator may have edited values post-script — that is fine
- [ ] SDC `chapter-index` validates: `ddev drush sdc:validate` exits 0; `chapter-index.component.yml` schema documents all props; `chapter-index.twig` renders without errors
- [ ] Theme suggestion `node__book__landing` fires on `/automated-testing-kit` (T1: response HTML contains class `book-landing` on the body wrapper); does NOT fire on `/automated-testing-kit/introduction` or any interior page
- [ ] Title page T1: HTTP 200, response HTML contains all 19 chapter URLs inside `.chapter-card` elements, each with class `chapter-card__num`, chapter title, one-line summary
- [ ] Title page T2: single `<h1>` (page-title-block); heading hierarchy h1 → h2 (deck / "What's inside" / "Chapters" / closing-CTA) → no skips; ARIA landmarks `<header>`, `<main>`, `<footer>`, `<nav>` present; `<nav aria-label="…">` on the chapter index (or the SDC twig wraps it appropriately); chapter-card links keyboard-reachable
- [ ] Closing-CTA block now renders h2 "Want a second pair of eyes on your suite?" + paragraph + button (T1 grep)
- [ ] Cycle 1 makes **zero changes** to interior-page rendering — `curl /automated-testing-kit/introduction` DOM diff against pre-Cycle-1 baseline is empty (S confirms)
- [ ] WCAG: body text ≥ 4.5:1 against canvas + cream + surface-warm; primary-light button text ≥ 4.5:1; chapter-card title ≥ 4.5:1 against canvas; chapter-card meta ≥ 4.5:1 against canvas; terracotta number on accent-wash ≥ 4.5:1; focus rings ≥ 3:1; touch targets ≥ 44×44 on chapter-cards at 375px
- [ ] Mobile 375px: no page-level horizontal scroll; feature grid collapses to 1; chapter grid collapses to 1; hero typography drops per preview
- [ ] **Operator preview-fidelity gate** — operator walks `/automated-testing-kit` at 1280px AND 375px against `Previews/automated-testing-kit.html` and confirms no visible delta. **No commit without explicit "approved".**
- [ ] No `!important`; files staged by explicit path; no `git add .`

**Handoff doc location:** `docs/pl2/handoffs/cycle-1-atk-{F,T,S}.md`

**Commit message:** `feat(book): title-page rebuild — chapter-index SDC, field_chapter_summary, hero band, closing CTA`

---

### Cycle 2 — Interior-page rebuild

**Pipeline:** O → F → T → S → O

**Objective:** Reshape every `/automated-testing-kit/<chapter>` page to match `Previews/automated-testing-kit-introduction.html` at desktop (1280px) AND mobile (375px). Adds a `node--book--full` theme override (or extends the page template) for the docs-grid layout, sticky chapter sidebar, compact chapter header, prose typography ramp, prev/up/next tile pager, and the `<details>` mobile collapse.

**Scope (anticipated — refined post-Cycle-1):**

1. **Theme suggestion** — `node__book__full` for non-root book nodes (`node.book.bid !== node.id()`); fall through to default for the root.
2. **Template override** `node--book--full.html.twig` — emits the docs-grid wrapper around the existing sidebar block + content + pager.
3. **Sidebar styling** — `block-book-navigation` styled per preview (chapter numbering via CSS counter, active-item amber treatment, sticky positioning, hairline card chrome, mobile `<details>` disclosure).
4. **Compact chapter header** — kicker "Chapter NN · Automated Testing Kit" + h1; small inline preprocess that computes chapter number from book.weight position.
5. **Prose typography ramp** — `.docs-prose` rules matching `article-introducing-layout-builder-kit-beta-1.html` (h2 30px, h3 22px, h4 18px; inline links with `border-bottom` underline; `<ul>`/`<ol>` markers terracotta; blockquote left-rule; inline `<code>` + `<pre>` styling).
6. **Note callout** — auxiliary CSS rule for `.callout` so editors can opt-in via the rich-text editor's class prop (or a body-class autodetect that promotes paragraphs starting with "**Note:**" — F decides).
7. **Prev/up/next tile pager** — extend or override the `book_navigation_without_tree` markup so `<ul class="book-traversal__list">` + `<li class="book-traversal__item">` reach the preview's tile-card visual. Either via twig template override or a CSS-only restyle of the existing markup.
8. **Mobile responsive** — `<992px` collapses docs grid to 1-col with sidebar in `<details>`; `<768px` adjusts header padding, prose font, pager stacking.
9. **Operator preview-fidelity gate** — walk every interior chapter at 1280px AND 375px against the preview before commit.

**Acceptance criteria:** TBD — refined post-Cycle-1 from S's audit and any deltas surfaced during Cycle-1's interior no-regression check. Anticipated criteria parallel Cycle 1's structure: T1/T2 PASS, WCAG AA, mobile 375px no horizontal scroll, no regression on title page, operator preview-fidelity gate.

**Handoff doc location:** `docs/pl2/handoffs/cycle-2-atk-{F,T,S}.md`

**Commit message:** `feat(book): interior-page rebuild — docs grid, sidebar, compact header, tile pager`

---

## Approval Checkpoints

| After | Operator action |
|---|---|
| Cycle 1 commit | Operator reviews `/automated-testing-kit` live in browser at 1280px and 375px. Explicit "approved" required to open Cycle 2. |
| Cycle 2 commit | Operator reviews three interior pages live (Introduction, Running Tests, Troubleshooting — first/middle/last to cover prev-less + middle + next-less edge cases) at 1280px and 375px. Explicit "approved" required to merge `aa/pl-atk` to `main`. |

---

## Out of scope

- Editorial work inside chapter bodies (h2/h3 section breaks, restructuring prose) — surfaced as F9 in the prior `_20260418` audit. Belongs to a content-owner pass; not theme work.
- On-this-page TOC inside interior bodies (the article-detail `article-toc` pattern) — deferred until interior bodies have heading structure.
- A second book in the system — SDC is reusable but no second book exists today; cross-book navigation is out of scope.
- Repointing prod URLs — local-only sprint per R1.
- Search inside the book — no full-text search for book contents in this cycle.
- Versioning / release notes for the kit itself — separate work, lives in `/articles`.
- Migrating hero copy out of body field into dedicated content fields (`field_kicker`, `field_lede`, etc.) — positional CSS (R8) is the chosen tradeoff for Cycle 1; promote to fields if editorial drift bites.

---

## Rework loop

If S returns REWORK on any cycle:

1. O reads handoff-S, writes `docs/pl2/handoffs/cycle-N-atk-rework-issue.md` quoting S's findings
2. F reads the rework issue, fixes on the same branch, writes `cycle-N-atk-F-rework.md`
3. T re-runs verification on changed files only, writes `cycle-N-atk-T-rework.md`
4. S re-audits, writes `cycle-N-atk-S-rework.md`
5. If S returns PASS → O commits with the cycle's commit message + rework note
6. If S returns REWORK on round 2 → O pauses and consults operator about whether acceptance criteria need revision

---

## Cleanup

After each cycle's commit lands, O deletes that cycle's handoff files (`cycle-N-atk-*.md`). Per OFTS workflow Step 5: handoffs are ephemeral coordination artifacts.

After Cycle 2 commits and `aa/pl-atk` merges to `main` (local, `--no-ff`, no push), this runbook stays — it is permanent project documentation.

---

## Historical context — prior `_20260418` work

The previous theme generation shipped four passes against `_20260418` (documented in this file's prior revision, available via `git log -- docs/pl2/pl-plan--book-pages.md`). Of that work, three things are **still live** in `_20260502` because they are data, not code:

- `display_submitted: false` on the `book` content type (config-sync)
- `book_navigation_without_tree` extra-field on `node.book.default` view display (config-sync) — renders the bottom prev/up/next nav
- The body field on nid 20 (the editor-pasted hero markup) — content, not code

Theme files (`hook_theme_suggestions_node_alter`, `node--book--landing.html.twig`, `book-landing.css`, library entry) **do not exist** in `_20260502` — Cycle 1 reimplements them. The breadcrumb block status (Pass 1.2 of the old plan) is currently rendering on `/automated-testing-kit` per T1 audit but should be re-verified during Cycle 1 since it lives in a `_20260502`-suffixed config file.

---

## Change log

- 2026-05-08 — runbook rewritten for `_20260502` cycle. Prior `_20260418` plan archived in git history. Two cycles defined: Cycle 1 (title page) + Cycle 2 (interior pages). New SDC `chapter-index` and new field `field_chapter_summary` are the new pieces; the rest is theme + CSS.
- 2026-05-08 — Cycle 1 committed (`24b5c5dfd`). Three OFTS rework rounds: (1) S REWORK — hero band hidden behind the pre-existing `block-book-navigation` in `region-header-first` from Phase 7 (commit `7e0015a69`), unblocked via `body:has(.book-landing) .block-book-navigation { display: none }` (Cycle 2 will relocate the block to the docs-grid sidebar). (2) operator gate fail — "What's inside" features overlapping; fixed via `text-align: left` + `align-items: flex-start` + full-width white background with dynamic centering padding. (3) Round 2 PASS, operator approved.
- 2026-05-09 — Cycle 2 committed (`0d5752955`). Three OFTS rework rounds: (1) T blockers — missing `.book-pager` wrapper, hero seam still 80px white gap, mobile `<details>` rendered open. (2) S REWORK — docs-grid stacking due to neonbyte's `:where([class*="grid"]) > * { grid-column: 1/-1 }` cascade; fixed with explicit `grid-column: 1` / `grid-column: 2` on `.docs-sidebar` / `.docs-content`. (3) S REWORK — same cascade affecting `.chapter-grid` on the title page (latent Cycle-1 bug surfaced by the new Playwright + ImageMagick visual-diff protocol). One-line fix `.chapter-grid > .chapter-card { grid-column: auto }`. Block-book-navigation relocated out of `region-header-first` and disabled config-side; the temporary Cycle-1 hide rule was dropped. Hero white-seam closed via `body:has(.book-landing) .layout-container { background: cream }`. Pager kicker labels added via CSS `::before` selectors keyed on `rel`/`title` attributes. Note callouts auto-applied via `#post_render` hook.
