# Sprint 2 — Mobile + AA Defensive Sweep Runbook

> **Parent:** [`post-homepage-next.md`](post-homepage-next.md)
> **Workflow:** [`workflow-ofts.md`](workflow-ofts.md) (O-F-T-S 4-agent pipeline)
> **Prerequisite:** Sprint 1 (conversion-path repair) merged to `main`
> **Upstream references:** [`pl-plan--services.md`](pl-plan--services.md) advisory ADV-S1/R8, [`post-homepage-next.md`](post-homepage-next.md) P13, P14, P20

---

## Status

| Item | State |
|---|---|
| Active theme | `performant_labs_20260502` |
| Branch | `aa/pl-sprint-2-mobile-aa-sweep` (from `main`) |
| Estimated effort | ~3 hours |
| **Status** | ✅ **Complete (2026-05-05).** Merged to `main`. |

---

## Objective

Close the four defensive CSS issues that affect mobile usability and WCAG 2.2 AA compliance across all pages. These are pre-existing site-wide problems surfaced during the homepage and `/services` audits — none were introduced by either overhaul, but both overhauls documented them as carry-forward debt.

---

## Locked decisions

| ID | Decision | Source |
|---|---|---|
| S2-R1 | **Mobile hero overflow fix is CSS-only.** The existing branch `aa/pl-mobile-hero-overflow` (opened during services overhaul, R8) may contain prior investigation — F should check it first. The fix targets WCAG 1.4.10 reflow at 320px CSS px. | services runbook R8 |
| S2-R2 | **Dark-zone link color must hit 4.5:1 AA on espresso `#1F1A14`.** Suggested candidates: `#5DC6E8` or `#7AD0E8`. F picks the value and documents the contrast ratio. Applies to `.theme--dark`, `.theme--black`, `.theme--primary` zones. | post-homepage-next P14 |
| S2-R3 | **Title-CTA link color: replace literal `#107D9B` with token.** Preferred path is `var(--theme-link-color)` so it inherits the centrally-managed AA-safe value. If that does not work in the title-cta context (e.g., dark-zone title-cta needs the dark-zone link color), F documents why and picks an appropriate value. | post-homepage-next P13 |
| S2-R4 | **`.site-header__content` border-radius is a 5-minute defensive fix.** Include it in this sprint's commit but do not over-engineer — single rule addition. | post-homepage-next P20 |
| S2-R5 | **7-step CSS change workflow applies.** Every CSS edit follows the workflow in `theme-change--workflow.md`, including the Step 3 layer-approval gate for any L3 token changes. | standing rule |

---

## Operating rules

All agents follow the standing operating rules from `workflow-ofts.md`. Sprint-specific emphasis:

- **7-step CSS change workflow** (`docs/pl2/theme-change--workflow.md`): **mandatory for every CSS edit in this sprint.** All four scope items are CSS. Step 3 layer-approval gate is especially critical for item #2 (P14 dark-zone link color) which touches L3 tokens.
- **Three-Tier Verification Hierarchy** (`~/Sites/ai_guidance/testing/verification-cookbook.md`): T runs Tier 1 + Tier 2. S runs Tier 3. Curl first, browser last. T must pass before S starts.
- **Operational guidance** (`~/Sites/ai_guidance/frameworks/drupal/theming/operational-guidance.md`): curl-first principle, efficiency rules, known failure patterns. F should read this before starting.
- **Visual regression strategy** (`~/Sites/ai_guidance/frameworks/drupal/theming/visual-regression-strategy.md`): Tier 3 VR gates are blocking. S compares against current rendered state (no preview HTML for this sprint — regression check only).
- **Layer system** (`docs/pl2/theme-change.md`): L1 (Drupal config) → L3 (`:root` tokens in `base.css`) → L5 (component CSS via `libraries-extend`) → L6 (Twig). Override at the highest correct layer. Never patch at L4.
- **Dripyard guidance** (`~/Sites/ai_guidance/themes/dripyard-guidance.md`): color architecture, OKLCH-derived token chains, theme-wrapper specificity patterns. Essential for P14 dark-zone token work.
- **Color management** (`~/Sites/ai_guidance/frameworks/drupal/theme-planning/color-management.md`): Layer 4 component-wrapper override pattern — `html .theme--dark { --token: value; }` beats Dripyard's inline style on specificity.
- Read `.component.yml` before referencing any prop name — schema is source of truth.
- No `!important`. Stage files by explicit path (never `git add .`).
- **WCAG contrast computation is F's and T's responsibility.** F computes and documents ratios in handoff. T cross-checks independently. Both use hex values from CSS files, not screenshots.

## Verification environment

| Item | Value |
|---|---|
| DDEV URL | `https://pl-performantlabs.com.3.ddev.site:8493/` |
| Port | `8493` (from host, not inside ddev exec) |
| SSL | Locally-trusted mkcert cert — no `-k` flag needed |
| Cache clear | `ddev drush cr` before every verification run |
| Image flush | `ddev drush image:flush --all` if any image-related CSS changes |
| Pa11y | Run from host: `pa11y https://pl-performantlabs.com.3.ddev.site:8493/` |
| Mobile reflow check | S verifies at 320px (WCAG 1.4.10) and 375px (common mobile) |

---

## Cycle plan

Single cycle. One branch, one commit.

### Cycle 1 — Four CSS fixes

**Pipeline:** O → F → T → S → O

**Scope:**

1. **ADV-S1: Mobile hero horizontal overflow (WCAG 1.4.10)**
   - At viewport widths <=375px, the hero section causes page-level horizontal scroll.
   - Root cause (from services S audit): hero content or hero container lacks `overflow` containment or has a min-width that exceeds the viewport.
   - Check branch `aa/pl-mobile-hero-overflow` for prior investigation before starting fresh.
   - Fix must not break desktop hero layout.
   - Verify at 320px (WCAG 1.4.10 minimum) and 375px (common mobile).
   - Layer: L5 (`css/components/hero.css` or `css/components/dy-section.css`).

