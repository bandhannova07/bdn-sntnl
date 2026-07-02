/** @jsxImportSource react */
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, Terminal } from 'lucide-react';

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleLinesRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const bgLinesRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Animate background SVG lines drawing in
    if (bgLinesRef.current) {
      const paths = bgLinesRef.current.querySelectorAll('path');
      gsap.fromTo(paths, 
        { strokeDasharray: 1000, strokeDashoffset: 1000 }, 
        { strokeDashoffset: 0, duration: 3, stagger: 0.1, ease: 'power2.inOut' }
      );
    }

    tl.fromTo(badgeRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.2 })
      
    // Text Reveal for each line
    if (titleLinesRef.current) {
      const lines = titleLinesRef.current.children;
      tl.fromTo(lines, 
        { y: 80, opacity: 0, rotationX: -30, transformOrigin: '0% 50% -50' }, 
        { y: 0, opacity: 1, rotationX: 0, duration: 1.2, stagger: 0.15 }, 
        '-=0.6'
      );
    }

    tl.fromTo(subRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.8')
      .fromTo(ctaRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.8');

    // Simple Mouse Parallax
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      
      gsap.to('.parallax-bg', { x: x * -20, y: y * -20, duration: 1.5, ease: 'power2.out' });
      gsap.to('.float-obj-1', { x: x * 40, y: y * 30, rotation: x * 15, duration: 2, ease: 'power2.out' });
      gsap.to('.float-obj-2', { x: x * -30, y: y * 50, rotation: -y * 20, duration: 2.5, ease: 'power2.out' });
      gsap.to('.float-obj-3', { x: x * 50, y: y * -40, rotation: x * -10, duration: 1.8, ease: 'power2.out' });
    };

    // Continuous floating animation for objects
    gsap.to('.float-obj', {
      y: '+=15',
      x: '+=10',
      rotation: '+=10',
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.5
    });

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-[#030303]">
      
      {/* Luxury Minimalist Background */}
      <div className="absolute inset-0 pointer-events-none parallax-bg">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/10 blur-[120px]"></div>
        
        {/* Subtle grid and lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}></div>

        {/* Abstract SVG Lines */}
        <svg ref={bgLinesRef} className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
          <path d="M0,200 Q400,100 800,400 T1600,200" fill="none" stroke="url(#line-gradient)" strokeWidth="1" />
          <path d="M0,500 Q500,600 900,300 T1600,500" fill="none" stroke="url(#line-gradient)" strokeWidth="1" />
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
              <stop offset="50%" stopColor="#ec4899" stopOpacity="1" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating 3D Objects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="float-obj float-obj-1 absolute top-[25%] left-[15%] w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-500/20 to-fuchsia-500/10 border border-violet-500/20 backdrop-blur-md shadow-[0_0_30px_rgba(139,92,246,0.15)]"></div>
        <div className="float-obj float-obj-2 absolute bottom-[25%] right-[20%] w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.15)]"></div>
        <div className="float-obj float-obj-3 absolute top-[35%] right-[25%] w-8 h-8 rounded-lg bg-gradient-to-b from-pink-500/20 to-rose-500/10 border border-pink-500/20 backdrop-blur-sm rotate-45"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
        
        {/* Badge */}
        <div ref={badgeRef} className="opacity-0 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md mb-10 cursor-default">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-[12px] text-gray-300 font-medium tracking-wide uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
            AI analyzes root causes in seconds
          </span>
        </div>

        {/* Title */}
        <h1 ref={titleLinesRef} className="text-[4rem] sm:text-[5.5rem] lg:text-[7rem] font-extrabold tracking-[-0.04em] text-white leading-[0.95] mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif", perspective: '1000px' }}>
          <div className="block opacity-0" style={{ transformStyle: 'preserve-3d' }}>
            Decode the crash.
          </div>
          <div className="block opacity-0" style={{ transformStyle: 'preserve-3d' }}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 italic font-light tracking-[-0.02em]">
              Understand the why.
            </span>
          </div>
        </h1>

        {/* Sub */}
        <p ref={subRef} className="opacity-0 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-14 leading-relaxed font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
          Instantly capture errors and get actionable fixes in any <span className="font-bold">language</span>. Save hours of debugging with <span className="font-bold">intelligent</span> root-cause analysis that tells you exactly what broke and how to <span className="font-bold">fix</span> it.
        </p>

        {/* CTA */}
        <div ref={ctaRef} className="opacity-0 flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href="/signup"
            className="group relative px-8 py-4 bg-white text-black rounded-full overflow-hidden hover:scale-[1.02] transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          >
            <span className="relative z-10 flex items-center gap-2 font-bold text-[15px]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Start for free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
          
          <a
            href="/docs"
            className="group flex items-center gap-3 px-8 py-4 text-[15px] font-medium text-gray-300 hover:text-white transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center group-hover:bg-white/[0.1] transition-colors">
              <Terminal size={18} />
            </div>
            Read Docs
          </a>
        </div>
      </div>
    </section>
  );
}
