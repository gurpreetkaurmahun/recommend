import React, { useState, useEffect, useRef } from "react";
import { SlHome } from "react-icons/sl";
import { FaAnglesRight } from "react-icons/fa6";
import { IoLogIn } from "react-icons/io5";
import { FaRegRegistered } from "react-icons/fa";
import {useAuth} from "./AuthenticateContext.js";
import{Link, useNavigate} from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import { IoSearch } from "react-icons/io5";
import { BsSave2 } from "react-icons/bs";

import "./styles.css";

function Navbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate=useNavigate();

  const indicatorRef = useRef(null);
  const listItemRefs = useRef([]);

  const authContext=useAuth();

  // console.log("Login Component Authcontext:",authContext);

  const[name,setName]=useState("");

  const isAuthenticated=authContext.authenticated;

  // console.log("Auth context",authContext);

  useEffect(()=>{
    getUser();
  },[]);
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
  
  function getUser(){
    const userName=localStorage.getItem("userName");

    setName(userName[0]);

  }

  

  const handleNavigation=(path)=>{

      navigate(path);
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "150px",
        backgroundColor: "white",
      }}
      id="top"
    >
      <div className="navigation" style={{ width: "100%", position: "relative",backgroundColor:"white" }}>
        <ul
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "0 20px",
            listStyleType: "none",
          }}
        >
          <div style={{ display: "flex" }}>
            <li
              ref={(el) => (listItemRefs.current[0] = el)}
              className={`list ${activeIndex === 0 ? "active" : ""}`}
              onClick={() => handleItemClick(0)}
              style={{ cursor: "pointer", marginRight: "20px" }}
            >
              <a to="/" style={{ textDecoration: "none", color: "inherit" }}>
                <span className="icon"><SlHome /></span>
                <span onClick={() => handleNavigation("/")}  className="text">Home</span>
              </a>
            </li>
            <li
              ref={(el) => (listItemRefs.current[1] = el)}
              className={`list ${activeIndex === 1 ? "active" : ""}`}
              onClick={() => handleItemClick(1)}
              style={{ cursor: "pointer", marginRight: "20px" }}
            >
              <a href="#" style={{ textDecoration: "none", color: "inherit" }}>
                <span className="icon"><FaAnglesRight /></span>
                <span className="text">About</span>
              </a>
            </li>
          </div>
          <div style={{ display: "flex" }}><Link to="/" style={{color:"white",textDecoration:"none"}}> 
         <h1 style={{marginTop:"10%"}}>Recommend</h1>
          {/* <span className="brand"> </span> */}
          
          </Link></div>
          <div style={{ display: "flex" }}>

          <li
              ref={(el) => (listItemRefs.current[2] = el)}
              className={`list ${activeIndex === 2 ? "active" : ""}`}
              onClick={() => handleItemClick(2)}
              style={{ cursor: "pointer", marginRight: "20px" }}
            >
              <a to="/search" style={{ textDecoration: "none", color: "inherit" }}>
                <span className="icon"><IoSearch  /></span>
                <span onClick={() => handleNavigation("/search")}  className="text">Search</span>
              </a>
            </li>

            {isAuthenticated&& <li
              ref={(el) => (listItemRefs.current[3] = el)}
              className={`list ${activeIndex === 3 ? "active" : ""}`}
              onClick={() => handleItemClick(3)}
              style={{ cursor: "pointer", marginRight: "20px" }}
            >
              <a href="#" style={{ textDecoration: "none", color: "inherit" }}>
                <span className="icon"> <BsSave2 /></span>
                <span onClick={()=>handleNavigation("/user")}  className="text">SavedProduct</span>
              </a>
            </li>}

           {!isAuthenticated&&<li
              ref={(el) => (listItemRefs.current[4] = el)}
              className={`list ${activeIndex === 4? "active" : ""}`}
              onClick={() => handleItemClick(4)}
              style={{ cursor: "pointer", marginRight: "20px" }}
            >
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
        <div
          ref={indicatorRef}
          onClick={() => {
            const paths = ["/", "/about", "/login"];
            console.log("Path clicked",paths);
            handleNavigation(paths[activeIndex]);
          }}
          className="indicator"
          style={{
            position: "absolute",
           
            top: "-45%", // Adjust based on your design
            transition: "left 0.5s, width 0.5s",
            height: "60px", // Adjust height as needed
            background: "linear-gradient(45deg, #f321bf, #ebe1e4)",
          }}
        ></div>
      </div>
    </div>
  );
}

export default Navbar;

