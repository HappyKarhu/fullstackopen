import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1231244' },
    { name: 'Grace Hopper', number: '+31-231-12314' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleNameInput = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberInput = (event) => { //updates number and up-names
    setNewNumber(event.target.value)
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

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addContact}>
        <div>
          name: <input value={newName} onChange={handleNameInput} />
        <br></br>number: <input value={newNumber} onChange={handleNumberInput}/><br></br>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <div>
        {persons.map((person) => (
        <div key={person.name}>{person.name} {person.number}</div>
        ))}
      </div>
    </div>
  )

}

export default App