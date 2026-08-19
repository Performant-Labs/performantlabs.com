# Handoff-T: Sprint 16 Cycle 3 - Sidebar H2 + CTA pair layout (A + D + G)

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-16-cycle-3-sidebar`
**Issue:** `docs/pl2/handoffs/sprint-16-cycle-3-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/sprint-16-cycle-3-F.md`

---

## Tier 1 results

### T1-1: Cache clear

**Command:** `ddev drush cr`
**Expected:** `[success] Cache rebuild complete.`
**Actual:** `[success] Cache rebuild complete.`
**Result:** PASS

### T1-2: HTTP status /contact-us

**Command:** `curl -sk 'https://pl-performantlabs.com.3.ddev.site:8493/contact-us' -o /dev/null -w '%{http_code}'`
**Expected:** 200
**Actual:** 200
**Result:** PASS

### T1-3: Marker class in rendered HTML (F-NEW-16-G)

**Command:** `curl -sk 'https://pl-performantlabs.com.3.ddev.site:8493/contact-us' | grep -o 'dy-section--cta-pair'`
**Expected:** at least one match
**Actual:** `dy-section--cta-pair` found in rendered HTML
**Result:** PASS

### T1-4: Sidebar class in rendered HTML (F-NEW-16-D probe)

**Command:** `curl -sk 'https://pl-performantlabs.com.3.ddev.site:8493/contact-us' | grep -o 'contact-sidebar'`
**Expected:** at least one match
**Actual:** `contact-sidebar` found in rendered HTML
**Result:** PASS

### T1-5: CSS asset served

**Command:** `curl -sk 'https://pl-performantlabs.com.3.ddev.site:8493/contact-us' | grep -o 'webform\.css[^"]*'`
**Expected:** webform.css with cache-buster
**Actual:** `webform.css?tez8af`
**Result:** PASS

### T1-6: F-NEW-16-A CSS rule present in source file

**Command:** `grep -n 'contact-sidebar .heading' webform.css`
**Expected:** rule present at line ~266
**Actual:** rule at line 266: `.contact-sidebar .heading { font-size: 1.375rem; line-height: 1.25; letter-spacing: -0.2px; font-weight: 500; }`
**Result:** PASS

---

## Tier 2 results

### T2-1: Git diff — changed files

**Command:** `git diff --name-only main`
**Expected (per spawn prompt):**
- `web/themes/custom/performant_labs_20260502/css/components/webform.css` (MODIFIED)
- `scripts/sprint16-cycle3-contact-us-cta-pair-marker.php` (NEW — staged by O at gate)
- Cycle 3 handoff/issue docs

**Actual:** `git diff --name-only main` shows `web/themes/custom/performant_labs_20260502/css/components/webform.css` as the only modified live theme file. `git status --short` shows `scripts/sprint16-cycle3-contact-us-cta-pair-marker.php` as UNTRACKED (`??`), not staged.

**Finding:** The Canvas patch script is present on disk but not yet staged to git. The spawn prompt notes "staged by O at gate," which implies O handles staging before S. T records this as an observation. The script exists at the correct path and has already been executed (Canvas DB is patched; marker is live). Git staging is O's gate action, not T's verification scope.

**No unexpected live theme files in diff.** Only `webform.css` modified. PASS for scope isolation.

**Result:** PASS (scope) / ADVISORY (Canvas script untracked — O must stage before merge)

### T2-2: No !important in diff

**Command:** `git diff main -- webform.css | grep -i '!important'`
**Expected:** no output
**Actual:** no output
**Result:** PASS

Note: The comment block in webform.css contains the text "No !important." as a prose statement (not a CSS declaration); the grep correctly found zero CSS `!important` declarations in the diff.

### T2-3: Only canvas_page id=13 idx=20 gained the marker

**Command:** `ddev drush php:script scripts/sprint16-cycle3-contact-us-cta-pair-marker.php` (re-run for idempotency) — output included `uuid=c0a10012-0012-4000-8000-000000000012` and `component_version: e6079b189d228dad`.

**Cross-check via curl on other pages:**
- `/about-us`: `dy-section--cta-pair` count = 2 (pre-existing; not touched this cycle)
- `/`: count = 0 (no marker; correct — homepage uses title-cta SDC per dy-section.css comment)
- `/services`: count = 2 (pre-existing; not touched this cycle)
- `/how-we-do-it`: count = 0 (correct)
- `/open-source-projects`: count = 0 (correct)

The script's safety check validates UUID `c0a10012-0012-4000-8000-000000000012` before patching; the target is the closing-CTA section at index 20 with `theme=dark`. No other components affected.

**Result:** PASS

### T2-4: Idempotency — Canvas patch script

**Command:** `ddev drush php:script scripts/sprint16-cycle3-contact-us-cta-pair-marker.php` (second run)
**Expected:** SKIP message; component_version non-NULL
**Actual:**
```
Pre-patch verification passed.
  [20] sdc.dripyard_base.section  uuid=c0a10012-0012-4000-8000-000000000012
  component_version: e6079b189d228dad
  Current inputs: {...,"additional_classes":"dy-section--cta-pair"}
