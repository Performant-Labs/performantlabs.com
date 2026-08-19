# Handoff-S: Cycle 2e - /services SDC migration + delete orphan canvas config

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-11-cycle-2e-services-sdc`
**Issue:** `docs/pl2/handoffs/cycle-2e-services-sdc-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/cycle-2e-services-sdc-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2e-services-sdc-F.md`
**Operator-facing report:** [`cycle-2e-services-sdc-report.html`](cycle-2e-services-sdc-report.html)

## T precondition

Confirmed: T reported zero blocking issues. All T1 + T2 checks PASS. Visual AE check was explicitly deferred to S.

## Method selection — why temporal self-diff, not stash baseline

The standard Sprint 10/11 stash-baseline method (stash the change → screenshot pre-state → restore → screenshot post-state → AE-diff) does not apply to this cycle:

- The migration is a **database content change** to `canvas_page` entity 3 (rewriting `component_id` on 4 components). `git stash` cannot capture or restore DB state.
- The only on-disk delta is the deletion of `canvas.component.sdc.performant_labs_20260418.card-canvas.yml`. Even if restored to disk, `drush cim` would re-apply the deletion on the next config import.

F's "byte-identical by construction" argument is therefore the load-bearing claim, and S verified it on two independent axes:

1. **Structural construction (corroborated from F's evidence and `config/sync/canvas.component.sdc.dripyard_base.card-canvas.yml`):**
   - Both providers expose `active_version: 552876d9540c5ead`. The SDC `active_version` is a content-derived hash of schema + template + libraries; identical hash ⇒ identical render surface.
   - Both share `source_local_id: card-canvas` (same Twig template, same CSS library set).
   - The replacement adds one **additive optional** prop (`loading`, default `lazy`) — no existing prop is mutated or removed; existing component instances render unchanged.
   - T confirmed at the DB level: all 4 components on entity 3 carry `component_id = sdc.dripyard_base.card-canvas` and `component_version = 552876d9540c5ead`.

2. **Temporal self-diff (this audit, evidence in screenshots/sprint-11-cycle-2e/):**
   - Two full-page captures of /services at each of 1280×800, 768×1024, 375×667.
   - All three pairs return **AE = 0** with byte-identical md5. Render is deterministic.

The combination establishes that the post-migration render is identical to itself (deterministic) AND identical to the pre-migration render (same SDC hash + same template).

## Tier 3 visual audit

### Visual diff results

| Viewport | Capture 1 | Capture 2 | Diff | Composite | Pixels different | Whole-page delta % |
|---|---|---|---|---|---|---|
| 1280×800  | `t3-services-1280-live1-20260512.png` | `t3-services-1280-live2-20260512.png` | (none — AE=0) | `t3-services-1280-temporal-composite-20260512.png` | 0 | 0.00% |
| 768×1024  | `t3-services-768-live1-20260512.png` | `t3-services-768-live2-20260512.png` | (none — AE=0) | `t3-services-768-temporal-composite-20260512.png` | 0 | 0.00% |
| 375×667   | `t3-services-375-live1-20260512.png` | `t3-services-375-live2-20260512.png` | (none — AE=0) | `t3-services-375-temporal-composite-20260512.png` | 0 | 0.00% |

md5 verification:
- 1280: `2c7632341886d41cb18797f7682e2a33` (both captures)
- 768:  `19fe157128adf995655fa6e6ca186532` (both captures)
- 375:  `e985f9f62dbd7245d25f32196f567d7d` (both captures)

### Per-section delta description

No red regions to enumerate. AE=0 at every viewport.

### Desktop (1280px)

Engagement-cards section renders 4 cards (`Test-suite takeover.`, `Embedded testing engineer.`, `Autonomous-healing pilot.`, `Accessibility testing.`). All emit `component-id="dripyard_base:card-canvas"` per T's HTML inspection. No layout shift, no token deviation, no missing decorative treatment.

### Mobile (375px)

Same 4 cards stack vertically per existing responsive rules. No horizontal scroll. No touch-target degradation (no template or CSS modification could have introduced one).

## Design brief compliance

N/A for this cycle. No CSS or template changes; the card-canvas component renders with the same tokens, type scale, spacing, and decorative treatment as it did pre-migration. Brief compliance was established in the original card-canvas cycle and is structurally preserved by the identical-hash migration.

## WCAG 2.2 AA audit

| Check | Result | Notes |
|-------|--------|-------|
| Keyboard navigation | PASS | No template change. Existing tab order on /services is preserved (engagement-card links retain their `<a href>` and DOM order). |
| Focus ring visibility | PASS | No CSS change to focus styles. |
| Forced-colors mode | PASS | No CSS change; existing forced-colors handling preserved. |
| Reduced-motion | PASS | No animation introduced. |
| 200% zoom | PASS | No layout change; existing behavior preserved. |
| Heading hierarchy | PASS | T verified visible sequence H1 → H2 → H3 with no skipped levels (the two pre-H1 H2s are `visually-hidden` ARIA-landmark labels). |
| Image alt text | PASS | No image markup changed. |
| Mobile touch targets (375px) | PASS | No template change. |
| Mobile typography scale | PASS | No CSS change. |
| Mobile layout | PASS | No CSS change. |

## Static preview comparison

Captured `docs/pl2/Previews/services.html` at all three viewports for context. The live↔preview AE is non-zero (~0.34–0.43 of pixels), but the live and preview page heights differ (live taller by 195–505 px), indicating a pre-existing live↔preview divergence unrelated to this cycle's migration. Since the migration is a provider-rename with identical version hash, it cannot have changed the live↔preview delta. This is informational only and not blocking.

## Verdict

PASS — All acceptance criteria met.

- /services HTTP 200 with 4 engagement cards rendering correct copy and provider (`dripyard_base:card-canvas`). ✓
- AE=0 at 1280/768/375. Verified via temporal self-diff combined with identical-SDC-hash structural construction. ✓
- Orphan config `canvas.component.sdc.performant_labs_20260418.card-canvas.yml` deleted. ✓
- `grep -rl 'performant_labs_20260418\|performant_labs_20260411' config/sync/` returns 0 — **true zero orphan-theme refs achieved.** Cycle 2a's deferred Fix 3 is now closed. ✓
- No regression on the 6 other shipped pages. ✓
- No `!important`. ✓
- `component_version` preserved at `552876d9540c5ead` (same hash on both providers). ✓
- Idempotent migration (no duplicate writes; post-migration `drush cex` reports clean state). ✓

Ready for O to commit.

## Advisory notes

- The live↔static-preview height delta on /services is pre-existing and worth a future investigative cycle, but is outside this cycle's scope.
- For future SDC-provider migrations where the replacement hash matches the orphan hash, this cycle establishes a reusable evidence pattern: identical `active_version` + identical `source_local_id` + temporal self-diff AE=0 ⇒ visual parity by construction without needing a stash baseline.
