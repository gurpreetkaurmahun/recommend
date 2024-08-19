import React, { useContext } from "react";
import "./styles.css";
import { FaRegUser } from "react-icons/fa6";
import { FaUserLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useState ,useEffect} from "react";
import { HiOutlineSaveAs } from "react-icons/hi";
import {useAuth}from "./AuthenticateContext.js";
import Navbar from "./Navbar.js";
import { ImNewspaper } from "react-icons/im";
import { TfiEmail } from "react-icons/tfi";
import MyForm from "./Form.js";

import {registerUser,logoutUser,emailVerification} from"../Backend-services/AccountSpecific.js";



// import Roles from"../Backend-services/RoleSpecific.js";
///Remove token from local storage

//add admin options button on navbar
const Login=()=>{


   
    const authContext=useAuth();


   console.log("Authcontext",authContext);

    const [id,setId]=useState("");
    const[token,setToken]=useState("");

    const[registerClick,setRegisterCLick]=useState(false);
    const[loginClick,setLoginClick]=useState(false);
    const[buttonVisisble,setButtonVisible]=useState(false);

   const fields=[
       { name: 'Email', type: 'text', label: 'Email' },
       { name: 'Password', type: 'text', label: 'Password' }
   ]

   const regFields=[
    { name: 'Email', type: 'text', label: 'Email' },
    { name: 'Password', type: 'text', label: 'Password' },
    { name: 'Firstname', type: 'text', label: 'FirstName' },
    { name: 'Lastname', type: 'text', label: 'Lastname' },
    { name: 'Address', type: 'text', label: 'Address' },
    { name: 'ContactNo', type: 'text', label: 'ContactNo' },
    { name: 'DateofBirth', type: 'date', label: 'DateOfBirth' }
]


   const initialValues={
    Email:"",
    Password:""
   }

    const regValues={
            "Email":"",
            "Password":"",
            "FName":"",
            "LName":"",
            "Address":"",
            "ContactNo":"",
            "Dob":"",
            "Latitude":0.0,
            "Longitude":0.0,
            "FullLocation":""

    }

    
    const[user,setUser]=useState({
        
        "Email":"",
        "Password":"",
        "FName":"",
        "LName":"",
        "Address":"",
        "ContactNo":"",
        "Dob":"",
        "Latitude":0.0,
        "Longitude":0.0,
        "FullLocation":""
    
});






    const navigate=useNavigate();
    const[error,setError]=useState(true);
    const[errorMessage,setErrorMessage]=useState("");
   

    useEffect(() => {
       
        console.log("Auth context in login  is",authContext);
        if(authContext.authenticated){
            navigate("/", { replace: true });
        }
       
      
      }, [authContext,navigate]);

    

  async function handleSubmit(values){
      console.log("Login Values",values);

        try {
            const success = await authContext.Login(values.Email, values.Password);

            console.log("Success Login message is:",success);
            if (success) {
                
                
                    console.log("Welcome User",authContext.token);

                    navigate("/search");
             
               
            } else {
                setError(true);
                setErrorMessage("Login failed. Please check your credentials.");
                console.log("Login failed. Please check your credentials.");
                navigate("/login");

                
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(true);
        setErrorMessage("An error occurred during login. Please try again.");
        }
       
    }

    async function handleRegSubmit(values){

        console.log("Registration Value",values);
        try{

            const customer={
                "Email":values.Email,
                "Password":values.Password,
                "FName":values.Firstname,
                "LName":values.Lastname,
                "Address":values.Address,
                "ContactNo":values.ContactNo,
                "Dob":values.DateOfBirth,
                "Latitude":values.Latitude,
                "Longitude":values.Longitude,
                "FullLocation":values.FullLocation
            
                };

                const response= await registerUser(customer);

                console.log("Registration response",response);




        }
        catch(error){

        }}

        function handleRegistration(){
            setLoginClick(true);
            setRegisterCLick(true);
        }

        function handleLoginClick(){
            setRegisterCLick(false);
            setLoginClick(false);
        
        }

  
    return(
        <div>
        <Navbar/>
        <div style={{display:"flex",marginTop:"-40px"}}>
       <div style={{flex:1}}>
       {!loginClick&&<div >  
        <h1 style={{padding:"200px 0px 50px"}}> Sign In </h1>
        <MyForm
        fields={fields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        buttonText="Sign in"
        /> 
        {/* <button onClick={handleLoginClick} style={{width:200,background: "linear-gradient(45deg, #f321bf, #ebe1e4)",borderRadius:"20px",display:{}}}> SignIn</button> */}
        
        </div>}

        {loginClick&&  <div style={{flex:1,backgroundColor:"#fc6bd8",minHeight:"1000px"}}>

        <h1 style={{padding:"200px 0px 50px"}}>Welcome Back!</h1>
        <p style={{padding:"30px 0px 30px"}}> To keep connected with <span className="brand"> </span> please login </p>
        <button onClick={handleLoginClick} className="buttonT"> SignIn</button>
        </div>

        }
        
        </div>
        
      
 

       <div style={{flex:1}}>

       {!registerClick&& <div style={{backgroundColor:"#fc6bd8",minHeight:"1000px",}}>
            <h1 style={{padding:"200px 0px 50px"}}>Is this your first visit?</h1>
            <button onClick={handleRegistration} className="buttonT"> Create Account</button>
            <p style={{padding:"30px 0px 30px"}}> You'll gain</p>
            <ul style={{width:"500px",position:"relative",left:"380px"}}>
                <li style={{listStyle:"none",textAlign:"left",marginLeft:"-22px"}}><div style={{display:"inline-block",fontSize:"30px",marginRight:"10px"}}> <HiOutlineSaveAs /></div> Save Products</li>
                <li style={{listStyle:"none",textAlign:"left",marginLeft:"-20px"}}><div style={{display:"inline-block",fontSize:"30px",marginRight:"10px"}}> <ImNewspaper /></div> Newsletter Signup</li>
            </ul></div>}


       {registerClick&& 
       <div>
        <h1>Create Account</h1>
       <MyForm
        fields={regFields}
        initialValues={regValues}
        onSubmit={handleRegSubmit}
        buttonText="Create Account"
        />
        </div>
        }


        </div>
        </div>
        
        </div>
    )
}

export default Login;

