"use client";

import { motion, useAnimation } from "framer-motion";

interface HighlightTextProps {
  text: string;
  className?: string;
  delay?: number;
  highlightColor?: string;
}

export default function HighlightText({ 
  text, 
  className = "", 
  delay = 0,
  highlightColor = ""
}: HighlightTextProps) {
  
  const words = text.split(" ");
 
  // Stagger parameters for the initial fade-in
  const staggerDelay = 0.08;

  return (
    <div className={`flex flex-wrap gap-x-2 gap-y-1 ${className}`}>
      {words.map((word, i) => (
        <HighlightWord 
          key={i} 
          word={word} 
          delay={delay + i * staggerDelay} 
          highlightColor={highlightColor}
        />
      ))}
    </div>
  );
}

function HighlightWord({ word, delay, highlightColor }: { word: string, delay: number, highlightColor: string }) {
  const controls = useAnimation();

  const handleHover = () => {
    controls.start({
        scaleX: [0, 1, 1, 0],
        originX: [0, 0, 1, 1],
        transition: { 
            duration: 0.5, 
            times: [0, 0.4, 0.6, 1],
            ease: "easeInOut"
        }
    });
  };

  return (
    <span 
        className="relative inline-block whitespace-nowrap cursor-default" 
        onMouseEnter={handleHover}
    >
      {/* Text Fade In */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: delay }}
        className="relative z-10"
      >
        {word}
      </motion.span>

      {/* Highlight Wipe */}
      <motion.span
        className="absolute top-0 left-0 bottom-0 z-0 opacity-80"
        style={{ 
            backgroundColor: highlightColor,
            width: "100%",
            height: "100%"
        }}
        initial={{ scaleX: 0 }}
        animate={controls}
      />
    </span>
  );
}
