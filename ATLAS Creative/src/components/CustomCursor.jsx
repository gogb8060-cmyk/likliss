'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show custom cursor on desktop
    if (window.innerWidth < 1024) return;

    setIsVisible(true);

    const dot = document.querySelector('.cursor-dot');
    const follower = document.querySelector('.cursor-follower');

    const handleMouseMove = (e) => {
      gsap.to(dot, {
        x: e.clientX - 4,
        y: e.clientY - 4,
        duration: 0.1,
        ease: 'power2.out',
      });

      gsap.to(follower, {
        x: e.clientX - 20,
        y: e.clientY - 20,
        duration: 0.15,
        ease: 'power2.out',
      });
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, [role="button"], .interactive')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div className="cursor-dot" />
      <div className={`cursor-follower ${isHovering ? 'hovered' : ''}`} />
    </>
  );
}
