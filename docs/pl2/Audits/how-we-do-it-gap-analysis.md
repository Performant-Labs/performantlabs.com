# Gap Analysis: /how-we-do-it -- Preview vs. Live Drupal Page

**Date:** 2026-05-05
**Auditor:** Spec Auditor (S), Claude Opus 4.6
**Preview file:** `docs/pl2/Previews/how-we-do-it.html`
**Live URL:** `https://pl-performantlabs.com.3.ddev.site:8493/how-we-do-it`
**Design brief:** `docs/pl2/Briefs/pl_design_brief.md`

---

## Summary: deviation counts by category

| Category | Count | Description |
|----------|-------|-------------|
| **Content gap** | 3 | Copy/text different or missing (fix via Canvas overlay) |
| **Component gap** | 5 | Wrong Canvas component used, or component/slot missing |
| **Theme gap** | 3 | Wrong theme/color zone on a section |
| **CSS gap** | 8 | Styling differs; fixable with custom CSS on existing components |
| **Component limitation** | 3 | Dripyard component lacks the design feature; needs workaround |
| **Total** | 22 | |

---

## Section-by-section deviation table

### Header

| # | Element | Preview shows | Live shows | Category | Fix approach |
|---|---------|---------------|------------|----------|-------------|
| H1 | CTA button text | "Book a testing review" | "Call today" | Content gap | Update the header CTA block content (block `a7c1d5e0-0001-4b1f-9c2d-callcta20260503`) to say "Book a testing review" and link to `/contact-us?intent=testing-review` |
| H2 | CTA button style | Pill-shaped (`border-radius: 30px`), `primary-light` (#62bbcb) background, white text | Dripyard `button--primary button--large` -- pill shape is present via custom button.css, but background color resolves to Dripyard `--button-primary-bg` which maps to `--theme-surface` context. Appears teal-ish via theme--primary tokens but exact shade depends on Dripyard layer. | CSS gap | Verify the rendered button color matches #62bbcb resting / #1893b4 hover. The custom `button.css` may already handle this; needs visual verification. |
| H3 | Nav link "How we do it" active state | Teal color (`#1893b4`) with `font-weight: 500` via `.is-current` | Active trail class is present (`is-active`, `primary-menu__link--active-trail`). Styling depends on neonbyte theme CSS. | CSS gap (minor) | Verify active nav link renders in brand teal. May already work. |

### Breadcrumb

| # | Element | Preview shows | Live shows | Category | Fix approach |
|---|---------|---------------|------------|----------|-------------|
| B1 | Breadcrumb text | "Home / How we do it" | "Home / How a testing engagement runs" | Content gap | The live breadcrumb uses the page title field, which was changed to "How a testing engagement runs" by the overlay. The preview uses the URL alias label. **No fix needed** -- the live version is correct (breadcrumb should reflect the page title, not the URL slug). This is a preview inaccuracy, not a live defect. |

### SA -- Hero / Lead

| # | Element | Preview shows | Live shows | Category | Fix approach |
|---|---------|---------------|------------|----------|-------------|
| A1 | Kicker ("PROCESS") | Present: terracotta uppercase eyebrow with flanking 28px hairline rules, centered above H1. `color: #A85F40`, `font-size: 12px`, `font-weight: 600`, `letter-spacing: 1.6px` | **Missing entirely.** No kicker element exists in the section. | Component limitation | Dripyard's `heading` and `section` components do not have a kicker/eyebrow slot. Workaround: add a `text` component in the section's `header` slot before the H1, with custom HTML containing a `<span class="kicker">PROCESS</span>`, then style with custom CSS. Alternatively, accept the omission as a component limitation and defer to a future Canvas component update. |
| A2 | H1 alignment | Centered (`text-align: center` on `.hero__inner`) | Left-aligned (Dripyard section default) | CSS gap | Add CSS rule targeting the how-we-do-it hero section's H1 to center it. However, this requires a page-specific selector or a class on the section. Alternatively, the section's `text_align` input (if available) could be set to center. |
| A3 | H1 text color | `#2A2520` (ink) via `.hero h1 { color: var(--ink) }` | `color--primary` class applied, which resolves to the theme's primary heading color. In `theme--white`, `--theme-text-color-loud` is `#1F1A14`. The `color--primary` class may map to a different token. | CSS gap | Verify the rendered H1 color. The overlay sets `color: primary` on the heading component. In the neonbyte/Dripyard system, `color--primary` on a heading may resolve to the brand teal rather than ink. If so, the heading color input should be changed to `default` or `loud`. |
| A4 | Lead paragraph alignment | Centered, max-width 760px, `font-size: 19px` | Left-aligned, full section width, `body-l` class (`font-size` controlled by `--body-l-size` token, likely 18px) | CSS gap | The section needs centering and max-width constraint on the lead paragraph. This is a CSS gap: the preview constrains the subhead to 760px centered; the live page lets it run full width left-aligned. |
| A5 | Lead paragraph font size | 19px | `body-l` (~18px) | CSS gap (minor) | 1px difference. Acceptable if the design brief `body-lg` token is 18px (it is). The preview deviates slightly from the brief. **No fix needed.** |
| A6 | Section background | White (`#FFFFFF`) | White (`theme--white` resolves to `#FFFFFF`) | -- | MATCH |
| A7 | Section padding | `padding: 96px 0 96px` (hero class) | Dripyard section with `padding-top--l padding-bottom--l`. The `l` value maps to `--spacing-component` which at desktop is ~80px. | CSS gap (minor) | Preview uses 96px, Dripyard uses its own spacing token. May be close enough. Verify visually. |

### SB -- Week 1 Audit

| # | Element | Preview shows | Live shows | Category | Fix approach |
|---|---------|---------------|------------|----------|-------------|
| B1 | Kicker ("WEEK 1") | Present: terracotta uppercase eyebrow, left-aligned above H2. `color: #A85F40`, `font-size: 12px`, `font-weight: 600`, `letter-spacing: 1.6px` | **Missing.** The H2 reads "Week 1 -- Audit." as a combined heading. No separate kicker element. | Component limitation | Same as A1. Dripyard heading has no kicker slot. The heading text itself includes "Week 1 --" as a prefix. To match the preview, the heading should be just "Audit." with a separate kicker element. Workaround: custom HTML text component before the heading, styled as kicker. |
| B2 | H2 text | "Audit." (just the noun, with period) | "Week 1 -- Audit." (combined with week prefix) | Content gap | If kicker is implemented separately, change the heading text to just "Audit." via overlay. If kicker is not implemented, the current combined form is an acceptable compromise. |
| B3 | H2 color | `#2A2520` (ink) | `color--primary` class. Same concern as A3 -- may render as teal instead of ink. | CSS gap | Same fix as A3. |
| B4 | Body text alignment | Left-aligned within `.prose` container (max-width 720px) | Left-aligned within Dripyard section, but no max-width constraint on the text. Text runs full section width. | CSS gap | The body text needs a max-width of ~720px (prose-max) to match the preview's readable line length. |
| B5 | Graph presentation | Graph inside a card-like container (`border: 1px solid #E5E1DC`, `border-radius: 12px`, `padding: 48px`), with a caption below: "Bugs that escape the test suite cost an order of magnitude more to fix in production than in CI..." | Graph rendered as a bare `canvas-image` component within a `flex-wrapper`, side-by-side with the body text. No card container, no caption, no border. | Component gap | The preview shows the graph below the body text in its own bordered card with caption. The live page places it in a horizontal flex layout next to the text. This is a structural/component difference. Fix: restructure the section to place the image below the text (not beside it), wrap in a card-like container, and add a caption text component. |
| B6 | Section background | Cream `#F5EFE2` (`.section--cream`) | White (`theme--white`). The section uses `theme--white` which maps to `#FFFFFF`. | Theme gap | Change the section's theme from `white` to `light` (which maps to cream `#F5EFE2` in base.css). |

### SC -- Week 2 Dogfood Loop

| # | Element | Preview shows | Live shows | Category | Fix approach |
|---|---------|---------------|------------|----------|-------------|
| C1 | Kicker ("WEEK 2") | Present: terracotta uppercase eyebrow, left-aligned | **Missing.** H2 reads "Week 2 -- Stand up the dogfood loop." | Component limitation | Same kicker limitation as B1. |
| C2 | H2 text | "Stand up the dogfood loop." | "Week 2 -- Stand up the dogfood loop." | Content gap (conditional) | Same as B2 -- only a gap if kicker is implemented separately. |
| C3 | H2 color | Ink (`#2A2520`) | `color--primary` | CSS gap | Same as A3/B3. |
| C4 | Body text structure | Body text and H3 subhead in a `.prose` container (max-width 720px), left-aligned | Body text and H3 are in the section's `header` slot (not content slot). The text component uses `body-m` style. No max-width constraint. | CSS gap | Same prose-max constraint needed as B4. |
| C5 | H3 "What changes from 'we monitor your site'" | Rendered as an H3 within the prose flow, `font-size: 20px`, Rubik 500 | Rendered as an H3 within the text component's HTML (`<h3>` tag inside the rich text). Font depends on Dripyard's text-content styling. | CSS gap (minor) | Verify the inline H3 inside a text component gets Rubik 500 styling. The base.css sets `--h3-font-family: 'Rubik', sans-serif` which should cascade. Likely a match. |
| C6 | Section background | White/canvas (`#FFFFFF`) via `.section--canvas` | Cream (`#F5EFE2`) via `theme--light` | Theme gap | The live section uses `theme--light` (cream). The preview uses canvas (white). Change the section's theme to `white`. |
| C7 | Content slot | Preview: body text only, no empty content area | Live: empty `dy-section__content` div rendered below the header slot content | Component gap (minor) | Cosmetic. The empty content div produces no visible output but is structurally unnecessary. No visual impact. |

### SD -- Week 3+ Take Over or Hand Back

| # | Element | Preview shows | Live shows | Category | Fix approach |
|---|---------|---------------|------------|----------|-------------|
| D1 | Kicker ("WEEK 3+") | Present: terracotta uppercase eyebrow, left-aligned | **Missing.** H2 reads "Week 3+ -- Take over or hand back." | Component limitation | Same kicker limitation. |
| D2 | H2 color | Ink (`#2A2520`) | `color--primary` | CSS gap | Same as A3. |
| D3 | Card component type | **Numbered text cards** with no images. Each card has: `shape-card__num` ("01 / Hand back") in monospace terracotta with a 24px terracotta accent rule, `h3` title, `p` body. White background, 1px hairline border, 12px radius, 48px padding. Hover: border shifts to teal. | **card-canvas** components with full-width images (teal icon illustrations: IconHandback.png, IconTakeover.png, IconEmbed.png). Standard card layout: image top, title + body bottom. No terracotta accents, no numbered labels. | Component gap | This is the single largest visual deviation. The preview specifies text-only cards with terracotta-accented numbering ("01 / Hand back", "02 / Take over", "03 / Embed"). The live page uses image cards with teal icon illustrations. Two options: (a) Remove images from the card-canvas components and add custom CSS for the numbered/accented card style. (b) Replace card-canvas with a custom component that supports the preview's card design. Option (a) is more feasible within Dripyard's constraints. |
| D4 | Card grid | 3 columns, `gap: 24px` | Dripyard `grid-wrapper` with `gutter-column--l gutter-row--l`. Column count depends on Dripyard grid defaults. | CSS gap (minor) | Verify the grid renders as 3 columns at desktop. Dripyard's grid-wrapper likely handles this automatically for 3 children. |
| D5 | Card hover | Border color shifts to `#1893b4` (teal) | Depends on Dripyard card hover styles | CSS gap (minor) | Verify or add hover border-color transition. |
| D6 | Section background | Warm `#F2EFED` (`.section--warm`) | White (`theme--white`) | Theme gap | Change the section's theme from `white` to `secondary` (which maps to `#F2EFED` in base.css). |
| D7 | Lead paragraph | "After the dogfood loop has run for a release cycle..." in `.prose` style, below heading, above card grid | Present as a `text` component in the header slot. Content matches. | -- | MATCH (content) |

### SE -- What We Don't Do

| # | Element | Preview shows | Live shows | Category | Fix approach |
|---|---------|---------------|------------|----------|-------------|
| E1 | H2 heading | "What we don't do." -- no kicker | "What we don't do." -- no kicker | -- | MATCH |
| E2 | Body text width | Constrained to `prose-max` (720px) via `.guardrail` class | No max-width constraint. Text runs full section width. | CSS gap | Add prose-max constraint to the text component in this section. |
| E3 | Section background | Cream `#F5EFE2` (`.section--cream`) | Cream (`theme--light` = `#F5EFE2`) | -- | MATCH |
| E4 | H2 color | Ink (`#2A2520`) | `color--primary` | CSS gap | Same as A3. |

### SF -- Closing CTA

| # | Element | Preview shows | Live shows | Category | Fix approach |
|---|---------|---------------|------------|----------|-------------|
| F1 | Background color | **Espresso `#1F1A14`** (`.closing-cta`) -- warm near-black | **Teal `#1893b4`** (`theme--primary`). The section uses Dripyard's primary theme zone. | Theme gap | **Major deviation.** The design brief explicitly states the closing CTA should use `section-espresso` (#1F1A14). Change the section's theme from `primary` to `dark` (which maps to espresso #1F1A14 in base.css). This is the page's "signature dark moment" per the brief. |
| F2 | Kicker ("GET STARTED") | Present: terracotta uppercase eyebrow with flanking hairline rules, centered. `color: #C97B5C` (accent, lighter variant for dark background) | **Missing.** No kicker element. | Component limitation | Same kicker limitation as A1. On espresso background, the kicker color would be `#C97B5C` (accent) rather than `#A85F40` (accent-deep). |
| F3 | H2 styling | `font-size: 56px`, cream text (`#F5EFE2`) on espresso, `letter-spacing: -1.6px`, max-width 880px, centered | H2 rendered via `title-cta` component. White text on teal. Font size depends on Dripyard `--h2-size` token (set to 40px in base.css). | CSS gap | The preview uses 56px (display-lg). The live page uses the site-wide H2 size of 40px. The closing CTA heading should be larger. This may require a component-specific override or using a different heading style (h1 visual style on an h2 element). |
| F4 | Subtitle paragraph | Present: "A 30-minute call with a senior engineer. We'll look at your current workflow..." in `color: #B8AFA0` (on-dark-muted), max-width 640px, centered | **Missing.** The `title-cta` component only renders a heading and a button. No subtitle/description text. | Component gap | The Dripyard `title-cta` component does not have a description/subtitle slot. To add the subtitle, either: (a) use a separate text component after the title-cta, or (b) restructure the section to use heading + text + button components instead of title-cta. |
| F5 | Button count | **Two buttons**: "Book a testing review" (primary, teal) + "See all engagement shapes" (ghost-on-dark, transparent with cream border) | **One button**: "Book a testing review" (primary) with arrow icon suffix | Component gap | The `title-cta` component supports only one button. To add the second ghost-on-dark button, the section would need restructuring (separate button components) or a flex-wrapper containing two buttons. |
| F6 | Button text | "Book a testing review" | "Book a testing review" | -- | MATCH |
| F7 | CTA section padding | `padding: 120px 0` | Dripyard section padding (`padding-top--l padding-bottom--l`) | CSS gap (minor) | The preview uses 120px, more than the standard 96px section padding. This gives the CTA section more visual weight. Verify and adjust if needed. |

### Footer

| # | Element | Preview shows | Live shows | Category | Fix approach |
|---|---------|---------------|------------|----------|-------------|
| FT1 | Footer structure | 4-column grid: Services, Resources, Company, Signature. `h4` column headers in muted uppercase. | 3-column left area (Services, Resources, Company) + right signature area + bottom legal bar. Structure matches preview intent. | -- | Approximate MATCH. The Drupal footer uses a different grid layout (left/right/bottom) but achieves the same visual result. |
| FT2 | Footer background | White with hairline top border | White with Dripyard footer styling | -- | MATCH |
| FT3 | Legal bar | "(c) Performant Labs" left, "Preview build -- not yet implemented in Drupal" right | "(c) 2026 Performant Labs . Privacy Policy" | -- | Live is correct (preview had placeholder text). No fix needed. |

---

## Design brief compliance summary

| Token | Brief value | Preview value | Live rendered value | Match |
|-------|-------------|---------------|---------------------|-------|
| Section backgrounds (cream) | `#F5EFE2` | `#F5EFE2` | `#F5EFE2` (theme--light) | YES (where used) |
| Section backgrounds (warm) | `#F2EFED` | `#F2EFED` | Not used on this page (should be SD) | NO -- SD uses theme--white |
| Section backgrounds (espresso) | `#1F1A14` | `#1F1A14` | `#1893b4` (theme--primary = teal) | **NO** -- major |
| H1 font | Rubik 500 | Rubik 500 | Rubik 500 (via base.css `--h1-font-family`) | YES |
| H2 font | Rubik 500 | Rubik 500 | Rubik 500 | YES |
| H2 size (desktop) | 40px | 40px | 40px (via base.css `--h2-size`) | YES |
| Body font | Poppins 400 | Poppins 400 | Poppins 400 (via base.css `--font-sans`) | YES |
| Kicker treatment | Terracotta uppercase, 12px, 600wt, 1.6px tracking | Present in preview | **Missing entirely** | **NO** |
| Card-feature design | Text cards, hairline border, terracotta numbering | Present in preview | Image cards (card-canvas) | **NO** |
| Closing CTA heading size | display-lg = 56px | 56px | 40px (site-wide --h2-size) | **NO** |
| Button pill shape | 30px radius | 30px | Pill via custom button.css | YES |
| Prose max-width | 720px | 720px | Unconstrained | **NO** |

---

## Prioritized remediation list

### Priority 1 -- Structural / high-visual-impact

1. **F1: Closing CTA background color.** Change section theme from `primary` to `dark` (espresso). This is the single most visually impactful deviation -- teal vs. espresso completely changes the page's signature dark moment. Fix via Canvas overlay (section theme input).

2. **D3: Card component type in SD.** The preview specifies text-only numbered cards with terracotta accents. The live page uses image cards with teal illustrations. This fundamentally changes the visual character of the section. Fix approach: remove card images, add CSS for numbered card styling, or accept as a conscious divergence from the preview (the teal icons do communicate the card concepts). Decision needed from O.

3. **F4 + F5: Missing CTA subtitle and second button.** The closing CTA section lacks the subtitle paragraph and the ghost-on-dark secondary button. These are important for the CTA's persuasive structure. Fix: restructure the CTA section to use heading + text + button-group components instead of the single `title-cta` component.

### Priority 2 -- Theme zone corrections

4. **B6: Week 1 Audit section background.** Change from `white` to `light` (cream).

5. **C6: Week 2 Dogfood section background.** Change from `light` (cream) to `white` (canvas). Currently the section alternation is reversed compared to the preview.

6. **D6: Week 3+ section background.** Change from `white` to `secondary` (warm #F2EFED).

### Priority 3 -- Typography and alignment

7. **A2 + A4: Hero centering.** The H1 and lead paragraph should be centered with the lead constrained to ~760px max-width. Requires CSS targeting or section input changes.

8. **A3 / B3 / C3 / D2 / E4: H2 color.** All section headings use `color--primary` which may render as teal instead of ink. Verify and change heading color input from `primary` to `default` or `loud` if needed.

9. **F3: Closing CTA heading size.** Should be 56px (display-lg) not 40px. Requires either a heading style override for the CTA heading or using a different visual style.

10. **B4 / C4 / E2: Prose max-width.** Body text in sections B, C, and E should be constrained to ~720px for readability. Add CSS for prose-max on text components in these sections.

### Priority 4 -- Kicker elements (component limitation)

11. **A1 / B1 / C1 / D1 / F2: Missing kickers.** All five kicker elements from the preview are absent. This is a Dripyard component limitation (no kicker slot). Workaround: custom HTML in text components styled via CSS. This is a significant design element but lower priority because it requires either custom component work or HTML workarounds that may be fragile.

### Priority 5 -- Content

12. **H1: Header CTA text.** Change "Call today" to "Book a testing review" and update the link to `/contact-us?intent=testing-review`. This is a site-wide block change, not page-specific.

### Priority 6 -- Minor / verify-only

13. **B5: Graph presentation.** Restructure the graph from side-by-side with text to below-text in a bordered card with caption. Lower priority but affects the section's information hierarchy.

14. **D5: Card hover states.** Verify border-color transition to teal on hover.

15. **Section padding values.** Verify Dripyard's `padding--l` is close enough to the preview's 96px. Likely acceptable.

---

## Notes

- The heading `color--primary` issue (items A3/B3/C3/D2/E4) needs visual verification. In Dripyard's component system, `color: primary` on a heading may map to different CSS properties depending on the theme context. If it resolves to the theme's `--theme-text-color-loud` token, it would be `#1F1A14` (close to ink) in theme--white, which would be acceptable. If it resolves to the brand color (`#1893b4` teal), it would be a significant deviation.

- The kicker limitation affects 5 instances across the page. If kickers are a priority, a reusable approach should be designed (custom CSS class for kicker-styled text components) rather than solving each instance ad hoc.

- The card design in SD (item D3) represents a design decision point. The preview's text-only numbered cards are more aligned with the design brief's `card-feature` component spec (terracotta numbering, hairline borders, no images). The live page's image cards are a valid alternative but diverge from the brief. O should decide which direction to pursue.
