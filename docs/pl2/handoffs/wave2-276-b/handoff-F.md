# Handoff-F: Wave 2 — Sub-phase B (#281) — Social-proof strip + nav visual weight

**Date:** 2026-07-22
**Branch:** `feat/281-282-wave2-bc`
**Issue:** #281 (child of #276, epic #267)

> This F cycle covers **both** #281 (this file) and #282 (`docs/pl2/handoffs/wave2-276-c/handoff-F.md`),
> chained in one agent session because both restructure `canvas_page` 20's component tree and
> parallel saves would clobber. Sub-phase B ran first; sub-phase C's assembly script depends on
> B's proof-strip section already existing (checked at runtime, throws if missing).

## Confirmation table (autonomous mode — informational, not surfaced)

| Field | Value |
|---|---|
| Page being overhauled | Homepage (`/`, `canvas_page` 20) — social-proof strip + nav weight, this sub-phase |
| GitHub issue number | #281 (child of #276, epic #267, Wave 2) |
| Working branch | `feat/281-282-wave2-bc` |
| Runbook phase | Wave 2 build, sub-phase B of the 3-way scope-cap split recorded in `docs/pl2/handoffs/wave2-276/handoff-F.md` |
| Input documents read | `feature-implementor.md` + `principles.md` (playbook core), `drupal-canvas-sdc.md` adapter, `frontend-pipeline-profile.md`, `canvas-update-checklist.md`, `wireframe.html` + `RATIONALE.md`, issue #281 + #282 + #276 (body + all 12 comments), prior sub-phase A handoffs (`handoff-F.md` incl. all 4 fix-passes, `handoff-A.md`, `handoff-T.md`, `handoff-S.md`) |
| Acceptance criteria count | 6 checkboxes on #281 — all 6 covered by this sub-phase |
| Handoff document path | `docs/pl2/handoffs/wave2-276-b/handoff-F.md` (this file) |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | Each component's `.component.yml` under `web/themes/dripyard_themes/{dripyard_base,neonbyte}/components/` and `web/themes/custom/performant_labs_v2/components/` — all read before referencing any prop |

## What was done

- **`scripts/sprint-wave2-281-proof-strip-nav.php`** (new) — idempotent Canvas assembly script: inserts a new top-level `dripyard_base:section` (theme=light, cream register) immediately after the hero and before the services section, containing a `dripyard_base:flex-wrapper` row of 3 proof items (stars/watchers/version, each `dripyard_base:text` — see "Layer decisions" for why not `statistic`) + a `dripyard_base:pill` (MIT badge) + a `dripyard_base:text` build-note teaser line below.
- **`web/themes/custom/performant_labs_v2/css/components/dy-section.css`** (modified) — appended proof-strip styling: compact mono-style proof-item figures (overriding the would-be 88px KPI-display size), MIT pill white-bg/terracotta-deep treatment, build-note spacing, mobile figure-size tightening.
- **`web/themes/custom/performant_labs_v2/css/components/header.css`** (modified) — appended nav visual-weight CSS: `href`-keyed selectors on `.primary-menu__link--level-1` splitting weighted (bold, full-ink) vs. demoted (muted, smaller) treatment, at both desktop (>1000px) and mobile (<=1000px, dark overlay panel) breakpoints.
- **`docs/pl2/css-change-log.md`** (modified) — appended 2 entries for the proof-strip CSS and nav-weight CSS.
- **`docs/pl2/handoffs/wave2-276-b/shots/`** (new) — 5 headless self-check screenshots (360/768/1280 full home, proof-strip crop at 1280/360).

## Layer decisions

**Component-reuse search (Step 0, mandatory before creating any component):**

| Need | Component considered | Source | Verdict |
|---|---|---|---|
| Proof-strip figures (stars/watchers/version) | `dripyard_base:statistic` (wireframe's own suggested mapping, RATIONALE.md §Section→component mapping row 3) | dripyard_base | **Tried, then REJECTED after live verification** — see "Component-reuse correction" below. Replaced with `dripyard_base:text`. |
| MIT badge | `dripyard_base:pill` | dripyard_base | **Reused as-is** — same component/pattern as the hero's dev-status pill from sub-phase A. No `additional_classes` prop exists (confirmed by reading the schema, matching sub-phase A's own finding), so styling is via ancestor-scoped CSS (`.dy-section--proof-strip .pill`), not a Canvas-input modifier class. |
| Proof-item row layout | `dripyard_base:flex-wrapper` | dripyard_base | **Reused as-is** — existing responsive flex-row primitive with `align_x`/`wrap` props, matches the wireframe's `.proof-strip` flex-row structure directly. No new component. |
| Build-note teaser line | `dripyard_base:text` | dripyard_base | **Reused as-is**, `body_s`/`soft`/centered. |
| Nav visual weight | *(no component — CSS-only per issue scope)* | — | Confirmed via issue #281 and #276's own scope note: order/labels are #270's scope (already landed, verified live: Aftersight/Services/How we do it/Open source projects/Articles/About us/Contact us). This sub-phase is treatment only — no new component, no menu-link entity changes. |

