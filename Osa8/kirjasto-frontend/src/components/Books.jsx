import { useQuery } from '@apollo/client/react'
import {ALL_BOOKS} from '../queries'
import React, {useState} from 'react'

const Books = (props) => {
  const [genre, setGenre] = useState(null) //for genre filtering
  if (!props.show) {
    return null
  }

  const result = useQuery(ALL_BOOKS)
  if (result.loading) {
      return <div>loading...</div>
    }

    if (result.error) {
      return <div>Error: {result.error.message}</div>
    }

    const books = result.data?.allBooks || []

    //unique list for all genres
    const genres = [...new Set(books.flatMap(b => b.genres))]

    const filteredBooks = genre
    ? books.filter(b => b.genres.includes(genre))
    : books

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author?.name || a.author}</td>
              <td style={{ textAlign: "center" }}>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <h3>In genre patterns</h3>
<div>
        {genres.map(g =>
          <button key={g} onClick={() => setGenre(g)}>
            {g}
          </button>
        )}
        <button onClick={() => setGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
