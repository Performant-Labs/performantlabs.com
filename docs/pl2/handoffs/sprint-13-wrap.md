# Sprint 13 wrap — preview consistency pass

**Date:** 2026-05-12
**Integration branch:** `aa/pl-sprint-13-preview-consistency`
**Scope:** docs-only — `docs/pl2/Previews/*.html`. No live theme code, no Drupal templates, no Canvas content.

---

## Verdict

**PASS — all 9 preview files now share canonical chrome.** `homepage.html` + `services.html` (post-Cycle 1) are the baseline; the 8 remaining previews were rewritten to match. 3 F cycles, 3 T verifications, 1 re-verification round on Cycle 3.

---

## Goal

The preview HTML files in `docs/pl2/Previews/` had drifted into mutually inconsistent chrome — different header patterns, different footer conventions, different contact-URL conventions, different em-dash encodings, different title shapes. This made every prior preview-fidelity audit (Sprints 5, 6, 12) carry baseline-vs-baseline noise. Sprint 13 normalizes the previews against each other using `homepage.html` + `services.html` as the canonical pair, so future page sprints can audit live-vs-preview cleanly.

---

## Operator decisions locked (kickoff)

| # | Decision | Resolution |
|---|---|---|
| 1 | Canonical chrome | Hybrid: homepage's no-CTA-pill + hamburger + services's breadcrumb + `.is-current` + real-path hrefs |
| 2 | Contact URL | `/contact-us` globally |
| 3 | Service label | "Test-suite takeover" globally |
| 4 | ATK + article-family title pattern | Unify to preview-suite shape `Performant Labs — <name> preview (teal + terracotta)` |
| 5 | Focus-ring spec | 3px dotted `#1893B4` (memory + live win; brief is stale) |
| 6 | F-4 cross-cutting tidy | Roll into F-2/F-3 (skip-link + `<main>` landmark added per file) |

---

## Cycle log

### Cycle 1 — `services.html` baseline fix (must land first)
- Branch: `aa/pl-sprint-13-cycle-1-services-baseline`
- F: removed `.site-header__cta` pill + CSS; added hamburger button (44×44, `aria-expanded`, `aria-label="Open menu"`) + CSS + `@media (max-width: 991px)` rule; added skip-to-main link as first focusable; wrapped body in `<main id="main" role="main">`; replaced `/contact` → `/contact-us`.
- T: 13/13 PASS at 1280/768/375; pixel-perfect parity with `homepage.html` header at 768/375; 1280 diff = `is-current` teal highlight on Services link (correct).
- Diff: 1 file, +69/-5.
- Merge: commit `e7c3a869d`.

### Cycle 2 — 5 regular page previews
- Branch: `aa/pl-sprint-13-cycle-2-regular-pages`
- Targets: `about-us.html`, `contact-us.html`, `how-we-do-it.html`, `articles.html`, `open-source-projects.html`
- F: applied Cycle 1 chrome pattern to all 5; normalized footer signature to `/contact-us` + UTF-8 `→`.
- T: 14/14 PASS per file. Header HTML structurally identical to `services.html` across all 5 (only per-page `is-current` differs, correct). Pre-existing `ERR_CERT_COMMON_NAME_INVALID` console warnings on `articles.html` flagged advisory (img src to ddev domain — not introduced).
- Diff: 5 files, +344/-19.
- Merge: commit `c66153fd1`.

### Cycle 3 — ATK + article-family previews
- Branch: `aa/pl-sprint-13-cycle-3-atk-article-family`
- Targets: `automated-testing-kit.html`, `automated-testing-kit-introduction.html`, `article-introducing-layout-builder-kit-beta-1.html`
- F: chrome rewrite + entity normalization (`&mdash;` → `—`, `&copy;` → `©`, `&rarr;` → `→`) + title unification to preview-suite shape.
- T (round 1): blocking — hamburger CSS landed but `<button>` markup missing (sed conditional branch silently failed). F-resume patched markup verbatim from `services.html`.
- T (round 2): all 4 previously-failing checks PASS; remaining 12 checks unchanged PASS.
- Diff: 3 files, +211/-25.
- Merge: commit `2bde4bd78`.

