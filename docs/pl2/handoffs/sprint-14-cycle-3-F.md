# Handoff-F: Sprint 14 Cycle 3 - Mobile display-xl token raise (F-NEW-2)

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-14-cycle-3-mobile-display-xl-token`
**Issue:** `docs/pl2/handoffs/sprint-14-cycle-3-issue.md`

## Confirmation table (autonomous mode)

| Item | Value |
|---|---|
| Page | `/about-us` (with cross-page cascade) |
| Issue | `docs/pl2/handoffs/sprint-14-cycle-3-issue.md` |
| Branch | `aa/pl-sprint-14-cycle-3-mobile-display-xl-token` |
| Runbook phase | Sprint 14 Cycle 3 (L1 token + cross-page sweep) |
| Input documents read | issue, Cycle 1 audit, Cycle 2 F handoff, design brief typography-mobile block, theme-change--workflow.md, theme-change.md, base.css, hero.css, dy-section.css, fu2-landing-hero-class-patch.php, sprint10-cycle2b2-rework-about-us-hero-marker.php |
| Acceptance criteria count | 6 (1 is S-only cross-page sweep) |
| Handoff document path | `docs/pl2/handoffs/sprint-14-cycle-3-F.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | N/A (no component schema changes; Canvas `additional_classes` only) |

## What was done

- **`scripts/sprint14-cycle3-about-us-landing-hero.php` (NEW)** -- Canvas assembly script that adds `landing-hero` to the about-us hero section's `additional_classes` (canvas_page id=17, index 0, UUID `a1e7c3b4-1d2f-4a5b-9c6d-7e8f9a0b1c2d`). This makes the existing dy-section.css FU-2 rules apply: 72px desktop, 44px mobile, -2px/-1px tracking, 1.05 line-height. Idempotent. Preserves `component_version: e6079b189d228dad`.
- **`docs/pl2/Previews/about-us.html` line 514** -- changed `.hero h1 { font-size: 40px }` to `font-size: 44px` to match brief typography-mobile display-xl.

## Layer decisions

### 7-step CSS change workflow trace

**Step 1 -- Desired change:** About-us hero H1 renders 36px at mobile (< 576px). Brief specifies display-xl = 44px at mobile.

**Step 2 -- Pass 1 (bottom-up trace):**
```
Property:      font-size on h1.heading.h1 inside .dy-section (about-us hero)
Current value: 36px (2.25rem) at 375px viewport
Declared by:   .h1 { font-size: var(--h1-size); }  [dripyard typography utility, (0,1,0)]
Comes from:    --h1-size at @media (max-width: 576px) = 2.25rem (36px)
Source:        base.css line 225: --h1-size: 2.25rem
```

**Critical finding:** `--h1-size` maps to display-lg (36px), NOT display-xl (44px). The display-xl token `--title-size` is ALREADY 44px at mobile (base.css line 223). The about-us H1 renders at 36px because it consumes `--h1-size` via the `.h1` utility class, not `--title-size`.

**DOM inspection gate (mandatory before Pass 2):**
```
DOM inspection evidence:
  [x] Tier 1: .dy-section.dy-section--cta-pair.dy-section--centered-white.theme--white
              > .dy-section__container > .dy-section__header.grid
              > .dy-section__content > h1.heading.h1.heading--centered
  [x] No .landing-hero class present (unlike /services, /how-we-do-it, /open-source-projects)
  [x] No .hero wrapper (unlike homepage which uses neonbyte:hero component)
```

**Step 2 -- Pass 2 (top-down eligibility):**
```
L1 check: --title-size (display-xl) is already 2.75rem (44px) at <=576px in base.css.
          Raising --h1-size from 36 to 44 would make ALL H1 elements site-wide 44px at mobile,
          breaking /contact-us (display-lg spec), articles, and other non-hero pages.
          NOT the fix. RULED OUT.

L3 check: html .theme--white { --h1-size: 44px } would change every .h1 in white zones.
          Same overbroad scope. RULED OUT.

L5 check: The architectural pattern already exists -- /services, /how-we-do-it,
          /open-source-projects all use the `landing-hero` additional_classes marker
          on their dy-section hero, which triggers the L5 rules in dy-section.css:
            .landing-hero .heading.h1 { letter-spacing: -2px; line-height: 1.05; }
            @media (min-width: 577px) { .landing-hero .heading.h1 { font-size: 4.5rem; } }
            @media (max-width: 576px) { .landing-hero .heading.h1 { font-size: 2.75rem; letter-spacing: -1px; } }
          Adding landing-hero to the about-us hero section activates these existing rules.
          CORRECT APPROACH.
```

