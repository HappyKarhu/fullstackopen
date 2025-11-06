import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './redux/notificationReducer'
import blogReducer from './redux/blogReducer'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
  },
})

export default store