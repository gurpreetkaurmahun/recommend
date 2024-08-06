import React, { useContext } from"react";
import { useState ,createContext} from "react";
import {registerUser,loginUser,logoutUser} from"../Backend-services/AccountSpecific.js";

export  const AuthContext=createContext();

export  const useAuth=()=>useContext(AuthContext);
    

export default function AuthProvider({children}){

  
    const[authenticated,setAuthenticated]=useState(false);
    const[activeUserId,setActiveUserId]=useState("");
    const[token,SetToken]=useState("");
    const[IdentityId,setIdentityId]=useState("");

    async function Login(email,password){
        try{

            const emailBody = {
                Email: email,
                Password: password
            };

            const loginResponse = await loginUser(emailBody);
            console.log("The Login Response is",loginResponse);
            if(loginResponse.error){
                
                console.log("login error", loginResponse.error.message);
                return false;
            }
            if (loginResponse.message.token) 
            
            {
                setAuthenticated(true);
                setActiveUserId(parseInt(loginResponse.message.consumerId, 10));
                SetToken(loginResponse.message.token);
                setIdentityId(loginResponse.message.identityUserId);
               
                
                console.log("Response", loginResponse.message.token);
                return true;
            
            } else {
                alert("Invalid Credentials");
                console.error("Login response does not contain a token:", loginResponse.message);
                return false;
            }
    
        }catch(err){
            
            console.log("error is",err);
            return false;
    
    
        }

    }

    async function Logout(){

        try{
         
        
        
            const logoutResponse=await logoutUser();
        

            console.log("Logout Response: ", logoutResponse);
            if (logoutResponse.message==="Logged out") {
                console.log("logging out");
              
         
                setAuthenticated(false);
                setIdentityId("");
                setActiveUserId("");
                SetToken("");
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




    const contextToBeShared={authenticated,setAuthenticated,activeUserId,setActiveUserId,token,SetToken,IdentityId,setIdentityId,Login,Logout};

    return(<AuthContext.Provider value={contextToBeShared}>
            {children}
            </AuthContext.Provider>
    )
}

