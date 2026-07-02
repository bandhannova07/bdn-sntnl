/** @jsxImportSource react */
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && contentRef.current) {
            gsap.fromTo(contentRef.current,
              { y: 60, opacity: 0, scale: 0.97 },
              { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }
            );
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Animated gradient bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-r from-violet-600/15 via-fuchsia-600/10 to-pink-600/15 rounded-full blur-[120px]"></div>
      </div>

      <div ref={contentRef} className="max-w-4xl mx-auto px-6 text-center relative z-10 opacity-0">
        <div className="bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-3xl p-12 lg:p-16 backdrop-blur-sm">
          <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white tracking-[-0.02em] mb-6 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Ready to build
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
              unbreakable software?
            </span>
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Join the next generation of developers who ship with confidence. Setup takes less than 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/signup"
              className="group relative px-10 py-4 text-[15px] font-semibold text-white rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600"></span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"></span>
              <span className="relative flex items-center gap-2">
                Get Started — Free Forever
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </a>
            <a
              href="#"
              className="px-10 py-4 text-[15px] font-medium text-gray-300 bg-white/[0.04] border border-white/[0.08] rounded-2xl hover:bg-white/[0.08] hover:text-white transition-all duration-300"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Talk to Sales
            </a>
          </div>
          <p className="mt-6 text-[12px] text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
