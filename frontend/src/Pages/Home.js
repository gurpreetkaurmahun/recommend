import React from "react";
import SearchBar from "../Components/SearchBar";
import 'bootstrap/dist/css/bootstrap.min.css';
import MiddleElement from "./MiddleElement";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { useState } from "react";
import MyForm from "../Components/Form";

function Home() {
  
    return(
      <div>
        <Navbar/>
        <MiddleElement/>
        <MyForm/>
      </div>

       
    );
}

export default Home;
