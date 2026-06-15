# Sprint 19 wrap — Sub-pages preview-fidelity (HQ ImageMagick diff)

**Date:** 2026-05-15
**Integration branch:** `aa/pl-sprint-19-subpages-fidelity-hq`
**Outcome:** AUDIT-ONLY — no code changes.

---

## Verdict

**PASS (audit-only).** One S-only cycle audited three sub-pages. No live regressions. All divergence is preview-ahead-of-live (aspirational design); operator confirmed previews are correct as-is and live-build work is deferred.

---

## Pages audited

| Page | Live URL | HQ result |
|---|---|---|
| ATK product | `/automated-testing-kit` | Preview has `book-hero` CTA pair + 5-card `.features` grid not yet on live |
| ATK introduction | `/introduction` | Live body is an empty stub; preview has 3 authored H2 content sections |
| Article detail | `/articles/introducing-layout-builder-kit-beta-1` | Article body matches tightly (AE ≤ 7 px); preview `aside.article-cta` not on live |

HQ method (DSSIM + PSNR + fuzz-AE @ 2× DPR, chrome mask, anchored crops) applied per Sprints 14–18. PC-12 probe discipline + PC-14 detail-page convention held.

---

## Operator decision (2026-05-15)

All five gated decisions resolved as **keep preview content; defer live build**:

1. ATK book-hero CTA pair — keep in preview.
2. ATK 5-card features grid — keep in preview.
3. `/introduction` body sections — keep in preview; live node content to be authored later.
4. Article-detail `aside.article-cta` — keep in preview; live template hook to be added later.
5. Footer H3/H4 column heading (F-NEW-16-H) — remains sitewide carry-forward.

Rationale: the previews correctly represent intended design. Trimming them to match an incomplete live would destroy design intent. The gap is live-not-caught-up, not preview-defective.

---

## Live-build follow-ups (logged for a future sprint)

These are NOT preview-fidelity defects — they are live-theme / content-authoring tasks:

- **L19-1** — `/automated-testing-kit`: build the `book-hero` CTA pair + 5-card features grid on live (theme + Canvas content).
- **L19-2** — `/introduction`: author the 3 H2 content sections into the Drupal node body.
- **L19-3** — `/articles/introducing-layout-builder-kit-beta-1`: add an `aside.article-cta` render hook to the article template.

Each is a live-theme/content sprint, not a preview-fidelity cycle.

---

## Preview-fidelity loop — fully complete

All 10 preview files have now been HQ-audited against live:

**7 main pages** (Sprints 14–18): `/`, `/services`, `/about-us`, `/how-we-do-it`, `/contact-us`, `/open-source-projects`, `/articles`.
**3 sub-pages** (Sprint 19): `/automated-testing-kit`, `/introduction`, `/articles/introducing-layout-builder-kit-beta-1`.

Remaining open items are all either sitewide carry-forwards (F-NEW-4, body-lg, display-md lh, F-NEW-16-H, hero-H1 orphans) or the three live-build follow-ups above. No preview-fidelity defects remain.

---

## Ready for merge to local `main`

Per memory `project_local_only_main.md`: `--no-ff` merge. No push, no PR.
