# Handoff-S: Wave 2 — Sub-phases B+C (#281/#282, PR #284) — FINAL whole-page Spec Audit (Tier 3)

**Date:** 2026-07-21
**Auditor:** S (Spec Auditor), Website Front-End Pipeline · adapter `drupal-canvas-sdc` · profile `pl2` · prefix `[wave2-BC-S]`
**Scope:** the **complete product-led homepage** — final visual gate before #276 closes. Branch `feat/281-282-wave2-bc` (PR #284) through `51817bba95` (incl. A-phase fix-pass `c688e0b20e`).
**Spec:** approved wireframe `docs/pl2/keytail-design/wireframe-276/{wireframe.html,RATIONALE.md}` + all #276 sign-off decisions/rulings + #281/#282 issue bodies + carried items from `wave2-276/handoff-S.md` (sub-phase A FINAL PASS, advisories S-A3/S-A5, B/C hardening note).
**Method:** headless Playwright Chromium only (no visible browser). Live page + wireframe reference at 360/768/1280, DPR 2, screenshots to disk. All contrast re-derived from live `getComputedStyle()` (WCAG relative luminance). Hero regression measured by ImageMagick RMSE pixel-diff against the S2 baseline crops (byte-comparable method: `.hero` element screenshot, DPR 2, viewport {w,900} — identical to `s2-audit.cjs`). Measurement scripts kept for provenance: `s-bc-audit.cjs` (this directory), raw numbers in `handoff-S-shots/measurements-2026-07-21.json`.

## Verdict: **PASS** — zero rework items; the whole page clears Tier-3 visual audit and WCAG spot-verification

Preconditions met: A = PASS (0 blocks, `wave2-bc/handoff-A.md`), T = PASS (0 blocking, `wave2-bc/handoff-T.md`), page renders, pixel-level captures produced at all three breakpoints, no horizontal overflow at the smallest viewport (345 ≤ 360; also 753 ≤ 768, 1265 ≤ 1280 — re-measured independently). Preview sanity check on the wireframe: clean (already cleared in the sub-phase A audit; nothing changed since).

---

## 1. Whole-wireframe fidelity — PASS at all three viewports

**Section sequence, independently measured live** (top-level `dy-section` walk, document offsets + computed backgrounds):

| # | Section | Register (live bg) | Wireframe | 360 | 768 | 1280 |
|---|---|---|---|---|---|---|
| 1 | Nav (white, weighted/demoted) | white | ✓ | ✓ | ✓ | ✓ |
| 2 | Hero (cream + terracotta/teal radial tints) | `#F5EFE2` + tints | ✓ | ✓ | ✓ | ✓ |
| 3 | Proof strip | cream `#F5EFE2`, pad 48/48 | ✓ | ✓ | ✓ | ✓ |
| 4 | Feature 1 History | white, pad 96/96 (64 @360) | ✓ | ✓ | ✓ | ✓ |
| 5 | Feature 2 Failure analytics (**reversed**) | white | ✓ | ✓ | ✓ | ✓ |
| 6 | Feature 3 Search | white | ✓ | ✓ | ✓ | ✓ |
| 7 | Services (verbatim header + 3 cards) | cream (`theme--light`) | ✓ | ✓ | ✓ | ✓ |
| 8 | Logo grid "Trusted by teams at" | cream | ✓ | ✓ | ✓ | ✓ |
| 9 | Pre-existing tail: dogfooding (cream) → checklist (white) → FAQ (cream) → dark CTA (`#1F1A14`) → footer | — (out of wireframe scope) | n/a | ✓ | ✓ | ✓ |

- **Alternation balance (1280, live x-coords):** F1 copy x=51 / crop x=664 · F2 crop x=51 / copy x=664 · F3 copy x=51 / crop x=664 — true left/right alternation, both cells 550px (real 2-up). At 360 all features stack single-column; F2 stacks crop-first, consistent with its reversed identity. Feature crops are the sub-phase-A `browser-chrome` in honest-placeholder mode with per-feature URLs (`…/history`, `…/analytics`, `…/search`) and explicit "real product screenshot lands once a seeded local instance is captured" captions — reads as deliberate, not broken. Evidence: `t3-features-{1280,360}-2026-07-21.png`.
- **Spacing rhythm:** the proof strip is a compact 48px-padded band (215px tall at 1280) between the 96px-padded hero and feature sections — proportionally matching the wireframe's 28px strip vs 56px sections. Feature sections are metronomic (554px each at 1280). No rhythm breaks.
- **Cream-register transitions:** hero (cream+tint) → strip (cream) → features (white) → services (cream) → logos (cream) → tail. The white feature block reads as the page's bright product core with cream shoulders above and below — exactly the wireframe's demotion mechanism (position + tonal register). The services/logos re-theme to cream is correct and the grayscale client logos remain fully legible on cream (`t3-logos-1280-2026-07-21.png`).
- Minor fidelity deltas → advisories S-BC-A1/S-BC-A2 below (hairline strip borders absent; services subline rendered inside the large heading treatment). Neither reads as a defect live.

