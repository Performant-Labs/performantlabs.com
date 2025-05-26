/**
 * atk_commands.js
 *
 * Useful functions for Cypress.
 */

/// <reference types='Cypress' />

/** ESLint directives */
/* eslint-disable no-prototype-builtins */

// https://github.com/bahmutov/cypress-log-to-term
import 'cypress-log-to-term/commands'

// Fetch the Automated Testing Kit config, which is in the project root.
import atkConfig from '../../cypress.atk.config'

// Fetch error messages.
import atkMessages from '../data/testMessages.json'

/**
 * Log levels.
 * @type {{
 * INFO: number,  // Only built-in logs, such as cy.log(...)
 * DEBUG: number, // Built-in logs + cy.debug(...)
 * TRACE: number  // All the above + cy.trace(...)
 * }}
 */
const LOGLEVEL = {
  INFO: 0,
  DEBUG: 1,
  TRACE: 2,
}

// Current log level. Either number or text.
let logLevel = Cypress.env('atkLogLevel')
if (Number.isNaN(logLevel)) {
  logLevel = LOGLEVEL[logLevel] ?? 0
}

/**
 * Print a debug message to the Cypress command log.
 */
Cypress.Commands.add('debugLog', (message, ...args) => {
  if (logLevel >= LOGLEVEL.DEBUG) {
    cy.log(message, ...args)
  }
})

/**
 * Print a trace message to the Cypress command log.
 */
Cypress.Commands.add('trace', (message, ...args) => {
  if (logLevel >= LOGLEVEL.TRACE) {
    cy.log(message, ...args)
  }
})

/**
 * Create a user via Drush using a JSON user object.
 * See qaUsers.json for the definition.
 *
 * TODO: cy.exec is failing to capture the result of user:create,
 * which should provide the UID.
 * See issue: https://github.com/drush-ops/drush/issues/5660
 *
 * @param {object} user JSON user object; see qaUsers.json for the structure.
 * @param {array} roles Array of string roles to pass to Drush (machine names).
 * @param {array} args Array of string arguments to pass to Drush.
 * @param {array} options Array of string options to pass to Drush.
 */
Cypress.Commands.add('createUserWithUserObject', (user, roles = [], args = [], options = []) => {
  let cmd = 'user:create '

  if (args === undefined || !Array.isArray(args)) {
    cy.log('createUserWithUserObject: Pass an array for args.')
    return
  }

  if (options === undefined || !Array.isArray(options)) {
    cy.log('createUserWithUserObject: Pass an array for options.')
    return
  }

  args.unshift(`'${user.userName}'`)
  options.push(`--mail='${user.userEmail}'`, `--password='${user.userPassword}'`)
  cy.log(`Attempting to create: ${user.userName}. `)

  cy.execDrush(cmd, args, options).then(() => {
    // TODO: Bring this in when execDrush reliably
    // returns results.

    // Get the UID, if present.
    // const pattern = '/Created a new user with uid ([0-9]+)/g'

    // let uid = result.match(pattern)

    // Attempt to add the roles.
    // Role(s) may come from the user object or the function arguments.
    if (user.hasOwnProperty('userRoles')) {
      user.userRoles.forEach((role) => {
        roles.push(role)
      })
    }

    roles.forEach((role) => {
      cmd = `user:role:add '${role}' '${user.userName}'`
      cy.execDrush(cmd)
      cy.log(`${role}: If role exists, role assigned to the user ${user.userName}`)
    })
  })
})

/**
 * Delete node via UI given a nid.
 *
 * @param {int} nid Node ID of item to delete.
 */
Cypress.Commands.add('deleteNodeViaUiWithNid', (nid) => {
  const nodeDeleteUrl = atkConfig.nodeDeleteUrl.replace('{nid}', nid)

  // Delete a node page.
  cy.visit(nodeDeleteUrl)
  // cy.get().click()

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500)
  cy.get('#edit-submit').click()

  // Adjust this confirmation to your needs.
  cy.get('.messages--status').invoke('text').should('include', 'has been deleted.')
})

/**
 * Delete user via Drush given an account email.
 *
 * @param {string} email Email of account to delete.
 * @param {[string]} options Array of string options.
 */
