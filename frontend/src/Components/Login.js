import React, { useContext } from "react";
import "./styles.css";
import { FaRegUser } from "react-icons/fa6";
import { FaUserLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useState ,useEffect} from "react";
import Confetti from"./Confetti.js";
import { Link } from "react-router-dom";
import getAllScrappers from "../Backend-services/AdminSpecific.js";
import {useAuth}from "./AuthenticateContext.js";
import Navbar from "../Pages/Navbar.js";
import EditConsumer from "./EditConsumer.js";



// import Roles from"../Backend-services/RoleSpecific.js";
///Remove token from local storage
const Login=()=>{


   
    const authContext=useAuth();


   console.log("Authcontext",authContext);

    const[login,setLogin]=useState({
     
        email:"",
        password:"",
        
    })




    const navigate=useNavigate();
    const[error,setError]=useState(true);
    const[errorMessage,setErrorMessage]=useState("");
   

    useEffect(() => {
       
        console.log("Auth context in login  is",authContext);
        if(authContext.authenticated){
            navigate("/", { replace: true });
        }
       
      
      }, [authContext,navigate]);

    function handleChange(event){

        const{name,value}=event.target;
        setLogin(prevlogin=>{
            return{
            ...prevlogin,
            [name]:value
            }
        })

    }


  async function handleSubmit(event){
        event.preventDefault();

        try {
            const success = await authContext.Login(login.email, login.password);
            if (success) {
                
                
                    console.log("Welcome User",authContext.token);

                    navigate("/search");
            //         await new Promise(resolve => setTimeout(resolve, 100));
            
            // console.log("Auth context after login:", authContext)
        
            //         const token =authContext.token;
            //         if (!token) {
            //             throw new Error("Token is not set after login");
            //         }
    
            //         console.log("Token to use for admin operations:", token);

            //         console.log("token is",token);

            //         const admin= await getAllScrappers(token);

            //         console.log("Admin Operations:",admin);
             
               
            } else {
                setError(true);
                setErrorMessage("Login failed. Please check your credentials.");
                console.log("Login failed. Please check your credentials.");
                navigate("/register");

                
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(true);
        setErrorMessage("An error occurred during login. Please try again.");
        }
       
    }

  
    return(
        <div>
        <Navbar/>
        <div className="wrapper" id="login-component">
          {error&&<h1>{errorMessage}</h1>}
            <form action="" id="unique-form" onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className="input-box">
                <input onChange={handleChange} type="text" name="email" placeholder="Email"value={login.email} autoComplete="off"/>
                <FaRegUser className="icon" />
                
                
            </div>

            <div className="input-box">
                <input onChange={handleChange}type="password" placeholder="Password" name="password" value={login.password} autoComplete="off" /><FaUserLock className="icon" />

            </div>

            <div className="remember">
                <label htmlFor="">
                    <input type="checkbox"/>
                    Remember me <a href=""> Forgot password</a>
                 

                </label>

            </div>
            <button type="submit"> Login</button>
            {/* <button type="submit" onClick={handleLogout}> Logout</button> */}

            <div className="register">
                <p>DOnt have an account<a href=""> Register</a></p>
            </div>

            </form>
            {/* {edit&&<Link to="/edit">edit consumer</Link>} */}
{/* 
            // {logged&&<Roles token={login.token}/>} */}
            {/* {logged&& <EditConsumer Id={login.id} Identity={login.Identity}/>} */}
            {/* {logged&&<Confetti/>}
            {logged&&<button onClick={handleLogout}>Logout</button>} */}

        </div>
        </div>
    )
}

export default Login;

//  async function handleLogin(){

//     try{

//         const emailBody = {
//             Email: login.email,
//             Password: login.password
//         };
//         const loginResponse = await loginUser(emailBody);
//         console.log("The Login Response is",loginResponse.message.token);
//         if(loginResponse.error){
//             setError(loginResponse.error.message);
//             console.log("login error", loginResponse.error.data.message);
//         }
//         if (loginResponse.message.token) {
//             setLogin((prevLogin) => ({
//                 ...prevLogin,
//                 token: loginResponse.message.token,
//                 id:parseInt(loginResponse.message.consumerId, 10),
//                 Identity:loginResponse.message.identityUserId
//             }
          
//         ));
//             authContext.setAuthenticated(true);
//             authContext.setActiveUserId(parseInt(loginResponse.message.consumerId, 10));
//             authContext.SetToken(loginResponse.message.token);
//             authContext.setIdentityId(loginResponse.message.identityUserId);
//             SetId(parseInt(loginResponse.message.consumerId, 10));
//             setLogged(true);
            
//             console.log("Response", loginResponse.token);
//             console.log("Id:",id);
//             console.log("Login complete", login);
//         } else {
//             alert("Invalid Credentials");
//             console.error("Login response does not contain a token:", loginResponse.token);
//         }

//     }catch(err){
//         setError(err);
//         console.log("error is",error)


//     }
//  }
    
// async function handleLogout(){

// try{
//     const emailBody = {
//         Email: login.email,
//         Password: login.password
//     };



//     const logoutResponse=await logoutUser();

//     if (logoutResponse==="Logged out") {
//         console.log("logging out");
//         setLogin({
//             email: "",
//             password: "",
//             token: ""
//         });
//         setLogged(false);
//         console.log("Logout complete", logoutResponse);
//     }

//     console.log("Logout",logoutResponse);
// }
// catch(error){
//     console.error(error);
// }
// }
// setLogin({
//     email:"",
//     password:"",
//     token:""
// });
// setLogged(false);
// }