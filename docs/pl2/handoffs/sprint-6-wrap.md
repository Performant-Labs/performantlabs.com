# Sprint 6 — `/services` polish + reconciliation — Wrap

**Sprint:** Sprint 6
**Runbook:** [`../pl-plan--sprint-6-services-polish-and-recon.md`](../pl-plan--sprint-6-services-polish-and-recon.md)
**Integration branch:** `aa/pl-sprint-6-services-polish-and-recon`
**Mode:** autonomous
**Started + Wrapped:** 2026-05-11 (same-day)
**Cycles:** 3 of 3 — all PASS

## Outcomes

| Cycle | Slug | Outcome | Rework | Merge |
|---|---|---|---|---|
| 1 | Preview / brief / runbook reconciliation (doc-only) | **PASS** — 3 doc edits applied directly by O | 0 | (folded into Cycle 1 commit `[recon]`) |
| 2 | § engagements 768 grid collapse (FU-S5-1) | **PASS** | 1 (card-internal layout fix folded in) | merged via integration |
| 3 | § nearshore container-cap (FU-S5-5) | **PASS** | 0 | merged via integration |

## Tech-debt items closed

- **FU-S5-1** — services engagement grid 768 now collapses to 1-col + cards fill full width.
- **FU-S5-3** — `Previews/services.html` no longer fails AA on wordmark items (`opacity: 0.8` removed).
- **FU-S5-4** — design brief now codifies services-page mobile wordmark wrap (4+2 at 375).
- **FU-S5-5** — `/services` § nearshore H2 now wraps within ~640 px content-cap with `text-wrap: balance`.
- **FU-1** — Sprint 4 Cycle 2 AC4 wording corrected ("zero visual delta" → "no unintended delta; brand-corrections accepted").

## What shipped — code

- `web/themes/custom/performant_labs_20260502/css/components/grid-wrapper.css` — `@media (max-width: 991px)` 1-col rule for `.grid-wrapper--2col`.
- `web/themes/custom/performant_labs_20260502/css/components/card.css` — `@media (max-width: 991px)` reset for `.grid-wrapper--2col .card__layout` to flex-column (defeats Dripyard's `@container` 2-col layout).
- `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` — `.nearshore-section` scoped rules for H2 + body content-cap with `text-wrap: balance`.
- `scripts/sprint6-cycle3-nearshore-marker.php` — Canvas content edit adding `nearshore-section` marker class (idempotent).

## What shipped — docs

- `docs/pl2/Previews/services.html` — opacity removed.
- `docs/pl2/briefs/pl_design_brief.md` — wordmark strip mobile spec added.
- `docs/pl2/pl-plan--sprint-4-pre-services-foundation.md` — AC4 wording fix.
- `docs/pl2/tech-debt-register.md` — established this sprint as a planning artifact.
- Sprint 6 runbook + orchestrator log + this wrap.

## Bonus findings

- Live now **better than preview** on two surfaces: wordmark contrast (7.43:1 vs preview 4.47:1, after FU-S5-3) and nearshore H2 wrap (preview orphans "hands." alone on line 2; live's `text-wrap: balance` produces clean 3+4 wrap). Preview should not lie — Sprint 6 cleaned up the wordmark case; nearshore preview wrap is logged as a candidate next preview update.

## Tech-debt register status (post-Sprint 6)

Updates needed to `docs/pl2/tech-debt-register.md` once this merges to main:
- Move FU-S5-1, FU-S5-3, FU-S5-4, FU-S5-5, FU-1 to "Closed / superseded".
- Optionally add: "Preview nearshore H2 orphans 'hands.'" as a new low-priority preview maintenance item.
- Optionally add: housekeeping cleanup of dead `@media (max-width: 576px)` rule in `grid-wrapper.css` (Sprint 6 cycle 2 T advisory — overridden by new 991px block, visual identical).

Remaining big buckets unchanged from the register:
- Bundle 3 (footer + contact webform sweep) — F.8, F.9, ADV-C1, ADV-CU1
- Bundle 5 (R8 mobile hero overflow) — has its own pre-allocated branch
- Bundle 4 (a11y debt sweep) — FU-3 pa11y allowlist + FU-7b article H3 skip + brand-color exception decisions
- Bundle 6 (architectural cleanup) — `dy-section.css` selector classes + `component_version` workflow doc
- Bundle 7 (env hygiene) — FU-4 mkcert + branch deletes

## Posture

Local-only; never pushed. `--no-ff` per cycle into integration; integration `--no-ff` into local `main` at wrap.
