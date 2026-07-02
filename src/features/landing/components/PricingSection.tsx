/** @jsxImportSource react */
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const plans = [
  {
    name: 'Hobby',
    price: '$0',
    period: '/mo',
    description: 'For solo devs working on small projects.',
    features: ['1 User', '1 Project', '7,000 errors/mo', '5GB logs', '5GB Application Metrics', '7M spans tracing'],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Developer',
    price: '$20',
    period: '/mo',
    description: 'Everything to monitor your application.',
    features: ['Unlimited Users', 'Unlimited Projects', '50,000 errors/mo', '50 Metric Monitors', '50 Replays', '1 uptime monitoring'],
    cta: 'Upgrade Now',
    popular: true,
  },
  {
    name: 'Business',
    price: '$70',
    period: '/mo',
    description: 'For teams needing powerful debugging.',
    features: ['Unlimited Users', 'Unlimited Projects', '100,000 errors/mo', '10M spans tracing', '70 Replays', '5 uptime monitoring'],
    cta: 'Upgrade Now',
    popular: false,
  },
];

export default function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && cardsRef.current) {
            gsap.fromTo(cardsRef.current.children,
              { y: 60, opacity: 0, scale: 0.96 },
              { y: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out' }
            );
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
    <section ref={sectionRef} id="pricing" className="relative py-32 bg-[#030303]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-fuchsia-400 bg-fuchsia-500/10 border border-fuchsia-500/15 rounded-full mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
            Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-[-0.02em] mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Simple,{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-pink-400">transparent</span>
            {' '}pricing
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Start free. Scale as you grow. No hidden fees.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-16">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 opacity-0 ${
                plan.popular
                  ? 'bg-gradient-to-b from-violet-950/40 to-fuchsia-950/20 border-2 border-violet-500/25 shadow-2xl shadow-violet-600/10'
                  : 'bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04]'
              }`}
              style={{ perspective: '600px' }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                gsap.to(e.currentTarget, { rotateY: x * 5, rotateX: -y * 5, duration: 0.4, ease: 'power2.out' });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power2.out' });
              }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 text-[11px] font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full shadow-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{plan.name}</h3>
              <p className="text-[13px] text-gray-500 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>{plan.description}</p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{plan.price}</span>
                {plan.period && <span className="text-gray-500 text-sm">{plan.period}</span>}
              </div>

              <a
                href="/signup"
                className={`block w-full py-3.5 text-center text-[13px] font-semibold rounded-xl transition-all duration-300 ${
                  plan.popular
                    ? 'text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-600/20 hover:-translate-y-0.5'
                    : 'text-gray-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {plan.cta}
              </a>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-[13px] text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={plan.popular ? '#a78bfa' : '#555'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* View all detailed pricing CTA */}
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm text-gray-500 max-w-md" style={{ fontFamily: "'Inter', sans-serif" }}>
            Need dynamic currency conversions, more custom volumes, or pay-as-you-grow limits?
          </p>
          <a
            href="/pricing"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-violet-600/20 hover:-translate-y-0.5 transition-all duration-300"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <span>View Detailed Pricing & Plans</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
