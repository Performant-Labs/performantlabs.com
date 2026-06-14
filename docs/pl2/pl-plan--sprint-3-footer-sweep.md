# Sprint 3 — Footer-Sweep Cycle Runbook

> **Parent:** [`post-homepage-next.md`](post-homepage-next.md)
> **Workflow:** [`workflow-ofts.md`](workflow-ofts.md) (O-F-T-S 4-agent pipeline)
> **Prerequisite:** Sprint 2 (mobile + AA sweep) merged to `main`
> **Upstream references:** [`pl-plan--services.md`](pl-plan--services.md) advisory F.8, F.9, R1; [`post-homepage-next.md`](post-homepage-next.md) P19

---

## Status

| Item | State |
|---|---|
| Active theme | `performant_labs_20260502` |
| Branch | `aa/pl-sprint-3-footer-sweep` (from `main`) |
| Estimated effort | ~3 hours |
| **Status** | ✅ **Complete (2026-05-05).** Merged to `main`. |

---

## Objective

The site footer has accumulated four discrete issues across the homepage and `/services` overhauls, all deliberately deferred to a single focused sweep. This sprint resolves all four: the broken Services sub-list anchor, the bare `/contact` link, the Services sub-list content alignment with the new engagement model, and the mobile CTA visibility question.

---

## Locked decisions

| ID | Decision | Source |
|---|---|---|
| S3-R1 | **Footer is a single commit.** All four items ship together — they all live in footer templates and/or `footer.css`, and testing them individually creates more overhead than testing the group. | this runbook |
| S3-R2 | **Footer Services sub-list must reflect the 4-engagement model.** The current sub-list was written before the `/services` overhaul. Sub-list items should link to the correct anchor IDs on `/services` (the engagement card IDs: `#test-suite-takeover`, `#embedded-testing-engineer`, `#autonomous-healing-pilot`, `#accessibility-testing`). F verifies the live anchor IDs before wiring. | services runbook R1, services carry-forward F.8 |
| S3-R3 | **All footer contact links use `/contact-us`.** No bare `/contact` anywhere in the footer. Sprint 1 will have already fixed the route; this sprint fixes the footer link hrefs themselves. | services carry-forward F.9 |
| S3-R4 | **Mobile CTA visibility is a design decision.** F presents options to O; O consults operator if needed. Two paths: (a) duplicate the CTA in the header strip at mobile (Twig override), (b) accept the current "CTA inside hamburger" behavior and document as intentional. | post-homepage-next P19 |
| S3-R5 | **Footer template changes require cross-page T3.** The footer renders on every page. T must screenshot at least `/`, `/services`, `/articles`, and `/contact-us` at desktop + mobile after changes. | this runbook |

---

## Operating rules

All agents follow the standing operating rules from `workflow-ofts.md`. Sprint-specific emphasis:

- **Three-Tier Verification Hierarchy** (`~/Sites/ai_guidance/testing/verification-cookbook.md`): T runs Tier 1 + Tier 2. S runs Tier 3. Tier 1 before Tier 2; Tier 2 before Tier 3. Never open a browser until the structural skeleton passes.
- **7-step CSS change workflow** (`docs/pl2/theme-change--workflow.md`): applies if any CSS is touched. The mobile CTA (P19 option a) would require Twig + possibly CSS; the footer anchor/link fixes are template-only. Step 3 layer trace required for any CSS change.
- **Operational guidance** (`~/Sites/ai_guidance/frameworks/drupal/theming/operational-guidance.md`): curl first, browser last. Footer link verification is entirely curl-checkable (grep for `href="/contact"` vs `href="/contact-us"`, grep for anchor IDs).
- **Visual regression strategy** (`~/Sites/ai_guidance/frameworks/drupal/theming/visual-regression-strategy.md`): Tier 3 VR gates are blocking. **Cross-page T3 required** — footer renders on every page, so S must screenshot at least 4 pages at desktop + mobile.
- **Layer system** (`docs/pl2/theme-change.md`): if P19 option (a) is chosen, the Twig override is L6; any supporting CSS is L5. Override at the highest correct layer.
- **Dripyard guidance** (`~/Sites/ai_guidance/themes/dripyard-guidance.md`): neonbyte responsive structure, mobile panel vs header strip DOM positions — essential context for P19 investigation.
- Read `.component.yml` before referencing any prop name — schema is source of truth.
- No `!important`. Stage files by explicit path (never `git add .`).

