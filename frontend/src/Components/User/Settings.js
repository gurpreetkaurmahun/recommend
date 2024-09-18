import React from "react";
import { useState,useEffect } from "react";
import{getCustomerById} from "../../Backend-services/CustomerSpecific.js";
import MyForm from "../Form.js";
import{updateCustomer} from "../../Backend-services/CustomerSpecific.js";
import Message from "../Message.js";
import {useAuth}from "../AuthenticateContext.js";
import{deleteUserProfile}from "../../Backend-services/RoleSpecific.js";
import {useNavigate} from "react-router-dom";

function Settings({onUserUpdate}){
    const [activeTab, setActiveTab] = useState('General Settings');
    const[user,setUser]=useState("");
    const[userId,setUserId]=useState("");
    const[identity,setIdentity]=useState("");
    const[error,setError]=useState(false);
    const[errorMessage,setErrorMessage]=useState(false);
    const[showVerificationMessage,setShowVerificationMessage]=useState(false);
    const[verification,setVerification]=useState("");
    const navigate=useNavigate();
    const authContext=useAuth();
    const isAuthenticated = authContext.authenticated; 
    const identityId=authContext.identityId;
    const activeId=authContext.activeUserId;


    const userFields=[
   
      { name: 'FName', type: 'text', label: 'FirstName' },
      { name: 'LName', type: 'text', label: 'Lastname' },
      { name: 'Address', type: 'text', label: 'Address' },
      { name: 'ContactNo', type: 'text', label: 'ContactNo' },
      { name: 'Dob', type: 'date', label: 'DateOfBirth' }
    ]

    const userValues={
      "FName":"",
      "LName":"",
      "Address":"",
      "ContactNo":"",
      "Dob":"",
      "Latitude":0.0,
      "Longitude":0.0,
      "FullLocation":""
    }

    useEffect(()=>{
      if (isAuthenticated) 
      {
        setUserId(activeId);
        setIdentity(identityId);   
      }
       },[]);

      async function handleSubmit(values){
        const consumer={
          consumerId:userId,
          "FName":values.FName,
          "LName":values.LName,
          "Address":values.Address,
          "ContactNo":values.ContactNo,
          "identityUserId":identity,
          "Dob":values.Dob,
          "Latitude":0.0,
          "Longitude":0.0,
        }

        try 
        {
          console.log("Consumer object being sent:", consumer);
          const response = await updateCustomer(userId, consumer);
          console.log("Response from Edit consumer is", response);

          if(response.success){
            setUser(values.FName);
            localStorage.setItem('userName', values.FName);
          }
          
          // Trigger a re-render in the parent component
          if (typeof onUserUpdate === 'function') 
          {
              onUserUpdate(values.FName);
          }
            setVerification("Account Updated");
            setShowVerificationMessage(true);
        } 
        catch (error) 
        {
            console.error("Error updating consumer:", error);
            setError(true);
            setErrorMessage(error.message);
        }
      }

    async function handleUnsubscription(){
      try {
        const userId = parseInt(localStorage.getItem("activeUserId"), 10);
        console.log("UserId string from localStorage:", localStorage.getItem("activeUserId"));
        console.log("Parsed userId:", userId);
    
        if (isNaN(userId)) {
          throw new Error("Please Login or register to subscribe for newsletter");
        }
    
        const response = await getCustomerById(userId);
        console.log("Full response from getCustomerById:", response);
    
        if (response.success && response.data && response.data.consumer) {
          console.log("Logged in user data:", response.data.consumer);
          
          const updatedUser = { ...response.data.consumer, isSubscribed: false};
          setUser(updatedUser);
          const updateResponse = await updateCustomer(updatedUser.consumerId, updatedUser);
          if (updateResponse.success) {
            setShowVerificationMessage(true);
            setVerification("Unsubcribed to newsletter, can subscribe anytime again!")
            console.log("User successfully unsubsubscribed to newsletter");
          } else {
            throw new Error("Failed to update user subscription status");
          }
        } else {
          throw new Error("No consumer data found in the response");
        }
      } catch (error) {
        console.error("Error in handleSubmit:", error);
        setError(true);
        setErrorMessage(error.message || "Failed to fetch or update user data");
      }
    }
    async function handleProfileDelete() {
      try {
        setShowVerificationMessage(true);
        setVerification("Warning: Profile will be deleted immediately");
        
        // Log out the user first
        await authContext.Logout();
        
        // Clear all local storage
        localStorage.clear();
        
        // Delete the user profile
        const response = await deleteUserProfile(identityId);
        
        if (response.success) {
          setShowVerificationMessage(true);
          setVerification("Profile deleted successfully");
          
          // Navigate to home page
          navigate("/", { replace: true });
        } else {
          throw new Error("Failed to delete profile");
        }
      } catch (error) {
        console.error("Error deleting profile:", error);
        setError(true);
        setErrorMessage(error.message || "An error occurred while deleting the profile");
      }
    }

   
    return (
        <div id="userSettings" style={{ 
     
            alignItems: "center",
            marginLeft: "10%",
            position: "relative",
            marginBottom: "200px",
            width: "90%",
       
            padding: "20px",
        
            borderRadius: "5px"
          }}>
            <h2>User Settings</h2>

        {error && <Message value={errorMessage} onClose={()=>setError(false)}/>}
      {showVerificationMessage && (<Message value={verification} onClose={()=>setShowVerificationMessage(false)}/>)}
            {/* Tab Headers */}
            <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
                <button 
                  onClick={() => setActiveTab('General Settings')}
                  style={{
                  width:"300px",
                    padding: '10px 20px',
                    backgroundColor: activeTab === 'General Settings' ? '#f0f0f0' : 'white',
                    border: 'none',
                    borderBottom: activeTab === 'General Settings' ? '2px solid #000' : 'none',
                  }}
                >
                 General Settings
                </button>
      
               
              </div>
              <div style={{ backgroundColor: '#f0f0f0', padding: "20px" }}>

              {activeTab === 'General Settings' &&(
                <div>

                <MyForm
                fields={userFields}
                initialValues={userValues}
                onSubmit={handleSubmit}
                buttonText="update"
                layout="vertical"
                /> 

                <div style={{display:"flex",marginTop:"10%"}}>
                  <h5 style={{marginRight:"10%",marginTop:"1%"}}>UnSubscribe to Newsletter</h5>
                <button className="buttonT" onClick={handleUnsubscription} > UnSubscribe </button>
                </div>
                
                    
                </div>
              )}


          
              </div>
      </div>

    )
}

export default Settings;

