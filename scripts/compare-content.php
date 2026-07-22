<?php

/**
 * @file
 * compare-content.php — read-only content snapshot + diff tool.
 *
 * Emits a normalized, UUID-keyed snapshot of all `node` and `canvas_page`
 * entities on the site it runs on, so two environments (e.g. the local V2
 * launch DB and a fresh production pull) can be diffed to find the exact V2
 * content delta.
 *
 * The script is READ-ONLY and idempotent: it loads entities and prints JSON.
 * It never writes to the database or mutates any entity.
 *
 * USAGE
 * -----
 * Snapshot the current environment (default mode):
 *   ddev drush php:script scripts/compare-content.php > snapshot-v2.json
 *   # ...on the isolated prod project:
 *   ddev drush php:script scripts/compare-content.php > snapshot-prod.json
 *
 * Diff two previously-captured snapshots (pass extra args after `--`):
 *   drush php:script scripts/compare-content.php -- diff snapshot-v2.json snapshot-prod.json
 *
 *   The FIRST snapshot arg is treated as the "V2 / local" side and the SECOND
 *   as the "prod / baseline" side, so the report reads "in V2 only",
 *   "in prod only", "changed", "identical".
 *
 * NORMALIZATION NOTES (why the hash is stable across DB rebuilds)
 * ---------------------------------------------------------------
 * - Entities are keyed by UUID (stable across DBs), never by nid/id.
 * - For canvas_page, the `components` component-tree is normalized to a nested
 *   structure that keeps: ordering, parent/child nesting, slot names,
 *   component_id, component_version, and the decoded `inputs` props (the real
 *   copy). It DROPS the volatile per-component `uuid` / `parent_uuid` values
 *   (they are regenerated per DB and carry no content meaning) — nesting is
 *   preserved positionally instead. Any `*_uuid`-looking props inside inputs
 *   are left as-is because they can be meaningful references; if that ever
 *   proves noisy it is easy to scrub here.
 */

// ---------------------------------------------------------------------------
// Argument parsing. drush php:script passes extra args in $extra / $argv.
// ---------------------------------------------------------------------------
$args = [];
if (isset($extra) && is_array($extra)) {
  $args = $extra;
}
elseif (isset($argv) && is_array($argv)) {
  // Strip the script path if present.
  $args = array_values(array_filter($argv, static function ($a) {
    return substr($a, -strlen('compare-content.php')) !== 'compare-content.php';
  }));
}

$mode = $args[0] ?? 'snapshot';

if ($mode === 'diff') {
  $fileA = $args[1] ?? NULL;
  $fileB = $args[2] ?? NULL;
  if (!$fileA || !$fileB) {
    fwrite(STDERR, "Usage: ... -- diff <v2-snapshot.json> <prod-snapshot.json>\n");
    return;
  }
  compare_content_run_diff($fileA, $fileB);
  return;
}

// Default: emit a snapshot of the current environment.
print compare_content_build_snapshot();
print "\n";

// ===========================================================================
// SNAPSHOT
// ===========================================================================

/**
 * Builds a normalized JSON snapshot of node + canvas_page content.
 */
