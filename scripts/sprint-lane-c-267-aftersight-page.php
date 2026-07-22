<?php
/**
 * Lane C (#271) — rebuild canvas_page 19 ("Aftersight") as the full
 * four-pillar /aftersight page.
 *
 * Idempotent: always sets the full `components` value on entity 19.
 * Preserves valid component_version hashes copied from existing
 * instances of the same components elsewhere on the site (never NULL).
 */

$storage = \Drupal::entityTypeManager()->getStorage('canvas_page');
$entity = $storage->load(19);
if (!$entity) {
  throw new \Exception('canvas_page 19 not found');
}

// Component version hashes — copied from existing instances on the site
// (see docs/pl2/handoffs/lane-c-267/handoff-F.md "Layer decisions" for the
// component-reuse search that sourced each of these).
$V = [
  'section'     => null,
  'heading'     => null,
  'text'        => null,
  'title-cta'   => null,
  'button'      => null,
  'grid-wrapper'=> null,
  'grid-cell'   => null,
  'card-canvas' => null,
];
// All 8 hashes are live-derived below from existing component instances
// elsewhere on the site — never hardcoded, never hand-typed. (Fixed
// 2026-07-21 per A-phase finding 9: the first 4 keys were previously
// hardcoded literal hashes, which silently drifted from the
// "all hashes derived live" claim in handoff-F.md. All 8 now start
// null and are populated exclusively by the scan loop below, which
// still aborts before saving if any key remains null.)

// Pull the remaining hashes live so we never guess/NULL a version.
$scan_ids = [1, 3, 5, 11, 13, 4, 14, 16, 17, 18, 20];
foreach ($scan_ids as $sid) {
  $e = $storage->load($sid);
  if (!$e) continue;
  foreach ($e->get('components')->getValue() as $c) {
    $short = preg_replace('/^sdc\.dripyard_base\./', '', $c['component_id']);
    if (array_key_exists($short, $V) && $V[$short] === null) {
      $V[$short] = $c['component_version'];
    }
  }
}
foreach ($V as $k => $v) {
  if ($v === null) {
    throw new \Exception("Could not source a component_version for $k — aborting to avoid NULL.");
  }
}

function txt($value) {
  return [
    'value' => $value,
    'format' => 'canvas_html_block',
  ];
}

$components = [];

// --- Section 1: Intro / hero-echo ------------------------------------
$s1 = 'aftersgt-0001-0000-000000000001';
$components[] = [
  'parent_uuid' => null,
  'slot' => null,
  'uuid' => $s1,
  'component_id' => 'sdc.dripyard_base.section',
  'component_version' => $V['section'],
  'inputs' => json_encode([
    'section_width' => 'max-width',
    'content_width' => 'max-width',
    'margin_top' => 'zero',
    'margin_bottom' => 'zero',
    'padding_top' => 'medium',
    'padding_bottom' => 'medium',
    'theme' => 'white',
  ]),
  'label' => null,
];
$components[] = [
  'parent_uuid' => $s1,
  'slot' => 'content',
  'uuid' => 'aftersgt-0001-0001-000000000001',
  'component_id' => 'sdc.dripyard_base.heading',
  'component_version' => $V['heading'],
  'inputs' => json_encode([
    'text' => 'Aftersight',
    'html_element' => 'h1',
    'style' => 'h1',
    'color' => 'primary',
    'margin_top' => 'zero',
    'margin_bottom' => 'medium',
  ]),
  'label' => null,
];
$components[] = [
  'parent_uuid' => $s1,
  'slot' => 'content',
  'uuid' => 'aftersgt-0001-0002-000000000001',
  'component_id' => 'sdc.dripyard_base.text',
  'component_version' => $V['text'],
  'inputs' => json_encode([
    'text' => txt('<p>Open-source test intelligence, built CTRF-native. Self-hosted, MIT-licensed, AI in the core.</p>'),
    'style' => 'body_l',
    'color' => 'inherit',
  ]),
  'label' => null,
];
$components[] = [
  'parent_uuid' => $s1,
  'slot' => 'content',
  'uuid' => 'aftersgt-0001-0003-000000000001',
  'component_id' => 'sdc.dripyard_base.text',
  'component_version' => $V['text'],
  'inputs' => json_encode([
    'text' => txt('<p><strong>Now in development &mdash; in the open.</strong> Follow every commit, decision, and ship note as it happens.</p>'),
    'style' => 'body_m',
    'color' => 'soft',
  ]),
  'label' => null,
];
$components[] = [
  'parent_uuid' => $s1,
  'slot' => 'content',
  'uuid' => 'aftersgt-0001-0004-000000000001',
  'component_id' => 'sdc.dripyard_base.button',
  'component_version' => $V['button'],
  'inputs' => json_encode([
    // 2026-07-21 amendment: repo is PRIVATE (404 publicly); repo-public
    // question deferred to launch planning. Re-pointed from
    // https://github.com/Performant-Labs/aftersight to the build-notes
    // blog with an honest label (no "on GitHub" phrasing while the
    // target isn't GitHub). Collapsed the former two-button row (GitHub
    // + "Read the build notes") into this single button to avoid two
    // identical /articles targets side by side.
    'text' => 'Follow the build',
    'href' => '/articles',
    'style' => 'primary',
    'size' => 'large',
  ]),
  'label' => null,
];

