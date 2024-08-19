import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import MiddleElement from "./MiddleElement";
import Footer from "./Footer";
import Navbar from "../Components/Navbar";
import Content from "./Content";

import "../Components/styles.css";
function Home() {

  
  
  return (
    <div>
      <Navbar />
      <MiddleElement />
      <Content/>
      <Footer/>

      
    </div>
  );
}

export default Home;
