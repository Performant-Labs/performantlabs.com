/**
 * atk_user.cy.js
 *
 * Validate user entity.
 *
 */

/** ESLint directives */
/* eslint-disable import/first */

/// <reference types='Cypress' />

// Set up ATK.
import * as atkCommands from '../../support/atk_commands'; // eslint-disable-line no-unused-vars
import * as atkUtilities from '../../support/atk_utilities'; // eslint-disable-line no-unused-vars
import atkConfig from '../../../cypress.atk.config'; // eslint-disable-line no-unused-vars

// Import email settings for Ethereal fake SMTP service.
import userEtherealAccount from '../../data/etherealUser.json';

// Standard accounts that use user accounts created
// by QA Accounts. QA Accounts are created when the QA
// Accounts module is enabled.
import qaUserAccounts from '../../data/qaUsers.json'; // eslint-disable-line no-unused-vars

describe('User tests.', () => {
  //
  // Create a user with Drush from a fixture and delete it.
  //
  it('(ATK-CY-1020) Create user with Drush, delete by email.', { tags: ['@ATK-CY-1020', '@register-login', '@smoke', 'alters-db'] }, () => {
    cy.deleteUserWithEmail(userEtherealAccount.userEmail, [], ['--delete-content']);
    cy.createUserWithUserObject(userEtherealAccount, []);
    cy.deleteUserWithEmail(userEtherealAccount.userEmail, [], ['--delete-content']);
  });

  //
  // Create a user with Drush from a fixture and delete it by UID.
  //
  it('(ATK-CY-1021) Create user with Drush, delete by UID.', { tags: ['@ATK-CY-1021', '@register-login', '@smoke', 'alters-db'] }, () => {
    cy.deleteUserWithEmail(userEtherealAccount.userEmail, [], ['--delete-content']);
    cy.createUserWithUserObject(userEtherealAccount, []);
    cy.getUidWithEmail(userEtherealAccount.userEmail).then((uid) => {
      cy.deleteUserWithUid(uid, [], ['--delete-content']);
    });
  });
});
