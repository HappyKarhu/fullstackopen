import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/notification";
import CreateBlogForm from "./components/createBlogForm";
import Togglable from "./components/Togglable";
import { useDispatch, useSelector } from 'react-redux';
import { setNotification, clearNotification } from './redux/notificationReducer';
import { fetchBlogs, createBlog, updateBlog, removeBlog } from './redux/blogReducer'

const App = () => {
  const blogs = useSelector((state) => state.blogs);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch()

  const addBlog = async (blogObject) => {
    try {
      const resultAction=await dispatch(createBlog(blogObject));

      if (createBlog.fulfilled.match(resultAction)) {
        dispatch(setNotification({
          message: `A new blog ${resultAction.payload.title} by ${resultAction.payload.author} added`,
          type: 'success',
        })
        )
      
      setTimeout(() => {
        dispatch(clearNotification())
      }, 8000)
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      dispatch(fetchBlogs())
    }
  }, [user, dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const loggedUser = await loginService.login({ username, password });
      window.localStorage.setItem(
        "loggedBlogappUser",
        JSON.stringify(loggedUser),
      );
      setUser(loggedUser);
      setUsername("");
      setPassword("");
      blogService.setToken(loggedUser.token);
    } catch {
    dispatch(setNotification({message: 'Wrong Username or Password - Please, try again',type: 'error'}))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 8000)
      }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    setBlogs([]);
    dispatch(clearNotification());
  };


  const handleDelete = async (id, title, author) => {
  if (window.confirm(`Remove blog: ${title} by ${author}?`)) {
    try {
      await dispatch(removeBlog(id));
      dispatch(setNotification({ 
        message: `Deleted blog ${title} by ${author}`, 
        type: 'success' 
      }));
      setTimeout(() => dispatch(clearNotification()), 8000);
    } catch (error) {
      console.error("Failed to delete blog:", error.response?.data || error.message);
    }
  }
};

//za like
const handleLike = (blog) => {
  dispatch(updateBlog({ id: blog.id, likes: blog.likes + 1 }));
  
};

  if (user === null) {
    //if noone is logged in
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
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
          <button id="login-button" type="submit">
            login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification />
      <p>
        {user.name} logged in. <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="Create new Blog" data-cy="toggle-create-blog">
        <CreateBlogForm createBlog={addBlog} />
      </Togglable>
      <br />

      <div className="blogs-list">
        {blogs
          .toSorted((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              updateBlog={handleLike}
              deleteBlog={handleDelete}
              
            />
          ))}
      </div>
    </div>
  );
};
export default App