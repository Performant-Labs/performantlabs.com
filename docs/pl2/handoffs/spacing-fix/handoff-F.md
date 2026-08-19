# Handoff-F: Spacing / rhythm fix — /how-we-do-it, /open-source-projects, sitewide region-highlighted band

**Date:** 2026-07-22
**Branch:** `fix/how-we-do-it-spacing`
**Issue:** ad hoc (André, relayed via O) — "the spacing is off on this one" (/how-we-do-it),
escalated mid-cycle to full treatment for /open-source-projects (spacing + broken card
imagery), plus a sitewide `.region-highlighted` color-continuation defect surfaced by the
concurrent aftersight-fix lane.

## Confirmation table (autonomous mode — informational, not a pause gate)

| Field | Value |
|---|---|
| Page(s) | `/how-we-do-it`, `/open-source-projects` (full treatment); sitewide sweep of `/`, `/services`, `/about-us`, `/automated-testing`, `/contact-us`, `/how-we-built-this-site` |
| GitHub issue | none filed — task relayed directly by O/coordinator |
| Working branch | `fix/how-we-do-it-spacing` (off `main`) |
| Runbook phase | ad hoc polish fix, not a numbered runbook phase |
| Input docs read | `feature-implementor.md`, `drupal-canvas-sdc.md` adapter, `frontend-pipeline-profile.md`, `canvas-update-checklist.md`, `keytail-design/wireframe-276/RATIONALE.md`, `base.css` (Phase 8.7 rhythm-token comments), `dy-section.css`, `card.css`, `region.css` (neonbyte), `book-landing.css` |
| Acceptance criteria count | 3 explicit asks (spacing fix + sweep; OSP image fixes; region-highlighted color fix) — no formal checkbox list existed, criteria derived from the brief's prose |
| Handoff doc path | `docs/pl2/handoffs/spacing-fix/handoff-F.md` (this file) |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | each component's `.component.yml` under `web/themes/dripyard_themes/{dripyard_base,neonbyte}/components/` |

## What was done

- `web/themes/custom/performant_labs_v2/css/components/card.css` — added `.card__top` /
  `.card__top img` rule: swaps `object-fit: cover` → `contain`, drops the forced 4:3
  aspect-ratio for a fixed 160px height, adds padding + a bounded `--theme-surface-alt`
  background. Fixes both OSP "Our testing tools" washed-out placeholders and "Community
  contributions" cropped-logo cards.
- `web/themes/custom/performant_labs_v2/css/components/dy-section.css` — added
  `.dy-section--other-modules .grid-wrapper__grid .card { max-width: 360px; justify-self:
  center; }`. Fixes the single "Payment Stripe" chip card stretching to the full 900px grid
  track.
- `web/themes/custom/performant_labs_v2/css/base.css` — added
  `html.theme--white .region-highlighted { background: #FFFFFF; ... }`. Fixes the sitewide
  cream breadcrumb band mismatched against the white header/hero, per the aftersight-fix
  lane's finding. Confirmed it does not regress book-landing pages (their own
  `body:has(.book-landing) .region-highlighted` rule in `book-landing.css` loads after
  `base.css` in the page `<head>` and wins the equal-specificity tie by source order —
  verified empirically on `/layout-builder-kit`).
- No canvas assembly scripts touched — neither page has a page-specific script in
  `scripts/`, and no Canvas component `inputs`/`component_version` were modified (CSS-only
  change).
- Screenshots: `docs/pl2/handoffs/spacing-fix/shots/` — before/after at 360/768/1280 for
  both pages, plus supporting shots (`homepage-1280-reference.png`,
  `region-highlighted-after-top.png`, `book-landing-unaffected.png`).

## Root-cause finding: /how-we-do-it's reported "oversized gaps" do not reproduce

Before writing any CSS I measured every `.dy-section`'s actual computed `padding-top/bottom`,
`.dy-section__header` `margin-bottom`, and heading→body pixel gap on `/how-we-do-it`, the
homepage, and `/open-source-projects` at 1280 and 360px (script in scratchpad, not committed).
Result: **/how-we-do-it's live numbers already match the homepage/reference rhythm scale
exactly** — 96px section padding desktop / 64px mobile (`--spacing-component`), 48px
header-to-body gap desktop+mobile (`--spacing-component-internal`, or the page's own
already-tuned 32px `--kicker-inline`/`--tight-header` variant, itself the product of prior
work: `docs/pl2/handoffs/...` "Batch 2 Issue 3" / Sprint 10 Cycle 2b.3, both documented
in-file in `dy-section.css`). Section-to-section abutment gap measured 0px everywhere (no
double-margin defect). Full-page before screenshots (`how-we-do-it-*-before.png`) confirm a
tight, consistent rhythm with no visible oversized gap anywhere, including "What we don't do."

