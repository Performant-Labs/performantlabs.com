# Cycle 5 — Sprint 12 wrap verification sweep (T → S, no F)

**Sprint:** 12
**Branch:** `aa/pl-sprint-12-cycle-5-about-us-wrap-verify`
**Pipeline:** O → T → S → O (verification-only; no F)
**Mode:** autonomous

## Objective

End-to-end verification of every Sprint 12 change before the integration branch `aa/pl-sprint-12-about-us-fidelity` merges into local `main`. Confirm (1) `/about-us` matches the preview at all three viewports modulo silent-parked items, (2) no regression on shipped sibling pages (`/services`, `/open-source-projects`, homepage) introduced by Cycle 3's L3 token edit, and (3) the WCAG 2.2 AA carry-over from Cycles 1–4 holds under a unified sweep.

## What Sprint 12 changed (binding inventory)

T and S must verify each of these holds:

1. **Cycle 2 (R9 restore):** `dy-section--bio-block` marker removed from §C on canvas_page 17; `dy-section.css` selectors rewritten to `.dy-section--centered-white`. Bio "Who we are." sits inside §C with hairline above. `component_version: e6079b189d228dad` preserved.
2. **Cycle 3 (L3 token):** `--pl-accent-deep-on-light` in `base.css:19` is `#8E4A2A` (was `#8C4E33`). All `.theme--light .kicker--light` consumers across the site now render `rgb(142, 74, 42)`.
3. **Cycle 4 (no-op verified):** `.card[class*="theme"] .card__bottom { padding: 3rem }` still serves; live §C cards render 48 px content-to-border at all viewports.

## Input documents

Read these before starting:

- [ ] `docs/pl2/pl-plan--sprint-12-about-us-fidelity.md` — sprint runbook (PC table, especially PC-5 pa11y, PC-8 AE binding, PC-10 hard-stop floor)
- [ ] `docs/pl2/pl-plan--about-us.md` — page runbook (R9, locked decisions)
- [ ] `docs/pl2/handoffs/sprint-12-orchestrator-log.md` — cycle ledger + FB list (FB-1, FB-2 are silent-parked preview-side defects that MUST NOT be raised as regressions; FB-7 procedural precedent; FB-8 brief-vs-preview pre-existing)
- [ ] `docs/pl2/handoffs/cycle-1-about-us-audit-S.md` — original delta catalog (baseline to compare against)
- [ ] `docs/pl2/handoffs/cycle-2-about-us-bio-renest-S.md` — bio re-nest verification
- [ ] `docs/pl2/handoffs/cycle-3-about-us-kicker-token-S.md` — kicker token verification (inflated cross-page scope)
- [ ] `docs/pl2/handoffs/cycle-4-about-us-card-padding-S.md` — card padding no-op verification
- [ ] `docs/pl2/Previews/about-us.html` — canonical visual reference
- [ ] `docs/pl2/briefs/pl_design_brief.md` — token reference
- [ ] `docs/pl2/workflow-ofts.md` §"T — Tester" + §"S — Spec Auditor"

## Operating environment

- **Live URL set:**
  - Primary: `https://pl-performantlabs.com.3.ddev.site:8493/about-us`
  - Siblings (Cycle 3 cross-page consumers): `https://pl-performantlabs.com.3.ddev.site:8493/`, `https://pl-performantlabs.com.3.ddev.site:8493/services`, `https://pl-performantlabs.com.3.ddev.site:8493/open-source-projects`
- **Active theme:** `performant_labs_20260502` (verify with `ddev drush cget system.theme default`)
- **DDEV:** port 8493 from host; mkcert-trusted, no `-k`. SSL-chain workaround: `ddev exec curl http://localhost/<path>`.
- **Pa11y:** existing `.pa11yci.json` allowlist applies. PC-5 forbids editing it.
- **Visual-diff tooling (S):** Playwright + ImageMagick `compare` at `/opt/homebrew/bin/compare`.

## Tier 1 (T) — site-availability + structural sanity

Required checks (record every command + raw output):

