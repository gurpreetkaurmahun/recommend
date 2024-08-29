import React, { useContext } from"react";
import { useState ,createContext,useEffect} from "react";
import {registerUser,loginUser,logoutUser} from"../Backend-services/AccountSpecific.js";
import {validEmail,validPassword} from "../Helpers/Validation.js";
export  const AuthContext=createContext();

export  const useAuth=()=>useContext(AuthContext);
    


//check local storage and use auth

export default function AuthProvider({children}){

  
    const [authenticated, setAuthenticated] = useState(false);
    const [activeUserId, setActiveUserId] = useState("");
    const [token, setToken] = useState("");
    const [identityId, setIdentityId] = useState("");

    useEffect(() => {
        // Check localStorage for existing auth data when the component mounts
        const storedToken = localStorage.getItem("userToken");
        const storedUserId = localStorage.getItem("activeUserId");
        const storedIdentityId = localStorage.getItem("identityId");

        if (storedToken && storedUserId && storedIdentityId) {
            setAuthenticated(true);
            setToken(storedToken);
            setActiveUserId(storedUserId);
            setIdentityId(storedIdentityId);
        }
    }, []);


    useEffect(() => {
        // Update localStorage when auth state changes
        if (authenticated) {
            localStorage.setItem("userToken", token);
            localStorage.setItem("activeUserId", activeUserId);
            localStorage.setItem("identityId", identityId);
        } else {
            localStorage.removeItem("userToken");
            localStorage.removeItem("activeUserId");
            localStorage.removeItem("identityId");
        }
    }, [authenticated, token, activeUserId, identityId]);

    async function Login(email, password) {
        try {
            const emailBody = {
                Email: email,
                Password: password
            };
    
            if (!validEmail(emailBody.Email)) {
                return { error: "Invalid Email entered" };
            }
    
            if (!validPassword(emailBody.Password)) {
                return { error: "Invalid password" };
            }
    
            const loginResponse = await loginUser(emailBody);
            console.log("The Login Response is", loginResponse);
    
            if (loginResponse.error) {
                console.log("login error", loginResponse.error.message);
                return { error: loginResponse.error.message };
            }
    
            if (loginResponse.message.token) {
                setAuthenticated(true);
                setActiveUserId(parseInt(loginResponse.message.consumerId, 10));
                setToken(loginResponse.message.token);
                setIdentityId(loginResponse.message.identityUserId);
    
                console.log("Response", loginResponse.message.token);
                return { result: true, token: loginResponse.message.token };
            } else {
                console.error("Login response does not contain a token:", loginResponse.message);
                return { error: "Invalid Credentials" };
            }
        } catch (err) {
            console.log("error is", err);
            return { error: err.message || "An unexpected error occurred" };
        }
    }

    async function Logout(){

        try{
         
        
        
            const logoutResponse=await logoutUser();
        

            console.log("Logout Response: ", logoutResponse);
            if (logoutResponse.message==="Logged out") {
                console.log("logging out");
              
                localStorage.removeItem("userToken");
                localStorage.removeItem("activeUserId");
                setAuthenticated(false);
                setIdentityId("");
                setActiveUserId("");
                setToken("");
                console.log("Logout complete", logoutResponse);
                return true;
            }
        
            else{
                console.log("Logout Not complete", logoutResponse);
                return false;
            }
        }
        catch(error){
            console.error(error);
        }
        }




    const contextToBeShared={authenticated,setAuthenticated,activeUserId,setActiveUserId,token,setToken,identityId,setIdentityId,Login,Logout};

    return(<AuthContext.Provider value={contextToBeShared}>
            {children}
            </AuthContext.Provider>
    )
}

