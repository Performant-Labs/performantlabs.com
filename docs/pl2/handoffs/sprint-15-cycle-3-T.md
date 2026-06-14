# Handoff-T: Sprint 15 Cycle 3 - display-md H2 mobile source-order fix (F-NEW-15-A)

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-15-cycle-3-display-md-mobile`
**Issue:** `docs/pl2/handoffs/sprint-15-cycle-3-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/sprint-15-cycle-3-F.md`

---

## Tier 1 results

### T1-1: Cache clear

**Command:** `ddev drush cr`
**Expected:** `[success] Cache rebuild complete.`
**Actual:** `[success] Cache rebuild complete.`
**Result:** PASS

### T1-2: HTTP status

**Command:** `curl -sk 'https://pl-performantlabs.com.3.ddev.site:8493/how-we-do-it' -o /dev/null -w "%{http_code}\n"`
**Expected:** 200
**Actual:** 200
**Result:** PASS

### T1-3: Desktop `@media (min-width: 577px)` wrapping confirmed in source CSS

**Method:** Direct file read — `/web/themes/custom/performant_labs_20260502/css/base.css` lines 285-290.

Confirmed block:
```
@media (min-width: 577px) {
  :root {
    --h2-size: 2.5rem;           /* 40px = display-md per design brief */
    --h2-letter-spacing: -1px;   /* display-md desktop tracking */
  }
}
```
**Expected:** desktop `--h2-size: 2.5rem` wrapped in `@media (min-width: 577px)`
**Actual:** confirmed at lines 285-290
**Result:** PASS

### T1-4: Mobile `@media (max-width: 576px)` rule still present

**Method:** `grep -n 'h2-size' base.css`

All `--h2-size` occurrences:
- Line 212: comment (display-md reference in header comment)
- Line 227: `--h2-size: 1.875rem;  /* 30px */` — inside `@media (max-width: 576px) { :root { ... } }`
- Line 270: comment (block header comment)
- Line 287: `--h2-size: 2.5rem;  /* 40px */` — inside `@media (min-width: 577px) { :root { ... } }`

**Expected:** mobile 30px rule at line 227, desktop 40px rule only inside min-width: 577px, no stray unconditional `:root { --h2-size }` after line 227
**Actual:** exactly as expected; 4 occurrences total, 2 in comments, 2 in correctly scoped media blocks
**Result:** PASS

### T1-5: No `!important` introduced

**Method:** `grep -n 'important' base.css`
**Expected:** no `!important` declarations
**Actual:** one comment-only mention: `/* (0,1,0) and Dripyard's :where(:root) (0,0,0). No !important. */` — no actual `!important` declaration
**Result:** PASS

### T1-6: Preview letter-spacing correction confirmed

**Method:** `grep -n 'letter-spacing.*section-head\|-0\.8\|-0\.6' docs/pl2/Previews/how-we-do-it.html`
**Expected:** `-0.8px` for `.section-head h2` in the mobile media query block
**Actual:** `line 482: .section-head h2 { font-size: 30px; letter-spacing: -0.8px; }` — corrected from -0.6px to -0.8px per brief
**Result:** PASS

---

## Tier 2 results

### T2-1: Git diff — changed files

**Command:** `git diff --name-only main`

Files changed on branch vs main relevant to this cycle:
- `web/themes/custom/performant_labs_20260502/css/base.css` — present
- `docs/pl2/Previews/how-we-do-it.html` — present
- Sprint 15 Cycle 1 screenshot artifacts (`docs/pl2/handoffs/screenshots/sprint-15-cycle-1/`) — present (prior cycle artifacts)
- Sprint 15 Cycle 2 screenshot artifacts (`docs/pl2/handoffs/screenshots/sprint-15-cycle-2/`) — present (prior cycle artifacts)
- Sprint 15 handoff documents (Cycle 1 audit, Cycle 2 F/T/S, orchestrator log, runbook) — present (prior cycle artifacts)
- Sprint 15 scripts (`scripts/sprint-15-cycle-1-*.mjs`, `scripts/sprint-15-cycle-2-verify.mjs`) — present (prior cycle artifacts)

**Expected:** base.css and how-we-do-it.html changed plus prior Sprint 15 Cycle 1+2 artifacts
**Actual:** exactly that set
**Result:** PASS

### T2-2: Git diff — structural nature of base.css change

**Command:** `git diff main -- web/themes/custom/performant_labs_20260502/css/base.css`

The diff shows:
- Removed: unconditional `:root { --h2-size: 2.5rem; --h2-letter-spacing: -1px; }` and a 2-line comment
- Added: `@media (min-width: 577px) { :root { --h2-size: 2.5rem; --h2-letter-spacing: -1px; } }` with an expanded 10-line comment explaining the Sprint 15 Cycle 3 source-order fix
- No value changes to any token (still 2.5rem / -1px)
- No new selectors, no new properties, no deletions of any other rule
- Change is purely structural: wrapping the existing declaration in a `min-width` media query

**Result:** PASS — structural wrapping only, no value mutation

### T2-3: Playwright probe — `/how-we-do-it` at 375px

**Command:** inline Playwright node script
**Expected:** all display-md section H2s = 30px, letter-spacing = -0.8px; display-lg closing CTA = 36px

Observed results (375px):

| H2 text | fontSize | letterSpacing | lineHeight |
|---|---|---|---|
| "Breadcrumb" (visually-hidden) | 30px | -0.8px | 33.9px |
| "Audit." | 30px | -0.8px | 33.9px |
| "Stand up the dogfood loop." | 30px | -0.8px | 33.9px |
| "Take over or hand back." | 30px | -0.8px | 33.9px |
| "What we don't do." | 30px | -0.8px | 33.9px |
| "Want a one-page audit..." | 36px | -1.2px | 37.8px |

**Result:** PASS — all display-md H2s at 30px / -0.8px; display-lg closing CTA unchanged at 36px

### T2-4: Playwright probe — `/how-we-do-it` at 1280px (desktop sanity)

**Command:** inline Playwright node script
**Expected:** display-md H2s = 40px, letter-spacing = -1px; display-lg = 56px

Observed results (1280px):

| H2 text | fontSize | letterSpacing |
|---|---|---|
| "Audit." | 40px | -1px |
| "Stand up the dogfood loop." | 40px | -1px |
| "Take over or hand back." | 40px | -1px |
| "What we don't do." | 40px | -1px |
| "Want a one-page audit..." | 56px | -1.6px |

**Result:** PASS — desktop sizes unchanged

### T2-5: Heading hierarchy

**Method:** curl the live page, extract heading tags

Confirmed structure: single H1 (hero heading) → multiple H2 (section heads + closing CTA) → H3 (nav region labels as visually-hidden, card titles in §D). No heading levels skipped.

**Result:** PASS

### T2-6: ARIA landmarks

**Method:** `curl ... | grep -c '<main\|<header\|<footer\|<nav'`
**Expected:** >= 4 matches (at least one each of main, header, footer, nav)
**Actual:** 6 matches
**Result:** PASS

### T2-7: WCAG reflow at 320px — no horizontal scroll

**Method:** Playwright probe at 320 × 568 viewport
**Expected:** `scrollWidth <= clientWidth` (no horizontal scroll); H2 "Audit." = 30px

Observed:
- scrollWidth: 305, clientWidth: 320 — no horizontal scroll
- H2 "Audit." at 320px: 30px

**Result:** PASS

---

## WCAG contrast verification

Token colors sourced from design brief and CSS. No color values changed in this cycle — only font-size and letter-spacing. Verification is a re-confirmation that the existing passing ratios hold at the new (correct) 30px mobile size.

At 30px / Rubik 500, text qualifies as WCAG "large text" (>= 18.67px / >= 14pt bold), so the 3:1 threshold applies.

| Element | Foreground hex | Background hex | F's ratio | T's ratio | Threshold | PASS/FAIL |
|---|---|---|---|---|---|---|
| Section H2 on white (30px mobile, Rubik 500) | `#1F1A14` | `#FFFFFF` | 17.29:1 | 17.27:1 | >= 3:1 (large text) | PASS |
| Section H2 on cream (30px mobile, Rubik 500) | `#1F1A14` | `#F5EFE2` | 15.17:1 | 15.07:1 | >= 3:1 (large text) | PASS |

