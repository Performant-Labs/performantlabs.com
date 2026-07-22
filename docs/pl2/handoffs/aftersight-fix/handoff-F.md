# Handoff-F: /aftersight visual-parity fix pass

**Date:** 2026-07-22
**Branch:** `fix/aftersight-page-visual-pass`
**Mode:** autonomous (no `**Mode:**` line was present in the spawn prompt; default per pipeline docs)

## Confirmation table (informational — autonomous mode, not surfaced for approval)

| Field | Value |
|---|---|
| Page being overhauled | `/aftersight` (canvas_page 19) |
| GitHub issue number | none provided in the spawn prompt — task was scoped directly in the operator brief, not via a GitHub issue. Proceeded on the brief's explicit defect list + acceptance criteria (verify section) since it was fully specified. |
| Working branch | `fix/aftersight-page-visual-pass` |
| Runbook phase | ad hoc visual-parity fix pass (post Epic #267 Wave 1 / #276 homepage), not a numbered runbook phase |
| Input documents read | `~/Projects/playbook/pipelines/website-frontend/core/roles/feature-implementor.md`, `adapters/drupal-canvas-sdc.md`, `docs/pl2/frontend-pipeline-profile.md`, `docs/pl2/canvas-update-checklist.md`, `docs/pl2/keytail-design/wireframe-276/wireframe.html` + `RATIONALE.md`, `docs/pl2/handoffs/epic-267-S/handoff-S.md`, live homepage (`/`), `scripts/sprint-lane-c-267-aftersight-page.php`, `scripts/sprint-wave2-276-hero-rebuild.php`, relevant `.component.yml` schemas, `web/themes/custom/performant_labs_v2/css/components/dy-section.css`, `web/themes/custom/performant_labs_v2/css/base.css`, `web/themes/custom/performant_labs_v2/css/components/button.css`, `web/themes/dripyard_themes/dripyard_base/components/{section,button,title-cta,card}/*` |
| Acceptance criteria count | 5 named defects (big buttons / wrong menu background / unbalanced cards / off-palette banner / general spacing-rhythm pass) + verification checklist (T1 curl, T2 3-viewport screenshots, computed-style contrast, heading walk, watchdog, assembly-script idempotence) |
| Handoff document path | `docs/pl2/handoffs/aftersight-fix/handoff-F.md` (this file) |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` (7-step) — followed; see "Layer decisions" |
| Component schema source of truth | each component's `.component.yml` under `web/themes/dripyard_themes/dripyard_base/components/*` — read for every prop referenced (`button`, `section`, `title-cta`, `card-canvas`, `heading`) |

## Scope cap check

Touched: 1 new PHP assembly-patch script, 1 existing CSS file (comment-only addition, zero new rules), 1 page (`/aftersight`), reusing 5 existing component families (section, button, text, card-canvas, title-cta) with zero new components. This is a single-page, single-surface, mechanical content+one-marker-class fix — well under the scope cap (< 6 files, one component family reused not created, one design surface). No split proposed or needed.

## What was done

- `scripts/aftersight-fix-visual-pass.php` (new) — idempotent Canvas patch script for canvas_page 19. Patches three existing UUIDs in place (does not touch `component_version` on any of them):
  1. Intro section (`aftersgt-0001-0000-000000000001`): appended `additional_classes: dy-section--cta-pair` (dedup-safe on re-run).
  2. Pillar-1 card (`aftersgt-0002-0021-000000000002`): trimmed `body` copy from ~305 chars to ~97 chars to match sibling weight, preserving the full framework list and the framework-agnostic guardrail.
  3. Closing-CTA section (`aftersgt-0005-0000-000000000005`): `theme` prop changed `primary` → `light`.
- `web/themes/custom/performant_labs_v2/css/components/dy-section.css` (modified) — comment-only addition (57 lines) documenting the trace for defects 1/2/4 for A's review. **Zero new CSS selectors/rules added** — defect 1 is fixed entirely by reusing the file's existing `.dy-section--cta-pair` marker-class rule (already shipped, already active on `/services` and `/about-us`); defect 4 needed no CSS at all (content-layer theme-prop change was sufficient, since the button's color already resolves correctly via the existing sitewide token fix).
- `docs/pl2/handoffs/aftersight-fix/shots/aftersight-{360,768,1280}-after.png` (new) — T2 full-page screenshots, post-fix, all three viewports.

## Layer decisions

### Defect 1 — "big buttons" (hero-echo intro CTA full-width brown bar)

**Component-reuse search (Step 0):** searched `web/themes/dripyard_themes/dripyard_base/components/` for anything that already lays out a lone/paired CTA at natural width inside a section content slot. Found `dy-section.css`'s own existing "§1 Services hero — CTA pill-pair flex row (P4)" rule (`.dy-section.theme--white.dy-section--cta-pair .dy-section__content`), already shipped and consumed by `/services` and `/about-us`. Rejected creating any new CSS: the existing rule's behavior (flex row, `justify-content: center`, buttons at `flex-shrink: 0` natural width, non-button children forced to `flex-basis: 100%`) is correct and identical whether the row holds one button or two — it iterates `.dy-section__content > .button`, not `:nth-child(2)`. No new component or new rule needed.

- **Pass 1 (bottom-up):** `.button` (dripyard_base `button.css`) is `display: inline-flex` — not inherently full-width. Parent `.dy-section__content` (dripyard_base `section.css`) is `display: flex; flex-direction: column;` with **no `align-items` declared**, so the UA default (`normal`, which computes to `stretch` on the cross axis for a flex item without its own `align-self`) applies. The button, having no `width`/`align-self` of its own, stretches to the column's full cross-axis (inline) size. Confirmed live via `getComputedStyle`: button `width: 1163.8px`, parent `align-items: normal`.
- **Pass 2 (top-down):** L1 not config-driven, ruled out. L2 not OKLCH-derived, ruled out. L3 not a `--theme-*` token — this is a flex cross-axis layout property, not color/typography, ruled out. **L5 — component-scoped — correct layer**, and specifically the *existing* L5 rule in `dy-section.css`, activated via a **content-layer** change (Canvas `additional_classes` prop) rather than new CSS.
- **Layer chosen:** L5 (pre-existing rule) + content-layer activation. No new CSS.

### Defect 2 — "wrong menu color background" (cream breadcrumb strip)

Traced fully: `.region-highlighted` (neonbyte parent theme, `css/layout/region.css:39`) always paints `background: var(--theme-surface-alt)`. Under `html .theme--white` (performant_labs_v2 `base.css`), `--theme-surface-alt` resolves to cream `#F5EFE2`. **This is confirmed to be a sitewide pattern** — reproduced identically on `/services` and `/open-source-projects` (both render the same `region region-highlighted` markup with the same cream background), not a page-specific `/aftersight` defect. Per adapter policy, `web/themes/dripyard_themes/*` findings are advisory-upstream only — never auto-fixed. No change made on this page for this defect. See "Deviations from spec" below for the resolution.

### Defect 3 — unbalanced pillar cards

Content-layer only (no CSS layer question). Card 1's `body` prop trimmed from ~305 characters to ~97 characters (final: "Playwright, Cypress, Jest, pytest and any CTRF-emitting runner — no per-framework adapters."), matching the ~90-170 char range of siblings 2-4. Framework list preserved (dropped Vitest/PHPUnit/WebdriverIO from the enumerated list per the brief's suggested compression pattern, but kept "any CTRF-emitting runner" as the catch-all — the full 7-framework list still appears verbatim in the "What it does" section below, so no framework-agnostic claim is lost sitewide). No Drupal framing introduced.

### Defect 4 — off-palette "Got a CTRF use case" banner

- **Pass 1 (bottom-up):** section rendered `theme: primary`, which resolves (performant_labs_v2 `base.css`) to `--theme-surface: #1893b4` / `--theme-surface-alt: #62bbcb` — brand teal, explicitly commented in `base.css` as "Primary zone — brand teal (**reserved; sparing use**)".
- **Pass 2 (top-down):** L1 not config. L2 not OKLCH. L3 — the fix IS a theme-zone (L3-equivalent) selection, but expressed via the section's own `theme` **content prop**, not a new token override — no new CSS token was written. L5 — not needed; the `title-cta` button already resolves to terracotta-deep (`--pl-primary-light` → `--pl-accent-deep`, 6.64:1) under any light-register zone via the existing sitewide fix in `base.css`/`button.css` (2026-07-22 binding fix, issue #280) — confirmed by reading both files before assuming the button would render correctly.
- **Layer chosen:** content layer only (`theme: primary` → `theme: light`), matching the approved wireframe's "light-first, cream for secondary/callout content" convention (`RATIONALE.md` §Zone assignment: `.theme--light` used for "Social-proof strip surface-alt, services section (demoted zone), for tonal separation"). No CSS change.

### Defect 5 — general spacing/rhythm pass

Covered by fixes 1/3/4 above — no additional change made. Section theme alternation (white → light → white → light → light) is unchanged and already matches the homepage's light-first register alternation per the wireframe.

## Architecture notes for A

- **Layers touched:** content layer (Canvas `inputs` on 3 existing component instances) + zero new CSS rules (documentation-only comment addition to `dy-section.css`).
- **New dependencies introduced:** none. No new component created. No new CSS selector created.
- **Cross-component effects:** the `dy-section--cta-pair` marker class is now consumed on a 3rd page (`/aftersight`, joining `/services` and `/about-us`). The rule's selector is scoped to `.dy-section.theme--white.dy-section--cta-pair .dy-section__content > .button` (and its `:not(.button)` sibling clause) — verified via the blast-radius gate (below) that activating it here produces the *same* pre-existing pattern already live elsewhere, not a new one.
- **Canvas `component_version` handling:** the script never writes to `component_version` on any of the 24 components in the tree — every hash is left untouched at its existing valid value (copy-in-place pattern, same approach as `scripts/sprint-wave2-276-hero-rebuild.php`). A guard loop asserts no `component_version` is empty/null before `->save()`, aborting the script otherwise.
- **Non-obvious tradeoff:** defect 2 (cream breadcrumb) was investigated in full but deliberately NOT fixed on this page — it's a sitewide, parent-theme-owned pattern (advisory-upstream), and fixing it here alone would create a`/aftersight`-only inconsistency with `/services` and `/open-source-projects`, which currently render identically. Flagged as a follow-up for O to route as its own sitewide issue (see "Known issues").
- **Blast-radius gate (defect 1's marker-class reuse):** ran `cascade-map.cjs` + `perturb.cjs` against the live `/aftersight` page post-fix.
  - `cascade-map.cjs` flagged `.dy-section.theme--white.dy-section--cta-pair .dy-section__content > :not(.button)` as a boundary-escape (`scopedTo: button`, escaping into `heading`/`text` — by design, this half of the rule intentionally targets non-button siblings to force `flex-basis: 100%`/`text-align: center` on them). `severityProxy: warning?`, `highRiskProps: []` (declared props are `flex-basis`/`text-align`, not in the tool's HIGH_RISK layout/box/position set).
  - Ran the identical scan against `/services` (the rule's pre-existing consumer) for comparison: **same selector, same severity class** (`warning?` for the `theme--white` variant; the page also separately surfaces a pre-existing `theme--dark` variant at `critical?` that `/aftersight` does not use). Confirms this is a **pre-existing pattern**, not new behavior introduced by this fix.
  - `perturb.cjs` (Tier C, ACTIVE/DORMANT confirmation): verdict `ACTIVE (live over-reach)`, `severity: WARNING`. Per the gate's verdict mapping ("a new DORMANT escape or an active escape on a low-risk prop = `warn`"), this is `warn`, not `block` — `flex-basis`/`text-align` are not high-risk layout/box/position primitives.
  - **Verdict: PASS (warn, non-blocking).** Full JSON retained in the session scratchpad; not committed to the repo (ephemeral verification artifact, not a tracked doc).

## Deviations from spec

- **Defect 2 (cream breadcrumb "wrong menu background") — not fixed on this page.** The brief asked to "diagnose which section/theme-zone causes it and align with how the homepage handles the top-of-page transition." Diagnosis is complete (see "Layer decisions" above) — but the homepage doesn't actually have a comparison case: `/` has no breadcrumb block at all (front page, no `.region-highlighted` content), so there is no existing "homepage handling" of this exact transition to align to. The cream band is instead a sitewide pattern shared identically by every other content page (`/services`, `/open-source-projects`, presumably all others) via a parent-theme (neonbyte, advisory-upstream-only) rule. Applying a page-scoped fix to `/aftersight` alone would create a new, unapproved inconsistency versus the rest of the site — a bigger and more visible problem than the one being fixed. **Most-conservative interpretation applied:** treat this as a sitewide finding, not an `/aftersight`-specific defect, and leave it unfixed here, filing it as a separate follow-up (see "Known issues"). This is the interpretation that avoids introducing new visual inconsistency while still fully diagnosing the root cause André asked about.
- **No other deviations.** All other defects were fixed within the explicit fix scope given in the brief, using the approved palette/token reference (`RATIONALE.md`) and the site's own established CSS conventions.

## Verification results (T1 + T2)

### T1 (headless curl + grep, post `ddev drush cr`)

```
$ curl -sk https://performant-labs.ddev.site:8493/aftersight -o /tmp/aftersight-final.html

# Copy present:
$ grep -c "Aftersight\|Four pillars\|What it does\|Status: now in development" /tmp/aftersight-after.html
9

# Zero github.com/Performant-Labs/aftersight links:
$ grep -c "github.com/Performant-Labs/aftersight" /tmp/aftersight-after.html
0

# Marker class landed on intro section:
$ grep -o 'dy-section--cta-pair[^"]*' /tmp/aftersight-after.html | head -1
dy-section--cta-pair theme--white container dy-section--section-max-width margin-top--0 margin-bottom--0 padding-top--m padding-bottom--m

# Closing CTA section is now theme--light (was theme--primary):
$ grep -n "dy-section theme--" /tmp/aftersight-after.html
680: ...theme--light...   (Four pillars)
792: ...theme--white...   (What it does)
813: ...theme--light...   (Status)
834: ...theme--light...   (Closing CTA — was theme--primary)

# Pillar-1 trimmed body landed:
$ grep -o "Playwright, Cypress, Jest, pytest and any CTRF[^<]*" /tmp/aftersight-after.html
Playwright, Cypress, Jest, pytest and any CTRF-emitting runner — no per-framework adapters.

# All pages load 200 post-fix (no regressions):
$ curl -sk -o /dev/null -w "%{http_code}\n" https://performant-labs.ddev.site:8493/aftersight
200
$ curl -sk -o /dev/null -w "%{http_code}\n" https://performant-labs.ddev.site:8493/about-us
200
$ curl -sk -o /dev/null -w "%{http_code}\n" https://performant-labs.ddev.site:8493/how-we-built-this-site
200
```

### T2 (headless Playwright, 3 viewports)

**Overflow check (no horizontal scroll at any viewport):**
```
360:  scrollWidth 345 <= innerWidth 360   PASS
768:  scrollWidth 753 <= innerWidth 768   PASS
1280: scrollWidth 1265 <= innerWidth 1280 PASS
```

**Heading hierarchy walk (1280, `/aftersight` main content only):**
```
H1 "Aftersight"
  H2 "Four pillars"
    H3 x4 (pillar titles)
  H2 "What it does"
  H2 "Status: now in development"
  H2 "Got a CTRF use case we should know about?"
```
Single H1, monotonic descent, no skipped levels. PASS.

**Button geometry (defect 1 fix confirmation, 1280):**
```
Intro CTA "Follow the build":       168.8 x 56px  (was 1163.8 x 56px)  — fit-content, matches homepage hero CTA width exactly
Closing CTA "Tell us about it":     181.7 x 56px  — fit-content
Both >= 44x44 WCAG touch-target minimum.
```

**Card balance (defect 3 fix confirmation, 1280):**
```
Card 1: 461.9 x 274.4px  (was part of a ~1165px-tall column pre-existing S-1 measurement)
Card 2: 461.9 x 274.4px
Card 3: 461.9 x 298.4px
Card 4: 461.9 x 298.4px
```
Two matched pairs (274/274, 298/298) — dramatic improvement from the original ~2x length imbalance on card 1.

**Watchdog:** clean post-`drush cr` (only the pre-existing, unrelated `config_schema` warning for `canvas.component.block.webform_block` — present before this work, not introduced by it). No PHP/Twig/Canvas errors on any of the three re-verified pages.

**Assembly-script idempotence (double-run byte-diff):**
```
$ ddev drush php-script scripts/aftersight-fix-visual-pass.php   # run 1
$ drush php-eval '...json_encode($e->get("components")->getValue())...' > tree-run1.json
$ ddev drush php-script scripts/aftersight-fix-visual-pass.php   # run 2
$ drush php-eval '...' > tree-run2.json
$ diff tree-run1.json tree-run2.json && echo "BYTE-IDENTICAL"
BYTE-IDENTICAL: idempotent double-run confirmed
```
Note: an initial implementation of the `additional_classes` append was NOT idempotent (unconditional string concat produced `"dy-section--cta-pair dy-section--cta-pair"` on the 2nd run) — caught by this exact check, fixed with a dedup guard (`in_array` check before appending), then re-verified clean. See "Known issues" — none remain; this is recorded for A's/O's audit trail since it was a real bug caught in-process, not a hypothetical.

## WCAG contrast ratios

Computed live via `getComputedStyle` walking up to the nearest painted background, numeric relative-luminance calculation (not axe — the pipeline profile's own §4 finding notes axe's OKLCH-header parse failure sitewide; numeric computed-style is the substantiated method).

| Element | Foreground | Background | Ratio | Threshold | Pass/Fail |
|---|---|---|---|---|---|
| Intro CTA button text/bg ("Follow the build") | `rgb(255,255,255)` | `rgb(142,74,42)` (#8E4A2A terracotta-deep) | 6.64:1 | 4.5:1 (body text, though button text is bold/large) | PASS (AA/AAA) |
| Closing CTA button text/bg ("Tell us about it") | `rgb(255,255,255)` | `rgb(142,74,42)` (#8E4A2A) | 6.64:1 | 4.5:1 | PASS (AA/AAA) |
| Closing CTA heading ("Got a CTRF use case…") | `rgb(42,37,32)` (#2A2520) | `rgb(245,239,226)` (#F5EFE2 cream) | 13.24:1 | 3.0:1 (56px large text) | PASS (AAA) |
| Pillar card body text | `rgb(92,84,76)` (#5C544C) | `rgb(255,255,255)` (white) | 7.43:1 | 4.5:1 | PASS (AAA) |

All pairings unchanged from pre-existing sitewide token pairs (no new color combination introduced by this fix pass — the closing CTA's theme change moves the *same* button-on-light-surface pairing already verified elsewhere on the site, e.g. the intro CTA, homepage hero CTA).

## Mobile responsive behavior

No new responsive CSS was written (mobile-first override already exists sitewide for `.dy-section--cta-pair` — see `dy-section.css`'s pre-existing `@media (max-width: 576px)` block, which stacks buttons full-width column at mobile; this fix only activates the already-mobile-first rule on a new page via content prop).

Verified at 360px (mobile):
- Intro CTA button: renders full-width in the mobile column-stack branch of the existing `.dy-section--cta-pair` rule (by design — matches `/services`'/`/about-us`'s mobile CTA behavior), height 56px (>= 44px touch target).
- Pillar cards: single-column stack, no clipping, no one-word-per-line wrapping (inherits the pre-existing S-1 mobile fix at `dy-section.css`'s `.dy-section.theme--light .dy-section__container` 16px mobile padding — unaffected by this change).
- Closing CTA: heading + button stack vertically, button centered, fit-content width, 56px height.
- No horizontal overflow (`scrollWidth` 345 <= `innerWidth` 360).

Verified at 768px (tablet): single-column pillar-card stack (card-canvas grid-cell `columns_medium: 6` collapses to full width at this breakpoint per the existing grid-cell prop values, unchanged by this fix), both buttons centered fit-content, no overflow.

Screenshots for all three viewports: `docs/pl2/handoffs/aftersight-fix/shots/aftersight-{360,768,1280}-after.png`.

## Autonomous decisions

1. **Defect 2 (cream breadcrumb) resolved as "no fix on this page, filed as sitewide follow-up"** rather than attempting a page-scoped CSS override. This is the most-conservative interpretation available: the brief's own reference point (the homepage) doesn't have this element at all, so there's no live pattern to "align to" on this page specifically, and a `/aftersight`-only fix would create a new, unapproved inconsistency with `/services`/`/open-source-projects`. In human-in-the-loop mode this would have been escalated to O as a spec-ambiguity ("the brief's reference case doesn't exist on this defect — how should scope be bounded?"); resolved autonomously here per the most-conservative-interpretation rule.
2. **Reused the existing `.dy-section--cta-pair` marker/rule for the single-button case** rather than writing a new marker class for "lone CTA" specifically. This is a component-reuse-style decision at the CSS layer: the existing rule's behavior generalizes correctly to 1 button, so writing a near-duplicate rule would have been an avoidable duplication. Would have surfaced as a layer-approval trace in human-in-the-loop mode; self-approved here per the mode's default self-approval policy, full trace recorded above.
3. **Chose `theme: light` (cream) over other candidate registers for the closing CTA** (e.g. `theme--dark`, which the RATIONALE.md explicitly reserves for "terminal/screenshot containers only" — NOT general callout use). `theme--light` was chosen because it's the RATIONALE's own explicit convention for "secondary/callout content" tonal separation, and because it required zero new CSS (button already renders correctly there). This is a spec-informed choice, not an ambiguity resolution — the wireframe rationale directly supports it — but recorded here since a different F might have reached for `theme--dark` by analogy to a generic "dark CTA band" pattern that doesn't actually exist yet in the approved wireframe.
4. **No GitHub issue number was provided in the spawn prompt.** Proceeded directly from the operator brief's own defect list + verification checklist, which was fully specified (specific defects named, specific fix routes suggested, specific verification steps listed). Did not block or ask, since the brief itself functioned as the acceptance-criteria source.
5. **Skipped Pantheon Dev propagation entirely** per a binding mid-task directive relayed by the coordinator (André: local-only, DB propagation deferred to a deliberate later step). The original brief's "Propagate to Pantheon Dev" section was not executed — no DB export-for-Dev, no terminus import, no Dev-URL verification. This is recorded as an autonomous-mode decision only in the sense that it was a directive *change* mid-flight that this handoff must make traceable; it was not a judgment call — it was explicit new instruction.

## Known issues

1. **Cream breadcrumb band ("wrong menu background") is unfixed on `/aftersight`** — confirmed sitewide (reproduces identically on `/services`, `/open-source-projects`), advisory-upstream (parent-theme `neonbyte` `region.css`), out of this page's scope-cap to fix alone. **Recommend filing as a separate sitewide issue** — candidate fix routes: (a) override `.region-highlighted`'s background at L3 (`html .theme--white { }`) to resolve to white instead of cream when the page's first section is also white — but this needs design confirmation on whether cream-breadcrumb-on-white-nav is even considered wrong sitewide, or whether it's an intentional site convention only André is now seeing freshly on `/aftersight` because everything else about the page was already flagged as "unfinished"; (b) leave as-is if it's confirmed to be an accepted site convention once the rest of `/aftersight`'s issues are fixed and André re-reviews. Not blocking this fix pass.
2. **Status section immediately abuts the closing CTA section** — both are now `theme--light` (cream), so there's no visual seam between "Status: now in development" and "Got a CTRF use case…" (previously there was a stronger seam because the closing band was teal). This is a minor rhythm nit, not one of the five named defects, and matches an already-supported site pattern (the CSS handles border-radius collapse for adjacent same-theme sections, e.g. `.theme--light.margin-bottom--0 + .theme--light.margin-top--0`). Flagging for S/André's visual review in case a divider or padding adjustment is wanted — not fixed preemptively since it wasn't a named defect and the brief said "content stays substantively the same... this is a visual/copy-tightening pass, not a rewrite."
3. **Pantheon Dev was NOT updated** — per binding mid-task directive (see "Autonomous decisions" #5). All fixes are local-only, verified locally, on disk for André's review. DB propagation to Dev is deferred to a deliberate later step, outside this task's scope now.

## Files changed

- `scripts/aftersight-fix-visual-pass.php` (new)
- `web/themes/custom/performant_labs_v2/css/components/dy-section.css` (modified — comment-only addition, 57 lines, zero new selectors)
- `docs/pl2/handoffs/aftersight-fix/shots/aftersight-360-after.png` (new)
- `docs/pl2/handoffs/aftersight-fix/shots/aftersight-768-after.png` (new)
- `docs/pl2/handoffs/aftersight-fix/shots/aftersight-1280-after.png` (new)
- `docs/pl2/handoffs/aftersight-fix/handoff-F.md` (new — this file)
