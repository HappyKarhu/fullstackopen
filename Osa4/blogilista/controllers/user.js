const bcrypt = require('bcrypt') // or 'bcryptjs' if you installed that
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body

    if (!password || password.length < 3) {
      return res.status(400).json({ error: 'Password must be at least 3 characters long' })
    }
    if (!username || username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

usersRouter.get('/', async (req, res) => {
  // show users and their blogs (populated)
  const users = await User.find({}).populate('blogs', { title: 1, url: 1, likes: 1, id: 1 })
  res.json(users)
})

module.exports = usersRouter