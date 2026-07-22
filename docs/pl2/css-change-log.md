# CSS Change Log

[Layer 5] .kicker (new SDC)  components/kicker/kicker.css  2026-05-02
  Ruling: New bespoke component. Colors reference --pl-accent-* tokens from :root (base.css). No higher-layer override exists or applies.

[Layer 5] .card[class*="theme"] border/radius/padding/eyebrow  css/components/card.css  2026-05-03
  Ruling: L1 not config. L2 not OKLCH. L3 too broad (card-specific overrides). L5 correct — component-scoped via libraries-extend.

[Layer 5] .accordion-item background/border/radius/padding/font + svg color  css/components/accordion.css  2026-05-03
  Ruling: L1 not config. L2 not OKLCH. L3 tokens (--theme-link-color, --theme-border-color) already correct. Remaining changes are component-structural. L5 correct — libraries-extend on core/components.dripyard_base--accordion-item.

[Layer 5] --icon-list-icon-color in .icon-list--icon-color-primary .icon-list-item → var(--theme-link-color)  css/components/icon-list.css:L20  2026-05-03
  Ruling: L1 not config. L3 too broad — Dripyard maps icon_color:primary to --theme-text-color-primary; overriding that token would re-color all body text. L5 correct — libraries-extend on core/components.dripyard_base--icon-list, scoped to the icon custom property only.

[Layer 5] .logo-grid borders/padding + .logo-item img max-height/grayscale/object-fit + .dy-section:has(.logo-grid) header label styling  css/components/logo-grid.css  2026-05-03
  Ruling: L1 not config. L3 tokens (--theme-text-color-medium, --theme-border-color) already correct in base.css. Remaining changes are component-structural visual rules (hairline borders, 28px logo cap, grayscale filter, label uppercase/tracking/centering). L5 correct — libraries-extend on core/components.dripyard_base--logo-grid.

