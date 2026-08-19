# Stateful UI Surfaces — Persistent Inventory

**Purpose:** the authoritative list of UI surfaces that hold user state, used by T's
Tier 2.5 interaction suite (`scripts/state-invariants.spec.js` + `scripts/state-invariants.config.json`).
The bug class this guards against: user establishes state (sets a filter, opens a panel,
reaches page 2), navigates to a detail page, returns — and the state is gone.

**Maintenance contract (O):** whenever a phase ships a new stateful surface, add a row here
and a matching entry in `scripts/state-invariants.config.json`. T runs the suite for touched
surfaces per cycle and the full suite at sprint wrap.

**Persistence rule of thumb:** state carried in the URL (query params, pager) or storage
MUST survive navigate-away-and-return. Ephemeral open/closed UI state (menus, search box)
is expected to reset — those rows are marked `ephemeral` and are NOT failures when reset.

## Theme-level surfaces (from component JS)

| Surface | Component | State | Persistence expectation |
|---|---|---|---|
| Mobile nav toggle | `neonbyte/components/header/primary-menu` (`primary-menu.js`) | open/closed, `aria-expanded` | ephemeral — resets on navigation |
| Header search | `neonbyte/components/header/header-search` (`header-search.js`) | open/closed, input text | ephemeral open state; query persists only via URL after submit |
| Language switcher | `neonbyte/components/header/language-switcher` | open/closed dropdown; active language | dropdown ephemeral; **active language MUST persist** (path prefix) |
| Side menu | `dripyard_base/components/side-menu` (`side-menu.js`) | open/closed | ephemeral |
| Commerce cart | `dripyard_base/components/header-commerce-cart` | item count badge | **MUST persist** (session-backed) |
| Accordion | `dripyard_base/components/accordion` | open panel(s) | ephemeral unless URL-fragment-linked; fragment-targeted panel MUST re-open |
| Carousel | `dripyard_base/components/carousel` (Swiper) | active slide | ephemeral |

## Site-level surfaces (Drupal)

| Surface | Where | State | Persistence expectation |
|---|---|---|---|
| Views exposed filters | article/book listings (see `pl-plan--articles.md`, `pl-plan--book-pages.md`) | selected filter values | **MUST persist** — carried as GET params; browser back must restore the filtered result |
| Pager | any listing view | current page | **MUST persist** — `?page=N` in URL; back from a detail page must land on page N |
| Search results | site search page | query + page | **MUST persist** via URL |

## How T uses this

1. Per cycle: identify which inventoried surfaces the phase touches (F's "Files changed" list
   cross-referenced against the component column above). Enable/confirm their entries in
   `scripts/state-invariants.config.json` and run `npx playwright test scripts/state-invariants.spec.js`.
2. Sprint wrap: run the full suite as a regression pass.
3. Only **MUST persist** rows are blocking when state is lost. Ephemeral rows assert the
   opposite direction only if a phase explicitly makes them persistent.

> Entries in the config ship `"enabled": false` until their page URL and selectors are
> confirmed against the running site (ddev was offline when this inventory was created,
> 2026-06-12). T enables each entry the first time it verifies the selectors live.
