import React from "react";
import { useState,useEffect } from "react";
import{getCustomerById} from "../../Backend-services/CustomerSpecific.js";
import MyForm from "../Form.js";
import{updateCustomer} from "../../Backend-services/CustomerSpecific.js";
import Message from "../Message.js";

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
   
      if (userToken && userId) 
      {
        setUserId(userId);
        getConsumer(userId);
           
      }
       },[]);

    async function getConsumer(userId){
        try{

          const response=await getCustomerById(userId);
          setUser(response.consumer.fName);
          setIdentity(response.consumer.identityUserId)

        }
        catch(error)
        {
            console.log("Error fetching Consumers:",error);
        }
    }


   async function handleSubmit(values){
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

        try 
        {
          const response = await updateCustomer(userId, consumer);
          console.log("Response from Edit consumer is", response);

          // Update the local state
          setUser(values.FName);

          // Update localStorage if needed
          localStorage.setItem('userName', values.FName);

          // Trigger a re-render in the parent component
          if (typeof onUserUpdate === 'function') 
          {
              onUserUpdate(values.FName);
          }
            setShowVerificationMessage(true);
        } 
        catch (error) 
        {
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
       
            padding: "20px",
        
            borderRadius: "5px"
          }}>
            <h2>User Settings</h2>


      {showVerificationMessage && (<Message value="Account Updated" onClose={()=>setShowVerificationMessage(false)}/>)}
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
                layout="vertical"
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

