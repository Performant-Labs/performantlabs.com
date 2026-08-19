# Performant Labs — Homepage Component Mapping

> Translates `pl_design_brief.md` into specific Dripyard SDC components for the homepage. Identifies the `theme` prop variant, override type (libraries-extend, bundle copy, or bespoke), and the few pieces that need to be built from scratch.

> **Scope:** the homepage only. Other pages will reuse most of the same components and add a small number of additional ones (long-form article wrapper, services list, etc.) — those are outside this document.

> **Authority:** when this document and `pl_design_brief.md` disagree, the design brief wins. This file describes *how* the design brief is implemented in Dripyard, not what the design brief says.

---

## Operating procedure (read first)

All CSS work on this homepage **must** follow the 7-step CSS change workflow at [`docs/pl2/theme-change--workflow.md`](../theme-change--workflow.md). The workflow exists to prevent the per-page-CSS / `!important`-accumulation anti-pattern documented in [`docs/pl2/theme-change.md`](../theme-change.md). The principle is single: every CSS change traces upward to the variable / config layer where the value originates and is fixed there, not at the point of noticing.

Verification follows the **Three-Tier Hierarchy** at [`~/Projects/playbook/testing/verification-cookbook.md`](../../../../playbook/testing/verification-cookbook.md):
- **Tier 1** — Headless `curl` checks (HTTP status, CSS variable presence, rendered text, srcset). Runs in seconds.
- **Tier 2** — ARIA structural skeleton via browser subagent. Component presence, heading levels, button presence.
- **Tier 3** — Visual regression. Pixel/colour match. **Never runs before Tier 2 passes.**

The full SOP for theme generation is [`~/Projects/playbook/frameworks/drupal/theming/ai-guided-theme-generation.md`](../../../../playbook/frameworks/drupal/theming/ai-guided-theme-generation.md). Read Phase 0 before any work begins.

The Dripyard 4-Layer Color Architecture and the architecturally correct override pattern are in [`~/Projects/playbook/frameworks/drupal/theme-planning/color-management.md`](../../../../playbook/frameworks/drupal/theme-planning/color-management.md) and the Dripyard system overview at [`~/Projects/playbook/themes/dripyard-guidance.md`](../../../../playbook/themes/dripyard-guidance.md). **Read both before writing any color override.**

---

## Theme hierarchy

```
dripyard_base   → foundation (40+ SDC components, OKLCH engine)
    └── neonbyte → primary theme (visual base, hero/header/footer)
            └── performant_labs_20260502 → this project's subtheme
```

The new theme is **a direct child of `neonbyte`** — not a grandchild via `pl_neonbyte`. All site-specific overrides live in `performant_labs_20260502`.

---

## How to read this document

For each homepage section: the SDC component used, the `theme` prop value, the override type, the props/slots filled in, and notes on bespoke work. This file is the mapping. The implementation runbook is `pl-plan--components.md` (workflow). The old `pl-plan--component-audit.md` is effectively superseded by this file for the new direction.

**Site-wide vs page-specific:** the header and footer in this document are site-wide chrome, not homepage-specific. They are configured and themed once and inherited by every page. Their inclusion here is for completeness — actual implementation does not happen per-page. The new theme follows neonbyte's pattern for header and footer (composite header at `themes/neonbyte/components/header/`, single-component footer at `themes/neonbyte/components/footer/`) and overrides only the CSS layer.

---

## Theme token foundation

Dripyard exposes seven `theme` prop values on most components. The new visual system maps them as follows. **Override these tokens once in the theme CSS, every component inherits.**

| `theme` prop | Surface (background) | Text (ink) | Used for |
|---|---|---|---|
| `inherit` | (parent) | (parent) | default fallback |
| `white` | `#FFFFFF` canvas | `#2A2520` ink | hero, features, built-for, footer |
| `light` | `#F5EFE2` cream | `#2A2520` ink | heal-flow section, FAQ section |
| `dark` | `#1F1A14` espresso | `#F5EFE2` cream | closing CTA |
| `black` | `#0E1014` near-black | `#F5EFE2` cream | reserved (terminal-screenshot containers) |
| `primary` | `#1893b4` teal | `#FFFFFF` | reserved — overuse drains brand-color impact |
| `secondary` | `#F2EFED` warm | `#2A2520` | code-heavy callouts |

