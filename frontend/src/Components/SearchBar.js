import React from "react";
import { useState,useEffect } from "react";
import MyForm from "./Form.js";
import GetLocation from "./Location";
import Spinner from "../Pages/Spinner";
import Navbar from "./Navbar.js";
import{ API_BASE_URL} from"../apiConfig.js";
import {fetchNearbyStores } from"./Supermarket.js";
import {useNavigate} from 'react-router-dom';
import LocationModal from "./LocationModal.js";
import MiddleElement from "../Pages/MiddleElement.js";
import ImageSlider from "../Pages/ImageSlider.js";
import axios from "axios";
import Footer from "../Pages/Footer.js";
import SlideUpDiv from "./InfoModal.js";
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

   

// async function handleLocation(event) {
//     setLoading(true);

//     await GetLocation(async (locationData) => {
//       console.log("Location Data:", locationData);
//       setUserLocation({
//         Latitude: locationData.latitude,
//         Longitude: locationData.longitude,
//         FullLocation: locationData.location
//       });
//       localStorage.setItem('userLatitude', locationData.latitude);
//       localStorage.setItem('userLongitude', locationData.longitude);
//       localStorage.setItem('userFullLocation', locationData.location);

//       try{

//         console.log("Fetching stores");
//                 const fetchStores= await fetchNearbyStores(localStorage.getItem('userLatitude'), localStorage.getItem('userLongitude'));

//                 console.log("Stores:",fetchStores);

//       }catch(error){
//         console.log("Error Fetching stores:",error);
//       }

     
//   })};

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
          <Navbar />
          <div style={{position:"relative"}}>
            <MiddleElement/>
            <SlideUpDiv/>

            <ImageSlider/>

         <div style={{position:"absolute",border:"1px solid red",top:200,left:600,backgroundColor:"blue"}}>

<MyForm
   fields={showAdvancedSearch ? advancedFields : basicFields}
   initialValues={initialValues}
   onSubmit={handleSubmit}
   dropdownOptions={dropdownOptions}
   buttonText="Search"
 />
 <button style={{ width: 200 }} onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
   className={`btn ${showAdvancedSearch ? 'btn-secondary' : 'btn-primary'} m-2`}>
   {!showAdvancedSearch ? "Advanced Search" : "Close Advanced Search"}
 </button>
 {loading && <Spinner />}
 <button onClick={() => setModal(true)} className="btn btn-primary">Get Location</button>

 {modal && (
   <LocationModal onAllow={handleAllowLocation} onDeny={handleDenyLocation} />
 )}
</div>
          </div>
          
<Footer/>
 
        </div>
      );


//filter search brand name product name quantity

    // return(
    //     <div>
    //         <Navbar/>
    //         <button onClick={handleModal}>show modal</button>
    //         {modal&&<LocationModal onClose={handleModalClose} onAllow={handleAllowLocation} onDeny={handleDenyLocation}/>}
    //         <MyForm
    //         fields={showAdvancedSearch?advancedFields:basicFields}
    //         initialValues={initialValues}
    //         onSubmit={handleSubmit}
    //         dropdownOptions={dropdownOptions}
    //         buttonText="Search"
    //         >
           
    //         </MyForm>
    //         <button style={{width:200}} onClick={()=>{setShowAdvancedSearch(!showAdvancedSearch)}}
    //         className={`btn ${showAdvancedSearch ? 'btn-secondary' : 'btn-primary'} m-2`}>
    //             {!showAdvancedSearch?"Advanced Search":"Close Advanced Search"}
    //         </button>
    //         {loading&&<Spinner/>}

    //         <button onClick={() => GetLocation(handleLocation)} className="btn-primary">Get Location</button>
  
            
    //     </div>
    // )
}

export default SearchBar;

