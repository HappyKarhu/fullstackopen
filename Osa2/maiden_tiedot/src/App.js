import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const App = () => { 
  const [query, setQuery] = useState('') //what user put in
  const [countries, setCountries] = useState([]) //all countries
  const [filtered, setFiltered] = useState([]) //filtered countries

  useEffect(() => {
    axios.get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => {
        setCountries(response.data)
      })
       }, []) //initial value of null

  useEffect(() => {
    setFiltered(
      countries.filter(country =>
        country.name.common.toLowerCase().includes(query.toLowerCase())
      )
    )
  }, [query, countries])

  const handleQueryChange = (event) => {
    setQuery(event.target.value)
  }

  return (
    <div>
      <div>
        find countries <input value={query} onChange={handleQueryChange} />
      </div>
      <div>
        {filtered.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : filtered.length === 1 ? (
          <CountryDetail country={filtered[0]} />
        ) : (
          <CountryList countries={filtered} setQuery={setQuery} />
        )}
      </div>
    </div>
  )
}

const CountryList = ({ countries, setQuery }) => {
  return (
    <div>
      {countries.map(country => (
        <div key={country.cca3}>
          {country.name.common} <button onClick={() => setQuery(country.name.common)}>show</button>
        </div>
      ))}
    </div>
  )
}

const CountryDetail = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area} km²</p>
      <h2>Languages</h2>
      <ul>
        {country.languages
        ? Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        )) : <li>{country.languages}</li> 
        }
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
    </div>
  )
}

export default App;