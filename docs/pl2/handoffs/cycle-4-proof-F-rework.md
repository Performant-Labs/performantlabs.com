# Handoff-F: Cycle 4 Rework - Wordmark strip WCAG contrast fix

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-5-cycle-4-proof`
**Issue:** T blocker in `docs/pl2/handoffs/cycle-4-proof-T.md`

## Confirmation table (autonomous mode)

| Item | Value |
|---|---|
| Page | `/services` |
| Issue | cycle-4-proof-T.md (WCAG blocker) |
| Branch | `aa/pl-sprint-5-cycle-4-proof` |
| Runbook phase | Sprint 5, Cycle 4 rework |
| Input documents read | cycle-4-proof-T.md, cycle-4-proof-F.md, dy-section.css |
| Acceptance criteria count | 1 (remove opacity to fix contrast) |
| Handoff path | `docs/pl2/handoffs/cycle-4-proof-F-rework.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source | N/A (CSS-only fix) |

## What was done

- **`web/themes/custom/performant_labs_20260502/css/components/dy-section.css`** (modified): Removed `opacity: 0.8` from `.wordmark-strip__item` (was line 860). Updated the WCAG comment block (lines 791-799) to reflect the corrected contrast ratio.

## Layer decisions

No layer change. The fix stays at L5 (component-scoped CSS in dy-section.css). The property removed (`opacity: 0.8`) was already at L5. No new layer decision needed.

## Deviations from spec

None. T recommended removing `opacity: 0.8` entirely; that is what was done.

## Verification results (T1 + T2)

### T1 (cache-clear + curl)

```
$ ddev drush cr
[success] Cache rebuild complete.

$ curl -sk URL:8493/services | grep -c 'wordmark-strip'
2  (PASS)

$ curl -sk URL:8493/.../dy-section.css | grep -c 'wordmark-strip'
21  (PASS — CSS served)

$ curl -sk URL:8493/.../dy-section.css | grep -n 'opacity'
796: *     Rework: opacity: 0.8 removed per T blocker...
797: *     below 4.5:1 AA threshold...
(only in comments — no opacity declaration in CSS rules)

$ curl -sk URL:8493/ -o /dev/null -w '%{http_code}'
200  (PASS)

$ curl -sk URL:8493/services -o /dev/null -w '%{http_code}'
200  (PASS)

$ curl -sk URL:8493/about-us -o /dev/null -w '%{http_code}'
200  (PASS)
```

### T2 (structural)

No structural changes. Heading hierarchy, ARIA landmarks, and wordmark DOM structure are all unchanged from the original Cycle 4 handoff.

## WCAG contrast ratios

| Element | Foreground | Background | Ratio | Pass/Fail |
|---|---|---|---|---|
| "WE SPEAK" label | #5C544C (--theme-text-color-medium) | #FFFFFF | 7.43:1 | PASS (AA normal text) |
| Wordmark items (full opacity) | #5C544C (--theme-text-color-medium) | #FFFFFF | 7.43:1 | PASS (AA normal text) |
| Hairline borders | #E5E1DC (--theme-border-color) | #FFFFFF | decorative | N/A |

Contrast computation for wordmark items (post-fix):
- No opacity blend needed. Foreground is #5C544C at full opacity.
- sRGB linearization: R=92 -> 0.1065, G=84 -> 0.0887, B=76 -> 0.0722
- Relative luminance: 0.2126*0.1065 + 0.7152*0.0887 + 0.0722*0.0722 = 0.0914
- Contrast vs white (L=1.0): (1.05)/(0.1414) = 7.43:1
- Previous (with opacity 0.8): 4.47:1 (FAIL). Now: 7.43:1 (PASS).

## Mobile responsive behavior

N/A -- no responsive overrides changed in this rework.

## Autonomous decisions

None -- issue was fully specified. T's recommendation was unambiguous: remove `opacity: 0.8` from `.wordmark-strip__item`.

## Known issues

None.

## Files changed

1. `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` (modified) -- removed `opacity: 0.8` from `.wordmark-strip__item`, updated WCAG comment block
