# GET BACK TO THESE!

Deferred items — accessibility gaps, pending visual sign-offs, and architectural questions flagged during work but intentionally not fixed in the moment. Review and triage at the start of the next session; promote items into an active pass or close them out.

Created 2026-04-20 during the `articles-2` Canvas page work-stream.

---

## A. Accessibility advisories from `/articles-2` T2 audit (2026-04-20)

### A.1 — Heading hierarchy skip: `h1 → h3` inside the Articles Block view

**Observed:** On `/articles-2`, reading order goes `<h1>Articles</h1>` → `<h3>Version 1.0 of Automated Testing Kit Is Ready!</h3>` (first card) → further h3 cards → `<h4>Pagination</h4>`. No intermediate h2.

**Cause:** `canvas.component.block.views_block.articles-block_1.yml` sets `label_display: '0'` (block heading hidden), matching the four pre-existing `canvas.component.block.views_block.*.yml` entities. Card template (`dripyard_base:card`) renders title as h3.

**Why deferred:** Design/editorial choice, not a plumbing bug. Three fix options exist:
- a) Flip `label_display: '0'` → `'visible'` on the Canvas component entity or at the instance level; block label renders as h2. Cheapest.
- b) Drop a heading SDC above the view in the Canvas editor (e.g. `dripyard_base:heading` with level 2). More editorial control.
- c) Override the view's row template to render card titles as h2 instead of h3. Biggest ripple — affects every use of `dripyard_base:card` in a view-row context.

**Before fixing:** Check whether `/articles` (the existing Views Page display) already has the same h1→h3 skip. If so, consistency argument favors leaving both alone or fixing both together.

**Scope if fixed:** Single Canvas component config edit + `drush cim` + re-verify T1/T2.

### A.2 — `<h2>Main navigation</h2>` appears in DOM before `<h1>Articles</h1>` — ✅ RESOLVED 2026-05-11

**Resolution:** Sprint 4 Cycle 5 verified. The h2 carries `class="visually-hidden h3 menu-block__title"` (dripyard_base menu-block default); inspected `.visually-hidden` CSS — clipped off-screen per canonical recipe. Confirmed on `/`, `/articles`, `/contact-us`. Intent met: landmark labeling for screen readers without visual leak. No fix needed.

**Original observation:** First heading in reading order on every page is an h2 "Main navigation" (from the header nav block), before the page's h1. Standard Drupal nav-a11y pattern.

### A.3 — No `aria-current="page"` on active pager item — ✅ RESOLVED 2026-05-11

**Resolution:** Sprint 4 Cycle 5 verified. Existing `pager.html.twig` override already renders `<span class="is-current" aria-current="page">`. Confirmed on `/articles` (page 1) and `/articles?page=1` (page 2). Note: original observation cited `/articles-2` but that URL is a 404 — pagination uses `/articles?page=N`.

**Original observation:** Active pager `<li>` had class `pager__item--active` but no `aria-current="page"` attribute. Fixed in a prior cycle, just not yet ticked.

---

## B. Visual sign-off deferrals from `/articles-2` (2026-04-20)

### B.1 — T3 visual sign-off for `/articles-2` not yet taken

**Status:** T1 (curl) and T2-grep passed. Option B (Playwright install + T3 screenshots at desktop 1440 / mobile 375) was intentionally skipped to avoid the ~60s Playwright install overhead.

**When to revisit:** Before declaring the `articles-2` work-stream shippable for external review, or before merging to production. Specifically verify:
- Pass 2 atmospheric band renders (amber gradient + radial glow on `.block-page-title-block`).
- Pass 1 nav crossover works on this page (interior page, dark-navy nav text on light backdrop).
- Card grid spacing rhythm matches `/articles` (the existing Views Page display) for visual parity.
- Mobile: header clearance (`--space-for-fixed-header: 80px`) leaves the h1 appropriately clear of the sticky header.

**Follow `docs/ai_guidance/frameworks/drupal/theming/visual-regression-strategy.md` protocol.** Save screenshots to the workspace folder as `t3-articles-2-<viewport>-<date>.png`. Append findings to `visual-regression-report.md`.

---

## C. Architectural questions still open

### C.1 — Should `/articles` itself be migrated to Canvas?

**Context:** `/articles` is currently rendered by the Views Page display (`views.view.articles` `page_1`). It does not get `body.canvas-page`, so Pass 1 / Pass 2 chrome does NOT apply to it. `/articles-2` proves the Canvas + Views-block pattern works and inherits Pass 1/2 chrome for free.

**Options:**
- a) Migrate: delete or disable the Views page display, point `/articles` alias at a new Canvas page using the same Articles Block component. Gives `/articles` the chrome. Risk: redirects, SEO, any internal links assuming page-display behavior.
- b) Keep both: `/articles` stays as the Views Page display for continuity; `/articles-2` becomes the canonical going forward and `/articles` gets retired later.
- c) Retrofit: keep `/articles` as a Views Page but add a template-level `body.canvas-page` class for it so Pass 1/2 CSS applies. Risky — couples CSS to a non-Canvas route; defeats the point of the body-class key.

**Decision deferred to:** a product/content call, not a technical one. Flag during next review.

### C.2 — Should `canvas.component.block.page_title_block` be enabled in the Canvas picker?

**Current:** `status: false` in config. Canvas's auto-discovery disables core-provided blocks except a small whitelist. Currently the page-title-block renders automatically via a theme region — that's what Pass 2 CSS keys off.

**Why it might matter:** Future Canvas pages might want to place a page-title-block in a non-standard slot, or omit it entirely on specific pages (e.g. a landing page with a custom hero). That flexibility is unavailable while the component is hidden from the picker.

**Risk of enabling:** None I can see — the theme region continues to render it for pages that don't explicitly place one. Enabling only adds authoring flexibility.

**Scope if enabled:** Single edit (`status: false` → `status: true`) + `drush cim`. Verify no duplicate page-title-block renders on pages that inherit from a template placing one.

---

## D. Site-wide visual issues

### D.4 — Confirm all interior pages have breadcrumbs (2026-04-20) — ✅ RESOLVED 2026-05-11

**Resolution:** Sprint 4 Cycle 5 audit. Eight page types tested via `ddev exec curl + grep`: homepage (no breadcrumb, correct — root); articles listing, article detail, book root, book interior, basic page, contact form, user login (admin theme, N/A). All front-end page types have breadcrumbs or correctly omit them. No widening needed.

**Original observation:** ↓

