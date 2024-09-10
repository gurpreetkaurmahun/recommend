import React, { useState, useEffect, useRef } from "react";
import { SlHome } from "react-icons/sl";
import { FaAnglesRight } from "react-icons/fa6";
import { IoLogIn } from "react-icons/io5";
import { FaRegRegistered } from "react-icons/fa";
import {useAuth} from "./AuthenticateContext.js";
import{Link, useNavigate} from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { BsSave2 } from "react-icons/bs";
import {getCustomerById} from "../Backend-services/CustomerSpecific.js";

import "./styles.css";

function Navbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate=useNavigate();

  const indicatorRef = useRef(null);
  const listItemRefs = useRef([]);

  const authContext=useAuth();
  
  const[name,setName]=useState("");

  const isAuthenticated=authContext.authenticated;


  useEffect(() => {
    // This effect will run on mount and whenever isAuthenticated changes
    if (isAuthenticated) {
      getUser();
      console.log("Local Storage",localStorage);
    } else {
      setName("");
    }
  }, [isAuthenticated]);
  
  useEffect(() => {

    const user=localStorage.getItem("userName");
    if (user) {
      setName(user[0]);
    }
  }, []);

  useEffect(() => {
    if (indicatorRef.current && listItemRefs.current[activeIndex]) {
      const currentItem = listItemRefs.current[activeIndex];
      indicatorRef.current.style.left = `${currentItem.offsetLeft}px`;
      indicatorRef.current.style.width = `${currentItem.offsetWidth}px`;
    }
  }, [activeIndex]);

  const handleItemClick = (index) => {
    setActiveIndex(index);
  };
  
  function getUser() {
    const userName = localStorage.getItem("userName");

    if (userName) {
      setName(userName[0].toUpperCase());
    } else {
      // Handle the case where userName is null or undefined
      setName("");
    }
  }

  

  const handleNavigation = (path) => {
    localStorage.removeItem('initialLoginRedirect');
    navigate(path);
  }
  return (
    <div

    className="navbarOuter" id="top">
      <div className="navigation" >
        <ul>
          <div style={{ display: "flex" }}>
            <li
              ref={(el) => (listItemRefs.current[0] = el)}
              className={`list ${activeIndex === 0 ? "active" : ""}`}
              onClick={() => handleItemClick(0)}>
              <a to="/" style={{ textDecoration: "none", color: "inherit" }}>
                <span className="icon"><SlHome /></span>
                <span onClick={() => handleNavigation("/")}  className="text">Home</span>
              </a>
            </li>
            <li
              ref={(el) => (listItemRefs.current[1] = el)}
              className={`list ${activeIndex === 1 ? "active" : ""}`}
              onClick={() => handleItemClick(1)}>
              <a href="#" style={{ textDecoration: "none", color: "inherit" }}>
                <span className="icon"><FaAnglesRight /></span>
                <span className="text">About</span>
              </a>
            </li>
          </div>
          <div style={{ display: "flex" }}><Link to="/" style={{color:"white",textDecoration:"none"}}> 
         <h1 style={{marginTop:"10%"}}>Recommend</h1>
         
          
          </Link></div>
          <div style={{ display: "flex" }}>

          <li
              ref={(el) => (listItemRefs.current[2] = el)}
              className={`list ${activeIndex === 2 ? "active" : ""}`}
              onClick={() => handleItemClick(2)}
             >
              <a to="/search" style={{ textDecoration: "none", color: "inherit" }}>
                <span className="icon"><IoSearch  /></span>
                <span onClick={() => handleNavigation("/search")}  className="text">Search</span>
              </a>
            </li>

            {isAuthenticated&& <li
              ref={(el) => (listItemRefs.current[3] = el)}
              className={`list ${activeIndex === 3 ? "active" : ""}`}
              onClick={() => handleItemClick(3)}>
              <a href="#" style={{ textDecoration: "none", color: "inherit" }}>
                <span className="icon"> <BsSave2 /></span>
                <span onClick={()=>handleNavigation("/user")}  className="text">SavedProduct</span>
              </a>
            </li>}

           {!isAuthenticated&&<li
              ref={(el) => (listItemRefs.current[4] = el)}
              className={`list ${activeIndex === 4? "active" : ""}`}
              onClick={() => handleItemClick(4)} >
              <a style={{ textDecoration: "none", color: "inherit" }}>
               <span className="icon"><IoLogIn /></span>
                
                <span onClick={() => handleNavigation("/login")}  className="text">Login</span>
              </a>
            </li>}

       

            {!isAuthenticated&&<li
              ref={(el) => (listItemRefs.current[5] = el)}
              className={`list ${activeIndex === 5 ? "active" : ""}`}
              onClick={() => handleItemClick(5)}
              style={{ cursor: "pointer" }}
            >
              <a  style={{ textDecoration: "none", color: "inherit" }}>
                <span  className="icon"><FaRegRegistered /></span>
                <span onClick={() => handleNavigation("/login")}  className="text">SignUp</span>
              </a>
            </li>}

           {isAuthenticated&& <li
              ref={(el) => (listItemRefs.current[6] = el)}
              className={`list ${activeIndex === 6 ? "active" : ""}`}
              onClick={() => handleItemClick(6)}
              style={{ cursor: "pointer", marginRight: "20px" }}
            >
              <a href="#" style={{ textDecoration: "none", color: "inherit" }}>
                <span className="icon"> {name}</span>
                <span onClick={()=>{handleNavigation("/user")}} className="text">user</span>
              </a>
            </li>}
          </div>
        </ul>
        {/* <div
          ref={indicatorRef}
          onClick={() => {
            const paths = ["/", "/about", "/login"];
            console.log("Path clicked",paths);
            handleNavigation(paths[activeIndex]);
          }}
          className="indicator">

        </div> */}
      </div>
    </div>
  );
}

export default Navbar;

