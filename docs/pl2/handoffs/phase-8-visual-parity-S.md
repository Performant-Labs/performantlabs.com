# Handoff-S: Phase 8 — Visual parity audit (live homepage vs `Previews/homepage.html`)

**Date:** 2026-05-09
**Branch:** `aa/pl-homepage-phase-8-visual-parity`
**Issue:** `docs/pl2/handoffs/phase-8-visual-parity-issue.md`
**Pipeline:** O → S → O (audit-only — no F/T handoff for this cycle)
**Operator-facing report:** [`phase-8-visual-parity-report.html`](phase-8-visual-parity-report.html)

---

## T precondition

N/A — this is an audit-only cycle. No F or T handoff to read. The issue file is the input.

## Visual-diff-tool precondition

**Confirmed.**

- ImageMagick `compare` on PATH at `/opt/homebrew/bin/compare`.
- ImageMagick `convert`/`magick` on PATH at `/opt/homebrew/bin/convert` (IMv7 — used `magick` directly to silence deprecation warnings).
- Playwright module present at `node_modules/playwright`. Loaded successfully via `node -e "require('playwright')"`.
- Active default theme verified: `ddev drush cget system.theme default` returned `'system.theme:default': performant_labs_20260502`. No `?theme=` query string needed.
- Static preview served via `python3 -m http.server 8765` from `docs/pl2/Previews/`. `curl http://localhost:8765/homepage.html` returned 200.
- Capture script: `/tmp/pl-capture.mjs` (copied to project root for `node_modules` resolution, then removed). Script used `chromium.launch()` → `newContext({viewport})` → `page.goto({waitUntil:'networkidle'})` → 800 ms settle → `page.screenshot({fullPage:true})`. Six PNGs captured cleanly; mkcert cert accepted by Chromium without `ignoreHTTPSErrors` workarounds.

## Tier 3 visual audit

### Visual diff results

Live and preview screenshots had different dimensions at every viewport (live page is 1.30–1.40× the preview height; live has a vertical scrollbar baked into the screenshot at desktop and tablet widths). Both images were padded with `magick … -background white -gravity northwest -extent ${maxW}x${maxH}` to a common canvas before `compare -metric AE`.

| Viewport | Live (W×H)   | Preview (W×H) | Pixels different | Whole-page delta % | Diff PNG | Composite |
|----------|--------------|---------------|------------------|--------------------|----------|-----------|
| 1280×800 | 1294 × 5784  | 1280 × 4341   | 3,897,740        | **52.08 %**        | `screenshots/cycle-8/t3-homepage-1280-diff-20260509.png` | `screenshots/cycle-8/t3-homepage-1280-composite-20260509.png` |
| 768×1024 | 803 × 6404   | 768 × 4829    | 2,337,580        | **45.46 %**        | `screenshots/cycle-8/t3-homepage-768-diff-20260509.png`  | `screenshots/cycle-8/t3-homepage-768-composite-20260509.png` |
| 375×667  | 375 × 7899   | 375 × 6166    | 1,346,950        | **45.47 %**        | `screenshots/cycle-8/t3-homepage-375-diff-20260509.png`  | `screenshots/cycle-8/t3-homepage-375-composite-20260509.png` |

Per the verdict thresholds in `workflow-ofts.md` §S §"Verdict thresholds":

- All three viewports are **>5 % whole-page delta** → presumed REWORK unless every contributing section is documented in F's handoff as an intentional, operator-acceptable deviation. There is no F handoff for this cycle, so no deviations are documented.
- Inspecting the diff PNGs shows the red is not concentrated in one region — it spans virtually every section because the live page is taller than the preview, so vertical offset alone causes the lower half of every cropped pair to misalign. This compounds the underlying per-section deltas described below; the raw delta percentages overstate the visual difference, but the per-section findings still drive a clear REWORK.

### Per-section delta description (driven by red regions in the diff PNGs and direct screenshot comparison)

