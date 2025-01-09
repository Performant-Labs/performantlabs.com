import { test } from '@playwright/test';

import * as atkCommands from './support/atk_commands';

test('Global teardown for all tests', () => {
  atkCommands.disableModule('qa_accounts');
});
