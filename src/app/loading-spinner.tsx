"use client";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

interface LoadingSpinnerProps {
  isLoading: boolean;
}

export default function LoadingSpinner({ isLoading }: LoadingSpinnerProps) {
  const [mounted, setMounted] = useState(false);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && spinnerRef.current) {
      // Create GSAP timeline for smooth animations
      timelineRef.current = gsap.timeline({ repeat: -1 });
      
      timelineRef.current
        .to(spinnerRef.current, {
          rotation: 360,
          y: -30,
          scale: 1.1,
          duration: 0.6,
          ease: "power2.out"
        })
        .to(spinnerRef.current, {
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "bounce.out"
        }, "-=0.1"); // Start slightly before the previous animation ends
    }

    return () => {
      // Cleanup timeline on unmount
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [mounted]);

  if (!mounted || !isLoading) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center"
      style={{ 
        backgroundColor: '#232634', // Match workspace background
        zIndex: 1000, // High z-index to be above everything
      }}
    >
      <div className="relative">
        {/* Spinning and bouncing white box */}
        <div 
          ref={spinnerRef}
          className="w-16 h-16 rounded-lg shadow-2xl"
          style={{
            backgroundColor: '#c6d0f5', // Match workspace text color
            boxShadow: '0 0 30px rgba(198, 208, 245, 0.3)', // Subtle glow
          }}
        />
      </div>
    </div>
  );
}