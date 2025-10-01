import { useState } from 'react'

const Blog = ({ blog }) => {
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

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      
  
  {visible && (
    <div> 
    <div>{blog.url}</div>
    <div>
      likes {blog.likes} <button>like</button></div>
    <div>{blog.author}</div>
    </div>
  )}
  </div>
)
}

export default Blog