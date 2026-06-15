# Sprint 6 — `/services` polish + reconciliation — Orchestrator Log

**Runbook:** [`../pl-plan--sprint-6-services-polish-and-recon.md`](../pl-plan--sprint-6-services-polish-and-recon.md)
**Integration branch:** `aa/pl-sprint-6-services-polish-and-recon`
**Mode:** autonomous
**Started:** 2026-05-11

## Kickoff pre-commitments

- PC-1 — Brief tokens > preview layout > content brief > live (Sprint 5 precedence carry-over).
- PC-2 — Cycle 2 layer choice: F traces `.grid-wrapper--2col` cross-page usage; scopes to services-only if shared.
- PC-3 — Cycle 3 path (a): Canvas-class marker + L5.
- PC-4 — S ADVISORY-HOLD silent-park.
- PC-5 — Pa11y "0 new errors" wording.
- PC-6 — Hard-stop floor: env breakage / availability / new WCAG regression / schema deletion.

## Cycle timeline

### Cycle 1 — Preview / brief / runbook reconciliation (doc-only)

- **Opened:** 2026-05-11
- **Branch:** `aa/pl-sprint-6-cycle-1-recon`
- **Pipeline:** O alone (small targeted doc edits)
- **Closed:** 2026-05-11 — three doc edits applied directly:
  - FU-S5-3 — `Previews/services.html` line 354: `opacity: 0.8` removed from `.logo-bar__row span`; replacement comment cites the contrast finding.
  - FU-S5-4 — `briefs/pl_design_brief.md` §"Per-section mobile behavior": added "Wordmark strip (services-page § proof)" entry codifying 4+2 mobile wrap + full-opacity wordmark text.
  - FU-1 — `pl-plan--sprint-4-pre-services-foundation.md` Cycle 2 AC4: "zero visual delta" → "no unintended delta; brand-correction deltas accepted."

### Cycle 2 — § engagements 768 grid collapse (FU-S5-1)

- **Opened:** 2026-05-11
- **Branch:** `aa/pl-sprint-6-cycle-2-grid-collapse`
- **Pipeline:** O → F → T → S → O (with 1 rework round)
- **Round 1:** F added `@media (max-width: 991px) { .grid-wrapper--2col .grid-wrapper__grid { grid-template-columns: 1fr } }` in `grid-wrapper.css`. Grid collapse worked but exposed Dripyard container-query firing on the now-wider cards (`.card__bottom` 305 px / 44 %).
- **Round 2 (rework):** F traced the issue to Dripyard's `@container (width > 600px)` rule on `.card__layout`. Added scoped `@media (max-width: 991px)` in `card.css` to reset `.grid-wrapper--2col .card__layout` to `flex-direction: column` + remove asymmetric padding. Selector services-only.
- **Closed:** 2026-05-11 — S PASS. `.card__bottom` now 690.75 px (was 305 px). 1280/375 unchanged. `/open-source-projects` image cards unaffected.
- **Files changed:** `grid-wrapper.css` (L5), `card.css` (L5), `css-change-log.md`.

### Cycle 3 — § nearshore container-cap (FU-S5-5)

- **Opened:** 2026-05-11
- **Branch:** `aa/pl-sprint-6-cycle-3-nearshore-cap`
- **Pipeline:** O → F → T → S → O (no rework rounds)
- **Approach:** Path (a) — Canvas-class marker `nearshore-section` via Canvas content edit on entity id=3 + scoped L5 in `dy-section.css` (H2 max-width 640px + `text-wrap: balance`; body 720px).
- **Closed:** 2026-05-11 — S PASS at 1280. Live now improves on preview (preview itself orphans "hands." on line 2; live's `text-wrap: balance` produces a clean 3+4 wrap). 768/375 unchanged.
- **Files changed:** `dy-section.css` (L5, +47 lines), `scripts/sprint6-cycle3-nearshore-marker.php` (Canvas content edit; idempotent).
