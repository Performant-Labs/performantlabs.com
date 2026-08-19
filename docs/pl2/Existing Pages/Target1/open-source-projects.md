# Open Source Projects section rewrites — Applied

*✓ Applied 2026-04-26.* Section rewrites and the placeholder-logos sub-pass landed via commits `99d7eb5` (cards + intro/CTA) and `6788576` (shared placeholder Media on all three new cards). Overlays: `content-exports/open-source-projects-rewrite-pass-1.overlay.yml` + `…-pass-2.overlay.yml`. Snapshot pair: `pre-open-source-projects-pass-1` + `pre-osp-logos-pass`. T3 captures: `.claude-bridge/t3-osp-pass1-2026-04-26/` + `.claude-bridge/t3-osp-logos-2026-04-26/`. Real per-product logos for ATK / Testor / CTRFHub remain open — placeholder is in place, swap is one-line per card.

*Section-level rewrites for `Existing Pages/Actual1/open-source-projects.md`. The page was significantly off-brand: it omitted ATK, Testor, and CTRFHub (the brand brief's three Tools-pillar products), framed OSS as a marketing benefit instead of as the source of authority, and used a generic "Contact us" CTA. This file proposed rewrites for those issues. For surgical patches on the same page (Andre → André, title-case headings), see the sibling `open-source-projects--patches.md`.*

## Section 4.1 — Add ATK, Testor, and CTRFHub cards

**Why it fails:** Brand brief §1 and §4 lead with *"We wrote the open-source tools the community uses (ATK and Testor) and we're building CTRFHub."* Yet this page lists Drupal Quality Initiative, Campaign Kit, Layout Builder Kit, and Payment Stripe — the brief's three Tools-pillar products are absent. This is the page where they should be most prominent.

**Proposed: add three new cards at the top of the project list, ahead of DQI.**

The three new cards reuse the canonical descriptions already approved on about-us.md:

> ### Automated Testing Kit (ATK)
>
> *A library of tests and helper functions for end-to-end testing of Drupal sites, for both Playwright and Cypress.*
>
> Why it exists: every Drupal site re-writes the same twenty login / entity-reference / permissions tests in each new project. ATK ships them pre-written, together with the helper functions needed to make them reliable against Drupal's specific quirks. Maintained on drupal.org as a supported module, including a Drupal 7 backport and a demonstration recipe.
>
> [drupal.org/project/automated_testing_kit](https://www.drupal.org/project/automated_testing_kit)

> ### Testor
>
> *A command-line companion to ATK for running tests outside the Drupal admin UI.*
>
> Why it exists: teams running ATK in CI and local dev want the same test suite accessible from a terminal, not only from the Drupal admin. Testor provides that surface. Maintained in the open on GitHub, updated through late 2025.
>
> [github.com/Performant-Labs/testor](https://github.com/Performant-Labs/testor)

> ### CTRFHub (in active development)
>
> *A test reporting and analytics platform built exclusively around [CTRF (Common Test Report Format)](https://ctrf.io). CTRF-native by design, on a modern architecture from scratch. AI features are part of the core product.*
>
> Why it exists: existing test reporting tools either ignore CTRF or treat it as one of many ingestion formats. CTRFHub assumes CTRF as the primary input and builds the analysis surface on top of that single, well-defined contract.
>
> Public release in progress. Build notes are published on [the blog](/articles).

**Structural impact:** three new SDC components added inside the projects-list section, positioned ahead of the existing DQI card. Component types will match the existing card pattern on this page (TBD at dump time — likely a "linked-heading + tagline + body" SDC variant; will confirm and reuse). One `add_components` block in the overlay; no removals.

**Status:** Approved 2026-04-26.

## Section 4.2 — Rewrite intro paragraph

**Current:**

> Performant Labs contributes code, helps organize events and gives presentations to the Drupal open source community — not just because we believe in giving back (which we do). Deeply participating in Drupal gives us these tangible benefits:
>
> - We expand our expertise
> - We stay current with a fast-moving industry
> - We create functionality needed by our clients
> - We establish important relationships with other experts
>
> Here are some projects we have initiated to enhance the Drupal experience.

**Why it fails:** Brand brief tone — *"Specifics over Adjectives," "Peer-to-Peer," "No origin myths or 'our mission is to...' framings."* This passage is generic OSS-as-marketing copy. It also says nothing about *what* Performant Labs has actually built.

**Replacement:**

> Performant Labs ships the open-source Drupal testing tools the rest of this site is about — ATK and Testor — and is currently building CTRFHub. The work below extends that into adjacent areas: a quality-process initiative, a few content / commerce kits, and a payment integration. All maintained on drupal.org under [aangel](https://www.drupal.org/u/aangel).

**Structural impact:** depends on dump. If the existing intro is a single text component containing the paragraph + four-bullet list + trailing sentence, replacement is a single `component_inputs` text patch (text-only replacement; the bullets and trailing sentence are subsumed into the new paragraph). If the bullets are a separate component, that component is removed. Confirmed at dump time; either way, one or two operations.

**Status:** Approved 2026-04-26.

## Section 4.5 — Rewrite the closing CTA

**Current:**

> ## Want to collaborate on an open source project
>
> [Contact us today](/contact-us)

**Why it fails:** Generic CTA framing, missing terminal punctuation on the heading, generic `/contact-us` URL with no intent parameter.

**Replacement:**

> ## Found a bug or want to contribute?
>
> File an issue on the project page above, or [drop us a line](/contact-us?intent=oss).

**Structural impact:** none. Same CTA slot, same position. Two text patches: the H2 input text and the body text/link href.

**Status:** Approved 2026-04-26.

## Implementation order

When all sections (here and in the patches file) are Approved or Parked:

1. Pull the canvas_page dump via the bridge (UUID `199d9f62-962c-44fc-bbb6-6bc3796c43b0` per the earlier ddev recon).
2. Identify component UUIDs for: the intro block, each existing project card (DQI / Campaign Kit / LBK / Payment Stripe), the "Other Modules" heading, and the closing CTA. Also identify the component type used for project cards (so the three new cards match the pattern).
3. Author `content-exports/open-source-projects-rewrite-pass-1.overlay.yml`:
   - `component_inputs` for: intro text, "Other Modules" heading text (Patch 4.4), DQI card "Andre" → "André" body (Patch 4.3), CTA heading + body.
   - `add_components` block: insert ATK + Testor + CTRFHub cards anchored to the intro component, positioned at the top of the project list.
4. Dry-run via the bridge.
5. Commit overlay + snapshot pair `pre-open-source-projects-pass-1`.
6. Apply via drush php:script + drush cr.
7. T1 verification (curl `/open-source-projects` for new strings present + old strings absent).
8. T3 capture (desktop + mobile).
9. Commit.
