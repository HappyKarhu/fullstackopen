require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()
app.use(express.json()) //lets express to read JSON

app.use(cors()) //alows frontent running on another domain to call API

morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')//body-tolken name, converts into string-if not post-return empty str


//loggin
/*const morganFormat = (tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res) 
  ].join(' ')
}


app.use(morgan(morganFormat))

//random func
const getNewId = () => {
  return Math.floor(Math.random() * 1000000)
}

app.get('/', (req, res) => {
  res.send('<h1>Backend test Render</h1>')
})*/


//get ALL persons-fetch 3.13
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

/*//date
app.get('/info', (request, response) => {
  const currentTime = new Date()
  Person.countDocuments({}).then(count => {
    res.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${currentTime}</p>
    `)
  })
})*/

//gets one person by id
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//numbers saved to DB-3.14
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  //create new person 
  const person = new Person({
    name: body.name,
    number: body.number
  })
  // save to database-it forward to error handler
  person.save()
  .then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { number } = request.body
  Person.findByIdAndUpdate(
    request.params.id, //the Id of the person to update
    { number },
    { new: true, runValidators: true, context: 'query'}
  )
  .then(updatedPerson => {
    if (updatedPerson) {
      response.json(updatedPerson)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  const currentTime = new Date()
  Person.countDocuments({})
    .then(count => {
      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${currentTime}</p>
      `)
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT || 3001

/*const path = require('path');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}*/

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})