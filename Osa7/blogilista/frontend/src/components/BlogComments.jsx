import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import blogService from "../services/blogs"
import {Container,Table,TableBody,TableCell,TableContainer,TableRow,Paper,} from '@mui/material'

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
   <Container sx={{ backgroundColor: '#ecd5d9ff', minHeight: '100vh', paddingTop: 2 }}>
    <h3>Comments</h3>

    <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button type="submit">Add Comment</button>
      </form>
      

      <TableContainer component={Paper}
      sx={{ backgroundColor: "#4a9ba1ff", padding: 1 }}>
        <Table>
          <TableBody>
            {comments.map((comment, index) => (
                <TableRow key={comment.id ?? comment._id ?? index}>
                  <TableCell>{comment.content}</TableCell>
                  <TableCell>{comment.user}<span style={{ float: 'right'}}>☀️</span></TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>  
  )
}

      
  


export default BlogComments