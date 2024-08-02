import axios from "axios";
import{ API_BASE_URL} from"../apiConfig.js";

const getCustomers= async ()=>{
    try{
        const customerResponse = await axios.get(
            API_BASE_URL + 'Consumer',
         
        );
       
        console.log("Allconsumers response:",customerResponse.data)
        return customerResponse.data;

    }catch (error) {
        console.error("Product check error:", error.response ? error.response.data : error.message);
        
    }
  };

const getCustomerById=async(id)=>{

    try{

        const getCustomerWithId=await axios.get(
            `${API_BASE_URL}/Consumer/${id}`
            // ,
            // {
            //     headers: {
            //         'Authorization': `Bearer ${token}`,
            //         'Content-Type': 'application/json'
            //     }
            // }
        );

        console.log("ProductLocation by id Response:",getCustomerWithId.data);
        return getCustomerWithId.data;

    }catch(error){
        console.error("Customer with id  error:", error.response ? error.response.data : error.message);
    }
};

const addCustomer=async(token,customer)=>{

    try{

        const customerAdd=await axios.post(`${API_BASE_URL}Consumer`,
      customer,
        {
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("role :",customerAdd.data);
        return customerAdd.data;

    }catch(error){
        console.error("Customer Add error:", error.response ? error.response.data : error.message);
    }
};

// const updateCustomer=async(id,editCustomer)=>{

//     try{
//         const customerUpdate=await axios.put(`${API_BASE_URL}Customer/${id}`,editCustomer
     
//     )
//         console.log("Response for Customer Update:",customerUpdate.data);
//         return customerUpdate.data;

//     }catch(error){
//         console.error("Consumer with id check error:", error.response ? error.response.data : error.message);
//     }
// };

const updateCustomer = async (id, editCustomer) => {
    try {
        const response = await axios.put(`${API_BASE_URL}Consumer/${id}`, editCustomer, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log("Response for Customer Update:", response.data);
        return response.data;
    } catch (error) {
        console.error("Consumer update error:", error.response ? error.response.data : error.message);
        throw error; // Re-throw the error so it can be caught in the component
    }
};

const deleteCustomer=async(token,customerId)=>{

    // delete consumer should delete from user as well
    try{
        const customerDelete=await axios.delete(`${API_BASE_URL}Consumer/${customerId}`,
        {headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }}
        )
        return customerDelete.data;
    }catch(error){
        console.error("Customer delete error:", error.response ? error.response.data : error.message);
    }
};

export {getCustomers,getCustomerById,addCustomer,updateCustomer,deleteCustomer};