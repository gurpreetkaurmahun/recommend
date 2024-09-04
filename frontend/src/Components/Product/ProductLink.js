import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineRight } from "react-icons/ai";




function ProductLink({image,title,price,link,imageLogo,supermarket}){
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
                </div>
              
               
                
            </div>
            <hr style={{marginTop:0}} ></hr>
            <div style={{display:"flex",marginLeft:20,marginBottom:20}}>
            <img src={image}style={{width:70,height:70,borderRadius:"20px",marginBottom:20}}></img>

            <div style={{marginLeft:100,marginTop:20,width:"600px",display:"flex"}}>
            <a href={link} style={{textDecoration:"none"}}><h6 style={{color:"black",textDecoration:"none",fontSize:"25px"}}>{title}</h6></a>
            <p style={{position:"absolute",left:"90%",fontSize:"20px"}} >{price}</p>
            </div>
         
            </div>
           
        </div>
    )
}

export default ProductLink;