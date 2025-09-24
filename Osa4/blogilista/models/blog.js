const mongoose = require('mongoose') //This-all allows Mongoose to populate the user info when fetching blogs

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: {type: Number, default: 0},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
  })

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    return {
      url: returnedObject.url,
      title: returnedObject.title,
      author: returnedObject.author,
      user: returnedObject.user
        ? {
          username: returnedObject.user.username,
          name: returnedObject.user.name,
          id: returnedObject.user.id
          }
        : null,//when missing user
        likes: returnedObject.likes,
      id: returnedObject._id.toString()
    }
  }
})


module.exports = mongoose.model('Blog', blogSchema)