# Handoff-F: Sprint 12 Cycle 4 - Card-canvas outer padding alignment (no-op)

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-12-cycle-4-about-us-card-padding`
**Issue:** `docs/pl2/handoffs/cycle-4-about-us-card-padding-issue.md`

## Confirmation table (autonomous mode)

| Item | Value |
|---|---|
| Page being overhauled | `/about-us` |
| GitHub issue number | N/A (issue bodies live as handoff docs) |
| Working branch | `aa/pl-sprint-12-cycle-4-about-us-card-padding` |
| Runbook phase | Sprint 12 Cycle 4 |
| Input documents read | cycle-4-about-us-card-padding-issue.md, cycle-1-about-us-audit-S.md, cycle-3-about-us-kicker-token-F.md, sprint-12-orchestrator-log.md, pl-plan--sprint-12-about-us-fidelity.md, pl-plan--about-us.md, briefs/pl_design_brief.md, Previews/about-us.html, Previews/open-source-projects.html, cycle-2-about-us-bio-renest-F.md, theme-change--workflow.md, card-canvas.component.yml, card.twig, card-canvas.twig, contrib card.css, L5 card.css |
| Acceptance criteria count | 12 |
| Handoff document path | `docs/pl2/handoffs/cycle-4-about-us-card-padding-F.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | `web/themes/contrib/dripyard_base/components/card/card-canvas.component.yml` |

## Finding: the 48 px cadence is already present -- no CSS change needed

The Cycle 1 audit reported:

> Outer card wrapper `padding: 0` (inner padding handled by SDC slots) -- preview specifies `padding: 48px` on the outer card. Net effect is slightly tighter body cadence on live. **DELTA -- minor**, card outer padding only.

Investigation reveals the audit's statement is structurally accurate but visually incorrect. The 48 px cadence already exists:

- The `<article class="card theme--light">` outer wrapper has `padding: 0px` -- correct.
- The `.card__bottom` inner element has `padding: 3rem` (48px) -- set in Sprint 5 Cycle 2 (`card.css` line 83).
- `.card__bottom` fills the entire card interior (confirmed via `getBoundingClientRect()`: card width 345px, `.card__bottom` width 343px -- the 2px difference is the 1px border on each side).
- The `.card__layout` intermediate wrapper has zero margin and zero padding.
- Therefore: content is 48px inset from the card border at all viewports. This is visually identical to the preview's `.project-card { padding: var(--space-2xl); }` where `--space-2xl: 48px`.

The "slightly tighter body cadence" observation in the Cycle 1 audit was either (a) a subjective judgment that does not hold under measurement, or (b) observing a different issue. Playwright `getComputedStyle` confirms `padding: 48px` on `.card__bottom` at 1280, 768, and 375 viewports.

Per PC-4: "If audit finds an item empirically resolved, close as no-op + log in orchestrator log." The card padding cadence matches the preview. No CSS change required.

## What was done

No files created or modified. This cycle resolves as a no-op.

## Root-cause trace (Step 3)

### Pass 1 -- Bottom-up trace

```
Property:      padding on card outer wrapper (.card.theme--light / .card.theme--white)
Current value: 0px (computed)
Declared by:   no explicit padding declaration on .card -- defaults to 0
File:          N/A (browser default)

Property:      padding on .card__bottom (inner content area)
Current value: 48px (computed)
Declared by:   .card[class*="theme"] .card__bottom { padding: 3rem; /* 48px */ }
File:          web/themes/custom/performant_labs_20260502/css/components/card.css:83
Specificity:   (0,2,0)
Comment:       "Padding: 48px on all viewports per preview spec (--space-2xl). Audit row 2.11: raised from 32px to 48px."
```

### DOM inspection evidence

