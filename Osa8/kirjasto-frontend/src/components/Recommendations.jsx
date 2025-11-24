import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, ME } from '../queries'

const Recommendations = () => {
  const userResult = useQuery(ME)
  const booksResult = useQuery(ALL_BOOKS)

  if (userResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  const favorite = userResult.data.me.favoriteGenre
  const books = booksResult.data.allBooks

  const recommended = books.filter(b => b.genres.includes(favorite))

  return (
    <div>
      <h2>Recommendations</h2>
      <p>Books in your favorite genre <strong>{favorite}</strong></p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommended.map(b => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
