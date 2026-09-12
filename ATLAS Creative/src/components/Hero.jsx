'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate hero text lines
      gsap.from('.hero-line', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power4.out',
        delay: 0.5,
      });

      // Animate subtitle
      gsap.from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 1,
      });

      // Animate CTA buttons
      gsap.from('.hero-cta', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 1.2,
      });

      // Animate scroll indicator
      gsap.from('.scroll-indicator', {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 1.5,
        repeat: -1,
        yoyo: true,
      });

      // Parallax effect on background elements
      gsap.to('.parallax-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero relative h-screen flex items-center justify-center overflow-hidden gradient-mesh">
      {/* Background decorative elements */}
      <div className="parallax-bg absolute inset-0 pointer-events-none">
        {/* Large outline text in background */}
        <div className="absolute top-20 right-10 md:right-40 text-display text-[12rem] md:text-[20rem] font-bold text-outline opacity-[0.03] leading-none">
          01
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute bottom-20 left-10 w-64 h-64 md:w-96 md:h-96 bg-accent-lime rounded-full blur-[120px] opacity-[0.05]" />
        <div className="absolute top-40 right-20 w-48 h-48 md:w-72 md:h-72 bg-accent-orange rounded-full blur-[100px] opacity-[0.05]" />
      </div>

      {/* Main content */}
      <div className="container mx-auto px-5 md:px-12 relative z-10 pt-20">
        <div className="max-w-5xl">
          {/* Hero headline */}
          <h1 className="text-display text-hero font-bold leading-[0.9] tracking-tighter mb-6 md:mb-8">
            <span className="hero-line block">We build brands</span>
            <span className="hero-line block text-accent-lime">that move</span>
            <span className="hero-line block">culture forward</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle text-lg md:text-xl text-text-secondary max-w-2xl mb-8 md:mb-12">
            Atlas Creative — независимое рекламное агентство полного цикла. 
            Стратегия, креатив, продакшн, digital.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta flex flex-wrap gap-4 md:gap-6 items-center">
            <Link
              href="#work"
              className="interactive btn-magnetic inline-block px-8 py-4 bg-accent-lime text-background text-base md:text-lg font-semibold rounded-full hover:scale-105 transition-transform duration-300"
            >
              See Our Work
            </Link>
            <Link
              href="#contact"
              className="interactive inline-flex items-center text-text-primary hover:text-accent-lime transition-colors duration-300 group"
            >
              <span className="text-base md:text-lg">Start a Project</span>
              <svg 
                className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Marquee ticker at bottom */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 overflow-hidden py-4">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-mono text-xs md:text-sm text-text-secondary mx-6">BRANDING</span>
          <span className="text-mono text-xs md:text-sm text-text-secondary mx-6">•</span>
          <span className="text-mono text-xs md:text-sm text-text-secondary mx-6">DIGITAL</span>
          <span className="text-mono text-xs md:text-sm text-text-secondary mx-6">•</span>
          <span className="text-mono text-xs md:text-sm text-text-secondary mx-6">MOTION</span>
          <span className="text-mono text-xs md:text-sm text-text-secondary mx-6">•</span>
          <span className="text-mono text-xs md:text-sm text-text-secondary mx-6">STRATEGY</span>
          <span className="text-mono text-xs md:text-sm text-text-secondary mx-6">•</span>
          <span className="text-mono text-xs md:text-sm text-text-secondary mx-6">SOCIAL</span>
          <span className="text-mono text-xs md:text-sm text-text-secondary mx-6">•</span>
          <span className="text-mono text-xs md:text-sm text-text-secondary mx-6">PRODUCTION</span>
          <span className="text-mono text-xs md:text-sm text-text-secondary mx-6">•</span>
          <span className="text-mono text-xs md:text-sm text-text-secondary mx-6">BRANDING</span>
          <span className="text-mono text-xs md:text-sm text-text-secondary mx-6">•</span>
          <span className="text-mono text-xs md:text-sm text-text-secondary mx-6">DIGITAL</span>
          <span className="text-mono text-xs md:text-sm text-text-secondary mx-6">•</span>
          <span className="text-mono text-xs md:text-sm text-text-secondary mx-6">MOTION</span>
          <span className="text-mono text-xs md:text-sm text-text-secondary mx-6">•</span>
          <span className="text-mono text-xs md:text-sm text-text-secondary mx-6">STRATEGY</span>
          <span className="text-mono text-xs md:text-sm text-text-secondary mx-6">•</span>
          <span className="text-mono text-xs md:text-sm text-text-secondary mx-6">SOCIAL</span>
          <span className="text-mono text-xs md:text-sm text-text-secondary mx-6">•</span>
          <span className="text-mono text-xs md:text-sm text-text-secondary mx-6">PRODUCTION</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="text-mono text-[10px] text-text-secondary mb-2">Scroll to explore</span>
        <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