## 2. The degraded proof strip — judged live: **KEEP as shipped**

(`t3-proof-{1280,768,360}-2026-07-21.png`) This is the item I was asked to own visually. Verdict: **the honest-degradation treatment reads as intentional, not broken.**

- The em-dash figures ("★ —", "—") are typeset exactly like real figures would be — mono, fw800, terracotta-deep, 16px — with quiet explanatory sub-labels ("repo is private for now" / "public count at launch") directly beneath. The eye parses each item as *figure / label / footnote*; the dash reads as "value pending," the same visual idiom changelogs and status pages use. Nothing about it suggests a rendering failure: no empty boxes, no broken-image glyphs, no dangling labels.
- The real value (`v0.2.2-dev` / "current build") sits beside the placeholders and anchors the row in reality; the MIT pill and build-note line carry genuine content. The strip's net message — "early, open, honest" — lands, and is exactly the pill's "in the open" promise restated.
- At 1280 the four items distribute evenly on one conceptual row; at 360 they stack into centered rows with no clipping (strip right edge 331 ≤ 360).
- No adjustment recommended now. When the repo goes public, wiring live counts (already a tracked launch item) upgrades this in place with zero layout change.

## 3. Nav weight treatment — reads as intended hierarchy, not as broken/greyed-out links

- **Desktop 1280** (`t3-nav-1280-2026-07-21.png`): weighted `Aftersight / Open source projects / Articles` at `#2A2520` fw700 15px vs demoted `Services / How we do it / About us / Contact us` at `#5C544C` fw400 13px. The demoted register keeps 7.43:1 — far above the washed-out grey that reads "disabled" — and the 2px size step is subtle. The scan order lands product-first; nothing looks inactive. All 7 links in #270's order, byte-unchanged.
- **Open mobile drawer, 360 + 768** (`t3-drawer-{360,768}-open-2026-07-21.png`): on the dark overlay panel (≈`#0E1014`, α.95) the split renders white fw700 vs `#B8AFA0` fw400, both 24px. At the drawer's large type size the two-register split is even clearer than desktop and unambiguously reads as hierarchy — the demoted links at ~9.7:1 are bright enough that no visitor would take them for dead links.

## 4. WCAG visual layer (live spot-verification)

**Contrast — 4 of T's 13 pairings re-derived independently** (live `getComputedStyle` → WCAG relative luminance; concur with T/A/F, not copied):

| Pairing | Live measured | Ratio | Verdict |
|---|---|---|---|
| Proof figure `.proof-item__n` (16px fw800) | `#8E4A2A` on cream `#F5EFE2` | **5.79:1** | AA (large-text AAA) ✓ matches T |
| Nav demoted desktop (13px) | `#5C544C` on white header | **7.43:1** | AAA ✓ matches T |
| Nav demoted, **open drawer** @360 | `#B8AFA0` on panel oklch(0.173/0.95)≈`#0E1014` | **9.67:1** (worst-case α-blend still >2× AA) | AAA ✓ concurs with T's 8.77 |
| Services kicker + H2 on cream | `#8E4A2A` → **5.79:1** · `#1F1A14` @40px → **15.07:1** | AA / AAA ✓ matches T |

**Focus-visible on the restyled nav links (the new interactive surface of this diff):**
- Desktop 1280: both a weighted and a demoted link show the site's 3px dotted `#1893b4` ring, offset 3px — **3.58:1 on white ≥3:1**, clearly visible (`t3-nav-1280-focus-{weighted,demoted}-2026-07-21.png`). `:focus-visible` confirmed matching.
- Open drawer @360, **real keyboard path** (Enter to open, Tab ×4): every link takes a 3px dotted `#62BBCB` ring, offset 3px — **≈8.6:1 on the dark panel**, highly visible (`t3-drawer-360-kbfocus-2026-07-21.png`). Measurement note: programmatic `el.focus()` does *not* trigger `:focus-visible` inside the drawer (Chromium heuristic), which is why the keyboard-driven test is the recorded evidence — the ring is real on the path users actually take.
- **Target sizes:** drawer links 279×52px (≥44) ✓. Desktop inline links are 23px tall — pre-existing sitewide nav geometry, untouched by this diff (treatment-only change), pointer context; not a finding of this diff.

**Cream-register services section vs the S-1 lesson (no padding squeeze at 360, measured):** section 317px wide with `.dy-section__container` carrying 16px inline padding; H2 renders 285px wide at x=30 (30px symmetric margins), cards 245px centered with full un-clipped text (`t3-services-360-2026-07-21.png`). **No squeeze.** Bonus: at 768 the service cards now stack single-column full-width, which dissolves the old sub-phase-A observation of 768 card-text ellipsis clamping — no clamp visible in the 768 capture.