**Component-reuse correction (found during T2 self-verification, live-measured, before it ever reached a handoff draft):** `dripyard_base:statistic` was tried first, matching the wireframe's own suggested mapping. Its `.component.yml`/`statistic.example.twig` document it as built for animated numeric KPIs (`$1,200`, `98%`), and `statistic.js`'s `Drupal.behaviors.statCounter` runs every `.stat__stat` element through `keepNumbersCommasDecimals()` (strips all non-digit characters) then `countUp.js` (animates from 0). Live-rendered result, caught via Playwright screenshot: the honest non-numeric placeholders ("★ —", "—") and the real version string ("v0.2.2-dev") were **all silently corrupted to "0"** on page load — a real content-integrity bug, not a style mismatch. None of this sub-phase's three proof values are genuinely animatable numeric KPIs, so `statistic` is the wrong component regardless of the wireframe's suggestion. Re-ran reuse-before-create with this constraint: `dripyard_base:text` (already used elsewhere in the same script for the pill/build-note content) has no JS behavior and accepts the same value+label markup shape via its `contentMediaType: text/html` prop. Switched; no new component created. Full trace recorded inline in the assembly script's own header comment and in `dy-section.css`'s block comment for future sessions.

**CSS Step 1–4 trace (7-step workflow):**

1. **Proof-strip figures/pill (`dy-section.css`):** Pass 1 bottom-up: no prior rule for the new `.proof-item*` markup (new structural CSS); `.pill` default fill is `var(--theme-text-color-loud)` (solid dark), same finding as sub-phase A's hero pill. Pass 2 top-down: L1 not config; L3 (`html .theme--light { --pill-background-color: ... }`) ruled out — would re-style every pill instance in every cream-zone section site-wide, and there is no `--theme-*` token for the new `.proof-item` markup at all (it's new structural CSS, not a token consumer). **Layer 5 correct** — scoped to `.dy-section--proof-strip`, matching every other marker-class pattern already established in `dy-section.css`.
2. **Nav visual weight (`header.css`):** Pass 1 bottom-up: `.primary-menu__link--level-1[class]` (neonbyte, specificity 0,2,0) currently renders all level-1 links identically via the `--top-level-link-color` token. Pass 2 top-down: L1 not config (no menu-link entity field carries a "weight" flag); L3 not a token concern (font-weight/size on specific links, not a `--theme-*` value); **Layer 5 correct**, `href`-keyed selectors in the same file/selector family as this file's existing P9/P12 header overrides.

**DOM-inspection gate:** satisfied via Tier 1 (curl + grep) for the proof-strip markup, and via live Playwright `getComputedStyle()` for the nav (see "Verification results" — this is where a real specificity bug was caught and fixed before handoff, not after).

## Architecture notes for A

