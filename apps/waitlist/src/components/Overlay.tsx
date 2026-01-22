"use client";

import type React from "react";
import Confetti from 'react-confetti'
import { useWindowSize } from "react-use";
import { motion as m } from "framer-motion";
const index:React.FC=()=>{
    const { width, height } = useWindowSize();

    

    return(
        <div className="overflow-hidden w-full h-full z-20 fixed flex justify-center flex-col items-center text-center top-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.7),rgba(0,0,0,0.7))]">
            <Confetti   width={width}
      height={height}
      recycle={true}
      numberOfPieces={300}/>
            <m.h1 initial={{ opacity:0,y:50}} animate={{ opacity:1,y:0,transition:{
          duration:0.3,
          damping:20,
          type: "spring",
        stiffness: 300,
      
        }}}  className="text-5xl font-bold">You’ve successfully joined <br />the waitlist ;)</m.h1>
        </div>
    )
}

export default index;