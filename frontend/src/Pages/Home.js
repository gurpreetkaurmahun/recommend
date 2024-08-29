import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import Supermarket from "../assets/background.jpg";
import Footer from "./Footer";
import Navbar from "../Components/Navbar";
import Content from "./Content";

import "../Components/styles.css";
function Home() {

  
  
  return (
    <div>
      <Navbar />
      <div style={{position:"relative"}}>
            {/* <MiddleElement/> */}
           <div className="conatiner" style={{height:700,width:"100%",marginBottom:100}}>

            <img src={ Supermarket} style={{height:700,width:"100%"}}></img>
           </div></div>
      <Content/>
      <Footer/>

      
    </div>
  );
}

export default Home;
