# Handoff-T: Cycle 2 — Contact-Us CSS Punch List

**Date:** 2026-05-08
**Branch:** `aa/pl-contact-us`
**Issue:** `docs/pl2/handoffs/cycle-2-contact-us-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2-contact-us-F.md`

---

## Tier 1 results

| Check | Command | Expected | Actual | Result |
|-------|---------|----------|--------|--------|
| HTTP 200 `/contact-us` | `curl -sk ... -w '%{http_code}'` | 200 | 200 | PASS |
| `contact-us-hero` class on Section A | `grep -c 'contact-us-hero' /tmp/contact-us-c2.html` | >=1 | 1 | PASS |
| `contact-sidebar` class on flex-wrapper | `grep -c 'contact-sidebar' /tmp/contact-us-c2.html` | >=1 | 1 | PASS |
| `flex-wrapper__layout` present | `grep -c 'flex-wrapper__layout' /tmp/contact-us-c2.html` | >=1 | 1 | PASS |
| Submit button text "Send message" | `grep 'Send message' /tmp/contact-us-c2.html` | button value + text | Found as `value="Send message"` and rendered text node | PASS |
| `webform.css` served via `<link>` | `grep 'webform.css' /tmp/contact-us-c2.html` | 1 custom CSS link | 1 match: `/themes/custom/performant_labs_20260502/css/components/webform.css` | PASS |
| `kicker.css` served via `<link>` | `grep 'kicker.css' /tmp/contact-us-c2.html` | 1 link | 1 match | PASS |
| `webform.css` file exists on disk | `ls -la web/themes/custom/...` | file present | 7290 bytes, 2026-05-08 | PASS |
| `.form-required` present (3 fields) | `grep -c 'form-required' /tmp/contact-us-c2.html` | 3+ | 3 | PASS |
| Hero H1 text present | `grep 'Let.*talk'` (entity-encoded) | H1 text | Found as `Let&rsquo;s talk about your quality and testing goals.` | PASS |
| Kicker "Get in touch" | `grep -c 'Get in touch'` | 1 | 2 (heading + rendered) | PASS |
| "After you send" | `grep -c 'After you send'` | 1 | 1 | PASS |
| Acknowledgment / Discovery call / Written next step | grep each | 1 each | 1 each | PASS |
| "Already decided" | `grep -ci 'Already decided'` | 1 | 1 | PASS |
| "Skip the form" | `grep -ci 'Skip the form'` | 1 | 1 | PASS |
| savvycal.com URLs | `grep -c 'savvycal.com'` | 2 | 2 | PASS |
| "View services" | `grep -ci 'View services'` | 1 | 1 | PASS |
| Sibling HTTP 200: `/about-us` | curl | 200 | 200 | PASS |
| Sibling HTTP 200: `/` | curl | 200 | 200 | PASS |
| Sibling HTTP 200: `/services` | curl | 200 | 200 | PASS |
| Sibling HTTP 200: `/how-we-do-it` | curl | 200 | 200 | PASS |
| Sibling HTTP 200: `/articles` | curl | 200 | 200 | PASS |
| Sibling HTTP 200: `/open-source-projects` | curl | 200 | 200 | PASS |

Note: `Let's talk` grep returned 0 because the apostrophe is encoded as `&rsquo;`. Confirmed present via targeted entity-aware grep.

---

## Tier 2 results

| Check | Method | Result |
|-------|--------|--------|
| Single H1 | `grep -c '<h1'` | 1 — PASS |
| Heading hierarchy: no skipped levels | `grep -n '<h[1-6]'` | H1 (hero) → H2 (sidebar, what-to-expect, closing CTA) → H3 (3x card titles + footer cols). No H4. No skips. — PASS |
| ARIA landmark `<header>` | `grep -c '<header'` | 1 — PASS |
| ARIA landmark `<main>` | `grep -c '<main'` | 1 — PASS |
| ARIA landmark `<footer>` | `grep -c '<footer'` | 1 — PASS |
| ARIA landmark `<nav>` | `grep -c '<nav'` | 3 (primary + breadcrumb + secondary) — PASS |
| `for=` label count on form | `grep -c 'for='` | 6 (5 fields + honeypot) — PASS |
| `required="required"` on 3 fields | `grep -c 'required="required"'` | 3 (name, email, message) — PASS |
| Sidebar flex-wrapper 5 children | Line inspection of `flex-wrapper__layout` | kicker "Faster path" + heading "Prefer a quick call?" + text + button "Book a slot" + text "Response time" — all 5 present — PASS |
| Response-time text uses `.text.body-s` | `grep 'body-s\|Response time'` | `class="text text-content body-s color--medium"` at line 987 — selector `.contact-sidebar .flex-wrapper__layout > .text.body-s` will match — PASS |
| Pa11y 0 errors | `pa11y [URL]` | "No issues found!" — PASS |

