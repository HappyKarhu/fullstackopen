const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");
const mongoose = require("mongoose");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: "invalid id" });
  }

  try {
    const blog = await Blog.findById(id).populate("user", { username: 1, name: 1 });
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).json({ error: "blog not found" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  const blog = new Blog({
    url: body.url,
    title: body.title,
    author: body.author,
    likes: body.likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  const populatedBlog = await savedBlog.populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.status(201).json(populatedBlog);
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    //verifies token, fetches by id, delte if matches
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).end();
    }

    if (blog.user.toString() !== request.user.id.toString()) {
      return response.status(403).json({ error: "permission denied" });
    }

    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  },
);

blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const update = request.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: "invalid id" });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) return response.status(404).end();

    // Only allow updating these fields
    const allowed = ["title", "author", "url", "likes"];
    allowed.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(update, field)) {
        blog[field] = update[field];
      }
    });

    const saved = await blog.save();
    const populated = await saved.populate("user", { username: 1, name: 1 });
    response.json(populated);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

// get all COMMENTS for a blog
blogsRouter.get("/:id/comments", async (request, response) => {
  const { id } = request.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: 'invalid id' })
  }

  const blog = await Blog.findById(id)
  if (blog) {
    response.json(blog.comments)
  } else {
    response.status(404).end()
  }
})

// Add a comment to a blog (anonymous)
blogsRouter.post("/:id/comments", async (request, response) => {
  const { id } = request.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: 'invalid id' })
  }

  const blog = await Blog.findById(id)
  if (!blog) return response.status(404).end()

  const content = request.body?.content
  if (!content || typeof content !== 'string' || content.trim() === '') {
    return response.status(400).json({ error: 'content missing or invalid' })
  }

  const comment = { content: content.trim() }
  blog.comments.push(comment)
  await blog.save()

  response.status(201).json(comment)
})

module.exports = blogsRouter
