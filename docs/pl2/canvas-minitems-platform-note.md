# Canvas Platform Note — JSON-Schema Constraints on Array-Typed SDC Props

> **Origin:** [`docs/pl2/post-homepage-next.md`](post-homepage-next.md) Priority 11  
> **Last verified:** 2026-05-04 against Canvas module source at `web/modules/contrib/canvas/src/JsonSchemaInterpreter/JsonSchemaType.php`  
> **Applies to:** Any SDC author defining `type: array` props intended for use inside Canvas page builder.

---

## TL;DR

Canvas's `JsonSchemaType::computeStorablePropShape()` maintains a **whitelist** of array-level keywords: only `type`, `items`, and `maxItems` are accepted. Every other JSON-Schema keyword at the array level — including `minItems`, `examples`, `pattern`, `enum`, and `format` — causes `computeStorablePropShape()` to return `NULL`, which makes the prop **non-storable** in Canvas. The component may still render in the SDC Styleguide explorer, but Canvas cannot generate a field + widget for it, so it cannot be placed on a Canvas page.

---

## Source of truth

**File:** `web/modules/contrib/canvas/src/JsonSchemaInterpreter/JsonSchemaType.php`  
**Method:** `computeStorablePropShape()`  
**Lines:** 235–284 (array-typed branch: 242–284)

The decisive guard is at **line 253**:

```php
if (!empty(array_diff(\array_keys($schema), ['type', 'items', 'maxItems']))) {
  return NULL;
}
```

`array_diff()` returns every key in the schema that is **not** in the whitelist `['type', 'items', 'maxItems']`. If any extra key exists, the method returns `NULL` immediately. No validation error is thrown — the failure is silent from an author's perspective.

---

## Constraint verdicts

| Constraint | Level | Verdict | Evidence | User-visible symptom |
|---|---|---|---|---|
| `maxItems` | Array | **Accepted** | `JsonSchemaType.php:268–280` — validated, mapped to Field API cardinality | Editor widget enforces max count |
| `minItems` | Array | **Rejected** | `JsonSchemaType.php:253` — not in whitelist; lines 243–252 explain Drupal Field API has no native min-count support | Component appears in SDC explorer but Canvas page builder shows "No field type available" for the prop |
| `examples` | Array | **Rejected** | `JsonSchemaType.php:253` — not in whitelist; `@todo` at line 257 acknowledges this | Same as above: prop non-storable in Canvas |
| `pattern` | Array | **Rejected** | `JsonSchemaType.php:253` — not in whitelist | Same as above |
| `enum` | Array | **Rejected** | `JsonSchemaType.php:253` — not in whitelist | Same as above |
| `format` | Array | **Rejected** | `JsonSchemaType.php:253` — not in whitelist | Same as above |
| `pattern` | String item | **Mostly rejected** | `JsonSchemaType.php:325–328` — only pattern `'(.|\r?\n)*'` is accepted; `@todo` at line 324 confirms full support is missing | Prop non-storable unless pattern is exactly that multiline regex |
| `enum` | String item | **Accepted** | `JsonSchemaType.php:309–321` | Dropdown widget with allowed values |
| `format` | String item | **Accepted** | `JsonSchemaType.php:323` — delegates to `JsonSchemaStringFormat::computeStorablePropShape()` | Widget varies by format (date, email, link, etc.) |
| `enum` | Integer/Number item | **Accepted** | `JsonSchemaType.php:350` (int), `372` (number) | Dropdown widget with allowed values |

### Important distinction: array-level vs. item-level

The whitelist at line 253 applies to **array-level keys**. Constraints placed inside the `items` schema are evaluated against the **item type** (`string`, `integer`, `number`, etc.) via the recursive call at line 263:

```php
$array_item_prop_shape = PropShape::normalize($schema['items']);
$item_storable_prop_shape = $shape_repository->getStorablePropShape($array_item_prop_shape);
```

So a schema like this is **safe** (constraints are inside `items`):

```yaml
# SAFE — constraints are on the item, not the array
tags:
  type: array
  items:
    type: string
    enum: [foo, bar, baz]   # ← item-level: ACCEPTED
```

But a schema like this is **dangerous** (constraint at array level):

```yaml
# DANGEROUS — minItems at array level causes NULL return
steps:
  type: array
  minItems: 2              # ← array-level: REJECTED
  items:
    type: string
```

---

## Why `minItems` cannot be supported

Canvas includes an explicit rationale at lines 243–252:

> "Drupal core's Field API only supports specifying 'required or not', and required means '>=1 value'. There's no (native) ability to configure a minimum number of values for a field. Plus, JSON schema allows declaring that an array must be non-empty (`minItems: 1`) even for an optional array (not listed in `required`). So, it is impossible to support `minItems`. And in fact, marking an SDC prop as required has the same effect as `minItems: 1`."

