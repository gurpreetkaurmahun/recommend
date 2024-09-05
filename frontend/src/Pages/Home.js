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
      <div style={{position:"relative"}}>
            {/* <MiddleElement/> */}
           <div className="conatiner" style={{height:700,width:"100%",marginBottom:100,display:"flex"}}>

            <img src="https://img.freepik.com/premium-photo/full-paper-bag-healthy-food-white-background-basket-full-fresh-vegetables-fruits-concept-proper-nutrition-cheese-cereals-food-delivery-your-home-different-foods_167368-172.jpg" style={{height:700,width:"50%"}}></img>
            <div style={{backgroundColor:"#e9a8d9",width:"50%"}}>
               <TypeWriters
              topString="Recommend...."
              link="/search"
              bottomString="Compare, Choose, and Save!"
              buttonText="Lets Get started"
            /></div>
           </div></div>
      <Content/>
      <div  style={{height:700, marginBottom:100, display:"flex"}}>
        <div style={{backgroundColor:"#e9a8d9", width:"50%"}}>
            <TypeWriters
                topString="Reviews...."
                link="/review"
                bottomString="See what people have to say about us.."
                buttonText="View All"
            />
        </div>
        <div className="reviewdiv" style={{ 
            width: "50%", 
            height: "500px", 
            padding: "20px",
            boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)",
            backgroundColor: "white",
            borderRadius: "10px",
            marginLeft:"50px",
            marginTop:"100px"
        }}>
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
