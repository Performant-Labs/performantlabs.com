/*
* Automated Testing Kit configuration.
*/
module.exports = {
  operatingMode: "native",
  drushCmd: "drush",
  contactUsUrl: "form/contact",
  logInUrl: "user/login",
  logOutUrl: "user/logout",
  imageAddUrl: 'media/add/image',
  mediaDeleteUrl: 'media/{mid}/delete',
  mediaEditUrl: 'media/{mid}/edit',
  mediaList: 'admin/content/media',
  nodeAddUrl: 'node/add/page',
  nodeDeleteUrl: 'node/{nid}/delete',
  nodeEditUrl: 'node/{nid}/edit',
  registerUrl: "user/register",
  resetPasswordUrl: "user/password",
  termAddUrl: 'admin/structure/taxonomy/manage/tags/add',
  termEditUrl: 'taxonomy/term/{tid}/edit',
  termDeleteUrl: 'taxonomy/term/{tid}/delete',
  termViewUrl: 'taxonomy/term/{tid}',
  authDir: "cypress/support",
  dataDir: "cypress/data",
  supportDir: "cypress/support",
  testDir: "cypress/e2e",
  pantheon : {
    isTarget: false,
    site: "aSite",
    environment: "dev"
    }
}