# Issue: Sprint 16 Cycle 4 — §C H2 + §D primary CTA token (E + F)

**Branch:** `aa/pl-sprint-16-cycle-4-tokens-sweep`
**Sprint:** 16
**Mode:** Autonomous
**Pipeline:** F → T → S (cross-page sweep mandatory IF L1; possibly narrower if trace reveals marker-based fix)

## Objective

Two findings remain on `/contact-us` from the Cycle 1 audit:

1. **F-NEW-16-E** — §C "What to expect" H2 renders at 32 px desktop / 24 px mobile on live; brief + preview want `display-md` 40 / 30.
2. **F-NEW-16-F** — §D closing-CTA primary CTA uses `#62BBCB` + white on **both live AND preview**; brief line 319 mandates dark-zone `#5DC6E8` + `#1F1A14`.

## Input documents

- [ ] `docs/pl2/handoffs/sprint-16-cycle-1-audit.md` §§"F-NEW-16-E", "F-NEW-16-F" — root-cause hypotheses + remediation-layer options
- [ ] `docs/pl2/handoffs/sprint-15-cycle-3-F.md` — Sprint 15 Cycle 3 unified `--h2-size` sitewide (32 desktop / 30 mobile). E may reflect that the `display-md` brief rule is not coincident with `--h2-size`.
- [ ] `docs/pl2/handoffs/sprint-14-cycle-2-S.md` and Sprint 14 Cycle 3 F handoff — precedents for dark-zone CTA token landing on `/about-us` (live was already correct there)
- [ ] `docs/pl2/handoffs/sprint-16-cycle-3-F.md` — Cycle 3 used `dy-section--cta-pair` marker on §D closing-CTA. Trace whether `/contact-us` §D needs an additional dark-zone marker too.
- [ ] `docs/pl2/briefs/pl_design_brief.md` line 319 + typography section
- [ ] `docs/pl2/Previews/contact-us.html` — preview reference

## Acceptance criteria

- [ ] **F-NEW-16-E.** Live `/contact-us` §C "What to expect" H2 computes `font-size: 40px / line-height ≤ 1.10` at desktop and `font-size: 30px / line-height ≤ 1.10` at mobile (`< 576px`). Per Sprint 15 Cycle 3 verification, the L1 `--h2-size` is 32/30 — so this likely requires either: (a) a missing Canvas marker on the §C section activating `display-md`, or (b) a new/restored `.section-head h2` rule scoped per `display-md`, or (c) a marker-class L5 override. **F's 7-step trace decides.**
- [ ] **F-NEW-16-F.** Live and preview §D closing-CTA primary CTA compute `background-color: rgb(93, 198, 232)` (`#5DC6E8`) and `color: rgb(31, 26, 20)` (`#1F1A14`). Confirm contrast ≥ 4.5:1 (brief asserts 8.81:1).
- [ ] No `!important`.
- [ ] **Cross-page sweep (S, MANDATORY IF F's fix is L1 sitewide).** Verify other pages with §C-equivalent `display-md` H2s and dark-zone closing-CTA primaries don't regress. Scope determined by F's layer choice. If marker-driven, sweep is narrower.
- [ ] **`/about-us` regression check (G specifically).** Sprint 14 confirmed `/about-us` §E primary used `#5DC6E8` + `#1F1A14` correctly. Cycle 4 must not break that.
- [ ] **pa11y allowlist.** After F-NEW-16-F lands on live, the existing `a.button.button--primary` allowlist entry can be reconsidered (new dark-zone contrast 8.81:1 is brief-compliant). **DO NOT remove the allowlist entry this cycle** — light-zone primaries elsewhere still use `#62BBCB` and the allowlist still serves them. Track for a future cleanup sprint.

## Trace expectations

Sprint 14 Cycle 3 + Sprint 16 Cycle 3 G pattern: "live element wrong/missing X" often resolved as "missing Canvas marker activating existing-correct rule," not "L1 token bug." Apply that hypothesis first:

- **E:** Does `/contact-us` §C section have the right Canvas marker (e.g. `dy-section--centered-light` or analogous) that activates a `display-md` rule on its H2? Check the existing `.contact-sidebar` selector cascade from Cycle 3. If `.section-head h2` already has a brief-correct rule somewhere in `dy-section.css`, the fix might just be adding the marker.
- **F:** Does `/contact-us` §D closing-CTA section have the right dark-zone marker (e.g. `theme--dark`, `dy-section--centered-dark`, `dy-section--espresso`) that activates the brief-correct primary CTA token? Sprint 14 had `/about-us` §E correctly using `#5DC6E8`; check what marker activates that.

If trace confirms marker-based fix, scope narrows to /contact-us Canvas content only (no L1 sitewide CSS edit; no broad cross-page sweep needed — just verify other pages unchanged). If trace reveals L1 token fix needed, cross-page sweep is mandatory.

## Verification (F runs T1+T2)

- T1: `ddev drush cr`; curl `/contact-us`; grep for new marker class(es) if applicable.
- T2: Playwright probe at 1280 + 375:
  - §C H2 computed font-size + line-height — should match brief.
  - §D primary CTA computed `background-color` + `color`.

## Handoff

Write to: `docs/pl2/handoffs/sprint-16-cycle-4-F.md`.

## Operating rules

- 7-step trace per fix. Trace before assuming L1.
- No `!important`.
- Stage by explicit path.
- Canvas `component_version` preserved (idempotent PHP patches per Sprint 14 Cycle 3 pattern).
- Per memory `feedback_no_orphan_words.md` — at 40 px §C H2, confirm no orphan-word regression on "What to expect."
