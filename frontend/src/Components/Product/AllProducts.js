import React from "react";

import Product from "./Product.js";
import { useLocation } from 'react-router-dom';
import Navbar from "../Navbar.js";
import { useState,useEffect } from "react";
import{addSavedProduct,deleteSavedProduct} from "../../Backend-services/SavedProductSpecific.js";
import { useAuth } from "../AuthenticateContext.js";
import ProductLink from "./ProductLink.js";

import Footer from "../../Pages/Footer.js";
import SlideUpDiv from "../InfoModal.js";
import {useNavigate} from 'react-router-dom';

//delete prodcuts(done) , saved products tile, reference reserved, controllers set(alomost), saved product service(done) start working on location, add supermarket logo 

//modal for saved Product 


function AllProducts(){

    const[products,setProducts]=useState([]);
    const [searchProduct,setSearchProduct]=useState("");
    const [nearbyStores, setNearbyStores] = useState([]);
    const[availableStores,setAvailableStores]=useState([]);
    const [activeTab, setActiveTab] = useState('moreProducts');
    const [showAllProducts, setShowAllProducts] = useState(false);
  
    const[visible,setVisible]=useState(false);
    const navigate=useNavigate();


    const authContext=useAuth();

    const location = useLocation();


    useEffect(() => {
      let productData;
      if (location.state && location.state.searchResults) {
        productData = location.state.searchResults;
      } else {
        const storedProducts = localStorage.getItem('scrapedProducts');
        productData = storedProducts ? JSON.parse(storedProducts) : null;
      }
    
      console.log("Product Data", productData);
    
      if (productData && productData.length > 0) {
        setProducts(productData);
        setSearchProduct(location.state?.searchProduct || localStorage.getItem('searchProduct'));
        setNearbyStores(location.state?.nearbyStores || JSON.parse(localStorage.getItem('nearbyStores') || '[]'));
      } else {
        const lastAction = localStorage.getItem('lastAction');
        const productToSave = localStorage.getItem('productToSave');
        
        if (lastAction === 'saveProduct' && productToSave) {
          const savedProduct = JSON.parse(productToSave);
          setProducts([savedProduct]);
          setSearchProduct(savedProduct.productName);
          handleProductSave(savedProduct);
        } else {
          navigate('/search');
        }
      }
    
      // Don't clear localStorage here
    }, [location, navigate, authContext.activeUserId]);


      useEffect(()=>{
        const uniqueStores=[...new Set(products.map(product=>product.supermarket))];
        setAvailableStores(uniqueStores);
        console.log("Unique Stores",availableStores);

      },[products]);

      
    




    const storesWithProduct = nearbyStores.filter(store =>
        console.log("Supermarket name",store.supermarketName) );

        
    console.log("Stores",storesWithProduct);
    


    async function handleProductSave(product) {

      const userId=localStorage.getItem("activeUserId");
      if (authContext.activeUserId === "") {
        localStorage.setItem('scrapedProducts', JSON.stringify(products));
        localStorage.setItem('searchProduct', searchProduct);
        localStorage.setItem('nearbyStores', JSON.stringify(nearbyStores));
        localStorage.setItem('lastAction', 'saveProduct');
        localStorage.setItem('productToSave', JSON.stringify(product));
        setVisible(true);
      } else {
        try {
          const save = await addSavedProduct({
            TempId: product.tempId,
            ConsumerId: parseInt(userId, 10),
            DateSaved: new Date().toISOString()
          });
          console.log("product saved is:", save);
        

          setProducts(prevProducts => 
            prevProducts.map(p => 
              p.tempId === product.tempId ? {...p, isSaved: true} : p
            )
          );
          
          clearLocalStorage();
        
        } catch (error) {
          console.log("Error is", error);
        }
      }
    }
  

    function clearLocalStorage() {
      localStorage.removeItem('scrapedProducts');
      localStorage.removeItem('searchProduct');
      localStorage.removeItem('lastAction');
      localStorage.removeItem('productToSave');
    }


 


    


    const groupedProducts = products.reduce((acc, product) => {
        if (!acc[product.supermarketName]) {
            acc[product.supermarketName] = [];
        }
        acc[product.supermarketName].push(product);
        return acc;
    }, {});


    // Separate first products and remaining products
    const firstProducts = [];
    const remainingProducts = [];

    Object.keys(groupedProducts).forEach(supermarket => {
        const supermarketProducts = groupedProducts[supermarket];
        if (supermarketProducts.length > 0) {
            firstProducts.push(supermarketProducts[0]);
            remainingProducts.push(...supermarketProducts.slice(1));
        }
    });


    //div closure for the slide up div

    function handleDivCLose(){
      setVisible(false);
    }

    const displayedProducts = showAllProducts ? remainingProducts : remainingProducts.slice(0, 6);
      return (
        <div >
          <Navbar />
          {visible&&<SlideUpDiv  onClose={handleDivCLose}/>}
          <h2 style={{ textAlign: "left",marginLeft:"8%",marginBottom:"2%" }}>Showing results for "{searchProduct}"</h2>
          <div style={{ width: "100%" }}>
                {/* Display one product from each supermarket */}

                <div style={{ marginLeft: 150,display:"flex",justifyContent:"left",width:"80%",height:"500px", backgroundColor: '#f0f0f0'}}>

                {firstProducts.map(product => (
                    <Product
                        key={product.productId}
                        title={product.productName}
                        price={product.price}
                        supermarket={product.supermarketName}
                        pricePerUnit={product.pricePerUnit}
                        image={product.imageUrl}
                        link={product.url}
                        category={product.category.categoryName}
                        imageLogo={product.imageLogo}
                        onSave={() => handleProductSave(product)}
                        isSaved={product.isSaved}
                    />
                ))}

<button className="buttonT" style={{width:"230px",position:"absolute",top:"80%",left:"70%"}} onClick={()=>navigate("/view")}> Nearby Locations</button>
                </div>
               
     <div style={{
        marginLeft: 150,
        width: "70%",
        marginTop: 100,
      
      }}>
        {/* Tab headers */}
        <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
          <button 
            onClick={() => setActiveTab('moreProducts')}
            style={{
            width:"300px",
              padding: '10px 20px',
              backgroundColor: activeTab === 'moreProducts' ? '#f0f0f0' : 'white',
              border: 'none',
              borderBottom: activeTab === 'moreProducts' ? '2px solid #000' : 'none',
            }}
          >
            More Products
          </button>

          <button 
            onClick={() => setActiveTab('reviews')}
            style={{
                width:"300px",
              padding: '10px 20px',
              backgroundColor: activeTab === 'reviews' ? '#f0f0f0' : 'white',
              border: 'none',
              borderBottom: activeTab === 'reviews' ? '2px solid #000' : 'none',
            }}
          >
            Reviews
          </button>
        </div>

        {/* Tab content */}
        <div style={{ backgroundColor: '#f0f0f0', padding: "20px" }}>
          {activeTab === 'moreProducts' && (
            <>
              {displayedProducts.map(product => (
                <div key={product.productId} style={{ backgroundColor: "white", marginBottom: "10px",borderRadius:"20px",filter: "drop-shadow(5px 5px 6px hwb(314 78% 1%)" }}>
                  <ProductLink
                    title={product.productName}
                    price={product.price}
                    supermarket={product.supermarketName}
                    pricePerUnit={product.pricePerUnit}
                    image={product.imageUrl}
                    link={product.url}
                    category={product.category.categoryName}
                    imageLogo={product.imageLogo}
                    isSaved={product.isSaved}
                  />
                </div>
              ))}

              {!showAllProducts && remainingProducts.length > 6 && (
                <button 
                  className="buttonT" 
                  onClick={() => setShowAllProducts(true)}
                  style={{ display: 'block', margin: '20px auto' }}
                >
                  Show All ({remainingProducts.length})
                </button>
              )}
            </>
          )}

          {activeTab === 'reviews' && (
            <div>
              <input placeholder="type reviews"></input>
              <p>Reviews will be displayed here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
 
         
    
          <Footer />
        </div>
      );

}

export default AllProducts;