Cypress.Commands.add('deleteUserWithEmail', (email, options = []) => {
  if (options === undefined || !Array.isArray(options)) {
    cy.log('deleteUserWithEmail: Pass an array for options.')
  }

  // TODO: --mail doesn't working without an argument.
  // See issue filed with Drush:
  // https://github.com/drush-ops/drush/issues/5652
  //
  // When that's corrected, remove 'dummy.'
  options.push(`--mail='${email}'`)
  const cmd = 'user:cancel -y '

  cy.execDrush(cmd, ['dummy'], [`--mail=${email}`, '--delete-content'])
})

/**
 * Delete user via Drush given a Drupal UID.
 *
 * @param {integer} uid Drupal uid of user to delete.
 */
Cypress.Commands.add('deleteUserWithUid', (uid, options = []) => {
  if (options === undefined || !Array.isArray(options)) {
    cy.log('deleteUserWithUid: Pass an array for options.')
  }

  options.push(`--uid='${uid}'`)
  // TODO: Options isn't being passed to cy.execDrush(), create alias?
  options.push('--delete-content')
  // As of Drush 11.6 --uid doesn't work without a name argument.
  const cmd = 'user:cancel -y dummy '

  cy.execDrush(cmd, [], options)
})

/**
 * Delete user via Drush given a Drupal username.
 *
 * @param {string} userName Drupal username.
 * @param {array} args Array of string arguments to pass to Drush.
 * @param {array} options Array of string options to pass to Drush.
 */
Cypress.Commands.add('deleteUserWithUserName', (userName, args = [], options = []) => {
  const cmd = `user:cancel -y  '${userName}'`

  if (args === undefined || !Array.isArray(args)) {
    cy.log('deleteUserWithUserName: Pass an array for args.')
    return
  }

  if (options === undefined || !Array.isArray(options)) {
    cy.log('deleteUserWithUserName: Pass an array for options.')
    return
  }

  cy.log(`Attempting to delete: ${userName}. `)

  cy.execDrush(cmd, args, options)
})

/**
 * Run drush command locally or remotely depending on the environment.
 * Generally you'll use this function and let it figure out
 * how to execute Drush (locally, remotely, native OS, inside container, etc.).
 *
 * @param {string} cmd The Drush command.
 * @param {array} args Array of string arguments to pass to Drush.
 * @param {array} options Array of string options to pass to Drush.
 * @returns {string} The output from executing the command in a shell.
 */
Cypress.Commands.add(
  'execDrush',
  (cmd, args = [], options = []) => {
    let output = ''

    if (!Array.isArray(args)) {
      throw new Error('execDrush: Pass an array for arguments.')
    }

    if (!Array.isArray(options)) {
      throw new Error('execDrush: Pass an array for options.')
    }

    // eslint-disable-next-line no-use-before-define
    const drushAlias = getDrushAlias()
    const argsString = args.join(' ')
    const optionsString = options.join(' ')
    const command = `${drushAlias} ${cmd} ${argsString} ${optionsString}`

    cy.debugLog(`Full command: ${command}`)
    // Pantheon needs special handling.
    if (atkConfig.pantheon.isTarget) {
      // sshCmd comes from the test and is set in the before()
      cy.execPantheonDrush(command) // Returns stdout (not wrapped).
    } else if (atkConfig.targetSite.isTarget) {
      // Custom SSH connection.
      const envConnection = atkConfig.targetSite.remoteUser
        ? `${atkConfig.targetSite.remoteUser}:${atkConfig.targetSite.remoteHost}`
        : atkConfig.targetSite.remoteHost
      cy.execViaSsh({
        envConnection,
        sshOptions: atkConfig.targetSite.sshOptions || '',
        root: atkConfig.targetSite.root,
        cmd: command,
      })
    } else {
      cy.exec(command, { failOnNonZeroExit: false }).then((result) => {
        output = result.stdout
        cy.debugLog(`cy.exec result: ${output}`)
        return cy.wrap(output, { log: false })
      })
    }
  },
)

/**
 * Delete nod via Drush with nid.
 *
 * @param {number} nid Node ID of item to be deleted.
 */
