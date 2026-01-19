# AI Agent Instructions for PerformantLabs.com

## Project Overview

This is a **Drupal CMS website** with comprehensive **automated testing infrastructure** supporting both Playwright and Cypress. The codebase emphasizes end-to-end testing with the **Automated Testing Kit (ATK)**, a custom framework for Drupal testing.

**Key Architecture:**
- Drupal 11 site (`web/` directory)
- Dual test frameworks: Playwright (primary, `tests/`) and Cypress (legacy, `cypress/`)
- Custom Drupal modules in `web/modules/custom/` including `automated_testing_kit`
- Test utilities centralized in `tests/support/` and `cypress/support/`
- DDEV local development environment
- Multi-environment support (dev, Pantheon, Tugboat CI)

## Test Development Guidelines

### Test File Structure

**CRITICAL**: Follow existing test patterns strictly:

1. **Two-level test structure** - always use `test.describe()` + `test()`:
```javascript
test.describe('Feature tests.', () => {
  test('(ATK-PW-1234) Test description @ATK-PW-1234 @feature @smoke @alters-db', async ({ page, context }) => {
    // test implementation
  })
})
```

2. **Mandatory test tags** in test title: `@{TEST_ID}` (e.g., `@ATK-PW-1050`) + feature tags + `@alters-db` if test modifies database

3. **Standard imports** (copy from existing test file):
```javascript
import * as atkCommands from '../support/atk_commands'
import * as atkUtilities from '../support/atk_utilities'
import { expect, test } from '../support/atk_fixture.js'
import { qaUsers } from '../support/atk_utilities'
```

4. **No hardcoded base URLs** - always use relative paths: `await page.goto('/node/add/page')`

### Essential Testing Utilities

**Never duplicate functions** - reuse from `tests/support/atk_commands.js`:

- **Login**: `atkCommands.logInViaForm(page, context, qaUsers.admin)` or `atkCommands.logInViaUli(page, context, uid)`
- **User management**: `atkCommands.createUserWithUserObject(user, roles)`, `atkCommands.deleteUserWithUserName(userName)`
- **Node operations**: `atkCommands.getNid(page)`, `atkCommands.deleteCurrentNodeViaUi(page)`, `atkCommands.deleteNodeViaUiWithNid(page, context, nid)`
- **CKEditor**: `atkCommands.inputTextIntoCKEditor(page, text, instanceNumber)`
- **Drush execution**: `atkCommands.execDrush(cmd, args, options)` - handles local/remote/containerized environments
- **Email testing**: `atkCommands.expectEmail(mailto, subject)` with Mailpit/Ethereal integration
- **Search**: `atkCommands.openSearchForm(page)`, `atkCommands.checkSearchResult(page, item)`

**Utility functions** from `tests/support/atk_utilities.js`:
- `atkUtilities.createRandomUser()` - generates test user with random credentials
- `atkUtilities.createRandomString(length)` - for unique tokens
- `atkUtilities.readYAML(filename)` - load test data from `tests/data/`
- Pre-loaded: `qaUsers` object for standard test accounts (admin, authenticated)

### Test Data Management

1. **Clean up test data** - always delete created entities in test or afterEach/afterAll hooks
2. **QA user accounts**: Pre-configured in `tests/data/qaUsers.json` (qa_administrator, qa_authenticated)
3. **Test data files**: Store in `tests/data/` as JSON/YAML
4. **Random data**: Use `createRandomUser()` and `createRandomString()` for uniqueness

### Environment-Specific Behavior

The `execDrush()` function auto-detects environment:
- **Local (DDEV)**: `ddev exec drush {cmd}`
- **Pantheon**: Uses Terminus via `execPantheonDrush()`
- **Tugboat**: Uses `tugboat shell` via `execTugboatDrush()`

Configuration in `playwright.atk.config.js` defines URL patterns and paths (e.g., `logInUrl: 'user/login'`, `nodeEditUrl: 'node/{nid}/edit'`).

## Test Execution

### Running Tests

```bash
# Playwright (primary framework)
npx playwright test                          # All tests
npx playwright test tests/atk_entity/        # Specific directory
npx playwright test --grep @smoke            # By tag
npx playwright test --repeat-each 10         # Flakiness check

# Cypress (legacy)
npx cypress run
npx cypress open
```

### Test Configuration

- **Base URL**: Set via `BASE_URL` env var or defaults to `https://dev-performant-labs.pantheonsite.io/`
- **Reporters**: Allure, ReportPortal, CTRF JSON - configured via `ATK_REPORT_TARGET` env var
- **Parallel execution**: Controlled by `CI_THREADS` env var on CI
- **Custom fixture**: `tests/support/atk_fixture.js` extends base test with ad/tracker blocking

## Drupal-Specific Patterns

### Node ID Extraction

Custom Drupal hooks inject identifiers for testing:
- **Node ID**: Extract via `atkCommands.getNid(page)` (reads `.node-nid-{nid}` body class from `automated_testing_kit_preprocess_html()`)
- **Media ID**: Extract via `atkCommands.getMid(imageLocator)` (reads `data-media-id` attribute from `automated_testing_kit_preprocess_image()`)

### Content Management

Standard workflow pattern:
```javascript
// 1. Login
await atkCommands.logInViaForm(page, context, qaUsers.admin)

// 2. Create content
await page.goto('/node/add/page')
await page.locator('input[name="title[0][value]"]').fill('Title')
await atkCommands.inputTextIntoCKEditor(page, 'Body text')
await page.getByRole('button', { name: 'Save' }).click()

// 3. Extract ID for cleanup
const nid = await atkCommands.getNid(page)

// 4. Delete (UI or Drush)
await atkCommands.deleteNodeViaUiWithNid(page, context, nid)
```

## Development Workflow

1. **New test files**: Copy structure and imports from existing test in same directory
2. **Test ID convention**: `ATK-{FRAMEWORK}-{NUMBER}` (e.g., `ATK-PW-1050`, `ATK-CY-2010`)
3. **Flakiness prevention**: Use `page.waitForTimeout()` sparingly, prefer explicit waits
4. **No external dependencies**: Tests must be self-contained
5. **Email testing**: Configure Mailpit or Ethereal in `playwright.atk.config.js` under `email` section

## File Organization

- `tests/atk_{category}/` - Playwright tests by feature (entity, contact_us, search, sitemap, accessibility, etc.)
- `tests/support/` - Shared Playwright utilities (atk_commands.js, atk_utilities.js, atk_fixture.js)
- `tests/data/` - Test data files (qaUsers.json, testMessages.json, etc.)
- `cypress/e2e/` - Legacy Cypress tests (being phased out)
- `playwright.atk.config.js` - ATK configuration (URLs, paths, email setup)
- `playwright.config.js` - Playwright test runner config
- `web/modules/custom/` - Custom Drupal modules

## Common Pitfalls to Avoid

1. ❌ Don't hardcode URLs - use relative paths or `playwright.atk.config.js` URL patterns
2. ❌ Don't duplicate utility functions - import from `atk_commands.js` or `atk_utilities.js`
3. ❌ Don't skip cleanup - always delete test data
4. ❌ Don't forget test tags - include test ID and feature tags
5. ❌ Don't use single-level test structure - always wrap in `test.describe()`
6. ❌ Don't run external services - tests must work offline (except email verification)

## Additional Resources

- Tag list: https://performantlabs.com/automated-testing-kit/tests
- See `AGENTS.md` for additional test implementation notes
- Reference existing tests in `tests/atk_entity/` for patterns
