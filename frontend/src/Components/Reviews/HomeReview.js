import React, { useState, useEffect } from "react";
import { getReviews } from "../../Backend-services/ReviewSpecific.js";
import Aos from"aos";
import 'aos/dist/aos.css';

function HomeReview() {
    const [reviews, setReviews] = useState([]);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

    useEffect(() => {
        fetchReviews();
    }, []);

    useEffect(()=>{
        Aos.init({duration:2000});
      },[])


    useEffect(() => {
        if (reviews.length > 0) {
            const timer = setInterval(() => {
                setCurrentReviewIndex((prevIndex) =>
                    prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
                );
            }, 4000);

            return () => clearInterval(timer);
        }
    }, [reviews]);

    useEffect(() => {

    }, [reviews]);

    useEffect(() => {

    }, [currentReviewIndex]);



    async function fetchReviews() {
        try {
            console.log("Fetching reviews...");
            const response = await getReviews();

            if (response && response.reviews && Array.isArray(response.reviews)) {
                // console.log("Setting reviews:", response.reviews);
                setReviews(response.reviews);
            } else {
                // console.log("No reviews found or invalid response format");
                setReviews([]);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setReviews([]);
        }
    }

    if (reviews.length === 0) {
        return <div>Loading reviews...</div>;
    }

    const currentReview = reviews[currentReviewIndex];
    // console.log("Current Review",currentReview);

    return (
        <div style={{
            width: "100%",
            height: "100%",
            zIndex: 1000,
            position: 'relative'
        }}

        >
            {currentReview ? (
                <>
                    <h1 style={{ fontWeight: "bold", position: "relative", right: 80, marginTop: "80px" }}>
                        {currentReview.consumerName || 'Anonymous'} says
                    </h1>
                    <span style={{fontSize: "60px", position: "relative", right: 200}}>❝</span>
                    <p style={{ fontSize: "1.2em", marginBottom: "20px" }}>{currentReview.review}</p>
                    <span style={{fontSize: "60px", position: "relative", left: 200, color: "golden"}}>❞</span>
                </>
            ) : (
                <p>No reviews available</p>
            )}
        </div>
    );
}

export default HomeReview;