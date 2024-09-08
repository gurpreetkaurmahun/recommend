import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineRight } from "react-icons/ai";




function ProductLink({image,title,price,link,imageLogo,supermarket,onSave}){
    return (
        <div style={{ marginBottom:"30px",borderRadius:"20px"}}>
            <div style={{display:"flex",height:"60px" }} >
            <div style={{ width: "50px", height:"50px", display: "flex", justifyContent: "center", alignItems: "center",marginRight:10}}>
                    <span className="productLink" >
                     <a href={link}>  <AiOutlineRight style={{ fontSize: "20px",color:"black",textDecoration:"none" }} /></a>  
                   
                    </span>
                </div>
                <div style={{borderLeft:"1px solid black",display:"flex"}}>
                <img src={imageLogo} style={{width:50,height:50,borderRadius:"50%",marginLeft:10,marginTop:5}}></img>
                <h4 style={{marginTop:"12%",marginLeft:"10%"}}>{supermarket}</h4>
                <button onClick={onSave} className="btn btn-light"  style={{width:80,display:"inline-block",marginRight:20,     height: 50,  // Adjust height as needed
                width: 50,   // Adjust width as needed
                position: "absolute", 
                top: 0, 
                right: "-20px", 
                borderRadius:"50%",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.8)"
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-heart-half" viewBox="0 0 16 16">
                    <path d="M8 2.748v11.047c3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                    </svg>
                </button>

                </div>
              
               
                
            </div>
            <hr style={{marginTop:0}} ></hr>
            <div style={{display:"flex",marginLeft:20,marginBottom:20}}>
            <img src={image}style={{width:70,height:70,borderRadius:"20px",marginBottom:20}}></img>

            <div className="productLinkDiv" >
            <a href={link} style={{textDecoration:"none"}}><h6 className="productLinkTitle">{title}</h6></a>
            <p className="priceProductLink"  >{price}</p>
            </div>
         
            </div>
           
        </div>
    )
}

export default ProductLink;