import React from "react"
import Product from "../Components/Product";

import { useState,useEffect } from "react";
import {Link} from "react-router-dom";
import { getProducts } from "../Backend-services/ProductSpecific";
import { useAuth } from "../Components/AuthenticateContext";
import Candies from "../assets/Candies.mp4";
import Coffee from "../assets/Coffee.mp4";
import Cherries from "../assets/cherries.mp4";
import Fruits from "../assets/Fruits.mov";

import "../Components/styles.css";

function Content(){

    const[products,setProducts]=useState([]);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const authContext=useAuth();


    useEffect(()=>{
      getAllProducts();
    },[])

  async function getAllProducts(){
    try{

      const response=await getProducts();
      if(response.status==200){
        setProducts(response.data);
      }

      console.log("Product response",response);

    }
    catch(error){
      console.log("Error retreiving products",error);
    }
  }

  function handleClick(){
    console.log("Link clicked");
  }

  async function handleSaveProduct(){
    if (authContext.activeUserId==""){
        setShowLoginPrompt(true);
    }
   
  }

  const renderProductsByCategory = (category) => {
    const filteredProducts = products
      .filter((product) => product.categoryName === category)
      .slice(0, 6); // Limit to 5 products

    return filteredProducts.map((product) => (

      <Product
      title={product.productName}
      price={product.price} 
      image={product.imageUrl}
      link={product.url} 
      pricePerUnit={product.pricePerUnit} supermarket={product.supermarketName} 
      onSave={handleSaveProduct}
      />
    
    ));
  };

    return(
        <div>


<div style={{ position: "relative",marginTop:100}}>
        <h2>Candies</h2>
        <div style={{ position: "absolute", top: 250, left: 300, zIndex: 10 }}>
          <h2 style={{ fontWeight: 400, fontSize: "60px", color: "white" }}>
            Taste the sweet difference <span style={{ fontWeight: 600, fontSize: "60px" }}>🍬</span>
          </h2>
          <Link
            onClick={handleClick}
            to="/Search"
            className="animatedButton"
        
          >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Search
          </Link>
        </div>
        <video src={Candies} autoPlay loop muted style={{ width: "80%", height: "700px", objectFit: "cover", zIndex: 1 }} />
        <div style={{ marginTop: 80 }}>{renderProductsByCategory("Fruits")}</div>
      </div>



      <div style={{position:"relative"}}>
      <div style={{ position: "absolute", top: 250, left: 300, zIndex: 10 }}>
          <h2 style={{ fontWeight: 400, fontSize: "60px", color: "white" }}>
            Wellness of Fruits <span style={{ fontWeight: 600, fontSize: "60px" }}>🍬</span>
          </h2>
          <Link
            onClick={handleClick}
            to="/Search"
            className="animatedButton"
        
          >
            <span></span>
        <span></span>
        <span></span>
        <span></span>
            Search
          </Link>
        </div>
        <video src={Fruits} autoPlay loop muted style={{ width: "80%", height: "700px", objectFit: "cover" }} />
        <div style={{ marginTop: 80 }}>{renderProductsByCategory("Fruits")}</div>
      </div>

      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", top: 250, left: 300, zIndex: 10 }}>
          <h2 style={{ fontWeight: 400, fontSize: "60px", color: "white" }}>
            Brew Your Perfect Cup <span style={{ fontWeight: 600, fontSize: "60px" }}>☕</span>
          </h2>
          <Link
            to="/Search"
            className="animatedButton"
       
            onClick={handleClick}
          >
            <span></span>
        <span></span>
        <span></span>
        <span></span>
            Search
          </Link>
        </div>
        <video src={Coffee} autoPlay loop muted style={{ width: "80%", height: "700px", objectFit: "cover", zIndex: 1 }} />
        <div style={{ marginTop: 80 }}>{renderProductsByCategory(" Coffee")}</div>
      </div>
        </div>
    )
}

export default Content;