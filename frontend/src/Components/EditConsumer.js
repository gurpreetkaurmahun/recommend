import React from "react";
import { FaRegUser } from "react-icons/fa6";
import { FaUserLock } from "react-icons/fa";
import { useState,useEffect } from "react";
import {getCustomers,getCustomerById,addCustomer,updateCustomer,deleteCustomer} from "../Backend-services/CustomerSpecific";
import { useAuth } from "./AuthenticateContext";

function EditConsumer(){
   const authContext=useAuth();
    const Id=authContext.activeUserId;
    const Identity=authContext.IdentityId;
    console.log()
    const[editConsumer,SetEditConsumer]=useState({
       "ConsumerId":Id,
        "FName": "",
        "LName": "",
        "Address": "",
        "ContactNo": "",
        "Dob": "",
        "IdentityUserId":Identity
    });
    const[edit,setEdit]=useState(false);

    function handleChange(event){
        const{name,value}=event.target;

        SetEditConsumer(prevConsumer=>{
            return {
                ...prevConsumer,
                [name]:value
            }
        })
        
    }


 useEffect(()=>{
    if (Id) {
        console.log(editConsumer);
    }
}, [Id]);
 

    async function EditC(){
        try{

            const consumerData={
                "ConsumerId":Id,
                "FName": editConsumer.FName,
                "LName": editConsumer.LName,
                "Address": editConsumer.Address,
                "ContactNo": editConsumer.ContactNo,
                "Dob": editConsumer.Dob,
                "IdentityUserId":Identity
            }
            console.log("Attempting to update consumer with ID:", Id);
            console.log("Data being sent:", consumerData);
            const getConsumer=await updateCustomer(Id,consumerData);

            console.log(consumerData);
            console.log("result is",getConsumer);

        }catch(error){
            console.log(error);
        }
    }

        async function getConsumers(){
            try{
                const Consumers= await getCustomers();
                console.log("All COnsumers:",Consumers);
            }
            catch(error){
                console.log(error);
            }
        }
    function cancelEdit(){
        SetEditConsumer({"ConsumerId":Id,
        "FName": "",
        "LName": "",
        "Address": "",
        "ContactNo": "",
        "Dob": "",
        "IdentityUserId":Identity});
        setEdit(false);
    }

    function handleSubmit(event){
        event.preventDefault();
        getConsumers();
        EditC();
    }

    return<div class="wrapper" id="login-component">

        <form onSubmit={handleSubmit}>
           <div className="input-box">
                <input onChange={handleChange}type="text" placeholder="FirstName" name="FName" value={editConsumer.FName} autoComplete="off" /><FaUserLock className="icon" />

            </div>

            <div className="input-box">
                <input onChange={handleChange}type="text" placeholder="LastName" name="LName" value={editConsumer.LName} autoComplete="off" /><FaUserLock className="icon" />

            </div>
            <div className="input-box">
                <input onChange={handleChange}type="text" placeholder="Address" name="Address" value={editConsumer.Address} autoComplete="off" /><FaUserLock className="icon" />

            </div>
            <div className="input-box">
                <input onChange={handleChange}type="date" placeholder="Address" name="Dob" value={editConsumer.Dob} autoComplete="off" /><FaUserLock className="icon" />

            </div>

            <div className="input-box">
                <input onChange={handleChange}type="text" placeholder="ContactNo" name="ContactNo" value={editConsumer.ContactNo} autoComplete="off" /><FaUserLock className="icon" /></div>

                <button type="submit"> Save</button>
                <button type="submit" onClick={cancelEdit}> Cancel</button>

                </form>

    </div>

}

export default EditConsumer;