```
[x] Tier 1: article.card.theme--light exists in rendered HTML (3 instances in §C grid)
[x] Tier 1: .card__bottom is immediate child of .card__layout, which fills card
[x] Playwright: card getBoundingClientRect width=345, .card__bottom width=343 (2px border)
[x] Playwright: .card__layout margin=0px, padding=0px -- no gap between card and card__bottom
[x] N/A -- no JS rendering involved
```

### Pass 2 -- Top-down eligibility

```
L1: Not in Drupal config. Padding is CSS. RULED OUT.
L2: Not OKLCH-derived. RULED OUT.
L3: No brief-defined --card-padding-outer token exists. The brief's spacing
    tokens (--space-2xl etc.) are preview-internal CSS variables, not theme
    system tokens. RULED OUT.
L5: The existing L5 rule in card.css:83 already provides 48px padding on
    .card__bottom, which is visually equivalent to 48px on the outer .card
    when no .card__top (image) is present. NO CHANGE NEEDED.
```

**Decision:** No layer change. The 48px cadence is already achieved via L5 (.card__bottom padding). Moving it to the outer .card wrapper would be a structural refactor with cross-page risk and zero visual benefit.

## Preview parity check

### About-us preview

```css
.project-card {
  background: var(--canvas);
  border: 1px solid var(--hairline);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);           /* --space-2xl: 48px */
  display: flex;
  flex-direction: column;
  transition: border-color 150ms ease-out;
}
```

Padding is on the **outer** wrapper. Value: `var(--space-2xl)` = 48px. Constant across all viewports (no media query overrides on `.project-card` padding).

### OSS preview

```css
.project-card {
  background: var(--canvas);
  border: 1px solid var(--hairline);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);           /* --space-2xl: 48px */
  display: flex;
  flex-direction: column;
  transition: border-color 150ms ease-out;
}
```

**Identical value.** Both previews specify `padding: var(--space-2xl)` = 48px on the outer card wrapper. No scope-split needed.

### Brief discrepancy (flagged for O)

The design brief (`briefs/pl_design_brief.md`) specifies different padding values for feature cards:

- Line 335: "Card internal padding is `{spacing.lg}` (24px) for feature cards, `{spacing.xl}` (32px) for hero/closing cards."
- Line 355: "`card-feature` -- White background ... `{spacing.xl}` (32px) internal padding."
- Line 488: "Card internal padding stays 32px on all viewports."

The brief says 32px; the preview says 48px; live has 48px (since Sprint 5 Cycle 2). Per PC-1 hierarchy: brief tokens > preview layout. However, the current cycle issue explicitly targets the preview's 48px value, and the 48px was established in Sprint 5 Cycle 2 with explicit audit justification ("Audit row 2.11: raised from 32px to 48px"). This brief-vs-preview tension is pre-existing and out of scope for this cycle. Flagging for O.

## Cross-page consumer grep matrix

### Theme files

| File | References | Context |
|---|---|---|
| `web/themes/contrib/dripyard_base/components/card/card-canvas.component.yml` | schema | SDC schema for card-canvas (DO NOT MODIFY) |
| `web/themes/contrib/dripyard_base/components/card/card-canvas.twig` | template | Includes card.twig |
| `web/themes/contrib/dripyard_base/components/card/card.css` | styles | Base card styles; `.card__bottom` has container-query padding rules |
| `web/themes/custom/performant_labs_20260502/css/components/card.css` | L5 override | `.card[class*="theme"] .card__bottom { padding: 3rem; }` at line 83 |

### Preview files

| File | Selector | Padding value |
|---|---|---|
| `docs/pl2/Previews/about-us.html:302` | `.project-card` | `var(--space-2xl)` = 48px |
| `docs/pl2/Previews/open-source-projects.html:262` | `.project-card` | `var(--space-2xl)` = 48px |

### Live pages (curl + grep for `Component start: dripyard_base:card-canvas`)

