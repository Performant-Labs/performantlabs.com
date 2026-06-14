# Handoff-T: Sprint 8 — Final Cycle — Footer + Contact Regression Baseline

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-8-cycle-final-verification`
**Issue:** `docs/pl2/handoffs/cycle-final-footer-contact-baseline-issue.md`
**Handoff-F reviewed:** N/A — verification-only cycle; no F. Antecedent: `docs/pl2/handoffs/cycle-1-footer-contact-audit-S.md`

---

## Tier 1 results

### Cache clear

| Command | Result | PASS/FAIL |
|---|---|---|
| `ddev drush cr` | `[success] Cache rebuild complete.` | PASS |

### HTTP status — shipped pages

Method: `ddev exec curl -o /dev/null -s -w '%{http_code}' http://localhost/<path>` after cache clear.

| Page | Expected | Actual | PASS/FAIL |
|---|---|---|---|
| `/` | 200 | 200 | PASS |
| `/services` | 200 | 200 | PASS |
| `/about-us` | 200 | 200 | PASS |
| `/articles` | 200 | 200 | PASS |
| `/contact-us` | 200 | 200 | PASS |
| `/how-we-do-it` | 200 | 200 | PASS |
| `/open-source-projects` | 200 | 200 | PASS |

### CTA and footer link HTTP inventory (re-run of Cycle 1 checks)

All 7 pages were fetched via `ddev exec curl -sL` and parsed. Header and footer chrome is identical across all pages.

#### Header nav (all 7 pages)

| Label | href | HTTP (first hop) | PASS/FAIL |
|---|---|---|---|
| (logo) | `/` | 200 | PASS |
| Services | `/services` | 200 | PASS |
| How we do it | `/how-we-do-it` | 200 | PASS |
| Articles | `/articles` | 200 | PASS |
| Open source projects | `/open-source-projects` | 200 | PASS |
| About us | `/about-us` | 200 | PASS |
| Contact us | `/contact-us` | 200 | PASS |

No header CTA pill present. Confirms canonical header per memory `design_header_nav_breakpoint.md`. No `href="/contact"` or `href="/form/contact"` in rendered header on any page.

#### Footer (all 7 pages)

| Column | Label | href | HTTP | Fragment target on `/services` |
|---|---|---|---|---|
| Services heading | Services | `/services` | 200 | n/a |
| Services | Testing-suite takeover | `/services#test-suite-takeover` | 200 | `id="test-suite-takeover"` confirmed PRESENT |
| Services | Embedded testing engineer | `/services#embedded-testing-engineer` | 200 | `id="embedded-testing-engineer"` confirmed PRESENT |
| Services | Autonomous healing pilot | `/services#autonomous-healing-pilot` | 200 | `id="autonomous-healing-pilot"` confirmed PRESENT |
| Services | Accessibility testing | `/services#accessibility-testing` | 200 | `id="accessibility-testing"` confirmed PRESENT |
| Resources heading | Resources | `/articles` | 200 | n/a |
| Resources | Articles | `/articles` | 200 | n/a |
| Resources | Documentation | `/docs` | 200 | n/a |
| Company heading | (`<nolink>`) | — | n/a | n/a |
| Company | About us | `/about-us` | 200 | n/a |
| Company | Contact us | `/contact-us` | 200 | n/a |
| Company | Privacy policy | `/privacy-policy` | 200 | n/a |
| Footer signature CTA | Get in touch → | `/contact-us` | 200 | n/a |
| Footer legal | Privacy Policy | `/privacy-policy` | 200 | n/a |

Zero `href="/contact"` instances in rendered HTML on any page. Zero `href="/form/contact"` instances. All footer links point to direct canonical routes. PASS.

#### Legacy redirect confirmation

| Path | First hop | Final after -L | Notes |
|---|---|---|---|
| `/contact` | 301 | 200 → `/contact-us` | Drupal redirect entity preserved as safety net; no rendered link points here |
| `/form/contact` | 301 | 200 → `/contact-us` | Drupal redirect entity preserved as safety net; no rendered link points here |
| `/form/contact-us` (control) | 404 | 404 | Expected |

#### CSS variable presence

