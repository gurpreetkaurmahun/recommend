import React from "react";
import { useState,useEffect } from "react";
import MyForm from "./Form.js";
import GetLocation from "./Location";
import Spinner from "../Pages/Spinner";
import Navbar from "../Pages/Navbar";
import{ API_BASE_URL} from"../apiConfig.js";

import {useNavigate} from 'react-router-dom';

import axios from "axios";

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
    const[product,setProduct]=useState("");

    const[status,setStatus]=useState("");
    const navigate=useNavigate();


   

//Notes{Pass prodcut to backend and check if scrapper works}{render prodcut component}Done
async function handleLocation(event) {
    event.preventDefault();
    setLoading(true);

    await GetLocation((locationData) => {
        console.log("Location Data:::", locationData);
        setUserLocation({
            Latitude:locationData.latitude,
            Longitude:locationData.longitude,
            FullLocation:locationData.location

        });
        setLoading(false);
    });
}

async function handleSubmit(event){
    event.preventDefault();
    setLoading(true);
    try{

        const productScrapping=await axios.post(`${API_BASE_URL}WebScrapper/scrape`, JSON.stringify(product), {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log("Scrapping response3",productScrapping.data);
        console.log("Scrapping response3",productScrapping.data.productCount);

        setStatus("Scrapping COmpleted");

        navigate("/all");

    }catch(error){
        setStatus(error);
    }
    finally{
        setStatus(false);
    }
}

async function handleSubmit(values){
    console.log("Values are:",values);
    try{

        const productScrapping= await axios.post(`${API_BASE_URL}WebScrappers/scrape`, JSON.stringify(values.Product), {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log("Scrapping response3",productScrapping.data);
        console.log("Scrapping response3",productScrapping.data.productCount);

        setStatus("Scrapping COmpleted");

        if (productScrapping.data.productCount>0){
            navigate("/all");
        }
       

    }catch(error){
        setStatus(error);
    }
    finally{
        setStatus(false);
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
        
            
        </div>
    )
}

export default SearchBar;

