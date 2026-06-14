# Handoff-T: Sprint 6 Cycle 3 — nearshore container-cap (FU-S5-5)

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-6-cycle-3-nearshore-cap`
**Issue:** `docs/pl2/handoffs/cycle-3-nearshore-cap-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-3-nearshore-cap-F.md`

---

## Tier 1 results

| Check | Command | Expected | Actual | Result |
|---|---|---|---|---|
| Cache clear | `ddev drush cr` | `Cache rebuild complete.` | `[success] Cache rebuild complete.` | PASS |
| HTTP /services | `curl -sk '.../services' -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| HTTP / | `curl -sk '.../' -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| HTTP /about-us | `curl -sk '.../about-us' -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| nearshore-section on /services | `grep -o 'nearshore-section' \| wc -l` | 1 | 1 | PASS |
| nearshore-section absent on / | `grep -o 'nearshore-section' \| wc -l` | 0 | 0 | PASS |
| nearshore-section absent on /about-us | `grep -o 'nearshore-section' \| wc -l` | 0 | 0 | PASS |
| dy-section.css referenced on /services | `grep -o 'dy-section.css[^"]*'` | filename present | `dy-section.css?tewggk` | PASS |
| dy-section.css referenced on / | `grep -o 'dy-section.css[^"]*'` | filename present | `dy-section.css?tewggk` | PASS |
| dy-section.css referenced on /about-us | `grep -o 'dy-section.css[^"]*'` | filename present | `dy-section.css?tewggk` | PASS |
| nearshore-section selectors in served CSS | `curl CSS \| grep -c 'nearshore-section'` | 4 | 4 | PASS |
| H2 rule present in served CSS | `grep -A3 'nearshore-section .dy-section__header .heading.h2'` | max-width: 640px; margin-inline: auto; text-wrap: balance | confirmed | PASS |
| Body rule present in served CSS | `grep -A3 'nearshore-section .dy-section__header .text p'` | max-width: 720px; margin-inline: auto | confirmed | PASS |
| Nearshore H2 text rendered | grep in page HTML | "Senior testing capacity, when you need more hands." | present | PASS |

**Note on host URL:** ddev serves on port 8493 (`https://pl-performantlabs.com.3.ddev.site:8493`). The default `.ddev.site` base without port returns 404. All Tier 1 curls used the correct port with `-sk` for the locally-trusted cert.

---

## Tier 2 results

| Check | Method | Result |
|---|---|---|
| nearshore-section class on correct DOM element | `grep -o '[^<]*nearshore-section[^>]*'` — output: `div data-component-id="dripyard_base:section" class="dy-section nearshore-section theme--light ..."` | PASS |
| Marker class is only on dy-section (not inner elements) | Grep for all `class="dy-section [^"]*"` on /services — 6 top-level sections, only one has nearshore-section | PASS |
| No other dy-section on /services has marker class | 6 sections: landing-hero/theme--white, theme--white (cards), nearshore-section/theme--light, theme--white (dogfooding), theme--white (engagements), theme--dark (closing CTA) | PASS |
| No regression: engagements, proof, closing-cta sections | All three appear without nearshore-section class; class counts confirm exactly 1 occurrence site-wide on /services | PASS |
| Single visible H1 in main content | `grep -oP '<h1[^>]*>' \| wc -l` = 1; content: "Testing engagements for Drupal teams." | PASS |
| Heading hierarchy: H2s before H1 are visually-hidden | Two pre-content H2s carry class `visually-hidden` (main navigation label, breadcrumb label) — standard Drupal pattern, not a document structure violation | PASS |
| ARIA landmarks: header, main, footer, nav present | grep for `<header`, `<main`, `<footer`, `<nav` — all 4 found (header x1, main x1, footer x1, nav x3 including breadcrumb and two menu-blocks) | PASS |
| No `!important` in CSS declarations | `grep -i '!important'` in served CSS — 2 matches, both inside comment blocks (`/* No !important. */`) | PASS |
| CSS brace balance | open `{` count = 82, close `}` count = 82 in served file | PASS |
| Script exists at expected path | `ls scripts/sprint6-cycle3-nearshore-marker.php` — 2319 bytes, May 11 | PASS |
| Script idempotency guard | Line 53-55: `if (strpos($existing, $marker_class) !== FALSE)` → `echo "SKIP: already present"` | PASS |
| component_version preserved | Script reads full `$inputs` JSON, modifies only `additional_classes` key, re-encodes full array — no explicit nullification of component_version | PASS |
| No aria-expanded toggles (none expected on page) | `grep -c 'aria-expanded'` = 0 — no accordions or disclosure widgets on /services | N/A |
| Focus order: interactive elements use standard document flow | No CSS position:absolute or negative z-index on nearshore section elements — order unchanged by layout-only CSS | PASS |

