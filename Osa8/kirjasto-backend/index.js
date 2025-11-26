require('dotenv').config()   // load .env variables
const { ApolloServer } = require('@apollo/server')
const express = require('express')
const cors = require('cors')
const http = require('http')
const { expressMiddleware } = require('@as-integrations/express5')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { PubSub } = require('graphql-subscriptions')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')


//models
const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')

const pubsub = new PubSub()
const resolvers = require('./resolvers')(pubsub)
// Connect to MongoDB
mongoose.set('strictQuery', false)

console.log('connecting to', process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch(error => console.error('error connecting to MongoDB:', error.message))

mongoose.set('debug', true);

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

type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}

type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
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

  createUser(
    username: String!
    favoriteGenre: String!
  ): User

  login(
    username: String!
    password: String!
  ): Token
}

type Subscription {
  bookAdded: Book!
}
`

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const schema = makeExecutableSchema({ typeDefs, resolvers })
// WebSocket server for GraphQL subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })
  const serverCleanup = useServer({ schema }, wsServer)

  // Apollo Server instance
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            }
          }
        }
      }
    ]
  })
  await server.start()

  // Middleware for queries/mutations
  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.toLowerCase().startsWith('bearer ')) {
          try {
            const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
            const currentUser = await User.findById(decodedToken.id)
            return { currentUser }
          } catch (error) {
            return {}
          }
        }
        return {}
      }
    })
  )

  httpServer.listen(4000, () =>
    console.log(`Server running at http://localhost:4000`)
  )
}

start()