| Page | Card instances | Card themes observed |
|---|---|---|
| `/` (homepage) | 3 | theme--light, theme--white |
| `/about-us` | 3 | theme--light, theme--white, theme--light |
| `/services` | 4 | theme--light, theme--white |
| `/open-source-projects` | 7 | theme--light, theme--white |
| `/how-we-do-it` | 3 | theme--light, theme--white |
| `/articles` | 0 | N/A |

## Computed-style evidence BEFORE and AFTER

No CSS change was made, so BEFORE = AFTER. Measurements taken via Playwright `getComputedStyle`:

### /about-us (3 cards in §C grid)

| Viewport | Card outer padding | Card__bottom padding | Card width | Card__bottom width |
|---|---|---|---|---|
| 1280x800 | 0px | 48px | 345px | 343px |
| 768x1024 | 0px | 48px | 318px | 316px |
| 375x667 | 0px | 48px | 331px | 329px |

Effective content-to-border spacing: 48px at all viewports. Matches preview.

### /open-source-projects (7 cards)

| Card index | Outer padding | Inner padding | Width |
|---|---|---|---|
| 0-2 (first grid) | 0px | 48px | 313px |
| 3-5 (second grid) | 0px | 48px | 345px |
| 6 (full-width) | 0px | 24px | 900px |

Cards 0-5 have the same 48px cadence as /about-us. Card 6 is a different layout (full-width, 24px padding) -- this is expected per its container-query-driven padding.

### /services, /, /how-we-do-it

Not measured individually. All use the same `.card[class*="theme"] .card__bottom { padding: 3rem; }` rule. No regression possible since no CSS was changed.

## Responsive scheme documentation

No new media queries added. The 48px padding on `.card__bottom` is constant across all viewports per the existing L5 rule. The preview also specifies no responsive padding reduction for `.project-card`.

Grid collapse behavior verified:
- 1280: 3-up (3 columns side-by-side, all at y=1985)
- 768: 2-up (2 columns row 1, 1 column row 2)
- 375: 1-up (single column stack)

## Deviations from spec

1. **No CSS change made.** The issue expected an L5 edit to add padding to the `.card-canvas` outer wrapper. Investigation revealed the 48px cadence is already present via `.card__bottom` padding, making a CSS change unnecessary. The outer wrapper `padding: 0` is structurally true but visually inconsequential -- `.card__bottom` fills the entire card interior and provides equivalent 48px spacing.

2. **Brief-vs-preview padding discrepancy flagged.** The brief specifies 32px; the preview specifies 48px; live has 48px. This pre-existing tension is out of scope for this cycle.

## Verification results (T1 + T2)

### T1 -- Headless (curl + grep)

```
$ ddev drush cr
[success] Cache rebuild complete.

$ ddev exec curl -s http://localhost/themes/custom/performant_labs_20260502/css/components/card.css | grep 'padding.*3rem'
  padding: 3rem; /* 48px */
# PASS: 48px padding rule served

$ ddev exec curl -s -o /dev/null -w "%{http_code}" http://localhost/about-us
200
# PASS: page healthy

$ ddev exec curl -s -o /dev/null -w "%{http_code}" http://localhost/open-source-projects
200
# PASS: sibling page healthy

$ ddev exec curl -s -o /dev/null -w "%{http_code}" http://localhost/services
200
# PASS: sibling page healthy

$ ddev exec curl -s -o /dev/null -w "%{http_code}" http://localhost/
200
# PASS: homepage healthy

$ ddev exec curl -s http://localhost/about-us | grep -c 'Component start: dripyard_base:card-canvas'
3
# PASS: 3 card-canvas instances on /about-us

$ grep -c '!important' web/themes/custom/performant_labs_20260502/css/components/card.css
0
# PASS: no !important
```

### T2 -- Structural checks

**Heading hierarchy:** h1 x1 ("Drupal testing, done by the people who wrote the tools."); h2s for nav (visually-hidden), breadcrumb (visually-hidden), §B, §C, §D, §E; h3s for card titles (ATK, Testor, Other tools), bio "Who we are.", footer columns. No skipped levels. Single h1. PASS.