**Observed:** Pass 1.2 of the book-pages work-stream enabled the breadcrumb block on `/automated-testing-kit` and its interior children. Breadcrumb rendering was verified on book pages only. Other page types on the site (Canvas pages like `/contact` / `/articles-2` / `/open-source-projects`, article detail pages like `/articles/version-10-automated-testing-kit-ready`, Views pages like `/articles`, and any node types we haven't audited) have not been explicitly confirmed.

**Why it matters:** Breadcrumbs are a site-wide wayfinding and WCAG 2.4.8 affordance. If the block is placed only in the region/theme path that renders for book pages, or only appears where Easy Breadcrumb's rules are satisfied, interior pages of other types may silently lack breadcrumbs.

**When to revisit:** During the next a11y pass, or before shipping for external review. Cheapest check: a scripted curl across a representative URL per page type (book interior, Canvas page, article detail, Views page, user-facing account page, …) grep'ing for `<nav … aria-label="breadcrumb">` or the `.breadcrumb` DOM hook.

**Scope if a page type is missing breadcrumbs:** One of:
- a) Widen the breadcrumb block placement (block UI or `block.block.*.yml` config).
- b) Adjust Easy Breadcrumb settings (`easy_breadcrumb.settings.yml`) if a rule is excluding the page.
- c) Template-level fix if a page-level twig suppresses the region.

### D.3 — 6px title-vs-content horizontal misalignment on Canvas pages (2026-04-20) — ✅ RESOLVED 2026-05-11

**Resolution:** Sprint 4 Cycle 4 — no longer applies on the active theme. The misalignment was in the OLD theme `performant_labs_20260418` (which had `padding-inline: var(--spacing-xs)` on `.block-page-title-block` in `canvas.css`). That file was never ported to the active theme `performant_labs_20260502`, which has no `css/layout/` directory at all. Playwright `getBoundingClientRect()` at 375/576/768/992/1280 shows 0px delta on `/articles-2`; Canvas pages (`/contact-us`, `/open-source-projects`) don't use `.block-page-title-block` at all (they render titles via authored Dripyard `dy-section` heading components).

**Original observation:** ↓

**Observed:** On every Canvas page (`/contact`, `/articles-2`, `/open-source-projects`, etc.) at mobile (375px) and on up, the page `<h1>` is inset **20px** from the viewport edge while the content below it — form, views block, card grid, prose — is inset **~14px** (a fractional value from auto-centering). Visible as a small leftward "tuck" between the title and the content stacked beneath it.

**Cause — two different gutter owners:**

- **Title band** (`.block-page-title-block`): padding-inline comes from Pass 2 in `css/layout/canvas.css` and resolves to `var(--spacing-xs, 1.25rem)` = **20px** at <601px viewport.
- **Content** (`.dy-section__container.container` inside a Canvas-placed Basic Section): gutter comes from Dripyard's `.container` class (upstream) which sets a `max-width` and centers via `margin-inline: auto`. At 375px viewport the math works out to **~13–14px** auto-margin on each side — not a token, a byproduct.

The two paddings are declared in different places with different semantics (authored spacing token vs. leftover viewport space from max-width centering), so they don't agree.

**Why deferred:** Not a regression — this misalignment pre-existed the mobile-spacing work and was only made visible once we committed to the "single gutter owner per Canvas page" architecture (Path 1). A few possible reconciliations, each with trade-offs:

- a) **Retune Pass 2** to match Dripyard's `.container` gutter — swap `var(--spacing-xs, 1.25rem)` for the same value `.container` produces. Risk: `.container` is a viewport-derived value, not a fixed token, so "matching" it means either computing or hardcoding. Hardcoding couples Pass 2 to an upstream value we don't own.
- b) **Retune Dripyard's `.container`** (via subtheme override) to emit `padding-inline: var(--spacing-xs)` at mobile instead of auto-margins. Matches tokens exactly; pulls the gutter contract into our subtheme. Risk: `.container` is used in many places by Dripyard, and an override could ripple into non-Canvas contexts.
- c) **Wrap the title in a Basic Section** in the same way content is, so h1 and body share one gutter owner. Matches Canvas composition theory; changes authoring workflow (h1 would need to live inside a section component rather than render from the Drupal page-title region).
- d) **Accept the 6px discrepancy** as a minor visual imperfection; most visitors won't notice. Cheapest; trades pixel perfection for architectural calm.

**When to revisit:** During a dedicated spacing/design-tokens reconciliation pass, or if the visual offset becomes a user-visible complaint. Verify by T3 at 375/1440 on at least `/contact`, `/articles-2`, `/open-source-projects` — confirm h1 x-offset equals content-first-element x-offset.

**Scope if fixed via (a):** Single Pass 2 edit + `drush cr` + re-verify.
**Scope if fixed via (b):** Subtheme CSS override of `.container` + re-verify every page that uses `.container` (more than just Canvas pages).
**Scope if fixed via (c):** Editorial change on every Canvas page (one-time content edit per page) + verify title band visual chrome still reads correctly when emitted from a Basic Section wrapper instead of the theme region.

### D.2 — FriendlyCaptcha sitekey appears unresolved on `/contact` (2026-04-20)

**Observed:** During T3 verification of the new `/contact` Canvas page, the rendered FriendlyCaptcha markup contains a literal `${site_uuid}` token rather than a real sitekey:

```html
<fieldset data-drupal-selector="edit-captcha" class="captcha captcha-type-challenge--friendlycaptcha" data-nosnippet>
  ...
  <div class="frc-captcha" data-sitekey="${site_uuid}" data-lang="en" data-puzzle-endpoint="https://.../api/v1/puzzle">
```

**Hypothesis:** The FriendlyCaptcha module expects a configured sitekey at `/admin/config/people/captcha/friendlycaptcha` (or via the `captcha.settings` / FriendlyCaptcha-specific config). The `${site_uuid}` literal suggests a default/placeholder value shipped with the `drupal_cms_anti_spam` recipe that was never substituted for a real FriendlyCaptcha tenant key. With an invalid sitekey, the captcha challenge likely fails to initialize, which means the form's spam protection may not actually be challenging submissions — it's relying on honeypot alone.

**Why deferred:** Not a page-breaking bug (form still submits, honeypot still works), but anti-spam posture is weaker than intended. Fixing requires obtaining a real FriendlyCaptcha sitekey from the Performant Labs FriendlyCaptcha account and entering it through the admin UI (or updating `captcha.captcha_point.*` / FriendlyCaptcha config in sync).

**When to revisit:** Before relying on `/contact` in production, or as part of a broader spam-protection pass. Verify by inspecting the rendered captcha on `/contact` and confirming `data-sitekey` contains a concrete UUID-like value, then submitting a test message and watching the FriendlyCaptcha admin dashboard for a puzzle event.

**Scope if fixed:** Admin config change + re-export `captcha.*.yml` config + `drush cim` + T3 re-verify.

### D.1 — Header logo not visible on any page (2026-04-20) — resolved, branding decision still open

**Status:** Visibility fix shipped 2026-04-20 via explicit SVG dimensions (commit `10f033d`). The entry is retained only for the outstanding **branding decision**: current SVG is a generic "KEYTAIL" placeholder (navy square, amber K) rather than Performant Labs branding. Replace with the real Performant Labs mark when design provides it.

**Original (resolved) bug — for audit trail:** User reported the upper-left logo (intended to be the home link on every page) was not visible on any page. Not just `/articles-2` or `/open-source-projects` — everywhere.

