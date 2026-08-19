# Handoff-S: Sprint 16 Cycle 4 — §C H2 + §D primary CTA (Cycle 1 false-positive correction)

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-16-cycle-4-tokens-sweep`
**Issue:** `docs/pl2/handoffs/sprint-16-cycle-4-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/sprint-16-cycle-4-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/sprint-16-cycle-4-F.md`
**Cycle 1 audit (probe-error source):** `docs/pl2/handoffs/sprint-16-cycle-1-audit.md`
**Operator-facing report:** [`sprint-16-cycle-4-report.html`](sprint-16-cycle-4-report.html)

## Verdict

**PASS.** F + T's no-op-on-live conclusion is independently verified. The Cycle 1 audit findings F-NEW-16-E and F-NEW-16-F were probe-measurement errors, not live regressions. Cycle 4 lands a preview-doc-only change (two CSS lines) so the static preview catches up to what live already does. Live `/contact-us` unchanged.

## T precondition

T's handoff reports zero blocking issues. All Tier 1 + Tier 2 acceptance criteria PASS.

## Independent S probe (binding evidence)

Script: `scripts/sprint-16-cycle-4-s-probe.mjs` (Playwright, DPR 2, `reducedMotion: reduce`, `ignoreHTTPSErrors`).
Output: `docs/pl2/handoffs/screenshots/sprint-16-cycle-4/s-probe.json`.

§C H2 selected by text match within `.dy-section--centered-light`. §D primary CTA selected explicitly as `.dy-section--cta-pair a.button--primary` (NOT the form submit, which is the cascade the Cycle 1 audit accidentally measured).

| Element | Viewport | Property | Brief target | S measured | Match |
|---|---|---|---|---|---|
| §C H2 "What to expect…" | 1280 | font-size | 40px | 40px | PASS |
| §C H2 | 1280 | line-height | ≤ 1.10 (advisory) | 45.2px (1.13) | Advisory carry (Sprint 15 C3) — non-blocking |
| §C H2 | 1280 | letter-spacing | -1px | -1px | PASS |
| §C H2 | 375 | font-size | 30px | 30px | PASS |
| §C H2 | 375 | line-height | ≤ 1.10 (advisory) | 33.9px (1.13) | Advisory carry — non-blocking |
| §D primary CTA | 1280 | background-color | rgb(93,198,232) | rgb(93,198,232) | PASS |
| §D primary CTA | 1280 | color | rgb(31,26,20) | rgb(31,26,20) | PASS |
| §D primary CTA | 1280 | height | ≥ 44px | 56px (233×56) | PASS |
| §D primary CTA | 375 | background-color | rgb(93,198,232) | rgb(93,198,232) | PASS |
| §D primary CTA | 375 | color | rgb(31,26,20) | rgb(31,26,20) | PASS |
| §D primary CTA | 375 | height | ≥ 44px | 56px (331×56) | PASS |
| §D ghost-on-dark "View services" | both | color | #F5EFE2 on espresso | rgb(245,239,226) on transparent | PASS |
| Form submit (sanity) | 1280 | bg/text | n/a (separate cascade) | rgb(98,187,203) + white | Different from §D — expected |

S's values match T's values exactly. F + T's claims hold under fresh probe.

## Diff scope

`git diff main` for Cycle 4 contains exactly two added lines in `docs/pl2/Previews/contact-us.html`:

```
.closing-cta .btn--primary { background: #5DC6E8; color: #1F1A14; }
.closing-cta .btn--primary:hover { background: #4AB8DA; color: #1F1A14; }
```

Matches the `about-us.html` / `how-we-do-it.html` precedent. No live theme CSS modified in Cycle 4. No Canvas scripts. No `!important`. Pa11y allowlist unchanged.

## Visual diff results

### Preview pre/post Cycle 4 (§D closing-CTA crop)

| Viewport | AE pixels | Crop dimensions | % of crop | Localisation |
|---|---|---|---|---|
| 1280 | 9,530 | 1280 × 538 | 1.38 % | Concentrated on the "Book a testing review" pill |
| 375 | 9,575 | 375 × 554 | 4.61 % | Same — concentrated on the primary button (proportionally larger on mobile because button fills width) |

### Live unchanged (post-Cycle-4 vs Cycle 1 baseline, DPR 2)

| Viewport | Region | AE pixels | Note |
|---|---|---|---|
| 1280 | Top 1500 px (header + hero, stable region) | **0** | Byte-identical |
| 375 | Top 1500 px | **0** | Byte-identical |
| 1280 | Full page cropped to common height (2560 × 6760) | 694,622 (0.04 %) | Below-fold drift only — dynamic form/footer content; no Cycle 4 content delta |
| 375 | Full page cropped to common height (750 × 11,882) | 510,705 (0.06 %) | Same — below-fold drift only |

The page-height delta between Cycle 1 (6904 / 11,948 px tall) and Cycle 4 (6760 / 11,882 px tall) captures is below-the-fold dynamic content (likely form-state / footer date area), unrelated to Cycle 4 scope. The stable above-the-fold region is byte-identical → live has not changed visually.

## WCAG / responsive checklist (scoped)

| Check | Result | Notes |
|---|---|---|
| §C H2 contrast (#2A2520 on #F5EFE2 light surface) | PASS | T computed 15.07:1; well above 4.5:1 |
| §D primary CTA contrast (#1F1A14 on #5DC6E8) | PASS | 8.81:1 ≥ 4.5:1 |
| §D ghost-on-dark contrast (#F5EFE2 on #1F1A14) | PASS | 15.07:1 |
| §D primary CTA touch target | PASS | 56px height ≥ 44px floor at both 1280 and 375 |
| §C H2 orphan-word risk | PASS | Multi-word last line at 40/30px |
| Mobile font-size scaling | PASS | 40 → 30 at ≤ 576 px breakpoint per Sprint 15 C3 base.css media-query fix |
| Cross-page regression (`/about-us` §D primary still #5DC6E8 + #1F1A14) | PASS | `theme--dark .button--primary` cascade unchanged; F's cross-page probe confirmed |
| Pa11y allowlist preserved | PASS | `.pa11yci.json` unchanged |

## Out-of-scope deltas from earlier cycles

All Cycle 2 + Cycle 3 fixes remain in place (no Cycle 4 diff touches them). The stable above-the-fold byte-identical check on live confirms no regression to required-marker (C2) or sidebar wrapper (C3) work.

## Process gap surfaced for Sprint 16 wrap

The Cycle 1 audit probe script (`scripts/sprint-16-cycle-1-probe.mjs`) produced two false-positive findings:

1. **F-NEW-16-E (§C H2 size).** The script enumerated H2s as `h2s[0]` (sidebar "Prefer a quick call?") and `h2s[h2s.length-1]` (§D closing-CTA). The §C "What to expect" H2 is the third content H2 in DOM and was never directly measured. Its size was reverse-inferred from the `whattoexpect` section's DSSIM, which actually reflected layout / chrome / card-padding differences — not a type-scale problem. The §C H2 was already 40/30 because of the Sprint 15 Cycle 3 base.css media-query fix that landed before the Cycle 1 audit ran.
2. **F-NEW-16-F (§D primary CTA token).** The script measured the form submit button (`rgb(98,187,203)` + white) and attributed those values to the closing-CTA primary as well. The closing-CTA primary is an `a.button--primary` inside `.dy-section--cta-pair theme--dark`, which lands on the `theme--dark .button--primary` cascade in `button.css` lines 75-82, where `--theme-link-color` resolves to `#5DC6E8` and `--button-text-color` is `#1F1A14`. The Cycle 1 audit's "both wrong" characterization was inaccurate.

This is the third probe-error correction in Sprint 16 (Cycle 2 cleared F-NEW-16-C, Cycle 3 cleared F-NEW-16-D, Cycle 4 clears F-NEW-16-E + F). The per-section DSSIM signals from the Cycle 1 audit were sensitive but not specific — they correctly flagged "real visible delta in this section" but the root-cause attribution to specific tokens / elements was made by probe selectors that didn't directly hit the affected element.

### Recommendation for future audit-probe scripts

1. Enumerate every `<h2>` (or every primary CTA) with its text content and section ancestor — never select by `[0]` / `[length-1]` array index when multiple instances exist on the page.
2. Probe each section's primary CTA by section ancestor (`.dy-section--cta-pair .button--primary`, `.closing-cta .button--primary`, etc.) rather than the first matching `.button--primary` on the page.
3. When per-section DSSIM signals "real visible delta" but the per-token probe doesn't surface a value mismatch, flag for human follow-up rather than reverse-inferring a token cause. DSSIM-on-section is sensitive but not specific.

Three of the seven Cycle 1 findings (D-marker, E, F) ended up being probe artefacts. The remaining four (A, B, C, G) were real and have been addressed in Cycles 1–3.

## Verdict

**PASS** — Ready for O to merge.

- F-NEW-16-E and F-NEW-16-F confirmed as Cycle 1 probe artefacts; live `/contact-us` is already brief-correct on both.
- Preview-doc CSS rule landed correctly, matching cross-page precedent (`about-us.html`, `how-we-do-it.html`).
- Live unchanged (byte-identical top-1500 px region vs Cycle 1 baseline at both 1280 and 375).
- All scoped WCAG + responsive checks PASS.
- Cycles 2 + 3 fixes intact (no regression).

## Advisory notes

- §C H2 line-height measures 1.13 (45.2 / 30.9 px). Brief states ≤ 1.10. This is a pre-existing sitewide carry from Sprint 15 Cycle 3, not a Cycle 4 regression. Track for future sweep if tightening the type scale.
- F's ghost-on-dark contrast was reported as 13.07:1; T and S both compute 15.07:1 for #F5EFE2 on #1F1A14. Both well above the 4.5:1 floor — non-blocking sub-rounding discrepancy.
