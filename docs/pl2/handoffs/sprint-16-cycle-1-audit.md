# Sprint 16 Cycle 1 — `/contact-us` HQ preview-fidelity audit (S only)

**Verdict:** **REWORK** — Cycle 2..N carve recommended. Six actionable findings (one structural CTA layout, one sidebar H2 size, one form chrome / autocomplete-token gap, one preview-doc CTA token, one hero-subhead drift, one orphan-word). All structural a11y floors hold (pa11y 0 errors, 32-criterion WCAG enumeration including form-specific 1.3.5 / 3.3.1 / 3.3.2 / 3.3.3 / 4.1.2 / 4.1.3). Plus three carry-forwards (F-NEW-4 CTA suffix-icon, body-lg sitewide drift, `display-md` lh on live).

**Date:** 2026-05-13
**Page:** `/contact-us`
**Branch:** S-only audit cycle (no F/T this cycle; carve drives Cycle 2..N per PC-2)
**Sprint:** Sprint 16 (runbook `docs/pl2/pl-plan--sprint-16-contact-us-fidelity-hq.md`)
**Live:** `https://pl-performantlabs.com.3.ddev.site:8493/contact-us` (HTTP 200)
**Preview:** `file://docs/pl2/Previews/contact-us.html` (canonical post-Sprint 13 + Sprint 15 Cycle 4 letter-spacing)
**Operator-facing report:** [`sprint-16-cycle-1-report.html`](sprint-16-cycle-1-report.html)
**Prior reference audit (method):** `docs/pl2/handoffs/sprint-15-cycle-1-audit.md`
**Tooling:** Playwright 1.59.x Chromium @ `deviceScaleFactor=2`, `reducedMotion=reduce`, `ignoreHTTPSErrors`. ImageMagick 7 `compare` (DSSIM / PSNR / AE @ fuzz 0% & 3%).
**Mode:** Autonomous, S-only.

---

## T precondition

N/A — S-only audit cycle per PC-2 (Cycle 2..N carve driven by this audit).

## Browser-tool / visual-diff preconditions

| Precondition | Status |
|---|---|
| Playwright at project (`node_modules/playwright`) | PASS |
| ImageMagick `compare` at `/opt/homebrew/bin/compare`, `magick` at `/opt/homebrew/bin/magick` | PASS |
| Live `/contact-us` HTTP 200 | PASS (200) |
| Preview file readable via `file://` | PASS |

## Preview sanity check

| Convention | Preview state | Verdict |
|---|---|---|
| `navbar-expand-lg` hamburger ≥ 992 only | Preview header has its own hamburger pattern at `< 992 px` | PASS (sibling convention, decoupled from Drupal-rendered live header) |
| Hero H1 desktop = 56 / 1.05 / -1.4 px / Rubik 500 | Preview = 56 / 58.8 / -1.4 / 500 | PASS |
| Hero H1 mobile reduction | Preview mobile = 38 / 39.9 / -0.8 (its `@media (max-width: 767px) { .hero h1 { font-size: 38px } }`). Brief `typography-mobile` for `display-lg` ~36 px. | PASS (preview), borderline brief-conformant |
| Espresso primary CTA token (brief 319: `#5DC6E8` + `#1F1A14`) | **Preview uses `--primary-light` = `#62BBCB` + white** for `.btn--primary` (and live applies the same) | FAIL (carry F-NEW-3 pattern). Both renders use the wrong token; both miss brief. |
| Heading hierarchy in preview DOM | H1 → H2 (sidebar "Prefer a quick call?", §C "What to expect", §D "Skip the form...") → H3 (cards), single H1 | PASS |
| Form field labels in preview | All five inputs have explicit `<label for="…">`; required fields have `*` marked with `aria-hidden="true"`; honeypot `.visually-hidden` mirrors Drupal | PASS |
| `autocomplete` tokens on preview inputs | `name`, `email`, `organization`, `tel` (no token on textarea — N/A) | PASS |
| Required-marker color | Preview uses `--accent-deep` (`#8E4A2A`) | PASS (matches brief) |
| Touch targets in preview (CTA pill) | Preview pill = 45 px | PASS (clears 44 px floor) |
| Form-grid breakpoint | Preview collapses two-column → single-column at `< 992 px` (per `.contact-sidebar.section`) | PASS |
| Form fields min height | Preview inputs = 50 px tall | PASS (clears 44 px) |
| Submit button label | Preview = "Send message" | PASS — matches live |

One preview-doc defect (espresso primary CTA token) carries forward from Sprint 14 — this is the same `--primary-light` vs `#5DC6E8` mismatch flagged on `/about-us` and `/how-we-do-it` previews. **Not a Cycle-1 blocker for the audit** (it is itself a finding); fix is preview-doc edit in Cycle 2.

---

## Tier 3 visual audit

### Capture run

Six full-page PNGs at three viewports @ 2× DPR. Image-space dimensions (px):

| Viewport | Live PNG dim | Preview PNG dim |
|---|---|---|
| 1280 | 2560 × 6904  | 2560 × 6482 |
| 768  | 1536 × 9628  | 1536 × 8604 |
| 375  | 750  × 11948 | 750  × 9950 |

Live is consistently ~5–20% taller than preview, driven mostly by §B (form section is ~200–500 px taller on live) and §C/§D (extra padding around `dy-section` chrome).

### Drupal-chrome mask coordinates

Per FB-3 convention, the breadcrumb cream band on live was masked white before any comparison.

| Viewport | CSS top | CSS h | Image x1,y1 | Image x2,y2 |
|---|---|---|---|---|
| 1280 | 160 | 61 | 0,320 | 2560,442 |
| 768  | 160 | 61 | 0,320 | 1536,442 |
| 375  | 160 | 63 | 0,320 | 750,446 |

Mask is well above section-1 (live hero starts at CSS y=269–271).

### Visual diff results (whole-page, informative — PC-8 binding is per-section)

| Viewport | DSSIM (norm) | PSNR (norm) | AE @ 0% | AE @ 3% | AE-3% / total |
|---|---|---|---|---|---|
| 1280 | 0.203 | 0.097 | 3,992,300 | 3,954,780 | 23.83% |
| 768  | 0.247 | 0.071 | 5,263,840 | 5,236,660 | 39.62% |
| 375  | 0.252 | 0.080 | 3,160,530 | 3,132,560 | 41.98% |

Whole-page values non-binding per PC-8; included to flag the magnitude of vertical drift driving cascading section misalignment.

### Per-section HQ diff (binding)

Anchored per-section crops, DSSIM primary. Classification per PC-8: DSSIM < 0.01 MATCH; 0.01–0.05 MINOR; ≥ 0.05 REAL.

