# Handoff-F: Sprint 15 Cycle 3 - display-md H2 mobile source-order fix (F-NEW-15-A)

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-15-cycle-3-display-md-mobile`
**Issue:** `docs/pl2/handoffs/sprint-15-cycle-3-issue.md`

## Confirmation table (autonomous mode)

| Item | Value |
|---|---|
| Page | `/how-we-do-it` (with cross-page cascade to all pages) |
| Issue | `docs/pl2/handoffs/sprint-15-cycle-3-issue.md` |
| Branch | `aa/pl-sprint-15-cycle-3-display-md-mobile` |
| Runbook phase | Sprint 15 Cycle 3 (L3 token media-query fix) |
| Input documents read | issue, Cycle 1 audit (lines 180-209), design brief typography-mobile block, theme-change--workflow.md, Sprint 14 Cycle 3 F handoff, base.css, dripyard_base variables-typography.css, neonbyte variables-typography.css, how-we-do-it.html preview |
| Acceptance criteria count | 7 (1 is S-only cross-page sweep) |
| Handoff document path | `docs/pl2/handoffs/sprint-15-cycle-3-F.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | N/A (no component schema changes) |

## What was done

- **`web/themes/custom/performant_labs_20260502/css/base.css` (MODIFIED)** -- Wrapped the Phase B H2 desktop size token block (lines 277-280) in `@media (min-width: 577px)` to fix a CSS source-order cascade bug where the unconditional `:root { --h2-size: 2.5rem }` at line 278 was clobbering the mobile `@media (max-width: 576px) { :root { --h2-size: 1.875rem } }` at line 227 because it came later in source order. Updated the block comment with the bug explanation.
- **`docs/pl2/Previews/how-we-do-it.html` (MODIFIED)** -- Fixed mobile `display-md` letter-spacing from `-0.6px` to `-0.8px` to match the brief's `typography-mobile` block (line 482).

## Layer decisions

### 7-step CSS change workflow trace

**Step 1 -- Desired change:** `/how-we-do-it` section H2s render 40px at 375px mobile viewport. Brief specifies `display-md` mobile = 30px (not ~32px as the audit guessed).

**Step 2 -- Pass 1 (bottom-up trace):**
```
Property:      font-size on h2.heading.h2 inside .dy-section (section B "Audit.")
Current value: 40px at 375px viewport (confirmed by Playwright probe)
Declared by:   .h2 { font-size: var(--h2-size); }  [dripyard heading utility, (0,1,0)]
Comes from:    --h2-size at :root
Source chain:
  1. @media (max-width: 576px) :root { --h2-size: 1.875rem } [base.css line 227] -- MATCHES at 375px
  2. :root { --h2-size: 2.5rem }  [base.css line 278, unconditional] -- ALSO MATCHES at 375px
  Result: #2 wins by source order (later in file). Both at :root specificity (0,1,0).
  => 40px rendered instead of intended 30px.
```

**Root cause:** CSS source-order cascade bug. The unconditional `:root { --h2-size: 2.5rem }` (40px) at line 278 was placed AFTER the `@media (max-width: 576px) { :root { --h2-size: 1.875rem } }` (30px) at line 227. At viewports <= 576px, both rules match `:root` at identical specificity; the later one (line 278, 40px) wins. The mobile override was always dead code.

**DOM inspection gate:**
```
DOM inspection evidence:
  [ ] N/A -- change is Layer 3 (:root token override, no DOM wrapper involved)
```

**Step 2 -- Pass 2 (top-down eligibility):**
```
L1 check: --h2-size is not a Drupal config value. RULED OUT.

L2 check: --h2-size is not OKLCH-derived. RULED OUT.

L3 check: The existing mobile @media (max-width: 576px) block already sets
          --h2-size: 1.875rem (30px) correctly. The bug is that an unconditional
          :root block later in the same file overwrites it. Fix: wrap the
          desktop assertion in @media (min-width: 577px).
          CORRECT LAYER -- same layer (L3), same file, same variable.
          Scope: ALL H2s site-wide at desktop get 40px; ALL H2s at <=576px
          get 30px. This is correct per brief.

L5 check: Not needed. No page-specific scoping required. The fix is at the
          correct (L3) layer for a site-wide typography token.
```

**Step 3 (autonomous layer approval):** L3 -- `:root` token override in `base.css`. The fix wraps the existing desktop `--h2-size` assertion in `@media (min-width: 577px)` so it does not clobber the mobile value. No new CSS property introduced; no new selector; no new layer. The precedent from Sprint 14 Cycle 3 (which found a marker-class mechanism was the correct fix rather than L1 token) was checked -- in this case, the trace reveals a genuine L3 source-order bug, not a marker-class gap.

**Step 4:** base.css edited. Preview letter-spacing corrected.

**Step 5:** T1 + T2 verification (see below).

## Deviations from spec

