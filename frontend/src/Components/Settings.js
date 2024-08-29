import React from "react";
import { useState,useEffect } from "react";
import{getCustomerById} from "../Backend-services/CustomerSpecific.js";
import MyForm from "./Form.js";
import{updateCustomer} from "../Backend-services/CustomerSpecific.js";
import { IoCloseCircleOutline } from "react-icons/io5";

function Settings({onUserUpdate}){
    const [activeTab, setActiveTab] = useState('General Settings');
    const[user,setUser]=useState("");

    const[userId,setUserId]=useState("");
    const[identity,setIdentity]=useState("");

    const[showVerificationMessage,setShowVerificationMessage]=useState(false);



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
        const userToken = localStorage.getItem("userToken");
        const userIdString=localStorage.getItem("activeUserId");
        const userId = parseInt(userIdString, 10);
   
        console.log("Token in use effect:", userToken);
        console.log("User ID in use effect:", userId);
    
        if (userToken && userId) {
           setUserId(userId);
            getConsumer(userId);
           
        }
       
    },[]);

    async function getConsumer(userId){
        try{

            const response=await getCustomerById(userId);

            console.log("logged in user for user settings is :",response.consumer);
            setUser(response.consumer.fName);
            setIdentity(response.consumer.identityUserId)

        }
        catch(error){
            console.log("Error fetching Consumers:",error);
        }
    }


   async function handleSubmit(values){
        console.log("Values for update",values);

        const consumer={
            consumerId:userId,
            "FName":values.FName,
            "LName":values.LName,
            "Address":values.Address,
            "ContactNo":values.ContactNo,
            identityUserId:identity,
            "Dob":values.Dob,
            "Latitude":0.0,
            "Longitude":0.0,
        }

        try {
            const response = await updateCustomer(userId, consumer);
            console.log("Response from Edit consumer is", response);

            // Update the local state
            setUser(values.FName);

            // Update localStorage if needed
            localStorage.setItem('userName', values.FName);

            // Trigger a re-render in the parent component
            if (typeof onUserUpdate === 'function') {
                onUserUpdate(values.FName);
            }
            setShowVerificationMessage(true);
        } catch (error) {
            console.error("Error updating consumer:", error);
        }


    }

    function onClose(){
        setShowVerificationMessage(false);
    }

  

    return (
        <div id="userSettings" style={{ 
     
            alignItems: "center",
            marginLeft: "10%",
            position: "relative",
            marginBottom: "200px",
            width: "90%",
            backgroundColor: "pink",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "5px"
          }}>
            <h2>User Settings</h2>


{showVerificationMessage && (
    <div  style={{
      position: "fixed",
      bottom:"40%",
      left: "40%",
      width:"500px",
      border:"1px solid black",
      backgroundColor: "#f9f9f9",
      padding: "20px",
      boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
      transition: "bottom 0.5s ease-in-out",
      zIndex: 1000
    }}>
        <div style={{height:20}}>

        <button 
          className="animatedButton" 
          onClick={onClose} 
          style={{ width: 40, position: "absolute", top: "-7%", right: "-48%", borderRadius: "50%" }}
        >
          <h3 style={{ fontSize: "30px", position: "relative", bottom: "20px", right: "15px" }}>
            <IoCloseCircleOutline />
          </h3>
        </button>
        </div>
        <hr></hr>
        <p>An Email Verification link has been sent, Please click the link and log in to continue.</p>
    </div>
)}
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
      
                <button 
                  onClick={() => setActiveTab('Account Settings')}
                  style={{
                      width:"300px",
                    padding: '10px 20px',
                    backgroundColor: activeTab === 'Account Settings' ? '#f0f0f0' : 'white',
                    border: 'none',
                    borderBottom: activeTab === 'Account Settings' ? '2px solid #000' : 'none',
                  }}
                >
                  Account Settings
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
                /> 
                    
                </div>
              )}


            {activeTab === 'Account Settings' &&(
                <div>

               <h1>Do you want to delete your account</h1>
               <button> Delete</button>
                    
                </div>
              )}
              </div>
          </div>

    )
}

export default Settings;

