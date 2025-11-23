"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export default function ScrollProgressNav() {
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress (0 to 1) to percentage string (0% to 100%)
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-[#111]/80 backdrop-blur-md">
      {/* Progress Bar Background */}
      <motion.div 
        className="absolute top-0 left-0 bottom-0 bg-zinc-800/50 -z-10"
        style={{ width }}
      />
      
      <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between relative z-10">
        <Link href="/" className="text-xl font-black tracking-tighter hover:text-zinc-400 transition-colors text-white mix-blend-difference">
          ETHAN ZHANG
        </Link>
        <Link 
          href="/blog" 
          className="text-sm font-bold tracking-widest hover:text-yellow-400 transition-colors text-white mix-blend-difference"
        >
          BLOG
        </Link>
      </div>
    </nav>
  );
}
