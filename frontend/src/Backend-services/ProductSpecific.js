import axios from "axios";
import{ API_BASE_URL} from"../apiConfig.js";

const getProducts= async (token)=>{
    try{
        const productResponse = await axios.get(
            API_BASE_URL + 'Product'
            // {
            //     headers: {
            //         'Authorization': `Bearer ${token}`,
            //         'Content-Type': 'application/json'
            //     }
            // }
        );
       
        console.log("Products response:",productResponse.data)

        console.log("response",productResponse);
        return {
            data:productResponse.data,
            status:productResponse.status
        };

    }catch (error) {
        console.error("Product check error:", error.response);
        return error;
        
    }
  };

const getProductsById=async(id,token)=>{

    try{

        const getProductWithId=await axios.get(
            `${API_BASE_URL}/Product/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("Product by id Response:",getProductWithId.data);
        return getProductWithId.data;

    }catch(error){
        console.error("Product with id check error:", error.response ? error.response.data : error.message);
    }
};

const addProduct=async(token,product)=>{

    try{

        const productAdd=await axios.post(`${API_BASE_URL}Product`,
       product,
        {
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("role :",productAdd.data);
        return productAdd.data;

    }catch(error){
        console.error("Product with id check error:", error.response ? error.response.data : error.message);
    }
};

const updateProduct=async(token,id,editProduct)=>{

    try{
        const productUpdate=await axios.put(`${API_BASE_URL}Product/${id}`,editProduct,
        {
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    )
        console.log("Response for Product Update:",productUpdate.data);
        return productUpdate.data;

    }catch(error){
        console.error("Product with id check error:", error.response ? error.response.data : error.message);
    }
};

const deleteProduct=async(productId)=>{
    try{

        console.log("Product id:",typeof(productId));
        const productDelete=await axios.delete(`${API_BASE_URL}Product/${productId}`
        
        // ,
        // {headers:{
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json'
        // }}
        )
        return {
            data:productDelete.data,
            response:productDelete.status
        }
    }catch(error){
        console.error("Product with id check error:", error.response ? error.response.data : error.message);
    }
};


export {getProducts,getProductsById,addProduct,updateProduct, deleteProduct};