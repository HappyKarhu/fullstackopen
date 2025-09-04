import { useState } from 'react'
import axios from 'axios'

const FilterButton = ({filter, handleFilterInput}) => {
  return (
    <div>Filter shown with <input value={filter} onChange={handleFilterInput} /></div>
  )
}

const AddNewPerson = ({addContact, newName, handleNameInput, newNumber, handleNumberInput}) => (
  <form onSubmit={addContact}>
        <div>
          Name: <input value={newName} onChange={handleNameInput} />
          <br></br>Number: <input value={newNumber} onChange={handleNumberInput}/><br></br>
          <button type="submit">ADD</button>
        </div>
  </form>
)

const AllContactsList = ({persons}) => (
  <div>
      {persons.map((person) => (
      <div key={person.name}>{person.name} {person.number}</div>
      ))}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [newName, setNewName] = useState('')  //nameinput
  const [newNumber, setNewNumber] = useState('') //number input
  const [filter, setFilter] = useState('')   //filter input

  const handleNameInput = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberInput = (event) => { //updates number and up-names
    setNewNumber(event.target.value)
  }
  const handleFilterInput = (event) => {
    setFilter(event.target.value)
  }

  const addContact = (event) => {
    event.preventDefault()       // prevent the default action of submitting HTML forms!-page refresh
    
    const newNameLowerCase = newName.toLowerCase() //converts into lowercase, ignores letter's size

    const ifDuplicate = persons.some(person => person.name.toLowerCase() === newNameLowerCase)

    if (ifDuplicate) { alert(`${newName} is already added to phonebook`)
      return  //stops funct if duplicate
  }

    const personObject = {
      name: newName,
      number: newNumber
    }

    axios
    .post('http://localhost:3001/persons', personObject) //adds on server now
    .then(response => {
      setPersons(persons.concat(response.data))
      setNewName('')
      setNewNumber('')
    })
  }

  const filterShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <FilterButton filter={filter} handleFilterInput={handleFilterInput} />
      <h3>Add a new person</h3>
      <AddNewPerson addContact={addContact} newName={newName} handleNameInput={handleNameInput} 
      newNumber={newNumber} handleNumberInput={handleNumberInput}/>

      <h3>Numbers-Contacts</h3>
      <AllContactsList persons={filterShow} />
    </div>
  )
}

export default App