import React from "react";

function Product({title,price,image,link,onDelete,productId}){



    
    return <div style={{width:600,height:600}}>
        <h2> name:{title}</h2>
        <p>price:{price}</p>
      
        <p>read more:<a href={link}>{link} </a></p>
        <img src={image} style={{height:100,width:100}}></img>
        <button onClick={() => onDelete(productId)} >Delete </button>
        <button>Update</button>

    </div>

}

export default Product;