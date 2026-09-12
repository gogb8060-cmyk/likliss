import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: 'Work', href: '#work' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Journal', href: '#journal' },
    { name: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { name: 'Instagram', href: '#' },
    { name: 'Behance', href: '#' },
    { name: 'Dribbble', href: '#' },
    { name: 'LinkedIn', href: '#' },
    { name: 'Telegram', href: '#' },
  ];

  return (
    <footer className="relative bg-background border-t border-white/10">
      {/* Large background text */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 text-display text-[8rem] md:text-[15rem] font-bold text-outline opacity-[0.03] leading-none text-center">
          ATLAS CREATIVE
        </div>
      </div>

      <div className="container mx-auto px-5 md:px-12 relative z-10">
        {/* Main footer content */}
        <div className="py-16 md:py-24">
          {/* Logo */}
          <Link href="/" className="inline-block mb-12 interactive group">
            <div className="text-display font-bold text-3xl md:text-4xl tracking-tight">
              <span className="group-hover:text-accent-lime transition-colors duration-300">ATLAS</span>
              <span className="text-text-secondary">CREATIVE</span>
            </div>
            <div className="text-mono text-[10px] text-text-secondary opacity-60 -mt-1">
              by Atlas
            </div>
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
            {/* Navigation */}
            <div className="md:col-span-3">
              <h4 className="text-mono text-xs text-text-secondary uppercase tracking-wide mb-6">
                Navigation
              </h4>
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-text-primary hover:text-accent-lime transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="md:col-span-3">
              <h4 className="text-mono text-xs text-text-secondary uppercase tracking-wide mb-6">
                Contact
              </h4>
              <ul className="space-y-4 text-text-secondary">
                <li>
                  <a
                    href="mailto:hello@atlascreative.com"
                    className="hover:text-accent-lime transition-colors duration-300"
                  >
                    hello@atlascreative.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+1234567890"
                    className="hover:text-accent-lime transition-colors duration-300"
                  >
                    +1 (234) 567-890
                  </a>
                </li>
                <li className="max-w-xs">
                  123 Creative Street,<br />
                  Design District,<br />
                  NY 10001
                </li>
              </ul>
            </div>

            {/* Social */}
            <div className="md:col-span-3">
              <h4 className="text-mono text-xs text-text-secondary uppercase tracking-wide mb-6">
                Social
              </h4>
              <ul className="space-y-3">
                {socialLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-text-primary hover:text-accent-lime transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="md:col-span-3">
              <h4 className="text-mono text-xs text-text-secondary uppercase tracking-wide mb-6">
                Newsletter
              </h4>
              <p className="text-text-secondary text-sm mb-4">
                Subscribe to get the latest insights and updates.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-surface border border-white/10 rounded-full px-4 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-lime transition-colors duration-300"
                />
                <button
                  type="submit"
                  className="interactive px-4 py-2 bg-accent-lime text-background text-sm font-semibold rounded-full hover:scale-105 transition-transform duration-300"
                >
                  →
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-mono text-[10px] text-text-secondary">
            © {currentYear} Atlas Creative. All rights reserved.
          </div>
          
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-mono text-[10px] text-text-secondary hover:text-accent-lime transition-colors duration-300"
            >
              A project by Atlas
            </Link>
            <Link
              href="/privacy"
              className="text-mono text-[10px] text-text-secondary hover:text-accent-lime transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-mono text-[10px] text-text-secondary hover:text-accent-lime transition-colors duration-300"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
