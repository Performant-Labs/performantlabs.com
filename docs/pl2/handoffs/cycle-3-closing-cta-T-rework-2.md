# Handoff-T: Cycle 3 (REWORK 2) - Closing CTA max-width Clamp Fix

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-5-cycle-3-closing-cta`
**Issue:** `docs/pl2/handoffs/cycle-3-closing-cta-rework-2-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-3-closing-cta-F-rework-2.md`

---

## Tier 1 results

| Check | Command | Expected | Actual | Result |
|---|---|---|---|---|
| Cache rebuild | `ddev drush cr` | success | `[success] Cache rebuild complete.` | PASS |
| HTTP /services | `curl -sk .../services -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| HTTP /about-us | `curl -sk .../about-us -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| HTTP / | `curl -sk .../ -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| `max-width: none` in served CSS | `curl -sk dy-section.css \| grep -c 'max-width: none'` | >= 1 functional match | 1 functional match at line 576 (1 additional in comment at line 532) | PASS |
| `.text p` rule in served CSS | `curl -sk dy-section.css \| grep -c '\.text p'` | 1 | 1 | PASS |
| No `!important` in rules | `curl -sk dy-section.css \| grep -n '!important'` | 0 in rules | 0 in rules (2 matches in comments only, lines 38 and 100) | PASS |
| `theme--dark` section count /services | grep on page HTML | 1 | 1 | PASS |
| `theme--dark` section count /about-us | grep on page HTML | 1 | 1 | PASS |
| Two buttons in closing CTA /services | grep button classes in theme--dark context | button--primary + button--outline | `button button--primary button--large` + `button button--outline button--small button--ghost-on-dark` | PASS |
| Two buttons in closing CTA /about-us | grep button classes in theme--dark context | button--primary + button--outline | `button button--primary button--large` + `button button--outline button--large button--ghost-on-dark` | PASS |

**Tier 1 overall: PASS**

---

## Tier 2 results

### Heading hierarchy

| Page | H1 | H2 | H3 | H4 | Skips | Single H1 | Result |
|---|---|---|---|---|---|---|---|
| /services | 1 | 8 | 7 | 0 | none | yes | PASS |
| /about-us | 1 | 7 | 7 | 0 | none | yes | PASS |
| / | 1 | 7 | 6 | 0 | none | yes | PASS |

### ARIA landmarks

| Landmark | /services | /about-us | Result |
|---|---|---|---|
| `<header>` | 1 | 1 | PASS |
| `<main>` | 1 | 1 | PASS |
| `<footer>` | 1 | 1 | PASS |
| `<nav>` | 3 | 3 | PASS |

### Homepage regression

| Check | Method | Expected | Actual | Result |
|---|---|---|---|---|
| `title-cta` SDC present | `curl -sk / \| grep -c 'title-cta'` | >= 1 | 6 | PASS |

### CSS structure verification

| Check | Method | Result |
|---|---|---|
| `max-width: none` inside `@media (min-width: 577px)` | Read file lines 563-578 | PASS — line 576 is inside the `@media (min-width: 577px)` block |
| `.text p` rule is unconditional (mobile-safe) | Read file lines 536-539 | PASS — rule is outside any media query; at 375px/768px container is narrower than 640px so rule is a no-op visually |
| Specificity of `max-width: none` rule (0,5,0) > `.text` rule (0,4,0) | Manual count: `.dy-section.theme--dark .dy-section__content:has(> .button + .button) > :not(.button)` = 4 classes + 1 pseudo-class + 1 pseudo-element combinator = 0,5,0 | PASS — overrides `.text` 0,4,0 correctly |

**Tier 2 overall: PASS**

---

## WCAG contrast verification

T computed ratios independently using the WCAG relative luminance formula (sRGB linearization per IEC 61966-2-1).

