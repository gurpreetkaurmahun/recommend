import React from "react";
import { useState,useEffect } from "react";
import MyForm from "./Form.js";
import GetLocation from "./Location/Location.js";

import Navbar from "./Navbar.js";
import{ API_BASE_URL} from"../apiConfig.js";
import {fetchNearbyStores } from"./Location/Supermarket.js";
import {useNavigate} from 'react-router-dom';
import LocationModal from "./Location/LocationModal.js";

import ImageSlider from "../Pages/ImageSlider.js";
import axios from "axios";
import Footer from "../Pages/Footer.js";
import Supermarket from "../assets/background.jpg";
//shut down browrser and implement advanced search

function SearchBar(){

    const[modal,setModal]=useState(false);

  

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
    const dropdownOptions = [
        { value: "Groceries", label: "Groceries" },
        { value: "Cosmetics", label: "Cosmetics" },
        {value:"Stationary",label:"Stationary"},
        { value: "Drinks", label: "Drinks" }
    ];



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

    console.log("local Storage is",localStorage);


    const storedLatitude = localStorage.getItem('userLatitude');
    const storedLongitude = localStorage.getItem('userLongitude');
    const storedFullLocation = localStorage.getItem('userFullLocation');

    

    if((!storedLatitude || !storedLongitude || storedLatitude === "null" || storedLongitude === "null")){
        setModal(true);
    }
    else{
        console.log("presenting userlocation");
        console.log("Local Latitude",storedLatitude);
        console.log("LocalLongitude:",storedLongitude);
        console.log("Local Full Location:",storedFullLocation);

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
   

    console.log("Location storage",localStorage);
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
    console.log("Values are:", values);
  

    // const fullProduct=values.BrandName+ " "+values.Product+ " " +values.Quantity;
    const fullProduct = `${values.BrandName}${values.Product}${values.Quantity}`.trim();
    if(fullProduct===""){
        alert("eneter product to scrape");
        return;
    }

    const requestPayload = {
        brand: values.BrandName,
        product: values.Product
    };

    console.log("Full Product is:", fullProduct);
    try {
      
        setLoading(true);

       
        const [productScrapping, fetchStores] = await Promise.all([
            axios.post(`${API_BASE_URL}WebScrappers/scrape`, requestPayload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            fetchNearbyStores(localStorage.getItem('userLatitude'), localStorage.getItem('userLongitude'))
        ]);

        console.log("Scraping response:", productScrapping.data);
        console.log("Stores:", fetchStores);


        console.log("Scraping response:", productScrapping.data);
        
        if (productScrapping.data.products && productScrapping.data.products.length > 0) {

            const scrapedProducts = productScrapping.data.products;
            console.log("Scraped Products:", scrapedProducts);

            localStorage.setItem('scrapedProducts', JSON.stringify(scrapedProducts));
      localStorage.setItem('nearbyStores', JSON.stringify(fetchStores));
      localStorage.setItem('searchProduct', fullProduct);

      console.log("new local storage",localStorage);

           
      try{

        console.log("Fetching stores");
                // const fetchStores= await fetchNearbyStores(localStorage.getItem('userLatitude'), localStorage.getItem('userLongitude'));
                setNearbyStores(fetchStores);
                console.log("Stores:",fetchStores);
                console.log("Nearby Stores",nearbyStores);

            setStatus("Scraping Completed");
            navigate("/all", { state: { searchResults: scrapedProducts,nearbyStores:fetchStores,searchProduct:fullProduct} });

      }catch(error){
        console.log("Error Fetching stores:",error);
      }

        } else {
            setStatus("No products found");
        }
    } catch (error) {
       
        console.error("Scraping error:", error);
        setStatus(error.response?.data?.message || "An error occurred while scraping");
    } finally {
        setLoading(false);
    }
}



return(
        <div >
                        {modal && (
   <LocationModal onAllow={handleAllowLocation} onDeny={handleDenyLocation} />
 )}
          <Navbar />
          <div style={{position:"relative"}}>
            {/* <MiddleElement/> */}
           <div className="conatiner" style={{height:700,width:"100%",marginBottom:100}}>

            <img src={ Supermarket} style={{height:700,width:"100%"}}></img>
           </div>

            <ImageSlider/>


         <div style={{position:"absolute",top:"20%",height:"15%",left:"30%",background:"white",borderRadius:"10px",filter: "drop-shadow(5px 5px 6px hwb(314 78% 1%)"}}>

         <MyForm
                        fields={showAdvancedSearch ? advancedFields : basicFields}
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        dropdownOptions={dropdownOptions}
                        buttonText="Search"
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
          
            <Footer/>
 
        </div>
      );



}

export default SearchBar;

