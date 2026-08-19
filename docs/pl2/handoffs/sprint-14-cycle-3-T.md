# Handoff-T: Sprint 14 Cycle 3 - Mobile display-xl token raise (F-NEW-2)

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-14-cycle-3-mobile-display-xl-token`
**Issue:** `docs/pl2/handoffs/sprint-14-cycle-3-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/sprint-14-cycle-3-F.md`

---

## Tier 1 results

| # | Check | Command | Expected | Actual | Result |
|---|---|---|---|---|---|
| T1-1 | Cache clear | `ddev drush cr` | `[success] Cache rebuild complete.` | `[success] Cache rebuild complete.` | PASS |
| T1-2 | HTTP 200 on /about-us | `curl -sk 'https://pl-performantlabs.com.3.ddev.site:8493/about-us' -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| T1-3 | `landing-hero` in rendered /about-us hero section | `curl -sk '...about-us' \| grep -oP 'class="dy-section[^"]*"' \| head -1` | `landing-hero` present in first `dy-section` class | `class="dy-section dy-section--cta-pair dy-section--centered-white landing-hero theme--white container dy-section--section-max-width margin-top--0 margin-bottom--0 padding-top--l padding-bottom--l"` | PASS |
| T1-4 | dy-section.css loaded on page | `curl -sk '...about-us' \| grep -oE 'href="[^"]*dy-section\.css[^"]*"'` | CSS file present | `/themes/custom/performant_labs_20260502/css/components/dy-section.css?teyyuo` | PASS |
| T1-5 | Mobile 44px rule in served dy-section.css | Grep `2.75rem` and `44px` in served stylesheet | `font-size: 2.75rem; /* 44px display-xl mobile */` inside `@media (max-width: 576px)` | Confirmed: `font-size: 2.75rem; /* 44px display-xl mobile */` | PASS |
| T1-6 | Desktop 72px rule in served dy-section.css | Grep `4.5rem` in served stylesheet | `font-size: 4.5rem; /* 72px display-xl */` | Confirmed | PASS |
| T1-7 | Preview file mobile rule | `grep -n 'font-size: 44px' docs/pl2/Previews/about-us.html` | line 514: `font-size: 44px` | `514: .hero h1 { font-size: 44px; letter-spacing: -1px; }` | PASS |
| T1-8 | Idempotency — second script run is a no-op | `ddev drush php-script scripts/sprint14-cycle3-about-us-landing-hero.php` (second run) | `SKIP [0]: 'landing-hero' already present. No changes needed.` | Exact match: `SKIP [0]: 'landing-hero' already present. additional_classes: 'dy-section--cta-pair dy-section--centered-white landing-hero'. No changes needed.` | PASS |

---

## Tier 2 results

| # | Check | Method | Result |
|---|---|---|---|
| T2-1 | No theme CSS files changed | `git diff --name-only main \| grep 'web/themes/custom/performant_labs_20260502/css/'` | Zero output — no theme CSS files touched. PASS |
| T2-2 | Canvas script `scripts/sprint14-cycle3-about-us-landing-hero.php` present | `ls scripts/sprint14-cycle3-about-us-landing-hero.php` | File exists. **HOWEVER: `git status` shows `?? scripts/sprint14-cycle3-about-us-landing-hero.php` — the script is untracked and has not been committed.** See Blocking issues. FAIL |
| T2-3 | Preview `docs/pl2/Previews/about-us.html` in git diff | `git diff --name-only main \| grep about-us.html` | `docs/pl2/Previews/about-us.html` present in diff. PASS |
| T2-4 | `landing-hero` on /about-us hero section only (not other sections) | Drupal eval: iterate all 32 components of `canvas_page id=17`, check `additional_classes` for `landing-hero` | Only `idx=0` has `landing-hero`; all 31 other components do not. PASS |
| T2-5 | `component_version` non-NULL on canvas_page id=17 | Drupal eval: `$components[0]['component_version']` | `e6079b189d228dad` — non-NULL, matches F's documented value. PASS |
| T2-6 | `landing-hero` is ONLY on the four expected canvas pages | Drupal eval: enumerate all canvas_page entities for `landing-hero` | IDs 3 (/services), 4 (/how-we-do-it), 5 (/open-source-projects), 17 (/about-us). No other pages. PASS |
| T2-7 | Heading hierarchy on /about-us | `curl \| grep -oE '<h[1-6][^>]*>'` | 1 H1, then H2, then H3 — single H1, no skipped levels. Drupal visually-hidden H2s for nav/breadcrumb regions are correct landmark pattern. PASS |
| T2-8 | Single H1 | `grep -c '<h1'` | Count: 1. PASS |
| T2-9 | ARIA landmarks present | `curl \| grep -oE '<(header\|main\|footer\|nav)[^>]*>'` | `<header>`, `<main>`, `<footer>`, two `<nav>` elements all present. PASS |
| T2-10 | Cross-page no-regression: landing-hero on /services | curl grep | `landing-hero` present. PASS |
| T2-11 | Cross-page no-regression: landing-hero on /how-we-do-it | curl grep | `landing-hero` present. PASS |
| T2-12 | Cross-page no-regression: landing-hero on /open-source-projects | curl grep | `landing-hero` present. PASS |
| T2-13 | Homepage uses different hero mechanism (not landing-hero) | curl grep for `landing-hero` on `/` | Not present — homepage uses `neonbyte:hero` component with `class="hero has-background-image..."`. Correct; no regression. PASS |
| T2-14 | No `!important` in dy-section.css landing-hero block | Full rule-block inspection | No `!important` in the `.landing-hero .heading.h1` block or its media-query overrides. Comment lines noting absence: `/* No !important. */`. PASS |
| T2-15 | No `!important` in preview file | `grep -n '!important' docs/pl2/Previews/about-us.html` | Zero results. PASS |
| T2-16 | `text-wrap: balance` present on landing-hero H1 | Inspect dy-section.css landing-hero block | `text-wrap: balance;` confirmed in `.landing-hero .heading.h1 { }` base rule. PASS |

