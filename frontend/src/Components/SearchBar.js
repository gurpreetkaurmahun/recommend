import React from "react";
import { useState,useEffect } from "react";
import MyForm from "./Form.js";
import GetLocation from "./Location";
import Spinner from "../Pages/Spinner";
import Navbar from "../Pages/Navbar";
import{ API_BASE_URL} from"../apiConfig.js";
import LocationMap from "./LocationMap.js";
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
async function handleLocation(event) {

    setLoading(true);

    await GetLocation((locationData) => {
        console.log("Location Data:::", locationData);
        setUserLocation({
            Latitude:locationData.latitude,
            Longitude:locationData.longitude,
            FullLocation:locationData.location

        });
        localStorage.setItem('userLatitude', locationData.latitude);
        localStorage.setItem('userLongitude', locationData.longitude);
        localStorage.setItem('userFullLocation', locationData.location);
        setLoading(false);
    });
}


async function handleSubmit(values) {
    console.log("Values are:", values);
    setLoading(true);

    // const fullProduct=values.BrandName+ " "+values.Product+ " " +values.Quantity;
    const fullProduct = `${values.BrandName} ${values.Product} ${values.Quantity}`.trim();

    console.log("Full Product is:", fullProduct);
    try {
        const productScrapping = await axios.post(`${API_BASE_URL}WebScrappers/scrape`, JSON.stringify(fullProduct), {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log("Scraping response:", productScrapping.data);
        
        if (productScrapping.data.products && productScrapping.data.products.length > 0) {

            const scrapedProducts = productScrapping.data.products;
            console.log("Scraped Products:", scrapedProducts);

         

            setStatus("Scraping Completed");
            navigate("/all", { state: { searchResults: scrapedProducts} });
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


console.log("local storage",localStorage);


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
      {/* {userLocation && (
        <div>
          <p>Latitude: {userLocation.Latitude}</p>
          <p>Longitude: {userLocation.Longitude}</p>
          <p>Location: {userLocation.FullLocation}</p>
          <LocationMap 
            latitude={userLocation.Latitude}
            longitude={userLocation.Longitude}
            location={userLocation.FullLocation}
          />
        </div>
      )}
         */}
            
        </div>
    )
}

export default SearchBar;

