import { useParams } from "react-router-dom"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import blogService from "../services/blogs"
import BlogComments from "./BlogComments"

const SingleBlog = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()

  const { data: blog } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => blogService.getById(id),
    enabled: !!id && id !== 'undefined',
  })

 const updateBlogMutation = useMutation({
    mutationFn: ({ id, updatedBlog }) => blogService.updateBlog(id, updatedBlog),
    onSuccess: () => {

      queryClient.invalidateQueries(["blog", id])
      queryClient.invalidateQueries(["blogs"])
    },
    })

  const handleLike = () => {
    if (!blog) return;
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: (blog.likes || 0) + 1,
    };
    updateBlogMutation.mutate({ id: blog.id ?? blog._id, updatedBlog });
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

  {blog && <BlogComments blogId={blog.id ?? blog._id} />}
    </div>
  )
}

export default SingleBlog