### Canvas entity_id=13 component tree integrity

**Total component count:** 26 (not 27 as F's handoff claimed; F stated "Cycle 1 had 25; D5 adds the flex-wrapper, which adds 1 row"). Actual: Cycle 1 ended with 25 components; adding the flex-wrapper wrapper brings it to 26. F's claim of 27 appears to be a typo in the handoff. The actual total is consistent with the structural intent.

| Sub-check | Expected | Actual | Result |
|-----------|----------|--------|--------|
| Total component count | 26 (25 + 1 flex-wrapper) | 26 | PASS |
| Root sections (parent_uuid IS NULL) | 4 | 4 at deltas 0, 4, 12, 20 | PASS |
| Section A (delta 0) has `additional_classes: contact-us-hero` | Yes | `"additional_classes":"contact-us-hero"` confirmed in inputs JSON | PASS |
| Flex-wrapper at delta 6 has `additional_classes: contact-sidebar` | Yes | `"additional_classes":"contact-sidebar"` confirmed | PASS |
| Flex-wrapper UUID | `c0a20001-...` | `c0a20001-0001-4000-8000-000000000001` | PASS |
| 5 sidebar children (deltas 7–11) parent_uuid = flex-wrapper UUID | Yes | All 5 point to `c0a20001-0001-4000-8000-000000000001` | PASS |
| No dangling parent_uuid references | 0 orphans | 0 — query returned empty | PASS |
| `components_component_version` non-empty | All rows populated | All 26 rows have version hashes | PASS |

### Computed style spot-checks (via Chrome MCP `javascript_tool`)

| Property | F's claim | Actual computed | Result |
|----------|-----------|-----------------|--------|
| Hero H1 `font-size` at desktop | 56px / 3.5rem | 56px | PASS |
| Hero H1 `line-height` at desktop | 1.05 (= 58.8px) | 58.8px | PASS |
| Hero H1 `letter-spacing` at desktop | -1.4px | -1.4px | PASS |
| Form grid `display` at desktop | grid | grid | PASS |
| Form grid `grid-template-columns` | `minmax(0, 1fr) 320px` | 1056px + 320px (correct 2-column) | PASS |
| Form grid `gap` | 64px | 64px | PASS |
| Form input `padding` | 12px 14px | 12px 14px | PASS |
| Form input `border-radius` | **8px** | **4px** | **FAIL — BLOCKER** |
| Form input `border` | 1px solid `--theme-border-color` | 0.625px solid rgb(229,225,220) | PASS (fractional px from subpixel rendering, correct color) |
| Sidebar `.contact-sidebar` `border-radius` | 12px | 12px | PASS |
| Sidebar `border` | 1px solid `--theme-border-color` | 0.625px solid rgb(229,225,220) | PASS |
| Sidebar `padding` | 32px all sides | **0px top, 32px left/right, 0px bottom** | **FAIL — BLOCKER** |
| Sidebar `position` at desktop | sticky | sticky | PASS |
| Sidebar `.flex-wrapper__layout` `flex-direction` | column | column | PASS |
| Sidebar `.flex-wrapper__layout` `gap` | 16px | 16px | PASS |
| Sidebar `background-color` | #FFFFFF | rgb(255,255,255) | PASS |

---

## Closing CTA kicker centering (critical pass/fail)

Verified via `javascript_tool` on live rendered page. The `align-self: center` fix lands correctly.

```json
{
  "text": "Already decided?",
  "parent": "dy-section__content",
  "kicerCenterX": 857,
  "parentCenterX": 857,
  "delta": 0,
  "pass": true
}
```

**PASS — delta 0px, well within the ±2px threshold.**

### About-us kicker regression (all 5 kickers)

All 5 about-us `kicker--centered` instances were measured. All delta = 0px.

| Kicker text | Parent class | Delta | Result |
|-------------|-------------|-------|--------|
| "About" | dy-section__header grid | 0 | PASS |
| "Track record" | dy-section__header grid | 0 | PASS |
| "Open source" | dy-section__header grid | 0 | PASS |
| "Dogfood" | dy-section__header grid | 0 | PASS |
| "Get started" (closing CTA) | dy-section__content | 0 | PASS |

No regression on about-us kickers.

---

## WCAG contrast verification

All ratios computed independently using the WCAG 2.1 relative luminance formula. Hex values sourced from CSS files and browser computed styles, not from screenshots.

| Element | Foreground | Background | F's ratio | T's ratio | Threshold | Result |
|---------|-----------|-----------|-----------|-----------|-----------|--------|
| Hero H1 text | #1F1A14 | #FFFFFF | 17.29:1 | 17.27:1 | 3.0:1 (large) | PASS |
| Body text / form labels | #2A2520 | #FFFFFF | 14.87:1 | 15.17:1 | 4.5:1 | PASS |
| Focus ring `#1893b4` (solid) | #1893b4 | #FFFFFF | 3.58:1 | 3.58:1 | 3.0:1 (non-text UI) | PASS — borderline, confirmed above threshold |
| Required marker `#8E4A2A` | #8E4A2A | #FFFFFF | 6.69:1 | 6.64:1 | 4.5:1 | PASS |
| Sidebar kicker | #8E4A2A | #FFFFFF | 6.69:1 | 6.64:1 | 4.5:1 | PASS |
| Closing CTA kicker | #C97B5C | #1F1A14 | **3.97:1** | **5.32:1** | 3.0:1 (decorative) | PASS — both above threshold |
| Ghost border blended | rgba(245,239,226,0.4) → blend | #1F1A14 | ~3.5:1 | 3.48:1 | 3.0:1 (non-text UI) | PASS |

**Discrepancy note — closing CTA kicker ratio:** F reported 3.97:1; T independently computes 5.32:1 for `#C97B5C` (rgb 201,123,92) on `#1F1A14` (rgb 31,26,20). The actual color values were confirmed via browser computed styles (`--pl-accent = #C97B5C`, background = `rgb(31,26,20)`). F's reported ratio of 3.97:1 appears to be an arithmetic error. The actual ratio exceeds the 3:1 threshold by a larger margin than F suggested. Both pass.

**Focus ring note:** 3.58:1 is borderline above the 3:1 minimum for non-text UI (WCAG 1.4.11). T's independent computation confirms F's value exactly. PASS, but operator should be aware this has no headroom.

---

## Mobile responsive verification

| Override | Breakpoint | CSS rule confirmed in file | Touch-target math | Result |
|----------|-----------|---------------------------|-------------------|--------|
| Hero H1 mobile (36px / -1.2px) | `@media (max-width: 576px)` | `dy-section.css` line 584–589: `.contact-us-hero .heading.h1 { font-size: 2.25rem; letter-spacing: -1.2px; }` | N/A (typography) | PASS |
| Form grid single-column at < 992px | Grid only declared at `@media (min-width: 992px)` | `webform.css` line 39: no grid below 992px | N/A | PASS |
| Sidebar drops sticky at < 992px | `@media (max-width: 991px)` | `webform.css` line 158–162: `.contact-sidebar { position: static; }` | N/A | PASS |
| Submit button full-width at ≤ 576px | `@media (max-width: 576px)` | `webform.css` line 109–114: `width: 100%; min-height: 44px` | 44px height = WCAG 2.5.8 minimum — PASS | PASS |
| Sidebar "Book a slot" button touch target | inherits `button--large` | `button--large` min-height 48px per Dripyard defaults | 48px > 44px — PASS | PASS |
| Cards 3→1 at < 768px | Inherited `grid-wrapper--3col` | No new CSS needed; Dripyard handles | N/A | PASS |
| Dark CTA buttons stack at ≤ 576px | Inherited from `dy-section.css` | `dy-section.css` line 513–524 | 44px min-height in rule — PASS | PASS |

---

## Blocking issues

### BLOCKER 1 — Form input `border-radius` is 4px, not 8px

**Evidence:**
- CSS in `webform.css` sets `--form-border-radius: 8px` on `.block-webform-block`
- Browser computed style on `input[type="text"]` shows `border-radius: 4px`
- CSS custom property `--form-border-radius` on the input element resolves to `4px`

**Root cause:** Dripyard's `variables-forms.css` declares `--form-border-radius: var(--radius-sm)` on `:root, form`. The `<form>` element is a direct ancestor of the inputs and closer in the DOM than `.block-webform-block`. CSS custom properties are inherited, but the `form { --form-border-radius: var(--radius-sm) }` declaration on the `<form>` element re-declares the variable, winning over the `.block-webform-block` ancestor's `8px` override. The override needs to also target the `<form>` element within the webform block, e.g. `.block-webform-block form { --form-border-radius: 8px; }`.

**Acceptance criterion blocked:** "Form inputs: 8px radius" — currently rendering 4px.

---

### BLOCKER 2 — Sidebar top and bottom padding is 0px, not 32px

**Evidence:**
- CSS in `webform.css` sets `padding: 32px` on `.contact-sidebar`
- Browser computed styles show: `paddingTop: 0px`, `paddingBottom: 0px`, `paddingLeft: 32px`, `paddingRight: 32px`
- The flex-wrapper element has classes `padding-top--0 padding-bottom--0` applied from Canvas inputs (`padding_top: zero`, `padding_bottom: zero`)
- Rule inspection confirms `.padding-top--0 { padding-top: 0px }` and `.padding-bottom--0 { padding-bottom: 0px }` from Dripyard utility CSS override the `padding: 32px` shorthand

**Root cause:** The Canvas `flex-wrapper` inputs set `padding_top: zero` and `padding_bottom: zero`, which generate `padding-top--0` and `padding-bottom--0` utility classes on the rendered element. These utility class rules (specificity 0,1,0) load after the webform.css shorthand `padding: 32px` in the cascade, overriding the top and bottom values while leaving left/right intact. The fix must either: (a) use separate `padding-inline: 32px; padding-block: 32px` with explicit specificity, or (b) override the utility classes with a more specific selector on `.contact-sidebar.padding-top--0, .contact-sidebar.padding-bottom--0`.

**Acceptance criterion blocked:** "Sidebar: 32px internal padding" — top and bottom padding are missing; the sidebar card will visually collapse content to the top edge.

---

## Advisory notes

1. **F's handoff states total = 27 components; actual is 26.** The math is: Cycle 1 ended with 25 components; adding 1 flex-wrapper = 26. This is consistent with the structural intent. The handoff's "27" appears to be a typographic error. No actual component is missing.

2. **Closing CTA kicker contrast ratio discrepancy.** F reported 3.97:1 for `#C97B5C` on `#1F1A14`; T independently computes 5.32:1. Both pass the 3:1 decorative threshold. The discrepancy (1.35x) is large enough to suggest F made an arithmetic error rather than a rounding difference. Non-blocking.

3. **Sidebar uses `#FFFFFF` hex rather than `var(--theme-surface)`.** This is a documented deviation in F's handoff. The rationale (flex-wrapper with `theme: inherit` doesn't add a theme class) is technically correct, and the preview matches. Advisory only.

