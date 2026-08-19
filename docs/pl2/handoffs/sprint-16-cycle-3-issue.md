# Issue: Sprint 16 Cycle 3 — Sidebar + CTA layout batch (A + D + G)

**Branch:** `aa/pl-sprint-16-cycle-3-sidebar`
**Sprint:** 16
**Mode:** Autonomous
**Pipeline:** F → T → S

## Objective

Land three layout fixes on live `/contact-us`:

1. **F-NEW-16-A** — Sidebar H2 ("Prefer a quick call?") size: live currently 32 / 36.8 / -0.48 (inheriting page-level `--h2-size`); brief + preview want 22 / 27.5 / -0.2.
2. **F-NEW-16-D** — Wrap sidebar contents in a card: hairline border + 12 px radius + 32 px padding + sticky at ≥ 992 px (drops sticky at mobile). Preview has the `.contact-sidebar` card pattern; live is unstructured siblings.
3. **F-NEW-16-G** — Closing-CTA two buttons render side-by-side at desktop on preview; live currently stacks them vertically. Apply horizontal row layout at ≥ 768 px on live; stack at mobile per brief.

## Input documents

- [ ] `docs/pl2/handoffs/sprint-16-cycle-1-audit.md` §§"F-NEW-16-A", "F-NEW-16-D", "F-NEW-16-G" — per-finding probe data + remediation-layer hints
- [ ] `docs/pl2/Previews/contact-us.html` — preview reference (look for the sidebar card class + closing-CTA button-row class)
- [ ] `docs/pl2/briefs/pl_design_brief.md` — card chrome tokens (hairline `#E5E1DC`, 12 px radius, 32 px padding)
- [ ] `docs/pl2/theme-change--workflow.md` — 7-step workflow
- [ ] `docs/pl2/handoffs/sprint-14-cycle-3-F.md` — precedent for Canvas-marker-driven scope narrowing (display-md case turned out to be missing marker, not L1 token)

## Acceptance criteria

- [ ] **F-NEW-16-A.** Live sidebar H2 computes `font-size: 22px / line-height: ~27.5px / letter-spacing: -0.2px`. Other H2s on the page UNCHANGED (page-level `--h2-size` cascade must not be widened).
- [ ] **F-NEW-16-D.** Live sidebar contents are wrapped in a card with: `1px solid #E5E1DC`, `border-radius: 12px`, `padding: 32px`, `position: sticky` at ≥ 992 px, `position: static` at < 992 px. Equivalent visual to the preview's `.contact-sidebar` block.
- [ ] **F-NEW-16-G.** Closing-CTA section CTAs render in a horizontal row (side-by-side) at ≥ 768 px on `/contact-us`; stack vertically at < 768. Must NOT regress other pages that use the same CTA pair pattern (cross-page sanity verification per Cycle 1 carve note).
- [ ] No `!important`. 7-step trace per fix; document layer choice.
- [ ] Stage by explicit path.

## Trace expectations

Each finding has 2 plausible layers:

- **A (sidebar H2 size).** L5 CSS scoped to the new sidebar wrapper (depends on D's mechanism).
- **D (sidebar wrapper).** Two paths:
  - L3 Canvas — add a wrapper component / `additional_classes` marker via idempotent PHP patch (Sprint 14 Cycle 3 precedent).
  - L5 CSS — target the existing two siblings via `:has` / `:nth-child` / new marker on the page-level element.
- **G (CTA row).** Two paths:
  - L3 Canvas — add a marker class to the closing-CTA section enabling button-row layout (similar to Sprint 10's `dy-section--cta-pair` pattern; check tech-debt register for that).
  - L5 CSS — target the consecutive `.button` siblings at ≥ 768 directly.

Per PC-3, L5 preferred. Per Sprint 14 Cycle 3 lesson, Canvas-marker may turn out cleaner. F decides via trace.

**Scope cap.** Three findings, one §B sidebar surface + one §D CTA surface. This is borderline (~2 design surfaces) but tightly bounded. If F's trace reveals the scope is significantly larger, propose a split.

## Verification (F runs T1+T2)

- T1: `ddev drush cr`; curl `/contact-us`; grep rendered HTML for the new sidebar wrapper class + the CTA row container class (or similar).
- T2: Playwright probe at 1280 + 768 + 375:
  - Sidebar H2 computed font-size = 22 px at 1280 (and document mobile target — likely same 22 or smaller).
  - Sidebar wrapper computed `border`, `border-radius`, `padding`, `position`.
  - Closing-CTA: CTA buttons' bounding boxes; at 1280 they share the same `top`; at 375 they have different `top` (stacked).
- Cross-page sanity (if G is L3 sitewide): spot-check `/about-us`, `/`, `/services` closing-CTA — should be unchanged from baseline (those pages already render side-by-side per brief; verify Cycle 1 carry-forwards still hold).

## Handoff

Write your handoff to: `docs/pl2/handoffs/sprint-16-cycle-3-F.md`.

## Operating rules

- 7-step workflow per fix.
- Trace before assuming layer (Sprint 14/15 lessons).
- No `!important`.
- Stage by explicit path.
- Per memory `feedback_no_orphan_words.md` — at the new sidebar H2 size (22 px), confirm no orphan-word regression on "Prefer a quick call?" wrap.
- Canvas `component_version` MUST NOT be NULL if you patch Canvas content (memory + Sprint 10 codification).
