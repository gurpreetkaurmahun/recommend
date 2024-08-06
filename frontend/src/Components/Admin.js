import React from "react";
import {useAuth}from "./AuthenticateContext.js";
import getAllScrappers from "../Backend-services/AdminSpecific.js";
import{useState,useEffect} from "react";

function Admin(){

    const authContext=useAuth();
    const [token, setToken] = useState(null);
    const [scrapper,setScrapper]=useState([]);

    useEffect(() => {
        console.log("AuthContext from admin page is:", authContext);
        if (authContext.token) {
            setToken(authContext.token);
        }
    }, [authContext]);

    console.log("AuthCOntext fro admin page is s",authContext);

    async function handleSubmit(event){
        event.preventDefault();
        try{

            if (!token) {
                console.error("Token is not available");
                return;
            }
            console.log("Token being used:", token);
            const admin=await getAllScrappers(token);

            console.log("Admin result is",admin);
        }
        catch(error){
            console.log("error is",error);
        }
    }



    return(
        <div>
            <form onSubmit={handleSubmit}>
                <button type="submit">
                    check function
                </button>
            </form>

        </div>
    )


}

export default Admin;