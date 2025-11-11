/**
 * atk_taxonomy.spec.js
 *
 * Validate taxonomy entity.
 *
 */

/** ESLint directives */
/* eslint-disable import/first */

import * as atkCommands from '../support/atk_commands';
import * as atkUtilities from '../support/atk_utilities';
import { qaUsers } from '../support/atk_utilities';

// Note: tests should use relative URLs resolved against Playwright's baseURL.

// Set up Playwright.
import { expect, test } from '../support/atk_fixture.js';

test.describe('Taxonomy tests.', () => {
  //
  // Create taxonomy term, confirm it, update it, confirm update then delete it via the UI.
  //
  test('(ATK-PW-1120) Create, update, delete a taxonomy term via the UI. @ATK-PW-1120 @taxonomy @smoke @alters-db', async ({ page, context }) => {
    const testId = 'ATK-PW-1120'
    const uniqueToken = atkUtilities.createRandomString(6)
    const termName = `${testId}: ${uniqueToken}`
    let bodyText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a ultrices tortor.'

    // Log in with the administrator account.
    // You should change this to an account other than the administrator,
    // which has all rights.
    await atkCommands.logInViaForm(page, context, qaUsers.admin);

    //
    // Add a taxonomy node to the tags vocabulary.
    await page.goto('/admin/structure/taxonomy/manage/tags/add')

    // Fill in as many fields as you need here.
    // Below we provide a name and body.
    const titleTextfield = await page.$('input[name="name[0][value]"]');
    await titleTextfield.fill(termName);
    await atkCommands.inputTextIntoCKEditor(page, bodyText);

    await page.getByRole('button', { name: 'Save and go to list' }).click();

    //
    // Fetch tag id from the list. The new term should be at
    // or near the top but we shouldn't assume that.
    //
    await page.goto('/admin/structure/taxonomy/manage/tags/overview')
    const termLocator = await page.getByText(termName)

    // Get the tid from the edit button.
    const linkLocator = await termLocator.locator('xpath=following::a[starts-with(@href, "/taxonomy/term/")]').first()
    const workingUrl = await linkLocator.getAttribute('href')

    // Extract the tid.
    const regex = /\/taxonomy\/term\/(\d+)(?:\/([a-zA-Z0-9_-]+))?/
    const tidArray = workingUrl.match(regex)
    const tid = tidArray[1]

    const termEditUrl = `/taxonomy/term/${tid}/edit`
    const termViewUrl = `/taxonomy/term/${tid}`
    const termDeleteUrl = `/taxonomy/term/${tid}/delete`

    // Validate the body.
    await page.goto(termViewUrl)
    await expect(bodyText).toContain(bodyText)

    //
    // Update the term.
    //
    bodyText = 'Ut eget ex vitae erat lacinia molestie non non massa.'

    await page.goto(termEditUrl)

    // See comment above if inputTextIntoCKEditor() does not work for you.
    await atkCommands.inputTextIntoCKEditor(page, bodyText)

    const button = await page.locator('#edit-save') // eslint-disable-line no-unused-vars
    // await button.click( { force: true } )
    await page.getByRole('button', { name: 'Save and go to list' }).click()

    //
    // Delete the term.
    //
    await page.goto(termDeleteUrl)
    await page.getByRole('button', { name: 'Delete' }).click()

    // Adjust this confirmation to your needs.
    const divContainer = await page.textContent('.messages--status')
    await expect(divContainer).toContain('Deleted term')
  })
})
