# Handoff-A: Wave 2 — Sub-phases B+C (#281/#282) — Architecture Review

**Date:** 2026-07-21
**Reviewer:** A (Architecture Reviewer), Website Front-End Pipeline · prefix `[wave2-BC-A]`
**Diff:** PR #284 (`feat/281-282-wave2-bc`, base `main`) — 2 assembly scripts (`sprint-wave2-281-proof-strip-nav.php`, `sprint-wave2-282-features-services-relocate.php`), L5 additions to `dy-section.css` / `header.css` / `grid-wrapper.css`, 2 handoff-F docs
**Spec:** approved wireframe `docs/pl2/keytail-design/wireframe-276/{wireframe.html,RATIONALE.md}` + #281/#282 issue bodies + #276 sign-off decisions (2026-07-21) + the S2 hardening note (`wave2-276/handoff-S.md`)

## Verdict: **PASS**

Zero block-level findings. Two warn-level findings (W1 script-anchor fragility — empirically demonstrated; W2 css-change-log entries missing from the PR — a staging miss, one `git add` to fix), four notes. Every deviation judgment F made is independently verified sound.

## Summary

Full-rigor review with independent re-verification of every load-bearing claim. Tree integrity on `canvas_page` 20 is clean (92 components, 0 NULL `component_version`, 0 orphans — dumped and checked via drush, not trusted from the handoff). Final top-level order is exactly hero → proof-strip → feature 1 → feature 2 (reversed) → feature 3 → services (`theme--light`) → logos (`theme--light`) → dogfooding → icon-list → accordion → dark CTA — matching the approved wireframe for everything the wireframe draws; the four trailing Wave-1 sections sit after logos in their pre-existing relative order, which is the correct call since the wireframe's own footer stub marks everything below services/logos as out of scope for #276. Verbatim copy byte-checked live: hero H1 ("Aftersight — open-source test intelligence, built CTRF-native."), subhead ("Self-hosted, MIT-licensed, AI in the core."), and the full #269 services header + subline all intact. All three edited CSS files are confirmed served on the live page with the new rules present (no silent-prod-miss).

All four deviation judgments verified against primary sources, not the handoff's account:

1. **statistic → text swap: SOUND.** Read `statistic.js` myself — `keepNumbersCommasDecimals()` (line 57) + `countUp.CountUp(el, …)` (line 76) strip non-digits and animate from 0; none of the three proof values ("★ —", "—", "v0.2.2-dev") is an animatable numeric KPI, so the wireframe's suggested mapping was functionally wrong and `dripyard_base:text` (no JS) is the correct reuse. Bonus check: the `&mdash;`/`&middot;` entities in script B's `text` props decode correctly through the `canvas_html_block` filter (rendered "★ —" live) — the entity bug script C hit was in escaped plain-string props, not this path.
2. **content-card → grid-wrapper+grid-cell: SOUND.** Read `content-card.component.yml` myself — props are `title` / `link_href` (required) / `metadata` / `body_text` / `background`, **no slots key at all, zero image/media mentions**. The wireframe's mapping claim doesn't match the component. `grid-wrapper`/`grid-cell` are pre-existing primitives already used on this page; correct reuse verdict.
3. **`order`-based 2-col reversal: SOUND.** Verified live: reversed section's DOM is copy-first (copy at region offset 720, crop at 2040), visual order crop-left (x=50.6) / copy-right (x=664.5) at 1280, both cells 549.9px (true 2-up). The feature-anatomy region contains **zero interactive elements** (0 `<a>`, 0 `<button>`, 0 tabindex; browser-chromes are `role="img"` ×3), so there is no focus-order/visual-order divergence risk — the one condition that makes `order`-based reordering hazardous. Copy-before-illustration DOM reads sensibly linearly (WCAG 1.3.2 satisfied). Consistent with principle 5 and the file's marker-class conventions.
4. **Visually-hidden H2: ESTABLISHED PATTERN.** Live heading walk confirms the site already uses visually-hidden H2 group labels ("Main navigation", "Footer"); "Product features" (VH) restores H1 → H2 → H3 with no skips anywhere on the page (the only heading-order oddity is the pre-existing nav-H2-before-H1 pattern, sitewide, untouched).

