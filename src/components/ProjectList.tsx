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
    <div className="w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {projects.map((project) => (
          <motion.div
            layoutId={`card-container-${project.id}`}
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="group relative aspect-video cursor-pointer bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-colors"
            whileHover={{ y: -5 }}
          >
            {/* Image Background */}
            <motion.div layoutId={`card-image-${project.id}`} className="absolute inset-0">
               <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </motion.div>

            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
               <motion.h3 layoutId={`card-title-${project.id}`} className="text-2xl md:text-3xl font-bold text-white mb-2">{project.title}</motion.h3>
               <p className="text-zinc-400 line-clamp-2 mb-4 text-sm md:text-base">{project.description}</p>
               <div className="flex items-center gap-2 text-[#dd7878] font-mono text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">
                  View Details <ArrowUpRight size={16} />
               </div>
            </div>
          </motion.div>
        ))}
        
        {/* Coming Soon Card */}
        <div className="aspect-video rounded-2xl border border-zinc-800 border-dashed flex flex-col items-center justify-center text-center p-8 opacity-50 hover:opacity-100 transition-opacity">
            <h3 className="text-xl font-bold text-zinc-500 mb-2">More Coming Soon</h3>
            <p className="text-sm text-zinc-600">I'm always building.</p>
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
            <div className="fixed inset-0 z-[51] flex items-center justify-center pointer-events-none p-4 md:p-8">
               <motion.div
                  layoutId={`card-container-${selectedProject.id}`}
                  className="w-full max-w-6xl max-h-[85vh] bg-[#111] rounded-3xl overflow-hidden border border-zinc-800 flex flex-col md:flex-row pointer-events-auto shadow-2xl relative"
               >
                  <button onClick={(e) => { e.stopPropagation(); setSelectedProject(null); }} className="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full text-white hover:bg-white hover:text-black transition-colors">
                    <X size={24} />
                  </button>

                  {/* Image Side */}
                  <motion.div layoutId={`card-image-${selectedProject.id}`} className="w-full md:w-3/5 h-[40vh] md:h-auto relative">
                     <img src={selectedProject.thumbnail} alt={selectedProject.title} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#111] md:bg-gradient-to-r md:from-transparent md:to-[#111]" />
                  </motion.div>

                  {/* Content Side */}
                  <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col overflow-y-auto">
                     <motion.h3 layoutId={`card-title-${selectedProject.id}`} className="text-4xl md:text-5xl font-black text-white mb-6 leading-none">{selectedProject.title}</motion.h3>
                     
                     <div className="space-y-6 text-base text-zinc-400 leading-relaxed mb-12">
                        <p>{selectedProject.description}</p>
                     </div>

                     <div className="mt-auto flex flex-wrap gap-4">
                        {selectedProject.github && (
                           <Link href={selectedProject.github} target="_blank" className="px-6 py-3 bg-white text-black rounded-full font-bold text-sm hover:bg-[#dd7878] hover:text-white transition-colors flex items-center gap-2">
                              <Github size={18} /> GitHub
                           </Link>
                        )}
                        {selectedProject.additionalLinks?.map((link, i) => (
                           <Link key={i} href={link.url} target="_blank" className="px-6 py-3 border border-zinc-700 text-white rounded-full font-bold text-sm hover:bg-zinc-800 transition-colors flex items-center gap-2">
                              <ExternalLink size={18} /> {link.label}
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
