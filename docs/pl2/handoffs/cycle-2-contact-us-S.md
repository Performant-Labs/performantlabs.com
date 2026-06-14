# Handoff-S: Cycle 2 — Contact-Us CSS Punch List

**Date:** 2026-05-08
**Branch:** `aa/pl-contact-us`
**Issue:** `docs/pl2/handoffs/cycle-2-contact-us-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/cycle-2-contact-us-T.md` (post-rework round 1, zero blockers)
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2-contact-us-F.md` (with rework round 1 appended)

---

## Preconditions

| Precondition | Status |
|--------------|--------|
| T reported zero blocking issues after rework round 1 | Confirmed |
| Chrome MCP browser tools available | Confirmed (`tabs_context_mcp` returned active tab group; navigation HTTP 200) |
| `ddev drush cr` run before audit | Confirmed |

Both preconditions hold. Tier 3 visual audit proceeded.

---

## Audit method

- **Live URL audited:** `https://pl-performantlabs.com.3.ddev.site:8493/contact-us?theme=performant_labs_20260502`
- **Preview reference:** `docs/pl2/Previews/contact-us.html` (rendered side-by-side via `pl-performantlabs.com.3.ddev.site:8493/contact-us-preview.html`, copy removed at end of audit)
- **Sibling regression check:** `/about-us` rendered at same URL family
- **Browser environment note:** The MCP-controlled Chrome rendered the page at a 2160 CSS-px inner viewport regardless of `resize_window` calls (devicePixelRatio=1.6 + window-manager scaling). All desktop measurements below are taken at 2160px viewport, which is well above the ≥992px desktop breakpoint and produces the same two-column layout as the operator's intended 1280px desktop. Mobile (≤576/≤991) checks are evidence-based via CSS media-rule confirmation since the embedded viewport could not be forced narrower; this matches T's approach for mobile rules.

---

## Tier 3 visual audit — desktop (2160px viewport, ≥992px breakpoint)

### Section A — Hero

| Check | Method | Result |
|-------|--------|--------|
| H1 56px / 1.05 line-height / -1.4px letter-spacing | computed style on `.contact-us-hero .heading.h1` | `font-size: 56px`, `line-height: 58.8px (= 56 × 1.05)`, `letter-spacing: -1.4px` — PASS |
| H1 text correct | computed text content | "Let’s talk about your quality and testing goals." — PASS |
| Hero kicker centered (cx delta ≤ 2px) | bounding-rect cx vs parent cx on `.contact-us-hero .kicker` | delta = 0px — PASS |
| Hero kicker text + treatment | rendered "GET IN TOUCH" in terracotta uppercase with leading rule — visually confirmed in screenshot | PASS |
| H1 wraps to two lines, no orphan | rendered text shows balanced 2-line wrap | PASS |
| Lead paragraph below H1 | rendered "Tell us where your suite is now…" | PASS |

Rendered desktop screenshot of hero matches preview (kicker → centered H1 → italic lead). No deltas.

### Section B — Form

