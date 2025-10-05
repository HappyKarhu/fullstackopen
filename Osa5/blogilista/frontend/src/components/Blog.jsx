import { useState } from 'react'
import myBlogs from '../services/blogs'

const Blog = ({ blog, updateBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false)//details not shown, only title&author
  const [backgroundCOlor, setBackgroundCOlor] =useState('white')
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    background: backgroundCOlor
  }

  const toggleVisibility = () => {
    setVisible(!visible)
    setBackgroundCOlor (visible ? 'yellow' : '#5226ccff')
  }//true, url,likes &author is visible

  const handleLike = async () => {
    if (!blog.id) {
      console.error('Id is missing, cannot like it')
      return
    }
    const updateBlogData = {
      user: blog.user ? (typeof blog.user === 'string' ? blog.user : blog.user.id) : null,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    try {
      const returnedBlog = await myBlogs.updateBlog(blog.id, updateBlogData)
      updateBlog(returnedBlog)
    } catch (error) {
      console.error('Failed to like blog:', error.response?.data || error.message)
    }
  }
  return (
    <div style={blogStyle}>
      <div className="blog-title-author">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
      likes {blog.likes} <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.author}</div>
          <div><button onClick={() => deleteBlog(blog.id, blog.title, blog.author)}>delete</button></div>
        </div>
      )}
    </div>
  )
}

export default Blog