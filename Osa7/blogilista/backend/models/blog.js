const mongoose = require("mongoose")

//coments (if for example date is needed or user, add here)
const commentSchema = new mongoose.Schema({
  content: {type: String, required: true}
})

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comments: [commentSchema]
});

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // Ensure comments are included and ids are strings
    const user = returnedObject.user
      ? {
          username: returnedObject.user.username,
          name: returnedObject.user.name,
          id: returnedObject.user.id,
        }
      : null;

    return {
      url: returnedObject.url,
      title: returnedObject.title,
      author: returnedObject.author,
      user,
      likes: returnedObject.likes,
      id: returnedObject._id.toString(),
      comments: (returnedObject.comments || []).map((c) => ({
        content: c.content,
        id: c._id ? c._id.toString() : undefined,
      })),
    };
  },
});

module.exports = mongoose.model("Blog", blogSchema)