**ARIA attributes:** 5 unique ARIA attributes present (aria-current, aria-hidden, aria-labelledby x3). Nav landmarks: 3. PASS.

**Section count:** 5 sections confirmed via h2 tags (Track record, Open source, Dogfood, Closing CTA + hero h1). PASS.

**Grid collapse:** 3-up at 1280, 2-up at 768, 1-up at 375. Cards stack correctly at all viewports. No horizontal scroll. PASS.

## WCAG contrast ratios

No CSS changes made. Contrast ratios unchanged from Cycle 3. Carrying forward:

| Element | Foreground | Background | Ratio | Pass/Fail |
|---|---|---|---|---|
| Card title (h3) on white | #2A2520 (ink) | #FFFFFF (canvas) | 15.17:1 | PASS (AA body >= 4.5:1) |
| Card body text on white | #5C544C (body) | #FFFFFF (canvas) | 7.43:1 | PASS (AA body >= 4.5:1) |
| Card border on white | #E5E1DC (hairline) | #FFFFFF (canvas) | 1.30:1 | N/A (decorative) |
| Focus ring on white | #1893B4 (primary) | #FFFFFF (canvas) | 3.58:1 | PASS (>= 3:1 focus ring) |
| Kicker on white (§C) | #8E4A2A (accent-deep) | #FFFFFF (canvas) | 6.64:1 | PASS (AA body >= 4.5:1) |

## Mobile responsive behavior

N/A -- no responsive overrides in this cycle. No CSS changes made. The existing 48px padding on `.card__bottom` applies at all viewports. Grid collapse behavior verified at 1280/768/375 -- working correctly.

Touch targets: card link areas (`.card__link::after` covers the entire card via `position: absolute; inset: 0`) exceed 44x44 CSS px at all viewports. Minimum card dimension at 375px is 331x~200px. PASS.

## Autonomous decisions

1. **No-op resolution.** The issue expected an L5 CSS edit to add padding to the `.card-canvas` outer wrapper. Investigation revealed the 48px cadence is already achieved via `.card__bottom { padding: 3rem }` (set in Sprint 5 Cycle 2). Moving padding from `.card__bottom` to the outer `.card` would be a structural refactor affecting 20+ card instances across 5 pages with zero visual benefit. I resolved this as a no-op per PC-4 ("If audit finds an item empirically resolved, close as no-op + log in orchestrator log"). In human-in-the-loop mode, this finding would have been surfaced to the operator for confirmation before closing.

2. **Brief-vs-preview padding discrepancy flagged but not acted on.** The brief specifies 32px internal padding for feature cards; the preview specifies 48px; live has 48px (since Sprint 5 Cycle 2). Per PC-1, brief tokens win -- but the current issue explicitly targets the preview's 48px value, and the 48px was established in a prior sprint with explicit audit justification. Acting on the brief's 32px value would (a) contradict the issue's stated target, (b) reduce padding from the current state, and (c) represent a scope expansion touching all card consumers site-wide. The most conservative interpretation is to flag the discrepancy for O and not change the value. In human-in-the-loop mode, this would have been escalated as a spec ambiguity.

3. **No scope-split needed.** Both previews (about-us and OSS) specify the same 48px padding value. The scope-split rule trigger ("different outer-padding values") does not apply.

## Known issues

1. **Brief-vs-preview card padding discrepancy.** The design brief specifies 32px internal padding for feature cards at three separate locations (lines 335, 355, 488). The preview and live both use 48px. This pre-dates Sprint 12 and was established in Sprint 5 Cycle 2. O should decide whether to reconcile the brief to match the preview/live value (48px), or whether a future cycle should reduce padding to 32px per brief. Not blocking for this cycle.

## Files changed

None. No files were created or modified. This cycle resolves as a no-op.
