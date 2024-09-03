import React, { useContext } from"react";
import { useState ,createContext,useEffect} from "react";
import {registerUser,loginUser,logoutUser} from"../Backend-services/AccountSpecific.js";
import {validEmail,validPassword} from "../Helpers/Validation.js";
import { jwtDecode } from 'jwt-decode';
import Message from "./Message.js";

export  const AuthContext=createContext();

export  const useAuth=()=>useContext(AuthContext);
    


//check local storage and use auth

export default function AuthProvider({children}){

  
    const [authenticated, setAuthenticated] = useState(false);
    const [activeUserId, setActiveUserId] = useState("");
    const [token, setToken] = useState("");
    const [identityId, setIdentityId] = useState("");
    const [message, setMessage] = useState(null);


    useEffect(() => {
        const intervalId = setInterval(() => {
            checkTokenValidity();
        }, 60000); // Check every minute
    
        return () => clearInterval(intervalId);
    }, []);

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
            const emailBody = { Email: email, Password: password };
            if (!validEmail(emailBody.Email)) return { error: "Invalid Email entered" };
            if (!validPassword(emailBody.Password)) return { error: "Invalid password" };
    
            const loginResponse = await loginUser(emailBody);
            console.log("Full login response:", loginResponse); // Log the entire response
    
            if (loginResponse.error) return { error: loginResponse.error.message };
    
            if (loginResponse.message && loginResponse.message.token) {
                console.log("Received token:", loginResponse.message.token); // Log the received token
                
                try {
                    const decodedToken = jwtDecode(loginResponse.message.token);
                    console.log("Decoded token:", decodedToken); // Log the decoded token
                    
                    setAuthenticated(true);
                    setActiveUserId(parseInt(loginResponse.message.consumerId, 10));
                    setToken(loginResponse.message.token);
                    setIdentityId(loginResponse.message.identityUserId);
                    
                    // Verify token is stored correctly
                    console.log("Stored token:", localStorage.getItem("userToken"));
                    
                    setTokenExpirationTimer(decodedToken.exp * 1000 - Date.now());
                    return { result: true, token: loginResponse.message.token };
                } catch (decodeError) {
                    console.error("Error decoding token:", decodeError);
                    return { error: "Invalid token structure" };
                }
            } else {
                console.error("Login response does not contain a token:", loginResponse);
                return { error: "Invalid Credentials" };
            }
        } catch (err) {
            console.error("Login error:", err);
            return { error: err.message || "An unexpected error occurred" };
        }
    }

    function checkTokenValidity() {
        const storedToken = localStorage.getItem("userToken");
        if (storedToken) {
            try {
                const decodedToken = jwtDecode(storedToken);
                if (decodedToken.exp * 1000 > Date.now()) {
                    setAuthenticated(true);
                    setToken(storedToken);
                    setActiveUserId(localStorage.getItem("activeUserId"));
                    setIdentityId(localStorage.getItem("identityId"));
                    setTokenExpirationTimer(decodedToken.exp * 1000 - Date.now());
                } else {
                    handleLogout(); // This will now set the message
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                handleLogout(); // Handle invalid tokens
            }
        }
    }
    function setTokenExpirationTimer(timeout) {
        setTimeout(() => {
            handleLogout();
        }, timeout);
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

        function handleLogout() {
            localStorage.removeItem("userToken");
            localStorage.removeItem("activeUserId");
            localStorage.removeItem("identityId");
            setAuthenticated(false);
            setIdentityId("");
            setActiveUserId("");
            setToken("");
            setMessage("Session Timed Out"); // Add this line
        }
   




    const contextToBeShared={authenticated,setAuthenticated,activeUserId,setActiveUserId,token,setToken,identityId,setIdentityId,Login,Logout};

    return(<AuthContext.Provider value={contextToBeShared}>
            {children}
            {message && console.log("Rendering message:", message)}
{message && <Message value={message} onClose={() => setMessage(null)} />}
            </AuthContext.Provider>
    )
}