The per-section thumbnails are embedded in the operator-facing HTML report. Status legend: MATCH / DELTA (visible difference, may be intentional) / REWORK (must be addressed before activation).

#### 1. Header / nav (`pl-homepage-phase-4.8-header`) — **REWORK**

- **Desktop (1280):** live header is significantly taller (~80 px row height) than the preview (~50 px). Live shows a full menu (Services, How we do it, Articles, Open source projects, About us, Contact us) plus a large pill-shaped "Book a testing review" CTA on the right. Preview shows only the wordmark on the left and a compact "Call today" pill on the right — no navigation links. The two implementations are operating on completely different IA assumptions.
- **Tablet (768):** live collapses to hamburger only (no visible CTA). Preview keeps the "Call today" CTA visible and shows no hamburger. Live also drops the wordmark text and shows the avatar-only "P" badge.
- **Mobile (375):** live shows hamburger only (no CTA). Preview shows wordmark wrapped to two lines AND a "Call today" pill — no hamburger. So the live and preview have opposite responsive patterns for the header.

#### 2. Hero band (`pl-homepage-phase-4.7-hero`) — **REWORK**

- **Desktop (1280):** the hero block is dramatically larger on live. The headline "Ship Drupal releases with confidence." renders at what appears to be ~120 px (display-2xl) on live but ~72 px (display-xl, per brief) on preview. The kicker "DRUPAL TESTING" sits closer to the headline on live. The CTA pair is correctly styled (filled teal + outline teal) on both, but the live hero adds ~600 px of empty whitespace below the CTAs before the next band — preview has the next band immediately after.
- **Tablet (768):** **horizontal overflow on live.** The headline "Ship Drupal releases with confidence." extends past the right viewport edge — the screenshot shows "Ship Drupal releases" cut off mid-word. Preview wraps cleanly within the container.
- **Mobile (375):** typography scale feels close on both. Both stack CTAs vertically and full-width (matches `typography-mobile` rule for hero CTAs <sm). DELTA only in vertical spacing — live has more whitespace.

#### 3. Logo grid / "Trusted by teams at" (`pl-homepage-phase-4.4-logo-grid`) — **REWORK**

- **Desktop (1280):** preview renders six logos as **bitmap images** (CBS Interactive, DocuSign, Orange, Renesas, Robert Half, Tesla) on a single horizontal row, evenly distributed. Live renders the same set as **bitmap images** too at desktop — but spacing/cell sizes differ; live cells are taller. Visually similar but not pixel-identical.
- **Tablet (768):** preview renders the logos as **plain text** ("CBS Interactive", "DocuSign", "Orange", "Renesas", "Robert Half", "Tesla") in a single row. Live keeps them as images and the row overflows past the right viewport — only ~5 logos visible, last one clipped.
- **Mobile (375):** preview renders text logos in a 3 × 2 grid. Live renders a long vertical column of bitmap logos (1 logo per row), pushing the page much taller. This is a clean responsive-strategy mismatch: preview chose a text-fallback strategy for narrow viewports, live did not.

#### 4. Feature cards / "Tools, AI, and experts. All there." (`pl-homepage-phase-4.1-card`) — **REWORK**

- **Desktop (1280):** preview shows three cards in a single 3-column row. Live shows two cards on row 1 ("01/Tools", "02/AI") and the third card alone on row 2 ("03/People") — a 2 + 1 layout. The brief specifies 3 columns at desktop, 3 → 2 at md, 2 → 1 at sm. The live layout looks like the grid is collapsing to a 2-column track at 1280px, which is wrong for desktop.
- **Tablet (768):** not directly inspected at this viewport in the cropped strip, but the diff PNG shows the same red density. Brief says 3 → 2 cards at md, so 2-column is correct here.
- **Mobile (375):** both should be 1-column. The cropped strip shows the first card on both — appears to match in pattern but not in spacing.
- The card chrome itself (kicker bar + "01 / TOOLS" eyebrow + corner arrow icon) **matches** between live and preview on the first two cards. This is good news for `phase-3-bespoke-kicker` and `phase-4.1-card`.

