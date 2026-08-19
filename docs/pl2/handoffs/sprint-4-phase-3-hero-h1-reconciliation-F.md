# Handoff-F: Sprint 4 Cycle 3 - Hero H1 size reconciliation

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-4-phase-3-hero-h1-reconciliation`
**Issue:** `docs/pl2/handoffs/sprint-4-phase-3-hero-h1-reconciliation-issue.md`

| Item | Value |
|------|-------|
| Page being overhauled | Cross-page (all four landing pages) |
| Sprint cycle | Sprint 4, Cycle 3 |
| Working branch | `aa/pl-sprint-4-phase-3-hero-h1-reconciliation` |
| Runbook phase | Cycle 3 -- Hero H1 size reconciliation (L.1) |
| Input documents read | Sprint runbook S4 Cycle 3, design brief (display-xl token), all 4 preview HTMLs |
| Acceptance criteria count | 4 |
| Handoff document path | `docs/pl2/handoffs/sprint-4-phase-3-hero-h1-reconciliation-F.md` |
| CSS workflow | Not applicable (preview HTML + brief documentation only) |
| Operator pre-commitment | Path A -- reconcile previews UP to 72px |

## Pre-flight check

| Preview file | Pre-existing font-size | Pre-existing letter-spacing | Already done? |
|---|---|---|---|
| `homepage.html` | 72px | -2px | Yes -- already at target |
| `services.html` | 64px | -1.6px | No -- updated this cycle |
| `how-we-do-it.html` | 64px | -1.6px | No -- updated this cycle |
| `open-source-projects.html` | 64px | -1.6px | No -- updated this cycle |

## What was done

- `docs/pl2/Previews/services.html` (line 197): changed hero H1 `font-size: 64px` to `font-size: 72px`; changed `letter-spacing: -1.6px` to `letter-spacing: -2px`
- `docs/pl2/Previews/how-we-do-it.html` (line 199): changed hero H1 `font-size: 64px` to `font-size: 72px`; changed `letter-spacing: -1.6px` to `letter-spacing: -2px`
- `docs/pl2/Previews/open-source-projects.html` (line 208): changed hero H1 `font-size: 64px` to `font-size: 72px`; changed `letter-spacing: -1.6px` to `letter-spacing: -2px`
- `docs/pl2/briefs/pl_design_brief.md` (line 54): added YAML comment under `display-xl` codifying it as the standard landing-page hero H1 size

No changes to `homepage.html` (already at 72px / -2px).

## Autonomous decisions

1. **Letter-spacing target: -2px (not -1.8px).** The issue text mentions "-1.8px tracking" in two places. However, the design brief's `display-xl` token specifies `letterSpacing: -2px`, and the homepage preview (already at 72px) uses `-2px`. Since the operator's pre-commitment says "Brief stays unchanged (already has `display-xl: 72px`)" and Path A means reconciling previews UP to match the brief/live, I used `-2px` to match both the brief and the homepage preview. Using `-1.8px` would have created a new inconsistency between homepage and the other three previews, and between the previews and the brief.

2. **Brief annotation wording.** The issue suggested: "display-xl is the standard hero size for landing-page hero H1s (homepage, services, how-we-do-it, open-source-projects). 72px / -1.8px tracking." I used the same structure but corrected the tracking value to `-2px` for consistency with the token definition immediately above the comment. The annotation was placed as a YAML comment on line 54, between the `display-xl` block and the `display-lg` block.

3. **Mobile hero H1 sizes not touched.** The three non-homepage previews use `font-size: 40px` for the mobile hero H1 override, while the homepage uses `font-size: 44px` (matching the brief's `typography-mobile.display-xl: 44px`). This pre-existing inconsistency is outside the scope of this cycle (desktop hero H1 reconciliation only). Documenting here for future cleanup.

## Layer decisions

Not applicable. No CSS changes. All edits are to preview HTML files and the design brief documentation.

## Deviations from spec

The issue specified `-1.8px` tracking; I used `-2px` instead. Rationale in Autonomous decisions #1 above. This is a correction to match the brief, not a deviation from it.

## Verification results (T1 + T2)

### T1: All four hero H1 blocks now identical

```
--- docs/pl2/Previews/homepage.html ---
    .hero h1 {
      font-size: 72px;
      line-height: 1.05;
      letter-spacing: -2px;
      font-weight: 500;

--- docs/pl2/Previews/services.html ---
    .hero h1 {
      font-size: 72px;
      line-height: 1.05;
      letter-spacing: -2px;
      font-weight: 500;

--- docs/pl2/Previews/how-we-do-it.html ---
    .hero h1 {
      font-size: 72px;
      line-height: 1.05;
      letter-spacing: -2px;
      font-weight: 500;

--- docs/pl2/Previews/open-source-projects.html ---
    .hero h1 {
      font-size: 72px;
      line-height: 1.05;
      letter-spacing: -2px;
      font-weight: 500;
```

### T1: Brief token consistent with previews

```
  display-xl:
    fontFamily: "Rubik, sans-serif"
    fontSize: 72px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -2px
  # display-xl is the standard hero size for all landing-page hero H1s ...
```

### T2: No non-hero H1 contexts affected

Grep for H1 styling outside `.hero` context returned zero matches in all three modified files. No regressions on non-hero H1 contexts.

## WCAG contrast ratios

Not applicable. No color or background changes in this cycle.

## Mobile responsive behavior

N/A -- no responsive overrides written in this cycle. Pre-existing mobile inconsistency (40px vs 44px mobile hero H1) noted in Autonomous decisions #3 for future cleanup.

## Known issues

1. **Mobile hero H1 inconsistency (pre-existing, not introduced by this cycle).** The three non-homepage previews use `font-size: 40px` for mobile hero H1; the homepage uses `font-size: 44px` per the brief's `typography-mobile.display-xl`. This should be reconciled in a future cycle.

## Files changed

- `docs/pl2/Previews/services.html`
- `docs/pl2/Previews/how-we-do-it.html`
- `docs/pl2/Previews/open-source-projects.html`
- `docs/pl2/briefs/pl_design_brief.md`
