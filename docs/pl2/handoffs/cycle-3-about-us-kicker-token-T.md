# Handoff-T: Sprint 12 Cycle 3 - Normalize SB/SD kicker to --accent-deep #8E4A2A

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-12-cycle-3-about-us-kicker-token`
**Issue:** `docs/pl2/handoffs/cycle-3-about-us-kicker-token-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-3-about-us-kicker-token-F.md`

---

## Tier 1 results

### T1-1: Token alignment in served CSS

**Command:**
```
ddev exec curl -s http://localhost/themes/custom/performant_labs_20260502/css/base.css | grep -E '8C4E33|8E4A2A|accent-deep-on-light'
```

**Raw output:**
```
  --pl-accent-deep: #8E4A2A;
  --pl-accent-deep-on-light: #8E4A2A;  /* Sprint 12 Cycle 3: aligned to brief --accent-deep (5.79:1 on cream, AA pass) */
```

**Expected:** zero hits for `8C4E33`; one hit on `accent-deep-on-light` resolving to `#8E4A2A`.
**Result:** PASS. Old off-spec value `#8C4E33` absent. Token line confirms `#8E4A2A`. Comment updated.

---

### T1-2: Page health — HTTP status

**Commands and raw output:**
```
ddev exec curl -s -o /dev/null -w "%{http_code}" http://localhost/about-us
200

ddev exec curl -s -o /dev/null -w "%{http_code}" http://localhost/
200

ddev exec curl -s -o /dev/null -w "%{http_code}" http://localhost/services
200

ddev exec curl -s -o /dev/null -w "%{http_code}" http://localhost/open-source-projects
200
```

| Page | Status | Result |
|---|---|---|
| `/about-us` | 200 | PASS |
| `/` | 200 | PASS |
| `/services` | 200 | PASS |
| `/open-source-projects` | 200 | PASS |

---

### T1-3: Kicker class presence per page

**Command (about-us):**
```
ddev exec curl -s http://localhost/about-us | grep -i "track record\|dogfood"
```

**Raw output (abridged to relevant lines):**
```
<!-- 🥭 Component start: performant_labs_20260502:kicker --><span class="kicker kicker--centered kicker--light">Track record</span>
<!-- 🥭 Component start: performant_labs_20260502:kicker --><span class="kicker kicker--centered kicker--light">Dogfood</span>
```

**Command (homepage):**
```
ddev exec curl -s http://localhost/ | grep -i "dogfooding"
```
**Raw output:**
```
<!-- 🥭 Component start: performant_labs_20260502:kicker --><span class="kicker kicker--centered kicker--light">Dogfooding</span>
```

**Command (services):**
```
ddev exec curl -s http://localhost/services | grep -i "capacity"
```
**Raw output (abridged):**
```
<!-- 🥭 Component start: performant_labs_20260502:kicker --><span class="kicker kicker--centered kicker--light">Capacity</span>
```

**Command (open-source-projects):**
```
ddev exec curl -s http://localhost/open-source-projects | grep -i "testing tools"
```
**Raw output (abridged):**
```
<!-- 🥭 Component start: performant_labs_20260502:kicker --><span class="kicker kicker--centered kicker--light">Testing tools</span>
```

| Page | Kicker text | Class confirmed | Result |
|---|---|---|---|
| `/about-us` | Track record | `kicker--light` in `theme--light` section | PASS |
| `/about-us` | Dogfood | `kicker--light` in `theme--light` section | PASS |
| `/` | Dogfooding | `kicker--light` | PASS |
| `/services` | Capacity | `kicker--light` | PASS |
| `/open-source-projects` | Testing tools | `kicker--light` | PASS |

---

### T1-4: Section markers on /about-us — 5 sections, correct theme zones

**Command:**
```
ddev exec curl -s http://localhost/about-us | grep -oE 'class="dy-section[^"]*"'
```

