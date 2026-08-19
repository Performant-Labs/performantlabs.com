# Homepage section rewrites — Applied

*✓ Applied 2026-04-26.* Sections 1.4, 1.5, 1.6 all shipped via commit `57a1ee6` + overlay apply. Section 1.4 was a structural exception (one Canvas section deleted, one image relocated) — confirmed visually clean on T3 desktop + mobile captures. Snapshot pair: `pre-homepage-rewrite-pass-1`. Footer items remain open and are handled separately.

*Section-level rewrites for `Existing Pages/Actual1/homepage.md`. For surgical vocabulary patches on the same page, see the sibling `homepage--patches.md`.*

## Section 1.4 — "One partner, every layer of the stack" (lines 70–82)

**Current shape (3-column with dashboard image):**

> ## One partner, every layer of the stack.
>
> Testing
>
> ATK gives your team a structured, maintainable test suite from day one. Functional, accessibility, and regression tests run in CI so regressions never reach production.
>
> **Engineering**
>
> **Senior Drupal engineers embedded with your team or working to a fixed-scope spec. We cover custom module development, migrations, performance, and architecture reviews.**
>
> Strategy
>
> [Dashboard image showing test results and code metrics]

**Why it fails:** *"Every layer of the stack"* implies application-stack work (frontend, backend, infra). The Engineering column then describes custom module development, migrations, performance, and architecture reviews — exactly the build-shop work the brand brief says PL does not do. The section is also redundant: the page already presents Tools / AI / People as three pillar cards higher up (lines 40–62).

### Approved approach — Remove the section entirely

The Tools / AI / People pillars already render as three cards earlier on the page. This section adds nothing the cards don't already do. Removing it cuts the off-brand text and tightens the page narrative.

**Where the dashboard image goes:** move it up to anchor the *"We heal our own tests nightly"* section (line 64). That section currently has no visual; a public dashboard of last-night's healing run is the natural anchor for the AI pillar's proof point.

**Structural-exception note:** this is an approved exception to the plan's *"structural preservation is the default"* rule (`Prompts/website_copy_audit_plan.md` Phase 2). Admin-UI operations:

1. Delete the entire *"One partner, every layer of the stack"* Canvas section — heading plus 3-column block.
2. Move the dashboard image (Media reference, currently a child of the deleted section's Strategy column) into a new image slot inside the *"We heal our own tests nightly"* section above.

Two structural operations rather than text-only replacement; approved because the underlying redundancy with the pillar cards above is itself a structural problem the page should fix.

**Status:** Approved 2026-04-26.

## Section 1.5 — FAQ "How does an engineering engagement work?" (lines 101–103)

**Current:**

> **How does an engineering engagement work?**
>
> We offer staff augmentation (embed our engineers with your team), fixed-scope project delivery, and advisory retainers. Engagements can typically begin within one to two weeks of scoping.

**Why it fails:** *"Engineering engagement"* frames PL as a generalist Drupal-engineering shop. The answer (staff augmentation + fixed-scope + advisory retainers) is a generic IT-services menu, not a testing-specific one. Both the Q and the A need to change.

**Replacement:**

> **How does a testing engagement work?**
>
> Four shapes, depending on what's broken: a *test-suite takeover* (we fix and run a broken or abandoned suite), an *embedded testing engineer* (a senior testing engineer joins your team for a release cycle, a quarter, or open-ended), an *autonomous-healing pilot* (we wire up the same Claude-agent workflow we run on this site, scoped to a slice of your CI), or *accessibility testing* (continuous WCAG audits in your pipeline). Most engagements begin within one to two weeks of scoping.
>
> [See the engagement details →](/services)

The four engagement names match `services--engagement-cards.md`. The CTA links to `/services` for the longer descriptions.

**Structural impact:** none. Same FAQ slot, same position in the FAQ list — text-only Q+A replacement.

**Status:** Approved 2026-04-26.

## Section 1.6 — FAQ "Can you help with a legacy Drupal 7 or Drupal 9 migration?" (lines 105–107)

**Current:**

> **Can you help with a legacy Drupal 7 or Drupal 9 migration?**
>
> Absolutely. We have migrated dozens of legacy Drupal sites to current major versions. Our process covers content, configuration, and custom module refactoring — with automated tests validating each migration stage.

**Why it fails:** Migrations are build-shop work. *"We have migrated dozens of legacy Drupal sites"* and *"custom module refactoring"* describe services PL does not offer per the brand brief. The only on-brand sentence is the trailing *"automated tests validating each migration stage"* — and that's the actual offer hidden inside a build-shop wrapper.

### Approved approach — Reframe as testing-the-migration

Migrations are a high-stakes moment where testing value is concentrated. PL writes the tests that validate the migration; PL does not run the migration.

> **Can you test a Drupal 7 or Drupal 9 migration in flight?**
>
> Yes. We don't run the migration — your team or your build agency does that — but we write the regression suite that validates each stage of it. Pre-migration baseline tests, mid-migration parity tests, post-migration smoke tests. The suite lives in your repo, runs in your CI, and stays yours after the migration ships.

This claims a real, scoped, testing-shaped offer.

**Structural impact:** none. Same FAQ slot, same position in the FAQ list — text-only Q+A replacement.

**Status:** Approved 2026-04-26.

## Implementation order

When all sections above and all patches in `homepage--patches.md` have status `Approved` or `Parked`:

1. Open the homepage Canvas page in Admin UI.
2. Apply Section 1.4: replace per the chosen option (most likely Option A — remove the three-column block; move the dashboard image up to anchor the *"We heal our own tests nightly"* section).
3. Apply Section 1.5: replace the existing FAQ Q+A with the testing-engagement Q+A.
4. Apply Section 1.6: replace per the chosen option (Option A reframe, or Option B remove).
5. Apply the three patches from `homepage--patches.md` in the same Admin-UI session.
6. Run T1 (curl), T2 (ARIA), T3 (screenshots).
7. Only after T3 passes, no alias swap is needed (homepage stays at `/`); commit.

The patches and section rewrites bundle into one Admin-UI session per the plan's Phase 5 — one editor session, all changes in, single T1/T2/T3 cycle, single commit.
