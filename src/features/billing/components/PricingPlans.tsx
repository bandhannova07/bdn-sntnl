/** @jsxImportSource react */
import React, { useState, useEffect, useRef } from 'react';
import { gsap as gs } from 'gsap';
import { API_BASE } from '../../../config';
import { Check, ShieldCheck } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const usdPricing = {
  developer: { "1_week": 7, "2_week": 13, "3_week": 17, "1_month": 20 },
  business: { "1_week": 20, "2_week": 38, "3_week": 55, "1_month": 70 }
};

const inrPricing = {
  developer: { "1_week": 595, "2_week": 1105, "3_week": 1445, "1_month": 1700 },
  business: { "1_week": 1700, "2_week": 3230, "3_week": 4675, "1_month": 5950 }
};

const TABS = [
  { id: '1_week', label: '1 Week' },
  { id: '2_week', label: '2 Weeks' },
  { id: '3_week', label: '3 Weeks' },
  { id: '1_month', label: '1 Month' }
];

export default function PricingPlans() {
  const [cycle, setCycle] = useState('1_month');
  const [isIndia, setIsIndia] = useState(false);
  const [loading, setLoading] = useState(false);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Check GeoLocation for pricing display
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.country_code === 'IN') setIsIndia(true);
      })
      .catch(() => {}); // default to USD if failed

    // GSAP Entry Animation
    gs.fromTo(cardsRef.current, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
    );
  }, []);

  const getPrice = (tier: 'developer' | 'business') => {
    if (isIndia) return `₹${inrPricing[tier][cycle as keyof typeof usdPricing.developer]}`;
    return `$${usdPricing[tier][cycle as keyof typeof usdPricing.developer]}`;
  };

  const handleUpgrade = async (tier: string) => {
    if (tier === 'hobby' || tier === 'enterprise') return;
    setLoading(true);

    try {
      const userStr = localStorage.getItem('sentinel_user');
      const user = userStr ? JSON.parse(userStr) : { id: "test_user", name: "Test User", email: "test@example.com" };

      const res = await fetch(`${API_BASE}/api/billing/create-order`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, cycle, user_id: user.id })
      });
      
      const orderData = await res.json();

      if (!orderData.order_id) {
        alert("Failed to create order");
        setLoading(false);
        return;
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Sentinel By BandhanNova",
        description: `Upgrade to ${tier.toUpperCase()}`,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          const verifyRes = await fetch(`${API_BASE}/api/billing/verify`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              user_id: user.id,
              tier,
              cycle
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Payment successful! Your plan has been upgraded.");
            window.location.href = '/dashboard';
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#8b5cf6" // Violet 500
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (err) {
      console.error(err);
      alert("Something went wrong initializing checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 px-4 md:px-8 max-w-[1600px] mx-auto flex flex-col items-center w-full">
      <div className="text-center mb-16 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Simple, Transparent Pricing
        </h1>
        <p className="text-gray-400 text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
          Scale your monitoring as you grow. Choose a flexible billing cycle that fits your team's needs without long-term lock-ins.
        </p>

        {/* Cycle Toggle */}
        <div className="mt-10 bg-white/[0.02] border border-white/[0.05] p-1.5 rounded-2xl inline-flex gap-1 backdrop-blur-xl">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setCycle(t.id)}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                cycle === t.id 
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02] border border-transparent'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        
        {/* Hobby Plan */}
        <div ref={el => cardsRef.current[0] = el} className="bg-white/[0.02] hover:bg-white/[0.04] transition-colors border border-white/[0.06] rounded-3xl p-8 flex flex-col relative overflow-hidden">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Hobby</h3>
            <p className="text-sm text-gray-400">For solo devs working on small projects</p>
          </div>
          <div className="mb-8">
            <span className="text-4xl font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{isIndia ? '₹0' : '$0'}</span>
          </div>
          <button disabled className="w-full py-3 px-4 bg-white/5 text-gray-500 rounded-xl font-bold text-sm cursor-not-allowed mb-8">
            Current Plan
          </button>
          <div className="space-y-4 text-sm text-gray-300 flex-1" style={{ fontFamily: "'Inter', sans-serif" }}>
            {['1 User', '1 Project', '7k errors', '5GB logs', '5GB Application Metrics', '7M spans tracing', '50 Replays', '1 uptime monitoring', '1 cron monitoring', '30 Metric Monitors', 'Attachment 2GB', '100 Builds'].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <Check size={16} className="text-violet-400 shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Plan */}
        <div ref={el => cardsRef.current[1] = el} className="bg-white/[0.03] border border-violet-500/30 rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.1)] transform lg:-translate-y-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-3xl rounded-full"></div>
          <div className="mb-6 relative z-10">
            <span className="bg-violet-500/20 text-violet-300 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest absolute right-0 top-0">Most Popular</span>
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Developer</h3>
            <p className="text-sm text-gray-400">Everything to monitor your application</p>
          </div>
          <div className="mb-8 relative z-10">
            <span className="text-4xl font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{getPrice('developer')}</span>
          </div>
          <button onClick={() => handleUpgrade('developer')} disabled={loading} className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold text-sm transition-colors mb-8 shadow-[0_0_15px_rgba(139,92,246,0.4)] relative z-10">
            {loading ? 'Processing...' : 'Upgrade Now'}
          </button>
          <div className="space-y-4 text-sm text-gray-300 flex-1 relative z-10" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="font-semibold text-white mb-2">Hobby features +</div>
            {['Unlimited Users', 'Unlimited Projects', '50k errors', '50 Metric Monitors'].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <Check size={16} className="text-fuchsia-400 shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Business Plan */}
        <div ref={el => cardsRef.current[2] = el} className="bg-white/[0.02] hover:bg-white/[0.04] transition-colors border border-white/[0.06] rounded-3xl p-8 flex flex-col relative overflow-hidden">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Business</h3>
            <p className="text-sm text-gray-400">For teams needing powerful debugging</p>
          </div>
          <div className="mb-8">
            <span className="text-4xl font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{getPrice('business')}</span>
          </div>
          <button onClick={() => handleUpgrade('business')} disabled={loading} className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-colors mb-8">
            {loading ? 'Processing...' : 'Upgrade Now'}
          </button>
          <div className="space-y-4 text-sm text-gray-300 flex-1" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="font-semibold text-white mb-2">Developer features +</div>
            {['100k errors', '10M spans tracing', '70 Replays', '5 cron monitoring', 'Attachment 5GB', '300 Builds'].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <Check size={16} className="text-violet-400 shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise Plan */}
        <div ref={el => cardsRef.current[3] = el} className="bg-[#0a0a0a] border border-white/[0.04] rounded-3xl p-8 flex flex-col relative overflow-hidden opacity-80">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-300 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Enterprise</h3>
            <p className="text-sm text-gray-500">For orgs with advanced needs</p>
          </div>
          <div className="mb-8">
            <span className="text-2xl font-bold text-gray-400 uppercase tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Custom</span>
          </div>
          <button disabled className="w-full py-3 px-4 bg-white/[0.02] border border-white/5 text-gray-500 rounded-xl font-bold text-sm mb-8 uppercase tracking-widest">
            Coming Soon
          </button>
          <div className="space-y-4 text-sm text-gray-500 flex-1" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="font-semibold text-gray-400 mb-2">Business features +</div>
            {['Dedicated Support', 'Custom Quotas', 'On-Premise Deployment', 'SLA Guarantees'].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-gray-600 shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