**Step 3 (autonomous layer approval):** L5 via existing dy-section.css FU-2 rules, activated by Canvas `additional_classes` change. No new CSS written in theme files. The issue specified L1, but the trace reveals `--title-size` is already 44px -- the gap is that about-us's hero section lacked the `landing-hero` marker class. This is a scope deviation documented under "Autonomous decisions" below.

**Step 4:** Canvas assembly script written (`scripts/sprint14-cycle3-about-us-landing-hero.php`). Preview updated (line 514: 40px -> 44px).

**Step 5:** T1 + T2 verification (see below).

## Deviations from spec

The issue specified "L1 token layer per PC-3" and assumed `--title-size` (display-xl) needed to be raised from 36px to 44px. The 7-step trace reveals that `--title-size` is already 44px in base.css. The about-us hero H1 was at 36px because it consumed `--h1-size` (display-lg) via the `.h1` utility class, and the about-us hero section lacked the `landing-hero` marker class that the other landing pages have.

Raising `--h1-size` from 36px to 44px at L1 would have been site-destructive -- it would change ALL H1 elements (including /contact-us at display-lg 56px desktop, articles, etc.). The correct fix is the same Canvas `additional_classes` approach used for /services, /how-we-do-it, and /open-source-projects.

No new CSS was written. The existing dy-section.css FU-2 rules (written in Sprint 4 Cycle 3) already handle both desktop (72px) and mobile (44px) for `.landing-hero .heading.h1`.

## Verification results (T1 + T2)

### T1: cache-clear + curl-grep

**Cache clear:**
```
$ ddev drush cr
[success] Cache rebuild complete.
```

**landing-hero class in rendered HTML:**
```
$ curl -sk 'https://pl-performantlabs.com.3.ddev.site:8493/about-us' | grep -oP 'class="dy-section[^"]*"' | head -1
class="dy-section dy-section--cta-pair dy-section--centered-white landing-hero theme--white container dy-section--section-max-width margin-top--0 margin-bottom--0 padding-top--l padding-bottom--l"
```
PASS -- `landing-hero` present in hero section.

**dy-section.css served on /about-us:**
```
$ curl -sk 'https://pl-performantlabs.com.3.ddev.site:8493/about-us' | grep -oE 'href="[^"]*dy-section\.css[^"]*"'
href="/themes/custom/performant_labs_20260502/css/components/dy-section.css?teyynm"
```
PASS -- CSS file loaded.

**44px mobile rule in served CSS:**
```
$ curl -sk 'https://pl-performantlabs.com.3.ddev.site:8493/themes/custom/performant_labs_20260502/css/components/dy-section.css' | grep -A3 '2\.75rem.*44px.*display-xl.*mobile'
  .landing-hero .heading.h1 {
    font-size: 2.75rem;            /* 44px display-xl mobile */
    letter-spacing: -1px;          /* relaxed from -2px per typography-mobile */
    line-height: 1.05;
```
PASS -- 44px mobile rule confirmed in served CSS.

**Preview mobile rule:**
```
$ grep -n 'font-size: 44px' docs/pl2/Previews/about-us.html
514:      .hero h1 { font-size: 44px; letter-spacing: -1px; }
```
PASS -- preview now at 44px.

### T2: structural checks

**Desktop 72px rule intact:**
```
$ curl -sk '...' | grep -A3 '4\.5rem.*72px.*display-xl'
  .landing-hero .heading.h1 {
    font-size: 4.5rem;             /* 72px display-xl */
    letter-spacing: -2px;
  }
```
PASS -- desktop 72px unchanged.

**base.css mobile tokens unchanged:**
```
--title-size: 2.75rem;           /* 44px */  (unchanged)
--h1-size: 2.25rem;              /* 36px */  (unchanged)
--h2-size: 1.875rem;             /* 30px */  (unchanged)
```
PASS -- no other typography tokens affected.

**Heading hierarchy:**
```
H1 (hero) -> H2 (section heads) -> H3 (cards, bio)
```
Single H1, correct nesting. PASS.

**Other landing pages still have landing-hero:**
```
/services:              landing-hero present (PASS)
/how-we-do-it:          landing-hero present (PASS)
/open-source-projects:  landing-hero present (PASS)
```
No regression.

