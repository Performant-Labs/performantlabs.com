# Handoff-F: Cycle 2 - Engagement Cards Preview Fidelity

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-5-cycle-2-engagements`
**Issue:** `docs/pl2/handoffs/cycle-2-engagements-issue.md`

## Confirmation table (autonomous mode)

| Item | Value |
|---|---|
| Page being overhauled | `/services` |
| GitHub issue number | `docs/pl2/handoffs/cycle-2-engagements-issue.md` (local file, not GH issue) |
| Working branch | `aa/pl-sprint-5-cycle-2-engagements` |
| Runbook phase | Sprint 5, Cycle 2 |
| Input documents read | cycle-1-audit-services-S.md, services.html (preview), pl_design_brief.md, services--engagement-cards.md, theme-change--workflow.md, pl-plan--sprint-5-services-fidelity.md |
| Acceptance criteria count | 14 |
| Handoff document path | `docs/pl2/handoffs/cycle-2-engagements-F.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | `web/themes/custom/performant_labs_20260418/components/card-canvas/card-canvas.component.yml` |
| Active theme | `performant_labs_20260502` (not `performant_labs_20260418`) |

## What was done

- **`web/themes/custom/performant_labs_20260502/css/components/card.css`** (modified) -- E2: removed `text-transform: uppercase` from `.card__eyebrow-text` so title-case content from Canvas renders as-is. E5: zeroed `--card-bottom-gap` on `.card__bottom` so eyebrow `margin-block-end: 24px` is the sole spacing between eyebrow and title (was 44px = 20px gap + 24px margin). Added `margin-bottom: 12px` on `.card__title` to match preview title-to-body spacing.
- **`web/themes/custom/performant_labs_20260502/css/components/grid-wrapper.css`** (modified) -- E6: added `row-gap: 1.5rem` (24px) on `.grid-wrapper--2col .grid-wrapper__grid` to override Dripyard's `.gutter-row--l` (64px). Specificity (0,2,0) beats utility class (0,1,0).
- **`scripts/sprint5-cycle2-engagement-content.php`** (new) -- E2 + E3: Canvas content patch script. Changes eyebrow text to title case ("01 / Takeover", "02 / Embed", "03 / Pilot", "04 / a11y") and adds trailing period to all four card titles.
- **Canvas entity** (database, canvas_page id=3) -- E2 + E3 content applied via the script above. Inputs JSON updated on components 11-14.

## Layer decisions

### E2 (eyebrow casing) -- Canvas content
- **Trace:** The casing difference is a per-card text value, not a CSS transform. The preview does not apply `text-transform` on `.engagement-card__num`. The existing card.css had `text-transform: uppercase` which forced all eyebrow text to uppercase regardless of source content.
- **Decision:** Remove `text-transform: uppercase` from CSS (Layer 5 edit). Update the four eyebrow_text values in Canvas to title case. This matches the preview's approach: content determines casing, no CSS transform.

### E3 (trailing periods) -- Canvas content
- **Trace:** The trailing period is content, not styling. Preview h3 texts end with `.` in the HTML source. Live titles lacked the period.
- **Decision:** Add `.` to each title in Canvas inputs JSON.

### E5 (eyebrow-to-title spacing) -- Layer 5
- **Pass 1 (bottom-up):** `.card__bottom` sets `gap: var(--card-bottom-gap)` (contrib = 20px). `.card__eyebrow-text` had `margin-block-end: 1.5rem` (24px). Total visual distance eyebrow-to-title = 44px. Preview has 24px.
- **Pass 2 (top-down):**
  - L1: Not config. Ruled out.
  - L3: `--card-bottom-gap` is not a theme token; it's a component-internal variable. Ruled out.
  - L5: Override `--card-bottom-gap` to 0 in `.card__bottom`, letting the eyebrow's own `margin-block-end: 24px` be the sole spacing mechanism. Correct layer.
- **Chosen:** L5. No cross-page risk: `--card-bottom-gap` override is scoped to `.card[class*="theme"] .card__bottom`.

### E6 (grid row gap) -- Layer 5
- **Pass 1 (bottom-up):** `.gutter-row--l` (0,1,0) sets `row-gap: var(--spacing-xl)` = 64px. Preview uses `gap: var(--space-lg)` = 24px.
- **DOM inspection gate:** `.grid-wrapper--2col .grid-wrapper__grid.gutter-column--l.gutter-row--l` confirmed via T1 curl. Wrapper exists and imposes the 64px row-gap.
- **Pass 2 (top-down):**
  - L1: Not config. Ruled out.
  - L3: `--spacing-xl` is a Dripyard layout variable; overriding at `:root` would affect all `gutter-row--l` elements site-wide (too broad). Ruled out.
  - L5: Override `row-gap` on `.grid-wrapper--2col .grid-wrapper__grid`. Specificity (0,2,0) beats `.gutter-row--l` (0,1,0). Correct layer.
- **Chosen:** L5.
- **Cross-page check:** `.grid-wrapper--2col` confirmed via T1 grep to appear ONLY on `/services` (0 matches on `/` and `/articles`). No cross-page risk.

## Deviations from spec

1. **Card padding 48px vs issue's `--space-lg` (24px):** The issue says E1 remediation uses `--space-lg` inner padding. However, the existing card.css already has 48px padding (established in a prior sprint) matching the preview's `padding: var(--space-2xl)` = 48px. The brief's `card-feature.padding` is 32px. I retained the existing 48px because it matches the preview (preview wins on layout per precedence). Documented for S to verify visually.

