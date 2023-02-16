/// <reference types="Cypress" />

// https://github.com/bahmutov/cypress-log-to-term
import 'cypress-log-to-term/commands'

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

require('cy-verify-downloads').addCustomCommand();
import 'cypress-drupal';
// import '@bahmutov/cy-api/support'


let remoteExecCmd = ''

/**
 * Create a User using user object.
 *
 * @param user - Object
 */
Cypress.Commands.add('createUserWithUserObject', (user = {}) => {
  // Create the user.
  let cmd = `user-create "${user.userName}" --mail="${user.email}" --password="${user.userPassword}"`;

  cy.execDrush(cmd)
  cy.log(`${user.userName}: User created successfully.`)

  // Assign role(s) to the user.
  if (user.role.length > 0) {
    user.role.forEach(function (value) {
      cmd = `user-add-role "${Cypress.env('roles')[value]}" "${user.username}"`
      cy.execDrush(cmd)
      cy.log(`${value}: Role assigned to the user ${user.username}`)
    })
  }
})

/**
 * Delete User.
 *
 * @param username        String
 */
Cypress.Commands.add('deleteUserWithUserName', (userName) => {
  const cmd = `user:cancel -y --delete-content "${userName}"`

  cy.log(`${userName}: Attempting to delete.`)

  cy.execDrush(cmd)

  cy.log(`${userName}: User deleted successfully if present.`)
})

/**
 * Run drush command locally or remotely depending on the environment.
 *
 * @param command         Command to execute.
 */
Cypress.Commands.add("execDrush", (command) => {
  cy.getDrushAlias().then(drushAlias => {
    if (Cypress.config('isPantheon')) {
      // sshCmd comes from the test and is set in the before()
      return cy.execSSHDrush(command)  // returns stdout (not wrapped)
    }
    else {
      const cmd = `${drushAlias} ${command}`
      cy.exec(cmd).then( (result) => {
        return cy.log(result.stdout)    // Returns stdout (not wrapped)
      })
    }
  })
})

/**
 * Run a Drush command via a SSH shell.
 *
 * @param cmd         The terminus cmd to execute.
 */
Cypress.Commands.add("execSSHDrush", (cmd) => {
  const pantheonSite = Cypress.config('pantheonSite');
  const pantheonEnvironment = Cypress.config('pantheonEnvironment');
  const pantheonTerminus = Cypress.config("pantheonTerminus");

  const connectCmd = `${pantheonTerminus} connection:info ${pantheonSite}.${pantheonEnvironment} --format=json`

  cy.exec(connectCmd)
    .its("stdout")
    .should("contain", "sftp_command")
    .then(function (stdout) {
      const connections = JSON.parse(stdout);
      const sftp_connection = connections.sftp_command;
      const env_connection = sftp_connection.replace("sftp -o Port=2222 ", "");

      // Produce the command that will talk to the Pantheon server.
      const remoteCmd = `ssh -T ${env_connection} -p 2222 -o "StrictHostKeyChecking=no" -o "AddressFamily inet" 'drush ${cmd}'`;

      cy.exec(remoteCmd)
        .its("stdout")
        .then ((stdout) => {
          return cy.wrap(stdout);
        });
    })
});

/**
 * Download file.
 *
 * @param url - String
 * @param selector - String
 *
 * @see https://docs.cypress.io/api/commands/get
 */
Cypress.Commands.add('downloadFile', (url = {}, selector) => {
  cy.visit(url)
    .get(`${selector}`).click()
})

/**
 * Find text in a specific column / row in a table.
 *
 * @param selector - String
 * @param searchString - String
 * @param type - String (row / column)
 * @param index - Number
 */
