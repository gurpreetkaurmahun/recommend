import React from "react";
import { useState,useEffect } from "react";
import MyForm from "./Form.js";
import GetLocation from "./Location";
import Spinner from "../Pages/Spinner";
import Navbar from "../Pages/Navbar";
import{ API_BASE_URL} from"../apiConfig.js";
import {fetchNearbyStores } from"./Supermarket.js";
import {useNavigate} from 'react-router-dom';

import axios from "axios";
//shut down browrser and implement advanced search

function SearchBar(){

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
        Quantity:""
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
    const storedFullLocation = localStorage.getItem('userFullLocation');

    console.log("Local Latitude",storedLatitude);
    console.log("LocalLongitude:",storedLongitude);
    console.log("Local Full Location:",storedFullLocation);

    
},[]);


   

//Notes{Pass prodcut to backend and check if scrapper works}{render prodcut component}Done
// async function handleLocation(event) {

//     setLoading(true);

//     await GetLocation((locationData) => {
//         console.log("Location Data:::", locationData);
//         setUserLocation({
//             Latitude:locationData.latitude,
//             Longitude:locationData.longitude,
//             FullLocation:locationData.location

//         });
//         localStorage.setItem('userLatitude', locationData.latitude);
//         localStorage.setItem('userLongitude', locationData.longitude);
//         localStorage.setItem('userFullLocation', locationData.location);
//         setLoading(false);

//         try {
//             const stores =  fetchNearbyStores(locationData.latitude, locationData.longitude);
//             setNearbyStores(stores);
//             if (stores.length === 0) {
//               console.warn("No nearby stores found");
//               // You might want to show a message to the user here
//             }
//           } catch (error) {
//             console.error("Error fetching nearby stores:", error);
//             // Handle the error, maybe set an error state
//           } finally {
//             setLoading(false);
//           }
    

//     });
// }
async function handleLocation(event) {
    setLoading(true);

    await GetLocation(async (locationData) => {
      console.log("Location Data:", locationData);
      setUserLocation({
        Latitude: locationData.latitude,
        Longitude: locationData.longitude,
        FullLocation: locationData.location
      });
      localStorage.setItem('userLatitude', locationData.latitude);
      localStorage.setItem('userLongitude', locationData.longitude);
      localStorage.setItem('userFullLocation', locationData.location);

      try{

        console.log("Fetching stores");
                const fetchStores= await fetchNearbyStores(localStorage.getItem('userLatitude'), localStorage.getItem('userLongitude'));

                console.log("Stores:",fetchStores);

      }catch(error){
        console.log("Error Fetching stores:",error);
      }

     
  })};



async function handleSubmit(values) {
    console.log("Values are:", values);
  

    // const fullProduct=values.BrandName+ " "+values.Product+ " " +values.Quantity;
    const fullProduct = `${values.BrandName} ${values.Product} ${values.Quantity}`.trim();

    console.log("Full Product is:", fullProduct);
    try {
        // const productScrapping = await axios.post(`${API_BASE_URL}WebScrappers/scrape`, JSON.stringify(fullProduct), {
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // })
      
        // setNearbyStores(fetchStores);

        // console.log("Stores",fetchStores);
        setLoading(true);
        const [productScrapping, fetchStores] = await Promise.all([
            axios.post(`${API_BASE_URL}WebScrappers/scrape`, JSON.stringify(fullProduct), {
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
                console.log("Narby Stores",nearbyStores);

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





//filter search brand name product name quantity

    return(
        <div>
            <Navbar/>
            <MyForm
            fields={showAdvancedSearch?advancedFields:basicFields}
            initialValues={initialValues}
            onSubmit={handleSubmit}></MyForm>
            <button onClick={()=>{setShowAdvancedSearch(!showAdvancedSearch)}}
            className={`btn ${showAdvancedSearch ? 'btn-secondary' : 'btn-primary'} m-2`}>
                {!showAdvancedSearch?"Advanced Search":"Search"}
            </button>
            {loading&&<Spinner/>}

            <button onClick={() => GetLocation(handleLocation)} className="btn-primary">Get Location</button>
  
            
        </div>
    )
}

export default SearchBar;

