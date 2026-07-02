/** @jsxImportSource react */
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { BrainCircuit, Cpu, ShieldAlert, Activity, BellRing, BarChart3 } from 'lucide-react';

const features = [
  {
    id: 'ai',
    icon: <BrainCircuit size={24} strokeWidth={1.5} />,
    title: 'AI Root Cause Analysis',
    description: 'Cerebras AI analyzes every error and explains the fix — in your native language.',
    image: '/images/ai_brain_1782019201900.webp',
    gradient: 'from-fuchsia-500 to-pink-600',
    hoverBorder: 'rgba(236,72,153,0.4)',
    className: 'md:col-span-2 md:row-span-2',
    imageClassName: 'opacity-60 mix-blend-screen',
    imageMask: { maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' },
  },
  {
    id: 'sdk',
    icon: <Cpu size={22} strokeWidth={1.5} />,
    title: 'Multi-Framework SDKs',
    description: 'One-line integration for React, Next.js, Go, and more.',
    image: '/images/cross_project_1782019244131.webp',
    gradient: 'from-violet-500 to-purple-600',
    hoverBorder: 'rgba(139,92,246,0.4)',
    className: 'md:col-span-1 md:row-span-1',
    imageClassName: 'opacity-50',
    imageMask: { maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' },
  },
  {
    id: 'pii',
    icon: <ShieldAlert size={22} strokeWidth={1.5} />,
    title: 'PII Auto-Masking',
    description: 'Passwords and credit cards are redacted before leaving the browser.',
    image: '/images/rbac_lock_1782019297789.webp',
    gradient: 'from-emerald-500 to-green-600',
    hoverBorder: 'rgba(16,185,129,0.4)',
    className: 'md:col-span-1 md:row-span-1',
    imageClassName: 'opacity-50',
    imageMask: { maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' },
  },
  {
    id: 'streaming',
    icon: <Activity size={22} strokeWidth={1.5} />,
    title: 'Real-Time Streaming',
    description: 'Errors appear instantly. No polling. Built on Go.',
    image: '/images/data_stream_1782019212557.webp',
    gradient: 'from-cyan-500 to-blue-600',
    hoverBorder: 'rgba(6,182,212,0.4)',
    className: 'md:col-span-1 md:row-span-1',
    imageClassName: 'opacity-50',
    imageMask: { maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' },
  },
  {
    id: 'notifs',
    icon: <BellRing size={22} strokeWidth={1.5} />,
    title: 'Smart Notifications',
    description: 'Get alerted via Email, Slack and WhatsApp. Smart grouping prevents fatigue.',
    image: '/images/global_map_1782019310204.webp',
    gradient: 'from-orange-500 to-amber-600',
    hoverBorder: 'rgba(249,115,22,0.4)',
    className: 'md:col-span-1 md:row-span-1',
    imageClassName: 'opacity-50',
    imageMask: { maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' },
  },
  {
    id: 'perf',
    icon: <BarChart3 size={22} strokeWidth={1.5} />,
    title: 'Performance Vitals',
    description: 'Track Web Vitals (LCP, FID) and correlate regressions with errors.',
    image: '/images/session_vault_1782019322775.webp',
    gradient: 'from-rose-500 to-red-600',
    hoverBorder: 'rgba(244,63,94,0.4)',
    className: 'md:col-span-1 md:row-span-1',
    imageClassName: 'opacity-50',
    imageMask: { maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' },
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (headerRef.current) {
              gsap.fromTo(headerRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' });
            }
            if (cardsRef.current) {
              const cards = cardsRef.current.children;
              gsap.fromTo(cards, 
                { y: 80, opacity: 0, scale: 0.95 }, 
                { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.2 }
              );
            }
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="relative py-32 overflow-hidden bg-[#030303]">
      
      {/* Luxury Minimalist Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[30%] left-[-10%] w-[30%] h-[30%] rounded-full bg-cyan-600/5 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-600/5 blur-[120px]"></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div ref={headerRef} className="mb-20 opacity-0 max-w-2xl">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Activity size={14} /> Ecosystem
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-extrabold text-white tracking-[-0.03em] leading-[1.1] mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            The ultimate toolkit.<br />
            <span className="text-gray-500 font-medium">Without the clutter.</span>
          </h2>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 auto-rows-[auto] md:auto-rows-[340px] gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`group relative bg-[#080808] rounded-[2rem] overflow-hidden opacity-0 flex flex-col justify-end ${feature.className}`}
              style={{ border: '1px solid rgba(255,255,255,0.05)', transition: 'border-color 0.5s ease, box-shadow 0.5s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = feature.hoverBorder; e.currentTarget.style.boxShadow = `0 0 30px ${feature.hoverBorder.replace('0.4', '0.08')}`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* Full Background Image */}
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-transparent z-10"></div>
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className={`w-full h-[75%] object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out ${feature.imageClassName}`} 
                  style={feature.imageMask}
                  loading="lazy"
                />
              </div>

              {/* Content overlay */}
              <div className={`relative z-20 flex flex-col justify-end h-full p-8 ${feature.id === 'ai' ? 'md:p-10' : ''}`}>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 text-white shadow-lg shadow-black/50 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500`}>
                  {feature.icon}
                </div>
                <h3 className={`${feature.id === 'ai' ? 'text-3xl' : 'text-xl'} font-bold text-white mb-3`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {feature.title}
                </h3>
                <p className={`${feature.id === 'ai' ? 'text-base max-w-md' : 'text-[14px]'} text-gray-400 leading-relaxed`} style={{ fontFamily: "'Inter', sans-serif" }}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
