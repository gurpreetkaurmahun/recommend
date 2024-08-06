import React from "react";


//Addlocation Icon
function Product({title,price,image,link,pricePerUnit,supermarket,imageLogo,onSave,onDelete}){

    console.log('Product Component Props:', { title, price, image, link, pricePerUnit, supermarket, imageLogo });

    
    return <div
    style={{
      display: 'flex', // Use flexbox to align items horizontally
      flexWrap: 'wrap', // Allow wrapping if the container is too narrow
      gap: '50px', // Add space between the cards
   // Align items to the start of the container
   display:"inline-block",
      marginBottom: '50px',
      marginRight:"50px"
    }}
  >
    
    <div style={{
        width: '400px',
        height: '500px',
        position: 'relative',
        top: '0',
      
     }} > 
        <div class="card" style={{width:350,height:500}} >
  <img src={image} class="card-img-top" style={{height:200,width:200}}/>
  {imageLogo && (
            <img 
              src={imageLogo} 
              className="card-img-top" 
              style={{ 
                height: 50,  // Adjust height as needed
                width: 50,   // Adjust width as needed
                position: "absolute", 
                top: 10, 
                right: 10, 
          
              }}
              alt="Supermarket Logo"
            />
          )}
  <div class="card-body">
    <h5 class="card-title">{title}</h5>
    <p class="card-text">{price}</p>
  </div>
  <ul class="list-group list-group-flush">
    
    <li class="list-group-item">{pricePerUnit}</li>
    <li class="list-group-item" style={{fontSize:"20px",color:"red"}}>At:{supermarket}</li>
    <li class="list-group-item"> <a href={link}> ReadMore</a></li>
   
  </ul>
  <div class="card-body">
    <button  onClick={onSave}class="btn btn-light" style={{width:80,display:"inline-block",marginRight:20}}>Save</button>
    <button onClick={onDelete}class="btn btn-light" style={{width:80, display:"inline-block",marginRight:20}}>Delete</button>
   
  </div>
</div>
</div>
</div>





        {/* <h2> name:{title}</h2>
        <p>price:{price}</p>
      <p> price per unit{pricePerUnit}</p>
        <p>read more:<a href={link}>{link} </a></p>
        <img src={image} style={{height:100,width:100}}></img>
        <button onClick={onDelete} >Delete </button>
        <button onClick={onSave} > Save </button>
        <button>Update</button> */}

 
}

export default Product;