# Step-3 Trace: Cycle 2 Contact-Us CSS Punch List

**Date:** 2026-05-08
**Branch:** `aa/pl-contact-us`
**Cycle:** 2 of 2

Five decisions surface before any code is written. Each follows the 7-step CSS workflow two-pass trace (bottom-up origin, then top-down eligibility).

---

## Decision 1 — Kicker SDC centering fix  **APPROVED**

### Problem

The closing CTA kicker ("ALREADY DECIDED?") renders left-aligned inside the full-width `dy-section__content` div. The same bug appears on `/about-us` ("GET STARTED").

### Bottom-up trace (Pass 1)

```
Element:    <span class="kicker kicker--centered kicker--dark">Already decided?</span>
Location:   .dy-section.theme--dark .dy-section__content (line 1084 of rendered HTML)
CSS source: kicker.css (custom theme SDC), line 9:
              .kicker { display: inline-flex; ... }
Parent:     .dy-section__content — Dripyard renders this as a flex column
            (display: flex; flex-direction: column; from section component CSS).
            The :has(> .button + .button) rule in dy-section.css also applies,
            reinforcing flex layout. The cross-axis of a flex column is horizontal.
            The kicker as a flex item defaults to align-self: auto (inherits
            align-items from parent, which is stretch), making it full-width.
            Its text sits at flex-start (left).

Kickers in dy-section__header (hero, what-to-expect) DO center because
dy-section.css applies text-align: center on centered-kicker sections AND
the header uses display: block (overridden via dy-section.css line 78).
In that context, inline-flex + text-align: center = visually centered.

Kickers in dy-section__content (closing CTA) do NOT center because the
content area uses display: flex (the Dripyard section default), which
ignores text-align. The kicker becomes a flex item at full width, and
justify-content defaults to flex-start.
```

### Top-down eligibility (Pass 2)

```
L1: Not config-driven. RULED OUT.
L2: Not OKLCH-derived. RULED OUT.
L3: Not a --theme-* token. RULED OUT.
L5: Component-scoped CSS on the kicker SDC. CORRECT LAYER.
```

### Fix

**File:** `web/themes/custom/performant_labs_20260502/components/kicker/kicker.css`

```css
.kicker--centered {
  align-self: center;
}
```

The cross-axis of the flex column parent is horizontal. `align-self: center`
makes the kicker content-width and horizontally centered. In block-level
parents (dy-section__header), `align-self` is a no-op -- no regression.

### Regression check

- Hero kicker ("Get in touch"): `dy-section__header` with `display: block`. `align-self` no-op. **No regression.**
- "After you send" cream kicker: same header context. **No regression.**
- `/about-us` closing CTA kicker ("Get started"): same `dy-section__content` flex column. **Same fix applies -- benefit.**
- Inline kickers ("Faster path"): `kicker--inline`, not `kicker--centered`. **Not affected.**
- Homepage, services, how-we-do-it, open-source-projects: closing CTAs use `title-cta` SDC. **Not affected.**

---

## Decision 2 — Form-grid wrapper strategy  **REVISED per operator feedback**

### Problem

Section B's `dy-section__content` renders the webform block + 5 sidebar children as siblings in a single flex column. Preview requires two columns at >= 992px.

### Original proposal: CSS-only sibling targeting (option b) -- **REJECTED by operator.**

Operator directive: now that D5 (c) is approved (Canvas wrapper for sidebar), the form grid becomes trivial. Two children in `dy-section__content`: the webform block and the `.contact-sidebar` wrapper. CSS Grid with two columns, auto-placed by source order. No `:has()` + `~` fragility.

### Revised approach: CSS Grid on two wrapper children

After D5's Canvas patch runs, the DOM will be:

```
.dy-section__content
  |-- .block.block-webform.block-webform-block  (column 1)
  |-- .flex-wrapper.contact-sidebar             (column 2)
```

**File:** `web/themes/custom/performant_labs_20260502/css/components/webform.css` (new, L5)

```css
/* Two-column form grid at >= 992px.
 * Two children: webform block (col 1) + .contact-sidebar wrapper (col 2).
 * Auto-placed by source order -- no explicit grid-column assignments needed. */
@media (min-width: 992px) {
  .dy-section__content:has(.block-webform-block) {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 64px;
    align-items: start;
  }
}
```

At < 992px: no grid declaration, children stack in default flex column. Single-column fallback.

### Bottom-up trace

```
Property:    layout of .dy-section__content containing a webform block
Current:     flex column (Dripyard section default)
Target:      CSS Grid, two columns at >= 992px
```

