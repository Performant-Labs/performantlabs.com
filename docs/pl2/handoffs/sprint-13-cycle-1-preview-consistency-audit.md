# Sprint 13 — Cycle 1: Preview Consistency Audit (Spec Auditor)

**Verdict (one line):** REWORK across all 8 targets; the dominant fix is a **canonical-header restore** (drop `site-header__cta`, add hamburger toggle + media-query, normalize brand `href`) — but the **two baselines themselves disagree**, so an operator decision is required before F begins. Proposed carve: **4 F cycles**.

**Audit scope:** structural / chrome / token consistency between the 8 non-baseline previews and the baseline pair (`homepage.html` + `services.html`), with brief tokens as override authority. No render. Pure static read.

**Date:** 2026-05-12
**Reviewer:** S (Spec Auditor)
**Files compared:** 10 (`docs/pl2/Previews/*.html`)
**Authority precedence:** `docs/pl2/briefs/pl_design_brief.md` > baselines > targets

---

## 0. Headline findings (read first)

### 0.1 Baseline-internal inconsistencies (must resolve before F can start)

The two baselines disagree with each other on **chrome**, and one of them disagrees with the **brief**:

| Element | `homepage.html` | `services.html` | Brief (`pl_design_brief.md` §H "Header") | Memory `design_header_nav_breakpoint` |
|---|---|---|---|---|
| Right-side CTA pill (`.site-header__cta`) | **absent** | "Call today" pill present | "There is **no right-side CTA pill** in the canonical preview … do not add one back without updating this brief." (§H, lines 498–499) | "canonical header has no right-side CTA pill" |
| Hamburger button (`.site-header__hamburger`) | present (CSS + markup, 44×44, `aria-expanded`) | **absent** (CSS hides nav at <992 but no toggle button) | "Below `lg` (< 992 px) … primary nav hides, hamburger button appears in its place. The hamburger is a 44×44 px touch target with `aria-label='Open menu'` and `aria-expanded` state" (§H, line 501) | "hamburger at <992, full inline at ≥992: navbar-expand-lg pattern" |
| Active-state nav (`.is-current`) | not implemented (no CSS, no markup) | implemented (CSS + per-page tagging) | not specified | not specified |
| Breadcrumb | not present | present | not specified at element level (Drupal renders `block-system-breadcrumb-block`) | not specified |
| Brand `href` | `"#"` | `"/"` | (real paths expected on shipped site) | not specified |
| Internal links (footer / nav / signature) | `href="#"` (22 instances) | real paths (`/services#...`, `/contact`) | not specified | not specified |
| Skip-to-main link | **absent** | **absent** | not enumerated in this brief, but a WCAG 2.4.1 requirement | not specified |
| `<main>` landmark | **absent** | **absent** | not enumerated (Drupal `<main role="main">` is part of base theme) | not specified |
| Focus-ring spec in `<style>` | not declared | not declared | "focus rings on form inputs use a `2px` outline in `{colors.primary}` with 2px offset" (line 345); body focus rings not specified per-element here | memory says "3px dotted #1893B4" — flagging this discrepancy between brief (2px outline) and prior memory feedback (3px dotted) |

**Severity:** HIGH. Operator must decide which baseline F should align to. The brief sides with **homepage.html** on CTA pill (no pill) and **with both + memory** on hamburger requirement. The recommended canonical chrome is therefore: homepage's no-CTA header + homepage's hamburger toggle + services's `is-current` and breadcrumb conventions + real-path hrefs (services pattern).

### 0.2 The 8 targets all inherit `services.html`'s broken chrome

All 8 targets have:
- `.site-header__cta` pill ("Call today" 6× / "Book a testing review" 3×) — **violates brief**
- No hamburger button (CSS + markup) — **violates brief and memory**
- `.is-current` active-state styling
- Breadcrumb block
- Real-path hrefs

This means all 8 targets must be reworked to match the canonical (brief-compliant) header pattern, irrespective of their unique body content.

### 0.3 Other cross-cutting drift

