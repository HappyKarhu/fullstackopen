import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './redux/notificationReducer'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
  },
})

export default store