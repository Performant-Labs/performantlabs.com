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

import playwrightConfig from '../../playwright.config';

// Import ATK Configuration.
import atkConfig from '../../playwright.atk.config';

// Import ATK data.
import * as atkData from '../support/atk_data.js';

// Set up Playwright.
import { expect, test } from '@playwright/test';
import { baseUrl } from '../support/atk_data.js';

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

    await atkCommands.logInViaForm(page, context, atkData.qaUsers.admin)

    await page.goto(`${baseUrl}admin/structure/webform/manage/contact/results/submissions`)

    // Check for presence of random string.
    // Part A passes: the submission appears.
    await expect(page.getByText(user.userName, { exact: true })).toBeVisible()
  })
})
