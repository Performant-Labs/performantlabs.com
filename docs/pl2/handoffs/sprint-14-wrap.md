# Sprint 14 wrap — `/about-us` preview-fidelity (HQ ImageMagick diff)

**Date:** 2026-05-13
**Integration branch:** `aa/pl-sprint-14-about-us-fidelity-hq`
**Scope:** preview-doc + Canvas-content. No theme CSS files were modified this sprint.

---

## Verdict

**PASS — all three actionable findings from the HQ audit closed.** Three cycles, all PASS. The higher-quality DSSIM-primary diff method confirmed real visible deltas, surfaced two new findings (F-NEW-3, F-NEW-4) that the lower-quality Sprint 12/13 whole-page AE missed, and revealed that the apparent "live mobile H1 too small" finding (F-NEW-2) was a Canvas-content gap, not an L1 token problem.

---

## Cycle log

### Cycle 1 — S-only HQ audit (commit `b099fa4ea`)

- DSSIM-primary + PSNR + AE (fuzz 0% & 3%) at 2× DPR with Drupal-chrome mask.
- 5 durable capture/measure/diff/probe scripts; 84 PNGs; per-section bounding-box + chrome-mask data.
- Per-section DSSIM 0.17–0.26 across every section/viewport (all above the 0.05 REAL-DELTA floor).
- Findings: F-NEW-1, F-NEW-2, F-NEW-3, F-NEW-4 (new this cycle); F-NEW-5/6/7 (carry-forward sitewide typography drift).
- WCAG 32 criteria enumerated; zero `/about-us`-specific regressions.

### Cycle 2 — Preview-doc batch (commit `cf1e2528d`, merge `5d7b82009`)

- F-NEW-1: preview hero H1 desktop 64 → 72 px, letter-spacing -1.6 → -2 px.
- F-NEW-3: preview §E closing-CTA primary bg/color `#62BBCB`+white → `#5DC6E8`+`#1F1A14` (brief line 319 dark-zone; 8.81:1 AA).
- Light-zone CTAs (hero + §D) untouched; mobile rule untouched.
- 3 lines changed in `docs/pl2/Previews/about-us.html`.
- F PASS → T PASS → S PASS. S preview-vs-preview diff localized deltas exactly to H1 word stack + §E button.

### Cycle 3 — Mobile H1 44 px via landing-hero marker (merge after `5d7b82009`)

- Issue assumed L1 token raise + cross-page CSS cascade. F's 7-step trace revealed `--title-size` was already 44 px; the bug was the `/about-us` hero lacking the `landing-hero` marker class that the other landing pages already had.
- Fix scope narrowed from L1 cascade to Canvas-content + preview-doc. **Zero CSS files touched.**
- F: idempotent PHP script `scripts/sprint14-cycle3-about-us-landing-hero.php` (preserves `component_version=e6079b189d228dad`) + preview line 514 (40 → 44 px).
- S cross-page sweep: `/`, `/services`, `/how-we-do-it`, `/open-source-projects` all render H1 at 44 px with no horizontal scroll — pre-existing `landing-hero` markers continued firing the same FU-2 L5 rule.
- Desktop `/about-us` H1 still 72 px (Cycle 2 unchanged).
- WCAG 17.27:1 contrast.

---

## Method validation — HQ diff vs Sprint 12/13 AE-only

| Question | Sprint 12/13 AE-only | Sprint 14 HQ method |
|---|---|---|
| Whole-page AE % | 32–58% (over-reported; dominated by cumulative drift + Drupal chrome) | Whole-page metrics flagged "not load-bearing" up front (PC-8) |
| Per-section binding measurement | Anchored crop + AE | Anchored crop + DSSIM + PSNR + AE at fuzz 0% & 3% |
| Drupal-chrome noise | Acknowledged (FB-3) but not isolated | Explicit mask at top 320–446 px image-space @ 2× DPR; documented per viewport |
| Antialiasing / subpixel noise | Inflated AE | Absorbed by AE-3% fuzz mask; PSNR provides corroboration |
| New findings surfaced by upgrade | n/a | F-NEW-3 (preview §E CTA token), F-NEW-4 (CTA suffix-icon component); plus minor F-NEW-5 (display-md lh +1.2 px) |

The HQ method paid for itself: F-NEW-3 specifically would have stayed hidden under whole-page AE because §E's contribution to the whole-page diff was dominated by vertical drift. The DSSIM-per-section + visible diff PNG made the wrong primary-bg token jump out.

---

## Pages reviewed for preview-fidelity to date

- `/` (homepage) — original overhaul phases
- `/services` — Sprints 5 + 6
- `/about-us` — Sprints 10, 11, 12, 13 Cycle 1 re-audit, **Sprint 14**

`/about-us` is now in HQ-method parity with brief at the actionable level. Remaining deltas all map to documented carve items (silent-parked or carried forward).

---

## Silent-parked (autonomous-mode policy)

- **F-NEW-4 — CTA suffix-icon component delta.** Live primary CTA renders a 32-px SVG chevron-circle suffix via `dripyard_base:button` component (56 px pill); preview uses plain `<a class="btn--primary">` with inline `→` (45 px pill). Brief is silent on the suffix-icon. S recommended Option C (brief-doc clarification only; not a Sprint 14 cycle). Operator can revisit by opening a "CTA-component spec audit" sprint if cross-page CTA fidelity becomes a priority.

## Carried forward (out of `/about-us` scope)

| ID | Item | Recommended remediation |
|---|---|---|
| F-NEW-5 | live `display-md` line-height +1.2 px (45.2 vs brief 44) | Sitewide typography pass |
| F-NEW-6 | live body-lg = 16 (brief 18); preview = 17 | Sitewide body-lg token cycle |
| F-NEW-7 | live hero subhead = 20 (brief 18); preview = 19 | Same sitewide cycle |
| (Sprint 12) | open-source card-CTA structural delta (title-as-link vs separate footer link) | Operator-decision pending |
| (Cycle 3 advisory) | Sibling-page single-word orphans at 375 px on `/`, `/services`, `/how-we-do-it` (`confidence.` / `teams.` / `runs.`) despite `text-wrap: balance` | Copy-edit or `<wbr>` micro-cycle |

---

## Files touched this sprint

```
 docs/pl2/Previews/about-us.html                                      (Cycles 2 + 3)
 docs/pl2/pl-plan--sprint-14-about-us-fidelity-hq.md                  (kickoff)
 docs/pl2/handoffs/sprint-14-orchestrator-log.md                      (durable)
 docs/pl2/handoffs/sprint-14-cycle-{1-audit,1-report}.{md,html}       (Cycle 1)
 docs/pl2/handoffs/sprint-14-cycle-{2,3}-{issue,F,T,S,report}.{md,html}
 docs/pl2/handoffs/screenshots/sprint-14-cycle-{1,2,3}/               (~100+ PNGs)
 scripts/sprint-14-cycle-1-{capture,measure,diff,probe-body,probe-cta}.mjs
 scripts/sprint-14-cycle-2-preview-diff.mjs
 scripts/sprint-14-cycle-3-{capture,orphan}.mjs
 scripts/sprint14-cycle3-about-us-landing-hero.php
```

**No live theme CSS, Twig, or YAML files were modified.** All live behavior changes flowed through Canvas content (Cycle 3 marker patch). Preview docs absorbed the rest.

---

## Sprint 14 ready for merge to local `main`

Per memory `project_local_only_main.md`: merge `aa/pl-sprint-14-about-us-fidelity-hq` → `main` via `--no-ff`. No push, no PR.
