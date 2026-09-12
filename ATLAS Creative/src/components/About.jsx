'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const stats = [
  { value: 50, label: 'Projects', suffix: '+' },
  { value: 12, label: 'Awards', suffix: '' },
  { value: 8, label: 'Years', suffix: '' },
  { value: 30, label: 'Clients', suffix: '+' },
];

export default function About() {
  const sectionRef = useRef(null);
  const statsRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section content
      gsap.from('.about-content', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.about-section',
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      // Animate stats with counter
      statsRefs.current.forEach((stat, index) => {
        const numberElement = stat?.querySelector('.stat-number');
        
        gsap.from(stat, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          delay: 0.5 + index * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: stat,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          onUpdate: () => {
            if (numberElement) {
              const progress = ScrollTrigger.getById(`stat-${index}`)?.progress() || 0;
              const targetValue = stats[index].value;
              const currentValue = Math.floor(progress * targetValue);
              numberElement.textContent = `${currentValue}${stats[index].suffix}`;
            }
          },
        });

        // Complete the counter on full visibility
        ScrollTrigger.create({
          id: `stat-${index}`,
          trigger: stat,
          start: 'top 80%',
          end: 'bottom 60%',
          onUpdate: (self) => {
            if (numberElement && self.progress >= 1) {
              numberElement.textContent = `${stats[index].value}${stats[index].suffix}`;
            }
          },
        });
      });

      // Animate image
      gsap.from('.about-image', {
        x: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.3,
        scrollTrigger: {
          trigger: '.about-image',
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="about-section py-section relative overflow-hidden">
      <div className="container mx-auto px-5 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="about-content">
            <h2 className="text-display text-4xl md:text-6xl font-bold mb-6 md:mb-8">
              Not another agency
            </h2>
            
            <div className="space-y-6 text-lg text-text-secondary mb-10">
              <p>
                Мы — самостоятельное креативное агентство, рождённое в экосистеме Atlas. 
                Мы верим, что великая реклама — это не про лайки, а про культурный след.
              </p>
              <p>
                Мы объединяем стратегию, дизайн, технологии и storytelling, чтобы создавать 
                бренды и кампании, которые невозможно игнорировать.
              </p>
              <p className="text-mono text-sm text-accent-lime">
                Part of the Atlas ecosystem
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  ref={(el) => (statsRefs.current[index] = el)}
                  className="text-center md:text-left"
                >
                  <div className="text-display text-3xl md:text-5xl font-bold text-accent-lime mb-2">
                    <span className="stat-number">{stat.value}</span>{stat.suffix}
                  </div>
                  <div className="text-mono text-xs text-text-secondary uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="about-image relative">
            <div className="relative aspect-[4/5] bg-surface overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80"
                alt="Atlas Creative Team"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent-lime/10 rounded-full blur-2xl" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent-orange/10 rounded-full blur-xl" />
            
            {/* Floating badge */}
            <div className="absolute bottom-8 left-8 z-20 bg-background/90 backdrop-blur-sm border border-white/10 px-6 py-4 rounded-lg">
              <div className="text-mono text-[10px] text-text-secondary uppercase tracking-wider mb-1">
                Born from
              </div>
              <div className="text-display text-xl font-bold">
                <span className="text-accent-lime">ATLAS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
