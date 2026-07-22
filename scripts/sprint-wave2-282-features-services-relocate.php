<?php
/**
 * Wave 2 (#276) sub-phase C (#282) — homepage (canvas_page 20) feature
 * anatomy + services/logo-grid relocation.
 *
 * Scope (per the scope-cap split recorded in
 * docs/pl2/handoffs/wave2-276/handoff-F.md "Scope cap", sub-phase C):
 *   - Insert 3 new top-level dripyard_base:section instances (History /
 *     Failure analytics / Search), each a 2-column grid-wrapper +
 *     grid-cell pair (copy column + UI-crop column, alternating left/right
 *     per the approved wireframe), positioned immediately AFTER the
 *     proof-strip section (sub-phase B, #281) and BEFORE the existing
 *     services section.
 *   - Move the existing services section (uuid a8933523...) and the
 *     existing logo-grid section (uuid d239b0c9...) to `theme: light`
 *     (cream register, matching the wireframe's demoted zone) — content
 *     (services header copy, card copy, logo grid) is UNTOUCHED, only the
 *     `theme` prop changes.
 *   - The final top-level order becomes: hero -> proof-strip -> feature 1
 *     -> feature 2 (reversed) -> feature 3 -> services -> logos ->
 *     heal-flow -> icon-list -> accordion -> closing CTA. This matches the
 *     approved wireframe's section order exactly (hero, proof strip,
 *     feature x3, services, logos, footer — heal-flow/icon-list/accordion/
 *     CTA are Wave-1 sections below the wireframe's scope and are left
 *     in their existing relative order, untouched, after services/logos).
 *
 * Component-reuse note (per RATIONALE.md's own mapping table, corrected
 * during implementation — see docs/pl2/handoffs/wave2-276-c/handoff-F.md
 * "Layer decisions" for the full reuse-search trace): the wireframe's
 * suggested mapping for the feature sections was `dripyard_base:content-card`,
 * but that component's schema (content-card.component.yml) has NO image/
 * media slot at all — it is a title + body-text + link card, not a
 * 2-column copy+media layout. Reuse-before-create instead uses
 * `dripyard_base:grid-wrapper` + `dripyard_base:grid-cell` (existing,
 * responsive 12-col layout primitives already used elsewhere on this same
 * page for the services card grid) for the 2-column structure, with the
 * copy column built from `performant_labs_v2:kicker` + `dripyard_base:heading`
 * + `dripyard_base:text` (bullet list via HTML, same reuse already
 * established for the accordion/track-record content elsewhere on this
 * site), and the UI-crop column reusing `performant_labs_v2:browser-chrome`
 * (the SAME honest-placeholder SDC built in sub-phase A for the hero
 * screenshot — its is_placeholder/placeholder_title/placeholder_caption
 * props were explicitly designed in sub-phase A's A-review fix-pass to be
 * reusable beyond the hero, see handoff-F.md fix-pass F2). No new
 * component created.
 *
 * component_version handling: every hash below is loaded live from the
 * `component` config entity (Component::getActiveVersion()) at script-run
 * time — never hand-typed, never NULL. The script throws before saving if
 * any hash resolves to null/empty (Canvas OutOfRangeException guard per
 * docs/pl2/canvas-minitems-platform-note.md). The services/logo-grid
 * relocation does NOT touch component_version on those subtrees at all —
 * only the section's own `theme` input changes; every descendant
 * component (cards, logos) keeps its existing valid hash untouched.
 *
 * Idempotent: identifies and removes this script's own previously-inserted
 * feature-section subtrees (by fixed root UUIDs) before re-inserting;
 * re-derives the services/logo-grid theme patch from the CURRENT live tree
 * on every run (so re-running is a no-op once the theme is already
 * "light"), so re-runs are byte-identical rather than accumulating
 * duplicates or re-touching an already-patched theme value.
 *
 * Does NOT touch the hero (sub-phase A, already landed) or the proof-strip
 * section (sub-phase B, #281, must run BEFORE this script so the insertion
 * point resolves correctly) or the approved verbatim copy inside the
 * services header (#269/epic #267) — that heading component's `inputs`
 * are read but never mutated.
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
  'section' => version_for($component_storage, 'sdc.dripyard_base.section'),
  'grid-wrapper' => version_for($component_storage, 'sdc.dripyard_base.grid-wrapper'),
  'grid-cell' => version_for($component_storage, 'sdc.dripyard_base.grid-cell'),
  'kicker' => version_for($component_storage, 'sdc.performant_labs_v2.kicker'),
  'heading' => version_for($component_storage, 'sdc.dripyard_base.heading'),
  'text' => version_for($component_storage, 'sdc.dripyard_base.text'),
  'browser-chrome' => version_for($component_storage, 'sdc.performant_labs_v2.browser-chrome'),
];

$components = $entity->get('components')->getValue();

$hero_uuid = 'bfff578e-691f-4e06-bfd8-98d014d114aa';
$proof_section_uuid = 'b281f100-0000-4000-8000-000000000001'; // sub-phase B, must exist
$services_section_uuid = 'a8933523-a619-4341-9ad7-bf2daf38cfa2';
$logo_section_uuid = 'd239b0c9-79a6-46c5-a8f4-e7c6279491e3';

$found_hero = FALSE;
$found_proof = FALSE;
$found_services = FALSE;
$found_logos = FALSE;
foreach ($components as $c) {
  if ($c['uuid'] === $hero_uuid) { $found_hero = TRUE; }
  if ($c['uuid'] === $proof_section_uuid) { $found_proof = TRUE; }
  if ($c['uuid'] === $services_section_uuid) { $found_services = TRUE; }
  if ($c['uuid'] === $logo_section_uuid) { $found_logos = TRUE; }
}
if (!$found_hero) {
  throw new \Exception("Hero component (uuid $hero_uuid) not found — homepage tree has changed since this script was written.");
}
if (!$found_proof) {
  throw new \Exception("Proof-strip section (uuid $proof_section_uuid) not found — run scripts/sprint-wave2-281-proof-strip-nav.php (sub-phase B) BEFORE this script.");
}
if (!$found_services) {
  throw new \Exception("Services section (uuid $services_section_uuid) not found — homepage tree has changed since this script was written.");
}
if (!$found_logos) {
  throw new \Exception("Logo-grid section (uuid $logo_section_uuid) not found — homepage tree has changed since this script was written.");
}

// 1. Idempotency: remove this script's own previously-inserted feature
//    section subtrees (identified by fixed root UUIDs + transitive
//    descendants), before re-inserting.
$feature_root_uuids = [
  'b282f100-0000-4000-8000-000000000001', // feature 1: History
  'b282f100-0000-4000-8000-000000000002', // feature 2: Failure analytics (reversed)
  'b282f100-0000-4000-8000-000000000003', // feature 3: Search
];
$to_remove = $feature_root_uuids;
$changed = TRUE;
while ($changed) {
  $changed = FALSE;
  foreach ($components as $c) {
    if (in_array($c['parent_uuid'] ?? NULL, $to_remove, TRUE) && !in_array($c['uuid'], $to_remove, TRUE)) {
      $to_remove[] = $c['uuid'];
      $changed = TRUE;
    }
  }
}
$components = array_values(array_filter($components, function ($c) use ($to_remove) {
  return !in_array($c['uuid'], $to_remove, TRUE);
}));

function txt($value) {
  return [
    'value' => $value,
    'format' => 'canvas_html_block',
  ];
}

// 2. Re-theme services + logo-grid sections to `light` (cream), re-derived
//    from the CURRENT live tree on every run — idempotent (a second run
//    finds theme already = light and rewrites the same value, a no-op).
foreach ($components as &$c) {
  if ($c['uuid'] === $services_section_uuid || $c['uuid'] === $logo_section_uuid) {
    $inputs = json_decode($c['inputs'], TRUE);
    $inputs['theme'] = 'light';
    $c['inputs'] = json_encode($inputs);
  }
}
unset($c);

// 3. Build the 3 feature-anatomy sections. Each is:
//    section (theme=white, per RATIONALE.md "white background, unchanged
//      in principle" — the feature sections were never part of the
//      light/dark demotion mechanism, only services/proof-strip are cream)
//      > grid-wrapper (2-col: copy cell + crop cell, order alternates)
//          > grid-cell (copy): kicker + heading(h3) + text(body, bullet list)
//          > grid-cell (crop): browser-chrome (placeholder UI crop)
//
// Mobile-first responsiveness: columns_small=12 (both cells stack full-
// width on narrow viewports — grid-cell's own responsive column-span
// mechanism, not a new max-width query), columns_large=6 (2-up at
// desktop). This matches the wireframe's `@media (max-width:820px)
// { flex-direction: column }` collapse behavior using the grid system's
// own built-in responsive columns rather than a bespoke media query.
function feature_section(array $V, string $section_uuid, string $grid_uuid,
  string $copy_cell_uuid, string $crop_cell_uuid, string $kicker_uuid,
  string $heading_uuid, string $text_uuid, string $chrome_uuid,
  string $kicker_text, string $heading_text, string $list_html,
  string $chrome_url_label, string $chrome_alt, string $chrome_title,
  string $chrome_caption, bool $reversed, ?string $group_label_uuid = NULL): array {

  $components = [
    [
      'uuid' => $section_uuid,
      'component_id' => 'sdc.dripyard_base.section',
      'component_version' => $V['section'],
      'parent_uuid' => NULL,
      'slot' => NULL,
      'inputs' => json_encode([
        'theme' => 'white',
        'section_width' => 'max-width',
        'content_width' => 'max-width',
        'margin_top' => 'zero',
        'margin_bottom' => 'zero',
        'padding_top' => 'large',
        'padding_bottom' => 'large',
        'additional_classes' => 'dy-section--feature-anatomy' . ($reversed ? ' dy-section--feature-anatomy-reverse' : ''),
      ]),
      'label' => NULL,
    ],
  ];

  // Heading-hierarchy fix (found during T2 self-verification, live-
  // measured): without a section header, the page's heading order jumped
  // H1 -> H3 directly (each feature section's H3, with no intervening H2)
  // — every other section on this page nests its H3s under an explicit H2
  // (services "The team behind...", accordion, etc.), and the nav already
  // establishes the site's own visually-hidden-H2-as-group-label pattern
  // (`h2.visually-hidden.h3.menu-block__title`, confirmed live). Added a
  // single visually-hidden H2 "Product features" as the FIRST feature
  // section's header-slot content only (not repeated on features 2/3,
  // since it labels the group of three sections once, not each section
  // individually) using the same `.visually-hidden` Drupal-core utility
  // class the nav itself already relies on sitewide. Screen-reader users
  // now encounter H1 -> H2 (hidden group label) -> H3 (feature 1) -> H3
  // (feature 2) -> H3 (feature 3) -> H2 (Services) — no skipped level.
  if ($group_label_uuid !== NULL) {
    $components[] = [
      'uuid' => $group_label_uuid,
      'component_id' => 'sdc.dripyard_base.heading',
      'component_version' => $V['heading'],
      'parent_uuid' => $section_uuid,
      'slot' => 'header',
      'inputs' => json_encode([
        'text' => 'Product features',
        'html_element' => 'h2',
        'style' => 'h2',
        'margin_top' => 'zero',
        'margin_bottom' => 'zero',
        'modifier_classes' => 'visually-hidden',
      ]),
      'label' => NULL,
    ];
  }

  $components = array_merge($components, [
    [
      'uuid' => $grid_uuid,
      'component_id' => 'sdc.dripyard_base.grid-wrapper',
      'component_version' => $V['grid-wrapper'],
      'parent_uuid' => $section_uuid,
      'slot' => 'content',
      'inputs' => json_encode([
        'column_gutter' => 'large',
        'row_gutter' => 'medium',
        'additional_classes' => 'grid-wrapper--feature-anatomy',
      ]),
      'label' => NULL,
    ],
    // Copy cell — first in DOM for feature 1/3 (left column desktop),
    // second in DOM for feature 2 (reversed — right column desktop). The
    // `reversed` flag controls insertion ORDER below (see the caller),
    // not a prop on the cell itself (grid-cell has no "order" prop).
    [
      'uuid' => $copy_cell_uuid,
      'component_id' => 'sdc.dripyard_base.grid-cell',
      'component_version' => $V['grid-cell'],
      'parent_uuid' => $grid_uuid,
      'slot' => 'grid_cells',
      'inputs' => json_encode([
        'padding' => 'zero',
        'columns_small' => 12,
        'columns_medium' => 6,
        'columns_large' => 6,
        'rows_small' => 1,
        'rows_medium' => 1,
        'rows_large' => 1,
        'vertical_alignment' => 'center',
        'additional_classes' => 'grid-cell--feature-copy',
      ]),
      'label' => NULL,
    ],
    [
      'uuid' => $kicker_uuid,
      'component_id' => 'sdc.performant_labs_v2.kicker',
      'component_version' => $V['kicker'],
      'parent_uuid' => $copy_cell_uuid,
      'slot' => 'content',
      'inputs' => json_encode([
        'text' => $kicker_text,
        'variant' => 'inline',
        'theme' => 'light',
      ]),
      'label' => NULL,
    ],
    [
      'uuid' => $heading_uuid,
      'component_id' => 'sdc.dripyard_base.heading',
      'component_version' => $V['heading'],
      'parent_uuid' => $copy_cell_uuid,
      'slot' => 'content',
      'inputs' => json_encode([
        'text' => $heading_text,
        'html_element' => 'h3',
        'style' => 'h3',
        'margin_top' => 'small',
        'margin_bottom' => 'small',
      ]),
      'label' => NULL,
    ],
    [
      'uuid' => $text_uuid,
      'component_id' => 'sdc.dripyard_base.text',
      'component_version' => $V['text'],
      'parent_uuid' => $copy_cell_uuid,
      'slot' => 'content',
      'inputs' => json_encode([
        'text' => txt($list_html),
        'style' => 'body_m',
        'color' => 'soft',
      ]),
      'label' => NULL,
    ],
    // Crop cell — UI-crop placeholder, same honest-placeholder pattern as
    // the hero screenshot (browser-chrome, is_placeholder=true).
    [
      'uuid' => $crop_cell_uuid,
      'component_id' => 'sdc.dripyard_base.grid-cell',
      'component_version' => $V['grid-cell'],
      'parent_uuid' => $grid_uuid,
      'slot' => 'grid_cells',
      'inputs' => json_encode([
        'padding' => 'zero',
        'columns_small' => 12,
        'columns_medium' => 6,
        'columns_large' => 6,
        'rows_small' => 1,
        'rows_medium' => 1,
        'rows_large' => 1,
        'vertical_alignment' => 'center',
        'additional_classes' => 'grid-cell--feature-crop',
      ]),
      'label' => NULL,
    ],
    [
      'uuid' => $chrome_uuid,
      'component_id' => 'sdc.performant_labs_v2.browser-chrome',
      'component_version' => $V['browser-chrome'],
      'parent_uuid' => $crop_cell_uuid,
      'slot' => 'content',
      'inputs' => json_encode([
        'url_label' => $chrome_url_label,
        'image_alt' => $chrome_alt,
        'is_placeholder' => TRUE,
        'placeholder_title' => $chrome_title,
        'placeholder_caption' => $chrome_caption,
      ]),
      'label' => NULL,
    ],
  ]);

  return $components;
}

// Feature 1: History (copy left, crop right — natural DOM order).
$feature1 = feature_section(
  $V,
  'b282f100-0000-4000-8000-000000000001',
  'b282f100-0000-4000-8000-000000000011',
  'b282f100-0000-4000-8000-000000000012',
  'b282f100-0000-4000-8000-000000000013',
  'b282f100-0000-4000-8000-000000000014',
  'b282f100-0000-4000-8000-000000000015',
  'b282f100-0000-4000-8000-000000000016',
  'b282f100-0000-4000-8000-000000000017',
  'HISTORY',
  'Every run, one continuous timeline',
  '<p>CTRF reports land automatically and build a searchable history — no more digging through CI logs to find when a test started failing.</p><ul><li>Pass/fail trend per suite</li><li>Jump straight to the offending commit</li><li>Works with any CTRF-emitting runner</li></ul>',
  'aftersight.performantlabs.com/history',
  'Aftersight history view — run timeline and pass/fail trend chart (placeholder — real screenshot pending local-instance seed)',
  'History view',
  'Run timeline + trend chart — real product screenshot lands once a seeded local instance is captured.',
  FALSE,
  'b282f100-0000-4000-8000-000000000018', // visually-hidden H2 group label (feature 1 only)
);

// Feature 2: Failure analytics (REVERSED — crop left, copy right on
// desktop; achieved via DOM insertion order below, not a grid-cell prop).
$feature2 = feature_section(
  $V,
  'b282f100-0000-4000-8000-000000000002',
  'b282f100-0000-4000-8000-000000000021',
  'b282f100-0000-4000-8000-000000000022',
  'b282f100-0000-4000-8000-000000000023',
  'b282f100-0000-4000-8000-000000000024',
  'b282f100-0000-4000-8000-000000000025',
  'b282f100-0000-4000-8000-000000000026',
  'b282f100-0000-4000-8000-000000000027',
  'FAILURE ANALYTICS',
  "See patterns, not just red X's",
  '<p>Aftersight clusters recurring failures across runs so flaky tests and real regressions stop looking identical in a wall of red.</p><ul><li>Failure clustering across runs</li><li>Flaky vs. broken signal</li><li>AI-assisted root-cause hints</li></ul>',
  'aftersight.performantlabs.com/analytics',
  'Aftersight failure analytics — clustering view (placeholder — real screenshot pending local-instance seed)',
  'Failure analytics',
  'Clustering view — real product screenshot lands once a seeded local instance is captured.',
  TRUE,
);

// Feature 3: Search (copy left, crop right).
$feature3 = feature_section(
  $V,
  'b282f100-0000-4000-8000-000000000003',
  'b282f100-0000-4000-8000-000000000031',
  'b282f100-0000-4000-8000-000000000032',
  'b282f100-0000-4000-8000-000000000033',
  'b282f100-0000-4000-8000-000000000034',
  'b282f100-0000-4000-8000-000000000035',
  'b282f100-0000-4000-8000-000000000036',
  'b282f100-0000-4000-8000-000000000037',
  'SEARCH',
  'Find the one failing assertion, fast',
  '<p>Full-text search across every report, stack trace, and log line — self-hosted, so your test data never leaves your infrastructure.</p><ul><li>Full-text across all reports</li><li>Filter by suite, tag, status</li><li>Self-hosted — your data, your servers</li></ul>',
  'aftersight.performantlabs.com/search',
  'Aftersight search view — query and result list (placeholder — real screenshot pending local-instance seed)',
  'Search view',
  'Query + result list — real product screenshot lands once a seeded local instance is captured.',
  FALSE,
);

// 4. Assemble the 3 sections in wireframe order (History, Failure
//    analytics, Search), each section's own components already carrying
//    the correct copy/crop cell DOM order per its `reversed` flag (feature
//    2's builder emits [section, grid, copy-cell..., crop-cell...] just
//    like the others — "reversed" only changes the CSS presentation via
//    the .dy-section--feature-anatomy-reverse marker class + CSS Grid
//    `order` on the copy/crop grid-cells (see
//    css/components/grid-wrapper.css — NOT a flex-wrapper row-reverse
//    rule; the feature-anatomy layout is dripyard_base:grid-wrapper +
//    grid-cell, a CSS Grid primitive, not a flex-wrapper, so there is no
//    flex-direction involved anywhere in this mechanism — corrected
//    2026-07-22 per A-phase review N1, this comment previously misnamed
//    both the file and the CSS property), matching the wireframe's own
//    `.feature.reverse { flex-direction: row-reverse }` visual INTENT
//    (crop-left/copy-right for feature 2) via a different underlying CSS
//    mechanism appropriate to the Grid-based layout actually used here —
//    DOM order does NOT change, only visual order, so a screen reader
//    always encounters copy before the UI-crop regardless of the visual
//    left/right position).
$all_features = array_merge($feature1, $feature2, $feature3);

// 5. Insert the 3 feature sections immediately before the services
//    section (i.e. immediately after the proof-strip section).
$insert_index = NULL;
foreach ($components as $i => $c) {
  if ($c['uuid'] === $services_section_uuid) {
    $insert_index = $i;
    break;
  }
}
if ($insert_index === NULL) {
  throw new \Exception('Could not locate services section for insertion point after re-filtering.');
}
array_splice($components, $insert_index, 0, $all_features);

$entity->set('components', $components);
$entity->save();

print "canvas_page 20 feature-anatomy + services-relocation complete. Component count: " . count($components) . "\n";
