import { useState } from 'react'

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

    setPersons(persons.concat(personObject)) //add new person
    setNewName('') //clears output
    setNewNumber('')
  }

  const filterShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <div>filter shown with <input value={filter} onChange={handleFilterInput} /></div>
      <h2>Add a new person</h2>
      <form onSubmit={addContact}>
        <div>
          name: <input value={newName} onChange={handleNameInput} />
        <br></br>number: <input value={newNumber} onChange={handleNumberInput}/><br></br>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <div>
        {filterShow.map((person) => (
        <div key={person.name}>{person.name} {person.number}</div>
        ))}
      </div>
    </div>
  )
}

export default App