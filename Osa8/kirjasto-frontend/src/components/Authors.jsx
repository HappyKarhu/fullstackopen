import { useQuery, useMutation } from '@apollo/client/react'
import {ALL_AUTHORS, SET_AUTHOR} from '../queries'
import { useState } from 'react'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  
  //fetch authors from GraphQL server
  const result = useQuery(ALL_AUTHORS)
  const [setAuthor] = useMutation(SET_AUTHOR, { refetchQueries: [{ query: ALL_AUTHORS }],
  })

  if (!props.show) {return null}

  if (result.loading) {return <div>loading...</div>}

  if (result.error) {return <div>Error: {result.error.message}</div>}

  const authors = result.data?.allAuthors || []

  const submit = async (event) => {
    event.preventDefault()
    await setAuthor({ variables: { name, born: Number(born) } })
    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td style={{ textAlign: "center" }}>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

{/*dropdown with only existing authors */}

    <h3>Set birthyear to an existing author</h3>
      <form onSubmit={submit}>
        <div>
          name
          <select value={name} onChange={({ target }) => setName(target.value)}>
            <option value="">Select an Author</option>
            {authors.map(a => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          Born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
