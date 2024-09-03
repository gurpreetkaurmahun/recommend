
import Navbar from "../Navbar.js";
import{useState,useEffect} from "react";
import ReviewLink from "./ReviewLink.js";
import{getReviews,getReviewsById,addReview,updateReviews,deleteReview} from "../../Backend-services/ReviewSpecific.js";
import Footer from "../../Pages/Footer.js";

import WriteReview from "./WriteReview.js";

import SlideUpDiv from "../InfoModal.js";

function ReviewsPage(){

    const [reviews,setReviews]=useState([]);

    const [currentUserId, setCurrentUserId] = useState(null);
    const[reviewLink,setReviewLink]=useState(false);
    const[logError,setLogError]=useState(false);
    const [slideUpDiv,setSlideUpDiv] = useState(false);


    useEffect(()=>{
        fetchReviews();
    },[])
   
    useEffect(() => {
        const user = localStorage.getItem("activeUserId");
        if (user) {
            setCurrentUserId(user);
            setLogError(false); // Ensure logError is set to false when user is signed in
        } else {
            setLogError(true);
        }
    }, []);
    
    

    useEffect(() => {
        console.log("Current user ID:", currentUserId);
        console.log("Reviews:", reviews);
        reviews.forEach(review => {
            console.log(`Review ID: ${review.reviewId}, Consumer ID: ${review.consumerId}, Is Owner: ${Number(review.consumerId) === Number(currentUserId)}`);
        });
    }, [reviews, currentUserId]);

    useEffect(() => {
        console.log("Updated reviews:", reviews);
        
    }, [reviews]);

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


    async function handleDelete(reviewId) {
        try {
           const response= await deleteReview(reviewId);
           console.log("Delete review response",response)
            fetchReviews(); // Refresh the reviews after deleting
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    }
    const handleWriteReviewClick = () => {
        if (currentUserId) {
            setReviewLink(true);
        } else {
            setLogError(true);
        }
    };

   function handleEdit(reviewId){
    console.log("handle review clisked for id:",reviewId);
   }
    
    return (
        <div>
            <Navbar />
            {!slideUpDiv && (
                <button
                    onClick={() => setSlideUpDiv(true)}
                    style={{
                        width: "18%",
                        zIndex: 1,
                        position: "fixed",
                        backgroundColor: "#f65dd0",
                        left: "80%",
                        top: "95%",
                        borderRadius: "10px"
                    }}
                >
                    Products
                </button>
            )}
            {slideUpDiv && <SlideUpDiv onClose={() => setSlideUpDiv(false)} />}
            <div style={{ width: "80%", marginBottom: "5%", display: "flex", border: "1px solid green", marginLeft: "20%" }}>
                <h1>Reviews</h1>
                <button onClick={handleWriteReviewClick} className="buttonT" style={{ position: "relative", marginLeft: "65%" }}>Write Review</button>
            </div>
            

            {reviewLink && currentUserId && (
                <WriteReview 
             
                    onClose={() => {
                        setReviewLink(false);
                        fetchReviews(); // Refresh the reviews list after closing the form
                    }} 
                />
            )}


            {logError && !currentUserId && <SlideUpDiv onClose={() => setLogError(false)} />}


            <div style={{ width: "70%", backgroundColor: "white", marginBottom: "30px", borderRadius: "20px", filter: "drop-shadow(5px 5px 6px hwb(314 78% 1%))", marginLeft: "20%" }}>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.reviewId} style={{ backgroundColor: "white", marginBottom: "10px", borderRadius: "20px", filter: "drop-shadow(5px 5px 6px hwb(314 78% 1%))" }}>
                            <ReviewLink 
                                icon={review.consumerName ? review.consumerName[0] : ''}
                                userName={review.consumerName}
                                days={calculateDays(review.reviewDate)}
                                star={review.stars}
                                content={review.review}
                                isOwner={Number(review.consumerId) === Number(currentUserId)}
                                onDelete={() => handleDelete(review.reviewId)}
                                onEdit={()=>handleEdit(review.reviewId)}
                            />
                        </div>
                    ))
                ) : (
                    <p>No reviews available.</p>
                )}
            </div>
            <Footer />
        </div>
    );
}
export default ReviewsPage;