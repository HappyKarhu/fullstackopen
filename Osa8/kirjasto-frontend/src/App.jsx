import { Routes, Route, Link } from "react-router-dom";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";

const App = () => {
  const padding = {  padding: 5 };

 //navigation menu and routes
  return (
    <div>
      <div>
        <Link style={padding} to="/authors">authors</Link>
        <Link style={padding} to="/books">books</Link>
        <Link style={padding} to="/add">add book</Link>
      </div>

      <Routes>
        <Route path="/authors" element={<Authors show={true} />} />
        <Route path="/books" element={<Books show={true} />} />
        <Route path="/add" element={<NewBook show={true} />} />
        <Route path="/" element={<Authors show={true} />} />
      </Routes>
    </div>
  );
};

export default App;
