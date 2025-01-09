import { test } from '@playwright/test';

import * as atkCommands from './support/atk_commands';

test('Global setup for all tests', () => {
  atkCommands.enableModule('qa_accounts');
});
