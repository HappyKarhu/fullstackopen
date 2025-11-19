import { useQuery } from '@apollo/client/react'
import {ALL_AUTHORS} from '../queries'


const Authors = (props) => {
  if (!props.show) {
    return null
  }
  
  //fetch authors from GraphQL server
  const result = useQuery(ALL_AUTHORS)
  
  if (result.loading) {
    return <div>loading...</div>
  }

  if (result.error) {
    return <div>Error: {result.error.message}</div>
  }

  const authors = result.data?.allAuthors || []

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
    </div>
  )
}

export default Authors