- **Layers touched:** Layer 5 only (two existing component stylesheets extended: `dy-section.css`, `header.css`) + Canvas component-tree content (new top-level section, standard authoring mechanism). No Layer 1, 3, or 4 changes.
- **New dependencies:** none — every component reused is pre-existing (`section`, `flex-wrapper`, `text`, `pill`, all `dripyard_base`).
- **Cross-component effects:** `.dy-section--proof-strip .pill` is marker-class-scoped, so no other `pill` instance site-wide is affected (grepped: the only other live `pill` instance is the hero's, scoped separately via `.hero.theme--white .pill`). Nav weight selectors are `href`-keyed and therefore inherently page-agnostic (the same 7 links render on every page via the shared header region) — this is an intentional, sitewide nav-chrome change, not homepage-scoped, consistent with the issue's own framing ("nav" is a global region, not a homepage-only surface).
- **Canvas `component_version` handling:** every hash (`section`, `flex-wrapper`, `text`, `pill`) is loaded live via `Component::getActiveVersion()` at script-run time; the script throws before saving if any hash resolves to null/empty. No hardcoded hashes.
- **Idempotency:** the script identifies and removes its own previously-inserted subtree (by fixed root UUID + transitive descendant collection) before re-inserting with fixed (non-random) UUIDs. Verified: re-running twice produces the same 67-component count (pre-#282) both times.
- **Real bug found and fixed during self-verification, not discovered later by A/T/S:** the mobile nav weight rule initially used a plain `.primary-menu__link--level-1[href="..."]` selector at specificity (0,2,0) — tied with neonbyte's own `primary-menu-narrow.css` `.primary-menu__link--level-1[class]` rule (also 0,2,0), and neonbyte's rule won the cascade tie, so the color/weight change silently never rendered on mobile. Caught live via Playwright screenshot of the expanded mobile nav panel (still showing the un-overridden default white text), not assumed correct from the CSS source alone. Fixed by adding the `.site-header` ancestor (present at all viewports) to bump specificity to (0,3,0), matching this file's own established pattern for beating neonbyte overrides. A second finding in the same investigation: the mobile nav overlay panel itself carries `.theme--black` (a dark panel, confirmed via computed background `#0E1014`) — `var(--theme-text-color-medium)` therefore correctly resolves to the dark-zone value (`#B8AFA0`) once the specificity fix let the rule actually apply; no separate dark-zone override was needed.
- **Nav-weight mapping is a judgment call, not from the issue text:** the wireframe's "Product/Docs/Build-notes" weighted set has no literal 1:1 match in this site's actual nav (no "Docs" or "Build notes" items exist yet — see #270 scope). Mapped to the closest live equivalents: weighted = `/aftersight` (Product), `/open-source-projects` (closest Docs analog), `/articles` (closest Build-notes analog); demoted = `/services`, `/how-we-do-it`, `/about-us`, `/contact-us`. Recorded as an autonomous decision below — if a literal Docs/Build-notes nav item is added later, only the `header.css` selector list needs updating.

## Deviations from spec

1. **GitHub star/watcher counts are non-live placeholders, not wired to a live API.** Per the sign-off's own binding decision (#276 sign-off comment, 2026-07-21): "GitHub star pill + 'on GitHub' labeling get wired when the repo goes public (launch-planning item)." The repo is currently private, so a live count would either 404/fail or misrepresent a private repo as public. Rendered as `★ —` / `—` with explanatory sub-labels ("repo is private for now" / "public count at launch") rather than a fabricated number or a broken API call. No `href`/link markup on these two items — deliberately, to avoid repeating the same private-repo broken-link risk the hero CTA ruling was written to avoid (the hero's primary CTA already links to `/articles`, not a private GitHub URL).
2. **Version number IS a real value, not a placeholder** — sourced from the Aftersight repo's own `package.json` `"version"` field (`0.2.2` as of this run), which requires no live API access (cheap, per the issue's own instruction: "version can be real ... from the aftersight repo's package.json if cheap"). Because the ddev web container has no filesystem access to the host's `~/Projects/aftersight` (verified: `ddev exec` cannot see it), the version is read on the HOST side and passed into the container via an `AFTERSIGHT_VERSION` environment variable at invocation time (see "Verification results" for the exact command). The script falls back to a labeled placeholder (`v0.x-dev`) if the env var is absent, so it remains runnable standalone.
3. **Nav "Product/Docs/Build-notes" weighted-set mapping** — see "Architecture notes for A" above; this is a judgment call recorded as an autonomous decision, not resolvable from the issue text alone since the literal nav items don't exist yet.

## Verification results (T1 + T2)

**T1 — headless:**
```
$ ddev drush cr
 [success] Cache rebuild complete.

$ ddev exec 'AFTERSIGHT_VERSION=0.2.2 drush php:script scripts/sprint-wave2-281-proof-strip-nav.php'
canvas_page 20 proof-strip insert complete. Component count: 67
# Re-run (idempotency check)
canvas_page 20 proof-strip insert complete. Component count: 67   [same count both runs]

$ curl -sk -o /dev/null -w "%{http_code}\n" https://performant-labs.ddev.site:8493/
200

$ curl -sk https://performant-labs.ddev.site:8493/ | grep -c "dy-section--proof-strip"
1
$ curl -sk https://performant-labs.ddev.site:8493/ | grep "proof-item__n"
  <div class="proof-item"><div class="proof-item__n">★ —</div>...stars...
  <div class="proof-item"><div class="proof-item__n">—</div>...watching...
  <div class="proof-item"><div class="proof-item__n">v0.2.2-dev</div>...current build...
$ curl -sk https://performant-labs.ddev.site:8493/ | grep -o "MIT licensed"
MIT licensed
$ curl -sk https://performant-labs.ddev.site:8493/ | grep -o "Latest build note:[^<]*"
Latest build note: development is underway in the open — follow progress on the build.

$ curl -sk https://performant-labs.ddev.site:8493/ | grep -oE 'href="[^"]*header\.css[^"]*"'
href="/themes/custom/performant_labs_v2/css/components/header.css?tik6dq"
```

**T2 — structural (Playwright headless, 360/768/1280):**
```
360:  h1Count=1, scrollWidth=345 ≤ innerWidth=360 (no horizontal overflow)
768:  h1Count=1, scrollWidth=753 ≤ innerWidth=768 (no horizontal overflow)
1280: h1Count=1, scrollWidth=1265 ≤ innerWidth=1280 (no horizontal overflow)

Nav weight, desktop (1280, >1000px breakpoint):
  weighted (/aftersight): color rgb(42,37,32) #2A2520, font-weight 700, font-size 15px
  demoted  (/services):   color rgb(92,84,76)  #5C544C, font-weight 400, font-size 13px

Nav weight, mobile (360/768, expanded hamburger panel):
  panel background: oklch(0.17 ...) = #0E1014 (.theme--black, confirmed live)
  weighted (/aftersight): color rgb(255,255,255) #FFFFFF, font-weight 700
  demoted  (/services):   color rgb(184,175,160) #B8AFA0, font-weight 400
  (fixed during this session — see "Architecture notes for A" for the specificity bug found+fixed)

Proof-strip contrast spot-check (live computed):
  .proof-item__n: rgb(142,74,42) #8E4A2A on cream #F5EFE2 bg
  .pill: color rgb(142,74,42), bg rgb(255,255,255), borderColor rgb(142,74,42)
```

**Blast-radius gate (mandatory per adapter, run twice — before and after the nav specificity fix):**
```
$ NODE_PATH="$PWD/node_modules" node cascade-map.cjs "https://performant-labs.ddev.site:8493/"
  375/1280: 4 total boundary escapes (same 4 as sub-phase A's fix-pass 4
  baseline: .heading/.heading--centered DORMANT from hero-title,
  .primary-menu/.header-navigation-wrapper:not(.is-expanded) .primary-menu
  ACTIVE/DORMANT pre-existing nav pair) — 0 new, attributable to this diff.

$ node perturb.cjs "https://performant-labs.ddev.site:8493/" cascade-map.json --max-targets 10
  .heading                                              -> DORMANT (pre-existing)
  .header-navigation-wrapper:not(.is-expanded) .primary-menu -> DORMANT (pre-existing)
  .heading--centered                                    -> DORMANT (pre-existing)
  .primary-menu                                         -> ACTIVE (pre-existing, live over-reach)

VERDICT: PASS. Zero new escapes (active or dormant) attributable to
dy-section.css's proof-strip rules or header.css's nav-weight selectors,
before OR after the specificity fix (re-ran the full gate after the fix
since the selector changed, per the adapter's "selector changed -> re-run"
rule).
```

## WCAG contrast ratios

| Element | Foreground | Background | Ratio | Pass/Fail |
|---|---|---|---|---|
| Nav muted link, desktop (>1000px) | `#5C544C` | `#FFFFFF` | 7.43:1 | AAA |
| Nav weighted link, desktop (>1000px) | `#2A2520` | `#FFFFFF` | 15.17:1 | AAA |
| Nav muted link, mobile (dark overlay panel) | `#B8AFA0` | `#0E1014` | 8.77:1 | AAA |
| Nav weighted link, mobile (dark overlay panel) | `#FFFFFF` | `#0E1014` | 19.04:1 | AAA |
| Proof-strip figure (`.proof-item__n`) | `#8E4A2A` | `#F5EFE2` | 5.79:1 | AA/AAA |
| Proof-strip label/sub-label | `#5C544C` | `#F5EFE2` | 6.48:1 | AAA |
| MIT pill text/border | `#8E4A2A` | `#FFFFFF` | 6.64:1 | AA/AAA |
| Build-note line | `#5C544C` | `#F5EFE2` | 6.48:1 | AAA |

All figures are existing brand tokens already verified elsewhere in this issue's contrast tables (RATIONALE.md, sub-phase A's handoff) — no new hex literals introduced. All pairings computed both from source CSS and cross-checked against live `getComputedStyle()` output (see "Verification results" T2).

