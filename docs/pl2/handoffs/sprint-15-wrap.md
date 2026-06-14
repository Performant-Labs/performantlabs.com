# Sprint 15 wrap — `/how-we-do-it` preview-fidelity (HQ ImageMagick diff)

**Date:** 2026-05-13
**Integration branch:** `aa/pl-sprint-15-how-we-do-it-fidelity-hq`
**Scope:** preview-doc + 1 L3 cascade fix in `base.css`. No Twig, no Canvas content, no YAML.

---

## Verdict

**PASS — all actionable findings closed.** Four cycles, all PASS. Higher-quality DSSIM-primary diff method (Sprint 14 codified) ran cleanly on a fresh page and surfaced a real L3 source-order cascade bug that lower-quality methods would have classified as "value mismatch" rather than diagnosed as a dead-rule cascade fault.

---

## Cycle log

### Cycle 1 — S-only HQ audit

- HQ method on `/how-we-do-it`: DSSIM + PSNR + AE (fuzz 0% / 3%) @ 2× DPR, chrome mask, anchored crops.
- Per-section DSSIM 0.17–0.30 across every section/viewport.
- 3 actionable findings:
  - F-NEW-15-A — `display-md` H2 mobile mismatch (live 40 / preview 30 / brief 30)
  - F-NEW-15-B — orphan "runs." on hero H1 at 375 despite `text-wrap: balance`
  - F-NEW-15-C — preview §E primary CTA token (`#62BBCB`+white vs brief `#5DC6E8`+`#1F1A14`)
- **Runbook expectation invalidated:** runbook called for heal-flow attention; `/how-we-do-it` has no heal-flow (it's on the homepage per brief).
- WCAG 32 criteria enumerated; zero `/how-we-do-it`-specific regressions.

### Cycle 2 — Preview-doc §E CTA token (F-NEW-15-C)

- 2 lines added in `docs/pl2/Previews/how-we-do-it.html`.
- Identical pattern as Sprint 14 F-NEW-3 on `about-us.html`.
- F PASS → T PASS → S PASS. WCAG primary 8.81:1, hover 7.53:1.

### Cycle 3 — `display-md` H2 mobile L3 cascade fix (F-NEW-15-A)

- **Root cause (F's diagnosis):** CSS source-order bug in `web/themes/custom/performant_labs_20260502/css/base.css`. Unconditional `:root { --h2-size: 2.5rem }` (40 px) declared AFTER `@media (max-width: 576px) { :root { --h2-size: 1.875rem } }` (30 px) — mobile override was dead at every viewport.
- **Fix:** wrap desktop assertion in `@media (min-width: 577px)`. Structural wrap, zero value changes.
- Preview also got letter-spacing `-0.6 → -0.8 px` to align with brief.
- **Cross-page sweep PASS (S, mandatory PC-3):** 6 pages × 3 viewports = 18 cells. All `display-md` H2s now 30 px at 375 sitewide. Desktop unchanged. No horizontal scroll.
- Brief mobile `display-md` = 30 px (existing dead block had the right value).

### Cycle 4 — Preview-doc letter-spacing sweep

- 5 sibling previews carried `-0.6 px` letter-spacing post-Cycle-3 (Cycle 3 S Advisory 1).
- Mechanical sweep: 5 single-character swaps across `homepage.html`, `services.html`, `about-us.html`, `open-source-projects.html`, `contact-us.html`.
- Sub-perceptual (0.44% at 375 representative); desktop unchanged.

---

## Method validation reprise

- **Surfaced a genuine cascade bug** (Cycle 3) — per-section DSSIM ~0.20 at 375 across §B/§C/§D wasn't typography drift but a dead override no whole-page AE could have isolated.
- **Cross-page sweep enabled by 2× DPR captures** (Cycle 3 S) — unambiguous post-fix evidence across 6 pages.
- **Runbook expectation invalidated cleanly** via S-only Cycle 1 (heal-flow misattribution caught without F/T overhead).

---

## Pages reviewed for preview-fidelity to date

- `/` (homepage)
- `/services`
- `/about-us`
- `/how-we-do-it` (this sprint)

---

## Silent-parked

- **F-NEW-15-B** — orphan "runs." on hero H1 at 375. Operator-decision; default Option C ("accept") per PC-9 + Sprint 14 F-NEW-4 precedent. Future copy-edit / `<wbr>` micro-cycle can batch with `/` "confidence." and `/services` "teams."
- **F-NEW-4 (Sprint 14)** — CTA suffix-icon component delta; still pending operator decision; confirmed unchanged on `/how-we-do-it`.

## Carried forward

| ID | Item | Recommended remediation |
|---|---|---|
| body-lg | Live + preview both deviate from brief 18 px | Sitewide body-lg token cycle |
| `display-md` lh | Live 1.13 vs brief ≤ 1.10 | Same sitewide typography cycle |
| F-NEW-4 | CTA suffix-icon component | CTA-component spec audit |
| Orphans | Hero-H1 orphans at 375 on 3 pages | Copy-edit / `<wbr>` micro-cycle |
| Sprint 12 carry | Open-source card-CTA structural delta | Operator-decision pending |

---

## Files touched this sprint

```
 web/themes/custom/performant_labs_20260502/css/base.css                 (Cycle 3 — only live file)
 docs/pl2/Previews/how-we-do-it.html                                     (Cycles 2 + 3)
 docs/pl2/Previews/{homepage,services,about-us,open-source-projects,contact-us}.html  (Cycle 4)
 docs/pl2/pl-plan--sprint-15-how-we-do-it-fidelity-hq.md                 (kickoff)
 docs/pl2/handoffs/sprint-15-{orchestrator-log,wrap}.md                  (durable)
 docs/pl2/handoffs/sprint-15-cycle-{1-audit,1-report}.{md,html}
 docs/pl2/handoffs/sprint-15-cycle-{2,3,4}-{issue,F,T,S,report}.*
 docs/pl2/handoffs/screenshots/sprint-15-cycle-{1,2,3,4}/
 scripts/sprint-15-cycle-1-{capture,measure,diff,probe}.mjs
 scripts/sprint-15-cycle-2-verify.mjs
 scripts/sprint-15-cycle-3-{capture,capture-prefix,capture-prefix-desktop}.mjs + diff.sh
 scripts/sprint-15-cycle-4-render.mjs
```

**One live theme file modified** (`base.css`, structural `@media` wrap). No Twig, no Canvas content, no YAML.

---

## Ready for merge to local `main`

Per memory `project_local_only_main.md`: `--no-ff` merge. No push, no PR.
