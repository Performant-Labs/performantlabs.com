# Article — CTRFHub: building a CTRF-native test reporting platform in the open

*✓ All sections approved 2026-04-26.* New article on `/articles`. Slug: `building-ctrfhub-in-the-open`. Content type: `article`. The first PL2 article authored under the new brand voice rather than legacy. Sets the tone for future blog posts and unlocks Pass 7 (homepage CTRFHub promotion).

*Voice anchor: brand brief §3 — Pragmatic & Sober / Peer-to-Peer / Specifics over Adjectives / Eye-Roll Test / "we" for company / André as the only named individual. No origin myths. No exclamation points.*

*Brand guardrail: §6 — **no competitor comparisons**. CTRFHub is described on its own terms — what it ingests (CTRF), how it's built, what it does. Internal `product.md` uses "ReportPortal-level features" framing; that phrasing is internal-only and is not in this draft.*

*Per-section approval: each `**Status:**` line stays **Draft** until you mark it **Approved YYYY-MM-DD** (or **Parked**). Reply pattern: **approved** / **revise: …** / **park: …** per section. A page is shippable when every section is Approved or Parked.*

---

## Section A — Title + slug + meta

**Status:** Approved 2026-04-26

- **Title:** *CTRFHub: building a CTRF-native test reporting platform in the open*
- **URL alias:** `/articles/building-ctrfhub-in-the-open`
- **Author byline:** André Angelantoni (consistent with site convention; only named individual per brand brief)
- **Publish date:** 2026-04-26
- **Body summary (visible teaser on /articles list):** *Why we're building a test reporting tool that assumes CTRF as its primary input, what's in the box today, and how to follow along on GitHub.*

**Why this title:** Names the product, names the differentiating commitment ("CTRF-native"), and signals the article's posture ("in the open" = honest pre-launch progress note, not a marketing announcement). Sentence case, no exclamation, no superlatives.

---

## Section B — Lead

**Status:** Approved 2026-04-26