## Mobile responsive behavior

- **Proof-strip row:** `dripyard_base:flex-wrapper`'s own `wrap: true` prop (mobile-first — the wrapper wraps at any viewport where content overflows, no new breakpoint introduced). At 360 the 3 proof-items + pill wrap across multiple lines (confirmed in the T2 screenshot); at 768/1280 they render on one row.
- **Compact figure size:** base (unqueried) rule sets `font-size: 1rem` (16px); one `@media (max-width: 576px)` rule reduces to `0.9375rem` (15px) — a `max-width` query used here because it's a *downward* refinement of an already-small compact figure at the narrowest viewport, not a base-desktop-then-patch-mobile pattern; the base/unqueried value already targets the smallest-viewport-safe size and mobile only tightens it further.
- **Nav weight:** two explicit breakpoint blocks (`@media (width > 1000px)` desktop, `@media (width <= 1000px)` mobile/hamburger) — both required because the mobile nav renders in a structurally different context (dark overlay panel vs. inline header row), matching this file's own existing `navbar-expand-lg`-style pattern (992/1000px breakpoint, per the adapter's documented convention).
- **Touch targets:** no new interactive elements were added (proof-strip items and the pill are non-interactive `dripyard_base:text`/`dripyard_base:pill` instances with no `href`); nav links are pre-existing interactive elements, unchanged in size/tap-target — only color/weight changed. Verified via the T2 run: no new focusable elements introduced.
- Verified at 360/768/1280 via the T2 Playwright run above: no clipping, no overflow (`scrollWidth ≤ innerWidth` at all three), nav weight renders correctly at both the desktop and mobile (post-fix) breakpoints.

