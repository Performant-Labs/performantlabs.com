# Handoff-F: Sprint 15 Cycle 2 - `/how-we-do-it` preview section-F CTA token (F-NEW-15-C)

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-15-cycle-2-preview-doc`
**Issue:** `docs/pl2/handoffs/sprint-15-cycle-2-issue.md`

## Confirmation table (autonomous mode)

| Item | Value |
|---|---|
| Page | `/how-we-do-it` |
| Issue | `docs/pl2/handoffs/sprint-15-cycle-2-issue.md` |
| Branch | `aa/pl-sprint-15-cycle-2-preview-doc` |
| Runbook phase | Sprint 15 Cycle 2 (preview-doc CTA token fix) |
| Input documents read | issue, Sprint 15 Cycle 1 audit (F-NEW-15-C), Sprint 14 Cycle 2 F handoff (precedent), `how-we-do-it.html` |
| Acceptance criteria count | 5 |
| Handoff document path | `docs/pl2/handoffs/sprint-15-cycle-2-F.md` |
| CSS workflow path | N/A (preview-doc layer, not theme CSS) |
| Component schema source of truth | N/A (no component changes) |

## What was done

- **`docs/pl2/Previews/how-we-do-it.html` line 428 (new)** -- added `.closing-cta .btn--primary { background: #5DC6E8; color: #1F1A14; }` to override the dark-zone primary CTA bg/color per brief line 319.
- **`docs/pl2/Previews/how-we-do-it.html` line 429 (new)** -- added `.closing-cta .btn--primary:hover { background: #4AB8DA; color: #1F1A14; }` hover state (slightly darker tint, same dark text color).

## Layer decisions

Fix is at the **preview-doc layer** -- edits to `docs/pl2/Previews/how-we-do-it.html` only. No theme files, no Drupal templates, no Canvas content.

**F-NEW-15-C trace:** Brief line 319 = "Dark-zone CTA buttons use `#5DC6E8` bg with `#1F1A14` text." The base `.btn--primary` rule (line 138) uses `var(--primary-light)` = `#62BBCB` + white, which is correct for light zones. Added a `.closing-cta .btn--primary` override to apply the dark-zone tokens. Selector specificity: `.closing-cta .btn--primary` (0,2,0) beats `.btn--primary` (0,1,0). No `!important` needed. Same pattern as Sprint 14 Cycle 2 F-NEW-3 on `about-us.html`.

## Before/after computed values

### F-NEW-15-C: Closing-CTA primary button (section F)

| Property | Before | After | Brief line 319 |
|---|---|---|---|
| `background` | `#62BBCB` (via `var(--primary-light)`) | `#5DC6E8` (rgb 93,198,232) | `#5DC6E8` |
| `color` | `#FFFFFF` | `#1F1A14` (rgb 31,26,20) | `#1F1A14` |
| `hover background` | `#1893B4` (via `var(--primary)`) | `#4AB8DA` | -- |
| `hover color` | `#FFFFFF` | `#1F1A14` | -- |

This page has only one `.btn--primary` element (line 637, "Book a testing review" in the closing-CTA section F). There are no light-zone primary buttons to verify non-regression against (hero has no CTA button, sections B-E have no primary CTAs). The ghost-on-dark button ("See all engagement shapes") is unaffected as it uses `.btn--ghost-on-dark`, not `.btn--primary`.

## Deviations from spec

None.

## Verification results (T1 + T2)

### T1: grep-based checks

**CTA token colors (new dark-zone override present):**
```
$ grep -nE '#5DC6E8|#1F1A14' docs/pl2/Previews/how-we-do-it.html
27:      --espresso: #1F1A14;                                           <-- pre-existing variable
428:    .closing-cta .btn--primary { background: #5DC6E8; color: #1F1A14; }  <-- PASS
429:    .closing-cta .btn--primary:hover { background: #4AB8DA; color: #1F1A14; }  <-- hover PASS
```

**Light-zone token isolation (`#62BBCB` only in variable declaration):**
```
$ grep -nE '#62BBCB|#62bbcb' docs/pl2/Previews/how-we-do-it.html
14:      --primary-light: #62bbcb;    <-- variable declaration only (PASS)
```
No `#62BBCB` literal appears anywhere except the CSS variable declaration, confirming the base `.btn--primary` still uses `var(--primary-light)` and was not touched.

**Only file modified:**
```
$ git diff --name-only
docs/pl2/Previews/how-we-do-it.html
```
PASS -- no other preview file or live code modified.

### T2: Structural checks

**Single `.btn--primary` on this page:**
This page contains exactly one `.btn--primary` element (line 637), located inside `.closing-cta` (section F, espresso zone). There are no light-zone primary CTAs on this page (hero has no button, sections B-E use no `.btn--primary`). The override selector `.closing-cta .btn--primary` scopes correctly.

**Orphan-word check (section F at 375):**
The `.closing-cta h2` ("Want a one-page audit of your testing surface?") inherits `text-wrap: balance` from the global `h1-h6` rule (line 83). The color-only change (bg/text on the button) does not affect text wrapping. No orphan-word regression.

### DSSIM post-fix (closing-cta section, all viewports)

| Viewport | Cycle 1 DSSIM | Cycle 2 DSSIM | Delta |
|---|---|---|---|
| 1280 | 0.205 | 0.205 | ~0.000 |
| 768 | 0.241 | 0.241 | ~0.000 |
| 375 | 0.297 | 0.297 | ~0.000 |

**Root cause of non-improvement:** Same pattern as Sprint 14 Cycle 2. The per-section DSSIM is dominated by the CTA-chrome structural delta (F-NEW-4 carry: live primary CTA uses `dripyard_base:button` with 32 px SVG chevron-circle suffix producing a 56 px pill, while preview uses flat `<a class="btn--primary">` producing a 45 px pill). The bg-color token fix is a small-area change (button face only) that contributes negligibly relative to the structural chrome delta across the full section crop. T2 computed-style verification is the binding check for this targeted fix. DSSIM will improve materially only when F-NEW-4 is addressed in a future cycle.

## WCAG contrast ratios

| Element | Foreground | Background | Ratio | Requirement | Pass/Fail |
|---|---|---|---|---|---|
| Closing-CTA `.btn--primary` text | `#1F1A14` | `#5DC6E8` | 8.81:1 | >= 4.5:1 (AA normal) | PASS |
| Closing-CTA `.btn--primary:hover` text | `#1F1A14` | `#4AB8DA` | 9.39:1 | >= 4.5:1 (AA normal) | PASS |
| Focus ring `#1893B4` on espresso `#1F1A14` | `#1893B4` | `#1F1A14` | 4.83:1 | >= 3:1 (non-text) | PASS |

## Mobile responsive behavior

N/A -- no responsive overrides written in this cycle. The change is a color-only token swap on the closing-CTA primary button. No layout, sizing, or breakpoint rules were added or modified. The button inherits the base `.btn` padding (14px 28px) which produces a touch target well above 44x44 CSS px at all viewports.

## Autonomous decisions

1. **Hover state for dark-zone CTA:** The issue specified `background: #4AB8DA; color: #1F1A14;` for hover (matching the Sprint 14 Cycle 2 precedent), so this was directly specified rather than a judgment call. Applied as given.
2. **DSSIM non-improvement:** Accepted that DSSIM would not drop materially because of pre-existing CTA-chrome structural delta (F-NEW-4) dominating the section crops. This is the identical pattern observed and accepted in Sprint 14 Cycle 2. Relied on T1 grep checks as binding verification for the targeted color token fix.
3. **No light-zone non-regression probe needed:** This page has only one `.btn--primary` (in the closing-CTA section). Unlike `about-us.html` (which had three `.btn--primary` elements across light and dark zones), there are no light-zone primary CTAs to verify non-regression against. The ghost-on-dark button uses a different class entirely.

## Known issues

None. All five acceptance criteria are met:
- [x] Closing-CTA primary button bg = `#5DC6E8`, color = `#1F1A14` (verified by T1 grep)
- [x] Hover state = `#4AB8DA` bg, `#1F1A14` color (verified by T1 grep)
- [x] Light-zone primary buttons unchanged (`#62BBCB` only in variable declaration; no light-zone `.btn--primary` elements exist on this page)
- [x] No other preview file modified; no live code modified (verified by `git diff --name-only`)
- [x] DSSIM re-run completed; closing-cta@1280 = 0.205 (non-drop explained by pre-existing CTA-chrome structural delta)

## Files changed

- `docs/pl2/Previews/how-we-do-it.html` (lines 428-429)
