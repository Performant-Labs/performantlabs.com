# Open Source Projects patches — Applied

*✓ Applied 2026-04-26.* Surgical patches landed in commit `99d7eb5` alongside the section rewrites — Andre → André in the DQI card body, "Other Modules We Maintain" → "Other modules we maintain." Overlay: `content-exports/open-source-projects-rewrite-pass-1.overlay.yml`. T1: both patches verified clean against the rendered HTML.

*Surgical text patches for `Existing Pages/Actual1/open-source-projects.md`. For section-level rewrites of the same page, see the sibling `open-source-projects.md`.*

## Patch 4.3 — "Andre" → "André" (DQI card body, line 40)

**Current:**

> This community initiative was born when we were faced with the question of when to move a project from alpha to beta. **Andre** presented the project at the Bay Area Drupal Camp. Visit the project page on Drupal.org and watch the presentation to learn our thoughts on what it takes to create quality software.

**Replacement:**

> This community initiative was born when we were faced with the question of when to move a project from alpha to beta. **André** presented the project at the Bay Area Drupal Camp. Visit the project page on Drupal.org and watch the presentation to learn our thoughts on what it takes to create quality software.

**Why:** The about-us page uses *"André Angelantoni"* with the correct accent. Inconsistent name spelling across pages is a small but real credibility hit. One-character fix.

**Status:** Approved 2026-04-26.

## Patch 4.4 — "Other Modules We Maintain" → sentence case (line 58)

**Current:**

> ## Other Modules We Maintain

**Replacement:**

> ## Other modules we maintain.

**Why:** Brand brief §5 / copy brief style rules — sentence case for headings except proper nouns. Adds a terminal period to match the page's other H2s when they're declarative phrases.

**Status:** Approved 2026-04-26.

## Implementation order

These patches bundle with the section rewrites in `open-source-projects.md` for one canvas overlay apply. See `open-source-projects.md` *Implementation order* for the full sequence.

(Note: project-name H3s — "Drupal Quality Initiative", "Campaign Kit", "Layout Builder Kit", "Payment Stripe" — are kept capitalized because they are proper nouns. Sentence-case rule applies to non-proper-noun headings only.)
