import React from "react";
import TypeWriter from "typewriter-effect";
import {Link} from "react-router-dom";
import { LiaSearchSolid } from "react-icons/lia";
<LiaSearchSolid />

function TypeWriters({topString,bottomString,link,buttonText}){
    return(
        <div className="Typewriter"   >
                <h1 className="h1Top">

                    <TypeWriter
                    options={{
                        autoStart:true,
                        loop:true,
                        delay:150,
                        strings:[topString]

                    }}
                    />
                </h1>
                <h1 className="h1bottom"style={{color:"white"}}>{bottomString}</h1>
                <button className="typeButton"> <Link to={link} style={{textDecoration:"none",color:"white"}}> {buttonText} 
                <span ><LiaSearchSolid /></span></Link>
                </button>
                
        </div>
    )
}

export default TypeWriters;