<?php
/**
 * Wave 2 (#276) sub-phase A — homepage (canvas_page 20) hero rebuild.
 *
 * Scope (per the scope-cap split recorded in
 * docs/pl2/handoffs/wave2-276/handoff-F.md "Scope cap"):
 *   - Relabel the hero kicker to drop the headline echo (S advisory).
 *   - Insert the "Now in development — in the open" status pill
 *     (dripyard_base:pill, reused) as the FIRST child of the hero_content
 *     slot, per the approved wireframe's visual order.
 *   - Insert the new code-snippet SDC (docker run … snippet).
 *   - Insert the new browser-chrome SDC framing a placeholder screenshot
 *     (real Aftersight dashboard screenshot deferred — see handoff-F
 *     "Deviations from spec").
 *
 * Explicitly OUT of scope for this sub-phase (filed as follow-up issues,
 * see handoff-F "Scope cap"): product social-proof strip, nav visual-weight
 * CSS, 3 feature-anatomy sections, services/logo-grid relocation.
 *
 * Idempotent: always rebuilds the full `components` array for canvas_page 20
 * from the CURRENT live tree (re-loaded fresh each run), replacing only the
 * pieces this script owns (kicker text, hero_content slot for the four new/
 * modified pill+snippet+chrome instances). All other components (heading,
 * text, buttons, services section, logo grid, etc.) are carried over
 * byte-for-byte from the existing tree — this script does NOT touch their
 * `inputs` or `component_version`.
 *
 * component_version handling: every hash below is loaded live from the
 * `component` config entity (Component::getActiveVersion()) at script-run
 * time — never hand-typed, never NULL. The script throws before saving if
 * any hash resolves to null/empty (Canvas OutOfRangeException guard per
 * docs/pl2/canvas-minitems-platform-note.md).
 */

$page_storage = \Drupal::entityTypeManager()->getStorage('canvas_page');
$component_storage = \Drupal::entityTypeManager()->getStorage('component');

$entity = $page_storage->load(20);
if (!$entity) {
  throw new \Exception('canvas_page 20 not found');
}

function version_for($component_storage, string $component_id): string {
  $entity = $component_storage->load($component_id);
  if (!$entity) {
    throw new \Exception("Component config entity not found: $component_id (run drush cr first so new SDCs register)");
  }
  $version = $entity->getActiveVersion();
  if (empty($version)) {
    throw new \Exception("Component $component_id has no active version — aborting to avoid NULL component_version");
  }
  return $version;
}

$V = [
  'kicker' => version_for($component_storage, 'sdc.performant_labs_v2.kicker'),
  'pill' => version_for($component_storage, 'sdc.dripyard_base.pill'),
  'text' => version_for($component_storage, 'sdc.dripyard_base.text'),
  'code-snippet' => version_for($component_storage, 'sdc.performant_labs_v2.code-snippet'),
  'browser-chrome' => version_for($component_storage, 'sdc.performant_labs_v2.browser-chrome'),
];

$components = $entity->get('components')->getValue();

$hero_uuid = 'bfff578e-691f-4e06-bfd8-98d014d114aa';
$kicker_uuid = 'f3dc09e6-567e-43d0-ad03-9108dc9fed78';

$found_hero = FALSE;
$found_kicker = FALSE;

foreach ($components as &$c) {
  // 1. Relabel the hero kicker — drop the headline echo (S advisory:
  //    "Open-source test intelligence" kicker sits directly above an H1
  //    starting with "Aftersight — open-source test intelligence…", reading
  //    as repetition not reinforcement). Conservative non-echoing label,
  //    framework-agnostic, non-Drupal, consistent with the epic's guardrail.
  //    See handoff-F "Deviations from spec" for the resolution rationale.
  if ($c['uuid'] === $kicker_uuid) {
    $inputs = json_decode($c['inputs'], TRUE);
    $inputs['text'] = 'From Performant Labs';
    $c['inputs'] = json_encode($inputs);
    $found_kicker = TRUE;
  }
  if ($c['uuid'] === $hero_uuid) {
    $found_hero = TRUE;
  }
}
unset($c);

if (!$found_hero) {
  throw new \Exception("Hero component (uuid $hero_uuid) not found — homepage tree has changed since this script was written; re-verify UUIDs before re-running.");
}
if (!$found_kicker) {
  throw new \Exception("Hero kicker component (uuid $kicker_uuid) not found — homepage tree has changed since this script was written; re-verify UUIDs before re-running.");
}

// 2. Remove any pre-existing instances of the four new/managed component
//    types in the hero_content slot (idempotency — re-running this script
//    replaces rather than duplicates the pill/snippet/chrome/dot-text).
$managed_component_ids = [
  'sdc.dripyard_base.pill',
  'sdc.performant_labs_v2.code-snippet',
  'sdc.performant_labs_v2.browser-chrome',
];
$managed_uuids = [];
foreach ($components as $c) {
  if (in_array($c['component_id'], $managed_component_ids, TRUE) && ($c['parent_uuid'] ?? NULL) === $hero_uuid) {
    $managed_uuids[] = $c['uuid'];
  }
}
// Also collect any dripyard_base:text whose parent is one of the managed
// pill instances (the pill's dot+label nested text), so re-runs don't leak
// orphaned children.
foreach ($components as $c) {
  if ($c['component_id'] === 'sdc.dripyard_base.text' && in_array($c['parent_uuid'] ?? NULL, $managed_uuids, TRUE)) {
    $managed_uuids[] = $c['uuid'];
  }
}
if ($managed_uuids) {
  $components = array_values(array_filter($components, function ($c) use ($managed_uuids) {
    return !in_array($c['uuid'], $managed_uuids, TRUE);
  }));
}

