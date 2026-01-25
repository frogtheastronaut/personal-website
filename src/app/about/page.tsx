"use client";

import NavBar from "@/components/NavBar";
import HighlightText from "@/components/HighlightText";
import ProjectList from "@/components/ProjectList";
import { motion } from "framer-motion";

const PROJECTS = [
  {
    id: 1,
    title: "MooseOS",
    thumbnail: "https://hackaday.com/wp-content/uploads/2025/10/mooseos-main.png?w=800", 
    image: "https://hackaday.com/wp-content/uploads/2025/10/mooseos-main.png?w=800",
    description: "A x86 operating system written in C and Assembly from scratch. Features a multitasking kernel, custom filesystem, and basic drivers.",
    github: "https://github.com/appleroll/moose-os",
    additionalLinks: [{ label: "Hackaday Article", url: "https://hackaday.com/2025/10/14/c-project-turns-into-full-fledged-os/" }]
  }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen w-full bg-[#0a0a0a] text-[#ededed] font-mono selection:bg-[#2d2d2d] selection:text-[#ededed]">
      <NavBar />
      
      <div className="max-w-4xl mx-auto px-8 pt-32 pb-20">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="flex flex-col gap-16"
         >
            {/* Header */}
            <div className="border-b border-white/10 pb-8">
               <h1 className="text-6xl md:text-8xl font-caveat text-white mb-4">
                 About Me
               </h1>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 font-sans text-lg leading-relaxed text-gray-300">
               <div className="col-span-1 md:col-span-2 space-y-6">
                 <p>
                   I’m a computer science student passionate about creating innovative software. Over the past few years, I’ve worked on projects ranging from low-level operating systems to high-performance cybersecurity tools, exploring OS development, web development, AI, and cybersecurity. I aim to build software that not only performs and looks great but also delivers meaningful value to users.
                 </p>
               </div>

               {/* Sidebar / Stats */}
               <div className="col-span-1 flex flex-col gap-8 text-sm font-mono text-gray-400">
                  <div>
                    <h3 className="text-white mb-2 uppercase tracking-widest text-xs">Stack</h3>
                    <ul className="space-y-1">
                      <li>C</li>
                      <li>Python</li>
                        <li>GitHub</li>
                        <li>Huggingface</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white mb-2 uppercase tracking-widest text-xs">Connect</h3>
                    <ul className="space-y-1">
                       <li><a href="https://github.com/appleroll" className="hover:text-[#dd7878] transition-colors">GitHub</a></li>
                       <li><a href="mailto:ethanzhangyixuan@gmail.com" className="hover:text-[#dd7878] transition-colors">Email</a></li>
                    </ul>
                  </div>
               </div>
            </div>

            {/* Projects Section */}
            <div className="space-y-8 pt-8 border-t border-white/10">
               <h2 className="text-6xl font-caveat text-white">Selected Works</h2>
               <div className="w-full">
                 <ProjectList projects={PROJECTS} />
               </div>
            </div>

         </motion.div>
      </div>
    </main>
  );
}