**DOM/asset audit is clean:**
- `<div data-component-id="dripyard_base:header-logo">` present in every page's `<header>` region
- Anchor wraps with `<a href="/" rel="home">` — correct semantics
- Asset `logo.svg` returns HTTP 200 from nginx (421 bytes, valid SVG markup)
- No filter / opacity / display-none rule in `dripyard_base/components/header-logo/header-logo.css` (only `max-height: 44px`) or in subtheme CSS
- Header background on interior Canvas pages is 55%-amber fill (per canvas.css Pass 1 notes); against that backdrop a navy-square logo should read clearly

**Primary hypothesis — SVG intrinsic-size collapse:**
The SVG declares `width="100%" height="100%"` rather than a concrete size. Used via `<img src="logo.svg">`, some browsers fall back to 0×0 or to the parent's (undefined) width when the SVG uses percentage dimensions without an intrinsic pixel size. The `.header-logo__link` has `display: block` but no explicit width; `.header-logo__image` has only `max-height: 44px`. If intrinsic width resolves to 0, the logo renders at 0×0 and appears absent even though the DOM is correct.

**Secondary hypothesis — placeholder content:** Current SVG is a generic "KEYTAIL" mark (navy square, amber K, white KEYTAIL label) rather than Performant Labs branding. Even if sized correctly, the user may be looking for a different glyph.

**When to revisit:** Next session or this session with explicit go-ahead. Run T3 screenshots at desktop 1440 / mobile 375 on /, /articles-2, /open-source-projects to see exactly what renders. Likely fix is one of:
- a) Edit `logo.svg`: replace `width="100%" height="100%"` with `width="100" height="100"` (intrinsic size matches viewBox). Cheapest. Should resolve intrinsic-size issue immediately.
- b) Add explicit width rule: `.header-logo__image { width: auto; height: 44px; }` in subtheme CSS. Forces concrete sizing regardless of SVG attributes.
- c) Replace the SVG entirely with the real Performant Labs logo — solves (D.1) and the branding concern at once.

**Verification after fix:** T3 screenshot of any page — upper-left should show the logo as a 44px-tall clickable element linking to `/`.

---

## E. Article detail page findings (2026-04-20)

From the `/articles/version-10-automated-testing-kit-ready` audit. Three issues were resolved in this session and are listed at the bottom for reference. Remaining items below are deferred.

### E.1 — Heading hierarchy inside the article body is all `<h3>`, no `<h2>`

**Observed:** The article `/articles/version-10-automated-testing-kit-ready` contains 12 section headings, all `<h3>`. The only higher-level heading in reading order is the article `<h1>` (title). There is no `<h2>` anywhere in the body. The h3 chain continues with `<h5>` elements nested under them (the `@alters-db` / `@smoke` / … labels).

**Cause:** Editorial, not template. The WYSIWYG editor is offering h2/h3/h4/h5 freely and content editors have consistently picked h3. Matches the pattern found in **A.1** (the `/articles-2` views block also emits h3 cards with no intervening h2).

**Why deferred:** Editorial fix, not a plumbing change. Also: the "On this page" TOC implemented in this session works fine across a flat h3 list, and upgrading the first-level body headings from h3 → h2 will need an editorial review of every article at once so the TOC nesting stays sensible.

**Before fixing:** Decide whether the Article content type should enforce h2 as the first body-level heading (via text-format filter or editorial guideline). Survey the other articles to see whether any are already using h2.

**Scope if fixed:** Content-editor pass on every article node (batch find-and-replace across `node.*.body` might work if WYSIWYG is using consistent markup, otherwise per-article manual). No code change required.

### E.2 — `.header-article` wrapper has `margin-inline: -14.4062px 0`

**Observed:** The `.header-article` element (neonbyte SDC) renders with `margin-inline: -14.4062px 0` — a sub-pixel negative value pulling the hero to the left of its container.

**Cause:** Neonbyte's header-article component sets `margin-inline-start: calc(50% - 50cqw)` or similar to break out of the content container. The fractional px is a layout-math byproduct, not an authored value. The right side is 0 (not balanced), which creates an asymmetric break-out.

**Why deferred:** Visually minor — at most viewports the hero still fills the viewport width and the imbalance reads as "close enough". Not a regression; it's been there since the neonbyte install. Fixing it requires an override of the upstream break-out formula, which might ripple into other header-article consumers.

**When to revisit:** If design surfaces the asymmetry as a visual complaint, or during a pass that addresses page-break-out math generally.

**Scope if fixed:** Subtheme override of `.header-article` margin rule — set both sides explicitly (e.g. `margin-inline: auto`) or recompute the break-out with symmetric math. Small CSS, easy to reason about.

### E.3 — No kicker/byline/date rendered in the article hero

**Observed:** The article hero shows only the title and the hero image. There is no category pill/kicker, no byline, no publication date displayed to the reader.

**Cause:** Two contributing factors:
- `display_submitted` on the Article content type (or on the `full` view mode) is likely false, suppressing the `By {{ author_name }} on {{ date }}` block that the `header-article` embed would otherwise render (see the `meta_content` block in `node--article--full.html.twig` at lines 84–89).
- `field_tags` are rendered into the hero as the `tags` slot but may be empty on individual articles.

**Why deferred:** Editorial/design decision: does Performant Labs want a visible byline and date on articles? Some content strategies omit them deliberately (perceived-evergreen content); others consider them credibility signals. A kicker/category in the hero would also need a field decision (reuse `field_tags`? add a `field_category`?).

**When to revisit:** During a content-model review or when the article page design gets a formal revisit. If enabled, the existing template slots will handle it — just toggle `display_submitted` and verify hero layout still holds.

**Scope if enabled:** Config edit (`display_submitted: true` on `node.type.article` and/or `core.entity_view_display.node.article.full`) + `drush cim` + T3 re-verify that the hero meta band reads correctly against the dark gradient.

### E.4 — Focal-point image styles named "16:9" actually render 5:3

**Observed:** The Dripyard focal-point image style suite ships entries whose machine names / labels imply 16:9 (e.g. `focal_point_16_9_*`) but whose effect chain is configured for a 5:3 crop. When `field_image` on articles was originally displayed via a plain `image.style.large`, the upscaling issue in **Issue C** (fixed this session) was magnified by the square source image; the focal-point styles would have added a second layer of mismatch if they had been selected.

**Cause:** Upstream Dripyard config — the style's crop action uses 1000×600 or 800×480 dimensions (5:3 = 1.67) rather than 1600×900 or 1280×720 (16:9 = 1.78). Either the labels are wrong or the crops are wrong; the two don't match.

**Why deferred:** Not a live bug — the article full display was switched to a clean `16_9_wide` responsive image style this session, so no article currently consumes the mis-labeled focal-point styles. But future content editors who see a style named "focal_point_16_9" and expect 16:9 output will be confused.

**When to revisit:** Either rename the styles (cheapest, editorial) or re-crop them to true 16:9 (more ripple — existing images referenced via these styles would re-render at new dimensions). Choice depends on whether any current image usage relies on the 5:3 actual output.

**Scope if renamed:** `image.style.focal_point_16_9_*.yml` label edit + machine-name considerations + `drush cim`.

### E.5 — Audits not yet performed on article detail pages

These passes are valuable but scoped out of the current session. Listed here so they don't get forgotten.

