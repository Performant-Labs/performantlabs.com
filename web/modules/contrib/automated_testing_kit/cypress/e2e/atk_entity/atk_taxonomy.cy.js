/**
 * atk_taxonomy.cy.js
 *
 * Validate taxonomy entity.
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
  it('(ATK-CY-1120) Create, update, delete a taxonomy term via the UI.', { tags: ['@ATK-CY-1120', '@taxonomy', '@smoke', 'alters-db'] }, () => {
    const testId = 'ATK-CY-1110';
    const uniqueToken = atkUtilities.createRandomString(6);
    const termName = `${testId}: ${uniqueToken}`;
    let bodyText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a ultrices tortor.';

    // Log in (Assuming logInViaForm is defined and adapted for Cypress)
    cy.logInViaForm(qaUserAccounts.admin);

    // Add a taxonomy node to the tags vocabulary
    cy.visit(atkConfig.termAddUrl);

    // Fill in fields
    cy.get('input[name="name[0][value]"]').type(termName);

    // With Cypress, CKEditor with .type() may give an error
    // (see https://github.com/cypress-io/cypress/issues/26155).
    // Use the .setData() function on the editor instead.
    cy.get('.ck-editor__main > .ck').then((element) => {
      const editor = element[0].ckeditorInstance;
      editor.setData(bodyText);
    });
    cy.contains('Save and go to list').click();

    // Fetch tag id from the list
    cy.visit('/admin/structure/taxonomy/manage/tags/overview');

    cy.get('a').each(($element) => {
      if ($element.text() === 'Edit') {
        const href = $element.prop('href');
        const regex = /\/taxonomy\/term\/(\d+)\/edit/;
        const match = href.match(regex);
        if (match) {
          const tid = match[1];
          cy.log(tid); // Log tid to the console as an example

          const termEditUrl = atkConfig.termEditUrl.replace('{tid}', tid);
          const termViewUrl = atkConfig.termViewUrl.replace('{tid}', tid);
          const termDeleteUrl = atkConfig.termDeleteUrl.replace('{tid}', tid);

          // Validate the body
          cy.visit(termViewUrl);
          cy.wait(1000); // eslint-disable-line cypress/no-unnecessary-waiting
          cy.contains(bodyText).should('exist');

          // Update the term
          bodyText = 'Ut eget ex vitae nibh dapibllus vulputate ut id lacus.';
          cy.visit(termEditUrl);

          // With Cypress, CKEditor with .type() may give an error
          // (see https://github.com/cypress-io/cypress/issues/26155).
          // Use the .setData() function on the editor instead.
          cy.get('.ck-editor__main > .ck').then((element) => {
            const editor = element[0].ckeditorInstance;
            editor.setData(bodyText);
          });

          cy.get('#edit-overview').click();

          // Delete the term
          cy.visit(termDeleteUrl);
          cy.get('#edit-submit').click();

          // Confirm deletion
          cy.get('.messages-list__item').should('contain.text', 'Deleted term');

          return false;
        }
      }
    });
  });
});
