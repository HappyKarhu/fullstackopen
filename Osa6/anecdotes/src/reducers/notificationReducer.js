import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        setNotification(state, action) {
            return action.payload
        }
        
    }
})

export const {setNotification}=notificationSlice.actions

export const setNotificationTimeOut = (message) => {
    return(dispatch)=> {
        dispatch(setNotification(message))
        setTimeout(() => 
            dispatch(setNotification('')), 5000) 
    }
}
export default notificationSlice.reducer