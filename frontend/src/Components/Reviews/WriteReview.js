import React from "react";
import MyForm from "../Form";
import{useState,useEffect}from"react";
import {addReview,updateReviews}from"../../Backend-services/ReviewSpecific.js";
import{validEmail}from "../../Helpers/Validation.js";
import Message from "../Message.js";
import {getUserEmail} from "../../Backend-services/RoleSpecific.js";
import {useAuth}from "../AuthenticateContext.js";

function WriteReview({onClose, initialReview, onSubmit}){

    console.log("Initial review passed is",initialReview);

    const[user,setUser]=useState("");
    const[userEmail,setUserEmail]=useState("");
    const[error,setError]=useState(false);
    const [errorMessage,setErrorMessage]=useState("");
    const[message,setShowMessage]=useState(false);

    useEffect(() => {
        const userId = localStorage.getItem("activeUserId");
        const identity=localStorage.getItem("identityId");
        console.log("Retrieved user for local reviews ID:", userId);
        if (userId) {
            setUser(userId);
     
            getUsersEmail(identity);
        } else {
            console.log("No user ID found in localStorage");
        }
    }, []);

    async function getUsersEmail(userId){

      

        try{
            const response= await getUserEmail(userId);
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

        console.log("review values",values);
        // if(!validEmail(values.Email)){
        //     setErrorMessage("Invalid Email Entered");
        //     setError(true);
        //     return;
        // }
        if (!values.Review || !values.Stars ||  !values.ScreenName) {
            setErrorMessage("Please fill out all the fields");
            setError(true);
            return;
        }

        const stars = parseInt(values.Stars, 10);
        if (isNaN(stars) || stars < 1 || stars > 5) {
            setError("Stars must be a number between 1 and 5");
            return;
        }

        try {
            let result;
            if (initialReview) {
                // Updating an existing review
                const reviewData = {
                    reviewId: initialReview.reviewId,
                    review: values.Review.trim(),
                    reviewDate: new Date().toISOString().split('T')[0],
                    stars: stars,
                    consumerId: parseInt(user, 10),
                    userEmail:userEmail,
                    consumerName: values.ScreenName.trim()
                };
                result = await updateReviews(initialReview.reviewId, reviewData);
                if (result.success) {
                    setShowMessage(true);
                    onSubmit(reviewData);
                }
            } else {
                if (!values.Review || !values.Stars ||  !values.ScreenName) {
                    setErrorMessage("Please fill out all the fields");
                    setError(true);
                    return;
                }
                // Adding a new review
                const newReview = {
                    review: values.Review.trim(),
                    reviewDate: new Date().toISOString().split('T')[0],
                    stars: stars,
                    consumerId: parseInt(user, 10),
                    userEmail:userEmail,
                    consumerName: values.ScreenName.trim()
                };
                result = await addReview(newReview);
                if (result.success) {
                    setShowMessage(true);
                    onSubmit(newReview);
                }
            }
    
            if (result.success) {
                onClose();
            } else {
                setError(result.error || "Failed to submit review. Please try again.");
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