1. **All 4 URLs return 200:** `/about-us`, `/`, `/services`, `/open-source-projects`.
2. **Active theme verified:** `ddev drush cget system.theme default` = `performant_labs_20260502`.
3. **Cycle 2 invariants:**
   - `dy-section--bio-block` count in /about-us rendered HTML = 0.
   - "Who we are." heading present exactly once.
   - `dy-section--centered-white` present (§A + §C).
   - 5 sections present (Hero, Track record, Open source, Dogfood, Closing CTA).
4. **Cycle 3 invariants:**
   - Served `base.css` carries `--pl-accent-deep-on-light: #8E4A2A` and zero `8C4E33` references.
   - On each of the 4 URLs: kicker text present (Track record / Dogfood on /about-us; Dogfooding on /; Capacity on /services; Testing tools on /open-source-projects).
5. **Cycle 4 invariants:**
   - Served `card.css` carries `padding: 3rem` rule on `.card[class*="theme"] .card__bottom`.
   - `/about-us` has 3 `card-canvas` component-start markers.
6. **Drupal log:** `ddev drush watchdog:show --count=20 --severity=error` — no NEW errors since Cycle 4 timestamp. Pre-existing errors (per Cycle 3 T handoff) on unrelated pages/components are OK to report as advisory.
7. **No `!important` introduced anywhere in the integration diff:** `git diff main..aa/pl-sprint-12-about-us-fidelity -- '*.css' | grep -c '^+.*!important'` returns 0.

## Tier 2 (T) — structural / ARIA / contrast

