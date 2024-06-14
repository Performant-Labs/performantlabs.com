/**
 * atk_media.cy.js
 *
 * Validate media entity.
 *
 */

/** ESLint directives */
/* eslint-disable import/first */

/// <reference types='Cypress' />

// Set up ATK.
import * as atkCommands from '../../support/atk_commands'; // eslint-disable-line no-unused-vars
import * as atkUtilities from '../../support/atk_utilities';
import atkConfig from '../../../cypress.atk.config';

// Standard accounts that use user accounts created
// by QA Accounts. QA Accounts are created when the QA
// Accounts module is enabled.
import qaUserAccounts from '../../data/qaUsers.json';

describe('Media tests.', () => {
  //
  // Create media with image, confirm it, update it, confirm update then delete it via the UI.
  //
  it('(ATK-CY-1130) Create, update, delete an image via the UI.', { tags: ['@ATK-CY-1130', '@media', '@smoke', 'alters-db'] }, () => {
    const testId = 'ATK-CY-1130';
    const image1Filepath = 'cypress/data/RobotsAtDesk.png';
    const image2Filepath = 'cypress/data/SmokeTest.png';
    const uniqueToken1 = atkUtilities.createRandomString(6);
    const uniqueToken2 = atkUtilities.createRandomString(6);

    // Log in with the administrator account.
    // You should change this to an account other than the administrator,
    // which has all rights.
    cy.logInViaForm(qaUserAccounts.admin);

    //
    // Add an image.
    //
    cy.visit(atkConfig.imageAddUrl);

    // Upload image.
    cy.get('#edit-field-media-image-0-upload').selectFile(image1Filepath);
    cy.get('input[name="field_media_image[0][alt]"]').type(`${testId}: ${uniqueToken1}`);

    // Fill in as many fields as you need
    // if you've customized your media entity.

    // Uncomment to unpublish.
    cy.get('input[name="status[value]"]').uncheck();

    // Then save the entity.
    cy.get('#edit-submit').click();

    // We are now on the media content list. Confirm the image
    // was rendered by checking for the token and testing the
    // image downloads correctly by testing the naturalWidth
    // and NaturalHeight properties.
    cy.get(`img[alt*="${uniqueToken1}"]`).then(($img) => {
      const isImageDownloaded = $img[0].naturalWidth > 0 && $img[0].naturalHeight > 0;
      expect(isImageDownloaded).to.be.true;
    });

    // Extract the media id that was added by
    // automated_testing_kit_preprocess_image().
    cy.get(`img[alt*="${uniqueToken1}"]`).invoke('attr', 'data-media-id').then((mid) => {
      //
      // Update the media.
      //
      const mediaEditUrl = atkConfig.mediaEditUrl.replace('{mid}', mid);
      cy.visit(mediaEditUrl);
      cy.get('#edit-field-media-image-0-remove-button').click();
      cy.get('input[name="files[field_media_image_0]"]').selectFile(image2Filepath);
      cy.get('input[name="field_media_image[0][alt]"]').type(`${testId}: ${uniqueToken2}`);
      cy.get('#edit-submit').click();

      //
      // Confirm content has changed.
      //

      // We are back again on the media content list. Confirm the image
      // was rendered by checking for the token.
      cy.get(`img[alt*="${uniqueToken2}"]`).should('be.visible');

      // Confirm image downloads correctly by testing the naturalWidth and naturalHeight properties.
      cy.get(`img[alt*="${uniqueToken2}"]`).then(($img) => {
        const isImageDownloaded = $img[0].naturalWidth > 0 && $img[0].naturalHeight > 0;
        expect(isImageDownloaded).to.be.true;
      });

      //
      // Delete the media entity.
      //
      const mediaDeleteUrl = atkConfig.mediaDeleteUrl.replace('{mid}', mid);
      cy.visit(mediaDeleteUrl); // Equivalent to await page.goto(mediaDeleteUrl)
      cy.get('#edit-submit').click();

      // Adjust this confirmation to your needs.
      cy.get('.messages--status').invoke('text').then((text) => {
        expect(text).to.include('has been deleted.');
      });
    });
  });
});
