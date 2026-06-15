# Sprint 10 — Architectural cleanup — Wrap

**Sprint:** Sprint 10
**Runbook:** [`../pl-plan--sprint-10-architecture-cleanup.md`](../pl-plan--sprint-10-architecture-cleanup.md)
**Integration branch:** `aa/pl-sprint-10-architecture-cleanup`
**Mode:** autonomous
**Started + Wrapped:** 2026-05-12 (same-day)
**Cycles:** 6 (Cycle 1 audit + Cycle 2a doc-only + Cycles 2b.1/2/3/4 selector refactors). 1 rework round (2b.2).

## Outcomes

| Cycle | Slug | Outcome | Rework |
|---|---|---|---|
| 1 | Architectural-debt audit (S-only) | **PASS** — 12 fragile patterns + 17 doc hits inventoried | 0 |
| 2a | `component_version` workflow doc fix (O direct) | **PASS** — 9 files / 17 locations corrected | 0 |
| 2b.1 | `/about-us` selector-class markers | **PASS** — AE=0 all 12 page×viewport pairs | 0 |
| 2b.2 | `/services` selector-class markers | **PASS** — AE=0 all 15 pairs | 1 (P4 cross-page + P10 specificity) |
| 2b.3 | `/how-we-do-it` selector-class markers | **PASS** — AE=0 all 15 pairs | 0 |
| 2b.4 | Homepage logo-grid selector-class markers | **PASS** — AE=0 all 15 pairs | 0 |

## Tech-debt items closed

- **ADV-3 (selector-class refactor)** — 12 fragile DOM-shape-sniffing patterns migrated to 9 class-based markers across `dy-section.css` + `logo-grid.css`. AE=0 pixel-identical refactor verified on every cycle.
- **component_version workflow doc fix** — 9 files, 17 hit-locations. Replaced "set to NULL" instruction with "preserve" (Canvas throws `OutOfRangeException` on NULL — discovered Sprint 5 cycle 2; F had been quietly working around it for 5 sprints).

## New class-based markers

| Marker | Sections |
|---|---|
| `.dy-section--centered-light` | `/about-us` §B Track record, §D Dogfood |
| `.dy-section--centered-white` | `/services` §3 Dogfooding (note: §3 Nearshore + `/open-source-projects` Community still match via P2 transition selector — pending follow-up) |
| `.dy-section--cta-pair` | `/services` §1 hero + §6 closing CTA; `/about-us` §1 hero + closing CTA |
| `.dy-section--bio-block` | `/about-us` §C Open source bio |
| `.dy-section--wordmark-strip` | `/services` §5 proof |
| `.dy-section--kicker-inline` | `/how-we-do-it` Week 1 / Week 2 / Week 3+ |
| `.dy-section--tight-header` | `/how-we-do-it` "What we don't do" |
| `.dy-section--logo-grid` | `/` (homepage v2) logo-strip |
| `.dy-section--post-hero-logos` | `/` (homepage v2) logo-strip |

Pre-existing markers `.dy-section--other-modules` (Sprint 5) and `.nearshore-section` (Sprint 6) carry forward — both fit the same pattern.

## Specificity-safe convention codified

All new markers use the **doubled-class** form `.dy-section.dy-section--<marker>` (specificity 0,2,0) rather than `.dy-section--<marker>` (0,1,0). This beats utility-class ties (`.padding-top--l` etc.) by source-order independence. Discovered via cycle 2b.2 rework round (P10 wordmark-strip lost to `.padding-top--l` and produced 96 px vertical drift).

**Future-cycle rule:** marker selectors that need to win against Dripyard's `.padding-*` / `.margin-*` / theme-token utility classes must use the doubled form.

## Transition selectors remaining (deferred follow-up)

Two transition comma-selectors kept active in `dy-section.css`:

- **P2** — `.dy-section.dy-section--centered-white .dy-section__content, .dy-section.theme--white:has(.dy-section__header .kicker--centered) .dy-section__content` (and similar). The `:has` half remains because `/open-source-projects` "Community" section is a P2 consumer and didn't get a marker in Sprint 10 (out of scope — wasn't on the audit's 4-page list).
- **P3** — was folded into P2's transition selector (no separate rule).

**Follow-up:** when `/open-source-projects` is otherwise touched, add `.dy-section--centered-white` to its Community section and drop the old `:has` half. Logged as new tech-debt entry.

## Documentation aligned

The `component_version` workflow doc fix corrected an instruction that had been objectively wrong for 5+ sprints. New canonical wording across all 9 files: **"Preserve `component_version`. Do NOT set to NULL — Canvas throws `OutOfRangeException`."** Reference script for the idempotent pattern: `scripts/sprint6-cycle3-nearshore-marker.php`.

## Canvas-patch script pattern matured

Across 4 fix cycles, F produced 5 idempotent Canvas-patch scripts following the Sprint 6 cycle 3 reference template:

- `scripts/sprint10-cycle2b1-about-us-markers.php`
- `scripts/sprint10-cycle2b2-services-markers.php`
- `scripts/sprint10-cycle2b2-rework-about-us-hero-marker.php`
- `scripts/sprint10-cycle2b3-how-we-do-it-markers.php`
- `scripts/sprint10-cycle2b4-homepage-logo-grid-markers.php`

All read the full inputs JSON, modify only `additional_classes`, preserve `component_version`, log SKIP vs APPLIED per section. Reusable for future selector-marker work.

## S verification method (matured across 4 cycles)

For pixel-identical refactors: stash F's CSS edits + run undo script to reconstruct baseline Canvas state, capture baseline screenshots, restore F's state + re-apply markers, capture live screenshots, ImageMagick `compare -metric AE`. Used in 2b.1/2/3/4 — produces AE=0 verification. Method documented in each cycle's S handoff and report.

## Calibration notes

1. **Audit accuracy improves with each cycle.** Cycle 1 audit's "P4 is /services-only" was wrong (also matched /about-us hero). Cycle 2b.2 rework caught this. Future audits should explicitly enumerate every page that matches each OLD selector before tagging it for "direct swap."

2. **Specificity convention.** Discovered via 2b.2 rework. Now codified: doubled-class form for all new markers.

3. **Transition vs direct swap decision.** Use transition (comma-selector) by default when the old selector reaches more than one page. Direct swap only when cross-page reach is verified to be page-local. Document the choice in F handoff.

4. **Refactor is not free.** Sprint 10 produced 0 user-visible change but added 9 marker classes, 5 Canvas-patch scripts, ~150 lines of CSS rewrites, 1 rework round. Worth it — future cycles read cleaner CSS and avoid `:has` shape-sniffing bugs — but the cost was real (≈ 2 hours of agent time).

## Tech-debt register status (post-Sprint 10)

Only Bundle 7 remains:

- **Bundle 7 — Hygiene:** FU-4 mkcert env, merged cycle-branch cleanup (Sprints 4-10), FU-5 spot-check, orphan-theme directories.

Plus new follow-up: P2 transition-selector cleanup when `/open-source-projects` markers eventually land.

## Posture

Local-only; `--no-ff` per cycle into integration; integration `--no-ff` into local `main` at wrap.
