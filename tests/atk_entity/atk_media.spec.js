/**
 * atk_media.spec.js
 *
 * Validate media entity.
 *
 */

/** ESLint directives */
/* eslint-disable import/first */

import * as atkCommands from '../support/atk_commands'
import * as atkUtilities from '../support/atk_utilities'
import { qaUsers } from '../support/atk_utilities'

// Import configuration.
import playwrightConfig from '../../playwright.config'
import atkConfig from '../../playwright.atk.config'

const baseUrl = playwrightConfig.use.baseURL

// Set up Playwright.
import { expect, test } from '../support/atk_fixture.js'

test.describe('Media tests.', () => {
  //
  // Create media with image, confirm it, update it, confirm update then delete it via the UI.
  //
  test.skip('(ATK-PW-1130) Create, update, delete an image via the UI. @ATK-PW-1130 @media @smoke @alters-db', async ({ page, context }) => {
    const testId = 'ATK-PW-1130'
    const image1Filepath = 'tests/data/RobotsAtDesk.png'
    const image2Filepath = 'tests/data/SmokeTest.png'
    const uniqueToken1 = atkUtilities.createRandomString(6)
    const uniqueToken2 = atkUtilities.createRandomString(6)

    // Log in with the administrator account.
    // You should change this to an account other than the administrator,
    // which has all rights.
    await atkCommands.logInViaForm(page, context, qaUsers.admin)

    //
    // Add an image.
    //
    await page.goto(baseUrl + atkConfig.imageAddUrl)

    // Upload image.
    const imageField = page.locator('#edit-field-media-image-0-upload')
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      imageField.click(),
    ])
    await fileChooser.setFiles(image1Filepath)

    const altField = page.locator('input[name="field_media_image[0][alt]"]')
    await altField.fill(`${testId}: ${uniqueToken1}`)

    // Fill in as many fields as you need
    // if you've customized your media entity.

    // Uncomment to unpublish.
    const publishInput = page.locator('input[name="status[value]"]') // eslint-disable-line no-unused-vars
    // await publishInput.uncheck()

    // Then save the entity.
    await page.getByRole('button', { name: 'Save' }).click()

    // We are now on the media content list. Confirm the image
    // was rendered by checking for the token.
    let imageLocator = page.locator(`img[alt*="${uniqueToken1}"]`)
    await imageLocator.scrollIntoViewIfNeeded()
    await expect(imageLocator).toBeVisible()

    // Confirm image downloads correctly by testing the naturalWidth
    // and NaturalHeight properties.
    let isImageDownloaded = await imageLocator.evaluate((img) => img.naturalWidth > 0
      && img.naturalHeight > 0)
    expect(isImageDownloaded).toBeTruthy()

    // Extract the edit and delete hrefs.
    const rowLocator = page.locator('tr', { has: imageLocator })
    const mediaEditUrl = await rowLocator.locator('a[href*="edit"]').first().getAttribute('href')
    const mediaDeleteUrl = await rowLocator.locator('a[href*="delete"]').getAttribute('href')
    //
    // Update the media.
    //
    await page.goto(baseUrl + mediaEditUrl)
    await page.getByRole('button', { name: 'Remove' }).click()
    await page.setInputFiles('input[name="files[field_media_image_0]"]', image2Filepath)
    await altField.fill(`${testId}: ${uniqueToken2}`)
    await page.getByRole('button', { name: 'Save' }).click()

    //
    // Confirm content has changed.
    //

    // We are back again on the media content list. Confirm the image
    // was rendered by checking for the token.
    imageLocator = page.locator(`img[alt*="${uniqueToken2}"]`)
    await expect(imageLocator).toBeVisible()

    // Confirm image downloads correctly by testing the naturalWidth
    // and NaturalHeight properties.
    isImageDownloaded = await imageLocator.evaluate((img) => img.naturalWidth > 0
      && img.naturalHeight > 0)
    expect(isImageDownloaded).toBeTruthy()

    //
    // Delete the media entity.
    //
    await page.goto(baseUrl + mediaDeleteUrl)
    await page.getByRole('button', { name: 'Delete' }).click()
  })
})
