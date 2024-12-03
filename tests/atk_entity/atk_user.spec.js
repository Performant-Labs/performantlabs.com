/**
 * atk_user.spec.js
 *
 * Validate user entity.
 *
 */

/** ESLint directives */
/* eslint-disable import/first */

import * as atkUtilities from '../support/atk_utilities'; // eslint-disable-line no-unused-vars
import * as atkCommands from '../support/atk_commands';

import playwrightConfig from '../../playwright.config';

const baseUrl = playwrightConfig.use.baseURL;

// Import ATK data.
import * as atkData from '../support/atk_data.js';


// Set up Playwright.
import { expect, test } from '@playwright/test';


test.describe('User tests.', () => {
  //
  // Create a user with Drush from a fixture and delete it.
  //
  test('(ATK-PW-1100) Create and delete user with Drush. @ATK-PW-1100 @user @drush @smoke @alters-db', async () => {
    const testId = 'ATK-PW-1100' // eslint-disable-line no-unused-vars

    const user = atkUtilities.createRandomUser()
    atkCommands.createUserWithUserObject(user, [])
    atkCommands.deleteUserWithUserName(user.userName, [], ['--delete-content'])
    // TODO: how is this supposed to work?
    // expect(output, 'Command output [See stdout attached].').toBeTruthy()
  })

  //
  // Create a user with Drush from a fixture and delete it by UID.
  //
  test('(ATK-PW-1101) Create user with Drush, delete by UID.  @ATK-PW-1101 @user @drush @smoke @alters-db ', async () => {
    const testId = 'ATK-PW-1101' // eslint-disable-line no-unused-vars

    const user = atkUtilities.createRandomUser()
    const uid = atkCommands.createUserWithUserObject(user, [])
    atkCommands.deleteUserWithUid(uid)
    // TODO: how is this supposed to work?
    // expect(output, 'Command output [See stdout attached].').toBeTruthy()
  })
})
