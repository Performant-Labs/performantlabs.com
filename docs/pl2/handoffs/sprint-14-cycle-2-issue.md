# Issue: Sprint 14 Cycle 2 — `/about-us` preview-doc batch (F-NEW-1 + F-NEW-3)

**Branch:** `aa/pl-sprint-14-cycle-2-about-us-preview-doc`
**Sprint:** 14
**Mode:** Autonomous
**Pipeline:** F → T → S

## Objective

Land two preview-doc fixes in `docs/pl2/Previews/about-us.html` so the canonical preview matches the brief at the hero and the closing-CTA section. No live theme code changes. No Drupal templates. No Canvas content.

## Input documents

- [ ] `docs/pl2/handoffs/sprint-14-cycle-1-audit.md` — Cycle 1 S audit (findings, fix specifics)
- [ ] `docs/pl2/Previews/about-us.html` — the file you will edit
- [ ] `docs/pl2/briefs/pl_design_brief.md` — brief tokens (precedence per PC-1)
- [ ] `docs/pl2/pl-plan--sprint-14-about-us-fidelity-hq.md` — runbook

## Acceptance criteria

- [ ] **F-NEW-1.** Preview hero `<h1>` (`.hero h1`, `docs/pl2/Previews/about-us.html` around line 254) renders at `font-size: 72px` with `letter-spacing: -2px` at desktop (≥ 576 px). Brief `display-xl` token is 72 / lh 1.05 / -2 px / Rubik 500.
- [ ] **F-NEW-3.** Preview closing-CTA primary button (selector path: `.section--espresso .btn--primary` or equivalent; locate via the §E "Want to talk testing?" markup) uses `background: #5DC6E8` and `color: #1F1A14` per brief line 319 ("Dark-zone CTA buttons use #5DC6E8 bg with #1F1A14 text — 8.81:1 AA pass"). Light-zone primary buttons (hero + §D) must remain unchanged (`#62BBCB` + white).
- [ ] Mobile (`< 576`) hero H1 rule is **not** changed in this cycle (F-NEW-2 belongs to Cycle 3). Confirm the preview's mobile rule still reads `font-size: 40px` post-edit.
- [ ] No other preview file is modified. No live code is modified.
- [ ] Re-run `node scripts/sprint-14-cycle-1-capture.mjs` and `node scripts/sprint-14-cycle-1-diff.mjs` and report the new DSSIM for the `hero` and `closing-cta` sections at 1280 — both should drop materially (Cycle 1 baseline: hero@1280 DSSIM 0.194; closing-cta@1280 DSSIM 0.169).

## Constraints

- Docs-only. No theme files, no `web/themes/...` edits.
- `text-wrap: balance` heading-orphan guardrail (memory `feedback_no_orphan_words.md`) — verify the H1 still wraps cleanly at 72 px desktop without producing a single-word orphan on either render.
- No `!important`.
- Stage files by explicit path.

## Handoff location

Write your handoff to: `docs/pl2/handoffs/sprint-14-cycle-2-F.md`

## Operating rules

- 7-step CSS change workflow per `docs/pl2/theme-change--workflow.md`.
- Layer trace (Step 3): both fixes are preview-doc layer (the canonical preview file itself). Document the trace briefly — the brief's `display-xl` token and brief line 319's dark-zone primary token are the source-of-truth values.
- Verification tiers (T1 + T2) on the preview file (not the live theme).