Cypress.Commands.add('deleteNodeWithNid', (nid) => {
  cy.execDrush(`entity:delete node ${nid}`)
})

/**
 * Exec a command via SSH.
 *
 * @param envConnection {string} server or username:server
 * @param root {string} Root directory, isn't in use so far.
 * @param sshOptions {string} SSH options e.g. -p 2222
 * @return {string} The output from executing the command.
 */
Cypress.Commands.add('execViaSsh', ({
  envConnection, sshOptions, cmd,
}) => {
  // Construct the command that will talk to the Pantheon server including
  // the cmd argument.
  const remoteCmd = `ssh -T ${sshOptions} -o 'StrictHostKeyChecking=no' -o 'AddressFamily inet' ${envConnection} '${cmd}'`

  cy.exec(remoteCmd, { failOnNonZeroExit: false }).then((result2) => {
    const output = result2.stdout
    cy.debugLog(`cy.exec result: ${output}`)

    return cy.wrap(output, { log: false })
  })
})

/**
 * Run a Pantheon Drush command via SSH.
 * Called by execDrush().
 * As of 2023-07-01, various Terminus commands, such as "terminus remote:drush", never return.
 * Using ssh tunnel instead.
 *
 * @param {string} cmd Drush command execDrush() constructs this with args and options.
 * @returns {string} The output from executing the command in a shell.
 */
Cypress.Commands.add('execPantheonDrush', (cmd) => {
  const connectCmd = `terminus connection:info ${atkConfig.pantheon.site}.${atkConfig.pantheon.environment} --format=json`

  // Ask Terminus for SFTP command to send Drush to Pantheon.
  cy.exec(connectCmd, { failOnNonZeroExit: false }).then((result) => {
    const connections = JSON.parse(result.stdout)
    const sftpConnection = connections.sftp_command
    const envConnection = sftpConnection.replace('sftp -o Port=2222 ', '')
    cy.execViaSsh({ envConnection, sshOptions: '-p 2222 ', cmd })
  })
})

/**
 * Get selector by label.
 *
 * @param label {string} label.
 * @return {Cypress.Chainable<HTMLElement>} input.
 */
Cypress.Commands.add('getByLabel', (label) => {
  // cy.log('**getByLabel**')
  cy.contains('label', label)
    .invoke('attr', 'for')
    .then((id) => {
      cy.get(`#${id}`)
    })
})

/**
 * Assert that email has been received to the given address and
 * subject.
 *
 * It is done with one of mail capture software which is configured
 * in {@link atkConfig}. If it's not configured, email verification
 * is skipped.
 *
 * @param mailto Recipient email address.
 * @param subject Expected email subject.
 * @return {Promise<void>}
 */
