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
    const [editingReview, setEditingReview] = useState(null);


    useEffect(() => {
        const userId = localStorage.getItem("activeUserId");
        console.log("Retrieved user ID:", userId);
        if (userId) {
            setUser(userId);
        } else {
            console.log("No user ID found in localStorage");
        }
    }, []);


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
        // Validate input
        if (!values.Review || !values.Stars || !values.Email || !values.ScreenName) {
            setError("Please fill out all fields");
            return;
        }
    
        const stars = parseInt(values.Stars, 10);
        if (isNaN(stars) || stars < 1 || stars > 5) {
            setError("Stars must be a number between 1 and 5");
            return;
        }
    
        const review = {
            review: values.Review.trim(),
            reviewDate: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
            stars: stars,
            consumerId: parseInt(user, 10),
            userEmail: values.Email.trim(),
            consumerName: values.ScreenName.trim()
        };
    
        try {
            const result = await addReview(review);
            if (result.success) {
                setShowMessage(true);
                onClose();
            } else {
                setError(result.error || "Failed to post review. Please try again.");
            }
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            setError("An unexpected error occurred. Please try again.");
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