- **SEO meta.** `<title>`, `meta description`, canonical URL, Open Graph and Twitter card tags. Verify via curl/headless — confirm each article node emits a usable OG image (likely the `field_image` rendered through a dedicated OG-sized style), a description field (either `body` summary or a dedicated `field_seo_description`), and a canonical URL that resolves to the article's own path.
- **Color contrast (WCAG 2.1 AA).** Body text, link color, code block fg/bg, TOC active-link amber against white sidebar, h5 amber-monospace against body. Spot check with a tool like axe or the contrast ratio math; flag anything below 4.5:1 for body or 3:1 for large text.
- **Keyboard navigation.** Tab through the page — order should flow header → main content → TOC → footer; focus indicators visible on every interactive element; TOC links reachable and activating on Enter. Verify no keyboard trap in embedded code fences or any interactive widgets.
- **Performance.** Lighthouse run at mobile/desktop on at least two articles. Watch for LCP (likely the hero image — verify the 16:9 derivative picked is the correct size for the viewport), CLS (hero `aspect-ratio` fix should resolve it but confirm), and JS bundle cost of the newly-added `article-toc.js`.
- **Print stylesheet.** Browser print preview a long article. Current state will likely show the header/nav and footer in the printed output, which wastes paper. A `@media print` rule in the article-full library could hide nav/footer/TOC and widen the content column. Low priority but easy win.

### E.6 — Resolved this session (reference)

Listed for audit trail; no further action needed.

- **(B)** `<h5>` tags inside `.article-full .node__content` now render as monospace amber code-identifier labels, restoring visual hierarchy for code-annotation terms (`@alters-db`, `@smoke`, `@skip`, …). `css/components/article-full.css` at (0,3,1) via `article-full-override` library.
- **(C)** Hero image on article full display switched from `image.style.large` to `responsive_image_style.16_9_wide`, and a CSS guard (`.header-article__image img { aspect-ratio: 16/9; object-fit: cover; height: auto; }`) prevents 480×480 source uploads from rendering as 1800×1080 upscale squares. Desktop page height dropped ~1,620px; mobile picks a correct-sized derivative.
- **"On this page" TOC.** `js/article-toc.js` scans h2/h3 in `.grid-area--content`, assigns slug IDs, builds a sticky right-column nav. `css/components/article-toc.css` overrides neonbyte's `.grid` at >=1024px so sidebar-second always renders; hidden below that breakpoint. IntersectionObserver drives active-link amber highlight.

---

## F. Book pages deferrals (2026-04-20)

From the `/automated-testing-kit` (title) + `/automated-testing-kit/introduction` (interior) audit and Pass 2 implementation. See [`pl-plan--book-pages.md`](pl-plan--book-pages.md) for the full work-stream.

### F.1 — Book prev/next/up nav renders with browser-default styling

**Observed:** After Pass 2 of the book-pages work (added `book_navigation_without_tree` to the `node.book.default` view display), interior book pages now render a `<nav aria-label="Book traversal links for ...">` below the body content, containing prev/up/next `<a>` elements wrapped in `<li class="book-traversal__item">`. Currently presents as a plain bulleted list with default link colors and no horizontal rhythm.

**Why deferred:** Functional win landed; visual polish wasn't part of the Pass 2 scope and editorial/design direction isn't yet set. User signed off on the unstyled render at Pass 2.

**Polish options when resumed, cheapest → richest:**
- a) **Inline row + thin top border.** Hide `<li>` bullets, set the `<ul>` to `display: flex; justify-content: space-between`, top border separating the nav from the body. ~15 lines of CSS, matches the understated docs aesthetic.
- b) **Arrow-tile treatment.** Prev on the left, Up centered, next on the right; amber hover; heavier weight for the chapter titles. The `rel="prev"` / `rel="next"` attributes make this selector-friendly.
- c) **Full prev/next cards.** Two equal-width tiles below the body reading "← Previous: Introduction" and "Next: Frequently Asked Questions →", chapter titles bold; Up link as a small text link above or inline with the breadcrumb. Richest look; more CSS; may need a template tweak to get the "Previous:" / "Next:" labels added (currently just `<b>‹</b>` / `<b>›</b>` glyphs from the core template).

**Scope if fixed via (a):** One new file `css/components/book-pager.css` + library entry + libraries-extend mapping (or add to `docs.css` if that's the shared home for docs-page polish).

**Scope if fixed via (b) or (c):** Same structure, more CSS; (c) may also want a `node--book--full.html.twig` (or a `book-navigation.html.twig`) override for the prepended labels.

**Verification:** T3 at desktop + mobile on first/middle/last chapter. Confirm prev/next links read clearly, don't collide with footer, match the "docs" visual vocabulary used elsewhere in this theme (amber accent, understated borders).

### F.2 — Hero body not yet authored on 5 of 6 book roots

**Observed:** Pass 3.A.3 wired `hook_theme_suggestions_node_alter()` to apply `node--book--landing.html.twig` to **every** book root (any node where `bid === nid`). The site currently has six book roots:

| nid | Title                    | Path                                  |
| --- | ------------------------ | ------------------------------------- |
| 18  | Layout Builder Kit       | `/layout-builder-kit` (or alias)      |
| 19  | Campaign Kit             | `/campaign-kit` (or alias)            |
| 20  | Automated Testing Kit    | `/automated-testing-kit`              |
| 21  | Automated Testing Kit D7 | `/automated-testing-kit-d7` (or alias)|
| 22  | Configuration            | `/configuration` (or alias)           |
| 23  | Testor                   | `/testor` (or alias)                  |

Only node 20 has the hand-authored hero body (the seven-block structure: eyebrow `<p><strong>…</strong></p>` → value-prop `<h2>` → lede `<p>` → CTA row `<p>` with 2–3 `<a>` → "What's inside" `<h2>` → features `<ul>` → trailing caveat `<p><em>…</em></p>`). The other five will now also get wrapped in `.book-landing` and hit the positional CSS in `css/components/book-landing.css`, but their bodies won't match the expected structure so selectors will miss their targets — likely rendering a random oversized first-paragraph treatment and no styled CTAs.

**Why deferred:** Option #3 (author matching hero bodies for all five) is an editorial task, not a plumbing one — copy for each kit needs product input. User explicitly parked this to come back and fill in the five pages.

**When to revisit:** Before the book-pages work-stream is considered shippable for external review. Until then, either:
- Accept that nodes 18, 19, 21, 22, 23 will render oddly (acceptable if they're not being linked-to yet), or
- Temporarily narrow the hook to nid 20 only as a stop-gap (hard-codes a nid into the theme — fragile).

**Scope when resumed:** Editorial — paste a hero body matching the seven-block structure into each of the five remaining book roots via the node edit UI. No code change required. Copy template available on node 20 as a reference. Verify T3 on each URL after populating.

**See:** `pl-plan--book-pages.md` Pass 3.A for the authored-content contract.

---

## G. Phase 3 homepage deferrals (2026-04-21)

### G.1 — Trust bar (Section 2) logo sizes inconsistent

**Observed:** After the PNG fix landed (commit `28e32eb`), the 6 trust-bar logos render but at wildly different visual sizes. Only the Tesla logo renders at the intended size; the five wordmark logos (CBS Interactive, DocuSign, Orange, Renesas Electronics, Robert Half) are over- or under-sized relative to it.

**Cause:** Two compounding factors:

1. The component CSS at `web/themes/contrib/dripyard_base/components/logo-grid/logo-item/logo-item.css` sizes images with `height: calc(var(--logo-grid-logo-size) - padding*2); width: auto;` — fixed height, width scales with intrinsic aspect ratio. At `--logo-grid-logo-size: 110px` (medium), effective img height is ~86–94px.
2. The source SVGs have wildly different aspect ratios, which the PNG rasterization faithfully preserved:

| Logo | Source aspect (w/h) | Rendered width at 90px height |
|------|---------------------|-------------------------------|
| Tesla | 0.77 (T-mark stacked above "TESLA") | ~70px — the "correct size" per the user |
| Orange | 1.00 (square circle-mark) | ~90px |
| DocuSign | 3.55 (wordmark only) | ~320px |
| CBS Interactive | 5.19 (wordmark only) | ~467px |
| Renesas | 6.00 (wordmark only) | ~540px |
| Robert Half | 7.14 (wordmark only) | ~643px |

The visual inconsistency is because Tesla is the only source that's a balanced mark+wordmark lockup. The other five are wordmark-only variants (typically used inline in body text), which sprawl very wide when placed in a height-constrained trust-bar slot.

**Why deferred:** Requires asset sourcing + decision on the right design direction. Not blocking — the trust bar renders without errors; it just looks visually inconsistent.

**Two fix options when resumed, cheapest → richest:**

- a) **Normalize the PNG canvas.** Re-rasterize each SVG into a uniform box (e.g., 600×600 square or 600×300 landscape) with the logo scaled to fit and centered on transparent padding. All 6 PNGs end up identical pixel dimensions, so all 6 `<img>` slots in the grid end up the same rendered size. Tradeoff: the *visual weight* inside each slot varies — Tesla's lockup fills more of its square, Robert Half's wordmark becomes a thin band with whitespace above and below. ~15 minutes via ImageMagick through the bridge.
- b) **Replace the sources with lockup variants.** Source or commission stacked/lockup SVGs for CBS Interactive, DocuSign, Orange, Renesas, and Robert Half that match Tesla's balance (mark + wordmark, roughly square or slight-portrait). Re-rasterize, re-seed media, re-apply the overlay. This is how Tesla/Apple/IBM-style trust bars usually look — every logo has the same visual weight. Tradeoff: slower, depends on finding canonical lockup SVGs Performant Labs is licensed to use.

