# Handoff-S: Cycle 3 (REWORK 2) - Closing CTA max-width Clamp Fix

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-5-cycle-3-closing-cta`
**Issue:** `docs/pl2/handoffs/cycle-3-closing-cta-rework-2-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/cycle-3-closing-cta-T-rework-2.md` (PASS, zero blocking)
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-3-closing-cta-F-rework-2.md`
**Prior S verdict:** `docs/pl2/handoffs/cycle-3-closing-cta-S-rework.md` (REWORK — flex-item still clamped to 640px)
**Operator-facing report:** [`cycle-3-closing-cta-report.html`](cycle-3-closing-cta-report.html)

---

## Verdict: PASS

The Option B-corrected fix lands. `max-width: none` on the `:not(.button)` flex-item rule successfully defeats the inherited `.text` `max-width: 640px` clamp, allowing the body-text flex item to claim a full row and forcing the two buttons to wrap onto the next line. F's proactive p-level readability cap (`.text p { max-width: 640px; margin-inline: auto }`) keeps line length near the ~75-char readability target.

Both `/services` and `/about-us` at 1280 now render the closing CTA in the canonical pattern: kicker → H2 → body paragraph (own row, centered, readable width) → CTA pair (centered, side-by-side below). 768 and 375 remain visually unchanged from the prior PASS cycles.

## T precondition

Confirmed: T reported zero blocking issues. Proceeded with Tier 3.

---

## Tier 3 visual audit

### Per-section delta results (closing-cta cropped region, live resized to preview dims)

| Page | Viewport | AE (pixels) | Area | Delta % | Layout match | Verdict |
|---|---|---:|---:|---:|---|---|
| /services | 1280 | 121,130 | 833,280 | 14.5% | yes — body own row, CTAs centered below | MATCH |
| /services | 768  | 116,778 | 500,736 | 23.3% | yes — same canonical stack | MATCH |
| /services | 375  | 128,068 | 308,625 | 41.5% | yes — full-width stacked | MATCH |
| /about-us | 1280 | 61,718  | 688,640 | 9.0%  | yes — body own row, CTAs centered below | MATCH |
| /about-us | 768  | 61,914  | 413,184 | 15.0% | yes — same canonical stack | MATCH |
| /about-us | 375  | 55,636  | 198,000 | 28.1% | yes — full-width stacked | MATCH |

> Note on raw delta %: the static preview and live SDC differ in fixed cosmetics (section vertical padding, web-font hinting, kicker rule width, button radius/shadow). These deltas are the same baseline as prior PASS cycles in this sprint. They are **not** layout deltas. The defect-defining layout test — *does the body text share a row with the CTAs* — is now NO across all viewports for both pages.

### Visual confirmation at 1280 (the round-1 and round-2 failure point)

Direct image inspection of `t3-services-closing-cta-1280-live-20260511.png` and `t3-about-us-closing-cta-1280-live-20260511.png`:

- `/services` 1280: kicker centered → H2 wraps to two lines centered → body paragraph centered (visibly narrower than container, ~640px-ish from the p-level cap, four wrapped lines) → primary teal CTA + ghost CTA side-by-side, centered, below. Matches preview.
- `/about-us` 1280: kicker centered → H2 one line centered → body paragraph centered (two wrapped lines, ~640px-ish wide) → primary teal CTA + ghost CTA side-by-side, centered, below. Matches preview.

### Visual confirmation at 768 + 375

- `/services` 768 + `/about-us` 768: body centered, CTAs centered side-by-side below. MATCH preview.
- `/services` 375 + `/about-us` 375: body centered, CTAs stacked full-width. MATCH preview.

### Computed-layout sanity (carried over from F + T verification)

F's `max-width: none` on `.dy-section.theme--dark .dy-section__content:has(> .button + .button) > :not(.button)` carries specificity 0,5,0, which beats `.text` rule's 0,4,0. The clamp is removed and the flex item width resolves to `100%` of the row (~1140px at 1280). T confirmed the served CSS contains this rule inside `@media (min-width: 577px)` (file line 576). The `.text p` p-level cap is unconditional but visually a no-op below 640px viewport width.

### Per-viewport visual verdict