### Top-down eligibility

```
L1: Not config. RULED OUT.
L2: Not OKLCH. RULED OUT.
L3: Not a --theme-* token. RULED OUT.
L5: Component-scoped layout override on section content. CORRECT LAYER.
```

### DOM inspection evidence (Pass 2 gate)

```
[x] Tier 1: .block-webform-block at line 624 in rendered HTML
[x] Tier 1: sidebar children at lines 975-991 (will be wrapped by D5 patch)
[x] Tier 1: parent is .dy-section__content inside .dy-section.theme--white
[x] N/A -- no JS rendering involved
```

---

## Decision 3 — Form-input stylesheet location  **APPROVED**

### Investigation

Dripyard ships form styling across several files:
- `dripyard_base/css/components/form.css` -- form-item layout, label styling, required marker (SVG mask star with `background-color: currentColor`)
- `dripyard_base/css/components/form-text.css` -- input/textarea styling with CSS variables
- `dripyard_base/css/_variables/variables-forms.css` -- `--form-border-radius: var(--radius-sm)` (= 4px), `--form-border: 1px solid var(--theme-border-color)`, `--form-height: var(--sp6)` (48px)
- `dripyard_base/css/_variables/variables-misc.css` -- `--focus-ring-style: dotted`

No Dripyard webform-specific stylesheet exists. No `dripyard_base/components/webform/` directory.

### What needs overriding

