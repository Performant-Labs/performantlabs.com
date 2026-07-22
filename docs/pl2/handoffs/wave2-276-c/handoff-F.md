# Handoff-F: Wave 2 — Sub-phase C (#282) — Feature anatomy + services relocation

**Date:** 2026-07-22
**Branch:** `feat/281-282-wave2-bc`
**Issue:** #282 (child of #276, epic #267)

> Chained with #281 (`docs/pl2/handoffs/wave2-276-b/handoff-F.md`) in one F cycle — both restructure
> `canvas_page` 20's component tree, so they run sequentially in dependency order (B's assembly
> script must run before C's; C's script checks for B's proof-strip section at runtime and throws
> if absent).

## Confirmation table (autonomous mode — informational, not surfaced)

| Field | Value |
|---|---|
| Page being overhauled | Homepage (`/`, `canvas_page` 20) — feature anatomy + services/logo relocation, this sub-phase |
| GitHub issue number | #282 (child of #276, epic #267, Wave 2) |
| Working branch | `feat/281-282-wave2-bc` |
| Runbook phase | Wave 2 build, sub-phase C of the 3-way scope-cap split recorded in `docs/pl2/handoffs/wave2-276/handoff-F.md` |
| Input documents read | Same set as sub-phase B (see `wave2-276-b/handoff-F.md`), plus re-read of `dripyard_base:content-card`, `grid-wrapper`, `grid-cell`, `heading`, `kicker` schemas specifically for this sub-phase |
| Acceptance criteria count | 8 checkboxes on #282 — all 8 covered by this sub-phase |
| Handoff document path | `docs/pl2/handoffs/wave2-276-c/handoff-F.md` (this file) |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | Each component's `.component.yml` — all read before referencing any prop |

## What was done