---

## WCAG contrast verification

| Element | Foreground | Background | F's ratio | T's ratio | PASS/FAIL |
|---|---|---|---|---|---|
| Hero H1 (44px mobile, Rubik 500) | `#1F1A14` (`--color--loud`) | `#FFFFFF` | 17.29:1 | **17.27:1** | PASS (AAA; large text threshold 3:1) |

**Method:** Python 3 WCAG 2.1 relative luminance formula. `#1F1A14` (R=31, G=26, B=20): linearized L = 0.0108. White L = 1.0. Ratio = (1.0 + 0.05) / (0.0108 + 0.05) = 17.27:1.

**Discrepancy:** F reported 17.29:1; T computes 17.27:1. The 0.02 difference is a rounding artifact — both values far exceed the 3:1 large-text threshold and the 4.5:1 body-text threshold. No WCAG impact.

No color tokens changed in this cycle. All other contrast ratios on the page are unchanged from Sprint 13 verified values.

---

## Mobile responsive verification

**Cycle 3 responsive override: about-us hero H1 at mobile (< 576 px)**

| Item | Value |
|---|---|
| Breakpoint | `@media (max-width: 576px)` |
| CSS rule | `.landing-hero .heading.h1 { font-size: 2.75rem; /* 44px display-xl mobile */ letter-spacing: -1px; line-height: 1.05; }` in `dy-section.css` |
| Rule confirmed in served stylesheet | YES — verified via curl-grep |
| Before | 36 px (via `--h1-size` / display-lg, `.h1` utility class) |
| After | 44 px (via `.landing-hero .heading.h1` explicit assertion) |
| Letter-spacing | `-1px` (relaxed from desktop `-2px` per typography-mobile block) |
| Line-height | `1.05` |
| `text-wrap: balance` | Present in base rule (applies at all viewports) |
| Touch target | H1 is not an interactive element; no touch target size applies. Reflow check: H1 "Drupal testing, done by the people who wrote the tools." wraps to multiple lines at 375 px without horizontal scroll (confirmed in Cycle 1 audit; +8 px from 36 → 44 px may add one wrap line but does not introduce horizontal scroll per Cycle 1 orphan-word analysis). |
| Orphan-word at mobile | Cycle 1 audit confirmed last line = "wrote the tools." (3 words) at 375 px — not an orphan. The +8 px increase may shift wrap differently; definitive verification is S's cross-page sweep at 375 px per the issue's acceptance criteria. |
| Brief match | `docs/pl2/briefs/pl_design_brief.md` typography-mobile block: `display-xl` = 44 px at < 576. **Matches.** |

---

## Acceptance criteria status