[Layer 5] title-cta: --title-cta-heading-color → var(--theme-text-color-primary); display-lg sizing (56px/500/−1.6px desktop, 36px/−1.2px mobile); mobile full-width button  css/components/title-cta.css  2026-05-03
  Ruling: L1 not config. L2 not OKLCH. L3 dark-zone tokens (--theme-surface, --theme-text-color-primary, --theme-text-color-loud) already set correctly in base.css. L5 required for three things not inherited automatically: (a) --title-cta-heading-color defaults to --theme-text-color-loud (#FFFFFF) but spec calls for cream #F5EFE2 (--theme-text-color-primary); (b) display-lg 56px sizing — no Dripyard heading-style maps exactly (h2=54px, title=80px); (c) mobile full-width button below 576px per design brief §Closing CTA. Libraries-extend on core/components.dripyard_base--title-cta.

[Layer 5] hero: --h1-letter-spacing → -2px; --body-l-size → 1.0625rem (17px); mobile headline → display-xl scale (var(--title-size)/var(--title-letter-spacing)); CTA button row desktop / full-width mobile  css/components/hero.css  2026-05-03
  Ruling: L1 not config. L2 not OKLCH. L3 too broad — --h1-letter-spacing at html .theme--white would affect all h1-class elements on white-surface pages; --body-l-size site-wide would affect all body-l text. L5 correct — component-scoped to .hero.theme--white. base.css @media ≤576px already covers display-xl mobile (--title-size: 2.75rem, --title-letter-spacing: -1px); hero.css references those tokens, not hardcoded values. Libraries-extend on core/components.neonbyte--hero.

[Layer 5] footer: watermark suppression (content:none on .site-footer::before); --footer-link-color → var(--theme-text-color-primary); .block__title heading-sm (Rubik 18px/500); .menu__link body-sm (Poppins 14px/400); .site-footer__bottom > signature display-md (Rubik 40px/500/-1px/1.1, ink on canvas); .site-footer__bottom hairline separator  css/components/footer.css  2026-05-03
  Ruling: L1 not config. L2 not OKLCH. L3: --footer-link-color is a footer-local token set inside neonbyte footer.css — not a site-wide --theme-* variable, so L3 rebind is not applicable. base.css already sets --theme-text-color-primary: #2A2520 (L3 ✓). Remaining changes (font-family/size overrides, pseudo-element suppression, hairline) are component-structural and cannot be addressed at L3. L5 correct — libraries-extend on core/components.neonbyte--footer. Watermark suppression is defensive: neonbyte itself carries no watermark in its footer.css; the K/PL pseudo-element was in 20260411/20260418 only and is not in the current cascade. Rule added as guard against theme-switch regression.

[Layer 3] --theme-link-color in .theme--dark → #5DC6E8; --theme-link-color-hover → #7AD0E8  css/base.css:L68-69  2026-05-05
  Ruling: L1 not config (link color not derived from config). L2 not OKLCH-derived. L3 correct — zone-level token override affects all links in dark/black zones site-wide. P14 fix.

[Layer 3] --theme-link-color in .theme--black → #5DC6E8; --theme-link-color-hover → #7AD0E8  css/base.css:L81-82  2026-05-05
  Ruling: Same as above. P14 fix.

[Layer 5] .button--primary --button-background-color → var(--theme-link-color); dark-zone text flip to #1F1A14  css/components/button.css:L34-35,L68-73  2026-05-05
  Ruling: L1 not config. L2 not OKLCH. L3 too broad (affects all links, not just buttons). L5 correct — component-scoped. P13 fix.

[Layer 5] .dy-section .grid { min-width: 0 } + .dy-section { overflow-x: clip }  css/components/dy-section.css:L181-189  2026-05-05
  Ruling: L1 not config. L3 not a theme token. L5 correct — component-scoped structural fix. ADV-S1 mobile overflow fix.

[Layer 5] .site-header__content { border-radius: 0 }  css/components/header.css:L73-74  2026-05-05
  Ruling: L1 not config. L3 token --header-border-radius: 0 already set but doesn't cascade to __content. L5 correct — explicit property override. P20 fix.

[Layer 5] .page-title cream band (background, padding, border, typography) + dripyard_base .page-title reset  css/components/page-title.css  2026-05-05
  Ruling: L1 not config (block visibility is config — handled separately via drush). L2 not OKLCH. L3 section is not inside a Dripyard theme zone wrapper — injected by page--articles.html.twig between page.highlighted and <main>; L3 tokens would not reach it. L5 correct — new component-scoped CSS loaded via theme library (performant_labs_20260502/page-title). Includes explicit reset of dripyard_base page-title.css properties (margin-bottom, font-size, font-weight, line-height, letter-spacing, font-family) that collide on the .page-title class name.

[Layer 3] --pl-accent-deep in :root → #8E4A2A (was #A85F40)  css/base.css:L17  2026-05-05
  Ruling: L1 not config. L2 not OKLCH. L3 correct — site-wide brand accent token in :root. Phase 6 propagation of Phase 2 WCAG contrast bump. #8E4A2A on #FFFFFF = 6.64:1; on #F5EFE2 = 5.79:1 (both AA pass). Also updated heal-flow.twig SVG fill to match.

[Layer 5] .theme--dark .title-cta .button--outline → cream ghost-on-dark (M1)  css/components/title-cta.css  2026-05-07
  Ruling: L1 not config. L2 not OKLCH. L3 --theme-link-color in .theme--dark = #5DC6E8 (correct for body links; changing to cream would break all dark-zone links). L5 correct — scoped to .theme--dark .title-cta .button--outline. Specificity (0,3,0) beats Dripyard's .button--outline:where(:not(:disabled)) (0,1,0). Cream #F5EFE2 text on espresso #1F1A14 = 15.07:1 (AAA). Border rgba(245,239,226,0.4) composited ≈ 4.60:1 (non-text 3:1 pass).

[Layer 5] .dy-section--other-modules h2/card thin-band styling (M5)  css/components/dy-section.css  2026-05-07
  Ruling: L1 padding patched via Canvas overlay (padding_top/bottom: large → medium). L2 not OKLCH. L3 --h2-size is site-wide 40px; changing to 30px would break all other pages. L5 correct — scoped to .dy-section--other-modules modifier class (Canvas additional_classes). H2 30px, card padding 24px, h3 18px, body 15px, grid max-width 900px. No color changes; all existing token contrasts preserved.

[Layer 1] Canvas overlay: "Other modules" section padding medium + modifier class  content-exports/open-source-projects-cycle2.overlay.yml  2026-05-07
  Ruling: L1 is the correct layer for section padding enum and additional_classes input. Canvas content patch applied via apply-canvas-page.php.

[Layer 5] hero: padding-inline → 0 (overflow fix)  css/components/hero.css  2026-05-09
  Ruling: L1 not config. L2 not OKLCH. L3 too broad — padding-inline is not a theme token. L5 correct — component-scoped to .hero.theme--white. Neonbyte's @container (width > 700px) sets padding-inline: 80px; this creates a 533px content box inside a 693px hero at 768px, while .container child calculates width from 92cqw of ancestor query-container (693px), overflowing by 160px. Preview spec: padding 120px 0 — zero horizontal padding at all viewports. Phase 8.2 fix.

[Layer 5] logo-grid: flex-wrap nowrap breakpoint 577px → 992px  css/components/logo-grid.css  2026-05-09
  Ruling: L1 not config. L2 not OKLCH. L3 not a theme token. L5 correct — component-scoped to .logo-grid__content. At 768px the container is ~693px; 6 logos at max-width 140px + gap 2rem need ~1000px minimum for nowrap. The 577px breakpoint caused the logo row to overflow by ~240px, contributing to page-level horizontal scroll at tablet. Raised to 992px (lg breakpoint). Phase 8.2 overflow fix (partial overlap with Phase 8.3 which will handle text-fallback strategy separately).

[Layer 5] hero: min-height → auto; height → auto; padding-block → 120px 96px (desktop) / 64px (<=767px)  css/components/hero.css  2026-05-10
  Ruling: L1: hero height prop enum (small/medium/large/full-screen) has no "auto" or "none" value — L1 CANNOT produce intrinsic sizing. RULED OUT. L2 not OKLCH. L3 too broad — min-height/height are not theme tokens. L5 correct — component-scoped to .hero.theme--white. Root cause: .hero--height-medium sets min-height: 800px; the preview has no min-height (intrinsic sizing via content + padding). padding-block updated to 120px/96px matching preview's `.hero { padding: 120px 0 var(--space-section) }`. Mobile (<=767px) set to 64px matching preview's `var(--space-3xl)`. Phase 8.5 fix.

[Layer 5] logo-grid: hero-to-section transition padding + header margin  css/components/logo-grid.css  2026-05-10
  Ruling: L1: dy-section padding_top--m enum has no value matching 48px (options: none=0, s=8px, m=80px, l=120px). RULED OUT. L2 not OKLCH. L3 not a theme token. L5 correct — scoped via adjacent-sibling combinator `.hero.theme--white + .dy-section:has(.logo-grid)` (specificity 0,4,0). dy-section padding-top: 80px → 48px (matches preview .logo-bar padding-top). dy-section__header margin-bottom: 80px → 32px (matches preview label margin-bottom var(--space-xl)). Phase 8.5 fix.

[Layer 5] accordion: SVG display:none + ::after plus/minus indicator  css/components/accordion.css  2026-05-11
  Ruling: L1 not config (icon hardcoded in Twig). L2 not OKLCH. L3 no --accordion-icon token exists. L5 correct — component-scoped via libraries-extend on core/components.dripyard_base--accordion-item. Hides chevron-down SVG, replaces with ::after content "+"/"−" (U+2212). Color var(--theme-link-color). Phase 8.6 item 2.

[Layer 5] header: mobile-nav-button border 1px solid + 8px radius  css/components/header.css  2026-05-11
  Ruling: L1 not config. L2 not OKLCH. L3 not a theme token (structural). L5 correct — component-scoped to .site-header .mobile-nav-button at (0,2,0), beats neonbyte's .mobile-nav-button { border: 0 } at (0,1,0). Border: 1px solid var(--theme-border-color) #E5E1DC. border-radius: 8px. Touch target preserved at 44x44 (border-box). Phase 8.6 item 5.

[Layer 3] --pl-primary, --pl-primary-light, --pl-primary-deep in :root; --theme-link-color, --theme-link-color-hover, --theme-focus-ring-color in html .theme--white/light/secondary  css/base.css  2026-05-11
  Ruling: L1 not config (link color not config-driven). L2 not OKLCH-derived. L3 correct — zone-level token overrides affecting all pages. Three-color primary palette from preview. Phase 8.7 Item A.

[Layer 5] .button--primary --button-background-color → var(--pl-primary-light); hover → var(--pl-primary)  css/components/button.css  2026-05-11
  Ruling: L1 not config. L2 not OKLCH. L3 too broad (--theme-link-color serves inline links, not CTA bg). L5 correct — component-scoped. Preview-canonical CTA: resting #62BBCB, hover #1893b4. WCAG: 2.21:1 resting (pre-approved deviation). Phase 8.7 Item A.

[Layer 3] --spacing-component in :root → calc(12 * var(--sp)) desktop / var(--sp8) mobile; --spacing-component-internal → var(--sp6) all viewports  css/base.css  2026-05-11
  Ruling: L1 not config. L2 not OKLCH. L3 correct — :root token override, global, affects all pages. Operator-confirmed trigger-3 escalation. Preview uses 96px section padding desktop, 64px mobile. Phase 8.7 Item B.

[Layer 3] --theme-* brand-canonical defaults on :root (backstop)  css/base.css  2026-05-11
  Ruling: L1 not config (--theme-* tokens not config-driven). L2 not OKLCH-derived. L3 correct — :root backstop for --theme-surface, --theme-surface-alt, --theme-text-color-primary, --theme-text-color-loud, --theme-text-color-medium, --theme-text-color-soft, --theme-link-color, --theme-link-color-hover, --theme-border-color, --theme-focus-ring-color. Values match html .theme--white (brand-white-surface canonical). Specificity (0,1,0) < html .theme--* (0,1,1) — existing zone overrides always win. Sprint 4 Cycle 2.

[Layer 5] .landing-hero .heading.h1 letter-spacing: -2px / line-height: 1.05 + mobile 44px / -1px  css/components/dy-section.css  2026-05-11
  Ruling: L1 not config. L2 not OKLCH. L3 too broad (--h1-letter-spacing / --h1-line-height are site-wide tokens; changing them would affect all h1s, not just landing-hero H1s). L5 correct — component-scoped via additional_classes "landing-hero" on /services, /how-we-do-it, /open-source-projects hero sections. Aligns three pages to brief's display-xl token (72px / 500 / 1.05 / -2px / Rubik). FU-2.

[Layer 5] .grid-wrapper--2col grid-template-columns: 1fr + grid-column: auto at max-width: 991px  css/components/grid-wrapper.css  2026-05-11
  Ruling: L1 not config. L2 not OKLCH. L3 not a theme token. L5 correct — component-scoped override on .grid-wrapper--2col .grid-wrapper__grid. Collapses 2-col engagement grid to 1-col below 992px viewport, matching canonical preview. Cross-page: .grid-wrapper--2col confirmed services-only (T1 grep 2026-05-11: zero matches on /, /articles, /about-us, /open-source-projects, /how-we-do-it, /contact-us). FU-S5-1.

[Layer 5] .grid-wrapper--2col .card__layout → display:flex, flex-direction:column at max-width:991px  css/components/card.css  2026-05-11
  Ruling: L1 not config. L2 not OKLCH. L3 not a theme token. L5 correct — component-scoped override. Defeats Dripyard's @container (width > 600px) { display:grid; grid-template-columns: repeat(2,...) } on .card__layout when the 2-col grid has collapsed to 1-col. The engagement cards have no .card__top (image), so the 2-col grid layout wastes half the card width. Scoped to .grid-wrapper--2col (services-only, confirmed T1 grep 2026-05-11). Also resets padding-inline on .card[class*="theme"] .card__layout. Cycle 2 rework (FU-S5-1).

[Layer 5] .browser-chrome (new SDC)  components/browser-chrome/browser-chrome.css  2026-07-21
  Ruling: New bespoke component (#276 Wave 2 sub-phase A). No component frames a screenshot in browser-chrome; light card, dark titlebar strip (values asserted directly from html .theme--black tokens in base.css since the titlebar isn't wrapped in a .theme--black zone element). L1 not config. L3 too broad (--theme-* override would restyle every element in the zone, not just this bespoke card shape). L5 correct.

[Layer 5] .code-snippet (new SDC)  components/code-snippet/code-snippet.css  2026-07-21
  Ruling: New bespoke component (#276 Wave 2 sub-phase A). Dark by design — one of the two spots the approved wireframe confirms dark is semantically native (html .theme--black, "terminal/screenshot containers" per base.css). L1 not config. L3's .theme--black zone is the correct token *source* but this component isn't wrapped in that zone class, so its literal values are reused at L5 rather than the zone selector applied directly. L5 correct.

[Layer 5] .hero.theme--white .hero__block-content > .pill --pill-background-color/--pill-text-color/border-color → white bg + terracotta-deep #8E4A2A  css/components/hero.css  2026-07-21
  Ruling: #276 Wave 2 sub-phase A dev-status pill. L1 not config. L3 too broad — a --pill-background-color override in html .theme--white would restyle every pill site-wide (tags/chips use the dark-fill default intentionally elsewhere). pill.component.yml has no additional_classes prop, so a modifier class cannot be passed through Canvas inputs — structural scoping via the hero ancestor (.hero.theme--white .pill) is the only mechanism without inventing a new component. L5 correct, matches this file's existing kicker/button/heading override pattern.

[Layer 5] .hero.theme--white .hero__block-content > .code-snippet/.browser-chrome flex-basis:100%/margin-top spacing  css/components/hero.css  2026-07-21
  Ruling: #276 Wave 2 sub-phase A. Vertical rhythm for the two new hero children within the existing flex row/column layout. L1/L3 ruled out for the same reason as the pill rule above (page-specific hero composition). L5 correct.

[Layer 3] --pl-primary-light in :root → var(--pl-accent-deep)  css/base.css:L54  2026-07-22
  Ruling: T finding W-1 / issue #280 (binding, André). L1 not config. L2 not OKLCH. L3 correct — --pl-primary-light is a :root token whose only consumer sitewide is .button--primary's resting bg; redefining it fixes the sitewide AA failure (white-on-#62BBCB, 2.13:1) at the source, not per-instance. New value #8E4A2A (terracotta-deep) = 6.64:1 AA/AAA, and is the same value the approved wireframe (#276) already specs for the primary CTA fill — one fix delivers both.

[Layer 5] --button-background-color-hover/-active in .button--primary → color-mix(in oklch, var(--pl-accent-deep) 85%/75%, black)  css/components/button.css:L60-61  2026-07-22
  Ruling: Same W-1/#280 fix. Hover/active derived from the corrected token via color-mix() (matching existing color-mix precedent in footer.css) rather than hardcoding a fourth brand hex. Live-rendered: hover #804225 = 7.71:1 AAA, active #68351C = 9.93:1 AAA.

[Layer 5] --breadcrumb-link-color in .breadcrumb → var(--pl-accent-deep)  css/components/breadcrumb.css  2026-07-22 (new file, new libraries-extend entry)
  Ruling: Same W-1/#280 finding, different token family (breadcrumb consumes --theme-link-color/--pl-primary, not --pl-primary-light). L3 (--theme-link-color/--pl-primary) ruled OUT — that token is the shared sitewide inline-link color for every white/light/secondary-zone <a>, a separately pre-approved 3.5:1 deviation; retargeting it would recolor every inline link, an unapproved blast radius. L5 correct — override the breadcrumb SDC's own --breadcrumb-link-color custom property (dripyard_base:breadcrumb already exposes this as a per-component indirection), scoped to .breadcrumb only. New value #8E4A2A on white = 6.64:1, on cream = 5.79:1 (AA/AAA both).

[Layer 5] .pill (hero) width:fit-content + max-width:100% + margin-inline:auto + flex-wrap:nowrap; .pill > .text white-space:nowrap + font-family/font-size (mono 12px)  css/components/hero.css  2026-07-22 (S finding R1)
  Ruling: pill inherited the hero flex group's flex-basis:100%, stretching it to a full-width bar (900px @1280); at 360 flex-wrap on .pill let the ::before dot wrap to its own line (detached dot). Removed .pill from the flex-basis:100% group; gave it fit-content sizing. Two further root causes found during verification: nested dripyard_base:text child needed white-space:nowrap to size to content (block-level div, no inline option); and the same text child's own .body-m class (16px, 0,1,0 specificity) was overriding the intended 12px mono size via specificity, not inheritance — moved the font rule directly onto .pill > .text. L1/L3 not applicable (component-specific structural fix, pill has no additional_classes prop). L5 correct, same file/pattern as the rest of the hero override set.

[Layer 5] .hero.theme--white background: two radial-gradient layers (terracotta --pl-accent α.10, teal --pl-primary α.06) over --theme-surface-alt  css/components/hero.css  2026-07-22 (S finding S-A4)
  Ruling: approved wireframe specs a soft gradient tint behind the hero; live hero fell back to flat white (--hero-background: transparent -> --theme-surface). L1 not config. L3 (html .theme--white {}) would apply the gradient sitewide, not just the hero — TOO BROAD. L5 correct — component-scoped background shorthand, values copied exactly from the wireframe using existing --pl-accent/--pl-primary tokens (no new hex). Contrast re-verified at the gradient's peak-saturation pixels (screenshot pixel-read, not just computed CSS): worst case 5.31:1 (kicker/pill text on terracotta peak) — still AA/AAA pass.

[Layer 5] .hero.theme--white .heading max-width: 720px -> 820px  css/components/hero.css  2026-07-22 (S finding S-A2, trivial)
  Ruling: H1 wrapped to 4 lines at 1280 with a near-orphan last line. Container-width testing confirmed 820px collapses to 3 balanced lines at 1280 with zero effect at 360/768 (both narrower than 720px already). Same font-size/letter-spacing — only widens the wrap boundary. L5 correct, same selector as the existing rule.

[Content, not CSS] Hero subhead text trimmed to "Self-hosted, MIT-licensed, AI in the core." (dropped trailing "Now in development — in the open.")  canvas_page 20 via scripts/sprint-wave2-276-hero-rebuild.php  2026-07-22
  Ruling: André-approved binding copy amendment (relayed by coordinator, addendum to S's REWORK fix-pass), superseding #268's original verbatim subhead block for this element. Resolves the duplicated dev-status phrase (pill + subhead both carried it) that S judged reads badly live; matches the approved wireframe's own subline, which already omits the phrase. Pill copy unchanged ("Now in development — in the open" — sole carrier of dev-status now). No CSS/token change; pure Canvas content edit via the idempotent assembly script (component_version preserved unchanged, double-run idempotence re-verified byte-identical).

[Layer 5] .hero.theme--white .hero-title__brand → color: var(--pl-accent-deep)  css/components/hero.css  2026-07-22 (S-A1, O-authorized)
  Ruling: O authorized wrapping "Aftersight" in a class-carrying span inside the stored H1 string — the #268 verbatim-copy guarantee protects rendered words, not markup. dripyard_base:heading cannot host a span (plain-string text prop, Twig auto-escaped — verified empirically). New component performant_labs_v2:hero-title (new SDC, reuse-before-create satisfied — no existing component renders <h1> + accepts a brand-word split) replaces the H1 instance in place (same UUID, same rendered classes) via the assembly script. L1 not config. L3 too broad (would recolor every white-zone element). L5 correct, scoped to the new .hero-title__brand class only. Color: terracotta-deep #8E4A2A (NOT plain terracotta #C97B5C, which measured 2.60-2.83:1 against the hero's gradient-tinted bg peaks — fails the WCAG large-text 3:1 threshold everywhere except an unsafe 3.25:1 on pure white). terracotta-deep passes 5.31-6.64:1 across all tested backgrounds (AA/AAA, both large-text and body thresholds).
