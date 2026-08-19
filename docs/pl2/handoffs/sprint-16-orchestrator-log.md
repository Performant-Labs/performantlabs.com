# Sprint 16 — Orchestrator Log

**Sprint:** 16 — `/contact-us` preview-fidelity (HQ ImageMagick diff)
**Opened:** 2026-05-13
**Mode:** Autonomous
**Integration branch:** `aa/pl-sprint-16-contact-us-fidelity-hq`
**Runbook:** `docs/pl2/pl-plan--sprint-16-contact-us-fidelity-hq.md`

---

## Kickoff confirmation table

| Item | Value |
|---|---|
| Page | `/contact-us` |
| Project / slug | pl2 |
| Runbook | `docs/pl2/pl-plan--sprint-16-contact-us-fidelity-hq.md` |
| Workflow spec | `docs/pl2/workflow-ofts.md` |
| Handoff directory | `docs/pl2/handoffs/` |
| Branch pattern (integration) | `aa/pl-sprint-16-contact-us-fidelity-hq` |
| Branch pattern (cycle) | `aa/pl-sprint-16-cycle-N-[slug]` |
| Current phase | Cycle 1 — S-only HQ audit |
| Approval checkpoint rule | Autonomous; PC-1..PC-10 resolve every 🛑 |
| Env verified | live `/contact-us` HTTP 200 at kickoff |
| Diff method | DSSIM primary · PSNR + fuzz-AE secondary · 2× DPR · Drupal-chrome mask |
| Method template | Sprint 14/15 scripts |
| Special: form WCAG | First page in fidelity loop with a form; runbook §"Form-specific S checklist" enumerates form criteria |

---

## Known inheritances

- Preview canonicalized through Sprint 13 + Sprint 15 Cycle 4 (letter-spacing `-0.8 px`).
- `/contact-us` H1-clean per Sprint 8.
- `/form/contact` redirect intact per Sprint 8.
- pa11y allowlist covers `/contact-us` per Sprint 9.

---

## Cycle log

### Cycle 1 — S-only HQ preview-vs-live audit + form WCAG (2026-05-13)

- Verdict: **REWORK** — 7 actionable findings
- HQ method on `/contact-us` + full 33-criterion WCAG 2.2 AA + form-specific enumeration
- One live WCAG fail (new this cycle): **1.3.5 autocomplete tokens missing on live form** (F-NEW-16-B)
- Findings:
  - **F-NEW-16-A** — Sidebar H2 32 px live vs 22 px preview (live inherits `--h2-size`; preview has scoped rule)
  - **F-NEW-16-B** — Live form `autocomplete=null` on every field (WCAG 1.3.5 fail); preview correctly has `name`/`email`/`organization`/`tel`
  - **F-NEW-16-C** — Required-marker `*` color body (`#5C544C`) on live; brief mandates `--accent-deep` (`#8E4A2A`); preview correct
  - **F-NEW-16-D** — Sidebar card wrapper (hairline + 12 px radius + 32 px padding + sticky ≥ 992) missing on live
  - **F-NEW-16-E** — §C "What to expect" H2 32/24 px on live vs preview brief-correct 40/30 px
  - **F-NEW-16-F** — Closing-CTA primary uses `#62BBCB`+white on **both** live AND preview (Sprint 14/15 fixed preview-only on those pages; this preview was missed)
  - **F-NEW-16-G** — Closing-CTA two buttons stack vertically on live desktop; preview side-by-side
- Sitewide carry-forwards confirmed: F-NEW-4 (CTA suffix-icon), body-lg, footer H3/H4 inconsistency
- Scripts: `scripts/sprint-16-cycle-1-{capture,measure,diff,probe}.mjs`

### Cycle 2 — Form a11y batch (F-NEW-16-B + F-NEW-16-C) — MERGED

