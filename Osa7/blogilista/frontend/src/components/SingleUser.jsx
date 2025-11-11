import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import userService from "../services/users"

const SingleUser = () => {
    const {id} = useParams()
    
    const { data: users = [] } = useQuery({queryKey: ["users"], queryFn: userService.getAllUsers})

    const user = users.find(u => u.id === id)
    if (!user) {return null}


    return (
        <div>
        <h2>{user.name}</h2>
        <h3>added blogs</h3>
        <ul>
            {user.blogs.map(blog => (
            <li key={blog.id || blog._id}>
                <Link to={`/blogs/${blog.id || blog._id}`}>{blog.title}</Link>
            </li>
            ))}
        </ul>
    </div>
    )
}

export default SingleUser