Cypress.Commands.add('expectEmail', (mailto, subject) => {
  // Helper function to match message subject.
  function matchSubject(actualSubject) {
    if (typeof actualSubject !== 'string') {
      return false
    }
    if (typeof subject === 'string') {
      return actualSubject.includes(subject)
    }
    if (subject instanceof RegExp) {
      return actualSubject.match(subject)
    }
    return false
  }

  // Helper function to match mailto.
  function matchTo(actualTo) {
    if (typeof actualTo !== 'string') {
      return false
    }
    if (mailto instanceof RegExp) {
      return actualTo.match(mailto)
    }
    return actualTo === mailto
  }

  const prov = atkConfig.email?.provider
  if (prov === 'mailpit') {
    cy.wrap(Cypress.config('baseUrl')).then((baseURL) => {
      const emailURL = atkConfig.email.url.replace('{baseURL}', new URL(baseURL).hostname)
      return new URL('/api/v1/messages', emailURL).toString()
    }).as('apiURL')

    // Check email via API.
    cy.get('@apiURL').then((apiUrl) => cy.request(apiUrl)).as('messages')
    cy.get('@messages')
      .then(({ body }) => {
        // List of objects in format:
        // /* cSpell:disable */
        //     {
        //       "ID": "8EuEhuoAVxZzxxiYrr3TVh",
        //       "MessageID": "UR2Rbn5wjvdxYxQ4n68tpk@mailpit",
        //       "Read": true,
        //       "From": {
        //         "Name": "Automated Testing Kit Demonstration",
        //         "Address": "admin@example.com"
        //       },
        //       "To": [
        //         {
        //           "Name": "",
        //           "Address": "admin@example.com"
        //         }
        //       ],
        //       "Cc": [],
        //       "Bcc": [],
        //       "ReplyTo": [],
        //       "Subject": "New release(s) available for Automated ....",
        //       "Created": "2024-11-26T16:11:17.393Z",
        //       "Tags": [],
        //       "Size": 1236,
        //       "Attachments": 0,
        //       "Snippet": "There is a security update available for your ..."
        //     }
        // /* cSpell:enable */
        const { messages } = body
        expect(messages).to.exist

        // Find  a proper message:
        const message = messages
          .find((m) => matchTo(m.To[0].Address)
                && matchSubject(m.Subject))
        expect(message, `To: <${mailto}>
Subject: ${subject}`).to.exist
      })
  } else if (prov === 'testmail') {
    const { namespace, apiKey } = atkConfig.email
    if (typeof mailto !== 'string' || !new RegExp(`^${namespace}\\.\\w+@inbox\\.testmail\\.app$`).test(mailto)) {
      throw new Error(`Test email address must be in format ${namespace}.{tag}@inbox.testmail.app`)
    }

    cy.request(`https://api.testmail.app/api/json?apikey=${apiKey}&namespace=${namespace}&pretty=true`).then(({ body }) => {
      if (body.result !== 'success') {
        // Body contains message.
        throw body
      } else {
        // Find a proper message:
        const message = body.emails
          .find((email) => matchTo(email.to)
                && matchSubject(email.subject))
        expect(message, `To: <${mailto}>
Subject: ${subject}`).to.exist
      }
    })
  } else {
    cy.log('Email verification skipped. Configure **email** in **cypress.atk.config.js** to enable.')
  }
})

/**
 * Returns Drush alias per environment.
 * Adapt this to the mechanism that communicates to the remote server.
 *
 * @returns {string} The Drush command i.e 'lando drush ', etc.
 */
function getDrushAlias() {
  let cmd

  // Drush to Pantheon requires Terminus.
  if (atkConfig.pantheon.isTarget) {
    cmd = 'drush '
  } else {
    // Fetch the Drush command appropriate to the operating mode.
    cmd = `${atkConfig.drushCmd} `
  }
  return cmd
}

/**
 * Get Iframe body given an id.
 *
 * Get the iframe > document > body
 * and retry until the body element is not empty
 */
Cypress.Commands.add('getIframeBodyWithId', () => cy.get('iframe[id=mvActiveArea]')
  .its('0.contentDocument.body')
  .should('not.be.empty')
// Wraps “body” DOM element to allow
// chaining more Cypress commands, like “.find(...)”
// https://on.cypress.io/wrap
  .then(cy.wrap, { log: false }))

/**
 * Return the UID of a user given an email.
 *
 * @param {string} email Email of the account.
 * @returns {integer} UID of user.
 */
Cypress.Commands.add('getUidWithEmail', (email) => {
  const cmd = `user:info --mail=${email} --format=json`

  cy.execDrush(cmd).then((result) => {
    let uid = 0
    if (result) {
      // Fetch uid from json object, if present.
      uid = Object.values(JSON.parse(result))[0]?.uid
    }

    return uid
  })
})

/**
 * Return the Username of a user given an email.
 *
 * @param {string} email Email of the account.
 * @returns {string} Username of user.
 */
Cypress.Commands.add('getUsernameWithEmail', (email) => {
  const cmd = `user:info --mail=${email} --format=json`

  cy.execDrush(cmd).then((result) => {
    let name
    if (result) {
      // Fetch name from json object, if present.
      name = Object.values(JSON.parse(result))[0]?.name
    }

    return name
  })
})

/**
 * Log in via the login form. Test this once then switch to faster mechanisms.
 *
 * @param {object} account JSON object; see structure of qaUserAccounts.json.
 */
