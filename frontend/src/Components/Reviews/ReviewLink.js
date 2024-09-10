import React from "react";


function ReviewLink({icon,userName,days,star,content,isOwner,onDelete,onEdit}){

 


    const renderStars = (rating) => {
        const goldStar = "⭐";
        const greyStar = "☆";
        return (
            <>
                {goldStar.repeat(rating)}
                {greyStar.repeat(5 - rating)}
            </>
        );
    };



    return(
        <div style={{ marginBottom:"30px",borderRadius:"20px"}}>
            <div style={{display:"flex",height:"60px" }} >
            <div style={{ width: "50px", height:"50px", display: "flex", justifyContent: "center", alignItems: "center",marginRight:10,borderRight:"1px solid black"}}>
                    <span className="productLink" >
                    <h3>{icon}</h3>
                   
                    </span>
                </div>
                <div style={{width:"70%",textAlign:"left"}}>
           
                <p style={{marginTop:"10px"}}>{userName} says</p>
                </div>
              
                {isOwner&&<button className="buttonT" onClick={onDelete} style={{width:"50px",borderRadius:"50%",marginLeft:"20%",marginTop:"3px"}}>X</button>}
            </div>

            <hr style={{marginTop:"-10px"}} ></hr>
            <div style={{marginLeft:20,marginBottom:20}}>
         

            <div style={{display:"flex"}}>
            <p>{renderStars(star)}</p>
            <p className="reviewLinkPara" > posted {days} days ago</p>
           

            </div>
          <div style={{textAlign:"left"}}>
          <p style={{fontSize:"20px"}} > {content}</p>
          </div>
          <div style={{display:"flex"}}>
               
            {isOwner&&<button onClick={onEdit}className="buttonT" style={{width:"50px",marginLeft:"95%",marginTop:"3px"}}>Edit</button>}
               </div>
   
            </div>
          
           
        </div>
    )
}

export default ReviewLink;

