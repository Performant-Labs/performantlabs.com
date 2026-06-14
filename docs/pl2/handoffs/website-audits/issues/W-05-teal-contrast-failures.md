# W-05 — Teal contrast failures: CTA button and link text below WCAG AA

**Source:** render-001 audit (2026-06-12), confirmed independently by axe-core
**Dimension:** wcag-contrast
**Severity:** CRITICAL
**Branch:** `aa/pl-neonbyte-W-05-teal-contrast`
**Handoff output path:** `docs/pl2/handoffs/W-05-F.md`

## 🛑 Operator decision required before F runs

The fix changes brand colors. Darkening the teal alters the visual identity on every page that uses it — this is a design decision, not a mechanical fix. **Do not spawn F until the operator picks a remediation direction.**

## Findings

**A. Hero CTA button — 2.19:1 (needs ≥ 4.5:1, or ≥ 3.0:1 if text qualifies as large)**
White text on teal surface `rgb(98,187,203)`. Element: `.hero__block-content > .button--primary`.

**B. Teal link text — 3.55:1 (needs ≥ 4.5:1)**
Teal `rgb(24,147,180)` on white. Affects every card link and icon-list link on the homepage simultaneously — they share one token.

## Remediation options (operator picks)

1. **Darken the teal token** until ≥ 4.5:1 against white (≈ `#117a96` or darker for the link teal; the button teal needs a much larger shift or a dark-text pairing).
2. **Switch button text to dark** on the existing teal (works if the pairing reaches 4.5:1) and darken only the link teal.
3. **Accept large-text exemption for the button** (≥ 3.0:1) if its typography qualifies (≥ 18pt / 14pt bold) — still requires lifting 2.19 → 3.0, and does nothing for the links.

## Acceptance criteria (once direction is chosen)

- [ ] Button text vs button surface ≥ 4.5:1 (or ≥ 3.0:1 with documented large-text qualification).
- [ ] Link teal vs white ≥ 4.5:1.
- [ ] Change made at the token layer (theme variables), not per-component overrides.
- [ ] T re-runs `node scripts/axe-check.cjs` — zero color-contrast violations on `/` and `/articles`.
- [ ] S visual diff at 375/768/1280 (this is a rendered visual change — S is mandatory).
