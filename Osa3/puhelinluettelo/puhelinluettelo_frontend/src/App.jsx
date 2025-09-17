import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Notification = ({ message, type }) => {
  if (message === null) return null
return <div className={`notification ${type === 'fail' ? 'fail' : 'success'}`}>{message}</div>
}

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

const AllContactsList = ({persons, deletePerson}) => (
  <div>
      {persons.map((person) => (
      <div key={person.id}>{person.name} {person.number} {}
      <button onClick={() => deletePerson(person.id, person.name)}>Delete contact</button>
      </div>
      ))}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([]) // empty array, persons is state variable, setPersons updates it
  useEffect(() => {
  personService.getAll().then(response => {
    setPersons(response) // access the array here
  })
}, [])
  const [newName, setNewName] = useState('')  //nameinput
  const [newNumber, setNewNumber] = useState('') //number input
  const [filter, setFilter] = useState('')   //filter input
  const [notification, setNotification] = useState({ message: null, type: null })

  const shownNotification = (message, type='success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 6500)
  }

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

    const existingContact = persons.find(person => person.name.toLowerCase() === newNameLowerCase)
    

    if (existingContact) { if (window.confirm(
      `${newName} is already added to phonebook, replace the old number with the new one?`
    )) {
      const updatedPerson = { ...existingContact, number: newNumber }

      personService
        .update(existingContact.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(
            persons.map(p => p.id !== existingContact.id ? p : returnedPerson)
          )
          setNewName('')
          setNewNumber('')
          shownNotification(`Added ${returnedPerson.name}`, 'success')
        })
        .catch(error => {
          const errorMessage = error.response?.data?.error || error.message || 'Something went wrong'
          shownNotification(errorMessage, 'fail')
        })
    }
    return
  }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService.create(personObject) //Extract the code that handles the communication with the backend into its own module
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
      shownNotification(`Added ${returnedPerson.name}`)
    })
    .catch(error => {
    const errorMessage = error.response?.data?.error || error.message || 'Something went wrong'
    shownNotification(errorMessage, 'fail')
  })
  }

    const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
    
    .catch(error => {
      shownNotification(
        `Information of ${name} has already been removed from server`,
        'fail'
      )
      setNotes(notes.filter(n => n.id !== id))
    })
  }
}
  
  const filterShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      
      
      <FilterButton filter={filter} handleFilterInput={handleFilterInput} />
      <h3>Add a new person</h3>
     
      <Notification message={notification.message} type={notification.type} />
       
      <AddNewPerson addContact={addContact} newName={newName} handleNameInput={handleNameInput} 
      newNumber={newNumber} handleNumberInput={handleNumberInput}/>

  <h3>Numbers-Contacts</h3>
  <AllContactsList persons={filterShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App