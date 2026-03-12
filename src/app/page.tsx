"use client";

import DuckieScene from "@/components/DuckieScene";
import NavBar from "@/components/NavBar";
import { motion } from "framer-motion";
import HighlightText from "@/components/HighlightText";


export default function Page() {
  return (
    <main className="h-screen w-full bg-[#0a0a0a] text-[#ededed] overflow-hidden flex flex-col font-mono selection:bg-[#2d2d2d] selection:text-[#ededed]">
      
      <NavBar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center max-w-7xl mx-auto w-full px-8 md:px-16 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full items-center">
          
          {/* Left Text */}
          <div className="flex flex-col justify-center gap-6 z-10 order-2 md:order-1">
             <div className="text-6xl md:text-8xl font-caveat font-semibold text-white -ml-1">
                <HighlightText text="Ethan Zhang" delay={0.2} />
             </div>
             
             <div className="max-w-md text-gray-400 leading-relaxed text-sm md:text-base font-sans">
                <HighlightText 
                  text="High-school software enthusiast and AI researcher exploring everything from low-level systems to cutting-edge ML applications."
                  delay={0.8}
                />
             </div>
          </div>

          {/* Right 3D Model */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, delay: 0.2 }}
             className="h-[40vh] md:h-full w-full flex items-center justify-center relative order-1 md:order-2"
          >
             <div className="absolute inset-0">
                <DuckieScene />
             </div>
          </motion.div>
          
        </div>
      </div>
    </main>
  );
}
