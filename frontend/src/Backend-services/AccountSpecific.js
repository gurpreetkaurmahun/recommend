import axios from "axios";
import{ API_BASE_URL} from"../apiConfig.js";


//This works


const registerUser = async (customer) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}Account/register`,customer)
      return { result: true, ...response.data };
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return { result: false, err: error.response };
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response received from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw error;
      }
    }
  };

const loginUser=async(credentials)=>{

    try{

        const loginResponse=await axios.post(
            `${API_BASE_URL}Account/Login`,credentials);
          
        console.log("Login Response:",loginResponse.data);
        return loginResponse.data;

    }catch(error){
        console.error("Error while loggin in:",  error.message);
        return{error:error.response};
    }
};

const logoutUser=async()=>{

    try{

        const logoutResponse=await axios.post(`${API_BASE_URL}Account/Logout`)
    

        console.log("Logout result",logoutResponse.data);
        return logoutResponse.data;

    }catch(error){
        console.error("Logout error:", error);
    }
};

const emailVerification=async(id,token)=>{

    try{
        const verifyResponse=await axios.get(`${API_BASE_URL}Account/verify-email`,
        {
            params: { userId: id, token: token }});
    
        console.log("Response for Verification email Update:",verifyResponse.data);
        return verifyResponse.data;

    }catch(error){
        console.error("Product with id check error:", error.response ? error.response.data : error.message);
    }
};

export{registerUser,loginUser,logoutUser,emailVerification};