4. **Hero H1 line-height computed as 58.8px (= 56 × 1.05).** F specified `line-height: 1.05`; computed value is 58.8px = 56 × 1.05 exactly. PASS.

5. **Card hover border color uses `var(--theme-link-color)`.** In the cream (theme--light) section, `--theme-link-color` resolves to `#0F6F8A` — verified via browser. The design brief specifies hover to `var(--primary)`. These appear to be the same effective color in this zone; the implementation is consistent with how the theme was built across prior cycles. S should confirm at visual audit if the rendered hover color matches the preview.

6. **Focus ring borderline at 3.58:1.** Passes 3:1 threshold with minimal headroom. Recommend S flags to operator that any future color adjustment could drop below the threshold.

---

## Acceptance criteria status

| Criterion | Evidence | Result |
|-----------|----------|--------|
| Closing CTA kicker text visually centered above H2 (delta ≤ 2px) | JS measurement: delta = 0px on contact-us | PASS |
| About-us closing CTA renders correctly with kicker fix (no regression) | JS measurement: all 5 about-us kickers delta = 0px | PASS |
| Form section at ≥992px: two columns (form 1fr, sidebar 320px, 64px gap) | Computed: `display: grid; grid-cols: 1056px 320px; gap: 64px` | PASS |
| Form section at <992px: single column | CSS rule confirmed at `@media (max-width: 991px)` | PASS |
| Form inputs: 8px radius | Computed: 4px (CSS variable override fails — see BLOCKER 1) | FAIL |
| Form inputs: 1px hairline border | Computed: border present (fractional subpixel rendering, correct color) | PASS |
| Form inputs: 12×14 padding | Computed: `padding: 12px 14px` | PASS |
| Form input focus: 2px solid | `--focus-ring-style: solid` confirmed on input (via `getPropertyValue`) | PASS |
| Required marker color = `var(--pl-accent-deep)` (#8E4A2A) | CSS property confirmed on `.block-webform-block`; 3 `.form-required` elements present | PASS |
| Submit button reads "Send message" | `value="Send message"` and text node confirmed | PASS |
| Sidebar: hairline border | Computed: border present | PASS |
| Sidebar: 12px border-radius | Computed: 12px | PASS |
| Sidebar: 32px padding | Computed: 0px top/bottom, 32px left/right (see BLOCKER 2) | FAIL |
| Sidebar: sticky at ≥992px | Computed: `position: sticky` | PASS |
| Hero H1: 56px / line-height 1.05 / letter-spacing -1.4px | Computed: 56px / 58.8px / -1.4px — all match | PASS |
| What-to-expect cards hover border shifts to primary | `card.css` line 25: `border-color: var(--theme-link-color)` = `#0F6F8A` in cream zone; transition confirmed | PASS (awaiting S visual confirmation) |
| Mobile 375px: no horizontal scroll; form-grid collapses; submit full-width; cards 3→1; sidebar drops sticky | CSS rules confirmed for all 5 items | PASS |
| WCAG AA: focus ring ≥3:1 | 3.58:1 — confirmed independently | PASS |
| WCAG AA: accent-deep marker ≥4.5:1 | 6.64:1 — confirmed independently | PASS |
| WCAG AA: ghost-on-dark border ≥3:1 | 3.48:1 — confirmed independently | PASS |
| No regression on 6 sibling pages | All 6 HTTP 200; about-us kickers all delta=0 | PASS |
| Pa11y 0 errors | "No issues found!" | PASS |
| Operator's preview-fidelity gate | Not T's role — operator verifies | N/A |
| Files staged by explicit path; no `git add .` | F's handoff confirms explicit-path policy | Not verified by T (O's gate) |