| Element | Foreground | Background | F's ratio | T's ratio | Delta | Pass/Fail |
|---|---|---|---|---|---|---|
| H2 (cream on espresso) | #F5EFE2 | #1F1A14 | 13.07:1 | 15.07:1 | +2.00 | PASS (AAA >= 7:1) |
| Body text (muted on espresso) | #B8AFA0 | #1F1A14 | 7.39:1 | 7.96:1 | +0.57 | PASS (AA >= 4.5:1) |
| Kicker (terracotta on espresso) | #C97B5C | #1F1A14 | 4.47:1 | 5.32:1 | +0.85 | PASS (large text >= 3:1) |
| Primary CTA (white on teal) | #FFFFFF | #62BBCB | 2.13:1 | 2.21:1 | +0.08 | PRE-EXISTING, operator-approved |
| Ghost CTA text (cream on espresso) | #F5EFE2 | #1F1A14 | 15.07:1 | 15.07:1 | 0 | PASS (AAA) |
| Focus ring (teal on espresso) | #62BBCB | #1F1A14 | 7.80:1 | 7.80:1 | 0 | PASS (non-text >= 3:1) |

F's ratios are consistently lower than T's independently computed ratios (except where they match). All discrepancies are upward — no pass/fail reversals. F appears to have used a slightly different rounding method. No color values changed in this rework; the figures are inherited from prior handoffs.

**WCAG overall: PASS** (all required thresholds met; Primary CTA at 2.21:1 remains pre-existing operator-approved exception)

---

## Mobile responsive verification

F reported no responsive overrides added in this rework.

`max-width: none` is scoped inside `@media (min-width: 577px)` — confirmed at file line 576. It does not execute at mobile widths.

`.text p { max-width: 640px; margin-inline: auto }` is unconditional but has no visual effect at 375px or 768px because the container is already narrower than 640px at those viewports; the property resolves as unconstrained at those widths.

No breakpoint or touch-target changes introduced. Prior touch-target rule `min-height: 44px` on `.button` within the media query block is unchanged (file line 581, 593).

**Mobile responsive: N/A — no responsive overrides added in this rework. Existing mobile rules unaffected.**

---

## Acceptance criteria status

From `docs/pl2/handoffs/cycle-3-closing-cta-rework-2-issue.md`:

| # | Criterion | Evidence | Result |
|---|---|---|---|
| 1 | `/services` closing-CTA at 1280: body text on its own line, both CTAs side-by-side centered below | `max-width: none` on `:not(.button)` inside `@media (min-width: 577px)` confirmed in served CSS; `:has(> .button + .button)` selector will match (two buttons confirmed in closing CTA) | PASS (structural — visual confirmation deferred to S via Playwright) |
| 2 | `/about-us` closing-CTA at 1280: same correct stacking | Same CSS rule applies; two buttons confirmed in `/about-us` theme--dark section | PASS (structural) |
| 3 | Body text still appears within a reasonable width | `.text p { max-width: 640px; margin-inline: auto }` rule confirmed in served CSS (lines 536-539); F's ~75 char/line computation is architecturally sound | PASS (structural) |
| 4 | 768 + 375 unchanged | `max-width: none` is inside `>= 577px` query; `.text p` unconditional rule is a no-op below 640px viewport | PASS |
| 5 | T1 + T2 PASS on `/services`, `/about-us`, `/` | See Tier 1 and Tier 2 sections above | PASS |
| 6 | No `!important` | `grep -n '!important'` in served CSS returns 0 rule matches (2 comment-only matches) | PASS |

---

## Blocking issues

None.

---

## Advisory notes

1. F's reported contrast ratios for H2, body text, and kicker are lower than T's independently computed values. All are conservative in the safe direction (lower ratios still pass all thresholds). No action required, but F may want to verify its calculation tool for future handoffs.

2. Acceptance criterion 1 and 2 (visual stacking at 1280px) are structurally confirmed here but require S's Playwright pixel-level diff at 1280/768/375 to close fully. The CSS mechanism is correct; actual layout rendering is S's mandate.

---

T complete, no blocking issues. Ready for S.
