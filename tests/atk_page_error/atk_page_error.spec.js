/**
 * atk_page_error.spec.js
 *
 * Page error tests such as 4xx, 5xx, etc.
 *
 */

/** ESLint directives */
/* eslint-disable import/first */

import * as atkCommands from '../support/atk_commands';
import * as atkUtilities from '../support/atk_utilities';
import { qaUsers } from '../support/atk_utilities';

// Import configuration.
import playwrightConfig from '../../playwright.config';
import atkConfig from '../../playwright.atk.config';
const baseUrl = playwrightConfig.use.baseURL;

// Set up Playwright.
import { expect, test } from '../support/atk_fixture.js';

test.describe('Page error tests.', () => {
  //
  // Validate that 403 page appears.
  // Assumes:
  // Create a basic page with alias of "403-error-page" that has text content below.
  // admin/config/system/site-information:Default 403 (access denied) page = /403-error-page
  //
  test('(ATK-PW-1060) Validate that 403 page appears. @ATK-PW-1060 @page-error @smoke', async ({ page, context }) => {
    const testId = 'ATK-PW-1060'; // eslint-disable-line no-unused-vars
    const badAnonymousUrl = 'admin';

    await atkCommands.logOutViaUi(page, context);
    await page.goto(baseUrl + badAnonymousUrl);

    // Should see the 403 message.
    let textContent = '';
    textContent = await page.content();
    expect(textContent).toContain('You are not authorized');
  });

  // Validate that 404 page appears.
  // Assumes:
  // Create a basic page that has text content below.
  // In admin/config/system/site-information, set Default 404 (not found) page = /node/x
  // where x is the new node ID.
  test('(ATK-PW-1061) Validate that 404 page appears. @ATK-PW-1061 @page-error @smoke', async ({ page, context }) => {
    const testId = 'ATK-PW-1061';
    const randomString = atkUtilities.createRandomString(6);
    const badAnonymousUrl = `${testId}-BadAnonymousPage-${randomString}`;
    const badAuthenticatedUrl = `${testId}-BadAuthenticatedPage-${randomString}`;

    await atkCommands.logOutViaUi(page, context);
    await page.goto(baseUrl + badAnonymousUrl);

    // Should see the 404 message.
    let textContent = '';
    textContent = await page.content();
    expect(textContent).toContain('The requested page could not be found');

    await atkCommands.logInViaForm(page, context, qaUsers.authenticated);
    await page.goto(baseUrl + badAuthenticatedUrl);

    // Should see the 404 message.
    textContent = await page.content();
    expect(textContent).toContain('The requested page could not be found');
  });
});
