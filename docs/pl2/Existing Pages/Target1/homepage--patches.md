# Homepage patches — Applied

*✓ Applied 2026-04-26.* Overlay landed via commit `57a1ee6` + `drush php:script scripts/apply-canvas-page.php content-exports/homepage-rewrite-pass-1.overlay.yml`. Snapshot pair: `pre-homepage-rewrite-pass-1`. T1: 21/21 PASS. T3 captures: `.claude-bridge/t3-homepage-pass1-2026-04-26/`. Footer items (Services sub-list, tagline) are out of scope for this pass — handled separately as a footer-block edit.

*Surgical vocabulary patches for `Existing Pages/Actual1/homepage.md`. For section-level rewrites of the legacy build-shop sections on the same page, see the sibling `homepage.md`.*

## Patch 1.1 — "QA engineer" → "testing engineer" (line 66)

**Current:**

> Every night, Playwright tests run against this site in CI. When a test breaks, a Claude agent diagnoses the failure, classifies it (test issue or website issue), and — when appropriate — opens a pull request with the fix. No Monday-morning flake triage. **No staging calls with a QA engineer.** The workflow is in our public repo; you can read `heal-tests-claude.yml` — the code that decides what our AI is allowed to touch.

**Replacement:**

> Every night, Playwright tests run against this site in CI. When a test breaks, a Claude agent diagnoses the failure, classifies it (test issue or website issue), and — when appropriate — opens a pull request with the fix. No Monday-morning flake triage. **No staging calls with a testing engineer chasing yesterday's flake.** The workflow is in our public repo; you can read `heal-tests-claude.yml` — the code that decides what our AI is allowed to touch.

**Why:** Brand brief §5 vocabulary lock — *"Use 'Testing engineer' (Never 'QA engineer,' never 'tester')."*

**Status:** Approved 2026-04-26.

## Patch 1.2 — ATK FAQ description (line 95)

**Current:**

> What is the Automated Testing Kit (ATK)?
>
> ATK is Performant Labs' open-source functional testing framework for Drupal, available on Drupal.org. It provides a structured **Cypress and PHPUnit** test suite that works out of the box with standard Drupal installations - covering forms, roles, content types, and accessibility.

**Replacement:**

> What is the Automated Testing Kit (ATK)?
>
> ATK (Automated Testing Kit) is the open-source Drupal testing library Performant Labs maintains on drupal.org. It ships pre-written **Playwright and Cypress** tests for the work every Drupal site ends up doing — login, registration, content CRUD, taxonomy, sitemaps, accessibility — so your team starts with a working suite instead of a blank file.

**Why:** Two-part fix. (a) Internal inconsistency — the existing homepage copy says ATK is *Cypress + PHPUnit*, but the about-us page (lines 45–47) describes it as *Playwright + Cypress*. The about-us framing is canonical. (b) Brand brief §5 — Playwright before Cypress.

**Status:** Approved 2026-04-26.

## Patch 1.3 — "QA time drops" → vocabulary fix (line 88)

**Current:**

> * Dev teams catch regressions before users do
> * Engineers deploy with confidence, not anxiety
> * **QA time drops as automated test runs replace manual checks**
> * Leadership ships on schedule and on budget

**Replacement:**

> * Dev teams catch regressions before users do
> * Engineers deploy with confidence, not anxiety
> * **Manual test cycles drop as automated runs cover the regression surface**
> * Leadership ships on schedule and on budget

**Why:** Brand brief §5 vocabulary lock — "QA" framing avoided in favor of *testing engineer* / *test cycles* / etc.

**Status:** Approved 2026-04-26.

## Implementation order

These three patches bundle with the section rewrites in `homepage.md` for one Admin-UI session. See `homepage.md` *Implementation order* for the full sequence.
