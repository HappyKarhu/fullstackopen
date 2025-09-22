const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') //express app
const Blog = require('../models/blog')


const api = supertest(app)

const initialBlogs = [ //testing blogs
  { title: 'First Blog', author: 'Author 1', url: 'http://example.com/1', likes: 6 },
  { title: 'Second Blog', author: 'Author 2', url: 'http://example.com/2', likes: 12 }
]

beforeEach(async () => { //reset DB before test
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/) //Checking the value of the header-if string the value of the header must be exactly the same
})

test('unique identifier property of blogs is named id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

  for (const blog of blogs) {
    assert.ok(blog.id, 'id property is missing')
    assert.strictEqual(blog._id, undefined)
  }
})

after(async () => { //closing DB
  await mongoose.connection.close()
})
