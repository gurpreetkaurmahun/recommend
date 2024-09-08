import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";

const SlideUpDiv = ({ onClose,content }) => {
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('activeUserId');
    setIsUser(id !== null && id !== "null" && id !== "");
  }, []);

  return (
    <div className="slide-up-div active modalDiv" >
      <div>
        <p>Products</p>
        <button 
          className="animatedButton infoButton" 
          onClick={onClose} 
  
        >
          <h3 className='buttonIcon' >
            <IoCloseCircleOutline />
          </h3>
        </button>
        <hr />
      </div>
      
      <h4 >Become a member to {content}</h4>
      <p style={{ marginBottom: "10px" }}>
        Recommend.. app membership is great if you are someone who enjoys shopping smart!
      </p>
      
      {!isUser ? (
        <button className="animatedButton" style={{ width: "90%", height: 30, padding: 20, margin: 0 }}>
          <Link 
          className='linkButton' to="/login">
            Become a member or SignIn
          </Link>
        </button>
      ) : (
        <Link to="/user">
          <button>View Products</button>
        </Link>
      )}

      <img 
        src="https://www.shutterstock.com/image-vector/signup-icon-black-line-art-260nw-2497668207.jpg" 
        alt="Sign up icon"
        style={{ width: "150px", height: "150px", marginTop: 20 }}
      />
    </div>
  );
};

export default SlideUpDiv;
