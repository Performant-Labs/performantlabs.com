/**
 * atk_menu.cy.js
 *
 * Validate menu.
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

describe('Menu tests.', () => {
  //
  // Create a page with an image, confirm it, update it, confirm update then delete it via the UI.
  //
  it('(ATK-CY-1150) Create a new menu item, validate it, and remove it.', { tags: ['@ATK-CY-1150', '@menu', '@smoke', '@alters-db'] }, () => {
    const uniqueToken = atkUtilities.createRandomString(6);
    const menuItemTitle = "Test" + uniqueToken;
    const testId = "ATK-CY-1150";

    // Log in with the administrator account.
    // You should change this to an account other than the administrator,
    // which has all rights.
    cy.logInViaForm(qaUserAccounts.admin);

    //
    // Begin menu item creation.
    //
    cy.visit('/admin/structure/menu/manage/main/add');
    cy.getByLabel('Menu link title').type(menuItemTitle);
    cy.getByLabel('Link').type('<front>');
    cy.contains('Save').click();

    // Verify the menu item was created by checking its presence.
    cy.visit('/');
    cy.contains(menuItemTitle);

    //
    // Navigate to the menu management page to determine the menu id.
    //
    cy.visit(atkConfig.menuListUrl);
    cy.get('tr')
      .each((element) => {
        if (element.text().includes(menuItemTitle)) {
          const link = element.find('a[href^="/admin/structure/menu/item/"]');
          const href = link.attr('href');
          const regex = /\/menu\/item\/(\d+)(?:\/([a-zA-Z0-9_-]+))?/;
          const midArray = href.match(regex);
          const mid = midArray[1];

          const menuDeleteUrl = atkConfig.menuDeleteUrl.replace('{mid}', mid);

          cy.visit(menuDeleteUrl).debug();

          // Confirm the deletion.
          // cy.contains('Delete').click({force: true});
          cy.get("#edit-submit").click();

          //
          // Validate the menu item has been deleted.
          //
          cy.visit(atkConfig.menuListUrl);
          cy.contains(menuItemTitle).should('not.exist');
        }
      });
  });
});
