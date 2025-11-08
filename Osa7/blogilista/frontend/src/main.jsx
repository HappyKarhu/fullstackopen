import React from 'react'
import ReactDOM from "react-dom/client"
import App from "./App"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider} from './context/UserContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
<QueryClientProvider client={queryClient}>
    <UserProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </UserProvider>
  </QueryClientProvider>
)
//<Provider> gives every component access to the Redux store through React context.