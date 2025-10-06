describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    .then(() => {
  //new user for test
      const user ={
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    return cy.request('POST', 'http://localhost:3003/api/users/', user)
    })
  .then(() => {
  cy.visit('http://localhost:5173')
  
})
  })
  it('Login form is shown', function() {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })


describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.contains('button', 'login').click()
      cy.contains('label', 'username').type('mluukkai')
      cy.contains('label', 'password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('login fails with wrong credentials', function() {
      cy.contains('button', 'login').click()
      cy.contains('label', 'username').type('mluukkai')
      cy.contains('label', 'password').type('wrongpassword')
      cy.get('#login-button').click()

      cy.get('.wrongUser')
        .should('contain', 'Wrong Username or Password')

      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
    })
  })
})