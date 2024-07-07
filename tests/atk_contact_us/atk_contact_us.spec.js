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

test.describe('Contact Us tests.', () => {
  //
  // Validate Contact us.
  //
  test('(ATK-PW-1050)  Contact Us form accepts input, sends email. @ATK-PW-1050 @contact-us @smoke @alters-db', async ({ page, context }) => {
    const uniqueToken = atkUtilities.createRandomString(6);
    const testId = '(ATK-PW-1050)';
    const subjectLine = `${testId} ${uniqueToken}`;
    let textContent = '';

    // Begin registration.
    await page.goto(atkConfig.contactUsUrl);

    await page.getByLabel('Your name').fill(atkData.etherealUser.userName);
    await page.getByLabel('Your email').fill(atkData.etherealUser.userEmail);
    await page.getByLabel('Subject').fill(subjectLine);
    await page.getByLabel('Message').fill(testId);
    await page.getByRole('button', { name: 'Send message' }).click();

    // The status box needs a moment to appear.
    await page.waitForSelector('[aria-label="Status message"]');

    // Should see the thank-you message.
    textContent = await page.content();
    expect(textContent).toContain('Your message has been sent.');

    // Now check for the entry in the database.
    await atkCommands.logOutViaUi(page, context);

    await atkCommands.logInViaForm(page, context, atkData.qaUsers.admin);

    await page.goto(`admin/structure/webform/manage/contact/results/submissions`);

    // Check for presence of random string.
    // Part A passes: the submission appears.
    textContent = await page.content();
    expect(textContent).toContain(uniqueToken);

    // Check for registration email at Ethereal.
    const etherealUrl = 'https://ethereal.email';
    await page.goto(`${etherealUrl}/login`);
    await page.getByPlaceholder('Enter email').fill(atkData.etherealUser.userEmail);
    await page.getByPlaceholder('Password').fill(atkData.etherealUser.userPassword);
    await page.getByRole('button', { name: 'Log in' }).click();

    textContent = await page.textContent('body');
    expect(textContent).toContain(`Logged in as ${atkData.etherealUser.userEmail}`);

    await page.goto(`${etherealUrl}/messages`);

    textContent = await page.textContent('body');
    expect(textContent).toContain(`Messages for ${atkData.etherealUser.userEmail}`);

    // Look for "ATK-CY-1050) uniqueToken" generated above.
    await expect(page.getByRole('row', { subject: subjectLine })).toBeVisible;
  });
});