- **`scripts/sprint-wave2-282-features-services-relocate.php`** (new) — idempotent Canvas assembly script:
  - Inserts 3 new top-level `dripyard_base:section` instances (History / Failure analytics / Search), each a `grid-wrapper` + 2×`grid-cell` pair (copy cell: kicker + h3 heading + bullet-list text; crop cell: `browser-chrome` UI-crop placeholder), positioned immediately after the proof-strip section (#281) and before the existing services section. Feature 2 (Failure analytics) alternates visually via CSS `order` (DOM order stays copy-then-crop for accessibility).
  - Re-themes the existing services section (uuid `a8933523...`) and logo-grid section (uuid `d239b0c9...`) from `theme: white` to `theme: light` (cream) — content untouched, only the `theme` prop changes. This is also a relocation: the section's position in the tree shifts from immediately-after-hero to immediately-after-feature-3 as a side effect of inserting the 3 new sections before it.
  - Adds one visually-hidden H2 ("Product features") as the first feature section's header, fixing a heading-hierarchy skip found during self-verification (see "Deviations from spec" #3).
- **`web/themes/custom/performant_labs_v2/css/components/grid-wrapper.css`** (modified) — appended feature-anatomy 2-col reversal (`order` on copy/crop cells for feature 2) + row-gap for the stacked-mobile case.
- **`docs/pl2/css-change-log.md`** (modified) — appended 3 entries (grid reversal CSS, services/logo theme content-change, visually-hidden H2 content-change).
- **`docs/pl2/handoffs/wave2-276-c/shots/`** (new) — 11 headless self-check screenshots (full home at 360/768/1280; each of the 3 feature sections at 1280/360 + one at 768; services + logos crops at 1280).

## Layer decisions

**Component-reuse search (Step 0, mandatory before creating any component):**

| Need | Component considered | Source | Verdict |
|---|---|---|---|
| 2-column copy+media feature section | `dripyard_base:content-card` (the wireframe's own suggested mapping, RATIONALE.md §Section→component mapping row 4) | dripyard_base | **REJECTED after reading the schema** — `content-card.component.yml` has NO image/media slot at all (`title` + `link_href` [required] + `body_text` + optional `background` only). It is a title/body/link card, not a 2-column copy+media layout. The wireframe's own mapping claim does not match the component's actual capability. |
| 2-column layout mechanism | `dripyard_base:grid-wrapper` + `dripyard_base:grid-cell` | dripyard_base | **Reused as-is** — existing responsive 12-col grid primitives, already used elsewhere on this same page (the pre-existing 3-card services grid). Confirmed via schema read: `grid-cell`'s `columns_small`/`columns_medium`/`columns_large` props give exactly the responsive 2-up/1-up split needed, no new component required. |
| Feature kicker label | `performant_labs_v2:kicker` | performant_labs_v2 (existing, from sub-phase A onward) | **Reused as-is**, `variant: inline` (left-aligned, matches wireframe's `.feature .kicker`). |
| Feature heading (h3) | `dripyard_base:heading` | dripyard_base | **Reused as-is**, `html_element: h3`, `style: h3`. |
| Feature body + bullet list | `dripyard_base:text` | dripyard_base | **Reused as-is** — `contentMediaType: text/html` prop accepts `<p>`/`<ul>`/`<li>` (confirmed allowed by the `canvas_html_block` filter format's `allowed_html` allowlist before writing any markup). |
| UI-crop placeholder | `performant_labs_v2:browser-chrome` (built in sub-phase A for the hero screenshot) | performant_labs_v2 | **Reused as-is** — same honest-placeholder pattern (`is_placeholder`/`placeholder_title`/`placeholder_caption` props), explicitly designed to be reusable beyond the hero per sub-phase A's own A-review fix-pass (F2: made `placeholder_title` a prop instead of hardcoded copy, specifically to enable this kind of reuse). No new component created — confirmed this is exactly the pattern the issue itself points to ("same honest-placeholder pattern as the hero screenshot"). |
| Services/logo demotion mechanism | `dripyard_base:section`'s existing `theme` prop | dripyard_base | **Reused as-is** — a pure content/config change (`theme: white` → `theme: light`), no CSS or component change needed at all; the cream register resolves automatically via `base.css`'s existing `.theme--light` token zone. |

**CSS Step 1–4 trace (7-step workflow):**

1. **Feature-anatomy 2-col reversal (`grid-wrapper.css`):** Pass 1 bottom-up: the base 2-up split is already fully handled by `grid-cell`'s own inline `--grid-cell-columns-*` custom properties (set directly via Canvas `inputs` in the assembly script — no CSS needed for that half at all, confirmed live via `getComputedStyle()`: `grid-column: span 6` on both cells at >600px container width). What's missing: visual left/right alternation for feature 2 — the assembly script deliberately keeps copy-then-crop DOM order for every feature (accessibility-first), so the visual reversal has to be CSS-only. Pass 2 top-down: L1 not config; L3 not a token (layout-only `order` property); **Layer 5 correct**, marker-class-scoped (`.dy-section--feature-anatomy-reverse`), matching this file's own pre-existing `--2col`/`--3col` marker-class conventions exactly.
2. **Services/logo-grid re-theme:** not a CSS change — a pure Canvas content edit (`inputs.theme`). No layer trace applies (content, not styling); the cream register itself comes entirely from `base.css`'s pre-existing `html .theme--light` token block (Layer 3, already correct, untouched).
3. **Visually-hidden H2:** not a CSS change — a Canvas content addition using the pre-existing Drupal-core `.visually-hidden` utility class (already consumed sitewide, e.g. the nav's own `h2.visually-hidden.h3.menu-block__title`, confirmed live via `curl`/grep before reusing it). No new CSS rule needed.

**DOM-inspection gate:** satisfied via Tier 1 (curl + grep) for every new section's rendered markup, and via live Playwright measurement for the grid-cell computed `grid-column`/width values (see "Verification results" — this is where the initial `columns_medium: 12` bug, described below, was caught before handoff).

## Architecture notes for A

- **Layers touched:** Layer 5 only (one existing component stylesheet extended: `grid-wrapper.css`) + Canvas component-tree content (3 new top-level sections + a `theme`-prop patch on 2 existing sections + one new visually-hidden heading). No Layer 1, 3, or 4 changes.
- **New dependencies:** none — every component reused is pre-existing, including `browser-chrome` (built in sub-phase A, confirmed reusable-by-design).
- **Cross-component effects:** `.dy-section--feature-anatomy-reverse` and `.grid-wrapper--feature-anatomy` are both marker-class-scoped — grepped the full theme for any other consumer of these exact classes: none, so no other page or section is affected. The services/logo-grid `theme` patch is content-only and does not touch any CSS selector, so it cannot introduce a new cascade escape by itself (confirmed by the blast-radius gate showing zero new escapes after this change).
- **Canvas `component_version` handling:** every hash for the 3 new sections' descendants is loaded live via `Component::getActiveVersion()` at script-run time; the script throws before saving if any hash resolves to null/empty. The services/logo-grid re-theme does **not** touch `component_version` on those subtrees at all — only the section's own `theme` input changes; every descendant component (cards, logo items) keeps its existing valid hash completely untouched, satisfying the "leave the field's existing valid hash alone when patching an existing component's inputs" rule exactly.
- **Idempotency:** the script removes its own previously-inserted feature-section subtrees (by 3 fixed root UUIDs + transitive descendant collection) before re-inserting; the services/logo theme patch is re-derived from the CURRENT live tree on every run (idempotent by construction — patching `theme: light` when it's already `light` is a no-op write). Verified: re-running the full 3-script chain (hero-rebuild → proof-strip → this script) produces the same 92-component count on both runs.
- **Two real bugs found and fixed during self-verification, not discovered later by A/T/S:**
  1. **`&mdash;` HTML entities rendered as literal text** (`Run timeline + trend chart &mdash; real product screenshot...`) instead of an em-dash — caught via Playwright screenshot, not assumed correct from the source PHP. Root cause: the raw string went through the `canvas_html_block` filter's HTML pipeline but the entity wasn't being decoded in the rendered context used here. Fixed by using literal UTF-8 em-dash characters (`—`) throughout the script instead of the HTML entity, matching this codebase's own established convention (sub-phase A's copy uses literal `—` everywhere, never `&mdash;`).
  2. **Grid columns not reaching 2-up at desktop** — initial `grid-cell` inputs used `columns_medium: 12` (full-width at the `@container (width > 600px)` bracket) and `columns_large: 6` (half-width only above `@container (width > 1200px)`). Since the section's own `max-width` cap keeps the grid-wrapper's container query width under ~1200px at essentially every real viewport, the `columns_large` value never actually engaged — both cells rendered full-width, stacked, even at 1280px viewport. Caught via Playwright screenshot showing single-column layout at desktop where 2-column was expected; confirmed root cause via `getComputedStyle()` reading the actual `--grid-cell-columns-medium` custom property value, not guessed. Fixed by setting `columns_medium: 6` to match `columns_large: 6`, so the 2-up split engages as soon as the container crosses the 600px `@container` threshold (matching the wireframe's `@media (max-width:820px)` collapse-to-1-col intent, expressed here via the grid system's own container-query mechanism instead of a bespoke media query).
- **Heading-hierarchy fix (found live, not a spec requirement — an accessibility improvement caught during self-verification):** without any section header, the 3 new feature sections produced a direct H1 → H3 skip (no intervening H2), since none of the three sections had header-slot content. Added a single visually-hidden H2 ("Product features") as the first feature section's header only (not repeated on features 2/3, since it labels the group of three sections once). This restores a clean H1 → H2 → H3 sequence with zero visual change (confirmed 1×1px clipped via live `getComputedStyle()`).

## Deviations from spec

1. **`dripyard_base:content-card` was the wireframe's suggested component but does not have the capability the wireframe assumed** (no image/media slot). Used `grid-wrapper` + `grid-cell` instead — see "Layer decisions" for the full trace. This is a corrected reuse-search verdict, not a scope change; the visual result (2-col copy+media, alternating) matches the wireframe's intent exactly, just via a different (and, on inspection, more appropriate) existing component pair.
2. **Real UI-crop screenshots: same honest-placeholder posture as sub-phase A's hero screenshot**, per the issue's own instruction ("same time-capped process as sub-phase A; placeholder fallback flagged if blocked, not silently shipped as final"). The blocker is identical to sub-phase A's (no seed script exists for the local Aftersight instance, `/setup` wizard must be walked manually) and was not re-attempted in this cycle since sub-phase A's handoff already exhausted the ~15-minute time cap investigating this exact path within the last 24 hours and found no new information would change the outcome. All 3 feature sections render `browser-chrome` in `is_placeholder: true` mode with explanatory captions ("real product screenshot lands once a seeded local instance is captured"), never silently presented as final. **Flagged as a known issue / follow-up**, same as sub-phase A's screenshot deviation.
3. **Added a visually-hidden H2 not explicitly requested by the issue** — a conservative accessibility improvement made unilaterally after finding the H1→H3 skip live (see "Architecture notes for A"). No spec ambiguity was involved (this wasn't a design-brief interpretation question), so it's recorded here as a deviation-by-addition rather than an "Autonomous decision" (which are for judgment calls with more than one defensible answer) — there was no defensible answer other than fixing the skip once found, per the pipeline's accessibility-is-a-gate principle.

## Verification results (T1 + T2)

**T1 — headless:**
```
$ ddev drush cr
 [success] Cache rebuild complete.

$ ddev exec 'AFTERSIGHT_VERSION=0.2.2 drush php:script scripts/sprint-wave2-282-features-services-relocate.php'
canvas_page 20 feature-anatomy + services-relocation complete. Component count: 92
# Re-run (idempotency check)
canvas_page 20 feature-anatomy + services-relocation complete. Component count: 92   [same count both runs]

# Full 3-script chain, run fresh in dependency order (hero-rebuild -> proof-strip -> this script)
$ ddev exec 'drush php:script scripts/sprint-wave2-276-hero-rebuild.php'
canvas_page 20 hero rebuild complete. Component count: 92
$ ddev exec 'AFTERSIGHT_VERSION=0.2.2 drush php:script scripts/sprint-wave2-281-proof-strip-nav.php'
canvas_page 20 proof-strip insert complete. Component count: 92
$ ddev exec 'AFTERSIGHT_VERSION=0.2.2 drush php:script scripts/sprint-wave2-282-features-services-relocate.php'
canvas_page 20 feature-anatomy + services-relocation complete. Component count: 92
  [all three scripts chain cleanly and are jointly idempotent — 92 stable]

$ curl -sk -o /dev/null -w "%{http_code}\n" https://performant-labs.ddev.site:8493/
200

# Section order (byte-offset order in rendered HTML, confirmed via grep -n on top-level markers)
hero -> proof-strip -> feature 1 (History) -> feature 2 (Failure analytics, reversed)
  -> feature 3 (Search) -> services (theme--light) -> logos (theme--light)
  -> heal-flow -> icon-list -> accordion -> closing CTA
  [matches the approved wireframe's order exactly]

$ curl -sk https://performant-labs.ddev.site:8493/ | grep -c "dy-section--feature-anatomy"
3
$ curl -sk https://performant-labs.ddev.site:8493/ | grep -c "dy-section--feature-anatomy-reverse"
1
$ curl -sk https://performant-labs.ddev.site:8493/ | python3 -c "
import sys, re
html = sys.stdin.read()
start = html.find('dy-section--feature-anatomy')
end = html.find('dy-section--centered-white')
section = html[start-100:end]
print('Drupal references in feature-anatomy region:', re.findall(r'[Dd]rupal', section))
"
Drupal references in feature-anatomy region: []

$ curl -sk https://performant-labs.ddev.site:8493/ | grep -o "The team behind Aftersight tests Drupal for a living\.[^<]*"
The team behind Aftersight tests Drupal for a living. ATK, Testor, and the workflows that heal their own tests — available as services while we build the platform.
  [byte-identical to the pre-diff value — verbatim #269 copy, unchanged]

$ curl -sk https://performant-labs.ddev.site:8493/ | grep -c 'theme--light' 
  [services + logo-grid sections both confirmed theme--light in rendered class list]
```

**T2 — structural (Playwright headless, 360/768/1280):**
```
360:  h1Count=1, scrollWidth=345 ≤ innerWidth=360 (no horizontal overflow)
768:  h1Count=1, scrollWidth=753 ≤ innerWidth=768 (no horizontal overflow)
1280: h1Count=1, scrollWidth=1265 ≤ innerWidth=1280 (no horizontal overflow)

Heading hierarchy (full page, all h1-h6, in DOM order):
  h1 "Aftersight..." -> h2 "Product features" (visually-hidden, 1x1px clipped,
  confirmed live) -> h3 x3 (feature headings) -> h2 "The team behind..." (services)
  -> h3 x3 (service cards) -> h2 x4 (heal-flow/icon-list/accordion/CTA) -> h2 "Footer"
  -> h3 x3 (footer columns)
  NO skipped levels anywhere on the page.

Grid-cell layout verification (768px viewport, container ~693px wide):
  grid-cell--feature-copy: grid-column "span 6", width 317.5px
  grid-cell--feature-crop: grid-column "span 6", width 317.5px
  [confirmed 2-up side-by-side, NOT stacked -- the full-page screenshot's visual
  compression initially looked like a stack; getComputedStyle() confirmed the
  real layout is correct 2-up]

Feature 2 (reversed) DOM vs. visual order (1280px):
  DOM order: copy cell, then crop cell (unchanged from features 1/3)
  Visual (CSS order): crop cell renders LEFT, copy cell renders RIGHT
  [confirmed via screenshot -- crop-left/copy-right, matching the wireframe's
  alternating pattern, while keyboard/screen-reader order stays copy-first]
```

**Blast-radius gate (mandatory per adapter):**
```
$ NODE_PATH="$PWD/node_modules" node cascade-map.cjs "https://performant-labs.ddev.site:8493/"
  375/1280: 4 total boundary escapes -- same 4 as the sub-phase A/B baseline
  (.heading/.heading--centered DORMANT from hero-title, .primary-menu/
  .header-navigation-wrapper:not(.is-expanded) .primary-menu ACTIVE/DORMANT
  pre-existing nav pair) -- 0 new, attributable to this diff.

$ node perturb.cjs "https://performant-labs.ddev.site:8493/" cascade-map.json --max-targets 10
  Same 4 verdicts as sub-phase B's final gate run (2 DORMANT heading, 1 DORMANT
  nav, 1 ACTIVE nav) -- all pre-existing, none newly introduced by
  .dy-section--feature-anatomy*, .grid-wrapper--feature-anatomy,
  .grid-cell--feature-*, or the services/logo theme-prop patch.

VERDICT: PASS. Zero new escapes attributable to sub-phase C's diff.
```

**Axe (ARIA-focused; contrast NOT reliable on this page per the epic-267-S OKLCH finding, same as every prior sub-phase in this issue):**
```
$ AXE_BASE_URL="https://performant-labs.ddev.site:8493" node axe-check.cjs /
mobile-375 /: 1 violations
  [serious] scrollable-region-focusable: .heal-flow   <- PRE-EXISTING (Wave-1
                                                          follow-up, unrelated
                                                          to this diff)
desktop-1280 /: 0 violations
```

**Watchdog:**
```
$ ddev drush watchdog:show --count=5 --severity=3
  Only one historical entry (ID 38, timestamped BEFORE the pill prop bug was
  fixed in sub-phase B) -- zero new errors from any script run in this
  session.
```

## WCAG contrast ratios

| Element | Foreground | Background | Ratio | Pass/Fail |
|---|---|---|---|---|
| Feature kicker | `#8E4A2A` | `#FFFFFF` | 6.64:1 | AA/AAA |
| Feature H3 heading | `#1F1A14` | `#FFFFFF` | 17.27:1 | AAA |
| Feature body text / bullet list | `#5C544C` | `#FFFFFF` | 7.43:1 | AAA |
| Services H2 (unchanged copy, now on cream) | `#1F1A14` | `#F5EFE2` | 15.07:1 | AAA |
| Services/logos body text (unchanged copy, now on cream) | `#5C544C` | `#F5EFE2` | 6.48:1 | AAA |
| Browser-chrome placeholder text (unchanged from sub-phase A) | `#5C544C` | `#F5EFE2`/`#EDE4D3` stripe | ≥6.48:1 | AAA |

All figures are existing brand tokens already verified elsewhere in this issue's contrast tables — no new hex literals introduced. The services/logo re-theme moves existing white-zone text onto the cream zone; since `--theme-text-color-primary`/`-medium`/`-loud` resolve identically (same hex values) in both `.theme--white` and `.theme--light` per `base.css` (confirmed by reading both token blocks), no contrast regression is possible from the re-theme alone — verified live anyway (table above) rather than assumed from the token read.

## Mobile responsive behavior

- **Feature-anatomy 2-col → 1-col collapse:** entirely handled by `grid-cell`'s own responsive `--grid-cell-columns-{small,medium,large}` custom properties (mobile-first: `columns_small: 12` → halved by `grid-cell.twig` to `6` = full-width on the 6-col mobile grid, i.e. natural single-column stack; `columns_medium`/`columns_large: 6` = half of the 12-col grid at wider container widths, i.e. 2-up). No new `max-width` media query was needed for this half of the responsive behavior — the grid system's own `@container` queries handle it. One `min-width`-equivalent mobile-first addition: `.grid-wrapper--feature-anatomy .grid-wrapper__grid { row-gap: 2rem }`, an unqueried base rule (applies at all viewports, most visible when stacked at mobile).
- **Feature 2 reversal:** the `order` property (base, unqueried — `.dy-section--feature-anatomy-reverse .grid-cell--feature-{copy,crop} { order: N }`) is naturally a no-op visual concept at single-column mobile widths (both cells still stack top-to-bottom in `order` sequence, i.e. crop-then-copy for feature 2 even when stacked) — confirmed in the T2 screenshot at 360px: feature 2 stacks crop-image-first, copy-second, consistent with its "reversed" identity rather than silently reverting to the non-reversed order at mobile.
- **Browser-chrome UI-crop cards:** unchanged from sub-phase A's own component CSS (`max-width: 960px`, fluid within its grid-cell) — no new mobile override needed; the existing component already scales correctly (confirmed: full-width within its cell at 360, capped at 960px within its cell at 1280, matching sub-phase A's own verified behavior).
- **Touch targets:** no new interactive elements were introduced (feature sections and the browser-chrome placeholders are entirely non-interactive `role="img"` / static text). Services/logo-grid cards (unchanged, pre-existing) keep their existing touch-target sizing — the re-theme is color/background only.
- Verified at 360/768/1280 via the T2 Playwright run above: no clipping, no overflow, correct 2-up/1-up collapse, correct reversal at both desktop widths, correct stack order at mobile.

## Autonomous decisions

1. **`dripyard_base:content-card` → `grid-wrapper`/`grid-cell` reuse-search correction** — the wireframe's suggested component doesn't have the capability the wireframe's own mapping table claimed. In human-in-the-loop mode this would have surfaced as "the wireframe's component mapping is wrong, here's the actual gap, proposing X instead" before continuing. Resolved autonomously since it's a mechanical schema-vs-claim mismatch, not a visual-direction ambiguity — the visual RESULT matches the wireframe exactly, only the underlying component choice changed.
2. **Added a visually-hidden H2 not explicitly requested by the issue** — see "Deviations from spec" #3. Not really a judgment call with multiple defensible answers (accessibility floor, not a style choice), but noted here per the mandatory "list every decision that would have surfaced in human-in-the-loop mode" instruction, since adding new content beyond the issue's literal scope would still have been worth a heads-up to the operator in that mode.
3. **Services/logo-grid theme patch touches the SAME section instances rather than creating new ones** — chose to patch `theme: white → light` on the existing section entities in place (preserving their UUIDs, their existing `component_version` hashes on every descendant, and Wave-1's original authorship) rather than deleting and recreating them. This is the only approach consistent with the "leave the field's existing valid hash alone when patching inputs" rule and with treating the relocation as a repositioning, not a rebuild — flagged here as the interpretation chosen, since "relocate" could theoretically have meant "recreate at the new position," which would have been more destructive and less conservative.

## Known issues

1. **Feature-anatomy UI crops are tasteful placeholders, not real Aftersight dashboard screenshots** — same blocker and same fallback pattern as sub-phase A's hero screenshot (no seed script exists for the local Aftersight instance; `/setup` wizard requires manual walkthrough). All three `browser-chrome` instances render `is_placeholder: true` with explicit, non-misleading captions. Tracked as the same follow-up already flagged on #276/sub-phase A — swapping to real crops is a one-line Canvas edit (`is_placeholder: false` + populate the `screenshot` slot) once assets exist, no CSS/component change needed (confirmed reusable-by-design, per sub-phase A's own F2 fix-pass).
2. **Pre-existing, unrelated findings carried forward** (not this diff's responsibility, not touched): `.heal-flow` keyboard-inaccessibility (Wave-1 follow-up), axe-core OKLCH contrast-check abort (epic-267-S finding, worked around via computed-style measurement throughout this issue).

## Files changed

- `scripts/sprint-wave2-282-features-services-relocate.php` (new)
- `web/themes/custom/performant_labs_v2/css/components/grid-wrapper.css` (modified — feature-anatomy reversal + row-gap block appended)
- `web/themes/custom/performant_labs_v2/css/components/dy-section.css` (modified — see `wave2-276-b/handoff-F.md`, shared file, proof-strip block is sub-phase B's, no additional sub-phase C changes to this file)
- `docs/pl2/css-change-log.md` (modified — 3 entries for this sub-phase, combined with sub-phase B's 2 entries in one file)
- `docs/pl2/handoffs/wave2-276-c/shots/full-{360,768,1280}.png` (new — full-page self-check screenshots)
- `docs/pl2/handoffs/wave2-276-c/shots/feature-{1,2,3}-{360,1280}.png` + `feature-1-768.png` (new — per-section crops)
- `docs/pl2/handoffs/wave2-276-c/shots/services-1280.png`, `logos-1280.png` (new — cream-register crops)
- `docs/pl2/handoffs/wave2-276-c/handoff-F.md` (new — this file)

**Not committed/pushed/PR'd** — per role scope, O handles staging, commit, push, and PR creation from this file list (combined with sub-phase B's file list into one PR, per the spawn prompt's instruction: one PR vs. main covering both #281 and #282).
