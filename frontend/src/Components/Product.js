import React from "react";
import { MdFavoriteBorder } from "react-icons/md";

//Addlocation Icon
function Product({title,price,image,link,pricePerUnit,supermarket,imageLogo,category,onSave,onDelete}){

    console.log('Product Component Props:', { title, price, image, link, pricePerUnit, supermarket, imageLogo });

    const truncateTitle = (title) => {
      return title.length > 25 ? `${title.substring(0, 25)}...` : title;
    };
    
    return <div
    style={{
      display: 'flex', // Use flexbox to align items horizontally
      // flexWrap: 'wrap', // Allow wrapping if the container is too narrow
      gap: '50px', // Add space between the cards
      border:"none",
      width:200,
      height:350,
    display:"inline-block",
      marginBottom: '50px',
      marginRight:"50px",
  
      position: "relative", 
      boxSizing: "border-box",
      filter: "drop-shadow(5px 5px 6px hwb(314 78% 1%)"
   
    }}
  >
    
    <div className="inner" style={{
        width: '200px',
        height:"380px",
 
        position: 'relative',
        top: '0',
        borderRadius:"20px",
        overflow: "hidden",
     
      
     }} > 
        <div class="card" style={{width:200,height:400,border:"none"}} >
  <img src={image}  style={{height:150,width:"100%",borderRadius: "20px ",filter: "drop-shadow(5px 5px 6px hwb(314 78% 1%)"}}/>

  <div class="card-body">
    <h6  style={{textAlign:"left",fontSize:"18px"}}>{truncateTitle(title)}</h6>
    <p  style={{textAlign:"justify",paddingTop:5,fontSize:"bold"}}>{price}</p>
  </div>
  {/* <ul class="list-group list-group-flush"> */}
  <ul style={{marginTop:"-20px",marginLeft:10}}>
    
    <li  style={{textAlign:"left",listStyle:"none",position:"relative",left:"-25px"}}>{pricePerUnit}</li>

    <li  style={{fontSize:"20px",color:"red",textAlign:"left",listStyle:"none",position:"relative",left:"-25px"}}>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
</svg> :
      {supermarket}</li>
    <li  style={{textAlign:"left",listStyle:"none",margin:5,position:"relative"}}> <button className="buttonT" style={{width:80}}> <a style={{textDecoration:"none",color:"white"}} href={link}>Visit</a></button> </li>
   
  </ul>
  <div class="card-body">
    <button  onClick={onSave}class="btn btn-light" style={{width:80,display:"inline-block",marginRight:20,     height: 50,  // Adjust height as needed
                width: 50,   // Adjust width as needed
                position: "absolute", 
                top: 0, 
                right: "-20px", 
                borderRadius:"50%",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.8)"
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-heart-half" viewBox="0 0 16 16">
  <path d="M8 2.748v11.047c3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
</svg>
                </button>

                {/* provide delete button only on registered users */}
    {/* <button onClick={onDelete}class="btn btn-light" style={{width:80, display:"inline-block",marginRight:20}}>Delete</button> */}
   
  </div>
</div>
</div>
</div>





 

 
}

export default Product;