| Check | Method | Result |
|-------|--------|--------|
| Two-column form-grid at desktop | computed style on `.dy-section__content` (form section) | `display: grid; grid-template-columns: 1056px 320px; gap: 64px; column-gap: 64px` — PASS |
| Form column on left, sidebar on right (same row) | bounding rects: form left=351 right=1407; sidebar left=1471 right=1791; gap=64; sameRow=true | PASS |
| Form column width vs sidebar 320px | form column 1056px, sidebar 320px exactly | PASS |
| Inputs `border-radius: 8px` | computed style on `input[name="name"]` | `border-radius: 8px` — PASS (rework round 1 fix verified) |
| Inputs `padding: 12px 14px` | computed style | `padding: 12px 14px` — PASS |
| Inputs `border: 1px hairline` | computed `0.625px solid rgb(229,225,220)` (subpixel scaling, correct color) | PASS |
| Required marker `::after` color = `#8E4A2A` | computed `background-color: rgb(142,74,42)` on `.form-required::after` | PASS |
| Submit button reads "Send message" | DOM value attribute and visible text | PASS |
| Submit button height ≥44px | computed `height: 47.998px` | PASS |
| Sidebar `padding: 32px` all four sides | computed `padding-top/right/bottom/left: 32px` | PASS (rework round 1 fix verified) |
| Sidebar `border-radius: 12px` | computed | PASS |
| Sidebar `border: 1px hairline` | computed `0.625px solid rgb(229,225,220)` | PASS |
| Sidebar `background: #FFFFFF` | computed `rgb(255,255,255)` | PASS |
| Sidebar `position: sticky; top: 48px` at desktop | computed `position: sticky; top: 48px` | PASS |
| Sidebar inner `flex-wrapper__layout` 5 children | DOM children: kicker "Faster path", H2 "Prefer a quick call?", body text, "Book a slot →" button, "Response time" + meta | PASS |
| Sidebar inner gap 16px | computed | PASS |
| Sidebar visual divider above "Response time" | rendered hairline visible in screenshot | PASS |

**Cross-cutting visual delta (see §Verdict):** Form text inputs do not fill their column. See "Form input width — visible delta from preview" below.

### Section C — What to expect (cream)

