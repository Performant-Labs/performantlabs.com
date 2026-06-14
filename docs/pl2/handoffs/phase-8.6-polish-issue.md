# Phase 8.6 — Polish batch (final Phase 8 sub-cycle)

**Branch:** `aa/pl-homepage-phase-8.6-polish`
**Pipeline:** O → F → T → S → O
**Parent:** Phase 8 visual parity audit + 8.1 residuals.

The last sub-cycle in Phase 8. After this passes, Phase 8 will run a global re-audit and (assuming clean) proceed to theme activation.

---

## Operator's directive

Preview is canonical. Match it. Do not pause to ask permission. Six small items in one cycle.

## Six items

| # | Item | Live state | Preview / target | Likely fix layer |
|---|------|-----------|------------------|------------------|
| 1 | Footer link label casing | Title Case ("Test Suite Takeover", "Privacy Policy") | Sentence case ("Testing-suite takeover", "Privacy policy") | Menu config or Twig preprocess; possibly CSS `text-transform` if any. Trace required. |
| 2 | FAQ accordion icons | chevron-down (∨) | plus (+) | Accordion CSS — likely `::before`/`::after` content on the toggle row. Probably L5 in `accordion.css`. |
| 3 | Footer-CTA primary pill arrow glyph | arrow `→` inside the primary CTA pill | no glyph | Twig template, button SDC, or content config. Trace required. |
| 4 | Checklist item terminal periods | missing ("Dev teams catch regressions before users do") | present ("…before users do.") | Content edit on the icon-list items. Likely menu/list config, not CSS. |
| 5 | Hamburger icon styling (8.1 residual) | borderless icon glyph | 1 px hairline border + 8 px radius around the icon | L5 in `header.css` — `.mobile-nav-button` (or whatever neonbyte names it) gets `border: 1px solid var(--hairline); border-radius: 8px`. |
| 6 | Nav-cluster horizontal offset at 1280 (8.1 residual) | nav cluster sits at a slightly different horizontal position vs preview | preview position | Inspect — likely a `padding-inline` or `gap` mismatch on the header container or `.site-header__nav`. |

## Acceptance criteria

- [ ] Step-3 trace surfaced; root cause + chosen layer documented per item.
- [ ] All six items match the canonical preview at all three viewports (or appropriate viewport for each — e.g. items 1, 2, 3, 4 are full-width visible across viewports; item 5 is < 992 px only; item 6 is 1280 only).
- [ ] No regressions on prior fixes (8.1 / 8.2 / 8.3 / 8.4 / 8.5).
- [ ] No `!important`. Stage files by explicit path. `component_version` retention applies.
- [ ] WCAG: icon-only changes (chevron → plus, hamburger border) preserve hit areas and labels. Footer link text changes preserve link semantics.

## Inputs

1. `docs/pl2/handoffs/phase-8-visual-parity-S.md` §"Polish batch" (item details).
2. `docs/pl2/handoffs/phase-8.1-header-S.md` (items 5–6 from residuals).
3. `docs/pl2/Previews/homepage.html` — canonical reference for all six items. Inspect each item in the preview directly to confirm exact spec.
4. `docs/pl2/theme-change--workflow.md` — 7-step workflow.
5. The relevant subtheme CSS components: `accordion.css`, `header.css`, plus wherever the footer and CTA are styled. Search the codebase to find.

## Handoff location

`docs/pl2/handoffs/phase-8.6-polish-F.md`

## Operating rules

- 7-step workflow per item; trace is mandatory before each change.
- L5 expected for items 2, 5, 6 (CSS overrides). Items 1, 3, 4 may live at L1 (config / content edits) — F decides per item.
- No `!important`. Stage files by explicit path.
- `component_version` retention applies.
- T1 + T2 yourself. Do NOT run T3.
- Do not pause to ask permission. Execute each item per its trace.
- This is a six-item batch — if any single item's trace surfaces a genuine brief-vs-preview contradiction or technical impossibility, complete the other items and surface the blocker in the handoff. Don't let one stuck item block the other five.
