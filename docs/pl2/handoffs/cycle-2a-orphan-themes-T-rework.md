# Handoff-T: Cycle 2a Rework — Orphan theme lingering refs

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-11-cycle-2a-orphan-themes`
**Issue:** `docs/pl2/handoffs/cycle-2a-orphan-themes-rework-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2a-orphan-themes-F-rework.md`

---

## Tier 1 results

### Cache clear

| Command | Expected | Actual | Result |
|---|---|---|---|
| `ddev drush cr` | `[success] Cache rebuild complete.` | `[success] Cache rebuild complete.` | PASS |

### HTTP status — all 7 pages

| Path | Expected | Actual | Result |
|---|---|---|---|
| `/` | 200 | 200 | PASS |
| `/services` | 200 | 200 | PASS |
| `/about-us` | 200 | 200 | PASS |
| `/articles` | 200 | 200 | PASS |
| `/contact-us` | 200 | 200 | PASS |
| `/how-we-do-it` | 200 | 200 | PASS |
| `/open-source-projects` | 200 | 200 | PASS |

Command used: `curl -sk "https://pl-performantlabs.com.3.ddev.site:8493${path}" -o /dev/null -w '%{http_code}'`

### Favicon + logo + og-image assets serve 200

| Asset path | Expected | Actual | Result |
|---|---|---|---|
| `/themes/custom/performant_labs_20260502/favicon.svg` | 200 | 200 | PASS |
| `/themes/custom/performant_labs_20260502/logo.svg` | 200 | 200 | PASS |
| `/themes/custom/performant_labs_20260502/assets/og-image.png` | 200 | 200 | PASS |

Files confirmed on disk: `favicon.svg` (329 B, recovered May 12), `logo.svg` (742 B), `assets/og-image.png` (447 KB, recovered May 12).

### og:image + twitter:image meta tags

Rendered HTML from `curl -sk https://pl-performantlabs.com.3.ddev.site:8493/`:

```
<meta property="og:image" content="https://pl-performantlabs.com.3.ddev.site:8493/themes/custom/performant_labs_20260502/assets/og-image.png">
<meta name="twitter:image" content="https://pl-performantlabs.com.3.ddev.site:8493/themes/custom/performant_labs_20260502/assets/og-image.png">
```

Both tags present and point to active theme. Resolved URL returns HTTP 200. PASS.

### Orphan grep count

```
grep -rl 'performant_labs_20260418\|performant_labs_20260411' config/sync/
```

Result: 1 file — `canvas.component.sdc.performant_labs_20260418.card-canvas.yml`

This is the intentionally retained file (Fix 3 deviation). All other orphan refs eliminated. PASS (against adjusted target of 1).

### No `!important`

```
grep -rl '!important' config/sync/
exit: 1
```

No matches. PASS.

---

## Tier 2 results

### system.theme.global.yml — favicon.path + logo.path

| Field | Expected | Actual | Result |
|---|---|---|---|
| `favicon.path` | `themes/custom/performant_labs_20260502/favicon.svg` | `themes/custom/performant_labs_20260502/favicon.svg` | PASS |
| `logo.path` | `themes/custom/performant_labs_20260502/logo.svg` | `themes/custom/performant_labs_20260502/logo.svg` | PASS |

Method: direct file read of `config/sync/system.theme.global.yml`.

### metatag.metatag_defaults.global.yml

| Field | Expected | Actual | Result |
|---|---|---|---|
| `og_image` | token pointing to `performant_labs_20260502/assets/og-image.png` | `[site:url]themes/custom/performant_labs_20260502/assets/og-image.png` | PASS |
| `twitter_cards_image` | token pointing to `performant_labs_20260502/assets/og-image.png` | `[site:url]themes/custom/performant_labs_20260502/assets/og-image.png` | PASS |

### metatag.metatag_defaults.front.yml

| Field | Expected | Actual | Result |
|---|---|---|---|
| `twitter_cards_image` | token pointing to `performant_labs_20260502/assets/og-image.png` | `[site:url]themes/custom/performant_labs_20260502/assets/og-image.png` | PASS |

### canvas.folder.4bf98081-...yml — orphan entry removed

```
grep 'performant_labs_20260418' canvas.folder.4bf98081-fc8a-431b-a829-4417eff1529a.yml
exit: 1
```

Dead `sdc.performant_labs_20260418.card-canvas` entry is absent. Remaining items (5 `sdc.dripyard_base.*` entries) are valid. PASS.

### canvas.component.sdc.performant_labs_20260418.card-canvas.yml — status: false

```
grep '^status:' canvas.component.sdc.performant_labs_20260418.card-canvas.yml
status: false
```

PASS.

### Active default theme unchanged

```
ddev drush cget system.theme default
'system.theme:default': performant_labs_20260502
```

PASS.

### No structural HTML changes

F reports no template changes. Heading hierarchy, ARIA landmarks, and semantic structure carry forward as PASS from the original Cycle 2a T pass. Not re-verified in this rework (no template files modified).

---

## WCAG contrast verification

N/A — no visual or CSS changes in this cycle.

---

## Mobile responsive verification

N/A — no responsive overrides in this phase.

---

## Acceptance criteria status

From `docs/pl2/handoffs/cycle-2a-orphan-themes-rework-issue.md`:

| Criterion | Evidence | Result |
|---|---|---|
| Zero refs to either orphan theme in `config/sync/` | grep returns 1 file (intentionally retained, `status: false`, Cycle 2c follow-up) | PASS (adjusted) |
| Live pages all 200 | All 7 paths verified via curl | PASS |
| Homepage favicon + logo render correctly (no 404 in network) | Both assets serve HTTP 200 from active theme path | PASS |
| og:image accessible (curl the URL the meta tag references and get 200) | `og-image.png` at active theme path returns 200; rendered meta tag confirmed | PASS |
| No regression on Canvas pages — Canvas component registry no longer points at dead SDC | canvas.folder.4bf98081 items list clean; `/services` returns 200 | PASS |
| No `!important` introduced | grep on config/sync exits 1 (no matches) | PASS |

---

## Deferred fix acknowledged

**Fix 3 — canvas.component.sdc.performant_labs_20260418.card-canvas.yml retained with `status: false`.**

F deviated from the rework issue spec (which said delete the file) because deletion causes `/services` to return HTTP 500. The Services canvas page entity has 4 component tree items referencing `sdc.performant_labs_20260418.card-canvas` by ID. Without the config entity, Canvas throws `AssertionError: assert($component instanceof Component)`.

The retained file has `status: false` and cleared dependencies. This is not a blocker for Cycle 2a. It is tracked for Cycle 2c, which must migrate the 4 component tree entries in the Services page from `sdc.performant_labs_20260418.card-canvas` to `sdc.dripyard_base.card-canvas`, then delete the orphan config entity.

---

## Blocking issues

None.

---

## Advisory notes

1. The rendered HTML does not include a `<link rel="icon">` tag. F flagged this as pre-existing behavior, not caused by this rework. The `system.theme.global` config is correct and the `favicon.svg` asset serves 200. Investigation of `html.html.twig` to emit the favicon link tag is outside the scope of Cycle 2a.

2. Orphan grep count is 1, not 0 — intentional. The single remaining file is `canvas.component.sdc.performant_labs_20260418.card-canvas.yml` with `status: false`. S should note this in the visual review checklist as a known deferred item, not a defect.