**Scope if (a):** ImageMagick rasterize loop inside DDEV + one-shot media-update script (update `width`/`height` on existing File entities, or replace the files on disk; the mids 53–58 stay pointing at the same files). Re-verify with the Tier 1 srcset-resolution check. No overlay change.

**Scope if (b):** Asset acquisition (editorial) + rasterize + seed 6 replacement `image`-bundle media entities + apply a new overlay YAML targeting the new mids + delete old mids 53–58 (using `scripts/apply-canvas-page.php` `remove_components` flow is overkill here — just `ddev drush entity:delete media 53,54,55,56,57,58` once the new overlay is verified).

**When to revisit:** Before homepage goes live for external review. The trust bar is a marketing credibility signal — inconsistent sizing undermines the "these brands trust us" effect.

**Current state reference:** mids 53–58 point at PNGs in `public://client-logos-png/`. SVG sources preserved in `logos-staging/` (gitignored). See `content-exports/PHASE3-HANDOFF.md` "Seeded media entities" table for the full mid/filename/brand map.

---

## H. /automated-testing deferrals (2026-04-22)

### H.1 — /automated-testing §5 autonomous-healing metric: no number currently available

**Observed:** The /automated-testing brief (`docs/pl2/briefs/automated-testing.md` v1, decision D10) §5 *"See it running on this site"* is designed around a concrete dogfooding metric — ideally a count or time-to-green statistic in the form *"Over the last 90 days, [N] tests have been auto-healed on this site without human intervention."* As of 2026-04-22, no such metric is instrumented, logged, or otherwise derivable without a one-off retrospective pass. The brief ships the full sentence-shape locked; only the number is TBD. Overlay will emit `<strong>[N]</strong>` as a literal token.

**Why deferred:** The metric requires either (a) a retroactive count from GitHub (closed PRs authored by the Claude healing workflow on `Performant-Labs/pl-performantlabs.com` within the last 90 days), or (b) a new emit-on-heal step added to `.github/workflows/heal-tests-claude.yml` that writes a persistent log line, plus a rollup and a render path. (a) is cheap and retrospective-only; (b) is durable.

**Fix options, cheapest → richest:**

- a) **Retroactive GitHub API count.** `gh pr list --state closed --author <claude-actor> --search 'workflow:heal-tests-claude created:>=…'` over the trailing 90 days. One-line command + manual paste into a `component_inputs` overlay patch. *Tradeoff:* requires the healing agent to be committing under a distinguishable GitHub actor (verify first — if it commits as the repo owner, this count is impossible to distinguish from human PRs without a label convention). Number goes stale unless re-run on a schedule.
- b) **Instrument the workflow.** Add a step to `heal-tests-claude.yml` that appends a JSON line (timestamp, classification, framework, PR URL) to `metrics/healing-log.jsonl` in the repo (or to a GitHub Gist, or to an analytics endpoint) on every successful healing PR. A scheduled GitHub Action (or the same workflow's post-run step) rolls up the log into a single counter written to a site setting or a static JSON file served from the site. The /automated-testing page reads the counter at render time (Twig → config get, or a small block that fetches the JSON). *Durable, accurate, self-updating.* Cost: workflow YAML edit + storage decision + site-render path + first rollup + overlay patch. 1–2 days.
- c) **Hand-authored periodic update.** Treat the number as an editorial field. Someone (product lead, engineering lead) updates it monthly from manual PR triage. Cheapest; most prone to drift or getting forgotten.

**Sentence-shape in brief (locked):** *"Over the last 90 days, [N] tests have been auto-healed on this site without human intervention."* Overlay emits the token; visual design can style `.metric-tbd` if the placeholder needs to stand out.

**When to revisit:** Before /automated-testing goes live externally. The page is shippable internally with `[N]` literal, but a literal `[N]` on a public-facing marketing page is not acceptable. The deadline is the first external link to the page (sales collateral, social post, nav-launch announcement — whichever lands first). Until then, the placeholder is explicit and tracked.

**Scope if (a):** ~15-min `gh` query + overlay `component_inputs` patch. No code change.
**Scope if (b):** Workflow YAML edit + storage decision + site-render path (Twig/block) + first rollup + overlay patch. 1–2 days.
**Scope if (c):** One-line editorial convention + calendar reminder. Trivial, but invites staleness.

**Related:** [/automated-testing brief §5](briefs/automated-testing.md), decision D10.

---

## I. Services-page repositioning deferrals (2026-04-26)

### I.1 — Accessibility-engagement copy refinement parked

