"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Github, ExternalLink, X } from "lucide-react";

interface Project {
  id: number;
  title: string;
  thumbnail: string;
  image: string;
  description: string;
  github?: string;
  additionalLinks?: { label: string; url: string }[];
}

export default function ProjectList({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedProject]);

  return (
    <div className="w-full py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <motion.div
            layoutId={`card-container-${project.id}`}
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="group relative aspect-[4/5] cursor-pointer bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-colors"
            whileHover={{ y: -10 }}
          >
            {/* Image Background */}
            <motion.div layoutId={`card-image-${project.id}`} className="absolute inset-0">
               <img src={project.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </motion.div>

            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
               <motion.h3 layoutId={`card-title-${project.id}`} className="text-3xl font-bold text-white mb-2">{project.title}</motion.h3>
               <p className="text-zinc-400 line-clamp-2 mb-4">{project.description}</p>
               <div className="flex items-center gap-2 text-yellow-400 font-mono text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">
                  View Details <ArrowUpRight size={16} />
               </div>
            </div>
          </motion.div>
        ))}
        
        {/* Coming Soon Card */}
        <div className="aspect-[4/5] rounded-2xl border border-zinc-800 border-dashed flex flex-col items-center justify-center text-center p-8 opacity-50 hover:opacity-100 transition-opacity">
            <h3 className="text-2xl font-bold text-zinc-500 mb-2">More Coming Soon</h3>
            <p className="text-zinc-600">I'm always building.</p>
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setSelectedProject(null)}
               className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 cursor-pointer"
            />
            <div className="fixed inset-0 z-[51] flex items-center justify-center pointer-events-none p-4 md:p-10">
               <motion.div
                  layoutId={`card-container-${selectedProject.id}`}
                  className="w-full max-w-5xl max-h-[90vh] bg-[#111] rounded-3xl overflow-hidden border border-zinc-800 flex flex-col md:flex-row pointer-events-auto shadow-2xl relative"
               >
                  <button onClick={(e) => { e.stopPropagation(); setSelectedProject(null); }} className="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full text-white hover:bg-white hover:text-black transition-colors">
                    <X size={24} />
                  </button>

                  {/* Image Side */}
                  <motion.div layoutId={`card-image-${selectedProject.id}`} className="w-full md:w-1/2 h-[40vh] md:h-auto relative">
                     <img src={selectedProject.thumbnail} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#111] md:bg-gradient-to-r md:from-transparent md:to-[#111]" />
                  </motion.div>

                  {/* Content Side */}
                  <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
                     <motion.h3 layoutId={`card-title-${selectedProject.id}`} className="text-5xl md:text-7xl font-black text-white mb-6 leading-none">{selectedProject.title}</motion.h3>
                     
                     <div className="space-y-6 text-lg text-zinc-400 leading-relaxed mb-12">
                        <p>{selectedProject.description}</p>
                     </div>

                     <div className="mt-auto flex flex-wrap gap-4">
                        {selectedProject.github && (
                           <Link href={selectedProject.github} target="_blank" className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-yellow-400 transition-colors flex items-center gap-2">
                              <Github size={20} /> GitHub
                           </Link>
                        )}
                        {selectedProject.additionalLinks?.map((link, i) => (
                           <Link key={i} href={link.url} target="_blank" className="px-8 py-4 border border-zinc-700 text-white rounded-full font-bold hover:bg-zinc-800 transition-colors flex items-center gap-2">
                              <ExternalLink size={20} /> {link.label}
                           </Link>
                        ))}
                     </div>
                  </div>
               </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