2. **Grid row-gap 24px vs issue's target of ~48px:** The issue says E6 target is `--space-xl` (32px in brief). The preview CSS literally uses `gap: var(--space-lg)` = 24px. Per source-of-truth precedence, preview wins on layout. I used 24px. The audit's "~48px" measurement likely included card internal padding in the visual measurement.

3. **component_version NOT set to NULL:** Canvas requires a valid version hash in `component_version`. Setting it to NULL or empty string causes an `OutOfRangeException` at render time ("The requested version `` is not available"). The content patch script updates `inputs` JSON only and leaves `component_version` unchanged. Canvas correctly re-renders components from updated inputs.

4. **N2 (nearshore H2 content-cap) NOT folded in:** The nearshore section has no unique CSS identifier (it's a generic `.dy-section` with no distinguishing class). Scoping a content-cap to only the nearshore H2 would require either a fragile `:nth-of-type` selector or a Canvas structural change (adding a CSS class to the section). Both are higher risk than justified for a small metric tweak. Deferred to a separate cycle.

## Verification results (T1 + T2)

### T1 -- HTTP 200

```
/services  → 200
/           → 200
/articles   → 200
```

### T1 -- Content grep (E2 eyebrow casing)

```
01 / Takeover   (was: 01 / TAKEOVER)
02 / Embed      (was: 02 / EMBED)
03 / Pilot      (was: 03 / PILOT)
04 / a11y       (unchanged)
```

### T1 -- Content grep (E3 trailing periods)

```
card__title">Test-suite takeover.
card__title">Embedded testing engineer.
card__title">Autonomous-healing pilot.
card__title">Accessibility testing.
```

### T1 -- CSS loaded

```
css/components/card.css?tew0rt        (theme override, text-transform removed)
css/components/grid-wrapper.css?tew0rt (row-gap override present)
```

### T2 -- text-transform removed

Served card.css contains zero `text-transform` property declarations (5 matches are all in CSS comments describing the removal).

### T2 -- row-gap override present

Served grid-wrapper.css contains `row-gap: 1.5rem` in the `.grid-wrapper--2col .grid-wrapper__grid` rule.

### T2 -- Heading hierarchy

```
H1 (hero) → H2 (section heads) → H3 (card titles)
No skipped levels. PASS.
```

### T2 -- ARIA / semantic

Cards render as `<article>` elements with `id` attributes for anchor linking. PASS.

### T2 -- No !important

```
card.css:         0 occurrences
grid-wrapper.css: 0 occurrences
```

### T2 -- Spot-check homepage

Homepage card titles render correctly: "Tools the Drupal community uses", "Tests that heal themselves", "Experts alongside your team". No regression.

### T2 -- Spot-check /articles

40+ card/article-card elements render. No regression.

## WCAG contrast ratios

| Element | Foreground | Background | Ratio | Pass/Fail |
|---|---|---|---|---|
| Card body text | #5C544C | #FFFFFF | 7.43:1 | PASS (AA body) |
| Card title (h3) | #1F1A14 | #FFFFFF | 17.27:1 | PASS (AAA) |
| Eyebrow text | #8E4A2A | #FFFFFF | 6.64:1 | PASS (AA body) |
| Eyebrow accent line | #C97B5C | #FFFFFF | 3.25:1 | PASS (decorative) |
| Card border | #E5E1DC | #FFFFFF | 1.30:1 | N/A (decorative, not informational) |
| Card hover border | #1893b4 | #FFFFFF | 3.58:1 | PASS (non-text 3:1) |

## Mobile responsive behavior

N/A -- no responsive overrides in this cycle. The engagement card grid's responsive behavior (2x2 at desktop, 1-col at mobile) is handled by existing grid-wrapper.css rules and Dripyard's container queries. The row-gap override (24px) applies at all viewports. Card padding (48px) applies at all viewports. Touch targets for card links (if any) meet 44x44 via full-card padding.

## Autonomous decisions

1. **N2 fold-in declined:** The nearshore section lacks a unique CSS identifier, making scoped styling fragile. Deferred to its own cycle rather than risk a cross-section side effect.

2. **Row-gap value 24px chosen over issue's 32px:** Issue specified `--space-xl` (brief = 32px). Preview CSS uses `gap: var(--space-lg)` = 24px. Applied the preview value per source-of-truth precedence rule (preview wins on layout/composition).

3. **Card padding left at 48px:** Issue E1 remediation says `--space-lg` (24px). Prior sprint already set 48px matching the preview. Retained 48px since it matches the preview (preview wins on layout) and the brief's `card-feature.padding: 32px` is a fallback that the preview supersedes.

4. **component_version left unchanged:** Canvas throws `OutOfRangeException` when component_version is NULL or empty. The F prompt requirement to set it to NULL cannot be satisfied without breaking the page. Content changes persist correctly via inputs JSON update.

5. **Active theme identification:** Discovered during implementation that the active theme is `performant_labs_20260502` (not `performant_labs_20260418` as referenced in some input documents). The card-canvas SDC component lives in 20260418 but the CSS overrides are in 20260502 (which is the currently-active theme). All CSS edits were made in the correct active theme.

## Known issues

None. All five deltas (E1, E2, E3, E5, E6) are addressed. E4 was already MATCH per the audit. N2 is deferred.

## Files changed

- `web/themes/custom/performant_labs_20260502/css/components/card.css` (modified)
- `web/themes/custom/performant_labs_20260502/css/components/grid-wrapper.css` (modified)
- `scripts/sprint5-cycle2-engagement-content.php` (new)
- Canvas entity `canvas_page` id=3 (database -- E2/E3 content patches applied)
