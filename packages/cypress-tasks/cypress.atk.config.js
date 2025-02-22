/*
* Automated Testing Kit configuration.
*/

/**
 * Read Cypress environment and fail immediately if it's not set.
 */
const testmailNamespace = Cypress.env('TESTMAIL_NAMESPACE')
if (typeof testmailNamespace !== 'string') {
  throw new Error('Consider export=CYPRESS_TESTMAIL_NAMESPACE=*** before run.')
}
const testmailApiKey = Cypress.env('TESTMAIL_API_KEY')
if (typeof testmailApiKey !== 'string') {
  throw new Error('Consider export CYPRESS_TESTMAIL_API_KEY=*** before run.')
}

module.exports = {
  operatingMode: 'native',
  drushCmd: 'drush',
  articleAddUrl: 'node/add/article',
  contactUsUrl: 'form/contact',
  logInUrl: 'user/login',
  logOutUrl: 'user/logout',
  imageAddUrl: 'media/add/image',
  mediaDeleteUrl: 'media/{mid}/delete',
  mediaEditUrl: 'media/{mid}/edit',
  mediaList: 'admin/content/media',
  menuAddUrl: 'admin/structure/menu/manage/main/add',
  menuDeleteUrl: 'admin/structure/menu/item/{mid}/delete',
  menuEditUrl: 'admin/structure/menu/item/{mid}/edit',
  menuListUrl: 'admin/structure/menu/manage/main',
  nodeDeleteUrl: 'node/{nid}/delete',
  nodeEditUrl: 'node/{nid}/edit',
  pageAddUrl: 'node/add/page',
  registerUrl: 'user/register',
  resetPasswordUrl: 'user/password',
  termAddUrl: 'admin/structure/taxonomy/manage/tags/add',
  termEditUrl: 'taxonomy/term/{tid}/edit',
  termDeleteUrl: 'taxonomy/term/{tid}/delete',
  termListUrl: 'admin/structure/taxonomy/manage/tags/overview',
  termViewUrl: 'taxonomy/term/{tid}',
  xmlSitemapUrl: 'admin/config/search/xmlsitemap',
  blockAddUrl: 'block/add?theme=ucop',
  email: {
    // Configure email testing using Reroute Email but with Enable rerouting OFF,
    // the module will be enabled, right before the test execution, and get back
    // to the initial state, after test execution.
    reroute: {
      address: `${testmailNamespace}.admin@inbox.testmail.app`,
      allowed: '*@inbox.testmail.app',
    },

    // Configure one of the test email providers:
    // for Mailpit:
    // provider: 'mailpit',
    // url: '{baseURL}:8025',

    // for testmail.app:
    provider: 'testmail',
    namespace: testmailNamespace,
    apiKey: testmailApiKey,
  },
  authDir: 'cypress/support',
  dataDir: 'cypress/data',
  supportDir: 'cypress/support',
  testDir: 'cypress/e2e',
  pantheon: {
    isTarget: true,
    site: 'performant-labs',
    environment: 'dev',
  },
}