### How Dripyard's color system actually works

Per `color-management.md`, Dripyard runs a 4-layer architecture: (1) Theme Settings anchors → (2) OKLCH-generated 10-shade scales → (3) theme wrappers (`White`, `Light`, `Primary`, `Dark`, `Black`) that map scales to specific component variables → (4) component classes that inherit from theme wrappers.

**The architecturally correct override pattern is at Layer 4 (Component).** Dripyard injects Layer 1 anchor colors as inline styles on `<html>`, which gives them maximum specificity and makes Layer 2 (`:root`) overrides lose silently. A descendant selector against `html` beats the inline style. Place this in the subtheme's stylesheet:

```css
/* LIGHT / WHITE REGIONS */
html :where(:root),
html .theme--light,
html .theme--white {
  --theme-surface: #FFFFFF;
  --theme-surface-alt: #F5EFE2;
  --theme-text-color-primary: #2A2520;
  --theme-text-color-loud: #1F1A14;
  --theme-text-color-medium: #5C544C;
  --theme-link-color: #1893b4;
  --theme-link-hover: #005AA0;
  --theme-border-color: #E5E1DC;
  --theme-focus-ring-color: #1893b4;
}

/* CREAM (light variant for emphasis sections) */
html .theme--light {
  --theme-surface: #F5EFE2;
  --theme-surface-alt: #FFFFFF;
}

/* DARK REGIONS (closing CTA) */
html .theme--dark,
html .theme--black {
  --theme-surface: #1F1A14;
  --theme-surface-alt: #2A2520;
  --theme-text-color-primary: #F5EFE2;
  --theme-text-color-loud: #FFFFFF;
  --theme-text-color-medium: #B8AFA0;
  --theme-link-color: #1893b4;
  --theme-link-hover: #62bbcb;
  --theme-border-color: #B8AFA0;
  --theme-focus-ring-color: #62bbcb;
}

/* PRIMARY (reserved — used sparingly) */
html .theme--primary {
  --theme-surface: #1893b4;
  --theme-text-color-primary: #FFFFFF;
}
```

The accent (terracotta) and additional brand-specific tokens are layered on top as separate variables, not via theme prop:

```css
:root {
  --pl-accent: #C97B5C;
  --pl-accent-deep: #8E4A2A;
  --pl-accent-tint: #EBC0AB;
}
```

These are referenced by component-level CSS (kicker, card eyebrow, heal-flow node numbers) rather than the theme-prop machinery, because they are accent-only and do not need a "dark variant."

---

## Section-by-section mapping

### 1. Header — **site-wide chrome**
- **Component:** `header` (neonbyte composite at `themes/neonbyte/components/header/`, containing `header`, `header-search`, `language-switcher`, `mobile-nav-button`, `primary-menu`)
- **Theme:** `white` (canvas)
- **Override type:** CSS-only via `libraries-extend`. **No bundle copy.** Follow neonbyte's structure exactly — the new theme inherits the composite layout and overrides the CSS layer only.
- **Notes:** Nav links inherit `--theme-text-color-primary` and shift to `--theme-link-color` (teal) on hover. Logo brand-mark dot uses `--theme-link-color`. **No right-side CTA pill** — an earlier "Call today" pill was tested and removed in phase 8.1; the header carries wordmark + nav only. See `pl_design_brief.md` §"Site header" for the navbar-expand-lg collapse rule. Sentence case nav labels (per `pl_copy_brief.md`).
- **Configured once and inherited by every page** — not homepage-specific.
- **No bespoke work required.**

### 2. Hero
- **Component:** `hero` (neonbyte) — full SDC at `themes/neonbyte/components/hero/`
- **Theme:** `white`
- **Height:** `medium` or `large`
- **Slots filled:** `hero_content` only — no `hero_media` (no background image)
- **Slot composition:** `kicker` (bespoke) + `heading` (large display) + paragraph + button group (`button` × 2)
- **Override type:** CSS-only on `hero`. **One bespoke component required** (`kicker`).
- **Notes:** The hero's existing `theme` and `align_x: center` props handle the structural work. Type sizing for the headline (72px display-xl) is a CSS override on `hero_content`'s heading slot.

