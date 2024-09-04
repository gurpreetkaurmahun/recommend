import React from "react";
import {useState,useEffect} from "react";
import ReviewLink from "./ReviewLink";
import {getReviews} from"../../Backend-services/ReviewSpecific.js";
import { Link } from "react-router-dom";
function Reviews(){

    const [reviews,setReviews]=useState([]);
    const [visibleReviews, setVisibleReviews] = useState(6);


    useEffect(()=>{
        fetchReviews();

    },[]);


    async function fetchReviews() {
        try {
            const response = await getReviews();
         
            
            if (response && response.reviews && Array.isArray(response.reviews)) {
                setReviews(response.reviews);
                
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
         <div style={{ width: "100%", backgroundColor: "white", marginBottom: "30px", borderRadius: "20px", filter: "drop-shadow(5px 5px 6px hwb(314 78% 1%))" , backgroundColor: "lightblue", }}>
             {reviews.length > 0 ? (
                <>
                    {reviews.slice(0, visibleReviews).map((review) => (
                    <div key={review.reviewId} style={{ backgroundColor: "white", marginBottom: "10px", borderRadius: "20px", filter: "drop-shadow(5px 5px 6px hwb(314 78% 1%))" }}>
                         <ReviewLink 
                                 icon={review.consumerName ? review.consumerName[0] : ''}
                                 userName={review.consumerName}
                                 days={calculateDays(review.reviewDate)}
                                 star={review.stars}
                                 content={review.review}
                            />
                         </div>
                    ))}
                     <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                        {visibleReviews < reviews.length && (
                             <button onClick={loadMoreReviews} className="buttonT">
                                Load More Reviews
                             </button>
                         )}
                         <button className="buttonT">
                            <Link to="/review" style={{ textDecoration: 'none', color: 'inherit' }}>Read All</Link>
                        </button>
                     </div>
                 </>
            ) : (
                 <p>No reviews available.</p>
             )}
         </div>
     );
}

export default Reviews;