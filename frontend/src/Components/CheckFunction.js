//edit/cancel edit operations in all backend servoce edit operation

import axios from "axios";
import{ API_BASE_URL} from"../apiConfig.js";
import React from "react";
import{useNavigate} from 'react-router-dom';
import Spinner from "../Pages/Spinner.js";
import { useState,useEffect } from "react";
import { FaRegUser } from "react-icons/fa6";
import { FaUserLock } from "react-icons/fa";
import {registerUser,loginUser,logoutUser,emailVerification} from"../Backend-services/AccountSpecific.js";

import MyForm from "./Form.js";


//wait for token check if user wiyh that account exists
//check if user with that eamill already exists in register user method

function CheckForm(){




    const fields = [
        { name: 'Email', type: 'email', label: 'Email' },
        { name: 'Password', type: 'password', label: 'Password' },
        { name: 'FName', type: 'text', label: 'Firstname' },
        { name: 'LName', type: 'text', label: 'Lastname' },
        { name: 'Address', type: 'text', label: 'Address' },
        { name: 'ContactNo', type: 'text', label: 'ContactNo' },
        { name: 'Dob', type: 'date', label: 'DateofBirth' },
       
        
    ];

    const initialValues={
        "Email":"",
            "Password":"",
            "FName":"",
            "LName":"",
            "Address":"",
            "ContactNo":"",
            "Dob":"",
            "Latitude":0.0,
            "Longitude":0.0,
            "FullLocation":""
    }

    const[user,setUser]=useState({
        
            "Email":"",
            "Password":"",
            "FName":"",
            "LName":"",
            "Address":"",
            "ContactNo":"",
            "Dob":"",
            "Latitude":0.0,
            "Longitude":0.0,
            "FullLocation":""
        
    });

   
    const[error,setError]=useState("");

    const[loading,setLoading]=useState(false);
    const[registration,setRegistration]=useState(false);
    const[token,setToken]=useState("");
    const[id,setId]=useState("");
    const[verifying,setVerifying]=useState(false);
    const navigate=useNavigate();

   

  async function handleSubmit(values){
    console.log("Values: ", values);
    setLoading(true);
    setError("");
    try{
        const customer={
        "Email":values.Email,
        "Password":values.Password,
        "FName":values.FName,
        "LName":values.LName,
        "Address":values.Address,
        "ContactNo":values.ContactNo,
        "Dob":values.Dob,
        "Latitude":values.Latitude,
        "Longitude":values.Longitude,
        "FullLocation":values.FullLocation
    
        };
        const NewUser=await registerUser(customer);

        setId(NewUser.userID);
        setToken(NewUser.token);

        console.log("New user result:",NewUser);
        
        setRegistration(true);

    }
    catch(error){
        console.log("An error occured while registering customer: ",error);
    }
    finally{
        setLoading(false);
    }
    }

    async function handleVerificationConfirmation() {
        
        setVerifying(true);
        try {
         const verifyEmail= await emailVerification(id,token);

         console.log("Email Verification result", verifyEmail);
         if (verifyEmail.result) {
            alert("Email verified successfully!");
            navigate("/search");
        } else {
            setError(verifyEmail.message || "Email verification failed. Please try again.");
        }
        } catch (error) {
          setError("Failed to confirm verification. Please try again.");
        } finally {
          setVerifying(false);
        }
      }

      if (loading) {
        return <Spinner />;
      }
    
      if (registration) {
        return (
          <div>
            <h2>Registration Successful!</h2>
            <p>Please check your email and click the verification link.</p>
            {verifying?<Spinner/>:<button onClick={handleVerificationConfirmation}>I've verified my email</button>}
            
            {/* <button onClick={handleResendVerification}>Resend verification email</button> */}
            {error && <p style={{color: 'red'}}>{error}</p>}
          </div>
        );
      }
    


    return (
        <MyForm
        fields={fields}
        initialValues={initialValues}
        onSubmit={handleSubmit}></MyForm>

        
    )}
  
    
export default CheckForm;

