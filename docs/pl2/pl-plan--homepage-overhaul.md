# Homepage Overhaul — Execution Plan

> **Parent:** [`pl-plan.md`](pl-plan.md)
> **Related:** [`pl-plan--theme.md`](pl-plan--theme.md) (Stage 1 theme creation), [`pl-plan--components.md`](pl-plan--components.md) (Stage 2 component workflow), [`Briefs/archive/pl_homepage_components.md`](Briefs/archive/pl_homepage_components.md) (component mapping).

End-to-end runbook for replacing the current homepage with the design captured in [`Briefs/pl_design_brief.md`](Briefs/pl_design_brief.md) and rendered as a static reference at [`Previews/homepage.html`](Previews/homepage.html). Canvas page-builder is the assembly tool. The new theme is `performant_labs_20260502`, a direct child of `neonbyte`.

This document is a **trackable runbook**. Every phase, commit, and approval checkpoint is a checkable item — work top-to-bottom and tick boxes as you go. Don't move to the next phase until the previous phase's "Phase N complete" box is checked.

---

## Operating principles (apply to every step)

These rules are non-negotiable. They come from `theme-change.md`, `theme-change--workflow.md`, the AI-guided theme generation SOP, `operational-guidance.md`, `color-management.md`, and the `verification-cookbook.md` Tier 2 contrast pattern. Repeating them here so a single read of this file is enough to act safely.

1. **Every CSS change follows the 7-step workflow** at [`theme-change--workflow.md`](theme-change--workflow.md). Trace the variable chain. Override at the highest correct layer. Never override at the point of noticing.
2. **Every verification follows the Three-Tier Hierarchy.** Tier 1 (`curl`) → Tier 2 (ARIA structural) → Tier 3 (visual). Tier 3 never runs before Tier 2 passes. See [`~/Sites/ai_guidance/testing/verification-cookbook.md`](../../../ai_guidance/testing/verification-cookbook.md).
3. **Color overrides use the Layer 4 component-wrapper pattern.** `html .theme--white { --theme-surface: …; }`. Beats Dripyard's inline `<html>` style on specificity. See `Briefs/archive/pl_homepage_components.md` §"How Dripyard's color system actually works."
4. **Read the `.component.yml` before any prop reference.** Never write a Canvas `component_id`, prop name, slot name, schema value, or entity ID from memory.
5. **Preserve Canvas `component_version`** in every assembly script — do NOT set to NULL. Canvas throws `OutOfRangeException` on NULL/empty values (discovered Sprint 5 cycle 2, 2026-05-11). For patches: leave the field's existing valid hash untouched. For new components: read the valid hash from the component's `.component.yml` or copy from an existing instance. See `scripts/sprint6-cycle3-nearshore-marker.php` for the idempotent-preserving pattern.
6. **Stage files by explicit path.** Never `git add .`.
7. **One commit per component override.** Rollback isolation matters when something breaks.
8. **Curl first, browser last.** Browser subagent calls take 60–90 s — most checks have a sub-5-s curl answer. See `operational-guidance.md` §1.
9. **Stop at every Approval Checkpoint** (marked with 🛑 below). Do not infer consent from prior context.
10. **WCAG 2.2 AA is non-negotiable.** Dripyard ships AA-compliant. Our overrides must not regress that. Every backdrop change (background, theme zone, position switch, layout token) triggers a Tier 2 contrast re-check before Tier 3 — see the WCAG section below.

---

## WCAG 2.2 AA compliance — where to enforce it

Dripyard's OKLCH engine maintains AA contrast ratios automatically *for the colors it generates*. The risk is entirely in **our overrides** — when we hard-code hexes at Layer 4, we step outside the OKLCH math and have to verify contrast ourselves. The plan enforces compliance at four points:

### Tier 2 backdrop-change contrast check (the primary mechanism)

Per [`verification-cookbook.md`](../../../ai_guidance/testing/verification-cookbook.md) §"Backdrop Changes — Re-run Contrast, Don't Re-screenshot":

- **Trigger:** any change that alters an element's backdrop — background colour, overlay opacity, theme-wrapper switch, layout token that moves an element to a new surface.
- **Gate:** body text ≥ **4.5:1**, large text (≥18pt or 14pt bold) ≥ **3.0:1**. Aim for AAA where practical (≥ 7:1 / ≥ 4.5:1).
- **Method:** compute contrast numerically from computed styles. A screenshot can *look* readable while failing AA — the 2026-04-20 PL2 canvas hero incident is documented at 2.33:1, well below AA.
- **Block:** if contrast fails, fix the color and re-check before any Tier 3 screenshot.

### Focus-ring visibility

Per `dripyard-guidance.md`, every interactive element has a `--theme-focus-ring-color` that must contrast ≥ 3:1 against its surface (WCAG 2.4.7). Verify on all six theme variants in Phase 2.

### Touch-target size

Mobile interactive elements must be ≥ 44×44 CSS pixels (WCAG 2.5.5 AAA / Apple HIG / WCAG 2.5.8 AA Target Size minimum). Existing button SDC at 14px × 28px padding + 15px type clears this comfortably. Verify per component in Phase 4 mobile checks.

### Forced-colors mode and reduced-motion

Dripyard handles both natively. Our overrides must:
- Use `currentColor` and `color-mix` patterns where possible so forced-colors mode (Windows High Contrast) inherits user's system colors.
- Wrap any animations in `@media (prefers-reduced-motion: no-preference)` so users with motion sensitivity get static results.

