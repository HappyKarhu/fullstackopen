import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')


  const addBlog = async (event) => {//event is better because is a form submission
    event.preventDefault() //prevents page reload
    console.log('adding blog', title, author, url)//create a new blog object
    const newBlog = {
      title,
      author,
      url
    }
    const createdBlog = await blogService.createBlog(newBlog)
    setBlogs(blogs.concat(createdBlog))
    setTitle('')
    setAuthor('')
    setUrl('')
    setNotification(`A new blog ${createdBlog.title} by ${createdBlog.author} added`)
    setNotificationType('success')
    setTimeout(() => { setNotification(null) }, 8000)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    try {
    const loggedUser = await loginService.login({ username, password })
    window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(loggedUser)
      )
  setUser(loggedUser)
  setUsername('')
  setPassword('')
  blogService.setToken(loggedUser.token)
} 
catch (error) {
  setNotification('Wrong Username or Password - Please, try again')
  setNotificationType('error')
  setTimeout(()=>{ setNotification(null) }, 8000)
}

}

const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }
  

  if (user === null) { //if noone is logged in
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification} type={notificationType} />
        <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notification} type={notificationType}/>
      <p>{user.name} logged in. <button onClick={handleLogout}>logout</button>
      </p>
      <h2>Create new Blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            Title: <input
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Author: <input
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url: <input
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>
        <br></br><button type="submit">CREATE</button>
      </form>
      <br />
    
      {blogs.map(blog =>
        <li key={blog.id}> 
        <strong>Blog's title: </strong> {blog.title} &nbsp;-&nbsp;<strong>Blogger: </strong> {blog.author}
        </li>
      )}
  </div>
  )
}
export default App