## Verification environment

| Item | Value |
|---|---|
| DDEV URL | `https://pl-performantlabs.com.3.ddev.site:8493/` |
| Port | `8493` (from host, not inside ddev exec) |
| SSL | Locally-trusted mkcert cert — no `-k` flag needed |
| Cache clear | `ddev drush cr` before every verification run |
| Pa11y | Run from host against `/` and `/services` |
| Cross-page T3 | S screenshots `/`, `/services`, `/articles`, `/contact-us` at 1280px + 375px |

---

## Cycle plan

Single cycle. One branch, one commit.

### Cycle 1 — Footer fixes + mobile CTA decision

**Pipeline:** O → F → T → S → O

**Scope:**

1. **F.8: Footer Services sub-list broken anchor**
   - Current footer link targets `#testing-suite-takeover` but the actual card ID on `/services` is `#test-suite-takeover`.
   - Audit all footer Services sub-list anchors against the live `/services` page DOM.
   - Fix every mismatched anchor.
   - Location: likely `menu--region-footer-left.html.twig` or a Drupal menu config entity.

2. **F.9: Footer "Contact us" bare `/contact` link**
   - Footer "Get in touch" (or equivalent) CTA links to bare `/contact`.
   - Change to `/contact-us` to match the canonical route established in the services overhaul.
   - Audit for any other footer links that still use `/contact` and update them.
   - Location: same footer template or menu config.

3. **R1: Footer Services sub-list content alignment**
   - The homepage overhaul (R1) explicitly deferred the footer Services sub-list rewrite.
   - Now that `/services` is shipped with 4 engagements (Test Suite Takeover, Embedded Testing Engineer, Autonomous Healing Pilot, Accessibility Testing), the footer sub-list under "Services" should reflect these four engagements.
   - Each sub-list item links to `/services#<card-anchor-id>`.
   - F verifies the anchor IDs exist on the live page before wiring.
   - If the current footer has more or fewer items than 4, F restructures to match.

4. **P19: Mobile CTA visibility decision**
   - At 375px, the header "Call today" CTA is hidden inside the collapsible hamburger menu — not visible until the user opens the menu.
   - F investigates the neonbyte responsive structure and presents two options with effort estimates:
     - (a) Add a duplicate CTA in the header strip at mobile (Twig override of `header.html.twig` or the header-cta block). The CTA shows at mobile; desktop remains unchanged.
     - (b) Accept the current behavior. Document as intentional: "B2B consulting site — mobile CTA is one tap away via hamburger. Acceptable for the target audience."
   - O presents F's options to operator for a decision. If operator picks (a), F implements. If (b), F documents and closes.

**Acceptance criteria:**

- [x] Every footer Services sub-list link resolves to a valid anchor on `/services` (no broken `#` targets)
- [x] Footer Services sub-list items match the 4-engagement model from the `/services` overhaul
- [x] No footer link uses bare `/contact` — all use `/contact-us`
- [x] Mobile CTA decision documented — option (b) accepted: intentional, B2B audience, one tap via hamburger
- [x] If mobile CTA is implemented: N/A — option (b) chosen
- [x] T1 + T2 pass on `/`, `/services`, `/articles`, `/contact-us`
- [x] T3 visual at 1280px desktop and 375px mobile on at least `/`, `/services`, `/articles`, `/contact-us` — no regressions
- [x] Footer renders correctly on all four verified pages (no layout breaks, correct link targets)
- [x] Pa11y on `/` and `/services`: 0 errors
- [x] Heading hierarchy in footer unchanged or improved (no skip-level regressions)
- [x] Files staged by explicit path; no `git add .` (DB-only sprint — no filesystem changes)