---

## WCAG contrast verification

| Element | Foreground | Background | F's ratio (handoff table) | T's ratio (computed) | Pass/Fail |
|---|---|---|---|---|---|
| H2 (nearshore, 54px/500wt = large text) | #2A2520 | #F5EFE2 | 13.24:1 | 13.24:1 | PASS (threshold 3:1) |
| Body text (nearshore, normal text) | #5C544C | #F5EFE2 | 6.48:1 | 6.48:1 | PASS (threshold 4.5:1) |

T's ratios computed with full sRGB linearization per WCAG 2.1 formula. Both match F's handoff table exactly.

**Discrepancy noted (advisory):** The block comment in `dy-section.css` at lines 925-926 states `12.26:1` and `5.53:1` for the same color pairs. These figures are incorrect relative to the verified hex values. The comment is the only location of the discrepancy — the CSS declarations themselves are correct and no color properties were changed. This is a non-blocking advisory note; the comment should be corrected to 13.24:1 and 6.48:1 in a future pass.

No color properties were added or changed by this cycle. The nearshore section's surface and text tokens are unchanged from previous cycles.

---

## Mobile responsive verification

N/A — F reports no responsive overrides in this phase. The new `max-width: 640px` (H2) and `max-width: 720px` (body) values are well within 375px and 768px viewport widths. No media queries were added for the nearshore rules. `text-wrap: balance` degrades gracefully. Responsive behavior for the nearshore section was assessed as MATCH in Sprint 5 Cycle 1 audit (items N3, N4) and is not in scope for this cycle.

---

## Acceptance criteria status

| Criterion (from issue) | Status | Evidence |
|---|---|---|
| `/services` nearshore H2 at 1280: wraps within ~640px content-cap, matching preview's wrap pattern | PASS | CSS rule `.nearshore-section .dy-section__header .heading.h2 { max-width: 640px; margin-inline: auto; text-wrap: balance }` confirmed in served stylesheet; 4 occurrences of nearshore-section selector in CSS |
| `text-wrap: balance` applied to H2 | PASS | Confirmed in both source file (line 935) and served CSS |
| `/services` nearshore at 768 + 375: unchanged (already MATCH) | PASS | No responsive overrides added; layout-only rules do not affect mobile breakpoints |
| No regression on other `dy-section` instances on `/services` or other pages | PASS | 6 sections on /services; exactly 1 has nearshore-section class; 0 on / and /about-us |
| No `!important` | PASS | Grep of served CSS: `!important` appears only inside CSS comments, not in declarations |
| T1 + T2 PASS | PASS | All checks in Tier 1 and Tier 2 above pass |
| Canvas content edit captured in `scripts/sprint6-cycle3-nearshore-marker.php` | PASS | File exists at 2319 bytes, May 11 2026; script targets canvas_page id=3, index 15, uuid 91a28c64-... |
| Canvas `component_version` non-NULL constraint respected | PASS | Script reads full inputs JSON object and modifies only `additional_classes`; component_version is preserved implicitly |

---

## Blocking issues

None.

---

## Advisory notes

1. **CSS comment WCAG ratios are incorrect.** Lines 925-926 in `dy-section.css` state `12.26:1` and `5.53:1` for the nearshore H2 and body contrast pairs. The correct values (verified independently) are `13.24:1` and `6.48:1`. The CSS declarations are correct — no color properties were changed. The comment-only error does not affect rendering or accessibility. Suggested correction in a future housekeeping pass.

2. **dy-section.css serves identically on /, /services, and /about-us** (same cache-buster `?tewggk`). The `.nearshore-section` selector is inert on pages where that class never appears — confirmed by zero-occurrence grep on / and /about-us.

---

T complete, no blocking issues. Ready for S.
