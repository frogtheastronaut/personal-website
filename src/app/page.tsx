"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "locomotive-scroll/dist/locomotive-scroll.css";

interface Experience {
  name: string;
  description: string;
}

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
    description: "MooseOS is a 32-bit, 80s-style operating system written in C, designed to run on QEMU, Bochs, or real hardware. It features a VGA 320x200 256-color graphics mode, a dock-based desktop interface, and full PS/2 keyboard and mouse support. The OS includes a complete IDT with 32 exception handlers, and built-in applications such as a terminal emulator, text editor, and file explorer. MooseOS also implements an audio system for tone generation, ATA disk read/write operations, and a real-time clock. It was featured on the front page of Hackaday.com.",
    github: "https://github.com/frogtheastronaut/moose-os",
    additionalLinks: [
      { label: "Hackaday", url: "https://hackaday.com/2025/10/14/c-project-turns-into-full-fledged-os/" },
    ]
  },
];

export default function Page() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const locomotiveScrollRef = useRef<LocomotiveScroll | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const colorBoxContainerRef = useRef<HTMLDivElement>(null);
  const projectsColorBoxRef = useRef<HTMLDivElement>(null);
  const contactColorBoxRef = useRef<HTMLDivElement>(null);
  const projectsScrollRef = useRef<HTMLDivElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectScrollPosition, setProjectScrollPosition] = useState(0);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B739', '#52B788', '#E76F51', '#2A9D8F'
  ];

  // Reusable function to create animated color box effect
  const createColorBoxAnimation = (containerRef: React.RefObject<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return null;

    const createColorBox = () => {
      const box = document.createElement('div');
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      box.style.position = 'absolute';
      box.style.left = '0';
      box.style.top = '0';
      box.style.width = '100%';
      box.style.height = '100%';
      box.style.backgroundColor = randomColor;
      box.style.borderRadius = '1rem';
      box.style.transform = 'translateX(-100%)';
      
      container.appendChild(box);

      // Animate the box
      gsap.to(box, {
        x: '100%',
        duration: 1.2,
        ease: 'power2.inOut',
        onComplete: () => {
          box.remove();
        }
      });
    };

    // Create initial box
    createColorBox();

    // Create new boxes at intervals
    const interval = setInterval(createColorBox, 2000);

    return interval;
  };

  // Initialize scratch canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const textContainer = textContainerRef.current;
    
    if (!canvas || !textContainer) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match text container
    const resizeCanvas = () => {
      const rect = textContainer.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Fill with black overlay
      ctx.fillStyle = '#4ECDC4';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Animated color boxes effect
  useEffect(() => {
    const interval = createColorBoxAnimation(colorBoxContainerRef);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [colors]);

  // Animated color boxes effect for projects section
  useEffect(() => {
    const interval = createColorBoxAnimation(projectsColorBoxRef);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [colors]);

  // Animated color boxes effect for contact section
  useEffect(() => {
    const interval = createColorBoxAnimation(contactColorBoxRef);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [colors]);

  // Scroll projects horizontally with arrows
  const scrollProjects = (direction: 'left' | 'right') => {
    const container = projectsScrollRef.current;
    if (!container) return;
    
    const scrollAmount = 500; // Adjust based on card width + gap
    const newPosition = direction === 'left' 
      ? Math.max(0, projectScrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, projectScrollPosition + scrollAmount);
    
    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    
    setProjectScrollPosition(newPosition);
  };

  // Check if we can scroll in either direction
  const canScrollLeft = projectScrollPosition > 0;
  const canScrollRight = projectsScrollRef.current 
    ? projectScrollPosition < (projectsScrollRef.current.scrollWidth - projectsScrollRef.current.clientWidth)
    : false;

  // Handle scratching
  const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !isScratching) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Use destination-out to erase the black overlay
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Calculate scratch progress
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++;
    }
    
    const progress = (transparentPixels / (pixels.length / 4)) * 100;
    setScratchProgress(Math.round(progress));
  };

  const handleRevealAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Animate the reveal
    gsap.to(canvas, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setScratchProgress(100);
      }
    });
  };

  useEffect(() => {

    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.overflow = '';
    }
    if (locomotiveScrollRef.current) {
      locomotiveScrollRef.current.start();
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Dynamically import Locomotive Scroll to avoid SSR issues
    let locomotiveScroll: any = null;
    
    const initLocomotiveScroll = async () => {
      const LocomotiveScroll = (await import('locomotive-scroll')).default;
      const scrollContainer = scrollContainerRef.current;
      
      if (scrollContainer) {
        locomotiveScroll = new LocomotiveScroll({
          el: scrollContainer,
          smooth: true,
          multiplier: 1,
          class: 'is-reveal',
        });

        locomotiveScrollRef.current = locomotiveScroll;

        // Sync Locomotive Scroll with ScrollTrigger
        locomotiveScroll.on('scroll', ScrollTrigger.update);

        // Tell ScrollTrigger to use these proxy methods for the scroll container
        ScrollTrigger.scrollerProxy(scrollContainer, {
          scrollTop(value) {
            if (arguments.length && locomotiveScroll) {
              locomotiveScroll.scrollTo(value, { duration: 0, disableLerp: true });
            }
            return locomotiveScroll ? locomotiveScroll.scroll.instance.scroll.y : 0;
          },
          scrollLeft(value) {
            if (arguments.length && locomotiveScroll) {
              return locomotiveScroll.scroll.instance.scroll.x;
            }
            return locomotiveScroll ? locomotiveScroll.scroll.instance.scroll.x : 0;
          },
          getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight
            };
          },
          pinType: scrollContainer.style.transform ? 'transform' : 'fixed'
        });

        // Update ScrollTrigger on Locomotive Scroll update
        locomotiveScroll.on('scroll', () => {
          ScrollTrigger.update();
        });

        // Refresh both ScrollTrigger and Locomotive Scroll after DOM changes
        ScrollTrigger.addEventListener('refresh', () => locomotiveScroll.update());
        ScrollTrigger.refresh();
        
        return locomotiveScroll;
      }
    };

    // Wait for Locomotive Scroll to initialize before setting up animations
    const setupAnimations = () => {
      // Navbar animation on scroll
      const navbar = document.querySelector('.navbar');
      if (navbar && scrollContainerRef.current) {
        gsap.to(navbar, {
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: '+=100',
            scrub: true,
            scroller: scrollContainerRef.current,
          },
          backdropFilter: 'blur(10px)',
        });
      }

      // Intro text animations
      gsap.from('.intro-text', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
      });

      gsap.from('.intro-subtitle', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out',
      });

      gsap.from('.intro-description', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.9,
        ease: 'power3.out',
      });

      // Experience section text animations with pop-up effect
      gsap.from('.experience-title', {
        scrollTrigger: {
          trigger: '.experience-title',
          start: 'top 90%',
          scroller: scrollContainerRef.current,
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'back.out(1.7)',
      });

      gsap.from('.experience-description', {
        scrollTrigger: {
          trigger: '.experience-description',
          start: 'top 90%',
          scroller: scrollContainerRef.current,
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.2,
        ease: 'back.out(1.7)',
      });

      gsap.from('.scratch-card-container', {
        scrollTrigger: {
          trigger: '.scratch-card-container',
          start: 'top 90%',
          scroller: scrollContainerRef.current,
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.4,
        ease: 'back.out(1.7)',
      });
    };

    // Initialize Locomotive Scroll then setup animations
    initLocomotiveScroll().then(() => {
      // Small delay to ensure Locomotive Scroll is fully ready
      setTimeout(() => {
        setupAnimations();
      }, 100);
    });

    // Cleanup
    return () => {
      if (locomotiveScrollRef.current) {
        locomotiveScrollRef.current.destroy();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element && locomotiveScrollRef.current) {
      locomotiveScrollRef.current.scrollTo(element, {
        duration: 1000,
        easing: [0.25, 0.0, 0.35, 1.0],
      });
    }
  };

  return (
    <>
      <nav className="navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-70 transition-opacity">
            ETHAN ZHANG
          </Link>
          
          <div className="flex items-center gap-12 text-sm font-small tracking-wider">
            <button 
              onClick={() => scrollToSection('projects')} 
              className="hover:opacity-70 transition-opacity"
            >
              PROJECTS
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="hover:opacity-70 transition-opacity"
            >
              CONTACT
            </button>
            <Link 
              href="/blog" 
              className="hover:opacity-70 transition-opacity"
            >
              BLOG
            </Link>
          </div>
        </div>
      </nav>

      <div ref={scrollContainerRef} className="relative" data-scroll-container>
        <main className="min-h-screen w-full">
        {/* First Section - Title with colorful box */}
        <section className="min-h-screen flex flex-col justify-center items-center px-8 relative">
          <div className="absolute inset-0 top-[80px] left-0 right-0 bottom-0">
            <div 
              ref={colorBoxContainerRef}
              className="relative w-full h-full overflow-hidden opacity-90"
            />
          </div>

          <h1 className="intro-text text-6xl font-bold leading-tight relative z-10 text-center px-12 py-8">
            CODING THE FUTURE
            <br />
            <span className="intro-subtitle">CONTRIBUTING TO THE PAST.</span>
          </h1>
        </section>

        {/* Second Section - About */}
        <section className="min-h-screen flex items-center px-8 max-w-7xl mx-auto">
          <div className="flex gap-12 w-full items-center">
            {/* Left side - Text */}
            <div className="w-1/2">
              <div className="intro-description space-y-6 text-lg leading-relaxed opacity-80">
                <p>
                  I'm <span className="text-accent">Ethan Zhang</span>. I'm not just a high-school coding enthusiast, I'm <span className="text-accent">leading the next generation of software development</span>, one commit at a time.<br></br><br></br>
                  Click and drag on the box to the right to learn more about my experience with computer science.
                </p>
              </div>
            </div>

            {/* Right side - Scratch Card */}
            <div className="w-1/2 space-y-4 ml-50">
              <div className="scratch-card-container relative w-[500px] h-[350px] ">
                {/* Text content underneath */}
                <div 
                  ref={textContainerRef}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-lg w-[500px] h-[350px]"
                >
                  <div className="space-y-6">
                    Fluent in <span className="text-accent">Rust</span> and <span className="text-accent">Python</span>, is comfortable with <span className="text-accent">C</span> and <span className="text-accent">C#</span>. <br></br>
                    I don't just specialise in a single area of computer science; I thrive across multiple domains including <span className="text-accent">operating system development</span>, <span className="text-accent">game creation</span>, <span className="text-accent">machine learning</span>, and <span className="text-accent">quantum computing</span>.<br></br><br></br>
                    I am also a frequent contributor to open source projects.
                  </div>
                </div>

                {/* Scratch canvas overlay */}
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-[500px] h-[350px] cursor-crosshair rounded-2xl"
                  onMouseDown={() => setIsScratching(true)}
                  onMouseUp={() => setIsScratching(false)}
                  onMouseLeave={() => setIsScratching(false)}
                  onMouseMove={scratch}
                  onTouchStart={() => setIsScratching(true)}
                  onTouchEnd={() => setIsScratching(false)}
                  onTouchMove={scratch}
                />
              </div>

              {/* Progress and reveal text */}
              <div className="text-sm opacity-60 text-center mr-20">
                Revealed: {scratchProgress}% • Can't be bothered? <a onClick={handleRevealAll} className="text-blue-500 hover:underline cursor-pointer">Reveal all</a>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section - Apple-style horizontal scroll */}
        <section id="projects" className="h-[20vh] overflow-hidden relative flex items-center justify-center">
          <div className="absolute inset-0">
            <div 
              ref={projectsColorBoxRef}
              className="relative w-full h-full overflow-hidden opacity-90"
            />
          </div>

          <h2 className="text-4xl font-bold relative z-10">My Projects</h2>
        </section>

        {/* Projects Carousel */}
        <section className="py-20 relative">
          <div className="relative max-w-7xl mx-auto px-8">
            {/* Left Arrow - only show if can scroll left */}
            {canScrollLeft && (
              <button
                onClick={() => scrollProjects('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200"
                aria-label="Scroll left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Right Arrow - only show if can scroll right */}
            {canScrollRight && (
              <button
                onClick={() => scrollProjects('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200"
                aria-label="Scroll right"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            <div 
              ref={projectsScrollRef}
              className="flex gap-8 overflow-x-hidden scroll-smooth pb-8 px-16"
            >
              {PROJECTS.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="flex-shrink-0 w-[500px] cursor-pointer group"
                >
                  <div className="relative overflow-hidden rounded-3xl shadow-lg transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-[375px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-2xl font-bold">{project.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="h-[20vh] overflow-hidden relative flex items-center justify-center mb-30">
          <div className="absolute inset-0">
            <div 
              ref={contactColorBoxRef}
              className="relative w-full h-full overflow-hidden opacity-90"
            />
          </div>
          <h2 className="text-5xl font-bold relative z-10">Let's Connect</h2>
        </section>

        {/* Footer Section */}
        <section className="flex items-center px-8 max-w-7xl mx-auto">
          <div className="flex gap-12 w-full items-center">
            {/* Left side - Text */}
            <div className="w-1/2">
              <div className="space-y-6 text-lg leading-relaxed opacity-80">
                <p>
                  Whether you have a project in mind, want to collaborate, or just want to say hi, feel free to reach out! I'm always open to new opportunities and connections. You can also check my blog for my latest thoughts and projects.
                </p>
              </div>
            </div>

            {/* Right side - Links */}
            <div className="w-1/2 space-y-4 ml-50">
              <div className="space-y-6 text-lg leading-relaxed opacity-80">
                <div className="flex flex-col gap-4">
                  <a
                    href="https://github.com/frogtheastronaut"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg hover:text-blue-600 transition-colors duration-150"
                  >
                    GitHub
                  </a>
                  <a
                    href="mailto:ethanzhangyixuan@gmail.com"
                    className="text-lg hover:text-blue-600 transition-colors duration-150"
                  >
                    Email
                  </a>
                  <a
                    href="/blog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg hover:text-blue-600 transition-colors duration-150"
                  >
                    Blog
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Copyright Footer */}
        <section className="py-7 max-w-7xl mx-auto">
          <div className="text-sm opacity-60 text-center">
            <p>
              Ethan Zhang, 2025. <a href="https://github.com/frogtheastronaut/personal-website" className="underline hover:opacity-80">See Page Source</a>
            </p>
          </div>
        </section>
      </main>
      </div>

      {/* Project Modal - Outside scroll container, fixed to viewport */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="bg-white text-gray-900 rounded-3xl max-w-3xl w-full mx-4 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 transition-all duration-200 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Project image */}
            <div className="relative">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-[400px] object-cover"
              />
            </div>

            <div className="p-8">
              <h2 className="text-4xl font-bold mb-4">{selectedProject.title}</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">{selectedProject.description}</p>

              {/* Action buttons */}
              <div className="flex gap-4 flex-wrap">
                {selectedProject.github && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-full transition-all duration-200 font-medium flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                )}
                
                {selectedProject.additionalLinks?.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-200 font-medium"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
