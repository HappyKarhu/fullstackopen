const { GraphQLError } = require('graphql')
const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')
const jwt = require('jsonwebtoken')

module.exports = (pubsub) => ({
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),

    allBooks: async (root, args) => {
      const filter = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) return []
        filter.author = author._id
      }

      if (args.genre) {
        filter.genres = { $in: [args.genre] }
      }

      return Book.find(filter).populate('author')
    },

    allAuthors: async () => Author.find({}),
    me: (root, args, context) => context.currentUser
  },

  Author: {
    bookCount: async (root) => Book.countDocuments({ author: root._id })
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        })
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }

      const book = new Book({
        title: args.title,
        published: args.published,
        author: author._id,
        genres: args.genres
      })

      await book.save()
      await book.populate('author')

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },

    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) return null

      author.born = args.setBornTo
      await author.save()

      return author
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      })

      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              error
            }
          })
        })
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      return {
        value: jwt.sign(
          { username: user.username, id: user._id },
          process.env.JWT_SECRET
        )
      }
    }
  },

  Subscription: {
  bookAdded: {
    subscribe: () => pubsub.asyncIterableIterator(['BOOK_ADDED'])
  }
}
})