# Handoff-F: Cycle 2e - /services SDC migration + delete orphan canvas config

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-11-cycle-2e-services-sdc`
**Issue:** `docs/pl2/handoffs/cycle-2e-services-sdc-issue.md`

## Confirmation table (autonomous mode)

| Field | Value |
|---|---|
| Page being overhauled | /services (canvas_page entity ID 3) |
| Issue | `cycle-2e-services-sdc-issue.md` |
| Working branch | `aa/pl-sprint-11-cycle-2e-services-sdc` |
| Runbook phase | Sprint 11 Cycle 2e |
| Input documents read | cycle-2e issue, cycle-2a-orphan-themes-F-rework.md, both card-canvas SDC configs |
| Acceptance criteria count | 8 |
| Handoff document path | `docs/pl2/handoffs/cycle-2e-services-sdc-F.md` |
| CSS workflow path | N/A -- no CSS changes |
| Component schema source | `config/sync/canvas.component.sdc.dripyard_base.card-canvas.yml` |

## What was done

1. **Schema compatibility verified.** Both SDC configs (`sdc.performant_labs_20260418.card-canvas` and `sdc.dripyard_base.card-canvas`) share identical version hash `552876d9540c5ead` and identical core props (image, eyebrow_text, title, body, href, theme, flip_layout). The dripyard_base version adds one optional prop (`loading`, default `lazy`) -- additive only, no breaking change.

2. **Migrated 4 card components in canvas_page entity 3** via `drush php-eval`. Rewrote `component_id` from `sdc.performant_labs_20260418.card-canvas` to `sdc.dripyard_base.card-canvas` for these UUIDs:
   - `7b67d4d0-6531-4bbb-8573-f92e35fead0e` -- "Test-suite takeover."
   - `e5700743-ab67-445f-aa18-cb31e1a7f4c1` -- "Embedded testing engineer."
   - `9c6dfdf5-ea98-48fb-a86c-e7407568e6fa` -- "Autonomous-healing pilot."
   - `5f776a8b-87e0-4217-a9a4-61cdbb992331` -- "Accessibility testing."
   - `component_version` unchanged at `552876d9540c5ead` (same hash in both SDCs).
   - All `inputs`, `slots`, `additional_classes`, `parent_uuid`, `slot`, `label` preserved exactly.

3. **Deleted orphan config** `config/sync/canvas.component.sdc.performant_labs_20260418.card-canvas.yml` from disk, then ran `ddev drush cim -y` which deleted the config entity from the database and also updated `canvas.folder.9ba74396-170e-413a-9bae-9620dd4e55fd` (Canvas auto-removed the reference from the folder's items list).

4. **Verified clean config state** with `ddev drush cex -y` -- "The active configuration is identical to the configuration in the export directory."

## Layer decisions

N/A -- no CSS changes in this cycle. The migration is a content entity change (canvas_page component_id rewrite) plus a config entity deletion.

## Deviations from spec

None.

## Verification results (T1 + T2)

### T1: Cache clear

```
ddev drush cr
[success] Cache rebuild complete.
```

### T1: /services HTTP 200

```
curl -sk -o /dev/null -w "%{http_code}" https://pl-performantlabs.com.3.ddev.site:8493/services
200
```

### T1: All 4 card titles render

```
curl -sk https://...services | grep -oP 'Test-suite takeover|Embedded testing engineer|Autonomous-healing pilot|Accessibility testing' | sort -u
Accessibility testing
Autonomous-healing pilot
Embedded testing engineer
Test-suite takeover
```

### T1: card-canvas component count in rendered HTML

```
curl -sk https://...services | grep -c 'card-canvas'
9
```

(Multiple references expected: component wrapper classes, component attributes.)

### T1: Orphan grep -- zero matches

```
grep -rl 'performant_labs_20260418\|performant_labs_20260411' config/sync/
EXIT: 1 (no matches)
```

True zero orphan-theme refs achieved.

### T1: No regression on other pages

| Path | Status |
|---|---|
| `/` | 200 |
| `/about-us` | 200 |
| `/articles` | 200 |
| `/contact-us` | 200 |
| `/how-we-do-it` | 200 |
| `/open-source-projects` | 200 |

### T1: Config clean

```
ddev drush cex -y
The active configuration is identical to the configuration in the export directory (../config/sync).
```

### T1: No !important

No CSS files were modified.

### T2: Structural integrity

No HTML templates modified. The card-canvas SDC template is shared between the orphan and replacement (same component, different provider namespace). Heading hierarchy, ARIA landmarks unchanged.

## WCAG contrast ratios

N/A -- no visual changes. The card-canvas component renders identically from `dripyard_base` as from `performant_labs_20260418` (same template, same styles, same version hash).

## Mobile responsive behavior

N/A -- no responsive overrides in this phase.

## Autonomous decisions

1. **Schema compatibility: no ADVISORY-HOLD needed.** Both SDCs share the same version hash `552876d9540c5ead` and identical prop schemas. The dripyard_base version adds one optional prop (`loading`) which has a default value and does not affect existing inputs. This is a fully compatible migration with zero schema delta risk.

2. **component_version kept as-is.** Since both SDCs share hash `552876d9540c5ead`, no version change was needed. The issue noted F should "use the replacement SDC's valid hash" -- the hash is identical, so the existing value was preserved unchanged.

3. **Config import triggered canvas.folder auto-update.** When `cim` deleted the orphan config entity, Canvas automatically removed `sdc.performant_labs_20260418.card-canvas` from `canvas.folder.9ba74396-170e-413a-9bae-9620dd4e55fd`. This was a framework-managed side effect, not a manual edit. The `cex` confirmed clean state afterward.

## Known issues

None.

## Files changed

**Deleted:**
- `config/sync/canvas.component.sdc.performant_labs_20260418.card-canvas.yml` -- orphan SDC config removed

**Database content change (not in config/sync):**
- `canvas_page` entity ID 3 ("Services") -- 4 components' `component_id` rewritten from `sdc.performant_labs_20260418.card-canvas` to `sdc.dripyard_base.card-canvas`

**Auto-updated by Canvas framework during `cim`:**
- `config/sync/canvas.folder.9ba74396-170e-413a-9bae-9620dd4e55fd` -- orphan item reference auto-removed (this file was already modified on the branch from cycle 2a; the folder update is additive)
