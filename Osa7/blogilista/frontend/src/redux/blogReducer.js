import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

export const fetchBlogs = createAsyncThunk(
  'blogs/fetchAll',
  async (_, thunkAPI) => {
    const blogs = await blogService.getAll()
    return blogs
  }
)

export const createBlog = createAsyncThunk(
  'blogs/create',
  async (newBlog) => {
    const created = await blogService.createBlog(newBlog)
    return created
  }
)

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        return action.payload
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.push(action.payload)
      })
  },
})

export default blogSlice.reducer