# CLAUDE.md — Project Instructions for Claude Code Action

## Project Overview

This is a Drupal website (performantlabs.com) with Playwright E2E tests.
Tests run nightly against Pantheon environments (dev, test, live).

## Operating Modes

Claude operates in two modes depending on the environment:

### GitHub CI Mode (default in GitHub Actions)

**Conservative.** Only fix test code. Never modify website source code.

- **Test issue** → Fix the test, create a PR
- **Website issue** → Comment analysis on the issue, do NOT modify any code

This mode is used when triggered by the `heal-tests-claude.yml` workflow.
The CI runner cannot deploy code changes to Pantheon, so fixing website code
would be pointless. Test-only PRs are safe to review and merge.

### Local Mode (when running `claude` on your machine)

**Aggressive.** Fix whatever is broken — test code OR website source code.

- **Test issue** → Fix the test directly
- **Website issue** → Fix the website code (PHP, Twig, JS, CSS) directly
- Verify the fix by running tests against local DDEV: `npx playwright test`

This mode is appropriate when a developer is present and can review changes
immediately. Changes can be tested against the local DDEV site before committing.

## Test Healing Instructions

### 1. Analyze the Failure

- Read the issue body (CI mode) or terminal output (local mode) for error details
- Read the failing test file(s)
- Run the failing tests: `npx playwright test <test-file> --reporter=list`
- Examine the CTRF report at `ctrf/ctrf-report.json` if available

### 2. Determine: Test Issue vs Website Issue

**TEST ISSUE** (selector/assertion is outdated):
- Element not found → selector is outdated
- Wrong text/attribute → expectation is outdated
- Timeout → needs better waiting strategy
- URL changed → test URL needs updating

**WEBSITE ISSUE** (application code is broken):
- Element genuinely missing from the page
- Broken functionality (forms don't submit, links are dead)
- Content is wrong/empty when it shouldn't be
- Server errors (500, 403, etc.)

### 3. Take Action

**If TEST issue (both modes):**
- Fix selectors, assertions, and waiting strategies
- CI mode: create a PR with fixes. Local mode: edit files directly.

**If WEBSITE issue:**
- **CI mode:** Comment analysis on the issue. Do NOT modify any code.
- **Local mode:** Fix the website code (PHP, Twig, JS, CSS). Verify with tests.

### 4. Drupal-Specific Patterns

When fixing selectors, follow these patterns:

- **Blocks:** Use `[id^="block-"]` or `[id*="block-main"]`
- **Menus:** Use `[id*="main-menu"]`, `[id*="navigation"]`
- **Forms:** Use `[id*="edit-"]`, `[id*="form-"]`
- **Prefer** `getByRole()` over CSS selectors
- **Prefer** `:has-text()` with partial matches over exact text
- **Use** `data-drupal-selector` when available
- **Use** regex for paths: `/about-us/` instead of exact match
- **Wait** with `waitForSelector()` instead of `waitForTimeout()`
- **Handle** language prefixes in URLs: `/en/about-us`

### 5. Test Configuration

- Config: `playwright.config.js` and `playwright.atk.config.js`
- Tests: `tests/` directory
- Support files: `tests/support/`
- Base URL depends on environment (set via `BASE_URL` env var)
- Pantheon targets: `https://{env}-performant-labs.pantheonsite.io`

## Code Style

- Use ES module syntax (`import`/`export`)
- Use Playwright test assertions (`expect(locator).toBeVisible()`)
- Follow existing test naming convention: `ATK-PW-XXXX`
- Add `@smoke`, `@accessibility`, `@visual`, or `@slow` tags as appropriate