| Item | Variants observed | Severity |
|---|---|---|
| Footer copyright `<span>©…</span>` | Present in homepage/services/about-us/contact-us; **absent** in articles.html, how-we-do-it.html, open-source-projects.html, automated-testing-kit.html, automated-testing-kit-introduction.html, article-introducing-layout-builder-kit-beta-1.html | MED |
| Footer "Preview build" legal text | 4 distinct strings (see §0.3 table below) | LOW |
| Footer signature `<a href>` target | `#` (homepage), `/contact` (services + 5 others), `/contact-us` (3 others) | MED |
| Footer signature arrow encoding | `→` (UTF-8) vs `&rarr;` (entity) | LOW |
| Service-name label | "Test-suite takeover" (services + ATK files) vs "Testing-suite takeover" (homepage + about-us + contact-us) | MED |
| Contact URL convention | `/contact` (6 uses) vs `/contact-us` (5 uses) | MED |
| Header CTA label (when present) | "Call today" (services + 5 targets) vs "Book a testing review" (3 targets) | MED — but resolved by removing the CTA entirely per §0.1 |
| `<html lang>` | `"en"` on all 10 — consistent | — |
| Font stack import | identical across all 10 (Rubik 300/400/500/600 + Poppins 400/500/600/800) | — |
| `:root` token block | identical token values across all 10 | — |
| `text-wrap: balance` | declared in all 10 (per memory `feedback_no_orphan_words`) | — |

Distinct "Preview build" legal text strings (LOW):

1. `Preview build — not yet implemented in Drupal` (UTF-8 em-dash)
2. `Preview build &mdash; not yet implemented in Drupal` (HTML-entity em-dash) — ATK + ATK-intro
3. `Preview build — reflects /about-us as of corrected rebuild 2026-05-07` — about-us
4. `Preview build — /contact-us first draft 2026-05-08` — contact-us

---

## 1. Per-target deltas

For each target the delta categories are: **Document chrome / Header / Footer / Tokens / Sections / A11y / Other**. Severity tags: **HIGH** = brief or memory violation, **MED** = inconsistent with baseline pair but brief-silent, **LOW** = cosmetic or string encoding.

### 1.1 `about-us.html` (651 lines)

**Document chrome**
- Title pattern matches services baseline: `Performant Labs — about us preview (teal + terracotta)` — MATCH.
- `<html lang="en">` — MATCH.
- CSS includes + font imports — MATCH.

**Header (HIGH on the structural set)**
- HAS `site-header__cta` "Book a testing review" pill (line 488). **HIGH** — violates brief §H.
- NO hamburger button markup or CSS. **HIGH** — violates brief §H & memory.
- HAS `is-current` on `/about-us` — MATCH services pattern (MED, brief-silent).
- HAS breadcrumb block — MATCH services pattern (MED, brief-silent).
- Brand `href="/"` — MATCH services (MED).

**Footer**
- Has `<span>© Performant Labs</span>` — MATCH services.
- Legal text: `Preview build — reflects /about-us as of corrected rebuild 2026-05-07` — **LOW** (drift from canonical "not yet implemented in Drupal"; informational comment about the rebuild date).
- Signature link `href="/contact-us"` with `&rarr;` — **MED** (services uses `/contact` with `→`).
- Service labels in footer use "Testing-suite takeover" — **MED** (services uses "Test-suite takeover").

**Tokens**
- `:root` block matches; `text-wrap: balance` present — MATCH.

**Sections / page-body**
- Carries unique `bio-block` pattern used in Sprint 12 — preserved; not in scope for this audit.

**A11y**
- No `<main>` landmark — **MED** (consistent with all targets; not blocking).
- No skip-link — **MED** (consistent with all targets).

**Estimated edit volume:** ~25 lines changed (remove CTA `<a>`, add hamburger button markup + CSS block + media query update, normalize footer legal/signature, swap "Testing-suite takeover" → "Test-suite takeover").

---

### 1.2 `articles.html` (629 lines)

**Header**
- HAS `site-header__cta` "Call today" pill — **HIGH**.
- NO hamburger — **HIGH**.
- `is-current` on `/articles` — MED MATCH services.
- Breadcrumb present — MED MATCH services.

**Footer**
- **NO** `<span>© Performant Labs</span>` — **MED** drift from baselines.
- Legal text: `Preview build — not yet implemented in Drupal` — MATCH canonical.
- Signature `href="/contact"` with `→` — MATCH services.
- Service labels use "Test-suite takeover" — MATCH services.

**Sections**
- Has pagination `.is-current` semantics (line 577: `<li><span class="is-current" aria-current="page">1</span></li>`) — correct ARIA usage, not a delta.
- `articles-toolbar` with `role="group" aria-label="Filter articles by category"` — page-body, not chrome; not in scope.

**A11y**
- No `<main>` landmark.
- No skip-link.

**Estimated edit volume:** ~20 lines changed (CTA removal, hamburger addition, footer copyright span restore).

---

### 1.3 `contact-us.html` (721 lines)

