import { useQuery } from "@tanstack/react-query"
import userService from "../services/users"
import { Link } from "react-router-dom"
import {useUser} from "../context/UserContext"

const Users = () => {
    const { user } = useUser()
    const { data: users = [] } = useQuery({queryKey: ["users"], queryFn: userService.getAllUsers,
  })

   return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>
                <Link to={`/users/${u.id}`}>{u.name}</Link>
              </td>
              <td>{u.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users