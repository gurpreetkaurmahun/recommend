import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";

const SlideUpDiv = ({ onClose }) => {
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('activeUserId');
    setIsUser(id !== null && id !== "null" && id !== "");
  }, []);

  return (
    <div className="slide-up-div active" style={{ width: "18%", marginLeft: "80%", borderRadius: "20px" }}>
      <div>
        <p>Products</p>
        <button 
          className="animatedButton" 
          onClick={onClose} 
          style={{ width: 40, position: "absolute", top: "-7%", right: "-48%", borderRadius: "50%" }}
        >
          <h3 style={{ fontSize: "30px", position: "relative", bottom: "20px", right: "15px" }}>
            <IoCloseCircleOutline />
          </h3>
        </button>
        <hr />
      </div>
      
      <h4 style={{ marginTop: 50 }}>Become a member to save products</h4>
      <p style={{ marginBottom: "10px" }}>
        Recommend.. app membership is great if you are someone who enjoys shopping smart!
      </p>
      
      {!isUser ? (
        <button className="animatedButton" style={{ width: "90%", height: 30, padding: 20, margin: 0 }}>
          <Link 
            style={{ 
              fontSize: "12px", 
              letterSpacing: 1, 
              display: "flex", 
              justifyContent: 'center', 
              textAlign: "center", 
              textDecoration: "none" 
            }} 
            to="/login"
          >
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
