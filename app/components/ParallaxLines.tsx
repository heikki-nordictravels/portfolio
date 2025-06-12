"use client";

import { useEffect, useRef } from "react";

interface ParallaxLinesProps {
  opacity?: number;
  strokeWidth?: number;
  color?: string;
  intensity?: number;
  zIndex?: number;
}

export default function ParallaxLines({
  opacity = 0.4,
  strokeWidth = 3,
  color = "var(--bg-lines)",
  intensity = -0.02,
  zIndex = 5,
}: ParallaxLinesProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle mouse movement for parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      if (parallaxRef.current) {
        const x = e.clientX;
        const y = e.clientY;
        
        const moveX = (x - window.innerWidth / 2) * intensity;
        const moveY = (y - window.innerHeight / 2) * intensity;
        
        // Apply transform to just the inner content, not the container
        const innerSvg = parallaxRef.current.querySelector('svg');
        if (innerSvg) {
          innerSvg.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
      }
    };

    // Update the SVG dimensions based on scroll position
    const handleScroll = () => {
      if (!parallaxRef.current) return;
      
      const svg = parallaxRef.current.querySelector('svg');
      if (svg) {
        // Set the height to be viewport height + scroll position + extra buffer
        const totalHeight = window.innerHeight + window.scrollY + 1000;
        svg.setAttribute('height', `${totalHeight}px`);
        
        // Also update the viewBox to match the new dimensions
        svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${totalHeight}`);
      }
    };
    
    // Initial setup
    handleScroll();
    
    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [intensity]);

  return (
    <div 
      ref={parallaxRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ opacity, zIndex: zIndex }}
    >
      <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <line x1="0%" y1="0" x2="30%" y2="100%" stroke={color} strokeWidth={strokeWidth} />
          <line x1="20%" y1="0" x2="63%" y2="100%" stroke={color} strokeWidth={strokeWidth} />
          <line x1="40%" y1="0" x2="100%" y2="100%" stroke={color} strokeWidth={strokeWidth} />
          <line x1="60%" y1="0" x2="130%" y2="100%" stroke={color} strokeWidth={strokeWidth} />
          <line x1="80%" y1="0" x2="180%" y2="100%" stroke={color} strokeWidth={strokeWidth} />
        </svg>
      </div>
    </div>
  );
}