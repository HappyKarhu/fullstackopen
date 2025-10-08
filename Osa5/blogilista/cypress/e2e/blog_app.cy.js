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
 
    cy.clearLocalStorage()
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

    //5.21
    it('User who created a blog can delete it', function() {
  
      cy.contains('Create new Blog').click()
      cy.get('input[name="title"]').type('Blog to be deleted')
      cy.get('input[name="author"]').type('Matti Luukkainen')
      cy.get('input[name="url"]').type('http://example.com')
      cy.contains('create').click()

      cy.contains('Blog to be deleted Matti Luukkainen').contains('view').click()
      cy.get('button').contains('delete').click()
      cy.contains('Blog to be deleted', { timeout: 10000 }).should('not.exist')

  })


  
  //5.22

    it('delete button is shown only for the creator', function() {
    cy.contains('Create new Blog').click()
    cy.get('input[name="title"]').type('Blog by User')
    cy.get('input[name="author"]').type('Matti Luukkainen')
    cy.get('input[name="url"]').type('http://example.com')
    cy.contains('create').click()

    // log out user-Matti
    cy.contains('logout').click()

    
    const user2 = {
      name: 'Other User',
      username: 'seconduser',
      password: 'password'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user2)

    // log in as user2
    cy.get('input[name="username"]').type('seconduser')
    cy.get('input[name="password"]').type('password')
    cy.get('#login-button').click()

    cy.reload()

    cy.contains('Blog by User', { timeout: 6000 }).should('exist')
    cy.contains('Blog by User').contains('view').click()
    cy.get('.blog-details').find('button').contains('delete').should('not.exist')
  })

//5.23
    it('blogs are ordered by likes, most liked first', function() {
      // create first blog
      const blogs = [
        { title: 'First Blog', author: 'A', url: 'http://a.com' },
        { title: 'Second Blog', author: 'B', url: 'http://b.com' },
        { title: 'Third Blog', author: 'C', url: 'http://c.com' }
      ]

      blogs.forEach(blog => {
        cy.contains('Create new Blog').click({ force: true })
        cy.get('input[name="title"]').type(blog.title)
        cy.get('input[name="author"]').type(blog.author)
        cy.get('input[name="url"]').type(blog.url)
        cy.contains('create').click()
        cy.wait(300)
      })

      cy.contains('First Blog').contains('view').click()
      cy.contains('Second Blog').contains('view').click()
      cy.contains('Third Blog').contains('view').click()

      for (let i = 0; i < 3; i++) {
        cy.contains('Second Blog').parent().find('button').contains('like').click()
        cy.wait(300)
      }
      for (let i = 0; i < 2; i++) {
        cy.contains('Third Blog').parent().find('button').contains('like').click()
        cy.wait(300)
      }
      cy.contains('First Blog').parent().find('button').contains('like').click()
      cy.wait(300)

      cy.get('.blog').eq(0).should('contain', 'Second Blog')
      cy.get('.blog').eq(1).should('contain', 'Third Blog')
      cy.get('.blog').eq(2).should('contain', 'First Blog')
    })

})