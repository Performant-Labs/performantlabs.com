# Sprint 15 — Orchestrator Log

**Sprint:** 15 — `/how-we-do-it` preview-fidelity (HQ ImageMagick diff)
**Opened:** 2026-05-13
**Mode:** Autonomous
**Integration branch:** `aa/pl-sprint-15-how-we-do-it-fidelity-hq`
**Runbook:** `docs/pl2/pl-plan--sprint-15-how-we-do-it-fidelity-hq.md`

---

## Kickoff confirmation table

| Item | Value |
|---|---|
| Page | `/how-we-do-it` |
| Project / slug | pl2 |
| Runbook | `docs/pl2/pl-plan--sprint-15-how-we-do-it-fidelity-hq.md` |
| Workflow spec | `docs/pl2/workflow-ofts.md` |
| Handoff directory | `docs/pl2/handoffs/` |
| Branch pattern (integration) | `aa/pl-sprint-15-how-we-do-it-fidelity-hq` |
| Branch pattern (cycle) | `aa/pl-sprint-15-cycle-N-[slug]` |
| Current phase | Cycle 1 — S-only HQ audit |
| Approval checkpoint rule | Autonomous; PC-1..PC-10 resolve every 🛑 |
| Env verified | live `/how-we-do-it` HTTP 200 at kickoff |
| Diff method | DSSIM primary · PSNR + fuzz-AE secondary · 2× DPR · Drupal-chrome mask |
| Method baseline | Sprint 14 scripts (`scripts/sprint-14-cycle-1-*.mjs`) are the reusable HQ template |

---

## Known inheritances

- Sprint 14 Cycle 3 advisory — `/how-we-do-it` produces orphan "teams." at 375 px on hero H1. Expected in Cycle 1.
- `landing-hero` marker confirmed present (Sprint 14 cross-page sweep).
- Heal-flow SVG: mobile horizontal-scroll-in-container pattern per brief.

---

## Cycle log

### Cycle 1 — S-only HQ preview-vs-live audit (2026-05-13)

- Branch: integration (S-only)
- Verdict: **REWORK** — 3-cycle carve recommended
- Per-section DSSIM 0.17–0.30 across every section/viewport (above 0.05 REAL floor)
- Findings:
  - **F-NEW-15-A** — H2 `display-md` mobile mismatch at 375 (live 40 / preview 30 / brief ~32). L1 + cross-page sweep candidate (F trace may narrow).
  - **F-NEW-15-B** — orphan word "runs." on hero H1 at 375 despite `text-wrap: balance` active. Operator-decision (A: `<wbr>`, B: copy edit, C: accept).
  - **F-NEW-15-C** — preview §E primary CTA token wrong (`#62BBCB`+white instead of brief 319's `#5DC6E8`+`#1F1A14`). Same defect as Sprint 14 F-NEW-3, now on a different preview file. Preview-doc only.
- **Runbook expectation invalidated:** runbook called for heal-flow special attention, but `/how-we-do-it` has no heal-flow. The brief consistently places heal-flow on the homepage. Documented as advisory; no action.
- Sprint 14 carry-forwards confirmed still present (body-lg drift, CTA suffix-icon component, Drupal-richer footer) — sitewide scope, not this sprint.
- Scripts: `scripts/sprint-15-cycle-1-{capture,measure,diff,probe}.mjs`
- Commit: pending

### Cycle 2 — Preview-doc §E CTA token (F-NEW-15-C) — MERGED

- Branch: `aa/pl-sprint-15-cycle-2-preview-doc` → merged `--no-ff` into integration
- Verdict: F PASS → T PASS → **S PASS**
- 2 lines added in `docs/pl2/Previews/how-we-do-it.html` (`.closing-cta .btn--primary` + `:hover`)
- WCAG: primary 8.81:1, hover 7.53:1 (F overstated as 9.39:1; informational)
- Preview-vs-preview AE 1.14% bounded to button footprint only
- O restored Cycle 1 baselines from commit `683958c98` before commit (F's capture re-ran the script)

### Cycle 3 — `display-md` H2 mobile (F-NEW-15-A) — MERGED

- Branch: `aa/pl-sprint-15-cycle-3-display-md-mobile` → merged `--no-ff` into integration
- Verdict: F PASS → T PASS → **S PASS** (6 pages × 3 viewports = 18 cells, all PASS)
- **Root cause:** CSS source-order cascade bug in `base.css`. Unconditional `:root { --h2-size: 2.5rem }` (40 px) declared AFTER `@media (max-width: 576px) { :root { --h2-size: 1.875rem } }` (30 px) — mobile override was dead code.
- **Fix:** wrap desktop assertion in `@media (min-width: 577px)`. L3 sitewide cascade; structural wrap only, no value changes.
- Preview also: letter-spacing `-0.6 → -0.8 px` on `how-we-do-it.html` mobile rule.
- Brief mobile `display-md` = 30 px (not the audit's ~32 guess). Existing mobile block was correct, just dead.
- S cross-page sweep: `/`, `/services`, `/about-us`, `/how-we-do-it`, `/open-source-projects`, `/contact-us` — all H2s now 30 px at 375. Desktop unchanged. No horizontal scroll. WCAG contrast unchanged.
- S advisories filed: 5 sibling previews retain `-0.6 px` letter-spacing → Cycle 4. Line-height carry-forwards still pre-existing (sitewide).

### Cycle 4 — Preview-doc letter-spacing sweep — MERGED

- Branch: `aa/pl-sprint-15-cycle-4-preview-letter-spacing-sweep` → merged `--no-ff` into integration
- Verdict: F PASS → T PASS → **S PASS**
- 5 preview files updated: `homepage.html`, `services.html`, `about-us.html`, `open-source-projects.html`, `contact-us.html`
- Each: single-character `-0.6px → -0.8px` swap inside `@media (max-width: 767px)` on `.section-head h2`
- Sub-perceptual visual change (0.44% pixel diff at 375 representative sample); desktop unchanged

---

## Sprint close

Actionable findings from Cycle 1 HQ audit:
- F-NEW-15-A (display-md H2 mobile) → Cycle 3 ✅ (L3 cascade fix; cross-page sweep PASS)
- F-NEW-15-C (preview §E CTA token) → Cycle 2 ✅
- F-NEW-15-B (orphan "runs.") → **silent-parked per PC-9** (operator-decision; default Option C "accept")

Bonus mechanical sweep:
- Sibling-preview letter-spacing alignment (from Cycle 3 S advisory) → Cycle 4 ✅

Carried forward (sitewide, out of `/how-we-do-it` scope):
- F-NEW-4 (CTA suffix-icon component delta) — Sprint 14 silent-park continues
- body-lg sitewide drift
- `display-md` line-height drift (live 1.13 vs brief ≤ 1.10) — pre-existing
- Sprint 14 sibling-page orphans on `/` ("confidence.") and `/services` ("teams.") — copy-edit / `<wbr>` micro-cycle candidate
- Open-source card-CTA structural delta (Sprint 12 carry-forward, operator-decision pending)

Next: write `sprint-15-wrap.md`; merge integration → local `main` `--no-ff`.
