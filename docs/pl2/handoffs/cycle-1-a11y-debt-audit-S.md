# Handoff-S: Sprint 9 — Cycle 1 — A11y debt audit

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-9-cycle-1-audit`
**Issue:** `docs/pl2/handoffs/cycle-1-a11y-debt-audit-issue.md`
**Runbook:** `docs/pl2/pl-plan--sprint-9-a11y-debt.md`
**Mode:** autonomous, audit-only (O → S → O)
**Operator-facing report:** [`cycle-1-a11y-debt-audit-report.html`](cycle-1-a11y-debt-audit-report.html)

## T precondition

N/A — audit-only cycle. Skipped per issue.

## Tooling probe (FU-3)

| Question | Answer |
|---|---|
| `pa11y` host binary | `/opt/homebrew/bin/pa11y` (works against `https://pl-performantlabs.com.3.ddev.site:8493/…`) |
| `pa11y-ci` host binary | Not installed |
| `package.json` at repo root | **None.** |
| `package.json` in custom theme `web/themes/custom/performant_labs_20260502/` | **None.** |
| `package.json` elsewhere relevant | Only inside contrib themes / contrib modules / `web/core/` / `web/libraries/` — not relevant to project-level pa11y wiring |
| `.pa11yci*` files in repo | None |

**FU-3 install path recommendation: (a) config-only artifact.**

Reasoning: there is no existing JS toolchain at project root or in the custom theme. Introducing `package.json` + `node_modules` just to host `pa11y-ci` would add npm lifecycle to a repo that otherwise has none. A config-only `.pa11yci.json` plus documented `pa11y-ci` invocation (run via `npx --yes pa11y-ci` or globally installed `pa11y-ci`) keeps the artifact a docs/config asset, not a build dependency.

### `.pa11yci.json` content sketch (repo root)

```json
{
  "defaults": {
    "standard": "WCAG2AA",
    "timeout": 30000,
    "wait": 500,
    "chromeLaunchConfig": {
      "args": ["--ignore-certificate-errors"]
    },
    "ignore": [],
    "hideElements": ""
  },
  "urls": [
    "https://pl-performantlabs.com.3.ddev.site:8493/",
    "https://pl-performantlabs.com.3.ddev.site:8493/services",
    "https://pl-performantlabs.com.3.ddev.site:8493/about-us",
    "https://pl-performantlabs.com.3.ddev.site:8493/articles",
    "https://pl-performantlabs.com.3.ddev.site:8493/contact-us",
    "https://pl-performantlabs.com.3.ddev.site:8493/how-we-do-it",
    "https://pl-performantlabs.com.3.ddev.site:8493/open-source-projects"
  ]
}
```

Allowlist is expressed via `ignore` (rule codes, coarse) **or** per-URL overrides with `hideElements` (CSS-selector based, surgical). `pa11y-ci` allowlist syntax matches single-URL `pa11y` — the cleaner expression is to define per-URL `actions` / `hideElements` for the two known offenders. Operator can refine F's exact JSON during Cycle 2a.

### Allowlist entries (surgical: CSS selector + WCAG rule ID)

| # | Source | CSS selector | WCAG rule ID | Contrast measured | Status |
|---|---|---|---|---|---|
| 1 | ADV-S5 (operator-approved brand exception) | `a.button.button--primary, button.button.button--primary, #edit-actions-submit.button--primary` | `WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail` | 2.21:1 (needs 4.5:1) | Allow |
| 2 | brk-3 (operator-approved brand exception) | `.breadcrumb__link` | `WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail` | 3.12:1 (needs 4.5:1) | Allow |

**No third item surfaced.** The audit found exactly these two contrast families across all 7 pages, totaling 12 instances — every single error pa11y emits today maps to one of these two allowlist entries. No new selectors flagged.

**Invocation lines (for wrap doc):**