> CTRFHub is a self-hosted test reporting platform we've been building since early 2026. It's CTRF-native by design — meaning it assumes the [Common Test Report Format](https://ctrf.io/) as its primary input rather than as one of many ingestion adapters — and it ships AI-driven failure categorization in the core product, not as a separate add-on. It's MIT-licensed for the Community Edition and open source on [GitHub](https://github.com/Performant-Labs/ctrfhub).
>
> CTRFHub is in active development. The first downloadable release isn't out yet. This post is a structured progress note — what the product is, why we're building it, what's shipped, and what's still in flight — written for the audience of testing engineers and engineering managers who would actually use it.

**Why:** Brand brief §3 — specifics over adjectives. The lead names the license, the architecture commitment, the AI placement, and the public state in concrete terms. "Self-hosted test reporting platform" is plain English; "CTRF-native by design" is the key differentiator with a concrete definition attached. Eye-roll test: passes. The "in active development; first release isn't out yet" line is intentional — sets reader expectation honestly rather than implying availability.

---

## Section C — Why we're building this

**Status:** Approved 2026-04-26

> Test reports are a strange category of software. The format question — *what shape is a test result?* — was solved years ago by [CTRF](https://ctrf.io/), which is now the convergent standard across Playwright, Cypress, Vitest, Jest, and most of the modern JavaScript test runner ecosystem. But the *reporting* layer above CTRF — the dashboards, the trend lines, the flake detection, the failure analysis — has lagged. The available options either ignore CTRF in favor of their own proprietary format, treat it as a second-class adapter alongside a dozen others, or were architected before CTRF existed and now have to retrofit it.
>
> We wanted a reporting tool that takes the standard seriously. CTRFHub is built around CTRF as the primary contract — the ingest endpoint accepts CTRF JSON, the database schema mirrors CTRF's data model, the validation is a Zod schema derived from the CTRF spec. There's no second-class adapter layer because there's no second-class input.
>
> The other commitments are a consequence of that one. CTRFHub is self-hosted because the same teams that care enough about test infrastructure to standardize on CTRF tend to also care that their test data doesn't leave their network. It's Java-free because the CI/dev environments that run these test suites already have Node.js — there's no reason to make people install another runtime to look at their test results. It's Docker-Compose-deployable because that's the lowest-friction way to stand up a self-hosted service on the kind of small infrastructure most teams are comfortable maintaining.

**Why:** This is the section the brand brief specifically guards. §6: *"No competitor comparisons for CTRFHub. Never describe CTRFHub as 'like Report Portal' or by reference to any other named test-reporting product. Describe it on its own terms — what it ingests (CTRF), how it's built (CTRF-native, modern architecture), and what it does (analytics, AI features)."* The draft above describes the gap-in-the-market without naming any product that exists in the gap. It names CTRF (a standard, not a product) and describes what "taking the standard seriously" means concretely.

---

## Section D — What's in the Community Edition

**Status:** Approved 2026-04-26

> CTRFHub ships in two editions. The Community Edition is MIT-licensed, self-hosted, and is the focus of the current release work. Its scope:
>
> - **CTRF report ingestion.** A `POST /api/v1/projects/:slug/runs` endpoint accepts CTRF JSON via API token and stores it persistently. Reports also upload through the web UI for one-off cases. Per-project tokens isolate data between teams using the same CTRFHub instance.
> - **Run history and trends.** Every report becomes a queryable run with chart-rendered pass/fail/flaky trends over time. Historical data sticks around in Postgres (or SQLite for single-node deployments) — there's no roll-up loss after a retention window.
> - **AI failure categorization.** Failed test runs go through a Claude-agent pipeline that groups failures by root cause, surfaces patterns across runs, and writes a one-line summary that's readable without opening the stack trace. The Community Edition uses your own API key; the Business Edition manages the key for you.
> - **Project + auth basics.** Email/password login through [Better Auth](https://www.better-auth.com/), per-project API tokens, admin and viewer roles. SSO/SAML/OIDC and custom roles are Business-Edition territory; the Community Edition stays narrow on purpose.
>
> The Business Edition adds SSO, custom roles, managed AI, priority support, and a hosted CTRFHub Cloud option for teams that want the product without operating it. We'll write that up when it's closer.

**Why:** Concrete feature list per brand brief §3 (specifics over adjectives) and §4 pillar 1 (Tools — *we maintain ATK, Testor, and we're building CTRFHub*). The four bullets are real product features from `docs/planning/product.md`, restated in plain language without engineering jargon. Naming Better Auth is a peer-to-peer move — the audience knows what it is, and including it makes the post feel like an engineer wrote it. The deliberate scope-narrowing line ("the Community Edition stays narrow on purpose") is brand-aligned restraint; the brief calls for not inflating the offer.

---

## Section E — What's underneath (the stack)

**Status:** Approved 2026-04-26

> For readers who want the engineer-to-engineer summary: CTRFHub is a Node.js 22 LTS server using [Fastify](https://fastify.dev/) for HTTP, [TypeScript](https://www.typescriptlang.org/) (strict mode) end-to-end, [Zod](https://zod.dev/) for runtime validation, and [MikroORM v7](https://mikro-orm.io/) over Postgres in production or SQLite for single-node deployments. The frontend is server-rendered HTML — [HTMX 2.x](https://htmx.org/) for interactivity, [Alpine.js 3](https://alpinejs.dev/) for client-side state where it earns its keep, [Eta](https://eta.js.org/) for templates, [Tailwind 4](https://tailwindcss.com/) and [Flowbite](https://flowbite.com/) for the design system, [Chart.js](https://www.chartjs.org/) for the trend visualizations. Auth is [Better Auth](https://www.better-auth.com/). Deployment is [Docker Compose](https://docs.docker.com/compose/) — one file, one command, runs on a $5/month VPS.
>
> Two things about that stack are deliberate enough to call out. First, no React. The dashboard is HTML rendered by the server, swapped via HTMX, sprinkled with Alpine where coordination genuinely needs it — and that's it. The choice keeps the bundle small, the deploy simple, and the surface area small enough that a single engineer can reason about the whole thing. Second, the database layer commits to dual-dialect from day one: every entity, every migration, every query has to work on both Postgres and SQLite, with the dialect selected at runtime. That gives the same codebase a deploy story for the team running on Kubernetes and the solo developer running on a laptop.

**Why:** Brand brief §3 — peer-to-peer voice, written like an engineer introducing another engineer. The stack list is concrete (every name is linked, each does one thing). The two "deliberate enough to call out" choices are the architectural commitments André has already made on this product (per `docs/planning/architecture.md`); naming them publicly turns the post from a feature list into a position statement. Eye-roll test: passes — every claim is verifiable.

---

## Section F — AI in the core, not as a sticker

**Status:** Approved 2026-04-26

> The brand brief for our parent company, Performant Labs, separates AI as a delivery technology from AI as a marketing claim. CTRFHub's AI work is the former — a single, narrow capability built into the core product, not a separate add-on with its own price tag.
>
> The capability is failure categorization. When a CTRF run reports failed tests, a Claude agent reads the failure messages, the stack traces, and the test names, then groups failures by likely root cause and writes a one-line summary per group. So instead of seeing "47 tests failed" and clicking through 47 stack traces, the dashboard surface might say "12 timeouts on the auth page (probably the rate-limit middleware change in PR #418), 8 selector-not-found in the checkout flow (probably yesterday's CSS refactor), 27 database fixture errors (the seed script is failing in CI)." That's the sort of categorization a senior testing engineer does manually, weekly. The agent does it on every run.
>
> What the agent doesn't do: write tests for you, fix tests in pull requests, or take actions outside the dashboard. CTRFHub is a reporting tool. The autonomous-test-healing workflow is a separate Performant Labs offering — it lives in our [services](/services) page, not inside CTRFHub's box.

**Why:** Brand brief §3 (Pragmatic & Sober — "no 'revolutionary AI' claims") and §5 (AI Naming — "Claude agents" not "our AI"). The section names exactly what the AI does and exactly what it doesn't, with a concrete example of what "categorization" produces. The closing paragraph keeps CTRFHub's scope tight and routes readers wanting the autonomous-healing workflow back to /services — same routing pattern the homepage and how-we-do-it pages now use. Memory `project_pl2_ai_positioning`: AI is named where it does client-visible work; this section qualifies.

---

## Section G — Status and how to follow

**Status:** Approved 2026-04-26

> CTRFHub is pre-1.0 and not yet downloadable. We're working through the MVP backlog now — auth, project management, ingest, run history, trend rendering, failure categorization. Code lands on [github.com/Performant-Labs/ctrfhub](https://github.com/Performant-Labs/ctrfhub) as it's reviewed and merged; the repository is public if you want to look at how it's built before it ships.
>
> When the Community Edition is downloadable, we'll write a follow-up here with the install command and the first-run walkthrough. In the meantime, this blog is where progress posts will land — architecture decisions, feature ship notes, gap reviews. Subscribe through whatever feed your reader prefers; or just bookmark [/articles](/articles) and check back.
>
> If you've got a use case for CTRFHub that isn't covered above, or a CTRF reporter we should test against early, [drop us a line](/contact-us?intent=ctrfhub).

**Why:** Honest status report (pre-1.0, not yet downloadable, public repo). Routes readers to the right next action: GitHub if they want to read code, /articles if they want progress posts, /contact-us with a new `?intent=ctrfhub` query parameter for use-case input. The intent parameter establishes a routing slot for CTRFHub-specific contact (matches the existing `?intent=testing-review`, `?intent=oss`, etc. pattern).

---

## Implementation notes (non-draft)

- **Hero image:** Recommend a Phosphor-derived teal-tile icon at 300×225 (matching the engagement-icons pattern from how-we-do-it pass-2). Candidate: `presentation-chart-line.svg` or `chart-line-up.svg`. Same `scripts/build-engagement-icons.sh` pipeline, single new tile output.
- **Existing /articles card layout:** the article cards on /articles render `body.summary` as the visible teaser. Section A above defines that summary string.
- **field_summary** (the separate auxiliary text field on the article bundle) — left empty per pass-5 V5.1 precedent (the views.view.articles `view_mode: teaser` reads `body.summary`, not `field_summary`).
- **Drush vs Admin UI:** body content can be created either way now that the form display is in place (pass-5 V5.1 channel fix). For a 600–800-word post with formatted lists and links, drush php:script with HTML input is the lower-friction path; the resulting node is editable through the standard `/node/<id>/edit` form afterwards.
- **Path alias:** `/articles/building-ctrfhub-in-the-open` — explicit, slug created via the node's `path` field.
- **Snapshot:** `pre-ctrfhub-article` before the create-node script runs.