function compare_content_build_snapshot(): string {
  $records = [];

  // --- Nodes ---------------------------------------------------------------
  $node_storage = \Drupal::entityTypeManager()->getStorage('node');
  $nids = \Drupal::entityQuery('node')->accessCheck(FALSE)->execute();
  foreach ($node_storage->loadMultiple($nids) as $node) {
    $records[$node->uuid()] = compare_content_normalize_node($node);
  }

  // --- Canvas pages --------------------------------------------------------
  if (\Drupal::entityTypeManager()->hasDefinition('canvas_page')) {
    $cp_storage = \Drupal::entityTypeManager()->getStorage('canvas_page');
    foreach ($cp_storage->loadMultiple() as $page) {
      $records[$page->uuid()] = compare_content_normalize_canvas_page($page);
    }
  }

  ksort($records);

  $snapshot = [
    'generated_at' => date('c'),
    'site' => \Drupal::config('system.site')->get('name'),
    'entity_count' => count($records),
    'entities' => $records,
  ];

  return json_encode($snapshot, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}

/**
 * Normalizes a node into a comparable record.
 */
function compare_content_normalize_node($node): array {
  $alias = '';
  try {
    if ($node->hasField('path') && !$node->get('path')->isEmpty()) {
      $alias = (string) ($node->get('path')->alias ?? '');
    }
  }
  catch (\Throwable $e) {
    // Ignore path resolution issues; alias stays empty.
  }

  // Collect meaningful text-ish fields for the content hash + summary.
  $content = [];
  foreach ($node->getFieldDefinitions() as $name => $def) {
    if (in_array($name, ['revision_log'], TRUE)) {
      continue;
    }
    $type = $def->getType();
    if (in_array($type, [
      'text_with_summary', 'text_long', 'text', 'string_long', 'string',
    ], TRUE)) {
      if ($node->get($name)->isEmpty()) {
        continue;
      }
      $vals = [];
      foreach ($node->get($name)->getValue() as $item) {
        $vals[] = isset($item['value']) ? (string) $item['value'] : '';
      }
      $joined = trim(implode("\n", $vals));
      if ($joined !== '') {
        $content[$name] = compare_content_normalize_text($joined);
      }
    }
  }

  $hash_payload = [
    'title' => $node->label(),
    'status' => (bool) $node->isPublished(),
    'content' => $content,
  ];

  // Human summary: title + first ~200 chars of the primary body field.
  $body_excerpt = '';
  foreach (['body', 'field_description', 'field_body'] as $bf) {
    if (isset($content[$bf])) {
      $body_excerpt = compare_content_excerpt($content[$bf]);
      break;
    }
  }

  return [
    'entity_type' => 'node',
    'bundle' => $node->bundle(),
    'title' => $node->label(),
    'alias' => $alias,
    'published' => (bool) $node->isPublished(),
    'content_hash' => hash('sha256', json_encode($hash_payload)),
    'summary' => trim($node->label() . ($body_excerpt !== '' ? ' — ' . $body_excerpt : '')),
    // Handy metadata for the report (not part of the hash).
    'meta' => [
      'field_count' => count($content),
    ],
  ];
}

/**
 * Normalizes a canvas_page into a comparable record.
 */
function compare_content_normalize_canvas_page($page): array {
  $alias = '';
  try {
    if ($page->hasField('path') && !$page->get('path')->isEmpty()) {
      $alias = (string) ($page->get('path')->alias ?? '');
    }
  }
  catch (\Throwable $e) {
  }

  $raw = $page->get('components')->getValue();
  $tree = compare_content_build_component_tree($raw);

  $description = '';
  if ($page->hasField('description') && !$page->get('description')->isEmpty()) {
    $description = compare_content_normalize_text((string) $page->get('description')->value);
  }

  $hash_payload = [
    'title' => $page->label(),
    'status' => (bool) $page->isPublished(),
    'description' => $description,
    'components' => $tree,
  ];

  // Extract readable text snippets from the component inputs for the summary.
  $texts = [];
  compare_content_collect_text($tree, $texts);
  $summary_text = implode(' | ', array_slice($texts, 0, 6));

  // Per-component-id counts, useful for "structure changed" diffs.
  $component_ids = [];
  compare_content_collect_component_ids($tree, $component_ids);
  $id_counts = array_count_values($component_ids);
  ksort($id_counts);

  return [
    'entity_type' => 'canvas_page',
    'bundle' => 'canvas_page',
    'title' => $page->label(),
    'alias' => $alias,
    'published' => (bool) $page->isPublished(),
    'content_hash' => hash('sha256', json_encode($hash_payload)),
    'summary' => trim($page->label() . ($summary_text !== '' ? ' — ' . compare_content_excerpt($summary_text, 300) : '')),
    'meta' => [
      'component_count' => count($component_ids),
      'component_id_counts' => $id_counts,
      'top_texts' => array_slice($texts, 0, 12),
    ],
  ];
}

/**
 * Builds a nested, order-preserving component tree with volatile ids dropped.
 *
 * Canvas stores components as a flat list with `uuid` / `parent_uuid` / `slot`.
 * We reconstruct nesting from those, then emit a nested structure that keeps
 * only content-meaningful keys (component_id, component_version, slot, decoded
 * inputs, label) plus positionally-ordered children. The per-component uuids
 * themselves are discarded — they are regenerated per DB build.
 */
function compare_content_build_component_tree(array $flat): array {
  // Index children by parent uuid, preserving original order.
  $by_parent = [];
  foreach ($flat as $i => $item) {
    $parent = $item['parent_uuid'] ?? NULL;
    $by_parent[$parent ?? '__root__'][] = ['idx' => $i, 'item' => $item];
  }

  $build = function ($parent_key) use (&$build, $by_parent) {
    $out = [];
    foreach (($by_parent[$parent_key] ?? []) as $entry) {
      $item = $entry['item'];
      $node = [
        'component_id' => $item['component_id'] ?? NULL,
        'component_version' => $item['component_version'] ?? NULL,
        'slot' => $item['slot'] ?? NULL,
        'label' => $item['label'] ?? NULL,
        'inputs' => compare_content_normalize_inputs($item['inputs'] ?? NULL),
      ];
      $own_uuid = $item['uuid'] ?? NULL;
      $children = $own_uuid !== NULL ? $build($own_uuid) : [];
      if (!empty($children)) {
        $node['children'] = $children;
      }
      $out[] = $node;
    }
    return $out;
  };

  return $build('__root__');
}

/**
 * Decodes and normalizes a component `inputs` JSON string.
 */
function compare_content_normalize_inputs($inputs) {
  if ($inputs === NULL || $inputs === '') {
    return NULL;
  }
  if (is_array($inputs)) {
    $decoded = $inputs;
  }
  else {
    $decoded = json_decode((string) $inputs, TRUE);
    if ($decoded === NULL) {
      // Not valid JSON — keep the raw normalized string.
      return compare_content_normalize_text((string) $inputs);
    }
  }
  return compare_content_normalize_value($decoded);
}

/**
 * Recursively normalizes a decoded value (arrays of props, text blocks, etc).
 */
function compare_content_normalize_value($value) {
  if (is_array($value)) {
    // Text field shape: {"value": "...", "format": "..."} -> keep value only.
    if (array_key_exists('value', $value) && array_key_exists('format', $value) && count($value) <= 2) {
      return compare_content_normalize_text((string) $value['value']);
    }
    $out = [];
    foreach ($value as $k => $v) {
      $out[$k] = compare_content_normalize_value($v);
    }
    // Sort assoc keys for stable hashing; keep numeric/list order intact.
    if (compare_content_is_assoc($out)) {
      ksort($out);
    }
    return $out;
  }
  if (is_string($value)) {
    return compare_content_normalize_text($value);
  }
  return $value;
}

/**
 * Collapses whitespace and strips volatile per-render id patterns from text.
 */
function compare_content_normalize_text(string $text): string {
  // Strip HTML comments (often carry build ids) and collapse whitespace.
  $text = preg_replace('/<!--.*?-->/s', '', $text);
  // Neutralize obvious per-render random ids (e.g. id="edit-..-xYz12").
  $text = preg_replace('/\b([a-z-]*-)[0-9a-f]{8,}\b/i', '$1X', $text);
  $text = preg_replace('/\s+/', ' ', $text);
  return trim($text);
}

/**
 * Returns a short excerpt of a (possibly HTML) string.
 */
function compare_content_excerpt(string $text, int $len = 200): string {
  $plain = trim(preg_replace('/\s+/', ' ', strip_tags($text)));
  if (mb_strlen($plain) <= $len) {
    return $plain;
  }
  return mb_substr($plain, 0, $len) . '…';
}

/**
 * Collects readable text strings from a normalized component tree.
 */
function compare_content_collect_text($tree, array &$out): void {
  foreach ($tree as $node) {
    $inputs = $node['inputs'] ?? NULL;
    compare_content_scan_strings($inputs, $out);
    if (!empty($node['children'])) {
      compare_content_collect_text($node['children'], $out);
    }
  }
}

/**
 * Scans a value for human-readable strings (skips machine tokens).
 */
function compare_content_scan_strings($value, array &$out): void {
  if (is_string($value)) {
    $s = trim(strip_tags($value));
    // Keep strings that look like prose: contain a space and a letter,
    // are not URLs / css class lists / machine enums.
    if ($s !== '' && mb_strlen($s) >= 4 && preg_match('/[A-Za-z]/', $s)
      && strpos($s, ' ') !== FALSE
      && !preg_match('~^(https?:|/|#|dy-|sdc\.)~', $s)) {
      $out[] = $s;
    }
  }
  elseif (is_array($value)) {
    foreach ($value as $v) {
      compare_content_scan_strings($v, $out);
    }
  }
}

/**
 * Collects component_id values across the tree.
 */
function compare_content_collect_component_ids($tree, array &$out): void {
  foreach ($tree as $node) {
    if (!empty($node['component_id'])) {
      $out[] = $node['component_id'];
    }
    if (!empty($node['children'])) {
      compare_content_collect_component_ids($node['children'], $out);
    }
  }
}

/**
 * Tells assoc arrays from list arrays.
 */
function compare_content_is_assoc(array $arr): bool {
  if ($arr === []) {
    return FALSE;
  }
  return array_keys($arr) !== range(0, count($arr) - 1);
}

// ===========================================================================
// DIFF
// ===========================================================================

/**
 * Loads two snapshots and prints a grouped, readable delta report.
 */
function compare_content_run_diff(string $fileV2, string $fileProd): void {
  $v2 = compare_content_load_snapshot($fileV2);
  $prod = compare_content_load_snapshot($fileProd);
  if ($v2 === NULL || $prod === NULL) {
    return;
  }

  $eV2 = $v2['entities'];
  $eProd = $prod['entities'];

  $only_v2 = array_diff_key($eV2, $eProd);
  $only_prod = array_diff_key($eProd, $eV2);
  $common = array_intersect_key($eV2, $eProd);

  $changed = [];
  $identical = 0;
  foreach ($common as $uuid => $recV2) {
    $recProd = $eProd[$uuid];
    if (($recV2['content_hash'] ?? '') === ($recProd['content_hash'] ?? '')) {
      $identical++;
    }
    else {
      $changed[$uuid] = ['v2' => $recV2, 'prod' => $recProd];
    }
  }

  $line = str_repeat('=', 78);
  print "$line\n";
  print "  V2 CONTENT DELTA REPORT\n";
  print "  V2/local:  {$fileV2}  ({$v2['entity_count']} entities, {$v2['generated_at']})\n";
  print "  prod base: {$fileProd}  ({$prod['entity_count']} entities, {$prod['generated_at']})\n";
  print "$line\n\n";

  print "SUMMARY\n";
  print sprintf("  In V2 only (new):      %d\n", count($only_v2));
  print sprintf("  In prod only (missing from V2): %d\n", count($only_prod));
  print sprintf("  In both, DIFFERENT:    %d\n", count($changed));
  print sprintf("  Identical:             %d\n", $identical);
  print "\n";

  // --- Canvas page changes called out first --------------------------------
  print "$line\n";
  print "  CANVAS_PAGE CHANGES (the V2 overlay to re-apply on a fresh prod base)\n";
  print "$line\n";
  $any_cp = FALSE;
  foreach ($changed as $uuid => $pair) {
    if (($pair['v2']['entity_type'] ?? '') !== 'canvas_page') {
      continue;
    }
    $any_cp = TRUE;
    compare_content_print_canvas_diff($uuid, $pair['v2'], $pair['prod']);
  }
  foreach ($only_v2 as $uuid => $rec) {
    if (($rec['entity_type'] ?? '') !== 'canvas_page') {
      continue;
    }
    $any_cp = TRUE;
    print "\n  [NEW canvas_page — V2 only]  {$rec['title']}  (alias {$rec['alias']})\n";
    print "     components: {$rec['meta']['component_count']}\n";
    print "     " . compare_content_excerpt($rec['summary'], 200) . "\n";
  }
  foreach ($only_prod as $uuid => $rec) {
    if (($rec['entity_type'] ?? '') !== 'canvas_page') {
      continue;
    }
    $any_cp = TRUE;
    print "\n  [canvas_page in PROD only — would be LOST if launching from V2]  {$rec['title']}  (alias {$rec['alias']})\n";
  }
  if (!$any_cp) {
    print "  (no canvas_page differences)\n";
  }
  print "\n";

  // --- Node / other detail -------------------------------------------------
  compare_content_print_group('IN V2 ONLY (new content)', $only_v2, 'node');
  compare_content_print_group('IN PROD ONLY (missing from local V2 — recent prod edits/articles)', $only_prod, 'node');

  print "$line\n";
  print "  NODES CHANGED (in both, different)\n";
  print "$line\n";
  $any_node = FALSE;
  foreach ($changed as $uuid => $pair) {
    if (($pair['v2']['entity_type'] ?? '') !== 'node') {
      continue;
    }
    $any_node = TRUE;
    $v = $pair['v2'];
    $p = $pair['prod'];
    print "\n  * [{$v['bundle']}] {$v['title']}  (alias {$v['alias']})\n";
    if ($v['title'] !== $p['title']) {
      print "      title: prod=\"{$p['title']}\"  ->  v2=\"{$v['title']}\"\n";
    }
    if ($v['published'] !== $p['published']) {
      print "      published: prod=" . ($p['published'] ? 'yes' : 'no') . " -> v2=" . ($v['published'] ? 'yes' : 'no') . "\n";
    }
    print "      content hash differs (body/fields edited)\n";
  }
  if (!$any_node) {
    print "  (no node content differences)\n";
  }
  print "\n";
}

/**
 * Prints a simple grouped list for a bucket, filtered to an entity type.
 */
function compare_content_print_group(string $heading, array $recs, string $entity_type): void {
  $line = str_repeat('=', 78);
  print "$line\n  $heading\n$line\n";
  $count = 0;
  foreach ($recs as $uuid => $rec) {
    if (($rec['entity_type'] ?? '') !== $entity_type) {
      continue;
    }
    $count++;
    print "  * [{$rec['bundle']}] {$rec['title']}  (alias {$rec['alias']})  " . ($rec['published'] ? '' : '[unpublished] ') . "\n";
    if (!empty($rec['summary'])) {
      print "      " . compare_content_excerpt($rec['summary'], 160) . "\n";
    }
  }
  if ($count === 0) {
    print "  (none)\n";
  }
  print "\n";
}

/**
 * Prints a detailed, readable diff for a single canvas_page.
 */
function compare_content_print_canvas_diff(string $uuid, array $v2, array $prod): void {
  print "\n  >>> canvas_page: \"{$v2['title']}\"  (alias {$v2['alias']})\n";
  print "      uuid: {$uuid}\n";

  if ($v2['title'] !== $prod['title']) {
    print "      TITLE changed:\n";
    print "        prod: {$prod['title']}\n";
    print "        v2:   {$v2['title']}\n";
  }
  if ($v2['alias'] !== $prod['alias']) {
    print "      ALIAS changed: prod=\"{$prod['alias']}\" -> v2=\"{$v2['alias']}\"\n";
  }
  if ($v2['published'] !== $prod['published']) {
    print "      PUBLISHED changed: prod=" . ($prod['published'] ? 'yes' : 'no') . " -> v2=" . ($v2['published'] ? 'yes' : 'no') . "\n";
  }

  $cV2 = (int) ($v2['meta']['component_count'] ?? 0);
  $cProd = (int) ($prod['meta']['component_count'] ?? 0);
  print "      COMPONENT COUNT: prod={$cProd}  ->  v2={$cV2}  (delta " . ($cV2 - $cProd) . ")\n";

  // Component-id count deltas.
  $idsV2 = $v2['meta']['component_id_counts'] ?? [];
  $idsProd = $prod['meta']['component_id_counts'] ?? [];
  $all_ids = array_unique(array_merge(array_keys($idsV2), array_keys($idsProd)));
  sort($all_ids);
  $delta_lines = [];
  foreach ($all_ids as $cid) {
    $a = $idsProd[$cid] ?? 0;
    $b = $idsV2[$cid] ?? 0;
    if ($a !== $b) {
      $delta_lines[] = "        {$cid}: prod={$a} -> v2={$b}";
    }
  }
  if ($delta_lines) {
    print "      COMPONENT-TYPE DELTAS (count of each component_id):\n";
    print implode("\n", $delta_lines) . "\n";
  }
  else {
    print "      component-type counts identical; change is in text/props only\n";
  }

  // Text delta: which readable strings are new/removed.
  $tV2 = $v2['meta']['top_texts'] ?? [];
  $tProd = $prod['meta']['top_texts'] ?? [];
  $new_text = array_values(array_diff($tV2, $tProd));
  $gone_text = array_values(array_diff($tProd, $tV2));
  if ($new_text) {
    print "      NEW/CHANGED text in V2 (sample):\n";
    foreach (array_slice($new_text, 0, 8) as $t) {
      print "        + " . compare_content_excerpt($t, 120) . "\n";
    }
  }
  if ($gone_text) {
    print "      text present in prod but not V2 (sample):\n";
    foreach (array_slice($gone_text, 0, 8) as $t) {
      print "        - " . compare_content_excerpt($t, 120) . "\n";
    }
  }
}

/**
 * Loads and validates a snapshot JSON file.
 */
function compare_content_load_snapshot(string $file): ?array {
  if (!is_file($file)) {
    fwrite(STDERR, "Snapshot file not found: {$file}\n");
    return NULL;
  }
  $data = json_decode(file_get_contents($file), TRUE);
  if (!is_array($data) || !isset($data['entities'])) {
    fwrite(STDERR, "Invalid snapshot file (no 'entities'): {$file}\n");
    return NULL;
  }
  return $data;
}
