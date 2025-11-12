import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import blogService from "../services/blogs"

const BlogComments = ({ blogId }) => {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("")

  // Fetch comments
  const { data: comments = [] } = useQuery({
  queryKey: ["comments", blogId],
  queryFn: () => blogService.getComments(blogId),
  enabled: !!blogId && blogId !== 'undefined'
})

  // Mutation for adding comment
  const addCommentMutation = useMutation({
    mutationFn: (content) => {
      if (!blogId || blogId === 'undefined') throw new Error('invalid id');
      return blogService.addComment(blogId, content)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", blogId] })
      // refresh the single blog cache
      queryClient.invalidateQueries(["blog", blogId])
    }
})

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newComment) return
    addCommentMutation.mutate(newComment)
    setNewComment("")
  }

  return (
    <div>
      <h3>Comments</h3>
      <ul>
        {comments.map((c, index) => (
          <li key={index}>{c.content}</li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  )
}

export default BlogComments