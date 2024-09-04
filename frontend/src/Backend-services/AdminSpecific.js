//Admin operations to create scrapper on the front end as well.
//Add location based service
//Add boots scrapper
// and start desoigning element
import axios from "axios";
import{ API_BASE_URL} from"../apiConfig.js";

const getAllScrappers=async(token)=>{
    try{
        const response = await axios.get(`${API_BASE_URL}WebScrappers`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    }
    catch(error){
        console.error("Error fetching scrapers:", error);
        return error;
    }
}

const getScrapperById= async(token,scrapperId)=>{

    try{
        const response=await axios.get(`${API_BASE_URL}WebScrappers/${scrapperId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;


    }
    catch(error){
        console.error("Error fetching scrapers:", error);
        return error;
    }
}

const addScrapper=async(token,scrapper)=>{
try{
    const response= await axios.post(`${API_BASE_URL}WebScrappers/`,scrapper, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    return response.data;


}  
catch(error){
        console.error("Error adding scraper :", error);
        return error;
    }

}

const deleteScrapper=async(token,scrapperId)=>{
    try{

        const response=await axios.delete(`${API_BASE_URL}WebScrappers/${scrapperId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;

    }
    catch(error){
        console.error("Error deleting scraper:", error);
        return error;
    }
}

const updateScrapper= async(token,scrapperId,editScrapper)=>{

    try{
        const response=await axios.put(`${API_BASE_URL}WebScrappers/${scrapperId}`, editScrapper,{
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;

    }
    catch(error){
        console.error("Error updating scraper:", error);
        return error;
    }
}



export default {getAllScrappers,getScrapperById,addScrapper, deleteScrapper,updateScrapper};
