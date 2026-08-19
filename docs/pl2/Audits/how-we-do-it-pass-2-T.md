# Tester Audit: how-we-do-it pass 2

**Date:** 2026-05-05
**Page:** `/how-we-do-it`
**UUID:** `a5ea22df-0106-4f9f-91a5-6a3875e26bcb`
**Site:** `https://pl-performantlabs.com.3.ddev.site:8493`
**Branch:** `main`

---

## Tier 1 results

| Check | Command | Expected | Actual | Result |
|---|---|---|---|---|
| Cache clear | `ddev drush cr` | success | Cache rebuild complete. | PASS |
| HTTP status | `curl -sk .../how-we-do-it -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |

---

## Fix A — Missing H1

**Command:**
```
curl -sk https://pl-performantlabs.com.3.ddev.site:8493/how-we-do-it | grep -c '<h1'
```
**Expected:** Exactly 1 `<h1>` containing "How a testing engagement runs".

**Finding:** The single-line grep pattern `<h1[^>]*>.*?</h1>` returned no output because the H1 element spans multiple lines in the rendered HTML. Using Python with `re.DOTALL` confirms:

```
Total h1 elements: 1
  h1 text: How a testing engagement runs
```

Rendered source excerpt:
```html
<h1 data-component-id="dripyard_base:heading"
    class="heading h1 margin-top--0 margin-bottom--s color--primary">
  How a testing engagement runs
</h1>
```

**Result: PASS** — Exactly one `<h1>` is present with the correct text.

---

## Fix B — H3 renders in Week 2

**Command:**
```
curl -sk https://pl-performantlabs.com.3.ddev.site:8493/how-we-do-it | grep -oP '<h3[^>]*>.*?</h3>'
```

**Expected:** At least one `<h3>` containing "What changes from" plus the three card titles.

**Actual output:**
```
<h3>What changes from "we monitor your site"</h3>
<h3 class="card__title">Hand back, green.</h3>
<h3 class="card__title">Take over, ongoing.</h3>
<h3 class="card__title">Embed, instead.</h3>
<h3 class="footer-column__heading">Company</h3>
```

**Result: PASS** — All four required `<h3>` elements render correctly. The H3 tag is no longer stripped from the Week 2 body text. (The fifth `<h3>` is the footer "Company" heading, which is structural and expected.)

---

## Fix C — CTA button visible

**Sub-check C1: CSS rule present in served stylesheet**

CSS file: `/themes/custom/performant_labs_20260502/css/components/button.css`

Rule found:
```css
.theme--primary .button--primary:where(:not([disabled])) {
  --button-background-color: #FFFFFF;
  --button-background-color-hover: #F5EFE2;
  --button-background-color-active: #F5EFE2;
  --button-text-color: #1F1A14;
  --button-text-color-hover: #1F1A14;
  --button-text-color-active: #1F1A14;
}
```

Both required tokens confirmed:
- `--button-text-color: #1F1A14` — PRESENT
- `--button-background-color: #FFFFFF` — PRESENT

**Sub-check C2: Button link exists with correct href**

Found in rendered HTML:
```html
<a data-component-id="dripyard_base:button"
   class="button button--primary button--large"
   href="/contact-us?intent=testing-review" target="">
  Book a testing review
</a>
```

The CTA button link points to `/contact-us?intent=testing-review`.

**Sub-check C3: theme--primary zone is present on the page**

```html
<div data-component-id="dripyard_base:section"
     class="dy-section theme--primary container ...">
```

The `.theme--primary` zone div is present, so the CSS rule will be in scope for the CTA button.

**Result: PASS** — CSS rule present with both required token values; button link confirmed at `/contact-us?intent=testing-review`.

---

## Heading hierarchy check

**Full heading sequence extracted (Python re.DOTALL, ordered as they appear in DOM):**

| Position | Tag | Text |
|---|---|---|
| 1 | h2 | Main navigation *(visually-hidden, structural)* |
| 2 | h2 | Breadcrumb *(visually-hidden, structural)* |
| 3 | h1 | How a testing engagement runs |
| 4 | h2 | Week 1 — Audit. |
| 5 | h2 | Week 2 — Stand up the dogfood loop. |
| 6 | h3 | What changes from "we monitor your site" |
| 7 | h2 | Week 3+ — Take over or hand back. |
| 8 | h3 | Hand back, green. |
| 9 | h3 | Take over, ongoing. |
| 10 | h3 | Embed, instead. |
| 11 | h2 | What we don't do. |
| 12 | h2 | Want a one-page audit of your testing surface? |
| 13 | h2 | Footer *(visually-hidden, structural)* |
| 14 | h3 | Services *(footer column)* |
| 15 | h3 | Resources *(footer column)* |
| 16 | h3 | Company *(footer column)* |

**Levels in DOM order:** `[2, 2, 1, 2, 2, 3, 2, 3, 3, 3, 2, 2, 2, 3, 3, 3]`

**Skip detection result:** No skipped levels. (The two leading h2s before the h1 are visually-hidden structural/nav headings — a Dripyard scaffold pattern present across all pages. The h1 is the first visible content heading.)

**Checks:**
- Exactly 1 `<h1>`: PASS (1 found)
- Multiple `<h2>` (Week 1, Week 2, Week 3+, What we don't do, CTA): PASS (5 content h2s + 3 structural/visually-hidden)
- Multiple `<h3>` (What changes from, Hand back, Take over, Embed): PASS (all 4 present)
- No skipped levels: PASS

---

## ARIA landmarks

| Landmark | Element | Result |
|---|---|---|
| `<header>` | `<header class="theme--white site-header">` | PASS |
| `<nav>` | Multiple `<nav>` with `aria-labelledby` | PASS |
| `<main>` | `<main class="site-main">` | PASS |
| `<footer>` | `<footer class="site-footer theme--white">` | PASS |

---

## Summary: all fixes verified

| Fix | Description | Result |
|---|---|---|
| Fix A | Single `<h1>` with text "How a testing engagement runs" | PASS |
| Fix B | `<h3>` renders in Week 2 body ("What changes from...") | PASS |
| Fix C | `.theme--primary .button--primary` CSS rule with `#1F1A14` text + `#FFFFFF` bg | PASS |
| Fix C | CTA button href = `/contact-us?intent=testing-review` | PASS |
| Hierarchy | No skipped heading levels, single h1 | PASS |

**Blocking issues:** None.
