import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote, voteAnecdoteThunk } from '../reducers/anecdoteReducer'
import { setNotificationTimeOut } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)

  const filteredAnecdotes = anecdotes
    .filter(a => a.content?.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => b.votes - a.votes)
    
  const vote = (anecdote) => {
    dispatch(voteAnecdoteThunk(anecdote))
    dispatch(setNotificationTimeOut(`👍 You voted for: '${anecdote.content}' 👍`, 10))
  }


  return (
    <div>
      <h2>Anecdotes</h2>
      {filteredAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList