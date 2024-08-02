import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { IoClose, IoMenu } from "react-icons/io5";
import {useAuth}from "../Components/AuthenticateContext";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';



function Navbar(){

    const authContext=useAuth();
    const isAuthenticated=authContext.authenticated;
    const navigate=useNavigate();

    function handleClick(){
        navigate("/Login");
    }

    function handleRegistration(){
      navigate("/register");
    }

    function handleLogout(){
      const message=authContext.Logout();
      console.log("logout message",message);
    }

    //Show customer details on login change the show the tab for customer name account details savedproducts if any and also logout button
     return(
      <div>
        
      <header class="p-3 text-bg-medium" >
      <div class="container">
        <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
            <svg class="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"></svg>
          </a>
  
          <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li><a href="#" class="nav-link px-2 text-secondary">Home</a></li>
            <li><a href="#" class="nav-link px-2 text-black">Features</a></li>
            <li><a href="#" class="nav-link px-2 text-black">Pricing</a></li>
            {/* <li><a href="#" class="nav-link px-2 text-black">FAQs</a></li> */}
            <li><a href="#" class="nav-link px-2 text-black">About</a></li>
          </ul>
  
          {/* <form class="col-12 col-lg-auto mb-3 mb-lg-0" role="search">
            <input type="search" class="form-control form-control-dark text-bg-dark" placeholder="Search..." aria-label="Search"/>
          </form> */}
  
          <div class="text-end " style={{display:"inline-block",width:250}}>

            {isAuthenticated &&<button class="btn btn-outline me-2" onClick={handleLogout} style={{display:"inline-block",width:100}}>Logout</button>}
           {!isAuthenticated&&<button type="button" onClick={handleClick} class="btn btn-outline me-2" style={{display:"inline-block",width:100}}>Login</button>}
            {!isAuthenticated&&<button type="button" onClick={handleRegistration} class="btn btn-warning"  style={{display:"inline-block",width:100}}>Sign-up</button>}
          </div>
        </div>
      </div>
      <div class="container d-flex flex-wrap justify-content-center" style={{backgroundColor:"yellow",marginTop:20}}>
    <a href="/" class="d-flex align-items-center mb-3 mb-lg-0 me-lg-auto link-body-emphasis text-decoration-none">
     {/* //img */}
      <h3 class="fs-4" style={{position:"relative",marginLeft:500}}>recommend....</h3>
    </a>
    
  </div>
  
  
    </header>
    </div>
     )
   }



export default Navbar;