Verify with a forced-colors media query test in Phase 7.

### Semantic structure (Tier 2 ARIA)

Every Tier 2 audit confirms: landmark roles (`<header>`, `<main>`, `<footer>`, `<nav>`), heading hierarchy without skips, button vs link semantics correct, list semantics for grouped items, image `alt` text present, form labels associated. See per-component WCAG items in Phase 4.

---

## Phase 0 — Pre-flight readiness

**Goal:** confirm the environment is ready before any code is written.

**Steps:**
- [ ] Read [`~/Sites/ai_guidance/frameworks/drupal/theming/ai-guided-theme-generation.md`](../../../ai_guidance/frameworks/drupal/theming/ai-guided-theme-generation.md) Phase 0 in full.
- [ ] Read [`~/Sites/ai_guidance/frameworks/drupal/theming/operational-guidance.md`](../../../ai_guidance/frameworks/drupal/theming/operational-guidance.md) in full.
- [ ] Read [`~/Sites/ai_guidance/themes/dripyard-guidance.md`](../../../ai_guidance/themes/dripyard-guidance.md) §1–§9 (Stack, Hierarchy, Color, Typography, Layout, Library, Preprocess, SDC).
- [ ] Read [`~/Sites/ai_guidance/testing/verification-cookbook.md`](../../../ai_guidance/testing/verification-cookbook.md) §Tier 2 (Skeleton-First) and §"Backdrop Changes — Re-run Contrast" in full.
- [ ] Read [`pre-flight-checks.md`](pre-flight-checks.md) and complete every item.
- [ ] Verify SDC Styleguide module is enabled: `ddev drush pm:list --type=module | grep sdc_styleguide`.
- [ ] Confirm SDC explorer is reachable: `ddev exec "curl -sk -o /dev/null -w '%{http_code}' https://pl-performantlabs.com.3.ddev.site/styleguide/explorer"` (expect `200` or `403`).
- [ ] Take a Canvas snapshot per the SOP Phase 3 procedure: `canvas_snapshot_<timestamp>.sql` in project root, gitignored.
- [ ] Confirm git working tree is clean and we are on a feature branch (not `main`).
- [ ] 🛑 **Approval Checkpoint 0:** Confirm all pre-flight items pass before proceeding to Phase 1.
- [ ] **Phase 0 complete**

---

## Phase 1 — Scaffold `performant_labs_20260502`

**Goal:** create an empty subtheme of neonbyte and prove it loads.

**Reference:** [`pl-plan--theme.md`](pl-plan--theme.md) for the canonical scaffold procedure.

**Steps:**
- [x] Generate the theme from `dripyard_starterkit`:
  ```bash
  ddev drush theme:generate-from-starterkit dripyard_starterkit performant_labs_20260502 \
    --path=web/themes/custom/performant_labs_20260502 \
    --name="Performant Labs (2026-05-02)"
  ```
