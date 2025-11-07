import React from 'react'
import ReactDOM from "react-dom/client"
import App from "./App"
import { Provider } from 'react-redux'
import store from './store'
import { UserProvider} from './context/UserContext.jsx'

ReactDOM.createRoot(document.getElementById("root")).render(
<Provider store={store}>
    <UserProvider>
        <App />
    </UserProvider>
    
    </Provider>)

//<Provider> gives every component access to the Redux store through React context.