```bash
# One-shot, no install (preferred for CI / fresh clones):
npx --yes pa11y-ci --config .pa11yci.json

# Or with global install:
npm install -g pa11y-ci
pa11y-ci --config .pa11yci.json
```

**PC-5 wording retirement.** Once allowlist is wired, sprint-wrap pa11y line moves from "0 *new* errors" to "0 errors with allowlist applied" — exactly as the runbook §"Approval Checkpoints" pre-commits.

## FU-7b root cause

**Sole emitting file:** `web/themes/custom/performant_labs_20260502/components/article-card/article-card.twig`, line 37:

```twig
<h3><a href="{{ url }}">{{ title }}</a></h3>
```

**Why the skip only manifests on `/articles`:**

| Page | H1 | Next-sibling section heading | Cards |
|---|---|---|---|
| `/articles` | `<h1>Articles.</h1>` (page-title block) | **(none — view renders directly under title)** | `article-card` SDC → `<h3>` |
| `/` (home) | `<h1>` hero | `<h2>` section headings (`heading h2 …`) | `card__title` H3 ✓ correctly nested |
| `/services`, `/about-us`, `/how-we-do-it`, `/open-source-projects` | `<h1>` | `<h2>` section headings | `card__title` H3 ✓ correctly nested |
| `/contact-us` | `<h1>` | `<h2>` (visually styled as h3) | `card__title` H3 ✓ correctly nested |

The `article-card` SDC's `<h3>` is correct **in every other context** because each consuming page wraps it in a section that has its own H2. The `/articles` Views page renders `article-card`s directly under the page title H1 with no section H2 in between.

**Drupal layer trace:**

- `web/themes/custom/performant_labs_20260502/templates/views/views-view-unformatted--articles--page-1.html.twig` is the view-row override. It wraps rendered article teasers in `<div class="article-grid">` and emits no heading itself. So the fix is **not** at the view-template layer.
- The view itself uses an "unformatted" style and renders each row through the article-card SDC.
- The SDC is a generic teaser component — promoting its internal `<h3>` to `<h2>` would cascade to every page that consumes it (home, services, about-us, how-we-do-it, open-source-projects, contact-us) and break their hierarchy in the opposite direction (H1 → H2 hero → H2 cards loses the visual nesting).

### Recommended fix: insert a visually-hidden `<h2>` above the article grid on `/articles` only

Edit `views-view-unformatted--articles--page-1.html.twig` to render a visually-hidden H2 immediately above the grid:

```twig
{% if title %}
  <h2>{{ title }}</h2>
{% else %}
  <h2 class="visually-hidden">Articles</h2>
{% endif %}
<div class="article-grid">
  {% for row in rows %}
    {{- row.content -}}
  {% endfor %}
</div>
```

This is the **smallest-surface** fix:

- Single template edit, scoped to the `/articles` view (the `--articles--page-1` suggestion is page-specific).
- Does not touch the `article-card` SDC, so no regression on the 5 other pages consuming it.
- "Articles" is the page H1 already; the visually-hidden H2 ("Articles" or e.g. "Article list") gives SR users the missing landmark without visual change.
- No CSS work (the existing `.visually-hidden` utility from `dripyard_base` covers it).

