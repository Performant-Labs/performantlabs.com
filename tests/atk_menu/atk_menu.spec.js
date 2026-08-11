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
    // Capture the menu link id immediately after creation, BEFORE any
    // verification that could fail. This guarantees the finally block below
    // can always delete the item — a failed assertion must never leave a
    // stray "Test…" link behind in the (live) main menu.
    //
    await page.goto('/admin/structure/menu/manage/main')
    const linkLocator = page.getByText(menuItemTitle)
      .locator('xpath=following::a[starts-with(@href, "/admin/structure/menu/item/")]').first()
    const workingUrl = await linkLocator.getAttribute('href')
    const mid = workingUrl.match(/\/menu\/item\/(\d+)(?:\/([a-zA-Z0-9_-]+))?/)[1]

    try {
      //
      // Verify the menu item is visible to anonymous users on the front end.
      // Use a role-based locator so the check is theme-agnostic (the DripYard
      // theme renders links as .primary-menu__link, not the legacy .nav-link).
      //
      await atkCommands.logOutViaUi(page)
      await expect(page.getByRole('link', { name: menuItemTitle })).toBeVisible()
      await atkCommands.logInViaForm(page, context, qaUsers.admin)
    } finally {
      //
      // Always remove the menu item, even if verification threw — otherwise a
      // selector/assertion failure leaks the link into the menu on every run.
      //
      await page.goto(`/admin/structure/menu/item/${mid}/delete`)
      await page.getByRole('button', { name: 'Delete' }).click()
    }

    //
    // Validate the menu item has been deleted.
    //
    await page.goto('/admin/structure/menu/manage/main')
    await expect(page.getByText(menuItemTitle)).toHaveCount(0) // Ensure the item is gone.
  })
})
