/**
 * atk_contact_us.cy.js
 *
 * Contact Us tests.
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

describe('Contact Us tests.', () => {
  //
  // Validate Contact us.
  //
  it('(ATK-CY-1050) Contact Us form accepts input, sends email.', { tags: ['@ATK-CY-1050', '@contact-us', '@smoke', '@alters-db'] }, () => {
    const testId = 'ATK-CY-1050';
    const uniqueToken = atkUtilities.createRandomString(6);
    const subjectLine = `${testId} ${uniqueToken}`;
    const user = atkUtilities.createRandomUser();

    cy.visit(atkConfig.contactUsUrl).then(() => {
      cy.get('#edit-name').type(user.userName);
      cy.get('#edit-email').type(user.userEmail);
      cy.get('#edit-subject').type(subjectLine);
      cy.get('#edit-message').type(testId);

      cy.contains('Send message').click();
    });

    cy.contains('Your message has been sent.');

    // Now check for the entry in the database.
    // Note that experiencing this problem and clearing isn't working:
    // https://github.com/cypress-io/cypress/issues/14590
    Cypress.session.clearSessionStorage; // eslint-disable-line chai-friendly/no-unused-expressions

    cy.logInViaForm(qaUserAccounts.admin);

    cy.visit('admin/structure/webform/manage/contact/results/submissions');

    // Check for presence of random string.
    // Part A passes: the submission appears.
    cy.contains(uniqueToken).should('be.visible');
  });
});
