# Handoff-F: Cycle 2a Rework - Orphan theme lingering refs

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-11-cycle-2a-orphan-themes`
**Issue:** `docs/pl2/handoffs/cycle-2a-orphan-themes-rework-issue.md`

## Confirmation table (autonomous mode)

| Field | Value |
|---|---|
| Page being overhauled | N/A -- config + asset cleanup, no page-specific work |
| Issue | `cycle-2a-orphan-themes-rework-issue.md` |
| Working branch | `aa/pl-sprint-11-cycle-2a-orphan-themes` |
| Runbook phase | Sprint 11 Cycle 2a rework |
| Input documents read | Rework issue, prior F handoff, prior T handoff (BLOCKING) |
| Acceptance criteria count | 6 |
| Handoff document path | `docs/pl2/handoffs/cycle-2a-orphan-themes-F-rework.md` |
| CSS workflow path | N/A -- no CSS changes |
| Component schema source | N/A -- no component changes |

## What was done

### Fix 1 -- system.theme.global favicon + logo paths

- **Option chosen:** (a) recover assets from git history, point to active theme.
- Recovered `favicon.svg` from `git show 0ec999538:web/themes/custom/performant_labs_20260411/favicon.svg` into `web/themes/custom/performant_labs_20260502/favicon.svg`.
- `logo.svg` already existed in the active theme at `web/themes/custom/performant_labs_20260502/logo.svg`.
- Updated `config/sync/system.theme.global.yml`: both `favicon.path` and `logo.path` now point to `themes/custom/performant_labs_20260502/`.

### Fix 2 -- metatag og:image / twitter:image

- **Option chosen:** (a) recover og-image.png from git history, point to active theme.
- Recovered `og-image.png` from `git show 0ec999538:web/themes/custom/performant_labs_20260418/assets/og-image.png` into `web/themes/custom/performant_labs_20260502/assets/og-image.png` (created `assets/` directory).
- Updated `config/sync/metatag.metatag_defaults.global.yml`: `og_image` and `twitter_cards_image` now point to `performant_labs_20260502/assets/og-image.png`.
- Updated `config/sync/metatag.metatag_defaults.front.yml`: `twitter_cards_image` now points to `performant_labs_20260502/assets/og-image.png`.

### Fix 3 -- canvas.component.sdc.performant_labs_20260418.card-canvas.yml

- **Option chosen:** KEEP with `status: false` (deviation from rework issue spec -- see below).
- The rework issue said to delete this file. Deleting it crashes `/services` (HTTP 500) because canvas page entity_id 3 ("Services") has 4 component tree items referencing `sdc.performant_labs_20260418.card-canvas`. Without the config entity, Canvas throws `AssertionError: assert($component instanceof Component)`.
- The file remains with `status: false` and dependencies cleared (prior F's state). This is the safest option that does not break runtime rendering.
- The file's filename and internal `id`/`provider`/`source_local_id` fields still contain `performant_labs_20260418`, so it will appear in the orphan grep (1 file remaining).

### Fix 4 -- canvas.folder.4bf98081-*.yml

- Removed `sdc.performant_labs_20260418.card-canvas` from the `items` list in `config/sync/canvas.folder.4bf98081-fc8a-431b-a829-4417eff1529a.yml`.
- The 5 remaining `sdc.dripyard_base.*` items are valid and unchanged.

### Config import

- Ran `ddev drush cim -y` -- imported all 4 config updates + 1 canvas component create (re-created after accidental delete). All clean.

## Layer decisions

N/A -- no CSS changes in this cycle.

## Deviations from spec

1. **Fix 3: kept canvas component config instead of deleting.** The rework issue instructed deletion. Deletion causes `/services` to crash (HTTP 500) because 4 canvas component tree items in the Services page content reference this component by ID. The most-conservative interpretation is to keep the entity disabled (`status: false`) rather than break a live page. A follow-up issue should migrate the Services page content from `sdc.performant_labs_20260418.card-canvas` to `sdc.dripyard_base.card-canvas`, after which the orphan config can be safely deleted.

## Verification results (T1 + T2)

### T1: Cache clear

```
ddev drush cr
[success] Cache rebuild complete.
```

### T1: Orphan grep

```
grep -rl 'performant_labs_20260418|performant_labs_20260411' config/sync/
Result: 1 file (canvas.component.sdc.performant_labs_20260418.card-canvas.yml)
```

This is the intentionally-retained canvas component config (Fix 3 deviation). All other orphan refs eliminated.

### T1: HTTP 200 on all 7 pages

| Path | Status |
|---|---|
| `/` | 200 |
| `/services` | 200 |
| `/about-us` | 200 |
| `/articles` | 200 |
| `/contact-us` | 200 |
| `/how-we-do-it` | 200 |
| `/open-source-projects` | 200 |

### T1: Assets serve 200

| Asset | Status |
|---|---|
| `/themes/custom/performant_labs_20260502/favicon.svg` | 200 |
| `/themes/custom/performant_labs_20260502/logo.svg` | 200 |
| `/themes/custom/performant_labs_20260502/assets/og-image.png` | 200 |

### T1: og:image and twitter:image meta tags correct

```
Homepage og:image:   https://pl-performantlabs.com.3.ddev.site:8493/themes/custom/performant_labs_20260502/assets/og-image.png
Homepage twitter:image: https://pl-performantlabs.com.3.ddev.site:8493/themes/custom/performant_labs_20260502/assets/og-image.png
```

Both point to the active theme and return HTTP 200.

### T1: Default theme unchanged

```
ddev drush cget system.theme default
'system.theme:default': performant_labs_20260502
```

### T1: No !important

```
grep -rl '!important' config/sync/
EXIT: 1 (no matches)
```

### T2: No structural changes

No HTML templates modified. Heading hierarchy, ARIA landmarks unchanged from prior T pass (all PASS).

## WCAG contrast ratios

N/A -- no visual changes in this cycle.

## Mobile responsive behavior

N/A -- no responsive overrides in this phase.

## Autonomous decisions

1. **Fix 1 asset recovery source:** Chose to recover `favicon.svg` from `performant_labs_20260411` (the theme the config originally referenced) rather than from `performant_labs_20260418`. Both themes had favicon.svg in history; the 0411 version was the one `system.theme.global` pointed to.

2. **Fix 2 asset recovery source:** Chose to recover `og-image.png` from `performant_labs_20260418` (the theme the metatag config referenced). Created the `assets/` directory in the active theme to house it.

3. **Fix 3 deviation -- kept canvas component config instead of deleting:** The rework issue specified deletion. Deletion crashes `/services` (HTTP 500). I applied the most-conservative interpretation: keep the entity disabled. This leaves 1 file in the orphan grep (vs the target of 0), but prevents runtime breakage. Filed as a known issue for follow-up: the Services page content needs to be migrated to `sdc.dripyard_base.card-canvas` before this config entity can be safely deleted.

## Known issues

1. **Orphan grep returns 1 (not 0):** `canvas.component.sdc.performant_labs_20260418.card-canvas.yml` intentionally retained because the Services page content tree references it. Deleting it produces HTTP 500 on `/services`. A follow-up cycle must migrate the 4 component tree entries in canvas page entity_id 3 from `sdc.performant_labs_20260418.card-canvas` to `sdc.dripyard_base.card-canvas`, then delete this config file.

2. **No favicon `<link>` tag in rendered HTML:** The homepage does not render a `<link rel="icon">` tag in the HTML head. The `system.theme.global` config is correct and the asset serves 200, but the theme's `html.html.twig` template may not output the favicon link. This appears to be pre-existing behavior (not caused by this rework).

## Files changed

**New files (rework):**
- `web/themes/custom/performant_labs_20260502/favicon.svg` -- recovered from git history
- `web/themes/custom/performant_labs_20260502/assets/og-image.png` -- recovered from git history

**Modified config (rework -- incremental over prior F):**
- `config/sync/system.theme.global.yml` -- favicon.path + logo.path updated to `performant_labs_20260502`
- `config/sync/metatag.metatag_defaults.global.yml` -- og_image + twitter_cards_image updated to `performant_labs_20260502`
- `config/sync/metatag.metatag_defaults.front.yml` -- twitter_cards_image updated to `performant_labs_20260502`
- `config/sync/canvas.folder.4bf98081-fc8a-431b-a829-4417eff1529a.yml` -- removed dead `sdc.performant_labs_20260418.card-canvas` from items list

**Unchanged from prior F (still modified vs main):**
- `config/sync/canvas.component.sdc.performant_labs_20260418.card-canvas.yml` -- status: false, deps cleared (retained intentionally)
- `config/sync/canvas.folder.9ba74396-170e-413a-9bae-9620dd4e55fd.yml` -- prior F change
- `config/sync/core.extension.yml` -- prior F change
- All 24 deleted block.block.* and settings files from prior F
- All deleted on-disk theme directories from prior F
