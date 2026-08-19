# Handoff-T: Cycle 2a - Orphan theme uninstall + cleanup

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-11-cycle-2a-orphan-themes`
**Issue:** `docs/pl2/handoffs/cycle-2a-orphan-themes-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2a-orphan-themes-F.md`

---

## Tier 1 results

### Cache clear

```
Command: ddev drush cr
Expected: [success] Cache rebuild complete.
Actual:   [success] Cache rebuild complete.
Result:   PASS
```

### Default theme

```
Command: ddev drush cget system.theme default
Expected: 'system.theme:default': performant_labs_20260502
Actual:   'system.theme:default': performant_labs_20260502
Result:   PASS
```

### Orphan themes absent from enabled list

```
Command: ddev drush pm:list --status=enabled --type=theme | grep performant_labs_2026041
Expected: (no output)
Actual:   (no output)
Result:   PASS
```

Enabled themes observed: claro, canvas_stark, dripyard_base, easy_email_theme, gin,
mercury, neonbyte, performant_labs, performant_labs_20260502. Neither
`performant_labs_20260411` nor `performant_labs_20260418` appears.

### block.block.* orphan configs in config/sync

```
Command: ls config/sync/block.block.performant_labs_2026041* | wc -l
Expected: 0
Actual:   0  (ls: no matches found)
Result:   PASS
```

### Orphan references anywhere in config/sync (AC wording: count = 0)

```
Command: grep -rl 'performant_labs_20260418|performant_labs_20260411' config/sync/ | wc -l
Expected: 0 (per AC: "no block.block configs referencing the orphan themes")
Actual:   5
Result:   CONDITIONAL — see Blocking Issues
```

The 5 files are:

| File | Context |
|---|---|
| `config/sync/metatag.metatag_defaults.global.yml` | og_image + twitter_cards_image point to `performant_labs_20260418/assets/og-image.png` path |
| `config/sync/metatag.metatag_defaults.front.yml` | twitter_cards_image points to `performant_labs_20260418/assets/og-image.png` path |
| `config/sync/system.theme.global.yml` | favicon.path + logo.path point to `performant_labs_20260411/` paths |
| `config/sync/canvas.folder.4bf98081-fc8a-431b-a829-4417eff1529a.yml` | Items list still includes `sdc.performant_labs_20260418.card-canvas` |
| `config/sync/canvas.component.sdc.performant_labs_20260418.card-canvas.yml` | id/provider/source_local_id all reference `performant_labs_20260418`; status is `false` but the file itself survives |

Note: The T operator-specified command was `grep -l '...' config/sync/ | wc -l`, so T ran that
exact command. `block.block.*` orphan count is 0 (PASS per that narrow AC). The broader 5-file
count is a blocking finding documented separately below.

### On-disk theme directories

```
Command: find web/themes/custom -maxdepth 1 -type d
Expected: web/themes/custom, web/themes/custom/performant_labs_20260502 only
Actual:   web/themes/custom
          web/themes/custom/performant_labs_20260502
          web/themes/custom/performant_labs