**Raw output (top-level section divs only):**
```
class="dy-section dy-section--cta-pair dy-section--centered-white theme--white container dy-section--section-max-width margin-top--0 margin-bottom--0 padding-top--l padding-bottom--l"
class="dy-section dy-section--centered-light theme--light full-width dy-section--section-edge-to-edge margin-top--0 margin-bottom--0 padding-top--l padding-bottom--l"
class="dy-section dy-section--centered-white theme--white full-width dy-section--section-edge-to-edge margin-top--0 margin-bottom--0 padding-top--l padding-bottom--l"
class="dy-section dy-section--centered-light theme--light full-width dy-section--section-edge-to-edge margin-top--0 margin-bottom--0 padding-top--l padding-bottom--l"
class="dy-section dy-section--cta-pair theme--dark full-width dy-section--section-edge-to-edge margin-top--0 margin-bottom--0 padding-top--l padding-bottom--l"
```

| Section | Theme zone | Expected | Result |
|---|---|---|---|
| §A (Hero/About) | `theme--white` | `theme--white` | PASS |
| §B (Track record) | `theme--light` | `theme--light` | PASS |
| §C (Open source) | `theme--white` | `theme--white` | PASS |
| §D (Dogfood) | `theme--light` | `theme--light` | PASS |
| §E (Closing CTA) | `theme--dark` | `theme--dark` | PASS |

5 sections present, theme zones match expected. PASS.

---

### T1-5: Drupal watchdog — no NEW errors since Cycle 3

**Command:**
```
ddev drush watchdog:show --count=20 --severity=3
```

