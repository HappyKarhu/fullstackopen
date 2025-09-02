import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' },
    { name: 'Grace Hopper' }
  ]) 
  const [newName, setNewName] = useState('')


  const handleNameInput = (event) => {
    setNewName(event.target.value)
  }

  const addContact = (event) => {
    event.preventDefault()       // prevent the default action of submitting HTML forms!-page refresh
    const personObject = {
      name: newName
    }

    setPersons(persons.concat(personObject)) //add new person
    setNewName('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addContact}>
        <div>
          name: <input value={newName} onChange={handleNameInput} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <div>
        {persons.map((person) => (
        <div key={person.name}>{person.name}</div>
        ))}
      </div>
    </div>
  )

}

export default App