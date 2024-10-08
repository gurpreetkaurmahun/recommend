import React from "react";
import { useState,useEffect } from "react";
import MyForm from "./Form.js";
import GetLocation from "./Location/Location.js";
import Message from "./Message.js";
import Navbar from "./Navbar.js";
import{ API_BASE_URL} from"../apiConfig.js";
import {fetchNearbyStores } from"./Location/Supermarket.js";
import {useNavigate} from 'react-router-dom';
import LocationModal from "./Location/LocationModal.js";
import TypeWriters from "./TypeWriters.js";
import ImageSlider from "../Pages/ImageSlider.js";
import axios from "axios";
import Footer from "../Pages/Footer.js";
import Supermarket from "../assets/background.jpg";
import HomeReview from "./Reviews/HomeReview.js";


function SearchBar(){

    const[modal,setModal]=useState(false);
    const [error,setError]=useState(false);
    const[errorMessage,setErrorMessage]=useState("");

    const advancedFields=[
        { name: 'BrandName', type: 'text', label: 'BrandName' },
        { name: 'Product', type: 'text', label: 'Product' },
        { name: 'Quantity', type: 'text', label: 'Quantity' },
       
    ];

    const basicFields=[
        { name: 'Product', type: 'text', label: 'Product' }
    ]

    const initialValues={
        BrandName:"",
        Product:"",
        Quantity:"",
        dropdown:""
    }
  
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const[userLocation,setUserLocation]=useState({
        Latitude:0,
        Longitude:0,
        FullLocation:""
    });
   
    const [loading, setLoading] = useState(false);


    const[status,setStatus]=useState("");
    const [nearbyStores, setNearbyStores] = useState([]);
    const navigate=useNavigate();

 

    useEffect(()=>{
    const storedLatitude = localStorage.getItem('userLatitude');
    const storedLongitude = localStorage.getItem('userLongitude');
    if((!storedLatitude || !storedLongitude || storedLatitude === "null" || storedLongitude === "null"))
    {
        setModal(true);
    }
    },[]);

const handleAllowLocation = () => {
    setModal(false);
    setLoading(true);
    GetLocation(handleLocation);
  };

const handleDenyLocation = () => {
    setModal(false);
  };

   const handleLocation = async (locationData) => {
    console.log("Location Data:", locationData);

    setUserLocation({
      Latitude: locationData.latitude,
      Longitude: locationData.longitude,
      FullLocation: locationData.location
    });

    localStorage.setItem('userLatitude', locationData.latitude);
    localStorage.setItem('userLongitude', locationData.longitude);
    localStorage.setItem('userFullLocation', locationData.location);

    try {
      console.log("Fetching stores");
      const fetchStores = await fetchNearbyStores(localStorage.getItem('userLatitude'), localStorage.getItem('userLongitude'));
      setNearbyStores(fetchStores);
      console.log("Stores:", fetchStores);
    } catch (error) {
      console.log("Error Fetching stores:", error);
    }
  };

async function handleSubmit(values) {

    const fullProduct = `${values.BrandName}${values.Product}${values.Quantity}`.trim();

    if(fullProduct===""){
        setError(true);
        setErrorMessage("Please enter a product to search")
        return;
    }

    const requestPayload = {
        brand: values.BrandName,
        product: values.Product
    };

    try 
    {
        setLoading(true);
        const [productScrapping, fetchStores] = await Promise.all([
            axios.post(`${API_BASE_URL}WebScrappers/scrape`, requestPayload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            fetchNearbyStores(localStorage.getItem('userLatitude'), localStorage.getItem('userLongitude'))
        ]);

        if (productScrapping.data.products && productScrapping.data.products.length > 0) {

            const scrapedProducts = productScrapping.data.products;
            console.log("Scraped Products:", scrapedProducts);

            localStorage.setItem('scrapedProducts', JSON.stringify(scrapedProducts));
            localStorage.setItem('nearbyStores', JSON.stringify(fetchStores));
            localStorage.setItem('searchProduct', fullProduct);
        try
        {
            console.log("Fetching stores for User");
            setNearbyStores(fetchStores);
            setStatus("Scraping Completed");
            navigate("/all", { state: { searchResults: scrapedProducts,nearbyStores:fetchStores,searchProduct:fullProduct} });

        }
        catch(error){
        console.log("Error Fetching stores:",error);
        setError(true);
        setErrorMessage(error);
        }

        } 
        else {
            setStatus("No products found");
        }
    } 
    catch (error) 
    {
    console.error("Scraping error:", error);
    setStatus(error.response?.data?.message || "An error occurred while scraping");
    } 
    finally 
    {
        setLoading(false);
    }
}



return(
        <div >
        {modal && (<LocationModal onAllow={handleAllowLocation} onDeny={handleDenyLocation} onClose={()=>setModal(false)} />)}
          <Navbar />

          {error&& <Message value={errorMessage} onClose={()=>setError(false)}/>}

            <div style={{position:"relative"}}>
           
            <div className="searchContainer" >
                <img src={ Supermarket} style={{height:700,width:"100%"}}></img>
           </div>
        
            <ImageSlider/>

            <div className="searchForm" >

            <MyForm
                fields={showAdvancedSearch ? advancedFields : basicFields}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                buttonText="Search"
                layout="inline"
                >
                <button
                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                    className="buttonT"
                    type="button"
                    style={{ width: 200, background: "linear-gradient(45deg, #f321bf, #ebe1e4)", borderRadius: "20px",
                    }}
                >
                    {!showAdvancedSearch ? "Advanced Search" : "Close Advanced Search"}
                </button>
            </MyForm>
            </div>

          </div>
         
          <div className="reviewContent"  >
            <div style={{backgroundColor:"#e9a8d9", width:"50%"}}>
                <TypeWriters
                    topString="Reviews...."
                    link="/review"
                    bottomString="See what people have to say about us.."
                    buttonText="View All"
                />
            </div>

            <div className="reviewdiv" >
                <div style={{width:"100%", height: "100%", overflow: "auto",marginLeft:"50px"}}>
                <HomeReview/>
                </div>
            </div>
        </div>
          
        <Footer/>
 
        </div>
      );



}

export default SearchBar;

