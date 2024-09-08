import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css';

import Footer from "./Footer";
import Navbar from "../Components/Navbar";
import Content from "./Content";
import TypeWriters from "../Components/TypeWriters";
import "../Components/styles.css";
import HomeReview from "../Components/Reviews/HomeReview";
function Home() {

  
  
  return (
    <div>
      <Navbar />
      <div className="homeFirstElement"style={{position:"relative"}}>
       
           <div className="firstElement" >

            <img src="https://img.freepik.com/premium-photo/full-paper-bag-healthy-food-white-background-basket-full-fresh-vegetables-fruits-concept-proper-nutrition-cheese-cereals-food-delivery-your-home-different-foods_167368-172.jpg"></img>
            <div className="secondElement">
               <TypeWriters
              topString="Recommend...."
              link="/search"
              bottomString="Compare, Choose, and Save!"
              buttonText="Lets Get started"
            /></div>
           </div>
           
           </div>
      <Content/>
      <div className="reviewContent"  >
        <div style={{backgroundColor:"#e9a8d9", width:"50%"}}>
            <TypeWriters
                topString="Reviews...."
                link="/review"
                bottomString="See what people have to say about us.."
                buttonText="View All"
            />
        </div>
        <div className="reviewdiv" >
            <div style={{width:"100%", height: "100%", overflow: "auto",marginLeft:"50px"}}>
            <HomeReview/>
            </div>
        </div>
    </div>
      <Footer/>

      
    </div>
  );
}

export default Home;
