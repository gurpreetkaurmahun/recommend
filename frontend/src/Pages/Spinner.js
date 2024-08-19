import { useState } from "react";
import { css } from "@emotion/react";
import CircleLoader from "react-spinners/CircleLoader";
import BeatLoader from "react-spinners/BeatLoader";

// Correct the CSS syntax
const circleLoaderOverride = css`
  display: block;
  margin: 20px auto;
  border-color: red;
`;

const beatLoaderOverride = css`
  display: block;
  margin: 20px auto;
  border-color: red;
`;

function Spinner({ heading, value }) {
  let [loading, setLoading] = useState(true);

  return (
    <div
      className="sweet-loading"
      style={{
       
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border:"1px solid rgba(0, 0, 0, 0.2)",
        backgroundColor:"rgba(0, 0, 0, 0.0)",
        width: 600,
        height: 300,
        borderRadius: "20px ",
        boxSizing: "border-box",
        filter: "drop-shadow(0 0 5px rgba(0, 0, 0, 0.5))"
      }}
    >
      <nav class="navbar bg-body-tertiary" style={{position:"relative",top:"-18px",backgroundColor:"red",borderRadius: "20px "}}>
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Recommend...</a>
      </div>
    </nav>
      <h3 style={{marginBottom:20}}>Searching Products</h3>

      <CircleLoader
        color="black"
        loading={loading}
        size={150}
        css={circleLoaderOverride}
      
        // Inline style for margin-bottom
        aria-label="Loading Spinner"
        data-testid="loader"
      />
{/* 
      <BeatLoader
        color="#7D0DC3"
        css={beatLoaderOverride}
        loading={loading}
        size={15}
        aria-label="Loading Spinner"
        data-testid="loader"
      /> */}
    </div>
  );
}

export default Spinner;



//     useEffect(() => {
//         // Ensure bootstrap is available in the global scope
//         if (typeof window !== 'undefined' && window.bootstrap) {
//           const toastElement = document.querySelector('.toast');
//           if (toastElement) {
//             const toast = new window.bootstrap.Toast(toastElement);
//             toast.show();
//           }
//         }
//       }, []);
//   return(
// <div style={{
//   position:"fixed",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   zIndex: 1050,
//   height:500,
//   width:500
// }}>
//     <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
//   <div class="toast-header">
//     <img src="..." class="rounded me-2" alt="..."/>
//     <strong class="me-auto">recommend......</strong>
//     <small>11 mins ago</small>
//     <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
//   </div>
//   <div class="toast-body">
//    {heading}
//   </div>
//   <div className="spinner-content">
      
//         <div className="spinner-border text-success" role="status">
         
//         </div>
//       </div>
// </div></div>
//   )
  