## WCAG contrast ratios

| Element | Foreground | Background | Ratio | Pass/Fail |
|---|---|---|---|---|
| Hero H1 (44px mobile, Rubik 500) | `#1F1A14` (--color--loud) | `#FFFFFF` (theme--white) | 17.29:1 | PASS (AAA; large text threshold 3:1) |

No color change -- only font-size changed. Contrast ratio is identical to Sprint 13 verified (the audit reported 17.29:1; the issue's 15.17:1 figure may reflect a different measurement method, but both far exceed the 3:1 threshold for large text at 44px/500wt = ~33pt).

## Mobile responsive behavior

**About-us hero H1 at mobile (< 576px):**
- Before: 36px (via `--h1-size` / display-lg token)
- After: 44px (via `.landing-hero .heading.h1` explicit assertion / display-xl mobile)
- Letter-spacing: -1px (relaxed from desktop -2px per typography-mobile block)
- Line-height: 1.05 (carried from desktop)
- Verified: `landing-hero` class renders in HTML at `/about-us`; dy-section.css `@media (max-width: 576px)` rule with `font-size: 2.75rem` is served

**Touch target:** H1 at 44px is text, not a touch target. The relevant check is reflow/readability/no horizontal scroll. At 375px viewport, the H1 "Drupal testing, done by the people who wrote the tools." wraps to multiple lines (per Cycle 1 audit orphan-word check: 4 lines, last line = "wrote the tools." -- no single-word orphan). The +8px increase (36 -> 44px) may add one line of wrap but does not introduce horizontal scroll.

**Cross-page mobile impact:** All five landing-page heroes now render 44px at mobile. The homepage already had 44px via hero.css. The other three (/services, /how-we-do-it, /open-source-projects) already had 44px via the `landing-hero` dy-section.css rules. Only /about-us changes (36 -> 44px).

## Autonomous decisions

1. **Layer choice: L5 (existing FU-2 rules via Canvas marker) instead of L1 (token raise).** The issue specified L1 token, but the 7-step trace revealed that `--title-size` (display-xl) is already 44px at mobile. The about-us H1 was at 36px because it consumed `--h1-size` (display-lg = 36px) and lacked the `landing-hero` marker class. Raising `--h1-size` to 44px at L1 would be site-destructive (all H1 elements across the site). Adding `landing-hero` to the about-us hero section activates the existing L5 rules -- the same architectural pattern used for /services, /how-we-do-it, and /open-source-projects.

2. **Canvas additional_classes approach chosen over new CSS rule.** Could have written a new L5 rule targeting `.dy-section--centered-white .heading.h1` in dy-section.css, but that would hit all centered-white sections (not just hero). The `landing-hero` marker approach is the established, tested, idempotent pattern.

3. **Scope assessment: under cap, no split needed.** Two files changed (Canvas script + preview), zero theme CSS files modified. Well under the 6-file scope cap.

## Cross-page consumer list (for S sweep)

Pages that render `display-xl` for the hero H1, affected by the `landing-hero` + dy-section.css rules:

| Page | Hero mechanism | Mobile display-xl rule | Changed this cycle? |
|---|---|---|---|
| `/` (homepage) | `neonbyte:hero` component | hero.css `@media (max-width: 576px) .hero.theme--white .heading { font-size: 2.75rem }` | No |
| `/services` | dy-section + `landing-hero` | dy-section.css `@media (max-width: 576px) .landing-hero .heading.h1 { font-size: 2.75rem }` | No |
| `/how-we-do-it` | dy-section + `landing-hero` | Same rule | No |
| `/open-source-projects` | dy-section + `landing-hero` | Same rule | No |
| `/about-us` | dy-section + `landing-hero` (NEW) | Same rule (now applies) | **Yes** |

S should sweep all five pages at 375px to confirm:
- H1 renders at 44px
- Hero CTA stacking is not disrupted by the +8px headline height
- No horizontal scroll
- No single-word orphan on last line of H1
- `text-wrap: balance` behavior (the `.landing-hero .heading.h1` rule includes `text-wrap: balance`)

## Known issues

None. All acceptance criteria met except AC-6 (cross-page S sweep), which is S's responsibility per the issue.

## Files changed

- `scripts/sprint14-cycle3-about-us-landing-hero.php` (NEW) -- Canvas assembly script
- `docs/pl2/Previews/about-us.html` (MODIFIED) -- line 514: `font-size: 40px` -> `font-size: 44px`
