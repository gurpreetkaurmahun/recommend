import React, { useState, useEffect } from "react";
import Product from "../Product/Product.js";
import Navbar from "../Navbar.js";
import {Link} from "react-router-dom";
import { getProductsById,deleteSavedProduct } from "../../Backend-services/SavedProductSpecific.js";
import ShoppingCart from "../../assets/shopping Cart.jpg";
import { useAuth } from "../AuthenticateContext.js";
import Products from "../../assets/products 1.jpg";
import{getCustomerById}from "../../Backend-services/CustomerSpecific.js";
import Search from "../../assets/Search.mp4";
import {useNavigate} from "react-router-dom";
import Footer from "../../Pages/Footer.js";
import { GrFavorite } from "react-icons/gr";
import { MdOutlineSettings } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { MdOutlineReviews } from "react-icons/md";
import Settings from "./Settings.js";
import WriteReview from "../Reviews/WriteReview.js";
import ReviewLink from "../Reviews/ReviewLink.js";
import{deleteReview,updateReviews,calculateDays} from"../../Backend-services/ReviewSpecific.js";


function UserProducts() {
    const [savedProducts, setSavedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const[reviews,setReviews]=useState([]);
    const[empty,setEmpty]=useState(false); 
    const [currentUserId, setCurrentUserId] = useState(null);
    const[userSettings,setUserSettings]=useState(false);
    const[noReview,setNoReview]=useState(false);
    const[showReviews,setShowReviews]=useState(false);
    const [showFavorites, setShowFavorites] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const[loggedIn,setLoggedIn]=useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const[reviewLink,setReviewLink]=useState(false);

    const[user,setUser]=useState("");

    const authContext=useAuth();
    const isAuthenticated = authContext.authenticated; 
    const identityId=authContext.identityId;
    const activeId=authContext.activeUserId;
    const activeToken=authContext.token;

    const navigate=useNavigate();

    useEffect(() => {
       
        if (isAuthenticated) {
            setCurrentUserId(activeId)
            getSaved(activeId, activeToken);
            getConsumer(parseInt(activeId),10);
            setLoggedIn(true);
        }
        else{
            setEmpty(true);
        }
        console.log("Reviews for logged in user is:",reviews);
        console.log("Local Storage from User Saved", localStorage);
       
    }, []);

    async function getSaved(userId, userToken) {
        try {
            if (!userToken) {
                throw new Error("User not authenticated");
            }
    
            setLoading(true);
            const response = await getProductsById(userId, userToken);
            
            console.log("Full response:", response);
    
            let products=[];
            if (response && response.data && response.data[userId]) {
                products=response.data[userId];
                // setSavedProducts(response.data[userId]);
            } else if (response && response.data) {
                products=Object.values(response.data).flat();
            } else {
                throw new Error("Unexpected response structure");
            }
            setSavedProducts(products);
            setEmpty(products.length===0)
        } catch (err) {
            console.error("Error fetching saved products:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function deleteTheProduct(product) {
        // const userId = localStorage.getItem('activeUserId');
        
        console.log("delete clicked for", product.tempId);
    
        try {
            const deleteProd = await deleteSavedProduct(currentUserId, product.tempId);
            console.log("Delete Status", deleteProd);

            setSavedProducts(prevProducts => {
                const updatedProducts = prevProducts.filter(p => p.product.tempId !== product.tempId);
                setEmpty(updatedProducts.length === 0);
                return updatedProducts;
            });
        } catch (error) {
            console.error("Error deleting product:", error);
           
        }
    }

    async function getConsumer(userId) {
        try {
          const response = await getCustomerById(userId);
          console.log("Full response from getCustomerById:", response);
      
          if (response && response.data && response.data.consumer) {
            setUser(response.data.consumer.fName);
            if (response.data.consumer.reviews.length === 0) {
                setNoReview(true);
              }
            setReviews(response.data.consumer.reviews);
          } else {
            console.error("Unexpected response structure:", response);
            
          }
        } catch (error) {
          console.error("Error fetching Consumer:", error);
          
        }
      }



    const handleUserUpdate = (newName) => {
        setUser(newName);
    };
    const handleFavoritesClick = () => {
        setShowFavorites(true);
        setShowSettings(false);
        setUserSettings(false);
      };
      
      const handleSettingsClick = () => {
        setShowFavorites(false);
        setShowSettings(true);
        setShowReviews(false);
        setUserSettings(false);
      };

      const handleReviewsClick = () => {
        setShowReviews(true);
        setShowSettings(false);
        setUserSettings(false);
        setShowFavorites(false);
      };
      async function handleLogout(){
        try {
            console.log("Local Storage before Logout", localStorage);
            const logout = await authContext.Logout();
            console.log("Logout response is", logout);
        
            if (logout) {
       
              if (window.inactivityTimer) {
                clearTimeout(window.inactivityTimer);
                window.inactivityTimer = null;
              }
              console.log("LocalStorage After Logout", localStorage);
              console.log("Logout result", logout);
          
              navigate("/");
            }
          } catch (error) {
            console.log("Error logging out the user", error);
          }
    }

    async function handleDelete(reviewId) {
        try {
           const response= await deleteReview(reviewId);
           getConsumer(currentUserId);
         
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    }
    function handleEdit(review) {
        setEditingReview(review);
        setReviewLink(true);
    }

    async function handleUpdateReview(reviewId, updatedReviewData) {
        try {
            await updateReviews(reviewId, updatedReviewData);
            setEditingReview(null);
            getConsumer(currentUserId);
            
        } catch (error) {
            console.error("Error updating review:", error);
        }
    }
 


    return (
        <div>
            <Navbar />

            <div style={{width:"70%",textAlign:"left",marginLeft:"10%"}}>
                <h2>Favourites</h2>
                {loading && <p>Loading...</p>}
                {error && <p style={{width:"70%",textAlign:"left",marginLeft:"20%"}}>Error: {error}</p>}
            </div>
            <hr></hr>

            <div style={{display:"flex"}}>
            <div className="userDiv" >
            <img className="userImg" src="https://thumbs.dreamstime.com/b/red-apple-isolated-clipping-path-19130134.jpg" alt="Description"  />
           <h2 style={{marginTop:"5%"}}>{user}</h2>
           <hr></hr>


           <div style={{marginTop:"10%", textAlign:"left", marginLeft:"20%"}}>
            <p className="userPara" onClick={handleFavoritesClick}>
                <GrFavorite />
                <span>Favourites</span>
            </p>
            <p className="userPara" onClick={handleSettingsClick}>
                <MdOutlineSettings />
                <span>Settings</span>
            </p>
            <p className="userPara" onClick={handleReviewsClick}>
                <MdOutlineReviews />
                <span>Reviews</span>
            </p>
            <p className="userPara" onClick={handleLogout}>
                <IoMdLogOut />
                <span>Logout</span>
            </p>
            </div>
            </div>


            <div id="savedProducts" style={{width:"70%",textAlign:"left"}}>
            {showFavorites && (
                <>
                {!loading && !error && (
                    <>
                    {savedProducts.length > 0 ? (
                        savedProducts.map((item, index) => (
                        <Product
                            key={index}
                            title={item.product.productName}
                            price={item.product.price}
                            supermarket={item.product.supermarketName}
                            pricePerUnit={item.product.pricePerUnit}
                            image={item.product.imageUrl}
                            link={item.product.url}
                            date={item.product.date}
                            onDelete={() => deleteTheProduct(item.product)}
                            isSaved={true}
                        />
                        ))
                ) 
          : 
          (
            <div>
            <div className="emptyInfo" 
            style={{
              display: "block",
              position: "absolute",  
              top: "30%",  
              left: "55%",  
              transform: "translateX(-50%)",  
              zIndex: "1",  // Add this
              backgroundColor: "rgba(255, 255, 255, 0.8)", 
              padding: "20px",  
              borderRadius: "10px",  
              textAlign: "center",
              marginTop:"3%",
     
              height:"auto"
            }
          
          }
            >
              <h3> View your saved productshere!</h3>  
            <p>Its simple! search for products, click the heart icon and it will be added here!</p>
            </div>
            
        
            <div className="emptydiv" style={{ display:"flex", alignItems: "center",marginLeft:"1%",marginBottom:"200px",width:"90%",marginTop:"20%"}}>
              
       
              
            <div  style={{width:"150%", height:"150%", marginRight:"50px", filter: "drop-shadow(5px 5px 6px hwb(314 78% 1%)"}}>
            <img src={ShoppingCart} style={{width:"100%", height:"100%", objectFit: "cover"}} alt="Shopping Cart" />
            </div>
            <div style={{
        
            position: "relative",
            width:"150%", height:"150%", 
            marginRight: "50px",
            filter: "drop-shadow(5px 5px 6px hwb(314 78% 1%)",
            
            }}>
            <video 
                src={Search} 
                autoPlay 
                loop 
                muted  
                style={{
                    width:"100%", height:"100%", 
                
                }}
            />
            </div>

            <div  style={{width:"150%", height:"150%",marginRight:"50px", filter: "drop-shadow(5px 5px 6px hwb(314 78% 1%)"}}>
            <img src={Products} style={{width:"100%", height:"100%", objectFit: "cover"}} alt="Products" />
            </div>
            {!loggedIn&&<button className="animatedButton" style={{position:'absolute',top:"90%",width:"400px",left:"40%"}}>Login or Register to view products</button>}
                {loggedIn&&    <button className="animatedButton" style={{position:'absolute',top:"90%",width:"400px",left:"40%"}}><Link to="/search" style={{textDecoration:"none"}}>Search Products</Link></button>}
            </div>
            
            </div>
          )
          
          }
          <div>
          <button className="buttonT "  onClick={()=>navigate("/view")}> Nearby Locations</button>
          </div>
        </>
      )}

      
    </>
  )}
 {showSettings && <Settings onUserUpdate={handleUserUpdate}/>}
 {showReviews && (
  <div>
    <h2> {user}'s Reviews</h2>
    {noReview&&(
        <div>
            <h6>
                Write reviews to help Recommend serve better.
            </h6>
            
        </div>
    )}
   
    {reviews.map(review => (
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
    ))}
     <div>
      <button className="buttonT">
        <Link style={{textDecoration:"none",color:"white"}} to="/review">Write reviews</Link>
      </button>
    </div>
  </div>
)}
{reviewLink && currentUserId && (
            <WriteReview 
                initialReview={editingReview}
                onSubmit={(reviewData) => {
                    if (editingReview) {
                        handleUpdateReview(editingReview.reviewId, reviewData);
                    } 
                    setReviewLink(false);
                    setEditingReview(null);
                    // fetchReviews();
                }}
                onClose={() => {
                    setReviewLink(false);
                    setEditingReview(null);
                }} 
            />
        )}

  
              
      </div>
      
</div>
            <Footer/>
        </div>
    );}

export default UserProducts;