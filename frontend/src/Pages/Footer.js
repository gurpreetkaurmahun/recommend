import { FiArrowRightCircle } from "react-icons/fi";
import MyForm from "../Components/Form";
import { Link } from "react-router-dom";
import Message from "../Components/Message.js";
import { useState,useEffect } from "react";
import {getCustomerById,updateCustomer} from "../Backend-services/CustomerSpecific.js";


function Footer(){

  const [user,setUser]=useState("");
  const[error,setError]=useState(false);
  const[errorMessage,setErrorMessage]=useState("");

  const fields= [{ name: 'Email', type: 'email', label: 'registered email' }]

  const initialValues={Email:""}

  useEffect(()=>{
    const UserId=localStorage.getItem("activeUserId");

    console.log("UserId in Footer:",UserId);
    console.log("logged in Footer user is:",user);
  },[]);

  async function handleSubmit(values) {
    try {
      const response = await getCustomerById(localStorage.getItem("activeUserId"));
      console.log("Logged in user in Local storage is:", response.consumer);
      
      if (response.consumer) {

        const updatedUser = { ...response.consumer, isSubscribed: true };
        setUser(updatedUser);
        const updateResponse = await updateCustomer(updatedUser.consumerId, updatedUser);
        if (updateResponse.success) {
          setError(false);
          setErrorMessage("");
          console.log("User successfully subscribed to newsletter");
        } else {
          throw new Error("Failed to update user subscription status");
        }
        
        setError(false);
        setErrorMessage("");
      } else {
        throw new Error("No consumer data found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(true);
      setErrorMessage(error.message || "Failed to fetch user data");
    }
  }

    return (
    <div style={{background: "linear-gradient(45deg, #f321bf, #ebe1e4)",}}>
        <footer class="pt-4 my-md-5 pt-md-5 " >
          {error&&<Message value={errorMessage} onClose={()=>setError(false)}/>}
        <div class="row">
          <div className="newsletter" style={{height:300,marginTop:"-50px",position:"relative",marginBottom:50}}>
                <h2 style={{marginTop:100}}>Subscribe to our Newsletter</h2>
                <p>Get information about exclusive offers </p>
                <div style={{position:"relative"}} >
                  <MyForm
                  fields={fields}
                  initialValues={initialValues}
                  onSubmit={handleSubmit}
                  buttonText={ <FiArrowRightCircle /> }
                  inputStyle={{
                    width: 400,
                    borderRadius: "20px",
                    height: "45px",
                    border: "none",
                    padding: "0 15px"
                  }}
                  buttonStyle={{
                    position: "absolute",
                   borderRadius:"50%",
                    width:"50px",
                    top: "42%",
                    right:"40%",
                    transform: "translateY(-50%)",
                    fontSize: "25px"
                  }}

                  />
           
            
            </div>

        <hr style={{marginTop:100}}></hr> </div>

      <div class="col-12 col-md" style={{marginTop:150,}}>
        <img class="mb-2" src="/docs/5.3/assets/brand/bootstrap-logo.svg" alt="" width="24" height="19"/>
        <small class="d-block mb-3 text-body-secondary">© 2017–2024</small>
      </div>
     
      <div class="col-6 col-md" style={{marginTop:150,width:"300px",textAlign:"left",}}>
        <span className="brand"></span>
        <ul class="list-unstyled text-small">
          <Link to="/search" style={{display:"block",color:"white",textDecoration:"none",width:"300px",textAlign:"left",marginLeft:"40%"}} >Lets Get Started</Link>
          <Link to="/review" style={{display:"block",color:"white",textDecoration:"none",width:"300px",textAlign:"left",marginLeft:"40%"}}>Reviews</Link>
          <Link to="/login" style={{display:"block",color:"white",textDecoration:"none",width:"300px",textAlign:"left",marginLeft:"40%"}}>Login/Register</Link>
          
        </ul>
      </div>
     

      <hr style={{marginTop:100}}></hr>
      
      <div  style={{position:"relative"}}>
        <p className="footerPara" >Copyright 2024 Recommend</p>
        <button    className="animatedButton footerButton" > <a href="#top" style={{position:"relative",bottom:"10px",textDecoration:"none",color:"white"}}>To the top</a></button>
      </div>
    </div>
  </footer>
    </div>)
}

export default Footer;