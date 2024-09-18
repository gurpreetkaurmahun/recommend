import React from "react";
import MyForm from "../Form";
import{useState,useEffect}from"react";
import Message from "../Message.js";
import {getUserEmail} from "../../Backend-services/RoleSpecific.js";
import {useAuth}from "../AuthenticateContext.js";

function WriteReview({onClose, initialReview, onSubmit}){

    // console.log("Initial review passed is",initialReview);

    const[userId,setUserId]=useState("");
    const[userEmail,setUserEmail]=useState("");
    const[error,setError]=useState(false);
    const [errorMessage,setErrorMessage]=useState("");
    const[message,setShowMessage]=useState(false);
    const[authIdentity,setAuthIdentity]=useState("");
    const authContext=useAuth();
    const isAuthenticated = authContext.authenticated; 
    const identityId=authContext.identityId;
    const activeId=authContext.activeUserId;


    useEffect(() => {
        if(isAuthenticated){
            console.log("AuthCOntext for writing emails",authContext);
            getUserInfo();
            getUsersEmail(identityId);
        }
        else {
            console.log("No user ID found in AuthContext");
        }
    }, []);

    function getUserInfo() {
        if (identityId ) {
            setUserId(activeId);
            setAuthIdentity(identityId);
        } else {
          console.log("AuthContext values failed",authContext);
        }
      }

    async function getUsersEmail(user){
        try
        {
            const response= await getUserEmail(user);
            setUserEmail(response.email);
            console.log("userEmail response",response);
        }
        catch(error){
            console.log("error retreving user Email");
        }
    }
    
    const fields=[
       
        { name: 'Review', type: 'text', label: 'Review' },
        { name: 'Stars', type: 'int', label: 'Stars' },
        { name: 'ScreenName', type: 'text', label: 'Your Screen Name' }

    ]
    const initialValues = initialReview
    ? {
     
        Review: initialReview.review,
        Stars: initialReview.stars.toString(),
        ScreenName: initialReview.consumerName
    }
    : {
        Review: "",
        Stars: "",
        ScreenName: ""
    };
    async function handleSubmit(values) {
        console.log("review values", values, "initial review", initialReview);
        
        if (!values.Review || !values.Stars || !values.ScreenName) {
            setErrorMessage("Please fill out all the fields");
            setError(true);
            return;
        }
    
        const stars = parseInt(values.Stars, 10);
        if (isNaN(stars) || stars < 1 || stars > 5) {
            setError(true);
            setErrorMessage("Stars must be a number between 1 and 5");
            return;
        }
    
        try {
            const reviewData = {
                review: values.Review.trim(),
                reviewDate: new Date().toISOString().split('T')[0],
                stars: parseInt(values.Stars, 10),
                consumerId: parseInt(userId, 10),
                userEmail: userEmail,
                consumerName: values.ScreenName.trim()
            };
    
            if (initialReview) {
                reviewData.reviewId = initialReview.reviewId;
            }
    
            setShowMessage(true);
            onSubmit(reviewData, initialReview ? 'update' : 'add');
            onClose();
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            setError(true);
            setErrorMessage("An unexpected error occurred. Please try again.");
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
            {error&&<Message value={errorMessage}onClose={()=>setError(false)}/>}
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