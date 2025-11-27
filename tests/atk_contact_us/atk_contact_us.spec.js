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
import atkConfig from '../../playwright.atk.config';

// Set up Playwright.
import { expect, test } from '../support/atk_fixture.js';

// Import ATK data.
const qaUsers = atkUtilities.qaUsers;

test.describe('Contact Us tests.', () => {
  const ctx = {}

  test.beforeAll(() => {
    if (!atkConfig.email?.reroute) {
      return
    }

    // initial_state  = drush cget reroute_email.settings enable
    ctx.enable = atkCommands.getDrupalConfiguration('reroute_email.settings', 'enable')
    ctx.address = atkCommands.getDrupalConfiguration('reroute_email.settings', 'address')
    ctx.allowed = atkCommands.getDrupalConfiguration('reroute_email.settings', 'allowed')
    ctx.mailkeys = atkCommands.getDrupalConfiguration('reroute_email.settings', 'mailkeys')
    ctx.mailkeysSkip = atkCommands.getDrupalConfiguration('reroute_email.settings', 'mailkeys_skip')

    // Remote:drush cset reroute_email.settings enable 1
    atkCommands.setDrupalConfiguration('reroute_email.settings', 'enable', true)
    atkCommands.setDrupalConfiguration('reroute_email.settings', 'address', atkConfig.email.reroute.address)
    atkCommands.setDrupalConfiguration('reroute_email.settings', 'allowed', atkConfig.email.reroute.allowed)
    atkCommands.setDrupalConfiguration('reroute_email.settings', 'mailkeys', '')
    atkCommands.setDrupalConfiguration('reroute_email.settings', 'mailkeys_skip', '')
  })

  test.afterAll(() => {
    if (!atkConfig.email?.reroute) {
      return
    }

    // Remote:drush cset reroute_email.settings enable $INITIAL_STATE
    if (ctx.enable !== undefined) {
      atkCommands.setDrupalConfiguration('reroute_email.settings', 'enable', ctx.enable)
    }
    if (ctx.address !== undefined) {
      atkCommands.setDrupalConfiguration('reroute_email.settings', 'address', ctx.address)
    }
    if (ctx.allowed !== undefined) {
      atkCommands.setDrupalConfiguration('reroute_email.settings', 'allowed', ctx.allowed)
    }
    if (ctx.mailkeys !== undefined) {
      atkCommands.setDrupalConfiguration('reroute_email.settings', 'mailkeys', ctx.mailkeys)
    }
    if (ctx.mailkeysSkip !== undefined) {
      atkCommands.setDrupalConfiguration('reroute_email.settings', 'mailkeys_skip', ctx.mailkeysSkip)
    }
  })

  //
  // Validate Contact Us (via Webform module).
  //
  test('(ATK-PW-1050)  Contact Us form accepts input, sends email. @ATK-PW-1050 @contact-us @smoke @alters-db', async ({ page, context }) => {
    const testId = 'ATK-PW-1050'
    const uniqueToken = atkUtilities.createRandomString(6)
    const subjectLine = `${testId} ${uniqueToken}`

    // Begin Contact us.
    const user = atkUtilities.createRandomUser()
    await page.goto('/')
    await page.getByRole('link', { name: 'CONTACT US' }).first().click()

    await page.getByLabel('Your name').fill(user.userName)
    await page.getByLabel('Your email').fill(user.userEmail)
    // Company is required for PL site
    await page.getByLabel('Your Company Name').fill('Automated Testing, Inc.')
    await page.getByLabel('Message').fill(testId)
    await page.getByRole('button', { name: 'SEND MESSAGE' }).click()

    // Assert success message is visible.
    await expect(page.getByText('Thank you. We\'ll get in contact with you right away.')).toBeVisible()
    // Ensure no error message appeared (check for error/alert classes regardless of text).
    // Skip email error check if email provider is not configured (e.g., on Pantheon dev).
    if (atkConfig.email?.provider) {
      const errorLocator = page.locator('[role="alert"], .messages--error, .error-message')
      const errorCount = await errorLocator.count()
      let errorMessage = ''
      if (errorCount > 0) {
        errorMessage = await errorLocator.first().textContent()
      }
      await expect(errorLocator, `Expected no error message, but found: "${errorMessage}"`).not.toBeVisible()
    }

    await atkCommands.logInViaForm(page, context, qaUsers.admin)

    await page.goto('/admin/structure/webform/manage/contact/results/submissions')

    // Check for presence of random string.
    // Part A passes: the submission appears.
    await expect(page.getByText(user.userName, { exact: true })).toBeVisible()

    // Check for an email sent to site admin.
    // We don't know the address here (unless we use Reroute Email),
    // so just check the subject.
    await atkCommands.expectEmail(atkConfig.email?.reroute?.address ?? /.*/, subjectLine)
  })
})
