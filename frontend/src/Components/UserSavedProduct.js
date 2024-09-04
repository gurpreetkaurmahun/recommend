import React, { useState, useEffect } from "react";
import Product from "./Product/Product";
import Navbar from "./Navbar";
import {Link} from "react-router-dom";
import { getProductsById } from "../Backend-services/SavedProductSpecific.js";
import ShoppingCart from "../assets/shopping Cart.jpg";
import { useAuth } from "./AuthenticateContext.js";
import Products from "../assets/products 1.jpg";
import {deleteSavedProduct} from "../Backend-services/SavedProductSpecific.js";
import Search from "../assets/Search.mp4";
import{getCustomerById} from "../Backend-services/CustomerSpecific.js";
import {useNavigate} from "react-router-dom";
import Footer from "../Pages/Footer.js";
import { GrFavorite } from "react-icons/gr";
import { MdOutlineSettings } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import Settings from "./Settings.js";

function UserProducts() {
    const [savedProducts, setSavedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const[empty,setEmpty]=useState(false);
    const[userSettings,setUserSettings]=useState(false);
   
    const [showFavorites, setShowFavorites] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const[loggedIn,setLoggedIn]=useState(false);
    const[user,setUser]=useState("");
    const authContext=useAuth();

    const navigate=useNavigate();

    useEffect(() => {
        const userToken = localStorage.getItem("userToken");
        const userId = localStorage.getItem('activeUserId');
   
        console.log("Token in use effect:", userToken);
        console.log("User ID in use effect:", userId);
    
        if (userToken && userId) {
            getSaved(userId, userToken);
            getConsumer(userId);
            setLoggedIn(true);
        }
        else{
            setEmpty(true);
        }
    
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
        const userId = localStorage.getItem('activeUserId');
        
        console.log("delete clicked for", product.tempId);
    
        try {
            const deleteProd = await deleteSavedProduct(userId, product.tempId);
            console.log("Delete Status", deleteProd);

            setSavedProducts(prevProducts => {
                const updatedProducts = prevProducts.filter(p => p.product.tempId !== product.tempId);
                setEmpty(updatedProducts.length === 0);
                return updatedProducts;
            });
        } catch (error) {
            console.error("Error deleting product:", error);
            // Optionally set an error state here
        }
    }

    async function getConsumer(userId) {
        try {
            const response = await getCustomerById(userId);
            console.log("logged in user is :", response.consumer);
            setUser(response.consumer.fName);
        } catch (error) {
            console.log("Error fetching Consumers:", error);
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
      };

      async function handleLogout(){
        try {
            const logout = authContext.Logout();
            console.log("Logout response is", logout);
        
            if (logout) {
              console.log("Local Storage before Logout", localStorage);
              localStorage.removeItem("userToken");
              localStorage.removeItem("activeUserId");
              localStorage.removeItem("userName");
        
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
            <div style={{width:"20%",height:"auto",borderRight:"2px solid black",marginRight:"30px"}}>
            <img src="https://thumbs.dreamstime.com/b/red-apple-isolated-clipping-path-19130134.jpg" alt="Description" style={{width:"150px", height:"150px", borderRadius:"50%",border:"1px solid blue",marginTop:"5%"}} />
           <h2 style={{marginTop:"5%"}}>{user}</h2>
           <hr></hr>


            <div style={{marginTop:"10%",textAlign:"left",marginLeft:"20%"}}>

            <p style={{marginTop:"10%",marginBottom:"-10px",}} onClick={handleFavoritesClick}> <span style={{fontSize:"30px",marginRight:"10px"}}><GrFavorite /></span>Favourites</p>
            <p onClick={handleSettingsClick} style={{marginBottom:"-10px",}}> <span style={{fontSize:"30px",marginRight:"10px",marginTop:0}}> <MdOutlineSettings /></span> Settings</p>
            <p onClick={handleLogout}> <span  style={{fontSize:"30px",marginRight:"10px",marginTop:0}}> <IoMdLogOut /></span>Logout</p>
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
              position: "absolute",  // Add this
              top: "30%",  // Add this
              left: "55%",  // Add this
              transform: "translateX(-50%)",  // Add this
              zIndex: "1",  // Add this
              backgroundColor: "rgba(255, 255, 255, 0.8)",  // Add this for better readability
              padding: "20px",  // Add this for spacing
              borderRadius: "10px",  // Add this for rounded corners
              textAlign: "center",
              marginTop:"3%",
     
              height:"auto"
            }}
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
        </>
      )}

      
    </>
  )}
 {showSettings && <Settings onUserUpdate={handleUserUpdate}/>}
  
              
      </div>
      
</div>
            <Footer/>
        </div>
    );}

export default UserProducts;