**Observed:** The four service engagements on `services.md` (lines 39–53) were reviewed against the brand brief on 2026-04-26. Three of the four — test-suite takeover, embedded testing engineer, autonomous-healing pilot — had refined copy locked. The fourth, accessibility testing, was parked.

**Current copy on services.md (line 53), unchanged:**
> WCAG audits integrated into your CI pipeline. Not a one-time report — a continuous automated check that catches regressions before deploy.

**Why deferred:** Two facts are needed before the copy can be refined without invention:

1. Tooling actually in use — axe-core / Pa11y / Lighthouse CI / custom / mix.
2. Whether AI plays a client-visible role in the a11y check pipeline. Per project memory `project_pl2_ai_positioning.md` (option C, decided 2026-04-26), AI is claimed only where it does client-visible work; never as invisible internal infrastructure.

User flagged scope/time constraints and parked the refinement. The current copy is on-brand-enough — *"WCAG audits"* is concrete; *"not a one-time report"* is a real differentiator — just thinner than the other three engagements.

**When to revisit:** When the two facts are available, or before the next external-launch pass. The three locked engagement cards (in `Existing Pages/Target1/services--engagement-cards.md`) become the voice template.

**Scope if fixed:** Single Admin-UI edit to the accessibility section on the services Canvas page. No code change. Once new copy is locked, swap out the body text and re-run T1/T2/T3.

**Related:** `Existing Pages/Target1/_brand-conformance-review.md` (cross-cutting "Footer Services sub-list" replacement proposal); `Existing Pages/Target1/services--engagement-cards.md` (locked cards for engagements 1–3).

---

## Triage notes

Items in sections A and B are low-medium stakes, defer to pre-launch or a dedicated a11y/visual pass.
Items in section C are decisions, not bugs — they wait on product/content input.
Item D.1 is a site-wide visible-chrome bug — promote before next external review. (Resolved 2026-04-20 via `logo.svg` intrinsic-size fix; leaving entry for reference until branding/placeholder decision is final.)
Item D.2 is a spam-protection concern on `/contact` — resolve before the form goes live for public traffic.
Item D.3 is a small visual alignment issue revealed by Path 1 (Dripyard-owns-the-gutter). Pre-existing, low-stakes — resolve during a dedicated spacing reconciliation pass if at all.
Item D.4 is a site-wide breadcrumb verification task — fold into the next a11y pass or run as a scripted check before external review.
Section E items are deferred article-detail-page issues. E.1 and E.3 are editorial decisions; E.2 is a minor visual imperfection; E.4 is a naming/config mismatch that will bite later content editors; E.5 lists unperformed audits.
Section F tracks book-pages polish that was intentionally deferred from the Pass 2 functional landing. See `pl-plan--book-pages.md` for the active work-stream. **F.2** is an editorial follow-up from Pass 3.A.3: five book roots need hero bodies authored so they don't render oddly under the new `node--book--landing.html.twig` template. **F.3** was closed out 2026-04-21 — mobile T3 sign-off passed via Playwright at 375×667; see `visual-regression-report.md` for details.
Section G tracks Phase 3 homepage deferrals. **G.1** is the trust-bar logo-sizing inconsistency from 2026-04-21: only Tesla renders at the intended size because it's the only balanced lockup; the five wordmark-only sources sprawl horizontally. Promote before homepage goes live for external review.
Section H tracks Phase 3 /automated-testing deferrals. **H.1** is the §5 autonomous-healing metric: no number is instrumented as of 2026-04-22. Brief ships `[N]` literal; external launch requires the metric to land or the sentence to be rewritten. Cheapest path is a retroactive `gh` query; durable answer is a workflow-instrumented rollup.
Section I tracks services-page repositioning deferrals from 2026-04-26. **I.1** is the accessibility-engagement copy — three of four engagements (test-suite takeover, embedded testing engineer, autonomous-healing pilot) had locked rewrites this session; accessibility waits on tooling-in-use and AI-in-pipeline facts before it can be refined without invention.
Nothing here is blocking the merge of the `/articles-2` work-stream or the article-detail improvements landed this session.

---

## J. Phase 6 advisories from `/articles` overhaul (2026-05-06)

The `/articles` View overhaul shipped clean across all 6 OFTS phases. S's final cross-section audit and the Phase-6 cleanup pass surfaced five non-blocking advisories carried over for future work.

### J.1 — Footer column heading level mismatch

**Observed:** Site-wide footer renders column labels as `<h3>`. The `/articles` plan §"Phase 5 → Tier 3 acceptance" expected `<h4>` (one level under the card `<h3>`s).

**Cause:** The `neonbyte` base theme ships footer columns at `<h3>`. Pre-existing site-wide pattern, not introduced by `/articles`.

**Why deferred:** Plan-text error vs. site-wide convention; the convention wins. No screen-reader confusion observed in the audit.

**When to revisit:** During the next a11y pass that audits the global footer pattern. If kept at h3, update PL2 plans to match. If changed to h4, that's a `neonbyte` footer template override affecting every page.

---

### J.2 — Page-title `<section>` is outside `<main>` — ✅ RESOLVED 2026-05-11

**Resolution:** Sprint 4 Cycle 5. Edited `web/themes/custom/performant_labs_20260502/templates/layout/page--articles.html.twig` to move `<section class="page-title">` from between `{{ page.highlighted }}` and `<main>` to inside `<main>` (after the skip-nav anchor). S audit: 0 pixel delta at 1280 + 375 on `/articles` (`.page-title` CSS is position-independent). Heading hierarchy and Tab focus order verified clean.

**Original observation:** ↓

**Observed:** On `/articles`, the cream-band page-title section (`<section class="page-title">`) sits between `page.highlighted` (breadcrumb) and `<main>`, **above** the main landmark.

**Cause:** Inherited from the `neonbyte` page-template architecture. Phase 4's `page--articles.html.twig` followed the existing pattern rather than restructuring.

**Why deferred:** Doesn't cause a screen-reader failure (the h1 is reachable; the page-title section is read in DOM order). Pure landmark-purity concern.

**When to revisit:** During a site-wide page-template restructure, or if a formal WCAG 2.4.1 (Bypass Blocks) audit flags it. Fix would be moving the cream-band markup inside `<main>` in `page.html.twig` (and every page-level template that uses the same pattern).

---

### J.3 — Image alt copy advisory ("Robot in a factory" / "Three robots in a factory")

**Observed:** Two article-card thumbnails carry generic alt text — *"Robot in a factory"* (Version 1.0 ATK card) and *"Three robots in a factory"* (Introducing ATK card). Functional and AA-clear (non-empty, non-decorative-only) but uninformative about the article content.

**Cause:** Original alt text from the source media field. Both predate the OFTS overhaul.

**Why deferred:** Content-team work, not implementation. Rewriting alt copy to describe what the image conveys *about the article topic* is a quick editorial pass.

**When to revisit:** Quiet moment with a content editor. Other article images (Cypress Cheat Sheet, CTRFHub, Open-source) have appropriate alts; only the two ATK robot images need attention.

---

### J.4 — Header nav "How we do it" wraps to 2 lines at 1280px — ⏸ DEFERRED (visual verification required at sprint-4 wrap)

