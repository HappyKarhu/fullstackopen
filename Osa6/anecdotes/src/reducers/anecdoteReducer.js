import { createSlice } from '@reduxjs/toolkit'
import anecdotesService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      const voting=action.payload
      return state.map(a => a.id !== voting.id ? a : voting)
    },

    createAnecdote(state, action) {
      state.push(action.payload)
      },
      setAnecdotes(state, action) {
      return action.payload
    }
    }

  })
  
export const {voteAnecdote, createAnecdote, setAnecdotes}=anecdoteSlice.actions

export const voteAnecdoteThunk = (anecdote) => {
  return async (dispatch) => {
    const updateAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
    const returnedAnecdote = await anecdotesService.voting(updateAnecdote)
    dispatch(voteAnecdote(returnedAnecdote))
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdotesService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createNewAnecdote = (content) => async dispatch => {
    const newAnecdote = await anecdotesService.createNew(content)
    dispatch(createAnecdote(newAnecdote))

}

export default anecdoteSlice.reducer