**CSS discipline:** telltale sweep clean across all three files — no `!important`, no ID selectors, no chain > 3 (max is exactly 3: `.dy-section--feature-anatomy-reverse .grid-wrapper--feature-anatomy .grid-cell--*` and `.site-header .primary-menu__link--level-1[href=…]`), no token definitions in component files, no `@import`. The `.site-header` specificity bump is **legitimate ancestor scoping, not a hack**: header.css's own pre-existing P9 rule (`.site-header .primary-menu__link--level-1[class]`, line 114, documented at lines 20/32) established exactly this (0,3,0) mechanism for beating neonbyte's (0,2,0) `[class]` rules; the new rules follow the file's own precedent, and `.site-header` is a genuine DOM ancestor of the link at all viewports (verified — the mobile-panel links match `.site-header …` selectors live). Cross-component styling of `.pill` internals from `dy-section.css` follows the accepted F6 precedent from sub-phase A (pill has no props/modifier mechanism — re-confirmed; ancestor-scoped so no other pill instance is affected). `.proof-item__*` is authored content markup, not another component's internals. Nav-weight CSS is treatment-only (font-weight/size/color) — **#270's order/labels boundary respected**: live nav is the same 7 links in #270's order (Aftersight, Services, How we do it, Open source projects, Articles, About us, Contact us), no markup/entity changes anywhere in the diff.

**Hardening-note compliance (S2 DORMANT `.heading` escapes):** the diff touches neither `hero-title` usage nor hero.css's `.heading` override set (hero.css absent from the diff; features use `dripyard_base:heading`, not `hero-title`), so the note's re-run precondition is not triggered — and the gate was re-run anyway (by F, twice, and independently by me).

**Blast-radius gate (re-run myself):** `cascade-map.cjs` on the live branch → **exactly 4 boundary escapes at both 375 and 1280: `.heading`, `.heading--centered`, `.primary-menu`, `.header-navigation-wrapper:not(.is-expanded) .primary-menu`** — the identical pre-existing set from the sub-phase A baseline. **Zero new escapes attributable to this diff**; nothing new to perturb-classify (the pre-existing four keep their established A/S2 classifications: noted, not blocked, per role). Gate PASS.

**Script idempotence (re-run myself, byte-diff not count):** dumped the full components array (38,649 B JSON), re-ran B then C in dependency order, re-dumped — **byte-identical**. All `component_version` hashes live-derived via `Component::getActiveVersion()` with throw-on-empty guards in both scripts (read, not assumed); the services/logos re-theme patches only the section's own `theme` input, leaving every descendant hash untouched. But see W1: B **standalone** is no longer order-idempotent.

**Nav contrast (measured myself, live `getComputedStyle` + WCAG relative luminance):**

| Pairing | Measured | Ratio | Verdict |
|---|---|---|---|
| Desktop weighted `rgb(42,37,32)` on white header | #2A2520 / #FFF | 15.2:1 | AAA |
| Desktop demoted `rgb(92,84,76)` @13px on white header | #5C544C / #FFF | 7.43:1 | AAA (cleared against 4.5:1 body threshold — 13px is not large text) |
| Mobile weighted `#FFFFFF` on dark panel `oklch(0.173…/0.95)` ≈ #0E1014 | | ~19–21:1 | AAA |
| Mobile demoted `rgb(184,175,160)` on dark panel | #B8AFA0 / ~#0E1014 | ~8.8–9.7:1 | AAA |

Proof-strip spot-checks concur with F: figure 5.79:1, labels 6.48:1, MIT pill 6.64:1 — all AA/AAA.

## Findings

