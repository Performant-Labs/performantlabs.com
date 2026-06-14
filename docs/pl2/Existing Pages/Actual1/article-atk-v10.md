[Skip to main content](#main-content)

⚙ 20260418

[![Home](/themes/custom/performant_labs_20260418/logo.svg)](/)

Menu

## Main navigation

* [Services](/services)
* [How We Do It](/how-we-do-it)
* [Articles](/articles)
* [Open Source Projects](/open-source-projects)
* [About Us](/about-us)
* [Contact Us](/form/contact)

[Call today](/contact)

## Breadcrumb

1. [Home](/)
2. [Articles](/articles)
3. Version 1.0 of Automated Testing Kit Is Ready!

# Version 1.0 of Automated Testing Kit Is Ready!

![Robot in a factory](https://pl-performantlabs.com.2.ddev.site/sites/default/files/styles/16_9_512x288_focal_point_webp/public/migration/articles/17_RobotInFactory.jpeg.avif?itok=aTRFrC28)

The vision for Automated Testing Kit is that every Drupal site has a suite of tests that ensure the basic operation works. After many months of development, it seems that the code has settled down enough to release version 1.0.

In this blog post, I discuss the philosophy of Automated Testing Kit and why certain decisions were made. Documentation on how to use Automated Testing Kit is [here](https://performantlabs.com/automated-testing-kit/automated-testing-kit).

### What's Interesting?

To start off, here are some interesting points about Automated Testing Kit:

* The tests and common functions are named and work the same way for both Cypress and Playwright. You can switch testing frameworks in the future or even run tests in both frameworks thereby using the framework for tests they are most suited to.
* Tests that send emails capture them using Ethereal.email, a free virtual email server. For instance, using a unique token, the registration test confirms the email it sent was the one received by Ethereal.email. See the section below on why Ethereal.email was chosen.
* Tests use Drush to communicate with the target server; an ssh tunnel is used if the target is on Pantheon.
* The target server can be local, in a local container or remote.
* To confirm that nodes, terms and images are displayed, the Kit uses preprocess hooks that add the entity IDs to the HTML. (They can be hard to target without these.)

Read on for more details.

### Which tests made it into Version 1?

Below are the tests included for both Cypress and Playwright. The XX becomes CY when it's for Cypress and PW for Playwright.

* (ATK-XX-1000) Register with form and confirm email with Ethereal.email. Requires Symfony Mailer or equivalent mail transfer module.
* (ATK-XX-1010) Log in with form.
* (ATK-XX-1012) Log in via ULI.
* (ATK-XX-1020) Create user with Drush, delete by email.
* (ATK-XX-1021) Create user with Drush, delete by UID.
* (ATK-XX-1030) Reset password.
* (ATK-XX-1050) Contact Us form accepts input, sends email. Requires Webform module.
* (ATK-XX-1060) Validate that 403 page appears.
* (ATK-XX-1061) Validate that 404 page appears.
* (ATK-XX-1071) Return # of sitemap files; fail if zero.
* (ATK-XX-1071) Regenerate sitemap files. Uses drush fprop (custom drush command).
* (ATK-XX-1080) Reserved for Simple XML Sitemap
* (ATK-XX-1100) Create and delete user with Drush.
* (ATK-XX-1101) Create user with Drush, delete by UID.
* (ATK-XX-1110) Create, update, delete a page via the UI.
* (ATK-XX-1111) Create, update, delete an article via the UI.
* (ATK-XX-1120) Create, update, delete a taxonomy term via the UI.
* (ATK-XX-1130) Create, update, delete an image via the UI.

### Common Functions

In the file atk\_commands.js and atk\_utility.js files you'll find the functions below.

* createRandomString()
* createUserWithUserObject()
* deleteNodeViaUiWithNid()
* deleteUserWithEmail()
* deleteUserWithUid()
* deleteUserWithUserName()
* execDrush()
* execPantheonDrush()
* getDrushAlias()
* getUidWithEmail()
* getUsernameWithEmail()
* logInViaForm()
* logInViaUli()
* logOutViaUi()
* setDrupalConfiguration()

They perform some of the most common operations testers need. If a function name doesn't include "Ui" in it, the action is performed via Drush. (Thus, you will need Drush installed on the target machine.)

### Test Definition

Each test has multiple tags that allow you to identify a test to run or a test to omit. Test definitions include the test ID in the title (for easy cross-referencing in reports) and multiple tags that specify the test category and test attributes, such as whether the test modifies the database or is part of the set of smoke tests.

Here is how test definitions look.

Cypress:

it('(ATK-CY-1110) Create, update, delete a page via the UI.', { tags: ['@ATK-CY-1110', '@node', '@smoke', 'alters-db'] }, () => {

Playwright:

test('(ATK-PW-1110) Create, update, delete a page via the UI. @ATK-PW-1110 @node @smoke @alters-db', async ({page, context }) => {

The first tag is always the test ID, followed by the category, then attribute tags as needed.

Each framework allows you to target by one or more tags. With forethought and good tag design, it's possible to use only tags rather than moving tests into test suites.

### Category Tags

The current categories are:

* @contact-us
* @media
* @node
* @register-login
* @page-error
* @taxonomy
* @user
* @xml-sitemap

These map to the typical areas of a web site and will grow over time.

### Test Attribute Tags

Specify that you want to run only smoke tests or exclude tests that modify the database using tags (also known as labels and annotations). Usually you will always filter tests to omit any test marked with @skip.

Here are the attribute tags used by ATK currently:

##### @alters-db

**T**est modifies the database; many teams disallow these tests from running on production servers.

##### @smoke

Test is part of the core suite of tests that ensuring the basic functioning of the site. Teams typically aim to have smoke tests run within 15 to 20 minutes. A smoke test will always be run after a deployment. Smoke tests are "wide and shallow," meaning they aim to test one element of every major category on the site (login/logout, registration, password reset, node creation, PDF generation, third-party system integration, etc.) but not in depth. Once the smoke tests have completed and any errors are fixed, the team starts a more in-depth test suite that may take several hours to complete.

##### @skip

Tests that are being modified or otherwise need to be omitted are marked with @skip.

Those are the most basic attributes of tags and your test suite will likely need more, such as:

##### @regression

A regression (bug) was introduced in a previous deployment. Test is designed to confirm the regression was successfully fixed.

##### @functional

Test is designed to test functionality (yes, the lines are very blurry nowadays).

##### @integration

Test is designed to test system component integration.

##### @api

Test is related to an exposed API.

##### @visual

Test is related specifically to presentation or theming (as opposed to functionality).

##### @mobile

Test sets the viewport for mobile devices and likely will not work on the desktop.

##### @performance

Test is designed to test component performance.

##### @flaky

Test is currently acting flaky and the source of the flakiness has not yet been identified and corrected.

### Why Doesn't ATK Use Typescript?

Typescript provides type checking for Javascript but it also adds more complexity and time to the build process. Now that there is a proposal to add some amount of type checking to Javascript, it seems less necessary to rewrite the tests in Typescript. Using Typescript would also limit the ability of some teams to use the module.

### Why Ethereal.email?

Alternative tools for email tests are [Mailhog](https://github.com/mailhog/MailHog) and [Maillog](https://www.drupal.org/project/maillog) (see this [Drupal documentation page](https://www.drupal.org/docs/develop/local-server-setup/managing-mail-handling-for-development-or-testing) for more). These are both excellent tools and for extensive email testing a team will likely want to set one up eventually.

I chose Ethereal.email because:

* it is already set up on their server thus saving setup and configuration time; just needs a free account
* out of the box, it allows testing of the whole circuit including the public web
* it’s free
* it works well.

At some point it's likely that there will be tests that use these other tools since they are used extensively for many types of mail testing.

### Loads of Configuration

Automated Testing Kit uses standard Drupal URLs by default but these can be changed. Below is the playwright.atk.config.js file that includes configuration settings and URLs; the Cypress configuration file is almost identical.

module.exports = {
operatingMode: "native",
drushCmd: "drush",
articleAddUrl: 'node/add/article',
contactUsUrl: "form/contact",
logInUrl: "user/login",
logOutUrl: "user/logout",
imageAddUrl: 'media/add/image',
mediaDeleteUrl: 'media/{mid}/delete',
mediaEditUrl: 'media/{mid}/edit',
mediaList: 'admin/content/media',
nodeDeleteUrl: 'node/{nid}/delete',
nodeEditUrl: 'node/{nid}/edit',
pageAddUrl: 'node/add/page',
registerUrl: "user/register",
resetPasswordUrl: "user/password",
termAddUrl: 'admin/structure/taxonomy/manage/tags/add',
termEditUrl: 'taxonomy/term/{tid}/edit',
termDeleteUrl: 'taxonomy/term/{tid}/delete',
termViewUrl: 'taxonomy/term/{tid}',
authDir: "tests/support",
dataDir: "tests/data",
supportDir: "tests/support",
testDir: "tests",
pantheon : {
isTarget: false,
site: "aSite",
environment: "dev"
}
}

### Hooks

Some tests require that ATK is running on the target server so that they have access to preprocess hooks. The hooks add HTML attributes that allow easy targeting of an element.

Pages and articles get the "node-type-<node\_type>" and "node-nid-xxx" classes. Terms get the the "term-vid-xxxx" and "term-tid-xxxx" classes.

Media items get "data-media-id"= mediaId.

### Custom Drush Commands

##### fprop

The XML Sitemap test requires that the custom *fprop* Drush command be available on the target server. *fprop* returns file properties, such as last modified date, and file size, that let the test determine if the sitemap has been regenerated.

### Conclusion

These 18 tests are a good start and the number grow to cover more common use cases. Obviously, you will need to add custom tests for your site. It's common for enterprise sites to have many hundreds of tests split into a smoke test suite, a more in-depth functional suite and component-specific test suites that examine a component in great depth.

Don't need a test? Just add @skip tag (or delete the file) while the remaining tests help ensure your Drupal site is working bug-free.

Are you interested in setting up testing for your team? Call us today at 415.754.3294 or [drop us a note](https://performantlabs.com/contact-us). We can do the work for you and leave behind documentation or we can mentor your team—or both.

## Footer

* [Services](/services)
  + [Drupal Development](/services)
  + [Automated Testing](/services)
  + [Performance Tuning](/services)
  + [Open Source Projects](/open-source-projects)
* [Resources](/articles)
  + [Articles](/articles)
  + [Documentation](/docs)
* ### Company

  + [About Us](/about-us)
  + [Contact Us](/contact)
  + [Privacy Policy](/privacy-policy)
