# Sprint 5 — Cycle 4 — § proof / logo strip preview fidelity

**Branch:** `aa/pl-sprint-5-cycle-4-proof`
**Pipeline:** O → F → T → S → O
**Mode:** autonomous

## Objective

Bring `/services` § proof in line with `docs/pl2/Previews/services.html` § `<section class="proof">`. The dogfooding pitch (H2 + body + CTA) is MATCH per Cycle 1 audit. The substantive delta is the **logo strip**: live renders raster `logo-grid` SDC images for 8 marks; preview shows a text-only wordmark row of 6 marks with hairline-bounded strip + small-caps "WE SPEAK" label demoted above.

## Input documents

- [ ] `docs/pl2/handoffs/cycle-1-audit-services-S.md` §"§ proof" — delta catalog (P1, P2; P3–P6 MATCH)
- [ ] `docs/pl2/Previews/services.html` — find `<section class="proof">` and inspect the wordmark strip HTML/CSS
- [ ] `docs/pl2/briefs/pl_design_brief.md`
- [ ] `docs/pl2/pl-plan--sprint-5-services-fidelity.md`

## Scope (in)

| ID | Delta | Remediation |
|---|---|---|
| P1 | Logo strip: live = raster logo-grid SDC w/ 8 images; preview = text-only inline wordmark row (Drupal · Playwright · Cypress · PHP · JavaScript · React — 6 marks, body-text weight, horizontally distributed in hairline-bounded strip) | Canvas content + L5 — replace logo-grid component on entity id=3 with a text-based wordmark row. Either (a) swap to a different existing SDC if one fits, or (b) add a small wordmark-row SDC (L1 + L5), or (c) use existing `dripyard_base` text/list primitives and style them. F picks based on what fits in the scope cap. |
| P2 | "WE SPEAK" label placement: preview demotes label inside the hairline-bounded strip, above the wordmark row, centered small-caps. Live places it below dogfooding body, above the (image) logo strip, no hairline bounding. | L5 — bundled with P1 fix; the strip wrapper carries the label as small-caps eyebrow. |

**Wordmark canonical set (preview):** Drupal, Playwright, Cypress, PHP, JavaScript, React. **Six marks.** Live's two extra logos (Anthropic + OpenAI) are dropped per source-of-truth precedence (preview wins on layout/composition). If the content brief contradicts, document and surface as ADVISORY-HOLD.

## Out of scope

- Other sections.
- Image alt text for `logo-grid` images — that component is being removed.
- Pre-existing accepted deviations.

## Acceptance criteria

- [ ] § proof at `/services` renders a hairline-bounded strip with: small-caps "WE SPEAK" label centered above + 6 text wordmarks (Drupal, Playwright, Cypress, PHP, JavaScript, React) horizontally distributed in body-text weight.
- [ ] No raster logo images render in this section.
- [ ] Dogfooding H2 + body + CTA above the strip — unchanged (preserve current MATCH state).
- [ ] At 768/375: wordmark row remains legible; can wrap or scroll horizontally — F decides based on preview behavior.
- [ ] No `!important`.
- [ ] T1 + T2 PASS on `/services`.
- [ ] WCAG: wordmark text contrast ≥ 4.5:1 against the band background.
- [ ] All Canvas patches set `component_version: NULL` (or document the platform constraint).
- [ ] Files staged by explicit path.
- [ ] F scope cap respected (≤ 6 files / coherent single change). If a new SDC is needed, F may surface a scope-split proposal.

## Handoff locations

- F: `docs/pl2/handoffs/cycle-4-proof-F.md`
- T: `docs/pl2/handoffs/cycle-4-proof-T.md`
- S: `docs/pl2/handoffs/cycle-4-proof-S.md`
- Report: `docs/pl2/handoffs/cycle-4-proof-report.html`
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-5-cycle-4/`

## Operating rules

Per F canonical prompt. Highlights:
- Inspect preview's actual HTML/CSS for the strip before picking a Canvas/SDC approach.
- Read `.component.yml` for any SDC you reference.
- Source-of-truth precedence: brief tokens > preview > content brief > live. Preview wins for the 6 vs 8 wordmark question.
- If F judges a new SDC is needed AND that pushes over scope cap, propose a 2-cycle split (one for SDC scaffold, one for content patch).

## Commit message (O will commit on S PASS)

`feat(services): cycle 4 — § proof / logo strip preview fidelity (text wordmark row + small-caps label)`