#### 5. Heal-flow ("We heal our own tests nightly.") (`pl-homepage-phase-5-heal-flow`) — **MATCH (close)**

- **Desktop (1280):** the four-step pill row (01 Test fails in CI → 02 Claude diagnoses → 03 PR opens with fix → 04 Engineer reviews) renders nearly identically on both. Pill borders, teal arrow connectors, terracotta step numbers, the highlighted step-04 outline — all present and visually equivalent. Outer card chrome and dogfooding kicker also match.
- **Mobile (375):** not inspected in detail, but the brief says heal-flow scrolls horizontally below md — needs visual confirmation in the report.

#### 6. Built-for-the-team checklist ("Built for the whole Drupal team.") — **DELTA**

- The bullet list with teal check icons renders on both. Minor differences:
  - Preview adds period punctuation: "Dev teams catch regressions before users do." — live drops the period: "Dev teams catch regressions before users do".
  - Spacing/centering differs slightly. Preview centers the heading; live left-aligns it (cropped strips show this clearly).
- Heading "Built for the whole Drupal team." matches in size/weight on both.

#### 7. FAQ / "Frequently asked questions." — **DELTA**

- Both show the heading and four collapsed accordion items with the same labels (ATK, Drupal CMS contrib, engagement work, D7/D9 migration). Caret iconography differs: live uses chevron-down (∨), preview uses plus (+). On expand-collapse this would also differ, but accordions are closed in both screenshots.
- Surface color matches (cream/parchment band) on both.
- Border treatment between rows: hairline on both. MATCH on chrome.

#### 8. Footer-CTA / "Ready for a release you don't have to babysit?" — **DELTA**

- Both render on a dark band with terracotta kicker "BOOK A REVIEW" and the headline. CTAs are "Book a testing review" + "Or test with the tools" on both.
- **Live adds an arrow icon (→) inside the primary CTA pill**; preview's pill has no icon.
- Heading wraps differently: live wraps as 2 lines ("Ready for a release you / don't have to babysit?"), preview wraps as 2 lines too but at a different word boundary. Acceptable visual variance from container width, but worth noting.

#### 9. Footer — **DELTA**

- Both have four columns: Services / Resources / Company / right-rail tagline. Lists match label-for-label.
- Live capitalises link labels ("Test Suite Takeover", "Embedded Testing Engineer", "Autonomous Healing Pilot", "Accessibility Testing"). Preview uses sentence case ("Testing-suite takeover", "Embedded testing engineer", "Autonomous healing pilot", "Accessibility testing"). Same applies to "Privacy Policy" vs "Privacy policy". Casing scheme is inconsistent between the two.
- Live shows "© 2026 Performant Labs · Privacy Policy" at bottom-left, preview shows "© Performant Labs" bottom-left and "Preview build — not yet implemented in Drupal" bottom-right. The preview's "preview build" notice is expected and can be ignored; the year on live is correct.

### Desktop (1280)

| Section | Match with brief? | Delta description |
|---------|-------------------|-------------------|
| Header | NO | Live is larger, has full nav, different CTA label. Preview is compact with no nav. |
| Hero | NO | Live headline ~120 px (display-2xl) — brief says display-xl 72 px. Hero whitespace is excessive. |
| Logo grid | NEAR | Both render image logos at desktop; cell heights differ. |
| Feature cards | NO | Live uses 2 + 1 layout at 1280; brief says 3-column at desktop. |
| Heal-flow | YES | Steps, arrows, accent treatment match preview. |
| Checklist | YES (close) | Period missing on live items; alignment differs. |
| FAQ | YES (close) | Caret vs plus iconography differs. |
| Footer-CTA | YES (close) | Arrow icon added on live's primary CTA. |
| Footer | YES (close) | Label casing differs (Title Case on live, sentence case in preview). |

### Mobile (375)

