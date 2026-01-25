"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Blog", path: "/blog" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState(pathname);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-8 left-0 right-0 z-50 flex justify-center"
    >
      <div className="flex items-center gap-2 p-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-lg shadow-black/20">
        {navItems.map((item) => {
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className="relative px-4 py-2 text-sm md:text-base rounded-full transition-colors duration-200 z-10 text-white"
              onMouseEnter={() => setHoveredPath(item.path)}
              onMouseLeave={() => setHoveredPath(pathname)}
            >
              {item.path === hoveredPath && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {/* 
                  mix-blend-exclusion with white text:
                  - Against Black BG (0,0,0): |1 - 0| = 1 (White) -> Visible
                  - Against White Pill (1,1,1): |1 - 1| = 0 (Black) -> Visible
              */}
              <span className="relative z-10 mix-blend-exclusion font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
