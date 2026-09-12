'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const articles = [
  {
    id: 1,
    category: 'Strategy',
    title: 'The Future of Brand Building in a Digital-First World',
    date: 'Dec 15, 2025',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  },
  {
    id: 2,
    category: 'Design',
    title: 'Why Minimalism Still Matters in Maximalist Times',
    date: 'Dec 10, 2025',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
  },
  {
    id: 3,
    category: 'Technology',
    title: 'How AI is Transforming Creative Work (Without Replacing It)',
    date: 'Dec 5, 2025',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  },
];

export default function Journal() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section header
      gsap.from('.journal-header', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.journal-section',
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      // Animate article cards
      gsap.utils.toArray('.article-card').forEach((card, index) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 1,
          delay: index * 0.15,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      // Animate CTA section
      gsap.from('.contact-banner', {
        scale: 0.95,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.contact-banner',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <>
      {/* Journal Section */}
      <section id="journal" className="journal-section py-section relative bg-surface">
        <div className="container mx-auto px-5 md:px-12">
          {/* Section header */}
          <div className="journal-header flex items-end justify-between mb-16 md:mb-24">
            <div>
              <h2 className="text-display text-4xl md:text-6xl font-bold mb-4">
                Latest Thinking
              </h2>
              <p className="text-text-secondary max-w-md">
                Инсайты, идеи и размышления о будущем креатива
              </p>
            </div>
            <a
              href="/journal"
              className="hidden md:inline-flex items-center text-accent-lime hover:text-accent-lime/80 transition-colors duration-300 group"
            >
              <span className="text-mono text-sm uppercase tracking-wide">View All Articles</span>
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Articles grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article) => (
              <a
                key={article.id}
                href={`/journal/${article.id}`}
                className="article-card group interactive block"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-lg bg-background">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-mono text-[10px] text-background bg-accent-lime px-3 py-1 rounded-full uppercase tracking-wide">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-display text-xl md:text-2xl font-bold mb-3 group-hover:text-accent-lime transition-colors duration-300">
                  {article.title}
                </h3>
                <div className="flex items-center gap-4 text-mono text-xs text-text-secondary">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
              </a>
            ))}
          </div>

          {/* Mobile view all link */}
          <div className="md:hidden mt-12 text-center">
            <a
              href="/journal"
              className="inline-flex items-center text-accent-lime hover:text-accent-lime/80 transition-colors duration-300 group"
            >
              <span className="text-mono text-sm uppercase tracking-wide">View All Articles</span>
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Banner */}
      <section id="contact" className="py-section relative overflow-hidden">
        <div className="contact-banner container mx-auto px-5 md:px-12">
          <div className="relative bg-accent-lime rounded-2xl overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-background rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-background rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 text-center">
              <h2 className="text-display text-4xl md:text-6xl lg:text-7xl font-bold text-background mb-6">
                Ready to create something<br className="hidden md:block" /> extraordinary?
              </h2>
              <p className="text-background/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                Let's build your next big thing together. Tell us about your project.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="mailto:hello@atlascreative.com"
                  className="interactive btn-magnetic inline-block px-8 py-4 bg-background text-accent-lime text-base font-semibold rounded-full hover:scale-105 transition-transform duration-300"
                >
                  Start a Project
                </a>
                <a
                  href="mailto:hello@atlascreative.com"
                  className="text-display text-xl md:text-2xl font-bold text-background hover:text-background/70 transition-colors duration-300"
                >
                  hello@atlascreative.com
                </a>
              </div>

              {/* Social links */}
              <div className="mt-12 flex justify-center gap-6">
                {['Instagram', 'Behance', 'Dribbble', 'LinkedIn'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-mono text-xs text-background/60 hover:text-background transition-colors duration-300 uppercase tracking-wide"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