---

## Total impact

```
 9 files changed, 633 insertions(+), 49 deletions(-)
```

| File | Before | After |
|---|---|---|
| `services.html` | CTA pill + no hamburger + no main + no skip-link | canonical (no pill, hamburger, main, skip-link) |
| `homepage.html` | already canonical | unchanged (baseline reference) |
| `about-us.html` | CTA pill + no hamburger + no skip-link + `/contact` | canonical |
| `contact-us.html` | CTA pill + no hamburger + no skip-link | canonical |
| `how-we-do-it.html` | CTA pill + no hamburger + no skip-link | canonical |
| `articles.html` | CTA pill + no hamburger + no skip-link + `/contact` | canonical |
| `open-source-projects.html` | CTA pill + no hamburger + no skip-link + `/contact` | canonical |
| `automated-testing-kit.html` | CTA pill + no hamburger + no skip-link + production title + entity em-dash | canonical + preview-suite title |
| `automated-testing-kit-introduction.html` | CTA pill + no hamburger + no skip-link + production title + entity em-dash | canonical + preview-suite title |
| `article-introducing-layout-builder-kit-beta-1.html` | CTA pill + no hamburger + no skip-link + production title + entity arrows + `/contact` | canonical + preview-suite title |

---

## Cross-file canonical chrome (post-Sprint-13)

Every preview now ships:
- `<a class="skip-link" href="#main">Skip to main content</a>` as first focusable
- `<header class="site-header theme--white">` with: logo + 6 inline nav links (≥992) + hamburger `<button>` (≤991, 44×44, `aria-expanded`)
- `<main id="main" role="main">` wrapping body
- Footer with multi-column links, `©` UTF-8 copyright span, signature linking to `/contact-us` with UTF-8 `→`
- `:root` design tokens identical
- Font stack identical (Rubik 300–600 + Poppins 400/500/600/800)
- `text-wrap: balance` on headings (per memory `feedback_no_orphan_words`)

---

## Findings carried forward (not addressed this sprint)

- **F-NEW-1** (preview hero H1 desktop short 64 → 72): not addressed; tracked from `/about-us` re-audit. Action: raise `display-xl` desktop value in preview CSS if/when a "preview-typography-pass" sprint opens.
- **F-NEW-2** (live hero H1 mobile short 36 → 44 vs brief 44): live-side; tracked separately for an L1-token sprint with cross-page sweep.
- **FB-8** (card padding 32 brief vs 48 live+preview): unchanged operator-decision item from Sprint 12 wrap.
- **Brief vs memory focus-ring spec divergence:** decision locked at memory's `3px dotted #1893B4`. Brief should be updated to match in a docs-hygiene cycle (not this sprint).
- **Sitewide footer link target size < 24×24 (WCAG 2.2 2.5.8):** pre-existing site-wide pattern; deferred.
- **Primary CTA contrast 2.21:1 (WCAG 1.4.3):** carry-forward `ADV-S5` allowlist exception (Sprint 9).

---

## Files referenced

- `docs/pl2/handoffs/sprint-13-cycle-1-preview-consistency-audit.md` (Cycle 1 S audit; 8-target delta catalog)
- `docs/pl2/handoffs/sprint-13-cycle-1-about-us-reaudit.md` (Sprint-12 regression check; clean)
- `docs/pl2/handoffs/sprint-13-cycle-1-test-report.md`
- `docs/pl2/handoffs/sprint-13-cycle-2-test-report.md`
- `docs/pl2/handoffs/sprint-13-cycle-3-test-report.md`
- `docs/pl2/handoffs/screenshots/sprint-13-cycle-1-services/`, `sprint-13-cycle-2/`, `sprint-13-cycle-3/`

---

## Next sprint setup

Sprint 14 can now audit any live page against its canonical preview without baseline-vs-baseline noise. Recommended next target: continue the preview-fidelity loop on a non-baseline live page (candidates: `/how-we-do-it`, `/open-source-projects`, `/articles`, `/contact-us`). Each will use the same Cycle-1-audit / Cycle-2..N-fix shape codified in `docs/pl2/workflow-ofts.md`.
