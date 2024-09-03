import React from "react";
import {useState,useEffect} from "react";
import ReviewLink from "./ReviewLink";
import {getReviews} from"../../Backend-services/ReviewSpecific.js";
import { Link } from "react-router-dom";
function Reviews(){

    const [reviews,setReviews]=useState([]);
    const [visibleReviews, setVisibleReviews] = useState(6);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

    useEffect(()=>{
        fetchReviews();

    },[]);

    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         setCurrentReviewIndex((prevIndex) => 
    //             prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    //         );
    //     }, 2000); // Change slide every 5 seconds

    //     return () => clearInterval(timer);
    // }, [reviews]);

    async function fetchReviews() {
        try {
            const response = await getReviews();
            console.log("Full response from backend:", response);
            
            if (response && response.reviews && Array.isArray(response.reviews)) {
                setReviews(response.reviews);
                console.log("Reviews set to state:", response.reviews);
            } else {
                console.error("Unexpected response format:", response);
                setReviews([]);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    }
    function calculateDays(reviewDate) {
        const today = new Date();
        const reviewDay = new Date(reviewDate);
        const diffTime = Math.abs(today - reviewDay);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays;
    }

    const loadMoreReviews = () => {
        setVisibleReviews(prevVisible => prevVisible + 6);
    };

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            {reviews.length > 0 ? (
                <>
                    <div style={{ flex: 1, overflow: "hidden" }}>
                        <ReviewLink 
                            icon={reviews.consumerName ? reviews[currentReviewIndex].consumerName[0] : ''}
                            userName={reviews.consumerName}
                            days={calculateDays(reviews.reviewDate)}
                            star={reviews.stars}
                            content={reviews.review}
                        />
                    </div>
                    <div style={{ marginTop: "auto", textAlign: "center" }}>
                        <Link to="/review" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <button className="buttonT">Read All Reviews</button>
                        </Link>
                    </div>
                </>
            ) : (
                <p>No reviews available.</p>
            )}
        </div>
    );
    // return (
    //     <div style={{ width: "100%", backgroundColor: "white", marginBottom: "30px", borderRadius: "20px", filter: "drop-shadow(5px 5px 6px hwb(314 78% 1%))" }}>
    //         {reviews.length > 0 ? (
    //             <>
    //                 {reviews.slice(0, visibleReviews).map((review) => (
    //                     <div key={review.reviewId} style={{ backgroundColor: "white", marginBottom: "10px", borderRadius: "20px", filter: "drop-shadow(5px 5px 6px hwb(314 78% 1%))" }}>
    //                         <ReviewLink 
    //                             icon={review.consumerName ? review.consumerName[0] : ''}
    //                             userName={review.consumerName}
    //                             days={calculateDays(review.reviewDate)}
    //                             star={review.stars}
    //                             content={review.review}
    //                         />
    //                     </div>
    //                 ))}
    //                 <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
    //                     {visibleReviews < reviews.length && (
    //                         <button onClick={loadMoreReviews} className="buttonT">
    //                             Load More Reviews
    //                         </button>
    //                     )}
    //                     <button className="buttonT">
    //                         <Link to="/review" style={{ textDecoration: 'none', color: 'inherit' }}>Read All</Link>
    //                     </button>
    //                 </div>
    //             </>
    //         ) : (
    //             <p>No reviews available.</p>
    //         )}
    //     </div>
    // );
}

export default Reviews;