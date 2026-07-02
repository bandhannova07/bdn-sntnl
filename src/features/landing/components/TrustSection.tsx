/** @jsxImportSource react */
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ShieldCheck, Fingerprint, GlobeLock } from 'lucide-react';

export default function TrustSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = gsap.timeline();
            
            tl.fromTo(titleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
              .fromTo(card1Ref.current, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5')
              .fromTo(card2Ref.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6')
              .fromTo(card3Ref.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6');
              
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
    <section ref={sectionRef} className="relative py-32 bg-[#030303] overflow-hidden">
      
      {/* Luxury Minimalist Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-cyan-600/5 blur-[120px]"></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        <div ref={titleRef} className="mb-20 opacity-0 max-w-3xl">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-[-0.03em] mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Engineered for <span className="italic text-gray-500 font-light">Zero Trust.</span>
          </h2>
          <p className="text-lg text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
            Enterprise compliance isn't an afterthought. It's built into the core. We protect your intellectual property with immutable logs and global residency controls.
          </p>
        </div>

        {/* Asymmetrical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Large Card */}
          <div ref={card1Ref} className="lg:col-span-6 group relative rounded-[2.5rem] bg-[#080808] overflow-hidden opacity-0 flex flex-col justify-end min-h-[500px] p-10" style={{ border: '1px solid rgba(255,255,255,0.05)', transition: 'border-color 0.7s ease, box-shadow 0.7s ease' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(139,92,246,0.08)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div className="absolute inset-0 z-0">
              <img src="/images/security_shield_1782019234695.webp" alt="Security" className="w-full h-full object-cover opacity-40 mix-blend-screen transform group-hover:scale-105 transition-transform duration-1000" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent"></div>
            </div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 border border-violet-500/20 flex items-center justify-center mb-6 text-violet-400 backdrop-blur-md">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Global Command Center</h3>
              <p className="text-gray-400 text-lg max-w-md" style={{ fontFamily: "'Inter', sans-serif" }}>
                Enforce SAML SSO, strict 2FA, and monitor access across thousands of projects from a single pane of glass.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Small Card 1 — Immutable Logs */}
            <div ref={card2Ref} className="flex-1 group relative rounded-[2.5rem] bg-[#080808] overflow-hidden opacity-0 flex items-center" style={{ border: '1px solid rgba(255,255,255,0.05)', transition: 'border-color 0.7s ease, box-shadow 0.7s ease' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(6,182,212,0.4)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(6,182,212,0.08)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = 'none'; }}>
              {/* Image constrained to right side only, with left-side fade that clips the image */}
              <div className="absolute right-0 top-0 bottom-0 w-[45%] z-0 overflow-hidden">
                <img 
                  src="/images/audit_ledger_1782019255466.webp" 
                  className="w-full h-full object-cover opacity-50 mix-blend-screen transition-transform duration-700" 
                  loading="lazy"
                  style={{ 
                    maskImage: 'linear-gradient(to right, transparent 0%, black 40%)', 
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 40%)' 
                  }}
                />
              </div>
              <div className="relative z-10 p-10 w-2/3">
                <div className="flex items-center gap-3 mb-4">
                  <Fingerprint size={24} className="text-cyan-400" />
                  <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Immutable Logs</h3>
                </div>
                <p className="text-base text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>Cryptographically verified audit trails for SOC2 compliance.</p>
              </div>
            </div>

            {/* Small Card 2 — Data Residency */}
            <div ref={card3Ref} className="flex-1 group relative rounded-[2.5rem] bg-[#080808] overflow-hidden opacity-0 flex items-center" style={{ border: '1px solid rgba(255,255,255,0.05)', transition: 'border-color 0.7s ease, box-shadow 0.7s ease' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.4)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(16,185,129,0.08)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div className="absolute right-0 top-0 bottom-0 w-[45%] z-0 overflow-hidden">
                <img 
                  src="/images/compliance_badge_1782019269041.webp" 
                  className="w-full h-full object-cover opacity-50 mix-blend-screen transition-transform duration-700" 
                  loading="lazy"
                  style={{ 
                    maskImage: 'linear-gradient(to right, transparent 0%, black 40%)', 
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 40%)' 
                  }}
                />
              </div>
              <div className="relative z-10 p-10 w-2/3">
                <div className="flex items-center gap-3 mb-4">
                  <GlobeLock size={24} className="text-emerald-400" />
                  <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Data Residency</h3>
                </div>
                <p className="text-base text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>Keep data in the EU or US. Automatic PII redaction ensures GDPR alignment.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
