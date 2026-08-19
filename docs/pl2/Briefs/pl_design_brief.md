---
version: alpha
name: Performant Labs
description: A pragmatic engineering aesthetic for a testing-infrastructure company. Light canvas with a teal-and-terracotta complementary palette — teal does primary brand and interactive work, terracotta does second-tier accents (kickers, step numbers, eyebrow marks), and warm espresso near-black anchors emphasis sections. Hairline borders instead of shadows. Editorial discipline applied to an existing brand color (the teal) locked by webinar collateral and email templates.
---

```yaml
colors:
  # Brand teal — locked, shared with webinars and email templates
  primary: "#1893b4"
  primary-light: "#62bbcb"
  primary-secondary: "#0093b4"
  primary-deep: "#005AA0"    # deep navy — inline link hover, secondary-button hover
  link-hover: "#005AA0"       # alias for primary-deep (retained for backward compat)

  # Secondary accent — terracotta (complement of teal at ~12°, desaturated)
  accent: "#C97B5C"
  accent-deep: "#8E4A2A"
  accent-tint: "#EBC0AB"

  # Surfaces
  canvas: "#FFFFFF"
  surface-card: "#FFFFFF"
  surface-warm: "#F2EFED"
  cream: "#F5EFE2"
  espresso: "#1F1A14"
  espresso-tint: "#2A2520"

  # Legacy (preserved for backward compatibility with the live theme)
  legacy-deep: "#006170"

  # Text
  ink: "#2A2520"
  ink-strong: "#1F1A14"
  body: "#5C544C"
  muted: "#6B6358"

  # Hairlines
  hairline: "#E5E1DC"
  hairline-cool: "#DEE2E6"

  # Text on dark surfaces
  on-primary: "#FFFFFF"
  on-dark: "#F5EFE2"
  on-dark-muted: "#B8AFA0"

typography:
  display-xl:
    fontFamily: "Rubik, sans-serif"
    fontSize: 72px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -2px
  # display-xl is the standard hero size for all landing-page hero H1s (homepage, services, how-we-do-it, open-source-projects). 72px / -2px tracking.
  display-lg:
    fontFamily: "Rubik, sans-serif"
    fontSize: 56px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -1.6px
  display-md:
    fontFamily: "Rubik, sans-serif"
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -1px
  heading-lg:
    fontFamily: "Rubik, sans-serif"
    fontSize: 28px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.4px
  heading-md:
    fontFamily: "Rubik, sans-serif"
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: -0.2px
  heading-sm:
    fontFamily: "Rubik, sans-serif"
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  body-lg:
    fontFamily: "Poppins, sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-md:
    fontFamily: "Poppins, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-sm:
    fontFamily: "Poppins, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "Poppins, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  button:
    fontFamily: "Poppins, sans-serif"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0
  mono-md:
    fontFamily: "Consolas, Monaco, 'Andale Mono', monospace"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0

typography-mobile:
  breakpoint: 576px
  display-xl: { fontSize: 44px, letterSpacing: -1px }
  display-lg: { fontSize: 36px, letterSpacing: -1.2px }
  display-md: { fontSize: 30px, letterSpacing: -0.8px }
  heading-lg: { fontSize: 24px }
  heading-md: { fontSize: 20px }
  heading-sm: { fontSize: 17px }
  body-lg: { fontSize: 17px }

rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  pill: 30px
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  section: 96px

components:
  button-primary:
    backgroundColor: "{colors.primary-light}"
    backgroundColorHover: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 12px 24px
  button-secondary:
    backgroundColor: "transparent"
    borderColor: "{colors.primary}"
    textColor: "{colors.primary}"
    textColorHover: "{colors.link-hover}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 12px 24px
  button-ghost-on-dark:
    backgroundColor: "transparent"
    borderColor: "rgba(245,239,226,0.4)"
    textColor: "{colors.on-dark}"
    backgroundColorHover: "rgba(245,239,226,0.08)"
    borderColorHover: "{colors.on-dark}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 12px 24px
  card-feature:
    backgroundColor: "{colors.surface-card}"
    borderColor: "{colors.hairline}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 32px
  card-feature-num:
    typography: "{typography.mono-md}"
    textColor: "{colors.accent-deep}"
    accentRule: "1px solid {colors.accent}"
  section-canvas:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    paddingY: "{spacing.section}"
  section-cream:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    paddingY: "{spacing.section}"
  section-warm:
    backgroundColor: "{colors.surface-warm}"
    textColor: "{colors.ink}"
    paddingY: "{spacing.section}"
  section-espresso:
    backgroundColor: "{colors.espresso}"
    textColor: "{colors.on-dark}"
    paddingY: "{spacing.section}"
  kicker:
    typography: "{typography.caption}"
    textColor: "{colors.accent-deep}"
    textTransform: "uppercase"
    letterSpacing: "1.6px"
    accentRule: "1px solid {colors.accent}"
  link-inline:
    textColor: "{colors.primary}"
    textColorHover: "{colors.link-hover}"
    underline: "on-hover"
  hairline:
    color: "{colors.hairline}"
    width: 1px
  code-inline:
    backgroundColor: "{colors.surface-warm}"
    textColor: "{colors.ink}"
    typography: "{typography.mono-md}"
    rounded: "{rounded.sm}"
    padding: 2px 6px
  code-block:
    backgroundColor: "{colors.surface-warm}"
    textColor: "{colors.ink}"
    typography: "{typography.mono-md}"
    rounded: "{rounded.md}"
    padding: 20px
```

