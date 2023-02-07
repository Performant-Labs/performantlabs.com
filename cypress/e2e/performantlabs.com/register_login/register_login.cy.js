/// <reference types="Cypress" />
/// <reference types="cypress-data-session" />

const userAccount = require("../../../fixtures/createUserUsingDrush.json")

describe('User registration and login tasks', () => {
  before(function () {
    cy.prepareForTestRun()
  })

  // Keep for playing with.
  it.only("(PER-0000) Play", {languages: ['en'],  regions: ['us'], tags: ['register-login', 'anonymous', 'smoke']}, () => {
    // Clean up user in case it exists.
  cy.deleteUserWithUserName(userAccount.userName)
  })

  //
  // Register the Ethereal user and confirm email reaches Ethereal.
  //
  it("(PER-1000) Register with form", {languages: ['en'],  regions: ['us'], tags: ['register-login', 'anonymous', 'smoke']}, () => {
    // Clean up user in case it exists.
    cy.deleteUserWithUserName(userAccount.userName)

    cy.visit('user/register').then(() => {
      cy.get('#edit-mail').type(userAccount.userEmail)
      cy.get('#edit-name').type(userAccount.userName)
      cy.get('#edit-submit').click()
    })

    // Should see the thank-you message.
    cy.contains('Thank you for applying for an account.')

    // But there shouldn't be an error on it.
    // cy.get('.alert').should('not.exist')

    // Note that experiencing this problem and clearing isn't working:
    // https://github.com/cypress-io/cypress/issues/14590
    Cypress.session.clearSessionStorage

    // Check for registration email at Ethereal.
    cy.visit('https://ethereal.email/login', true).then( () => {
      cy.get('#address').type(userAccount.userEmail)
      cy.get('#password').type(userAccount.userPassword)
      cy.get('form > :nth-child(5) > .btn').click()
      cy.contains('Logged in as ' + userAccount.userEmail)
    })

    // Give the email some time to arrive.
    cy.wait(2000)

    cy.visit('https://ethereal.email/messages', true)
    cy.contains('Messages for ' + userAccount.userEmail)
    cy.contains('Account details for ' + userAccount.userName).click()
  })

  //
  // Log in with the login form using at least administration
  // and authenticated account.
  //
  it("(PER-1010) Login with form", {languages: ['en'],  regions: ['us'], tags: ['register-login', 'anonymous', 'smoke']}, () => {

    let accountsToTest = new Map();
    accountsToTest.set('admin', Cypress.env().account.admin);
    accountsToTest.set('authenticated', Cypress.env().account.authenticated);

    cy.visit(Cypress.env('url').login)

    for (const account of accountsToTest) {
      cy.session(account, () => {
        // Use log in url stored in the environment.
        cy.visit(Cypress.env('url').login)

        cy.get('#edit-name').type(account[1].username)

        // Type password and the password value should not be shown - {log: false}.
        cy.get('#edit-pass').type(account[1].password, { log: false })

        // Click the log in button using ID.
        cy.get('#edit-submit').click()
        cy.contains('Member for').then(console.log)
      })
    }
  })

  //
  // Log in with a POST request.
  // TODO: get this working.
  //
  it("(PER-1012) Login with POST", {languages: ['en'],  regions: ['us'], tags: ['register-login', 'anonymous', 'smoke']}, () => {

    cy.drupalLogin(userAccount.userName, userAccount.userPassword)

    cy.visit('admin')

    // cy.visit(Cypress.env('url').login)
    // const loginUrl = Cypress.config('baseUrl') + '/' + Cypress.env('url').login
    // const loginUrl = Cypress.config('baseUrl') + '/' + Cypress.env('url').login

    // cy.request({
    //   method: 'POST',
    //   url: '/user/login',
    //   form: true,
    //   body: {
    //     name: 'qa_administrator',
    //     pass: 'qa_administrator',
    //     form_id: 'user_login_form'
    //   }
    // })
    // cy.getCookie('cypress-session-cookie').should('exist')
    // cy.visit('admin')
  })

  //
  // Create a user with Drush from a fixture and delete it.
  //
  it("(PER-1020) Create and delete user", {languages: ['en'],  regions: ['us'], tags: ['register-login', 'anonymous', 'smoke']}, () => {
    cy.deleteUserWithUserName(userAccount.userName)
    cy.createUserWithUserObject(userAccount)
    // Clean up after ourselves.
    cy.deleteUserWithUserName(userAccount.userName)
  })
})
