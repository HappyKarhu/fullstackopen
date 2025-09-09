import express from 'express'

const app = express()
app.use(express.json())

let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

//random func
const getNewId = () => {
  return Math.floor(Math.random() * 100000)
}

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

//date
app.get('/info', (request, response) => {
  const currentTime = new Date()
  response.send(`
    <!-- <summa>  -->
    <p>Phonebook has info for ${persons.length} people</p> 
    <p>${currentTime}</p>
  `)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body


  //if number is missing
  if (!body.number || !body.name) {
    return response.status(400).json({ 
      error: 'Number or name is missing' 
    })
  }
  const newPerson = {
    id: getNewId(),
    name: body.name,
    number: body.number
  }

  //if name exist 
  const nameExists = persons.some(person => person.name === body.name)
  if (nameExists) {
    return response.status(400).json({ 
      error: 'Name must be unique!' 
    })
  }

  
  console.log(newPerson)
  persons.push(newPerson)
  response.json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