## Autonomous decisions

1. **Component-reuse correction: `dripyard_base:statistic` → `dripyard_base:text`** — the wireframe's own suggested mapping (RATIONALE.md) turned out to be functionally wrong (countUp.js corrupts non-numeric content). In human-in-the-loop mode this would have surfaced as a "the wireframe's component mapping doesn't work, here's why, proceeding with X instead" note to the operator before continuing; resolved autonomously here since it's a mechanical reuse-search correction, not a visual-direction ambiguity.
2. **Nav "Product/Docs/Build-notes" weighted-set mapping to `/aftersight`/`/open-source-projects`/`/articles`** — no literal match exists in the current nav (Docs/Build-notes items don't exist yet, per #270 scope). Picked the closest semantic equivalents. In human-in-the-loop mode this specific mapping choice would have been surfaced to the operator as a judgment call before implementing.
3. **GitHub star/watcher: no `href` on the placeholder figures** — the sign-off text says the star pill "gets wired when the repo goes public," which I read conservatively as "don't add a private-repo link now, not even an inert one." This is the most conservative interpretation available; a less conservative reading might have linked to `/articles` (matching the hero CTA's pattern) even for the proof-strip figures. Recorded here since it's a spec-ambiguity resolution, not a fully-specified instruction.
4. **`AFTERSIGHT_VERSION` env-var wiring instead of direct filesystem read** — discovered live (not assumed) that the ddev container cannot see the host's `~/Projects/aftersight` checkout; designed the env-var passthrough as the conservative fix that keeps the script host-path-agnostic rather than hardcoding a container-side path that might not exist in other environments.

## Known issues

None — all 6 acceptance criteria on #281 are met:
- [x] Social-proof strip present below the hero, cream register, statistic-equivalent (`text`, see reuse correction) + pill + build-note components reused, no new components created.
- [x] GitHub star/count element wired to a graceful current-reality state (non-misleading placeholder, documented above).
- [x] Nav reads product-first via weight/treatment only; order/labels unchanged (verified: same 7 links, same order, as before this diff).
- [x] Blast-radius gate run and passing (cascade-map + perturb, zero new attributable escapes).
- [x] WCAG contrast verified for all new/changed text (computed-style, live-measured — see table above).
- [x] Headless verification at 360/768/1280 (see "Verification results").

## Files changed

- `scripts/sprint-wave2-281-proof-strip-nav.php` (new)
- `web/themes/custom/performant_labs_v2/css/components/dy-section.css` (modified — proof-strip block appended; also carries sub-phase C's feature-anatomy block, see `wave2-276-c/handoff-F.md`)
- `web/themes/custom/performant_labs_v2/css/components/header.css` (modified — nav visual-weight block appended)
- `docs/pl2/css-change-log.md` (modified — 2 entries for this sub-phase, plus sub-phase C's entries)
- `docs/pl2/handoffs/wave2-276-b/shots/home-{360,768,1280}.png` (new — full-page self-check screenshots)
- `docs/pl2/handoffs/wave2-276-b/shots/proof-strip-{360,1280}.png` (new — cropped proof-strip self-check screenshots)
- `docs/pl2/handoffs/wave2-276-b/handoff-F.md` (new — this file)

**Not committed/pushed/PR'd** — per role scope, O handles staging, commit, push, and PR creation from this file list (combined with sub-phase C's file list into one PR, per the spawn prompt's instruction).
