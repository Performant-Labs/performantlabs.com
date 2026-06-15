# Phase 8.7 — Primary brand color + global section padding

**Branch:** `aa/pl-homepage-phase-8.7-color-spacing`
**Pipeline:** O → F → T → S → O
**Parent:** Phase 8 global re-audit ([`phase-8-global-reaudit-S.md`](phase-8-global-reaudit-S.md)).

The global re-audit returned REWORK with two binding items. Operator decided both:

- **Item A — Primary CTA color.** Operator chose **A: update live + brief to cyan `#62BBCB`.** Live's `#0F6F8A` becomes the legacy token; cyan becomes the new brand primary. Brief must be updated.
- **Item B — Section padding.** Operator chose **global**: tighten the shared section-padding token theme-wide. Affects all pages using the theme.

This is the **last sub-cycle in Phase 8**. After this passes S, we re-run the global audit once more; if clean, we proceed to theme activation.

---

## Operator's directives

- Preview is canonical for both items (cyan, tightened spacing).
- Brand color change is global — F must update both the CSS token and the design brief in the same cycle.
- Section padding change is global — F may touch shared tokens (this is the operator-confirmed trigger-3 escalation). Verify no page outside the theme breaks.
- Do not pause to ask permission. Execute per trace.

---

## Item A — Adopt preview's three-color primary palette (literal)

### Spec

The preview defines a three-color primary palette. Live currently uses a single deep-teal primary `#0F6F8A`. Adopt the preview's palette literally:

| Token | Hex | Role |
|---|---|---|
| `--primary` | `#1893b4` | Medium teal — inline links, kicker accents, secondary-button text/border, hover targets, feature-card hover border |
| `--primary-light` | `#62BBCB` | Cyan — **CTA pill backgrounds only** (`.btn--primary { background }`) |
| `--primary-deep` | `#005AA0` | Deep navy — secondary-button hover text, dark-band accents |

Live's existing `#0F6F8A` token (likely `--theme-link-color` in `base.css`) is replaced by this three-token system. The semantic Layer-3 tokens (`--theme-link-color`, `--theme-link-hover`, `--theme-focus-ring-color`, etc.) should be wired to the new palette so the cascade fans out correctly.

### Cascade impact (F must wire correctly)

The new palette flows through:
- Primary CTA backgrounds (hero "Book a testing review", closing CTA pill) → `--primary-light` (cyan).
- Primary CTA text → `#FFFFFF` (preview spec — see WCAG section).
- Inline link color → `--primary` (medium teal).
- Inline link hover → `--primary-deep` (deep navy).
- Focus ring color → `--primary` (medium teal).
- Logo dot fill — currently `#1893b4` already (per header.css notes); confirm it stays.
- Kicker accent rules, heal-flow step numbers, secondary button borders — `--primary`.

### WCAG impact — operator-approved intentional deviations

Per operator decision (option A1, made on 2026-05-11), the preview is adopted literally. Two AA contrast failures are accepted as intentional brand deviations:

1. **Primary CTA pill (`.btn--primary`)**: cyan `#62BBCB` background with white `#FFFFFF` text gives **2.13:1 contrast** — fails AA at every text-size threshold (body 4.5:1, large 3.0:1). Operator accepts as intentional.

2. **Inline link text (`a { color: var(--primary) }`)**: medium teal `#1893b4` on white gives **3.5:1 contrast** — fails body-text AA (4.5:1), passes large-text AA (3.0:1). Operator accepts as intentional for body inline links.

F must:
- Document both deviations explicitly in the F handoff under §"WCAG contrast ratios" with the verbatim hex pairings and computed ratios.
- Update `docs/pl2/Briefs/pl_design_brief.md` to add a §"Documented WCAG deviations" subsection listing both, with a one-sentence rationale ("brand-color choice approved by operator 2026-05-11, prioritizes preview-canonical visual identity over AA contrast on these two specific elements").
- Verify no OTHER context inherits the new tokens in a way that creates an UNDOCUMENTED contrast failure. Any third or fourth contrast failure surfaces to operator — only the two above are pre-approved.

### Brief update

Update `docs/pl2/Briefs/pl_design_brief.md`:
- Replace the single primary-color token reference with the three-color palette table.
- Add the §"Documented WCAG deviations" subsection per above.
- Update any §Color or §Tokens section that lists the primary hex.

---

## Item B — Global section-padding tightening

### Spec

Reduce inter-section vertical padding on the homepage from the current state (live is 900-1350 px taller than preview at every viewport) to match preview's heights within ±200 px:

| Viewport | Preview height (px) | Target live height |
|---|---|---|
| 1280 | 4341 | ≤ 4541 |
| 768 | 4829 | ≤ 5029 |
| 375 | 6166 | ≤ 6366 |

The fix is likely a single shared section-padding token (e.g. `--space-section`, `--spacing-component`, or a dy-section padding value). F traces.

### Cross-page concern (operator-confirmed)

The fix is global — affects every page using the theme. F must:
1. Identify which other pages use this token (search `web/themes/` and recent Canvas assemblies).
2. Verify each affected page renders acceptably after tightening (the preview's tighter spacing may look wrong on dense pages like services or about-us).
3. If any affected page breaks visually, surface to operator before committing.

F may need to scope the change differently (e.g. token has multiple values for "comfortable" vs "tight" sections, or per-page overrides). Trust the trace.

---

## Acceptance criteria

- [ ] Step-3 trace surfaced with both items addressed; root cause + layer + cross-page impact documented.
- [ ] Primary brand color is cyan `#62BBCB` on hero primary CTA, closing CTA, and any token bound to `--theme-link-color` (or equivalent).
- [ ] WCAG compliance preserved: every contrast pairing involving the new primary still meets AA. If any usage forces failures, F surfaces to operator with options.
- [ ] Brief updated to document cyan as primary, with contrast notes.
- [ ] Homepage live heights within ±200 px of preview at 1280 / 768 / 375 (Playwright-measured `document.body.scrollHeight`).
- [ ] Other pages using the theme (open-source-projects, how-we-do-it, contact-us, services, about-us, articles, …) render acceptably post-tightening. F spot-checks each at 1280 and reports any visual breakage.
- [ ] No regressions on any prior sub-cycle (8.1–8.6).
- [ ] No `!important`. Files staged by explicit path.

---

## Inputs

1. `docs/pl2/handoffs/phase-8-global-reaudit-S.md` and `phase-8-global-reaudit-report.html` — the audit findings with hex values, height deltas, and per-section context.
2. `docs/pl2/Previews/homepage.html` — canonical preview (cyan CTA, tight section padding).
3. `docs/pl2/Briefs/pl_design_brief.md` — current brief (documents teal primary; will be updated).
4. `docs/pl2/theme-change--workflow.md` — 7-step workflow (mandatory).
5. `web/themes/custom/performant_labs_20260502/css/base.css` — likely home of the primary brand token and section-padding token.

---

## Handoff location

`docs/pl2/handoffs/phase-8.7-color-spacing-F.md`

## Operating rules

- 7-step CSS workflow for each item separately.
- L1/L3 expected (token-level changes).
- No `!important`.
- T1 + T2 yourself. Do NOT run T3.
- **If WCAG fails on cyan inline link usage, STOP and surface — that's a trigger-2 (design ambiguity in source of truth) escalation.**
- **If section-padding tightening breaks a non-homepage page, STOP and surface — that's a trigger-3 (breaking change to shared scope) escalation.**
- Otherwise, execute both items and write the handoff.
