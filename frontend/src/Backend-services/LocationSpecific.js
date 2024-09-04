import axios from "axios";
import{ API_BASE_URL} from"../apiConfig.js";


//AddLocation Based On ConsumerId

//Check who can delete location data
const getLocations= async (token)=>{
    try{
        const locationResponse = await axios.get(
            API_BASE_URL + 'Location',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
       
        console.log("Locations response:",locationResponse.data)
        return locationResponse.data;

    }catch (error) {
        console.error("Product check error:", error.response ? error.response.data : error.message);
        
    }
  };

const getLocationById=async(id,token)=>{

    try{

        const getLocationWithId=await axios.get(
            `${API_BASE_URL}/Location/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("Location by id Response:",getLocationWithId.data);
        return getLocationWithId.data;

    }catch(error){
        console.error("Product with id check error:", error.response ? error.response.data : error.message);
    }
};

const addLocation=async(token,product)=>{

    try{

        const locationAdd=await axios.post(`${API_BASE_URL}Location`,
       product,
        {
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("role :",locationAdd.data);
        return locationAdd.data;

    }catch(error){
        console.error("Location add error:", error.response ? error.response.data : error.message);
    }
};

const updateLocation=async(token,id,editProduct)=>{

    try{
        const locationUpdate=await axios.put(`${API_BASE_URL}Location/${id}`,editProduct,
        {
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    )
        console.log("Response for Location Update:",locationUpdate.data);
        return locationUpdate.data;

    }catch(error){
        console.error("Location Update  error:", error.response ? error.response.data : error.message);
    }
};

const deleteLocation=async(token,locationId)=>{
    try{
        const locationDelete=await axios.delete(`${API_BASE_URL}Location/${locationId}`,
        {headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }}
        )
        return locationDelete.data;
    }catch(error){
        console.error("Location delete error:", error.response ? error.response.data : error.message);
    }
};