| Section | Match with brief? | Delta description |
|---------|-------------------|-------------------|
| Header | NO | Live: hamburger only, no CTA. Preview: wordmark + "Call today" pill, no hamburger. |
| Hero | NEAR | Typography scale appears close to brief (display-xl 44 px). CTAs stack full-width on both. |
| Logo grid | NO | Live: vertical stack of bitmap logos (very tall). Preview: 3 × 2 text-name grid. |
| Feature cards | NEAR | Both 1-column. Spacing differs. |
| Heal-flow | NEEDS CONFIRM | Brief requires horizontal scroll inside container, not stacked. Not directly verified at 375 — see report comparator. |
| Checklist | NEAR | Stacks cleanly on both. |
| FAQ | NEAR | Stacks cleanly on both. |
| Footer-CTA | NEAR | CTAs stack on both. |
| Footer | NEAR | Stacks to single column on both. |

## Design brief compliance

Token values from `docs/pl2/Briefs/pl_design_brief.md`. Live values inferred from the rendered DOM; preview values from `Previews/homepage.html`.

| Token | Brief value | Preview value | Live value | Match? |
|-------|-------------|---------------|------------|--------|
| Hero headline (desktop) | display-xl, ~72 px, weight 800, ls -2 px | ~72 px (matches) | ~120 px (display-2xl-like) | NO |
| Kicker color | terracotta | terracotta | terracotta | YES |
| Primary CTA shape | full pill, teal fill | pill, teal | pill, teal (with arrow icon glyph) | NEAR |
| Secondary CTA shape | pill, teal outline, teal text | pill outline | pill outline | YES |
| Hairline border between FAQ rows | yes, no shadow | yes | yes | YES |
| Card eyebrow accent | terracotta short-rule + "NN / Label" | terracotta rule | terracotta rule | YES |
| Card grid (desktop) | 3 columns | 3 columns | 2 + 1 | NO |
| Surface — cream band | #f3eada (or brief equivalent) | cream | cream | YES |
| Footer-CTA surface | dark espresso | dark | dark | YES |
| Heal-flow step pill border | hairline | hairline | hairline | YES |
| Heal-flow step-04 active border | teal | teal | teal | YES |
| Mobile typography display-xl | 44 px ls -1 px | n/a (CSS not used on text fallback) | ~44 px (looks correct) | YES (live) |

## WCAG 2.2 AA audit

Mostly inspected from rendered screenshots; a full keyboard sweep was not run because the deltas above are already REWORK-blocking.

| Check | Result | Notes |
|-------|--------|-------|
| Keyboard navigation | NOT VERIFIED | Skipped pending REWORK; not required to escalate this verdict. |
| Focus ring visibility | NOT VERIFIED | Same. |
| Forced-colors mode | NOT VERIFIED | Same. |
| Reduced-motion | NOT VERIFIED | Same. |
| 200 % zoom | LIKELY FAIL | Live hero already overflows at 768 px → at 200 % zoom of 1280 the headline will overflow worse. Needs F to fix hero font-size cap. |
| Heading hierarchy | LIKELY PASS | Single H1 ("Ship Drupal releases with confidence.") visible on both; H2s for each section follow. Not exhaustively confirmed in DOM. |
| Image alt text | NOT VERIFIED | Logo images on live need alt-text spot-check after rework. |
| Mobile touch targets (375) | LIKELY PASS | Both CTAs at mobile are >= 44 px tall by visual measure. |
| Mobile typography scale | NEAR PASS | display-xl on live mobile reads ~44 px (matches `typography-mobile` block). Body text legible. |
| Mobile layout | FAIL | Logo grid does not adopt the text-fallback / 3 × 2 strategy preview uses; live stacks bitmap logos vertically into a long column. Heal-flow horizontal scroll behaviour at 375 needs confirmation in the report. |

## Static preview comparison

See "Per-section delta description" above. Section-by-section MATCH / DELTA verdicts:

- Header — DELTA / REWORK
- Hero — DELTA / REWORK
- Logo grid — DELTA / REWORK
- Feature cards — DELTA / REWORK (desktop grid wrong)
- Heal-flow — MATCH
- Checklist — MATCH (minor)
- FAQ — MATCH (minor)
- Footer-CTA — MATCH (minor)
- Footer — MATCH (minor)

