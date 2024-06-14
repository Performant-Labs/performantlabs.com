# Automated Testing Kit

Automated Testing Kit (ATK) is a suite of tests and useful functions for end-to-end
testing using Cypress and Playwright such as:

- basic login/logout via the UI
- registration and confirmation of the email via a fake SMTP service (ethereal.email)
- integration of the QA Accounts module
- basic tests of node, taxonomy, media and user entities.
- executing drush commands via aliases or to Pantheon via Terminus and ssh
- much more

ATK works in the following environments:
- on the native OS (i.e. macOS/Linux)
- native OS + a container (via DDEV/Lando/Docksal)
- within a container.

Use Docker images provided by the Cypress and Playwright teams
([Cypress documentation](https://docs.cypress.io/examples/docker), [Playwright documentation](https://playwright.dev/docs/docker)).

For a full description of the module, visit the
[project page](https://www.drupal.org/project/automated_testing_kit).

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

Install on the last version of Drupal 9.x or on Drupal 10+.

This module requires Cypress or Playwright to be installed plus the browsers you
will test on (all of which can be in containers). See those projects for installation
instructions.

The module has several dependencies, which are listed in [the documentation](https://performantlabs.com/automated-testing-kit/requirements).


## Recommended modules

Some tests require additional modules to be installed. If you don't want to use those
tests, comment them out and don't add the module[s] below to your composer.json file.
The documentation lists the modules a test requires.

Here are the dependencies currently:

- [Webform](https://www.drupal.org/project/webform)
- [QA Accounts](https://www.drupal.org/project/qa_accounts)
- [Symfony Mailer](https://www.drupal.org/project/symfony_mailer)
- [XML Sitemap](https://www.drupal.org/project/xmlsitemap)


## Installation

 * Install as you would normally install a contributed Drupal module. Visit
   https://www.drupal.org/node/1897420 for further information.
 * Installing the module without Composer is not recommended and is unsupported.
 * Read the ATK documentation. Move the tests to your project
   with the atk_setup script, set up the target URL and further customize the Kit for
   your Drupal installation.


## Configuration

Refer to the [documentation](https://performantlabs.com/automated-testing-kit/automated-testing-kit);
you will need to set the target URL and a few more items.

Automated Testing Kit has a configuration page located at
/admin/config/development/automated_testing_kit/edit (stub for now).


## FAQ

**Q: I'm just starting. Which testing framework should I use, Cypress or Playwright or
something else?**

**A:** You'll find many videos and blog posts comparing the tools
in the [Learning Resources area of the documentation](https://performantlabs.com/automated-testing-kit/learning-resources).


## Maintainers

- André Angelantoni - [aangel](https://www.drupal.org/u/aangel)