### 3. Logo bar
- **Component:** `logo-grid`
- **Theme:** `white` with hairline top + bottom borders
- **Override type:** CSS-only via `libraries-extend`
- **Notes:** Label text "Trusted by teams at" in `{colors.muted}`, uppercased, 1.6px tracking. Logos at consistent visual weight (not stretched horizontally).

### 4. Feature cards (3-up)
- **Component:** `card` (Dripyard — see schema)
- **Theme:** `white`
- **Layout:** 3-column grid (custom wrapper)
- **Props filled:**
  - `title` — feature heading
  - `body` — feature description
  - `eyebrow_text` — **maps directly to our `01 / Tools` kicker pattern** (built-in prop, no extension needed)
  - `image` — null (we don't use card images here)
  - `theme` — `white`
- **Override type:** CSS-only via `libraries-extend`
- **Notes:** The `eyebrow_text` styling is the place to apply the terracotta `{colors.accent-deep}` color, monospace font, 1.6px tracking, and the 24px terracotta accent rule preceding the text. Hover state shifts card border to `{colors.primary}`. **Critical win: no bundle copy needed because the `eyebrow_text` prop already exists.**

### 5. "We heal our own tests nightly" section
- **Section wrapper:** `section` (Dripyard — full-width band)
- **Theme:** `light` (cream)
- **Section head composition:** `kicker` (bespoke) + `heading` (`style: h2`, `center: true`)
- **Diagram:** **bespoke new SDC `heal-flow`** (no Dripyard equivalent exists)
- **Caption:** Standard paragraph with inline `code` styling (Dripyard inline `<code>` already targetable via theme CSS)
- **Override type:** CSS-only on `section` and `heading`. **One bespoke component required** (`heal-flow`).

### 6. Built-for list
- **Component:** `icon-list`
- **Theme:** `white`
- **Override type:** CSS-only via `libraries-extend`
- **Notes:** Replicates the `20260411` icon-list amber-checkmark pattern, but with teal `{colors.primary}` checkmarks instead of amber. The existing 20260411 CSS rule (`.icon-list .icon-list-item__icon { color: #F59E0B }`) just needs a recolor.

### 7. FAQ
- **Component:** `accordion`
- **Theme:** `light` (cream)
- **Override type:** CSS-only via `libraries-extend`
- **Notes:** Continues the `20260411` pattern — hairline top/bottom borders only, no background fill, no shadow. The `+` / `−` indicator in `{colors.primary}` (teal) instead of amber. Touch target ≥ 48px on mobile.

### 8. Closing CTA
- **Component:** `title-cta`
- **Theme:** `dark` (espresso)
- **Layout prop:** `center`
- **Props filled:**
  - `title` — "Ready for a release you don't have to babysit?"
  - `heading_style` — `h2` or `title`
  - `button_text` — "Book a testing review"
  - `button_href` — review-booking URL
  - `button_style` — `primary` (teal stays teal everywhere)
- **Above the title:** `kicker` (bespoke) — `title-cta` has no eyebrow prop, so the kicker sits as a sibling component before the `title-cta` block (Canvas composition)
- **Secondary CTA:** Sibling `button` with `style: outline` and a small CSS modifier class for the cream-on-dark ghost treatment (`button-ghost-on-dark` from the design brief)
- **Override type:** CSS-only via `libraries-extend` on `title-cta` and `button`. The kicker itself is the bespoke component used elsewhere.

### 9. Footer — **site-wide chrome**
- **Component:** `footer` (neonbyte) — full SDC at `themes/neonbyte/components/footer/` (`footer.component.yml`, `footer.css`, `footer.twig`)
- **Theme:** `white`
- **Slots filled:** `footer_left_content`, `footer_right_content`, `footer_bottom_content` (the four neonbyte slots are `footer_top_content`, `footer_left_content`, `footer_right_content`, `footer_bottom_content` — `footer_top_content` is unused on this site)
- **Slot composition:** Three `menu-footer` columns + a custom signature block (heading + inline link)
- **Override type:** CSS-only via `libraries-extend`. **No bundle copy.** Follow neonbyte's slot structure exactly.
- **Notes:** The 20260411 `K` watermark pattern is dropped — it was tied to the old "Keytail" brand identity. The new closing element is the cream signature line "Drupal testing, done by the people who wrote the tools."
- **Configured once and inherited by every page** — not homepage-specific.

---

## Bespoke components to build

### `kicker` (new SDC)

Editorial label component used in three places: hero, section heads, closing CTA.

**Why bespoke:** No Dripyard component carries the "small uppercased label flanked by horizontal accent rules" pattern. `pill` is the closest (slot-only generic container) but does not enforce the type treatment or rules. Building a dedicated component is cleaner than CSS-fighting `pill`.

**Schema (proposed):**

```yaml
name: Kicker
status: stable
group: Performant Labs
props:
  type: object
  required: [text]
  properties:
    text:
      type: string
      title: Label text
    variant:
      type: string
      enum: [centered, inline]
      meta:enum:
        centered: Centered (with rules on both sides)
        inline: Inline (left-aligned, no rules)
    theme:
      type: string
      enum: [light, dark]
      description: light → terracotta-deep on canvas. dark → terracotta on espresso.
```

**Templates:**
- `kicker.twig` — outputs a `<span class="kicker kicker--{variant} kicker--{theme}">` with `::before` and `::after` pseudo-elements for the rules in centered variant.
- `kicker.css` — type, color, accent-rule treatment.

**Lives in:** `themes/custom/performant_labs_20260502/components/kicker/`.

### `heal-flow` (new SDC)

The 4-step process flow diagram.

**Why bespoke:** Content-specific. No Dripyard component for inline SVG flow diagrams. Future-proofing as a reusable "process flow" component is a temptation worth resisting until a second use case appears.

**Schema (proposed):**

```yaml
name: Heal flow
status: experimental
group: Performant Labs
props:
  type: object
  required: [steps]
  properties:
    steps:
      type: array
      minItems: 2
      maxItems: 6
      items:
        type: object
        properties:
          number: { type: string, examples: ["01"] }
          label: { type: string, examples: ["Test fails in CI"] }
          is_endpoint: { type: boolean, description: "Marks the human-in-the-loop step (thicker border)" }
```

**Templates:**
- `heal-flow.twig` — generates the SVG inline based on `steps` array. Number of steps determines viewBox width.
- `heal-flow.css` — minimal (most styling is inline SVG attributes since this is one-off).

**Lives in:** same theme directory as `kicker`.

---

## Token remapping (the foundation task)

Per `color-management.md`, the override target is the **Layer 4 (Component) wrapper** using `html` descendant selectors against `.theme--white`, `.theme--light`, `.theme--dark`, etc. Each wrapper sets the same set of `--theme-*` variables. The full block is in §"How Dripyard's color system actually works" above. Variable names confirmed from `color-management.md`:

| Dripyard variable | Role on `theme--white` (canvas) | Role on `theme--dark` (espresso) |
|---|---|---|
| `--theme-surface` | `#FFFFFF` | `#1F1A14` |
| `--theme-surface-alt` | `#F5EFE2` | `#2A2520` |
| `--theme-text-color-primary` | `#2A2520` | `#F5EFE2` |
| `--theme-text-color-loud` | `#1F1A14` | `#FFFFFF` |
| `--theme-text-color-medium` | `#5C544C` | `#B8AFA0` |
| `--theme-link-color` | `#1893b4` | `#1893b4` |
| `--theme-link-hover` | `#005AA0` | `#62bbcb` |
| `--theme-border-color` | `#E5E1DC` | `#B8AFA0` |
| `--theme-focus-ring-color` | `#1893b4` | `#62bbcb` |

Brand-specific tokens that don't have a "dark variant" (the terracotta accent family) live as separate `:root` declarations:

| Custom token | Value | Role |
|---|---|---|
| `--pl-accent` | `#C97B5C` | terracotta — kickers, step numbers |
| `--pl-accent-deep` | `#8E4A2A` | terracotta deep — accent text on canvas |
| `--pl-accent-tint` | `#EBC0AB` | terracotta tint — reserved for callout cards |

---

## Verification cadence (per section)

Every component override commit must pass T1 + T2 before merge. T3 runs at the section level, not the component level (one screenshot covers the whole rendered band).

| Section | T1 (curl) | T2 (ARIA) | T3 (visual) |
|---|---|---|---|
| Header | nav link selectors present, header HTTP 200 | landmark `<header>` + nav landmark, all 6 links | screenshot at 1280px and 375px |
| Hero | `--theme-surface` value at root, headline H1 text | H1 level, kicker before H1, two buttons | screenshot at 1280px and 375px |
| Logo bar | 6 logo `<img>` tags, srcset present | 6 images with alt text | screenshot |
| Feature cards | 3 card wrappers, eyebrow text strings | 3 cards each with eyebrow + H3 + body | screenshot |
| Heal section | `--theme-surface: #F5EFE2` resolved, SVG `<svg>` tag | section landmark, H2, SVG with role and label | screenshot at 1280px and 375px |
| Built-for | 4 list items, teal checkmark color | `<ul>` with 4 `<li>`, no decorative items in tab order | screenshot |
| FAQ | 4 `<details>` elements | 4 disclosure widgets, summary text matches expected | screenshot of one open + one closed |
| Closing CTA | `--theme-surface: #1F1A14` resolved on the section | section landmark, H2, two buttons, kicker | screenshot at 1280px and 375px |
| Footer | 3 menu blocks, signature text | landmark `<footer>`, 3 menus, signature link | screenshot at 1280px and 375px |

Tier 3 never runs until Tier 2 passes. See `verification-cookbook.md` for full execution guidance.

---

## Implementation order

Suggested sequence (lowest-risk-first, dependencies left to right). **Each step follows the 7-step workflow at `docs/pl2/theme-change--workflow.md`.** One commit per step.

1. **Theme scaffold** — generate `performant_labs_20260502` from `dripyard_starterkit`, parented to `neonbyte` directly. See `pl-plan--theme.md` for the canonical scaffold procedure.
2. **Token remapping** — the foundation. Layer 4 component-wrapper overrides per the table above. Without this, every component override fights the base theme.
2. **Bespoke `kicker` SDC** — used by hero, section heads, closing CTA. Build it once.
3. **`hero` override** — composes kicker.
4. **`card` override** — `eyebrow_text` styling for feature cards. No bundle copy required.
5. **`icon-list` override** — recolor checkmarks to teal.
6. **`accordion` override** — port the 20260411 pattern with new colors.
7. **`logo-grid` override** — minor styling.
8. **`title-cta` override** — closing CTA with `theme: dark`.
9. **Bespoke `heal-flow` SDC** — the diagram.
10. **`footer` override** — drop the K watermark pattern, add the signature line.
11. **`header` override** — nav typography, CTA.
12. **Cross-section verification** — view the assembled homepage in Canvas, confirm rhythm and visual consistency match the static preview at `docs/pl2/Previews/homepage.html`.

Each numbered item is a separate commit. The 20260411 pattern of one-commit-per-component (from `pl-plan--components.md`) is preserved.

---

## Open questions to resolve before starting

Most have been answered — remaining items are codebase checks before the first commit.

1. ✅ **Theme name:** `performant_labs_20260502`. Today's date.
2. ✅ **Theme parent:** `neonbyte` (direct child, not via `pl_neonbyte`).
3. ✅ **Generated from `dripyard_starterkit`** following `pl-plan--theme.md` Stage 1 procedure.
4. ✅ **Dripyard CSS variable names** known: `--theme-surface`, `--theme-text-color-primary`, `--theme-link-color`, etc. See the token table above.
5. ✅ **Homepage uses Canvas** — components configured in Canvas UI, not via Twig page templates.
6. **Open: icon-set convention.** Are there Lucide / Font Awesome / custom icon conventions the bespoke `kicker` (no icons) and `heal-flow` (no icons) need to respect? Probably not for these two, but worth confirming for future bespoke components.
7. **Open: existing 20260411/20260418 disposition.** Are these old themes kept on-disk for reference, or removed? The new theme is independent of either.

---

## What this document does not cover

- Other pages beyond the homepage (Services, About, How We Do It, etc.). They reuse most of these components.
- Component behavior outside the visual system — accessibility, keyboard navigation, focus management. Those follow Dripyard defaults until called out separately.
- Migration of legacy 20260411 CSS rules. Some rules port directly (icon-list checkmark recolor) — others are obsolete (K watermark). The 20260411 audit is the source for that triage and is effectively superseded by this file for the new direction.
- Mobile-specific component behavior beyond the responsive rules already in `pl_design_brief.md` §Responsive behavior.