**Header**
- HAS `site-header__cta` "Book a testing review" pill — **HIGH**.
- NO hamburger — **HIGH**.
- `is-current` on `/contact-us` — MED MATCH.
- Breadcrumb present — MED MATCH.

**Footer**
- Has `<span>© Performant Labs</span>` — MATCH services.
- Legal text: `Preview build — /contact-us first draft 2026-05-08` — **LOW** drift.
- Signature link target / arrow — same family as services; verify in F cycle.

**A11y**
- No `<main>`, no skip-link.

**Estimated edit volume:** ~25 lines changed (CTA removal, hamburger addition, footer legal normalization).

---

### 1.4 `how-we-do-it.html` (619 lines)

**Header**
- HAS `site-header__cta` "Book a testing review" pill — **HIGH**.
- NO hamburger — **HIGH**.
- `is-current` on `/how-we-do-it` — MED MATCH.
- Breadcrumb present — MED MATCH.

**Footer**
- **NO** `<span>© Performant Labs</span>` — **MED** drift.
- Legal text matches canonical.
- Signature `href="/contact"` — MATCH services.

**Sections**
- Body section uses bespoke step diagram — not in scope.

**A11y**
- No `<main>`, no skip-link.

**Estimated edit volume:** ~20 lines changed (CTA removal, hamburger addition, copyright span restore).

---

### 1.5 `open-source-projects.html` (673 lines)

**Header**
- HAS `site-header__cta` "Call today" pill — **HIGH**.
- NO hamburger — **HIGH**.
- `is-current` on `/open-source-projects` — MED MATCH.
- Breadcrumb present — MED MATCH.

**Footer**
- **NO** `<span>© Performant Labs</span>` — **MED** drift.
- Legal text matches canonical.

**A11y**
- No `<main>`, no skip-link.

**Estimated edit volume:** ~20 lines changed.

---

### 1.6 `automated-testing-kit.html` (888 lines, ATK book root)

**Document chrome**
- **Title pattern differs**: `Automated Testing Kit — Performant Labs` vs baseline `Performant Labs — X preview (teal + terracotta)`. **MED** — this is the live-shipping title shape (this file is the production-target preview), so probably correct for the live page but inconsistent with the preview-suite convention. Operator decision: keep live shape or unify to preview shape?
- Has long HTML comment block (lines 3–39) documenting Drupal renderers — appropriate for this file, not a delta.
- `<html lang="en">` MATCH.

**Header**
- HAS `site-header__cta` "Call today" — **HIGH**.
- NO hamburger — **HIGH**.
- `is-current` set on `/open-source-projects` (because this file is reachable from the OSS section) — MED MATCH services.
- Breadcrumb present.

**Footer**
- **NO** copyright span — **MED**.
- Legal text uses `&mdash;` entity — **LOW**.

**A11y**
- No `<main>`, no skip-link.

**Estimated edit volume:** ~25 lines changed (CTA removal, hamburger add, copyright span restore, em-dash normalization).

---

### 1.7 `automated-testing-kit-introduction.html` (842 lines)

**Document chrome**
- Title: `Introduction — Automated Testing Kit — Performant Labs` (uses `&mdash;`) — **MED** drift from preview-suite convention; same operator question as 1.6.
- HTML comment block at top (lines 1–46) — appropriate.

**Header**
- HAS `site-header__cta` "Call today" — **HIGH**.
- NO hamburger — **HIGH**.
- `is-current` on `/open-source-projects` — MED MATCH.

**Footer**
- **NO** copyright span — **MED**.
- Legal text uses `&mdash;` — **LOW**.

**A11y**
- Has `<nav class="book-pager" aria-label="Book traversal links for Automated Testing Kit">` — proper landmark for book pager; not a delta.
- No `<main>`, no skip-link.

**Estimated edit volume:** ~25 lines changed.

---

### 1.8 `article-introducing-layout-builder-kit-beta-1.html` (667 lines)

**Document chrome**
- Title: `Introducing Layout Builder Kit Beta 1 — Performant Labs` — **MED** drift from preview-suite convention (same operator question as 1.6/1.7).
- HTML comment block at top — appropriate.

**Header**
- HAS `site-header__cta` "Call today" — **HIGH**.
- NO hamburger — **HIGH**.
- `is-current` on `/articles` — MED MATCH.

**Footer**
- **NO** copyright span — **MED**.
- Legal text matches canonical.

**A11y**
- No `<main>`, no skip-link.

**Estimated edit volume:** ~20 lines changed.