**Assessment:** The most recent error in the log is ID 5086, dated 12/May 10:07 — a Canvas `AssertionError` in `ComponentTreeItemList.php`. The second most recent is ID 5084, dated 12/May 07:23 — a Canvas `LogicException` about an `additional_classes` prop. Both pre-date any Cycle 3 file modification (Cycle 3's sole changes are token value and comment; no Canvas or Drupal config touched). The errors from IDs 4999–5000 and earlier (11/May, 09/May) are pre-existing and are associated with prior sprint cycle scripting. No errors traceable to Cycle 3's two-file CSS change.

**Result:** PASS — no new errors attributable to Cycle 3.

---

### T1-6: Active theme

**Command:**
```
ddev drush cget system.theme default
```
**Raw output:**
```
'system.theme:default': performant_labs_20260502
```
**Result:** PASS.

---

### T1-7: No `!important` introduced

**Command:**
```
git diff aa/pl-sprint-12-about-us-fidelity..HEAD -- '*.css' | grep -E '!important'
```
**Raw output:** (no output)

**Result:** PASS — zero `!important` additions in the diff.

---

## Tier 2 results

### T2-1: Heading hierarchy on /about-us

**Method:** `ddev exec curl -s http://localhost/about-us | grep -oE '<h[1-6][^>]*>'`

**Raw output (tag sequence):**
```
<h2>  (nav heading, visually hidden)
<h2>  (breadcrumb heading, visually hidden)
<h1>  (main page heading)
<h2>  (§B)
<h2>  (§C)
<h3>  (card 1)
<h3>  (card 2)
<h3>  (card 3)
<h2>  (bio "Who we are.")
<h2>  (§D)
<h2>  (§E)
<h2>  (footer heading)
<h3>  (footer column 1)
<h3>  (footer column 2)
<h3>  (footer column 3)
```

Single h1 confirmed. Two h2s before the h1 are visually-hidden navigation landmarks (main menu and breadcrumb) — standard Drupal pattern; not a hierarchy violation. No levels skipped: h1 → h2 → h3 throughout. **PASS.**

---

### T2-2: ARIA landmarks

**Method:** `ddev exec curl -s http://localhost/about-us | grep -oE '<(header|main|footer|nav)[^>]*>'`

**Raw output:**
```
<header class="theme--white site-header" data-component-id="neonbyte:header">
<nav id="block-performant-labs-20260502-main-menu" ... aria-labelledby="heading-1622556666">
<nav data-component-id="dripyard_base:breadcrumb" ... aria-labelledby="system-breadcrumb-1904338578">
<main class="site-main">
<footer data-component-id="neonbyte:footer" class="site-footer theme--white">
<nav id="block-performant-labs-20260502-footer" ... aria-labelledby="heading-596824788">
```

All four required landmarks present: `<header>`, `<nav>`, `<main>`, `<footer>`. Both `<nav>` elements carry `aria-labelledby`. **PASS.**

---

### T2-3: kicker.css comment-only change confirmed

**Method:** Read `web/themes/custom/performant_labs_20260502/components/kicker/kicker.css` directly.

**Finding:** Line 25 comment reads:
```
/* On warm canvas sections, use --pl-accent-deep-on-light for kicker colour —
   --pl-accent-deep-on-light (#8E4A2A, 5.79:1 on cream #F5EFE2, AA pass). */
```

No selector or property changes. The `color: var(--pl-accent-deep-on-light);` rule on line 29 is unchanged. Confirmed comment-only modification. **PASS.**

---

### T2-4: No old hex value in any theme CSS

**Method (from T1-1):** `grep -E '8C4E33'` against served base.css — zero hits. The grep-matrix from F's handoff documents zero occurrences of `#8C4E33` as a literal anywhere in the theme. The token was only ever resolved through `--pl-accent-deep-on-light`; it was never hard-coded as rgb() or hex in any other file. **PASS.**

---

## WCAG contrast verification

T computed all ratios independently using the WCAG 2.2 relative luminance formula. Method: linearize each channel, compute luminance as `0.2126R + 0.7152G + 0.0722B`, then `(L_light + 0.05) / (L_dark + 0.05)`.

| Element | Foreground | Background | F's ratio | T's ratio | PASS/FAIL |
|---|---|---|---|---|---|
| Kicker on white (§A, §C) | `#8E4A2A` | `#FFFFFF` | 6.64:1 | **6.64:1** | PASS (≥ 4.5:1) |
| Kicker on cream (§B, §D) — fixed | `#8E4A2A` | `#F5EFE2` | 5.79:1 | **5.79:1** | PASS (≥ 4.5:1) |
| Kicker on espresso (§E) | `#C97B5C` | `#1F1A14` | 4.71:1 | **5.32:1** | PASS (≥ 4.5:1) |
| Focus ring on cream | `#1893B4` | `#F5EFE2` | 3.13:1 | **3.12:1** | PASS (≥ 3:1) |

**Discrepancy note — §E kicker:** F reported 4.71:1 for `#C97B5C` on `#1F1A14`. T's independent computation yields 5.32:1. Both ratios clear the 4.5:1 AA threshold, so this is non-blocking. The discrepancy (0.61 ratio points) suggests F may have used an imprecise linearization or a different calculator. T's value is computed via the canonical WCAG 2.2 formula and is corroborated by the hex decomposition: `#C97B5C` = rgb(201, 123, 92), luminance ≈ 0.2736; `#1F1A14` = rgb(31, 26, 20), luminance ≈ 0.0108; ratio = (0.2736 + 0.05) / (0.0108 + 0.05) = 5.32:1.

**Focus ring note:** F reported 3.13:1 vs T's 3.12:1 — a 0.01 rounding difference; immaterial.

All contrast checks pass at their respective thresholds.

---

## Mobile responsive verification

N/A — no responsive overrides in this cycle. F's change is a single `:root` token value in `base.css`. The token resolves uniformly at all viewports; no media queries were added or modified. The kicker typography (12px / 1.6px letter-spacing / Poppins 600) is unchanged. No touch-target verification required for this cycle.

---

## Computed-color cross-check (Playwright)

Playwright 1.59.1 (local `node_modules`) was used. Chromium launched with `--ignore-certificate-errors`. Each page was loaded with `waitUntil: 'networkidle'`. `getComputedStyle(el).color` was evaluated on `.theme--light .kicker--light`.

| Page | Kicker | Computed color | Expected | Result |
|---|---|---|---|---|
| `/about-us` (§B, SB kicker) | Track record | `rgb(142, 74, 42)` | `rgb(142, 74, 42)` | PASS |
| `/` (homepage) | Dogfooding | `rgb(142, 74, 42)` | `rgb(142, 74, 42)` | PASS |
| `/services` | Capacity | `rgb(142, 74, 42)` | `rgb(142, 74, 42)` | PASS |
| `/open-source-projects` | Testing tools | `rgb(142, 74, 42)` | `rgb(142, 74, 42)` | PASS |

Second Playwright pass evaluated all five kicker elements on `/about-us` directly:

| Kicker | Theme zone | Computed color | Result |
|---|---|---|---|
| "About" | `theme--white` | `rgb(142, 74, 42)` | PASS |
| "Track record" | `theme--light` | `rgb(142, 74, 42)` | PASS |
| "Open source" | `theme--white` | `rgb(142, 74, 42)` | PASS |
| "Dogfood" | `theme--light` | `rgb(142, 74, 42)` | PASS |
| "Get started" | `theme--dark` | `rgb(201, 123, 92)` | PASS |

All five /about-us kickers resolved to their expected colors. §E kicker confirms `rgb(201, 123, 92)` = `#C97B5C` (--accent, unchanged).

---

## Pa11y-ci results

**Command:**
```
npx pa11y-ci --config .pa11yci.json
```

**Raw output:**
```
Running Pa11y on 7 URLs:
 > https://pl-performantlabs.com.3.ddev.site:8493/ - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/services - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/about-us - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/articles - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/contact-us - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/how-we-do-it - 0 errors
 > https://pl-performantlabs.com.3.ddev.site:8493/open-source-projects - 0 errors

✔ 7/7 URLs passed
```

Allowlist unchanged (PC-5 confirmed). **PASS — 0 errors across all 7 URLs.**

---

## Acceptance criteria status

| Criterion (from issue) | Evidence | Result |
|---|---|---|
| §B (Track record) kicker computes to `rgb(142, 74, 42)` | Playwright: `rgb(142, 74, 42)` on `/about-us` `.theme--light .kicker--light` | PASS |
| §D (Dogfood) kicker computes to `rgb(142, 74, 42)` | Playwright: same selector, same computed value | PASS |
| §A and §C kickers continue at `rgb(142, 74, 42)` — no regression | Playwright per-kicker pass: "About" = `rgb(142,74,42)`, "Open source" = `rgb(142,74,42)` | PASS |
| §E kicker continues at `rgb(201, 123, 92)` — no regression | Playwright: "Get started" = `rgb(201,123,92)` | PASS |
| Root cause documented in handoff-F | F's handoff §"Root cause" and §"Layer decisions" fully documents L3 trace | PASS |
| Cross-page grep matrix in handoff-F | F's §"Cross-page grep matrix" enumerates all 5 consumer pages | PASS |
| No regression on `/services` or `/open-source-projects` | HTTP 200 on both; Playwright computed color = `rgb(142,74,42)` on both kickers | PASS |
| No `!important` introduced | `git diff ... \| grep '!important'` — empty output | PASS |
| Tier 1 (curl/grep) passes | All T1 checks above: PASS | PASS |
| Tier 2 (ARIA / structural + contrast) passes | All T2 checks above: PASS | PASS |
| Tier 3 per-section delta §B and §D flip from DELTA to MATCH | Out of scope for T; deferred to S | DEFERRED TO S |
| Pa11y with allowlist: 0 errors; allowlist NOT edited | 7/7 URLs passed; `.pa11yci.json` not modified | PASS |
| WCAG 2.2 AA contrast `rgb(142,74,42)` on `#F5EFE2` ≥ 4.5:1 | T computed 5.79:1 | PASS |

---

## Blocking issues

None. All T1 and T2 checks pass. Pa11y 0 errors. Playwright computed-color confirmed on all four cross-page consumers. The §E contrast discrepancy (F: 4.71:1, T: 5.32:1) is non-blocking — both values clear the 4.5:1 floor.

---

## Advisory notes

- **§E contrast discrepancy:** F reported `#C97B5C` on `#1F1A14` as 4.71:1. T independently computes 5.32:1 via WCAG 2.2 formula. The difference suggests F used a calculator with a different linearization path. Both pass; no action required for this cycle, but F should calibrate their contrast tool before future cycles.
- **Pre-existing watchdog errors:** The Canvas `AssertionError` (ID 5086, 12/May 10:07) and `LogicException` (ID 5084, 12/May 07:23) are pre-existing, not caused by Cycle 3. They do not affect page rendering (all four pages return 200 and render kickers correctly). S should be aware these are ongoing background noise.
- **Token redundancy:** After this fix, `--pl-accent-deep` and `--pl-accent-deep-on-light` are now identical values (`#8E4A2A`). The second token exists architecturally as a hook for future warm-surface differentiation. This is intentional per F's autonomous decision 1 (L3 over L5). No action needed; S may note in Cycle 5 wrap whether to consolidate.

---

T complete, no blocking issues. Ready for S.