Result:   ADVISORY — see notes
```

`performant_labs` (no date suffix) is present. This is the parent/base theme that predates the
sprint lineage; it was not listed as an orphan in the issue scope and it appears in the enabled
theme list as "Performant Labs (performant_labs)". It is not one of the two targeted themes and
it is still enabled. Not a blocking issue on this cycle but noted for F awareness.

### HTTP 200 on all 7 pages

```
Base URL: https://pl-performantlabs.com.3.ddev.site:8493
Command:  curl -sk $BASE_URL$path -o /dev/null -w '%{http_code}'
```

| Path | Expected | Actual | Result |
|---|---|---|---|
| `/` | 200 | 200 | PASS |
| `/services` | 200 | 200 | PASS |
| `/about-us` | 200 | 200 | PASS |
| `/articles` | 200 | 200 | PASS |
| `/contact-us` | 200 | 200 | PASS |
| `/how-we-do-it` | 200 | 200 | PASS |
| `/open-source-projects` | 200 | 200 | PASS |

### No `!important` in config/sync

```
Command: grep -rl '!important' config/sync/ | wc -l
Expected: 0
Actual:   0
Result:   PASS
```

---

## Tier 2 results

### Single H1 per page (Python-accurate regex `<h1[\s>]`)

| Page | h1 count | Result |
|---|---|---|
| `/` | 1 | PASS |
| `/services` | 1 | PASS |
| `/about-us` | 1 | PASS |
| `/articles` | 1 | PASS |
| `/contact-us` | 1 | PASS |
| `/how-we-do-it` | 1 | PASS |
| `/open-source-projects` | 1 | PASS |

Note: the earlier grep approach double-counted by matching `h1` within `h10`-style attribute
strings. Python `re.findall(r'<h1[\s>]', html)` is definitive. All pages have exactly one H1.

### Heading hierarchy — no skipped levels

All pages use h1 → h2 → h3 in sequence with no gaps (no h4+ present on any page). PASS.

### ARIA landmarks — `<header>`, `<main>`, `<footer>`, `<nav>`

| Page | header | main | footer | nav | Result |
|---|---|---|---|---|---|
| `/` | 1 | 1 | 1 | 2 | PASS |
| `/services` | 1 | 1 | 1 | 3 | PASS |
| `/about-us` | 1 | 1 | 1 | 3 | PASS |
| `/articles` | 1 | 1 | 1 | 4 | PASS |
| `/contact-us` | 1 | 1 | 1 | 3 | PASS |
| `/how-we-do-it` | 1 | 1 | 1 | 3 | PASS |
| `/open-source-projects` | 1 | 1 | 1 | 3 | PASS |

All four required landmarks present on every page. PASS.

### core.extension.yml diff scope

F reported only 2 lines removed (the two orphan theme entries). No new modules or unrelated
theme entries introduced. PASS.

---

## WCAG contrast verification

N/A — no visual changes in this cycle. No CSS modified. F's assessment of N/A is correct.

---

## Mobile responsive verification

N/A — no responsive overrides in this phase. No CSS modified.

---

## Acceptance criteria status

| # | Criterion | Result | Evidence |
|---|---|---|---|
| AC1 | `drush pm:list` no longer lists the two orphan themes | PASS | pm:list output confirms both absent |
| AC2 | Active default theme remains `performant_labs_20260502` | PASS | `drush cget system.theme default` = `performant_labs_20260502` |
| AC3 | `config/sync/` has no `block.block.*` configs referencing orphan themes (count drops from 22 to 0) | PASS | `ls config/sync/block.block.performant_labs_2026041* \| wc -l` = 0 |
| AC4 | On-disk theme directories deleted | PASS | `find web/themes/custom -maxdepth 1 -type d` shows only `performant_labs_20260502` and `performant_labs` (base); both targeted date-suffixed directories are gone |
| AC5 | Live pages all return 200 | PASS | All 7 pages verified 200 |
| AC6 | Homepage `/` AE=0 at 1280 vs pre-cycle baseline | DEFERRED | S's responsibility per issue |
| AC7 | No `!important` introduced | PASS | grep config/sync = 0 |
| AC8 | Files staged by explicit path | PASS | F confirmed; git status on branch is clean |

---

## Blocking issues

**BLOCKING-1: 5 config/sync files still reference deleted orphan theme paths/IDs**

The operator-specified check command (`grep -l '...' config/sync/ | wc -l`) returns 5, not 0.
The AC as written says "no block.block configs referencing the orphan themes" — and that narrow
criterion passes (count = 0). However, these 5 surviving files represent real orphan drift that
will cause runtime errors or stale metadata in production:

1. `system.theme.global.yml` — favicon and logo still point to
   `themes/custom/performant_labs_20260411/` paths that no longer exist on disk. Any request
   that resolves these paths will produce a 404 asset.

2. `metatag.metatag_defaults.global.yml` + `metatag.metatag_defaults.front.yml` — og:image and
   twitter:image tokens reference `performant_labs_20260418/assets/og-image.png`. That file was
   deleted with the directory. Social share previews will produce broken images.

3. `canvas.component.sdc.performant_labs_20260418.card-canvas.yml` — status is `false` (F's
   cascade handled that), but the config entity itself survives in sync and its `id`, `provider`,
   and `source_local_id` all bind to the deleted theme. The file should be deleted.

4. `canvas.folder.4bf98081-fc8a-431b-a829-4417eff1529a.yml` — the "Dripyard Cards" folder
   still lists `sdc.performant_labs_20260418.card-canvas` as an item. That component no longer
   exists. Canvas will reference a dead component ID.

F must address these 4 categories before S proceeds.

---

## Advisory notes

1. `web/themes/custom/performant_labs` (no date suffix) is still present on disk and is still
   enabled. It is not in scope for this cycle but the hygiene audit thread may want to track it.

2. The accurate heading count requires Python-level regex. The shell `grep -oE '<h[1-6][^>]*>'`
   pattern matches strings like `h1` appearing inside attribute values (e.g. class names
   containing `h1`), producing inflated counts. T used Python for definitive results.

3. AC6 (AE=0 at 1280) is correctly deferred to S. T has no visual baseline tooling in scope.

---

T found blocking issues. F needs to address the following before S proceeds:

- BLOCKING-1: 4 categories of orphan theme references remain in `config/sync/` after the cex — `system.theme.global.yml` (broken favicon/logo paths), `metatag.metatag_defaults.global.yml` + `metatag.metatag_defaults.front.yml` (broken og/twitter image paths), `canvas.component.sdc.performant_labs_20260418.card-canvas.yml` (should be deleted, not just status=false), and `canvas.folder.4bf98081-fc8a-431b-a829-4417eff1529a.yml` (dead component ID in items list).
