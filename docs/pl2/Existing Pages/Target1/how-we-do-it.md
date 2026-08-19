# How We Do It — Approved

*✓ All sections approved 2026-04-26.* Wholesale rewrite of `Existing Pages/Actual1/how-we-do-it.md`. The current page is pre-repositioning build-shop content top to bottom (assess → migrate → rebuild → entering new content). Per the conformance review's Pass 4, this is not a patch job — every section needs replacement. The new page describes how a testing engagement runs, not how a site rebuild runs.

*Skeleton anchor: conformance review §3 (lines 171–192). Voice anchor: brand brief §3 (Pragmatic & Sober / Peer-to-Peer / Specifics over Adjectives / Eye-Roll Test). Vocabulary anchor: services.md (engagement names: Testing-suite takeover / Embedded testing engineer / Autonomous-healing pilot / Accessibility testing).*

*Open-question defaults taken (André's "approve all and begin implementation" instruction): Option A on icons (delete one icon-card, keep existing four icons as placeholders for the three new cards — re-source later if T3 looks off); keep cost-of-bugs graph with recaptioned testing-context line; keep the Week 1 / Week 2 / Week 3+ scaffolding as cadence framing; keep intent-routed CTA `?intent=testing-review` (services.md already uses this pattern in production); hidden-canvas check folded into the audit step.*

---

## Section 3.A — Page title + lead

**Status:** Approved 2026-04-26

The page H1 changes from *"How We Do It"* to *"How a testing engagement runs."* (sentence case; no exclamation). The lead paragraph replaces the current build-shop opener about being founders of DQI and "process and experience combine to create a fantastic project."

**Current (Actual1 line 25):**

> As the founders of the [Drupal Quality Initiative](https://drupal.org/project/dqi), we deeply understand that process and experience combine to create a fantastic project. Here is how we do it.

**Replacement:**

> # How a testing engagement runs.
>
> Most clients arrive with a Drupal site that already works and a test suite that doesn't. The engagement is sized to the gap — not to a headcount target, not to a fixed-fee deliverable, and not to a methodology brand-name. The shape of the work is determined by what your suite is doing on the day we read it.

**Why:** Brand brief §1 — *"We are NOT a Drupal build shop. We do not build sites; we test the ones you already have."* The new opener immediately tells the reader what we test, what we expect to find, and what won't happen (no headcount push, no fixed-fee, no Methodology TM). Eye-roll test: passes. The DQI-founders fact is true but belongs on `/about-us` and `/open-source-projects`, not as the lead of a page that is about how we run engagements today.

---

## Section 3.B — "Detailed Planning" → "Week 1 — Audit"

**Status:** Approved 2026-04-26

The current "Detailed Planning" section is generic project-management copy ("planning saves time and money down the road by foreseeing problems and design issues before they arise") with the relative-cost-of-bugs graph. It is not testing-specific.

**Current (Actual1 lines 27–33):**

> ## Detailed Planning
>
> It's tempting to start work immediately, especially using the Agile process that we use. However, we have learned that planning saves time and money down the road by foreseeing problems and design issues before they arise.
>
> Problems get more expensive to solve when they are discovered later in the process, as this graph shows:
>
> [Relative cost of fixing bugs graph]

**Replacement:**

> ## Week 1 — Audit.
>
> A senior testing engineer reads your existing Playwright or Cypress suite, runs it against your environments, and produces a one-page audit. The audit names which tests are flaky, which are abandoned, which are missing, and which CI gates would benefit most from autonomous healing.
>
> The audit is the deliverable. If you stop here, you walk away with an honest read on the state of your test surface — written by someone who maintains the tools the rest of the Drupal community uses, not by someone selling you a fix.
>
> [Relative cost of fixing bugs graph — kept, but recaptioned]

**Replacement caption for the graph:**

> *Bugs that escape the test suite cost an order of magnitude more to fix in production than in CI. The audit identifies which gaps in your suite are letting them through.*

**Why:** Brand brief §3 (Specifics over Adjectives), §4 (Tools pillar — *"we maintain ATK, Testor"*). The replacement names the actual deliverable (a one-page audit), the actual person doing it (a senior testing engineer who maintains the tools), and gives the reader the option to walk away after the audit — which is a peer-to-peer move, not a sales move.

The cost-of-bugs graph can stay because the underlying fact (defects compound in cost as they progress) is testing-specific, not build-shop-specific. The recaption ties it explicitly to the audit deliverable.

---

## Section 3.C — "Keeping to the Budget" → "Week 2 — Stand up the dogfood loop"

**Status:** Approved 2026-04-26

The current "Keeping to the Budget" section and its three sub-sections (*Everything Can Be Resolved With Communication* / *Post-Launch Support* / *An In-Depth Assessment*) are generic agency-process copy. Every paragraph is build-shop framed.

**Current (Actual1 lines 35–51):**

> ## Keeping to the Budget
>
> Creating a successful website includes minimizing costs and keeping to the timeline—while maintaining high quality. Balancing all three takes the experience of building lots of sites and solving lots of business problems.
>
> We've learned that budgets are powerful tools to focus a project on what's most important. At every step in the process, we will share ways to reduce risk and keep the project on track.
>
> ### Everything Can Be Resolved With Communication
>
> Effective communication is built into our project plans. Through frequent and honest communication, the best designs are revealed, issues are resolved, and trust is built. We use video interviews, email, Slack, ticket tracking—even old-school telephones—so you are always apprised of project status.
>
> ### Post-Launch Support
>
> Our commitment to quality continues after the website is launched. We monitor your site and fix problems that show up only when a site is used by more than the production and testing team. We've got your back.
>
> ### An In-Depth Assessment
>
> We especially like reducing risk when building websites. Our assessment describes your existing site comprehensively while showing what needs to change during the rebuild. Clients take advantage of new websites to expand their marketing and product/service delivery efforts.

**Replacement:**

> ## Week 2 — Stand up the dogfood loop.
>
> We install ATK helpers where the audit identified gaps, then wire the autonomous-healing workflow against a single CI lane on your repository. The Claude agent watches that lane during one full release cycle. Every failure it sees is either fixed in a pull request you review and merge, or routed to a human as a website-issue ticket.
>
> Two things matter about this stage. First, we run on real failures, not seeded ones — the dogfood loop is supposed to be a representative sample of what your team would actually see week to week. Second, scope is one CI lane, not the whole pipeline. You see the workflow behave under load before broader rollout, and you can pull the plug after one cycle if it isn't earning its keep.
>
> ### What changes from "we monitor your site"
>
> Performant Labs does not run infrastructure monitoring. We don't replace your hosting team, we don't watch your synthetics, and we don't take pages. The autonomous-healing loop runs against your *test suite* — not against production. When tests fail at 2am, the agent diagnoses, classifies, and either opens a PR with a candidate fix or files a website-issue ticket. The release stays release-ready.

**Why:** Conformance review violation 3.2 — the "We monitor your site and fix problems" sentence reads like a hosting/managed-service offer, not a testing offer. The replacement explicitly disclaims infrastructure monitoring while describing what the autonomous-healing workflow actually does (runs against the test suite, not production).

The "Everything Can Be Resolved With Communication" and "Post-Launch Support" sub-sections from Actual1 are dropped entirely — they are filler copy that belongs in a build-shop methodology doc, not on a page describing how a testing engagement runs. The "An In-Depth Assessment" sub-section is folded back into Section 3.B's Week 1 audit (it is the same deliverable described twice in the original).

---

## Section 3.D — "How We Work" four-icon block → "Week 3+ — Take over or hand back"

**Status:** Approved 2026-04-26

The current "How We Work" section is four icon-cards (We Assess Your Needs / We Work With Your Team / We Tell You Where to Focus / In-Depth Site Assessment) — all four are build-shop copy describing site rebuild stages. They map onto a website-build engagement, not a testing engagement.

**Current (Actual1 lines 53–77):**

> ## How We Work
>
> ### We Assess Your Needs
> Most organizations have an existing site that is no longer working for them. We examine the site while working with you to determine the goals of the new site—introducing possibilities while keeping the budget in check.
>
> ### We Work With Your Team
> Our first steps are to set up the new site and begin designing the migration process. Once the basics are ready, your people can begin entering new content or revising the previous content.
>
> ### We Tell You Where to Focus
> We'll always recommend the faster ways to achieve your results while giving you options. Our goal is to help you maximize the return on your investment.
>
> ### In-Depth Site Assessment
> We like reducing risk. Our assessment describes your existing site comprehensively while showing what needs to change during the rebuild—it's almost never just the template.

**Replacement (single section — three engagement-shape cards instead of four icon-cards):**

> ## Week 3+ — Take over or hand back.
>
> After the dogfood loop has run for a release cycle, the engagement settles into one of three shapes. Two of them are equally good outcomes; the third is occasionally what's right.
>
> ### Hand back, green.
>
> Your team takes the suite back, fixed. We deliver the cleaned-up tests, the autonomous-healing workflow as a code-owned subdirectory in your repo, and a short runbook your engineers can keep operating. We don't lock you in. If your team wants to own this, that is the correct outcome and we are not going to fight you on it.
>
> ### Take over, ongoing.
>
> We keep running the suite for you. The Claude agent stays wired to the CI lane it learned on, broadens to additional lanes on a schedule we agree on, and a senior testing engineer stays on the engagement as the human counterpart. Engagements are sized to the work — not to a headcount target.
>
> ### Embed, instead.
>
> If the bottleneck is people rather than tooling, we send a senior testing engineer to your team for the duration of a release. They pair with your developers, own the test strategy, and ship with your release cadence. ATK and the autonomous-healing workflow come along to the extent they're useful, but the engagement is structured around the embedded engineer, not around our tools.

**Why:** Brand brief §4 (People pillar — *"We embed senior testing engineers"*), services.md engagement names (*"Testing-suite takeover" / "Embedded testing engineer"*). The three replacement cards mirror the three concrete engagement shapes the company actually offers, named in a way the reader can match against the services page.

Three cards instead of four is a structural exception (the existing canvas has four icon-card components in this section). Two options for handling that:

- **Option A (clean):** delete one canvas icon-card component, repoint the remaining three at the new copy, accept the icon mismatch (the existing icons are about assess/work/recommend/in-depth — none map cleanly to take-over/hand-back/embed). New icons would need to be sourced.
- **Option B (lean):** keep four icon-cards, fold the fourth into a "What's the difference?" comparison row. Costs an extra paragraph but reuses the existing structure.

Recommend **Option A** — the structural simplification is the point of the rewrite. Icon sourcing is a small follow-up task; the existing icons stay in place as placeholders if needed.

---

## Section 3.E — Add "What we don't do" guardrail (new section)

**Status:** Approved 2026-04-26

The conformance review's recommended skeleton (line 189–191) calls for an explicit *"What we don't do"* section. The current Actual1 has no equivalent — every section is positively framed, and the negative framing (build-shop disclaimers) lives on `/services` instead. Adding it on this page lets the engagement description close out with a clear scope guardrail.

**Replacement (new section, no Actual1 equivalent):**

> ## What we don't do.
>
> We don't build sites. We don't run a content migration. We don't replace your Drupal team. We don't monitor your infrastructure or take pages. We don't bill against a fixed-fee build-shop SOW.
>
> Every engagement is testing work, scoped to the gap between the suite you have and the suite your release process needs. If the gap is small, we say so and the engagement is small. If it isn't a testing gap at all, we say so and we don't take the work.

**Why:** Brand brief §6 (Guardrails — *"Do not use build-shop framing"*). Closing with the disclaimer-list keeps the eye-roll test passing through the end of the page — the reader leaves with a concrete read on what we won't sell them, which is itself a positioning move.

---

## Section 3.F — CTA

**Status:** Approved 2026-04-26

The current closing CTA is a generic *"Contact us today"* with no intent routing. The conformance review (violation 3.3) calls for replacing it with the intent-routed pattern used elsewhere on the site.

**Current (Actual1 lines 79–81):**

> ## Ready to start a project with us?
>
> [Contact us today](/contact-us)

**Replacement:**

> ## Want a one-page audit of your testing surface?
>
> [Book a testing review](/contact-us?intent=testing-review)

**Why:** Conformance review violation 3.3, services.md line 81–83 (same CTA pattern is already in production on `/services`). The heading change makes the CTA's promise concrete (*one-page audit*) — the reader knows what they're signing up for before they click.

---

## Open questions for André

1. **Icon mismatch.** Section 3.D currently shows four icon-cards (Assess / Work / Recommend / In-Depth). The rewrite collapses to three (Hand back / Take over / Embed). Do you want to (a) source three new icons before this pass ships, (b) keep the existing four and accept the icon-mismatch, or (c) drop the icons entirely and use a text-only three-card layout?

2. **Cost-of-bugs graph.** Section 3.B keeps the *Relative Cost of Fixing Bugs* graph with a recaptioned testing-context line. Confirm you're OK keeping it — alternative is dropping it entirely (it is a stock chart and not a Performant-Labs original).

3. **"Week 1 / Week 2 / Week 3+" framing.** This is calendar-style scaffolding. If actual engagements run on a different cadence (e.g., audit-only is one day, not one week), the section headings should change to match. Confirm the week-based scaffolding is roughly right, or tell me a more accurate cadence.

4. **Intent-routed CTAs and routing destination.** Is `?intent=testing-review` a routing parameter your contact form actually consumes (i.e., does the destination see and act on it)? If not, the parameter is decorative — fine, but worth being aware of.

5. **"We Speak" and other elements that the current canvas may have but Actual1 doesn't show.** Actual1's how-we-do-it page is short — let me know if there are any sections in the canvas tree that are not in Actual1 (e.g., a hidden block or something below the CTA) that this draft needs to address.

---

## Implementation note (non-draft)

This page's canvas structure has not been examined yet. The drafts above describe content. Mapping draft → overlay (component_inputs patches and add/remove components) happens once the sections are approved. Likely shape:

- Patches on existing `text` / `heading` / `card-canvas` components (most sections).
- One structural change: the `How We Work` four-icon-card block → three engagement-shape cards (Section 3.D — Option A in the open question above).
- One structural addition: the new `What we don't do` section (Section 3.E).

Snapshot pair `pre-how-we-do-it-pass-1` will be taken at apply time, per the snapshot-before-DB-mutation rule.