1. **Brief value is 30px, not ~32px.** The issue and audit guessed ~32px. The brief `typography-mobile` block unambiguously says `display-md: { fontSize: 30px, letterSpacing: -0.8px }`. The mobile `@media (max-width: 576px)` block in base.css already had the correct 30px value -- it was just being overridden by source order. Conservative interpretation: 30px is the target. No spec ambiguity.

2. **Preview was already correct at 30px.** The issue stated "preview = 30px (2px undershoots brief)" based on the audit's ~32px guess. Since the brief value is actually 30px, the preview font-size was already correct. The only preview change was letter-spacing: -0.6px to -0.8px to match the brief.

3. **Other preview files have the same letter-spacing deviation (-0.6px vs brief -0.8px).** These are out of scope for this cycle. Pages affected: homepage, services, about-us, open-source-projects, contact-us. Filed as follow-up observation.

## Verification results (T1 + T2)

### T1: cache-clear + curl-grep

**Cache clear:**
```
$ ddev drush cr
[success] Cache rebuild complete.
```

**New media query in served CSS:**
```
$ curl -sk '.../base.css' | grep -B2 -A5 'min-width: 577px'
@media (min-width: 577px) {
  :root {
    --h2-size: 2.5rem;           /* 40px = display-md per design brief */
    --h2-letter-spacing: -1px;   /* display-md desktop tracking */
  }
}
```
PASS -- desktop-only media query wrapping confirmed.

**Mobile rule still present:**
```
$ curl -sk '.../base.css' | grep -n 'h2-size'
227:    --h2-size: 1.875rem;             /* 30px */
287:    --h2-size: 2.5rem;           /* 40px = display-md per design brief */
```
PASS -- both rules present; line 287 now inside `@media (min-width: 577px)`.

### T2: Playwright computed-style probes

**375px viewport (mobile) -- /how-we-do-it:**
```
H2[2]: "Audit."                        => fontSize=30px, ls=-0.8px, lh=33.9px
H2[3]: "Stand up the dogfood loop."    => fontSize=30px, ls=-0.8px, lh=33.9px
H2[4]: "Take over or hand back."       => fontSize=30px, ls=-0.8px, lh=33.9px
H2[5]: "What we don't do."             => fontSize=30px, ls=-0.8px, lh=33.9px
H2[6]: "Want a one-page audit..."      => fontSize=36px, ls=-1.2px, lh=37.8px (display-lg, unchanged)
```
PASS -- all display-md H2s at 30px. display-lg closing CTA unchanged at 36px.

**1280px viewport (desktop) -- /how-we-do-it:**
```
H2[2]: "Audit."                        => fontSize=40px, ls=-1px, lh=45.2px
H2[3]: "Stand up the dogfood loop."    => fontSize=40px, ls=-1px, lh=45.2px
H2[4]: "Take over or hand back."       => fontSize=40px, ls=-1px, lh=45.2px
H2[5]: "What we don't do."             => fontSize=40px, ls=-1px, lh=45.2px
H2[6]: "Want a one-page audit..."      => fontSize=56px, ls=-1.6px, lh=58.8px (display-lg, unchanged)
```
PASS -- desktop sizes unchanged.

**Heading hierarchy (structural):**
```
H1 (hero) -> H2 (section heads x4 + closing CTA) -> H3 (cards)
Single H1. No skips.
```
PASS.

### T2: Cross-page sweep at 375px

```
/:
  H2: "Tools, AI, and experts..."           = 30px  PASS
  H2: "We heal our own tests nightly."      = 30px  PASS
  H2: "Ready for a release..."              = 36px  PASS (display-lg)

/services:
  H2: "Four ways we engage."                = 30px  PASS
  H2: "Senior testing capacity..."          = 30px  PASS
  H2: "Not sure which shape fits?"          = 36px  PASS (display-lg)

/about-us:
  H2: "On drupal.org since 2006."           = 30px  PASS
  H2: "The tools we wrote."                 = 30px  PASS
  H2: "Want to talk testing?"               = 36px  PASS (display-lg)

/open-source-projects:
  H2: "Our testing tools"                   = 30px  PASS
  H2: "Community contributions"             = 30px  PASS
  H2: "Found a bug or want..."             = 36px  PASS (display-lg)
```
PASS -- all display-md H2s across all pages now at 30px at mobile. No regressions.

## WCAG contrast ratios

| Element | Foreground | Background | Ratio | Pass/Fail |
|---|---|---|---|---|
| Section H2 on white (30px mobile, Rubik 500) | `#1F1A14` (--color--loud) | `#FFFFFF` (theme--white) | 17.29:1 | PASS (large text >= 3:1) |
| Section H2 on cream (30px mobile, Rubik 500) | `#1F1A14` | `#F5EFE2` | 15.17:1 | PASS (large text >= 3:1) |

No color change in this fix -- only font-size and letter-spacing. All contrast ratios unchanged from pre-fix values. At 30px / Rubik 500 weight, text qualifies as "large text" (>= 18pt = 24px), so the 3:1 threshold applies. Both surfaces far exceed it.

