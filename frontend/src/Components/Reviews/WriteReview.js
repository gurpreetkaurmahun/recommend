import React from "react";
import MyForm from "../Form";
import{useState,useEffect}from"react";
import {addReview}from"../../Backend-services/ReviewSpecific.js";
import{useNavigate}from"react-router-dom";
import Message from "../Message.js";

function WriteReview({onClose}){

    const[user,setUser]=useState("");
    const[isUser,setIsUser]=useState(false);
    const[error,setError]=useState("");
    const[message,setShowMessage]=useState(false);



    useEffect(()=>{
        const userId=localStorage.getItem("activeUserId");
        if(user!=null){
            setUser(userId);
        }

    },[]);


    const fields=[
        { name: 'Review', type: 'text', label: 'Review' },
        { name: 'Stars', type: 'int', label: 'Stars' },
       
        { name: 'Email', type: 'Email', label: 'Email' },
        { name: 'ScreenName', type: 'text', label: 'Your Screen Name' }

    ]
    const initialValues={
        Review:"",
        Stars:"",
        ReviewDate:"",
        Email:""
       }

       const ReviewValues={
        "review": "",
            "reviewDate": "",
            "stars": 0,
            "consumerId": "",
          
            "userEmail": "",
            "consumerName": ""
       }

       async function handleSubmit(values) {
        console.log("review values:", values);
        const review = {
            "review": values.Review,
            "reviewDate": new Date().toISOString(),
            "stars": values.Stars,
            "consumerId": user,
            "userEmail": values.Email,
            "consumerName": values.ScreenName
        };
    
        console.log("Review object to be passed is :", review);
        try {
            const response = await addReview(review);
    
            if (response.success) {
                setShowMessage(true);
                onClose(); // Close the form
                // navigate("/review"); // This line is not needed if you're already on the review page
            } else {
                setError("Failed to post review. Please try again.");
            }
    
            console.log("Review Response:", response);
        } catch (error) {
            console.error("Error posting review:", error);
            setError("An error occurred while posting the review.");
        }
    }

       return(
        <div style={{
            position: "fixed", 
            top: "50%", 
            left: "50%", 
            transform: "translate(-50%, -50%)", 
            backgroundColor: '#f0f0f0', 
            padding: "20px",
            width: "70%",
            maxWidth: "500px",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            minHeight:"50vh",
            zIndex: 1000
        }}>
            {message&&<Message value="Review Posted" onClose={()=>setShowMessage(false)}  />}
            <button 
                onClick={onClose}
                className="buttonT"
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    fontSize: '16px',
                    cursor: 'pointer',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    backgroundColor: '#f65dd0',
                    color: 'white',
                    width:"100px"
                }}
            >
                Close
            </button>
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Write a Review</h2>
            <MyForm
                fields={fields}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                buttonText="Post"
                layout="vertical"
            />
        </div>
    )
}



export default WriteReview;