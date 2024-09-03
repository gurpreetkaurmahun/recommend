import React from"react";
import { IoCloseCircleOutline } from "react-icons/io5";

function Message({value,onClose}){
    return(
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
              <p>{value}</p>
          </div>
    )
}

export default Message;