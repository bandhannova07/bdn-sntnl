/** @jsxImportSource react */
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const numbersRef = useRef<(HTMLSpanElement | null)[]>([]);

  const stats = [
    { value: 100, suffix: '%', label: 'Go-Powered Ingestion Architecture', color: 'text-violet-400' },
    { value: 99.9, suffix: '%', label: 'Engineered Uptime SLA Target', color: 'text-emerald-400' },
    { value: 0, suffix: ' PII', label: 'Zero Plaintext PII Stored', color: 'text-cyan-400' },
    { value: 1, suffix: '-Line', label: 'Universal SDK Integration', color: 'text-fuchsia-400' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            numbersRef.current.forEach((el, i) => {
              if (el) {
                const target = stats[i].value;
                const obj = { val: 0 };
                gsap.to(obj, {
                  val: target,
                  duration: 2,
                  delay: i * 0.15,
                  ease: 'power2.out',
                  onUpdate: () => {
                    el.textContent = target % 1 === 0 ? Math.round(obj.val).toString() : obj.val.toFixed(1);
                  }
                });
              }
            });
            gsap.fromTo(sectionRef.current?.querySelectorAll('.stat-card') || [],
              { y: 50, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
            );
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-950/10 via-transparent to-fuchsia-950/10 pointer-events-none"></div>
      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card text-center p-8 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:bg-white/[0.04] transition-all duration-500 hover:-translate-y-1 opacity-0">
              <div className={`text-4xl lg:text-5xl font-extrabold ${stat.color} mb-2`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <span ref={(el) => { numbersRef.current[i] = el; }}>0</span>
                <span className="text-2xl">{stat.suffix}</span>
              </div>
              <p className="text-[13px] text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
