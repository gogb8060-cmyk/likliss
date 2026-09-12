import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import Preloader from '../components/Preloader';
import Hero from '../components/Hero';
import Work from '../components/Work';
import About from '../components/About';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import Journal from '../components/Journal';

export const metadata: Metadata = {
  title: 'Atlas Creative | Advertising Agency by Atlas',
  description: 'Независимое креативное агентство полного цикла. Стратегия, креатив, продакшн, digital. Создаём бренды и кампании, которые невозможно игнорировать.',
  keywords: ['advertising agency', 'creative agency', 'branding', 'digital', 'marketing', 'Atlas'],
  authors: [{ name: 'Atlas Creative' }],
  openGraph: {
    title: 'Atlas Creative | Advertising Agency',
    description: 'We build brands that move culture forward',
    type: 'website',
    locale: 'en_US',
    siteName: 'Atlas Creative',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atlas Creative',
    description: 'We build brands that move culture forward',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Preloader />
        <CustomCursor />
        <div className="cursor-dot" />
        <div className="cursor-follower" />
        
        <Header />
        
        <main>
          {children || (
            <>
              <Hero />
              <Work />
              <Services />
              <About />
              <Testimonials />
              <Journal />
            </>
          )}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}
