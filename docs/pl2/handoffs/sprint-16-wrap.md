# Sprint 16 wrap — `/contact-us` preview-fidelity (HQ ImageMagick diff + form WCAG)

**Date:** 2026-05-13
**Integration branch:** `aa/pl-sprint-16-contact-us-fidelity-hq`
**Scope:** 1 live theme hook, 1 live theme CSS rule, 1 Canvas content patch, 2 preview-doc edits. No Twig templates, no YAML config.

---

## Verdict

**PASS — all real findings closed; one new live WCAG regression (1.3.5) eliminated.** Four cycles, all PASS. Cycle 1 surfaced 7 candidate findings; trace + independent probes resolved 4 as false positives (probe-selector errors) and 3 as real fixes that landed cleanly.

---

## Cycle log

### Cycle 1 — S-only HQ audit + form WCAG enumeration

- HQ method (DSSIM primary, 2× DPR, chrome mask) + full 33-criterion WCAG 2.2 AA + form-specific criteria.
- **One new live WCAG fail surfaced:** 1.3.5 (form `autocomplete` tokens missing) — F-NEW-16-B.
- 7 candidate findings catalogued (F-NEW-16-A through G) plus advisory F-NEW-16-H (footer heading level).

### Cycle 2 — Form a11y (F-NEW-16-B + F-NEW-16-C)

- **F-NEW-16-B** — `hook_form_alter()` in `performant_labs_20260502.theme` adds `autocomplete="name|email|organization|tel"`. Articles exposed-form preserved via conditional restructure. Watchdog clean.
- **F-NEW-16-C** — Probe error (1st): required-marker uses mask-image + `background-color`, not `color`. Existing webform.css rule already correct.

### Cycle 3 — Sidebar + CTA pair layout (F-NEW-16-A + F-NEW-16-D + F-NEW-16-G)

- **F-NEW-16-A** — new `.contact-sidebar .heading` rule in `webform.css` (22 / 1.25 / -0.2 / wt 500). No cascade widening.
- **F-NEW-16-D** — Probe error (2nd): existing D5 rules already render card chrome.
- **F-NEW-16-G** — Canvas patch (idempotent, preserves `component_version`) adds `dy-section--cta-pair` marker to canvas_page id=13 idx=20. CTAs now side-by-side at 1280/768, stacked at 375. Cross-page sanity PASS on `/about-us` + `/services`.

### Cycle 4 — Token batch (F-NEW-16-E + F-NEW-16-F)

- **F-NEW-16-E** — Probe error (3rd): Cycle 1 probe script measured `h2s[0]` (sidebar) and `h2s[length-1]` (closing-H2) only; mid-DOM §C H2 was inferred from DSSIM not measured. Live §C H2 already 40/30 via Sprint 15 Cycle 3 cascade fix.
- **F-NEW-16-F** — Probe error (4th): Cycle 1 probed form submit (light-zone) instead of closing-CTA primary (dark-zone). Live already `#5DC6E8` + `#1F1A14` via `theme--dark .button--primary` override.
- Only change this cycle: preview-doc `.closing-cta .btn--primary` rule (matches Sprint 14/15 Cycle 2 precedent on sibling previews).
- Independent S Playwright probe confirmed F + T no-op claim; live byte-identical to Cycle 1 baseline top-1500 px region.

---

## Net code impact

```
 web/themes/custom/performant_labs_20260502/performant_labs_20260502.theme      (Cycle 2 — hook_form_alter)
 web/themes/custom/performant_labs_20260502/css/components/webform.css          (Cycle 3 — sidebar H2 rule)
 scripts/sprint16-cycle3-contact-us-cta-pair-marker.php                          (Cycle 3 — Canvas marker patch, idempotent)
 docs/pl2/Previews/contact-us.html                                               (Cycle 4 — closing-CTA token preview-doc)
```

**One Drupal config-as-code change** (theme `.theme` hook), **one CSS rule** (sidebar H2), **one Canvas content patch** (cta-pair marker), **one preview-doc edit** (closing-CTA token). No Twig, no `.yml` config, no token cascade changes.

---

## Process gap surfaced (for future sprints)

Sprint 16 Cycle 1 audit produced **4 false-positive findings out of 7** — 57%. All four were probe-selector errors:

| Finding | Probe-script gap |
|---|---|
| F-NEW-16-C | Measured `color`; rendered element uses `background-color` (mask-image pattern) |
| F-NEW-16-D | Inferred wrapper missing from visual diff without probing computed `border` / `padding` / `position` |
| F-NEW-16-E | Probe script took `h2s[0]` and `h2s[length-1]` only — missed mid-DOM §C H2 |
| F-NEW-16-F | Probed `.button--primary` (form submit, light-zone) instead of `.theme--dark .button--primary` (closing-CTA, dark-zone) |

The HQ method's per-section DSSIM correctly flagged real visible deltas — but **diagnosis** of which token/element was wrong requires probe scripts that:

1. **Enumerate every H2 with its section ancestor** (not first/last by array index).
2. **Probe each section's primary CTA specifically** (multiple `.button--primary` may exist; pick by section context).
3. **Probe rendered property, not assumed property** (mask-image patterns use `background-color`; absolute-positioned elements use `top`; etc.).
4. **Validate visible vs computed** for layout markers (when reporting "wrapper missing," confirm by probing computed `border`/`padding`, not by visual inference).

Recommended sprint convention update: probe scripts enumerate exhaustively; cite the exact computed property name; never infer token-level cause from section-level DSSIM alone.

---

## Pages reviewed for preview-fidelity to date

- `/` (homepage)
- `/services`
- `/about-us`
- `/how-we-do-it`
- `/contact-us` (this sprint)

Remaining regular-pages candidates: `/open-source-projects` (partly blocked on Sprint 12 card-CTA operator decision), `/articles` (views-listing — different audit profile).

---

## Silent-parked / carried forward

- **F-NEW-4** — CTA suffix-icon component delta (Sprint 14 carry; pending operator decision).
- **body-lg sitewide drift** (live 16–20, preview 17–19, brief 18) — sitewide token cycle.
- **`display-md` line-height** ~1.13 vs brief ≤ 1.10 — sitewide.
- **F-NEW-16-H** — Footer column headings live H3 vs preview H4; sitewide pattern.
- **Hero-H1 orphan words at 375** on `/`, `/services`, `/how-we-do-it` (Sprint 14/15 carry) — copy-edit / `<wbr>` micro-cycle.
- **Open-source card-CTA structural delta** (Sprint 12 carry-forward, operator-decision pending).
- **pa11y allowlist entry** for `a.button.button--primary` could be reconsidered after Cycle 4 (dark-zone CTAs now 8.81:1) — but **do not remove this sprint**, light-zone primaries elsewhere still use `#62BBCB` and need the allowlist.

---

## Ready for merge to local `main`

Per memory `project_local_only_main.md`: `--no-ff` merge. No push, no PR.
