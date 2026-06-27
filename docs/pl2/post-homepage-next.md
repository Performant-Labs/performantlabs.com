# Post-Homepage Next — What Comes After the Phase 1–8 Ship

**Date:** 2026-05-03
**Branch shipped:** `aa/pl-homepage-phase-6-canvas`
**Merged to:** `main`

---

## 1. Status

The Performant Labs homepage overhaul is fully shipped. Theme `performant_labs_20260502` is the active default; Canvas page entity_id=20 (`/page/20`, alias `/homepage-v2`) is the live front page. The full O-F-T-S pipeline ran through Phases 0–8: scaffold, color foundation, mobile typography, bespoke `kicker` and `heal-flow` SDCs, nine component CSS overrides (Phases 4.1–4.9), Canvas assembly, cross-section verification, and activation. A post-activation Tier 3 vision audit (Spec Auditor / Opus 4.7) returned 19 findings (7 Critical, 8 Major, 4 Minor); all 15 must-fix items were resolved across 4 batches of F rework and landed as a single commit at end-of-Batch 4. Pa11y WCAG2AA on live `/` reports 0 errors. Approval Checkpoint 8 cleared; branch `aa/pl-homepage-phase-6-canvas` merged to `main` as a single PR.

---

## 2. Next up — recommended priorities

### 2.1 Start `pl-plan--pages.md` — triage the next page

Services, About, How We Do It, and Articles all share the homepage's component library. Most Phase 4 CSS overrides transfer unchanged; each page adds a small, bounded set of new components. Write `docs/pl2/pl-plan--pages.md` before opening any page-specific runbook — it sequences pages by value, identifies what new components each page requires, and prevents re-litigating the order every sprint. Services is the likely first candidate (highest commercial weight, relatively bounded layout). How We Do It is second — it reuses the heal-flow diagram pattern and the icon-list. Articles and About have the longest editorial-team dependency and can follow once the pattern is established.

### 2.2 Tech Debt #1 — fix header `theme--white` at the Drupal config source — ✅ RESOLVED 2026-05-03 (verified Sprint 4 Cycle 1, 2026-05-11)

**Resolution:** Commit `3a9569d22` ("fix(theme): move header theme prop from light to white at config source", 2026-05-03) landed the L1 config change (`header_settings.theme: light → white`) + removed the L5 CSS workaround. Sprint 4 Cycle 1 independently re-verified: header DOM renders `class="theme--white site-header"`; no `#FFFFFF` compensation rules remain in `header.css`; `drush cim` clean. Cycle closed as no-op.

**Original observation:** `header.css` forced `background-color: #FFFFFF` and `--theme-surface: #FFFFFF` on `.site-header` because the header block's Drupal theme prop was `theme--light`. The CSS patch held visually, but the wrong class on `<header>` meant downstream zone-resolved tokens resolved against `theme--light`. Fixed once at the Drupal config source; propagates site-wide.

### 2.3 Tech Debt #4 — resolve `heal-flow` SDC array-of-objects Canvas gap

The `heal-flow` SDC `steps` prop uses `array-of-objects`, which Canvas has no field-type mapping for. The diagram currently lives as inline SVG inside a `text` component. The SDC exists and is correct — the gap is the Canvas assembly layer. Resolving this unblocks templated reuse on other pages (Services, About likely need a process-flow diagram) without hand-crafting SVG markup into text blocks each time.

### 2.4 Performance tuning — after the second page ships

CSS bundling, font subsetting, and critical-CSS extraction are deferred. The reason: the homepage alone does not produce a stable budget baseline — adding Services will materially change the critical-path CSS. Run the performance audit after at least two pages are live so budgets reflect real-site usage.

### 2.5 Human WCAG 2.2 AA audit — separate specialist engagement

Pa11y passes at 0 errors and the O-F-T-S pipeline enforces contrast, structure, and keyboard navigation throughout. A specialist audit covers what automation misses: cognitive load, reading order, focus management in JS interactions, and screen-reader announcement quality. Schedule after the core page set (homepage + Services + About) is live.

### 2.6 Legacy theme cleanup — separate triage pass

Directories `web/themes/custom/performant_labs`, `performant_labs_20260411`, and `performant_labs_20260418` remain in the repo, none active. Run a triage pass: `20260418` is the revert reference (keep until the new theme is proven stable), the others are deletion candidates. Do not fold into a page-build sprint; it deserves a focused commit with a clear rationale.

### 2.7 Article-detail Phase 2 — end-of-article CTA block

**Status:** TODO (article-detail Phase 1 shipped 2026-05-06 as `aa/pl-article-detail-phase-1`; CTA was deferred from Phase 1 because it requires Twig template work, not just CSS).

