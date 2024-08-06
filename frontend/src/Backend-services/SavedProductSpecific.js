import axios from "axios";
import{ API_BASE_URL} from"../apiConfig.js";

const getSavedProducts= async (token)=>{
    try{
        const productResponse = await axios.get(
            API_BASE_URL + 'SavedProduct',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
       
        console.log("Products response:",productResponse.data)
        return productResponse.data;

    }catch (error) {
        console.error("SavedProduct check error:", error.response ? error.response.data : error.message);
        
    }
  };

const getProductsById=async(id,token)=>{

    try{

        const getProductWithId=await axios.get(
            `${API_BASE_URL}/SavedProduct/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("SavedProduct by id Response:",getProductWithId.data);
        return getProductWithId.data;

    }catch(error){
        console.error("SavedProduct with id check error:", error.response ? error.response.data : error.message);
    }
};

const addSavedProduct=async(product)=>{

    try{

        const productAdd=await axios.post(`${API_BASE_URL}SavedProduct`, product);
        console.log("Data:",productAdd.data);
        return productAdd.data;

    }catch(error){
        console.error("SavedProduct Add error:", error.response ? error.response.data : error.message);
        return error;
    }
};

const updateSavedProduct=async(token,id,editProduct)=>{

    try{
        const productUpdate=await axios.put(`${API_BASE_URL}SavedProduct/${id}`,editProduct,
        {
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    )
        console.log("Response for SavedProduct Update:",productUpdate.data);
        return productUpdate.data;

    }catch(error){
        console.error("SavedProduct update error:", error.response ? error.response.data : error.message);
    }
};

const deleteSavedProduct=async(consumerId,tempId)=>{
    try{
        const productDelete=await axios.delete(`${API_BASE_URL}SavedProduct/${consumerId}/${tempId}`
        // ,
        // {headers:{
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json'
        // }}
        )
        return productDelete.data;
    }catch(error){
        console.error("SavedProduct delete error:", error.response ? error.response.data : error.message);
        return {error:error.response.data};
    }
};

export  {addSavedProduct,deleteSavedProduct};