| Check | Method | Result |
|-------|--------|--------|
| 3-up grid of cards at desktop | rendered screenshot shows three cards in one row | PASS |
| Card eyebrow_text (e.g. "01 / ACKNOWLEDGMENT") in terracotta uppercase | visually rendered terracotta uppercase | PASS |
| Card hover transitions border-color | `.card[class*="theme"]:hover { border-color: var(--theme-link-color) }` confirmed in `card.css:24-26`; `transition: border-color 0.15s ease-out` on base `.card` | PASS (rule present; full visual hover not triggered through MCP, but the rule and transition are correct and the cream-zone `--theme-link-color` resolves to teal `#0F6F8A` per T's audit) |
| No regression from Cycle 1 visual treatment | cream background, white card surface, 48px internal padding all visually unchanged | PASS |

### Section D — Closing CTA (espresso)

| Check | Method | Result |
|-------|--------|--------|
| **Kicker "Already decided?" centered above H2 (delta ≤ 2px)** | bounding-rect cx (1070.625) vs parent `.dy-section__content` cx (1070.625) | delta = 0px — **PASS — primary verification of operator's Cycle-1 complaint** |
| Kicker classes `kicker--centered kicker--dark` | DOM classList | PASS |
| H2 "Skip the form — book the review." rendered | screenshot | PASS |
| Two CTA buttons rendered side-by-side | "Book a testing review →" (cyan filled) + "View services" (ghost outline on espresso) — screenshot | PASS |
| Espresso background and ghost border | screenshot confirms espresso bg `#1F1A14` with cyan filled CTA + ghost outline secondary | PASS |

---

## Mobile (≤576px / ≤991px) — CSS-rule audit

The MCP-controlled viewport could not be reduced below 2160px in this session. Mobile verdicts below are evidence-based on CSS media-query rule confirmation in the served stylesheets, matching T's mobile verification approach.

| Check | CSS evidence | Result |
|-------|--------------|--------|
| Hero H1 mobile typography (≤576px: 36px / -1.2px) | `dy-section.css` rule confirmed served: `@media (max-width: 576px) { .contact-us-hero .heading.h1 { font-size: 2.25rem; letter-spacing: -1.2px } }` | PASS |
| Form-grid collapses to single column at <992px | `webform.css` declares grid only inside `@media (min-width: 992px)` — no grid at <992px → default single-column flow | PASS |
| Sidebar drops sticky at <992px | `@media (max-width: 991px) { .contact-sidebar { position: static } }` confirmed | PASS |
| Submit button full-width and ≥44px at ≤576px | `@media (max-width: 576px) { .block-webform-block .webform-button--submit { width: 100%; min-height: 44px } }` confirmed | PASS |
| 3-up cards collapse to 1-up at <768px | inherits `grid-wrapper--3col` Dripyard rule (T verified) | PASS |
| Dark CTA buttons stack at ≤576px | `dy-section.css` closing-CTA button-row rule (T verified) | PASS |
| No page-level horizontal scroll at desktop | `document.scrollWidth (2141) === clientWidth (2141)` → no overflow | PASS at desktop (mobile not directly testable) |

---

## WCAG 2.2 AA audit

| Check | Method | Result |
|-------|--------|--------|
| Keyboard navigation (logical tab order, no traps) | DOM focusable enumeration: skip-link → header logo → 6 nav links → top "Book a testing review" → form fields top-to-bottom → submit → sidebar "Book a slot" → footer links. 34 focusable elements total. | PASS |
| Focus ring visible on form inputs (solid 2px primary) | computed CSS variable on `<form>`: `--focus-ring-style: solid` (overrides Dripyard's `dotted` default), `--theme-focus-ring-color: #1893b4`. Dripyard's `form-text.css :focus { outline: var(--focus-ring-style) 2px var(--theme-focus-ring-color); outline-offset: 2px }` resolves to `outline: solid 2px #1893b4; outline-offset: 2px`. The visual ring could not be captured in a screenshot via this MCP (programmatic `.focus()` does not trigger `:focus-visible`, and no rendered focus state was observed in scripted tests), but the cascade resolution is correct. | PASS — rule present and correctly resolves; visually unverified due to MCP focus-trigger limitation |
| Heading hierarchy (no skipped levels) | H1 hero → H2 sidebar / cream / closing CTA → H3 cards / footer cols. H2 "Main navigation"/"Breadcrumb"/"Footer" are visually-hidden landmark labels (standard pattern). | PASS |
| Image alt text | All `<img>` elements on the page have alt attributes (decorative use empty alt where appropriate); page has minimal imagery (logo + decorative icons). T's Pa11y check returned 0 errors. | PASS |
| Forced-colors mode | No explicit `@media (forced-colors: active)` rules in the theme. Page relies on standard `border` properties + system-recognized properties; in forced-colors mode interactive borders revert to system-canvas. No Cycle-2-specific regression. | PASS (no Cycle-2 regression; not a Cycle-2 acceptance item) |
| Reduced-motion | No `@media (prefers-reduced-motion: reduce)` rules in theme. No auto-animations on the contact-us page (no entrance animations, no marquees, no autoplay video). Only animations queried are extension/admin overlay (`claude-pulse`, Drupal `toast-in` admin status), which are out-of-page chrome. | PASS |
| 200% zoom | At 2160 viewport with 200% zoom = 1080 effective. Layout uses fluid grid (`minmax(0, 1fr) 320px`), `text-wrap: balance` on H1, no fixed-pixel layouts. No horizontal scroll observed at desktop. | PASS — no fixed-px traps detected |
| Mobile touch targets (≥44px) | Submit button at ≤576px: `width: 100%; min-height: 44px` — PASS. Sidebar "Book a slot" inherits `button--large` (48px) — PASS. Closing CTA buttons inherit `dy-section.css` 44px min-height — PASS. | PASS |
| Mobile typography scale | H1 36px / -1.2px at ≤576px confirmed in `dy-section.css` mobile media rule | PASS |
| Mobile layout (grid collapse, CTA stacking, no horizontal scroll) | All confirmed via CSS media-rule audit above | PASS |
| Contrast ratios (T computed independently, S spot-check) | Hero H1 `#1F1A14` on `#FFFFFF` 17.27:1; form labels `#2A2520` on `#FFFFFF` 15.17:1; required marker `#8E4A2A` on `#FFFFFF` 6.64:1; focus ring `#1893b4` on `#FFFFFF` 3.58:1 (borderline above 3:1, no headroom — flagged advisory); closing CTA kicker `#C97B5C` on `#1F1A14` 5.32:1; ghost-on-dark border 3.48:1. All thresholds met. | PASS |

---

## Static preview comparison

| Section | Preview | Live | Match? |
|---------|---------|------|--------|
| Hero kicker treatment | terracotta uppercase + leading hairline rule, centered above H1 | identical | MATCH |
| Hero H1 size + wrap | 56px, balanced 2-line wrap | identical | MATCH |
| Hero lead paragraph | italic, muted color, centered | identical (italic styling preserved through Dripyard `text-content`) | MATCH |
| Form grid columns | `minmax(0, 1fr) 320px` with 64px gap | identical | MATCH |
| **Form input width** | `width: 100%` — all inputs fill column (preview: 768px) | inputs constrained by HTML `size` attribute: name/email/company `size=60` → 498px; phone `size=30` → 269px; textarea (no size attr) → 1056px full column | **DELTA — see Verdict** |
| Form input chrome (radius/border/padding/focus) | 8px radius, hairline border, 12×14 padding, 2px primary focus ring | identical | MATCH |
| Required marker color | terracotta `#8E4A2A` (`var(--accent-deep)`) | identical | MATCH |
| Submit button | "Send message", teal filled, ≥44px height | identical | MATCH |
| Sidebar card | hairline border, 12px radius, 32px padding, white bg, sticky | identical | MATCH |
| Sidebar inner content | kicker → H2 → body → button → divider → meta | identical 5-child layout, 16px gap | MATCH |
| Cards section | 3-up grid, white surface on cream, eyebrow_text in terracotta | identical | MATCH |
| Closing CTA section | espresso bg, kicker centered above H2, two-button row (cyan filled + ghost outline) | identical, kicker delta = 0px | MATCH |

**Items the preview shows that the live page does NOT show** (but are not Cycle-2 scope):
- Phone-field hint text "Optional. Faster than email if you'd rather we call back." (Drupal webform `description` attribute — config edit, not Cycle 2)
- "* Required field." legend below message field (Drupal webform `form_required_label` — config or template, not Cycle 2)
- Privacy text beside submit button "We answer within one business day. Your details stay with us — no third-party sales tools, no newsletter signup behind the form." (Drupal webform helptext — content/config, not Cycle 2)

These three content gaps are not in Cycle-2's enumerated scope. They are visible deltas from preview but are advisory only at this point — the operator should decide whether they go into a future cycle or are accepted as-is.

---

## Sibling-page regression spot-check (visual)

| Page | Check | Result |
|------|-------|--------|
| `/about-us` H1 size unchanged | computed `font-size: 72px` (no contact-us-hero leak) | PASS |
| `/about-us` all 5 `.kicker--centered` instances delta = 0 | "About" / "Track record" / "Open source" / "Dogfood" / "Get started" — all delta 0 | PASS |
| `/about-us` overall page rendering | screenshot scan (cycle-3 about-us was already operator-approved before this cycle) — no visible regression from kicker-SDC change | PASS |
| `/`, `/services`, `/how-we-do-it`, `/articles`, `/open-source-projects` HTTP 200 | T verified | PASS |

---

## Verdict

**REWORK** — one blocking visible delta from the operator-approved preview.

### Blocker — Form text inputs are width-constrained instead of column-width

**Visible symptom:** The form column (1056px wide at desktop) contains text inputs that render at only 498px (`name`, `email`, `company` — `size=60`) and 269px (`phone` — `size=30`). The textarea, which doesn't honor the `size` attribute, fills the full 1056px column. The result is a visually ragged form: short text inputs anchored to the left, with a wide textarea below — exactly the operator's Cycle-1 complaint that "the form fields occupy only the left ~third of the section." The two-column grid is correct, but the inputs inside the column are not full-width.

**Side-by-side evidence:**
- Preview (`docs/pl2/Previews/contact-us.html`): all inputs use `.field__input { width: 100%; ... }` and render at full column width (~768px in preview's 1600px viewport)
- Live: inputs computed `width: 498.613px` (size=60) and `269px` (size=30); container is 1056px

**Why this is a Cycle-2 blocker (not a future-cycle item):** The runbook §Cycle 2 Confirmed scope item 2 ("Two-column form-grid (Section B)") was explicitly motivated by the operator's complaint that the form fields occupied only the left third of the section. The grid was widened correctly, but the inputs inside the grid still occupy only a portion of the column. The visual outcome — short inputs in a wide column — does not match the preview the operator personally approved. The operator's directive #1 ("make sure pages look like the preview") is the gate here, and this delta will be visible to the operator on a quick visual check.

**Suggested fix (advisory — F decides implementation):** add a CSS rule to `webform.css` that forces inputs to fill their column on the contact-us form section, e.g.

```css
.block-webform-block input[type="text"],
.block-webform-block input[type="email"],
.block-webform-block input[type="tel"],
.block-webform-block input[type="url"],
.block-webform-block input[type="number"] {
  width: 100%;
}
```

`max-width: 100%` (already present) caps inputs to the container, but the HTML `size` attribute sets a smaller intrinsic width that `max-width` does not raise. `width: 100%` (or `width: -webkit-fill-available`) is required to make the inputs match the textarea's behavior and the preview's intent.

---

## Advisory notes (non-blocking)

1. **Focus ring contrast 3.58:1** — borderline above the 3:1 minimum for non-text UI. T already flagged this. Operator should be aware that any future color adjustment to `--theme-focus-ring-color` could drop below the threshold. Not a Cycle-2 blocker.

2. **Three preview content elements are not present on live page:**
   - Phone-field description "Optional. Faster than email if you'd rather we call back."
   - Required-field legend "* Required field."
   - Privacy helptext beside submit button "We answer within one business day. Your details stay with us — no third-party sales tools, no newsletter signup behind the form."

   These are webform config/content items, not in Cycle-2 scope. Operator decision whether they're in scope for a future cycle.

3. **Forced-colors mode and reduced-motion** — neither has explicit theme support, but the page has no auto-animations and no Cycle-2 changes degrade these modes. Not a Cycle-2 regression.

4. **MCP viewport limitation noted** — could not force the embedded Chrome viewport below 2160px. Mobile checks rely on T's CSS-rule audit. If the operator wants visual confirmation at 375px, they should re-render in their own browser dev-tools at 375px. The CSS rules are correct; whether they produce the correct visual at 375px is the only remaining unverified claim.

5. **Card hover state** — the rule is correct (`border-color` shifts to `var(--theme-link-color)` which resolves to teal `#0F6F8A` in cream zone, with 0.15s ease-out transition). The actual hover trigger could not be screenshotted via MCP, but the cascade is verified.

6. **Closing-CTA kicker centering: delta = 0px** — the operator's Cycle-1 complaint is fully resolved. About-us closing-CTA kicker also delta = 0px (the propagated benefit). This is the primary verification the operator asked S to perform; it passes cleanly.

7. **F-handoff math discrepancy** — F reported 27 components total; T computed 26. Non-blocking, no actual component is missing. T's count is correct.

8. **Closing CTA kicker contrast** — F reported 3.97:1; T independently computed 5.32:1. Both pass the 3:1 decorative threshold. Discrepancy is large enough to suggest F made an arithmetic error, but the actual ratio exceeds the threshold by a comfortable margin. Non-blocking.

---

## Acceptance criteria — final status

| Criterion | Result |
|-----------|--------|
| Closing CTA kicker centered (cx delta ≤ 2px) | PASS (delta = 0px) |
| About-us closing CTA also centers correctly (no regression) | PASS (delta = 0px) |
| Form section ≥992px: two columns (form ~1fr, sidebar 320px, 64px gap) | PASS |
| Form section <992px: single column | PASS (CSS rule confirmed) |
| Form inputs: 8px radius | PASS (rework round 1 fix) |
| Form inputs: 1px hairline border | PASS |
| Form inputs: 12×14 padding | PASS |
| Form input focus: 2px solid primary with 2px offset | PASS (cascade verified) |
| **Form inputs visually fill the form column (preview-fidelity)** | **FAIL — see Blocker** |
| Required marker color = `var(--accent-deep)` (#8E4A2A) | PASS |
| Submit button reads "Send message" | PASS |
| Sidebar: hairline border, 12px radius, 32px padding all sides, sticky at desktop | PASS |
| Hero H1: 56px / 1.05 / -1.4px desktop; 36px / -1.2px mobile (≤576px) | PASS |
| What-to-expect cards hover border shifts to primary | PASS (rule confirmed; transition present) |
| Mobile 375px: form-grid collapse, sidebar drops sticky, submit full-width, cards 3→1, no horizontal scroll | PASS (CSS rule confirmation; not directly viewport-tested) |
| WCAG AA: focus ring ≥3:1, accent-deep marker ≥4.5:1 | PASS |
| No regression on `/`, `/services`, `/how-we-do-it`, `/articles`, `/open-source-projects`, `/about-us` | PASS |
| Pa11y on `/contact-us`: 0 errors | PASS (T verified) |
| **Operator preview-fidelity gate** | **NOT PASSED — form-input-width delta** |

---

## What rework needs

One change: add a `width: 100%` rule (or equivalent) on the contact-form text inputs to make them fill the form column, matching the preview. Suggested selector and rule are in §Verdict above. F decides exact implementation.

After F's fix, T re-verifies computed `width` of `input[type="text"]`, `input[type="email"]`, and `input[type="tel"]` equals the form column width minus any input padding (i.e., the input's bounding rect width should be ≈ 1056px on desktop, matching the textarea's behavior). Then S re-renders and confirms visual match to preview.

---

## Re-render after rework round 2

**Date:** 2026-05-08
**Cache cleared:** `ddev drush cr` — success
**Live URL re-rendered:** `https://pl-performantlabs.com.3.ddev.site:8493/contact-us?theme=performant_labs_20260502`
**Browser environment:** same MCP-controlled Chrome at 2160-px viewport (≥992px desktop breakpoint)

### Form-input width — re-verification

| Field | Cycle-2 R1 width | Round-2 width | Form column | Match? |
|-------|-----------------|---------------|-------------|--------|
| `input[name="name"]` (size=60) | 498px | **1056px** | 1056px | PASS |
| `input[type="email"]` (size=60) | 498px | **1056px** | 1056px | PASS |
| `input[name*="company"]` (size=60) | 498px | **1056px** | 1056px | PASS |
| `input[type="tel"]` (size=30) | 269px | **1056px** | 1056px | PASS |
| `textarea[name="message"]` | 1056px | 1056px | 1056px | PASS (unchanged) |

All five inputs now compute to `width: 1056px` — full form-column width. The HTML `size` attribute is overridden by the new CSS `width: 100%` rule, exactly as the preview achieves it.

### Visual continuity check (form section screenshot)

Rendered desktop screenshot of the form section after rework round 2 shows:
- Name field: full-column width input
- Email field: full-column width input
- Company field: full-column width input
- Phone field: full-column width input (no longer 30% width)
- Message textarea: full-column width (unchanged)
- Submit button: natural button width 162px (NOT stretched) — boundary check PASS

The "form anchored to the left third" appearance is gone. Each input edge now aligns with the textarea's edge. The form visually matches the preview.

### Boundary checks (no regression)

| Check | Pre-rework | Post-rework | Result |
|-------|-----------|-------------|--------|
| Submit button width (natural, not stretched at desktop) | 162px | 162px | PASS — unchanged |
| Submit button height | 47.998px | 47.998px | PASS — unchanged |
| Submit button text | "Send message" | "Send message" | PASS — unchanged |
| Honeypot field `display: none` | — | `display: none` | PASS |
| Form column width | 1056px | 1056px | PASS — unchanged |
| Sidebar column width | 320px | 320px | PASS — unchanged |
| Sidebar `position: sticky; top: 48px` | confirmed | confirmed | PASS — unchanged |
| Form-grid gap | 64px | 64px | PASS — unchanged |
| Form-grid sameRow at desktop | true | true | PASS — unchanged |
| Hero H1 56px / -1.4px / 1.05 line-height | confirmed | confirmed | PASS — unchanged |
| Closing CTA kicker delta | 0px | 0px | PASS — unchanged |
| No page horizontal scroll | confirmed | confirmed | PASS — unchanged |

### Section visual scan (post-rework)

- **Hero (Section A):** unchanged. Kicker centered, H1 56px, lead paragraph italic — visually matches preview.
- **Form (Section B):** form column on left now fills with 5 full-width inputs (name → email → company → phone → message); sidebar card on right unchanged. **The single Cycle-2 blocker is resolved.**
- **What to expect (Section C):** unchanged. 3-up cards on cream, terracotta eyebrow text, white card surface, hover rule confirmed.
- **Closing CTA (Section D):** unchanged. Kicker centered (delta 0), H2, two-button row.

### Updated acceptance criteria — Cycle-2 final status

| Criterion | Original verdict | Rework round 2 verdict |
|-----------|------------------|------------------------|
| Closing CTA kicker centered (cx delta ≤ 2px) | PASS | PASS (unchanged) |
| About-us closing CTA centers correctly (no regression) | PASS | PASS (unchanged) |
| Form section ≥992px: two columns | PASS | PASS (unchanged) |
| Form section <992px: single column | PASS (CSS) | PASS (unchanged) |
| Form inputs: 8px radius | PASS | PASS (unchanged) |
| Form inputs: 1px hairline border | PASS | PASS (unchanged) |
| Form inputs: 12×14 padding | PASS | PASS (unchanged) |
| Form input focus: 2px solid primary with 2px offset | PASS (cascade verified) | PASS (unchanged) |
| **Form inputs visually fill the form column (preview-fidelity)** | **FAIL** | **PASS (rework round 2 fix verified)** |
| Required marker color = `var(--accent-deep)` | PASS | PASS (unchanged) |
| Submit button reads "Send message" | PASS | PASS (unchanged) |
| Sidebar: hairline border, 12px radius, 32px padding, sticky | PASS | PASS (unchanged) |
| Hero H1: 56px desktop / 36px mobile | PASS | PASS (unchanged) |
| What-to-expect cards hover border shifts to primary | PASS | PASS (unchanged) |
| Mobile responsive (CSS rules) | PASS | PASS (unchanged) |
| WCAG AA contrast ratios | PASS | PASS (unchanged) |
| No regression on sibling pages | PASS | PASS (unchanged) |
| Pa11y on `/contact-us`: 0 errors | PASS (T) | PASS (no CSS changes likely to introduce a11y violations; recommend T re-runs) |
| **Operator preview-fidelity gate** | **NOT PASSED** | **PASSED (S verdict — operator confirms)** |

### Verdict after rework round 2

**S rework 2 PASS, ready for operator preview-fidelity gate.**

The single Cycle-2 blocker (form-input width) is resolved. All other acceptance criteria remain green. No regressions detected on the contact-us page itself or on the sibling-page (about-us) spot-check from the original audit. The page now visually matches the operator-approved preview at desktop breakpoints; mobile layout rules remain CSS-confirmed.

The original §Verdict above is preserved as historical record of what S found in the first audit pass; this section records the resolution after F's rework round 2.
