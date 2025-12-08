# Agent Instructions

## Test File Structure, Headers and Imports

Keep test headers, such as imports, comments, linter directives,
the same for all test files  (copy it from the existing test file to
your new test.)

Use two-level test structure (`test.describe(...)`, then `test(...)`). Use
tags describing the test ID, test area, and other test features
(such as `@alters-db`).
See [Tag List](https://performantlabs.com/automated-testing-kit/tests)
for the list of tags.

## Common Implementation Notes

Make sure that there is no hardcoded base URL inside the test.

Make sure that test data, if needed, is created before the test and cleaned up
after the test.

Make sure your test passes against dev environment. Make sure
there is no flakiness (for example, use `--repeat-each 10` for Playwright).

Check that there are no dependencies on the external resources.

Don't duplicate implemented functions! For example, to log in, use
`atkCommands.logInViaForm()`. See [atk_commands.js](/tests/support/atk_commands.js), [atk_utilities.js](/tests/support/atk_utilities.js) for the available functions.
