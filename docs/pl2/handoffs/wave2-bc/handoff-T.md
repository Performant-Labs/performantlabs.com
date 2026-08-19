# Handoff-T: Wave 2 — Sub-phases B+C (#281/#282) — Tester Verification

**Date:** 2026-07-21
**Tester:** T (Tester), Website Front-End Pipeline · prefix `[wave2-BC-T]`
**Branch:** `feat/281-282-wave2-bc` (PR #284) · commits `c70f7051` (B), `876761d7` (C), `5c0d0291` (css-change-log)
**Spec:** approved wireframe `docs/pl2/keytail-design/wireframe-276/wireframe.html` + #281/#282 acceptance criteria
**Method:** fully independent re-verification (own curl/grep/Playwright/axe/contrast math — no reuse of F's or A's numbers). Headless only.

## Verdict: **PASS** — ready for S

Zero blocking issues. All acceptance criteria on #281 (6/6) and #282 (8/8, one AC in documented-fallback state) verified met. Two advisory notes.

## A precondition

`wave2-bc/handoff-A.md` verdict: **PASS** (2 warn, 4 note, zero block) — confirmed before starting. Note: A's W1 (script-anchor fragility) concerns the assembly scripts only, which F is fixing concurrently and are **out of this T cycle's scope**; the live tree and CSS verified below are the stable post-chain state.

## T1 results (headless — curl/grep, `ddev drush cr` first)

- `drush cr` clean (one pre-existing `webform_block` schema warning, unrelated). `GET /` → **HTTP 200**, 106,235 bytes.
- **Section order by byte offset** (independently measured in the rendered HTML): hero H1 @35065 → proof-strip @37866 → feature 1 History @40674 (h3 @42211) → feature 2 reverse-marker @44492 (h3 "See patterns…" @45811) → feature 3 Search h3 @49321 → services (`dy-section--centered-white theme--light`) @51542 → logo grid ("Trusted by teams at", `dy-section--logo-grid … theme--light`) → dogfooding/heal-flow → icon-list → accordion/FAQ → dark CTA (`theme--dark`, "Book a review"). **Matches the approved wireframe order exactly**; Wave-1 tail intact after logos.
- **Proof strip renders (quoted verbatim):** `★ —` / "stars" / "repo is private for now" · `—` / "watching" / "public count at launch" · `v0.2.2-dev` / "current build" / "self-hosted · CTRF-native" · pill "MIT licensed" · "Latest build note: development is underway in the open — follow progress on the build." Star/watcher values are **labeled, degraded placeholders with explanatory sub-labels — not fake-live numbers**, and carry no `href` (no private-repo link). Version is a real value (`v0.2.2-dev`). MIT pill and build-note present. ✓
- **Feature copy matches the wireframe verbatim** (kickers HISTORY / FAILURE ANALYTICS / SEARCH; h3s "Every run, one continuous timeline" / "See patterns, not just red X's" / "Find the one failing assertion, fast"; all body paragraphs and all 3×3 bullet items byte-matched, apostrophe entity-encoded as `&#039;` — rendering-equivalent). ✓
- **Services header verbatim-intact:** "The team behind Aftersight tests Drupal for a living." + "ATK, Testor, and the workflows that heal their own tests — available as services while we build the platform." — byte-identical to #269 copy. All 3 service-card links intact (`/open-source-projects`, `/how-we-built-this-site`, `/services` with their card titles). Hero CTAs intact: "Follow the build" → `/articles` (primary), "Book a testing review" → `/contact-us?intent=test…` (secondary). ✓
- **Hero untouched** (as merged in #283): pill "Now in development — in the open", kicker "From Performant Labs", H1 "Aftersight — open-source test intelligence, built CTRF-native.", subhead "Self-hosted, MIT-licensed, AI in the core.", both CTAs, terminal snippet, browser-chrome placeholder — all present and unchanged. ✓
- **Nav order/labels = #270's 7 links unchanged:** Aftersight, Services, How we do it, Open source projects, Articles, About us, Contact us (in that DOM order). Weight is CSS-only (href-keyed rules confirmed served: `header.css?tik6dq` contains 15 matching new-rule lines; `dy-section.css` 12 proof-strip lines; `grid-wrapper.css` 7 feature-anatomy lines). ✓
- **Zero `github.com/Performant-Labs/aftersight` references** in the full page (only github.com ref anywhere is the pre-existing heal-tests workflow link). ✓
- **srcset resolution:** all 55 unique srcset/img URLs in the rendered page (client-logo AVIF derivatives ×48 + PNG originals ×6 + logo.svg) return **200**. ✓
- **Watchdog clean:** only historical entry ID 38 (21/Jul 21:11, the pill-prop LogicException from before F's in-build fix) — zero new errors. ✓

## T2 results (Playwright headless, 360/768/1280)

| Check | 360 | 768 | 1280 |
|---|---|---|---|
| H1 count | 1 | 1 | 1 |
| scrollWidth ≤ viewport | 345 ≤ 360 ✓ | 753 ≤ 768 ✓ | 1265 ≤ 1280 ✓ |
| Hamburger present/visible | yes/yes | yes/yes | yes/hidden (inline nav) |

- **Heading walk (full page, DOM order, no skips):** H2 "Main navigation" (VH, pre-existing sitewide nav pattern) → H1 → H2 "Product features" (**visually-hidden, confirmed live** — the group label added in C) → H3 ×3 (features) → H2 services → H3 ×3 (cards) → H2 ×4 (dogfooding/icon-list/FAQ/dark CTA) → H2 "Footer" (VH) → H3 ×3. **No skipped levels.** ✓
- **Feature alternation verified via x-coordinates:**
  - 1280: F1 copy x=51 / crop x=664; **F2 (reversed) crop x=51 / copy x=664**; F3 copy x=51 / crop x=664 — true left/right alternation, both cells 550px (real 2-up). Same pattern at 768 (30/405, 318px cells).
  - 360: all cells x=14, w=317 — **stacked single column**; F2 stacks crop-first (crop y=2977 < copy y=3261), consistent with its reversed identity. ✓
- **Proof strip wrap at 360:** 4 items wrap to 4 centered rows (x≈89–103, widths 139–167px), strip right edge 331 ≤ 360 — no overflow, sane wrap. At 1280: single conceptual row (3 figures + pill, y 1735/1754). ✓
- **Nav weight, desktop 1280 (computed):** weighted `/aftersight`,`/open-source-projects`,`/articles` = `rgb(42,37,32)`, fw 700, 15px; demoted `/services`,`/how-we-do-it`,`/about-us`,`/contact-us` = `rgb(92,84,76)`, fw 400, 13px. Clean two-register split, matches F/A. ✓
- **axe (ARIA/landmarks — contrast rule excluded as unreliable on this page's oklch tokens, per epic-267-S):** mobile-375: **1 violation** — `[serious] scrollable-region-focusable` on `.heal-flow` (**pre-existing Wave-1 follow-up, untouched by this diff**); desktop-1280: **0 violations**. No new ARIA/landmark/heading findings. ✓

## T2.5 interaction results

- **Mobile nav drawer (only inventoried stateful surface touched — `stateful-surfaces.md` row "Mobile nav toggle", persistence expectation: *ephemeral*):** verified structurally live at **both 360 and 768**: `[data-drupal-selector="mobile-nav-button"]` has `aria-controls="header-navigation-wrapper"`; click → `aria-expanded` false→**true** + wrapper gains `is-expanded`; click again → **false** + class removed. Inside the open panel (bg `oklch(0.173… / 0.95)` ≈ #0E1014 dark register): weighted `/aftersight` = #FFFFFF fw 700, demoted `/services` = `rgb(184,175,160)` fw 400 — the weight treatment renders correctly in the open drawer (the exact spot where F's specificity bug had lived). ✓
- **Persistence suite (`state-invariants.spec.js`):** not run — the drawer is inventoried **ephemeral** (reset-on-navigation is expected, not a failure), so there is no persistence invariant to assert; the open/close structural verification above covers the surface. Also see Advisory note 2: the config file the profile references does not exist in the repo.

## WCAG verification (independent computation — WCAG relative luminance from live `getComputedStyle` values)

| Pairing (live-measured colors) | Ratio | Threshold | Verdict |
|---|---|---|---|
| Proof figure `#8E4A2A` on cream `#F5EFE2` (15–16px fw800) | 5.79:1 | 4.5 | AA (large-text AAA) |
| Proof label/sub `#5C544C` on cream (12–13px) | 6.48:1 | 4.5 | AA |
| MIT pill `#8E4A2A` on white pill bg (12px) | 6.64:1 | 4.5 | AA |
| Build-note `#5C544C` on cream (16px) | 6.48:1 | 4.5 | AA |
| Feature kicker `#8E4A2A` on white (12px) | 6.64:1 | 4.5 | AA |
| Feature H3 `#1F1A14` on white (24–32px) | 17.27:1 | 3.0 | AAA |
| Feature body/bullets `#5C544C` on white (16–18px) | 7.43:1 | 4.5 | AAA |
| Services H2 `#1F1A14` on cream (30–40px) | 15.07:1 | 3.0 | AAA |
| Services body `#5C544C` on cream | 6.48:1 | 4.5 | AA |
| Nav weighted desktop `#2A2520` on white (15px fw700) | 15.17:1 | 4.5 | AAA |
| Nav demoted desktop `#5C544C` on white (13px) | 7.43:1 | 4.5 | AAA |
| Nav weighted mobile `#FFFFFF` on panel ≈`#0E1014` | 19.04:1 | 4.5 | AAA |
| Nav demoted mobile `#B8AFA0` on panel ≈`#0E1014` | 8.77:1 | 4.5 | AAA |

All 13 pairings pass AA or better; every ratio concurs with F's and A's tables (independently recomputed, not copied). The mobile-panel bg carries 0.95 alpha — worst-case blend cannot move the 8.77:1 demoted ratio below AA given the ~2× margin.

## Mobile responsive verification

- No horizontal overflow at any of 360/768/1280 (table above).
- Feature 2-up ↔ stacked collapse behaves via the grid system's container queries (2-up already at 768, stacked at 360); reversal preserved as crop-first stacking order at 360.
- Proof strip wraps to centered rows at 360 with no clipping.
- Hamburger visible and functional at 360/768; hidden at 1280 where the inline nav renders.

## Acceptance criteria status

**#281 (6/6 met):** strip below hero on cream with reused components ✓ (statistic→text correction verified sound by A; rendering verified here) · star/count graceful-degraded + documented ✓ (quoted above) · nav product-first via treatment only, order/labels unchanged ✓ · blast-radius gate run+passing ✓ (F ran twice, A re-ran independently; not re-run a third time by T — gate is A's instrument, live outcome verified structurally here) · WCAG computed-style verified ✓ (13 pairings, table above) · headless 360/768/1280 ✓.

**#282 (8/8 met):** 3 feature sections, alternating, framework-agnostic copy ✓ (zero Drupal refs in the feature region; the only "Drupal" on the page is the services header's own approved copy) · services relocated below features on cream, copy verbatim ✓ · logos inside/under services on cream ✓ · real UI-crops attempted, placeholder fallback **flagged not silently shipped** ✓ (all three `browser-chrome` render `is_placeholder` mode with explanatory captions — documented-fallback state per the issue's own instruction, tracked follow-up) · blast-radius gate ✓ (as above) · WCAG ✓ · headless 3 viewports ✓ · framework-agnostic sweep ✓.

## Blocking issues

None.

## Advisory notes

1. **A's W1/W2/N1–N4 stand as recorded** — none are T-blocking; W1 (standalone script-anchor fragility) is being fixed by F concurrently (scripts out of this cycle's scope), W2 (css-change-log staging) is already resolved on the branch (commit `5c0d0291`).
2. **Profile drift:** `frontend-pipeline-profile.md` references `scripts/state-invariants.config.json`, which does not exist in the repo (only per-audit `state-invariants.json` snapshots under `docs/pl2/handoffs/audits/`). Did not affect this cycle (the one touched surface is ephemeral and was verified directly), but O should reconcile the profile or restore the config before a cycle touches a MUST-persist surface.
3. Pre-existing, unchanged: `.heal-flow` scrollable-region-focusable (axe serious, Wave-1 follow-up); sitewide nav-H2-before-H1 heading pattern; historical watchdog entry 38.

## Decision

**Ready for S.** All T1/T2/T2.5 checks and all 14 acceptance criteria verified independently; zero blocking issues.
