/**
 * atk_menu.spec.js
 *
 * Menu tests.
 *
 */
/** ESLint directives */
/* eslint-disable import/first */

import * as atkUtilities from '../support/atk_utilities' // eslint-disable-line no-unused-vars
import { qaUsers } from '../support/atk_utilities'
import * as atkCommands from '../support/atk_commands'

// Tests should use relative URLs resolved against Playwright's baseURL.

// Set up Playwright.
import { expect, test } from '../support/atk_fixture.js'
// Removed stray top-level await calls; all test logic is inside test blocks below.

// Use relative paths so Playwright resolves them against baseURL.

test.describe('Menu tests.', () => {
  //
  // Belt-and-suspenders guard (see ATK-PW-1150 postmortem below): sweep any
  // stray Test<random> menu links out of the "main" menu before this suite
  // runs, regardless of what left them there. This makes a leak self-heal on
  // the next run instead of silently accumulating for weeks — which is what
  // actually happened: 18 orphaned links across live+dev before anyone
  // noticed, because nothing was watching for the leak itself.
  //
  test.beforeAll(async () => {
    atkCommands.execDrush('php:script', ['tests/support/scripts/sweep-stray-menu-links.php'])
  })

  //
  // Tracks the mid of a just-created menu link so afterEach can guarantee
  // its removal — see the afterEach comment below for why this exists
  // alongside (not instead of) the in-test UI-driven deletion.
  //
  let pendingMid = null

  test.afterEach(async () => {
    //
    // ATK-PW-1150 postmortem: this test used to rely solely on a try/finally
    // around the UI-driven delete. That is not a safe cleanup mechanism here.
    // The anonymous-visibility check below can hang against Pantheon's edge
    // cache long enough to exhaust Playwright's test timeout; when that
    // happens Playwright force-closes the browser context, and the finally
    // block's own page.goto()/click() then fail with "Target page, context
    // or browser has been closed" — cleanup never runs. Result: a leaked
    // link on every single nightly run against live for two straight weeks.
    //
    // This afterEach is the fix: it always runs (Playwright guarantees
    // afterEach fires even after a hard test timeout), and it cleans up via
    // Drush — a plain shell/SSH call with no dependency on the browser
    // session that just got killed. If the test's own UI-driven delete
    // already succeeded, pendingMid is null here and this is a no-op.
    //
    if (pendingMid) {
      atkCommands.execDrush('entity:delete', ['menu_link_content', pendingMid], ['--yes'])
      pendingMid = null
    }
  })

  //
  // Validate Menu items are added and removed.
  //
  test('(ATK-PW-1150) Create a new menu item, validate it, and remove it @ATK-PW-1150 @menu @smoke @alters-db', async ({ page, context }) => {
    const uniqueToken = atkUtilities.createRandomString(6)
    const menuItemTitle = `Test${uniqueToken}`

    //
    // Log in with the administrator account.
    //
    await atkCommands.logInViaForm(page, context, qaUsers.admin)

    //
    // Begin menu item creation.
    //
    await page.goto('/admin/structure/menu/manage/main/add')
    await page.getByLabel('Menu link title').fill(menuItemTitle)
    await page.getByLabel('Link', { exact: true }).fill('<front>')
    await page.getByText('Link Loading… The location')
    await page.getByRole('button', { name: 'Save' }).click()

    //
    // Capture the menu link id immediately after creation, before any
    // verification that could fail, and hand it to afterEach as the
    // guaranteed-cleanup target (see afterEach above).
    //
    await page.goto('/admin/structure/menu/manage/main')
    const linkLocator = page.getByText(menuItemTitle)
      .locator('xpath=following::a[starts-with(@href, "/admin/structure/menu/item/")]').first()
    const workingUrl = await linkLocator.getAttribute('href')
    const mid = workingUrl.match(/\/menu\/item\/(\d+)(?:\/([a-zA-Z0-9_-]+))?/)[1]
    pendingMid = mid

    //
    // Verify the menu item is visible to anonymous users on the front end.
    // Use a role-based locator so the check is theme-agnostic (the DripYard
    // theme renders links as .primary-menu__link, not the legacy .nav-link).
    //
    await atkCommands.logOutViaUi(page)
    await expect(page.getByRole('link', { name: menuItemTitle })).toBeVisible()
    await atkCommands.logInViaForm(page, context, qaUsers.admin)

    //
    // Delete via the admin UI — this is the actual feature under test (does
    // the delete button work), not just cleanup. afterEach is the safety
    // net if this doesn't complete; it is not a substitute for testing it.
    //
    await page.goto(`/admin/structure/menu/item/${mid}/delete`)
    await page.getByRole('button', { name: 'Delete' }).click()
    pendingMid = null // UI-driven delete completed; afterEach has nothing to do.

    //
    // Validate the menu item has been deleted.
    //
    await page.goto('/admin/structure/menu/manage/main')
    await expect(page.getByText(menuItemTitle)).toHaveCount(0) // Ensure the item is gone.
  })
})
