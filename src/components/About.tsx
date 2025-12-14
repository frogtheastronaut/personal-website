"use client";

import { motion } from "framer-motion";



function StickySection({ number, title, children, align = 'left' }: { number: string, title: string, children: React.ReactNode, align?: 'left' | 'right' }) {
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 mb-32 last:mb-0">
      {/* Sticky Number & Title - Left Aligned */}
      {align === 'left' && (
        <div className="md:col-span-4 relative hidden md:block">
          <div className="sticky top-32">
            <span className="text-9xl font-black text-zinc-900 stroke-text block mb-4 select-none" style={{ WebkitTextStroke: "2px #333" }}>{number}</span>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">{title}</h2>
          </div>
        </div>
      )}

      {/* Mobile Title */}
      <div className="md:hidden col-span-1 mb-8">
         <span className="text-6xl font-black text-zinc-800 block mb-2">{number}</span>
         <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{title}</h2>
      </div>
      
      {/* Content */}
      <div className="md:col-span-8 pt-8 md:pt-32">
        {children}
      </div>

      {/* Sticky Number & Title - Right Aligned */}
      {align === 'right' && (
        <div className="md:col-span-4 relative hidden md:block">
          <div className="sticky top-32 text-right">
            <span className="text-9xl font-black text-zinc-900 block mb-4 select-none" style={{ WebkitTextStroke: "2px #333" }}>{number}</span>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">{title}</h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default function About() {
  return (
    <section className="relative py-16 md:py-32 px-4 md:px-8 bg-[#111]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section 01: Profile */}
        <StickySection number="01" title="WHO AM I" align="right">
          <div className="space-y-8 md:space-y-12">
            <h3 className="text-4xl md:text-7xl font-black leading-[0.9] text-white tracking-tighter">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">EXPLORING</span> THE WORLD OF SOFTWARE
            </h3>
            <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed max-w-2xl font-medium">
I'm a 15-year-old software developer focused on systems programming and emerging technologies. I build projects that deepen my understanding, and I share my work openly so others in the community can learn from it.<br /> <br />I believe that software should not just be functional, but also elegant and inspiring.
            </p>
          </div>  
        </StickySection>

        {/* Quote Section */}
        <div className="py-32 md:py-60 flex justify-center items-center overflow-hidden">
             <h2 className="text-[10vw] md:text-[8vw] font-black text-center leading-[0.8] tracking-tighter text-white select-none hover:text-zinc-300 transition-colors duration-500 cursor-default">
                "CODE SHOULD BE A FORM OF ART."
             </h2>
        </div>

        <StickySection number="02" title="WHAT I DO" align="left">
          <div className="space-y-12">
            <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed max-w-2xl font-medium">
My work focuses low-level system development, machine learning, and quantum computing. I also build games and creative software because not everything has to be serious — sometimes the best ideas come from experimenting and having fun.
            </p>
          </div>
        </StickySection>

      </div>
    </section>
  );
}
