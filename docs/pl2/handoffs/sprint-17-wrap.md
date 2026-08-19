# Sprint 17 wrap — `/open-source-projects` preview-fidelity (HQ ImageMagick diff)

**Date:** 2026-05-13
**Integration branch:** `aa/pl-sprint-17-open-source-projects-fidelity-hq`
**Scope:** preview-doc only. No live code.

---

## Verdict

**PASS.** Two cycles. Cycle 1 S-only audit catalogued 6 findings with PC-12 probe discipline (zero probe-selector false positives this sprint, vs Sprint 16's 4-of-7). Cycle 2 landed 4 preview-doc fixes; 2 silent-parked.

---

## Cycle log

### Cycle 1 — S-only HQ audit

- 6 findings catalogued. PC-12-compliant probes enumerated every H2 + every card per side. Zero false positives.

### Cycle 2 — preview-doc batch (CARD + A + B + D)

- `docs/pl2/Previews/open-source-projects.html` (+21/-57 lines)
- **CARD** — PC-11 default applied (live canonical; preview cards now use title-as-link). 2.4.4 link purpose improves.
- **A** — ink-strong `#1F1A14` unifies hero H1 + card H3 color (Sprint 13–16 sitewide baseline).
- **B** — hero `.hero__inner` max-width `920 → 1040` (H1 wraps 1 line at 1280 matching live).
- **D** — Payment Stripe card added (live had 7, preview had 6).
- F+T+S PASS. Per-section DSSIM (post-prev vs Cycle 1 prev) confirms scoped fix signal exactly where Cycle 2 changed the preview.

---

## Silent-parked

- **F-NEW-17-C** — §C H2 orphan "contributions" at 375 on both renders. PC-9 Option C accept (matches Sprint 14 F-NEW-4 + Sprint 15 F-NEW-15-B pattern). Future copy-edit / `<wbr>` micro-cycle candidate.
- **F-NEW-17-E** — Closing-CTA chrome carry F-NEW-4 (sitewide CTA suffix-icon component delta).
- **Advisory:** Single Payment Stripe card at full-width centering — live centers, preview places in column 1 of 3-up grid. Not a regression; future `.other-modules .project-grid:has(.project-card:only-child)` rule candidate.

## Carry-forwards (sitewide)

- F-NEW-4 CTA suffix-icon
- body-lg drift
- `display-md` line-height (~1.13 live)
- F-NEW-16-H footer column heading level
- Hero-H1 orphans at 375 (now on 4 pages: `/`, `/services`, `/how-we-do-it`, `/open-source-projects` §C)

---

## Pages reviewed for preview-fidelity to date

- `/`, `/services`, `/about-us`, `/how-we-do-it`, `/contact-us`, `/open-source-projects` (this sprint)

Remaining: `/articles` (views-listing, different audit profile).

---

## Ready for merge to local `main`

Per memory `project_local_only_main.md`: `--no-ff` merge.
