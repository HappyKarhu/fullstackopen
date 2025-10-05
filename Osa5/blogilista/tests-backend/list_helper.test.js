const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []
  assert.strictEqual(listHelper.dummy(blogs), 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 5)
  })
})

describe('favorite blog', () => {
  const blogs = [
    {
      _id: '1',
      title: 'Blog 1',
      author: 'Author 1',
      url: 'http://example.com/1',
      likes: 5
    },
    {
      _id: '2',
      title: 'Blog 2',
      author: 'Author 2',
      url: 'http://example.com/2',
      likes: 26
    },
    {
      _id: '3',
      title: 'Blog 3',
      author: 'Author 3',
      url: 'http://example.com/3',
      likes: 13
    }
  ]

  test('returns the blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, {
      _id: '2',
      title: 'Blog 2',
      author: 'Author 2',
      url: 'http://example.com/2',
      likes: 26
    })
  })

  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })

  test('when multiple favorites, returns one of them', () => {
    const tieBlogs = [
      { title: 'A', author: 'X', likes: 5 },
      { title: 'B', author: 'Y', likes: 5 }
    ]
    const result = listHelper.favoriteBlog(tieBlogs)
    assert(result.likes === 5)
  })
})