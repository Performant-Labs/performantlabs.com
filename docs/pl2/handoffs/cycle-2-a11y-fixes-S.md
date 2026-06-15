# Handoff-S: Sprint 9 — Cycle 2 — pa11y allowlist + articles heading hierarchy (FU-3 + FU-7b)

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-9-cycle-2-fixes`
**Issue:** `docs/pl2/handoffs/cycle-2-a11y-fixes-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/cycle-2-a11y-fixes-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2-a11y-fixes-F.md`
**Cycle 1 audit reviewed:** `docs/pl2/handoffs/cycle-1-a11y-debt-audit-S.md`
**Mode:** autonomous
**Operator-facing report:** [`cycle-2-a11y-fixes-report.html`](cycle-2-a11y-fixes-report.html)

## T precondition

Confirmed: T reported zero blocking issues. All T1 + T2 checks PASS. Independently re-verified by S below.

## Audit scope note

This is an a11y debt cycle, not a visual-fidelity overhaul. Per O's spawn brief, the binding signals are (1) `pa11y-ci` 0 errors across 7 URLs and (2) `/articles` heading sequence H1 → H2 → H3 (no skip). Visual diff at the brief breakpoints is not applicable — no visible CSS surface was added or moved; the new `<h2>` is rendered off-screen at 1×1 px via Drupal core `.visually-hidden`. A light visual sanity capture at 1280 on `/articles`, `/`, and `/services` was performed to confirm zero visible regression.

## Independent verification

### pa11y-ci re-run (S-executed)

```
npx --yes pa11y-ci --config .pa11yci.json

Running Pa11y on 7 URLs:
 > https://pl-performantlabs.com.3.ddev.site:8493/ - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/services - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/about-us - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/articles - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/contact-us - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/how-we-do-it - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/open-source-projects - 0 errors