// --- Section 2: Four pillars (grid of card-canvas, homepage pattern) --
$s2 = 'aftersgt-0002-0000-000000000002';
$components[] = [
  'parent_uuid' => null,
  'slot' => null,
  'uuid' => $s2,
  'component_id' => 'sdc.dripyard_base.section',
  'component_version' => $V['section'],
  'inputs' => json_encode([
    'section_width' => 'max-width',
    'content_width' => 'max-width',
    'margin_top' => 'zero',
    'margin_bottom' => 'zero',
    'padding_top' => 'medium',
    'padding_bottom' => 'medium',
    'theme' => 'light',
  ]),
  'label' => null,
];
$components[] = [
  'parent_uuid' => $s2,
  'slot' => 'header',
  'uuid' => 'aftersgt-0002-0001-000000000002',
  'component_id' => 'sdc.dripyard_base.heading',
  'component_version' => $V['heading'],
  'inputs' => json_encode([
    'text' => 'Four pillars',
    'html_element' => 'h2',
    'style' => 'h2',
    'color' => 'primary',
    'margin_top' => 'zero',
    'margin_bottom' => 'medium',
  ]),
  'label' => null,
];
$grid = 'aftersgt-0002-0002-000000000002';
$components[] = [
  'parent_uuid' => $s2,
  'slot' => 'content',
  'uuid' => $grid,
  'component_id' => 'sdc.dripyard_base.grid-wrapper',
  'component_version' => $V['grid-wrapper'],
  'inputs' => json_encode([
    'column_gutter' => 'large',
    'row_gutter' => 'medium',
  ]),
  'label' => null,
];

$pillars = [
  [
    'eyebrow' => '01 / CTRF-native',
    'title' => 'Built on the standard, from the ground up',
    'body' => 'The ingest endpoint, database schema, and validation are all derived from the Common Test Report Format spec. Reporters from Playwright, Cypress, Jest, Vitest, pytest, PHPUnit, WebdriverIO, and any other CTRF-emitting tool work without per-framework adapters.',
  ],
  [
    'eyebrow' => '02 / Open-core, MIT-licensed',
    'title' => 'The open one',
    'body' => 'Community Edition is MIT-licensed and free. No feature-gated core, no forced upgrade path to get the basics working.',
  ],
  [
    'eyebrow' => '03 / Self-hosted',
    'title' => 'Your data stays on your infrastructure',
    'body' => 'One docker compose up and it runs on Postgres or SQLite, on any host you control. No mandatory SaaS hop for your test results.',
  ],
  [
    'eyebrow' => '04 / AI in the core',
    'title' => 'AI is core architecture, not an add-on',
    'body' => 'Failure categorization and pattern detection are built into the platform from day one, not bolted on later as a paid extra.',
  ],
];