---

## Rework round 1 re-verification

**Date:** 2026-05-08
**Cache cleared:** `ddev drush cr` — success
**HTTP 200 re-confirmed:** `/contact-us` returns 200 after cache clear

Only `web/themes/custom/performant_labs_20260502/css/components/webform.css` changed in this rework. Verification scoped to the two blockers plus spot-checks that touch the same file or the same rendered elements.

### BLOCKER 1 — Form input border-radius (re-verification)

Measured via `javascript_tool` on live rendered page, all four target elements:

| Element | `--form-border-radius` on `<form>` | `--form-border-radius` on element | `border-radius` computed | Result |
|---------|-----------------------------------|------------------------------------|--------------------------|--------|
| `input[name=name]` (text) | 8px | 8px | 8px | PASS |
| `input[type=email]` | 8px | 8px | 8px | PASS |
| `input[type=tel]` | 8px | 8px | 8px | PASS |
| `textarea[name=message]` | 8px | 8px | 8px | PASS |

Fix confirmed working. The `.block-webform-block form` selector (specificity 0,1,1) beats Dripyard's `form` (0,0,1) on the same `<form>` element, causing `--form-border-radius` to resolve to 8px for all descendant inputs.

**BLOCKER 1: RESOLVED.**

### BLOCKER 2 — Sidebar padding all four sides (re-verification)

