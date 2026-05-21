import React, { useState, useEffect } from 'react';
import { Menu, X, Settings2, PhoneCall } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  onOpenAdmin: () => void;
  inquiriesCount: number;
}

export default function Navbar({ onOpenAdmin, inquiriesCount }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSegment, setActiveSegment] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Determine active section based on proximity
      const sections = ['home', 'services', 'insurance', 'mutual-funds', 'real-estate', 'about', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSegment(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const target = document.getElementById(id);
    if (target) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = target.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 font-sans border-b ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-black/5 shadow-sm py-3.5 text-black'
          : 'bg-white border-black/[0.02] py-4.5 text-black'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <a
            href="#home"
            onClick={(e) => handleScrollTo(e, 'home')}
            className="flex items-center group focus:outline-none text-left"
            id="nav-brand-logo"
          >
            <Logo size="md" lightText={false} />
          </a>

          {/* Desktop Navigation links */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { id: 'services', label: 'Services' },
              { id: 'insurance', label: 'Insurance' },
              { id: 'mutual-funds', label: 'Mutual Funds' },
              { id: 'real-estate', label: 'Investment Shelf' },
              { id: 'contact', label: 'Contact' }
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleScrollTo(e, link.id)}
                className={`text-[9px] uppercase tracking-widest font-black transition-all hover:text-black inline-block relative py-1 ${
                  activeSegment === link.id
                    ? 'text-black font-black scale-102'
                    : 'text-black/40'
                }`}
              >
                {link.label}
                {activeSegment === link.id && (
                  <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-black rounded-full"></span>
                )}
              </a>
            ))}
          </nav>

          {/* Action button groupings */}
          <div className="hidden lg:flex items-center gap-3">
            {/* CMS Portal Admin Button */}
            <button
              onClick={onOpenAdmin}
              className="p-2.5 rounded-full border border-black/5 bg-[#F5F5F4]/45 text-black hover:bg-black hover:text-white hover:border-black transition-all flex items-center justify-center relative shadow-sm"
              title="Admin CMS Console"
            >
              <Settings2 className="w-4 h-4" />
              {inquiriesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {inquiriesCount}
                </span>
              )}
            </button>

            <a
              href="#contact"
              onClick={(e) => handleScrollTo(e, 'contact')}
              className="px-6 py-3 text-[9px] font-black uppercase tracking-widest rounded-full bg-black text-white hover:bg-neutral-800 transition-all shadow-md flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Book Consult
            </a>
          </div>

          {/* Quick Buttons for Mobile viewport */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Admin CMS for mobile */}
            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-full border border-black/5 text-black bg-[#F5F5F4]/50"
              title="Admin Console"
            >
              <Settings2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle navigation drawer"
            >
              {isMenuOpen ? <X className="w-5 h-5 text-black" /> : <Menu className="w-5 h-5 text-black" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer menu overlay */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full inset-x-0 bg-white border-b border-black/10 shadow-xl p-5 space-y-4 animate-fade-in text-black">
          <nav className="flex flex-col gap-4 text-left font-sans">
            {[
              { id: 'services', label: 'Services Overview' },
              { id: 'insurance', label: 'Insurance Protection' },
              { id: 'mutual-funds', label: 'Mutual Funds NRI Plans' },
              { id: 'real-estate', label: 'Investments Asset Shelf' },
              { id: 'contact', label: 'Get in Touch' }
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleScrollTo(e, link.id)}
                className="text-[9px] font-black uppercase tracking-widest text-black/60 hover:text-black py-1 block border-b border-black/[0.02]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, 'contact')}
            className="w-full text-center py-3.5 bg-black text-white font-black rounded-full text-[9px] tracking-widest uppercase block shadow-md"
          >
            Request Private Consultation
          </a>
        </div>
      )}
    </header>
  );
}
