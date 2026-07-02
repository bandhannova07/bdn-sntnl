/** @jsxImportSource react */
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(navRef.current, 
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
    );

    // Scroll listener for navbar background change
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled 
          ? 'bg-black/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <img src="/favicon.ico?v=2" alt="Sentinel Logo" className="w-12 h-12 object-contain group-hover:scale-110 group-hover:rotate-[15deg] transition-transform duration-500 drop-shadow-[0_0_12px_rgba(167,139,250,0.5)]" />
            <span className="text-2xl tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 drop-shadow-[0_0_2px_rgba(167,139,250,0.25)] mt-1" style={{ fontFamily: "'Virgo 01', sans-serif", letterSpacing: "2px" }}>
              Sentinel
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Features', href: '#features' },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Pricing', href: '#pricing' },
              { label: 'Docs', href: '/docs' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative px-4 py-2 text-[13px] text-gray-400 hover:text-white transition-all duration-300 rounded-lg group"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-violet-500 to-fuchsia-500 group-hover:w-[60%] transition-all duration-300 rounded-full"></span>
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a href="/signin" className="px-4 py-2 text-[13px] text-gray-400 hover:text-white transition-colors" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
              Log in
            </a>
            <a
              href="/signup"
              className="relative px-5 py-2.5 text-[13px] font-semibold text-white rounded-xl overflow-hidden group"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-all group-hover:scale-105 duration-300"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative">Start Free →</span>
            </a>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-gray-400 hover:text-white p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>) : (<><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="14" y2="17"/></>)}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-6 space-y-1 border-t border-white/5 pt-4">
            {['Features', 'How It Works', 'Pricing', 'Docs'].map((label) => (
              <a key={label} href="#" className="block px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</a>
            ))}
            <a href="/signup" className="block px-4 py-3 mt-2 text-center text-sm text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-semibold">Start Free →</a>
          </div>
        )}
      </div>
    </nav>
  );
}
