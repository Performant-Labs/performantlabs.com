# Sprint 5 — Cycle 1 — Preview-vs-live audit (S-only)

**Branch:** `aa/pl-sprint-5-cycle-1-audit`
**Pipeline:** O → S → O (audit-only; no F, no T, no commit)
**Mode:** autonomous

## Objective

Produce a delta catalog of every visible difference between the static preview (`docs/pl2/Previews/services.html`) and `/services` live, at viewports 1280×800, 768×1024, and 375×667. The catalog dictates Sprint 5's downstream cycle carve.

## Audit URL

Live: `https://pl-performantlabs.com.3.ddev.site:8493/services` (active theme `performant_labs_20260502`; no `?theme=` needed).

Preview: serve `docs/pl2/Previews/services.html` via `python3 -m http.server` from `docs/pl2/Previews/` (or `file://`), whichever Playwright renders cleanly.

## Scope

Audit these sections:
- § engagements (4-card grid)
- § nearshore
- § proof (logo trust bar — "We Speak" + 8 tech logos)
- § closing-cta (final CTA)

**Excluded from audit (FU-2 canonical, do not flag):**
- § hero — shipped at brief spec (72/500/1.05/-2px desktop; 44/500/1.05/-1px mobile)

## Input documents

- [ ] `docs/pl2/Previews/services.html` — visual reference
- [ ] `docs/pl2/briefs/pl_design_brief.md` — token authority
- [ ] `docs/pl2/Existing Pages/Design1/services.md` — content brief
- [ ] `docs/pl2/Existing Pages/Target1/services--engagement-cards.md` — engagement card copy
- [ ] `docs/pl2/pl-plan--sprint-5-services-fidelity.md` — this sprint's runbook
- [ ] `docs/pl2/pl-plan--services.md` §"Final advisory carry-forward" — pre-existing accepted deviations (don't re-flag)

## Acceptance criteria (audit deliverable)

- [ ] Playwright screenshots captured for live + preview at 1280×800, 768×1024, 375×667 — six PNGs total per page area, saved under `docs/pl2/handoffs/screenshots/sprint-5-cycle-1/` with naming `t3-services-[viewport]-{live,preview}-20260511.png`.
- [ ] ImageMagick `compare -metric AE` pixel-diff PNG + side-by-side composite for each viewport.
- [ ] Whole-page pixel delta % computed per viewport.
- [ ] Per-section delta table covering § engagements, § nearshore, § proof, § closing-cta. Each row classifies the delta as one of: TYPO / LAYOUT / COPY / COMPONENT / TOKEN / WCAG, and proposes a remediation layer (L1 config / L3 base.css / L5 component CSS / Canvas content).
- [ ] FU-6 answer: does the preview contain a heal-flow section? Yes/No, with cite to which `<section>` (if any) in `services.html`.
- [ ] Pre-existing accepted deviations from `pl-plan--services.md` §"Final advisory carry-forward" are noted but NOT re-flagged as Sprint 5 work.
- [ ] HTML operator-facing report at `docs/pl2/handoffs/cycle-1-audit-services-report.html` per S canonical prompt §"Step 4f" — verdict banner, "What I see different" plain-English summary, per-viewport wipe-slider comparator, diff PNG, composite, per-section delta table with cropped thumbnails.

## Verdict mapping (this audit is planning, not pass/fail)

- **PASS** here means "audit completed, catalog usable for carving cycles" — not "no deltas." A clean audit is expected to surface many deltas; that's the point.
- **CANNOT-AUDIT** if any precondition (Playwright, ImageMagick, page availability) fails.
- **ADVISORY-HOLD** if the preview itself is internally inconsistent in a way that blocks remediation planning.

## Handoff locations

- Markdown: `docs/pl2/handoffs/cycle-1-audit-services-S.md`
- HTML report: `docs/pl2/handoffs/cycle-1-audit-services-report.html`
- Screenshots dir: `docs/pl2/handoffs/screenshots/sprint-5-cycle-1/`

## Operating rules

- Per S canonical prompt at `~/.claude/agents/spec-auditor.md` (read it).
- Pixel-level diffs are MANDATORY per memory `feedback_visual_diff_mandatory.md` — prose screenshot descriptions do not substitute.
- Enumerate every visual check; do not trim for brevity (memory `feedback_ofts_s_checklist_completeness.md`).
- Files staged by explicit path (if you write any tracked output that needs committing, which for audit cycles you typically don't — audit handoffs live in the handoffs directory and are usually gitignored).
