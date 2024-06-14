/**
 * atk_node.cy.js
 *
 * Validate node entities.
 *
 */

/** ESLint directives */
/* eslint-disable import/first */

/// <reference types='Cypress' />

// Set up ATK.
import * as atkCommands from '../../support/atk_commands'; // eslint-disable-line no-unused-vars
import * as atkUtilities from '../../support/atk_utilities'; // eslint-disable-line no-unused-vars
import atkConfig from '../../../cypress.atk.config';

// Standard accounts that use user accounts created
// by QA Accounts. QA Accounts are created when the QA
// Accounts module is enabled.
import qaUserAccounts from '../../data/qaUsers.json';

describe('Entity tests.', () => {
  //
  // Create a page with an image, confirm it, update it, confirm update then delete it via the UI.
  //
  it('(ATK-CY-1110) Create, update, delete a page via the UI.', { tags: ['@ATK-CY-1110', '@node', '@smoke', 'alters-db'] }, () => {
    const testId = 'ATK-CY-1110';
    const bodyText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a ultrices tortor.';

    // Log in with the administrator account.
    // You should change this to an account other than the administrator,
    // which has all rights.
    cy.logInViaForm(qaUserAccounts.admin);

    //
    // Add a page.
    //
    cy.visit(atkConfig.pageAddUrl);

    // Fill in as many fields as you need here.
    cy.get('input[name="title[0][value]"]').type(`${testId}: A Title`);

    // With Cypress, CKEditor with .type() may give an error
    // (see https://github.com/cypress-io/cypress/issues/26155).
    // Use the .setData() function on the editor instead.
    cy.get('.ck-editor__main > .ck').then((element) => {
      const editor = element[0].ckeditorInstance;
      editor.setData(bodyText);
    });
    cy.contains('Save').click();

    //
    // Confirm content appears.
    //
    cy.get('.text-content').invoke('text').then((text) => {
      expect(text).to.include(bodyText);
    });

    // Extract the nid placed in the body class by this hook:
    // automated_testing_kit.module:automated_testing_kit_preprocess_html().
    cy.document().then((document) => {
      const bodyClass = document.body.className;
      const match = bodyClass.match(/node-nid-(\d+)/);

      // Get the nid.
      const nid = parseInt(match[1], 10);

      // Update the node.
      const nodeEditUrl = atkConfig.nodeEditUrl.replace('{nid}', nid);
      const bodyText2 = 'Ut eget ex vitae nibh dapibus vulputate ut id lacus.';

      cy.visit(nodeEditUrl);
      // With Cypress, CKEditor with .type() may give an error
      // (see https://github.com/cypress-io/cypress/issues/26155).
      // Use the .setData() function on the editor instead.
      cy.get('.ck-editor__main > .ck').then((element) => {
        const editor = element[0].ckeditorInstance;
        editor.setData(bodyText2);
      });
      cy.wait(1000); // eslint-disable-line cypress/no-unnecessary-waiting
      cy.contains('Save').click();
      cy.wait(1000); // eslint-disable-line cypress/no-unnecessary-waiting

      // Confirm content has changed.
      cy.contains(bodyText2);

      // Delete the node.
      // Assuming atkCommands.deleteNodeViaUiWithNid is a custom function you've defined,
      // you'll need to ensure it's compatible with Cypress' command structure.
      cy.deleteNodeViaUiWithNid(nid);
    });
  });

  //
  // Create article with image, confirm it, update it, confirm update then delete it via the UI.
  //
  it('(ATK-CY-1111) Create, update, delete an article via the UI.', { tags: ['@ATK-CY-1111', '@node', '@smoke', 'alters-db'] }, () => {
    const testId = 'ATK-CY-1111';
    const bodyText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a ultrices tortor.';

    // Log in with the administrator account.
    // You should change this to an account other than the administrator,
    // which has all rights.
    cy.logInViaForm(qaUserAccounts.admin);

    //
    // Add an article.
    //
    cy.visit(atkConfig.articleAddUrl);

    // Fill in as many fields as you need here.
    cy.get('input[name="title[0][value]"]').type(`${testId}: A Title`);

    // With Cypress, CKEditor with .type() may give an error
    // (see https://github.com/cypress-io/cypress/issues/26155).
    // Use the .setData() function on the editor instead.
    cy.get('.ck-editor__main > .ck').then((element) => {
      const editor = element[0].ckeditorInstance;
      editor.setData(bodyText);
    });
    cy.contains('Save').click();

    //
    // Confirm content appears.
    //
    cy.get('.text-content').invoke('text').then((text) => {
      expect(text).to.include(bodyText);
    });

    // Extract the nid placed in the body class by this hook:
    // automated_testing_kit.module:automated_testing_kit_preprocess_html().
    cy.document().then((document) => {
      const bodyClass = document.body.className;
      const match = bodyClass.match(/node-nid-(\d+)/);

      // Get the nid.
      const nid = parseInt(match[1], 10);

      // Update the node.
      const nodeEditUrl = atkConfig.nodeEditUrl.replace('{nid}', nid);
      const bodyText2 = 'Ut eget ex vitae nibh dapibus vulputate ut id lacus.';

      cy.visit(nodeEditUrl);
      // With Cypress, CKEditor with .type() may give an error
      // (see https://github.com/cypress-io/cypress/issues/26155).
      // Use the .setData() function on the editor instead.
      cy.get('.ck-editor__main > .ck').then((element) => {
        const editor = element[0].ckeditorInstance;
        editor.setData(bodyText2);
      });
      cy.wait(1000); // eslint-disable-line cypress/no-unnecessary-waiting
      cy.contains('Save').click();
      cy.wait(1000); // eslint-disable-line cypress/no-unnecessary-waiting

      // Confirm content has changed.
      cy.contains(bodyText2);

      // Delete the node.
      // Assuming atkCommands.deleteNodeViaUiWithNid is a custom function you've defined,
      // you'll need to ensure it's compatible with Cypress' command structure.
      cy.deleteNodeViaUiWithNid(nid);
    });
  });
});