- [x] **Edit `performant_labs_20260502.info.yml`**: change `'base theme': dripyard_base` to `'base theme': neonbyte`. The starterkit defaults to dripyard_base — this single line makes us a child of neonbyte instead.
- [x] Drop scaffold files we will not use (`assets/` placeholder content, the Vue starter component, etc. — keep only the bones).
- [x] Enable the theme: `ddev drush theme:enable performant_labs_20260502`.
- [x] Tier 1 verify: `ddev drush config:get system.theme | grep default` shows the live theme is unchanged (we don't activate it yet — preview via `?theme=performant_labs_20260502`).
- [x] Tier 1 verify: `ddev exec "curl -sk 'https://pl-performantlabs.com.3.ddev.site/?theme=performant_labs_20260502' -o /dev/null -w '%{http_code}'"` returns `200`.
- [x] Tier 1 verify: `ddev drush php-eval "print_r(\Drupal::service('theme_handler')->listInfo()['performant_labs_20260502']->info['base theme']);"` returns `neonbyte`.
- [x] **Commit:** `feat(theme): scaffold performant_labs_20260502 as neonbyte subtheme`.
- [x] 🛑 **Approval Checkpoint 1:** Confirmed — empty theme loads, inherits neonbyte, previews at 200.
- [x] **Phase 1 complete**

---

## Phase 2 — Color foundation (Layer 4 component-wrapper overrides)

**Goal:** map the brand palette into Dripyard's 4-layer color architecture so every downstream component inherits correctly.

**Reference:** [`color-management.md`](../../../ai_guidance/frameworks/drupal/theme-planning/color-management.md), [`Briefs/archive/pl_homepage_components.md`](Briefs/archive/pl_homepage_components.md) §"How Dripyard's color system actually works."

**Steps:**
- [x] Inspect `themes/neonbyte/css/themes/theme-{white,light,dark,black,primary,secondary}.css` to confirm the exact `--theme-*` variable names neonbyte sets. The list in `color-management.md` is the contract — verify it before writing the override.
- [x] Inspect `themes/neonbyte/css/_variables/variables-colors-semantic.css` to confirm the OKLCH curve neonbyte uses for `--primary-100` through `--primary-1000`. Decide whether to inherit it or override it.
- [x] Author `web/themes/custom/performant_labs_20260502/css/base.css` containing the Layer 4 component-wrapper overrides per the table in `Briefs/archive/pl_homepage_components.md`. Six rule blocks: `theme--white`, `theme--light`, `theme--dark`, `theme--black`, `theme--primary`, `theme--secondary`.
- [x] Author the brand-specific tokens (`--pl-accent`, `--pl-accent-deep`, `--pl-accent-tint`) under `:root` in the same file.
- [x] Wire `base.css` into `performant_labs_20260502.libraries.yml` as the `base` library and add it to the theme's `libraries` list in `info.yml`.
- [x] Tier 1 verify: `ddev exec "curl -sk 'https://pl-performantlabs.com.3.ddev.site/?theme=performant_labs_20260502' | grep -o '\-\-theme-surface:[^;]*' | head -3"` shows the new value, not Dripyard's OKLCH default.
- [x] Tier 1 verify each theme variant on a representative page that uses it. Confirm `--theme-surface` resolves to the expected hex per the table.
- [x] **WCAG contrast check** — for every `theme--*` block, compute the contrast ratio of `--theme-text-color-primary` vs `--theme-surface` and `--theme-text-color-loud` vs `--theme-surface`. Both must pass AA (≥ 4.5 body / ≥ 3.0 large). Record ratios for each variant. *(5 of 6 zones pass; `theme--primary` is brand-locked at 3.58:1, documented in design brief §247-253.)*
- [x] **WCAG focus-ring check** — for every `theme--*` block, confirm `--theme-focus-ring-color` contrasts ≥ 3:1 against `--theme-surface`. *(All six zones pass, 3.12:1–8.60:1.)*
- [x] **WCAG link contrast check** — `--theme-link-color` and `--theme-link-hover` against `--theme-surface` must both pass AA. *(Light zones: link 3.11–3.58:1 brand-locked, hover passes; dark zones: 4.83–5.32:1 pass.)*
- [x] **Commit:** `feat(theme): map brand palette to Dripyard Layer 4 theme wrappers`.
- [x] 🛑 **Approval Checkpoint 2:** Confirmed — color resolution correct, AA contrast documented on all variants. Brand-locked failures accepted per design brief.
- [x] **Phase 2 complete**

**Known trap:** Dripyard injects `--theme-setting-base-primary-color` as an inline style on `<html>`. If you override at Layer 2 (`:root { --primary: …; }`) the inline style wins on specificity and your color disappears in components. Layer 4 (`html .theme--white { … }`) beats inline because of the descendant selector against `html`.

---

## Phase 2.5 — Mobile typography foundation

**Goal:** add responsive `@media` queries for the mobile typography scale to `base.css` so every downstream component inherits correct sizing at mobile viewports.

**Reference:** [`Briefs/pl_design_brief.md`](Briefs/pl_design_brief.md) §"Responsive behavior" — the `typography-mobile` YAML block and the mobile typography scale table.

**Steps:**
- [x] Read `Briefs/pl_design_brief.md` §"Responsive behavior" in full, including the `typography-mobile` front matter block.
- [x] Inspect neonbyte and Dripyard for existing responsive typography rules. Determine which sizes they already handle and which need overrides.
- [x] Author `@media (max-width: 576px)` block in `web/themes/custom/performant_labs_20260502/css/base.css` with the mobile typography scale: `display-xl` 44px/-1px, `display-lg` 36px/-1.2px, `display-md` 30px/-0.8px, `heading-lg` 24px, `heading-md` 20px, `heading-sm` 17px, `body-lg` 17px.
- [x] Author section padding reduction from 96px to 64px at `sm`. *(80px Dripyard default → 64px per brief, using `--spacing-component: var(--sp8)`.)*
- [x] Tier 1 verify: `curl` the served `base.css` and confirm the `@media` block is present with the correct values.
- [x] Tier 1 verify: confirm no conflicts with Dripyard's own responsive rules (check specificity). *(:root inside @media beats Dripyard's :root at same specificity via load order.)*
- [x] **Commit:** `feat(theme): add mobile typography scale and section padding to base.css`.
- [x] **Phase 2.5 complete**

**Note:** This phase was inserted after Phase 2 to establish the responsive typography foundation before any component work. Without it, components built in Phases 3–5 would inherit desktop-only sizes.

---

## Phase 3 — Bespoke `kicker` SDC

**Goal:** build the editorial-label component used by hero, section heads, and the closing CTA.

**Reference:** [`Briefs/archive/pl_homepage_components.md`](Briefs/archive/pl_homepage_components.md) §"Bespoke components to build → kicker."

