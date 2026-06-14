# Sprint 5 — Cycle 3 — REWORK 2 — close CSS max-width clamp

**Branch:** `aa/pl-sprint-5-cycle-3-closing-cta` (continue on same branch)
**Mode:** autonomous
**References:** original issue, prior F + S handoffs, rework-1 issue, rework-1 S verdict at `cycle-3-closing-cta-S-rework.md`

## Why round-1 fix failed

`width: 100%` is clamped by `max-width: 640px` per CSS spec — so the `.text` flex item still resolves to 640 px and the two CTAs squeeze in beside it on a 1164 px row. S verified this with Playwright at 1280.

## Fix to apply — Option B-corrected

In `web/themes/custom/performant_labs_20260502/css/components/dy-section.css`, in the same rule already touched in rework 1:

```
.dy-section.theme--dark .dy-section__content:has(> .button + .button) > :not(.button) {
  flex-basis: 100%;
  width: 100%;
  max-width: none;   /* ADD THIS LINE */
}
```

This defeats the `max-width: 640px` clamp inherited from `.text`, so the flex item claims the full row and forces the buttons to wrap onto the next line. Visual centering of the body text is still controlled by `text-align: center` on the parent and by `margin-inline: auto` if needed (verify in browser).

If removing the 640-px constraint causes body text to span too wide, restore the visual cap via `text-wrap: balance` on `.text` only (does not affect block width), or wrap body text inside an inner span with `display: inline-block; max-width: 640px`. Try the simple `max-width: none` first.

## Acceptance criteria

- [ ] `/services` § closing-cta at 1280: body text on its own line, both CTAs side-by-side centered below.
- [ ] `/about-us` closing-CTA at 1280: same correct stacking.
- [ ] Body text still appears visually within a reasonable width (`max-width: none` does not produce edge-to-edge line lengths that hurt readability).
- [ ] 768 + 375 unchanged.
- [ ] T1 + T2 PASS on `/services`, `/about-us`, `/`.
- [ ] No `!important`.

## Handoff

- F: `docs/pl2/handoffs/cycle-3-closing-cta-F-rework-2.md`
- T: `docs/pl2/handoffs/cycle-3-closing-cta-T-rework-2.md`
- S: `docs/pl2/handoffs/cycle-3-closing-cta-S-rework-2.md`