Cypress.Commands.add('findTextInTable', (selector, searchString, type = null, index = null) => {

  // If parameter type is passed as "row".
  if (type === 'row') {
    // If index specified.
    if (index !== null) {
      // Assert if searchString exist.
      cy.get(`${selector} > tbody > tr:nth-child(${index}) > td`).then((el) => {
        assert.include(el.text(), searchString)
      })

    }
  }
  // If parameter type is passed as "column".
  else if (type === 'column') {
    // If index specified.
    if (index !== null) {
      // Assert if searchString exist.
      cy.get(`${selector} > tbody > tr > td:nth-child(${index})`).then((el) => {
        assert.include(el.text(), searchString)
      })
    }
  }
  // Search string in entire table.
  else {
    cy.get(`${selector} > tbody`).find('tr').find('td').contains(searchString)
  }
})

/**
 * Returns drush alias per environment.
 *
 * Adapt this to the mechanism that communicates to the remote server.
 */
Cypress.Commands.add("getDrushAlias", () => {
  let cmd;

  if (cy.config('isPantheon')) {
    cmd = 'terminus remote:drush ' + Cypress.config('pantheonSite') + '.' + Cypress.config('pantheonEnvironment') + ' -- ';
  }
  else {
    cmd = './vendor/bin/drush ';
  }
  return cy.wrap(cmd);

  // // Ask uname for name of OS.
  // cy.exec('uname').then((result) => {
  //   // Running in a container? Change fin below to lando or ddev.
  //   // if (result.stdout == 'Darwin')
  //   //   // Yes, running in a container ("Darwin" is macOS).
  //   //   return cy.wrap('fin drush')
  //   // else
  // })
})

/**
 * Get Iframe Body
 */
Cypress.Commands.add('getIframeBody', (iframeId) => {
  // Get the iframe > document > body
  // and retry until the body element is not empty
  return cy
    .get('iframe[id=mvActiveArea]')
    .its('0.contentDocument.body').should('not.be.empty')
    // Wraps “body” DOM element to allow
    // chaining more Cypress commands, like “.find(...)”
    // https://on.cypress.io/wrap
    .then(cy.wrap)
})

/**
 * According to the environment, log in using Drush or the form.
 *
 * @param account - Object
 */
Cypress.Commands.add("logInAs", (account) => {
  let environment = Cypress.config().baseUrl

  switch(account.accountType) {
    case 'admin':

      // When running in a container or in Tugboat, Use drush to generate login link.
      if (environment.includes('docksal') || environment.includes('tugboat')) {
        cy.logInAsAdmin().then(value => {
          cy.visit(value)
        })
      }

      // Otherwise use the login form.
      else {
        cy.logInViaForm(account)
      }
      break

    case 'authenticated':
      cy.logInViaForm(account)
      break

    default:
      throw new Error('LogInAs() needs "admin" or "authenticated" as a parameter.')
  }
})

/**
 * Log in via the login form. Test this once then switch to faster mechanisms.
 *
 * @param account - object
 */
Cypress.Commands.add("logInViaForm", (account) => {
  cy.session([account], () => {
      cy.visit(Cypress.env('url').login)

      // It is ok for the username to be visible in the Command Log.
      expect(account.userName, 'username was set').to.be.a('string').and.not.be.empty

      // But the password value should not be shown.
      if (typeof account.userPassword !== 'string' || !account.userPassword) {
        throw new Error('Missing password value, check the environment configuration file.')
      }
      cy.get('#edit-name').type(account.userName, { force: true })

      // Type password and the password value should not be shown - {log: false}.
      cy.get('#edit-pass').type(account.userPassword, { log: false , force: true })

      // Click the log in button using ID.
      cy.get('#edit-actions > #edit-submit').click({ force: true })
      cy.get('head meta').then(console.log)
    },
    {
      validate() {
        cy.visit('')

        // Confirm log in worked.
        cy.get('head meta').then(console.log)

        // Optional.
        //should('include.text', 'user')
      }
    }
  )
})

/**
 * Login as admin (UID=1).
 */
Cypress.Commands.add('logInAsAdminByUli', () => {
  cy.getDrushAlias().then(drushAlias => {
    cy.exec(
      `${drushAlias} uli`, {failOnNonZeroExit: false}
    ).then((result) => {
      return cy.wrap(result.stdout.split(multilingualStem )[1]);
    })
  })
})

/**
 * Login as existing user given email. (UID=1)
 *
 * @param user          Use ULI link to log in identified by email.
 */
