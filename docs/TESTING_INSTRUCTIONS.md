# Testing Instructions

This project uses a **three-tier verification hierarchy**.
Run tests in order: Tier 1 first, escalate to Tier 2, then Tier 3.

---

## Prerequisites

```bash
ddev start                  # local site must be running
npx playwright install      # first time only — installs browsers
```

---

## Tier 1 — Kernel (unit-level, ~10 s)

PHPUnit `KernelTestBase`. No browser, no HTTP. Tests DB connections, schema,
module state, and Drupal API logic in isolation.

```bash
# All pl_work_log Kernel tests
ddev exec "SIMPLETEST_DB=sqlite://localhost//tmp/test.sqlite \
  SIMPLETEST_BASE_URL=https://performant-labs.ddev.site:8493 \
  vendor/bin/phpunit --bootstrap web/core/tests/bootstrap.php \
  web/modules/custom/pl_work_log/tests/src/Kernel/ --testdox"
```

**Covers:**
- `hermes_sqlite` DB connection is reachable
- `work_logs` schema has `project_id` and `category` columns
- Fixture rows have valid date / hours / title values
- `project_id` and `category` round-trip correctly
- Empty `project_id`/`category` stored as `''`, not `NULL`
- Core `sqlite` module is enabled

---

## Tier 2 — Functional (HTTP-level, ~3 min)

PHPUnit `BrowserTestBase`. Installs a fresh Drupal per test class, makes real
HTTP requests, asserts page structure and access control. No real browser.

```bash
# All pl_work_log Functional tests
ddev exec "SIMPLETEST_DB=sqlite://localhost//tmp/test.sqlite \
  SIMPLETEST_BASE_URL=https://performant-labs.ddev.site:8493 \
  vendor/bin/phpunit --bootstrap web/core/tests/bootstrap.php \
  web/modules/custom/pl_work_log/tests/src/Functional/ --testdox"
```

**Covers:**
- All 5 work-log routes return 403 for anonymous users
- Dashboard returns 200 and renders expected H2 sections
- Dashboard table has Date / Title / Hours columns
- Dashboard exposes Project / Category / Sort filters
- Actions page shows Migration Status and sub-links
- Ingest form has a "Run Ingestion" button
- Category Mapping and Rollback routes are reachable
- `work_log` node fields accept valid date and hours values

> **Tip:** Fire the test run and check back in 30 s intervals.
> Each test method takes ~10 s (fresh Drupal bootstrap).

---

## Tier 3 — ATK / Playwright (E2E, visual)

Playwright tests run against the **live DDEV site** with real data.
All spec files live in `tests/atk_<feature>/`.

### Run a single suite

```bash
BASE_URL=https://performant-labs.ddev.site:8493 \
  npx playwright test tests/atk_work_log/atk_work_log.spec.js --reporter=list
```

### Run by tag

```bash
BASE_URL=https://performant-labs.ddev.site:8493 \
  npx playwright test --grep @work-log

BASE_URL=https://performant-labs.ddev.site:8493 \
  npx playwright test --grep @smoke
```

### Run via the project test runner

The `test:local` script patches `playwright.atk.config.js` for the local DDEV
URL automatically:

```bash
npm run test:local
```

### All ATK suites

| Suite | Path | Tag |
|-------|------|-----|
| Work Log | `tests/atk_work_log/` | `@work-log` |
| Contact Us | `tests/atk_contact_us/` | `@contact-us` |
| Accessibility | `tests/atk_accessibility/` | `@accessibility` |
| Visual | `tests/atk_visual/` | `@visual` |
| Menu | `tests/atk_menu/` | `@menu` |
| Search | `tests/atk_search/` | `@search` |
| Sitemap | `tests/atk_sitemap/` | `@sitemap` |
| Media | `tests/atk_media/` | `@media` |
| Entity | `tests/atk_entity/` | `@entity` |
| Page Errors | `tests/atk_page_error/` | `@page-error` |
| Audit | `tests/atk_audit/` | `@audit` |

### Work Log ATK tests (`@work-log`)

| ID | What it checks |
|----|---------------|
| ATK-WL-1000 | Dashboard returns 200, H1 present |
| ATK-WL-1001 | Summary and Recent Work Logs sections visible |
| ATK-WL-1002 | Total Entries count is non-zero |
| ATK-WL-1003 | Table has Date / Title / Hours columns |
| ATK-WL-1004 | At least one data row in table |
| ATK-WL-1005 | Filter form has Project / Category / Sort By controls |
| ATK-WL-1006 | Anonymous users are redirected to login |
| ATK-WL-2000 | Actions page returns 200 |
| ATK-WL-2001 | Migration Status section shows "Idle" |
| ATK-WL-2002 | Ingest / Rollback / Category Mapping links present |
| ATK-WL-2003 | Ingest link navigates to `/work-logs/actions/ingest` |
| ATK-WL-2004 | Category Mapping link navigates correctly |
| ATK-WL-3000 | Sidebar nav has Dashboard / All Work Logs / Actions |
| ATK-WL-4000 | "Improve Hermes" and "ATK Release" titles in table |
| ATK-WL-4001 | Hours values are numeric and non-zero |

---

## Quick reference — all three tiers for `pl_work_log`

```bash
# Tier 1 (~10 s)
ddev exec "SIMPLETEST_DB=sqlite://localhost//tmp/test.sqlite \
  SIMPLETEST_BASE_URL=https://performant-labs.ddev.site:8493 \
  vendor/bin/phpunit --bootstrap web/core/tests/bootstrap.php \
  web/modules/custom/pl_work_log/tests/src/Kernel/WorkLogMigrationTest.php --testdox"

# Tier 2 (~3 min)
ddev exec "SIMPLETEST_DB=sqlite://localhost//tmp/test.sqlite \
  SIMPLETEST_BASE_URL=https://performant-labs.ddev.site:8493 \
  vendor/bin/phpunit --bootstrap web/core/tests/bootstrap.php \
  web/modules/custom/pl_work_log/tests/src/Functional/WorkLogPagesTest.php --testdox"

# Tier 3
BASE_URL=https://performant-labs.ddev.site:8493 \
  npx playwright test tests/atk_work_log/atk_work_log.spec.js --reporter=list
```

---

## Notes

- PHPUnit is installed via `drupal/core-dev` (a dev dependency).
- Deprecation warnings from Drupal's test bridge in PHPUnit output are expected.
- `SIMPLETEST_DB` is the scratch DB for Functional tests — Kernel tests use their own isolated SQLite.
- Playwright tests require the DDEV site to be running and migration data to be present.
