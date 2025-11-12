import { useState, useEffect } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/notification";
import CreateBlogForm from "./components/createBlogForm";
import Togglable from "./components/Togglable";
import { useUser } from "./context/UserContext";
import { useNotification } from "./context/NotificationContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Users from "./components/Users"
import SingleUser from "./components/SingleUser"
import SingleBlog from "./components/SingleBlog"
import { Table, Form, Button, Navbar, Nav } from 'react-bootstrap'
import styled from 'styled-components'

const CustomNavbar = styled(Navbar)`
  background: linear-gradient(90deg, #4a9ba1, #78c0c5);
  color: #fdf6ec;
  border-radius: 8px;
  margin-bottom: 1.5em;

  a {
    color: #fff !important;
    text-decoration: none;
    margin-right: 10px;

    &:hover {
      color: #ecd5d9; /* soft pinkish hover */
    }
  }
`

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
  updateBlogMutation.mutate({ id: blog.id ?? blog._id, updatedBlog: blogForUpdate });
};
  
const padding = {
  padding: 5
}
  //if noone is logged in -LoginForm
  if (!user) {
    return (
      <div className="container">
        <h2>Log in to application</h2>
        <Notification />
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              placeholder="Enter username"
            />
          </Form.Group>

          <Form.Group className="mb-3">
      <Form.Label>Password</Form.Label>
      <Form.Control
        type="password"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
        placeholder="Enter password"
      />
    </Form.Group>

          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
      </div>
    );
  }

  //main blog page
  return (
    <Router>
    <div className="container">
      
      <Notification />

      {/* Navigation menu */}
      <CustomNavbar collapseOnSelect expand="lg" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as="span">
            <Link to="/">Blogs</Link>
          </Nav.Link>
          <Nav.Link as="span">
            <Link to="/users">Users</Link>
          </Nav.Link>
          <Nav.Link as="span">
            {user ? <em>{user.name} logged in</em> : <Link to="/login">Login</Link>}
          </Nav.Link>
        </Nav>
        </Navbar.Collapse>
      </CustomNavbar>

      <p>
        {user.name} logged in. <button onClick={handleLogout}>logout</button>
      </p>
      <h1 style={{ 
        color: '#4a9ba1ff',       
        borderBottom: '3px solid #ecd5d9ff', 
        display: 'inline-block', 
        paddingBottom: '4px'
      }}>
        Blog App
      </h1>

      <Routes>
        <Route path="/" element={
            <>
      <Togglable buttonLabel="Create new Blog" data-cy="toggle-create-blog">
        <CreateBlogForm createBlog={addBlog} />
      </Togglable>
      <br />

      <div className="blogs-list">
        {blogs
          .toSorted((a, b) => b.likes - a.likes)
          .map((blog, index) => (
          <div key={blog.id ?? blog._id ?? index}>
        <Link to={`/blogs/${blog.id ?? blog._id}`}>
          {blog.title} by {blog.author}
        </Link>
      </div>
          ))}
      </div>
      </>
          }
        />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<SingleUser />} />
        <Route path="/blogs/:id" element={<SingleBlog />} />

      </Routes>
    </div>
    </Router>
  );
}
export default App