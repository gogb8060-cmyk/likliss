'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const clients = [
  'TechCorp', 'Neon Labs', 'Vertex', 'Pulse', 'Ember', 
  'Flux', 'Apex', 'Nova', 'Prism', 'Echo', 'Rift', 'Bolt'
];

const testimonials = [
  {
    quote: "Atlas Creative transformed our brand completely. Their strategic thinking and creative execution exceeded all expectations.",
    author: "Sarah Chen",
    role: "CMO",
    company: "TechCorp",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
  },
  {
    quote: "Working with Atlas was a game-changer. They don't just create campaigns — they create cultural moments.",
    author: "Marcus Johnson",
    role: "Founder",
    company: "Neon Labs",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
  },
  {
    quote: "The team at Atlas understands how to blend strategy with creativity. Our engagement metrics increased by 300%.",
    author: "Elena Rodriguez",
    role: "Marketing Director",
    company: "Vertex",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
  },
];

export default function Testimonials() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section header
      gsap.from('.testimonials-header', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.testimonials-section',
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      // Animate client logos
      gsap.utils.toArray('.client-logo').forEach((logo, index) => {
        gsap.from(logo, {
          opacity: 0,
          scale: 0.8,
          duration: 0.6,
          delay: index * 0.05,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: logo,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      // Animate testimonial cards
      gsap.utils.toArray('.testimonial-card').forEach((card, index) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 1,
          delay: index * 0.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="testimonials-section py-section relative overflow-hidden">
      <div className="container mx-auto px-5 md:px-12">
        {/* Section header */}
        <div className="testimonials-header text-center mb-16 md:mb-24">
          <h2 className="text-display text-4xl md:text-6xl font-bold mb-4">
            Trusted By
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Бренды, которые выбрали нас для создания чего-то выдающегося
          </p>
        </div>

        {/* Client logos marquee */}
        <div className="mb-24 overflow-hidden">
          <div className="flex gap-16 animate-marquee whitespace-nowrap">
            {[...clients, ...clients].map((client, index) => (
              <div
                key={`${client}-${index}`}
                className="client-logo inline-block text-2xl md:text-3xl font-bold text-text-secondary/40 hover:text-accent-lime transition-colors duration-300"
              >
                {client}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className="testimonial-card interactive bg-surface border border-white/5 p-8 rounded-lg hover:border-accent-lime/30 transition-colors duration-300"
            >
              {/* Quote icon */}
              <svg
                className="w-10 h-10 text-accent-lime/30 mb-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>

              {/* Quote */}
              <blockquote className="text-lg md:text-xl text-text-primary mb-8 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-text-primary">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
