import { useParams } from "react-router-dom"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import blogService from "../services/blogs"

const SingleBlog = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()

  const { data: blog } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => blogService.getById(id),
    enabled: !!id,
  })

 const updateBlogMutation = useMutation({
    mutationFn: ({ id, updatedBlog }) => blogService.updateBlog(id, updatedBlog),
    onSuccess: () => queryClient.invalidateQueries(["blogs", id]),
    })

  const handleLike = () => {
    if (!blog) return;
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    updateBlogMutation.mutate({ id: blog.id || blog._id, updatedBlog });
  }

    if (!blog) return null

   return (
    <div>
      <h2>{blog.title}</h2>
      <p>
        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>
      </p>
      <p>
        {blog.likes} likes <button onClick={handleLike}>like</button>
      </p>

      <p>Blog added by {blog.author ?? blog.user?.name}</p>
    </div>
  )
}

export default SingleBlog