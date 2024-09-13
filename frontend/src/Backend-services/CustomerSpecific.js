import axios from "axios";
import{ API_BASE_URL} from"../apiConfig.js";

const getCustomers= async ()=>{
    try{
        const response = await axios.get(
            API_BASE_URL + 'Consumer',
         
        );
       
        console.log("Allconsumers response:",response.data)
        return { success: true, data: response.data };

    }catch (error) {
        return { 
            success: false, 
            error: error.response?.data || error.message || "An error occurred while sending the newsletter"
          };
        
    }
  };

const getCustomerById=async(id)=>{

    try{

        const response=await axios.get(
            `${API_BASE_URL}Consumer/${id}`
        );

        console.log("Consumer by id Response:",response.data);
        return { success: true, data: response.data };

    }catch(error){
        return { 
            success: false, 
            error: error.response?.data || error.message || "An error occurred while sending the newsletter"
          };
    }
};

const addCustomer=async(token,customer)=>{

    try{

        const response=await axios.post(`${API_BASE_URL}Consumer`,
      customer,
        {
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("role :",response.data);
        return { success: true, data: response.data };

    }catch(error){
        return { 
            success: false, 
            error: error.response?.data || error.message || "An error occurred while sending the newsletter"
          };
    }
};


const updateCustomer = async (id, editCustomer) => {
    try {
        const response = await axios.put(`${API_BASE_URL}Consumer/${id}`, editCustomer, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log("Response for Customer Update:", response.data);
        return { success: true, data: response.data };
    } catch (error) {
        return { 
            success: false, 
            error: error.response?.data || error.message || "An error occurred while sending the newsletter"
          };
    }
};

const deleteCustomer=async(token,customerId)=>{

    // delete consumer should delete from user as well
    try{
        const response=await axios.delete(`${API_BASE_URL}Consumer/${customerId}`,
        {headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }}
        )
        return { success: true, data: response.data };
    }catch(error){
        return { 
            success: false, 
            error: error.response?.data || error.message || "An error occurred while sending the newsletter"
          };
    }
};

export {getCustomers,getCustomerById,addCustomer,updateCustomer,deleteCustomer};