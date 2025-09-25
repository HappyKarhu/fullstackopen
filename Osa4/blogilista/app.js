const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const User = require('./models/user')
const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const usersRouter = require('./controllers/user')
const app = express()

app.use(express.json())
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err.message))


app.get('/api/blogs', async (req, res) => {//get new blog
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {//post new blog
  const { title, author, url, likes } = req.body
  if (!title || !url) { //missing title check
    return res.status(400).json({ error: 'title or url missing' })
  }

  const users = await User.find({})
  if (users.length === 0) {
    return res.status(400).json({ error: 'No users found in database' })
  }

  const user = users[0] // first user

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1, id: 1 })
  res.status(201).json(populatedBlog)
})

app.delete('/api/blogs/:id', async (req, res) => { //delete blog
  const id = req.params.id

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).end()//wrong id
  }

  const deletedBlog = await Blog.findByIdAndDelete(id)

  if (deletedBlog) {
    return res.status(204).end()//successfully deleted
  } else {
    return res.status(404).end()//blog doesnt exist
  } 
})

app.put('/api/blogs/:id', async (req, res) => {
  const id = req.params.id;
  const { likes } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'invalid id' });
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { likes },            // fields to update
    { new: true, runValidators: true, context: 'query' } // return updated doc
  );

  if (updatedBlog) {
    res.json(updatedBlog);
  } else {
    res.status(404).end(); // blog not found
  }
});


module.exports = app