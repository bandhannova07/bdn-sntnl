/** @jsxImportSource react */
import React from 'react';

export default function FooterSection() {
  return (
    <footer className="relative border-t border-white/[0.04] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img src="/favicon.ico?v=2" alt="Sentinel Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(167,139,250,0.5)]" />
              <span className="text-2xl tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 drop-shadow-[0_0_2px_rgba(167,139,250,0.25)] mt-1" style={{ fontFamily: "'Virgo 01', sans-serif", letterSpacing: "2px" }}>
                Sentinel
              </span>
            </div>
            <p className="text-[13px] text-gray-500 max-w-[280px] mb-6 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              AI-powered error monitoring for modern development teams. A product of <a href="https://www.bandhannova.in" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 transition-colors">BandhanNova Platforms</a>.
            </p>
            <div className="flex gap-4">
              {[
                { name: 'GitHub', svg: <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/> },
                { name: 'Twitter', svg: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/> },
                { name: 'Discord', svg: <><path d="M18 9h.01"/><path d="M6 9h.01"/><path d="M20.4 12.2C19.5 17.3 16 19 16 19c-.8-1-1.4-2-2-2.4-1.4.7-3 1-4 1s-2.6-.3-4-1c-.6.4-1.2 1.4-2 2.4 0 0-3.5-1.7-4.4-6.8C.4 9.6 2 5 2 5s2.2-1.7 5-2l.6 1.2c1.6-.3 3.2-.3 4.8 0L13 3c2.8.3 5 2 5 2s1.6 4.6.4 7.2z"/></> },
              ].map((social) => (
                <a key={social.name} href="#" className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-gray-600 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{social.svg}</svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { 
              title: 'Product', 
              links: [
                { name: 'Features', href: '#features' },
                { name: 'Pricing', href: '#pricing' },
                { name: 'Changelog', href: '#' },
                { name: 'Integrations', href: '#' },
                { name: 'Status', href: '#' },
              ] 
            },
            { 
              title: 'Developers', 
              links: [
                { name: 'Documentation', href: '/docs' },
                { name: 'API Reference', href: '/docs?tab=logging-tracing' },
                { name: 'SDKs', href: '/docs?tab=sdks' },
                { name: 'Guides', href: '/docs?tab=quickstart' },
              ] 
            },
            { 
              title: 'Company', 
              links: [
                { name: 'About', href: '#' },
                { name: 'Blog', href: '#' },
                { name: 'Careers', href: '#' },
                { name: 'Contact', href: '#' },
                { name: 'Legal', href: '#' },
              ] 
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-[13px] font-semibold text-white mb-5 uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-[13px] text-gray-500 hover:text-white transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.04] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
            © 2026 BandhanNova Platforms. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((link) => (
              <a key={link} href="#" className="text-[12px] text-gray-600 hover:text-white transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