✔ 7/7 URLs passed
```

Matches F and T. PASS.

### /articles live DOM heading sequence (Playwright, 1280×800)

```
H2 [visually-hidden] :: Main navigation     (nav-block helper, pre-existing)
H2 [visually-hidden] :: Breadcrumb          (system, pre-existing)
H1                   :: Articles.
H2 [visually-hidden] :: Articles            (FU-7b insertion — NEW)
H3                   :: CTRFHub: building a CTRF-native...
H3                   :: Version 1.0 of Automated Testing Kit Is Ready!
H3                   :: Introducing Automated Testing Kit
H3                   :: Cypress on Drupal Cheat Sheet
H3                   :: BADCamp 2020-Components Can Break Your Site...
H3                   :: Our talk at DrupalCon...
H2 [visually-hidden] :: Footer              (system, pre-existing)
H3                   :: Services
H3                   :: Resources
H3                   :: Company
```

H1 → H2[vh] → H3 in the main content region. No skip. PASS.

### Visually-hidden confirmation (computed-style probe via Playwright)

For the new `<h2 class="visually-hidden">Articles</h2>` on `/articles`:

| Property | Value |
|---|---|
| `position` | `absolute` |
| `clip` | `rect(1px, 1px, 1px, 1px)` |
| `width` | `1px` |
| `height` | `1px` |
| `getBoundingClientRect` | x=50.59, y=826.86, w=1, h=1 |

Matches Drupal core `.visually-hidden` recipe. Zero visible surface, zero layout shift. PASS.

### Cross-page heading sanity (Playwright, 1280×800)

`/` (home): single H1, multiple section H2s, H3s nested correctly. No regression. PASS.
`/services`: single H1, section H2s, H3 service cards nested correctly. No regression. PASS.

(T also independently re-verified all 6 non-articles pages by curl + regex; per-page H1 + H2-before-H3 confirmed.)

## Tier 3 visual sanity (light, 1280 only)

| Viewport | Page | Screenshot | Visible regression? |
|---|---|---|---|
| 1280×800 | `/articles` | `docs/pl2/handoffs/screenshots/sprint-9-cycle-2/t3-articles-1280-live-20260512.png` | No |
| 1280×800 | `/` | `docs/pl2/handoffs/screenshots/sprint-9-cycle-2/t3-home-1280-live-20260512.png` | No |
| 1280×800 | `/services` | `docs/pl2/handoffs/screenshots/sprint-9-cycle-2/t3-services-1280-live-20260512.png` | No |

The string "Articles" appears once visibly on `/articles` — in the H1. The injected H2[vh] does not render as visible text anywhere (confirmed visually in the screenshot and by the 1×1 px clipped rect above).

No pixel-diff vs. preview was generated. Rationale: no design-brief preview exists for `/articles` listings (the page predates Sprint 4 brief work), and the change introduces zero new visible surface. The Tier 3 protocol's pixel-diff mandate exists for visual-fidelity cycles where a preview is the source of truth; this cycle's binding source of truth is pa11y-ci + heading sequence, both verified above.

## Acceptance criteria

| Criterion | Result | Evidence |
|---|---|---|
| `.pa11yci.json` at repo root with allowlist for `.button--primary` family + `.breadcrumb__link` | PASS | T verified file content; S re-ran pa11y-ci against it |
| `pa11y-ci` runs and produces 0 errors | PASS | S-executed: 7/7 URLs, 0 errors |
| `/articles` DOM contains an `<h2>` between H1 and article-card `<h3>`s, visually-hidden | PASS | Playwright DOM probe + computed-style confirmation |
| Heading hierarchy clean on `/articles`: H1 → H2 → H3, no skip | PASS | Live DOM sequence above |
| No `!important` added | PASS | T grep on both changed files: 0 matches |
| T1 + T2 PASS on `/articles` + cross-page spot-check | PASS | T handoff |
| No regression on other pages consuming `article-card` SDC | PASS | T 6-page heading check + S Playwright cross-check |

## WCAG 2.2 AA audit (combined table)

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | PASS (carried) | No interactive elements added; existing focus order untouched. Carried from Sprint 8 S audit. |
| Focus ring visibility | PASS (carried) | No CSS touched. Theme-wide `:focus-visible` pattern intact. |
| Forced-colors mode | PASS (carried) | No new surfaces. `.visually-hidden` content is off-screen and unaffected by forced-colors. |
| Reduced-motion | PASS (carried) | No transitions added. |
| 200% zoom | PASS | Re-checked `/articles` at 200% zoom via Playwright capture; H1, cards, pagination remain in flow. No new horizontal scroll. |
| Heading hierarchy `/articles` | PASS | H1 → H2[vh] → H3, no skip |
| Heading hierarchy 6 other pages | PASS | T verified by curl; S re-verified `/` and `/services` via Playwright |
| Image alt text | PASS (carried) | No images touched. Cycle-1 audit confirmed all `<img>` have descriptive alt. |
| Mobile touch targets | N/A | No interactive elements added. |
| Mobile typography scale | N/A | No type changes. |
| Mobile layout | N/A | No layout changes. |
| pa11y-ci 7-URL sweep | PASS | 0/7 errors with allowlist applied |
| `!important` introduction | PASS | 0 matches in both changed files |

## Static preview comparison

N/A — `/articles` has no static preview in `docs/pl2/Previews/`. The article-card SDC is rendered by Drupal views; preview comparison is not part of this cycle's surface area.

## Verdict

**PASS** — all acceptance criteria met. `pa11y-ci` reports 0 errors across all 7 URLs with allowlist applied (independently re-run by S). `/articles` heading hierarchy now reads H1 → H2[vh] → H3 with the injected H2 properly off-screen (`position:absolute; clip: rect(1px,1px,1px,1px)`). No visible regression on `/articles`, `/`, or `/services`. No `!important` added. F's two autonomous deviations (`hideElements` over rule-ID `ignore`; promoting the `{% if title %}` branch from `<h3>` to `<h2>`) are both more-conservative interpretations and align with the Cycle 1 audit recommendations.

Ready for O to commit with the runbook-prescribed message:
`feat(a11y): cycle 2 — pa11y allowlist + articles heading hierarchy (FU-3 + FU-7b)`

## Advisory notes (non-blocking)

1. **`teal-deep` token candidate carried from Cycle 1** — still surfaced for a future sprint; not Sprint 9 scope.
2. **`wait: 500` + `--ignore-certificate-errors` in `.pa11yci.json`** — F's autonomous decision 3. These are environment-coupled to ddev (self-signed cert; JS-render settling). If CI ever runs pa11y-ci against a real cert, `--ignore-certificate-errors` should be made conditional. Not blocking.
3. **PC-5 wording retirement** — the sprint-wrap pa11y line should move from "0 *new* errors" to "0 errors with allowlist applied" per Cycle 1 audit. To be reflected in the sprint-wrap doc by O.
