import React, { useState } from 'react';
import Navbar from './Navbar';
import {Link} from "react-router-dom";

const SlideUpDiv = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <button onClick={handleToggle}>
        {isVisible ? 'Hide' : 'Show'} Div
      </button>
      <div className={`slide-up-div ${isVisible ? 'active' : ''}` } style={{height:"auto",width:500,marginLeft:300,borderRadius:"20px"}}>
        <div>

        <p>Products</p>
      <button className="animatedButton"onClick={()=> setIsVisible(false)} style={{width:50,position:"absolute",top:"-30px",right:"-30px",borderRadius:"50%"}}> X</button>
      <hr></hr>
        </div>
      
        <h2 style={{marginTop:100}}>Become a member to save products</h2>
        <p>Recommend.. app memebership is great if you are someon who enjoys shopping smart!</p>
        
        <button className="animatedButton"onClick={()=> setIsVisible(false)} style={{width:300}}><Link to="/login">Become a member or SignIn</Link> </button>

        <img src="https://www.shutterstock.com/image-vector/signup-icon-black-line-art-260nw-2497668207.jpg" style={{width:300,height:300,border:"1px solid red",marginBottom:100}}></img>
      </div>
    </div>
  );
};

export default SlideUpDiv;
