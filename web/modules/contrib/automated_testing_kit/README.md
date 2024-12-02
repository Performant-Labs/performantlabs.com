# Automated Testing Kit

Automated Testing Kit (ATK) is a suite of tests and useful functions for end-to-end
testing using Cypress and Playwright such as:

- basic login/logout via the UI
- registration
- integration of the QA Accounts module
- basic tests of node, taxonomy, media, user entities and menus
- executing drush commands via aliases or to Pantheon via Terminus and ssh
- much more

ATK works in the following environments:
- on the native OS (i.e. macOS/Linux)
- native OS + a container (via DDEV/Lando/Docksal)
- within a container.

For a full description of the module, visit the
[project page](https://www.drupal.org/project/automated_testing_kit).

To use ATK with a Recipe, visit [Applying the Automated Testing Kit Recipe](https://performantlabs.com/automated-testing-kit/applying-automated-testing-kit-recipe).

Installation/configuration instructions plus the lists of functions and tests are in
the documentation
[here](https://performantlabs.com/automated-testing-kit/automated-testing-kit).

Join the Drupal [Slack workspace](https://www.drupal.org/join-slack) and
the #automated_testing_kit channel to ask questions.

Submit bug reports and feature suggestions, or track changes in the
[issue queue](https://www.drupal.org/project/issues/automated_testing_kit).


## Table of contents

- Requirements
- Recommended modules
- Installation
- Configuration
- FAQ
- Maintainers


## Requirements

Install on version of Drupal in the 10.x branch.

This module requires Cypress or Playwright to be installed plus the browsers you
will test on.

The module has several dependencies, which are listed in [the documentation](https://performantlabs.com/automated-testing-kit/requirements).


## Recommended modules

Some tests require additional modules to be installed. If you don't want to use those
tests, comment them out and don't add the module(s) to your project.
The documentation lists the modules a test requires.

## Installation

 * Install as you would normally install a contributed Drupal module. Visit
   https://www.drupal.org/node/1897420 for further information.
 * Installing the module without Composer is not recommended and is unsupported.
 * Read the [Automated Testing Kit documentation](https://performantlabs.com/automated-testing-kit/automated-testing-kit). Move the tests to your project
   with the atk_setup script, set up the target URL and further customize the Kit for
   your Drupal installation.
 * Alternatively, you _may_ be able to apply the recipe to an existing site (see [Applying the Automated Testing Kit Recipe](https://performantlabs.com/automated-testing-kit/applying-automated-testing-kit-recipe)).
   Attempt this only on a development instance (i.e. not a production instance).


## Configuration

Refer to the [documentation](https://performantlabs.com/automated-testing-kit/automated-testing-kit);
you will need to set the target URL and a configure few more items depending on
which tests you want to run. The recipe handles all this for you.

## FAQ

**Q: Is there a way to try Automated Testing Kit easily?**

**A:** Yes, follow the instructions at [Applying the Automated Testing Kit Recipe](https://performantlabs.com/automated-testing-kit/applying-automated-testing-kit-recipe).
They will instruct you on how to install a vanilla Drupal site, the Kit and the Playwright framework.

There will also be an opportunity to play with Automated Testing Kit at
[DrupalForge.org](https://drupalforge.org) in early 2025.


**Q: I'm just starting. Which testing framework should I use, Cypress or Playwright?**

**A:** You'll find many videos and blog posts comparing the tools
in the [Learning Resources](https://performantlabs.com/automated-testing-kit/learning-resources) area of the documentation.


## Maintainers

- André Angelantoni - [aangel](https://www.drupal.org/u/aangel)
- Ilia Liaukin - [ilyaukin](https://www.drupal.org/u/ilyaukin)