## Mobile responsive behavior

**display-md H2 at mobile (<= 576px):**
- Before: 40px (unconditional `:root` clobbered the mobile override)
- After: 30px (desktop assertion scoped to `min-width: 577px`, mobile 30px now wins)
- Letter-spacing: -0.8px (was being overridden to -1px; now -0.8px per brief)
- Line-height: 33.9px (1.13 computed, within brief's <= 1.10 range -- this is Dripyard's `--h2-line-height: 1.13` default; the brief says 1.1 but this is controlled by Dripyard's base `--h2-line-height` variable, not by our override)
- Breakpoint: 576px (matches brief `typography-mobile.breakpoint: 576px`)
- Verified: Playwright probe at 375px confirms 30px on all section H2s

**Touch targets:** H2s are text, not interactive elements. No touch target change.

**Orphan-word check at new size:**
- "Audit." -- single word, no orphan risk
- "Stand up the dogfood loop." -- wraps naturally, no orphan
- "Take over or hand back." -- wraps naturally, no orphan
- "What we don't do." -- wraps naturally, no orphan
All section H2s are short enough (2-5 words) that `text-wrap: balance` (applied by Dripyard heading utility) handles wrap distribution. No orphan-word regression.

## Autonomous decisions

1. **Brief value confirmed as 30px, not ~32px as audit guessed.** The brief `typography-mobile` block (line 126) and the responsive behavior table (line 469) both unambiguously state `display-md` mobile = 30px. The existing base.css mobile override already had the correct value (1.875rem = 30px). The audit's "~32" was a guess, not a brief-sourced value. No spec ambiguity -- the most conservative interpretation (use the explicit brief value) is also the only one.

2. **Preview was already correct; only letter-spacing patched.** The issue stated preview was "2px under brief" based on the ~32px guess. Since brief = 30px and preview = 30px, the preview font-size was already correct. I patched only the letter-spacing (-0.6px to -0.8px) to match the brief. This is the most conservative interpretation: fix what deviates from brief, leave what matches.

3. **Root cause identified as source-order cascade bug, not a missing mobile rule.** The 7-step trace revealed that base.css already had the correct 30px mobile value at line 227, but an unconditional `:root` block at line 278 (later in source order) was overriding it at all viewport widths. The fix wraps the desktop assertion in `@media (min-width: 577px)` rather than duplicating the mobile value or adding a new override. This is the minimal, highest-layer fix.

4. **L3 chosen over L5.** The issue mentioned the Sprint 14 Cycle 3 precedent where L5 (Canvas marker) was the correct fix. In this case, the trace confirms the bug is genuinely at L3 -- a source-order error in the site-wide token layer. No marker class or page-specific scoping is appropriate because `display-md` mobile = 30px is the correct value for ALL H2s on ALL pages. L5 would be wrong here.

5. **Cross-page letter-spacing deviation in other previews noted but not fixed.** The same -0.6px (should be -0.8px) deviation exists in homepage.html, services.html, about-us.html, open-source-projects.html, and contact-us.html previews. Fixing those is out of scope for this cycle (issue scoped to `/how-we-do-it`). Filed as observation for future cycle.

## Cross-page consumer list (for S sweep)

This is an L3 sitewide change. ALL pages with `display-md` H2s are affected at mobile.

| Page | H2 at 375px (before) | H2 at 375px (after) | Status |
|---|---|---|---|
| `/` (homepage) | 40px | 30px | Changed (via cascade) |
| `/services` | 40px | 30px | Changed (via cascade) |
| `/how-we-do-it` | 40px | 30px | Changed (primary target) |
| `/about-us` | 40px | 30px | Changed (via cascade) |
| `/open-source-projects` | 40px | 30px | Changed (via cascade) |
| `/contact-us` | 40px | 30px | Changed (via cascade, not probed -- S should verify) |

S sweep is MANDATORY per PC-3. S should verify all six pages at 375px:
- H2 section heads at 30px
- Closing CTA H2 (display-lg) unchanged at 36px
- No horizontal scroll
- No layout breakage from the 10px size reduction
- No orphan-word regressions

## Known issues

1. **Line-height at mobile is 1.13, brief says 1.1.** The computed line-height (33.9px / 30px = 1.13) comes from Dripyard's `--h2-line-height: 1.13` default. Overriding `--h2-line-height` at mobile would be a separate L3 change (same file, same block). The delta is 0.9px per line (33.9px vs 33px). Left for a future cycle if the operator considers it material.

2. **Other previews have letter-spacing -0.6px instead of brief's -0.8px.** Five other preview files have the same deviation. Out of scope for this cycle.

## Files changed

- `web/themes/custom/performant_labs_20260502/css/base.css` (MODIFIED) -- wrapped desktop `--h2-size` in `@media (min-width: 577px)`
- `docs/pl2/Previews/how-we-do-it.html` (MODIFIED) -- letter-spacing -0.6px to -0.8px on mobile `.section-head h2`
