/**
 * atk_menu.spec.js
 *
 * Menu tests.
 *
 */
/** ESLint directives */
/* eslint-disable import/first */

import * as atkUtilities from '../support/atk_utilities'; // eslint-disable-line no-unused-vars
import { qaUsers } from '../support/atk_utilities';
import * as atkCommands from '../support/atk_commands';

import playwrightConfig from '../../playwright.config';

// Import ATK Configuration.
import atkConfig from '../../playwright.atk.config';


// Set up Playwright.
import { expect, test } from '../support/atk_fixture.js';

const baseUrl = playwrightConfig.use.baseURL;


test.describe('Menu tests.', () => {
  //
  // Validate Menu items are added and removed.
  //
  test('(ATK-PW-1150) Create a new menu item, validate it, and remove it @ATK-PW-1150 @menu @smoke @alters-db', async ({ page, context }) => {
    const testId = 'ATK-PW-1150'
    const uniqueToken = atkUtilities.createRandomString(6)
    const menuItemTitle = `Test${uniqueToken}`

    //
    // Log in with the administrator account.
    //
    await atkCommands.logInViaForm(page, context, qaUsers.admin)

    //
    // Begin menu item creation.
    //
    await page.goto(`${baseUrl}/admin/structure/menu/manage/main/add`)
    await page.getByLabel('Menu link title').fill(menuItemTitle)
    await page.getByLabel('Link', { exact: true }).fill('<front>')
    await page.getByText('Link Loading… The location')
    await page.getByRole('button', { name: 'Save' }).click()

    // Verify the menu item was created by checking its presence.
    await page.goto(baseUrl)
    await expect(page.locator('.nav-link', { hasText: menuItemTitle })).toBeVisible() // Ensure it's visible.

    //
    // Navigate to the menu management page to determine the menu id.
    //
    await page.goto(baseUrl + atkConfig.menuListUrl)

    const menuLocator = await page.getByText(menuItemTitle)

    // Get the menu id from the edit button.
    const linkLocator = await menuLocator.locator('xpath=following::a[starts-with(@href, "/admin/structure/menu/item/")]').first()

    const workingUrl = await linkLocator.getAttribute('href')

    const regex = /\/menu\/item\/(\d+)(?:\/([a-zA-Z0-9_-]+))?/
    const midArray = workingUrl.match(regex)
    const mid = midArray[1]

    const menuDeleteUrl = atkConfig.menuDeleteUrl.replace('{mid}', mid)

    await page.goto(baseUrl + menuDeleteUrl)

    // Confirm the deletion.
    await page.getByRole('button', { name: 'Delete' }).click()

    //
    // Validate the menu item has been deleted.
    //
    await page.goto(baseUrl + atkConfig.menuListUrl)
    const menuItemExists = await page.locator(`text=${menuItemTitle}`).count()
    test.expect(menuItemExists).toBe(0) // Ensure the item is gone.
  })
})