**Conclusion:** the oversized-gap symptom André described does not reproduce on the current
codebase — it was very likely fixed by the prior Sprint 10 / Batch 2 work before this cycle
started, and his screenshot either predates that fix or was actually showing
`/open-source-projects`'s far more visible defects (broken card imagery, the floating chip
card), which are real, confirmed, and fixed below. **No spacing CSS change was made to
/how-we-do-it** — the "Layer decisions" section below documents this as a considered,
evidence-based no-op rather than an unexamined skip.

## Layer decisions

**1. OSP card image fit (`card.css`).**
- Component-reuse check: `card`/`card-canvas` (dripyard_base) is the only card component
  with an image slot anywhere in the theme chain. No sibling component was a better fit.
  Usage audit (T1, curl+evaluate across `/`, `/services`, `/how-we-do-it`, `/about-us`,
  `/automated-testing`, `/contact-us`, `/how-we-built-this-site`) confirmed `.card img`
  renders **only** on `/open-source-projects` — zero photo-card consumers exist anywhere
  else, so a general (not page-scoped) `.card__top img` rule carries no collision risk today.
- Bottom-up trace: `.card__top img { aspect-ratio: 4/3; object-fit: cover }` (dripyard_base
  `card.css`) ← every image asset actually used is a wide/short logo (2.2:1 to 5.4:1 aspect
  ratio) ← `cover` on a 4:3 box crops/zooms severely.
- Top-down: L1 not config (no image-style prop drives fit); L3 not a token (fit/box rule is
  component-internal); `card-canvas.component.yml` has no `additional_classes` prop, so a
  per-instance scope isn't available without a schema change (out of scope for an asset-fit
  fix). **L5 correct** — CSS override via `libraries-extend` (already wired: `card:` library
  in `performant_labs_v2.libraries.yml`).

