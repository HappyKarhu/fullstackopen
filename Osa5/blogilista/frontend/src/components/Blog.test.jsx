import React from 'react'
import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

vi.mock('../services/blogs', () => ({
  default: {
    updateBlog: vi.fn().mockResolvedValue({}),
  },
}))
//test 5.13
test('test forrenders title and author', () => {
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

//test 5.14
test('test forshows url and likes after clicking the view button', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Blogger1',
    url: 'https://example.com',
    likes: 5
  }

  render(<Blog blog={blog} updateBlog={() => {}} deleteBlog={() => {}} />)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(screen.getByText(blog.url)).toBeDefined()
  expect(screen.getByText(`likes ${blog.likes}`)).toBeDefined()
})

//test 5.15
test('calls updateBlog handler twice when like button is clicked twice', async () => {
  const blog = {
    id: '12345',
    title: 'Component testing is done with react-testing-library',
    author: 'Blogger1',
    url: 'https://example.com',
    likes: 5
  }
  const updateBlog = vi.fn()

  render(<Blog blog={blog} updateBlog={updateBlog} deleteBlog={() => {}} />)
  const user = userEvent.setup()
  await user.click(screen.getByText('view'))
  const likeButton = screen.getByText('like')
  //2times, to click like button twice
  await user.click(likeButton)
  await user.click(likeButton)
  expect(updateBlog).toHaveBeenCalledTimes(2)
})