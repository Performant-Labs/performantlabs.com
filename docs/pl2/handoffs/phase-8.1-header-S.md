# Handoff-S: Phase 8.1 — Site header parity

**Date:** 2026-05-10
**Branch:** `aa/pl-homepage-phase-8.1-header`
**Issue:** `docs/pl2/handoffs/phase-8.1-header-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/phase-8.1-header-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/phase-8.1-header-F.md`
**Diagnostic baseline:** `docs/pl2/handoffs/header-reassess-20260510.md`
**Operator-facing report:** [`phase-8.1-header-report.html`](phase-8.1-header-report.html)

---

## T precondition

Confirmed: T reported zero blocking issues. All 7 acceptance criteria PASS, all six regression checks confirmed, three advisory notes only (focus trap missing, aria-label text vs visually-hidden span, unstaged `views.view.articles.yml`, minor WCAG ratio rounding).

## Tool preconditions

- Chrome MCP tab-group not used (Playwright was the rendering authority for this audit, per S protocol — Chrome MCP viewport is locked to host display).
- Playwright present at `node_modules/playwright`; chromium launched with `ignoreHTTPSErrors: true` to handle ddev's mkcert cert chain.
- ImageMagick `compare` and `magick` resolved on PATH.
- Preview server live on `http://localhost:8765` (HTTP 200 on `/homepage.html`).
- Live site: `https://pl-performantlabs.com.3.ddev.site:8493/` — Playwright fetched cleanly.

---

## Tier 3 visual audit

### Whole-page and header-band pixel-diff results

| Viewport | Live full-page | Preview full-page | Whole-page AE | Whole-page Δ% | Header-crop AE (top 150 px) | Header-crop Δ% | Baseline (pre-8.1) |
|---|---|---|---:|---:|---:|---:|---:|
| 1280 × 800  | 1280 × 5348 | 1280 × 4341 | 3,468,850 | 50.67% | 6,791 | **3.54%** | 11.98% |
| 768 × 1024  | 768  × 6418 | 768  × 4829 | 2,316,680 | 47.00% | 2,831 | **2.46%** | 14.53% |
| 375 × 667   | 375  × 7804 | 375  × 6166 | 1,372,640 | 46.90% | 2,484 | **4.42%** | 16.22% |

**Headline:** header-crop deltas dropped 71%, 83%, and 73% versus the diagnostic baseline. The whole-page deltas (~47–51%) are dominated by the cumulative ~1000–1600 px height difference between live and preview that still exists because sub-cycles 8.3 (logo-grid text fallback) and 8.6 (footer-CTA polish, FAQ icons, footer casing) have not yet run. Per the issue scope, those sections are out of scope for sub-cycle 8.1; their deltas do not feed the 8.1 verdict.

### Per-section delta description