**Scope.** Add a closing CTA block after `{{ content }}` on every `/articles/*` node-full render. The block is shown in the static preview at `docs/pl2/Previews/article-introducing-layout-builder-kit-beta-1.html` but does not currently render in production. Suggested copy (preview-derived, brand-aligned, no exclamation): one short headline + 1–2 sentences + two buttons routing to `/contact` and `/articles`.

**Implementation surface.**
- New Twig override: `web/themes/custom/performant_labs_20260502/templates/content/node--article--full.html.twig` (copy upstream from `web/themes/contrib/neonbyte/templates/content/node--article--full.html.twig`, append CTA region after the body content area). Consider extracting the CTA into a sub-template for cleanliness.
- CSS: extend the existing `performant_labs_20260502/article-full` library (or add a sibling `article-cta` library) with `.article-cta` rules. Phase 1 already established the `libraries-extend` wiring.

**Open scoping decision (resolve before writing the F brief).**
- **(A) One generic CTA across every article.** Simplest. Brand-voiced copy hard-coded in the Twig template. Routes to `/contact`. *Recommended: this is the right baseline given the existing 10 legacy articles.*
- **(B) Per-article CTA via a new field on article nodes.** Most flexible but adds authoring surface. Requires a config import (new `field_cta_*` field group) plus Twig wiring with fallback to generic.
- **(C) Variant CTA by category taxonomy term.** Middle ground — one CTA per category (Talks, Automated Testing, etc.). Less authoring overhead than B, more nuance than A.

**Pipeline.** Standard F → T → S, one cycle. Brief at `docs/pl2/handoffs/article-detail-phase-2-brief.md` (to be written by O when work opens).

**Out of scope (still).** Comments region, author bio block, related-articles slot. Phase 1 exclusions remain.

---

## 3. Tech debt — prioritized

Ordered by likely impact on future work. Original state-doc numbering is shown in parentheses; the priority order here supersedes it. Item wording is quoted verbatim from `docs/pl2/handoffs/homepage-overhaul-state.md`.

