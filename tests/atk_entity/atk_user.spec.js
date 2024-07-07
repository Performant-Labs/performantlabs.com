/**
 * atk_user.spec.js
 *
 * Validate user entity.
 *
 */

/** ESLint directives */
/* eslint-disable import/first */

import * as atkCommands from '../support/atk_commands';
import * as atkUtilities from '../support/atk_utilities'; // eslint-disable-line no-unused-vars

// Import ATK data.
import * as atkData from '../support/atk_data.js'; // eslint-disable-line no-unused-vars


// Set up Playwright.
import { test } from '@playwright/test';

test.describe('User tests.', () => {
  //
  // Create a user with Drush from a fixture and delete it.
  //
  test('(ATK-PW-1100) Create and delete user with Drush. @ATK-PW-1100 @user @drush @smoke @alters-db', async ({ page }) => { // eslint-disable-line no-unused-vars
    const testId = 'ATK-PW-1100'; // eslint-disable-line no-unused-vars

    await atkCommands.deleteUserWithEmail(atkData.etherealUser.userEmail, ['--delete-content']);
    await atkCommands.createUserWithUserObject(atkData.etherealUser, []);
    await atkCommands.deleteUserWithUserName(atkData.etherealUser.userName
      , [], ['--delete-content']);
  });

  //
  // Create a user with Drush from a fixture and delete it by UID.
  //
  test('(ATK-PW-1101) Create user with Drush, delete by UID.  @ATK-PW-1101 @user @drush @smoke @alters-db ', async ({ page }) => { // eslint-disable-line no-unused-vars
    await atkCommands.deleteUserWithEmail(atkData.etherealUser.userEmail, ['--delete-content']);
    await atkCommands.createUserWithUserObject(atkData.etherealUser, []);
    const uid = await atkCommands.getUidWithEmail(atkData.etherealUser.userEmail);
    await atkCommands.deleteUserWithUid(uid, [], ['--delete-content']);
  });
});
