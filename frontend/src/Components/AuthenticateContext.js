import React, { useContext } from"react";
import { useState ,createContext,useEffect} from "react";
import {loginUser,logoutUser} from"../Backend-services/AccountSpecific.js";
import {validEmail,validPassword} from "../Helpers/Validation.js";
import { jwtDecode } from 'jwt-decode';
import Message from "./Message.js";
import {getCustomerById} from "../Backend-services/CustomerSpecific.js";


export  const AuthContext=createContext();
export  const useAuth=()=>useContext(AuthContext);
export default function AuthProvider({children}){

  
    const [authenticated, setAuthenticated] = useState(false);
    const [activeUserId, setActiveUserId] = useState("");
    const [token, setToken] = useState("");
    const [identityId, setIdentityId] = useState("");
    const [message, setMessage] = useState(null);
    const[user,setUser]=useState("");


    useEffect(() => {
        const intervalId = setInterval(() => {
            checkTokenValidity();
        }, 600000); // Check every minute
    
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
            if (loginResponse.error) return { error: loginResponse.error.message };
    
            if (loginResponse.message && loginResponse.message.token) {
                console.log("Received token:", loginResponse.message.token);
    
                try {
                    const decodedToken = jwtDecode(loginResponse.message.token);
                    console.log("Decoded token:", decodedToken);
    
                    // Set localStorage items
                    localStorage.setItem("userToken", loginResponse.message.token);
                    localStorage.setItem("activeUserId", loginResponse.message.consumerId);
                    localStorage.setItem("identityId", loginResponse.message.identityUserId);
    
                    // Set state
                    setAuthenticated(true);
                    setActiveUserId(parseInt(loginResponse.message.consumerId, 10));
                    setToken(loginResponse.message.token);
                    setIdentityId(loginResponse.message.identityUserId);
    
                    const userResponse = await getCustomerById(loginResponse.message.consumerId);
                    console.log("Consumer first name response",userResponse);
                    if (userResponse && userResponse.data.consumer && userResponse.data.consumer.fName) {
                        setUser(userResponse.data.consumer.fName);
                        localStorage.setItem("userName", userResponse.data.consumer.fName);
                    } else {
                        console.error("User details not found in the response");
                    }
    
                    setTokenExpirationTimer(decodedToken.exp * 1000 - Date.now());
                    return { result: true, token: loginResponse.message.token };
                } catch (decodeError) {
                    console.error("Error decoding token:", decodeError);
                    return { error: "Invalid token structure", details: decodeError.message };
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
            try 
            {
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

    async function Logout() {
        try {
            const logoutResponse = await logoutUser();
    
            console.log("Logout Response: ", logoutResponse);
            if (logoutResponse.message === "Logged out") {
                console.log("logging out");
                
                // Clear all relevant items from local storage
                localStorage.removeItem("userToken");
                localStorage.removeItem("activeUserId");
                localStorage.removeItem("identityId");
                localStorage.removeItem("userLatitude");
                localStorage.removeItem("nearbyStores");
                localStorage.removeItem("userFullLocation");
                localStorage.removeItem("userLongitude");
                localStorage.removeItem("userName");
    
                // Update state
                setAuthenticated(false);
                setIdentityId("");
                setActiveUserId("");
                setToken("");
    
                return true;
            } 
            else 
            {
                console.log("Logout Not complete", logoutResponse);
                return false;
            }
        } 
        catch (error) 
        {
            console.error(error);
            return false;
        }
    }

    async function handleLogout() {
        const logoutSuccessful = await Logout();
        if (logoutSuccessful) {
            setMessage("Logged out successfully");
        } else {
            setMessage("Logout failed");
        }
    }



    const contextToBeShared={authenticated,setAuthenticated,activeUserId,setActiveUserId,token,setToken,identityId,setIdentityId,Login,Logout};

    return(<AuthContext.Provider value={contextToBeShared}>
            {children}
            {message && console.log("Rendering message:", message)}
            {message && <Message value={message} onClose={() => setMessage(null)} />}
            </AuthContext.Provider>
    )
}

