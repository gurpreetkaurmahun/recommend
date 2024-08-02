import React from "react";
import { useState,useEffect } from "react";
import ReactConfetti from "react-confetti";
import Aos from"aos";
import 'aos/dist/aos.css';

function Confetti(){

   

    const [windowDimension,setWindowDimension]=useState({width:window.innerWidth,height:window.innerHeight});
    
    const[btn,setBtn]=useState(false);

    const detectSize=()=>{
        setWindowDimension({width:window.innerWidth,height:window.innerHeight});
    }

    useEffect(()=>{
        window.addEventListener('resize',detectSize);
        Aos.init({duration:2000});
        return ()=>{
            window.removeEventListener('resize',detectSize);
        }
    },[windowDimension]);

    return <div >

        {/* <button onClick={()=>setBtn(!btn)}> Confetti run</button> */}
       {/* {btn&&  */}
       <ReactConfetti
        width={windowDimension.width}
        height={windowDimension.height}
        tweenDuration={1000}
        /> 
     
        <h1 style={{position:"relative",marginLeft:300,marginTop:300}} data-aos="fade-right"> You have Sucessfully logged in</h1> */
        
    </div>
}

export default Confetti;