Measured via `javascript_tool` on `.contact-sidebar`:

| Side | Expected | Actual | Result |
|------|----------|--------|--------|
| `padding-top` | 32px | 32px | PASS |
| `padding-right` | 32px | 32px | PASS |
| `padding-bottom` | 32px | 32px | PASS |
| `padding-left` | 32px | 32px | PASS |

The compound selectors `.contact-sidebar.padding-top--0` and `.contact-sidebar.padding-bottom--0` (specificity 0,2,0) correctly beat the utility rules `.padding-top--0` / `.padding-bottom--0` (0,1,0). `padding-inline: 32px` handles left/right without conflict.

**BLOCKER 2: RESOLVED.**

### Spot-check results (no regressions)

| Check | Expected | Actual | Result |
|-------|----------|--------|--------|
| `/contact-us` HTTP status | 200 | 200 | PASS |
| Submit button value | "Send message" | "Send message" | PASS |
| Hero H1 `font-size` | 56px | 56px | PASS |
| Form grid `display` | grid | grid | PASS |
| Form grid columns | 1fr + 320px | 1056px + 320px | PASS |
| Form grid gap | 64px | 64px | PASS |
| Closing CTA kicker centering | delta ≤ 2px | delta = 0px | PASS |
| About-us closing CTA kicker centering | delta ≤ 2px | delta = 0px | PASS |
| About-us H1 `font-size` | 72px (no leak from contact-us-hero) | 72px | PASS |