**Priority 1 (original #1) — Header theme workaround**
> "Header `theme--light` class is overridden by CSS in `css/components/header.css` (forces `background-color: #FFFFFF` and `--theme-surface: #FFFFFF` on `.site-header`) rather than fixed at the Drupal config source. CSS workaround works; the proper fix is to change the header block's theme prop in Drupal config so it ships as `theme--white`."

**Why now:** Every page uses the header. The wrong class on `<header>` means downstream zone-resolved tokens may silently resolve against `theme--light`. Every future F agent on every future page must read and trust a confusing Layer 5 patch compensating for a Layer 1 mis-config. Fix before Services page work opens.

**Resolved 2026-05-03 (Phase 1, commit `3a9569d`):** Header block's Drupal theme prop changed from `theme--light` to `theme--white` at the config source (`config/sync/performant_labs_20260502.settings.yml`). CSS workaround in `header.css` removed. Verified by Pa11y WCAG2AA 0 errors and S Tier 3 vision audit (zero visual regression).

---

**Priority 2 (original #4) — Heal-flow SDC Canvas gap**
> "`heal-flow` SDC schema uses an array-of-objects which Canvas has no field-type mapping for. The diagram is currently rendered as inline SVG inside a `text` component rather than as a configurable Canvas component. The SDC at `web/themes/custom/performant_labs_20260502/components/heal-flow/` is unused on this homepage but available for templated reuse on other pages."

**Why now:** Each new page that needs a process-flow diagram will otherwise require hand-crafted SVG in a text block — fragile and editorial-team-hostile. Fix before the second page that needs a diagram.

**Resolved 2026-05-03 (Phase 2, commit `eeda8f4`):** SDC `steps` prop restructured from `array<object>` to three parallel arrays (`step_numbers`, `step_labels`, `step_is_endpoints`) — Option 3 (schema restructure) was chosen because Canvas's `JsonSchemaType::computeStorablePropShape()` returns `NULL` for array-of-objects unless the object uses a `$ref` to a Canvas well-known shape. Heal-flow now ships as a real Canvas component; homepage placement swapped from the inline-SVG `dripyard_base:text` block via `scripts/replace-heal-flow-with-component.php`.

---

**Priority 3 (original #2) — Heal-flow CSS in `base.css`**
> "Heal-flow CSS lives in `css/base.css` rather than the SDC's own `components/heal-flow/heal-flow.css`. The component is placed via the `dripyard_base:text` Canvas component (raw HTML), so SDC-scoped CSS is not auto-loaded — the styles had to migrate to a global library."

**Why now:** Track with Priority 2 above. Once heal-flow becomes a proper Canvas component, move the CSS back to the SDC in the same commit. They are a single fix.

**Resolved 2026-05-03 (Phase 2, commit `eeda8f4`):** All `.heal-flow` rules migrated from `css/base.css` to `web/themes/custom/performant_labs_20260502/components/heal-flow/heal-flow.css`. SDC discovery auto-loads the CSS now that heal-flow is placed as a real Canvas component. `base.css` carries a one-line migration note.

---

**Priority 4 (original #3) — Canvas SVG filter format**
> "`canvas_html_block` filter format extended to allow SVG tags. Added `<svg>`, `<circle>`, `<line>`, `<polygon>`, `<text>`, plus `<div>` to `config/sync/filter.format.canvas_html_block.yml`. Reasonable, but a future Canvas module upgrade could overwrite it — re-check after any Canvas update."

**Why now:** Low urgency but high-surprise if a Canvas update silently resets it. Add a post-Canvas-update checklist item to the site maintenance SOP and do not wait for a production incident to discover the regression.

**Resolved 2026-05-03 (Phase 3, commit `493118c`):** Post-Canvas-update checklist captured in new doc `docs/pl2/canvas-update-checklist.md` with the filter-format file path, the six tags to verify, a copy-pasteable grep, and a per-tag attribute-allowlist reference table. The filter format file itself remains in correct state — the checklist guards against silent regression after a future Canvas module upgrade.

---

**Priority 5 (original #5) — Heal-flow arrow contrast margin**
> "Phase 5 contrast advisory: arrow `#1893b4` on cream `#F5EFE2` passes non-text 3:1 with only a 0.12 margin (3.12:1). If the cream surface is ever lightened, recheck this contrast."

**Why now:** No action needed unless the cream token changes. Flag this in any future design-token revision so it is not silently regressed.

**Resolved 2026-05-03 (Phase 2, commit `eeda8f4`):** Contrast-watch comment added at the arrow-color rule in `components/heal-flow/heal-flow.css`. Exact text: `/* Contrast watch: arrow #1893b4 on cream #F5EFE2 = 3.12:1 (passes 3:1 non-text by 0.12 margin). Recheck if the cream surface is ever lightened. */` — co-located with the rule it constrains so a future cream-token tweak cannot silently regress it.

---

**Priority 6 (original #6) — Footer `block_content` DB bootstrap**
> "Footer `block_content` DB tables were bootstrapped manually due to a circular module-install dependency. Note for any future site rebuild from a clean DB — the standard install order does not produce these tables without intervention."

**Why now:** Only matters on a clean rebuild. Document in the site's setup SOP before the knowledge is lost.

---

**Priority 7 — Nav link teal contrast on white** (surfaced 2026-05-03 during Phase 1 S audit)
> "Nav link teal `#1893b4` on `#FFFFFF` surface computes to 3.58:1. Passes the 3:1 non-text threshold for an active-trail indicator, but fails the 4.5:1 body-text threshold if the same token is ever used as body color. Pre-existing, multi-component (header nav at minimum)."

**Why now:** Pa11y did not flag this because the active use is non-text. Risk is that the token gets reused as body color on a future page (Services nav, About sidebar) without the WCAG implication being re-checked. Run a focused "color-token body-text usage" sweep before Services launches; if the token must appear as body text anywhere, darken to `#0F6F8A` (estimated 4.6:1 on white) or pick a different token for that role.

**Resolved 2026-05-03 (Cycle-debt Phase 2, commit `e4603fd`):** Token `--theme-link-color` value updated from `#1893b4` to `#0F6F8A` in three zone definitions in `css/base.css` (`.theme--white`, `.theme--light`, `.theme--secondary`). New value computes 5.74:1 on `#FFFFFF` and 5.01:1 on cream `#F5EFE2` — both pass body-text AA with comfortable headroom. Three real body-text consumers darkened correctly: accordion toggle icons, card hover borders, icon-list checkmarks. Non-text uses of `#1893b4` (heal-flow SVG strokes, focus rings, logo dot, decorative elements) preserved as intended. **Nuance:** S's Tier 3 audit found that header nav-link hover/active-trail states do not currently consume `--theme-link-color` in the rendered cascade — neonbyte parent theme overrides them to ink. That cascade gap is recorded as Priority 12. The token value is now AA-safe regardless, so a future cascade fix inherits AA correctness automatically.

**Sharpening note (2026-05-03, Cycle-debt Phase 4):** Investigation during Phase 4 P12 fix revealed that `--top-level-link-color-hover` was a **dead token** for `.primary-menu__link--level-1` — neonbyte never applies it as a `:hover { color }` on top-level links (it's only consumed by level-2/3 dropdown links). Phase 2's token darkening was therefore a no-op for nav-link hover, but remained correct and useful for the real consumers (accordion toggle icons, card hover borders, icon-list checkmarks). Phase 4 closes the actual nav-link hover gap with a direct `:hover { color }` rule at specificity `(0,2,1)`.

---

**Priority 8 — Heading hierarchy skip-level gaps** (surfaced 2026-05-03 during Phase 1 S audit)
> "Homepage heading hierarchy skips: `<h1>` → `<h3>` in the feature-cards section, `<h2>` → `<h4>` in the footer columns. Not a WCAG 2.2 AA Pa11y violation (Pa11y is lenient on skips), but it is a structural / SEO concern and a screen-reader navigation cost."

**Why now:** S's structural audit caught what Pa11y missed. Fix before Services so the new page does not inherit a skip-level convention. The fix is per-component: cards should be `<h3>` only inside an `<h2>`-headed section, or the section should add an `<h2>`; footer columns should have `<h3>` per column rather than jumping to `<h4>`.

**Resolved 2026-05-03 (Cycle-debt Phase 3, commit `3a62aaf`):** Two skip-level gaps eliminated. (1) Cards section h1→h3 skip closed by adding a `dripyard_base.kicker` ("WHAT WE SHIP") + `dripyard_base.heading` h2 ("Tools, AI, and experts. All there.") into the Canvas section's empty header slot, applied via overlay to entity 20 (the live homepage). (2) Footer h2→h4 skip closed by changing both `<h4 class="footer-column__heading">` occurrences to `<h3>` in `menu--region-footer-left.html.twig` (class is tag-agnostic, zero CSS impact). Verified: Pa11y WCAG2AA 0 errors, kicker contrast 4.80:1 AA pass on white, no `!important` introduced, ARIA landmarks unchanged. **Discovery during execution:** Stage 1's handoff cited the wrong Canvas entity UUID (entity 1 `bb5bbbb1` rather than the live entity 20 `b2c1f14a`); F reversed entity 1 cleanly and applied to entity 20. Recorded for future F context.

---

**Priority 9 — Static preview vs rendered header chrome mismatch** (surfaced 2026-05-03 during Phase 1 S audit)
> "The editorial preview at `docs/pl2/Previews/homepage.html` shows a flush flat header with a hairline bottom border. The rendered site uses neonbyte's floating-pill header chrome (rounded-corner pill on a transparent strip). Inherited from the neonbyte parent theme; not introduced by Phase 1."

**Why now:** This is an editorial / brand alignment question, not a WCAG issue. Two paths: (a) align rendered to preview by writing a Layer 5 header-chrome override in `css/components/header.css` if the flush header is the intended brand treatment; (b) update `docs/pl2/Previews/homepage.html` to reflect the floating-pill chrome if that is the intended treatment. Decide before Services so Services inherits the right pattern.

**Resolved 2026-05-03 (Cycle-debt Phase 4, commit `a085ddb`):** All four rendered-vs-preview deltas closed via `header.css` Layer-3 token overrides on `.site-header`: `--site-header-fixed-offset: 0`, `--header-background-color-percent: 100%`, `--header-border-radius: 0`, plus a Layer-5 `border-bottom: 1px solid var(--theme-border-color)` on `.site-header__shadow` (specificity escape via `[class]` attribute selector). `--header-padding-block: 16px` brings content height to 72px exactly. Pa11y 0 errors, no `!important`.

---

**Priority 10 — Mobile page-level horizontal scroll from heal-flow flex-item overflow** (surfaced 2026-05-03 during Phase 2 S audit)
> "At viewport widths ≤ 375px the homepage has page-level horizontal scroll (htmlScrollWidth ≈ 1018px). Root cause: `.heal-flow` lives in a `display:flex` parent (`.dy-section__content`). Its child SVG carries `min-width: 970px`. Flex items default to `min-width: auto` → `min-content`, so `.heal-flow` is forced to grow to ~1004px and overflows `<body>`. The `overflow-x: auto` rule on `.heal-flow` cannot trigger because the container itself is being grown. Pre-existing — not introduced by Phase 2; CSS-diff analysis vs. the pre-Phase-2 base.css rules confirms the only meaningful change was a 30px `min-width` increase that cannot have introduced an already-existing overflow."

**Why now:** The page is shipping with mobile horizontal scroll today. The fix is small: give `.heal-flow` an explicit `min-width: 0` (or `min-width: 100%`) so the flex `min-content` default does not grow the page. The internal `overflow-x: auto` then takes effect and heal-flow scrolls inside its own container per the design brief. Fix before Services so the new page does not inherit the same flex-min-content trap.

**Resolved 2026-05-03 (Cycle-debt Phase 1, commit `d8622f6`):** Two properties added to `.heal-flow` in `components/heal-flow/heal-flow.css` (Layer 5): `min-width: 0` (prevents flex min-content from growing the page) plus `width: 100%` (constrains element to parent flex container so internal `overflow-x: auto` engages). At 375px viewport, page-level scrollWidth dropped to 360px (no document-level horizontal scroll); heal-flow's internal scroll engaged with `scrollWidth: 1002` / `clientWidth: 329`. No regression at desktop (1280px) or in any other section. Pa11y WCAG2AA 0 errors. Scope expansion (`width: 100%` beyond the originally-prescribed `min-width: 0`) validated by T as necessary and properly bounded by existing `max-width: 1040px`.

---

**Priority 11 — Canvas does not support `minItems` on array-typed SDC props** (surfaced 2026-05-03 during Phase 2 S audit)
> "Canvas's `JsonSchemaType::computeStorablePropShape()` accepts `type`, `items`, and `maxItems` for array-typed SDC props but rejects `minItems` (and likely other JSON-Schema constraints). For the heal-flow SDC the constraint is conceptual ('a process flow needs at least 2 steps'), but the schema cannot enforce it — editorial discipline replaces schema enforcement. Same constraint applies to any future SDC that wants to express minimum-count requirements on a repeating prop."

**Why now:** Platform constraint, not a fix to apply now. Worth recording so future SDC authors do not waste time trying to add `minItems` and waste a debugging cycle when Canvas silently rejects it. Also worth checking whether Canvas accepts JSON-Schema's `pattern`, `enum`, or `format` constraints on array items — same investigation, same cycle. Add to the Canvas-platform notes section in the next page runbook.

**Resolved 2026-05-04 (Cycle-debt Phase 5, commit `8ab0b6d`):** Documentation-only investigation. Canvas's `JsonSchemaType::computeStorablePropShape()` (lines 235–284 in `web/modules/contrib/canvas/src/JsonSchemaInterpreter/JsonSchemaType.php`) maintains a strict whitelist at line 253: only `type`, `items`, and `maxItems` are accepted at the array level; every other keyword — including `minItems`, `examples`, `pattern`, `enum`, `format` — silently returns `NULL`, making the prop non-storable in Canvas. Item-level constraints are handled separately and most are accepted (e.g., `enum` for string/int/number items, `format` for strings). Heal-flow SDC documented as the real-world example: all three array props (`step_numbers`, `step_labels`, `step_is_endpoints`) are non-storable as currently authored because they carry `examples` at the array level — not just because `minItems` is unsupportable. Editorial discipline replaces schema enforcement. Reference document: [`canvas-minitems-platform-note.md`](canvas-minitems-platform-note.md) — includes safe + dangerous `.component.yml` snippets for future SDC authors.

---

**Priority 12 — Header nav-link cascade gap: hover/active-trail color overridden to ink** (surfaced 2026-05-03 during Cycle-debt Phase 2 S audit)
> "`header.css:42` intends to set the header primary-menu hover/active-trail color via `--theme-link-color`, but neonbyte's parent-theme primary-menu component re-binds `--top-level-link-color-hover` to ink before our rule applies. Result: nav-link hover and active-trail render in ink `#1F1A14` rather than the intended teal. Pre-existing — neither Phase 1 (header `theme--white`) nor Phase 2 (token darkening) introduced or regressed it."

**Why now:** This was the original motivating consumer for Priority 7's token darkening, but turns out it is not currently consuming the token at all. Fix is to identify neonbyte's `--top-level-link-color-hover` definition and either (a) override at Layer 5 in `header.css` with higher specificity, or (b) re-define the parent variable in our zone wrapper. Token value is now AA-safe so the fix automatically inherits AA. Should be done before Services so the new page's nav inherits the corrected cascade. Estimated effort: ~1 hr including S audit.

**Resolved 2026-05-03 (Cycle-debt Phase 4, commit `a085ddb`):** Root cause confirmed as **load-order + dead token**. Neonbyte's `primary-menu-wide.theme.css` loads at file #7 (separate library from our header.css at file #4), beating our rule at equal specificity `(0,1,0)`. Additionally, `--top-level-link-color-hover` is never consumed for level-1 hover. Fixed with a direct `.theme--white .primary-menu__link--level-1:hover { color: var(--theme-link-color); }` at specificity `(0,2,1)` — beats neonbyte regardless of load order. Active-trail handled the same way. Removed the dead-code token rebind. Hover and active-trail both resolve to `#0F6F8A` teal (5.74:1 AA pass). Pa11y 0 errors.

---

**Priority 13 — `#107D9B` in title-cta.css on cream surface = 4.14:1** (surfaced 2026-05-03 during Cycle-debt Phase 2 S/T audits)
> "`web/themes/custom/performant_labs_20260502/css/components/title-cta.css` uses literal hex `#107D9B` (a teal slightly darker than `#1893b4` but still not AA-safe on cream). On `#F5EFE2` cream surface it computes to 4.14:1 — fails the 4.5:1 body-text threshold. Pre-existing, did not enter scope of Phases 1 or 2 of this cycle."

**Why now:** Same body-text contrast risk class as Priority 7 — if the title-cta is ever placed on a cream zone (likely on About or Services), its body text fails AA. Fix is small: replace the literal `#107D9B` with `var(--theme-link-color)` so it inherits the centrally-managed AA-safe value (now `#0F6F8A` on white/light/secondary, originally `#1893b4` on dark/black/primary), OR pick a per-component value that hits AA on cream. Token-replacement is the cleaner path. Estimated effort: ~30 min.

---

**Priority 14 — Dark/black-zone `--theme-link-color: #1893b4` on espresso = 2.46:1** (surfaced 2026-05-03 during Cycle-debt Phase 2 Stage 1 discovery)
> "In `.theme--dark`, `.theme--black`, and `.theme--primary` zones, `--theme-link-color` is currently `#1893b4`. On the espresso surface `#1F1A14` (the dark-zone surface), this computes to ~2.46:1 — well below body-text AA (4.5:1) and even below large-text AA (3:1). Stage 1 discovery confirmed those zones do not currently host nav-link body text on the homepage, so it is not an immediate user-facing failure — but if any dark-zone link is added (Services dark CTA section, footer link, etc.), it silently fails AA."

**Why now:** Defensive. The dark zones will eventually host link text on Services or About — better to pick an AA-safe lighter teal for those zones now than to discover the failure during a Services Tier 3 audit. Suggested values to evaluate: `#5DC6E8` (lighter teal, AA on espresso), `#7AD0E8` (more headroom). Token value choice should be paired with a contrast computation against `#1F1A14` and any other dark surfaces. Estimated effort: ~30 min including S audit.

---

**Priority 15 — Page-wide H2 typography deviation from design brief** (surfaced 2026-05-03 during Cycle-debt Phase 3 S audit)
> "Every section `<h2>` on the homepage computes to 54px Instrument Sans 400 with -0.81px tracking, but the design brief specifies `display-md` = 40px Rubik 500 with -1px tracking. The deviation is consistent across all section H2s (heal-flow, 'Built for...', FAQ, the new cards section H2 added in Phase 3). Pre-existing — not introduced by Phase 3 — but real brief-vs-theme drift worth tracking before more sections or pages inherit the same divergence."

**Why now:** This is a brand-consistency concern, not a WCAG concern. The 54px size still passes large-text contrast easily. But if the brief is the source of truth for the brand, the rendered theme is drifting. Two paths to evaluate: (a) update the brief to acknowledge the actual rendered scale and codify Instrument Sans for display, or (b) update the theme to match the brief (Rubik 500 at 40px). Choice depends on which artifact is more load-bearing for the brand. Worth a focused decision before Services or About launches.

---

**Priority 16 — Cards grid renders 2+1 at 1280px desktop** (surfaced 2026-05-03 during Cycle-debt Phase 3 S audit)
> "At 1280px desktop, the homepage cards section renders as a 2+1 grid (two cards on row 1, one card alone on row 2 with a visible right-side gap) rather than the 3-up grid the design brief implies. Pre-existing from the Phase 6 Canvas assembly — not introduced or regressed by Phase 3."

**Why now:** Visual rhythm issue. The cards section reads as incomplete with the lone third card. Fix is in the Canvas section's grid configuration or the section component's CSS — investigate whether the grid is set to `auto-fit minmax(N, 1fr)` with a too-large minimum, or whether the section is constrained to a max-width that forces the wrap. Estimated effort: ~30 min including S audit.

---

**Priority 17 — Cards section renders as `<div>`, no ARIA region landmark** (surfaced 2026-05-03 during Cycle-debt Phase 3 T+S audits)
> "The `dripyard_base.section` component renders the section wrapper as `<div class=\"dy-section\">`, not `<section>`. Result: even when a section has its own heading (as the cards section now does after Phase 3), screen readers do not expose it as an ARIA `region` landmark. Heading-by-heading navigation works, but landmark-skip navigation does not include this section. Pre-existing base-theme behavior — not introduced by Phase 3."

**Why now:** Defensive accessibility. AT users who navigate by landmark currently skip past the cards section entirely. Two fix paths: (a) override `section.twig` in the custom theme to use `<section aria-labelledby="...">`, wiring the heading's id as the labelledby target — but this requires every consumer to provide a heading or accept an unnamed region; or (b) leave as-is and document that landmark coverage is intentionally heading-driven on this site. Worth a real decision rather than drift. Estimated effort: ~1 hr if going with path (a), including testing across all `dripyard_base.section` consumers.

---

**Priority 18 — Theme-setting brand seed mismatch: `#0000d9` blue vs `#1893b4` teal** (surfaced 2026-05-03 during Cycle-debt Phase 4 Stage 1 background investigation)
> "`performant_labs_20260502.settings.yml` defines `--theme-setting-base-primary-color` as `#0000d9` (blue), which seeds neonbyte's OKLCH-derived token chain (`--primary` → `--primary-700` via `oklch(from var(--primary) 0.48 c h)` → `--theme-text-color-primary` and many sibling tokens). The actual brand teal is `#1893b4`. The mismatch means every neonbyte token derived from the brand seed resolves on a blue hue rather than a teal hue. Today's homepage looks correct because the custom theme patches specific tokens (e.g., `--theme-link-color: #0F6F8A`) directly at Layer 3, sidestepping the chain — but any neonbyte-derived token we haven't patched is currently on the wrong hue."

**Why now:** This is a deeper config bug than the targeted Phase 4 fix could address. Flipping the seed has high blast radius — it shifts every OKLCH-derived token simultaneously. Estimated effort: 2–4 hour audit phase that enumerates every neonbyte token derived from `--primary`, captures before/after computed values across the homepage and any built preview pages, then flips the seed and verifies no visual regression. Should run before Services or About launches to avoid inheriting more drift.

---

**Priority 19 — Mobile CTA visibility: header strip vs collapsible panel** (surfaced 2026-05-03 during Cycle-debt Phase 4 Stage 1)
> "At 375px, the static preview shows the 'Call today' CTA always visible in the header strip alongside logo + hamburger. The rendered Drupal site hides the CTA inside the collapsible mobile panel (panel block, not header bar). Pre-existing behavior — neonbyte's responsive structure renders the CTA in two different DOM positions across viewports."

**Why now:** UX/conversion concern, not WCAG. Mobile users see logo + hamburger only; the CTA is one tap away (open the menu). For a B2B consulting site this is acceptable, but if mobile conversion matters, surfacing the CTA in the header strip is worthwhile. Fix is template-level (Twig override or block placement to render the CTA block in both positions, OR add a duplicate visibility-controlled CTA), not CSS-only — Phase 4 was constrained to CSS so this was deferred. Estimated effort: 1–2 hr including mobile hover/focus testing.

---

**Priority 20 — `.site-header__content` retains `border-radius: 8px` from neonbyte's `--radius-md` token** (surfaced 2026-05-03 during Cycle-debt Phase 4 S audit)
> "Phase 4's `--header-border-radius: 0` token override on `.site-header` cascades to `.site-header__shadow` and `.site-header__container`, which read that token. But `header.theme.css:56` sets `border-radius: var(--radius-md)` directly on `.site-header__content`, which is a different token (`--radius-md`, not `--header-border-radius`). Computed `border-radius` on `.site-header__content` therefore still reads `8px`. Visually invisible today because `__content` has no painted background or border to display the radius — the painted surface is on `__container` which IS 0px."

**Why now:** Source-correctness only. No visual artifact today. Defensive fix: add `.site-header__content { border-radius: 0; }` to `header.css` next time someone touches the header. Estimated effort: 5 min.

---

## 4. Process learnings to carry forward

**Require a Tier 3 vision pass at activation, not only before it.** Phase 7's audit used curl + HTML inspection (Tier 1 + Tier 2) and pa11y. It passed. What it did not catch: visible PHP `OutOfRangeException` blocks replacing the feature cards, the NeonByte wordmark as the site logo, the hero secondary button painting orange from Dripyard's default color, and the footer "three columns" being a single nested menu. The post-activation Tier 3 vision audit caught all of these. Future runbooks for any new page must include a Tier 3 vision pass at the moment the page goes live — activation is a trigger for Tier 3, not just a gate before it.

**Single-commit-at-end-of-batch is valid for multi-batch rework.** The Tier 3 rework accumulated changes across 4 F batches without intermediate commits, then landed as one clean commit once the full picture was verified. This kept git history readable (one commit for the rework, not a series of partial-fix commits) and avoided shipping a half-fixed state to `main`. Use the same pattern for any future multi-batch rework cycle.

**OFTS scaled cleanly Phase 1 → 8; keep `workflow-ofts.md` generic.** Eighteen pipeline cycles, four agents, consistent handoff format throughout. The workflow doc held without revision from scaffold to activation and through the Tier 3 rework. Do not bake homepage-specific assumptions (branch names, section counts, entity IDs) into it. Page-specific assumptions belong in the page-level runbook; the OFTS spec stays generic so it works for Services, About, and any future page.

**Enforce "fix at the highest correct layer" on rework, not just first build.** Two of the three most-damaging post-activation findings — the header `theme--light` class and the footer hex literals in CSS — were Layer 5 patches compensating for Layer 1 mis-configs. They worked visually but left the wrong semantic state in the DOM and created cognitive load for every future agent reading those files. When filing rework issues, explicitly state which layer the original fix was applied at and whether the root-cause layer was addressed.

**Add `logo.svg` replacement to the Phase 0 pre-flight checklist.** The NeonByte wordmark appearing as the site logo was a Critical brand-defining failure caught only at Tier 3. The fix is trivial — replace `logo.svg` at scaffold time — but it was never in the Phase 0 checklist. Every future theme scaffold starts with the parent theme's default logo; a checklist item prevents it from reaching activation.

**Add a Canvas schema sync check to the pre-activation checklist.** Finding #1 (OutOfRangeException on all three feature cards) was caused by an `icon` prop present on the Canvas page entity but absent from the current Card schema. A pre-activation drush check that lists all Canvas block instances on the page and cross-references prop names against active schemas would catch this class of failure in Tier 1, before Tier 3 is ever run. Add this check explicitly to the Phase 8 checklist in any future page runbook.

**Pa11y 0-error is necessary but not sufficient for sign-off.** The live homepage reported Pa11y WCAG2AA 0 errors at activation, yet had three PHP exception blocks rendering as plain text, a wrong brand logo, and a footer with fundamentally wrong column structure. Pa11y tests DOM semantics and computed contrast — it cannot detect visible exception text, brand-asset correctness, or layout failures. Never conflate "Pa11y passes" with "the page is ready." Tier 3 vision is the gate; Pa11y is a supporting check, not the gate itself.

**One-commit-per-component-override discipline paid off throughout Phase 4.** Phases 4.1–4.9 each produced a single, scoped commit. When Phase 8 rework needed to debug why the header was painting the wrong surface, git history made it trivial to isolate exactly which commit introduced the CSS workaround. The discipline of "one commit per component override" is load-bearing for debuggability — preserve it on future pages even when it feels like ceremony. The exception (single commit for multi-batch rework) works precisely because the base-level discipline keeps the commit history clean enough to make the exception legible.

---

## 5. Where to read what

### Project docs

| What you need | Where |
|---------------|-------|
| End-to-end runbook, acceptance criteria, approval checkpoints | `docs/pl2/pl-plan--homepage-overhaul.md` |
| Project state, tech debt table, revert plan | `docs/pl2/handoffs/homepage-overhaul-state.md` |
| Design tokens, typography scale, spacing, mobile breakpoints | `docs/pl2/Briefs/pl_design_brief.md` |
| Component-by-component section mapping (hero, cards, heal-flow, etc.) | `docs/pl2/Briefs/archive/pl_homepage_components.md` (archived 2026-05-11 with homepage shipped) |
| O-F-T-S pipeline — agent roles, handoff templates, phase-to-pipeline mapping | `docs/pl2/workflow-ofts.md` |
| What comes next after the homepage | `docs/pl2/post-homepage-next.md` (this file) |

### AI guidance docs (referenced throughout, not in this repo)

| What you need | Where |
|---------------|-------|
| 7-step CSS change workflow (mandatory for every CSS edit) | `docs/pl2/theme-change--workflow.md` |
| CSS layer system and override strategy | `docs/pl2/theme-change.md` |
| Tier 1 / Tier 2 / Tier 3 verification hierarchy | `~/Projects/playbook/testing/verification-cookbook.md` |
| Dripyard color architecture, OKLCH, theme wrappers | `~/Projects/playbook/themes/dripyard-guidance.md` |
| Layer 4 component-wrapper override pattern | `~/Projects/playbook/frameworks/drupal/theme-planning/color-management.md` |
| Efficiency rules, known failure patterns, browser-call cost | `~/Projects/playbook/frameworks/drupal/theming/operational-guidance.md` |
| Canvas scripting protocol (drush scr assembly) | `~/Projects/playbook/frameworks/drupal/theming/canvas-scripting-protocol.md` |