**2. OSP "Other modules" chip card width (`dy-section.css`).**
- Bottom-up trace: `.grid-wrapper__grid` (dripyard_base `grid-wrapper.css`) is a 12-column
  CSS grid; the one "Payment Stripe" card has no `grid-column: span N`, so it fills the full
  track (== the section's 900px `max-width`, itself an existing Layer-5 rule from "M5 Cycle
  2"). The M5 Cycle 2 comments already call this a "chip-style card" — the grid-width
  constraint was applied to the wrapper but never to the card itself.
- Top-down: L1/L3 not applicable (component-instance grid-item sizing, not config or a
  token). **L5 correct**, same selector family as the existing M5 Cycle 2 rules in this file.
- First attempt used `justify-content: center` on the grid, which does nothing for a
  single-item 1fr track (no free space to distribute at the track level) — corrected to
  `justify-self: center` on the card itself, verified via computed-style measurement
  (card centered at `x = grid.x + (900-360)/2`, confirmed both at 1280 and 360, where the
  360px max-width behaves as a ceiling, not a fixed width — no clipping).

**3. Sitewide `.region-highlighted` white-continuation (`base.css`).**
- Root cause: neonbyte (parent theme, **advisory-upstream, not edited**) paints
  `.region-highlighted` with `--theme-surface-alt`, which resolves to cream (`#F5EFE2`)
  under the white zone — correct in isolation, wrong given the header above and the first
  section below are both pure white.
- Discovered mid-fix that `.theme--white` in this codebase is applied directly on `<html>`,
  not as a per-section wrapper — the existing `html .theme--white { }` blocks in `base.css`
  (with a space) are, strictly read, unmatchable descendant-combinator selectors; they only
  "work" because an unconditional `:root` fallback block earlier in the same file happens to
  supply the same values. This is a **pre-existing latent authoring inconsistency**, flagged
  here for A/S awareness but **not fixed** in this pass (out of scope, and the existing
  `:root` fallback means nothing is currently broken from it — fixing it site-wide is a
  separate, larger cleanup with its own blast-radius surface). My new rule uses the correct,
  actually-matching selector: `html.theme--white .region-highlighted` (no space).
- Verified empirically (not just by selector reasoning) that book-landing pages are
  unaffected: `book-landing.css`'s `body:has(.book-landing) .region-highlighted` rule has
  equal specificity (0,2,0) to my new rule and loads after `base.css` in the page's actual
  `<head>` (confirmed via curl on `/layout-builder-kit`), so it wins by source order — cream
  band on book pages is untouched, screenshot-verified.
- Top-down: L1 not config; L2 not OKLCH; **L3 correct** — `html.theme--white` component-
  wrapper token/background override, the documented pattern in `docs/pl2/theme-change.md`
  for a parent-theme region default needing a themed-zone override. Never patches
  `.region-highlighted`'s rendered markup or the neonbyte source file directly.

## Architecture notes for A

- All three fixes are Layer 5 (two) / Layer 3 (one) CSS additions to already-existing,
  already-`libraries-extend`-wired stylesheets — no new libraries, no new `.libraries.yml`
  entries, no Canvas component schema or `inputs` changes, no `component_version` touched.
- The `card.css` fix is intentionally **not** page-scoped (applies to any future `.card__top
  img` instance sitewide) because the current codebase has zero competing photo-card use —
  documented in-file with the exact usage-audit evidence so a future page adding a
  photographic card image knows to re-scope.
- The `base.css` `.region-highlighted` fix relies on `book-landing.css`'s later load order
  to avoid a specificity collision rather than an explicit `:not()`/`:has()` exclusion — this
  is a **soft dependency on library load order**. If `book-landing.css`'s attach point or the
  library's weight ever changes such that it loads before `base.css`, the cream band on book
  pages would regress to white. Flagging for A: worth a follow-up hardening (e.g. bump
  specificity or add an explicit exclusion) if load-order stability is a concern, but not
  done here to avoid scope creep beyond the reported defect.
- Pre-existing (not introduced by me, not touched): `html .theme--white { }` selector
  mismatch noted above in Layer decision 3. Also pre-existing: three blast-radius findings on
  `/how-we-do-it` and `/open-source-projects` (`.primary-menu` nav-related, `grid-wrapper`
  centering, `canvas-image` sibling-selector) — all WARNING severity, all present before my
  changes, none touch any selector I added.
- **Branching note (per coordinator relay):** the aftersight-fix lane committed its own
  `dy-section.css` changes on `fix/aftersight-page-visual-pass` (PR #290, not yet merged to
  main). This branch (`fix/how-we-do-it-spacing`) was cut fresh from `main`, **not** from
  that branch, per the coordinator's explicit instruction — so my `dy-section.css` diff is
  additive against `main`'s version, not against #290's. **O/A should expect a merge overlap
  in `dy-section.css` when both branches land** (both append new rules to the end of the
  same file; textually independent, should merge cleanly, but sequence the merges and re-diff
  after both land to confirm no rule got shadowed).
- Working-tree incident: mid-task I ran `git checkout main -- .` while still on
  `fix/aftersight-page-visual-pass` (the ambient branch left checked out from the concurrent
  agent) to inspect state, which silently discarded my then-uncommitted `card.css` and
  `dy-section.css` edits (destructive per-file checkout against the currently active branch,
  not a branch switch). Caught immediately via a `grep -c "spacing-fix"` sanity check
  (returned 0), redone from a freshly created `fix/how-we-do-it-spacing` branch off `main`
  before any further work. No corrupted or partial state was committed — flagging for the
  record since it's exactly the kind of git-safety near-miss the pipeline conventions warn
  about; nothing destructive was pushed or committed.

## Deviations from spec

- **/how-we-do-it received no spacing CSS change.** The brief assumed a live, reproducible
  oversized-gap defect; measurement showed the page's rhythm already matches the reference
  scale exactly (see "Root-cause finding" above). Conservative interpretation: do not invent
  a fix for a symptom that doesn't reproduce — report the measured evidence instead. If
  André's screenshot is available for a byte-level pixel comparison, a follow-up should
  confirm whether it predates the Sprint 10 fix or was actually `/open-source-projects`.
- Scope-cap split: the coordinator's mid-task elevation of `/open-source-projects` to full
  treatment (spacing + two image-fit defects) plus the sitewide `.region-highlighted` fix
  pushed this cycle to 2 full pages + 1 sitewide token change — at the edge of the ~6-file /
  one-component-family cap. Self-decided (autonomous mode) to do all three as one pass rather
  than split further, because: (a) all three fixes are small, independent, low-risk CSS
  additions (not a new component family each); (b) the sitewide fix was a one-rule, low-blast-
  radius addition, verified with the gate; (c) splitting further would have meant a second
  full O→F→...→S cycle for one CSS rule, which is disproportionate. This is the "one split
  per cycle" self-decision the pipeline allows; no further sub-splitting was needed.
- No other page required "real per-page work" per the sweep — see sweep results below, all
  clean.

## Verification results (T1 + T2)

**T1 — cache clear + curl/grep:**
```
$ ddev drush cr
[success] Cache rebuild complete.

$ curl -sk https://performant-labs.ddev.site:8493/how-we-do-it (before) vs (after)
text-content diff: EMPTY (byte-identical copy, confirmed via tag-stripped text comparison)

$ curl -sk https://performant-labs.ddev.site:8493/open-source-projects (before) vs (after)
text-content diff: EMPTY

$ grep -c "card__top img" .../card.css   → 3 (rule landed in served CSS)
$ grep -c "other-modules .grid-wrapper__grid .card" .../dy-section.css → 1 (landed)
$ curl .../how-we-do-it | grep -o 'href="...css..."' → card.css, dy-section.css, base.css
  all load unaggregated (per-file, not bundled) — edits are live, not cache-stale.
```

**Watchdog (severity ≥ 3), before vs after change:**
- Before my session started: several stale entries all timestamped 07:48 (same day, prior to
  my cache clear) — `theme neonbyte does not exist`, `html-header` component not found,
  `Open Source Projects` Twig runtime errors. These were **stale cache artifacts** from
  concurrent DB activity by the aftersight-fix agent; a single `ddev drush cr` made both pages
  return HTTP 200 with no further errors.
- After all my changes + final cache clear: `ddev drush watchdog:show --count=5 --severity=3`
  → `No log messages available.` Clean.

**T2 — structural:**
- No horizontal overflow at 360/768/1280 on `/how-we-do-it`, `/open-source-projects`,
  `/services`, `/aftersight` (evaluated `scrollWidth > clientWidth`, all `false`).
- Heading hierarchy unchanged (no heading-level edits made anywhere in this pass).
- Book-landing page (`/layout-builder-kit`) screenshot-verified unaffected by the
  `.region-highlighted` change — its own deliberate cream-band treatment (breadcrumb above
  H1, cream starting at the "Chapters" panel) renders exactly as before.

**Blast-radius gate (`cascade-map.cjs` + `perturb.cjs`, `~/Projects/website-audit/core/tools/`):**
```
$ NODE_PATH="$PWD/node_modules" node cascade-map.cjs https://.../open-source-projects
  375px: 3 boundaryEscapes — all pre-existing (.header-navigation-wrapper .primary-menu,
         .dy-section--centered-white .dy-section__content, .primary-menu)
  1280px: same 3, identical selectors

$ NODE_PATH="$PWD/node_modules" node perturb.cjs .../open-source-projects cascade-osp.json --max-targets 10
  3/3 perturbed, 0 deferred, 0 waived.
  Verdicts: 1x DORMANT/WARNING, 2x ACTIVE/WARNING — all on selectors unrelated to my changes
  (.primary-menu, .dy-section--centered-white .dy-section__content). No BLOCK verdicts.

$ NODE_PATH="$PWD/node_modules" node cascade-map.cjs https://.../how-we-do-it
  375px/1280px: 4 boundaryEscapes, all pre-existing (.primary-menu, grid-wrapper,
  canvas-image sibling selector) — none touch .card__top, .dy-section--other-modules,
  or .region-highlighted.
```
No new ACTIVE boundary-escape on a high-risk layout/box/position property was introduced by
any of my three rules. Gate verdict: **clean** — pre-existing findings noted, not blocked.

## WCAG contrast ratios

| Element | Foreground | Background | Ratio | Pass/fail |
|---|---|---|---|---|
| Breadcrumb link ("Home") | `#8E4A2A` (terracotta-deep) | `#FFFFFF` (new, was `#F5EFE2`) | 6.64:1 | AA/AAA pass (improved from 5.79:1 on cream) |
| Breadcrumb current-page text | `#5C544C` (medium) | `#FFFFFF` (new, was `#F5EFE2`) | 7.43:1 | AAA pass (improved from 6.48:1 on cream) |
| OSP card-top logo tile background | n/a (decorative image, no text) | `--theme-surface-alt` vs `--card-background` | n/a | No WCAG text-contrast requirement; decorative boundary only |

No text color, weight, or size was changed by any of the three fixes — only backgrounds,
image `object-fit`, and grid-item sizing. All computed via the standard relative-luminance
formula against the actual rendered RGB values (not assumed from token names).

## Mobile responsive behavior

- **Card image fit (`card.css`):** the `160px` fixed height and `24px 32px` padding apply
  identically at all viewports (no media query) — verified visually at 360/768/1280 in the
  "after" screenshots; logos remain fully visible and proportioned at every width tested.
- **Chip card width (`dy-section.css`):** `max-width: 360px` behaves as a ceiling, not a
  fixed width — at 360px viewport the card measured 317px (container-constrained, correctly
  shrinking below the cap), confirmed via computed `getBoundingClientRect()`, no clipping.
- **`.region-highlighted` white background:** no size/layout change, background-color only —
  identical behavior at 360 and 1280, confirmed via computed style at both widths on all four
  target pages.
- Touch targets: unaffected — no interactive element's box model was changed by any of the
  three fixes (breadcrumb link touch target unchanged; card images are non-interactive within
  a still-full-card `<a>` wrapper whose hit area was not modified).

## Autonomous decisions

1. **Scope-split self-decision:** did all three escalated items (OSP full treatment, image
   fixes, sitewide `.region-highlighted`) in one pass rather than filing follow-up issues —
   see "Deviations from spec" for the reasoning. In human-in-the-loop mode this split choice
   would have been proposed to the operator and would have waited.
2. **/how-we-do-it "no fix" call:** decided the reported spacing defect does not reproduce
   and shipped no CSS change for that page, backed by measurement rather than skipping
   silently. In human-in-the-loop mode this negative finding would have been surfaced to the
   operator for confirmation before closing the ticket as "no action needed" on that page.
3. **`.region-highlighted` selector correction:** discovered and worked around the
   pre-existing `html .theme--white` (with-space) selector mismatch rather than escalating it
   as a blocking question — judged it out of scope for this fix and used the correct
   no-space selector for my own new rule, flagging the pre-existing issue for A instead of
   stopping to ask. A human-in-the-loop session likely would have flagged this as a
   spec-ambiguity / architecture question before proceeding.
4. **Book-landing exclusion mechanism:** chose to rely on verified load-order precedence
   (book-landing.css loads after base.css) rather than adding an explicit `:not()`/`:has()`
   guard, after confirming empirically it works — a more conservative approach would have
   added the explicit exclusion for future-proofing; documented as a soft dependency for A in
   "Architecture notes."

## Known issues

- The `.region-highlighted` / book-landing non-collision depends on CSS library load order,
  not an explicit selector guard (see "Architecture notes for A"). Not a current defect, but
  worth hardening if that load order is ever restructured.
- `dy-section.css` will need a straightforward two-way merge against PR #290
  (`fix/aftersight-page-visual-pass`) when both land — both branches only append new rules to
  the end of the file, but O/A should re-diff after both merges to confirm no rule shadows
  another.
- `/articles` and `/docs` are not `.dy-section`-based canvas pages (Views-driven listings) —
  excluded from the section-rhythm sweep as out of scope for this component-level fix; no
  defect assessed there either way.

## Sweep results — other canvas pages

Measured `.dy-section` padding-top/bottom and header-to-body gap on `/services`,
`/about-us`, `/automated-testing`, `/contact-us`, `/how-we-built-this-site` (both desktop
and mobile). **All five already show the identical correct rhythm scale** (96px/64px section
padding, 48px header gap) — matching the homepage and the (now-confirmed-clean)
`/how-we-do-it`. **No page required a spacing fix.** `/open-source-projects` was the only
page with a real, confirmed defect class (broken card imagery + the floating chip card), both
fixed above. `/articles` and `/docs` render via Views, not `.dy-section` canvas components —
outside this fix's scope, not assessed.

## Shots index

`docs/pl2/handoffs/spacing-fix/shots/`:
- `how-we-do-it-{360,768,1280}-{before,after}.png` — full-page, before/after (visually
  identical, confirming no spacing regression from the sitewide `.region-highlighted` change)
- `open-source-projects-{360,768,1280}-{before,after}.png` — full-page, before/after (shows
  the card-image and chip-card fixes)
- `homepage-1280-reference.png` — rhythm-reference comparison shot
- `region-highlighted-after-top.png` — close-up of the header/breadcrumb/hero seam fix
- `book-landing-unaffected.png` — confirms book-landing pages' own cream treatment is
  untouched

## Files changed

- `web/themes/custom/performant_labs_v2/css/components/card.css` — modified (OSP card image
  fit fix)
- `web/themes/custom/performant_labs_v2/css/components/dy-section.css` — modified (OSP chip
  card width fix)
- `web/themes/custom/performant_labs_v2/css/base.css` — modified (sitewide
  `.region-highlighted` white-continuation fix)
- `docs/pl2/handoffs/spacing-fix/handoff-F.md` — created (this file)
- `docs/pl2/handoffs/spacing-fix/shots/*.png` — created (15 screenshots, before/after +
  supporting evidence)