Cypress.Commands.add('logInViaForm', (account) => {
  const { logInUrl } = atkConfig

  Cypress.session.clearAllSavedSessions()

  cy.session(
    account.userName,
    () => {
      cy.visit(logInUrl)

      // It is ok for the username to be visible in the Command Log.
      expect(account.userName, 'username was set').to.be.a('string').and.not.be.empty

      // But the password value should not be shown.
      if (typeof account.userPassword !== 'string' || !account.userPassword) {
        throw new Error('Missing password value..')
      }
      cy.get('#edit-name').type(account.userName, { force: true })

      // Type password and the password value should not be shown - {log: false}.
      cy.get('#edit-pass').type(account.userPassword, {
        log: false,
        force: true,
      })

      // Click the log in button using ID.
      cy.get('#user-login-form > #edit-actions > #edit-submit').click({ force: true })
      cy.get('head meta').then(cy.log)
    },
    {
      validate() {
        cy.visit('')

        // Confirm log in worked.
        cy.get('head meta').then(cy.log)

        // Optional.
        // should('include.text', 'user')
      },
    },
  )
})

/**
 * Input text into editor.
 *
 * @param text {string} Text content.
 */
Cypress.Commands.add('inputCKEditor', (text) => {
  cy.get('.ck-editor__main > .ck').then((element) => {
    const editor = element[0].ckeditorInstance
    editor.setData(text)
  })
})

/**
 * Save entity.
 */
Cypress.Commands.add('save', () => {
  cy.contains('Save').click()
})

/**
 * Extract the media id that was added by
 * automated_testing_kit_preprocess_image().
 *
 * @return {Cypress.Chainable<string>}
 */
Cypress.Commands.add('getMid', { prevSubject: true }, (element) => {
  const attr = element.attr('data-media-id')
  if (!attr) {
    throw new Error(atkMessages.ATK_MID_MISSING)
  }
  return attr
})

/**
 * Extract the nid placed in the body class by this hook:
 * automated_testing_kit.module:automated_testing_kit_preprocess_html().
 *
 * @return {Cypress.Chainable<string>}
 */
Cypress.Commands.add('getNid', () => {
  cy.document().then((document) => {
    const bodyClass = document.body.className
    const match = bodyClass.match(/node-nid-(\d+)/)
    if (!match) {
      throw new Error(atkMessages.ATK_NID_MISSING)
    }

    // Get the nid.
    const nid = parseInt(match[1], 10)
    return nid
  })
})

/**
 * Log in with user:login given a user id.
 *
 * @param {object} page Page object.
 * @param {integer} uid Drupal user id.
 */
Cypress.Commands.add('logInViaUli', (uid) => {
  let useUid
  if (uid === undefined) {
    useUid = 1
  } else {
    useUid = uid
  }

  Cypress.session.clearAllSavedSessions()

  const cmd = `user:login --uid=${useUid}`
  const baseUrl = Cypress.config('baseUrl')

  cy.execDrush(cmd, [], [`--uri=${baseUrl}`]).then((result) => {
    cy.visit(result)
  })
})

/**
 * Log out user via the UI.
 *
 * @param {object} page Page object.
 */
Cypress.Commands.add('logOutViaUi', () => {
  cy.visit(atkConfig.logOutUrl)
  // Confirm if needed.
  cy.url().then((url) => {
    if (url.match(/confirm/)) {
      cy.get('input[value="Log out"]').click()
    }
  })
})

/**
 * Get Drupal configuration via Drush (cget).
 *
 * @param {string} objectName Name of configuration category.
 * @param {string} key Name of configuration setting.
 * @return {*} Value of configuration setting.
 */
Cypress.Commands.add('getDrupalConfiguration', (objectName, key) => {
  const cmd = `cget ${objectName} ${key} --format=json`

  cy.execDrush(cmd).then((output) => {
    const obj = JSON.parse(output)
    return obj[`${objectName}:${key}`]
  })
})

/**
 * Set Drupal configuration via Drush (cset).
 *
 * @param {string} objectName Name of configuration category.
 * @param {string} key Name of configuration setting.
 * @param {*} value Value of configuration setting.
 */
Cypress.Commands.add('setDrupalConfiguration', (objectName, key, value) => {
  const cmd = `cset -y --input-format=yaml ${objectName} ${key} '${JSON.stringify(value)}'`

  cy.execDrush(cmd)
})