foreach ($pillars as $i => $p) {
  $n = $i + 1;
  $cell = sprintf('aftersgt-0002-00%02d-000000000002', 10 + $n);
  $components[] = [
    'parent_uuid' => $grid,
    'slot' => 'grid_cells',
    'uuid' => $cell,
    'component_id' => 'sdc.dripyard_base.grid-cell',
    'component_version' => $V['grid-cell'],
    'inputs' => json_encode([
      'padding' => 'small',
      'columns_small' => 12,
      'columns_medium' => 6,
      'columns_large' => 3,
      'rows_small' => 1,
      'rows_medium' => 1,
      'rows_large' => 1,
    ]),
    'label' => null,
  ];
  $components[] = [
    'parent_uuid' => $cell,
    'slot' => 'content',
    'uuid' => sprintf('aftersgt-0002-00%02d-000000000002', 20 + $n),
    'component_id' => 'sdc.dripyard_base.card-canvas',
    'component_version' => $V['card-canvas'],
    'inputs' => json_encode([
      'eyebrow_text' => $p['eyebrow'],
      'title' => $p['title'],
      'body' => $p['body'],
      'theme' => 'white',
    ]),
    'label' => null,
  ];
}

// --- Section 3: What it does (framework-agnostic detail) --------------
$s3 = 'aftersgt-0003-0000-000000000003';
$components[] = [
  'parent_uuid' => null,
  'slot' => null,
  'uuid' => $s3,
  'component_id' => 'sdc.dripyard_base.section',
  'component_version' => $V['section'],
  'inputs' => json_encode([
    'section_width' => 'max-width',
    'content_width' => 'max-width',
    'margin_top' => 'zero',
    'margin_bottom' => 'zero',
    'padding_top' => 'medium',
    'padding_bottom' => 'medium',
    'theme' => 'white',
  ]),
  'label' => null,
];
$components[] = [
  'parent_uuid' => $s3,
  'slot' => 'header',
  'uuid' => 'aftersgt-0003-0001-000000000003',
  'component_id' => 'sdc.dripyard_base.heading',
  'component_version' => $V['heading'],
  'inputs' => json_encode([
    'text' => 'What it does',
    'html_element' => 'h2',
    'style' => 'h2',
    'color' => 'primary',
    'margin_top' => 'zero',
    'margin_bottom' => 'medium',
  ]),
  'label' => null,
];
$components[] = [
  'parent_uuid' => $s3,
  'slot' => 'content',
  'uuid' => 'aftersgt-0003-0002-000000000003',
  'component_id' => 'sdc.dripyard_base.text',
  'component_version' => $V['text'],
  'inputs' => json_encode([
    'text' => txt(
      '<p>Aftersight takes <a href="https://ctrf.io/">CTRF (Common Test Report Format)</a> JSON from your CI pipeline, stores every report persistently, and surfaces the patterns: trend lines, flaky-test detection, and failure categorization grouped by likely root cause. The dashboard is server-rendered HTML over a Postgres or SQLite backend; deployment is one <code>docker compose up</code>.</p>'
      . '<p>Because it is framework-agnostic by construction, teams running Playwright, Cypress, Jest, Vitest, pytest, PHPUnit, WebdriverIO, or any other CTRF-emitting runner get the same dashboard, the same schema, and the same AI-driven categorization &mdash; without writing a per-framework adapter.</p>'
    ),
    'style' => 'body_m',
    'color' => 'inherit',
  ]),
  'label' => null,
];

