# Sprint 18 wrap — `/articles` preview-fidelity (HQ ImageMagick diff)

**Date:** 2026-05-13
**Integration branch:** `aa/pl-sprint-18-articles-fidelity-hq`
**Scope:** preview-doc only. No live code.

---

## Verdict

**PASS.** Two cycles. Final preview-fidelity page closed. Live↔preview DSSIM at 1280 dropped 0.502 → 0.205 (−59%). Sprint 9 visually-hidden `<h2>Articles</h2>` re-verified intact.

---

## Cycle log

### Cycle 1 — S-only HQ audit

- 5 actionable findings + 2 advisories.
- PC-12 probe discipline + PC-13 views-listing convention both held (zero false positives; card-content fluctuation correctly excluded).
- Sprint 9 a11y fix verified intact.

### Cycle 2 — preview-doc batch (A + B + C + D + E + F)

- `docs/pl2/Previews/articles.html` only.
- A active-state color, B card border, C card H3 color, D chip order, E mobile chip tap-target, F skip-link target.
- F PASS → T PASS → S PASS.

---

## Silent-parked / out-of-scope

- F-NEW-18-G H1 rect-height delta (cosmetic; ignore).
- PC-13 card-content fluctuation (views-listing convention).
- Pre-existing H1 → H3 heading skip on preview docs (sitewide preview pattern; not introduced this cycle; future a11y micro-cycle candidate).

---

## Sitewide carry-forwards (still open across all 7 pages)

- F-NEW-4 — CTA suffix-icon component delta (pending operator decision since Sprint 14)
- body-lg sitewide drift (live 16–20, preview 17–19, brief 18)
- `display-md` line-height (~1.13 live vs brief ≤ 1.10)
- F-NEW-16-H — Footer column heading level (live H3 vs preview H4)
- Hero-H1 orphan words at 375 on `/`, `/services`, `/how-we-do-it`, `/open-source-projects` §C — copy-edit / `<wbr>` micro-cycle candidate

---

## Preview-fidelity loop — complete

All 7 site pages have now been audited and remediated via HQ ImageMagick diff method:

1. `/` (homepage) — original overhaul + Sprint 14/15 cross-page sweeps
2. `/services` — Sprints 5 + 6
3. `/about-us` — Sprints 10, 11, 12, 13.1 re-audit, 14 (HQ)
4. `/how-we-do-it` — Sprint 15 (HQ; surfaced L3 cascade bug)
5. `/contact-us` — Sprint 16 (HQ + form WCAG)
6. `/open-source-projects` — Sprint 17 (HQ; Sprint 12 card-CTA carry-forward resolved)
7. `/articles` — Sprint 18 (HQ; views-listing audit profile)

HQ method paid for itself across the loop:
- Sprint 14: validated method on /about-us
- Sprint 15: surfaced real L3 cascade bug in `base.css`
- Sprint 16: surfaced 4 probe-selector errors → codified PC-12 enumeration discipline
- Sprint 17/18: PC-12 enforcement reduced false-positive rate to zero
- Sprint 18: PC-13 views-listing convention codified for future content-types

---

## Ready for merge to local `main`

Per memory `project_local_only_main.md`: `--no-ff` merge.
