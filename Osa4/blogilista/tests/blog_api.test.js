const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') //express app
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const initialBlogs = [ //testing blogs
  { title: 'First Blog', author: 'Author 1', url: 'http://example.com/1', likes: 6 },
  { title: 'Second Blog', author: 'Author 2', url: 'http://example.com/2', likes: 12 }
]

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
  })

test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

test('unique identifier property of blogs is named id', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(blog => {
      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Blog 3',
    author: 'Author 3',
    url: 'http://example.com/3',
    likes: 7
  }

await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert.ok(titles.includes('Blog 3'))
})

//that if the likes property is missing from the request, it will default to the value 0
test('missing likes property defaults to 0', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Author 4',
    url: 'http://example.com/4'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Author 5',
    url: 'http://example.com/5',
    likes: 4
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400) 

  const blogsAtEnd = await Blog.find({})
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length) // only previous valid blogs are there
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'Blog without url',
    author: 'Author 6',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400) 

  const blogsAtEnd = await Blog.find({})
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length) // still only previous valid blogs
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await Blog.find({})
    const titles = blogsAtEnd.map(b => b.title)

    assert(!titles.includes(blogToDelete.title))
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1)
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const validNonexistingId = new mongoose.Types.ObjectId()

    await api
      .delete(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

test('fails with status code 400 if id is invalid', async () => {
      await api.delete('/api/blogs/invalidid123').expect(400)
    })
  })
})

after(async () => { //closing DB
  await mongoose.connection.close()
})