**Header band — 1280** — `MATCH`
Wordmark (P-badge + "performant labs" wordmark text) at left; six nav links inline ("Services", "How we do it", "Articles", "Open source projects", "About us", "Contact us") with no wrapping. No CTA pill. Header height ~73 px (T's Playwright bbox). The 3.54% header-crop delta comes from a horizontal offset of the nav cluster: live's nav spans roughly x=325 to x=1056 with ~220 px of empty space on the right; preview's nav spans ~x=530 to x=1200 with ~80 px right whitespace. The empty `header-navigation-wrapper__third` div renders as zero-width — no phantom whitespace, no extra divider — so T's flag check passes. The visual difference is that live's `display: contents` flex bubble plus the now-empty third slot doesn't push the nav cluster as far right as the preview does. Non-blocking; no wrap, no overlap, no missing affordance.

**Header band — 768** — `MATCH`
Wordmark at left, hamburger glyph at right. Live renders the hamburger as a borderless icon (`☰` glyph only); preview wraps the icon in a rounded-rectangle button frame (subtle 1 px border, ~6 px corner radius). Touch target is 44×44 on both per T. Header height ~73 px. The 2.46% delta is concentrated almost entirely in that hamburger-frame styling difference. Non-blocking — both render an obvious hamburger affordance and meet WCAG 2.5.5.

**Header band — 375** — `MATCH`
Same pattern as 768. Header height ~73 px. The slightly higher 4.42% delta vs 768's 2.46% comes from the hamburger occupying a larger relative fraction of the 375 px viewport width.

### Tier 3 Desktop (1280 px)

- Wordmark P-badge + text rendering: matches preview spec (28 px teal disk with white "P", display font medium 18 px).
- Six nav links, ink color, gap matches `var(--space-xl)`.
- No "Book a testing review" pill in header (T grep confirmed both occurrences are in body CTAs).
- Header height: 73 px per T's Playwright bbox; matches preview target.
- Hairline border-bottom in canvas color: present.

### Tier 3 Mobile (375 px)

- Wordmark + hamburger only.
- Hamburger 44×44 (per T's served CSS check); meets WCAG 2.5.5.
- Header height: 73 px per T.
- No horizontal scroll on the page itself.
- Touch target visually large enough.

---

## Design brief compliance

| Token / spec | Brief value | Rendered value | Match |
|---|---|---|---|
| Header height (≥992 px) | ~73 px | 73 px (T Playwright bbox) | YES |
| Header height (<992 px) | ~73 px | 73 px (T Playwright bbox) | YES |
| Wordmark P-badge | 28 × 28 teal disk, white "P" | matches preview (visual) | YES |
| Wordmark text | display font medium 18 px | matches preview (visual) | YES |
| Primary nav links count | 6 | 6 (T curl grep) | YES |
| Primary nav link text color (resting) | `#2A2520` | matches; ratio 14.8:1 / 15.18:1 vs white | YES |
| Primary nav link hover color | `#0F6F8A` | matches; ratio 5.74:1 / 5.55:1 vs white | YES |
| Right-side CTA pill | absent | absent (T confirmed `header-navigation-wrapper__third` empty) | YES |
| Hamburger trigger breakpoint | < 992 px | `@media (max-width: 991px)` rule served | YES |
| Hamburger size at < 992 px | 44 × 44 | 44 × 44 (T served CSS) | YES |
| Hamburger `aria-expanded` | required | set on init by `primary-menu.js` | YES (JS-hydrated) |
| Hamburger accessible name | "Open menu" via `aria-label` | "Menu" via `<span class="visually-hidden">` | DEVIATION (functionally equivalent — see Advisory) |
| Hairline border-bottom | `1px solid var(--hairline)` | present | YES |

---

## WCAG 2.2 AA audit

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | PASS | Static interactive order: logo → 6 nav links → page content → footer. F confirmed via Playwright. No focus traps in resting state. |
| Focus ring visibility | PASS | `--theme-focus-ring-color` resolves through unchanged tokens; no change this cycle, prior PASS retained. |
| Forced-colors mode | PASS | Header surfaces use system-respecting tokens; no hard-coded colors block the reverse-contrast adjustment. |
| Reduced-motion | PASS | No new transitions introduced; existing neonbyte hamburger transitions honor the user agent preference. |
| 200% zoom | PASS | At 200% zoom on a 1280 viewport (effective 640), the layout transitions through the hamburger breakpoint cleanly (≤ 991 trigger). No clipping observed in either screenshot path. |
| Heading hierarchy | PASS | Single H1 ("Ship Drupal releases with confidence."); 7 H2s, 6 H3s, no skipped levels (T2-1). |
| Image alt text | PASS | Wordmark logo has descriptive alt; no new images introduced this cycle. |
| Mobile touch targets (375 px) | PASS | Hamburger 44 × 44 meets WCAG 2.5.5. |
| Mobile typography scale | PASS | Existing `@media (width <= 1000px)` Poppins override unchanged and still served. |
| Mobile layout | PASS | Hamburger trigger fires at < 992 px; nav hides cleanly; no horizontal scroll on page. |

**Advisory:** the hamburger overlay does not implement a focus trap (neonbyte default). Issue scopes this as advisory rather than blocking; flagged here for follow-up.

---

## Static preview comparison

Section-by-section, live vs `docs/pl2/Previews/homepage.html`:

| Section | Status | Notes |
|---|---|---|
| Site header band — 1280 | MATCH | Layout, wordmark, 6 inline nav, no pill, ~73 px height. Minor nav cluster horizontal offset (3.54% header-crop delta), non-blocking. |
| Site header band — 768 | MATCH | Wordmark + hamburger, ~73 px height. Hamburger frame styling delta (2.46%), non-blocking. |
| Site header band — 375 | MATCH | Wordmark + hamburger, ~73 px height. Hamburger frame styling delta (4.42%), non-blocking. |
| Hero band — 768 | MATCH (8.2 + 8.5 regression check) | padding-inline 0 holds, no horizontal overflow, tight CTA-to-next-band gap. |
| Feature cards — 768 | MATCH (8.4 regression check) | 1-col stack of 3 cards (01 Tools / 02 Tests that heal themselves / 03 Experts alongside). |
| Logo grid text fallback — 768/375 | OUT OF SCOPE | Sub-cycle 8.3. |
| Footer CTA / FAQ icons / footer casing | OUT OF SCOPE | Sub-cycle 8.6. |

---

## Verdict

**PASS** — sub-cycle 8.1 acceptance criteria met. Ready for O to commit + merge.

- Site header at 1280: wordmark + 6 inline nav, no pill, no wrap, height parity ~73 px. ✓
- Site header at 768: wordmark + hamburger, height parity ~73 px. ✓
- Site header at 375: wordmark + hamburger, height parity ~73 px. ✓
- Hamburger 44×44 touch target with accessible name and `aria-expanded` toggle. ✓
- All three regression checks (8.2 hero padding-inline, 8.4 feature-card stack, 8.5 hero min-height) hold. ✓
- No phantom whitespace from the empty `header-navigation-wrapper__third` div. ✓
- Header-crop pixel-diff dropped 71% / 83% / 73% versus the pre-8.1 diagnostic baseline. ✓

The remaining ~3.54 / 2.46 / 4.42% header-crop deltas are stylistic spacing differences (1280 nav cluster offset; 768/375 hamburger frame treatment), not layout failures. They fall within the prompt's stated envelope ("Wordmark P-badge styling, nav-link font sizes, and exact spacing may produce some non-zero delta even on a 'match' — verify the crop visually rather than chasing 0%").

---

## Advisory notes (non-blocking)

1. **Focus trap missing in hamburger overlay** — neonbyte default. Tab key escapes overlay into page content when menu is open. Recommended follow-up sub-cycle for accessibility hardening.
2. **`aria-label` text vs visually-hidden span** — issue spec says `aria-label="Open menu"`; live uses `<span class="visually-hidden">Menu</span>`. Both expose an accessible name to AT and the live pattern degrades gracefully without JS. F documented this deviation; non-blocking.
3. **Unstaged `config/sync/views.view.articles.yml`** — pre-existing working-tree modification unrelated to 8.1. F's staged set is correctly scoped (3 files); operator should ensure this file isn't accidentally swept into the 8.1 commit.
4. **1280 nav cluster horizontal offset** — live nav cluster sits ~200 px left of preview because the empty `header-navigation-wrapper__third` slot doesn't carry a flex-grow spacer. Non-blocking visually, but a one-line CSS tweak (e.g. setting `margin-inline-start: auto` on the nav block, or giving the empty slot a min-width) would tighten parity to <1% if the operator wants pixel-perfection in a future polish cycle.
5. **Hamburger frame styling at 768/375** — preview wraps the glyph in a rounded-rectangle button outline; live renders a borderless icon. Consider in a future polish cycle if visual parity is desired.
