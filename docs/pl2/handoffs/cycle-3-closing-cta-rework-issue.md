# Sprint 5 — Cycle 3 — REWORK — desktop CTA cluster stacking

**Branch:** `aa/pl-sprint-5-cycle-3-closing-cta` (continue on same branch)
**Mode:** autonomous
**References:** original issue `cycle-3-closing-cta-issue.md`; prior F handoff `cycle-3-closing-cta-F.md`; S findings `cycle-3-closing-cta-S.md`

## What S found

`/services` § closing-cta at 1280 desktop: body paragraph + both CTA pills share a single flex row instead of body→cluster stacking. 768 and 375 are correct.

**Root cause (S's analysis):** `.dy-section.theme--dark .dy-section__content:has(> .button + .button)` makes the container `flex-direction: row; flex-wrap: wrap`. The compensating `> :not(.button) { flex-basis: 100% }` is defeated on `.text` because `.text` has `max-width: 640px`, which caps the rendered width below the 100% basis. The remaining row width (~525 px) is just enough for both buttons (~470 px + gap) to squeeze in beside the body, breaking the intended stack.

## Fix to apply — Option B (smallest CSS-only)

In `web/themes/custom/performant_labs_20260502/css/components/dy-section.css`, in the existing `.dy-section.theme--dark .dy-section__content:has(> .button + .button) > :not(.button)` rule, add:

```css
width: 100%;
flex-basis: 100%;
```

(Adding `width: 100%` alongside `flex-basis: 100%` forces the flex item to claim the full row regardless of its `max-width`. The `max-width: 640px` still constrains the content visually inside that row.)

## Bonus: fixes pre-existing /about-us defect

S notes the same `.dy-section.theme--dark` selector also affects `/about-us`. Apply the same fix there for free.

## Acceptance criteria

- [ ] `/services` § closing-cta at 1280: body text on its own line; both CTAs side-by-side centered below.
- [ ] `/services` § closing-cta at 768 + 375: unchanged (was already correct).
- [ ] `/about-us` closing-CTA at 1280: same correct stacking (validate as bonus fix).
- [ ] No `!important`.
- [ ] T1 + T2 PASS on `/services` and `/about-us`.
- [ ] No regression on `/` (homepage).

## Handoff

- F rework: `docs/pl2/handoffs/cycle-3-closing-cta-F-rework.md`
- T rework: `docs/pl2/handoffs/cycle-3-closing-cta-T-rework.md`
- S rework: `docs/pl2/handoffs/cycle-3-closing-cta-S-rework.md`
