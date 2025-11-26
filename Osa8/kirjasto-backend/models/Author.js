const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4
  },
  born: Number
  ,
  books: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
      }
    ],
    default: []
  }
})

module.exports = mongoose.model('Author', schema)