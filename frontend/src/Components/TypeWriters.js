import React from "react";
import TypeWriter from "typewriter-effect";
import {Link} from "react-router-dom";
import { LiaSearchSolid } from "react-icons/lia";
<LiaSearchSolid />

function TypeWriters({topString,bottomString,link,buttonText}){
    return(
        <div className="Typewriter"   >
                <h1 style={{textAlign:"center",display:"flex",alignItems:"center",color:"white",fontSize:"110px",marginLeft:100,marginTop:"20%"}}>

                    <TypeWriter
                    options={{
                        autoStart:true,
                        loop:true,
                        delay:150,
                        strings:[topString]

                    }}
                    />
                </h1>
                <h1 style={{color:"white"}}>{bottomString}</h1>
                <button style={{width:200,background:"transparent"}}> <Link to={link} style={{textDecoration:"none",color:"white"}}> {buttonText} <span style={{color:"white",fontSize:"20px",fontWeight:"bold"}}><LiaSearchSolid />
</span></Link></button>
                

        </div>
    )
}

export default TypeWriters;