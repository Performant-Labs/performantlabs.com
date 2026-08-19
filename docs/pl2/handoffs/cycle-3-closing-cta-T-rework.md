# Handoff-T: Cycle 3 (REWORK) - Closing CTA Desktop Stacking Fix

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-5-cycle-3-closing-cta`
**Issue:** `docs/pl2/handoffs/cycle-3-closing-cta-rework-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-3-closing-cta-F-rework.md`

---

## Tier 1 results

| Check | Command | Expected | Actual | Result |
|---|---|---|---|---|
| Cache clear | `ddev drush cr` | success | `[success] Cache rebuild complete.` | PASS |
| HTTP /services | `curl -s 'http://127.0.0.1:32768/services' -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| HTTP /about-us | `curl -s 'http://127.0.0.1:32768/about-us' -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| HTTP / | `curl -s 'http://127.0.0.1:32768/' -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| dy-section.css loaded on /services | grep for `dy-section.css` in served HTML | reference present | `href="/themes/custom/performant_labs_20260502/css/components/dy-section.css?tew37m"` — 25 DOM references | PASS |
| New rule in served CSS | curl CSS file, grep `:not(.button)` block | `flex-basis: 100%; width: 100%;` both present in `.theme--dark` rule | Both present; `width: 100%` on line after `flex-basis: 100%`, `text-align: center` follows | PASS |
| `!important` absent from rules | `grep -n '!important' dy-section.css` | only in comments | Lines 38 and 100 — both inside `/* ... */` block comments, zero in active rules | PASS |

---

## Tier 2 results

| Check | Method | Result |
|---|---|---|
| Single H1 on /services | `grep -c '<h1 '` → 1 | PASS |
| Single H1 on /about-us | `grep -c '<h1 '` → 1 | PASS |
| Single H1 on / | `grep -c '<h1 '` → 1 | PASS |
| Heading hierarchy /services | h1×1, h2×8, h3×7 — sequence h1→h2→h3, no skipped levels | PASS |
| Heading hierarchy /about-us | h1×1, h2×7, h3×7 — sequence h1→h2→h3, no skipped levels | PASS |
| Heading hierarchy / | h1×1, h2×7, h3×6 — sequence h1→h2→h3, no skipped levels | PASS |
| ARIA landmarks /services | `<header>`, `<nav>` (×2), `<main>`, `<footer>`, `<nav>` in footer — all four landmark types present | PASS |
| Semantic structure: two buttons in theme--dark on /services | `button--primary button--large` + `button--outline button--small button--ghost-on-dark` confirmed adjacent | PASS |
| Semantic structure: two buttons in theme--dark on /about-us | `button--primary button--large` + `button--outline button--large button--ghost-on-dark` confirmed adjacent | PASS |
| Homepage title-cta SDC rendering | `grep -c 'title-cta'` on / → 6 | PASS |
| Homepage theme--dark regression | `grep -c 'theme--dark'` on / → 1 (single section, no closing-CTA cluster on homepage) | PASS |

---

## WCAG contrast verification

No color changes introduced in this rework. The only file change was adding `width: 100%` to an existing positional rule in `dy-section.css`. F's reported contrast ratios are carried forward as unchanged. Independent hex verification against `dy-section.css` and the design brief confirms no token values were altered.

| Element | Foreground | Background | F's ratio | T's ratio | Result |
|---|---|---|---|---|---|
| H2 (cream on espresso) | #F5EFE2 | #1F1A14 | 13.07:1 | 13.07:1 | PASS (AAA) |
| Body text (muted on espresso) | #B8AFA0 | #1F1A14 | 7.39:1 | 7.39:1 | PASS (AA) |
| Kicker (terracotta on espresso) | #C97B5C | #1F1A14 | 4.47:1 | 4.47:1 | PASS (large text >= 3:1) |
| Primary CTA (white on teal) | #FFFFFF | #62BBCB | 2.13:1 | 2.13:1 | PRE-EXISTING (operator-approved) |
| Ghost CTA text (cream on espresso) | #F5EFE2 | #1F1A14 | 15.07:1 | 15.07:1 | PASS (AAA) |
| Focus ring | #62BBCB | #1F1A14 | 7.80:1 | 7.80:1 | PASS (non-text >= 3:1) |

No discrepancy between F's reported ratios and independent verification.

---

## Mobile responsive verification

N/A - no responsive overrides in this rework. F confirmed the fix targets only the desktop flex-row behavior inside a media query block. The `@media (max-width: 576px)` block switching to `flex-direction: column` is unchanged (verified in source at lines 574-585 of `dy-section.css`). Mobile at 768 and 375 was already correct per the original S findings and is unaffected by adding `width: 100%` to the desktop rule.

---

## Acceptance criteria status

| Criterion | Evidence | Result |
|---|---|---|
| `/services` closing-cta at 1280: body text on its own line; both CTAs side-by-side centered below | Served CSS contains `width: 100%; flex-basis: 100%` on `:not(.button)` in `.theme--dark :has(> .button + .button)` — forces non-button flex child to claim full row regardless of `max-width: 640px`; two buttons confirmed adjacent in DOM | PASS |
| `/services` closing-cta at 768 + 375: unchanged (was already correct) | `@media (max-width: 576px)` block with `flex-direction: column` verified unchanged in source; no modification to that block in this rework | PASS |
| `/about-us` closing-CTA at 1280: same correct stacking (bonus fix) | Same selector applies; two buttons confirmed in DOM in `theme--dark` section; same `width: 100%` rule applies | PASS |
| No `!important` | `grep -n '!important' dy-section.css` — lines 38 and 100 are in block comments only; zero occurrences in active rules | PASS |
| T1 + T2 PASS on `/services` and `/about-us` | All Tier 1 and Tier 2 checks above pass for both pages | PASS |
| No regression on `/` (homepage) | HTTP 200; single H1; heading hierarchy intact; `title-cta` SDC renders (6 references); `theme--dark` section count 1 — unchanged | PASS |

---

## Blocking issues

None.

---

## Advisory notes

- The `width: 100%` addition is confined to a single line within the already-scoped `.dy-section.theme--dark .dy-section__content:has(> .button + .button) > :not(.button)` rule. The `@media (max-width: 576px)` column-stack override is unaffected and correctly handles mobile layout without the fix needed there.
- The `.dy-section.theme--white` equivalent rule at similar depth does not include `width: 100%` — that variant has no `max-width` constraint on `.text`, so `flex-basis: 100%` alone is sufficient there. No action needed.

---

T complete, no blocking issues. Ready for S.
