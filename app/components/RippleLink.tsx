"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface RippleLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

const RippleLink = ({ href, className = "", children }: RippleLinkProps) => {
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: -1, y: -1 });
  const [isRippling, setIsRippling] = useState<boolean>(false);

  useEffect(() => {
    if (coords.x !== -1 && coords.y !== -1) {
      setIsRippling(true);
      setTimeout(() => setIsRippling(false), 300);
    } else {
      setIsRippling(false);
    }
  }, [coords]);

  useEffect(() => {
    if (!isRippling) setCoords({ x: -1, y: -1 });
  }, [isRippling]);

  const handleRipple = (clientX: number, clientY: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setCoords({
      x: clientX - rect.left,
      y: clientY - rect.top
    });
  };

  return (
    <Link
      href={href}
      className={`${className} relative overflow-hidden`}
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        handleRipple(e.clientX, e.clientY, e.currentTarget);
      }}
      onTouchStart={(e: React.TouchEvent<HTMLAnchorElement>) => {
        // Prevent default to avoid delay on mobile
        e.preventDefault();
        const touch = e.touches[0];
        handleRipple(touch.clientX, touch.clientY, e.currentTarget);
      }}
    >
      {isRippling && (
        <span
          className="z-10 absolute rounded-full bg-white bg-opacity-30 transform -translate-x-1/2 -translate-y-1/2 animate-ripple"
          style={{
            left: coords.x,
            top: coords.y
          }}
        />
      )}
      {children}
    </Link>
  );
};

export default RippleLink;