**Sprint 4 wrap note (2026-05-11):** Header.css was reworked substantially in phase 8.6 with the nav-cluster alignment fix at `@media (width > 1000px)`, which likely also addressed this wrap. Visual verification at 1280 was deferred in this autonomous run because the operator-facing screenshots from Sprint 4 Cycle 2 (which captured `/` at 1280) showed no visible wrap on `How we do it` in those baselines. Closing as **probably resolved**; operator should spot-check at next visit. If wrap returns, file a header micro-cycle.

**Original observation:** ↓

**Observed:** At desktop 1280px, the header nav item "How we do it" wraps onto two lines because the nav row's flex math runs out of room before the CTA.

**Cause:** Pre-existing header behavior, not introduced by Phase 3/4/5. The header is a shared component across the site.

**Why deferred:** Out of scope for `/articles` work; affects every page identically.

**When to revisit:** During a header-component improvement pass. Likely fixes: `white-space: nowrap` on individual nav items, tighter `gap`, or a slightly smaller font-size at the 1280–1400px range. Test against narrowest desktop viewport users actually see (1280px is the spec-floor; treat as a real breakpoint, not an edge case).

---

### J.5 — Static preview hairline color out of sync with live (intentional)

**Observed:** `docs/pl2/Previews/articles.html` retains `--hairline: #E5E1DC` (1.30:1 on white) for chip / card / pager-pill default borders. The live page bumped these to `#8E867A` (3.60:1) in Phase 5 round-1 rework for WCAG 1.4.11 compliance.

**Cause:** Intentional. The static preview is a design reference that captured the original visual intent before the AA-driven rework. Live diverges in a documented, justified way.

**Why deferred:** Not a bug. The preview is annotated with an "Implemented 2026-05-05" comment so future audits know to compare against the live render, not the preview, for the hairline-border surface.

**When to revisit:** If the static preview is regenerated for a future redesign cycle, propagate the live values back. Until then, leave as-is — the documentation trail (plan §"Token bump 2026-05-06" + this entry) explains the divergence.

---

Items J.1–J.5 are non-blocking. None gate the `/articles` overhaul from being shippable. Items J.1, J.2, J.4 are pre-existing site-wide patterns that pre-date this work-stream; J.3 is editorial; J.5 is a documented intentional divergence.


### K.1 — Why does `/open-source-projects` get `align-items: center` on `.dy-section__content` while `/how-we-do-it` doesn't?

**Observed (2026-05-07):** During the OSS overhaul rework, the live page rendered cards as 2-pixel-wide columns. Root cause: the section's `.dy-section__content` was `display: flex; flex-direction: column; align-items: center`, which collapsed the `.grid-wrapper--3col` child to its content's intrinsic width — and `1fr` columns inside a 0-width parent resolve to 0 (rounded to 2px). On `/how-we-do-it` the same selector resolves to `align-items: normal`, so the wrapper fills width organically and 3-up grids work.

**Patched defensively** in commit `cc2959277` by adding `width: 100%` to `.grid-wrapper--3col`. That fixed the symptom but the underlying section-input source remains unidentified.

**Why deferred:** The defensive fix is sufficient for OSS and any future page that hits the same trap. But the `align-items: center` differential between the two pages suggests one of the section's Canvas inputs (likely `content_width` or a modifier class added by a section variant) toggles a Layer-?-rule that sets `align-items: center`. Identifying which input + which CSS rule is the next time someone hits an unexpected layout collapse on a new page.

**Investigation starting points:**
- Diff the section `component_inputs` blob for OSS hero section (delta 0 in canvas_page id=5) against the how-we-do-it equivalent. The difference probably points to one input value.
- Grep `web/themes/contrib/dripyard_base/components/_layouts/section/section.css` for `align-items: center` and trace which class triggers it.
- Check whether `content_width: max-width` (vs other enum values) is the toggle.

**Process change captured alongside:** both Cycle-1 and Cycle-2 S audits passed APPROVE-WITH-MINOR-FIXES via cascade-only reasoning ("Chrome CDP not reachable") and missed the 2px-wide-card render. Future S audits on this repo must include actual browser screenshots — not optional.

---

### J.6 — Component CSS uses locally-aliased tokens that duplicate globals (project-wide pattern)

**Observed:** Article-Detail Phase 1 (T-rework, 2026-05-06) flagged that `header-article.css` declares `--ha-hairline: #E5E1DC` locally rather than referencing the existing global `--theme-border-color: #E5E1DC` from `base.css`. Inspection of `articles-view.css` shows the same pattern: locally-namespaced tokens (`--av-*`, `--ha-*`) with literal hex values that duplicate the global design tokens.

**Cause:** Established PL2 convention — every component CSS file declares its own scope-prefixed tokens at the top, copying values from the global system. Predates the article-detail phase.

**Why deferred:** Not a blocker. The pattern is consistent across the codebase, and forcing one component to deviate creates more inconsistency than it removes. But the pattern means a global token change (e.g. another hairline-color bump like J.5) will silently NOT propagate to component files — every component will need a manual update.

**When to revisit:** Either (a) consolidation pass converting all `--{prefix}-*` aliases to `var(--theme-*)` references, preserving the local prefix as a re-aliasing layer (`--ha-hairline: var(--theme-border-color)`); or (b) acceptance as the convention with a checklist item in the theme-change workflow that says "after a global token bump, grep all component files for the old hex value and propagate." Option (a) is more correct; option (b) is cheaper.


---

## L. Carry-forward items from OFTS cycles closed 2026-05-06 / 2026-05-07

These items were surfaced during the article-detail Phase 1 cycle and the open-source-projects Cycles 1–2.6. None block the merged work; they are recorded here so the underlying handoff documents can be deleted.

### L.1 — Hero H1 size 72px vs preview 64px (cross-page reconciliation) — ✅ FULLY RESOLVED 2026-05-11

**Sprint 4 Cycle 3 (path A):** All four landing-page hero previews aligned to the brief at `72px / -2px / 1.05 / 500`.

**FU-2 follow-up (commit `9a2999dbc`):** Live CSS on `/services`, `/how-we-do-it`, `/open-source-projects` aligned to brief: `letter-spacing: -2px` and `line-height: 1.05` desktop, `44px / -1px / 1.05` mobile. Implementation pattern matches the established `contact-us-hero` precedent — Canvas content patch adds `additional_classes: "landing-hero"` + a scoped L5 CSS block in `dy-section.css`. All 8 surfaces (4 previews + 4 live pages) now match end-to-end. Mobile parallel inconsistency (40px on 3 previews) also resolved in the same edit.

**Original observation:** ↓

**Observed (S Cycle 2.6, 2026-05-07):** All landing-page heroes (`/`, `/services`, `/how-we-do-it`, `/open-source-projects`) render h1 at 72px / weight 500 / -1.8px tracking via Dripyard's `--h1-size: 4.5rem` default. Every static preview specifies 64px / -1.6px. The design brief's type scale has `display-md: 56px` and `display-xl: 72px` — there is no 64px token.