**Why not promote h3 to h2** (the runbook's pre-commit default): it would require either (a) editing the shared SDC, cascading hierarchy changes to 5 unrelated pages — net new regressions — or (b) a per-page conditional in the SDC, which adds prop sprawl. Insert-hidden-h2 is one template, one element, zero conditionals.

**F should document the choice** in their handoff per runbook §Approval Checkpoints "FU-7b fix direction".

## Site-wide a11y sweep

### pa11y WCAG2AA results (12 total errors)

| Page | Errors | Breadcrumb 3.12:1 (brk-3) | Button 2.21:1 (ADV-S5) | New / unallowlisted |
|---|---|---|---|---|
| `/` | 1 | 0 | 1 | 0 |
| `/services` | 3 | 1 | 2 | 0 |
| `/about-us` | 3 | 1 | 2 | 0 |
| `/articles` | 1 | 1 | 0 | 0 |
| `/contact-us` | 2 | 1 | 1 (`#edit-actions-submit`) | 0 |
| `/how-we-do-it` | 1 | 1 | 0 | 0 |
| `/open-source-projects` | 1 | 1 | 0 | 0 |

**Conclusion: every pa11y error today maps to one of the two already-known operator-approved exceptions.** No new contrast issues anywhere.

Raw outputs: `docs/pl2/handoffs/screenshots/sprint-9-cycle-1/pa11y-*.json`. Consolidated: `pa11y-summary.json`.

### Heading hierarchy

Dumps in `docs/pl2/handoffs/screenshots/sprint-9-cycle-1/raw-*.html` (full HTML) and embedded in the report.

| Page | H1 | H2 present before first H3 | H3 skip? |
|---|---|---|---|
| `/` | 1 | yes | clean |
| `/services` | 1 | yes | clean |
| `/about-us` | 1 | yes | clean |
| `/articles` | 1 | **NO** | **SKIP (FU-7b)** |
| `/contact-us` | 1 | yes (one H2 styled `.h3` — visual only, semantic OK) | clean |
| `/how-we-do-it` | 1 | yes | clean |
| `/open-source-projects` | 1 | yes | clean |

**Note on visually-hidden helper-headings.** Several pages emit `<h2 class="visually-hidden h3 menu-block__title">` for menu blocks and `<h2 id="system-breadcrumb-…" class="visually-hidden">` for breadcrumbs. These appear **before** the main H1 in source order. Browser AT typically reads them as part of the page structure. The class `h3` on these `<h2>` elements is **visual styling only** (the element is `display:none` via `.visually-hidden`); semantically they remain H2. No remediation needed.

**Footer `<h3 class="footer-column__heading">` is acceptable.** The footer is a `<footer>` landmark with `<nav>` regions inside; AT treats landmark-scoped headings as locally-rooted. No pa11y/axe rule flags this pattern.

### Landmark integrity

All 7 pages have: `<header>`, `<nav aria-labelledby|aria-label>` (main menu), `<nav>` (breadcrumb, where present), `<main>`, `<footer>`, `<nav>` (footer menu). `/articles` additionally has `<nav class="pagination" aria-label="Articles pagination">`. All `<nav>` elements are distinguished by aria-label or aria-labelledby. **No landmark issues.**

### Alt text

Every `<img>` across all 7 pages has an `alt=` attribute. Sample alt values seen: `"Cypress on Drupal Cheat Sheet"`, `"Robot in a factory"`, `"CBS Interactive logo"`, `"DocuSign logo"`, `"How We Do It - Relative Cost of Fixing Bugs"`, `"Campaign Kit Logo"`, `"Drupal Quality Initiative Logo"`, `"Home"` (breadcrumb home icon — descriptive enough). No "image", "img", or empty-when-it-shouldn't cases found. **No alt-text issues.**

### Form labels

`/contact-us` form fields all have stable `id`s (`edit-name`, `edit-email`, `edit-company-name`, `edit-phone-number`, `edit-message`). pa11y did not flag any missing-label rule. Spot-checked: each `<input>` has a corresponding `<label for>`. **No form-label issues.**

### Link discernibility

No "click here" / "read more" generic link text surfaced in heading dump or pa11y output. Article cards link by article title. Breadcrumbs by page name. **No link-text issues.**

### Keyboard focus visibility

Out of scope for static-curl probing; requires browser interaction. Sprint 8 S audit confirmed visible focus rings on the homepage; pattern is theme-wide via `:focus-visible`. **No regression suspected; defer interactive verification to final cycle.**

## Brand-exception re-eval position

**Position: KEEP both exceptions, document allowlist (FU-3). No token tweak in Sprint 9.**

Reasoning:

- **ADV-S5 button (`#fcfbf7` on `#2fa2b6`, 2.21:1).** Reaching 4.5:1 from white text requires the teal to drop to roughly `#288191` (a ~13% L decrease) or darker. That's a visible brand shift — the teal-bright becomes notably more muted. Operator already declined this in Sprint 5. Not worth re-litigating in Sprint 9.
- **brk-3 breadcrumb link (cream-on-cream teal, 3.12:1).** A token tweak is conceivable (darken the link color, not the cream background) but breadcrumb is a low-prominence UI element and operator approved as live. Cycle 1 audit surfaces no new evidence to override.

**Token-tweak path for a future sprint (not Sprint 9):** A `teal-deep` token at ~`#288191` could be introduced as a `.button--primary--aaa` variant for contexts where AA is strict (e.g., government / regulated industry landing pages) without retroactively changing the existing button visuals. **Surfaced for tech-debt register, not for Sprint 9 execution.**

## Cycle 2 carve recommendation

**Recommendation: SINGLE CYCLE (Cycle 2 bundled).** Override the runbook's default 2a/2b split.

Reasoning:

- Both fixes are tiny: FU-3 adds **one file** (`.pa11yci.json`); FU-7b edits **one file** (`views-view-unformatted--articles--page-1.html.twig`). Total = 2 files.
- No code interaction between them — diffs read cleanly together.
- A single cycle is one F → T → S round-trip instead of two, saving operator gate time without sacrificing reviewability.
- The runbook §"Single-cycle alternative" explicitly pre-commits this option for "≤ 4 files total". Threshold met.

**Cycle 2 acceptance (combined):**

- [ ] `.pa11yci.json` at repo root, allowlist covers the two known selectors.
- [ ] F runs `npx --yes pa11y-ci --config .pa11yci.json` and demos 0 errors output.
- [ ] `views-view-unformatted--articles--page-1.html.twig` adds a visually-hidden `<h2>` above `.article-grid`.
- [ ] `/articles` heading dump shows H1 → H2 → H3 sequence (no skip).
- [ ] No `!important` added.
- [ ] No regression on other 6 pages (heading hierarchy + pa11y still clean).

After Cycle 2 lands, the **Final cycle** (T + S baseline) per runbook runs to confirm pa11y 0-errors-with-allowlist + full WCAG 2.2 AA table across all 7 pages.

## Verdict

**PASS.**

All acceptance criteria from the issue and runbook §Cycle 1 met:

- `package.json` existence + location reported (none at repo root or custom theme).
- FU-3 install path: config-only `.pa11yci.json` with concrete content sketch and two allowlist entries.
- FU-7b root cause file identified: `article-card.twig` line 37 (and explained why the SDC itself is correct, the skip manifests at the `/articles` view layer).
- FU-7b recommended fix: insert visually-hidden `<h2>` in `views-view-unformatted--articles--page-1.html.twig` (deviates from runbook default of "promote h3 to h2" with documented rationale).
- Site-wide a11y sweep: no NEW items; all 12 pa11y errors fold into the two known brand exceptions.
- Brand-exception re-eval: KEEP both.
- Cycle 2 carve: SINGLE CYCLE (bundled 2a + 2b).

## Advisory notes (non-blocking)

1. **`teal-deep` token candidate** — A `#288191`-ish teal at AAA contrast vs white could be a future tech-debt item; not Sprint 9 scope. Surface to operator for separate decision.
2. **`/contact-us` H2 styled as `.h3`** — One `<h2 data-component-id="dripyard_base:heading" class="heading h3 …">` exists. Semantic level is correct; visual size mismatch may be intentional (designer choice). Not a defect. Flagged in case it's an oversight.
3. **F should preserve the Views `{% if title %}` branch.** The existing template has `{% if title %}<h3>{{ title }}</h3>{% endif %}` — replace that `<h3>` with `<h2>` so if a future view config sets a row-group title, it still inserts at the right level. The else-branch (no title) inserts the visually-hidden H2.
