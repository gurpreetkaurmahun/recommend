import React, { useContext } from "react";
import "./styles.css";

import { useNavigate } from 'react-router-dom';
import { useState ,useEffect} from "react";
import { HiOutlineSaveAs } from "react-icons/hi";
import {useAuth}from "./AuthenticateContext.js";
import Navbar from "./Navbar.js";
import { ImNewspaper } from "react-icons/im";
import{validPhone} from"../Helpers/Validation.js";
import MyForm from "./Form.js";
import { IoCloseCircleOutline } from "react-icons/io5";
import {registerUser,logoutUser,emailVerification} from"../Backend-services/AccountSpecific.js";




const Login=()=>{


   
    const authContext=useAuth();


   console.log("Authcontext",authContext);

 

    const[registerClick,setRegisterCLick]=useState(false);
    const[loginClick,setLoginClick]=useState(false);
    const [verificationId, setVerificationId] = useState(null);
    const [verificationToken, setVerificationToken] = useState(null);
    const[verificationMessage,setVerificationMessage]=useState("");
    const[showVerificationMessage,setShowVerificationMessage]=useState(false);

    const [inactivityTimer, setInactivityTimer] = useState(null);
    const[newUser,setNewUser]=useState("");


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
    if (authContext.authenticated) {
      resetInactivityTimer();
      // Add event listeners for user activity
      window.addEventListener('mousemove', resetInactivityTimer);
      window.addEventListener('keypress', resetInactivityTimer);
    }

    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keypress', resetInactivityTimer);
    };
  }, [authContext.authenticated]);

    useEffect(() => {
        let intervalId;
        if (showVerificationMessage) {
            intervalId = setInterval(checkVerificationStatus, 5000);
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [showVerificationMessage, verificationId, verificationToken]);

    useEffect(() => {
       
        console.log("Auth context in login  is",authContext);
        console.log("LocalStorage in login componnet",localStorage);
        if(authContext.authenticated){
           
            navigate("/search", { replace: true });
        }
       
      
      }, [authContext,navigate]);
      const handleSuccessfulLogin = async () => {
        const storedProducts = localStorage.getItem('scrapedProducts');
        const searchProduct = localStorage.getItem('searchProduct');
        const nearbyStores = localStorage.getItem('nearbyStores');
      
        console.log("Stored Products", storedProducts);
      
        if (storedProducts) {
          navigate('/all', { 
            state: { 
              searchResults: JSON.parse(storedProducts),
              searchProduct: searchProduct,
              nearbyStores: JSON.parse(nearbyStores || '[]')
            } 
          });
        } else {
          navigate('/search');
        }
      };
      async function handleSubmit(values) {
        console.log("Login Values", values);
      
        try {
          const success = await authContext.Login(values.Email, values.Password);
      
          console.log("Success Login message is:", success);
          if (success.result) {
            const token = success.token;
            if (token) {
              localStorage.setItem("userToken", token);
              console.log("Local Storage after Login", localStorage);
              console.log("Welcome User", token);
              await handleSuccessfulLogin();
            } else {
              console.error("Token is not available after login.");
              setError(true);
              setErrorMessage("Login failed. Token not received.");
            }
          } else {
            setError(true);
            setErrorMessage(success.error || "Login failed. Please check your credentials.");
            console.log("Login failed. Please check your credentials.");
          }
        } catch (err) {
          console.error("Login error:", err);
          setError(true);
          setErrorMessage("An error occurred during login. Please try again.");
        }
      }


    ///handle registration important

    async function handleRegSubmit(values) {
      console.log("Registration Value", values);
      try {
          const customer = {
              "Email": values.Email,
              "Password": values.Password,
              "FName": values.Firstname,
              "LName": values.Lastname,
              "Address": values.Address,
              "ContactNo": values.ContactNo,
              "Dob": values.DateOfBirth,
              "Latitude": values.Latitude,
              "Longitude": values.Longitude,
              "FullLocation": values.FullLocation
          };
  
          validPhone(customer.ContactNo);
  
          const response = await registerUser(customer);
  
          console.log("Registration response", response);
  
          if (response.result) {
              setError(false);
              setErrorMessage('');
              setVerificationMessage(response.message);
              setShowVerificationMessage(true);
              setNewUser(customer.Email);
              
              // Store the verification details
              setVerificationId(response.userId);
              setVerificationToken(response.token);
  
              // Don't redirect automatically
          } else {
            setError(true);
            setErrorMessage(response.err.message);
          }
      } catch (error) {
          setError(true);
          setErrorMessage(error.message.message);
      }
  }

    async function checkVerificationStatus() {
        if (verificationId && verificationToken) {
            try {
                const response = await emailVerification(verificationId, verificationToken);
                
                if (response.result) {
                    alert('Email verified successfully! You can now log in.');
                    setShowVerificationMessage(false);
                    setVerificationId(null);
                    setVerificationToken(null);
                    setLoginClick(false);
                    navigate('/login');
                    return; // Exit the function after successful verification
                }
            } catch (error) {
                console.error('Verification check failed:', error);
            }
            
            // If not verified or there's an error, check again after a delay
            setTimeout(checkVerificationStatus, 5000); // Check every 5 seconds
        }
    }

        function handleRegistration(){
            setLoginClick(true);
            setRegisterCLick(true);
        }

        function handleLoginClick(){
            setRegisterCLick(false);
            setLoginClick(false);
        
        }


        const resetInactivityTimer = () => {
            if (inactivityTimer) clearTimeout(inactivityTimer);
            const newTimer = setTimeout(handleInactivityLogout, 30 * 60 * 1000); // 30 minutes
            setInactivityTimer(newTimer);
          };
        
          const handleInactivityLogout = () => {
            authContext.Logout();
            navigate('/login');
            alert("Session timed out");
          };

         function onClose(){
          setShowVerificationMessage(false);
          setRegisterCLick(false);
          setLoginClick(false);
         }
  
    return(
        <div>
        <Navbar/>
        <div style={{display:"flex",marginTop:"-40px"}}>
       <div style={{flex:1}}>
       {error && <p style={{color: 'red'}}>{errorMessage}</p>}
       {!loginClick&&<div >  
        <h1 style={{padding:"200px 0px 50px"}}> Sign In </h1>
        <MyForm
        fields={fields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        buttonText="Sign in"
        /> 
       
        
        </div>}

        {loginClick&&  <div style={{flex:1,backgroundColor:"#fc6bd8",minHeight:"1000px"}}>

        <h1 style={{padding:"200px 0px 50px"}}>Welcome Back!</h1>
        <p style={{padding:"30px 0px 30px"}}> To keep connected with <span className="brand"> </span> please login </p>
        <button onClick={handleLoginClick} className="buttonT"> SignIn</button>
        </div>

        }
        
        </div>
        
      
      

       <div style={{flex:1}}>
      

       {showVerificationMessage && (
    <div  style={{
      position: "fixed",
      bottom:"40%",
      left: "40%",
      width:"500px",
      border:"1px solid black",
      backgroundColor: "#f9f9f9",
      padding: "20px",
      boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
      transition: "bottom 0.5s ease-in-out",
      zIndex: 1000
    }}>
        <div style={{height:20}}>

        <button 
          className="animatedButton" 
          onClick={onClose} 
          style={{ width: 40, position: "absolute", top: "-7%", right: "-48%", borderRadius: "50%" }}
        >
          <h3 style={{ fontSize: "30px", position: "relative", bottom: "20px", right: "15px" }}>
            <IoCloseCircleOutline />
          </h3>
        </button>
        </div>
        <hr></hr>
        <p>An Email Verification link has been sent, Please click the link and log in to continue.</p>
    </div>
)}
       {error && <p style={{color: 'red'}}>{errorMessage}</p>}
       {!registerClick&& <div style={{backgroundColor:"#fc6bd8",minHeight:"1000px",}}>
    
            <h1 style={{padding:"200px 0px 50px"}}>Is this your first visit?</h1>
            <button onClick={handleRegistration} className="buttonT"> Create Account</button>
            <p style={{padding:"30px 0px 30px"}}> You'll gain</p>
            <ul style={{width:"500px",position:"relative",left:"380px"}}>
                <li style={{listStyle:"none",textAlign:"left",marginLeft:"-22px"}}><div style={{display:"inline-block",fontSize:"30px",marginRight:"10px"}}> <HiOutlineSaveAs /></div> Save Products</li>
                <li style={{listStyle:"none",textAlign:"left",marginLeft:"-20px"}}><div style={{display:"inline-block",fontSize:"30px",marginRight:"10px"}}> <ImNewspaper /></div> Newsletter Signup</li>
            </ul></div>}

            {registerClick && !showVerificationMessage && (
          <div>
            <h1 style={{padding: "150px 0px 50px"}}>Create Account</h1>
            <MyForm
              fields={regFields}
              initialValues={regValues}
              onSubmit={handleRegSubmit}
              buttonText="Create Account"
            />
          </div>
        )}
  


        </div>
        </div>
        
        </div>
    )
}

export default Login;