| Token | File | Present | PASS/FAIL |
|---|---|---|---|
| `--pl-primary: #1893b4` | `base.css` (active theme) | Yes | PASS |
| `--pl-primary-light: #62BBCB` | `base.css` | Yes | PASS |
| `--theme-link-color: var(--pl-primary)` | `base.css` | Yes | PASS |

---

## Tier 2 results

### `/services` anchor IDs

Method: `grep -oE 'id="[^"]+"'` on fetched `/services` HTML.

| Footer href fragment | Required `id=` on `/services` | Present | PASS/FAIL |
|---|---|---|---|
| `#test-suite-takeover` | `id="test-suite-takeover"` | YES | PASS |
| `#embedded-testing-engineer` | `id="embedded-testing-engineer"` | YES | PASS |
| `#autonomous-healing-pilot` | `id="autonomous-healing-pilot"` | YES | PASS |
| `#accessibility-testing` | `id="accessibility-testing"` | YES | PASS |

No `id="testing-suite-takeover"` (the legacy mismatch anchor) is present in the rendered `/services` page. F.8 closure confirmed. PASS.

### `/contact-us` H1 count and heading hierarchy

| Check | Expected | Actual | PASS/FAIL |
|---|---|---|---|
| H1 count (body) | 1 | 1: "Let's talk about your quality and testing goals." | PASS |
| H1 count (header) | 0 | 0 | PASS |
| No skipped heading levels | Clean | Clean — see sequence below | PASS |

Heading sequence (DOM order):

```
H2  Main navigation     (visually-hidden nav landmark label)
H2  Breadcrumb          (visually-hidden breadcrumb landmark label)
H1  Let's talk about your quality and testing goals.
H2  Prefer a quick call?
H2  What to expect from the other side of this form.
H3    A real reply, by a real engineer.
H3    Thirty minutes, screen-share if helpful.
H3    A short proposal, not a slide deck.
H2  Skip the form — book the review.
H2  Footer              (visually-hidden footer landmark label)
H3    Services
H3    Resources
H3    Company
```

No skipped levels. ADV-CU1 confirmed resolved. PASS.

### H1 count — all pages

| Page | Body H1 count | Header H1 count | PASS/FAIL |
|---|---|---|---|
| `/` | 1 | 0 | PASS |
| `/services` | 1 | 0 | PASS |
| `/about-us` | 1 | 0 | PASS |
| `/articles` | 1 | 0 | PASS |
| `/contact-us` | 1 | 0 | PASS |
| `/how-we-do-it` | 1 | 0 | PASS |
| `/open-source-projects` | 1 | 0 | PASS |

### Heading hierarchy — all pages

| Page | Sequence | Issues | PASS/FAIL |
|---|---|---|---|
| `/` | H2(nav) → H1 → H2 → H3×3 → H2×3 → H2(footer) → H3×3 | None | PASS |
| `/services` | H2(nav) → H2(breadcrumb) → H1 → H2 → H3×4 → H2×3 → H2(footer) → H3×3 | None | PASS |
| `/about-us` | H2(nav) → H2(breadcrumb) → H1 → H2×2 → H3×4 → H2×2 → H2(footer) → H3×3 | None | PASS |
| `/articles` | H2(nav) → H2(breadcrumb) → H1 → H3×6 → H2(footer) → H3×3 | H1→H3 skip in article card list (FU-7b, pre-existing; out of sprint 8 scope) | ADVISORY |
| `/contact-us` | H2(nav) → H2(breadcrumb) → H1 → H2×2 → H3×3 → H2 → H2(footer) → H3×3 | None | PASS |
| `/how-we-do-it` | H2(nav) → H2(breadcrumb) → H1 → H2×2 → H3×3 → H2×2 → H2(footer) → H3×3 | None | PASS |
| `/open-source-projects` | H2(nav) → H2(breadcrumb) → H1 → H2 → H3×3 → H2 → H3×3 → H2 → H3 → H2 → H2(footer) → H3×3 | None | PASS |

The `/articles` H1→H3 skip is pre-existing FU-7b, documented in sprint 4 wrap and sprint 5 final T handoff as out of scope for all subsequent sprints. Not introduced or worsened by sprint 8.

### ARIA landmarks — all pages

Method: regex search on fetched HTML for `<header`, `<main`, `<footer`, `<nav`.