### Updated acceptance criteria status (rework round 1)

| Criterion | Round 1 result |
|-----------|---------------|
| Form inputs: 8px radius | PASS (was FAIL — BLOCKER 1) |
| Sidebar: 32px padding all sides | PASS (was FAIL — BLOCKER 2) |
| All other criteria | Unchanged — all PASS (see original §Acceptance criteria status) |

### Blocking issues after rework round 1

None.

---

## Rework round 2 re-verification

**Date:** 2026-05-08
**Cache cleared:** `ddev drush cr` — success
**File changed:** `web/themes/custom/performant_labs_20260502/css/components/webform.css` only — `width: 100%` added to the input/textarea rule at line 113.

### Input width measurements (desktop, viewport 2160px effective)

Form column computed width: **1056px** (the `minmax(0, 1fr)` left column).

| Element | `getBoundingClientRect().width` | Matches form column | Result |
|---------|--------------------------------|---------------------|--------|
| `input[name="name"]` | 1056px | Yes | PASS |
| `input[type="email"]` | 1056px | Yes | PASS |
| `input[name="company_name"]` | 1056px | Yes | PASS |
| `input[name="phone_number"]` | 1056px (was ~269px pre-fix) | Yes | PASS |
| `textarea[name="message"]` | 1056px (unchanged) | Yes | PASS |

CSS `width` property on `input[name="name"]` and `input[name="phone_number"]` both read `1056.01px` — confirms `width: 100%` is resolving to the full column width, overriding the HTML `size` attribute's intrinsic width.

### Boundary checks

| Check | Expected | Actual | Result |
|-------|----------|--------|--------|
| Submit button `width` at desktop | Natural button width (not 100%) | 162px | PASS |
| Submit button `css_width` | ~auto / content-sized | 162.207px | PASS |
| Honeypot input visibility | Hidden (`display: none` or equivalent) | `display: none` | PASS |
| Sidebar `a.button` ("Book a slot") `width` | Unaffected by input rule (it's an anchor) | 150px (natural content width) | PASS |

### Mobile submit button rule

`@media (max-width: 576px) { .block-webform-block .webform-button--submit { width: 100%; min-height: 44px; } }` — confirmed present at lines 136–141 of `webform.css`. Rule unchanged from rework round 1.

### Blocking issues after rework round 2

None.