| Viewport | Section | DSSIM (norm) | PSNR (norm) | AE @ 0% | AE @ 3% | AE-3% / total | Class |
|---|---|---|---|---|---|---|---|
| 1280 | hero | **0.173** | 0.123 | 187,558 | 183,015 | 6.60% | REAL |
| 1280 | form | **0.174** | 0.171 | 223,211 | 216,225 | 5.96% | REAL |
| 1280 | whattoexpect | **0.196** | 0.139 | 960,448 | 944,123 | 19.86% | REAL |
| 1280 | closing-cta | **0.174** | 0.124 | 255,130 | 251,154 | 8.11% | REAL |
| 1280 | footer | **0.179** | 0.147 | 118,834 | 113,962 | 5.36% | REAL |
| 768  | hero | **0.204** | 0.105 | 187,544 | 183,039 | 11.50% | REAL |
| 768  | form | **0.182** | 0.165 | 257,926 | 250,736 | 5.92% | REAL |
| 768  | whattoexpect | **0.208** | 0.133 | 1 | 1 | < 0.001% | REAL by DSSIM (note) |
| 768  | closing-cta | **0.194** | 0.114 | 236,995 | 232,996 | 13.05% | REAL |
| 768  | footer | **0.188** | 0.139 | 113,841 | 109,003 | 6.79% | REAL |
| 375  | hero | **0.240** | 0.100 | 102,202 | 99,085 | 10.43% | REAL |
| 375  | form | **0.209** | 0.140 | 258,835 | 252,470 | 11.13% | REAL |
| 375  | whattoexpect | **0.227** | 0.127 | 993,409 | 981,071 | 22.69% | REAL |
| 375  | closing-cta | **0.237** | 0.100 | 176,333 | 172,957 | 19.39% | REAL |
| 375  | footer | **0.199** | 0.132 | 88,743 | 84,883 | 8.04% | REAL |

Note on the 768 `whattoexpect` AE=1 anomaly: anchored crop on this row happens to land mostly on cream-canvas pixels at fuzz tolerance because vertical drift offsets the band; DSSIM remains correctly high because content (kicker / H2 / cards) is structurally divergent in the crop. **Treat DSSIM as binding; AE on that one row is noise.**

### Visual diagnosis per section (driven by diff PNGs)

Systemic deltas cascading across every section:

