import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';

function MiddleElement(){

  useEffect(()=>{
    AOS.init();
  },[])
    return(
     
        <div className="container text-center" style={{
          width:"100%",
            display: "grid",
            gridTemplateColumns: "repeat(4, 320px)", // Four columns of 300px each
            gridTemplateRows: "repeat(3, 200px)", // Three rows of 300px each
            gap: "20px",
            backgroundColor:"#F3EFEF"
            
        }}>
            <div className="item1" style={{  gridColumn: "span 2", gridRow: "span 2" }} >
            <img src="https://thesaltypot.com/wp-content/uploads/2019/02/Avocado-Toast09.jpg" style={{ width: "100%", height: "100%", objectFit: "cover",borderRadius:"20px" }}></img>
            </div>
            <div className="item2" style={{  gridColumn: "span 1", gridRow: "span 1" }}data-aos="fade-left">
            <img src="https://www.upickberries.com.au/wp-content/uploads/2020/09/the-fruit-report2-1300x650.jpg" style={{ width: "100%", height: "100%", objectFit: "cover" ,borderRadius:"20px" }} alt="Fruit Report" />
            </div>
            <div className="item3" style={{ gridColumn: "span 1", gridRow: "span 3" }} data-aos="fade-left">
         
              <img src="https://assets.sainsburys-groceries.co.uk/gol/6573987/1/2365x2365.jpg" style={{ width: "100%", height: "100%", objectFit: "cover",borderRadius:"20px" }}></img>
            </div>

            {/* <div style={{position:"absolute",top:250,left:150,animation: "zoom 2s forwards"}}data-aos="fade-right">
              <h1 style={{fontSize:"80px",fontWeight:"bold",transform:"translateZ(200px)",textShadow:"grey 5px 0 10px"}}> Recommend......</h1>
              <Link to="/search" class="btn btn-light" style={{fontSize:"30px",textDecoration:"none",color:"black"}}>  Search</Link>
            </div> */}
            <div className="item4" style={{ gridColumn: "span 1", gridRow: "span 2" }}>
          
              <img src="https://assets.sainsburys-groceries.co.uk/gol/8061240/1/2365x2365.jpg" data-aos="fade-right" style={{ width: "100%", height: "100%", objectFit: "cover",borderRadius:"20px" }}></img>
            </div>
            <div className="item5" style={{  gridColumn: "span 1", gridRow: "span 1" }} data-aos="fade-right">
               <img src="https://i2-prod.dailyrecord.co.uk/lifestyle/fashion-beauty/article32547582.ece/ALTERNATES/s615b/566_OlaySS_ProductHero_Shot03_0523_MAIN.jpg" style={{ width: "100%", height: "100%", objectFit: "cover",borderRadius:"20px" }}/> 
            </div>
            <div className="item6" style={{  gridColumn: "span 1", gridRow: "span 1" }} data-aos="fade-right">
            <img src="https://www.snackfirst.com/cdn/shop/products/SourGummiesMedley.jpg?v=1680840036" style={{ width: "100%", height: "100%", objectFit: "cover",borderRadius:"20px" }}></img>
            </div>
            <style>
                {`
                    @keyframes zoom {
                      0% { transform: scale(1); }
                      50% { transform: scale(1.2); }
                      100% { transform: scale(1); }
                    }
                `}
            </style>

        </div>
    );
      {/* <h1 class="display-3 fw-bold">recommmmend......</h1>
      <h3 class="fw-normal text-muted mb-3">Search, Compare, Decide...</h3>
      <div class="d-flex gap-3 justify-content-center lead fw-normal">
        <a class="icon-link" href="#">
          Learn more
          <svg class="bi"></svg>
        </a>
     
        <Link to="/Search"> Search</Link>
      </div> */}
  
   

  
      
    
}

export default MiddleElement;