
import './App.css';
import Login from "./Components/User/Login.js";
import Home from './Pages/Home';
import AuthProvider from './Components/AuthenticateContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewsletterDesigner from './Components/NewsLetter.js';
import Navbar from './Components/Navbar.js';
import SearchBar from './Components/SearchBar';
import AllProducts from './Components/Product/AllProducts.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import ViewLocation from './Components/Location/ViewLocation.js';
import Admin from './Components/Admin.js';
import ReviewsPage from "../src/Components/Reviews/ReviewsPage.js";
import UserProducts from './Components/User/UserSavedProduct.js';

function App() {


  return (
    <div className="App">
      <AuthProvider>
     
      <Router>
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Nav" element={<Navbar />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/Search" element={<SearchBar/>} />
        <Route path="/All" element={<AllProducts/>} />
        <Route path="/news" element={<NewsletterDesigner/>} />
        <Route path="/view" element={<ViewLocation/>} />
        <Route path="/user" element={<UserProducts/>} />
        <Route path="/review" element={<ReviewsPage/>} />
    
        
      </Routes>
    </Router>
      </AuthProvider>
     
    </div>
  );
}

export default App;
