# Handoff-F: Wave 2 (#276) — Sub-phase A: Hero rebuild

**Date:** 2026-07-21
**Branch:** `feat/276-product-led-homepage`
**Issue:** #276 (epic #267, Wave 2)

## Confirmation table (autonomous mode — informational, not surfaced)

| Field | Value |
|---|---|
| Page being overhauled | Homepage (`/`, `canvas_page` 20) — hero region only, this sub-phase |
| GitHub issue number | #276 (epic #267, Wave 2) |
| Working branch | `feat/276-product-led-homepage` |
| Runbook phase | Wave 2 build (gated on wireframe sign-off + Lane A complete — both met per #276 comment 5041165051) |
| Input documents read | `feature-implementor.md`, `principles.md`, `drupal-canvas-sdc.md` adapter, `frontend-pipeline-profile.md`, `canvas-update-checklist.md`, `canvas-minitems-platform-note.md`, `wireframe.html` + `RATIONALE.md`, issue #276 body + 6 comments, issue #267 body, `handoff-S.md` (epic-267-S) §advisories, `theme-change--workflow.md`, `~/Projects/aftersight/README.md` + `ORCHESTRATOR_HANDOFF.md` |
| Acceptance criteria count | 9 checkboxes on #276 (this sub-phase covers 3 fully: hero screenshot/snippet/pill/2-CTAs, palette-on-hero, framework-agnostic hero check; partially advances the kicker-echo/nav-weight and viewport/contrast items; does not cover feature-anatomy, social-proof strip, or services/logo relocation — see "Scope cap" below) |
| Handoff document path | `docs/pl2/handoffs/wave2-276/handoff-F.md` (this file) |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | Each component's `.component.yml` under `web/themes/dripyard_themes/{dripyard_base,neonbyte}/components/` and `web/themes/custom/performant_labs_v2/components/{kicker,browser-chrome,code-snippet}/` — all read before referencing any prop |

## Scope cap — split decision (autonomous, self-decided)

The full #276 build (per the approved wireframe) touches: hero (2 new sub-components + rework), a product social-proof strip (statistic/pill row + nav CSS), 3 feature-anatomy sections (content-card ×3), and a services/logo-grid relocation — more than one component family and more than one design surface. Per the scope cap in `feature-implementor.md`, I split into 3 sub-phases before writing code and picked the lowest-risk/sprint-blocking one myself:

- **Sub-phase A (this cycle):** Hero rebuild — kicker-echo fix, dev-status pill, new browser-chrome + code-snippet SDCs, placeholder screenshot, hero CSS, blast-radius gate, WCAG. **Chosen because everything else in the wireframe is additive below the hero and doesn't depend on it, but the hero is the page's single highest-visibility surface and the one place the epic's #268 verbatim-copy constraint and the S kicker-echo advisory both apply — landing it first de-risks the rest.**
- **Sub-phase B (follow-up issue, to be filed by O):** Product social-proof strip (`dripyard_base:statistic` ×N + `dripyard_base:pill` MIT badge + build-note line) + nav visual-weight CSS variant (`neonbyte:header`/`dripyard_base:menu-block`, weighted vs. demoted link classes).
- **Sub-phase C (follow-up issue, to be filed by O):** 3 feature-anatomy sections (`dripyard_base:content-card` ×3, alternating layout, History/Failure-analytics/Search) + services-section/logo-grid relocation below the product portion.

Cap: one split per cycle — this is the one split for this cycle; sub-phase A itself did not need a further split (1 design surface: the hero; 1 net-new component family: browser-chrome + code-snippet, both small/co-located).

## What was done

- **`web/themes/custom/performant_labs_v2/components/browser-chrome/browser-chrome.component.yml`** (new) — SDC schema: `url_label` (required), `image_alt`, `is_placeholder`, `placeholder_caption` props + `screenshot` slot.
- **`web/themes/custom/performant_labs_v2/components/browser-chrome/browser-chrome.twig`** (new) — light card, dark titlebar (dots + URL pill), placeholder pattern or real `screenshot` slot content.
- **`web/themes/custom/performant_labs_v2/components/browser-chrome/browser-chrome.css`** (new) — Layer 5, co-located (SDC auto-registers its own CSS, same pattern as `components/kicker/kicker.css` — no `libraries-extend` entry needed).
- **`web/themes/custom/performant_labs_v2/components/code-snippet/code-snippet.component.yml`** (new) — SDC schema: `command_line`, `result_line` (both required), `aria_label` props.
- **`web/themes/custom/performant_labs_v2/components/code-snippet/code-snippet.twig`** (new) — dark terminal card, `$` command / `→` result lines, `role="img"` + computed `aria-label`.
- **`web/themes/custom/performant_labs_v2/components/code-snippet/code-snippet.css`** (new) — Layer 5, co-located.
- **`web/themes/custom/performant_labs_v2/css/components/hero.css`** (modified) — appended: dev-status pill L5 override (white bg, terracotta-deep border/text/dot, scoped to `.hero.theme--white .pill`) + vertical-rhythm rules for the two new components + extended the existing desktop `flex-basis: 100%` group to include `.pill`.
- **`scripts/sprint-wave2-276-hero-rebuild.php`** (new) — idempotent Canvas assembly script: relabels the hero kicker ("Open-source test intelligence" → "From Performant Labs"), inserts the dev-status pill (first child of `hero_content`) with a nested `dripyard_base:text` carrying the verbatim pill copy + a `<div class="pill__dot">` marker, inserts `code-snippet` and `browser-chrome` at the end of `hero_content`. Removes and re-inserts its managed instances on every run (verified idempotent — re-run produces the same 59-component count, no duplication).
- **`docs/pl2/css-change-log.md`** (modified) — appended 4 entries for the new component CSS + the two hero.css additions.
- **`docs/pl2/handoffs/wave2-276/shots/`** (new) — 3 headless screenshots (360/768/1280) of the live hero, captured to disk for the record (T3 visual sign-off is S's job, not opened in a browser by F).

## Layer decisions

**Component-reuse search (Step 0, mandatory before creating any component):**

| Need | Component considered | Source | Verdict |
|---|---|---|---|
| Frame a screenshot in browser chrome | *(none exists)* — searched `dripyard_base/components/` and `neonbyte/components/` for anything with a titlebar/chrome pattern | dripyard_base, neonbyte | **New component (`browser-chrome`)** — no existing component frames a screenshot this way, confirmed by the wireframe's own component-mapping table (RATIONALE.md §Section→component mapping) and independently re-confirmed here by directory listing both parent themes' component roots. |
| Terminal/code-snippet | `dripyard_base:text` (CSS-only styling, flagged as an open question in RATIONALE.md) vs. dedicated SDC | dripyard_base | **New component (`code-snippet`)** — chose a dedicated SDC over CSS-only-on-text because the command/result pair, the computed `aria-label`, and the prompt/muted-glyph structure are cleaner as typed props than as raw HTML dumped into `dripyard_base:text`'s `text` prop (which would also need inline `<span>` markup that the `canvas_html_block` filter format does not allow — see "Architecture notes"). This also directly answers RATIONALE.md open question #4 (CSS-only vs. dedicated) in favor of dedicated, and gives `/aftersight` (#271's page) a reusable component if it wants the same treatment later. |
| Dev-status pill | `dripyard_base:pill` | dripyard_base | **Reused as-is** — no new component. `pill.component.yml` has no `additional_classes` prop, so the white-bg/terracotta-deep-border look required a Layer 5 structural override scoped to the hero ancestor rather than a Canvas-input modifier class (see below). |
| Nested pill content (dot + label) | `dripyard_base:text` | dripyard_base | **Reused as-is** — verbatim approved pill copy plus a `<div class="pill__dot">` marker (not `<span>` — see "Architecture notes" on the filter-format allowlist). |

**CSS Step 1–4 trace (7-step workflow):**

1. **`browser-chrome.css` / `code-snippet.css` (new components):** Pass 1 bottom-up found no prior rule for either new class (new markup). Pass 2 top-down: L1 not config; L3 (`html .theme--black`/`.theme--white` zone tokens) would be too broad for these bespoke card shapes and — critically — the titlebar/code-snippet aren't wrapped in an actual `.theme--black` zone element (dark is confined to just these two spots per the approved wireframe, not a full ancestor zone), so L3's zone *selector* doesn't apply even though its token *values* are the correct source of truth. **Layer 5 correct** — literal hex values copied directly from `base.css`'s `html .theme--black` block, cited inline in each file's header comment, so both spots can never silently drift from base.css's own dark-zone figures.
2. **Dev-status pill override (`hero.css`):** Pass 1 bottom-up: `.pill` default styling (`pill.css`) sets `--pill-background-color: var(--theme-text-color-loud)` — solid dark fill, wrong for the wireframe's white-bg/terracotta-deep-border badge. Pass 2 top-down: L1 not config; L3 (`--pill-background-color` in `html .theme--white`) ruled out as too broad — would restyle every pill site-wide, and pill has no per-instance modifier-class prop to scope a variant through Canvas inputs. **Layer 5 correct** — scoped to `.hero.theme--white .pill`, matching this file's existing pattern for kicker/button/heading hero-specific overrides.
3. **Kicker relabel:** not a CSS change — a Canvas content edit (component `inputs.text`), same mechanism Lane A's F used for the original kicker text swap. No layer trace applies (content, not styling).

**DOM-inspection gate:** satisfied via Tier 1 (curl + grep, see "Verification results" below) — the hero's DOM structure (`.hero__block-content` children, their existing flex layout rules) was inspected live before writing the L5 spacing rules.

## Architecture notes for A

- **Layers touched:** Layer 5 only (two new component stylesheets, one existing component stylesheet extended) + Canvas component-tree content (approved authoring mechanism, never patched rendered output). No Layer 1, 3, or 4 changes.
- **New dependencies:** two new SDCs (`performant_labs_v2:browser-chrome`, `performant_labs_v2:code-snippet`), both self-contained (co-located twig+css+yml, SDC auto-registers CSS — same pattern as the pre-existing `kicker` component, confirmed by `curl` showing both new CSS files auto-linked on the page with zero `libraries-extend` entry needed in `performant_labs_v2.info.yml`).
- **Cross-component effects:** the hero.css pill override is scoped to `.hero.theme--white .pill` — a `curl`-verified grep across the codebase shows no other page currently renders a `dripyard_base:pill` instance (the four extant `pill` instances site-wide are all this homepage's kicker-adjacent... correction: pill is net-new to the page; the four pre-existing components using the *kicker* SDC are unaffected — pill itself had zero prior instances anywhere on the site before this change, confirmed via `component` entity query returning no version match until this script ran). The scoped selector means no other page or future pill usage is affected.
- **Filter-format constraint discovered:** `canvas_html_block`'s `allowed_html` allowlist (per `docs/pl2/canvas-update-checklist.md`) permits `<div class role aria-label style>` but **not** `<span>`. The pill's status-dot marker therefore uses `<div class="pill__dot" aria-hidden="true">` instead of the wireframe's literal `<span class="dot">` — a CSS-class-selector change only (`pill__dot` targets any element), no visual or accessibility difference, and no filter-format config was touched.
- **Canvas `component_version` handling:** every hash (`kicker`, `pill`, `text`, `code-snippet`, `browser-chrome`) is loaded live via `Component::getActiveVersion()` on the `component` config entity at script-run time — the two new components only became loadable after a `drush cr` registered their newly-authored `.component.yml` files as SDC config entities; the script throws before saving if any hash resolves to null/empty. Verified: no hardcoded hashes anywhere in the script.
- **Idempotency:** the script identifies and removes its own previously-inserted instances (by `component_id` + `parent_uuid` match, plus any nested `text` children of those instances) before re-inserting with fixed (non-random) UUIDs, so re-runs are byte-identical rather than accumulating duplicates. Verified by running twice — component count stayed at 59 both times, and a `grep -c` on the rendered page confirmed exactly one instance each of the three new/reused component types after the second run.
- **Tradeoff — insertion-order splice instead of moving existing children:** rather than rebuild the entire `hero_content` slot's child list from scratch (which would risk silently reordering or dropping the pre-existing, already-copy-approved kicker/heading/text/button instances), the script surgically splices the new pill+text pair right after the hero's own array position and the snippet+chrome pair at the end of the slot's existing children. This means the pill visually renders first (matches the wireframe) via DOM order alone — no CSS `order` property needed (an earlier draft used `order: -1` as a compensating hack; removed once the splice-based insertion made it unnecessary — see git history of `hero.css` if diffed against intermediate state, not present in the final file).

## Deviations from spec

1. **Product screenshot: placeholder, not real asset.** Attempted the real asset per the sign-off's preference within the ~15-minute time cap: located `~/Projects/aftersight`, found `.dev.db` (an empty/unseeded SQLite dev DB — 0 users, no seed script exists in `scripts/` or `package.json`), booted `npm run dev` headlessly (server came up on `:3000`, schema migrations ran clean), but the app requires walking the `/setup` wizard (admin account → org → project → CI/CD) before any dashboard view exists, and there is no scripted seed path to skip it. A direct-SQL seed was considered but the app's own admin/org/project creation logic (Better Auth password hashing, slug generation) isn't safely reproducible by hand-written SQL in the time box. Per the sign-off's own pre-approved fallback ("tasteful placeholder acceptable as interim if seeding blocks, flagged for follow-up"), the `browser-chrome` component renders a labeled, non-misleading placeholder (`is_placeholder: true`, striped pattern, "Aftersight dashboard — coming soon" + explanatory caption) instead of a real screenshot. **Flagged as a known issue / follow-up** — see "Known issues" below. The component's `screenshot` slot is ready to accept a real `canvas:image` the moment an asset exists; swapping it is a one-line `is_placeholder: false` + slot-content Canvas edit, no CSS/component change needed.
2. **Kicker relabel wording.** The approved copy block (#268/epic #267) covers pill/H1/subhead/CTAs verbatim but not kicker text — same situation Lane A's F already navigated for the original "Drupal testing" → "Open-source test intelligence" swap. The S handoff's advisory explicitly flags the resulting echo and suggests either dropping the kicker or giving it a non-echoing label, offering "From Performant Labs" / "Open source" as examples. **Conservative resolution:** chose "From Performant Labs" (S's own first suggestion) over dropping the kicker entirely, since removing it would also remove the only "company name" signal above the fold on a page that is now Aftersight-led — keeping a minimal, non-competing company attribution seemed the more conservative (less-destructive) of the two options S offered.
3. **Pill/subhead copy boundary.** The wireframe shows the pill carrying "Now in development — in the open" as a *separate* element from the subhead, but the live (Lane A-authored) subhead text already contains that exact phrase merged into it ("Self-hosted, MIT-licensed, AI in the core. Now in development — in the open."). Rather than editing the already-approved-verbatim subhead to remove the now-duplicated phrase (which risks going outside this sub-phase's scope and touching #268's exact-copy guarantee), I left the subhead untouched and added the pill as specified by the wireframe — meaning the phrase currently appears twice on the page (once in the pill, once in the subhead). **Flagged as a known issue** for O/S to decide whether the subhead should be trimmed in a follow-up copy-only edit (out of this CSS/component-scoped sub-phase).

## Verification results (T1 + T2)

**T1 — headless:**
```
$ ddev drush cr
 [success] Cache rebuild complete.
 (pre-existing unrelated config_schema warning for canvas.component.block.webform_block — present before and after, not touched)

$ curl -sk -o /dev/null -w "%{http_code}\n" https://performant-labs.ddev.site:8493/
200

$ curl -sk https://performant-labs.ddev.site:8493/ | grep -c 'performant_labs_v2:browser-chrome"'
1
$ curl -sk https://performant-labs.ddev.site:8493/ | grep -c 'performant_labs_v2:code-snippet"'
1
$ curl -sk https://performant-labs.ddev.site:8493/ | grep -c 'dripyard_base:pill"'
1

$ curl -sk https://performant-labs.ddev.site:8493/ | grep -oE 'href="[^"]*browser-chrome[^"]*\.css[^"]*"|href="[^"]*code-snippet[^"]*\.css[^"]*"'
href="/core/../themes/custom/performant_labs_v2/components/browser-chrome/browser-chrome.css?tik28h"
href="/core/../themes/custom/performant_labs_v2/components/code-snippet/code-snippet.css?tik28h"

$ curl -sk https://performant-labs.ddev.site:8493/ | grep -o 'From Performant Labs'
From Performant Labs
$ curl -sk https://performant-labs.ddev.site:8493/ | grep -o 'Aftersight — open-source test intelligence, built CTRF-native\.'
Aftersight — open-source test intelligence, built CTRF-native.   [unchanged, verbatim]
$ curl -sk https://performant-labs.ddev.site:8493/ | grep -o 'Follow the build\|Book a testing review'
Follow the build
Book a testing review    [unchanged, verbatim, both CTAs present]

$ curl -sk https://performant-labs.ddev.site:8493/ | grep -A1 'code-snippet__body'
<pre class="code-snippet__body" aria-hidden="true">docker run ctrfhub/aftersight → your first CTRF report in 60 seconds

# Re-run idempotency check
$ ddev drush php:script scripts/sprint-wave2-276-hero-rebuild.php
canvas_page 20 hero rebuild complete. Component count: 59   [same count both runs — no duplication]
```

**T2 — structural (Playwright headless, 360/768/1280):**
```
360: h1Count=1, scrollWidth=345 ≤ innerWidth=360 (no horizontal overflow)
768: h1Count=1, scrollWidth=753 ≤ innerWidth=768 (no horizontal overflow)
1280: h1Count=1, scrollWidth=1265 ≤ innerWidth=1280 (no horizontal overflow)

heroChildOrder (all 3 viewports, identical): [
  "pill", "kicker kicker--centered kicker--light",
  "heading h1 ...", "text text-content ... body-l color--soft",
  "button button--primary button--large", "button button--secondary button--large",
  "code-snippet", "browser-chrome"
]
  → pill renders FIRST (above headline, matches wireframe); snippet + chrome
    render LAST (below CTAs, matches wireframe). No CSS `order` hack needed —
    pure DOM-order insertion via the assembly script's splice logic.

chromeAriaLabel: "Aftersight dashboard — CTRF run history and pass/fail
  summary (placeholder — real screenshot pending local-instance seed)"
snippetAriaLabel: "Terminal example: docker run ctrfhub/aftersight, your
  first CTRF report in 60 seconds"
snippetRole: "img"
```

**Blast-radius gate (mandatory per adapter):**
```
$ NODE_PATH="$PWD/node_modules" node cascade-map.cjs "https://performant-labs.ddev.site:8493/" > cascade-map-wave2-276.json
  375: total boundary escapes = 2, attributable to my diff = 0
  1280: total boundary escapes = 2, attributable to my diff = 0
  (both pre-existing escapes are .header-navigation-wrapper/.primary-menu —
   menu-block component, unrelated to browser-chrome/code-snippet/hero.css)

$ node perturb.cjs "https://performant-labs.ddev.site:8493/" cascade-map-wave2-276.json --max-targets 10
  2 results, both pre-existing nav escapes:
    .header-navigation-wrapper:not(.is-expanded) .primary-menu → DORMANT (masked)
    .primary-menu → ACTIVE (live over-reach, pre-existing, not introduced by this diff)

VERDICT: PASS. Zero new escapes (active or dormant) attributable to
browser-chrome.css, code-snippet.css, or the hero.css additions.
```

**axe (ARIA-focused; contrast NOT reported by axe on this page — see below):**
```
$ AXE_BASE_URL="https://performant-labs.ddev.site:8493" node axe-check.cjs /
mobile-375 /: 1 violations
  [serious] scrollable-region-focusable: .heal-flow   ← PRE-EXISTING (S handoff F-A follow-up,
                                                          unrelated to this diff — .heal-flow is
                                                          the "Dogfooding" section, not touched)
desktop-1280 /: 0 violations
```
Per the S handoff's documented axe-core 4.9.1 OKLCH-abort finding (the header's OKLCH tokens make axe's color-contrast rule throw and abort page-wide, silently reporting "0 contrast violations" rather than actually running), contrast was NOT verified via axe — computed-style numeric checks (below) are the actual contrast evidence for this diff, consistent with how S itself verified epic #267.

## WCAG contrast ratios

| Element | Foreground | Background | Ratio | Pass/Fail |
|---|---|---|---|---|
| Dev pill text/border/dot (`.hero .pill`, live computed: `rgb(142,74,42)`) | `#8E4A2A` | `#FFFFFF` | 6.64:1 | AA/AAA pass |
| Kicker relabel "From Performant Labs" | `#8E4A2A` | `#FFFFFF` | 6.64:1 | AA/AAA pass (unchanged token, new copy) |
| Code-snippet prompt/result text (live computed: `rgb(93,198,232)`) | `#5DC6E8` | `#0E1014` | 9.71:1 | AAA pass |
| Code-snippet muted glyphs (`$`, `→`) | `#B8AFA0` | `#0E1014` | 8.77:1 | AAA pass |
| Browser-chrome titlebar URL-bar text (live computed: `rgb(184,175,160)` on `rgb(14,16,20)` — the inner URL pill, per `browser-chrome.css`'s `.browser-chrome__url { background: #0E1014 }`) | `#B8AFA0` | `#0E1014` | 8.77:1 | AAA pass |
| Browser-chrome placeholder caption on stripe pattern | `#5C544C` | `#F5EFE2` | 6.48:1 | AAA pass |

All live-computed CSS custom-property values were spot-confirmed via Playwright `getComputedStyle()` against the live rendered page (not just the source CSS) — see "Verification results" T2 output above; the pill's computed `color`/`borderColor` (`rgb(142, 74, 42)`) and the code-snippet's computed text color (`rgb(93, 198, 232)`) match the intended hex values exactly, confirming the cascade resolved as designed with no unexpected override.

## Mobile responsive behavior

- **Dev-status pill, code-snippet, browser-chrome:** all three use the hero's existing mobile-first flex layout (`.hero.theme--white .hero__block-content` — `display: flex; flex-direction: column` as the base/unqueried behavior, promoted to `flex-direction: row; flex-wrap: wrap` only at `@media (min-width: 577px)` for the CTA button row). No new `max-width` query was introduced — the new components consume the existing mobile-first cascade (`flex-basis: 100%` at desktop keeps them full-width rows; at mobile the column layout already stacks everything, no override needed).
- **Code-snippet card:** `max-width: 560px; margin-inline: auto` — at 360px viewport this renders at the container's available width (< 560px), confirmed in the T2 run (`snippetBox.width` = 317px at 360, matching the hero's content column, not overflowing). Internal command text uses `overflow-x: auto` on `.code-snippet__body` (terminal-output convention — horizontal scroll within the card rather than wrapping), not a breakpoint-gated rule, since terminal text should not reflow.
- **Browser-chrome card:** `max-width: 960px; margin-inline: auto`, `aspect-ratio: 16/9.4` on the viewport region — scales fluidly with the hero's content column at all three viewports (confirmed: 317px wide at 360, 693px at 768, 900px at 1280 — all proportional, no overflow).
- **Touch targets:** neither new component contains any interactive/focusable element (both are `role="img"` — decorative status displays, not controls), so the 44×44px touch-target requirement does not apply. Verified: `code-snippet` has `aria-hidden="true"` on its visual content with the accessible description on the `role="img"` container; same pattern for `browser-chrome`'s placeholder.
- **Typography scale:** neither new component introduces new heading-scale text; `code-snippet`'s `font-size: 12.5px` and `browser-chrome__url`'s `11px` are both fixed micro-typography (terminal/URL-bar convention, not body/heading scale) and are not subject to the `typography-mobile` block in the design brief (which governs display/heading/body sizes, not chrome-decoration text).
- Verified at 360/768/1280 via the T2 Playwright run above: no clipping, no overflow (`scrollWidth ≤ innerWidth` at all three), correct DOM order at all three.

## Autonomous decisions

1. **Scope-cap split** (Sub-phase A chosen; B and C filed as follow-ups) — see "Scope cap" section above. In human-in-the-loop mode this 3-way split would have been proposed to the operator via O and awaited approval before any code was written.
2. **New-component-vs-CSS-only for the terminal snippet** — RATIONALE.md's open question #4 left this genuinely open ("Confirm CSS-only styling on `dripyard_base:text` vs. a dedicated new component"). Resolved in favor of a dedicated SDC; rationale recorded in "Layer decisions" above. In human-in-the-loop mode this would have surfaced as a question to the operator.
3. **Kicker relabel wording** ("From Performant Labs" vs. dropping the kicker entirely) — S's advisory offered both as acceptable; I picked the less-destructive option. In human-in-the-loop mode this copy choice would have been surfaced to the operator per the S advisory's own framing ("recommend #276 either drop... or give it a non-echoing label").
4. **Product screenshot fallback to placeholder** — the sign-off pre-authorized this exact fallback ("tasteful placeholder acceptable as interim if seeding blocks, flagged for follow-up"), so this was not a fresh judgment call but an explicitly pre-approved path; noted here for completeness since it's still a deviation from the ideal (real-asset) outcome.
5. **Pill/subhead copy-duplication left as-is rather than trimming the subhead** — conservative interpretation to avoid touching #268's verbatim-approved copy outside this sub-phase's CSS/component scope; flagged as a "Known issue" for a follow-up copy decision rather than resolved unilaterally.

## Known issues

1. **Product screenshot is a tasteful placeholder, not the real Aftersight dashboard.** The `browser-chrome` component's `screenshot` slot is ready to receive a real image; swapping requires (a) seeding a local Aftersight instance (no seed script currently exists in the aftersight repo — a gap worth flagging upstream there) or capturing a screenshot from the deployed instance once it clears `/setup`, and (b) a one-line Canvas edit (`is_placeholder: false` + populate the `screenshot` slot with a `canvas:image`). Tracked as a **follow-up task on #276** per the sign-off's own pre-authorized fallback path.
2. **"Now in development — in the open" appears twice** (once in the new pill, once already embedded in the existing verbatim-approved subhead). Cosmetic redundancy, not a functional defect; flagged for O/S to decide whether a follow-up copy-only edit to the subhead (trimming the now-duplicated clause) is wanted — deliberately not resolved unilaterally here since it touches #268's verbatim-copy guarantee.
3. **Sub-phases B and C (social-proof strip + nav weight; feature-anatomy + services relocation) are not built.** Tracked as the scope-cap split's two follow-up issues (to be filed by O) — #276's remaining acceptance criteria (social-proof strip present, feature-anatomy alternating sections, services/logos relocated, nav visually product-first) are NOT yet met and should not be checked off until those sub-phases land.
4. **Pre-existing, unrelated findings carried forward from the S handoff** (not this diff's responsibility, not touched): `.heal-flow` keyboard-inaccessibility (F-A), `.button--primary` light-zone contrast fail sitewide (F-B), axe-core OKLCH abort (F-C). None of these are in the hero region this sub-phase touched.

## Files changed

- `web/themes/custom/performant_labs_v2/components/browser-chrome/browser-chrome.component.yml` (new)
- `web/themes/custom/performant_labs_v2/components/browser-chrome/browser-chrome.twig` (new)
- `web/themes/custom/performant_labs_v2/components/browser-chrome/browser-chrome.css` (new)
- `web/themes/custom/performant_labs_v2/components/code-snippet/code-snippet.component.yml` (new)
- `web/themes/custom/performant_labs_v2/components/code-snippet/code-snippet.twig` (new)
- `web/themes/custom/performant_labs_v2/components/code-snippet/code-snippet.css` (new)
- `web/themes/custom/performant_labs_v2/css/components/hero.css` (modified — appended dev-status pill override + new-component spacing rules)
- `scripts/sprint-wave2-276-hero-rebuild.php` (new — idempotent Canvas assembly script)
- `docs/pl2/css-change-log.md` (modified — 4 new entries)
- `docs/pl2/handoffs/wave2-276/handoff-F.md` (new — this file)
- `docs/pl2/handoffs/wave2-276/shots/hero-360-2026-07-21.png` (new — headless self-check screenshot)
- `docs/pl2/handoffs/wave2-276/shots/hero-768-2026-07-21.png` (new — headless self-check screenshot)
- `docs/pl2/handoffs/wave2-276/shots/hero-1280-2026-07-21.png` (new — headless self-check screenshot)

**Not committed/pushed/PR'd** — per role scope, O handles staging, commit, push, and PR creation from this file list.

---

## Fix-pass (2026-07-21) — A-phase warns F1–F3 resolved

**Trigger:** `docs/pl2/handoffs/wave2-276/handoff-A.md` — PASS (0 blocks), 3 warns to fix before T runs.

### F1 — pill dot `aria-hidden` silently stripped by the filter format

The dot marker was authored as `<div class="pill__dot" aria-hidden="true">` inside the pill's nested `dripyard_base:text` HTML value. The `canvas_html_block` filter's `<div>` allowlist is `class role aria-label style` (per `canvas-update-checklist.md`) — `aria-hidden` is not in it and was silently dropped on save. Handoff-F's claim of "no visual or accessibility difference" was wrong on the accessibility half: the live markup actually rendered `<div class="pill__dot">` with no `aria-hidden`, an empty div a screen reader could (harmlessly, but incorrectly) announce as present.

**Fix (A's preferred option — CSS `::before`, not `role="presentation"`):** removed the marker div entirely from the pill's text-prop HTML (`scripts/sprint-wave2-276-hero-rebuild.php`) and rendered the dot as `.hero.theme--white .hero__block-content > .pill::before` in `hero.css`. This removes the filter-format dependency altogether — there is no markup left to strip, and it also resolves F3 (below) as a side effect, per A's own note that it would.

Corrected the misleading claim: the "Architecture notes for A" section's filter-format discussion is superseded by this fix-pass (the div/filter interaction is no longer relevant since no div exists); this fix-pass section is the authoritative record.

### F2 — hardcoded product copy in a reusable component

`browser-chrome.twig` hardcoded `<strong>Aftersight dashboard — coming soon</strong>`. Added a new optional prop `placeholder_title` to `browser-chrome.component.yml` (documented inline as the A-phase fix), updated the twig to `{{ placeholder_title|default('Screenshot coming soon') }}`, and updated the assembly script to pass `placeholder_title: 'Aftersight dashboard — coming soon'` explicitly as an instance prop rather than relying on the twig default. The component is now copy-agnostic; a future `/aftersight`-page instance (or the eventual real-screenshot swap) can supply its own headline without a template edit.

### F3 — 4-unit selector chain

Mooted by the F1 fix: `.pill__dot` no longer exists as a class on any element (it's a `::before` pseudo-element selector now), so the offending `.hero.theme--white .hero__block-content > .pill .pill__dot` chain is gone. The replacement selector, `.hero.theme--white .hero__block-content > .pill::before`, is still 3 units against the ancestor chain (within the file's existing max) — `::before` is a pseudo-element suffix on the last compound selector, not an additional unit in the adapter's chain-length sense (consistent with how this file already treats `.hero.theme--white .heading` etc. as 2–3-unit chains).

### F4 / F5 (notes, addressed while in the files)

- **F4:** `code-snippet.css`'s `#3A342C` (traffic-light dot fill) now carries an explicit comment documenting it as an intentional non-token decorative value (no `base.css` token matches it — it sits deliberately between `--theme-surface-alt` and `--theme-border-color` for an "unlit chrome" look), rather than reading as an uncited oversight.
- **F5:** Removed the overclaiming "can never silently drift" wording from `code-snippet.css`'s header comment; replaced with an accurate statement that citations mitigate *discovery* of drift, not drift itself. `browser-chrome.css`'s header never contained this exact wording (its WCAG section only claims the figures are "confirmed via computed hex math," which is accurate) — verified via grep, no change needed there.

### Verification after fix-pass

```
$ ddev drush cr && ddev drush php:script scripts/sprint-wave2-276-hero-rebuild.php
canvas_page 20 hero rebuild complete. Component count: 59   [unchanged — same as pre-fix-pass]

# Idempotence — tree-diff (not count), per A's own verification method
$ [dump tree] && [re-run script] && [dump tree] && diff
BYTE-IDENTICAL — idempotence confirmed (new placeholder_title prop encoded
correctly, byte-identical across re-runs)

# T1 — hero renders identically except the intended F1 change
$ diff <(sed 's/tik[a-z0-9]*//g' home-before-fixpass.html) <(sed 's/tik[a-z0-9]*//g' home-after-fixpass.html)
  Only diffs: `<div class="pill__dot"></div>` removed (F1, intended) +
  random aria-labelledby/aria-controls IDs (pre-existing per-render
  randomness, unrelated to this diff, confirmed present in the original
  handoff's own before/after diff too).

# Live computed style of the new ::before dot
{
  "beforeContent": "\"\"",
  "beforeBg": "rgb(142, 74, 42)",    // #8E4A2A, matches documented 6.64:1 ratio exactly
  "beforeWidth": "6px",
  "beforeBorderRadius": "50%"
}

# Blast-radius re-check (selector changed — required per adapter)
$ node cascade-map.cjs "https://performant-labs.ddev.site:8493/"
  375: total escapes = 2, attributable to this diff = 0
  1280: total escapes = 2, attributable to this diff = 0
  (same 2 pre-existing .primary-menu/menu-block escapes as before this
  diff and before the fix-pass — untouched)
VERDICT: PASS. Zero new escapes from the ::before selector or any other
fix-pass change.
```

### Files changed (fix-pass, in addition to the original list above)

- `web/themes/custom/performant_labs_v2/css/components/hero.css` (modified again — `.pill .pill__dot` → `.pill::before`)
- `web/themes/custom/performant_labs_v2/components/code-snippet/code-snippet.css` (modified — F4/F5 comment fixes)
- `web/themes/custom/performant_labs_v2/components/browser-chrome/browser-chrome.component.yml` (modified — new `placeholder_title` prop)
- `web/themes/custom/performant_labs_v2/components/browser-chrome/browser-chrome.twig` (modified — consumes `placeholder_title` prop instead of hardcoded copy)
- `scripts/sprint-wave2-276-hero-rebuild.php` (modified — drops the `pill__dot` div from the pill's text-prop HTML; passes `placeholder_title` explicitly)

**Not committed/pushed** — per role scope, committing this fix-pass on `feat/276-product-led-homepage` (small commit, explicit paths, `Co-Authored-By` trailer) and pushing (feeds PR #283) is the next step, done immediately after this handoff update per the coordinator's instruction.

---

## Fix-pass 2 (2026-07-22) — sitewide `.button--primary` AA failure (T finding W-1 / issue #280), André's binding ruling

**Trigger:** coordinator relay of André's ruling on T's W-1 finding (`docs/pl2/handoffs/wave2-276/handoff-T.md`): fix `.button--primary`'s sitewide AA failure at the **token layer** — all primary buttons become terracotta-deep `#8E4A2A` + white text (6.64:1), replacing the failing white-on-teal (2.21:1). This also delivers the approved wireframe's hero-CTA spec (`docs/pl2/keytail-design/wireframe-276/RATIONALE.md` — same value, not a coincidence).

### Trace (7-step workflow)

**Bottom-up (`.button--primary` resting bg):**
```
.button--primary { background-color: var(--button-background-color) }
  [dripyard_base/components/button/css/button-primary.css]
--button-background-color: var(--pl-primary-light)
  [performant_labs_v2/css/components/button.css:59 — L5 override via
  libraries-extend on core/components.dripyard_base--button]
--pl-primary-light: #62BBCB
  [performant_labs_v2/css/base.css :root]
Live-computed (pre-fix): rgb(98,187,203) on white text rgb(255,255,255) = 2.21:1 — FAIL AA.
```

**Top-down eligibility:**
- L1 — not config-driven. RULED OUT.
- L2 — not OKLCH-derived. RULED OUT.
- L3 — `--pl-primary-light` is a `:root` token. Grepped every consumer sitewide: **exactly one** (`button.css:59`, `.button--primary`'s resting bg). Redefining the token at its `:root` definition site is safe and precise — no other surface can be silently recolored by this change. **CORRECT LAYER — this is the token-layer fix André specified**, not a per-instance CSS override.
- L5 (button.css) — only consumes the token (`var(--pl-primary-light)`), unchanged; the fix lives at the token's definition (`base.css`), per the ruling's explicit instruction.

**Breadcrumb (`/services` 3.12:1 finding, issue #280):** traced independently — **different token family**. `.breadcrumb__link` consumes `--breadcrumb-link-color` → `--theme-link-color` → `--pl-primary` (`#1893b4`), NOT `--pl-primary-light`. `--theme-link-color`/`--pl-primary` is the **shared inline-link color for every white/light/secondary-zone `<a>` sitewide** (already documented in `base.css` as a separately pre-approved 3.5:1 deviation for inline links). Retargeting that shared token would recolor every inline link on the site — an unapproved, out-of-scope blast radius far beyond the breadcrumb finding. Instead: overrode the breadcrumb SDC's **own** component-scoped custom property, `--breadcrumb-link-color` (dripyard_base's breadcrumb.css already exposes this as a per-component indirection layer, not a re-declaration of the shared token) — new L5 file (`css/components/breadcrumb.css`) + new `libraries-extend` entry on `core/components.dripyard_base--breadcrumb`. Scoped to `.breadcrumb` only; zero effect on any other link.

### Changes

1. **`css/base.css`** — `--pl-primary-light: #62BBCB` → `--pl-primary-light: var(--pl-accent-deep)` (`#8E4A2A`), with a dated comment explaining the ruling, the single-consumer safety argument, and the coincidental alignment with the wireframe's CTA spec.
2. **`css/components/button.css`** — `.button--primary`'s hover/active states rederived from `--pl-accent-deep` via `color-mix(in oklch, var(--pl-accent-deep) 85%/75%, black)` (matching this codebase's existing `color-mix()` precedent in `footer.css`) rather than hardcoding a fourth brand hex or reusing the old (now-removed) `--pl-primary` teal for hover. Dark/black-zone and primary-zone `.button--primary` variants are untouched (independent token sources — `--theme-link-color` and hardcoded white/cream respectively — verified unaffected).
3. **`css/components/breadcrumb.css`** (new) — `.breadcrumb { --breadcrumb-link-color: var(--pl-accent-deep) }`, full trace in the file's own header comment.
4. **`performant_labs_v2.info.yml`** / **`performant_labs_v2.libraries.yml`** — new `libraries-extend` entry wiring `core/components.dripyard_base--breadcrumb` → `performant_labs_v2/breadcrumb` → `css/components/breadcrumb.css` (same pattern as every other L5 component override in this theme).
5. **`docs/pl2/css-change-log.md`** — 3 new entries.

### Contrast table (all live-rendered, headless Chromium `getComputedStyle()` + canvas sRGB readback — not just the source-CSS literal)

| Element / state | Foreground | Background | Ratio | Verdict |
|---|---|---|---|---|
| `.button--primary` resting (hero CTA, live) | `#FFFFFF` | `#8E4A2A` | 6.64:1 | AA/AAA pass |
| `.button--primary` hover (live `:hover`, headless) | `#FFFFFF` | `#804225` | 7.71:1 | AAA pass |
| `.button--primary` active (live `:active`, headless mousedown) | `#FFFFFF` | `#68351C` | 9.93:1 | AAA pass |
| `.button--primary` dark/black-zone (unchanged, independent token) | `#1F1A14` | `#5DC6E8` | 8.81:1 | AAA pass (no change) |
| `.button--primary` primary-zone (unchanged, hardcoded) | `#1F1A14` | `#FFFFFF` | 17.27:1 | AAA pass (no change) |
| Breadcrumb link, `/services` (live, resolves against cream ancestor bg) | `#8E4A2A` | `#F5EFE2` | 5.79:1 | AA/AAA pass |
| Breadcrumb link on white (computed, other pages) | `#8E4A2A` | `#FFFFFF` | 6.64:1 | AA/AAA pass |
| Breadcrumb link hover (unchanged — `--breadcrumb-link-color-hover` untouched) | `#005AA0` | `#FFFFFF` | 7.07:1 | AAA pass (no change) |

**Methodology note (live vs. isolated-string measurement):** the hover/active `color-mix(in oklch, ...)` figures were first measured by evaluating the isolated CSS string in a bare probe element (`#713A20` / `#5F2F19`), then cross-checked against the actual `:hover`/`:active`-triggered `getComputedStyle()` on the real button (`#804225` / `#68351C`). The two methods differ by a few percent — an oklch→sRGB rounding nuance Chromium applies slightly differently depending on cascade context — so the **live-triggered figures are the ones documented**, since they're what a real user's browser actually paints. Both methods pass AAA regardless; the discrepancy never threatened the pass/fail verdict.

### Verification performed (Tier-2 re-check across all mandated surfaces)

```
$ ddev drush cr   [between each change, per instruction]

# Blast-radius gate (token change — mandatory)
$ node cascade-map.cjs "https://performant-labs.ddev.site:8493/"
  home 375/1280: 2 escapes each (pre-existing .primary-menu/menu-block, unrelated)
$ node cascade-map.cjs "https://performant-labs.ddev.site:8493/services"
  services 375/1280: 5 escapes each — cross-checked against a git-stashed
  BASELINE re-run (pre-token-fix): also exactly 5, same selectors
  (.dy-section--cta-pair, .dy-section--centered-white, .primary-menu — all
  layout props: flex-basis/width/max-width/text-align/display/align-items,
  NONE touch background-color/color or any token this fix changed).
  ZERO NEW ESCAPES attributable to this diff on either page.
VERDICT: PASS.

# Tier-2 computed-style contrast sweep — 5 pages × 2 viewports (360/1280)
Surfaces checked: hero CTA (/), /services buttons + breadcrumb, /contact-us
submit + secondary CTA, /aftersight CTAs, one article page
(/articles/retrofit-walkthrough). All measured .button--primary instances
across all 5 pages: #8E4A2A bg + white text, 6.64:1, PASS. No FAIL verdicts
found anywhere. Full raw JSON output captured during the session.

# Terracotta-on-terracotta / same-color sweep (automated, all 5 pages)
Euclidean-distance same-color detector (bg vs fg, threshold 30) run against
every leaf text node on /, /services, /contact-us, /aftersight, and the
article page — ZERO matches. No surface renders illegibly.

# Touch targets (unaffected — color-only change, sanity-checked anyway)
Hero primary CTA at 360px: 317×44px box — unchanged, still ≥44px.

# Screenshots to disk (360 + 1280, all 5 pages)
docs/pl2/handoffs/wave2-276/shots-token-fix/
  homepage-hero-{360,1280}-2026-07-22.png
  services-{360,1280}-2026-07-22.png
  contact-us-{360,1280}-2026-07-22.png
  aftersight-{360,1280}-2026-07-22.png
  article-{360,1280}-2026-07-22.png
```

### Files changed (fix-pass 2)

- `web/themes/custom/performant_labs_v2/css/base.css` (modified — `--pl-primary-light` token redefinition)
- `web/themes/custom/performant_labs_v2/css/components/button.css` (modified — hover/active derivation, corrected comments)
- `web/themes/custom/performant_labs_v2/css/components/breadcrumb.css` (new)
- `web/themes/custom/performant_labs_v2/performant_labs_v2.info.yml` (modified — new `libraries-extend` entry)
- `web/themes/custom/performant_labs_v2/performant_labs_v2.libraries.yml` (modified — new `breadcrumb` library)
- `docs/pl2/css-change-log.md` (modified — 3 new entries)
- `docs/pl2/handoffs/wave2-276/shots-token-fix/*.png` (new — 10 screenshots, 5 pages × 2 viewports)

**Not merged** — committing on `feat/276-product-led-homepage` (explicit paths, `Co-Authored-By` trailer), pushing to feed PR #283, commenting on #280 (fix + evidence + "fixes #280 pending merge") and briefly on #276, per the coordinator's instruction.