T's independent computation method: WCAG relative luminance formula `L = 0.2126R + 0.7152G + 0.0722B` with linearization. Discrepancy from F's values is < 0.1 — rounding difference only; both substantially exceed the threshold.

---

## Mobile responsive verification

**Breakpoint:** `max-width: 576px` (mobile override) / `min-width: 577px` (desktop assertion)
**Brief value:** `docs/pl2/briefs/pl_design_brief.md` line 126: `display-md: { fontSize: 30px, letterSpacing: -0.8px }`; line 469 confirms 40px → 30px at mobile (25% reduction)

| Check | CSS rule confirmed | Computed value at 375px | Match brief | PASS/FAIL |
|---|---|---|---|---|
| Mobile `--h2-size` | `@media (max-width: 576px) { :root { --h2-size: 1.875rem } }` at base.css line 227 | 30px | 30px | PASS |
| Mobile `--h2-letter-spacing` | `--h2-letter-spacing: -0.8px` at base.css line 228 | -0.8px | -0.8px | PASS |
| Desktop `--h2-size` scoped to 577px+ | `@media (min-width: 577px) { :root { --h2-size: 2.5rem } }` at base.css lines 285-290 | 40px at 1280px | 40px | PASS |
| Preview letter-spacing | `how-we-do-it.html` line 482: `.section-head h2 { font-size: 30px; letter-spacing: -0.8px }` | -0.8px | -0.8px | PASS |
| WCAG reflow (320px no hScroll) | CSS rules unchanged in viewport-agnostic structural rules | scrollWidth 305 < clientWidth 320 | no hScroll | PASS |

