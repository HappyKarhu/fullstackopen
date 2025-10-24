import { createSlice } from '@reduxjs/toolkit'
import anecdotesService from '../services/anecdotes'


const initialState = []


const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    voteAnecdote(state, action) {
      const id=action.payload
      const anecdote = state.find(a => a.id === id)
      if (anecdote)
        anecdoteToChange.votes += 1
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