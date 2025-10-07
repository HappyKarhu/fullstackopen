describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

      //new user for test
      const user = {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
 
    
    cy.visit('http://localhost:5173')
  })

  //5.17
  it('Login form is shown', function() {
    cy.get('input[name="username"]').should('exist')
    cy.get('input[name="password"]').should('exist')
    cy.get('#login-button').should('exist')
  })
})


//5.18
describe('Login', function() {
  beforeEach(function() {
    cy.clearLocalStorage()
    cy.visit('http://localhost:5173')
  })
    it('succeeds with correct credentials', function() {
      
      cy.contains('label', 'username').type('mluukkai')
      cy.contains('label', 'password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('login fails with wrong credentials', function() {
      cy.get('#login-button').should('exist')
      cy.get('input[name="username"]').should('exist')
      cy.get('input[name="password"]').should('exist')
      cy.get('input[name="username"]').type('mluukkai')
      cy.get('input[name="password"]').type('wrongpassword')
      cy.get('#login-button').click()

      cy.get('.wrongUser')
        .should('contain', 'Wrong Username or Password')

      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
    })
  })

  //5.19
  describe('When logged in', function() {//same commans as in logintest
    beforeEach(function() {
      cy.visit('http://localhost:5173')
      cy.get('input[name="username"]').type('mluukkai')
      cy.get('input[name="password"]').type('salainen')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('Create new Blog').click()

      cy.get('input[name="title"]').should('be.visible').type('Cypress Test Blog')
      cy.get('input[name="author"]').type('Matti Luukkainen')
      cy.get('input[name="url"]').type('http://example.com')

      cy.contains('create').click()
      cy.contains('Cypress Test Blog Matti Luukkainen')
    })

    //5.20
    it('blog can be liked', function() {
      cy.contains('Create new Blog').click()
      cy.get('input[name="title"]').type('Blog to be liked')
      cy.get('input[name="author"]').type('Matti Luukkainen')
      cy.get('input[name="url"]').type('http://example.com')
      cy.contains('create').click()
      cy.contains('Blog to be liked Matti Luukkainen')
      cy.contains('Blog to be liked Matti Luukkainen').contains('view').click()
      cy.get('.blog-details').contains('like').click()
      cy.get('.blog-details').should('contain', 'likes 1')
    })
  })