1. **Heading hierarchy on /about-us:** single h1; h2/h3 ordering preserved (no skipped levels).
2. **ARIA landmarks** present (banner / nav / main / contentinfo) on /about-us.
3. **Independent WCAG 2.2 contrast** (compute fresh, don't rely on prior cycles):
   - Kicker `#8E4A2A` on `#FFFFFF` (§A, §C) — confirm ≥ 4.5:1.
   - Kicker `#8E4A2A` on `#F5EFE2` (§B, §D) — confirm ≥ 4.5:1.
   - Kicker `#C97B5C` on `#1F1A14` (§E) — confirm ≥ 4.5:1.
   - Bio h3 `#2A2520` on `#FFFFFF` — confirm ≥ 4.5:1.
   - Bio body `#5C544C` on `#FFFFFF` — confirm ≥ 4.5:1.
   - Focus ring `#1893B4` on `#FFFFFF` and on `#F5EFE2` — confirm ≥ 3:1.
4. **Pa11y-ci** with the allowlist applied across the same 7-URL set used in prior cycles (or whatever set `.pa11yci.json` defines). PC-5 forbids editing the allowlist. Report 0 errors expected.

## Tier 3 (S) — visual fidelity sweep

Save artifacts to `docs/pl2/handoffs/screenshots/cycle-5/`.

### Primary: /about-us preview-vs-live at 1280 / 768 / 375

Full-page visual diffs vs preview at all three viewports. Naming: `t3-about-us-<viewport>-{live,preview,diff,composite}-20260512.png`. Report whole-page AE + delta % per PC-8 (informative).

### Per-section delta table — FULL re-audit

Re-verify every section row from Cycle 1's audit table, marking current status:

| Section | Cycle 1 status | Cycle 5 status |
|---|---|---|
| Header | DELTA — preview defective (FB-1, FB-2 silent-parked) | UNCHANGED — still silent-parked, NOT a regression |
| Hero (§A) | MATCH | (verify) |
| Track record (§B) | DELTA (kicker drift) | (verify — Cycle 3 should have flipped to MATCH) |
| Open source (§C) header | MATCH | (verify) |
| Open source (§C) cards | DELTA (outer padding) | (verify — Cycle 4 confirmed no-op MATCH) |
| Bio "Who we are." | REWORK (R9 violation) | (verify — Cycle 2 should have flipped to MATCH) |
| Dogfood (§D) | DELTA (kicker drift) | (verify — Cycle 3 should have flipped to MATCH) |
| Closing CTA (§E) | MATCH | (verify) |
| Footer | MATCH (gestalt) | (verify) |

Expected end state: all rows MATCH except Header (silent-parked preview defect — NOT a sprint regression).

### Sibling-fit spot-check at 1280

Quick gestalt verification (no formal diffs required — Cycle 3 S already did formal cross-page diffs, and Cycle 4 changed no code):

- `/` (homepage) — kicker "Dogfooding" reads `rgb(142, 74, 42)`. Cards render preview cadence.
- `/services` — kicker "Capacity" reads `rgb(142, 74, 42)`. Cards render preview cadence.
- `/open-source-projects` — kicker "Testing tools" reads `rgb(142, 74, 42)`. Cards render preview cadence.

### WCAG 2.2 AA full enumerated table (S)

Per memory `feedback_ofts_s_checklist_completeness.md`: enumerate every check, no trimming:

- Keyboard navigation (full tab walk through /about-us).
- Focus ring visibility on all focusable elements.
- Forced-colors mode (presumed family-verified).
- Reduced-motion (presumed family-verified).
- 200% zoom.
- Heading hierarchy.
- Image alt.
- Mobile touch targets (note: inline text-link exceptions per WCAG 2.5.8 are OK).
- Mobile typography scale.
- Mobile layout (no horizontal scroll at 375).
- Orphan words (no h1/h2/h3 orphans at any viewport).
- Independent contrast on all kicker/body/heading contexts (re-verify).

## Acceptance criteria

- [ ] T1 + T2 PASS — all binding invariants from Cycles 2/3/4 hold.
- [ ] Pa11y-ci 0 errors with unmodified allowlist (PC-5).
- [ ] S Tier-3 visual diffs produced at 3 viewports.
- [ ] All Cycle 1 section rows except Header now read MATCH; Header carries the unchanged silent-park note (NOT a regression).
- [ ] No regression on `/`, `/services`, `/open-source-projects` (gestalt).
- [ ] WCAG 2.2 AA full table re-runs clean.
- [ ] FB-1, FB-2, FB-3, FB-5, FB-6, FB-7, FB-8 acknowledged in S handoff as silent-parked / pre-existing / advisory; NOT re-raised as regressions.
- [ ] Verdict drives sprint wrap: PASS → O proceeds to integration → main merge + sprint-12-wrap.md. REWORK → O spawns F on the specific finding. ADVISORY-HOLD → silent-park per PC-9.

## Operator-facing HTML report

Produce `docs/pl2/handoffs/cycle-5-about-us-wrap-verify-report.html`: verdict banner, plain-English summary citing each cycle's contribution, per-viewport wipe-slider for /about-us, the per-section status table, sibling-fit gestalt confirmations, and the full WCAG 2.2 AA table. Self-contained.

## Handoff locations

- `docs/pl2/handoffs/cycle-5-about-us-wrap-verify-T.md` — T verdict + raw evidence
- `docs/pl2/handoffs/cycle-5-about-us-wrap-verify-S.md` — S Tier-3 sweep + WCAG table + verdict
- `docs/pl2/handoffs/cycle-5-about-us-wrap-verify-report.html` — operator-facing report

## Out of scope for this cycle

- Code edits (verification-only cycle; no F spawn).
- Reopening silent-parked items (FB-1, FB-2 are out — preview-side, not live).
- Brief-vs-preview reconciliation (FB-8 is operator decision at wrap, not a sprint regression).
- Pre-existing dead CSS at `dy-section.css:483` (FB-5).
- Watchdog errors that pre-date Cycle 3 timestamp (Cycle 3 T already noted these as pre-existing on other pages).

## Pre-commitments inherited

PC-1 (brief tokens win); PC-5 (pa11y allowlist locked); PC-8 (per-section AE binding; whole-page AE informative); PC-9 (silent-park ADVISORY-HOLD); PC-10 (hard-stop floor — site availability broken on shipped pages, new WCAG regression).

## Commit message (drafted by O at cycle close)

`docs(sprint-12): cycle 5 — sprint wrap verification sweep (T → S)`
