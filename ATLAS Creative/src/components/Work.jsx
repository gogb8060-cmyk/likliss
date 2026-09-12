'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const projects = [
  {
    id: 1,
    title: 'Neon',
    category: 'Rebrand for fintech startup',
    tags: ['Branding', 'Digital', 'Strategy'],
    year: '2025',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
  },
  {
    id: 2,
    title: 'Pulse',
    category: 'Launch campaign for sportswear brand',
    tags: ['Campaign', 'Motion', 'Social'],
    year: '2025',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80',
  },
  {
    id: 3,
    title: 'Vertex',
    category: 'Digital experience for architecture studio',
    tags: ['Web', 'UX/UI', 'Development'],
    year: '2024',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
  },
  {
    id: 4,
    title: 'Ember',
    category: 'Brand identity for wellness platform',
    tags: ['Branding', 'Design', 'Content'],
    year: '2024',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80',
  },
];

export default function Work() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section number
      gsap.from('.section-number', {
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      // Animate section title
      gsap.from('.section-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2,
      });

      // Animate project cards with stagger
      gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.from(card, {
          y: 80,
          opacity: 0,
          duration: 1.2,
          ease: 'power4.out',
          delay: 0.3 + index * 0.15,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      // Animate CTA button
      gsap.from('.work-cta', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.8,
        scrollTrigger: {
          trigger: '.work-cta',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="work" className="py-section relative">
      <div className="container mx-auto px-5 md:px-12">
        {/* Section header */}
        <div className="flex items-end justify-between mb-16 md:mb-24">
          <div>
            <h2 className="section-title text-display text-4xl md:text-6xl font-bold mb-4">
              Selected Work
            </h2>
            <p className="text-text-secondary max-w-md">
              Projects that challenge conventions and create cultural impact
            </p>
          </div>
          <div className="section-number hidden md:block text-display text-[10rem] font-bold text-outline opacity-[0.05] leading-none -mb-8">
            02
          </div>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/work/${project.id}`}
              className="project-card group interactive"
            >
              {/* Project image */}
              <div className="image-card relative aspect-[16/10] mb-6 bg-surface overflow-hidden rounded-lg">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span className="text-mono text-sm text-accent-lime">View Project</span>
                </div>
              </div>

              {/* Project info */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-display text-2xl md:text-3xl font-bold mb-2 group-hover:text-accent-lime transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-text-secondary mb-4">{project.category}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-mono text-[10px] text-text-secondary border border-white/20 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-mono text-xs text-text-secondary">{project.year}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* View all CTA */}
        <div className="work-cta flex justify-center mt-16 md:mt-24">
          <Link
            href="/work"
            className="interactive btn-magnetic inline-flex items-center px-8 py-4 border border-white/20 rounded-full text-text-primary hover:border-accent-lime hover:text-accent-lime transition-all duration-300 group"
          >
            <span className="text-base font-semibold">View All Projects</span>
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
    </section>
  );
}
