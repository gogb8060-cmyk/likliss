'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const services = [
  {
    number: '01',
    title: 'Brand Strategy',
    description: 'Исследования, позиционирование, архитектура бренда. Мы находим суть вашего бренда и превращаем её в конкурентное преимущество.',
    subServices: ['Market Research', 'Brand Positioning', 'Brand Architecture', 'Competitive Analysis'],
  },
  {
    number: '02',
    title: 'Creative & Design',
    description: 'Айдентика, визуальные системы, арт-дирекшн. Создаём визуальный язык, который говорит громче слов.',
    subServices: ['Visual Identity', 'Art Direction', 'Design Systems', 'Packaging'],
  },
  {
    number: '03',
    title: 'Digital & Web',
    description: 'Сайты, приложения, digital-продукты, UX/UI. Цифровые решения, которые работают безупречно.',
    subServices: ['Web Development', 'Mobile Apps', 'UX/UI Design', 'E-commerce'],
  },
  {
    number: '04',
    title: 'Campaign & Content',
    description: 'Рекламные кампании, контент-стратегия, social media. Истории, которые резонируют с аудиторией.',
    subServices: ['Campaign Strategy', 'Content Creation', 'Social Media', 'Influencer Marketing'],
  },
  {
    number: '05',
    title: 'Motion & Production',
    description: 'Видеопродакшн, моушн-дизайн, 3D. Оживляем идеи через движение и визуальные эффекты.',
    subServices: ['Video Production', 'Motion Design', '3D Animation', 'Post-production'],
  },
  {
    number: '06',
    title: 'Performance & Growth',
    description: 'Медиапланирование, performance-маркетинг, аналитика. Данные, которые驱动 рост.',
    subServices: ['Media Planning', 'Performance Marketing', 'Analytics', 'Growth Strategy'],
  },
];

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section header
      gsap.from('.services-header', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.services-section',
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      // Animate service items
      gsap.utils.toArray('.service-item').forEach((item, index) => {
        gsap.from(item, {
          x: -50,
          opacity: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const toggleService = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="services" className="services-section py-section relative bg-surface">
      <div className="container mx-auto px-5 md:px-12">
        {/* Section header */}
        <div className="services-header flex items-end justify-between mb-16 md:mb-24">
          <div>
            <h2 className="text-display text-4xl md:text-6xl font-bold mb-4">
              What We Do
            </h2>
            <p className="text-text-secondary max-w-md">
              Полный цикл креативных услуг для амбициозных брендов
            </p>
          </div>
          <div className="hidden md:block text-display text-[10rem] font-bold text-outline opacity-[0.05] leading-none -mb-8">
            03
          </div>
        </div>

        {/* Services list */}
        <div className="space-y-4">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`service-item interactive border-t border-white/10 py-8 cursor-pointer transition-all duration-500 ${
                activeIndex === index ? 'bg-white/5' : ''
              }`}
              onClick={() => toggleService(index)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-mono text-xs text-accent-lime">{service.number}</span>
                    <h3 className="text-display text-2xl md:text-3xl font-bold group-hover:text-accent-lime transition-colors duration-300">
                      {service.title}
                    </h3>
                  </div>
                  
                  {/* Description - shown on mobile or when active */}
                  <div 
                    className={`overflow-hidden transition-all duration-500 ${
                      activeIndex === index ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-text-secondary text-lg mb-6 max-w-3xl">
                      {service.description}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {service.subServices.map((sub) => (
                        <div
                          key={sub}
                          className="text-mono text-[10px] text-text-secondary uppercase tracking-wide border border-white/10 px-4 py-3 rounded-full text-center hover:border-accent-lime hover:text-accent-lime transition-colors duration-300"
                        >
                          {sub}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="ml-6">
                  <svg
                    className={`w-6 h-6 text-text-primary transform transition-transform duration-500 ${
                      activeIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-text-secondary mb-6">
            Need something specific? Let's talk about your project.
          </p>
          <a
            href="#contact"
            className="interactive btn-magnetic inline-flex items-center px-8 py-4 bg-accent-lime text-background text-base font-semibold rounded-full hover:scale-105 transition-transform duration-300"
          >
            Start a Project
          </a>
        </div>
      </div>
    </section>
  );
}
