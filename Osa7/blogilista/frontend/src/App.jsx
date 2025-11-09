import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/notification";
import CreateBlogForm from "./components/createBlogForm";
import Togglable from "./components/Togglable";
import { useUser } from "./context/UserContext";
import { useNotification } from "./context/NotificationContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const App = () => {
  const { user, dispatch: userDispatch } = useUser();
  const { dispatch} = useNotification();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const queryClient = useQueryClient();
  
  //fetch blogs when log in with ReactQuery
  const { data: blogs = [], isLoading } = useQuery({
  queryKey: ['blogs'],
  queryFn: blogService.getAll,
  enabled: !!user 
});

  //check logged in user
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON);
      userDispatch({ type: "LOGIN", payload: loggedUser });
      blogService.setToken(loggedUser.token);
    }
  }, [userDispatch]);

  //add blog-create
  const addBlogMutation = useMutation({
  mutationFn: blogService.createBlog,
  onSuccess: (newBlog) => {
    queryClient.invalidateQueries('blogs');
  
        dispatch({
          type: 'SET_NOTIFICATION',
          payload: {
            message: `A new blog "${newBlog.title}" by ${newBlog.author} added`,
            type: "success",
          }
      });
        setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 8000);
  },
  onError: () => {
      dispatch({
        type: "SET_NOTIFICATION",
        payload: {
          message: "Failed to add blog",
          type: "error",
        },
      });
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 8000);
    }
  });

  const addBlog = (blogObject) => {addBlogMutation.mutate(blogObject)};

  //login
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
    const loggedUser = await loginService.login({ username, password });
      window.localStorage.setItem(
        "loggedBlogappUser",
        JSON.stringify(loggedUser)
      );
    userDispatch({ type: "LOGIN", payload: loggedUser });
      blogService.setToken(loggedUser.token);
      setUsername("");
      setPassword("");
    } catch {
      dispatch({
        type: "SET_NOTIFICATION",
        payload: {
          message: "Wrong Username or Password - Please, try again",
          type: "error",
        },
      });
      setTimeout(() => {
        dispatch({ type: "CLEAR_NOTIFICATION" });
      }, 8000);
    }
  };

  //logout
  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    userDispatch({ type: 'LOGOUT' });
    dispatch({ type: "CLEAR_NOTIFICATION" });
  };

  //delete
  const deleteBlogMutation = useMutation({
  mutationFn: blogService.deleteBlog,
  onSuccess: (_, id) => {
    queryClient.invalidateQueries('blogs');
    dispatch({
      type: "SET_NOTIFICATION",
      payload: { message: "Blog deleted", type: "success" },
    });
    setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 8000);
  },
  onError: () => {
        dispatch({
          type: "SET_NOTIFICATION",
          payload: {
            message: "Failed to delete blog",
            type: "error",
          },
        });
        setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 8000);
      },
  });

  const handleDelete = (id, title, author) => {
  if (window.confirm(`Remove blog: ${title} by ${author}?`)) {
    deleteBlogMutation.mutate(id);
  }
};

//za like
  const updateBlogMutation = useMutation ({
    mutationFn: ({ id, updatedBlog }) => blogService.updateBlog(id, updatedBlog),
  onSuccess: () => {
    queryClient.invalidateQueries('blogs');
  },
  onError: (error) => {
    console.error("Failed to like blog:", error);
  },
});

const handleLike = (blog) => {
  const blogForUpdate = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes + 1
  };
  updateBlogMutation.mutate({ id: blog.id, updatedBlog: blogForUpdate });
};
  
    //if noone is logged in
  if (!user) {
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

  //main blog page
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
}
export default App