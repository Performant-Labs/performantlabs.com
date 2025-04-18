/**
 * atk_contact_us.spec.js
 *
 * Contact Us tests.
 *
 */

/** ESLint directives */
/* eslint-disable import/first */

import * as atkCommands from '../support/atk_commands';
import * as atkUtilities from '../support/atk_utilities';

// Import configuration.
import playwrightConfig from '../../playwright.config';
import atkConfig from '../../playwright.atk.config';
const baseUrl = playwrightConfig.use.baseURL;

// Set up Playwright.
import { expect, test } from '../support/atk_fixture.js';

// Import ATK data.
const qaUsers = atkUtilities.qaUsers;

test.describe('Contact Us tests.', () => {
  //
  // Validate Contact us.
  //
  test('(ATK-PW-1050)  Contact Us form accepts input, sends email. @ATK-PW-1050 @contact-us @smoke @alters-db', async ({ page, context }) => {
    const testId = 'ATK-PW-1050'

    // Begin Contact us.
    const user = atkUtilities.createRandomUser()
    await page.goto(baseUrl)
    await page.getByRole('link', { name: 'CONTACT US' }).first().click()

    await page.getByLabel('Your name').fill(user.userName)
    await page.getByLabel('Your email').fill(user.userEmail)
    // Company is required for PL site
    await page.getByLabel("Your Company Name").fill('Automated Testing, Inc.')
    await page.getByLabel('Message').fill(testId)
    await page.getByRole('button', { name: "SEND MESSAGE" }).click()

    // Mail don't work **but** we can still check message in the admin interface.
    await expect(page.getByText('Thank you. We\'ll get in contact with you right away.')).toBeVisible()

    await atkCommands.logInViaForm(page, context, qaUsers.admin)

    await page.goto(`${baseUrl}admin/structure/webform/manage/contact/results/submissions`)

    // Check for presence of random string.
    // Part A passes: the submission appears.
    await expect(page.getByText(user.userName, { exact: true })).toBeVisible()
  })
})
