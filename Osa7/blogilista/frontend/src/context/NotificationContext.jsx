import { createContext, useReducer, useContext } from 'react'

const NotificationContext = createContext()//create context

//reducer funct.
const notificationReducer = (state, action) => {
    switch(action.type) {
        case "SET_NOTIFICATION":
            return action.payload
        case "CLEAR_NOTIFICATION":
            return null
        default:
            return state
    }
}

//provider
export const NotificationProvider = ({ children}) => {
    const [notification, dispatch] = useReducer(notificationReducer, null)

    return (
        <NotificationContext.Provider value={{ notification, dispatch}}>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotification = () => useContext(NotificationContext)