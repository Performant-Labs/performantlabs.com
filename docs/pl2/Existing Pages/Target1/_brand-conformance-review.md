# Brand-Brief Conformance Review

*Cross-page assessment of `Existing Pages/Actual1/` against the composite standard (`Briefs/pl_brand_brief.md` governs; `Briefs/pl_copy_brief.md` provides style mechanics). 2026-04-26.*

## Summary

Eight pages assessed. Conformance ranges from *strong* (homepage, about-us, services) to *needs total rewrite* (how-we-do-it, open-source-projects). One legacy article (article-atk-v10) sits outside the repositioning scope but is included for completeness because its tone violations are systemic.

Severity ranking by page (1 = most off-brand, 8 = closest to brief):

1. **how-we-do-it** — pre-repositioning build-shop content from start to finish. Total rewrite.
2. **open-source-projects** — entirely omits ATK, Testor, and CTRFHub (the brand brief's three Tools-pillar products) and frames OSS as a marketing benefit.
3. **article-atk-v10** — historical 2023 article. Voice ("I"), exclamation points, framework ordering, and "the bomb" tone violations. Out of repositioning scope unless explicitly included.
4. **homepage** — three vocabulary patches *plus* three sections retaining build-shop framing from the pre-repositioning version of the site (Engineering service column, "engineering engagement" FAQ, Drupal-migration FAQ). Patches scope plus section-rewrites scope.
5. **articles** (list) — minimal copy, but includes "Automated testing is the bomb." teaser that fails the eye-roll test.
6. **services** — strong. One title-case heading ("We Speak"), one logo-order issue (Cypress before Playwright).
7. **contact** — form-only page; almost no marketing surface area. Footer issues only.
8. **about-us** — closest to brief. No content violations; only the universal footer issue.

## Cross-cutting issues (apply to every page)

### Footer "Services" sub-list contradicts the brand brief

Every page footer (lines vary by page; e.g. homepage:120-123, services:88-91, about-us:84-87) lists:

> Services
> - Drupal Development
> - Automated Testing
> - Performance Tuning
> - Open Source Projects

**Why it fails:** "Drupal Development" and "Performance Tuning" are build-shop framings the brand brief explicitly rejects (*"We are NOT a Drupal build shop. We do not build sites; we test the ones you already have."*). "Automated Testing" is on-brief but underspecified. The list also misses the AI-healing pillar entirely.

**Rephrased:**

> Services
> - Testing-suite takeover
> - Embedded testing engineer
> - Autonomous-healing pilot
> - Accessibility testing

(These four mirror the section structure already in `services.md` lines 39–53, so the footer would be a faithful index of the services page rather than a contradicting one.)

### Footer closing tagline

Homepage:133-134 (and possibly footer-block on every page):

> Be the answer.
> Everywhere.

**Why it fails:** Vague, generic, fails the eye-roll test. Doesn't name the company, the audience, or the offer. Could plausibly fit any agency.

**Rephrased — option A (drop entirely):** delete the line. Footer ends with `Get in touch →` link.

**Rephrased — option B (replace with positioning hook):**

> Drupal testing, done by the people who wrote the tools.

(Reuses the about-us hero, which is already on-brief.)

## Page 1 — homepage.md

Overall **mixed**. The hero, the three pillar cards (Tools / AI / People), and the *"We heal our own tests nightly"* section are strong and on-brand. But three other sections retain build-shop framing from the pre-repositioning version of the site — the Engineering column under *"One partner, every layer of the stack,"* the *"engineering engagement"* FAQ, and the Drupal-migration FAQ — and the FAQ section also has the ATK self-description issue. Six findings: three vocabulary patches and three section rewrites.

### Violation 1.1 — "QA engineer" (line 66)

> No staging calls with a QA engineer.

**Why it fails:** Brand brief §5 vocabulary lock — *"Use 'Testing engineer' (Never 'QA engineer,' never 'tester')."*

**Rephrased:**

> No staging calls with a testing engineer chasing yesterday's flake.

### Violation 1.2 — ATK self-description contradicts about-us (line 95)

Homepage FAQ:

> ATK is Performant Labs' open-source functional testing framework for Drupal, available on Drupal.org. It provides a structured Cypress and PHPUnit test suite that works out of the box with standard Drupal installations - covering forms, roles, content types, and accessibility.

About-us (line 47) describes ATK as:

> A library of tests and helper functions for end-to-end testing of Drupal sites, for both Playwright and Cypress.

**Why it fails:** Two-part. (a) Internal inconsistency — the homepage says ATK is Cypress + PHPUnit; the about page says ATK is Playwright + Cypress. (b) Even if both are technically true, the homepage version names Cypress before Playwright (when it names Playwright at all), violating brand brief §5.

**Rephrased:**

> ATK (Automated Testing Kit) is the open-source Drupal testing library Performant Labs maintains on drupal.org. It ships pre-written Playwright and Cypress tests for the work every Drupal site ends up doing — login, registration, content CRUD, taxonomy, sitemaps, accessibility — so your team starts with a working suite instead of a blank file.

### Violation 1.3 — "QA time drops" (line 88)

> QA time drops as automated test runs replace manual checks

**Why it fails:** Same vocabulary lock — "QA" framing.

**Rephrased:**

> Manual test cycles drop as automated runs cover the regression surface.

### Violation 1.4 — "Engineering" service column (lines 70–78)

Under the section heading *"One partner, every layer of the stack,"* the page presents three columns: Testing, Engineering, Strategy. The Engineering column reads:

> Senior Drupal engineers embedded with your team or working to a fixed-scope spec. We cover custom module development, migrations, performance, and architecture reviews.

**Why it fails:** Brand brief §1 — *"We are NOT a Drupal build shop. We do not build sites."* Custom module development, migrations, performance work, and architecture reviews are all build-shop services. The section heading itself — *"every layer of the stack"* — implies application-stack work, which compounds the problem. The section is also redundant: the page already presents Tools / AI / People as three pillar cards higher up (lines 40–62).

**Recommended fix:** see `Target1/homepage.md` Section 1.4 for three replacement options. Option A (remove the section entirely; move the dashboard image up to anchor the *"We heal our own tests nightly"* section) is simplest and aligns the page with the three pillar cards already present.

### Violation 1.5 — FAQ "How does an engineering engagement work?" (lines 101–103)

> **How does an engineering engagement work?**
>
> We offer staff augmentation (embed our engineers with your team), fixed-scope project delivery, and advisory retainers. Engagements can typically begin within one to two weeks of scoping.

**Why it fails:** *"Engineering engagement"* frames PL as a generalist Drupal-engineering shop. The answer (staff augmentation + fixed-scope + advisory retainers) is a generic IT-services menu, not a testing-specific one. Both Q and A need to change.

**Recommended fix:** see `Target1/homepage.md` Section 1.5 — reframe as a *testing engagement* with the four engagement types from `services--engagement-cards.md` named.

### Violation 1.6 — FAQ "Can you help with a legacy Drupal 7 or Drupal 9 migration?" (lines 105–107)

> Absolutely. We have migrated dozens of legacy Drupal sites to current major versions. Our process covers content, configuration, and custom module refactoring — with automated tests validating each migration stage.

**Why it fails:** Migrations are build-shop work. *"We have migrated dozens of legacy Drupal sites"* and *"custom module refactoring"* describe services PL does not offer. The only on-brand sentence is the trailing *"automated tests validating each migration stage"* — and that's the actual offer hidden inside a build-shop wrapper.

**Recommended fix:** see `Target1/homepage.md` Section 1.6 for two replacement options. Option A (reframe as testing-the-migration: PL writes the regression suite that validates each stage; the migration itself is run by the client or their build agency) preserves the FAQ but on-brand. Option B removes it entirely.

## Page 2 — services.md

Overall **strong**. One copy fix, one logo-order issue.

### Violation 2.1 — "We Speak" title-case (line 67)

> ## We Speak

**Why it fails:** Casing rule. Also the section name itself is generic — "we speak" what?

**Rephrased — option A (sentence case, keep label):**

> ## We work in these stacks.

**Rephrased — option B (drop label, let logos speak):** delete the heading entirely; the logo strip is self-explanatory.

### Violation 2.2 — Logo order Cypress before Playwright (lines 71, 79)

The image strip is ordered: drupal, Cypress, php, javascript, react, Playwright.

**Why it fails:** Brand brief §5 — *"Always list Playwright before Cypress."* Applies to image ordering, not just sentences.

**Fix:** reorder the logo strip so Playwright precedes Cypress. Suggested order: drupal, Playwright, Cypress, php, javascript, react.

## Page 3 — how-we-do-it.md

Overall **needs total rewrite**. The page is pre-repositioning build-shop content. Almost every paragraph contradicts the brand brief.

### Violation 3.1 — Build-shop framing throughout (lines 27–77)

Examples:

> Creating a successful website includes minimizing costs and keeping to the timeline—while maintaining high quality. (line 37)

> Most organizations have an existing site that is no longer working for them. We examine the site while working with you to determine the goals of the new site (line 59)

> Our first steps are to set up the new site and begin designing the migration process. Once the basics are ready, your people can begin entering new content (line 65)

> Our assessment describes your existing site comprehensively while showing what needs to change during the rebuild (line 77)

**Why it fails:** Brand brief §1 — *"We are NOT a Drupal build shop. We do not build sites."* This entire page reads as a build-shop methodology page (assess → migrate → rebuild → entering new content).

**Rephrased — wholesale replacement.** The new page describes how a *testing engagement* is run, not how a site rebuild is run. Skeleton:

> # How a testing engagement runs.
>
> *Most clients arrive with a Drupal site that already works and a test suite that doesn't. The engagement is sized to the gap, not to a headcount target.*
>
> ## Week 1 — Audit
>
> A senior testing engineer reads your existing Playwright or Cypress suite, runs it against your environments, and produces a one-page audit: which tests are flaky, which are abandoned, which are missing, and which CI gates would benefit most from autonomous healing.
>
> ## Week 2 — Stand up the dogfood loop
>
> We install ATK helpers where the audit identified gaps and wire the autonomous-healing workflow against a single CI lane. You watch it run on real failures for one full release cycle before any broader rollout.
>
> ## Week 3+ — Take over or hand back
>
> Two outcomes are equally good: we keep running the suite for you, or we hand it back green to your team with documentation. We don't lock you into either.
>
> ## What we don't do.
>
> We don't build sites. We don't run a content migration. We don't replace your Drupal team. Every engagement is testing work, scoped to the gap.

(Sized as one possible rewrite. The exact methodology should be confirmed against `repositioning-runbook.md` and `phase-2-page-plan.md`.)

### Violation 3.2 — "We monitor your site and fix problems" (line 47)

> Our commitment to quality continues after the website is launched. We monitor your site and fix problems that show up only when a site is used by more than the production and testing team.

**Why it fails:** Reads like a hosting / managed-service offer, not a testing offer. "We monitor your site" implies infrastructure monitoring — a service Performant Labs doesn't offer.

**Rephrased:**

> The autonomous-healing workflow keeps running after launch. Tests that broke last night are diagnosed, classified, and either fixed by a Claude agent in a pull request or routed to a human as a website-issue ticket. The release stays release-ready.

### Violation 3.3 — Generic "Contact us today" CTA (line 81)

> [Contact us today](/contact-us)

**Why it fails:** The brand brief and the rest of the site use specific intent-based CTAs (`?intent=testing-review`, `?intent=nearshore-capacity`). Generic "Contact us today" loses the routing.

**Rephrased:**

> [Book a testing review](/contact-us?intent=testing-review)

## Page 4 — open-source-projects.md

Overall **needs major rewrite**. The page lists Performant Labs' OSS work but **misses ATK and Testor entirely** — the two products the brand brief leads with. The framing also sells OSS as a marketing benefit ("we expand our expertise") rather than as the source of authority.

### Violation 4.1 — Missing ATK, Testor, and CTRFHub

The page lists Drupal Quality Initiative, Campaign Kit, Layout Builder Kit, and Payment Stripe. ATK and Testor — the brand brief's two pillar Drupal-community products — are absent. **CTRFHub** — a third tool now in active development, with public progress published on the blog — also has no presence here.

**Why it fails:** This is the page where the company's own tools should be most prominent.

**Fix:** Add ATK, Testor, and a forthcoming-CTRFHub card as the first three on the page, ahead of DQI. Use the ATK and Testor descriptions already approved on `about-us.md` lines 45–59 and the new CTRFHub copy below:

> ### Automated Testing Kit (ATK)
>
> A library of tests and helper functions for end-to-end testing of Drupal sites, for both Playwright and Cypress.
>
> Why it exists: every Drupal site re-writes the same twenty login / entity-reference / permissions tests in each new project. ATK ships them pre-written, together with the helper functions needed to make them reliable against Drupal's specific quirks. Maintained on drupal.org as a supported module, including a Drupal 7 backport and a demonstration recipe.
>
> [drupal.org/project/automated_testing_kit](https://www.drupal.org/project/automated_testing_kit)
>
> ### Testor
>
> A command-line companion to ATK for running tests outside the Drupal admin UI.
>
> Why it exists: teams running ATK in CI and local dev want the same test suite accessible from a terminal, not only from the Drupal admin. Testor provides that surface. Maintained in the open on GitHub, updated through late 2025.
>
> [github.com/Performant-Labs/testor](https://github.com/Performant-Labs/testor)
>
> ### CTRFHub (in active development)
>
> A test reporting and analytics platform built exclusively around [CTRF (Common Test Report Format)](https://ctrf.io). CTRF-native by design, on a modern architecture from scratch. AI features are part of the core product.
>
> Why it exists: existing test reporting tools either ignore CTRF or treat it as one of many ingestion formats. CTRFHub assumes CTRF as the primary input and builds the analysis surface on top of that single, well-defined contract.
>
> *Public release in progress. Build notes are published on [the blog](/articles).*

### Violation 4.2 — OSS framed as marketing (lines 25–32)

> Performant Labs contributes code, helps organize events and gives presentations to the Drupal open source community — not just because we believe in giving back (which we do). Deeply participating in Drupal gives us these tangible benefits:
>
> - We expand our expertise
> - We stay current with a fast-moving industry
> - We create functionality needed by our clients
> - We establish important relationships with other experts

**Why it fails:** Brand brief tone — *"Specifics over Adjectives"*, *"Peer-to-Peer"*, *"No origin myths or 'our mission is to...' framings."* This passage is generic OSS-marketing copy. It also says nothing about *what* Performant Labs has actually built.

**Rephrased:**

> Performant Labs ships the open-source Drupal testing tools the rest of this site is about — ATK and Testor. The work below extends that into adjacent areas: a quality-process initiative, a few content / commerce kits, and a payment integration. All maintained on drupal.org under [aangel](https://www.drupal.org/u/aangel).

### Violation 4.3 — "Andre" without accent (line 40)

> Andre presented the project at the Bay Area Drupal Camp.

**Why it fails:** The about-us page uses "André Angelantoni" (correctly accented). Inconsistent name spelling across pages is a small but real credibility hit.

**Rephrased:**

> André presented the project at the Bay Area Drupal Camp.

### Violation 4.4 — Title-case sub-headings (lines 36, 44, 52, 58, 60)

Examples: `Drupal Quality Initiative`, `Campaign Kit`, `Layout Builder Kit`, `Other Modules We Maintain`, `Payment Stripe`.

**Why it fails:** Casing rule — sentence case everywhere except proper nouns. Project names are proper nouns and stay capitalized; section headers like *"Other Modules We Maintain"* are not.

**Rephrased:** Project names stay (DQI, Campaign Kit, etc.). Section header becomes:

> ## Other modules we maintain.

### Violation 4.5 — Generic CTA (line 64–66)

> ## Want to collaborate on an open source project
>
> [Contact us today](/contact-us)

**Why it fails:** Generic. Also missing terminal punctuation on the heading. Doesn't route to a useful intent.

**Rephrased:**

> ## Found a bug or want to contribute?
>
> File an issue on the project page above, or [drop us a line](/contact-us?intent=oss).

## Page 5 — articles.md (list)

Overall **mostly auto-generated**. Three small fixes. Article *titles* are historical and out of scope; only the page-level copy and visible teasers count.

### Violation 5.1 — "Automated testing is the bomb." (line 39)

Visible teaser under the *Introducing Automated Testing Kit* article.

**Why it fails:** Eye-roll test. Casual slang in an editorial voice the brand brief calls *"pragmatic & sober."*

**Rephrased:**

> Why ATK exists, what it ships out of the box, and how to extend it for the tests your team actually needs.

### Violation 5.2 — Bare page heading (line 20)

> # Articles

**Why it fails:** Functional but flat. The articles list is a primary surface for testing-engineering credibility; it deserves a one-line subhead.

**Rephrased:**

> # Articles
>
> *Notes from the Drupal testing trenches — ATK release notes, framework comparisons, and conference talks.*

### Violation 5.3 — Title-case article titles (lines 31, 37, 45, 49, 53, 61)

Examples: *"Version 1.0 of Automated Testing Kit Is Ready!"*, *"Cypress on Drupal Cheat Sheet"*, *"BADCamp 2020-Components Can Break Your Site—Part 2"*, *"We all benefit from Open Source"*.

**Why it fails / scope note:** These are historical article titles. They live as field values on existing nodes, so changing them retitles the article (and may break inbound links unless redirects are added). **Recommendation:** flag them but don't include in the repositioning sweep — handle as a separate "legacy article cleanup" pass with redirects planned.

## Page 6 — article-atk-v10.md (article detail)

Overall **out of repositioning scope by my reading** — it's a 2023 article authored under personal voice ("I"), and rewriting it would change the historical record. Including the violations here so you can decide whether to scope them in.

### Violation 6.1 — Exclamation point in title (line 26)

> # Version 1.0 of Automated Testing Kit Is Ready!

**Rephrased:**

> # Automated Testing Kit reaches version 1.0.

### Violation 6.2 — First-person singular "I" (lines 32, 184)

> In this blog post, I discuss the philosophy of Automated Testing Kit (line 32)

> I chose Ethereal.email because: (line 184)

**Why it fails:** Brand brief §3 — *"First-person plural ('we') for the company, but André is the only publicly named individual."* Article-as-personal-voice is normal in tech writing and may be the right call here. Decision needed.

**Rephrased — if scoped in:** swap to "we" or to bylined-third-person. *"In this post, the philosophy behind ATK and the design choices behind version 1.0."*

### Violation 6.3 — "Cypress and Playwright" wrong order (lines 38, 48, 196)

Examples:

> The tests and common functions are named and work the same way for both Cypress and Playwright. (line 38)

> Below are the tests included for both Cypress and Playwright. (line 48)

**Why it fails:** Brand brief §5 — Playwright before Cypress.

**Rephrased:** swap order in each sentence.

> The tests and common functions are named and work the same way for both Playwright and Cypress.

### Violation 6.4 — "Automated testing is the bomb" tone elsewhere

Article uses informal phrasing throughout ("the bomb", parenthetical asides). Eye-roll-test failures.

### Violation 6.5 — Phone number CTA (line 248)

> Are you interested in setting up testing for your team? Call us today at 415.754.3294 or [drop us a note](https://performantlabs.com/contact-us).

**Why it fails:** The site's modern CTA pattern is intent-routed (`?intent=testing-review`). Embedded phone numbers in article bodies are an old marketing pattern.

**Rephrased:**

> Want to set up automated testing for your team? [Book a testing review](/contact-us?intent=testing-review).

## Page 7 — contact.md

Form-only page. The form labels (Name, Email, Company name, Phone number, Message, Submit) are functional Drupal-form copy. No marketing-copy surface to assess except the universal footer issues.

### Violation 7.1 — Footer Services sub-list

Same as cross-cutting fix above.

### Violation 7.2 — Captcha message tone (line 39)

> This question is for testing whether or not you are a human visitor and to prevent automated spam submissions.

**Why it fails:** Wordy and corporate. The brand brief asks for ruthless brevity.

**Rephrased:**

> Verifies you're not a bot. We don't store the answer.

## Page 8 — about-us.md

Overall **closest to brief**. No content violations identified beyond the universal footer issue.

### Strengths worth preserving (so the rewrite of other pages can borrow voice):

- Hero (line 25): *"Drupal testing, done by the people who wrote the tools."* — concrete, no hype, passes eye-roll test.
- Authority paragraph (lines 33–39): names specific drupal.org projects, dates, and member tenure. Specifics over adjectives.
- ATK / Testor descriptions (lines 45–59): the canonical product copy. Re-use these on `homepage.md` FAQ and `open-source-projects.md`. CTRFHub will need its own canonical description added to about-us once the product ships; until then, the open-source-projects card from §4.1 is the canonical mention.
- Dogfooding paragraph (lines 67–69): *"Every heal is a verifiable fact, not a case study."* — the brand brief tone in one sentence.

## Recommended priorities

**Pass 1 — universal footer. ✓ Applied 2026-04-26** (commits `c2b407f` Twig tagline + 4 menu_link_content saves; `1e38740` metatag front+global stale-copy fix + OG image asset move; `c61df42` pl_tunnel persisted in core.extension). Snapshots: `pre-footer-pass-2`, `pre-metatag-fix`. T1: 17/17 PASS on footer text + 24/24 PASS on metatag HEAD checks. T3 desktop+mobile captures clean: `.claude-bridge/t3-footer-pass2-and-metatag-2026-04-26/`. Tagline replaced (`Be the answer. Everywhere.` → `Drupal testing, done by the people who wrote the tools.`); footer Services sub-list now points at the four engagement names; HEAD `<title>` and `og:*`/`twitter:*` metatags swapped to brand-aligned copy on front + global; OG image asset moved from old to active theme dir.

**Pass 2 — homepage. ✓ Applied 2026-04-26** (commit `57a1ee6`, overlay `content-exports/homepage-rewrite-pass-1.overlay.yml`, snapshot pair `pre-homepage-rewrite-pass-1`). All six findings (Violations 1.1–1.6) shipped: three vocabulary patches plus three section rewrites for the legacy build-shop sections (Engineering column removed; engineering-engagement and migration FAQs reframed). T1: 21/21 PASS. T3 captures: `.claude-bridge/t3-homepage-pass1-2026-04-26/`. Footer items remain open — see Pass 1.

**Pass 3 — open-source-projects. ✓ Applied 2026-04-26** (commits `99d7eb5` cards + intro/CTA rewrite, `6788576` placeholder logos sub-pass; overlays `content-exports/open-source-projects-rewrite-pass-1.overlay.yml` + `…-pass-2.overlay.yml`; snapshot pair `pre-open-source-projects-pass-1` + `pre-osp-logos-pass`). Both findings (Violations 4.1 + 4.2) shipped: three new cards (ATK / Testor / CTRFHub) inserted ahead of DQI with the canonical product descriptions; intro paragraph and closing CTA rewritten; surgical patches landed (Andre → André in DQI body, "Other Modules" → sentence case). All three new cards now carry a shared placeholder Media (mid=61, "Performant Labs Placeholder Logo", sourced from `theme/logo.png`) so the visual rhythm matches the existing DQI / CK / LBK cards — real per-product logos are still pending and the swap is one-line per card (replace `target_id: 61` with the new mid). T1: 3/3 card titles present; 33 srcset URL hits across the three new cards (matches existing-card density of 11 each); AVIF derivatives generate cleanly from the rasterized PNG source. T3 captures: `.claude-bridge/t3-osp-pass1-2026-04-26/` (cards landed) + `.claude-bridge/t3-osp-logos-2026-04-26/` (placeholder logos).

**Pass 4 — how-we-do-it total rewrite** (all of section 3). Largest single content task; needs alignment with `phase-2-page-plan.md` before drafting.

**Pass 5 — services + articles small fixes** (Violations 2.1, 2.2, 5.1, 5.2). Cleanup once larger work is done.

**Pass 6 — decide scope on article-atk-v10 and historical article titles** (Violations 6.1–6.5, 5.3). Out-of-scope by default; scope in only if you want a "legacy article rebrand" sweep with redirects.

**Pass 7 (deferred — triggers on CTRFHub launch).** When CTRFHub has a downloadable artifact, alpha release, or first-blog-post-on-this-site, the homepage Tools card (`Actual1/homepage.md` line 44) and the hero subhead (line 26) need to be extended to name CTRFHub. Until then, CTRFHub mentions are scoped to the open-source-projects page card and to the blog post series.

## Verification when each pass lands

Per the conventions in `Briefs/pl_copy_brief.md` review checklist, after each pass:

- Re-extract the affected page(s) into a new `Actual2/` snapshot.
- Diff `Actual2/<slug>.md` vs. `Actual1/<slug>.md` and confirm every change matches a finding above.
- Grep the page text for the §5 vocabulary lock breaks (`QA engineer`, `Cypress and Playwright`, `Andre[^a-zé]`, `offshore`, `tester[^s]`, `our AI`).
- Confirm nothing from §6 ("What NOT to Say") slipped in.