---

## Overview

Performant Labs sells release confidence to senior engineers. The visual language has to read the same way the copy does: pragmatic, specific, restrained, peer-to-peer (see `pl_brand_brief.md` §3 for tone). No hype, no decorative gradients, no stock illustration of people pointing at laptops.

The aesthetic borrows structural discipline from Turso, Linear, and Vercel — hairline 1px borders instead of drop shadows, generous section whitespace, tight card density, editorial type sizing — but uses a teal-and-terracotta complementary palette anchored on the existing Performant Labs brand teal `#1893b4`, which is locked in place by webinar templates and email collateral.

Light canvas is the default surface. Pages live on white. The brand teal `#1893b4` carries every primary interactive moment (CTAs, links, the brand mark) — the same job it already does on the live site, so the redesign stays continuous with webinars and email signatures. A second accent, terracotta `#C97B5C`, is the complement of teal on the color wheel and does the second-tier work: section kickers, step numbers, eyebrow rules, code-keyword highlights. The two colors enhance each other when placed near each other and never compete because each has a clearly defined job.

Emphasis sections (hero is optional, closing CTA is always) use warm espresso near-black `#1F1A14` rather than dark teal. This was a deliberate choice — early dark-teal explorations felt like the live site's existing teal bar repeated at scale and read as monotone. Espresso gives weight to the emphasis moments without pulling visual gravity away from the brand teal everywhere else.

Imagery is real artifacts (code, terminal output, diagrams) — not illustration. Most pages should not require any illustration at all.

Everything visible should look like it was made by someone who cares about engineering craft, not someone trying to sell engineering craft.

## Color theory

The palette is a **complementary pair** — teal at hue ~192° on the color wheel, terracotta at hue ~12°, exactly opposite. Complementary pairings have the strongest visual contrast of any two-color relationship and, when used at unequal weights, make each color appear more saturated and confident than either would alone.

The pairing works for this brand because:

- **Teal does primary work, terracotta does secondary.** The complementary relationship is strongest when one color dominates and the other accents — they enhance each other rather than fight. Teal carries every interactive moment (CTAs, links, brand mark, diagram arrows). Terracotta marks editorial structure (kickers, step numbers, eyebrow rules) but never replaces teal in interactive UI.
- **Warm + cool = visual balance.** Pure-teal palettes read cold and corporate. Adding a desaturated warm complement keeps the page from feeling clinical without abandoning the engineering register.
- **Webinars stay continuous.** Webinars use `#1893b4` and never see terracotta, so a webinar slide displayed next to the website still reads as the same brand. Terracotta is web-only.

Future extensions of the palette (charts, data viz, status colors) should respect the relationship: teal stays primary, terracotta stays secondary, and any new colors introduced should sit on either the analogous range around teal (190°–225°) for cool variants or the analogous range around terracotta (5°–35°) for warm variants. Do not introduce a third hue family (yellow-greens, magentas, indigos) without updating this section first.

## Colors

### Brand teal (locked)

