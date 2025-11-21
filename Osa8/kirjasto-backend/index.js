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
    //total number of books in DB
    bookCount: async () => Book.collection.countDocuments(),
    //total number of authors in DB
    authorCount: async () => Author.collection.countDocuments(),

    //all books, with optional filters by genre and author
    allBooks: async (root, args) => {
      const filter = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) {
          return []
        }
        filter.author = author._id
      }

      if (args.genre) {
        filter.genres = { $in: [args.genre] }
      }

      return Book.find(filter).populate('author')
    },

    // all authors without bookCount below


    allAuthors: async () => Author.find({})
  },

    // resolver field for author.bookcount...graphQL calls this only when requested
    //it calculates the number of books by specific author
    
    Author: {
      bookCount: async (root) => {
        return Book.countDocuments({ author: root._id }) //root is the author object (returned from allAuthors()
      }
    },
  

  Mutation: {
    addBook: async(root, args) => {
      //fins existing author or create new one
      let author = await Author.findOne({ name: args.author })
    
      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }
 //create new book with author ID
      const book = new Book({
        title: args.title,
        published: args.published,
        author: author._id,
        genres: args.genres
      })

      // save book and populate author field for GraphQL return
      await book.save()
      await book.populate('author')
      return book 
       //return book with author details
    },

    //edit author (born)
    editAuthor: async(root, args) => {
      const author = await Author.findOne({name: args.name})
      if (!author) {
        return null
      }
      author.born = args.setBornTo //update and save
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