import Hero3D from "@/components/Hero3D";
import ProjectList from "@/components/ProjectList";
import RecentPosts from "@/components/RecentPosts";
import SmoothScroll from "@/components/SmoothScroll";
import About from "@/components/About";
import ScrollIndicator from "@/components/ScrollIndicator";
import Link from "next/link";
import { ArrowRight, Github, Mail, Linkedin } from "lucide-react";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

interface Project {
  id: number;
  title: string;
  thumbnail: string;
  image: string;
  description: string;
  github?: string;
  additionalLinks?: { label: string; url: string }[];
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "MooseOS",
    thumbnail: "https://cdn.hackaday.io/images/8639311760131931360.png",
    image: "https://cdn.hackaday.io/images/5946621760132013463.png",
    description: "32-bit, 80s-style operating system written in C, designed to run on QEMU, Bochs, or real hardware. It features a VGA 320x200 256-color graphics mode, a dock-based desktop interface, and full PS/2 keyboard and mouse support. The OS includes a complete IDT with 32 exception handlers, and built-in applications such as a terminal emulator, text editor, and file explorer. MooseOS also implements an audio system for tone generation, ATA disk read/write operations, and a real-time clock. It was featured on the front page of Hackaday.com.",
    github: "https://github.com/frogtheastronaut/moose-os",
    additionalLinks: [
      { label: "Hackaday", url: "https://hackaday.com/2025/10/14/c-project-turns-into-full-fledged-os/" },
    ]
  },
];

async function getRecentPosts() {
  if (!STRAPI_URL) return [];
  try {
    const res = await fetch(`${STRAPI_URL}/api/posts?sort=publishDate:desc&pagination[limit]=3`, { 
      next: { revalidate: 60 } 
    });
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch posts", error);
    return [];
  }
}

export default async function Page() {
  const recentPosts = await getRecentPosts();

  return (
    <main className="bg-[#111] min-h-screen text-white selection:bg-yellow-400 selection:text-black">
      <SmoothScroll />
      
      {/* Hero Section */}
      <section className="relative h-screen w-full flex flex-col justify-center overflow-hidden">
        <Hero3D />
        
        <div className="relative z-10 w-full max-w-[95vw] mx-auto pointer-events-none">
          <div className="pointer-events-auto">
            <div className="mb-8">
              <h1 className="text-[15vw] leading-[0.8] font-black tracking-tighter text-white mix-blend-difference select-none">
                ETHAN
              </h1>
              <div className="flex items-center gap-8">
                <h1 className="text-[15vw] leading-[0.8] font-black tracking-tighter text-zinc-800 select-none">
                  ZHANG
                </h1>

              </div>
                  <p className="text-xl text-white font-medium z-10 mx-4">
                    Software enthusiast<br/>
                  </p>
            </div>
          </div>
        </div>
        
        <ScrollIndicator />
      </section>

      {/* About Section */}
      <About />

      {/* Projects Section */}
      <section id="projects" className="py-16 md:py-32 bg-[#111]">
        <div className="w-full">
          <div className="mb-12 md:mb-20 max-w-7xl mx-auto px-4 md:px-8 flex items-end justify-between border-b border-zinc-800 pb-8">
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white uppercase">PROJECTS</h2>
          </div>
          
          <ProjectList projects={PROJECTS} />
        </div>
      </section>

      {/* Recent Posts Section */}
      <RecentPosts posts={recentPosts} />

      {/* Contact / Footer */}
      <footer className="py-32 px-8 bg-white text-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                LET'S<br/>TALK
              </h2>
              <div className="flex gap-4">
                <a href="mailto:ethanzhangyixuan@gmail.com" className="px-8 py-4 bg-black text-white rounded-full font-bold text-xl hover:bg-yellow-400 hover:text-black transition-colors">
                  Email Me
                </a>
                <a href="https://github.com/frogtheastronaut" target="_blank" className="px-8 py-4 border-2 border-black rounded-full font-bold text-xl hover:bg-black hover:text-white transition-colors">
                  GitHub
                </a>
              </div>
            </div>
            
            <div className="flex flex-col justify-end items-start md:items-end">
              <p className="text-2xl font-bold mb-4">Based in the Internet.</p>
              <p className="text-zinc-500">© {new Date().getFullYear()} Ethan Zhang.</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