---

## 2. Baseline-internal inconsistencies (recap; see §0.1 for the full table)

These are issues with the **baseline pair** itself. They must be resolved before F starts, or F will rewrite to a moving target.

1. **Header CTA pill** — HIGH. Brief says no pill; services has a pill; homepage does not. **Resolution: remove pill in services and all 8 targets.**
2. **Hamburger toggle** — HIGH. Brief says hamburger required at <992; homepage has it; services does not. **Resolution: add hamburger toggle + CSS + media query to services and all 8 targets.**
3. **Brand `href`** — homepage uses `"#"`; all others use `"/"`. **Resolution: standardize on `"/"`.**
4. **Internal links** — homepage uses `href="#"` everywhere (22 occurrences); all others use real paths. **Resolution: standardize on real paths.** (May be out of scope for chrome-only rework; flag for operator.)
5. **`/contact` vs `/contact-us`** — split across files. **Resolution: pick one and apply globally.**
6. **"Test-suite takeover" vs "Testing-suite takeover"** — split across files. **Resolution: pick one and apply globally.**
7. **Copyright span presence** — 4 files have it, 6 do not. **Resolution: add to all.**
8. **`&mdash;` vs `—`** — split between ATK files and the rest. **Resolution: pick UTF-8 `—` and apply globally.**
9. **Focus-ring spec** — brief says 2px outline; memory says 3px dotted. **Resolution: operator clarifies which is canonical; no preview currently declares either spec.**
10. **Skip-link + `<main>` landmark** — absent in all 10. **Resolution: add to all (already on a11y debt audit punchlist from cycle-1-a11y-debt-audit-S.md, possibly already addressed).**

---

## 3. Proposed cycle carve

The 8 targets share **one** dominant delta (the chrome restore). Grouping by edit-volume similarity:

| F cycle | Targets | Theme | Estimated total lines |
|---|---|---|---|
| **F-1** | `services.html` (baseline fix) | Restore canonical header (remove CTA pill, add hamburger toggle + CSS + media query); fix baseline so subsequent F cycles inherit a clean source of truth. **Must land before F-2.** | ~30 |
| **F-2** | `about-us.html`, `contact-us.html`, `how-we-do-it.html`, `articles.html`, `open-source-projects.html` | Five "regular" page previews; identical chrome rewrite + footer normalization (add copyright span where missing, normalize signature link target and arrow, swap "Testing-suite" → "Test-suite"). | ~110 (5 × ~22) |
| **F-3** | `automated-testing-kit.html`, `automated-testing-kit-introduction.html`, `article-introducing-layout-builder-kit-beta-1.html` | ATK + article-family book/leaf pages; chrome rewrite + footer copyright span restore + em-dash normalization. Distinct from F-2 because of the live-title-pattern operator question and the HTML-entity vs UTF-8 cleanup. | ~75 (3 × ~25) |
| **F-4 (optional)** | All 10 | Cross-cutting tidy: `/contact` vs `/contact-us` global decision, `href="#"` vs real paths in `homepage.html` (if operator wants homepage to use real paths), skip-link + `<main>` landmark add. May be deferred if operator wants chrome-only first. | ~50 |

**Order of operations:** F-1 must complete before F-2 and F-3 so the targets can be visually verified against a chrome-canonical baseline. F-2 and F-3 are independent and can run in either order. F-4 is an operator decision.

---

## 4. Operator decisions needed before F-1 starts

1. **Canonical baseline:** confirm "match `homepage.html`'s header (no CTA, hamburger present)" and "match `services.html`'s breadcrumb + `is-current` + real-path-href conventions" — i.e. the hybrid recommended above.
2. **Contact URL:** `/contact` or `/contact-us`?
3. **Service label:** "Test-suite takeover" or "Testing-suite takeover"?
4. **ATK + article-family title pattern:** keep production-shape (`X — Performant Labs`) or unify to preview-suite shape (`Performant Labs — X preview (teal + terracotta)`)?
5. **Focus-ring spec:** brief's 2px outline or memory's 3px dotted — which ships?
6. **F-4 scope:** chrome-only cycles now and defer cross-cutting tidy, or roll it into F-2/F-3?

---

## 5. Out of scope for this cycle

- Page-body section content (hero copy, body cards, accordion contents, bio blocks, etc.) — preserved.
- Pixel-level visual diff — Cycle 1 is structural-only.
- Drupal template alignment (any references to `dy-section--*` markers etc.) — previews are HTML mockups, not Drupal output.

---

**End of audit.**
