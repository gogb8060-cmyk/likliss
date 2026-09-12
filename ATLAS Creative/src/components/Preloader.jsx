'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsComplete(true), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isComplete) {
      gsap.to('.preloader', {
        y: '-100%',
        duration: 1.2,
        ease: 'power4.inOut',
        delay: 0.3,
      });
    }
  }, [isComplete]);

  return (
    <div className="preloader">
      <div className="text-display text-4xl md:text-6xl font-bold mb-4">
        <span className="text-accent-lime">ATLAS</span> CREATIVE
      </div>
      <div className="text-mono text-sm text-text-secondary mb-8">
        by Atlas
      </div>
      <div className="preloader-bar">
        <div 
          className="preloader-progress" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-mono text-xs text-text-secondary mt-4">
        {progress}%
      </div>
    </div>
  );
}