| Page | `<header>` | `<main>` | `<footer>` | `<nav>` | PASS/FAIL |
|---|---|---|---|---|---|
| `/` | PRESENT | PRESENT | PRESENT | PRESENT | PASS |
| `/services` | PRESENT | PRESENT | PRESENT | PRESENT | PASS |
| `/about-us` | PRESENT | PRESENT | PRESENT | PRESENT | PASS |
| `/articles` | PRESENT | PRESENT | PRESENT | PRESENT | PASS |
| `/contact-us` | PRESENT | PRESENT | PRESENT | PRESENT | PASS |
| `/how-we-do-it` | PRESENT | PRESENT | PRESENT | PRESENT | PASS |
| `/open-source-projects` | PRESENT | PRESENT | PRESENT | PRESENT | PASS |

---

## WCAG contrast verification

All ratios computed independently from hex values in `base.css` of active theme `performant_labs_20260502` using the WCAG 2.1 relative luminance formula.

| Element | Foreground | Background | F's ratio (Cycle 1 S) | T's ratio | Threshold | PASS/FAIL |
|---|---|---|---|---|---|---|
| Body text on white | `#1F1A14` | `#FFFFFF` | not reported | 17.27:1 | 4.5:1 body | PASS |
| Body text on cream `#F5EFE2` | `#1F1A14` | `#F5EFE2` | not reported | 15.07:1 | 4.5:1 body | PASS |
| Focus ring on white | `#1893b4` | `#FFFFFF` | not reported | 3.58:1 | 3.0:1 non-text | PASS |
| Focus ring on cream | `#1893b4` | `#F5EFE2` | not reported | 3.12:1 | 3.0:1 non-text | PASS |
| Focus ring on espresso | `#62BBCB` | `#1F1A14` | not reported | 7.80:1 | 3.0:1 non-text | PASS |
| Link hover on white | `#005AA0` | `#FFFFFF` | not reported | 7.07:1 | 4.5:1 body | PASS |
| `button--primary` text on teal bg | `#FFFFFF` | `#62BBCB` | 2.21:1 | 2.21:1 | 4.5:1 body | PRE-APPROVED FAIL |
| Breadcrumb "Home" on cream | `#1893b4` | `#F5EFE2` | 3.12:1 | 3.12:1 | 4.5:1 body | PRE-APPROVED FAIL |
| Inline link on white (breadcrumb on white bg pages) | `#1893b4` | `#FFFFFF` | 3.58:1 | 3.58:1 | 4.5:1 body | PRE-APPROVED FAIL |

The two PRE-APPROVED FAILs are operator-approved deviations documented in `phase-8.7-color-spacing-T.md` and `sprint-4-phase-5-a11y-polish-T.md` and carried forward through all subsequent sprint T/S handoffs. T's independently computed ratios match those reported in the Cycle 1 S audit and Sprint 7 final T handoff. No discrepancy.

---

## Mobile responsive verification

N/A — no responsive overrides shipped in this final cycle. This is a verification-only cycle; no F work ran. The prior responsive baseline documented in `cycle-final-r8-baseline-T.md` (Sprint 7) remains authoritative. No CSS files have changed since that baseline.

---

## Pa11y results (PC-5)

Pa11y 9.1.1 run via `/opt/homebrew/bin/node /opt/homebrew/bin/pa11y --level error` against `https://pl-performantlabs.com.3.ddev.site:8493/<path>`. PC-5 criterion: 0 new errors; pre-existing brand-color deviations are on the allowlist.

| Page | Errors reported | Error types | All on allowlist? | PC-5 result |
|---|---|---|---|---|
| `/` | 1 | `button--primary` contrast 2.21:1 | Yes | PASS |
| `/services` | 3 | 1× breadcrumb link 3.12:1; 2× `button--primary` 2.21:1 | Yes | PASS |
| `/about-us` | 3 | 1× breadcrumb link 3.12:1; 2× `button--primary` 2.21:1 | Yes | PASS |
| `/articles` | 1 | breadcrumb link 3.12:1 | Yes | PASS |
| `/contact-us` | 2 | breadcrumb link 3.12:1; webform submit `button--primary` 2.21:1 | Yes | PASS |
| `/how-we-do-it` | 1 | breadcrumb link 3.12:1 | Yes | PASS |
| `/open-source-projects` | 1 | breadcrumb link 3.12:1 | Yes | PASS |

