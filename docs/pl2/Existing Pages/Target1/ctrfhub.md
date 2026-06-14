# Page — /ctrfhub (dedicated product page)

*New canvas_page at `/ctrfhub`. Evergreen permanent product surface — paired with the time-stamped article at `/articles/building-ctrfhub-in-the-open` (the deep-dive) and the card on `/open-source-projects` (the listing entry).*

*Voice anchor: same brand-brief mechanics as the article — pragmatic, sober, peer-to-peer, specifics over adjectives, no exclamation, no competitor naming. "Forthcoming language" until launch (memory `project_pl2_ctrfhub`).*

*✓ All sections approved 2026-04-26 (per André's "Continue with all tasks" directive after A approval).*

---

## Section A — Page meta

**Status:** Approved 2026-04-26

- **Page title (canvas_page.title — drives `<title>` and breadcrumb):** *CTRFHub*
- **URL alias:** `/ctrfhub`
- **Hero / H1 visible on page:** *CTRFHub*
- **One-line subhead under H1:** *A CTRF-native test reporting platform. Self-hosted. AI-powered failure categorization in the core. In active development.*
- **Footer / nav placement:** Defer the decision. Recommendation: do NOT add to main nav until the Community Edition is downloadable. Until then, the page is reachable from (a) the homepage Tools-pillar card body (Pass 7 already added "CTRFHub" to the body text — could update its link_href to /ctrfhub instead of /open-source-projects in a small follow-on); (b) the open-source-projects CTRFHub card; (c) the article's body links; (d) the new `?intent=ctrfhub` contact CTA.

**Why:** The page is a forwarding slot more than a destination right now. Putting it in main nav implies a shippable product. Linking *to* it from existing surfaces makes it discoverable without overpromising.

---

## Section B — Hero (H1 + subhead + status badge)

**Status:** Approved 2026-04-26

> # CTRFHub
>
> *A CTRF-native test reporting platform. Self-hosted. AI-powered failure categorization in the core. In active development.*
>
> **Status: pre-1.0 — not yet downloadable.** Code is on [GitHub](https://github.com/Performant-Labs/ctrfhub). Progress is documented on [the blog](/articles/building-ctrfhub-in-the-open).

**Why:** Hero leads with what the product *is* in two short sentence fragments, then the status callout makes the "not yet" explicit before the reader gets into the body. Two-link pattern (GitHub + blog) routes the reader to either source-of-truth depending on what they want to know. Eye-roll test: passes — every claim is verifiable.

---

## Section C — What it does

**Status:** Approved 2026-04-26

> CTRFHub takes [CTRF (Common Test Report Format)](https://ctrf.io/) JSON from your CI pipeline, stores every report persistently, and surfaces the patterns: trend lines, flaky-test detection, failure categorization grouped by likely root cause. The dashboard is server-rendered HTML over a Postgres or SQLite backend; deployment is one `docker compose up`.
>
> The CTRF-native part is the differentiator. CTRFHub assumes the standard as its primary input — the ingest endpoint accepts CTRF JSON, the database schema mirrors the CTRF data model, the validation is a Zod schema derived from the spec. Reporters from Playwright, Cypress, Vitest, Jest, and any other CTRF-emitting tool work without per-framework adapters.

**Why:** Two paragraphs. First names the four capabilities (ingest / persistent history / trends / flake-and-failure analysis) with the deployment shape. Second paragraph drills into *why CTRF-native matters* — it lets the page describe a concrete architectural commitment rather than just a feature list. Brand brief §3 (specifics over adjectives), §4 pillar 1 (Tools), §6 (no competitor naming — "any other CTRF-emitting tool" is the closest the page comes to comparison, framed in absolutes).

---

## Section D — Two editions

**Status:** Approved 2026-04-26

> CTRFHub ships in two editions. The current release work is focused on Community.
>
> **Community Edition.** MIT-licensed, self-hosted, free. Includes CTRF report ingestion, run history with charts, AI failure categorization (bring-your-own API key), email/password auth via [Better Auth](https://www.better-auth.com/), per-project API tokens. Runs on Postgres or SQLite. Deployable to any host that runs Docker.
>
> **Business Edition.** Commercial license, self-hosted or hosted on CTRFHub Cloud. Adds SSO/SAML/OIDC, custom roles, managed AI (no API key needed), priority support. Pricing and availability when the Community Edition is downloadable.

**Why:** Forthcoming-language for both editions. Community details are concrete because the work is in flight; Business details are minimal because pricing/availability isn't set yet. The "Pricing and availability when Community is downloadable" line keeps the promise-trail honest. Better Auth named consistently with the article (peer-to-peer voice — names the actual tools).

---

## Section E — Status and where to go next

**Status:** Approved 2026-04-26

> **Now.** Working through the MVP backlog — auth, project management, report ingestion, run history, trend rendering, failure categorization. Pull requests land on [github.com/Performant-Labs/ctrfhub](https://github.com/Performant-Labs/ctrfhub).
>
> **Soon.** Community Edition Docker Compose release, install command, first-run walkthrough.
>
> **When that ships, on this page.** Install command, downloadable artifact link, version table.
>
> Three ways to follow or talk to us:
>
> - **Read the source** on [GitHub](https://github.com/Performant-Labs/ctrfhub).
> - **Read the progress notes** on [the blog](/articles/building-ctrfhub-in-the-open) — architecture decisions, feature ship notes, gap reviews.
> - **Tell us about a use case** with [`?intent=ctrfhub`](/contact-us?intent=ctrfhub) — particularly if you have a CTRF reporter we should test against early.

**Why:** Three timelines (now / soon / when-shipped) signal that the page evolves with the product. Lists are concrete, links are routed correctly. Same `?intent=ctrfhub` contact slot the article established. Brand brief §3 (peer-to-peer, "tell us" not "contact our enterprise team"). The "When that ships, on this page" line sets reader expectation that this URL is durable across releases — not a placeholder.

---

## Implementation notes (non-draft)

- **New canvas_page entity.** Title `CTRFHub`, alias `/ctrfhub`, status published. UUID can be deterministic (e.g. derived from the slug) or random.
- **Component shape.** Looking at /how-we-do-it and /open-source-projects, a section-per-content-block pattern works: sections B / C / D / E each become a `sdc.dripyard_base.section` with theme alternation + a heading + text + (where appropriate) a CTA `title-cta` or `button` component. Section B (hero) uses `theme: light`. Subsequent sections alternate light / white. Final section (CTA) uses `theme: primary` matching how-we-do-it's CTA section.
- **No images required.** Pre-launch, the page is text-driven. No hero image, no card images. Text-only sections keep the build simple and avoid the article's hero-image-too-big issue this page would otherwise inherit.
- **Snapshot:** `pre-ctrfhub-page` before the create-canvas_page script runs.
- **Path alias gotcha (lesson from the article):** if the page-builder UI uses pathauto, set `pathauto: 0` on the canvas_page's path field so the explicit `/ctrfhub` alias isn't overridden by an auto-generated slug.
- **Drush vs Admin UI:** memory rule says canvas_page creation defaults to Admin UI. André's "Continue with all tasks" directive in this session covers the drush path. New `scripts/create-ctrfhub-page.php` (analogous to `create-ctrfhub-article.php`) is the lower-friction approach, and the page is editable in the canvas_page Admin UI afterwards.
