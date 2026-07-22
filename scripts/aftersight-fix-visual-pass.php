<?php

/**
 * aftersight-fix — /aftersight visual-parity pass (canvas_page 19).
 *
 * André's verdict: "a mess visually and content-wise: big buttons, menu
 * with the wrong color background and more. It basically looks
 * unfinished." Root cause: /aftersight was built as a Wave-1 content-only
 * lane (#271, scripts/sprint-lane-c-267-aftersight-page.php) and never
 * received the #276 product-led visual treatment the homepage got.
 *
 * This script patches the EXISTING live tree in place (does not rebuild
 * from scratch) — same pattern as scripts/sprint-wave2-276-hero-rebuild.php.
 * It is idempotent: every write is either a full-value `set()` on a
 * specific existing UUID's `inputs`/`additional_classes` (safe to re-run,
 * same result each time) or a full-array copy-in-place. No component is
 * added or removed; no component_version is touched (every UUID keeps its
 * existing valid hash — see the Canvas OutOfRangeException guard note in
 * docs/pl2/canvas-update-checklist.md item 3).
 *
 * Defects fixed (see docs/pl2/handoffs/aftersight-fix/handoff-F.md for the
 * full trace of each):
 *
 *   1. "Big buttons" — hero-echo intro CTA ("Follow the build") rendered
 *      as a full-width 1163px brown bar. Root cause: dripyard_base
 *      section.css's `.dy-section__content { display:flex; flex-direction:
 *      column }` has no `align-items`, so the lone button (inline-flex,
 *      no width of its own) stretches to the column's full cross-axis
 *      width. Fix: add the `additional_classes` marker `dy-section--cta-pair`
 *      to §1 (the intro section) — this file's existing L5 rule
 *      (dy-section.css, "§1 Services hero — CTA pill-pair flex row", P4)
 *      already lays out `.dy-section__content > .button` at natural
 *      width/centered; the rule's behavior is unchanged whether the row
 *      holds one button or two, so no new CSS was needed, only reusing the
 *      existing marker.
 *
 *   2. "Menu with the wrong color background" — the breadcrumb strip
 *      (`.region-highlighted`, neonbyte parent-theme CSS, advisory-upstream
 *      only) always paints `--theme-surface-alt`, which resolves to cream
 *      (#F5EFE2) under `html .theme--white` (performant_labs_v2 base.css).
 *      This is confirmed to be a SITEWIDE pattern (present identically on
 *      /services and /open-source-projects, not unique to /aftersight) —
 *      not a page-specific bug to fix here. No content or CSS change made
 *      for this defect on this page; see handoff-F "Deviations from spec"
 *      for the full resolution and the sitewide-scope follow-up filed for
 *      O to route separately (fixing the cream/white nav-to-breadcrumb
 *      transition site-wide is out of this page's scope-cap).
 *
 *   3. Unbalanced pillar cards — card 1's body copy (all 3-4x longer than
 *      siblings) trimmed to comparable weight while preserving the full
 *      framework list and the framework-agnostic guardrail.
 *
 *   4. Off-palette "Got a CTRF use case" banner — was `theme: primary`
 *      (brand teal #1893b4, the "reserved; sparing use" zone per base.css's
 *      own comment). Changed to `theme: light` (cream), matching the
 *      approved wireframe's "light-first, cream for secondary/callout
 *      content" convention (RATIONALE.md §Zone assignment). The title-cta's
 *      button is unaffected in markup/props — it already renders
 *      terracotta-deep (--pl-primary-light → --pl-accent-deep, 6.64:1)
 *      under any light-register theme zone via the sitewide token fix in
 *      base.css/button.css, so no CSS change was needed for the button
 *      itself, only the section's `theme` content prop.
 *
 *   5. General spacing/rhythm pass — covered by fixes 1/3/4 above; section
 *      theme alternation (white/light/white/light/light) is unchanged by
 *      this script and already matches the homepage's light-first register
 *      alternation.
 *
 * Layer ruling summary (see handoff-F "Layer decisions" for full trace):
 *   Defect 1: L5 (existing marker-class rule, reused — zero new CSS).
 *   Defect 2: no fix on this page — sitewide parent-theme pattern, filed
 *             as a follow-up, not blocking this page's scope-cap.
 *   Defect 3: content layer (Canvas `inputs.body` prop edit).
 *   Defect 4: content layer (Canvas `inputs.theme` prop edit).
 */

