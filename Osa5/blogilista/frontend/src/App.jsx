import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/notification'
import CreateBlogForm from './components/createBlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')


  const addBlog = async (blogObject) => {
  try {
    const createdBlog = await blogService.createBlog(blogObject)
    createdBlog.user = { username: user.username, name: user.name, id: user.id }
    setBlogs(blogs.concat(createdBlog))
    setNotification(`A new blog ${createdBlog.title} by ${createdBlog.author} added`)
    setNotificationType('success')
    setTimeout(() => setNotification(null), 8000)
  } catch (error) {
    console.error(error)
  }
}

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs => setBlogs(blogs))
    }
  }, [user])


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
    catch {
      setNotification('Wrong Username or Password - Please, try again')
      setNotificationType('error')
      setTimeout(() => { setNotification(null) }, 8000)
    }

  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setBlogs([])
    setNotification(null)
  }

  const updateBlogInState = (returnedBlog) => {
    setBlogs(blogs.map(blog => blog.id === returnedBlog.id ? returnedBlog : blog))
  }
  

  const handleDelete = async (Id, title, author) => {
    if (window.confirm(`Remove blog: ${title} by ${author}?`)) {
      await blogService.deleteBlog(Id)
      setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== Id))
    setNotification(`Deleted blog ${title} by ${author}`)
    setNotificationType('success')
    setTimeout(() => setNotification(null), 8000)
    }
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
              name="username"
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
                name="password"
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button id="login-button" type="submit">login</button>
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

      <Togglable buttonLabel='Create new Blog' data-cy="toggle-create-blog">
        <CreateBlogForm createBlog={addBlog} />
      </Togglable>
      <br />

      <div className="blogs-list">
      {blogs.toSorted((a, b) => b.likes - a.likes).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          updateBlog={updateBlogInState}
          deleteBlog={handleDelete}
        />
      )}
    </div>
  </div>
)
}
export default App