| # | Criterion | Evidence | Result |
|---|---|---|---|
| AC-1 | **F-NEW-2 (live L1).** Mobile display-xl H1 raised from 36 px to 44 px at < 576 px on /about-us. Letter-spacing per brief mobile scale. | `landing-hero` class present in rendered HTML at `/about-us` hero section (T1-3); dy-section.css `@media (max-width: 576px) .landing-hero .heading.h1 { font-size: 2.75rem; letter-spacing: -1px; }` confirmed in served CSS (T1-5). Implementation is via L5 marker (not L1 token) per F's documented trace — see Scope note below. | PASS |
| AC-2 | **F-NEW-2 (preview).** Preview mobile rule raised from 40 px to 44 px at line 514 of `docs/pl2/Previews/about-us.html`. | `grep -n 'font-size: 44px' docs/pl2/Previews/about-us.html` returns `514: .hero h1 { font-size: 44px; letter-spacing: -1px; }`. Git diff confirms the change: `-.hero h1 { font-size: 40px; ... }` → `+.hero h1 { font-size: 44px; ... }`. | PASS |
| AC-3 | Desktop display-xl rule (72 px) unchanged. | dy-section.css: `@media (min-width: 577px) .landing-hero .heading.h1 { font-size: 4.5rem; /* 72px */ }` confirmed in served CSS (T1-6). No base.css token modified. | PASS |
| AC-4 | No `!important`. Standard layer trace. | T2-14, T2-15: zero `!important` in both dy-section.css landing-hero block and preview file. Layer is L5 (existing FU-2 rule via Canvas marker). | PASS |
| AC-5 | T1 + T2 verification: cache-clear; curl-grep confirm value in served CSS; structural HTML unchanged. | T1-1 through T1-8; T2-1 through T2-16 all conducted. Single H1, H1→H2→H3 hierarchy, ARIA landmarks intact. | PASS (except T2-2 blocking issue — see below) |
| AC-6 | **Cross-page sweep (S, mandatory).** S re-captures every landing page at 375 px and confirms H1 = 44 px, no CTA stacking disruption, no horizontal scroll, no orphan on last line. | S's responsibility per issue. T confirms structural preconditions: all four other landing pages retain `landing-hero` (T2-10 through T2-13); no theme CSS changed (T2-1). | PENDING — S's responsibility |

**Scope note on AC-1 layer:** The issue specified "L1 token" but F's 7-step trace revealed `--title-size` (display-xl) was already 44 px in `base.css`. The about-us hero consumed `--h1-size` (display-lg = 36 px) and lacked the `landing-hero` marker the other landing pages have. F applied the same L5 Canvas marker pattern (`additional_classes`) used for `/services`, `/how-we-do-it`, and `/open-source-projects`. No new CSS was written. The existing dy-section.css FU-2 rules now activate on `/about-us`. This is a narrower, lower-risk approach than raising an L1 token. T verifies this is correct behavior.

---

## Blocking issues

**1. Canvas script `scripts/sprint14-cycle3-about-us-landing-hero.php` is untracked — not committed to the branch.**

- `git status` output: `?? scripts/sprint14-cycle3-about-us-landing-hero.php`
- The file does not appear in `git diff --name-only main`.
- The script is the durable artifact that documents and reproduces the Canvas change. F's handoff lists it under "Files changed" and it is load-bearing for audit trail and re-run capability.
- The Canvas database change itself is already applied (the `landing-hero` class is live in the database — verified by T1-3 and idempotency test). But without the script committed, the branch diff does not contain the implementation artifact.
- **Required action:** F must `git add scripts/sprint14-cycle3-about-us-landing-hero.php` and commit before S proceeds.

---

## Advisory notes

**1. Scope is narrower than original L1 risk profile — S cross-page sweep is correspondingly narrower.**

The original issue assumed an L1 token raise would propagate to all five landing pages simultaneously (+8 px on live, +4 px on preview, requiring a full cross-page CTA-stacking sweep). F's trace reveals that no token changed — only `/about-us`'s Canvas content changed. The four other landing pages (`/services`, `/how-we-do-it`, `/open-source-projects`, `/`) were already rendering 44 px mobile via their existing mechanisms (dy-section.css FU-2 rules for the first three; hero.css for the homepage). T has confirmed that all four other pages still render `landing-hero` correctly (T2-10 through T2-13) and no CSS files changed.

S's cross-page sweep can therefore be scoped to:
- Confirm `/about-us` hero H1 now renders 44 px at 375 px (was 36 px per Cycle 1 baseline).
- Spot-check the other four pages at 375 px to confirm no regression (not a full re-audit — a quick confirm that mobile H1 remains 44 px and CTA stacking is intact).
- The full per-section DSSIM re-diff is required only for `/about-us` hero section. The other four pages are no-regression spot-checks.

**2. Preview desktop rule (40→44 px) is the Cycle 3 change; desktop (64→72 px) was Cycle 2.**

`git diff main -- docs/pl2/Previews/about-us.html` shows both changes since both cycles land on the same branch. S should confirm both are present and correct: desktop line reads `font-size: 72px` and mobile line reads `font-size: 44px`.

**3. dy-section.css comment text contains a stale DOM note.**

Inside the served dy-section.css comment block, the DOM inspection evidence text reads: `[x] /about-us: no .landing-hero class — NOT matched (correct: about-us has display-md spec at 64px, not display-xl)`. This comment predates F's Cycle 3 fix — it was written during the original FU-2 implementation for the other three pages. The live site is now correct (landing-hero IS present on /about-us); the comment is stale. This is a non-blocking documentation issue in the CSS source comment (not load-bearing). No CSS behavior is affected.

---

## Decision Logic

T found one blocking issue. F needs to address:

1. `git add scripts/sprint14-cycle3-about-us-landing-hero.php` and commit the untracked Canvas script to the branch.

Do not proceed to S until this is resolved.