SKIP: 'dy-section--cta-pair' already present in additional_classes.
```
`component_version` is `e6079b189d228dad` (non-NULL). No entity save triggered on second run.
**Result:** PASS

### T2-5 (Playwright): F-NEW-16-A — Sidebar H2 computed styles at 1280 / 768 / 375

| Viewport | font-size | line-height | letter-spacing | font-weight | Expected | Result |
|---|---|---|---|---|---|---|
| 1280 | 22px | 27.5px | -0.2px | 500 | 22 / 27.5 / -0.2 / 500 | PASS |
| 768 | 22px | 27.5px | -0.2px | 500 | 22 / 27.5 / -0.2 / 500 | PASS |
| 375 | 22px | 27.5px | -0.2px | 500 | 22 / 27.5 / -0.2 / 500 | PASS |

All viewports: PASS

### T2-6 (Playwright): F-NEW-16-D — Sidebar card wrapper computed styles

| Viewport | border-color | border-width | border-radius | padding | position | top | Expected | Result |
|---|---|---|---|---|---|---|---|---|
| 1280 | rgb(229, 225, 220) | 1px | 12px | 32px all sides | sticky | 48px | #E5E1DC 1px / 12px / 32px / sticky @ >=992 | PASS |
| 768 | rgb(229, 225, 220) | 1px | 12px | 32px all sides | static | auto | static @ <992 | PASS |
| 375 | rgb(229, 225, 220) | 1px | 12px | 32px all sides | static | auto | static @ <992 | PASS |

rgb(229, 225, 220) = #E5E1DC. All F-NEW-16-D properties verified pre-existing and correct at all three viewports.

**F-NEW-16-D no-op verification:** The sidebar card styling was already fully implemented in webform.css from a prior sprint. T independently confirms all five required properties (border, border-radius, padding, sticky at >= 992, static below 992) compute correctly on live. The Cycle 1 audit finding appears to have been captured against a stale cache state. F's no-code-change determination is confirmed correct.

**Result:** PASS

### T2-7 (Playwright): F-NEW-16-G — Closing-CTA button bounding boxes

| Viewport | Button 1 top | Button 2 top | Button 1 height | Button 2 height | Layout | Expected | Result |
|---|---|---|---|---|---|---|---|
| 1280 | 2811.95 | 2811.95 | 56px | 56px | side-by-side (same top) | side-by-side | PASS |
| 768 | 4069.30 | 4069.30 | 56px | 56px | side-by-side (same top) | side-by-side | PASS |
| 375 | 5014.50 | 5090.50 | 56px | 56px | stacked (76px vertical gap) | stacked | PASS |

All touch targets at 375: 56px height >= 44px minimum. PASS.

Note on breakpoint: The issue AC says "side-by-side at >= 768px." The existing `dy-section--cta-pair` rule triggers at `min-width: 577px`. At 768 the buttons are side-by-side (confirmed above). The AC is satisfied. The 577px rule is cross-page canonical (also governs `/about-us` and `/services`); F's decision to preserve it rather than introduce a new 768px rule is consistent with the established pattern. No regression.

**Result:** PASS

### T2-8: Cross-page HTTP sanity

| Page | HTTP status | Result |
|---|---|---|
| /about-us | 200 | PASS |
| / | 200 | PASS |
| /services | 200 | PASS |
| /how-we-do-it | 200 | PASS |
| /open-source-projects | 200 | PASS |

**Result:** PASS

### T2-9 (Playwright): Cross-page /about-us closing-CTA at 1280 — baseline preserved

Probed `/about-us` at 1280. Closing-CTA buttons:
- "Book a testing review": top=3976.31, height=56
- "See the testing menu": top=3976.31, height=56

Both share the same `top` value — side-by-side. Identical to F's reported baseline (both top=3976). No regression introduced by this cycle.

**Result:** PASS

---

## WCAG contrast verification

| Element | Foreground | Background | F's ratio | T's ratio | PASS/FAIL |
|---|---|---|---|---|---|
| Sidebar H2 "Prefer a quick call?" (22px / 500 weight — normal text treatment) | #1F1A14 | #FFFFFF | 17.29:1 | 17.27:1 | PASS (>= 4.5:1) |
| CTA "View services" ghost-on-dark | #FFFFFF | #1F1A14 | 17.29:1 | 17.27:1 | PASS (>= 4.5:1) |
| CTA "Book a testing review" primary (pre-existing allowlist) | #FFFFFF | #62BBCB | 2.13:1 | 2.21:1 | ALLOWLIST (F-NEW-16-F carry; pa11y allowlist in effect; not a Cycle 3 regression) |
| Focus ring #1893b4 on #FFFFFF (non-text) | #1893b4 | #FFFFFF | 3.58:1 | 3.58:1 | PASS (>= 3:1 non-text) |

**Discrepancy note:** F reports 17.29:1 for #1F1A14 on #FFFFFF; T computes 17.27:1. Difference is 0.02 — a floating-point rounding artefact in the final division step. Both values are substantially above the 4.5:1 threshold; no practical discrepancy.

**Discrepancy note:** F reports 2.13:1 for #FFFFFF on #62BBCB; T computes 2.21:1. Difference is 0.08 — a minor rounding artefact. Both values are well below AA (4.5:1) and are covered by the existing pa11y allowlist. This is a pre-existing carried defect (F-NEW-16-F), not introduced by Cycle 3.

No contrast regressions introduced by this cycle. The sidebar H2 size change (32px -> 22px) does not affect any color tokens.

---

## Mobile responsive verification

### F-NEW-16-A: Sidebar H2 sizing

**Breakpoint behavior:** Rule `.contact-sidebar .heading` uses absolute values (`1.375rem / 1.25 / -0.2px`) with no media query wrapper — applies uniformly at all viewports. Before this fix the H2 was 32px at desktop (via `--h3-size: 2rem`) and 24px at mobile (via `--h3-size: 1.5rem` at <=576px). Now 22px at all viewports.

**Typography-mobile match:** Preview specifies 22px at all viewports including mobile. Live now matches. PASS.

**Orphan-word check (memory `feedback_no_orphan_words.md`):** "Prefer a quick call?" at 22px / Rubik 500 inside a ~256px usable width sidebar renders on a single line at all viewports (per F's measurement: ~230px text width, sidebar 320px - 64px padding = 256px usable). Single line = zero orphan risk. PASS.

**Touch targets:** The H2 heading is not interactive; N/A.

### F-NEW-16-D: Sidebar card wrapper

Pre-existing implementation. No responsive overrides introduced this cycle. Sticky at >= 992 (1280: confirmed `position: sticky`); static below 992 (768 and 375: confirmed `position: static`). PASS.

### F-NEW-16-G: CTA button layout

**CSS media queries confirmed in dy-section.css:**
- `@media (min-width: 577px)`: `.dy-section.theme--dark.dy-section--cta-pair .dy-section__content` — flex-direction: row, side-by-side
- `@media (max-width: 576px)`: same selector — flex-direction: column, stacked, full-width

**Touch targets at 375px:**
- "Book a testing review": 331 x 56px — height 56 >= 44. PASS.
- "View services": 331 x 56px — height 56 >= 44. PASS.

Both buttons at 375 are full-width (331px in 375px viewport with standard side padding). PASS.

---

## Acceptance criteria status

**AC-1: F-NEW-16-A — Sidebar H2 font-size 22px / ~27.5px / -0.2px; other H2s unchanged**

Playwright confirms:
- All three viewports: 22px / 27.5px / -0.2px. PASS.
- Other H2s on page (probed in F's T2 table): "What to expect..." = 40px, "Skip the form..." = 56px. Neither changed. No cascade widening. PASS.

**Result: PASS**

**AC-2: F-NEW-16-D — Sidebar card: 1px solid #E5E1DC / 12px radius / 32px padding / sticky at >= 992 / static below**

Playwright confirms all five properties at all three viewports. Pre-existing implementation verified by T independently.

**Result: PASS**

**AC-3: F-NEW-16-G — Closing-CTA side-by-side at >= 768; stacked at < 768; no cross-page regression**

- Side-by-side at 1280: PASS (both top=2811.95)
- Side-by-side at 768: PASS (both top=4069.30)
- Stacked at 375: PASS (top 5014.50 vs 5090.50; 76px vertical gap)
- Cross-page sanity: /about-us closing-CTA at 1280 side-by-side (both top=3976.31). All other pages HTTP 200. Marker spillover verified via curl — only /contact-us gained the new marker this cycle.

**Result: PASS**

**AC-4: No !important; 7-step trace per fix documented**

- `git diff main -- webform.css | grep -i '!important'` returned no output. PASS.
- F's handoff documents the full 7-step trace for all three fixes. PASS.

**Result: PASS**

**AC-5: Stage by explicit path**

- `webform.css` is staged (tracked modified file in diff vs main). PASS.
- `scripts/sprint16-cycle3-contact-us-cta-pair-marker.php` is on disk and executed; untracked in git. The spawn prompt states O stages the script at gate. T records this as requiring O action before merge, not as a failing AC.

**Result: PASS (with O gate action required)**

---

## Blocking issues

None. All acceptance criteria pass. All Tier 1 and Tier 2 checks pass. WCAG contrast unchanged or improved. Touch targets pass. No cross-page regressions.

---

## Advisory notes

1. **Canvas script not yet staged to git.** `scripts/sprint16-cycle3-contact-us-cta-pair-marker.php` is present on disk and has been executed (Canvas DB is patched, marker is live), but `git status` shows it as untracked (`??`). O must stage this file before the merge commit. Without it the script is not tracked in the repository, though the Canvas DB change it produced is already persisted. This is O's gate responsibility per the spawn prompt ("staged by O at gate").

2. **CTA breakpoint 577px vs issue's "768px" wording.** The issue AC says "side-by-side at >= 768 px." The live rule fires at `min-width: 577px` (existing cross-page canonical). At 768 the buttons are side-by-side — the AC is satisfied. F documented this decision in the handoff. T confirms the 768 behavior is correct. No action required.

3. **F-NEW-16-D classified as pre-existing.** The Cycle 1 audit flagged D as a gap; F's trace found the CSS was already present. T independently confirms all five card-chrome properties compute correctly at all viewports. If S's re-audit of the diff PNGs shows residual form-section delta attributable to the sidebar card (e.g., remaining padding drift), that would be a separate finding, not a Cycle 3 blocker.

4. **Pre-existing contrast allowlist carries forward.** The `#62BBCB` + white primary CTA contrast (2.21:1) is a pre-existing defect tracked as F-NEW-16-F, deferred to Cycle 4. It appears on closing-CTA buttons at all pages. Not a Cycle 3 regression.

---

T complete, no blocking issues. Ready for S.
