import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendations from "./components/Recommendations"
import { useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import { useSubscription } from "@apollo/client/react";
import { BOOK_ADDED } from "./queries";


const App = () => {
  const padding = {  padding: 5 };

  //logging out
  const [token, setToken] = useState(localStorage.getItem("library-user-token"));
  const client = useApolloClient();
  const navigate = useNavigate();

  const logout = () => {
    setToken(null);
    localStorage.removeItem("library-user-token");
    client.resetStore();
    navigate("/"); 
  };
  //subscription for new book added
  useSubscription(BOOK_ADDED, {
  onData: ({ data }) => {
    const addedBook = data.data.bookAdded
    window.alert(`New book added: ${addedBook.title} by ${addedBook.author.name}`)
  },
})

 //navigation menu and routes
  return (
    <div>
      <div>
        <Link style={padding} to="/authors">authors</Link>
        <Link style={padding} to="/books">books</Link>
        {token && (
          <Link style={padding} to="/add">add book</Link>
        )}

        {token && (
        <Link style={padding} to="/recommended">recommended</Link>
        )}
        
        {!token ? (
          <Link style={padding} to="/login">login</Link>
        ) : (
          <button style={padding} onClick={logout}>logout</button>
        )}
      </div>

      <Routes>
        <Route path="/authors" element={<Authors show={true} />} />
        <Route path="/books" element={<Books show={true} />} />
        <Route path="/add" element={<NewBook show={true} />} />
        <Route path="/recommended" element={<Recommendations />} />
        <Route path="/login" element={<LoginForm setToken={setToken} />} />
        <Route path="/" element={<Authors show={true} />} />
      </Routes>
    </div>
  );
};

export default App;