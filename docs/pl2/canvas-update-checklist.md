# Canvas Module Update Checklist

**Scope:** Things to verify after every Canvas core or contrib module update (`composer update` or `drush updb` involving Canvas). This is a site-maintenance SOP, not a per-sprint runbook.

---

## Background

The `canvas_html_block` filter format (`config/sync/filter.format.canvas_html_block.yml`) was extended during the homepage overhaul to allow SVG-related tags inside raw-HTML Canvas blocks. Canvas module upgrades may ship a fresh default filter-format config that silently overwrites these customizations during `drush config:import`. The items below guard against silent regression.

---

## After every Canvas module update

### 1. Re-check the `canvas_html_block` filter-format SVG allowlist

Canvas module upgrades may ship fresh default filter-format configs that silently
overwrite our customizations. Re-check the following after `composer update` or
`drush updb` involving Canvas:

- [ ] `config/sync/filter.format.canvas_html_block.yml` still permits the SVG-related
  tags in `allowed_html`:
  - `<svg>`, `<circle>`, `<line>`, `<polygon>`, `<text>`, `<div>`

  Verification command (run from the repo root):

  ```bash
  grep -E '<svg|<circle|<line |<polygon|<text|<div' \
    config/sync/filter.format.canvas_html_block.yml
  ```

  Expected: each tag appears at least once in the `allowed_html` string. If any
  tag is missing, restore the customization in the config file before running
  `drush config:import`.

  **Restoration reference** — the six tags as of 2026-05-03, with their canonical
  attribute allowlists:

  | Tag | Attributes permitted |
  |-----|----------------------|
  | `<div>` | `class role aria-label style` |
  | `<svg>` | `xmlns viewBox style aria-hidden width height` |
  | `<circle>` | `cx cy r fill stroke stroke-width` |
  | `<line>` | `x1 y1 x2 y2 stroke stroke-width aria-hidden` |
  | `<polygon>` | `points fill aria-hidden` |
  | `<text>` | `x y text-anchor font-family font-size font-weight letter-spacing fill aria-hidden` |

- [ ] If the Canvas update introduces new filter formats relevant to authoring
  workflows, evaluate whether the same SVG-tag allowlist should be added there
  too.

**Consequence if missed:** Editorial SVG content inside `dripyard_base:text`
blocks (and any other raw-HTML Canvas authoring surface) will silently render
with the SVG markup stripped. The `heal-flow` SDC component does not depend on
the filter since Phase 2 of the post-homepage tech-debt cycle (heal-flow is now
a proper SDC, not inline SVG in a text block), but the filter additions remain
a useful safety net for editorial authoring of SVG content.

---

### 2. Smoke-check Canvas block rendering on the live front page

After `drush config:import`, load the front page and verify that the heal-flow
section and feature cards render without PHP exceptions or missing blocks.

```bash
# Check for Watchdog errors introduced by the Canvas update
ddev drush watchdog:show --count=20 --severity=3
```

---

### 3. Verify Canvas SDC prop compatibility

If the Canvas update touches `JsonSchemaType::computeStorablePropShape()` or
related schema-handling code, re-run any Canvas assembly scripts for pages that
use custom SDC components (e.g., `kicker`, `heal-flow`). Check for
`OutOfRangeException` on page load — this is the symptom of a Canvas block
carrying a prop name that no longer matches the active component schema.

---

## Related docs

| What | Where |
|------|-------|
| Filter format file | `config/sync/filter.format.canvas_html_block.yml` |
| Heal-flow SDC | `web/themes/custom/performant_labs_20260502/components/heal-flow/` |
| Canvas SDC platform notes | `docs/pl2/post-homepage-next.md` Priority 11 |
| Post-homepage tech debt | `docs/pl2/post-homepage-next.md` |
