import React from"react";
import { IoCloseCircleOutline } from "react-icons/io5";

function Message({value,onClose}){
    return(
        <div className="message" >
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