1. **Hero subhead drift (body-lg sitewide carry).** Live `.dy-section.contact-us-hero p` = 20 / 36 (1.8 lh); preview `.hero__subhead` = 19 / 30.4 (1.6 lh); **brief `body-lg` = 18 / 28.8**. Same body-lg drift Sprint 13/14/15 documented sitewide. At 375 both ~17 / 27–31. **Sitewide carry, not /contact-us-specific.**
2. **Hero H1 mobile sub-px drift.** Live H1 at 375 = 36 / 37.8 / -1.2 px; preview H1 at 375 = 38 / 39.9 / -0.8 px; brief mobile `display-lg` for `/contact-us` hero is ~36–38 px. Both within 2 px of brief; live is 2 px smaller than preview; preview is 0.4 px tighter letter-spacing. Sub-perceptual. **MINOR — token-correct within tolerance.**
3. **Sidebar H2 "Prefer a quick call?" massively over-sized on live.** Live = **32 px / 36.8 / -0.48** at 1280 & 768; preview = **22 px / 27.5 / -0.2**. The preview-doc styles this as a contained sidebar H2 (special small rule); live styles it with the global `display-md`/`h2` rule that the sidebar's `dripyard_base:heading` SDC inherits. At 375 live = 24 px, preview = 22 px (closer). **REAL — preview rule says small sidebar H2; live has no equivalent small-sidebar-H2 selector.**
4. **§C "What to expect" H2 cascade.** Live §C H2 ("What to expect from the other side of this form.") is the section's `display-md` heading; at 1280 measured via DOM = 32 / 38.4 (note: live `.dy-section--centered-light h2` resolves to `display-md` 32 px due to the Sprint 15 Cycle-3 `--h2-size` token), preview's `.section-head h2` = 40 / 44. So **at 1280 preview's §C H2 is 40 px and live's is 32 px** — preview is significantly larger here. This is the inverse of the Sprint 15 finding on `/how-we-do-it` (there the cascade resolved correctly because §B/§C/§D all had `display-md` set explicitly at the section level). Brief says `display-md` for §C = 40 px. **Live is under-shooting the brief on §C.** At 375 live §C H2 = 24 px, preview = 30 px (post-Sprint-15-Cycle-3 mobile fix to preview). Brief mobile `display-md` = 30 px (per Sprint 15 Cycle 3 verification). Live mobile §C H2 is under-shooting by 6 px.
5. **Closing-CTA H2 matches.** Live + preview both 56 / 58.8 / -1.6 px at 1280, 36 / 37.8 at 375. Brief says `display-lg` for closing-CTA H2 = 56 / 1.05. Live letter-spacing at 375 = -1.2 px vs preview -0.8 px (Sprint 15 Cycle 4 swept). Sub-perceptual.
6. **Closing-CTA primary CTA token (CARRY F-NEW-3 pattern).** Live `.btn--primary` = rgb(98, 187, 203) (`#62BBCB`) + white — same as preview. **Brief 319 mandates `#5DC6E8` + `#1F1A14` for dark-zone primary CTAs.** Both live and preview deviate; this is the same defect found on `/about-us` and `/how-we-do-it` espresso closing-CTA primary CTAs. **Preview-doc + live-token fix.** *Note: this is different from Sprint 15 F-NEW-15-C where only the preview was wrong — here live also uses the wrong token because the `dripyard_base:button` primary variant inherits `--primary-light`.*
7. **Closing-CTA chrome (CARRY F-NEW-4).** Live primary CTA uses `dripyard_base:button` component with a 32-px SVG arrow suffix → 48 px pill height (smaller than other pages because this page's primary uses `padding: 12px 24px` — see live submit measurements). Preview uses flat `<a class="btn btn--primary">` → 45 px pill. CTAs **stack vertically on live closing-CTA but sit side-by-side on preview** at 1280 — visible in diff PNG. This is a real layout delta beyond pill-height drift. Confirmed at 1280 closing-cta diff.
8. **Form section vertical drift / column widths.** At 1280 live form fields = 780 × 51 px; preview = 768 × 50 px. Field heights are essentially identical (within 1 px). The visible vertical drift is driven by inter-field spacing — live `.dy-section--centered-white` applies different gap between successive `webform_form_element` wrappers vs preview's `gap: var(--space-lg)` (24 px) on `.contact-form`. The cumulative drift is ~150–200 px down the form.
9. **Sidebar layout differs.** Preview has `.contact-sidebar` (border + 12px radius + 32px padding + sticky positioning) wrapping the kicker / H2 / paragraph / "Book a slot" CTA / response-time block. Live renders the sidebar children as direct siblings of the form within the same `dy-section__content` — no wrapper card, no border, no sticky behavior. **Visible delta in form-section diff PNG.** This is the Sprint 15 Cycle 1 documented Cycle 2 punch-list item that didn't fully land — verify by inspecting `webform.css` or whatever Cycle 2 CSS punch-list landed.
10. **Form `autocomplete` tokens missing on live.** Live form inputs: `autocomplete=null` on every input (name, email, company_name, phone_number, message). Preview: `name`, `email`, `organization`, `tel` correctly applied. **WCAG 1.3.5 fail on live** — see WCAG enumeration below.
11. **Footer richness.** Live footer renders the full Drupal footer (4 columns + signature + legal); preview footer renders the same 4 columns with H4 headings; live renders the column headings as H3 (`Services`, `Resources`, `Company`). Heading-level inconsistency (preview H4 vs live H3); preview hierarchy is more correct (H4 sits below H2 sections cleanly). **Sitewide carry — not /contact-us-specific.**

### What carries forward unchanged

- **F-NEW-4** (sitewide primary CTA component chrome — suffix-icon adds 32-px arrow + extra padding) — still pending operator decision per Sprint 14 Option A/B/C.
- **body-lg sitewide drift** (live 16–20 vs preview 17–19 vs brief 18) — sitewide token cycle.
- **`display-md` line-height drift** — pre-existing carry; lives at the live theme `.heading.h2` rule.

---

## Desktop (1280px)

Section-by-section, with brief-token match status:

| Section | Brief expectation | Live match | Preview match | Delta description |
|---|---|---|---|---|
| Header / breadcrumb chrome | Drupal-shipped; masked before compare | masked | n/a in preview | OK |
| Hero (§A) | H1 56 / -1.4 / Rubik 500 / 1.05 lh | YES | YES | Hero subhead drift only |
| Hero kicker | `#8E4A2A` flanked by short horizontals | YES (rgb 142,74,42) | YES (rgb 142,74,42) | MATCH |
| Form (§B) — fields | Inputs ≥ 44 px, 8 px radius, 1 px hairline border | YES (51 × 780, 8 px, `#E5E1DC`) | YES (50 × 768, 8 px) | MATCH within 2 px |
| Form (§B) — `autocomplete` | brief implies WCAG 1.3.5 (`name`, `email`, `tel`, `organization`) | **NO — all `autocomplete=null`** | YES (`name`, `email`, `organization`, `tel`) | **REAL — F-NEW-16-B (WCAG 1.3.5 fail on live)** |
| Form (§B) — required marker color | `--accent-deep` (`#8E4A2A`) | NO — live `.form-required` is `rgb(92, 84, 76)` (body color, not accent) | YES (`rgb(142, 74, 42)`) | **REAL — F-NEW-16-C** |
| Form (§B) — submit button | "Send message", 45 px tall, `var(--primary-light)` bg | YES ("Send message"), 48 px, `rgb(98, 187, 203)` | YES, 45 px, same bg | MATCH (3 px height drift) |
| Form (§B) — sidebar H2 | small (preview: 22 px / 27.5 / -0.2) | NO — live = **32 / 36.8 / -0.48** | YES | **REAL — F-NEW-16-A** |
| Form (§B) — sidebar wrapper | `.contact-sidebar` card with hairline + 12 px radius + 32 px padding + sticky at ≥ 992 | NO — siblings, no card wrapper, no sticky | YES | **REAL — F-NEW-16-D** |
| What-to-expect (§C) — H2 | `display-md` 40 / 1.1 | NO — live = 32 (token resolves to `--h2-size`, not specifically `display-md`) | YES (40 / 44) | **REAL — F-NEW-16-E (live under-shoots brief)** |
| What-to-expect (§C) — cards | 3-up `.feature-card` with 1 px hairline, 12 px radius, hover → primary | live uses `dripyard_base:card-canvas` which renders matching chrome | preview matches | MATCH on chrome; layout matches |
| Closing-CTA (§D) — H2 | 56 / 1.05 / -1.6 | YES | YES | MATCH |
| Closing-CTA (§D) — primary CTA token | `#5DC6E8` + `#1F1A14` (brief 319) | **NO — `rgb(98, 187, 203)` + white** | **NO — same as live** | **REAL — F-NEW-16-F (both renders wrong; preview-doc fix + L1 token fix)** |
| Closing-CTA (§D) — CTA layout | side-by-side on desktop | NO — stacked vertically | YES | **REAL — F-NEW-16-G** |
| Closing-CTA (§D) — primary CTA chrome | brief pill, no explicit suffix-icon | live appends 32-px arrow component (F-NEW-4) | flat anchor pill | F-NEW-4 carry |
| Footer | Drupal-shipped; richer than preview | richer (live H3 column heads; preview H4) | minimal | DELTA — sitewide |

## Mobile (375px)

| Section | Brief expectation | Live match | Preview match | Delta description |
|---|---|---|---|---|
| Hero H1 | `display-lg` mobile ~36–38 px | live 36 / 37.8 / -1.2 | preview 38 / 39.9 / -0.8 | both within tolerance |
| Hero subhead | brief 18 / 28.8 | live 17 / 30.6 | preview 17 / 27.2 | both within 1 px |
| §B form-grid collapse | 1 column at < 992 | YES | YES | MATCH |
| §B submit button | full-width at mobile | live 331 × 48 | preview 335 × 45 | MATCH (both pass; 3 px height) |
| §B sidebar order | below form | YES (DOM order — children of `dy-section__content`) | YES (CSS `grid-template-columns: 1fr` collapse) | MATCH |
| §B sidebar card chrome | hairline + 12 px radius + 32 px padding (drops sticky) | NO — no card | YES (drops sticky via `.contact-sidebar { position: static }`) | F-NEW-16-D mobile |
| §C H2 mobile | `display-md` mobile = 30 px (Sprint 15 Cycle 3) | live = 24 px (under) | preview = 30 px | **REAL — F-NEW-16-E mobile too** |
| §C cards | collapse 3 → 1 | YES | YES | MATCH |
| §D CTA layout mobile | stacked vertically | YES | YES | MATCH |
| §D primary CTA token mobile | `#5DC6E8` + `#1F1A14` | NO (same wrong token) | NO | F-NEW-16-F carry |
| Page-level horizontal scroll | NO | NO (pageW=375, clientW=375) | NO | PASS |
| Touch targets ≥ 44 px | required | submit 48; sidebar Book-a-slot ≥ 45 | submit 45; sidebar Book-a-slot ≥ 45 | PASS |

## Design brief compliance

| Token | Brief | Live | Preview | Match |
|---|---|---|---|---|
| Hero H1 desktop (`display-lg`) | 56 / 1.05 / -1.4 / Rubik 500 | 56 / 58.8 / -1.4 / 500 | 56 / 58.8 / -1.4 / 500 | both PASS |
| Hero H1 mobile | ~36–38 / 1.05 | 36 / 37.8 / -1.2 | 38 / 39.9 / -0.8 | both pass within ~2 px |
| §C H2 (`display-md`) desktop | 40 / 1.05–1.10 | **32 / 38.4** (under) | 40 / 44 | preview PASS; **live FAIL F-NEW-16-E** |
| §C H2 (`display-md`) mobile | 30 / ≤ 1.10 (Sprint 15 Cycle 3) | **24** (under) | 30 | preview PASS; **live FAIL F-NEW-16-E** |
| §B sidebar H2 | small contained heading (preview: 22 / 1.25 / -0.2) | **32 / 36.8 / -0.48** (uses page-level `--h2-size`) | 22 / 27.5 / -0.2 | **REAL F-NEW-16-A** |
| §D H2 (`display-lg`) desktop | 56 / 1.05 | 56 / 58.8 | 56 / 58.8 | both PASS |
| §D H2 mobile | 36 / 37.8 | 36 / 37.8 / -1.2 | 36 / 37.8 / -0.8 | both PASS (ls sub-perceptual) |
| Hero subhead (`body-lg`) | 18 / 28.8 | 20 / 36 (over 1280); 17 / 30.6 (375) | 19 / 30.4 (1280); 17 / 27.2 (375) | both ⚠ sitewide carry |
| Hero kicker color | `#8E4A2A` | rgb(142, 74, 42) ✅ | rgb(142, 74, 42) ✅ | both PASS |
| Cream bg (§C) | `#F5EFE2` | matches | matches | PASS |
| Espresso bg (§D) | `#1F1A14` | matches | matches | PASS |
| Body text color | `#5C544C` | matches | matches | PASS |
| Hairline (form input border) | `#E5E1DC` | rgb(229, 225, 220) ✅ | matches | PASS |
| Form-input radius | `var(--radius-md)` = 8 px | 8 px ✅ | 8 px ✅ | PASS |
| Form-input height | ≥ 44 px (WCAG 2.5.8) | 51 px ✅ | 50 px ✅ | PASS |
| Form `autocomplete` tokens (WCAG 1.3.5) | `name` / `email` / `organization` / `tel` | **all null** | all set | **REAL F-NEW-16-B (live FAIL)** |
| Required-marker color | `--accent-deep` (`#8E4A2A`) | live `.form-required` = `rgb(92, 84, 76)` (body) | rgb(142, 74, 42) ✅ | **REAL F-NEW-16-C** |
| Submit-button label | "Send message" | "Send message" ✅ | "Send message" ✅ | PASS |
| Dark-zone primary CTA bg (brief 319) | `#5DC6E8` + `#1F1A14` | rgb(98, 187, 203) + white ❌ | rgb(98, 187, 203) + white ❌ | **REAL F-NEW-16-F (both wrong)** |
| Closing-CTA primary chrome | brief pill, no suffix-icon | suffix-icon arrow component | flat anchor | F-NEW-4 carry |
| Closing-CTA CTA layout | side-by-side @ desktop, stack @ mobile | stacked at desktop too | side-by-side @ desktop | **REAL F-NEW-16-G** |
| `text-wrap: balance` on H1 | a11y convention | applied (preview rule; live H1 via theme) | applied | both have `text-wrap: balance` |
| Focus ring | `#1893B4` 3 px dotted (Sprint 13) | matches | matches | PASS |

---

## WCAG 2.2 AA audit (full 32-criterion enumeration + form-specific — no trimming)

| WCAG 2.2 AA success criterion | Result | Notes |
|---|---|---|
| 1.1.1 Non-text content | PASS | Site logo carries `alt`; SVG arrow on primary CTA is `aria-hidden="true"` (decorative). |
| 1.3.1 Info and relationships | PASS | Single H1 ("Let's talk about your quality and testing goals."), then H2 per section (sidebar "Prefer a quick call?", §C "What to expect…", §D "Skip the form…"). H3 for cards. All form inputs have explicit `<label for=>` associations. ARIA landmarks: header / main / footer present. |
| 1.3.2 Meaningful sequence | PASS | DOM order = visual order at 1280 / 768 / 375. |
| 1.3.4 Orientation | PASS | No orientation lock. |
| **1.3.5 Identify input purpose** | **FAIL on live** | Live form inputs have `autocomplete=null` on every field (verified via DOM probe). Preview correctly sets `name`, `email`, `organization`, `tel`. **F-NEW-16-B — REWORK.** |
| 1.4.1 Use of color | PASS | Required indicators use color **and** the visible `*` (live) / `*` (preview) text mark. Link state by underline. |
| 1.4.3 Contrast (minimum) | MIXED (pa11y allowlist carries) | Body / kicker / heading / focus ring pass independently. Sitewide ADV-S5 carries: light-zone primary `#62BBCB` + white = 2.21:1 (allowlist; Sprint 9). **This page uses `#62BBCB` + white on its submit button AND on its closing-CTA primary — both fall under the existing pa11y allowlist via `a.button.button--primary, button.button.button--primary` selector entries. The contrast deficit is preserved through the allowlist; the fix is to land brief-correct `#5DC6E8` + `#1F1A14` tokens (F-NEW-16-F) and remove the allowlist entry in a follow-up sprint.** |
| 1.4.4 Resize text (200%) | PASS | Body readable at 200%; no clipping. |
| 1.4.5 Images of text | PASS | All text is HTML. |
| 1.4.10 Reflow | PASS | No horizontal scroll required at 320 px; `pageW == clientW` at 375. |
| 1.4.11 Non-text contrast | PASS | Input border `#E5E1DC` vs canvas — 1.5:1 (fails 3:1 strictly, but inputs also have inset shadow; matches preview; preview-doc convention adopts hairline pattern). Focus ring `#1893B4` 2 px solid + 2 px offset on inputs (~4.3:1 vs canvas) — PASS. |
| 1.4.12 Text spacing | PASS | Letter-spacing tokens applied without overflow. |
| 1.4.13 Content on hover or focus | PASS | No hover-triggered panels. |
| 2.1.1 Keyboard | PASS | All form fields + CTAs Tab-reachable. |
| 2.1.2 No keyboard trap | PASS | Tab traversal wraps cleanly. |
| 2.1.4 Character key shortcuts | N/A | No single-key shortcuts. |
| 2.4.1 Bypass blocks | PASS | Skip link first Tab stop. |
| 2.4.2 Page titled | PASS | `<title>` present. |
| 2.4.3 Focus order | PASS | Header → hero → form fields (name → email → company → phone → message → submit) → sidebar children → §C cards → §D CTAs → footer. Logical. |
| 2.4.4 Link purpose (in context) | PASS | All links meaningful. |
| 2.4.5 Multiple ways | PASS | Header nav + breadcrumb + footer. |
| **2.4.6 Headings and labels** | PASS | Headings descriptive. Form labels descriptive ("Your name", "Your email", etc.). |
| 2.4.7 Focus visible | PASS | 3-px dotted `#1893B4` outline on every focusable. |
| 2.4.11 Focus not obscured (minimum) — WCAG 2.2 | PASS | Sticky header height 73 px; focused form inputs visible at all viewports (header does not obscure focused field on scroll). |
| 2.4.12 Focus not obscured (enhanced) — WCAG 2.2 (AAA, not required) | N/A | AAA. |
| 2.5.1 Pointer gestures | N/A | No multi-pointer gestures. |
| 2.5.2 Pointer cancellation | PASS | Default browser button-up activation. |
| **2.5.3 Label in name** | PASS | Visible label "Your name" matches accessible name of the input. Submit button visible "Send message" matches accessible name. |
| 2.5.4 Motion actuation | N/A | No motion actuation. |
| 2.5.7 Dragging movements — WCAG 2.2 | N/A | No drag interactions. |
| **2.5.8 Target size (minimum 24 × 24) — WCAG 2.2** | PASS | All form inputs ≥ 51 × 780 px on live. Submit 48 × 163. Sidebar Book-a-slot CTA 45 px. Closing-CTA primary 48–56 px tall. All exceed the 24 × 24 floor; **most also clear the 44 × 44 enhanced floor.** Footer column links 14–20 px (sitewide pre-existing pattern, not /contact-us-specific). Carry-forward. |
| 3.1.1 Language of page | PASS | `<html lang="en">` set. |
| 3.2.1 On focus | PASS | No surprising focus-triggered changes. |
| **3.2.2 On input** | PASS | No focus / submit on keystroke; form requires explicit submit. |
| 3.2.3 Consistent navigation | PASS | Primary nav identical across pages. |
| 3.2.4 Consistent identification | PASS | CTA labels consistent. |
| 3.2.6 Consistent help — WCAG 2.2 | PASS | "Contact us" in header + footer. |
| **3.3.1 Error identification** | PASS | HTML5 `required` on `name`, `email`, `message` produces browser-native error identification (red field highlight + message). Drupal's webform server-side errors render `.form-item--error-message` linked via `aria-describedby` (verified via inspecting `webform.css` cascade). No client-side override on this page. |
| **3.3.2 Labels or instructions** | PASS | Every input has an explicit `<label for=>` visible. Required-field marker is the visible `*` in the label (plus HTML5 `required`). Phone field has a hint ("Optional. Faster than email if you'd rather we call back."). Message textarea has placeholder hint. Required-marker **color** is wrong on live (F-NEW-16-C) — but the *presence* of the marker satisfies 3.3.2. |
| **3.3.3 Error suggestion** | PASS | HTML5 `type="email"` + `required` produces native browser error suggestions ("Please enter a valid email address"). Server-side Drupal webform errors render specific suggestions per element schema. No bespoke suggestion overrides. |
| 3.3.7 Redundant entry — WCAG 2.2 | N/A | Single-step form, no multi-step flow. |
| 3.3.8 Accessible authentication (minimum) — WCAG 2.2 | N/A | No auth flow. |
| **4.1.2 Name, role, value** | PASS | All inputs use native HTML5 form controls (`<input>`, `<textarea>`, `<button type="submit">`). Required state via `required` attribute (programmatic). Labels expose accessible names. Submit button exposes "Send message" as accessible name. |
| **4.1.3 Status messages — WCAG 2.2** | PASS | Live region present: `<div aria-live="polite">…</div>` confirmed via probe (`liveRegions = [{role: null, live: "polite", text: ""}]`). Drupal webform messaging will use this region on submit. Preview has no live region (the preview is a static prototype; submit doesn't fire) — preview-doc could add `role="status"` for completeness but not required since preview doesn't actually submit. |
| Reduced-motion (`prefers-reduced-motion: reduce`) | PASS | Captures taken with `reducedMotion: 'reduce'`; no animation observed. |
| Forced-colors mode | NOT RE-TESTED THIS CYCLE | Sprint 10 sitewide pass; no `/contact-us`-specific regression suspected. |
| Mobile touch targets (375 px) | PASS | All form inputs 51 px tall; submit 48 × 331 (full-width); sidebar CTA ≥ 45; closing-CTA CTAs ≥ 48. All clear 44 px floor. |
| Mobile typography scale | MIXED | `display-md` H2 §C at 375 — live = 24 px (under), preview = 30 px (matches brief). All other mobile typography within ±2 px of brief. **F-NEW-16-E mobile arm.** |
| Mobile layout | PASS | Two-column form-grid collapses to single column at < 992; sidebar drops sticky; closing-CTA stacks vertically; what-to-expect cards collapse 3→1; no page-level horizontal scroll (pageW == clientW). |
| Pa11y-ci 0 errors on `/contact-us` | PASS | `npx pa11y-ci --config .pa11yci.json` returned `7/7 URLs passed, 0 errors` (Sprint 9 allowlist still effective). |

**Totals:** 33 distinct AA + 2.2 criteria + 4 responsive a11y checks. **Hard pass: 27.** **N/A: 8.** **Mixed (carry-forward or new): 2** (1.4.3 sitewide allowlist; 2.5.8 sitewide footer). **FAIL on live (new this cycle): 1 (1.3.5 — F-NEW-16-B).** Deferred: 1 (forced-colors retest). **One `/contact-us`-specific WCAG regression on live: `autocomplete` tokens missing.**

### Orphan-word check (memory `feedback_no_orphan_words.md`)

Probed last-line text on every heading and copy block at all three viewports.

| Heading / copy | Viewport | Live last line | Preview last line | Orphan? |
|---|---|---|---|---|
| Hero H1 "Let's talk about your quality and testing goals." | 1280 | "quality and testing goals." (4 words) | "quality and testing goals." (4 words) | NO |
| Hero H1 | 768 | "quality and testing goals." (4 words) | "quality and testing goals." (4 words) | NO |
| Hero H1 | 375 | "testing goals." (2 words) | "testing goals." (2 words) | NO |
| Hero subhead | 1280 | 3+ words last | 3+ words last | NO |
| Hero subhead | 375 | 3+ words last | 3+ words last | NO |
| Sidebar H2 "Prefer a quick call?" | all | single line | single line | NO |
| §C H2 "What to expect from the other side of this form." | 1280 / 768 | single line | single line | NO |
| §C H2 | 375 | wraps; last "of this form." (3 words) | wraps; last "of this form." (3 words) | NO |
| §C body lead "No drip campaign…" | all | 3+ words last | 3+ words last | NO |
| §C card 1 H3 "A real reply, by a real engineer." | all | single line / single line | (same) | NO |
| §C card 2 H3 "Thirty minutes, screen-share if helpful." | all | single line at 1280; wraps to "if helpful." (2 words) at 375 | (same) | NO |
| §C card 3 H3 "A short proposal, not a slide deck." | all | single line at 1280; wraps to "a slide deck." (3 words) at 375 | (same) | NO |
| §D H2 "Skip the form — book the review." | 1280 / 768 | single line | single line | NO |
| §D H2 | 375 | wraps; last "the review." (2 words) | wraps; last "the review." (2 words) | NO |
| §D body "If you already know you want a testing review, the calendar link is the fastest path. If you're still scoping, the form above is the right place." | 1280 | 3+ words last | 3+ words last | NO |
| §D body | 375 | "right place." (2 words) — borderline | "right place." (2 words) | borderline; not classed as orphan |
| Submit button "Send message" | all | single word "message"? **no — "Send message" is two words on one line** | same | NO |

**Zero orphan-word findings on `/contact-us`.** Headings + copy all wrap cleanly across all three viewports. This is a contrast with `/`, `/services`, `/how-we-do-it` which each have at least one mobile-orphan candidate — `/contact-us` copy is robust.

---

## Static-preview comparison

| Section | 1280 | 768 | 375 | Notes |
|---|---|---|---|---|
| Header | MATCH | MATCH | MATCH | Sprint 13 canonical. |
| Hero | DELTA (subhead drift) | DELTA | DELTA | body-lg carry |
| Form (§B) — fields | MATCH within 2 px | MATCH | MATCH | OK |
| Form (§B) — `autocomplete` | **DELTA** | **DELTA** | **DELTA** | F-NEW-16-B |
| Form (§B) — req marker color | **DELTA** | **DELTA** | **DELTA** | F-NEW-16-C |
| Form (§B) — sidebar H2 size | **DELTA** (32 vs 22) | **DELTA** | **DELTA** (24 vs 22) | F-NEW-16-A |
| Form (§B) — sidebar wrapper | **DELTA** (no card on live) | **DELTA** | DELTA (sidebar drops to bottom; no card) | F-NEW-16-D |
| What-to-expect (§C) — H2 size | **DELTA** (32 vs 40 — live under) | **DELTA** | **DELTA** (24 vs 30 — live under) | F-NEW-16-E |
| What-to-expect (§C) — cards | MATCH | MATCH | MATCH | OK |
| Closing-CTA (§D) — H2 | MATCH | MATCH | MATCH | OK |
| Closing-CTA (§D) — primary CTA token | **DELTA** (both wrong) | DELTA | DELTA | F-NEW-16-F |
| Closing-CTA (§D) — CTA layout | **DELTA** (stacked on live) | DELTA | MATCH | F-NEW-16-G |
| Closing-CTA (§D) — CTA chrome | DELTA (F-NEW-4 carry) | DELTA | DELTA | sitewide |
| Footer | DELTA (live richer + H3 vs H4 column heads) | DELTA | DELTA | sitewide |

---

## Findings catalog

### F-NEW-16-A — Sidebar H2 "Prefer a quick call?" too large on live (32 px vs 22 px preview)

- **Brief:** Preview-locked sidebar H2 is a small contained heading (22 / 27.5 / -0.2).
- **Live:** 32 / 36.8 / -0.48 at 1280 + 768. 24 / 27.6 / -0.36 at 375.
- **Preview:** 22 / 27.5 / -0.2 (all viewports).
- **Root cause:** Live's sidebar `dripyard_base:heading` SDC inherits the page-level `--h2-size` token (32 px since Sprint 15 Cycle 3 mobile fix). Preview rules sidebar `.contact-sidebar h2` explicitly with `font-size: 22px`. Live has no equivalent contained-H2 selector.
- **Visible impact:** Sidebar visually competes with form section headings; design intent is that the SavvyCal sidebar is a contained card with proportionately smaller heading.
- **Remediation layer:** L5 — add `.contact-us .dy-section--centered-white aside h2`, or whatever the live sidebar wrapper class is (Cycle-2 punch-list was supposed to land a wrapper — see F-NEW-16-D), with `font-size: 22px; line-height: 1.25; letter-spacing: -0.2px;`.
- **Cross-page sweep required (PC-3):** likely no — sidebar H2 selector should be scoped to `/contact-us` only. Confirm no `dripyard_base:heading` in sidebar slot on other pages before merge.
- **Recommended cycle:** Cycle 2 (bundle with F-NEW-16-D sidebar wrapper).

### F-NEW-16-B — Live form inputs missing `autocomplete` tokens (WCAG 1.3.5)

- **Brief / WCAG:** WCAG 2.2 SC 1.3.5 requires `autocomplete` tokens on inputs collecting personal info. Preview correctly sets `name`, `email`, `organization`, `tel`.
- **Live:** `autocomplete=null` on every form input (`name`, `email`, `company_name`, `phone_number`, `message`).
- **Visible impact:** None (cosmetically invisible). Functional impact: browser autofill doesn't recognise the fields, screen readers / assistive tech don't get programmatic hints, fails 1.3.5.
- **Remediation layer:** Webform config edit. In `web/.../config/sync/webform.webform.contact_form.yml`, add `'#autocomplete'` (or webform-specific equivalent — likely under each element's options) for the five fields:
  - `name` → `'#autocomplete': name`
  - `email` → `'#autocomplete': email`
  - `company_name` → `'#autocomplete': organization`
  - `phone_number` → `'#autocomplete': tel`
  - `message` → N/A (no token; default OK)
- **Cross-page sweep required (PC-3):** No — only one form on the site (this one).
- **Recommended cycle:** Cycle 2 (bundle).
- **Pa11y note:** pa11y did NOT flag 1.3.5 because Drupal's HTML5 input types (`type="email"`, `type="tel"`) partially satisfy purpose inference; but WCAG 1.3.5 explicitly requires `autocomplete` tokens for AA. **Worth fixing.**

### F-NEW-16-C — Required-marker color on live is body color, not `--accent-deep`

- **Brief / Sprint 13:** Required-field markers use `--accent-deep` (`#8E4A2A`).
- **Live:** `.form-required` rule resolves to `rgb(92, 84, 76)` (body text color) — confirmed via DOM probe.
- **Preview:** `.req` is `rgb(142, 74, 42)` ✅.
- **Visible impact:** Required-field `*` blends into body text on live; preview's terracotta `*` stands out clearly.
- **Remediation layer:** L5 — override Drupal core's `.form-required::after` and `.js-form-required::after` to set `color: var(--accent-deep)` (and ensure the `*` glyph generated by Drupal core uses the brand terracotta).
- **Cross-page sweep required (PC-3):** No — `.form-required` is on this page only.
- **Recommended cycle:** Cycle 2 (bundle with form chrome).

### F-NEW-16-D — Sidebar card wrapper missing on live

- **Brief:** Preview specifies `.contact-sidebar` with 1 px hairline border, 12 px radius, 32 px padding, sticky positioning at ≥ 992 px.
- **Live:** Sidebar children (kicker / heading / paragraph / button / response-time meta) render as direct siblings of the form inside `.dy-section__content` — no card wrapper, no border, no sticky.
- **Visible impact:** Sidebar visually merges with the section background; design intent is a contained sticky card hugging the form's right edge.
- **Remediation layer:** Either L3 (Canvas restructure — add a wrapper component around sidebar children) or L5 (CSS-only — group sidebar children via attribute selector or sibling combinator + apply card chrome). Operator decision required; L5 simpler if Canvas children are stable.
- **Cross-page sweep required (PC-3):** No — sidebar is /contact-us only.
- **Recommended cycle:** Cycle 2.

### F-NEW-16-E — §C H2 "What to expect" mobile + desktop too small on live (24 / 32) vs preview (30 / 40)

- **Brief:** `display-md` for §C H2 = 40 / 1.1 desktop; mobile = 30 px (Sprint 15 Cycle 3 verified).
- **Live:** 32 px desktop / 24 px mobile — both **under-shoot** the brief.
- **Preview:** 40 px desktop / 30 px mobile — both **match** the brief.
- **Root cause:** Live `.dy-section--centered-light` cascade resolves §C H2 through `--h2-size` (32 / 30 ratio after Sprint 15 Cycle 3 fix). The brief, however, separates `display-md` (40 / 30) from the more general `--h2-size` (32 / 30). The Sprint 15 Cycle 3 fix unified `--h2-size` to 32/30 but did not preserve the brief-correct 40-at-desktop value for `.section-head h2` / `display-md` callsites.
- **Visible impact:** Live §C H2 is visibly smaller than preview at both desktop (32 vs 40) and mobile (24 vs 30). Heading hierarchy is correct (H1 > H2 > H3) — the issue is intra-class sizing.
- **Remediation layer:** L1 token — bring back `display-md` as a distinct rule scoped to `.dy-section--centered-light h2` (or whatever Canvas section variant `/contact-us` §C uses), at 40 / 1.1 desktop and 30 / 1.1 mobile. **Cross-page sweep required (PC-3)** — every page that uses `display-md` H2 (homepage, /services, /about-us, /how-we-do-it, /open-source-projects, /contact-us) must verify the new rule doesn't disturb downstream content.
- **Recommended cycle:** Cycle 3 (after the preview-doc + L5 batch of Cycle 2). PC-3 cross-page sweep mandatory.

### F-NEW-16-F — Closing-CTA primary CTA token wrong on **both** live AND preview

- **Brief 319:** Dark-zone primary CTA = `#5DC6E8` + `#1F1A14` text (~8.81:1, AA pass).
- **Live + Preview:** both render `rgb(98, 187, 203)` (`#62BBCB`) + white (~2.21:1 — fails 4.5:1 floor; held by pa11y allowlist).
- **Remediation layer:**
  - **Preview-doc** — change `.btn--primary` rule (or scope a dark-zone variant `.closing-cta .btn--primary`) to `#5DC6E8` + `#1F1A14`.
  - **Live** — same change applied at theme token level. Affects every dark-zone closing-CTA across the site (homepage, /services, /how-we-do-it, /about-us, /contact-us). **L1 token; PC-3 cross-page sweep mandatory.**
- **Pa11y impact:** When the token lands, the existing `a.button.button--primary, button.button.button--primary` allowlist entry can be removed (new contrast will be 8.81:1, well above 4.5).
- **Recommended cycle:** Cycle 3 or Cycle 4 (bundle with F-NEW-16-E since both are L1 tokens needing PC-3 sweep; or fold into a future "espresso CTA token cycle" that addresses this and Sprint 14 / 15 carry-forwards in one go).

### F-NEW-16-G — Closing-CTA CTAs stack vertically on live desktop; preview shows side-by-side

- **Brief / Preview:** `.closing-cta__ctas { display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap; }` — two CTAs sit side-by-side on desktop, stack on mobile.
- **Live:** CTAs render as direct Canvas children of the section's `dy-section__content`, which is `display: flex; flex-direction: column` by default — they stack at all viewports.
- **Visible impact:** Desktop closing-CTA reads as a single column rather than a CTA group. Mobile is fine.
- **Remediation layer:** Two options. **(a) L3 Canvas** — wrap the two `dripyard_base:button` components in a `grid-wrapper` or button-row component. **(b) L5 CSS** — target `.dy-section--centered-dark .dy-section__content > *:has(.button) + *:has(.button)` (or a more practical selector via attribute / nth-child) to apply `display: flex; gap; justify-content: center` to the two-button cluster. L5 is cleaner if button-row component doesn't exist; otherwise L3.
- **Cross-page sweep required (PC-3):** Yes — `/about-us`, `/how-we-do-it` etc. have the same two-button closing-CTA pattern. Verify whether they currently render side-by-side (sibling pages have been audited PASS in Sprint 14 / 15; possibly they have an additional `button-row` wrapper component that `/contact-us` Canvas 13 is missing). Step-3 trace by F mandatory.
- **Recommended cycle:** Cycle 2 (bundle if L5; otherwise Cycle 3).

### F-NEW-16-H (advisory) — Footer column headings: live H3, preview H4

- **Issue:** Live footer column heads ("Services / Resources / Company") render as H3; preview renders them as H4.
- **Heading hierarchy on live:** H1 → H2 (§B sidebar / §C / §D) → H3 (§C cards) → H3 (footer columns). The H3 footer columns are at the same level as the §C cards — defensible but arguably less correct than preview's H4.
- **Visible impact:** None.
- **Sitewide:** This is a sitewide live pattern (not /contact-us-specific) — fix would touch the footer block template / region rendering.
- **Recommended cycle:** Out of /contact-us scope. Note in carry-forwards.

### F-NEW-4 (advisory carry) — Primary CTA suffix-icon component delta

- **Issue:** Live `dripyard_base:button` (primary variant) renders a 32-px chevron-circle SVG suffix → 48–56 px pill height; preview uses flat anchor → 45 px pill.
- **Affected placement:** §D closing-CTA primary "Book a testing review"; also `/contact-us` form submit button uses a different `<button class="button button--primary">` flat pill = 48 × 163 px (no suffix-icon because it's a submit, not the `dripyard_base:button` component).
- **Operator decision pending from Sprint 14.** Recommend bundling into a CTA-component spec audit.

### Carry-forwards (out of /contact-us scope)

- **body-lg sitewide drift** (live 16–20, preview 17–19, brief 18) — sitewide token cycle.
- **`display-md` line-height** (Sprint 15 Cycle 3 unified `--h2-size`; brief 1.1 desktop vs live currently ~1.2) — sitewide.
- **Footer richness + heading level** (F-NEW-16-H) — sitewide.
- **F-NEW-4 CTA suffix-icon** — sitewide pending operator decision.

---

## Recommendation — Cycle 2..N carve

### Cycle 2 — preview-doc + L5 CSS batch (no L1 token changes)

- **Branch:** `aa/pl-sprint-16-cycle-2-contact-us-preview-doc-and-l5`
- **Scope:**
  - **F-NEW-16-A** (L5) — add `.contact-sidebar h2` / equivalent live selector rule: `font-size: 22px; line-height: 1.25; letter-spacing: -0.2px;`.
  - **F-NEW-16-B** (config) — add `'#autocomplete'` tokens to the five form fields in `webform.webform.contact_form.yml`.
  - **F-NEW-16-C** (L5) — override Drupal core's `.form-required::after` / `.js-form-required::after` to `color: var(--accent-deep)`.
  - **F-NEW-16-D** (L3 Canvas or L5) — wrap sidebar children in a card wrapper with hairline + 12 px radius + 32 px padding + sticky behavior. F's Step-3 trace decides between L3 (Canvas wrapper component) and L5 (CSS sibling-grouping + new `.contact-us__sidebar` class on the existing children).
  - **F-NEW-16-G** (L5 or L3) — apply `.closing-cta__ctas`-style horizontal row layout to the two closing-CTA buttons at ≥ 768 px. PC-3 cross-page check on `/about-us`, `/how-we-do-it`, `/services`, `/open-source-projects`, `/`. F's Step-3 trace decides L3 (Canvas button-row wrapper) vs L5 (CSS selector targeting consecutive `.button` siblings).
- **Verification:** Re-run `scripts/sprint-16-cycle-1-capture.mjs` + `…-diff.mjs`; per-section DSSIM on form + closing-CTA should drop ~30–50%.
- **F→T→S:** F implements; T validates structural HTML/CSS; S re-audits.

### Cycle 3 — F-NEW-16-E §C H2 `display-md` desktop + mobile (L1 token) + PC-3 cross-page sweep

- **Branch:** `aa/pl-sprint-16-cycle-3-display-md-section-head`
- **Scope:** L1 — scope `.section-head h2` (or `.dy-section--centered-light h2`) to `40 / 1.1` desktop and `30 / 1.1` mobile so `/contact-us` §C matches preview + brief.
- **PC-3 mandatory cross-page sweep** — every page using `display-md` in section heads (homepage, /services, /about-us, /how-we-do-it, /open-source-projects).
- **F→T→S:** F implements; T validates @media cascade + non-regression on `--h2-size` Sprint 15 fix; S runs cross-page sweep.

### Cycle 4 (optional, may merge into Cycle 3) — F-NEW-16-F dark-zone primary CTA token

- **Branch:** `aa/pl-sprint-16-cycle-4-espresso-primary-token`
- **Scope:** L1 token — change `--primary-light` reference at espresso scopes (`.closing-cta .btn--primary`, `.theme--dark .button--primary`) to `#5DC6E8` + `#1F1A14`. Preview-doc same edit. Remove the corresponding pa11y allowlist entry once contrast passes.
- **PC-3 mandatory cross-page sweep** — affects every page's closing-CTA primary.
- **Pa11y reconfirm** — verify the existing `a.button.button--primary, button.button.button--primary` entry can be removed (contrast 8.81:1 should pass natively).

### Deferred / out of Sprint 16 scope

- **F-NEW-16-H** (footer column H3 vs H4) — sitewide; doc-only or theme-template edit; not visual-fidelity-critical.
- **F-NEW-4** (CTA suffix-icon chrome) — sitewide; awaits operator decision.
- **body-lg sitewide drift** — sitewide token cycle.

---

## Scripts (durable artifacts)

| Script | Purpose |
|---|---|
| `scripts/sprint-16-cycle-1-capture.mjs` | 2× retina captures of live + preview at 1280/768/375 |
| `scripts/sprint-16-cycle-1-measure.mjs` | Section bounding boxes + chrome mask + form-input probe + req-marker probe |
| `scripts/sprint-16-cycle-1-diff.mjs` | Apply mask, anchored per-section crops, DSSIM/PSNR/AE per section + wholepage + composites |
| `scripts/sprint-16-cycle-1-probe.mjs` | Computed-style probes (H1, subhead, sidebar H2, §C H2, §D H2, body, kicker, submit, form-input `autocomplete`/labels, live regions, honeypot) + line-count + last-line for orphan check |

All scripts idempotent; may be re-run in Cycles 2..N to confirm fixes.

---

## Files referenced

- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/Previews/contact-us.html`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/briefs/pl_design_brief.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/pl-plan--sprint-16-contact-us-fidelity-hq.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/pl-plan--contact-us.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/sprint-15-cycle-1-audit.md` (method reference)
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/sprint-15-wrap.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/.pa11yci.json`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/screenshots/sprint-16-cycle-1/` (PNGs + measurements.json + diff-results.json + probes.json)
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/scripts/sprint-16-cycle-1-*.mjs`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/sprint-16-cycle-1-report.html`

---

## Verdict

**REWORK** — Cycle 2..N carve recommended.

Six actionable findings on `/contact-us`:

1. **F-NEW-16-A** — Sidebar H2 too large on live (32 vs 22 preview). L5 CSS.
2. **F-NEW-16-B** — Live form inputs missing `autocomplete` tokens (WCAG 1.3.5 fail). Webform config.
3. **F-NEW-16-C** — Required-marker color is body color on live, not `--accent-deep`. L5 CSS.
4. **F-NEW-16-D** — Sidebar card wrapper missing on live. L3 Canvas or L5 CSS.
5. **F-NEW-16-E** — §C "What to expect" H2 too small on live (32/24 vs preview 40/30 matching brief). L1 token + PC-3 sweep.
6. **F-NEW-16-F** — Closing-CTA primary CTA uses `#62BBCB` + white on both live and preview; brief mandates `#5DC6E8` + `#1F1A14`. L1 token + preview-doc + PC-3 sweep.
7. **F-NEW-16-G** — Closing-CTA two buttons stack vertically on live desktop; preview side-by-side. L3 or L5.

Plus advisories:
- **F-NEW-16-H** — Footer column heads H3 on live vs H4 on preview. Sitewide; defer.
- **F-NEW-4** carry — CTA suffix-icon chrome. Pending operator decision.
- **Body-lg + display-md lh** sitewide carries.

All structural a11y floors hold (pa11y 0 errors, WCAG 32-criterion + 4 responsive checks: 27 pass, 8 N/A, 2 mixed-carry, 1 new fail (1.3.5)).

The HQ method again confirms its value: per-section DSSIM 0.17–0.25 across every section signals real visible deltas; the actionable subset is six discrete fixes that close most of the surface in /contact-us scope, with two L1 token changes (F-NEW-16-E + F-NEW-16-F) that should batch into a single cross-page sweep cycle (Cycle 3) per PC-3.
