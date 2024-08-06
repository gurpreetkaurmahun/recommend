import logo from './logo.svg';
import './App.css';
import Login from "./Components/Login";
import Home from './Pages/Home';
import AuthProvider from './Components/AuthenticateContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CheckForm from "./Components/CheckFunction";
import Navbar from './Pages/Navbar';
import SearchBar from './Components/SearchBar';
import EditConsumer from './Components/EditConsumer';
import AllProducts from "./Components/AllProducts.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import ClearLocalStorage from './Components/User.js';
import Admin from './Components/Admin.js';
import MyForm from './Components/Form';
function App() {
  return (
    <div className="App">
      <AuthProvider>
     
      <Router>
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<CheckForm/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/Search" element={<SearchBar/>} />
        <Route path="/edit" element={<EditConsumer/>} />
        <Route path="/All" element={<AllProducts/>} />
        <Route path="/Admin" element={<Admin/>} />
        <Route path="/local" element={<ClearLocalStorage/>}></Route>
        
      </Routes>
    </Router>
      </AuthProvider>
     
    </div>
  );
}

export default App;