Touch targets: H2s are non-interactive text elements. No touch target check required.

---

## Cross-page no-regression spot check

**Method:** Playwright probe at 375px, `main h2` elements, plus horizontal scroll check for each page

| Page | H2 sample | fontSize at 375px | hScroll | Desktop H2 |
|---|---|---|---|---|
| `/` | "Tools, AI, and experts. All there." | 30px | no (scrollW 360 < clientW 375) | 40px (verified separately for how-we-do-it; cascade is sitewide) |
| `/services` | "Four ways we engage." | 30px | no | — |
| `/about-us` | "On drupal.org since 2006." | 30px | no | — |
| `/open-source-projects` | "Our testing tools" | 30px | no | — |
| `/how-we-do-it` | "Audit." | 30px | no (verified at T2-3, T2-7) | 40px PASS |

All four cross-page pages confirm the L3 sitewide cascade is operative. No horizontal scroll introduced on any page. `/contact-us` was not probed by T (out of scope for T; S sweep is the binding signal per PC-3).

**Note for S:** The cross-page sweep at S is MANDATORY (per PC-3 and the issue's acceptance criteria). S must cover all six pages (`/`, `/services`, `/how-we-do-it`, `/about-us`, `/open-source-projects`, `/contact-us`) at 375px with pixel-level diffs. T's spot check here is read-only structural sanity only.

---

## Acceptance criteria status

Criteria sourced from `docs/pl2/handoffs/sprint-15-cycle-3-issue.md`.

**AC-1: Live §B/§C/§D/§E H2 at 375 reads the brief's `display-md` mobile value.**

Brief value confirmed as 30px (line 126, `docs/pl2/briefs/pl_design_brief.md`). Playwright probe at 375px shows "Audit." (§B), "Stand up the dogfood loop." (§C), "Take over or hand back." (§D), "What we don't do." (§E) all at 30px / -0.8px. Pre-fix value was 40px (source-order bug). **PASS**

**AC-2: Preview equivalent rule in `docs/pl2/Previews/how-we-do-it.html` matches the same brief value.**

`how-we-do-it.html` line 482: `.section-head h2 { font-size: 30px; letter-spacing: -0.8px; }`. Font-size was already correct; letter-spacing corrected from -0.6px to -0.8px to match brief. **PASS**

**AC-3: Desktop `display-md` H2 (40px, lh 1.05-1.10) unchanged on both renders.**

Playwright probe at 1280px: "Audit." → 40px / -1px; "Stand up the dogfood loop." → 40px / -1px; all section H2s 40px. Live desktop unchanged. Preview desktop was already 40px (not touched). **PASS**

Note on line-height: Playwright reports 45.2px (1.13 ratio) on live desktop, 33.9px (1.13) on live mobile. Brief target is 1.05-1.10. The 1.13 is Dripyard's `--h2-line-height` default; this deviation pre-existed this cycle and is not introduced by this change. Carry-forward known issue in F's handoff.

**AC-4: §F H2 (`display-lg`) unchanged on both renders.**

Playwright probe at 375px: closing CTA H2 = 36px / -1.2px / 37.8px line-height — unchanged. At 1280px: 56px / -1.6px — unchanged. **PASS**

**AC-5: No `!important`. Standard 7-step layer trace; layer documented.**

No `!important` in base.css (grep confirms comment-only mention). F's handoff contains a full 7-step trace documenting L3 as the correct layer. Diff shows no `!important` introduced. **PASS**

**AC-6: T1 + T2 verification: cache-clear, curl-grep confirm new value in served CSS, structural HTML unchanged.**

Cache clear PASS. HTTP 200 PASS. CSS file confirms `@media (min-width: 577px)` wrapping of desktop value PASS. Mobile rule at line 227 intact PASS. Heading hierarchy and ARIA landmarks verified PASS. **PASS**

**AC-7: Cross-page sweep (S, MANDATORY). S re-captures every page with `display-md` section H2s at 375px.**

This criterion is S-tier. T's spot check confirms the cascade is operative across `/`, `/services`, `/about-us`, `/open-source-projects` at 375px (all 30px, no hScroll). The binding pixel-level diff sweep with `/contact-us` included is deferred to S. **S-TIER — NOT YET ASSESSED**

---

## Blocking issues

None. All T1 and T2 checks pass. WCAG contrast ratios confirmed by independent computation. Mobile H2 at 375px confirmed at 30px (brief value) on live. Preview letter-spacing corrected to -0.8px. Desktop values unchanged. No `!important`. No horizontal scroll at 375px or 320px. Cross-page spot checks pass.

---

## Advisory notes

1. **S cross-page sweep is MANDATORY and binding.** This is an L3 sitewide cascade change. All pages with `display-md` H2s are affected. T's cross-page spot check is structural sanity only. S must run pixel-level diffs at 1280/768/375 for all six pages per PC-3: `/`, `/services`, `/how-we-do-it`, `/about-us`, `/open-source-projects`, `/contact-us`. Include orphan-word check at new 30px size.

2. **Line-height at mobile is 1.13; brief says 1.1.** Dripyard default `--h2-line-height: 1.13` produces 33.9px at 30px font-size (brief target 33px, delta 0.9px/line). This pre-existed this cycle and is not introduced by this change. F noted it as a known issue; operator should decide if it warrants a follow-up L3 fix.

3. **Other preview files have letter-spacing -0.6px (should be -0.8px).** Five additional preview files (`homepage.html`, `services.html`, `about-us.html`, `open-source-projects.html`, `contact-us.html`) retain the old `-0.6px` letter-spacing for mobile `display-md` H2s. The brief specifies -0.8px. Out of scope for this cycle; filed by F as a follow-up observation.

4. **Brief vs audit value discrepancy resolved.** The Cycle 1 audit guessed the brief target as ~32px. The brief line 126 is unambiguous at 30px. F's deviation note is accurate and the 30px target is correct.