| # | Sev | File:line | Dimension | Finding | Fix |
|---|-----|-----------|-----------|---------|-----|
| W1 | warn | `scripts/sprint-wave2-281-proof-strip-nav.php:~330` (insertion anchor) | Script correctness / maintainer trap | B's insert anchor is "immediately before the services section", written when the hero was the only thing between them. Now that C's three feature sections exist, **re-running B alone relocates the proof-strip to after the features** (hero → f1 → f2 → f3 → proof → services — empirically demonstrated during this review; the B→C chain converges and repairs it, and I left the live tree byte-identical to its pre-review state). The script header's "re-runs are byte-identical" claim is false for the standalone case, and the file's own comment ("the hero is the only thing currently between them") is stale. A future maintainer running B alone silently corrupts the approved section order with no error. | Anchor B's insertion on the position after the hero (or before the first `b282f100…` feature section when present), or add a fail-fast throw when feature sections are detected between hero and services with a "run the full chain" message. Small, contained; fold into the next touch of the scripts — does not block since the committed tree and the documented chain invocation are both correct. |
| W2 | warn | `docs/pl2/css-change-log.md` (uncommitted working-tree edit) | Process / repo hygiene | Both handoff-F docs list css-change-log.md under "Files changed" (5 new entries: proof-strip, nav weight, feature reversal, services/logos re-theme, VH H2), and the entries exist — but only as an **uncommitted local edit**. They are in neither commit nor PR #284. The change-log is this project's L5-ruling audit trail; merging without it breaks the trail for five rulings. | O: `git add docs/pl2/css-change-log.md`, commit, push to the PR branch. Content is already written and correct (spot-checked against the diff). |
| N1 | note | `scripts/sprint-wave2-282-…php:~440` (step-4 comment) | Comment drift | The assembly comment attributes feature 2's reversal to a "flex-wrapper row-reverse rule (see css/components/dy-section.css)". The actual mechanism is grid-cell `order` in **grid-wrapper.css**. Behavior described (CSS-only, DOM unchanged) is accurate; file/mechanism named is wrong. | Correct the comment next touch (W1's fix is in the sibling script — do both). |
| N2 | note | `scripts/sprint-wave2-281-…php:11` (header scope paragraph) | Comment drift | The header still says the row contains "dripyard_base:statistic instances" — superseded by the correction documented at length later in the same file. | Same batch as N1. |
| N3 | note | services section (uuid `a8933523…`) | Naming | The relocated services section now renders `theme--light` while still carrying the pre-existing `dy-section--centered-white` marker class. Checked `dy-section.css`: the marker carries only centered-header layout rules (header max-width), no white-background assumptions — purely a misleading name now, shared with 6 other consumers sitewide. Correctly left alone by this diff (renaming a multi-page marker is out of scope). | None now; candidate for a naming cleanup story. |
| N4 | note | `header.css` new desktop block | Cascade dependency | The new (0,3,0) `[href=…]` rules tie with the file's own P9 `[class]` rule (also 0,3,0) and win only by source order (appended later in the same file). Verified working live (13px/weight render). Fragile only if the file is ever reordered — the block comments already document the specificity story. | None — acceptable; noting so a future reorder doesn't silently regress it. |

## Prior-iteration check

N/A — first A review of sub-phases B+C. Sub-phase A's warn findings (F1–F3) were routed to the screenshot-swap follow-up, not this diff; none regressed here (hero.css untouched).

## Patterns referenced

1. `web/themes/custom/performant_labs_v2/css/components/header.css:20,32,114` — the pre-existing P9 `.site-header …[class]` (0,3,0) mechanism the new nav rules pattern-match.
2. `web/themes/dripyard_themes/dripyard_base/components/statistic/statistic.js:57,71,76` — the countUp pipeline grounding the statistic→text rejection.
3. `web/themes/dripyard_themes/dripyard_base/components/content-card/content-card.component.yml` — no slots/media, grounding the grid-wrapper substitution.
4. `web/themes/custom/performant_labs_v2/css/components/dy-section.css:138-147` — `dy-section--centered-white` marker rules (layout-only) grounding N3, and the marker-class scoping convention the proof-strip block follows.
5. `web/themes/custom/performant_labs_v2/css/components/grid-wrapper.css:246↑` — the `--2col`/`--3col` marker precedent the feature-anatomy block extends.