`#1893b4` is the brand color and carries every primary interactive moment. It appears on the live site as the header bar, footer, primary CTA hover, and `--primary` Bootstrap token. It is locked in by webinar templates and email signatures. It does not move.

`#62bbcb` is the **resting** state of primary CTA buttons. `#1893b4` is the **hover** state. This pairing is an existing live-site convention and is preserved. Do not invert it.

`#005AA0` (`primary-deep`) is the deep navy used for inline link hover, secondary-button hover text and border, and as the dark end of the primary gradient. Already present in the live CSS (`a:hover, a:focus, a:active`), now formalized as the third token in the primary palette.

The three-token primary system is: `primary` (#1893b4) for inline links, focus rings, kicker accents, and card hover borders; `primary-light` (#62BBCB) for CTA pill backgrounds only; `primary-deep` (#005AA0) for inline link hover, secondary-button resting text/border, and dark-band accents.

`#0093b4` is a slightly more saturated variant present in the live CSS (`.cta a`). Treat it as legacy: do not introduce it in new components, but leave existing uses alone until a sweep can replace them with `{colors.primary}`.

The legacy `#006170` is preserved as `legacy-deep` because it still appears on the live site as `--cyan` / `--info`. Leave existing uses alone. New components use the espresso surface for dark moments instead.

### Terracotta accent (secondary)

`#C97B5C` is the secondary accent — terracotta, the desaturated complement of the brand teal. Used for section kickers, step-number markers (`01 / Tools` style on feature cards), eyebrow horizontal rules above headlines, code-keyword highlights, and second-tier callouts. Never used for buttons, links, or any interactive UI — those stay teal.

`#8E4A2A` is the deep terracotta variant — used for the kicker text itself when contrast on canvas is a concern, and for the deeper end of the accent (badges on warm surfaces).

`#EBC0AB` is the light terracotta tint — reserved for tinted callout cards or warm-tinted icon backgrounds when those become needed. Not currently in use on the homepage.

### Surfaces

`#FFFFFF` is the page canvas — the default surface for most sections.

`#F5EFE2` is the warm cream — used for emphasis sections that should feel different from canvas but stay light. The homepage uses it for the heal-flow section and the FAQ section.

`#F2EFED` is the existing warm off-white (live-site `--prism-element-background-color`) — used for code-block surfaces and inline `<code>` tags. Slightly cooler than `cream`, deliberately, so code blocks read as a different surface category rather than a section.

`#1F1A14` is **espresso** — warm near-black, used for the closing CTA section and any other emphasis-dark moment. Replaces the dark-teal surface used in earlier explorations. Espresso reads as confident and editorial without pulling visual gravity away from the brand teal.

`#2A2520` is **espresso-tint** — a slightly lifted variant of espresso, used for raised cards or callouts rendered on top of an espresso section. Currently unused but reserved.

### Hairlines

`#E5E1DC` is the warm hairline used for cards and section dividers — slightly warmer than Bootstrap's default `#dee2e6`, which makes it sit better next to the warm `#F2EFED` code surface and the `#F5EFE2` cream. The Bootstrap `#dee2e6` remains valid where it already exists in the cascade — do not chase it down for replacement.

### Text

`#2A2520` is the primary ink color — a warm-tinted dark, intentionally not pure black or pure neutral gray. The warm cast pairs with the cream and terracotta and avoids the cold "Bootstrap default text" feel.

`#5C544C` is the body color — used for long-form prose, FAQ answers, card body copy. Warmer than a neutral gray.

`#6B6358` is the muted color — used for captions, kicker labels (when terracotta is wrong), legal text, footer column headers.

On espresso surfaces: `#F5EFE2` (cream) for primary text, `#B8AFA0` for secondary/muted. Do not place pure white on espresso — the cream feels intentional, pure white feels like a default.

### Semantic

This palette intentionally does not define `success`, `warning`, `danger`, or `info` colors. The Bootstrap defaults inherited from the existing theme remain in effect for form validation and system messaging. Do not introduce new semantic colors without updating this file first.

### Documented WCAG deviations

The following contrast failures are intentional brand decisions, approved by the operator on 2026-05-11 as part of Phase 8.7. The preview is adopted literally; these deviations prioritize preview-canonical visual identity over AA contrast on two specific elements.

1. **Primary CTA pill (`.btn--primary` / `.button--primary`)**: `#62BBCB` background with `#FFFFFF` text gives **2.13:1 contrast** -- fails AA at every text-size threshold (body 4.5:1, large 3.0:1). Rationale: brand-color choice approved by operator 2026-05-11, prioritizes preview-canonical visual identity over AA contrast on CTA buttons.

2. **Inline link text (`a { color: var(--primary) }`)**: `#1893b4` on white `#FFFFFF` gives **3.5:1 contrast** -- fails body-text AA (4.5:1 threshold), passes large-text AA (3.0:1 threshold). On cream `#F5EFE2` gives **3.07:1** -- passes large-text, fails body-text. Rationale: same as above.

These deviations apply to light-surface zones (white, light, secondary). Dark-zone links use `#5DC6E8` which meets AA (8.81:1 on espresso). Dark-zone CTA buttons use `#5DC6E8` bg with `#1F1A14` text (8.81:1 -- AA pass).

## Typography

The type stack is **Rubik** for headings and display, **Poppins** for body and CTAs, and the system monospace stack (`Consolas, Monaco, 'Andale Mono', monospace`) for code. All three are already loaded by the live site. Do not introduce a fourth family.

Rubik is used at modest weights (500 for display and headings) — never extra-bold or black, which read as too loud for the brand voice. Display sizes use tight tracking (-2px to -1px) because confident headlines should feel like minified code. Body sizes use no tracking adjustment.

Poppins Regular (400) is the default body weight. Poppins SemiBold (600) is the CTA weight. Poppins ExtraBold is loaded but should not be used on web pages — it is too heavy for the editorial register. The existing `extra-bold` `@font-face` declaration can stay loaded (legacy collateral may reference it) but no new component should consume it.

The hero subtitle on the live site uses `font-family: poppins; font-size: 33px; line-height: 56px`. This is preserved as `display-md`-equivalent for the homepage hero subtitle specifically. Other subtitles use the standard scale.

Open Sans is loaded by the live site but barely used. Do not consume it. It can be removed in a future cleanup pass.

## Layout

Sections are separated by `{spacing.section}` (96px) of vertical padding on each side, giving 192px between section content blocks. Card grids use `{spacing.lg}` (24px) gutters. Card internal padding is `{spacing.lg}` (24px) for feature cards, `{spacing.xl}` (32px) for hero/closing cards.

Maximum content width is 1200px on desktop, with prose-only sections (FAQ answers, long-form copy) constrained to 720px for readability.

The page rhythm follows: canvas hero with terracotta kicker → canvas logo bar with hairline dividers → canvas feature cards → cream emphasis section (artifact: diagram, code, or terminal) → canvas supporting section → cream FAQ section → espresso closing CTA → canvas footer. The cream sections give the page rhythm without leaning on color blocks. The single espresso section is the page's signature dark moment.

## Elevation

Elevation is expressed entirely through hairline borders, never shadows. A card sits on the canvas because of its `1px solid {colors.hairline}` border, not because of a `box-shadow`. Hover states change border color (to `{colors.primary}`) or border width (to `2px` with negative margin compensation), never elevation.

The single exception: focus rings on form inputs use a `2px` outline in `{colors.primary}` with 2px offset. This is an accessibility requirement, not a decorative move.

## Components

**`button-primary`** — Resting on `{colors.primary-light}` with white text. Hover transitions to `{colors.primary}`. Pill-shaped (`{rounded.pill}` = 30px to match existing CSS). Uses `{typography.button}` (Poppins SemiBold 15px). Padding 12px × 24px. Sentence case copy only (see `pl_copy_brief.md` button rules).

**`button-secondary`** — Transparent background, 1px border in `{colors.primary}`, text in `{colors.primary}`. Hover deepens border and text to `{colors.link-hover}`. Same shape and typography as primary.

**`button-ghost-on-dark`** — Used on `section-espresso` backgrounds. Transparent background, 1px border in `rgba(245,239,226,0.4)` (cream at 40%), text in `{colors.on-dark}`. Hover lifts background to `rgba(245,239,226,0.08)` and border to full `{colors.on-dark}`. Same shape and typography as primary. Pairs with `button-primary` on dark surfaces (which keeps its standard teal styling — teal stays teal everywhere).

**`card-feature`** — White background, 1px hairline border, `{rounded.lg}` (12px) corners, `{spacing.xl}` (32px) internal padding. Numbering header in `{colors.accent-deep}` (terracotta) using `{typography.mono-md}` at 12px with 1px terracotta accent rule preceding it (e.g., `── 01 / Tools`) — replaces the colored icon circle pattern. Heading in `{typography.heading-md}`, body in `{typography.body-md}` in `{colors.body}`. Hover: border color shifts to `{colors.primary}`. No transform, no shadow.

**`kicker`** — Editorial label appearing above section headlines and inside the closing CTA. Caption-size (12–13px) Poppins SemiBold, uppercased, 1.6px tracking, color `{colors.accent-deep}` on light surfaces or `{colors.accent}` on espresso surfaces. Flanked by 28px terracotta hairline rules in the centered hero/closing-CTA variant. Left-aligned plain text in section-head variants. Examples: "Drupal testing" above the hero headline, "Dogfooding" above "We heal our own tests nightly", "Book a review" above the closing CTA headline.

**`section-canvas`** — Default page background. White surface, ink text, `{spacing.section}` vertical padding.

**`section-cream`** — `{colors.cream}` (#F5EFE2) background, ink text. Used to break visual monotony between two consecutive canvas sections, and as the primary "warm emphasis" surface. The homepage uses it for the heal-flow section and the FAQ section.

**`section-warm`** — `{colors.surface-warm}` (#F2EFED) background. Reserved for code-heavy content blocks or callouts where the section needs to read as a different surface category than `section-cream`. Slightly cooler than cream.

**`section-espresso`** — `{colors.espresso}` (#1F1A14) background, cream text (`{colors.on-dark}`). The brand's signature dark moment — used once per page, almost always as the closing CTA. The teal `button-primary` keeps its standard styling here (teal does not change on dark backgrounds), paired with `button-ghost-on-dark` for the secondary CTA.

**`link-inline`** — Inline text links use `{colors.primary}` with no underline at rest. On hover, color shifts to `{colors.link-hover}` (#005AA0) and underline appears. Visited state matches default — do not differentiate.

**`hairline`** — A 1px horizontal rule in `{colors.hairline}`. Used between sections or list items where the section padding alone is insufficient. Never use thicker than 1px.

**`code-inline`** — Inline `<code>` tags get `{colors.surface-warm}` background, monospace, `{rounded.sm}` (4px) corners, 2px × 6px padding.

**`code-block`** — Block code uses the same warm surface, `{rounded.md}` (8px) corners, 20px padding, monospace at 14px. Syntax highlighting (when present) uses muted variants of the brand teal for keywords and `#666` for comments — no rainbow palettes.

## Diagrams

Diagrams use SVG, hand-authored or generated, never raster. The visual vocabulary is:

- Nodes: rounded rectangles or circles, `{rounded.md}` corners, white fill, 1px hairline border. No fill colors except white. Labels in `{typography.body-sm}`.
- Connectors: 1px stroke in `{colors.primary}`, with a small triangular arrowhead. No curves unless the layout demands it.
- Active or current state: border thickens to 2px in `{colors.primary}`. No glows, no shadows.
- Background: matches the section surface (canvas, cream, or warm). When the diagram sits in a card on a cream section (the homepage heal-flow pattern), the card uses `{colors.canvas}` background with `{colors.hairline}` border. On `section-espresso` backgrounds, invert: nodes get `{colors.espresso-tint}` fill with cream text and `{colors.primary-light}` borders.
- Step numbering on nodes uses `{colors.accent-deep}` (terracotta) in monospace at 11–12px, separating the editorial label (the number) from the brand-interactive label (the connecting arrows in teal).
- Iconography (when used): single-weight line icons. Pick one library and stick to it. Lucide is recommended.

The canonical diagram for the homepage "We heal our own tests nightly" section is a 4-node horizontal flow: **Test fails → Claude diagnoses → PR opens → Engineer reviews**. Labels are short (2–3 words) and use sentence case (see `pl_copy_brief.md`).

## Imagery

Real artifacts beat illustrations for an audience of senior engineers. The default imagery for marketing pages is:

1. **Terminal recordings or screenshots** of real CI output, Playwright reporter output, or CTRF JSON. Background `{colors.espresso}` or a slightly cooler near-black `#0E1014` for terminal authenticity, text in `{colors.on-dark}` (cream). Real content from real test runs — never fabricated output.
2. **Code snippets** rendered with syntax highlighting on `{colors.surface-warm}`. Real code from public repos when possible.
3. **GitHub Actions screenshots** of actual nightly heal workflow runs.
4. **Abstract flow diagrams** (see `## Diagrams` above) when the story is a process loop rather than a single moment.

What does **not** belong:

- AI-generated dashboard mockups of products that do not exist.
- AI-generated illustrations of any kind, unless trained on a Performant Labs–specific style and approved (none exist as of this writing).
- Stock photography of people, especially of people pointing at laptops, sticky notes, or whiteboards.
- Decorative gradients, blurry orbs, or particle effects.

## Anti-patterns

The brand brief (`pl_brand_brief.md` §1) makes a strong positioning move: **Performant Labs is not a Drupal build shop**. A site that visually reads as a Drupal agency undercuts that positioning regardless of what the copy says. The patterns below are what a typical Drupal or WordPress agency site looks like — collected from years of looking at them. Avoid all of them. The reason each pattern signals "agency" is given so future judgment calls have a reference.

### Layout patterns to avoid

- **Full-width photo hero with white text overlaid on a dark filter.** Reads as a 2014-era agency template. We use a deep-teal hero or a canvas hero with type doing the work.
- **Rotating carousel hero with three slides.** Signals "we couldn't decide what to say." Pick one message.
- **Three-tier pricing table with a "Most Popular" ribbon.** Belongs to SaaS-product sites trying to look like Stripe. Performant Labs sells engagements, not subscriptions — pricing happens in conversation.
- **Five-column footer with a newsletter signup, social icons, and a partner-badge strip.** Maximalist footers are an agency tell. Keep the footer compact and informational.
- **Stats counter that animates on scroll** ("20+ years," "200+ projects," "50+ happy clients"). Marketing-adjacent and impossible to verify. The brand brief §6 already prohibits this kind of inflation.
- **3-up team grid with round avatars, titles, and LinkedIn icons.** Agencies sell their team headcount. We sell senior engineers embedded with the client. The about page mentions André specifically and avoids the bench-of-faces pattern.
- **"Industry verticals" mega-menu** (Healthcare / Government / Higher Ed / Financial Services). Agencies organize sales around verticals. We organize around release confidence regardless of vertical.
- **"Trusted by" strip of grayscale logos with too much horizontal spacing.** The pattern is fine — the execution typically isn't. Logos should be at consistent visual weight, not stretched across the viewport with empty padding.

### Visual patterns to avoid

- **Cards with drop shadows on every section.** The "soft shadow on white card" look is the universal Bootstrap-template signal. We use 1px hairline borders.
- **Three-color circle icons next to feature copy** (one blue circle, one orange circle, one green circle, all with white Font Awesome glyphs). Reads as agency template. If we use icons at all, they're single-color line icons in `{colors.primary}` at consistent weight.
- **Bootstrap-default rounded-corner buttons** at 4px radius. Reads as utility-grade, not branded. Our CTAs are pill-shaped at 30px (existing convention).
- **Default Bootstrap blue `#007bff`** anywhere. The presence of this color is a tell that the theme inherited Bootstrap defaults instead of overriding them.
- **Drop-shadowed icons or gradient-filled icons.** Flat, monochrome, single-weight only.
- **Decorative SVG illustrations** of abstract people doing abstract things (undraw.co aesthetic). We use real artifacts.
- **Awards / partner badges in the footer** ("Acquia Partner," "Drupal Association Member," etc.). Visible signal of agency-tier positioning. If a credential needs surfacing, it goes in body copy with context.

### Content patterns to avoid

- **"Why choose us?" as a section heading.** Agency-template phrasing. We let the work speak.
- **"Our process" section with numbered circular badges** (1. Discover → 2. Design → 3. Develop → 4. Launch). Agencies sell process. We sell outcomes. The "We heal our own tests nightly" section already shows how we describe a workflow without falling into this pattern.
- **Generic CTAs** ("Get Started," "Learn More," "Contact Us"). Copy brief already prohibits these — buttons must be verb + object ("Book a testing review").
- **Three-sentence hero subheads** trying to explain everything at once. The hero subhead caps at two sentences (see `pl_copy_brief.md`).
- **Testimonial sliders with rotating dots.** Static testimonials placed contextually beat sliders that hide content behind interaction.
- **"Our values" or "Our mission"** as content blocks. Brand brief §3 already prohibits this register.

### What we do instead

- One signature deep-teal section as the closing CTA, plus 1–2 deep-teal moments earlier in the page.
- Hairline borders separating cards and sections, never shadows.
- Real artifacts (terminal output, code, diagrams) where an agency would put illustration.
- Editorial typography sized to do hierarchy work — no decorative type treatments.
- Sentence case throughout, including in buttons and nav.
- One accent color (the teal family) carrying every primary moment.

If a design decision feels safe and recognizable, check it against this list before committing. Recognizability in this category is the wrong target.

## Responsive behavior

Breakpoints follow the existing Bootstrap 4 defaults inherited by the live theme: `sm` 576px, `md` 768px, `lg` 992px, `xl` 1200px. The design system is desktop-first. Dripyard handles most responsive behavior automatically through its grid and container system. The rules below cover only the places where our overrides introduce layout or typography that Dripyard does not manage.

### Breakpoint map

| Breakpoint | Width | What changes |
|------------|-------|--------------|
| `xl` | >= 1200px | Full desktop layout. All specs in this brief are written for this width. |
| `lg` | 992–1199px | No changes from `xl`. Content containers narrow proportionally. |
| `md` | 768–991px | Homepage feature cards (`grid-wrapper--3col-stack-md`): 3-column grid collapses directly to 1 column — preview is canonical at 768. Other 3-column grids (`grid-wrapper--3col`, used by `/open-source-projects` and `/how-we-do-it`) collapse 3 → 2 at `md`. Logo grid wraps to 2 rows of 3. |
| `sm` | 576–767px | All `--3col` and `--3col-stack-md` grids are at 1 column. Section padding reduces from 96px to 64px. Typography scale reduces (see table below). Hero CTA buttons stack vertically (full-width). |
| `xs` | < 576px | Same as `sm`. Horizontal padding increases to 20px to keep text away from screen edges. |

### Mobile typography scale (at `sm` and below)

| Token | Desktop | Mobile | Reduction |
|-------|---------|--------|-----------|
| `display-xl` | 72px | 44px | ~39% (two-line hero headline must still fit at 375px) |
| `display-lg` | 56px | 36px | ~36% |
| `display-md` | 40px | 30px | 25% |
| `heading-lg` | 28px | 24px | 14% |
| `heading-md` | 22px | 20px | 9% |
| `heading-sm` | 18px | 17px | ~6% |
| `body-lg` | 18px | 17px | ~6% |
| `body-md` | 16px | 16px | No change |
| `body-sm` | 14px | 14px | No change |
| `kicker` | 12px | 12px | No change (already at minimum readable size) |

Letter-spacing on all three display tokens relaxes at mobile to improve readability at smaller sizes: `display-xl` from -2px to -1px, `display-lg` from -1.6px to -1.2px, `display-md` from -1px to -0.8px. All other letter-spacing values are unchanged.

### Per-section mobile behavior

**Hero.** The headline reflows to no more than two lines at 375px (the copy brief requires this). Subhead max-width drops from 720px to 100%. The two CTA buttons stack vertically at full container width below `sm`. Kicker accent rules (centered variant) shorten proportionally but remain visible.

**Logo bar.** Six logos wrap from one row into two rows of three at `md`, then three rows of two at `xs`. Logos maintain consistent visual weight (max-height 28px, grayscale). The "Trusted by teams at" label remains centered above the grid.

**Wordmark strip (services-page "§ proof").** Six text wordmarks (Drupal · Playwright · Cypress · PHP · JavaScript · React) in a hairline-bounded strip with a small-caps "WE SPEAK" label centered above. Desktop (≥ 992 px): single row, evenly distributed. Tablet (768–991): single row may compress; allow natural wrap. **Mobile (375):** wraps to two rows of `4 + 2` (live-canonical as of 2026-05-11; FU-S5-4). Wordmark text uses Rubik 500 / 18px / muted at full opacity (not 0.8 — see services preview note; FU-S5-3) so contrast clears AA at 7.43:1.

**Feature cards.** The 3-column grid collapses to 2 at `md` and 1 at `sm`. Cards become full-width stacked. The terracotta eyebrow number + category label, card title, and body text remain left-aligned. Card internal padding stays 32px on all viewports (no reduction needed since cards are full-width on mobile).

**Heal-flow section.** The inline SVG diagram scrolls horizontally inside its container below `md` (the 4-step flow does not stack vertically). A subtle horizontal scroll indicator (hairline fade on the right edge) signals scrollability. The kicker and heading above the diagram remain full-width and wrap normally.

**Built-for list (icon-list).** Single column on all viewports. No layout change needed. Teal checkmark icons and text wrap naturally.

**FAQ accordion.** Full-width on all viewports. Touch target for the toggle row is minimum 48px tall (current spec at 56px padding clears this). The `+`/`-` indicator stays right-aligned.

**Closing CTA (title-cta).** Espresso background extends full-bleed. Headline reduces per the mobile typography scale. The single CTA button becomes full-width below `sm`. Kicker (inline variant) wraps normally.

**Header.** The site header carries the wordmark on the left and the primary nav inline on the right. There is **no right-side CTA pill** in the canonical preview (an earlier "Call today" pill was tested and removed; do not add one back without updating this brief). Responsive collapse rule:

- **`lg` and up (≥ 992 px):** wordmark + full primary nav inline. No hamburger.
- **Below `lg` (< 992 px), including `md` (768–991):** primary nav hides, hamburger button appears in its place. The hamburger is a 44×44 px touch target with `aria-label="Open menu"` and `aria-expanded` state.

The hamburger triggers an overlay panel containing the same primary nav links. Focus traps when the panel is open (keyboard cannot Tab past it until closed). The 992 px breakpoint is intentional: the homepage primary nav has six labels (Services / How we do it / Articles / Open source projects / About us / Contact us) which do not fit inline at `md` (768 px) without each label wrapping to two lines — the Bootstrap-style `navbar-expand-lg` collapse pattern is the cleanest fit. If a future page has a shorter nav (≤ 4 short labels), it may use `navbar-expand-md` instead, but the homepage and any page sharing this nav set must use `lg`.

**Footer.** Three footer columns stack to a single column below `md`. The signature line ("Drupal testing, done by the people who wrote the tools.") drops to `heading-md` sizing on mobile and wraps to two lines.

### Touch targets

All interactive elements must be minimum 44 x 44 CSS pixels on viewports below `md` (WCAG 2.5.5 AAA / 2.5.8 AA). The existing CTA button at 14px vertical + 28px horizontal padding plus 15px type size clears this. Accordion toggle rows at 56px tall clear this. Nav links in the mobile nav panel must have sufficient vertical padding (minimum 12px top + 12px bottom on a 16px line) to meet the 44px target.

### What Dripyard handles automatically

These responsive behaviors are inherited and do not need overrides:

- Container max-width narrowing
- Grid column collapsing (Dripyard grid uses CSS Grid with `auto-fit` / `minmax`)
- Section component padding via `--section-padding-*` tokens
- Button sizing and spacing
- Card stacking within grid contexts
- Font loading and FOUT handling

## Known gaps

This file does not yet define:

- A dark-mode variant of the full theme. Some sections use deep-teal as a surface, but there is no full inverted theme. Add when needed.
- Form component specifications beyond focus rings. Inputs, selects, checkboxes, and radios inherit from Bootstrap defaults until called out here.
- Data visualization tokens (chart colors, axis treatments, legend styling). Add when CTRFHub UI work begins, since that is where charts will first matter.
- Email-template tokens. Webinar and email collateral live outside this system. The brand teal is shared, but spacing and typography in those templates are not governed by this file.
- Motion and transition timing. Default to `150ms ease-out` for hover state changes. Document properly when motion becomes a real surface area.

## Source and authority

This file is the visual layer. It does not define what the site says or how the copy is written. For positioning, audience, tone, and vocabulary lock, see `pl_brand_brief.md`. For copy mechanics (sentence case, punctuation, button copy patterns), see `pl_copy_brief.md`. When this file and either of those disagree on something verbal (button label casing, vocabulary), the verbal briefs win.

The token values in the YAML front matter are the single source of truth for the visual system. When implementing in CSS, generate variables from this file rather than hand-copying hex codes.
