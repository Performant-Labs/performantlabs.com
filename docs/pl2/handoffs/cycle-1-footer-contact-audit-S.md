# Handoff-S: Sprint 8 Cycle 1 — Footer + contact audit (audit-only)

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-8-cycle-1-audit`
**Pipeline:** O → S → O (no F, no T, no commit)
**Mode:** autonomous
**Issue:** `docs/pl2/handoffs/cycle-1-footer-contact-audit-issue.md`
**Runbook:** `docs/pl2/pl-plan--sprint-8-footer-and-contact.md`
**Tech-debt items:** §D F.8, F.9, ADV-C1, ADV-CU1
**Operator-facing report:** [`cycle-1-footer-contact-audit-report.html`](cycle-1-footer-contact-audit-report.html)

## T precondition
N/A — audit-only cycle.

## Verdict

**PASS** with **strong recommendation**: all four targeted tech-debt items appear to be effectively closed by prior-sprint work. Cycle 2 carve recommendation is **single small cleanup cycle** rather than a routing/content fix cycle. See "Cycle 2 carve" below.

## Binding probes

### HTTP status of every routable destination

Probed via `ddev exec curl` (host-shell `curl` skipped per FU-4 SSL chain note). Cache cleared (`ddev drush cr`) immediately prior.

| Path | First-hop status | Final after `-L` | Redirect target |
|---|---|---|---|
| `/` | 200 | 200 | — |
| `/services` | 200 | 200 | — |
| `/about-us` | 200 | 200 | — |
| `/articles` | 200 | 200 | — |
| `/contact-us` | 200 | 200 | — |
| `/how-we-do-it` | 200 | 200 | — |
| `/open-source-projects` | 200 | 200 | — |
| `/privacy-policy` | 200 | 200 | — |
| `/docs` | 200 | 200 | — |
| `/form/contact` | **301** | 200 | `/contact-us` (Drupal redirect entity ID 90) |
| `/contact` | **301** | 200 | `/contact-us` (Drupal redirect entity ID 89) |
| `/form/contact-us` (control) | 404 | 404 | — |

**Key finding for ADV-C1.** `/form/contact` does **not** return 404. The Drupal `redirect` module (v8.x-1.12, enabled) holds two relevant entities:

```
contact         → internal:/contact-us  (301)
form/contact    → internal:/contact-us  (301)
```

The runbook's stated premise ("`/form/contact` returns 404") is stale — likely true at an earlier sprint and resolved by the redirect-entity additions that landed during Sprint 5 cycle 4 / Sprint 7 work.

### Site-wide rendered link inventory

Source: `curl -sL` of each shipped page; parser at `screenshots/sprint-8-cycle-1/parse.py`. Header/footer link sets are **identical across all seven pages** (single global chrome).

#### Header (every shipped page)

| Selector | Label | href | HTTP |
|---|---|---|---|
| `header a` (logo) | (empty alt; logo) | `/` | 200 |
| `header nav a` | Services | `/services` | 200 |
| `header nav a` | How we do it | `/how-we-do-it` | 200 |
| `header nav a` | Articles | `/articles` | 200 |
| `header nav a` | Open source projects | `/open-source-projects` | 200 |
| `header nav a` | About us | `/about-us` | 200 |
| `header nav a` | Contact us | `/contact-us` | 200 |

No "Call today" CTA in the rendered header on any page — confirms canonical header has no right-side CTA pill (per memory `design_header_nav_breakpoint.md`).

#### Footer (every shipped page)

| Column | Label | href | HTTP | Anchor target exists? |
|---|---|---|---|---|
| Services (heading) | Services | `/services` | 200 | n/a |
| Services | Testing-suite takeover | `/services#test-suite-takeover` | 200 | **YES** (`id="test-suite-takeover"` present on `/services`) |
| Services | Embedded testing engineer | `/services#embedded-testing-engineer` | 200 | **YES** |
| Services | Autonomous healing pilot | `/services#autonomous-healing-pilot` | 200 | **YES** |
| Services | Accessibility testing | `/services#accessibility-testing` | 200 | **YES** |
| Resources (heading) | Resources | `/articles` | 200 | n/a |
| Resources | Articles | `/articles` | 200 | n/a |
| Resources | Documentation | `/docs` | 200 | n/a |
| Company (heading) | (`<nolink>`) | — | n/a | n/a |
| Company | About us | `/about-us` | 200 | n/a |
| Company | Contact us | `/contact-us` | 200 | n/a |
| Company | Privacy policy | `/privacy-policy` | 200 | n/a |
| Footer signature CTA | Get in touch → | `/contact-us` | 200 | n/a |
| Footer legal | Privacy Policy | `/privacy-policy` | 200 | n/a |

