import React from "react";

import Product from "./Product";
import { useLocation } from 'react-router-dom';
import Navbar from "../Pages/Navbar.js";
import { useState,useEffect } from "react";
import{addSavedProduct,deleteSavedProduct} from "../Backend-services/SavedProductSpecific.js";
import { useAuth } from "./AuthenticateContext";
import ClearLocalStorage from "./User.js";
import LocationMap from "./LocationMap.js";
//users can only save prodcuts if they have logged in
//delete prodcuts(done) , saved products tile, reference reserved, controllers set(alomost), saved product service(done) start working on location, add supermarket logo 


function AllProducts(){

    const[products,setProducts]=useState([]);
    const[currentPage,setCurrentPage]=useState(1);
    const productsPerPage=4;


    const location = useLocation();
    const userLocation={
        Latitude:localStorage.userLatitude,
        Longitude:localStorage.userLongitude,
        FullLocation:ClearLocalStorage.userFullLocation
    };
    

    useEffect(() => {
        console.log("Location state:", location.state);
        if (location.state && location.state.searchResults) {
            console.log("Search results:", location.state.searchResults);
            setProducts(location.state.searchResults);
            console.log("local location",userLocation);
            
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
        <div>
            <Navbar />
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
            )}
             <div>
         
          Nearest Supermarket:
          <LocationMap 
            latitude={userLocation.Latitude}
            longitude={userLocation.Longitude}
            location={userLocation.FullLocation}
          />
        </div>
        </div>
    );
 
}

export default AllProducts;

//webcrawler