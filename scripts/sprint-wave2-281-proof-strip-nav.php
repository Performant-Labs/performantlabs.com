<?php
/**
 * Wave 2 (#276) sub-phase B (#281) — homepage (canvas_page 20) product
 * social-proof strip.
 *
 * Scope (per the scope-cap split recorded in
 * docs/pl2/handoffs/wave2-276/handoff-F.md "Scope cap", sub-phase B):
 *   - Insert a new top-level dripyard_base:section (theme=light, cream
 *     register) immediately AFTER the hero and BEFORE the existing services
 *     section, containing:
 *       - a dripyard_base:flex-wrapper row of dripyard_base:statistic
 *         instances (stars, watchers, version) + a dripyard_base:pill
 *         (MIT badge)
 *       - a dripyard_base:text build-note teaser line below the row
 *   - Nav visual-weight CSS is a separate, CSS-only change (see
 *     css/components/header.css) — no Canvas/content edit needed for that
 *     half of this sub-phase, since nav order/labels are #270's scope and
 *     already landed; only a visual treatment class distinction is added
 *     via existing `href`/`data-drupal-link-system-path` selectors.
 *
 * GitHub star/watcher live-wiring: the epic-267 binding decision (see #276
 * sign-off comment) is that the repo is currently PRIVATE, so a live
 * GitHub API count would be either broken or misleading. Per the same
 * graceful-degradation pattern already used for the hero's primary CTA
 * (labeled "Follow the build" -> /articles, no live star count), this
 * script renders the star/watcher statistics as clearly-labeled
 * placeholder figures (not wired to a live API), and does NOT link them to
 * github.com/Performant-Labs/aftersight (private, would 404 for the
 * public). Version number IS wired to a real, non-placeholder value in a
 * cheap way: the Aftersight repo's own package.json "version" field
 * (0.2.2 as of this script's authoring), which does not require live API
 * access — see docs/pl2/handoffs/wave2-276-b/handoff-F.md "Deviations from
 * spec" for the full reasoning and the follow-up needed once the repo goes
 * public.
 *
 * component_version handling: every hash below is loaded live from the
 * `component` config entity (Component::getActiveVersion()) at script-run
 * time — never hand-typed, never NULL. The script throws before saving if
 * any hash resolves to null/empty (Canvas OutOfRangeException guard per
 * docs/pl2/canvas-minitems-platform-note.md).
 *
 * Idempotent: identifies and removes its own previously-inserted proof-strip
 * section (by fixed UUID) before re-inserting, so re-runs are byte-identical
 * rather than accumulating duplicates. Does NOT touch the hero (sub-phase A,
 * already landed) or any other existing top-level section — this script
 * only inserts one new section between the hero and the services section.
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
  'flex-wrapper' => version_for($component_storage, 'sdc.dripyard_base.flex-wrapper'),
  'statistic' => version_for($component_storage, 'sdc.dripyard_base.statistic'),
  'pill' => version_for($component_storage, 'sdc.dripyard_base.pill'),
  'text' => version_for($component_storage, 'sdc.dripyard_base.text'),
];

$components = $entity->get('components')->getValue();

$hero_uuid = 'bfff578e-691f-4e06-bfd8-98d014d114aa';
$services_section_uuid = 'a8933523-a619-4341-9ad7-bf2daf38cfa2';

$found_hero = FALSE;
$found_services = FALSE;
foreach ($components as $c) {
  if ($c['uuid'] === $hero_uuid) {
    $found_hero = TRUE;
  }
  if ($c['uuid'] === $services_section_uuid) {
    $found_services = TRUE;
  }
}
if (!$found_hero) {
  throw new \Exception("Hero component (uuid $hero_uuid) not found — homepage tree has changed since this script was written; re-verify UUIDs before re-running.");
}
if (!$found_services) {
  throw new \Exception("Services section (uuid $services_section_uuid) not found — homepage tree has changed since this script was written; re-verify UUIDs before re-running.");
}

// 1. Idempotency: remove this script's own previously-inserted subtree
//    (proof-strip section + all its descendants), identified by the fixed
//    root UUID and any component whose ancestor chain leads back to it.
$proof_section_uuid = 'b281f100-0000-4000-8000-000000000001';

$to_remove = [$proof_section_uuid];
// Collect descendants transitively (parent_uuid chains).
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

// 2. Read the Aftersight package.json version live (cheap, non-API,
//    non-placeholder — see file header). The ddev web container has its
//    own filesystem with no mount of the sibling aftersight checkout
//    (verified: `ddev exec` cannot see the host's ~/Projects/aftersight),
//    so this cannot be read directly from inside the drush script. Instead
//    the CALLER (the shell invocation, see docs/pl2/handoffs/wave2-276-b/
//    handoff-F.md "Verification results" for the exact command) reads the
//    host-side package.json and passes the version through the
//    AFTERSIGHT_VERSION environment variable, which `ddev drush php:script
//    --` forwards into the container. Falls back to a clearly-labeled
//    placeholder if the env var is not set (keeps the script runnable
//    standalone, e.g. directly via `drush php:script` without the wrapper).
$aftersight_version = 'v0.x-dev';
$env_version = getenv('AFTERSIGHT_VERSION');
if (!empty($env_version)) {
  $aftersight_version = 'v' . $env_version . '-dev';
}

// 3. Build the proof-strip subtree.
//
// Component-reuse correction (found during T2 self-verification, live-
// measured, BEFORE this landed in a handoff): the wireframe's own mapping
// table (RATIONALE.md) proposed `dripyard_base:statistic` for the
// stars/watchers/version figures. `statistic` was tried first (reuse-
// before-create's first candidate) but its `.component.yml` documents (and
// `statistic.example.twig` confirms) that it's built for animated numeric
// KPIs — `statistic.js`'s `Drupal.behaviors.statCounter` runs every
// `.stat__stat` element through `keepNumbersCommasDecimals()` then
// `countUp.js`, which STRIPS every non-digit character (including "★", "—",
// and the "v"/"." in a version string) and animates from 0. Live-rendered
// result: "★ —" and "—" (the honest private-repo placeholders) and
// "v0.2.2-dev" (the real version value) were ALL silently corrupted to "0"
// on page load — a real functional/content-integrity bug, caught via
// Playwright screenshot during self-verification, not by guessing. None of
// this sub-phase's three proof-strip values are genuine animatable numeric
// KPIs (two are intentional non-numeric placeholders, one is a version
// string), so `statistic` is the wrong component for this use case despite
// matching the wireframe's suggested mapping.
//
// Re-ran reuse-before-create with this constraint in mind: `dripyard_base:
// text` (already used elsewhere in this same script for the pill/build-note
// content) has no JS behavior, accepts arbitrary HTML per its
// `contentMediaType: text/html` prop (canvas_html_block filter allows
// `<div>`), and matches the wireframe's actual `.proof-item` markup
// shape (a small label + value pair, not an animated big-number KPI)
// more faithfully than `statistic` ever did. Reused instead — no new
// component created; this is a corrected reuse-search verdict, recorded
// here rather than in a separate revision.
$flex_uuid = 'b281f100-0000-4000-8000-000000000002';
$stat_stars_uuid = 'b281f100-0000-4000-8000-000000000003';
$stat_watch_uuid = 'b281f100-0000-4000-8000-000000000004';
$pill_uuid = 'b281f100-0000-4000-8000-000000000005';
$pill_text_uuid = 'b281f100-0000-4000-8000-000000000006';
$stat_version_uuid = 'b281f100-0000-4000-8000-000000000007';
$buildnote_uuid = 'b281f100-0000-4000-8000-000000000008';

$new_components = [
  // Section wrapper — cream register (theme=light), matches the wireframe's
  // proof-strip surface-alt zone. additional_classes marker follows the
  // established dy-section marker-class convention (see dy-section.css).
  [
    'uuid' => $proof_section_uuid,
    'component_id' => 'sdc.dripyard_base.section',
    'component_version' => $V['section'],
    'parent_uuid' => NULL,
    'slot' => NULL,
    'inputs' => json_encode([
      'theme' => 'light',
      'section_width' => 'max-width',
      'content_width' => 'max-width',
      'margin_top' => 'zero',
      'margin_bottom' => 'zero',
      'padding_top' => 'medium',
      'padding_bottom' => 'medium',
      'additional_classes' => 'dy-section--proof-strip',
    ]),
    'label' => NULL,
  ],
  // Flex row: stars item + watchers item + version item + MIT pill,
  // centered, wrapping.
  [
    'uuid' => $flex_uuid,
    'component_id' => 'sdc.dripyard_base.flex-wrapper',
    'component_version' => $V['flex-wrapper'],
    'parent_uuid' => $proof_section_uuid,
    'slot' => 'content',
    'inputs' => json_encode([
      'margin_top' => 'zero',
      'margin_bottom' => 'zero',
      'padding_top' => 'zero',
      'padding_bottom' => 'zero',
      'column_gutter' => 'large',
      'row_gutter' => 'medium',
      'align_x' => 'center',
      'align_y' => 'center',
      'wrap' => TRUE,
      'additional_classes' => 'proof-strip__row',
    ]),
    'label' => NULL,
  ],
  // GitHub stars — placeholder figure, NOT wired to a live API (repo is
  // private per the epic-267 binding decision). No href/link markup — the
  // epic's own ruling keeps the star COUNT un-linked while the repo is
  // private (the primary CTA already carries the sole "-> /articles"
  // GitHub-adjacent link; duplicating a private-repo link here would
  // repeat the same broken-link risk the CTA ruling was written to avoid).
  // Rendered via dripyard_base:text (see reuse-search note above), HTML
  // structure mirrors the wireframe's .proof-item markup (value + label).
  [
    'uuid' => $stat_stars_uuid,
    'component_id' => 'sdc.dripyard_base.text',
    'component_version' => $V['text'],
    'parent_uuid' => $flex_uuid,
    'slot' => 'content',
    'inputs' => json_encode([
      'text' => txt('<div class="proof-item"><div class="proof-item__n">★ &mdash;</div><div class="proof-item__label">stars</div><div class="proof-item__sub">repo is private for now</div></div>'),
      'style' => 'body_m',
      'color' => 'inherit',
    ]),
    'label' => NULL,
  ],
  // Watchers — same graceful-degradation treatment as stars.
  [
    'uuid' => $stat_watch_uuid,
    'component_id' => 'sdc.dripyard_base.text',
    'component_version' => $V['text'],
    'parent_uuid' => $flex_uuid,
    'slot' => 'content',
    'inputs' => json_encode([
      'text' => txt('<div class="proof-item"><div class="proof-item__n">&mdash;</div><div class="proof-item__label">watching</div><div class="proof-item__sub">public count at launch</div></div>'),
      'style' => 'body_m',
      'color' => 'inherit',
    ]),
    'label' => NULL,
  ],
  // Version — real value, live-sourced from the aftersight repo's
  // package.json at script-run time (see $aftersight_version above).
  // htmlspecialchars() guards against the value ever containing characters
  // that would break out of the text prop's HTML (defensive; package.json
  // "version" fields are semver strings in practice).
  [
    'uuid' => $stat_version_uuid,
    'component_id' => 'sdc.dripyard_base.text',
    'component_version' => $V['text'],
    'parent_uuid' => $flex_uuid,
    'slot' => 'content',
    'inputs' => json_encode([
      'text' => txt('<div class="proof-item"><div class="proof-item__n">' . htmlspecialchars($aftersight_version, ENT_QUOTES) . '</div><div class="proof-item__label">current build</div><div class="proof-item__sub">self-hosted &middot; CTRF-native</div></div>'),
      'style' => 'body_m',
      'color' => 'inherit',
    ]),
    'label' => NULL,
  ],
  // MIT badge — dripyard_base:pill, reused (same component/pattern as the
  // hero's dev-status pill from sub-phase A).
  [
    'uuid' => $pill_uuid,
    'component_id' => 'sdc.dripyard_base.pill',
    'component_version' => $V['pill'],
    'parent_uuid' => $flex_uuid,
    'slot' => 'content',
    // pill.component.yml has no props at all (confirmed by reading the
    // schema before writing this script) — no additional_classes prop
    // exists, matching sub-phase A's hero dev-status pill finding. The
    // MIT-badge styling is applied structurally via CSS (see
    // css/components/dy-section.css .dy-section--proof-strip .pill),
    // scoped to this section only, same pattern as hero.css's
    // `.hero.theme--white .hero__block-content > .pill` override.
    'inputs' => json_encode([]),
    'label' => NULL,
  ],
  [
    'uuid' => $pill_text_uuid,
    'component_id' => 'sdc.dripyard_base.text',
    'component_version' => $V['text'],
    'parent_uuid' => $pill_uuid,
    'slot' => 'content',
    'inputs' => json_encode([
      'text' => txt('MIT licensed'),
      'style' => 'body_m',
      'color' => 'inherit',
    ]),
    'label' => NULL,
  ],
  // Build-note teaser line, single-line text below the row (per wireframe
  // .buildnote). Placeholder copy per RATIONALE.md open question #7 — no
  // live CHANGELOG wiring exists yet; flagged in the handoff as a
  // follow-up once one does.
  [
    'uuid' => $buildnote_uuid,
    'component_id' => 'sdc.dripyard_base.text',
    'component_version' => $V['text'],
    'parent_uuid' => $proof_section_uuid,
    'slot' => 'content',
    'inputs' => json_encode([
      'text' => txt('Latest build note: development is underway in the open — follow progress on the build.'),
      'style' => 'body_s',
      'color' => 'soft',
      'center' => TRUE,
      'modifier_classes' => 'proof-strip__buildnote',
    ]),
    'label' => NULL,
  ],
];

// 4. Insert the new section immediately before the services section
//    (i.e. immediately after the hero, since the hero is the only thing
//    currently between them at the top level).
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
array_splice($components, $insert_index, 0, $new_components);

$entity->set('components', $components);
$entity->save();

print "canvas_page 20 proof-strip insert complete. Component count: " . count($components) . "\n";