**Total CTAs/links audited:** 7 header × 7 pages = 49 + 13 footer × 7 pages = 91 + signature CTA × 7 = `91 + 49 + 7 = 147` rendered link instances, **0 returning 404**, **0 hitting a 301-hop**, **0 with a broken `#fragment` target**.

### `/services` card ID inventory (F.8 binding)

`grep -oE 'id="[^"]+"' services.html | sort -u` returns the four engagement-card anchor IDs as:

```
id="test-suite-takeover"
id="embedded-testing-engineer"
id="autonomous-healing-pilot"
id="accessibility-testing"
```

Live DOM uses `test-suite-takeover` (no `-ing-`). Footer menu link (`menu_link_content` row id=35) also uses `#test-suite-takeover`. **Link and target agree** — F.8 mismatch is resolved.

The legacy "canonical" anchor name `#testing-suite-takeover` appears only in:
- `web/themes/custom/performant_labs_20260418/components/card-canvas/card-canvas.component.yml` (comment in dead-code theme; active theme is `_20260502`).

### `/contact-us` H1 + heading hierarchy (ADV-CU1 binding)

Body H1 count: **1**. Header H1 count: **0**.

Heading hierarchy (linear order in DOM):

```
H2 [in header]   Main navigation       (a11y landmark heading; non-content)
H2 [body]        Breadcrumb            (a11y landmark heading)
H1 [body]        Let's talk about your quality and testing goals.
H2 [body]        Prefer a quick call?
H2 [body]        What to expect from the other side of this form.
H3 [body]          A real reply, by a real engineer.
H3 [body]          Thirty minutes, screen-share if helpful.
H3 [body]          A short proposal, not a slide deck.
H2 [body]        Skip the form — book the review.
H2 [in footer]   Footer
H3 [in footer]     Services
H3 [in footer]     Resources
H3 [in footer]     Company
```

No skipped heading levels. H1 present and matches page intent. **ADV-CU1 is resolved.**

### H1 count across every shipped page

| Page | Body H1 count | Header H1 count |
|---|---|---|
| `/` | 1 | 0 |
| `/services` | 1 | 0 |
| `/about-us` | 1 | 0 |
| `/articles` | 1 | 0 |
| `/contact-us` | 1 | 0 |
| `/how-we-do-it` | 1 | 0 |
| `/open-source-projects` | 1 | 0 |

WCAG 2.2 SC 2.4.6 — Headings and Labels: **PASS site-wide**.

## Source-of-truth trace (where each link actually comes from)

| Surface | Source layer | Current value | Notes |
|---|---|---|---|
| Header nav | `system.menu.main` menu items | All routed paths (e.g., `/services`, `/contact-us`) | No legacy `/contact` |
| Header CTA "Call today" | (removed) | — | Active theme `_20260502` has no header CTA; only orphaned `_20260418` page--*.twig still references `<a href="/contact">Call today</a>` but that theme is not the active default |
| Footer column links | `system.menu.footer` menu_link_content rows 34–45 | Direct `/contact-us`; direct `#test-suite-takeover` etc. | No legacy values |
| Footer "Get in touch →" CTA | Custom block content (`block_content` id=1, "Footer – Signature") body field | `<a class="footer-signature__cta" href="/contact-us">Get in touch →</a>` | Direct, no 301-hop |

## Active vs orphaned theme

- **Active default theme:** `performant_labs_20260502` (per `drush cget system.theme default`).
- **Orphaned theme directories still in repo:** `performant_labs_20260411`, `performant_labs_20260418`. These contain `page--front.html.twig` files that still reference `<a href="/contact" class="header-cta">Call today</a>` and `<a href="/contact" class="footer-cta__link">Get in touch →</a>`. Because the active theme does not inherit from them (base theme is `neonbyte`), these strings **never reach the rendered HTML**. They are dead code.

## Tech-debt outcome per item

| ID | Original concern | Live state | Verdict |
|---|---|---|---|
| F.8 | Footer Services link uses `#testing-suite-takeover`; card ID is `#test-suite-takeover` | Footer menu and card both use `test-suite-takeover` | **Already closed** by prior sprint; no F work needed |
| F.9 | Footer "Contact us" uses bare `/contact` (301 → `/contact-us`) | Footer menu link 44 and signature CTA both use `/contact-us` directly; bare `/contact` not in any rendered page | **Already closed**; no F work needed |
| ADV-C1 | `/form/contact` returns 404; affects global nav + header CTA + footer "Get in touch" | `/form/contact` returns 301 → `/contact-us`; no rendered link points to `/form/contact` anywhere | **Already closed** (no 404 anywhere); recommended path **(b)** + housekeeping (see below) |
| ADV-CU1 | `/contact-us` has no H1 | Exactly one body H1: "Let's talk about your quality and testing goals.", clean heading order | **Already closed**; no F work needed |