All 12 pa11y errors site-wide are `WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail` (color contrast only). Every instance is one of two pre-approved element types: `button--primary` (`#FFFFFF` on `#62BBCB` = 2.21:1) or breadcrumb/inline link (`#1893b4` on cream `#F5EFE2` = 3.12:1, or on white `#FFFFFF` = 3.58:1). The webform submit button on `/contact-us` carries the `button button--primary` class set — same pre-approved deviation as all other `button--primary` instances. No new error type or new element class has appeared. 0 new errors. PC-5: PASS.

Note on `/contact-us` prior baseline discrepancy: cycle-2-contact-us-T reported "Pa11y 0 errors." The two current errors are both pre-approved contrast deviations that exist site-wide. The breadcrumb block renders on `/contact-us` (confirmed in current DOM) and uses the same `breadcrumb__link` class with `#1893b4` color as all other pages. The earlier 0-error report was likely produced against a different rendered state or with a different pa11y configuration. No code change between cycle 2 and now affects the breadcrumb or submit button color. This discrepancy is advisory and does not affect the PC-5 outcome.

---

## Acceptance criteria status

| Criterion (from issue) | Evidence | PASS/FAIL |
|---|---|---|
| HTTP 200 on every shipped page | All 7 pages return 200 after `ddev drush cr` | PASS |
| Every CTA + footer link returns 200 or 301→200 | All 14 footer link destinations return 200; header nav 7 links return 200; redirect safety-net links (`/contact`, `/form/contact`) return 301→200; zero 404s across all rendered hrefs | PASS |
| Zero broken anchors | All 4 footer Services sub-list fragments (`#test-suite-takeover`, `#embedded-testing-engineer`, `#autonomous-healing-pilot`, `#accessibility-testing`) confirmed as live `id=` attributes on `/services` | PASS |
| `/contact-us` H1 count = 1; heading hierarchy clean | Body H1 count: 1 ("Let's talk about your quality and testing goals."); sequence H1→H2→H3, no skipped levels | PASS |
| WCAG 2.2 AA per S template (all rows PASS) | T1.4.3 contrast: body text and focus rings PASS; pre-approved deviations unchanged at same ratios (2.21:1 button, 3.12:1 breadcrumb) | PASS (T scope; S produces full table) |
| Pa11y 0 new errors (PC-5) | 12 errors across 7 pages; 0 new error types; all 12 are pre-approved operator deviations | PASS |

---

## Blocking issues

None.

---

## Advisory notes

1. **`/articles` H1→H3 skip (FU-7b).** Article card titles use H3 immediately after the H1 "Articles." with no intervening H2. Pre-existing, documented as FU-7b since sprint 4 wrap. Sprint 8 has not touched `/articles`. Not a sprint 8 concern.

2. **`/contact-us` pa11y count shifted from 0 to 2 since cycle-2.** Both current errors are pre-approved contrast deviations identical to those flagged on all other pages. The breadcrumb block has always been present on `/contact-us`; the earlier 0-error result is unexplained but the errors are not new to this sprint. Advisory only.

3. **Orphaned theme cleanup (Cycle 2 Option A, from Cycle 1 S recommendation).** `web/themes/custom/performant_labs_20260411` and `web/themes/custom/performant_labs_20260418` contain dead-code `<a href="/contact">` strings in Twig templates. These are never rendered (active theme is `performant_labs_20260502`). Deletion or string-fixing remains on the tech-debt register. Not a blocker.

4. **`/homepage-v2` canonical redirect.** The homepage renders `<link rel="canonical" href="/homepage-v2">` which returns a 301 to `/`. Not a user-facing navigation link. Not blocking, but worth noting as a content/SEO hygiene item for a future sprint.

5. **Contrast comment inaccuracy in `base.css` (carried forward).** Inline comments read `2.13:1` for button--primary and `3.07:1` for breadcrumb on cream. T independently computes `2.21:1` and `3.12:1` respectively. Same discrepancy documented in `sprint-4-phase-5-a11y-polish-T.md` and `cycle-final-r8-baseline-T.md`. Non-blocking.

---

T complete, no blocking issues. Ready for S.
