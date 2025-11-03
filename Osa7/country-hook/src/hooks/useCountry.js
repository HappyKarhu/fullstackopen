import { useState, useEffect } from "react"
import axios from "axios"

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (!name) {
      setCountry(null)
      return
    }

    const fetchCountry = async()=> {
        try {
            const response = await axios.get(
            `https://studies.cs.helsinki.fi/restcountries/api/name/${name}`
            )
            setCountry({ data: response.data, found: true })
        } catch (error) {
            setCountry({ found: false })
        }
        }

    fetchCountry()
}, [name]) //if empty array the effect is only run after the first render of component
return country
}

export default useCountry