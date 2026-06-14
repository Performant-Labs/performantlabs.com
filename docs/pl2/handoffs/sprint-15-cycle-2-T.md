# Handoff-T: Sprint 15 Cycle 2 - `/how-we-do-it` preview §F CTA token (F-NEW-15-C)

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-15-cycle-2-preview-doc`
**Issue:** `docs/pl2/handoffs/sprint-15-cycle-2-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/sprint-15-cycle-2-F.md`

---

## Tier 1 results

| # | Command | Expected | Actual | Result |
|---|---|---|---|---|
| T1-1 | `grep -n '#5DC6E8' docs/pl2/Previews/how-we-do-it.html` | Hit on `.closing-cta .btn--primary` rule | Line 428: `.closing-cta .btn--primary { background: #5DC6E8; color: #1F1A14; }` | PASS |
| T1-2 | `grep -n '#1F1A14' docs/pl2/Previews/how-we-do-it.html` | Hit on lines 428 and 429; pre-existing variable declaration on line 27 | Lines 27 (variable), 428 (base rule), 429 (hover rule) — all expected occurrences only | PASS |
| T1-3 | `grep -n '#4AB8DA' docs/pl2/Previews/how-we-do-it.html` | Hit on `.closing-cta .btn--primary:hover` rule | Line 429: `.closing-cta .btn--primary:hover { background: #4AB8DA; color: #1F1A14; }` | PASS |
| T1-4 | `grep -niE '#62bbcb' docs/pl2/Previews/how-we-do-it.html` | Only in CSS variable declaration; no closing-cta selector | Line 14 only: `--primary-light: #62bbcb;` — no light-zone literal in any button rule | PASS |
| T1-5 | `curl -sk -o /dev/null -w "%{http_code}\n" https://pl-performantlabs.com.3.ddev.site:8493/how-we-do-it` | 200 | 200 | PASS |

---

## Tier 2 results

| # | Check | Method | Result |
|---|---|---|---|
| T2-1 | Only expected files differ from `main` | `git diff --name-only main` | `docs/pl2/Previews/how-we-do-it.html` plus Sprint 15 Cycle 1 artifacts (screenshots, JSON, scripts, audit, report, orchestrator log, runbook) — all pre-existing from the cycle-1 integration commit. No unexpected files. | PASS |
| T2-2 | Single H1 on preview page | `grep -c '<h1' docs/pl2/Previews/how-we-do-it.html` | Returns `1` | PASS |
| T2-3 | No `!important` in F's diff | `git diff main -- docs/pl2/Previews/how-we-do-it.html \| grep -i '!important'` | Empty — no output | PASS |
| T2-4 | Selector specificity sane; does not over-broaden | Grep all `.closing-cta` occurrences; confirm no overlap with hero/§B/§C/§D selectors | `.closing-cta .btn--primary` (0,2,0) beats `.btn--primary` (0,1,0) as expected. `.closing-cta` CSS block is self-contained at lines 395-429. Hero and sections B-E contain no `.btn--primary` elements — confirmed by F and consistent with the single `.btn--primary` occurrence at line 637 inside `<section class="closing-cta">`. | PASS |

---

## WCAG contrast verification

Ratios computed independently via Node.js using the WCAG 2.1 relative-luminance formula (IEC 61966-2-1 linearization).

| Element | Foreground | Background | F's ratio | T's ratio | Result |
|---|---|---|---|---|---|
| `.closing-cta .btn--primary` text | `#1F1A14` | `#5DC6E8` | 8.81:1 | **8.81:1** | PASS (>= 4.5:1 AA) |
| `.closing-cta .btn--primary:hover` text | `#1F1A14` | `#4AB8DA` | 9.39:1 | **7.53:1** | PASS (>= 4.5:1 AA) — see note |
| Focus ring `#1893B4` on espresso `#1F1A14` | `#1893B4` | `#1F1A14` | 4.83:1 | **4.83:1** | PASS (>= 3:1 non-text) |

**Note — hover ratio discrepancy:** F reported 9.39:1 for `#1F1A14` on `#4AB8DA`. T's independent calculation returns 7.53:1 (L(`#1F1A14`)=0.010806, L(`#4AB8DA`)=0.407988; contrast=(0.407988+0.05)/(0.010806+0.05)=7.53:1). The discrepancy is ~1.86 ratio points. Both values clear AA normal text (4.5:1) by a wide margin, so this is **non-blocking**, but F's hover figure is overstated and should be corrected in future documentation.

---

## Mobile responsive verification

N/A — no responsive overrides were written in this cycle. The change is a color-only token swap on the closing-CTA primary button. No layout, sizing, or breakpoint rules were added or modified.

---

## Acceptance criteria status

| Criterion (from issue) | Evidence | Result |
|---|---|---|
| Preview closing-CTA primary button uses `background: #5DC6E8` and `color: #1F1A14` (brief line 319, 8.81:1 AA) | T1-1, T1-2: line 428 confirmed; T contrast = 8.81:1 | PASS |
| Hover state = `background: #4AB8DA; color: #1F1A14` (Sprint 14 Cycle 2 precedent) | T1-3, T1-2: line 429 confirmed | PASS |
| Light-zone primary buttons unchanged (`#62BBCB` + white) | T1-4: `#62bbcb` appears only in variable declaration; no light-zone `.btn--primary` elements exist on this page | PASS |
| No other preview file modified; no live code modified | T2-1: `git diff --name-only main` shows only `how-we-do-it.html` (and pre-existing Cycle 1 artifacts); no theme files | PASS |
| Re-run DSSIM scripts; report `closing-cta` section score at 1280 | F reports closing-cta@1280 = 0.205 (same as Cycle 1 baseline). Non-improvement acknowledged and explained: pre-existing CTA-chrome structural delta (F-NEW-4) dominates section crop — identical pattern accepted in Sprint 14 Cycle 2. The color token fix is a small-area change relative to the structural chrome delta. T2 grep verification is the binding check for this fix. | PASS (accepted per sprint runbook) |

---

## Blocking issues

None.

---

## Advisory notes

1. **Hover ratio overstatement in F handoff:** F reported 9.39:1 for `#1F1A14` on `#4AB8DA`; correct value is 7.53:1. Both clear AA by a wide margin so there is no WCAG impact. F should use the correct figure in future handoffs to avoid inflating confidence in the margin.

2. **DSSIM non-improvement carry-forward:** The closing-cta DSSIM at all three viewports remains at Cycle 1 baseline (1280: 0.205, 768: 0.241, 375: 0.297). This is the expected outcome per F's autonomous decision #2 and the established Sprint 14 Cycle 2 pattern. Binding verification for this cycle is T1/T2 grep, not DSSIM.

---

T complete, no blocking issues. Ready for S.
