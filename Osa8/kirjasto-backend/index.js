require('dotenv').config()   // load .env variables
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')

const Book = require('./models/Book')
const Author = require('./models/Author')

// Connect to MongoDB
mongoose.set('strictQuery', false)
console.log('connecting to', process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch(error => console.error('error connecting to MongoDB:', error.message))


// GraphQL schema
const typeDefs = `
interface Node {
  id: ID! 
}

type Book implements Node {
    id: ID!
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
}

type Author implements Node {
    id: ID!
    name: String!
    born: Int
    bookCount: Int!
}

type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

type Mutation {
  addBook(
    title: String!, 
    author: String!, 
    published: Int!, 
    genres: [String!]!
    ): Book
  editAuthor(
  name: String!,
  setBornTo: Int!
  ): Author
}
`

//resolvers
const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),

    allBooks: async () => {
      return Book.find({}).populate('author') //return all books with author details
    },

    allAuthors: async () => {
      //return authors, bookcount is computed per author
      const authors = await Author.find({})
      const authorsWithCount = await Promise.all(authors.map(async (a) => {
        const count = await Book.countDocuments({ author: a._id })
        return {
          id: a._id.toString(),
          name: a.name,
          born: a.born,
          bookCount: count
        }
      }))
      return authorsWithCount
    },
  },

  Mutation: {
    addBook: async(root, args) => {
      //fins existing author or create new one
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
      return book 
       //return book with author details
    },

    editAuthor: async(root, args) => {
      const author = await Author.findOne({name: args.name})
      if (!author) {
        return null
      }
      author.born = args.setBornTo
      await author.save()
      return author
    },
  },

  
}

//start Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})