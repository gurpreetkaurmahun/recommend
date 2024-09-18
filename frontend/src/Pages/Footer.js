import { FiArrowRightCircle } from "react-icons/fi";
import MyForm from "../Components/Form";
import { Link } from "react-router-dom";
import Message from "../Components/Message.js";
import { useState,useEffect } from "react";
import {getCustomerById,updateCustomer} from "../Backend-services/CustomerSpecific.js";
import {getUserEmail}from "../Backend-services/RoleSpecific.js";
import{useAuth}from "../Components/AuthenticateContext.js";
import SlideUpDiv from "../Components/InfoModal.js";

function Footer(){


  const[error,setError]=useState(false);
  const[errorMessage,setErrorMessage]=useState("");
  const[userIdentity,setUserIdentity]=useState("");
  const[verify,setVerify]=useState(false);
  const[verificationMessage,setVerificationMessage]=useState("");
  const [slideUpDiv,setSlideUpDiv] = useState(false);
  const[userId,setUserId]=useState(false);
  const authContext=useAuth();
  const isAuthenticated = authContext.authenticated; 
  const identityId=authContext.identityId;
  const activeId=authContext.activeUserId;

  

  const fields= [{ name: 'Email', type: 'email', label: 'registered email' }]

  const initialValues={Email:""}

  useEffect(()=>{
    if(isAuthenticated){
      setUserIdentity(identityId);
      setUserId(parseInt(activeId),10);
    }
   
  },[]);

  async function handleSubmit(values) {
    try {
      if (!isAuthenticated) {
        setSlideUpDiv(true);
        return;
      }
  
      if (isNaN(userId)) {
        throw new Error("Please Login or register to subscribe for newsletter");
      }

      const checkEmail=await getUserEmail(userIdentity);

      console.log("User Identity:",checkEmail);
      if(values.Email===""){
        setError(true);
        setErrorMessage("Please enter email address to continue");
        return;
      }

      if(checkEmail.email!=values.Email){
        setError(true);
        setErrorMessage("Please enter your logged in email id");
        return;
      }
  
      const response = await getCustomerById(userId);
      console.log("Full response from getCustomerById:", response);

      if (response.success && response.data && response.data.consumer) {
        console.log("Logged in user data:", response.data.consumer);
        
        const updatedUser = { ...response.data.consumer, isSubscribed: true };
        // setUser(updatedUser);
        const updateResponse = await updateCustomer(updatedUser.consumerId, updatedUser);
        if (updateResponse.success) {
          setVerify(true)
          setVerificationMessage("Successsfully subscribed to Newsletter, shall recieve a newsletter shortly!")
        } else {
          throw new Error("Failed to update user subscription status");
        }
      } else {
        throw new Error("No consumer data found in the response");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setError(true);
      setErrorMessage(error.message || "Failed to fetch or update user data");
    }
  }

    return (
    <div style={{background: "linear-gradient(45deg, #f321bf, #ebe1e4)",}}>
        <footer class="pt-4 my-md-5 pt-md-5 " >
        {verify&&<Message value={verificationMessage} onClose={()=>setVerify(false)}/>}
          {error&&<Message value={errorMessage} onClose={()=>setError(false)}/>}
          {slideUpDiv && (
          <SlideUpDiv 
            onClose={() => setSlideUpDiv(false)} 
            content="to sign up for the newsletter"
          />
        )}
           
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
        <img class="" src="https://image.shutterstock.com/image-photo/image-260nw-747766675.jpg" alt="" width="50" height="50"/>
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