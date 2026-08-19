# Services Engagement Cards — Drafts

*Brand-brief-aligned copy for the four service engagements on `services.md` (currently lines 39–53). Locked 2026-04-26 except where noted.*

These are the canonical descriptions for each engagement. Use them in:

- The body of the services Canvas page (replace the four `### …` sections at lines 39–53).
- The footer Services sub-list (link labels are the engagement names; descriptions don't appear in the footer itself).
- Any future references — homepage card text, sales collateral, capacity emails.

## 1. Test-suite takeover

**Status:** Locked 2026-04-26.

**Heading:** *Test-suite takeover.*

**Body:**

> Your Playwright or Cypress suite is broken, flaky, or abandoned. We take it over, fix it, and either hand it back green to your team or keep running it for you in CI. Built on ATK helpers wherever they shorten the path.

**Notes:**

- Heading was *"Testing-suite takeover"* in `Actual1/services.md`; relabeled to *"Test-suite takeover"* (correct compound-modifier hyphenation; *"test suite"* is the standard noun phrase).
- Soft close *"Ships with ATK where useful"* tightened to *"Built on ATK helpers wherever they shorten the path"* — more decisive.
- AI not claimed (option C, project memory `project_pl2_ai_positioning.md`).

## 2. Embedded testing engineer

**Status:** Locked 2026-04-26.

**Heading:** *Embedded testing engineer.*

**Body:**

> A senior testing engineer joins your team for as long as the work needs them — a release cycle, a quarter, or open-ended. Pairs with your developers, owns the test strategy, ships with your release cadence.

**Notes:**

- Duration framing tightened from clinical *"for the duration of a project or release"* to concrete options.
- AI not claimed; the human is the offer.

## 3. Autonomous-healing pilot

**Status:** Locked 2026-04-26.

**Heading:** *Autonomous-healing pilot.*

**Body:**

> We wire up the same Claude-agent workflow we run on this site, scoped to a slice of your existing test suite. You see how it behaves on real failures before committing to a broader rollout.

**Notes:**

- *"We install"* → *"We wire up"* (more engineering-voiced).
- This is the named AI service per project memory `project_pl2_ai_positioning.md` (option C — AI is a distinct service, not woven everywhere). Dogfood proof: the same workflow runs nightly on this site.

## 4. Accessibility testing

**Status:** *Parked 2026-04-26 — see `docs/pl2/GET-BACK-TO-THESE.md` §I.1.*

**Heading:** *Accessibility testing.*

**Body (current copy on `services.md` line 53, unchanged):**

> WCAG audits integrated into your CI pipeline. Not a one-time report — a continuous automated check that catches regressions before deploy.

**Notes:**

- Refinement deferred. Two facts needed before it can be rewritten without invention: (1) tooling-in-use confirmation, (2) decision on whether AI plays a client-visible role in the a11y pipeline (per option C). When both are available, refine.
- For the current pass, ship the existing copy as-is. The three locked cards above become the voice template.

## Footer Services sub-list

The Services sub-list in the footer block (visible on every page; e.g. `Actual1/homepage.md` lines 120–123) currently reads:

> Services
> - Drupal Development
> - Automated Testing
> - Performance Tuning
> - Open Source Projects

Replace with:

> Services
> - Test-suite takeover
> - Embedded testing engineer
> - Autonomous-healing pilot
> - Accessibility testing

### Link target

**Recommended:** each footer label deep-links to the matching anchor on `/services` — e.g. `/services#test-suite-takeover`. Drupal auto-generates anchor IDs from heading text; verify after keying in the new headings that the anchors resolve cleanly.

**Fallback:** if anchors don't auto-generate cleanly (or if the user prefers simpler), all four labels point to `/services` and the reader scans.

**Out of scope for this pass:** dedicated per-engagement pages (e.g. `/services/test-suite-takeover`). Worth doing later when each engagement has enough content to warrant a standalone page; not blocking the footer fix.

## Implementation order

1. Edit the services Canvas page in Admin UI — replace the headings and bodies of cards 1, 2, 3. Leave card 4 (accessibility) unchanged.
2. Run T1/T2/T3 on `/services` to verify the new copy renders correctly and Drupal-generated anchor IDs match the footer-link expectations.
3. Edit the footer block in Admin UI — replace the four link labels in the Services sub-list with the engagement names; point each at the anchored URL on `/services`.
4. Run T1/T2 on at least three different page types (homepage, services, contact) to confirm the footer reads correctly site-wide.
5. Commit.

The repositioning tagline replacement (*"Be the answer. Everywhere."* → *"Drupal testing, done by the people who wrote the tools."*) can be done in the same Admin-UI session as the footer fix; both live in the same footer-block surface.
