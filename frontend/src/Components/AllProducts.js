import React from "react";
import { useState } from "react";
import Product from "./Product";
import {getProducts,getProductsById,addProduct,updateProduct, deleteProduct} from "../Backend-services/ProductSpecific";
import Spinner from "../Pages/Spinner";

function AllProducts(){

    const[products,setProducts]=useState([]);

    const[prod,setProd]=useState(false);

    async function refreshProducts(){
        const getFreshProducts=getProducts();
        if(getFreshProducts.status==200){
            console.log("Refreshing Products");
            setProducts(getFreshProducts.data);
        }
    }

    async function getAllProducts(){
        const allProducts= await getProducts();

        if(allProducts.status==200){
            setProducts(allProducts.data);
            setProd(true);
            console.log("AllProducts",allProducts);
        }

        

        console.log("AllProducts",allProducts);
       

    }

   async function deleteTheProduct(id){
      

        const deleteProd= await deleteProduct(id);

        console.log("delete clicked for",id);
        console.log(deleteProd);
        refreshProducts();
    }

    console.log("products are",products);

    return(

        <div>
            {products.map((product)=>(
                 <Product key={product.productId} productId={product.productId} title={product.productName} price={product.price} image={product.imageUrl} link={product.url} onDelete={deleteTheProduct}/>
            ))}
            
             <button onClick={getAllProducts}> GetProducts</button>
        </div>
        
    )
}

export default AllProducts;

//webcrawler