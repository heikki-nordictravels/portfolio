"use client";

import { useState, useEffect, useRef } from 'react';

export default function CodeInspector() {
  const [hoveredCode, setHoveredCode] = useState<string>('Hover over elements');
  var [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const inspectorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Set visible only once mouse has moved, otherwise the inspector will start off in the corner
    const handleMouseMove = (e: MouseEvent) => {
        if (!isVisible) {
        setIsVisible(true);
      }
      if (!inspectorRef.current) return;
      
      const inspectorWidth = inspectorRef.current.offsetWidth;
      const inspectorHeight = inspectorRef.current.offsetHeight;
      
      // Position below cursor
      const x = e.clientX - (inspectorWidth / 2);
      const y = e.clientY + 0;
      
      // Keep within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const maxX = viewportWidth - inspectorWidth;
      const maxY = viewportHeight - inspectorHeight;
      
      setPosition({
        x: Math.max(0, Math.min(x, maxX)),
        y: Math.max(0, Math.min(y, maxY))
      });
    };

    // Handle hovering over elements
    const handleMouseEnter = (e: MouseEvent) => {
        
      const target = e.target as HTMLElement;
      
      // Skip the inspector itself
      if (target.closest('.code-inspector')) return;
      
      // Get element tag and all attributes
      const tagName = target.tagName.toLowerCase();
      const attributesArray = Array.from(target.attributes);
      const attributes = attributesArray
        .map(attr => {
          // Filter out "inspectable" from class/className attributes
          if (attr.name === 'class' || attr.name === 'className') {
            const classes = attr.value.split(' ')
              .filter(cls => cls !== 'inspectable')
              .join(' ');
            return classes ? `${attr.name}="${classes}"` : '';
          }
          return `${attr.name}="${attr.value}"`;
        })
        .filter(Boolean) // Remove empty strings
        .join('\n  ');
      
      // Create formatted code representation
      setHoveredCode(
        `<${tagName}${attributes ? '\n  ' + attributes : ''}>
          ${target.children.length ? `<!-- ${target.children.length} child elements -->` : 
            target.innerText ? target.innerText.slice(0, 50) + (target.innerText.length > 50 ? '...' : '') : ''}
          </${tagName}>`
      );
    };
    
    // Event listeners
    const elements = document.querySelectorAll('.inspectable') as NodeListOf<HTMLElement>;
    document.addEventListener('mousemove', handleMouseMove);
    elements.forEach(el => el.addEventListener('mouseenter', handleMouseEnter));
    
    // Clean up
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      elements.forEach(el => el.removeEventListener('mouseenter', handleMouseEnter));
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      ref={inspectorRef}
      className="code-inspector fixed bg-black bg-opacity-80 text-green-400 p-4 rounded-md shadow-lg z-10"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        maxWidth: '1000px'
      }}
    >
        {/* Vignette effect overlay */}
      <div className="absolute inset-0 pointer-events-none z-2" 
        style={{
          background: 'radial-gradient(circle, transparent -100%, rgba(0,0,0,20) 130%)',
          mixBlendMode: 'multiply'
        }}
      />
      <pre className="inspector-text text-xs overflow-auto max-h-64">
        <code>{hoveredCode}</code>
      </pre>
    </div>
  );
}