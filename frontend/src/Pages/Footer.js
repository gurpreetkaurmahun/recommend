import { FiArrowRightCircle } from "react-icons/fi";

function Footer(){
    return (<div style={{background: "linear-gradient(45deg, #f321bf, #ebe1e4)",}}>
        <footer class="pt-4 my-md-5 pt-md-5 " >
    <div class="row">
      <div className="newsletter" style={{height:300,marginTop:"-50px",position:"relative",marginBottom:50}}>
            <h2 style={{marginTop:100}}>Subscribe to our Newsletter</h2>
            <p>Get information about exclusive offers </p>
            <div >
  <input type="text" placeholder="Enter Your Email" style={{width:400,borderRadius:"20px",height:"45px",border:"none"}}/>
  <button type="button" className="searchButton" ><span style={{fontSize:"25px",marginBottom:"20px"}}> <FiArrowRightCircle /> </span> </button>
 
</div>
<hr style={{marginTop:100}}></hr>
      </div>
      <div class="col-12 col-md">
        <img class="mb-2" src="/docs/5.3/assets/brand/bootstrap-logo.svg" alt="" width="24" height="19"/>
        <small class="d-block mb-3 text-body-secondary">© 2017–2024</small>
      </div>
     
      <div class="col-6 col-md">
        <h5>Recommend....</h5>
        <ul class="list-unstyled text-small">
          <li class="mb-1"><a class="link-secondary text-decoration-none" href="#">Resource</a></li>
          <li class="mb-1"><a class="link-secondary text-decoration-none" href="#">Resource name</a></li>
          <li class="mb-1"><a class="link-secondary text-decoration-none" href="#">Another resource</a></li>
          <li class="mb-1"><a class="link-secondary text-decoration-none" href="#">Final resource</a></li>
        </ul>
      </div>
     

      <hr style={{marginTop:100}}></hr>
      <div  style={{position:"relative"}}>
        <p className="footerPara" >Copyright 2024 Recommend</p>
        <button    className="animatedButton footerButton" > <a href="#top" style={{position:"relative",bottom:"10px",textDecoration:"none",color:"white"}}>To the top</a></button>
      </div>
    </div>
  </footer>
    </div>)
}

export default Footer;