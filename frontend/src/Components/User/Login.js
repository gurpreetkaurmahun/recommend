import React from "react";
import "../styles.css";
import { useNavigate } from 'react-router-dom';
import { useState ,useEffect} from "react";
import { HiOutlineSaveAs } from "react-icons/hi";
import {useAuth}from "../AuthenticateContext.js";
import Navbar from "../Navbar.js";
import { ImNewspaper } from "react-icons/im";
import{validPhone} from"../../Helpers/Validation.js";
import MyForm from "../Form.js";
import {registerUser,emailVerification} from"../../Backend-services/AccountSpecific.js";
import Message from "../Message.js";



const Login=()=>{

  const authContext=useAuth();
//  console.log("Authcontext",authContext);
    const[registerClick,setRegisterCLick]=useState(false);
    const[loginClick,setLoginClick]=useState(false);
    const [verificationId, setVerificationId] = useState(null);
    const [verificationToken, setVerificationToken] = useState(null);
    const[showVerificationMessage,setShowVerificationMessage]=useState(false);
    const [inactivityTimer, setInactivityTimer] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    // const[newUser,setNewUser]=useState("");
    const navigate=useNavigate();
    const[error,setError]=useState(false);
    const[errorMessage,setErrorMessage]=useState("");


  const fields=[
       { name: 'Email', type: 'text', label: 'Email' },
       { name: 'Password', type: 'password', label: 'Password' }
   ]

  const regFields=[
    { name: 'Email', type: 'text', label: 'Email' },
    { name: 'Password', type: 'password', label: 'Password' },
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
     
      if (authContext.authenticated && !localStorage.getItem('initialLoginRedirect')) {
        localStorage.setItem('initialLoginRedirect', 'true');
        navigate("/search", { replace: true });
      }
    }, [authContext, navigate]);


    const handleSuccessfulLogin = async () => {

        const redirectToReview = localStorage.getItem('redirectToReview');
        const storedProducts = localStorage.getItem('scrapedProducts');
        const searchProduct = localStorage.getItem('searchProduct');
        const nearbyStores = localStorage.getItem('nearbyStores');
      
       if (redirectToReview === 'true') {
          localStorage.removeItem('redirectToReview');
          navigate('/review');
        }
        else if (storedProducts) 
        {
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
          // console.log("Full login response:", success);
      
          if (success.result && success.token) {
            // console.log("Token received:", success.token);
            localStorage.setItem("userToken", success.token);
            const storedToken = localStorage.getItem("userToken");
            // console.log("Token stored in localStorage:", storedToken);
      
            if (storedToken === success.token) {
              // console.log("Token successfully stored");
              await handleSuccessfulLogin();
            } else {
              throw new Error("Token storage failed");
            }
          } else {
            throw new Error(success.error || "An account with this email doesnot exists");
          }
        } catch (err) {
          console.error("Login error:", err);
          setError(true);
          setErrorMessage(err.message || "An error occurred during login. Please try again.");
        }
      }


  

    async function handleRegSubmit(values) 
    {
      
      try 
      {
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

          // validPhone(customer.ContactNo);
  
          const response = await registerUser(customer);
  
          console.log("Registration response", response);
  
          if (response.result) {
              setError(false);
              setErrorMessage('');
         
              setShowVerificationMessage(true);
              setVerificationId(response.userId);
              setVerificationToken(response.token);
  
              // Don't redirect automatically
          } 
          else {
            
          }
      } 
      catch (error) 
      {
          setError(true);
          setErrorMessage(error.message.message);
      }
    }

    async function checkVerificationStatus() {
      if (verificationId && verificationToken) {
            try 
            {
              const response = await emailVerification(verificationId, verificationToken);
              
              if (response.result) 
              {
                alert('Email verified successfully! You can now log in.');
                setShowVerificationMessage(false);
                setVerificationId(null);
                setVerificationToken(null);
                setLoginClick(false);
                navigate('/login');
                return; // Exit the function after successful verification
              }
            } 
            catch (error) 
            {
              console.error('Verification check failed:', error);
            }
            
            // If not verified or there's an error, check again after a delay
            setTimeout(checkVerificationStatus, 5000); // Check every 5 seconds
        }
    }

    function handleRegistration()
    {
      setLoginClick(true);
      setRegisterCLick(true);
    }

    function handleLoginClick()
    {
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
      // alert("Session timed out");
    };

        //  function onClose(){
        //   setShowVerificationMessage(false);
        //   setRegisterCLick(false);
        //   setLoginClick(false);
        //  }

        //  const togglePasswordVisibility = () => {
        //   setShowPassword(!showPassword);
        // };
  
    return(
        <div>
        <Navbar/>
        <div  className="loginReg">
       <div style={{flex:1}}>
 
        {/* //Login Div */}

       
       {!loginClick&&<div className="signIn" >  
        <h1 className="SignIn" > Sign In </h1>
        <MyForm
        fields={fields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        buttonText="Sign in"
        layout="vertical"
        /> 
       
        
        </div>}

        {loginClick&&  <div className="welcomeDiv" >

        <h1 className="SignIn">Welcome Back!</h1>
        <p style={{padding:"30px 0px 30px"}}> To keep connected with <span className="brand"> </span> please login </p>
        <button onClick={handleLoginClick} className="buttonT"> SignIn</button>
        </div>

        }
        </div>
      
      {/* //RegistrationDiv */}
      <div style={{flex:1}}>
      

      {showVerificationMessage && <Message value="An Email Verification link has been sent, Please click the link and log in to continue." onClose={()=>{setShowVerificationMessage(false)}}/>}

      {error && <Message value={errorMessage} onClose={()=>{setError(false)}} />}

      {!registerClick&& <div className="regDiv" >
        
        <h1 className="SignIn">Is this your first visit?</h1>
        <button onClick={handleRegistration} className="buttonT"> Create Account</button>
        <p style={{padding:"30px 0px 30px"}}> You'll gain</p>
        <ul className="benefits" >
            <li style={{listStyle:"none",textAlign:"left",marginLeft:"-22px"}}><div style={{display:"inline-block",fontSize:"30px",marginRight:"10px"}}> <HiOutlineSaveAs /></div> Save Products</li>
            <li style={{listStyle:"none",textAlign:"left",marginLeft:"-20px"}}><div style={{display:"inline-block",fontSize:"30px",marginRight:"10px"}}> <ImNewspaper /></div> Newsletter Signup</li>
        </ul></div>
      }

      {registerClick && !showVerificationMessage && (
        <div>
          <h1 style={{padding: "150px 0px 50px"}}>Create Account</h1>
          <MyForm
            fields={regFields}
            initialValues={regValues}
            onSubmit={handleRegSubmit}
            buttonText="Create Account"
            layout="vertical"
          />
        </div>
      )}
      </div>
      </div>
      </div>
    )
}

export default Login;