function txt($value) {
  return [
    'value' => $value,
    'format' => 'canvas_html_block',
  ];
}

// 3. Build the three new instances: pill (with nested dot+label text),
//    code-snippet, browser-chrome. UUIDs are fixed (not random) so re-runs
//    are byte-identical rather than accumulating garbage UUIDs.
$pill_uuid = 'a276c001-0000-4000-8000-000000000001';
$pill_text_uuid = 'a276c001-0000-4000-8000-000000000002';
$snippet_uuid = 'a276c001-0000-4000-8000-000000000003';
$chrome_uuid = 'a276c001-0000-4000-8000-000000000004';

$new_instances = [
  // Dev-status pill — first child of hero_content per the approved
  // wireframe's visual order (pill sits above the headline).
  [
    'uuid' => $pill_uuid,
    'component_id' => 'sdc.dripyard_base.pill',
    'component_version' => $V['pill'],
    'parent_uuid' => $hero_uuid,
    'slot' => 'hero_content',
    'inputs' => json_encode([]),
    'label' => NULL,
  ],
  // Pill content: the approved copy "Now in development — in the open"
  // (verbatim, unchanged from #268/epic #267). A-phase fix-pass (F1): the
  // status dot is no longer authored as markup here — it moved to a CSS
  // ::before on .hero.theme--white .pill (hero.css), which removes the
  // dependency on the canvas_html_block filter's <div> allowlist entirely
  // (previously aria-hidden was silently stripped on save; a ::before has
  // no markup to strip).
  [
    'uuid' => $pill_text_uuid,
    'component_id' => 'sdc.dripyard_base.text',
    'component_version' => $V['text'],
    'parent_uuid' => $pill_uuid,
    'slot' => 'content',
    'inputs' => json_encode([
      'text' => txt('Now in development — in the open'),
      'style' => 'body_m',
      'color' => 'inherit',
    ]),
    'label' => NULL,
  ],
  // Terminal/code-snippet — dark by design (html .theme--black token
  // values asserted directly in code-snippet.css; see handoff-F "Layer
  // decisions"). Approved wireframe command/result pair.
  [
    'uuid' => $snippet_uuid,
    'component_id' => 'sdc.performant_labs_v2.code-snippet',
    'component_version' => $V['code-snippet'],
    'parent_uuid' => $hero_uuid,
    'slot' => 'hero_content',
    'inputs' => json_encode([
      'command_line' => 'docker run ctrfhub/aftersight',
      'result_line' => 'your first CTRF report in 60 seconds',
    ]),
    'label' => NULL,
  ],
  // Browser-chrome frame — light card, dark titlebar. Placeholder screenshot
  // (real asset deferred — see handoff-F "Deviations from spec" / "Known
  // issues"). Framework-agnostic caption: no framework/tool name implied.
  // A-phase fix-pass (F2): placeholder_title is now an explicit prop
  // (previously hardcoded product copy inside the twig).
  [
    'uuid' => $chrome_uuid,
    'component_id' => 'sdc.performant_labs_v2.browser-chrome',
    'component_version' => $V['browser-chrome'],
    'parent_uuid' => $hero_uuid,
    'slot' => 'hero_content',
    'inputs' => json_encode([
      'url_label' => 'aftersight.performantlabs.com',
      'image_alt' => 'Aftersight dashboard — CTRF run history and pass/fail summary (placeholder — real screenshot pending local-instance seed)',
      'is_placeholder' => TRUE,
      'placeholder_title' => 'Aftersight dashboard — coming soon',
      'placeholder_caption' => 'Real product screenshot lands once a seeded local instance is captured — tracked as a #276 follow-up.',
    ]),
    'label' => NULL,
  ],
];

// 4. Insert the new instances immediately after the hero component itself,
//    so the pill (first hero_content child) renders before the existing
//    kicker/heading/text/buttons in DOM order — matching the wireframe's
//    "pill above headline" visual order without reordering the
//    already-approved verbatim copy block's existing children.
$hero_index = NULL;
foreach ($components as $i => $c) {
  if ($c['uuid'] === $hero_uuid) {
    $hero_index = $i;
    break;
  }
}
if ($hero_index === NULL) {
  throw new \Exception('Hero index resolution failed unexpectedly after filtering.');
}

// Pill + its nested text go right after the hero opening (before kicker).
// Snippet + browser-chrome go at the end of the hero_content slot (after
// the existing buttons), matching the wireframe's bottom-of-hero placement.
array_splice($components, $hero_index + 1, 0, [
  $new_instances[0], // pill
  $new_instances[1], // pill text (dot + label)
]);

// Append snippet + chrome after all existing hero_content children (i.e.
// right before the next top-level component, which is the services
// section). Re-locate insertion point since indices shifted after splice.
$insert_at = NULL;
foreach ($components as $i => $c) {
  if (($c['parent_uuid'] ?? NULL) === $hero_uuid && $c['slot'] === 'hero_content') {
    $insert_at = $i + 1;
  }
}
if ($insert_at === NULL) {
  throw new \Exception('Could not locate end of hero_content slot children.');
}
array_splice($components, $insert_at, 0, [
  $new_instances[2], // code-snippet
  $new_instances[3], // browser-chrome
]);

$entity->set('components', $components);
$entity->save();

print "canvas_page 20 hero rebuild complete. Component count: " . count($components) . "\n";
