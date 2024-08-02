import axios from "axios";
import{ API_BASE_URL} from"../apiConfig.js";


//This works


const registerUser= async (customer)=>{
    try{
        const registerResponse = await axios.post(
            `${API_BASE_URL}Account/register`,customer)
       
        console.log("Register response:",registerResponse.data)
        return registerResponse.data;

    }catch (error) {
        console.error("Registration error:", error.response?.data?.message || error.message);
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
        return{error:error.response.data};
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