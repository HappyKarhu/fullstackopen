import { useQuery } from '@apollo/client/react'
import React, {useState} from 'react'
import { BOOKS_BY_GENRE, ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState(null) //for genre filtering

  const { loading, error, data } = useQuery(BOOKS_BY_GENRE, {
    variables: { genre }
  })
   
  const allBooksResult = useQuery(ALL_BOOKS) //this is for genre buttons

  if (!props.show) {
    return null
  }

  if (loading || allBooksResult.loading)
      return <div>loading...</div>

    if (error) {
      return <div>Error: {error.message}</div>
    }

    const books = data.allBooks
    const allBooks = allBooksResult.data.allBooks
    //unique list for all genres
    const genres = [...new Set(books.flatMap(b => b.genres))]

  return (
    <div>
      <h2>books</h2>
      <h3>{genre ? `in genre ${genre}` : 'all genres'}</h3>
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