| Viewport | Stacking (body / CTA cluster) | Verdict |
|---|---|---|
| 1280 /services | body own row centered, CTAs centered below | **MATCH** |
| 1280 /about-us | body own row centered, CTAs centered below | **MATCH** |
| 768 /services  | body centered, CTAs centered below | MATCH |
| 768 /about-us  | body centered, CTAs centered below | MATCH |
| 375 /services  | body centered, CTAs stacked full-width | MATCH |
| 375 /about-us  | body centered, CTAs stacked full-width | MATCH |

---

## Design brief compliance

All visual tokens (espresso bg #1F1A14, cream H2 #F5EFE2, terracotta kicker #C97B5C, teal CTA #62BBCB, ghost CTA cream outline + cream text, body type Rubik body-m/l, kicker tracking + flanking rules) remain correct. No token regressions in this rework. The fix is a layout-only CSS addition; nothing else changed.

## WCAG 2.2 AA audit

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | PASS | Tab order kicker -> H2 (non-focusable) -> body -> primary CTA -> ghost CTA matches visual order |
| Focus ring visibility | PASS | Teal ring on espresso = 7.80:1 (T-verified) |
| Forced-colors mode | PASS | Buttons retain border identification under forced-colors |
| Reduced-motion | PASS | No animation in this section |
| 200% zoom | PASS | No clipping, no horizontal scroll |
| Heading hierarchy | PASS | T verified single H1, no skips on both pages |
| Image alt text | PASS | No images in this section |
| Mobile touch targets (375) | PASS | `.button` `min-height: 44px` retained |
| Mobile typography scale | PASS | No change |
| Mobile layout | PASS | Full-width stacked CTAs on 375 |

## Static preview comparison

| Section row | Preview | Live (1280) | Status |
|---|---|---|---|
| Kicker (terracotta, flanking rules) | present | present | MATCH |
| H2 (cream, centered) | present | present | MATCH |
| Body row (centered, narrower readable width) | own row | own row | **MATCH** (was DELTA in round 1 + 2) |
| CTA cluster row (centered, below body) | own row | own row | **MATCH** (was DELTA in round 1 + 2) |
| Mobile stacking (375) | full-width stacked | full-width stacked | MATCH |
| Tablet stacking (768) | centered stacked | centered stacked | MATCH |
| Token fidelity | — | — | MATCH |

## Cross-page check: /about-us

Same fix lands. Same canonical stack pattern. MATCH.

---

## Acceptance criteria

| # | Criterion | Result |
|---|---|---|
| 1 | `/services` § closing-cta at 1280: body own line, CTAs side-by-side centered below | PASS |
| 2 | `/about-us` § closing-cta at 1280: same correct stacking | PASS |
| 3 | Body text within reasonable visual width (no edge-to-edge regression) | PASS — p-level cap holds line length ~75 chars |
| 4 | 768 + 375 unchanged | PASS |
| 5 | T1 + T2 PASS on `/services`, `/about-us`, `/` | PASS (per T handoff) |
| 6 | No `!important` | PASS (per T handoff) |

---

## Advisory notes

1. **Carried forward from prior S (ADV-3):** the comment in `dy-section.css` line 506 reads `13.07:1` but T's independently computed value is `15.07:1`. Non-blocking; address in a future cleanup.

2. **F's contrast ratios are conservatively low** compared to T's independent computation. All discrepancies are upward (T computes higher); no pass/fail reversals. F may want to verify its contrast-calculation tool.

3. **Architectural note:** the `:has(> .button + .button)` plus `max-width: none` combo is a layout hack to compensate for the absent `.cta-cluster` wrapper. It works correctly here but is brittle if a future variant adds a third trailing element. A future cycle could wrap CTA pairs in a dedicated SDC `cta-cluster` and remove this rule entirely (Option A from the prior S handoff). Non-blocking — defer to operator scheduling.

---

## Deliverables

- This handoff: `docs/pl2/handoffs/cycle-3-closing-cta-S-rework-2.md`
- Operator-facing report (refreshed): `docs/pl2/handoffs/cycle-3-closing-cta-report.html`
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-5-cycle-3-rework-2/` (live + preview + diff + composite for 6 page×viewport pairs)

## Recommendation to O

Commit. Ready to merge `aa/pl-sprint-5-cycle-3-closing-cta` into `main` per the sprint runbook.
