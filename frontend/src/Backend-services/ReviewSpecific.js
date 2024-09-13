import axios from "axios";
import{ API_BASE_URL} from"../apiConfig.js";

const getReviews=async()=>{
   try{

    const response=await axios.get(
        `${API_BASE_URL}reviews`)

        console.log("Review response",response.data)
        return response.data;

   }
   catch(error){
    console.log("Response error",error)
   }
}
const getReviewsById=async(id)=>{
try{
    const response=await axios.get(
        `${API_BASE_URL}reviews/${id}`)

        console.log("Review by Id response",response.data)

        return response.data;

}
catch(error){
    console.log("Response error",error)
   }

}
const addReview = async (review) => {
    try {
        console.log("Sending review data:", JSON.stringify(review, null, 2));
        
        const response = await axios.post(`${API_BASE_URL}reviews`, review);
        
        console.log("Review response:", response.data);
        return { success: true, message: response.data };
    } catch (error) {
        console.error("Error in addReview:", error);
        
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            
            if (error.response.data && error.response.data.errors) {
                const errorMessages = Object.entries(error.response.data.errors)
                    .map(([key, value]) => `${key}: ${value.join(', ')}`)
                    .join('; ');
                return { success: false, error: errorMessages };
            }
            
            return { success: false, error: error.response.data.title || error.response.data.message || "Server error" };
        } else if (error.request) {
            return { success: false, error: "No response received from server" };
        } else {
            return { success: false, error: error.message };
        }
    }
};


const updateReviews=async(id,reviewData)=>{

    try{

        const response = await axios.put(`${API_BASE_URL}Reviews/${id}`, reviewData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log("update Review response",response.data);
        return { success: true, message: response.data };

    }
    catch(error){
        console.log("Response error",error)
       }
}
const deleteReview=async(id)=>{

    try{
        const response=await axios.delete(`${API_BASE_URL}reviews/${id}`);

        console.log("Delete Review Response",response.data)
        return response.data;
    }catch(error){
        console.error("Review delete error:", error.response ? error.response.data : error.message);
    }
}

//
function calculateDays(reviewDate) {
    const today = new Date();
    const reviewDay = new Date(reviewDate);
    const diffTime = Math.abs(today - reviewDay);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays > 31) {
        const months = Math.floor(diffDays / 30.44); // Average days in a month
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
}

export{getReviews,getReviewsById,addReview,updateReviews,deleteReview,calculateDays};