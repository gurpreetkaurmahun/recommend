import React from "react";
import { useEffect } from "react";


function Spinner({heading,value}){

    useEffect(() => {
        // Ensure bootstrap is available in the global scope
        if (typeof window !== 'undefined' && window.bootstrap) {
          const toastElement = document.querySelector('.toast');
          if (toastElement) {
            const toast = new window.bootstrap.Toast(toastElement);
            toast.show();
          }
        }
      }, []);
  return(
<div style={{
  position:"fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 1050,
  height:500,
  width:500
}}>
    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-header">
    <img src="..." class="rounded me-2" alt="..."/>
    <strong class="me-auto">recommend......</strong>
    <small>11 mins ago</small>
    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
  <div class="toast-body">
   {heading}
  </div>
  <div className="spinner-content">
      
        <div className="spinner-border text-success" role="status">
         
        </div>
      </div>
</div></div>
  )
  
}

export default Spinner;