Cypress.Commands.add('logInWithEmail', (user = {}) => {
  cy.getDrushAlias().then(drushAlias => {
    cy.exec(
      `${drushAlias} uli --mail=${user.email}`, {failOnNonZeroExit: false}
    ).then((result) => {
      return cy.wrap(result.stdout.split(multilingualStem )[1]);
    })
  })
})

/**
 * Login as existing user given specific UID.
 *
 * @param UID           Use ULI link to log in identified by UID.
 */
Cypress.Commands.add('logInWithUserId', (UID) => {
  cy.getDrushAlias().then(drushAlias => {
    cy.exec(
      `${drushAlias} uli --uid=` + UID
    ).then((result) => {
      return cy.wrap(result.stdout.split(multilingualStem )[1]);
    })
  })
})

/**
 * Log out user via the UI.
 */
Cypress.Commands.add('logOutViaUI', () => {
  cy.visit('user/logout')
})


/**
 * Performs an HTTP request of specific type.
 *
 * @param url           Make HTTP request using browserAuthentication.
 */
Cypress.Commands.add('makeHttpRequestWithAuthentication', (url, requestType) => {
  return cy.request({
    method: requestType,
    url: url,
    auth: {
      username: Cypress.env('browserAuthentication').username,
      password: Cypress.env('browserAuthentication').password,
    },
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200)
  })
})

/**
 * Parse Excel file.
 *
 * @param inputFile       Given a file, parse using XLS library.
 */
Cypress.Commands.add('parseXlsx', (inputFile) => {
  return cy.task('parseXlsx', { filePath: inputFile })
});

/**
 * Prepare for test run.
 */
Cypress.Commands.add("prepareForTestRun", () => {
  return;

  // Set the Honeypot time limit to 0.
  cy.setDrupalConfiguration('honeypot.settings', 'time_limit', '0')

  // Coffee is presenting an overlay that is hiding other elements.
  cy.execDrush('pmu -y coffee')
})


/**
 * Set configuration via drush.
 */
Cypress.Commands.add('setDrupalConfiguration', (objectName, key, value) => {
  const cmd = `cset -y ${objectName} ${key} ${value}`

  cy.execDrush(cmd)
})

/**
 * Extend visit to support basic auth and url prefixing based on
 * current region/language or just language.
 *
 * @param url              URL to visit.
 * @param useRawUrl        Set to true when using outside sites.
 */
Cypress.Commands.overwrite('visit', (originalFn, url, useRawUrl, options) => {
  const host = Cypress.config().baseUrl

  // When visiting outside sites, don't include the baseUrl (host).
  if (useRawUrl) {
    return originalFn(`${url}`, options)
  }

  if (host === undefined) {
    throw new Error("baseUrl is missing. Set in the configuration file.")
  }

  let region = cy.config('region')
  let language = cy.config('language')

  if (region === undefined) {
    region = 'us'
  }

  if (language === undefined) {
    language = 'en'
  }
  options = options || {}

  // Use when the site is protected by Shield (https://drupal.org/project/shield).
  options.auth = {
    username: Cypress.env('browserAuthentication').username,
    password: Cypress.env('browserAuthentication').password
  }
  options.failOnStatusCode = false;

  // Get the Drupal object for tests to access.
  options.onLoad = (win) => {
    const d = win.Drupal
    cy.config('Drupal', d)
  }

  // When the project is multiregional and multilingual, include both.
  // For default language and region, exclude both.
  // domain.com/title-of-article
  // domain.com/cn/zh/title-of-article
  if (cy.config('useRegions')) {
    if (!region === "us" && !language === "en") {
     return originalFn(`${host}/${region}/${language}/${url}`, options)
    }
    else {
      return originalFn(`${host}/${url}`, options)
    }
  }
  // Otherwise use the language only if it's not English.
  // domain.com/title-of-article
  // domain.com/es/title-of-article
  else {
    if (!language === "en") {
      return originalFn(`${host}/${language}/${url}`, options)
    }
    else {
      return originalFn(`${host}/${url}`, options)
    }
  }

})
