import React from "react";

import Product from "./Product";
import { useLocation } from 'react-router-dom';
import Navbar from "../Pages/Navbar.js";
import { useState,useEffect } from "react";
import{addSavedProduct,deleteSavedProduct} from "../Backend-services/SavedProductSpecific.js";
import { useAuth } from "./AuthenticateContext";
import ClearLocalStorage from "./User.js";
import LocationMap from "./LocationMap.js";
import Footer from "../Pages/Footer.js";
//users can only save prodcuts if they have logged in
//delete prodcuts(done) , saved products tile, reference reserved, controllers set(alomost), saved product service(done) start working on location, add supermarket logo 


function AllProducts(){

    const[products,setProducts]=useState([]);
    const [searchProduct,setSearchProduct]=useState("");
    const[currentPage,setCurrentPage]=useState(1);
    const [nearbyStores, setNearbyStores] = useState([]);

    const productsPerPage=4;


    const location = useLocation();
    const userLocation={
        Latitude:localStorage.userLatitude,
        Longitude:localStorage.userLongitude,
        FullLocation:localStorage.userFullLocation
    };
    

 


    useEffect(() => {
        console.log("Location state:", location.state);
        if (location.state) {
          if (location.state.searchResults) {
            console.log("Setting products:", location.state.searchResults);
            setProducts(location.state.searchResults);
          }
          if (location.state.nearbyStores) {
            console.log("Setting nearby stores:", location.state.nearbyStores);
            setNearbyStores(location.state.nearbyStores);
          }
          if(location.state.searchProduct){
            setSearchProduct(searchProduct);
          }
          
        }
      }, [location]);

    console.log("Products state:", products);

    const authContext=useAuth();

    async function handleProductSave(product){


        if(authContext.activeUserId==""){
            alert("please login in to save products");
            
        }
        try{
            const save= await addSavedProduct({
                TempId: product.tempId,
                ConsumerId: authContext.activeUserId, // Assuming you have the consumer ID in the auth context
                DateSaved: new Date().toISOString() // Or any specific date you want to save
            });


            console.log("product saved is:",save);
        }
        catch(error){
            console.log("Error is",error);
        }

    }



   async function deleteTheProduct(product){
      if(authContext.activeUserId==""){
        alert("Please Login to continue");
        return;
      }

        const deleteProd= await deleteSavedProduct(authContext.activeUserId,product.tempId);

        console.log("delete clicked for",product.TempId);
        console.log(deleteProd);
      
    }

    console.log("products are",products);
    
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.max(1, Math.ceil(products.length / productsPerPage));

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    return (
        <div style={{border:"1px solid red"}}>
            <Navbar />

            <h2 style={{border:"1px solid blue",textAlign:"left"}}> Showing results for {searchProduct}</h2>

            <div style={{border:"4px solid red",width:"70%"}}>
          
            {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                    <Product
                        key={product.productId}
                        title={product.productName}
                        price={product.price}
                        supermarket={product.supermarketName}
                        pricePerUnit={product.pricePerUnit}
                        image={product.imageUrl}
                        link={product.url}
                        imageLogo={product.imageLogo}
                        onSave={() => handleProductSave(product)}
                        onDelete={() => deleteTheProduct(product)}
                    />
                ))
            ) : (
                <p>No products to display on this page.</p>
            )}
{/* 
            {products.length > productsPerPage && (
                <div>
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span> Page {currentPage} of {totalPages} </span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            )} */}
           </div>

            
         <div style={{border:"1px solid black"}}>
          Nearest Supermarket:
          <LocationMap 
            latitude={userLocation.Latitude}
            longitude={userLocation.Longitude}
            location={userLocation.FullLocation}
            stores={nearbyStores}
          />
          </div>


     


        <Footer/>
        </div>
      
    );
 
}

export default AllProducts;

//webcrawler