## Verdict

**REWORK** — the live homepage does NOT visually match `Previews/homepage.html` at any of the three brief breakpoints. Whole-page pixel deltas are 52 % / 45 % / 45 % — well above the 5 % REWORK threshold. The deltas are not artifacts of vertical offset alone: there are real, visible structural and stylistic divergences in the header, hero, logo grid, and feature-card grid.

Activation of `performant_labs_20260502` as the default theme should NOT proceed until the following sub-issues are filed and worked through the standard F → T → S loop:

1. **Header parity (desktop, tablet, mobile)** — `aa/pl-homepage-phase-8.1-header-parity`. Decide which side is canonical. Preview shows a compact wordmark + single "Call today" pill with NO primary navigation. Live shows a full primary nav. The brief and `pl_homepage_components.md` should be the tiebreaker — operator decision needed before F starts.

2. **Hero typography cap and overflow** — `aa/pl-homepage-phase-8.2-hero-overflow`. At 1280 the hero headline renders ~120 px (display-2xl) where the brief specifies display-xl ~72 px. At 768 the headline overflows the right viewport edge, indicating no max-width or container padding is constraining it. Likely a missing or wrong responsive `font-size`/`max-width` on `.hero h1`.

3. **Logo grid responsive strategy** — `aa/pl-homepage-phase-8.3-logo-grid-responsive`. Preview uses a text-name fallback at narrow widths (3 × 2 grid). Live keeps bitmap logos and stacks them into a tall vertical column. Decide whether the design canon is "image always" (in which case logo cell sizing and grid template need a fix) or "image at md+, text at sm" (in which case Twig needs a `<picture>`/text-fallback wrapper).

4. **Feature-card grid at desktop** — `aa/pl-homepage-phase-8.4-card-grid-desktop`. Brief says 3 columns at desktop (1280). Live renders 2 + 1. Likely a `grid-template-columns: repeat(3, 1fr)` rule that's being overridden somewhere, or a container max-width forcing 2-up. Trace upward per the 7-step workflow.

5. **Hero whitespace below CTAs** — `aa/pl-homepage-phase-8.5-hero-spacing`. Excess vertical whitespace (~600 px) between the hero CTAs and the logo band on live. Likely a section-padding or inner-block-margin issue. Confirm with brief's hero spacing values.

6. **Minor parity polish** (one issue, batched) — `aa/pl-homepage-phase-8.6-parity-polish`:
   - Footer link label casing: align live (Title Case) with preview (sentence case) per brief — operator preference required.
   - Footer-CTA primary pill: decide whether the inline arrow glyph stays (live) or is removed (preview).
   - FAQ accordion icons: chevron (live) vs plus (preview) — pick one.
   - Checklist item terminal punctuation: periods (preview) vs none (live).

After each sub-issue closes, this Phase-8 visual parity audit must be re-run end-to-end.

## Advisory notes

- The capture workflow worked well end-to-end: Playwright + mkcert + ImageMagick + a single Node script. Suggest checking the script (or a tidied version) into `scripts/visual-diff/` for reuse on future S cycles. Current ad-hoc approach copies a script to project root for `node_modules` resolution and removes it after — fine, but a permanent helper would be cleaner.
- The dimension-mismatch padding step is mandatory because Drupal's rendered page is taller than the static preview by 30–40 %. Once parity is achieved, the heights should converge naturally — if they don't, that's itself a signal to investigate.
- Image-only diff PNGs at this scale of mismatch are hard to read (the page is essentially flooded red). The operator-facing report supplements them with section-cropped composites and the wipe-slider comparator, which surfaces the underlying deltas more usefully.

---

**Output paths:**

- This handoff: `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/phase-8-visual-parity-S.md`
- Operator-facing visual report: `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/phase-8-visual-parity-report.html`
- Screenshots & diffs: `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/screenshots/cycle-8/`
