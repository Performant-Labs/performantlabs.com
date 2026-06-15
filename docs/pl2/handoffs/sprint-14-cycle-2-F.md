# Handoff-F: Sprint 14 Cycle 2 - `/about-us` preview-doc batch (F-NEW-1 + F-NEW-3)

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-14-cycle-2-about-us-preview-doc`
**Issue:** `docs/pl2/handoffs/sprint-14-cycle-2-issue.md`

## Confirmation table (autonomous mode)

| Item | Value |
|---|---|
| Page | `/about-us` |
| Issue | `docs/pl2/handoffs/sprint-14-cycle-2-issue.md` |
| Branch | `aa/pl-sprint-14-cycle-2-about-us-preview-doc` |
| Runbook phase | Sprint 14 Cycle 2 (preview-doc batch) |
| Input documents read | issue, Cycle 1 audit, `about-us.html`, design brief (via audit token table) |
| Acceptance criteria count | 5 |
| Handoff document path | `docs/pl2/handoffs/sprint-14-cycle-2-F.md` |
| CSS workflow path | N/A (preview-doc layer, not theme CSS) |
| Component schema source of truth | N/A (no component changes) |

## What was done

- **`docs/pl2/Previews/about-us.html` line 254** -- changed `.hero h1 { font-size: 64px }` to `font-size: 72px` and `letter-spacing: -1.6px` to `letter-spacing: -2px`. Matches brief `display-xl` token (72 / lh 1.05 / -2 px / Rubik 500).
- **`docs/pl2/Previews/about-us.html` line 461 (new)** -- added `.closing-cta .btn--primary { background: #5DC6E8; color: #1F1A14; }` to override the dark-zone primary CTA bg/color per brief line 319.
- **`docs/pl2/Previews/about-us.html` line 462 (new)** -- added `.closing-cta .btn--primary:hover { background: #4AB8DA; color: #1F1A14; }` hover state (slightly darker tint, same text color).

## Layer decisions

Both fixes are at the **preview-doc layer** -- edits to `docs/pl2/Previews/about-us.html` only. No theme files, no Drupal templates, no Canvas content.

**F-NEW-1 trace:** Brief `display-xl` token = 72px / lh 1.05 / -2px letter-spacing. Preview had 64px / -1.6px. Fixed to match brief. The base `.hero h1` rule (line 253) is the correct location; no media query involved for desktop. Mobile rule at `@media (max-width: 767px)` line 514 was NOT changed (Cycle 3 scope per F-NEW-2).

**F-NEW-3 trace:** Brief line 319 = "Dark-zone CTA buttons use `#5DC6E8` bg with `#1F1A14` text." The base `.btn--primary` rule (line 141) uses `var(--primary-light)` = `#62BBCB` + white, which is correct for light zones. Added a `.closing-cta .btn--primary` override to apply the dark-zone tokens. Selector specificity: `.closing-cta .btn--primary` (0,2,0) beats `.btn--primary` (0,1,0). No `!important` needed.

## Before/after computed values

### F-NEW-1: Hero H1 (desktop only)

| Property | Before | After | Brief |
|---|---|---|---|
| `font-size` | 64px | 72px | 72px |
| `line-height` | 67.2px (64*1.05) | 75.6px (72*1.05) | 1.05 |
| `letter-spacing` | -1.6px | -2px | -2px |
| `font-weight` | 500 | 500 (unchanged) | 500 |
| Mobile (`< 768px`) | 40px | 40px (unchanged) | 44px (Cycle 3) |

### F-NEW-3: Closing-CTA primary button

| Property | Before | After | Brief line 319 |
|---|---|---|---|
| `background` | `#62BBCB` (rgb 98,187,203) | `#5DC6E8` (rgb 93,198,232) | `#5DC6E8` |
| `color` | `#FFFFFF` | `#1F1A14` (rgb 31,26,20) | `#1F1A14` |

Light-zone CTAs (hero + section D) remain unchanged at `#62BBCB` + white -- confirmed via Playwright probe of all three `.btn--primary` elements.

## Deviations from spec

None.

## Verification results (T1 + T2)

### T1: grep-based checks

**Hero H1 font-size (desktop 72px, mobile 40px unchanged):**
```
$ grep -n 'font-size.*72\|font-size.*40' docs/pl2/Previews/about-us.html
254:      font-size: 72px;       <-- desktop (PASS)
274:      font-size: 40px;       <-- hero__subhead (unrelated)
514:      .hero h1 { font-size: 40px; letter-spacing: -1px; }  <-- mobile (UNCHANGED - PASS)
```

**CTA token colors:**
```
$ grep -n -E '#5DC6E8|#1F1A14|#62BBCB' docs/pl2/Previews/about-us.html
27:      --espresso: #1F1A14;                                     <-- espresso bg variable (pre-existing)
461:    .closing-cta .btn--primary { background: #5DC6E8; color: #1F1A14; }  <-- PASS
462:    .closing-cta .btn--primary:hover { background: #4AB8DA; color: #1F1A14; }  <-- hover
```
No `#62BBCB` literal appears except in the CSS variable declaration `--primary-light: #62bbcb` (line 14), confirming the base `.btn--primary` still uses `var(--primary-light)` and was not touched.

### T2: Playwright computed-style probes

**Hero H1 at 1280:**
```json
{"fontSize":"72px","letterSpacing":"-2px","lineHeight":"75.6px"}
```
PASS -- matches brief `display-xl` (72 / 1.05 / -2px).

**Closing-CTA `.btn--primary` at 1280:**
```json
{"bg":"rgb(93, 198, 232)","color":"rgb(31, 26, 20)"}
```
PASS -- `rgb(93,198,232)` = `#5DC6E8`, `rgb(31,26,20)` = `#1F1A14`.

**All three `.btn--primary` elements (zone isolation check):**

| Button | Zone | Background | Color | Status |
|---|---|---|---|---|
| "Book a testing review" (hero) | light | rgb(98,187,203) = `#62BBCB` | white | Unchanged |
| "Read how the workflow is wired" (section D) | light | rgb(98,187,203) = `#62BBCB` | white | Unchanged |
| "Book a testing review" (closing-CTA section E) | dark | rgb(93,198,232) = `#5DC6E8` | rgb(31,26,20) = `#1F1A14` | Fixed |

### T2: Orphan-word check

H1 at 72px/1280 wraps to 3 lines with `text-wrap: balance` applied (confirmed via computed style). "Drupal testing, done by the people who wrote the tools." -- `balance` distributes words roughly evenly across lines. No single-word orphan on the last line. BoundingClientRect height = 226.8px / 75.6px line-height = 3.0 lines.

### DSSIM post-fix (1280, hero + closing-cta)

| Section | Cycle 1 DSSIM | Cycle 2 DSSIM | Delta |
|---|---|---|---|
| hero@1280 | 0.194 | 0.193 | -0.001 |
| closing-cta@1280 | 0.169 | 0.169 | ~0.000 |

DSSIM did not drop materially. **Root cause:** the per-section DSSIM at these sections is dominated by pre-existing deltas that were NOT in scope for Cycle 2:
- **Hero:** body-lg drift (subhead 19px vs live 20px vs brief 18px), CTA-chrome structural delta (F-NEW-4: preview 45px pill vs live 56px component with SVG suffix). The H1 size fix contributes positively but is swamped by these other deltas.
- **Closing-CTA:** CTA-chrome structural delta (F-NEW-4), body text wrap differences. The bg-color token fix is a small-area change compared to the full-section crop.

The computed-style probe (T2) is the binding verification for these targeted fixes. DSSIM will improve materially only when F-NEW-4 (CTA-chrome structural delta) is addressed in a future cycle.

## WCAG contrast ratios

| Element | Foreground | Background | Ratio | Requirement | Pass/Fail |
|---|---|---|---|---|---|
| Closing-CTA `.btn--primary` text | `#1F1A14` | `#5DC6E8` | 8.81:1 | >= 4.5:1 (AA normal) | PASS |
| Focus ring `#1893B4` on espresso `#1F1A14` | `#1893B4` | `#1F1A14` | 4.83:1 | >= 3:1 (non-text) | PASS |
| Light-zone `.btn--primary` text (unchanged) | `#FFFFFF` | `#62BBCB` | 2.21:1 | >= 4.5:1 | FAIL (pre-existing ADV-S5, operator-approved Sprint 9) |

## Mobile responsive behavior

N/A -- no responsive overrides written in this cycle. Mobile hero H1 rule at `@media (max-width: 767px)` remains `40px` (Cycle 3 scope, F-NEW-2). The `@media (max-width: 575px)` breakpoint was not modified.

## Autonomous decisions

1. **Hover state for dark-zone CTA:** The issue and audit specified `background: #5DC6E8; color: #1F1A14` for the primary state but did not specify a hover state. Conservative interpretation: added a hover rule with a slightly darker blue (`#4AB8DA`) and same `#1F1A14` text, paralleling the base `.btn--primary:hover` pattern (which darkens the bg to `--primary`). This prevents the hover reverting to the light-zone hover color (`var(--primary)` + white) which would flash incorrect colors.
2. **DSSIM non-improvement:** Accepted that DSSIM would not drop materially because of pre-existing structural deltas (F-NEW-4, body-lg drift) dominating the section crops. Relied on T2 computed-style probes as binding verification instead.
3. **`text-wrap: balance` at 72px:** At 72px the H1 wraps to 3 lines (was 2 at 64px). The `text-wrap: balance` property (already present in the preview) prevents orphans. Accepted 3-line wrap as correct since the brief specifies 72px and the live site also renders at 72px.

## Known issues

None. All five acceptance criteria are met:
- [x] F-NEW-1: Hero H1 desktop = 72px, letter-spacing = -2px (verified by T2 probe)
- [x] F-NEW-3: Closing-CTA primary btn bg = `#5DC6E8`, color = `#1F1A14` (verified by T2 probe)
- [x] Mobile hero H1 unchanged at 40px (verified by grep + no edits to media query)
- [x] No other preview file modified; no live code modified
- [x] DSSIM re-run completed; values reported (non-drop explained by pre-existing structural deltas outside Cycle 2 scope)

## Files changed

- `docs/pl2/Previews/about-us.html` (lines 254, 256, 461-462)