## ADV-C1 remediation recommendation

**Recommended path: (b) — update links to point to `/contact-us`.**

Rationale:
- Already implemented site-wide: zero rendered references to `/form/contact` remain.
- The existing Drupal redirect entity (`form/contact → /contact-us`, 301) is an additional safety net for any external bookmark or stale outbound link — **keep the redirect**.
- Path (c) (create a Drupal route at `/form/contact`) would double-canonicalize and contradicts the existing redirect.
- Path (a) (add a webserver-level redirect) is already covered by the Drupal redirect entity.

**Action item (Cycle 2, low priority):** clean up the two orphaned theme directories (`performant_labs_20260411`, `performant_labs_20260418`) that still embed `<a href="/contact">`, OR fix those strings in place — even though they're dead code today, anyone reactivating that theme in the future would resurrect the 301-hop. Recommend **delete the orphaned themes**; if deletion is risky, **fix the strings in place** to `/contact-us`.

## F.8 fix-direction recommendation

**No fix needed.** Link and card ID already agree on `test-suite-takeover`. The runbook's PC-3 default ("rename footer link to match live card ID") is moot.

The content brief (`docs/pl2/Existing Pages/Design1/services.md`, `docs/pl2/briefs/services--engagement-cards.md`) and preview (`docs/pl2/Previews/services.html`) were not re-derived for this audit — they're advisory at this point because the live system is internally consistent and matches WCAG. If a future content-brief sync surfaces the canonical anchor name as `testing-suite-takeover` (with the `-ing-`), that's a content/brief rename and a separate sprint item — not a Sprint 8 concern.

## Cycle 2 carve recommendation

**Option A (recommended): single small cleanup cycle (`Cycle 2`).** Pipeline O → F → T → S.

Scope (≤3 files; ≤30 lines changed):
1. Delete orphaned theme directories `web/themes/custom/performant_labs_20260411` and `web/themes/custom/performant_labs_20260418`, OR (safer) fix the four `<a href="/contact">` strings in their `page--*.html.twig` files to `/contact-us`.
2. Update the comment in `web/themes/custom/performant_labs_20260418/components/card-canvas/card-canvas.component.yml` to reference the current anchor name (or delete with the theme).
3. Close out the four tech-debt items in `docs/pl2/tech-debt-register.md` §D with this audit as the closing reference.

If the orchestrator wants to be conservative, **Option B**: skip Cycle 2 entirely — declare F.8/F.9/ADV-C1/ADV-CU1 closed in the wrap doc and tech-debt register, on the strength of this audit. The orphaned themes are dead code with no rendered side-effect.

**Do NOT split into 2a/2b** — there's no Drupal config-import work and no routing change needed.

## Acceptance criteria

- [x] Site-wide CTA + footer-link inventory table — present above
- [x] Every 404 enumerated — **zero 404s** on any rendered href
- [x] `/contact-us` H1 count + heading hierarchy probed and reported — 1 H1, no skipped levels
- [x] ADV-C1 remediation path recommended with rationale — path (b), already implemented
- [x] F.8 fix direction recommended with rationale — no fix needed; live state consistent
- [x] Cycle 2 carve — single small cleanup cycle (Option A) or skip entirely (Option B)

## Files

- Probe outputs: `docs/pl2/handoffs/screenshots/sprint-8-cycle-1/`
  - `http-probes-pages.txt`
  - `http-probes-all-hrefs.txt`
  - `pages/*.html` — rendered page sources used for parsing
  - `parse.py` — heading + link extractor
  - `page-inventory.txt` — full parsed output

## Advisory notes

- The Drupal `redirect` table holds **legacy aliases** that are useful to preserve (book content URLs like `automated-testing-kit/*` → `/node/N`, `cypress-on-drupal` → `/node/6`, etc.). Do not bulk-clean the redirect table during Cycle 2.
- `/node/1` 301s to `/privacy-policy`. Not in scope here but consistent with the redirect-driven canonicalization pattern.
- The footer "Resources" column has its heading link pointing at `/articles`, and the first child item also "Articles" → `/articles`. Not a bug per se (heading and primary child are intentionally redundant), but worth flagging to the operator as a small content-architecture question for a future content sprint.