// --- Section 4: Status + links -----------------------------------------
$s4 = 'aftersgt-0004-0000-000000000004';
$components[] = [
  'parent_uuid' => null,
  'slot' => null,
  'uuid' => $s4,
  'component_id' => 'sdc.dripyard_base.section',
  'component_version' => $V['section'],
  'inputs' => json_encode([
    'section_width' => 'max-width',
    'content_width' => 'max-width',
    'margin_top' => 'zero',
    'margin_bottom' => 'zero',
    'padding_top' => 'medium',
    'padding_bottom' => 'medium',
    'theme' => 'light',
  ]),
  'label' => null,
];
$components[] = [
  'parent_uuid' => $s4,
  'slot' => 'header',
  'uuid' => 'aftersgt-0004-0001-000000000004',
  'component_id' => 'sdc.dripyard_base.heading',
  'component_version' => $V['heading'],
  'inputs' => json_encode([
    'text' => 'Status: now in development',
    'html_element' => 'h2',
    'style' => 'h2',
    'color' => 'primary',
    'margin_top' => 'zero',
    'margin_bottom' => 'medium',
  ]),
  'label' => null,
];
$components[] = [
  'parent_uuid' => $s4,
  'slot' => 'content',
  'uuid' => 'aftersgt-0004-0002-000000000004',
  'component_id' => 'sdc.dripyard_base.text',
  'component_version' => $V['text'],
  'inputs' => json_encode([
    'text' => txt(
      // 2026-07-21 amendment: repo is PRIVATE (404 publicly); repo-public
      // question deferred to launch planning. Both former GitHub
      // mentions re-pointed to the build-notes blog (/articles) with
      // honest phrasing (no "on GitHub" / "GitHub" label while the
      // target isn't GitHub). The former two bullets ("Read the
      // source" on GitHub + "Read the build notes" on the blog)
      // collapsed into one "Follow the build" bullet to avoid two
      // identical /articles targets side by side.
      '<p><strong>Now.</strong> Working through the MVP backlog &mdash; auth, project management, CTRF report ingestion, run history, trend rendering, failure categorization. Progress is documented in the open as it happens.</p>'
      . '<p><strong>Soon.</strong> Community Edition Docker Compose release, install command, first-run walkthrough.</p>'
      . '<p>Two ways to follow or talk to us:</p>'
      . '<ul>'
      . '<li><strong>Follow the build</strong> on <a href="/articles">the blog</a> &mdash; architecture decisions, feature ship notes, gap reviews.</li>'
      . '<li><strong>Tell us about a use case</strong> via the button below &mdash; particularly if you have a CTRF reporter we should test against early.</li>'
      . '</ul>'
    ),
    'style' => 'body_m',
    'color' => 'inherit',
  ]),
  'label' => null,
];

// --- Section 5: Closing CTA ---------------------------------------------
$s5 = 'aftersgt-0005-0000-000000000005';
$components[] = [
  'parent_uuid' => null,
  'slot' => null,
  'uuid' => $s5,
  'component_id' => 'sdc.dripyard_base.section',
  'component_version' => $V['section'],
  'inputs' => json_encode([
    'section_width' => 'max-width',
    'content_width' => 'max-width',
    'margin_top' => 'zero',
    'margin_bottom' => 'zero',
    'padding_top' => 'medium',
    'padding_bottom' => 'medium',
    'theme' => 'primary',
  ]),
  'label' => null,
];
$components[] = [
  'parent_uuid' => $s5,
  'slot' => 'content',
  'uuid' => 'aftersgt-0005-0001-000000000005',
  'component_id' => 'sdc.dripyard_base.title-cta',
  'component_version' => $V['title-cta'],
  'inputs' => json_encode([
    'title' => 'Got a CTRF use case we should know about?',
    'button_text' => 'Tell us about it',
    'button_href' => '/contact-us?intent=aftersight',
    'button_style' => 'primary',
  ]),
  'label' => null,
];

$entity->set('components', $components);
$entity->set('status', 1);
$entity->save();

echo "Saved canvas_page 19 with " . count($components) . " components.\n";
