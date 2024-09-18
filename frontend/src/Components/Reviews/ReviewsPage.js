
import Navbar from "../Navbar.js";
import{useState,useEffect} from "react";
import ReviewLink from "./ReviewLink.js";
import{getReviews,addReview,updateReviews,deleteReview,calculateDays} from "../../Backend-services/ReviewSpecific.js";
import Footer from "../../Pages/Footer.js";
import WriteReview from "./WriteReview.js";
import{useAuth}from "../AuthenticateContext.js";
import SlideUpDiv from "../InfoModal.js";

function ReviewsPage(){

    const [reviews,setReviews]=useState([]);

    const [currentUserId, setCurrentUserId] = useState(null);
    const[reviewLink,setReviewLink]=useState(false);
    const[logError,setLogError]=useState(false);
    const [slideUpDiv,setSlideUpDiv] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [redirectedFromReview, setRedirectedFromReview] = useState(false);
    const authContext = useAuth();
    const isAuthenticated = authContext.authenticated;
    const identityId = authContext.identityId;
    const activeId = authContext.activeUserId;

    useEffect(()=>{
        fetchReviews();
        
    },[])
   
    useEffect(() => {
       
        const redirectToReview = localStorage.getItem('redirectToReview');
        if (isAuthenticated ) {
            setCurrentUserId(activeId);
            setLogError(false);
            if (redirectToReview === 'true') {
                setRedirectedFromReview(true);
                localStorage.removeItem('redirectToReview');
            }
        } else {
            setLogError(true);
        }
    }, []);
    
    useEffect(() => {
        if (currentUserId && redirectedFromReview) {
            setReviewLink(true);
            setRedirectedFromReview(false);
        }
    }, [currentUserId, redirectedFromReview]);



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
   


    async function handleDelete(reviewId) {
        try {
           const response= await deleteReview(reviewId);
           
            fetchReviews(); // Refresh the reviews after deleting
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    }
    const handleWriteReviewClick = () => {
        if (currentUserId) {
            setReviewLink(true);
        } else {
            localStorage.setItem('redirectToReview', 'true');
            setLogError(true);
            setSlideUpDiv(true);
            // Redirect to login page
           
        }
    };
    function handleEdit(review) {
        setEditingReview(review);
        setReviewLink(true);
    }
    async function handleUpdateReview(reviewId, updatedReviewData) {
        try {
            await updateReviews(reviewId, updatedReviewData);
            setEditingReview(null);
            fetchReviews();
        } catch (error) {
            console.error("Error updating review:", error);
        }
    }
    return (
        <div>
            <Navbar />
            {!slideUpDiv && (
                <button
                    className="productDiv"
                    onClick={() => setSlideUpDiv(true)}
                  
                >
                    Products
                </button>
            )}
            {slideUpDiv && <SlideUpDiv onClose={() => setSlideUpDiv(false)}  content={currentUserId ? "View Saved Products" : "Write Reviews"} />}
            <div className="reviewPage" >
                <h1>Reviews</h1>
                <button onClick={handleWriteReviewClick} className="buttonT reviewButton" >Write Review</button>
            </div>
            
            {reviewLink && currentUserId && (
                <WriteReview 
                initialReview={editingReview}
                onSubmit={async (reviewData, action) => {
                    try {
                        if (action === 'update') {
                            await handleUpdateReview(reviewData.reviewId, reviewData);
                        } else {
                            await addReview(reviewData);
                        }
                        await fetchReviews();
                        setReviewLink(false);
                        setEditingReview(null);
                    } catch (error) {
                        console.error("Error submitting review:", error);
                    }
                }}
                onClose={() => {
                    setReviewLink(false);
                    setEditingReview(null);
                }} 
                />
                )
            }

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
                                onEdit={() => handleEdit(review)}
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