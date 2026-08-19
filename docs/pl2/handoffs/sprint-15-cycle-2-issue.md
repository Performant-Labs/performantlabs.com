# Issue: Sprint 15 Cycle 2 — `/how-we-do-it` preview §E CTA token (F-NEW-15-C)

**Branch:** `aa/pl-sprint-15-cycle-2-preview-doc`
**Sprint:** 15
**Mode:** Autonomous
**Pipeline:** F → T → S

## Objective

Fix the preview §E closing-CTA primary button token in `docs/pl2/Previews/how-we-do-it.html`. Same defect pattern as Sprint 14 Cycle 2 F-NEW-3 (now on a different preview file). Preview-doc only — no live changes.

## Input documents

- [ ] `docs/pl2/handoffs/sprint-15-cycle-1-audit.md` §"F-NEW-15-C" — finding details
- [ ] `docs/pl2/handoffs/sprint-14-cycle-2-F.md` — prior precedent (same fix on `about-us.html`); use as template
- [ ] `docs/pl2/Previews/how-we-do-it.html` — file you will edit
- [ ] `docs/pl2/briefs/pl_design_brief.md` line 319 — brief mandate for dark-zone CTA tokens

## Acceptance criteria

- [ ] Preview closing-CTA primary button (selector path: `.section--espresso .btn--primary` or equivalent — locate via the page's §E "Want to talk testing?"-style closing section markup) uses `background: #5DC6E8` and `color: #1F1A14` per brief line 319 (8.81:1 AA).
- [ ] Hover state defined consistently with Sprint 14 Cycle 2 precedent (e.g. `background: #4AB8DA; color: #1F1A14;`).
- [ ] Light-zone primary buttons (hero + any §B/§C/§D primary CTAs on this page) remain unchanged (`#62BBCB` + white).
- [ ] No other preview file is modified. No live code is modified.
- [ ] Re-run `node scripts/sprint-15-cycle-1-capture.mjs` (preview side only) and `node scripts/sprint-15-cycle-1-diff.mjs` and report the new DSSIM for the `closing-cta` section at 1280 — should drop relative to the Cycle 1 baseline.

## Constraints

- Docs-only. No theme files.
- No `!important`.
- Stage by explicit path.
- Per memory `feedback_no_orphan_words.md` — verify §E doesn't introduce orphan-word regressions.

## Handoff location

Write your handoff to: `docs/pl2/handoffs/sprint-15-cycle-2-F.md`
