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

export const updateBlog = createAsyncThunk(
  'blogs/update', 
  async (updatedBlog) => {
    const returnedBlog = await blogService.updateBlog(updatedBlog.id, updatedBlog)
    return returnedBlog
  }
)

export const removeBlog = createAsyncThunk(
  'blogs/delete', 
  async (id) => {
    await blogService.deleteBlog(id)
    return id
  }
)

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.fulfilled, (state, action) => { //fetch all
        return action.payload
      })
      .addCase(createBlog.fulfilled, (state, action) => { //create new
        state.push(action.payload)
      })
      .addCase(updateBlog.fulfilled, (state, action) => { //like
        const updatedBlog = action.payload
        return state.map((blog) =>
          blog.id === updatedBlog.id ? updatedBlog : blog
        )
      })
      .addCase(removeBlog.fulfilled, (state, action) => { //delete
        const id = action.payload
        return state.filter((blog) => blog.id !== id)
      })
  },
})

export default blogSlice.reducer