**Steps:**
- [x] Create `web/themes/custom/performant_labs_20260502/components/kicker/kicker.component.yml` with the schema from the brief.
- [x] Create `kicker.twig` rendering `<span class="kicker kicker--{variant} kicker--{theme}">…</span>` with `::before` and `::after` rule pseudo-elements for the centered variant.
- [x] Create `kicker.css` with the type, color, and accent-rule treatment. *(Mono font per issue spec override; 400 weight per YAML; `--pl-accent-tint` for dark centered rules per issue spec.)*
- [x] Tier 2 verify in SDC Styleguide explorer at `/styleguide/explorer` — render kicker with each (variant, theme) pair. Confirm both variants render in both themes. *(Explorer returned 403 — not a component defect. SDC registration confirmed via drush.)*
- [x] **WCAG contrast check** — `--pl-accent-deep` (#A85F40) on #FFFFFF = 4.80:1 PASS. `--pl-accent` (#C97B5C) on #1F1A14 = 5.32:1 PASS. Accent rules: light 3.25:1 PASS (non-text), dark 10.41:1 PASS.
- [x] **WCAG semantic check** — kicker is `<span>`, no heading role, no ARIA heading. Heading hierarchy unaffected.
- [x] **Commit:** `feat(components): add kicker SDC for editorial labels`.
- [x] **Phase 3 complete**

---

## Phase 4 — Component CSS overrides (one commit each)

**Goal:** apply the design brief's CSS treatment to the existing Dripyard / neonbyte components used on the homepage. Each item is a separate commit so rollback isolates one change.

**Reference:** [`pl-plan--components.md`](pl-plan--components.md) Stage 2 workflow. Override pattern is `libraries-extend` (no bundle copy unless markup changes).

**Common procedure for every sub-phase below.** Apply this 7-item checklist within each component sub-phase:

> 1. Read the component's `.component.yml` to confirm prop names. Never write a class selector based on a prop name remembered.
> 2. Apply the 7-step workflow from `theme-change--workflow.md`. The trace tells you which layer the override belongs at — usually the component layer.
> 3. Author the CSS file in `css/components/<name>.css`.
> 4. Add a library entry in `performant_labs_20260502.libraries.yml`.
> 5. Add the `libraries-extend` mapping in `info.yml`.
> 6. Tier 1 verify: relevant CSS variables and selectors present in the rendered HTML.
> 7. Tier 2 verify in SDC Styleguide explorer — component renders with new visual rules.

### 4.1 — `card` (Dripyard)

**Library key:** `core/components.dripyard_base--card`. **File:** `css/components/card.css`. **What changes:** terracotta `eyebrow_text` styling (mono font, 1.6px tracking, 24px accent rule preceding text, `--pl-accent-deep` color). Hairline 1px border (no shadow). Hover shifts border to `--theme-link-color`. Internal padding `32px`.

- [x] Read `themes/dripyard_base/components/card/card.component.yml` for confirmed prop and slot names.
- [x] Trace the variable chain (7-step Step 2) for any token used.
- [x] Author `css/components/card.css`. *(Specificity matched via `.card[class*="theme"]` (0,2,0) to beat Dripyard defaults.)*
- [x] Wire library + `libraries-extend`.
- [x] Tier 1: eyebrow class + selectors present.
- [x] Tier 2: SDC explorer renders all variants. *(Explorer 403 — registration confirmed via drush. Isolated render verified by T.)*
- [x] **WCAG check** — #A85F40 on #FFFFFF = 4.80:1 PASS. Focus ring: 2px outline `--theme-focus-ring-color` at 3.58:1 PASS. Hover border not sole interactivity signal.
- [x] Mobile check at 375px. *(No responsive overrides in card.css. Padding unconditional 32px. Grid collapse deferred to Phase 6.)*
- [x] **Commit:** `feat(components): override card for performant_labs_20260502 brand`.
- [x] **4.1 complete**

### 4.2 — `accordion` (Dripyard)

**Library key:** `core/components.dripyard_base--accordion`. **File:** `css/components/accordion.css`. **What changes:** port the 20260411 pattern — hairline top/bottom borders only, no background fill, no shadow. `+`/`−` indicator color recolored from amber `#F59E0B` to `--theme-link-color` (teal).

- [x] Read `themes/dripyard_base/components/accordion/accordion-item/accordion-item.component.yml` for prop and slot names.
- [x] Trace the variable chain. *(L5 correct: tokens already set at L3, changes are component-structural.)*
- [x] Author `css/components/accordion.css`. Ported 20260411 pattern with `--theme-border-color` vars, matched (0,2,0) specificity for borders variant.
- [x] Wire library + `libraries-extend` on `core/components.dripyard_base--accordion-item`.
- [x] Tier 1: accordion selectors present.
- [x] Tier 2: open/close works via native `<details>`/`<summary>`. `aria-expanded` not applicable (native disclosure). Chevron SVG visible (documented deviation from `+`/`-`).
- [x] **WCAG check** — keyboard operable (Enter/Space). Touch target ~69px (clears 48px). Focus ring visible (teal dashed).
- [x] **WCAG contrast** — indicator #1893B4 on #F5EFE2 = 3.12:1 PASS (non-text ≥3.0:1). Heading #1F1A14 on #F5EFE2 = 15.69:1 PASS. Body #5C544C on #F5EFE2 = 6.47:1 PASS.
- [x] Mobile check at 375px. *(No responsive overrides. Full-width, ~69px rows, indicator right-aligned.)*
- [x] **Commit:** `feat(components): override accordion for performant_labs_20260502 brand`.
- [x] **4.2 complete**

### 4.3 — `icon-list` (Dripyard)

**Library key:** `core/components.dripyard_base--icon-list`. **File:** `css/components/icon-list.css`. **What changes:** recolor checkmark icons from amber `#F59E0B` to `--theme-link-color` (teal). Item spacing matches design brief.

- [x] Read `themes/dripyard_base/components/icon-list/icon-list-item/icon-list-item.component.yml` and `icon-list.component.yml`.
- [x] Trace the variable chain. *(L5 correct: `--icon-list-icon-color` custom property override scoped to component.)*
- [x] Author `css/components/icon-list.css`. Single rule: `.icon-list--icon-color-primary .icon-list-item { --icon-list-icon-color: var(--theme-link-color); }`.
- [x] Wire library + `libraries-extend` on `core/components.dripyard_base--icon-list-item`.
- [x] Tier 1: icon-list selectors present, icon color resolves to #1893B4.
- [x] Tier 2: list items render with teal checkmarks on page.
- [x] **WCAG check** — `<ul>`/`<li>` semantics preserved. Icons `aria-hidden="true"`. Text #5C544C on #FFFFFF = 6.6:1 PASS. Icon #1893B4 on #FFFFFF = 3.58:1 PASS (non-text ≥3.0:1).
- [x] Mobile: single-column full-width, no media queries, no overflow.
- [x] **Commit:** `feat(components): override icon-list for performant_labs_20260502 brand`.
- [x] **4.3 complete**

### 4.4 — `logo-grid` (Dripyard)

**Library key:** `core/components.dripyard_base--logo-grid`. **File:** `css/components/logo-grid.css`. **What changes:** label "Trusted by teams at" in `--theme-text-color-medium`, uppercased, 1.6px tracking. Hairline top + bottom borders on the section. Logos at consistent visual weight.

- [x] Read `themes/dripyard_base/components/logo-grid/logo-grid/logo-grid.component.yml` and `logo-item.component.yml`.
- [x] Trace the variable chain. *(L5 correct: tokens at L3 already correct, changes are component-structural.)*
- [x] Author `css/components/logo-grid.css`. Hairline borders, `max-height: 28px`, `grayscale(1)`, `object-fit: contain`, label CSS via `:has()`.
- [x] Wire library + `libraries-extend` on `core/components.dripyard_base--logo-grid`.
- [x] Tier 1: logo wrappers present, borders visible. *(Label markup absent — content-layer task, CSS is ready.)*
- [x] Tier 2: 6 logos render at consistent height, centered, grayscale.
- [x] **WCAG check** — all 6 logos have descriptive alt text (company names). No text-in-image without alt.
- [x] **WCAG contrast** — label CSS uses `--theme-text-color-medium` (#5C544C) on #FFFFFF = 7.43:1 PASS.
- [x] Mobile: Dripyard flex-wrap handles wrapping. No custom media queries needed. No overflow.
- [x] **Commit:** `feat(components): override logo-grid for performant_labs_20260502 brand`.
- [x] **4.4 complete**

### 4.5 — `button` (Dripyard)

**Library key:** `core/components.dripyard_base--button`. **File:** `css/components/button.css`. **What changes:** add a `button-ghost-on-dark` modifier class (transparent bg, cream border at 40% alpha, cream text, hover lifts bg to 8% alpha). `style: outline` on dark surfaces uses this. Pill radius (30px) preserved from 20260411.

- [x] Read `themes/dripyard_base/components/button/button.component.yml`.
- [x] Trace the variable chain — button has multiple existing styles (`primary`, `secondary`, `light`, `dark`, `outline`, `bare`). Confirm which combine with theme prop and which override it.
- [x] Author `css/components/button.css`. Reference the 20260411 amber CTA pattern.
- [x] Wire library + `libraries-extend`.
- [x] Tier 1: button class selectors present, modifier class registered.
- [x] Tier 2: SDC explorer — render every (style × theme) combination. Confirm primary stays teal everywhere. Ghost-on-dark renders correctly on espresso.
- [x] **WCAG focus ring** — every button shows a visible focus ring on Tab. Ring meets 3:1 contrast on its surface.
- [x] **WCAG contrast** — text on every button background passes AA. Especially confirm: cream text on espresso (≥ 7:1, AAA). Teal `#62bbcb` resting bg + white text (≈ 2.4:1, **fails AA on small text** — confirm with `verification-cookbook.md` §contrast pattern). If failing, deepen the resting bg or darken the text. *(Primary bg deepened to `#107D9B` → 4.74:1 AA pass.)*
- [x] **WCAG touch target** — ≥ 44×44 CSS px on mobile. Existing 14×28 padding + 15px type clears this.
- [x] Mobile check at 375px.
- [x] **Commit:** `feat(components): override button for performant_labs_20260502 brand`.
- [x] **4.5 complete**

### 4.6 — `title-cta` (Dripyard)

**Library key:** `core/components.dripyard_base--title-cta`. **File:** `css/components/title-cta.css`. **What changes:** mostly inherits correctly from theme-prop overrides. Verify: `theme: dark` with `layout: center` and `button_style: primary` produces espresso bg + cream text + teal button + centered layout. Add display-lg type sizing for the title.

- [x] Read `themes/dripyard_base/components/title-cta/title-cta.component.yml`.
- [x] Trace the variable chain.
- [x] Author `css/components/title-cta.css` — minimal, only what doesn't inherit.
- [x] Wire library + `libraries-extend`.
- [x] Tier 1: title-cta wrapper present, theme class applied. *(CSS confirmed in served file; SDC placement is Phase 6.)*
- [x] Tier 2: SDC registration confirmed via drush (`dripyard_base:title-cta` at index [33]).
- [x] **WCAG contrast** — cream `#F5EFE2` on espresso `#1F1A14` = 15.07:1 (AAA). Medium text `#B8AFA0` on espresso = 7.96:1 (AAA). Teal button `#107D9B` / white = 4.74:1 (AA).
- [x] **WCAG semantic** — `html_element: 'h2'` confirmed in Twig. CTA renders as `<a>` when `button_href` set — correct element type.
- [x] Mobile check at 375px. *(36px / -1.2px at ≤576px; full-width button rule present.)*
- [x] **Commit:** `feat(components): override title-cta for performant_labs_20260502 brand`.
- [x] **4.6 complete**

### 4.7 — `hero` (neonbyte)

**Library key:** `core/components.neonbyte--hero`. **File:** `css/components/hero.css`. **What changes:** display-xl typography sizing for headline (72px desktop, 44px mobile). Tight tracking (-2px). Kicker placement in `hero_content` slot. Subhead at body-lg sizing.

- [x] Read `themes/neonbyte/components/hero/hero.component.yml`.
- [x] Trace the variable chain — hero uses `--theme-surface`, `--theme-text-color-primary` from the theme prop.
- [x] Author `css/components/hero.css`. Reference the 20260418 hero pattern as a structural baseline.
- [x] Wire library + `libraries-extend`.
- [x] Tier 1: hero wrapper present, slot content rendered. *(Override dormant on live hero until Phase 5/6 Canvas assembly places theme--white hero.)*
- [x] Tier 2: SDC registration confirmed via drush. Kicker spacing, headline sizing, subhead sizing, button flex layout all verified in CSS.
- [x] **WCAG heading hierarchy** — H1 in hero confirmed from Twig. Kicker is `<span>` (Phase 3 confirmed, still `<span>`).
- [x] **WCAG contrast** — headline `#1F1A14` on `#FFFFFF` = 17.27:1 (AAA). Subhead `#5C544C` on `#FFFFFF` = 7.43:1 (AAA).
- [x] **WCAG focus ring on buttons** — `#1893b4` on `#FFFFFF` = 3.58:1 (AA non-text, PASS).
- [x] Mobile check at 375px — 44px/-1px via `base.css` tokens; CTAs stack full-width with min-height 44px.
- [x] **Commit:** `feat(components): override hero for performant_labs_20260502 brand`.
- [x] **4.7 complete**

### 4.8 — `header` (neonbyte composite)

**Library key:** `core/components.neonbyte--header`. **File:** `css/components/header.css`. **What changes:** nav typography in Poppins 15px. Nav link colors via theme tokens. CTA "Call today" pairing on the right. Logo brand-mark dot in `--theme-link-color`. **Site-wide chrome** — configured once, inherited by every page.

- [x] Read `themes/neonbyte/components/header/header/header.component.yml` (the inner header — the outer is a composite wrapper).
- [x] Trace the variable chain — header inherits `--theme-text-color-primary` for nav link color.
- [x] Author `css/components/header.css`.
- [x] Wire library + `libraries-extend`.
- [x] Tier 1: header wrapper present, nav links rendered, CTA button present. *(CTA block deferred to Phase 6 content config; CSS slot ready.)*
- [x] Tier 2: SDC explorer + a real page — nav landmark `<nav>` present, all 6 nav items keyboard-reachable in order.
- [x] **WCAG focus order** — Tab navigation flows: logo → 6 nav items → CTA. No tab traps. Focus rings visible.
- [x] **WCAG contrast** — nav text 16.71:1 PASS; hover 3.58:1 brand-locked per Phase 2 Approval Checkpoint.
- [x] **WCAG semantic** — `<header>` implicit role="banner" PASS; `<nav aria-labelledby>` "Main navigation" PASS; `aria-current` absent (upstream neonbyte Twig gap — advisory, deferred to accessibility pass).
- [x] Mobile check at 375px — mobile nav button renders, expands correctly. *(Full focus-trap test requires browser; HTML structure confirmed correct.)*
- [x] **Commit:** `feat(components): override header for performant_labs_20260502 brand`.
- [x] **4.8 complete**

### 4.9 — `footer` (neonbyte)

**Library key:** `core/components.neonbyte--footer`. **File:** `css/components/footer.css`. **What changes:** drop the 20260411 K watermark pattern entirely (Keytail era). Footer columns at consistent type sizing. Cream signature line ("Drupal testing, done by the people who wrote the tools.") in display-md Rubik. **Site-wide chrome.**

- [x] Read `themes/neonbyte/components/footer/footer.component.yml`.
- [x] Trace the variable chain.
- [x] Author `css/components/footer.css`.
- [x] Wire library + `libraries-extend`.
- [x] Tier 1: footer wrapper, 3 menu blocks, signature link present. *(Signature slot empty — deferred to Phase 6 content config.)*
- [x] Tier 2: SDC explorer + a real page — `<footer role="contentinfo">` landmark, link list semantics correct.
- [x] **WCAG semantic** — column headings are real `<h3 class="footer-menu__heading">`. Signature deferred (slot empty).
- [x] **WCAG contrast** — on canvas: heading 17.28:1, links 15.18:1, hover 7.07:1 — all AAA. *(Footer currently `theme--primary` at runtime — deferred to Phase 6 config change, matches Phase 4.7 hero precedent.)*
- [x] **WCAG focus order** — landmark `<footer>` confirmed; link reading order correct.
- [x] Mobile check at 375px — footer-menu columns stack confirmed via DOM.
- [x] **Commit:** `feat(components): override footer for performant_labs_20260502 brand`.
- [x] **4.9 complete**

### Phase 4 wrap-up

- [x] 🛑 **Approval Checkpoint 4:** Confirm all nine component overrides pass T1+T2 in the explorer and all WCAG gates pass. *(Approved 2026-05-03.)*
- [x] **Phase 4 complete**

---

## Phase 5 — Bespoke `heal-flow` SDC

**Goal:** build the 4-step process flow diagram used in the "We heal our own tests nightly" section.

**Reference:** [`Briefs/archive/pl_homepage_components.md`](Briefs/archive/pl_homepage_components.md) §"Bespoke components to build → heal-flow."

**Steps:**
- [x] Create `web/themes/custom/performant_labs_20260502/components/heal-flow/heal-flow.component.yml` with `steps` array schema.
- [x] Create `heal-flow.twig` generating the inline SVG. Number of `steps` determines viewBox width. Each step has a number, label, and `is_endpoint` flag.
- [x] Create `heal-flow.css` for the minimal wrapping styles (most styling is inline SVG attributes).
- [x] Tier 2 verify in SDC Styleguide explorer with the 4-step homepage payload. *(Verified via Drush eval render — SDC registered as `performant_labs_20260502:heal-flow`.)*
- [x] **WCAG SVG accessibility** — `role="img"` + `aria-label` on SVG root; all decorative elements `aria-hidden="true"`. Sequence conveyed in label text.
- [x] **WCAG contrast in SVG** — labels 15.17:1 (AAA), step numbers 4.80:1 (AA), arrows on cream 3.12:1 (non-text pass, tight margin noted), endpoint border 3.58:1 (non-text pass).
- [x] **WCAG meaningful sequence** — aria-label lists all step labels in order.
- [x] **Commit:** `feat(components): add heal-flow SDC for process diagrams`.
- [x] **Phase 5 complete**

---

## Phase 6 — Canvas assembly

**Goal:** compose the homepage in Canvas using the configured components.

**Reference:** SOP §Canvas assembly, [`canvas-scripting-protocol.md`](../../../ai_guidance/frameworks/drupal/theming/canvas-scripting-protocol.md), [`component-cookbook.md`](../../../ai_guidance/frameworks/drupal/theming/component-cookbook.md).

**Steps:**
- [x] Create a new `canvas_page` entity for the new homepage (do not edit the live homepage in place — assemble on a new node, swap at activation). *(entity_id=20, path alias `/homepage-v2`)*
- [x] Place components in order, per `Briefs/archive/pl_homepage_components.md` §Section-by-section mapping:
  1. **Hero** (`hero`, theme: `white`, `align_x: center`, `height: medium`) → `hero_content` slot containing: `kicker` ("Drupal testing", variant: centered) + `heading` (display-xl text) + paragraph + two `button`s.
  2. **Logo bar** (`logo-grid`, theme: `white`) → 6 logo entries.
  3. **Feature cards** (3× `card-canvas`, theme: `white`, with `eyebrow_text` set to "01 / Tools", "02 / AI", "03 / People"). *(`card` has `noUi: true`; `card-canvas` is the Canvas-compatible variant.)*
  4. **Heal-flow section** (`section`, theme: `light`) → `kicker` + `heading` + SVG flow diagram (as `text` component) + caption paragraph. *(Tech debt: `heal-flow` SDC array-of-objects `steps` prop has no Drupal field type mapping; Canvas config cannot be auto-generated. Rendered as pre-built inline SVG in a `text` component instead.)*
  5. **Built-for** (`icon-list`, theme: `white`) → 4 items with checkmark icon.
  6. **FAQ** (`accordion-group` + `accordion-item`×4, theme: `light`).
  7. **Closing CTA** (`kicker` + `title-cta`, theme: `dark`, `layout: center`).
  8. Header and footer are site chrome — no per-page placement.
- [x] All Canvas assembly via Drush scripts (per `canvas-scripting-protocol.md`): `.php` files in project root, executed with `drush scr`, deleted after.
- [x] `component_version` back-filled from `active_version` on Canvas Component config entities (kicker ×3, card-canvas ×3).
- [x] Tier 2 verify per section: kicker/H1/button structure, icon-list `<ul>/<li>`, SVG `role="img"` + `aria-label`, CTA heading hierarchy — all pass.
- [x] Extended `canvas_html_block` filter to allow `<svg>`, `<circle>`, `<line>`, `<polygon>`, `<text>`, `<div>` so the heal-flow SVG renders. *(Document as tech debt: Canvas manages this format; re-apply if Canvas module updates reset it.)*
- [x] **Commit:** `feat(homepage): assemble Canvas page from configured components`.
- [x] **Phase 6 complete**

---

## Phase 7 — Cross-section verification + visual sign-off

**Goal:** confirm the assembled homepage matches the static preview at `Previews/homepage.html` and meets WCAG 2.2 AA at the page level.

**Steps:**
- [x] Tier 1 page-level: HTTP 200 on the new homepage URL. All 9 expected sections present in HTML by section anchor or heading.
- [x] Tier 2 page-level: ARIA tree structural audit. Header landmark, main with 8 sub-sections, footer landmark. All headings are H1 → H2 hierarchy with no skips. Single `<h1>` on the page (in the hero).
- [x] **WCAG AA full-page audit** — Pa11y WCAG2AA: 0 errors on `/homepage-v2` after 14 Phase 7 fixes (Opus 4.7 Spec Auditor).
- [x] **WCAG keyboard navigation** — verified via Spec Auditor pass.
- [x] **WCAG forced-colors mode** — verified via Spec Auditor pass.
- [x] **WCAG reduced-motion** — verified via Spec Auditor pass.
- [x] **WCAG zoom** — verified via Spec Auditor pass.
- [x] Tier 3 visual at desktop (1280px) and mobile (375px). Spec Auditor (Opus 4.7 vision) audited all 7 sections. 14 findings resolved.
- [x] Resolve any deltas before activation. All T3 findings resolved, WCAG AA clean.
- [x] 🛑 **Approval Checkpoint 7:** Human sign-off: "You can make homepage-v2 the main page."
- [x] **Phase 7 complete**

---

## Phase 8 — Activation

**Goal:** swap the live theme.

**Steps:**
- [x] `ddev drush config:set system.theme default performant_labs_20260502`. (Phase 7 session)
- [x] `ddev drush config:set system.site page.front /page/20` — canvas_page entity_id=20, internal path.
- [x] Tier 1 page-level: HTTP 200 on `/`, 12/12 sections present, theme variables in HTML.
- [x] Tier 2 page-level: ARIA structural audit — 11/11 checks pass (single H1, H2/H3 no skips, header/main/footer landmarks, nav, lang attr, title).
- [x] **WCAG re-verify** — Pa11y WCAG2AA on live `/`: 0 errors.
- [x] Tier 3 visual on the live homepage at 1280px and 375px. Final sign-off. *(Phase 8 final re-audit, S verdict PASS; report at `docs/pl2/handoffs/phase-8-final-reaudit-report.html`. Verified after seven parity sub-cycles closed: 8.2, 8.4, 8.5, 8.1, 8.3, 8.6, 8.7.)*
- [x] Update [`Briefs/archive/pl_homepage_components.md`](Briefs/archive/pl_homepage_components.md) "Open questions" to mark Phase 8 complete. *(File archived during Briefs/ cleanup; no active open questions remained. Runbook is the source of truth for phase status.)*
- [x] **Commit:** `feat(theme): activate performant_labs_20260502 as default`.
- [x] **Phase 8 complete**

---

## Out of scope (deferred to follow-on plans)

- Other pages (Services, About, How We Do It, Articles, etc.). They reuse most of the homepage components plus a small number of additional ones. Each gets its own sub-plan in `pl-plan--pages.md`.
- Migration / cleanup of legacy `performant_labs`, `performant_labs_20260411`, `performant_labs_20260418` directories. Decide retention vs. deletion in a separate triage pass.
- Email-template / webinar-template alignment. Those live outside this theme system.
- Performance tuning (CSS bundling, font subsetting, critical CSS). Address after the homepage ships.
- Full WCAG 2.2 AA audit by a human accessibility specialist. The phase-level checks above cover automated and structural verification — a specialist audit is a separate engagement.

---

## Known traps and gotchas

Distilled from `operational-guidance.md`, `color-management.md`, `verification-cookbook.md`, and the existing `pl-plan--component-audit.md`:

- **OKLCH inline-style specificity**: Layer 4 component-wrapper overrides beat the inline style. Layer 2 `:root` overrides do not. (Phase 2 trap.)
- **WCAG backdrop-change blind spot**: a screenshot can look fine at thumbnail resolution while contrast is failing. The 2026-04-20 PL2 canvas hero incident logged 2.33:1 contrast that looked "appropriately muted" in a T3 screenshot. Always run T2 contrast numerically when a backdrop changes.
- **Canvas `component_version` must be PRESERVED (corrected 2026-05-12 by Sprint 10 cycle 2a):** Canvas throws `OutOfRangeException` on NULL/empty values. The Phase-6-era guidance ("set to NULL to avoid hard-coding hashes") was empirically wrong — discovered Sprint 5 cycle 2 (2026-05-11). For patches: leave the existing valid hash untouched (idempotent-preserving pattern). For new components: read the valid hash from the component's `.component.yml`. See `scripts/sprint6-cycle3-nearshore-marker.php` for an example.
- **`.component.yml` is the schema source of truth**: always read it before writing prop names. Watchdog fails are loud — schema-mismatch silent failures are the expensive ones.
- **`libraries-extend` requires the right library key**: `core/components.<theme>--<name>`, where `<theme>` is the theme that owns the component (`dripyard_base` for cards, `neonbyte` for hero). Wrong theme name in the key = override never loads.
- **`?theme=` URL parameter for preview**: lets you check the new theme without changing the default. Stop using it once Phase 8 activates.
- **Don't `git add .`**: stage by explicit path. The repo has Canvas snapshot files and other gitignored content that can leak in.
- **Browser subagent calls cost ~60 s each**: most checks have a curl answer. See `operational-guidance.md` §1.

---

## Definition of done

The homepage overhaul is complete when every box below is checked:

- [ ] The new theme is the active default (`system.theme.default = performant_labs_20260502`)
- [ ] The live homepage at `/` renders with all 9 sections per the static preview
- [ ] Tier 3 visual diff against `Previews/homepage.html` shows no material deltas at 1280px or 375px
- [ ] Both bespoke components (`kicker`, `heal-flow`) are reusable on other pages
- [ ] The 7-step workflow has been followed for every CSS change
- [ ] One commit per component override exists in the git history
- [ ] No `!important` declarations exist in the new theme's CSS
- [ ] All Tier 1 and Tier 2 checks pass on the live homepage
- [ ] WCAG 2.2 AA audit (automated) passes on the live homepage with zero Critical or Serious findings
- [ ] Keyboard navigation, forced-colors mode, reduced-motion, and 200% zoom all behave correctly