$storage = \Drupal::entityTypeManager()->getStorage('canvas_page');
$entity = $storage->load(19);
if (!$entity) {
  throw new \Exception('canvas_page 19 not found');
}

$components = $entity->get('components')->getValue();

// UUIDs from the live tree (verified live 2026-07-22 — matches
// scripts/sprint-lane-c-267-aftersight-page.php byte-for-byte; re-verify
// before re-running if the page tree has since drifted).
$intro_section_uuid = 'aftersgt-0001-0000-000000000001';
$pillar1_card_uuid = 'aftersgt-0002-0021-000000000002';
$closing_cta_section_uuid = 'aftersgt-0005-0000-000000000005';

$found_intro = FALSE;
$found_pillar1 = FALSE;
$found_closing = FALSE;

foreach ($components as &$c) {
  // Defect 1 fix: mark the intro section's content row so the existing
  // dy-section--cta-pair L5 rule lays the lone "Follow the build" button
  // out at natural/fit-content width instead of stretching full-width.
  if ($c['uuid'] === $intro_section_uuid) {
    $inputs = json_decode($c['inputs'], TRUE);
    $existing_classes = array_filter(explode(' ', trim($inputs['additional_classes'] ?? '')));
    if (!in_array('dy-section--cta-pair', $existing_classes, TRUE)) {
      $existing_classes[] = 'dy-section--cta-pair';
    }
    $inputs['additional_classes'] = implode(' ', $existing_classes);
    $c['inputs'] = json_encode($inputs);
    $found_intro = TRUE;
  }

  // Defect 3 fix: trim pillar-card 1's body copy to the same weight as its
  // three siblings (~140-170 chars each). Framework list and
  // framework-agnostic guardrail (no per-framework adapters, no Drupal
  // framing) are both preserved verbatim in spirit.
  if ($c['uuid'] === $pillar1_card_uuid) {
    $inputs = json_decode($c['inputs'], TRUE);
    $inputs['body'] = 'Playwright, Cypress, Jest, pytest and any CTRF-emitting runner — no per-framework adapters.';
    $c['inputs'] = json_encode($inputs);
    $found_pillar1 = TRUE;
  }

  // Defect 4 fix: closing CTA section theme primary (brand teal, reserved
  // zone) -> light (cream), matching the approved wireframe's light-first
  // / cream-for-callout convention. Button inside (title-cta) needs no
  // prop change — it already renders terracotta-deep under any
  // light-register zone via the sitewide button token fix.
  if ($c['uuid'] === $closing_cta_section_uuid) {
    $inputs = json_decode($c['inputs'], TRUE);
    $inputs['theme'] = 'light';
    $c['inputs'] = json_encode($inputs);
    $found_closing = TRUE;
  }
}
unset($c);

if (!$found_intro) {
  throw new \Exception("Intro section (uuid $intro_section_uuid) not found — /aftersight tree has changed since this script was written; re-verify UUIDs before re-running.");
}
if (!$found_pillar1) {
  throw new \Exception("Pillar-1 card (uuid $pillar1_card_uuid) not found — /aftersight tree has changed since this script was written; re-verify UUIDs before re-running.");
}
if (!$found_closing) {
  throw new \Exception("Closing CTA section (uuid $closing_cta_section_uuid) not found — /aftersight tree has changed since this script was written; re-verify UUIDs before re-running.");
}

// Guard: every component_version must remain non-null/non-empty after the
// patch (Canvas OutOfRangeException guard). This script never touches
// component_version, but assert it explicitly so a future edit to this
// file cannot silently introduce a NULL.
foreach ($components as $c) {
  if (empty($c['component_version'])) {
    throw new \Exception("component_version resolved empty for uuid {$c['uuid']} ({$c['component_id']}) — aborting to avoid NULL save.");
  }
}

$entity->set('components', $components);
$entity->save();

echo "canvas_page 19 aftersight-fix visual pass complete. Component count: " . count($components) . "\n";
