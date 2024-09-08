import React from "react"
import Product from "../Components/Product/Product";
import {addSavedProduct} from "../Backend-services/SavedProductSpecific.js";
import { useState,useEffect } from "react";
import {Link} from "react-router-dom";
import { getProducts } from "../Backend-services/ProductSpecific";
import { useAuth } from "../Components/AuthenticateContext";
import Candies from "../assets/Candies.mp4";
import Coffee from "../assets/Coffee.mp4";
import Cherries from "../assets/cherries.mp4";
import Fruits from "../assets/Fruits.mov";
import SlideUpDiv from "../Components/InfoModal";
import "../Components/styles.css";

function Content(){

    const[products,setProducts]=useState([]);
    const [slideUpDiv,setSlideUpDiv] = useState(false);

   


    useEffect(()=>{
      getAllProducts();
    },[])

  async function getAllProducts(){
    try{

      const response=await getProducts();
      if(response.status==200){
        setProducts(response.data);
      }

    

    }
    catch(error){
      console.log("Error retreiving products",error);
    }
  }

  function handleClick(){
    console.log("Link clicked");
  }

  async function handleSaveProduct(product) {
    const userId=localStorage.getItem("activeUserId");
    if (userId === "") {
     setSlideUpDiv(true);
    } else {
      try {
        const productData = {
          TempId: product.tempId,
          ConsumerId: parseInt(userId, 10),
          DateSaved: new Date().toISOString()
        };
        console.log("Sending product data:", productData);
        const save = await addSavedProduct(productData);
        console.log("product saved is:", save);
      
      } catch (error) {
        console.error("Error saving product:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        }
      }
    }
  }
  const renderProductsByCategory = (category) => {
    const supermarketProducts = new Map();
  
    // Filter products by category and populate the Map
    products
      .filter((product) => product.categoryName === category)
      .forEach((product) => {
        if (!supermarketProducts.has(product.supermarketName)) {
          supermarketProducts.set(product.supermarketName, product);
        }
      });
  
    // Convert Map values to an array and limit to 6 products
    const filteredProducts = Array.from(supermarketProducts.values()).slice(0, 6);
  
    return filteredProducts.map((product) => (
      <Product
        key={product.id} // Assuming each product has a unique id
        title={product.productName}
        price={product.price} 
        image={product.imageUrl}
        link={product.url} 
        pricePerUnit={product.pricePerUnit}
        supermarket={product.supermarketName} 
        onSave={()=>handleSaveProduct(product)}
      />
    ));
  };

    return(
        <div>


<div className="mainContent" >

       {!slideUpDiv&&<button onClick={()=>setSlideUpDiv(true)} 
       className="modalTitleDiv"

        
        >Products</button>}
        {slideUpDiv && <SlideUpDiv  onClose={()=>setSlideUpDiv(false)}/>}
        <h2 className="contentH1" >Shop in  Candies</h2>
        <div className="contentTitle top" >
          <h2 className="contentText">
            Taste the sweet difference <span >🍬</span>
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
        <video className="contentVideo" src={Candies} autoPlay loop muted  />
        <div style={{ marginTop: 80 }}>{renderProductsByCategory("Candies")}</div>
      </div>


      <h2 className="contentH1 contentH "  >Shop in  Fruits</h2>
      <div className="mainContent">
      <div className="contentTitle">
          <h2 className="contentText">
            Wellness of Fruits <span >🍬</span>
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
        <video className="contentVideo" src={Fruits} autoPlay loop muted  />
        <div style={{ marginTop: 80 }}>{renderProductsByCategory("Fruits")}</div>
      </div>

      <h2 className="contentH1 contentH " >Shop in  Coffee</h2>
      <div className="mainContent" >
        <div className="contentTitle">
          <h2 className="contentText">
            Brew Your Perfect Cup <span >☕</span>
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
        <video className="contentVideo" src={Coffee} autoPlay loop muted  />
        <div style={{ marginTop: 80 }}>{renderProductsByCategory(" Coffee")}</div>
      </div>
      
        </div>
    )
}

export default Content;