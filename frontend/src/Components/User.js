// import React, { useState, useEffect, useRef } from "react";
// import { SlHome } from "react-icons/sl";
// import { FaAnglesRight } from "react-icons/fa6";
// import { IoLogIn } from "react-icons/io5";
// import { FaRegRegistered } from "react-icons/fa";
// import { useAuth } from "./AuthenticateContext";
// import{Link, useNavigate} from "react-router-dom";

// import "./styles.css";

// function User() {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const navigate=useNavigate();

//   const indicatorRef = useRef(null);
//   const listItemRefs = useRef([]);

//   const authContext=useAuth();

//   const isAuthenticated=authContext.authenticated;

//   console.log("Auth context",authContext);

//   useEffect(() => {
//     if (indicatorRef.current && listItemRefs.current[activeIndex]) {
//       const currentItem = listItemRefs.current[activeIndex];
//       indicatorRef.current.style.left = `${currentItem.offsetLeft}px`;
//       indicatorRef.current.style.width = `${currentItem.offsetWidth}px`;
//     }
//   }, [activeIndex]);

//   const handleItemClick = (index) => {
//     setActiveIndex(index);
//   };

//   const handleLogin=()=>{
//     navigate("/login");
//   }

//   const handleRegistration=()=>{

//       navigate("/register");
//   }
//   // const handleLogout(){

//   // }

//   const handleNavigation=(path)=>{

//       navigate(path);
//   }
//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "150px",
//         backgroundColor: "white",
//       }}
//     >
//       <div className="navigation" style={{ width: "100%", position: "relative",backgroundColor:"white" }}>
//         <ul
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             width: "100%",
//             padding: "0 20px",
//             listStyleType: "none",
//           }}
//         >
//           <div style={{ display: "flex" }}>
//             <li
//               ref={(el) => (listItemRefs.current[0] = el)}
//               className={`list ${activeIndex === 0 ? "active" : ""}`}
//               onClick={() => handleItemClick(0)}
//               style={{ cursor: "pointer", marginRight: "20px" }}
//             >
//               <a to="/" style={{ textDecoration: "none", color: "inherit" }}>
//                 <span className="icon"><SlHome /></span>
//                 <span onClick={() => handleNavigation("/")}  className="text">Home</span>
//               </a>
//             </li>
//             <li
//               ref={(el) => (listItemRefs.current[1] = el)}
//               className={`list ${activeIndex === 1 ? "active" : ""}`}
//               onClick={() => handleItemClick(1)}
//               style={{ cursor: "pointer", marginRight: "20px" }}
//             >