**Reference:** `JsonSchemaType.php:243–252`  
**Related contrib module:** [unlimited_field_settings](https://www.drupal.org/project/unlimited_field_settings) (mentioned at line 250 as a potential future enabler)

---

## Heal-flow SDC — the real-world example

The [`heal-flow` component](../web/themes/custom/performant_labs_20260502/components/heal-flow/heal-flow.component.yml) uses three parallel string arrays (`step_numbers`, `step_labels`, `step_is_endpoints`) instead of a single `array<object>` because Canvas cannot store array-of-objects props unless the object uses a well-known `$ref` (e.g., `json-schema-definitions://canvas.module/image`).

Each array prop declares `maxItems: 6` (accepted) but cannot declare `minItems: 2` (rejected). The **conceptual constraint** is:

> "A process flow needs at least 2 steps to be meaningful."

> **Note:** As currently authored, all three props also carry `examples` at the array level, which causes `computeStorablePropShape()` to return `NULL` for each (the same rejection mechanism as `minItems`). The `examples` keyword is present for SDC Styleguide authoring hints and does not affect direct-prop rendering, but it means these props cannot currently be configured in the Canvas page builder. To make them Canvas-storable, `examples` would need to move inside `items` or be removed from the array-level schema.

Since Canvas cannot enforce these constraints at the schema level, the minimum-step requirement must be enforced through **editorial discipline**:

1. **Content guidelines** documented for editors: "Always provide at least 2 steps when using the heal-flow component."
2. **Pre-publish review** (manual or automated via custom validation) to verify step count ≥ 2.
3. **Twig defensive rendering**: the template should gracefully handle 0 or 1 steps (e.g., skip rendering or show a fallback message).

---

## Copy-pasteable snippets

### Safe pattern — array props that work in Canvas

```yaml
# SAFE: Only array-level keywords Canvas accepts are present.
# Use this as your default template for array-typed SDC props.
my_array_prop:
  type: array
  title: My array prop
  description: A list of values. Canvas supports up to N items.
  maxItems: 10           # Optional — Canvas accepts this
  items:
    type: string         # Required — tells Canvas the item type
    title: Single item
    # Item-level constraints go HERE, not at the array level:
    enum: [a, b, c]      # OK — evaluated at item level
    format: email        # OK — evaluated at item level
```

### Dangerous pattern — rejected constraints that silently break Canvas

```yaml
# ⚠️ DANGER: Any of the following array-level keywords will cause
# computeStorablePropShape() to return NULL, making the prop
# non-storable in Canvas. The component will still appear in the
# SDC Styleguide explorer, but Canvas page builder cannot generate
# a field + widget for it.
my_array_prop:
  type: array
  # ❌ REJECTED — not in whitelist ['type', 'items', 'maxItems']
  minItems: 2
  # ❌ REJECTED — not in whitelist
  examples:
    - - foo
      - bar
  # ❌ REJECTED — not in whitelist (array-level pattern makes no
  #   semantic sense anyway, but authors sometimes try it)
  pattern: '^[a-z]+$'
  # ❌ REJECTED — not in whitelist (array-level enum is invalid
  #   JSON-Schema; enum belongs inside items)
  enum: [foo, bar]
  # ❌ REJECTED — not in whitelist (format on array is invalid
  #   JSON-Schema; format belongs inside items for string arrays)
  format: uri
  items:
    type: string
```

---

## What "silently rejected" looks like in practice

When `computeStorablePropShape()` returns `NULL` for an array prop:

1. **No PHP exception** is thrown during SDC registration or page render.
2. **No validation error** appears in the SDC Styleguide explorer — the component renders fine there because the explorer uses direct prop passing, not Canvas field storage.
3. **Canvas page builder** will show the component in the component picker, but when an editor tries to configure the prop, Canvas cannot find a field type/widget mapping. The prop may appear as uneditable, grayed out, or entirely missing from the configuration form.
4. **The symptom is discoverable** by checking `hook_canvas_storable_prop_shape_alter()` or by tracing `computeStorablePropShape()` with a debugger — but not from the UI.

---

## Cross-references

- [`docs/pl2/post-homepage-next.md`](post-homepage-next.md) — Priority 11, the original debt discovery
- [`docs/pl2/workflow-ofts.md`](workflow-ofts.md) — OFTS pipeline conventions
- `web/modules/contrib/canvas/src/JsonSchemaInterpreter/JsonSchemaType.php` — source file, lines 235–284
- `web/modules/contrib/canvas/src/JsonSchemaInterpreter/JsonSchemaStringFormat.php` — string `format` support matrix
- `web/themes/custom/performant_labs_20260502/components/heal-flow/heal-flow.component.yml` — real SDC using parallel arrays with `maxItems`

---

## Changelog

| Date | Change |
|---|---|
| 2026-05-04 | Initial document created from source-code audit of Canvas `JsonSchemaType.php` (commit `f7ac4b1` on branch `aa/pl-cycle-debt-1-mobile-scroll`) |
