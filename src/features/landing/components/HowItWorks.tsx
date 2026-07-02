/** @jsxImportSource react */
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Bot, CheckCircle2, AlertCircle } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Install the SDK',
    description: 'Add a single line of code to your app. Sentinel automatically captures errors, crashes, and performance metrics.',
    code: `import Sentinel from '@bandhannova/sentinel';\nSentinel.init({ projectId: 'proj_12345' });`,
    gradient: 'from-violet-500 to-purple-600',
    hoverBorder: 'rgba(139,92,246,0.4)',
    type: 'code'
  },
  {
    step: '02',
    title: 'Errors Stream In',
    description: 'Every unhandled exception, promise rejection, and console error flows into your Sentinel dashboard in real-time.',
    code: `[INGEST] Project: proj_12345\n  Error ID: 847\n  Error: TypeError at UserList.tsx:42\n  Stack: 3 frames captured\n  PII: 2 fields auto-masked ✓`,
    gradient: 'from-fuchsia-500 to-pink-600',
    hoverBorder: 'rgba(236,72,153,0.4)',
    type: 'code'
  },
  {
    step: '03',
    title: 'AI Explains & Fixes',
    description: 'Our AI instantly analyzes the root cause and writes a production-ready fix suggestion in plain English.',
    gradient: 'from-cyan-500 to-blue-600',
    hoverBorder: 'rgba(6,182,212,0.4)',
    type: 'ui'
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && stepsRef.current) {
            const items = stepsRef.current.children;
            gsap.fromTo(items,
              { x: -80, opacity: 0, scale: 0.95 },
              { x: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.25, ease: 'power3.out' }
            );
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="relative py-32 overflow-hidden bg-[#030303]">
      
      {/* Luxury Minimalist Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-violet-600/5 blur-[120px]"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/5 blur-[120px]"></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400 bg-cyan-500/10 border border-cyan-500/15 rounded-full mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
            How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-[-0.02em] mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Three steps to
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400"> zero downtime</span>
          </h2>
        </div>

        <div ref={stepsRef} className="space-y-12">
          {steps.map((step, i) => (
            <div key={i} className="group flex flex-col lg:flex-row gap-8 items-stretch opacity-0">
              {/* Left: Info */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <span className={`text-[13px] font-bold text-transparent bg-clip-text bg-gradient-to-r ${step.gradient} uppercase tracking-widest`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Step {step.step}
                  </span>
                  <div className={`flex-1 h-[1px] bg-gradient-to-r ${step.gradient} opacity-20`}></div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {step.title}
                </h3>
                <p className="text-[15px] text-gray-400 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {step.description}
                </p>
              </div>
              
              {/* Right: Code block or UI Mock */}
              <div className="flex-1">
                {step.type === 'code' ? (
                  <div className="bg-[#0a0a0a] rounded-2xl overflow-hidden transition-all duration-500" style={{ border: '1px solid rgba(255,255,255,0.06)' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = step.hoverBorder; e.currentTarget.style.boxShadow = `0 0 30px ${step.hoverBorder.replace('0.4','0.08')}`; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div className="flex items-center gap-1.5 px-4 py-3 bg-[#080808] border-b border-white/[0.04]">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></div>
                    </div>
                    <pre className="p-5 text-[13px] text-gray-300 overflow-x-auto leading-relaxed" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      <code>{step.code}</code>
                    </pre>
                  </div>
                ) : (
                  <div className="bg-[#0a0a0a] rounded-2xl p-6 transition-all duration-500 flex flex-col gap-4" style={{ border: '1px solid rgba(255,255,255,0.06)' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = step.hoverBorder; e.currentTarget.style.boxShadow = `0 0 30px ${step.hoverBorder.replace('0.4','0.08')}`; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Bot size={16} />
                      </div>
                      <span className="text-white font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Cerebras AI Diagnostics</span>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-start gap-3">
                        <AlertCircle size={16} className="text-rose-400 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="text-sm font-semibold text-gray-200 mb-1">Root Cause</h4>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            The <code className="text-pink-400 bg-pink-400/10 px-1 py-0.5 rounded">.map()</code> function is being called on <code className="text-pink-400 bg-pink-400/10 px-1 py-0.5 rounded">users</code> before the API request has resolved, resulting in a <code className="text-pink-400 bg-pink-400/10 px-1 py-0.5 rounded">TypeError: Cannot read properties of undefined</code>.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="text-sm font-semibold text-emerald-200 mb-2">Suggested Fix</h4>
                          <p className="text-xs text-emerald-400/80 mb-3">Add optional chaining to ensure the array exists before mapping over it.</p>
                          <pre className="text-xs bg-[#050505] p-3 rounded-lg border border-white/[0.04] text-gray-300">
                            <span className="text-rose-400 line-through opacity-60">- data.users.map(user =&gt; ...)</span><br/>
                            <span className="text-emerald-400">+ data?.users?.map(user =&gt; ...)</span>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
