# Issue: Sprint 18 Cycle 2 — `/articles` preview-doc batch

**Branch:** `aa/pl-sprint-18-cycle-2-preview-doc-batch`
**Pipeline:** F → T → S

## Objective

Six preview-doc fixes in `docs/pl2/Previews/articles.html`. No live code.

## Acceptance criteria

- [ ] **F-NEW-18-A.** Chip + pagination active-state color: change `#1893B4` → `#005AA0` to match live (live passes WCAG 1.4.3 at 14 px; preview fails).
- [ ] **F-NEW-18-B.** Card border: change `#E5E1DC` → `~#8E867A` (or whatever live's exact computed value is — probe live and match). PC-1 a11y floor wins; live's darker hairline passes 1.4.11.
- [ ] **F-NEW-18-C.** Card H3 color: change `#2A2520` → `#1F1A14` (Sprint 13–16 sitewide ink-strong canonicalization).
- [ ] **F-NEW-18-D.** Swap order of the last two chips to match live ordering.
- [ ] **F-NEW-18-E.** Preview mobile chip padding 9 px → 15 px so tap-target reaches 44 px (WCAG 2.5.8 floor).
- [ ] **F-NEW-18-F.** Skip-link target: change `#main` → `#main-content` (live target).
- [ ] No `!important`. Stage by explicit path.

## Verification (F runs T1+T2)

- T1: `grep -n` each new value lands; old values absent in the targeted contexts.
- T2: Playwright probe at 1280 + 375:
  - chip active-state color = `rgb(0, 90, 160)`
  - card border-color matches live
  - H3 color = `rgb(31, 26, 20)`
  - chip mobile tap height ≥ 44 px
  - skip-link `<a>` `href="#main-content"` and the target element exists in DOM

## Handoff

`docs/pl2/handoffs/sprint-18-cycle-2-F.md`.

## Notes

For B, **probe live's actual computed `border-color`** before writing the value — the Cycle 1 audit estimated `~#8E867A` but verify the exact value first.