2. **P14: Dark-zone `--theme-link-color` contrast**
   - Current value in `.theme--dark`, `.theme--black`, `.theme--primary`: `#1893b4` on espresso `#1F1A14` = ~2.46:1 (fails AA body-text 4.5:1 and large-text 3:1).
   - Pick an AA-safe lighter teal. Compute contrast against `#1F1A14` (espresso surface) and any other dark surfaces in the zone.
   - Update the three zone definitions in `css/base.css`.
   - Verify no visual regression on `/services` §6 (dark section) or any other dark-zone content.
   - Layer: L3 (`:root` / zone tokens in `base.css`). **Step 3 layer trace required.**

3. **P13: Title-CTA literal `#107D9B` replacement**
   - `css/components/title-cta.css` uses literal hex `#107D9B`. On cream `#F5EFE2` = 4.14:1 (fails body-text AA 4.5:1).
   - Replace with `var(--theme-link-color)` so it inherits the centrally-managed value (`#0F6F8A` on white/light/secondary zones, the dark-zone value from fix #2 above on dark zones).
   - Verify on `/services` §3, §4 (cream/white sections) and §6 (dark section).
   - Layer: L5 (`css/components/title-cta.css`).

4. **P20: `.site-header__content` residual border-radius**
   - `header.theme.css:56` sets `border-radius: var(--radius-md)` (8px) on `.site-header__content`. The Phase 4 `--header-border-radius: 0` override cascades to `__shadow` and `__container` but not to `__content` (different token).
   - Add `.site-header__content { border-radius: 0; }` to `header.css`.
   - Visually invisible today (no painted background on `__content`) but ensures source correctness.
   - Layer: L5 (`css/components/header.css`).

**Acceptance criteria:**

- [x] At 320px and 375px viewport, no page-level horizontal scroll on `/services` or `/` (document `scrollWidth <= clientWidth`)
- [x] Dark-zone `--theme-link-color` contrast on espresso `#1F1A14` >= 4.5:1 (8.81:1 — `#5DC6E8`)
- [x] Title-CTA body text contrast on cream `#F5EFE2` >= 4.5:1 (fix applied in `button.css`)
- [x] `.site-header__content` computed `border-radius` = 0 on desktop
- [x] No `!important` introduced
- [x] Step 3 layer trace presented for any L3 token change (P14 dark-zone link color)
- [x] T1 + T2 pass on `/services`, `/`, `/articles`
- [x] T3 visual at 1280px desktop — no regressions vs current state
- [x] T3 visual at 375px mobile — hero no longer overflows; dark sections render link text legibly
- [x] Pa11y on `/services` and `/`: 0 errors
- [x] WCAG 1.4.10 reflow check at 320px: content reflows without horizontal scroll
- [x] Files staged by explicit path; no `git add .`

**Handoff doc location:** `docs/pl2/handoffs/sprint-2-{F,T,S}.md`

**Commit message:** `fix(a11y): mobile hero overflow + dark-zone link contrast + title-cta token + header radius`

---

## Approval Checkpoints

| After | Operator action |
|---|---|
| Cycle 1 commit | Operator checks `/services` and `/` at mobile 375px in browser. Verifies no horizontal scroll, dark-section links legible. Explicit "approved" required to merge. |

---

## Out of scope

- Mobile CTA visibility in header strip (P19 — Sprint 3 or later)
- Brand-seed `#0000d9` → `#1893b4` color migration (P18 — separate high-blast-radius audit)
- Cards grid 2+1 layout at 1280px (P16)
- Section ARIA landmark `<div>` → `<section>` (P17)
- Any content/Canvas changes

---

## Rework loop

If S returns REWORK:

1. O reads handoff-S, writes `docs/pl2/handoffs/sprint-2-rework-issue.md` quoting S's findings
2. F reads the rework issue, fixes on the same branch, writes `sprint-2-F-rework.md`
3. T re-runs verification on changed files only, writes `sprint-2-T-rework.md`
4. S re-audits, writes `sprint-2-S-rework.md`
5. If S returns PASS → O commits and merges
6. If S returns REWORK on round 2 → O pauses and consults operator

---

## Cleanup

After merge to `main`, delete sprint-2 handoff files and the `aa/pl-mobile-hero-overflow` branch (if its investigation was consumed). This runbook stays as permanent project documentation.

---

## Key references

| What you need | Where |
|---|---|
| O-F-T-S pipeline — agent roles, handoff templates | `docs/pl2/workflow-ofts.md` |
| Three-Tier Verification Hierarchy (T1/T2/T3) | `~/Sites/ai_guidance/testing/verification-cookbook.md` |
| 7-step CSS change workflow (mandatory this sprint) | `docs/pl2/theme-change--workflow.md` |
| CSS layer system and override strategy | `docs/pl2/theme-change.md` |
| Operational guidance (curl-first, efficiency rules) | `~/Sites/ai_guidance/frameworks/drupal/theming/operational-guidance.md` |
| Visual regression strategy (Tier 3 VR gates) | `~/Sites/ai_guidance/frameworks/drupal/theming/visual-regression-strategy.md` |
| Dripyard color architecture, OKLCH, theme wrappers | `~/Sites/ai_guidance/themes/dripyard-guidance.md` |
| Layer 4 component-wrapper override pattern | `~/Sites/ai_guidance/frameworks/drupal/theme-planning/color-management.md` |
| Design tokens, typography scale, spacing | `docs/pl2/Briefs/pl_design_brief.md` |
