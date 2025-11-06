describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");

    //new user for test
    const user = {
      name: "Matti Luukkainen",
      username: "mluukkai",
      password: "salainen",
    };
    cy.request("POST", "http://localhost:3003/api/users/", user);

    cy.clearLocalStorage();
    cy.visit("http://localhost:5173");
  });

  //5.17
  it("Login form is shown", function () {
    cy.get('input[name="username"]').should("exist");
    cy.get('input[name="password"]').should("exist");
    cy.get("#login-button").should("exist");
  });
});

//5.18
describe("Login", function () {
  beforeEach(function () {
    cy.clearLocalStorage();
    cy.visit("http://localhost:5173");
  });
  it("succeeds with correct credentials", function () {
    cy.contains("label", "username").type("mluukkai");
    cy.contains("label", "password").type("salainen");
    cy.get("#login-button").click();

    cy.contains("Matti Luukkainen logged in");
  });

  it("login fails with wrong credentials", function () {
    cy.get("#login-button").should("exist");
    cy.get('input[name="username"]').should("exist");
    cy.get('input[name="password"]').should("exist");
    cy.get('input[name="username"]').type("mluukkai");
    cy.get('input[name="password"]').type("wrongpassword");
    cy.get("#login-button").click();

    cy.get(".wrongUser").should("contain", "Wrong Username or Password");

    cy.get("html").should("not.contain", "Matti Luukkainen logged in");
  });
});

//5.19
describe("When logged in", function () {
  //same commans as in logintest
  beforeEach(function () {
    cy.visit("http://localhost:5173");
    cy.get('input[name="username"]').type("mluukkai");
    cy.get('input[name="password"]').type("salainen");
    cy.get("#login-button").click();
  });

  it("A blog can be created", function () {
    cy.contains("Create new Blog").click();

    cy.get('input[name="title"]')
      .should("be.visible")
      .type("Cypress Test Blog");
    cy.get('input[name="author"]').type("Matti Luukkainen");
    cy.get('input[name="url"]').type("http://example.com");

    cy.contains("create").click();
    cy.contains("Cypress Test Blog Matti Luukkainen");
  });

  //5.20
  it("blog can be liked", function () {
    cy.contains("Create new Blog").click();
    cy.get('input[name="title"]').type("Blog to be liked");
    cy.get('input[name="author"]').type("Matti Luukkainen");
    cy.get('input[name="url"]').type("http://example.com");
    cy.contains("create").click();
    cy.contains("Blog to be liked Matti Luukkainen");
    cy.contains("Blog to be liked Matti Luukkainen").contains("view").click();
    cy.get(".blog-details").contains("like").click();
    cy.get(".blog-details").should("contain", "likes 1");
  });

  //5.21
  it("User who created a blog can delete it", function () {
    cy.contains("Create new Blog").click();
    cy.get('input[name="title"]').type("Blog to be deleted");
    cy.get('input[name="author"]').type("Matti Luukkainen");
    cy.get('input[name="url"]').type("http://example.com");
    cy.contains("create").click();

    cy.contains("Blog to be deleted Matti Luukkainen").contains("view").click();
    cy.get("button").contains("delete").click();
    cy.contains("Blog to be deleted", { timeout: 10000 }).should("not.exist");
  });

  //5.22
  it("delete button is shown only for the creator", function () {
    cy.contains("Create new Blog").click();
    cy.get('input[name="title"]').type("Blog by User");
    cy.get('input[name="author"]').type("Matti Luukkainen");
    cy.get('input[name="url"]').type("http://example.com");
    cy.contains("create").click();
    cy.contains("Blog by User", { timeout: 10000 }).should("exist");
    // log out user-Matti
    cy.contains("logout").click();

    const user2 = {
      name: "Other User",
      username: "seconduser",
      password: "password",
    };
    cy.request("POST", "http://localhost:3003/api/users/", user2).then(() => {
      cy.wait(500);
    });

    // log in as user2
    cy.get('input[name="username"]').type("seconduser");
    cy.get('input[name="password"]').type("password");
    cy.get("#login-button").click();

    cy.contains("Blog by User", { timeout: 10000 }).should("exist");
    cy.contains("Blog by User").contains("view").click();

    cy.get(".blog-details")
      .find("button")
      .contains("delete")
      .should("not.exist");
  });
});

//5.23

describe("Blogs ordered by likes", function () {
  const user = {
    name: "Matti Luukkainen",
    username: "mluukkai",
    password: "salainen",
    token: "testtoken123",
  };

  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    cy.request("POST", "http://localhost:3003/api/users/", {
      name: user.name,
      username: user.username,
      password: user.password,
    })
      .then(() => {
        return cy
          .request("POST", "http://localhost:3003/api/login", {
            username: user.username,
            password: user.password,
          })
          .then((response) => {
            user.token = response.body.token;

            const blogs = [
              {
                title: "The title with the most likes",
                author: "A",
                url: "http://a.fi",
                likes: 6,
              },
              {
                title: "The title with the second most likes",
                author: "B",
                url: "http://b.fi",
                likes: 3,
              },
            ];

            return Cypress.Promise.all(
              blogs.map((blog) =>
                cy.request({
                  method: "POST",
                  url: "http://localhost:3003/api/blogs",
                  body: blog,
                  headers: { Authorization: `Bearer ${user.token}` },
                }),
              ),
            );
          });
      })

      .then(() => {
        cy.visit("http://localhost:5173");
        cy.window().then((win) => {
          win.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
        });
        cy.visit("http://localhost:5173");
      });
  });

  it("blogs are ordered by likes, most liked first", function () {
    cy.get(".blog").should("have.length", 2);
    cy.get(".blog").eq(0).should("contain", "The title with the most likes");
    cy.get(".blog")
      .eq(1)
      .should("contain", "The title with the second most likes");
  });
});