- Verdict: F PASS → T PASS → **S PASS**
- **F-NEW-16-B** — `hook_form_alter()` in theme adds `autocomplete="name|email|organization|tel"` to contact webform fields. WCAG 1.3.5 closed. Articles exposed-form preserved via conditional restructure.
- **F-NEW-16-C** — **Probe error correction** (1st). Required marker uses mask-image + `background-color` (not `color`); existing `webform.css` rule already correct. No-op verified.
- Only file changed: `performant_labs_20260502.theme`

### Cycle 3 — Sidebar + CTA pair (F-NEW-16-A + F-NEW-16-D + F-NEW-16-G) — MERGED

- Verdict: F PASS → T PASS → **S PASS**
- **F-NEW-16-A** — new `.contact-sidebar .heading` rule in `webform.css` (22 / 1.25 / -0.2 / wt 500). No cascade widening.
- **F-NEW-16-D** — **Probe error correction** (2nd). Existing webform.css D5 rules already render the card chrome (border/radius/padding/sticky). No-op verified.
- **F-NEW-16-G** — Canvas patch adds `dy-section--cta-pair` marker to canvas_page id=13 idx=20. Closing-CTA buttons side-by-side at 1280/768, stacked at 375. Cross-page sanity PASS.
- Pixel diff scoped exactly to sidebar + CTA row regions; zero bleed.

### Cycle 4 — Token batch (F-NEW-16-E + F-NEW-16-F) — MERGED

- Verdict: F PASS → T PASS → **S PASS** (no-op-on-live confirmed via independent S probe)
- **F-NEW-16-E** — **Probe error correction** (3rd). Cycle 1 probe script measured `h2s[0]` (sidebar) and `h2s[length-1]` (closing-H2); missed mid-DOM §C H2. Live §C H2 already 40/30 px (Sprint 15 Cycle 3 cascade fix made it correct). No live change needed.
- **F-NEW-16-F** — **Probe error correction** (4th). Cycle 1 probed form submit button (light-zone) instead of closing-CTA primary (dark-zone). Live closing-CTA primary already `#5DC6E8` + `#1F1A14` via `theme--dark .button--primary` override. No live change needed.
- Only code change: preview-doc `.closing-cta .btn--primary` rule in `docs/pl2/Previews/contact-us.html` (Sprint 14/15 Cycle 2 precedent).
- **Process gap surfaced (wrap):** Sprint 16 Cycle 1 audit had 4 probe-selector gaps that produced 4 false-positive findings (C, D, E, F). The HQ DSSIM-per-section correctly flagged real visible deltas, but probe scripts that don't enumerate all H2s / specific section CTAs can't pin down which token/element is wrong. Recommended: future probes enumerate every H2 + primary CTA with section ancestor.

---

## Sprint close

Actionable findings from Cycle 1 (7 raw → 3 real after probe corrections):
- F-NEW-16-A — sidebar H2 size → Cycle 3 ✅
- F-NEW-16-B — form autocomplete tokens (WCAG 1.3.5) → Cycle 2 ✅
- F-NEW-16-C — required marker color → **Cycle 2 no-op verified** (probe error)
- F-NEW-16-D — sidebar card wrapper → **Cycle 3 no-op verified** (probe error)
- F-NEW-16-E — §C H2 size → **Cycle 4 no-op verified** (probe error)
- F-NEW-16-F — §D primary CTA token → **Cycle 4 preview-doc only** (live already correct; probe error)
- F-NEW-16-G — closing-CTA layout → Cycle 3 ✅

Three real fixes landed: B + A + G. Four no-op verifications (all probe-selector errors). One preview-doc edit.

Carry-forwards (unchanged from Cycle 1):
- F-NEW-4 — CTA suffix-icon component
- body-lg sitewide drift
- `display-md` line-height (live ~1.13)
- F-NEW-16-H — footer column heading level (live H3 vs preview H4)

Next: `sprint-16-wrap.md`; merge integration → `main` `--no-ff`.
