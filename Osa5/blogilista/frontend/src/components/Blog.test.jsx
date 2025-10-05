import React from 'react'
import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import Blog from './Blog'

test('renders title and author', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Blogger1',
    url: 'https://example.com',
    likes: 5
  }
  render(<Blog blog={blog} updateBlog={() => {}} deleteBlog={() => {}} />)
const titleAuthorDiv = screen.getByText(
    (content, element) =>
      element.className === 'blog-title-author' &&
      content.includes(blog.title) &&
      content.includes(blog.author)
  )
  expect(titleAuthorDiv).toBeDefined()
  // Check that url and likes are not rendered
  expect(screen.queryByText(blog.url)).toBeNull()
  expect(screen.queryByText(`likes ${blog.likes}`)).toBeNull()
})