const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const blogsRouter = require("express").Router();
const User = require("../models/user");
const Blog = require("../models/blog");

//USER
usersRouter.post("/", async (req, res, next) => {
  try {
    const { username, name, password } = req.body;

    if (!password || password.length < 3) {
      //validate username and password
      return res
        .status(400)
        .json({ error: "Password must be at least 3 characters long" });
    }
    if (!username || username.length < 3) {
      return res
        .status(400)
        .json({ error: "Username must be at least 3 characters long" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      //create user
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save(); //save to DB
    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

//BLOG
blogsRouter.post("/", async (req, res, next) => {
  try {
    const body = req.body;

    const users = await User.find({});
    if (users.length === 0) {
      return res.status(400).json({ error: "No users found in database" });
    }
    const user = users[0];

    const blog = new Blog({
      //create new blog
      url: body.url,
      title: body.title,
      author: body.author,
      user: user._id,
      likes: body.likes || 0,
    });

    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    const populatedBlog = await savedBlog.populate("user", {
      username: 1,
      name: 1,
      id: 1,
    });
    res.status(201).json(populatedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });

  res.json(blogs);
});
usersRouter.get("/", async (req, res) => {
  // show users and their blogs (populated)
  const users = await User.find({}).populate("blogs", {
    title: 1,
    url: 1,
    likes: 1,
    id: 1,
  });
  res.json(users);
});
module.exports = usersRouter;
