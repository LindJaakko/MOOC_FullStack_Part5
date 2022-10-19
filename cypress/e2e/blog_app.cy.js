describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Test User',
      username: 'TestUser',
      password: 'TestPassword',
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('TestUser')
      cy.get('#password').type('TestPassword')
      cy.get('#login-button').click()

      cy.contains('Test User logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('TestUser')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Test User logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'TestUser', password: 'TestPassword' })
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#title').type('Test title')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('Test URL')
      cy.get('#submit').click()
      cy.contains('Test title Test Author')
    })
  })

  describe('and some blogs exists', function () {
    beforeEach(function () {
      cy.login({ username: 'TestUser', password: 'TestPassword' })
      cy.createBlog({ title: 'Blog1', author: 'Author1', url: 'www.1.fi' })
      cy.createBlog({ title: 'Blog2', author: 'Author2', url: 'www.2.fi' })
      cy.createBlog({ title: 'Blog3', author: 'Author3', url: 'www.3.fi' })
    })

    it('user can like a blog', function () {
      cy.contains('Blog2').parent().as('theBlog')
      cy.get('@theBlog').contains('view').click()
      cy.get('@theBlog').contains('like').click()
      cy.get('@theBlog').should('contain', '1')
    })
  })
})