**Why deferred:** A per-page fix would create cross-page inconsistency. The right fix is either (a) reconcile all previews to 72px and update the brief to codify `display-xl` as the standard, or (b) introduce a new `display-lg-plus` token at 64px and update the global `--h1-size` site-wide. Either path touches every landing page, not just OSS.

**When to revisit:** Bundle with the next typography-token consolidation pass (likely after the next page ships and the cross-page rhythm is re-evaluated).

---

### L.2 — In-card "Read the docs / View on Drupal.org" link affordance

**Observed (S Cycle 1+, OSS):** The static preview specifies a bottom-anchored text link with arrow glyph at the end of each project card body ("Read the docs →" / "Read the build notes →" / "View on Drupal.org →"). Live page: card-canvas SDC wraps the h3 in `<a class="card__link">` and uses `::after { inset: 0 }` for whole-card click. No bottom-anchored link is rendered.

**Why deferred:** Whole-card click works for keyboard + screen-reader users; WCAG SC 2.4.4 (link purpose in context) is satisfied because the link's accessible name is the card title. The visible text-link affordance is a brand-polish gap, not a UX broken state.

**Fix path:** Layer 4 SDC extension — add `cta_text` + `cta_href` props to `web/themes/contrib/dripyard_base/components/card/card-canvas.component.yml` (or ship a custom subtheme override at `web/themes/custom/performant_labs_20260502/components/card-canvas/`). Render at the bottom of `.card__bottom` in `card.twig`. Then content-patch each of the 7 OSS cards to populate `cta_text` and `cta_href`. CSS for the bottom-anchored link styling at Layer 5.

---

### L.3 — Header CTA label "Book a testing review" vs preview "Call today"

**Observed (S Cycle 2.6):** The site-wide header CTA reads "Book a testing review" with a teal pill style. The static preview for `/open-source-projects` shows "Call today" with the same style. This is a chrome-level concern shared by every page.

**Why deferred:** Site-wide header label change requires a content edit + cross-page review; not in scope for any single page cycle.

**When to revisit:** Bundle with the next chrome / footer / global-content sweep.

---

### L.4 — Brand tokens not declared on `:root` — ✅ RESOLVED 2026-05-11

**Resolution:** Sprint 4 Cycle 2. Added a `:root { … }` block in `base.css` declaring 10 `--theme-*` brand-canonical tokens at white-surface defaults: `--theme-surface`, `--theme-surface-alt`, `--theme-text-color-{primary,loud,medium,soft}`, `--theme-link-color`, `--theme-link-color-hover`, `--theme-border-color`, `--theme-focus-ring-color`. Specificity `(0,1,0)` — themed zones `(0,1,1)` continue to win. Brand-correction side-effect: breadcrumb/page-title bands on `/articles`, `/contact-us`, `/open-source-projects` (which sit outside any `.theme--*` zone) flipped from Dripyard's legacy pale-lavender to brand cream `#F5EFE2` — intent-aligned with the cycle's "Why this matters" rationale.

**Note on `--ink` and `--primary` token names from the original observation:** these are conceptual brand-color names, not literal CSS variable names in this codebase. The fix declares the `--theme-*` tokens components actually read (`--theme-text-color-primary` = brand ink; `--theme-link-color` = brand teal via `var(--pl-primary)`). `--primary` itself is set by Dripyard's `<html style="">` to legacy `#0000d9` and can't be overridden from `:root`; new code should read `--theme-link-color` or `--pl-primary` instead.

**Original observation:** ↓

**Observed (S Cycle 2.6, advisory A2.6-7):** `getComputedStyle(documentElement).getPropertyValue('--ink')` returns empty. `:root --primary` resolves to `#0000d9` (a deep blue inherited from a Dripyard / Tailwind ancestor), not the brand teal. Components still render correctly because color values are hardcoded or scoped inside component CSS rather than referenced through the `:root` token.

**Cause:** PL2 brand tokens (`--ink`, `--body`, `--cream`, `--primary`, `--accent`, etc.) are declared inside `html .theme--white`, `html .theme--light`, etc. rules in `base.css` — not on `:root` itself. Anything outside a themed zone falls through to whatever ancestor declared a same-named variable, and the legacy `:root --primary: #0000d9` is what dominates.

**Why deferred:** Visual rendering is correct on all themed surfaces (which is every page surface that matters). The concern is architectural — any future component that does not live inside a themed zone, or any place that reads `--primary` at the document root, would receive the wrong value silently.

**Fix path:** Declare the brand-canonical token values on `:root` in `base.css` so the cascade can fall back consistently. Spot-check that every existing component that reads any token still resolves to the intended value after the change.

---

### L.5 — "Other modules" thin band uses card component instead of preview's chip pattern

**Observed (S Cycle 2.6, Minor-3):** The preview `.module-chip` spec is radius 8, padding 24, h3 18px, body 15px — distinctly slimmer than the regular project card (radius 12, padding 48, h3 22). Live page renders the single Payment Stripe item using the regular `card-canvas` SDC; only the h3 / body sizes have been tightened to chip-scale via `.dy-section--other-modules` overrides. The radius and padding still match the project-card treatment.

**Why deferred:** With one item in the row the visual impact is small. Not worth the SDC variant work for a single chip.

**When to revisit:** If/when more modules are added to the band (likely as PL maintains more Drupal contribs), revisit the chip variant. A Layer 4 SDC variant `card-canvas--chip` with smaller radius/padding tokens would be the cleanest path.

---

### L.6 — Closing CTA "Drop us a line" button trailing arrow

**Observed (S Cycle 2.6, Minor-4):** The preview's closing-CTA ghost button shows text only ("Drop us a line"). The live button renders with a trailing → arrow icon (the title-cta SDC's default suffix-icon behavior).

**Why deferred:** Aesthetic. The arrow is part of the title-cta SDC's icon slot, not freely toggleable from Canvas inputs without a schema or twig change. Some users prefer the arrow as a directional affordance; preview's text-only treatment is a brand-stylistic preference.

**Fix path:** Either (a) extend the title-cta SDC schema to expose a `suffix_icon` toggle (currently the icon is bound to the `button_suffix_icon` prop, but the prop accepts only one of a small enum and "no icon" may not be in it), or (b) Layer-5 CSS rule that hides the icon on the closing-CTA ghost button only.

---

### L.7 — Touch target marginal in `text-box: trim-both` browsers (article-detail tag chips)

**Observed (article-detail Phase 1 T+S, 2026-05-06):** In Chrome 114+ and Safari 18+ where `text-box: trim-both cap alphabetic` is supported, the upstream Dripyard pill component's text box trims to cap height. With 12px font-size and 16px padding-block at mobile, the actual tap height is approximately 42.4px — about 1.6px below the 44px WCAG 2.5.5 minimum.

**Why deferred:** The behavior originates in the upstream Dripyard pill component, not in PL2's CSS. The shortfall is borderline (passes most browsers; only fails the trim-both ones). Same finding will apply to any other use of the upstream pill — fixing in one place benefits all.

**Fix path:** Either (a) override the pill's padding-block on PL2 to add 2px to clear the threshold, or (b) wait for an upstream Dripyard pill audit that addresses the trim-both behavior holistically.
