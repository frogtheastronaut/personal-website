
"use client";
import Head from "next/head";
import DuckThree from "./three";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Classes
const heading = "animated-text font-extrabold drop-shadow-lg w-[90vw] max-w-[90vw] mx-auto text-center font-[Fira_Mono,Menlo,monospace]";
const description = "animated-text text-xl text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-blue-200 leading-relaxed text-left w-full max-w-lg font-[Fira_Mono,Menlo,monospace]";
const section = "w-full max-w-6xl py-20 flex flex-col items-center gap-12";
const image = "rounded-3xl w-full max-w-2xl object-cover";
const container = "flex flex-row w-full max-w-6xl items-center justify-center gap-24 relative";
const main = "min-h-screen w-full bg-[#232634] flex flex-col items-center justify-center font-[Fira_Mono,Menlo,monospace]";

// Section component
type SectionProps = {
  headingLevel?: 1 | 2;
  headingText: string;
  paragraph: { intro: string; body: React.ReactNode };
  imgRef: React.RefObject<HTMLImageElement | null>;
  imgSrc: string;
  imgAlt: string;
  imgCaption?: string;
  reverse?: boolean;
  sectionRef?: React.RefObject<HTMLElement | null>;
};

function Section({ headingLevel = 2, headingText, paragraph, imgRef, imgSrc, imgAlt, reverse = false, sectionRef }: SectionProps) {
  const HeadingTag = headingLevel === 1 ? "h1" : "h2";
  return (
    <section ref={sectionRef} className={section + " mx-auto"}>
      <div className="w-full flex justify-center">
        <HeadingTag className={heading + (headingLevel === 1 ? " text-6xl" : " text-5xl") } style={{ color: '#c6d0f5' }}>
          <span style={{ borderRight: "2px solid #c6d0f5", paddingRight: "2px" }}>{headingText}</span>
        </HeadingTag>
      </div>
      <div className="w-full flex justify-center mb-4">
        <div className="w-[90vw] max-w-[90vw]">
          <p className="animated-text text-2xl text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-blue-200 leading-relaxed text-center w-full font-[Fira_Mono,Menlo,monospace]">
            {paragraph.intro}
          </p>
        </div>
      </div>
      <div className={container}>
        {!reverse && (
          <div className="flex-1 flex items-center justify-end z-10 pr-16 flex-shrink-0 flex-grow-0">
            <p className={description} style={{ minWidth: '24em', maxWidth: '24em', display: 'inline-block' }}>
              {paragraph.body}
            </p>
          </div>
        )}
        <div className="relative z-0 flex flex-col items-center">
          <img
            ref={imgRef}
            src={imgSrc}
            alt={imgAlt}
            className={image}
            style={{ zIndex: 0, boxShadow: '0px 0px 64px 0px rgba(255,255,255,0.25)' }}
          />
          {imgAlt && (
            <div className="w-full max-w-2xl mt-6 text-blue-200 text-center text-base font-mono">
              {imgAlt}
            </div>
          )}
        </div>
        {reverse && (
          <div className="flex-1 flex items-center justify-start z-10 pl-16 flex-shrink-0 flex-grow-0">
            <p className={description} style={{ minWidth: '24em', maxWidth: '24em', display: 'inline-block' }}>
              {paragraph.body}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function Page() {
  const [typedHeadings, setTypedHeadings] = useState(["", "", ""]);
  const headings = [
    "Hi. I'm Ethan",
    "About Me",
    "Projects I've Made"
  ];
  const sectionRefs = [useRef<HTMLElement>(null), useRef<HTMLElement>(null), useRef<HTMLElement>(null)];
  const imgRefs = [useRef<HTMLImageElement>(null), useRef<HTMLImageElement>(null), useRef<HTMLImageElement>(null)];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // GSAP ANIMATIONS
    sectionRefs.forEach((ref) => {
      if (ref.current) {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: 60, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 85%",
              end: "bottom 50%",
              scrub: 0.4,
            },
          }
        );
      }
    });

    // Typing effect
    sectionRefs.forEach((ref, i) => {
      if (ref.current) {
        ScrollTrigger.create({
          trigger: ref.current,
          start: "top 85%",
          onEnter: () => {
            let hIdx = 0;
            setTypedHeadings((prev) => {
              const updated = [...prev];
              updated[i] = "";
              return updated;
            });
            const interval = setInterval(() => {
              setTypedHeadings((prev) => {
                const updated = [...prev];
                updated[i] = headings[i].slice(0, hIdx + 1);
                return updated;
              });
              hIdx++;
              if (hIdx >= headings[i].length) clearInterval(interval);
            }, 60);
          },
        });
      }
    });

    imgRefs.forEach((ref) => {
      if (ref.current) {
        gsap.fromTo(
          ref.current,
          { scale: 0.85, opacity: 0, y: 80 },
          {
            scale: 1.12,
            opacity: 1,
            y: 0,
            boxShadow: "0px 16px 48px #000c",
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 95%",
              end: "bottom 50%",
              scrub: 0.7,
            },
          }
        );
        // Image warp
        const warp = (e: MouseEvent) => {
          if (!ref.current) return;
          const rect = (ref.current as HTMLElement).getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
          const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
          gsap.to(ref.current, {
            rotateY: x * 24,
            rotateX: -y * 24,
            scale: 1.18,
            boxShadow: `0px ${y * 48}px ${Math.abs(x * 48)}px rgb(188, 192, 204)`,
            duration: 0.3,
            ease: "power3.out",
          });
        };
        const reset = () => {
          if (!ref.current) return;
          gsap.to(ref.current, {
            rotateY: 0,
            rotateX: 0,
            scale: 1.12,
            boxShadow: "0px 16px 48px #000c",
            duration: 0.5,
            ease: "power2.out",
          });
        };
        (ref.current as HTMLElement).addEventListener("mousemove", warp);
        (ref.current as HTMLElement).addEventListener("mouseleave", reset);
      }
    });

    // Button shake effect (vertical)
    const blogBtn = document.querySelector(".blog-btn");
    if (blogBtn) {
      blogBtn.addEventListener("mouseenter", () => {
        gsap.to(blogBtn, {
          y: "-25",
          duration: 0.08,
          ease: "power1.inOut",
          onComplete: function() {
            gsap.to(blogBtn, {
              y: "50",
              duration: 0.08,
              ease: "power1.inOut",
              onComplete: function() {
                gsap.to(blogBtn, {
                  y: "0",
                  duration: 0.12,
                  ease: "power2.inOut"
                });
              }
            });
          }
        });
      });
      blogBtn.addEventListener("mouseleave", () => {
        gsap.to(blogBtn, {
          y: 0,
          rotate: 0,
          duration: 0.12,
          ease: "power2.inOut",
        });
      });
    }

  }, []);
  
  return (
    <>
  <DuckThree />
  <main className={main}>
        <Section
          headingLevel={2}
          headingText={typedHeadings[0]}
          paragraph={{
            intro: "I'm a high-schooler whose goal is to become the best software engineer I can be.",
            body: (<>
              I've been coding since I was 10, and I love to stick my keyboard in virtually every sector of software development, from low-level OS development to responsive web pages.
            </>),
          }}
          imgRef={imgRefs[0]}
          imgSrc="/moose-screenshot.png"
          imgAlt="Assembly file from my operating system, Moose OS"
          sectionRef={sectionRefs[0]}
        />
        <Section
          headingLevel={2}
          headingText={typedHeadings[1]}
          paragraph={{
            intro: "Here are some things about me.",
            body: (<>
              I am currently 15 years old, and go to a high school in Melbourne, Australia.<br></br><br></br>
              I began learning coding when I was 10, and since then I have learnt a diverse range of programming languages and technologies.
              My favourite ones are Python, C, Unity and Blender.
            </>),
          }}
          imgRef={imgRefs[1]}
          imgSrc="/blender-screenshot.png"
          imgAlt="A 3D model I edited in Blender"
          reverse={true}
          sectionRef={sectionRefs[1]}
        />
        <Section
          headingLevel={2}
          headingText={typedHeadings[2]}
          paragraph={{
            intro: "Because I like to learn a bit of everything, I have a diverse range of projects.",
            body: (<>
              Projects I've worked on include a custom x86 Operating System, a LLM using PyTorch, as well as 
              various games in Unity. You can check out all of my projects on <a href="https://github.com/frogtheastronaut" target="_blank" rel="noopener noreferrer">GitHub</a>.
              <br></br><br></br>
              I also have a blog, written in Next.js and Strapi, where I talk about coding-related topics, as well the projects I've made.<br></br><br></br>
            </>),
          }}
          imgRef={imgRefs[2]}
          imgSrc="/moose-os-screenshot.png"
          imgAlt="Moose OS"
          sectionRef={sectionRefs[2]}
        />
        <Link
          href="/blog"
          className="mt-10 px-10 py-4 rounded-full bg-gradient-to-r from-white via-white to-blue-200 text-black font-semibold shadow-xl transition-all duration-200 text-2xl blog-btn font-[Fira_Mono,Menlo,monospace]"
        >
          Visit my Blog!
        </Link>
          <div className="mt-2 text-sm text-blue-200 opacity-70 font-mono text-center">Note: Blog may take a long time to load</div>
        <section className="w-full max-w-6xl py-16 flex flex-col items-center gap-6 bg-[#232634] rounded-2xl shadow-2xl border border-[#c6d0f5] mt-8">
          <h2 className="font-extrabold text-4xl text-center drop-shadow-lg mb-2 font-[Fira_Mono,Menlo,monospace]" style={{ color: '#c6d0f5' }}><strong>Contact Me!</strong></h2>
          <div className="flex flex-col items-center gap-2 text-xl">
            <a
              href="https://github.com/frogtheastronaut"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-200 hover:text-blue-400 transition-colors font-mono"
            >
              <strong>GitHub:</strong> <span className="underline">github.com/frogtheastronaut</span>
            </a>
            <a
              href="mailto:ethanzhangyixuan@gmail.com"
              className="text-blue-200 hover:text-blue-400 transition-colors font-mono"
            >
              <strong>Email:</strong> <span className="underline">ethanzhangyixuan@gmail.com</span>
            </a>
          </div>
        </section>
      </main>
    </>
  );
}