**Handoff doc location:** `docs/pl2/handoffs/sprint-3-{F,T,S}.md`

**Commit message:** `fix(footer): services sub-list anchors + /contact-us links + engagement alignment`

(Commit message updated to include mobile CTA if option (a) is chosen: `fix(footer): services sub-list + contact-us links + mobile header CTA`)

---

## Approval Checkpoints

| After | Operator action |
|---|---|
| F presents mobile CTA options | Operator decides (a) implement or (b) accept current behavior |
| Cycle 1 commit | Operator clicks every footer link in browser at desktop + mobile. Verifies Services sub-list anchors scroll to correct cards. Explicit "approved" required to merge. |

---

## Out of scope

- Footer column heading semantic level (h3 vs h4) — already fixed in services Cycle 2 (`footer.css` demoted to 12px uppercase labels)
- Footer visual redesign or layout changes beyond the sub-list content
- Brand-seed color migration (P18)
- Any `/services` or homepage content changes
- Contact form changes

---

## Rework loop

If S returns REWORK:

1. O reads handoff-S, writes `docs/pl2/handoffs/sprint-3-rework-issue.md` quoting S's findings
2. F reads the rework issue, fixes on the same branch, writes `sprint-3-F-rework.md`
3. T re-runs verification on changed files only, writes `sprint-3-T-rework.md`
4. S re-audits, writes `sprint-3-S-rework.md`
5. If S returns PASS → O commits and merges
6. If S returns REWORK on round 2 → O pauses and consults operator

---

## Cleanup

After merge to `main`, delete sprint-3 handoff files. This runbook stays as permanent project documentation.

---

## Key references

| What you need | Where |
|---|---|
| O-F-T-S pipeline — agent roles, handoff templates | `docs/pl2/workflow-ofts.md` |
| Three-Tier Verification Hierarchy (T1/T2/T3) | `~/Sites/ai_guidance/testing/verification-cookbook.md` |
| 7-step CSS change workflow | `docs/pl2/theme-change--workflow.md` |
| CSS layer system and override strategy | `docs/pl2/theme-change.md` |
| Operational guidance (curl-first, efficiency rules) | `~/Sites/ai_guidance/frameworks/drupal/theming/operational-guidance.md` |
| Visual regression strategy (Tier 3 VR gates) | `~/Sites/ai_guidance/frameworks/drupal/theming/visual-regression-strategy.md` |
| Dripyard color architecture, OKLCH, theme wrappers | `~/Sites/ai_guidance/themes/dripyard-guidance.md` |
| Layer 4 component-wrapper override pattern | `~/Sites/ai_guidance/frameworks/drupal/theme-planning/color-management.md` |
| Canvas scripting protocol | `~/Sites/ai_guidance/frameworks/drupal/theming/canvas-scripting-protocol.md` |
| Design tokens, typography scale, spacing | `docs/pl2/Briefs/pl_design_brief.md` |

---

## Post-sprint-3 remaining debt

After all three sprints land, these items from `post-homepage-next.md` and `GET-BACK-TO-THESE.md` remain unresolved and should be triaged for a future sprint:

| ID | Item | Effort est. |
|---|---|---|
| P15 | H2 typography deviation (54px Instrument Sans vs brief's 40px Rubik) | Design decision |
| P16 | Cards grid 2+1 at 1280px desktop | ~30 min |
| P17 | Cards section `<div>` → `<section>` ARIA landmark | ~1 hr |
| P18 | Brand-seed `#0000d9` → `#1893b4` migration | 2–4 hr audit |
| ADV-3 | DOM-shape-sniffing CSS selectors (`:has(.grid-wrapper)`) fragility | Future maintenance |
| ADV-S5 | Primary-button contrast `#FFFFFF` on `#62bbcb` ≈ 2.21:1 | Button-token revision |
| G.1 | Homepage trust-bar logo sizes inconsistent | Asset sourcing |
| H.1 | /automated-testing §5 autonomous-healing metric `[N]` | Instrumentation |
| I.1 | Accessibility-engagement copy refinement | Editorial |
