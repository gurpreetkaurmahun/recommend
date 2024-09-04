import axios from "axios";
import{ API_BASE_URL} from"../apiConfig.js";

const getProductLocations= async (token)=>{
    try{
        const productResponse = await axios.get(
            API_BASE_URL + 'ProductLocation',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
       
        console.log("ProductLocations response:",productResponse.data)
        return productResponse.data;

    }catch (error) {
        console.error("Product check error:", error.response ? error.response.data : error.message);
        
    }
  };

const getProductLocationById=async(id,token)=>{

    try{

        const getProductLocationWithId=await axios.get(
            `${API_BASE_URL}/ProductLocation/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("ProductLocation by id Response:",getProductWithId.data);
        return getProductLocationWithId.data;

    }catch(error){
        console.error("Product with id check error:", error.response ? error.response.data : error.message);
    }
};

const addProductLocation=async(token,product)=>{

    try{

        const productLocationAdd=await axios.post(`${API_BASE_URL}ProductLocation`,
       product,
        {
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("role :",productAdd.data);
        return productLocationAdd.data;

    }catch(error){
        console.error("Product with id check error:", error.response ? error.response.data : error.message);
    }
};

const updateProductLocation=async(token,id,editProduct)=>{

    try{
        const productLocationUpdate=await axios.put(`${API_BASE_URL}ProductLocation/${id}`,editProduct,
        {
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    )
        console.log("Response for Product Update:",productUpdate.data);
        return productLocationUpdate.data;

    }catch(error){
        console.error("Product with id check error:", error.response ? error.response.data : error.message);
    }
};

const deleteProductLocation=async(token,plId)=>{
    try{
        const productDelete=await axios.delete(`${API_BASE_URL}Product/${plId}`,
        {headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }}
        )
        return productDelete.data;
    }catch(error){
        console.error("Product with id check error:", error.response ? error.response.data : error.message);
    }
};