## 5. Regression — hero pixel-consistent with the S2 FINAL-PASS state; tail intact

ImageMagick RMSE, this audit's `.hero` crops vs `wave2-276/handoff-S2-shots/hero-*-2026-07-21.png` (identical capture method):

| Viewport | RMSE | Reading |
|---|---|---|
| 360 | **0.0000366** | identical (sub-pixel AA noise) |
| 768 | **0** | byte-identical rendering |
| 1280 | 0.0298 | **all deltas confined to the sticky nav links** — the intentional #281 weight treatment overlaying the hero crop — plus the 2px crop-height edge; the hero content region itself shows zero diff (`t3-hero-1280-diff-2026-07-21.png`) |

Pill (292×25 badge), kicker, H1 3-line wrap with terracotta-deep brand word, trimmed subhead, CTA pair, dark snippet, browser-chrome — all visually unchanged. Below the logos: dogfooding, "Built for the whole Drupal team.", FAQ, dark book-a-review CTA, footer all present, ordered, unclipped at all three viewports (`t3-home-{360,768,1280}-live-2026-07-21.png`).

## 6. Carried advisories — still acceptable in whole-page context

- **S-A3 (secondary CTA teal-deep outline vs wireframe's dark outline):** with the full page assembled, the teal outline remains the page's only outlined control and sits harmoniously against the warm palette; the terracotta-deep primary keeps clear precedence. **Still acceptable as-is; carry closed unless André objects.**
- **S-A5 (pre-existing out-of-diff items):** `.heal-flow` scrollable-region-focusable + narrow-width clipping — unchanged, untouched by this diff, still the tracked Wave-1 follow-up. The old 768 service-card clamp member of S-A5 is now **resolved as a side effect** of the relocation (cards stack at 768, see §4). Carry the heal-flow item only.
- **S2 hardening note (dormant `.heading` escapes):** not triggered by this diff (hero.css untouched, features use `dripyard_base:heading`) — A re-ran the gate anyway: same 4 pre-existing escapes, zero new. Nothing for S to add.

## New advisories (non-blocking, no rework)

- **S-BC-A1:** the wireframe draws 1px `#E5E1DC` top/bottom hairlines on the proof strip; live the strip is borderless, so the hero's cream fades continuously into the strip's cream. Judged live it reads as a deliberate soft landing zone (the white features section provides the hard break), but if the strip ever needs firmer definition, the two hairlines are a two-line CSS polish. Optional.
- **S-BC-A2:** the services subline ("ATK, Testor, and the workflows…") renders inside the same 40px loud heading treatment as the header sentence, where the wireframe draws it as a smaller muted paragraph. This is the pre-existing Wave-1 header treatment carried verbatim (content untouched by this diff — only the section's theme/position moved) and it reads confidently live; noting it only so the delta vs the lo-fi mock is on record, not as an action item.
- **S-BC-A3:** at 360 the proof strip runs 542px tall (items stack with generous ~40px gaps). Acceptable — airy rather than broken — but if mobile above-the-fold economy ever matters, tightening the stacked gap is available.

## Shot index (`docs/pl2/handoffs/wave2-bc/handoff-S-shots/`)

- `t3-home-{360,768,1280}-live-2026-07-21.png` + `t3-home-{360,768,1280}-reference-2026-07-21.png` (wireframe frame, viewport-matched)
- `t3-hero-{360,768,1280}-2026-07-21.png` + `t3-hero-{360,768,1280}-diff-2026-07-21.png` (RMSE evidence vs S2 baseline)
- `t3-proof-{360,768,1280}-2026-07-21.png` · `t3-features-{360,1280}-2026-07-21.png` · `t3-services-{360,1280}-2026-07-21.png` · `t3-logos-1280-2026-07-21.png`
- `t3-nav-1280-2026-07-21.png` · `t3-nav-1280-focus-{weighted,demoted}-2026-07-21.png`
- `t3-drawer-{360,768}-open-2026-07-21.png` · `t3-drawer-360-kbfocus-2026-07-21.png` · `t3-drawer-360-focus-2026-07-21.png`
- `measurements-2026-07-21.json` (raw live measurements) · `s-bc-audit.cjs` (parent dir — the audit script, kept for re-runnability)

## Decision line

**PASS.** Sub-phases B+C (#281/#282, PR #284) — and with them the complete #276 product-led homepage — clear the final Tier-3 visual audit and WCAG spot-verification in full. Zero rework items. Proof-strip degradation: keep as shipped. Nav weight: reads as intended hierarchy at desktop and in the open drawer. Hero: pixel-consistent with the sub-phase-A FINAL PASS state. Remaining open threads for O are the already-tracked follow-ups only (real screenshots/UI crops; live GitHub counts at launch; heal-flow Wave-1 item) plus the three optional advisories above.