| Property | Dripyard default | Preview spec | Fix |
|----------|-----------------|-------------|-----|
| `--form-border-radius` | `var(--radius-sm)` = 4px | 8px (`--radius-md`) | Override at L5 |
| `--focus-ring-style` | `dotted` | `solid` | Override at L5 |
| Required marker color | `currentColor` via `background-color` on SVG mask | `--accent-deep` (#8E4A2A) | Override at L5 |
| Input padding | `0 var(--form-padding-inline)` + centering via min-height | `12px 14px` explicit | Override at L5 |
| Textarea padding | `var(--spacing-xxs)` (~8px) | `12px 14px` | Override at L5 |

### Decision

**File:** `web/themes/custom/performant_labs_20260502/css/components/webform.css` (new, L5)

Per operator's approved D3 directive: place it at `web/themes/custom/performant_labs_20260502/css/components/webform.css`. This single file handles form-grid layout (D2) and form-input chrome (D3). Loaded via `libraries-extend` on `core/components.dripyard_base--section` (section library loads for every section; CSS selectors are scoped to `.block-webform-block` and form classes so non-webform sections are unaffected).

### Bottom-up trace for each override

**Border radius:**
```
Property:    border-radius on input[type="text"], textarea, etc.
Current:     var(--form-border-radius) -> var(--radius-sm) -> 4px
Declared by: form-text.css (dripyard_base), line 31
Trace:       form-text.css -> variables-forms.css -> variables-misc.css
Fix:         Override --form-border-radius to 8px scoped to webform context
```

**Focus ring style:**
```
Property:    outline on input:focus
Current:     var(--focus-ring-style) 2px var(--theme-focus-ring-color)
             --focus-ring-style = dotted (variables-misc.css)
             --theme-focus-ring-color = #1893b4 (base.css, theme--white)
Declared by: form-text.css line 39
Fix:         Override --focus-ring-style to solid scoped to webform context
```

**Required marker:**
```
Property:    background-color on .form-required::after pseudo-element
Current:     currentColor (inherits label text color)
Declared by: form.css lines 61-76 (SVG mask-image star, background-color: currentColor)
Fix:         Override color on .form-required::after to var(--pl-accent-deep)
```

### Top-down eligibility (all overrides)

```
L1: Not config. RULED OUT.
L2: Not OKLCH. RULED OUT.
L3: --form-border-radius and --focus-ring-style are not --theme-* tokens.
    Overriding at L3 would change every form on the site (login, admin, etc.).
    TOO BROAD. RULED OUT.
L5: Scoped to webform context via .block-webform-block ancestor. CORRECT LAYER.
```

---

## Decision 4 — Hero H1 typography scope  **REVISED per operator feedback**

### Problem

Contact-us hero H1 currently renders at 72px. Preview spec: 56px / line-height 1.05 / letter-spacing -1.4px.

### Operator correction

The original trace proposed `.dy-section--section-max-width .heading.h1`, which would also hit `/about-us`. But the two previews specify **different** H1 sizes:
- `contact-us.html`: H1 at **56px**, letter-spacing -1.4px
- `about-us.html`: H1 at **64px**, letter-spacing -1.6px

A shared selector would regress about-us. Need a contact-us-specific scope.

### Body class investigation

```
curl /contact-us: <body class="canvas-page site-header-sticky site-header-no-full-width path-page">
curl /about-us:   <body class="canvas-page site-header-sticky site-header-no-full-width path-page">
```

Both emit identical body classes (`path-page`). Drupal does not emit a page-specific body class for Canvas pages. The body-class approach is not viable.

### Decision: Canvas `additional_classes` on Section A

Since the D5 Canvas patch script is already being written (approved), adding `additional_classes: contact-us-hero` to Section A's `dripyard_base:section` inputs is a minimal additional Canvas change. This produces:

```html
<div class="dy-section contact-us-hero theme--white container dy-section--section-max-width ...">
```

The selector `.contact-us-hero .heading.h1` uniquely targets the contact-us hero H1.

### Bottom-up trace

```
Property:    font-size on h1.heading.h1 inside Section A
Current:     var(--h1-size) -> 4.5rem (72px) at >600px viewport (neonbyte)
Declared by: .h1 { font-size: var(--h1-size) } in typography-utilities.css
             h1 { font-size: var(--h1-size) } in base.css (dripyard_base)
             --h1-size chain: neonbyte variables-typography.css
```

### Top-down eligibility

```
L1: Not config. RULED OUT.
L2: Not OKLCH. RULED OUT.
L3: Setting --h1-size at html .theme--white would affect every H1 in white
    zones site-wide (homepage hero, services hero, etc.). TOO BROAD. RULED OUT.
L5: Component-scoped to .contact-us-hero .heading.h1. CORRECT LAYER.
```

### Proposed CSS

**File:** `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` (existing, L5)

```css
/* Contact-us hero H1: display-lg 56px / -1.4px / 1.05 line-height.
 * Scoped via additional_classes: contact-us-hero on Section A Canvas.
 * Does NOT affect /about-us (64px) or other pages (72px). */
.contact-us-hero .heading.h1 {
  font-size: 3.5rem;            /* 56px = display-lg per contact-us preview */
  letter-spacing: -1.4px;
  line-height: 1.05;
  text-wrap: balance;
}
```

**Mobile:** At <= 576px, base.css sets `--h1-size: 2.25rem` (36px). The design brief `typography-mobile` block specifies `display-lg` mobile = 36px / -1.2px. These match. However, the `.h1` utility class selector (specificity 0,1,0) consumes `--h1-size`, and our selector `.contact-us-hero .heading.h1` (specificity 0,2,1) will still win with the desktop 56px value. We need an explicit mobile override:

```css
@media (max-width: 576px) {
  .contact-us-hero .heading.h1 {
    font-size: 2.25rem;         /* 36px = display-lg mobile */
    letter-spacing: -1.2px;
  }
}
```

**Side effects:** None. `/about-us` H1 stays at 72px (no `.contact-us-hero` class).

### WCAG

Headline #1F1A14 on #FFFFFF: 17.29:1 (AAA). Font-size change does not affect contrast. At 56px / weight 500, the H1 qualifies as large text (>= 18pt). Threshold 3.0:1 -- exceeds by 5.7x.

---

## Decision 5 — Sidebar wrapper component  **APPROVED (option c)**

### Operator directive

Approved: Canvas wrapper for the 5 sidebar children. Pick the cleanest neutral Dripyard container component.

### Component investigation

Candidates from `dripyard_base` component schemas:

| Component | Rendered HTML | `additional_classes` prop? | Notes |
|-----------|--------------|--------------------------|-------|
| `dripyard_base:section` | `<div class="dy-section ...">` with 3-level nesting (container + header + content) | Yes | Heavy -- creates header/content grid structure. Inheriting `theme` could conflict with parent section. |
| `dripyard_base:flex-wrapper` | `<div class="flex-wrapper ...">` with 2-level nesting (container + layout) | Yes | Lighter. Flexbox layout with configurable direction/alignment. |
| `dripyard_base:grid-cell` | `<div class="grid-cell ...">` (flat) | Yes | Designed as a grid child. Has `padding` prop and `additional_classes`. Lightest wrapper. |

**Chosen: `dripyard_base:flex-wrapper`**

Rationale:
- `grid-cell` is designed to live inside a `grid-wrapper`, not standalone. Using it outside a grid parent would be semantically misleading and its CSS depends on being a grid child.
- `section` is too heavy -- it creates header/content sub-containers and could interfere with parent section's CSS selectors.
- `flex-wrapper` is a neutral layout container. With `theme: inherit`, it does NOT add a theme class or set `background: var(--theme-surface)` (the `[class*="theme"]` check fails). With all spacing zero and no gutters, it is effectively a transparent wrapper div.

### Schema verification (from `.component.yml`)

```yaml
# flex-wrapper.component.yml
props:
  properties:
    theme:          # enum: inherit/white/light/dark/black/primary/secondary
    additional_classes:  # type: string -- "Additional CSS classes..."
    wrap:           # boolean
    align_x:        # enum: start/center/end/space-between/space-around
    align_y:        # enum: top/center/bottom/stretch
    margin_top:     # enum: zero/small/medium/large
    margin_bottom:  # enum: zero/small/medium/large
    padding_top:    # enum: zero/small/medium/large
    padding_bottom: # enum: zero/small/medium/large
    column_gutter:  # enum: zero/small/medium/large
    row_gutter:     # enum: zero/small/medium/large
slots:
  content:          # the only slot
```

`additional_classes` exists and gets concatenated directly into the outer div's class list (confirmed from Twig template line: `additional_classes` in the `classes` array).

### Rendered HTML after patch

```html
<div class="flex-wrapper contact-sidebar margin-top--0 margin-bottom--0
            padding-top--0 padding-bottom--0
            flex-wrapper__align-x-start flex-wrapper__align-y-top">
  <div class="flex-wrapper__container">
    <div class="flex-wrapper__layout gutter-column--0 gutter-row--0">
      <!-- kicker, heading, text, button, text -->
    </div>
  </div>
</div>
```

The `.contact-sidebar` class is what we target for border, radius, padding, and sticky positioning. The flex-wrapper's own CSS is inert: `theme: inherit` means no `[class*="theme"]` match, so no background is set. Zero spacing means no margins/padding from layout utilities.

### Canvas assembly inputs

```php
$add($sidebar_wrapper_uuid, 'sdc.dripyard_base.flex-wrapper', $form_section_uuid, 'content', [
  'theme' => 'inherit',
  'additional_classes' => 'contact-sidebar',
  'wrap' => TRUE,
  'align_x' => 'start',
  'align_y' => 'top',
  'margin_top' => 'zero',
  'margin_bottom' => 'zero',
  'padding_top' => 'zero',
  'padding_bottom' => 'zero',
  'column_gutter' => 'zero',
  'row_gutter' => 'zero',
]);
```

`component_version: NULL` per R14. The 5 sidebar children move from `parent_uuid: $form_section_uuid` to `parent_uuid: $sidebar_wrapper_uuid`, slot `content`.

### Proposed CSS for sidebar styling

**File:** `web/themes/custom/performant_labs_20260502/css/components/webform.css` (same file as D2/D3)

```css
/* Sidebar card-like wrapper */
.contact-sidebar {
  border: 1px solid var(--theme-border-color);
  border-radius: 12px;           /* --radius-lg */
  padding: 32px;                 /* --space-xl */
  background: var(--theme-surface);
}

@media (min-width: 992px) {
  .contact-sidebar {
    position: sticky;
    top: 48px;                   /* --space-2xl, clears sticky header */
  }
}

/* Reset flex-wrapper internal nesting to a simple column */
.contact-sidebar .flex-wrapper__layout {
  flex-direction: column;
  gap: 16px;                     /* --space-base */
}
```

---

## Summary of all decisions (final state)

| # | Decision | Approach | File(s) | Canvas change? |
|---|----------|----------|---------|---------------|
| 1 | Kicker centering | `align-self: center` on `.kicker--centered` | `components/kicker/kicker.css` | No |
| 2 | Form-grid layout | CSS Grid on 2 children (webform block + sidebar wrapper) at >= 992px | `css/components/webform.css` (new) | No (depends on D5 wrapper) |
| 3 | Form-input chrome | Override `--form-border-radius`, `--focus-ring-style`, padding, required-marker color | `css/components/webform.css` (new) | No |
| 4 | Hero H1 56px | `.contact-us-hero .heading.h1` scoped via Canvas `additional_classes` | `css/components/dy-section.css` (existing) | Yes (add `additional_classes: contact-us-hero` to Section A) |
| 5 | Sidebar wrapper | `dripyard_base:flex-wrapper` with `additional_classes: contact-sidebar` | Canvas patch script + `css/components/webform.css` | Yes (wrap 5 children, add wrapper) |

**Canvas patch script needed:** one script that:
1. Adds `additional_classes: contact-us-hero` to Section A hero
2. Inserts a `flex-wrapper` wrapper component in Section B content
3. Re-parents the 5 sidebar children under the new wrapper
4. Sets `component_version: NULL` on all touched rows (R14)
