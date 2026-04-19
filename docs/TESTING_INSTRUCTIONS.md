# Performant Labs: Work Log Module Testing Instructions

This document outlines the three-tier testing strategy implemented for the Hermes-to-Drupal `pl_work_log` module. Follow this workflow to ensure environment stability and robust functional verification before deploying configuration or codebase changes.

> [!IMPORTANT]
> Always execute testing starting from Tier 1 up to Tier 3. Catching schema and data logic errors early at the Kernel level significantly speeds up debugging compared to debugging UI failures in Playwright.

---

## Prerequisites

Testing MUST be executed within the local DDEV environment to ensure PHP extensions, database access, and the local web server are correctly resolved.

Before beginning testing:
1. Ensure the DDEV stack is running: `ddev start`
2. Ensure the automated testing accounts module is active: `ddev drush pm:enable qa_accounts -y`
3. (For Playwright tests): Ensure local NPM dependencies are installed: `npm install` inside the project root.

---

## Tier 1: Kernel Tests

Kernel tests bootstrap a minimal environment to execute specific API checks—such as schema creation, SQLite database binding, and data integrity. They execute locally entirely in memory without requiring a web server routing setup.

**Target File:** `web/modules/custom/pl_work_log/tests/src/Kernel/WorkLogMigrationTest.php`

**Execution Command:**
```bash
ddev exec "SIMPLETEST_DB=sqlite://localhost//tmp/test.sqlite \
  SIMPLETEST_BASE_URL=https://performant-labs.ddev.site:8493 \
  vendor/bin/phpunit web/modules/custom/pl_work_log/tests/src/Kernel/WorkLogMigrationTest.php"
```

---

## Tier 2: Functional Tests

Functional tests spin up a fresh, complete Drupal installation per test class. They install the entire module dependency chain, process routing mapping, verify block placement rendering, and test HTTP access controls (e.g., anonymous access denials).

**Target File:** `web/modules/custom/pl_work_log/tests/src/Functional/WorkLogPagesTest.php`

**Execution Command:**
```bash
ddev exec "SIMPLETEST_DB=sqlite://localhost//tmp/test.sqlite \
  SIMPLETEST_BASE_URL=https://performant-labs.ddev.site:8493 \
  vendor/bin/phpunit web/modules/custom/pl_work_log/tests/src/Functional/WorkLogPagesTest.php"
```

> [!TIP]
> **Performance Note:** Execution can take 30-45 seconds due to initial Drupal bootstrap. Wait for completion rather than cancelling prematurely. Deprecation warnings related to Drupal 11 dependencies from the test suite runner can usually be safely ignored.

---

## Tier 3: Playwright ATK (Visual UI) Tests

Tier 3 tests run against the **live local state** of your Drupal application using the Automated Testing Kit (ATK) framework. Playwright drives a real Chrome browser instance interacting with the HTML output mimicking user behaviors.

**Target File:** `tests/atk_work_log/atk_work_log.spec.js`

**Execution Command:**
To run tests locally using the specific `@work-log` tag:
```bash
npm run test:local -- --grep="@work-log"
```

> [!WARNING]
> Because Tier 3 runs against the LIVE instance and expects migrated layout and data components, ensure `ddev drush migrate:import pl_work_log_import` has been executed recently and that layout builders and blocks remain uncorrupted prior to execution.

**Troubleshooting Playwright Failures:**
- If tests are reporting timeout assertions or "Access Denied" errors, verify that `qa_accounts` is installed and that the testing environment (`TESTING_BASE_URL`) hasn't reverted to Pantheon via dirty configuration files.
- To use the local URL seamlessly, ALWAYS run tests via `npm run test:local`. This script ensures `playwright.atk.config.js` directs testing API calls to DDEV instead of remote instances.
