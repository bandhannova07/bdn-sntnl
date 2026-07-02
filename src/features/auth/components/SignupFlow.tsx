/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';

export default function SignupFlow() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    orgName: '',
    orgDomain: '',
    agreePolicies: false,
    productUpdates: false,
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const token = localStorage.getItem('sentinel_session_token');
    const savedUser = localStorage.getItem('sentinel_user');
    if (token && savedUser) {
      window.location.href = '/dashboard';
    }
  }, []);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username.trim() || !formData.orgName.trim() || !formData.email.trim() || !formData.agreePolicies) {
      setFormError('Please fill all required fields and agree to the policies.');
      return;
    }

    if (!emailRegex.test(formData.email.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }
    
    // Save onboarding data to local storage for the /signin page to consume
    localStorage.setItem('pending_signup_org', JSON.stringify({
      orgName: formData.orgName,
      orgDomain: formData.orgDomain
    }));
    
    // Redirect to the dedicated signin page
    window.location.href = '/signin';
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#030303] py-12">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img src="/favicon.ico?v=2" alt="Sentinel Logo" className="w-14 h-14 object-contain drop-shadow-[0_0_15px_rgba(167,139,250,0.5)] hover:scale-110 transition-transform duration-500" />
            <span className="text-4xl tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 drop-shadow-[0_0_2px_rgba(167,139,250,0.25)] mt-1" style={{ fontFamily: "'Virgo 01', sans-serif", letterSpacing: "2px" }}>
              Sentinel
            </span>
          </a>
        </div>

        <div className="bg-[#0a0a0a]/80 border border-white/[0.08] rounded-3xl p-10 md:p-12 backdrop-blur-3xl shadow-2xl">
          <form onSubmit={handleNext} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Create your workspace</h2>
              <p className="text-[15px] text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>Set up your organization to start monitoring errors with Cerebras AI.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="md:col-span-2">
                <label className="block text-[13px] font-semibold text-gray-300 mb-2 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Your Name *</label>
                <input 
                  type="text" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-5 py-4 text-[15px] text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-300 mb-2 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Email Address *</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="e.g. you@company.com"
                  className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-5 py-4 text-[15px] text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-300 mb-2 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Organization Name *</label>
                <input 
                  type="text" 
                  value={formData.orgName}
                  onChange={(e) => setFormData({...formData, orgName: e.target.value})}
                  placeholder="e.g. Acme Corp"
                  className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-5 py-4 text-[15px] text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-300 mb-2 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Organization Domain</label>
                <input 
                  type="text" 
                  value={formData.orgDomain}
                  onChange={(e) => setFormData({...formData, orgDomain: e.target.value})}
                  placeholder="e.g. acme.com"
                  className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-5 py-4 text-[15px] text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            {formError && (
              <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {formError}
              </div>
            )}

            <div className="space-y-4 mb-10 bg-white/[0.02] border border-white/[0.04] rounded-2xl p-5">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5">
                  <input 
                    type="checkbox" 
                    checked={formData.agreePolicies}
                    onChange={(e) => setFormData({...formData, agreePolicies: e.target.checked})}
                    className="w-4 h-4 rounded border-white/[0.1] bg-[#111111] text-violet-500 focus:ring-violet-500/20"
                  />
                </div>
                <span className="text-[14px] text-gray-400 group-hover:text-gray-300 transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                  I agree to the <a href="/tos" target="_blank" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">Terms of Service</a> and <a href="/privacy" target="_blank" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">Privacy Policy</a>.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5">
                  <input 
                    type="checkbox" 
                    checked={formData.productUpdates}
                    onChange={(e) => setFormData({...formData, productUpdates: e.target.checked})}
                    className="w-4 h-4 rounded border-white/[0.1] bg-[#111111] text-violet-500 focus:ring-violet-500/20"
                  />
                </div>
                <span className="text-[14px] text-gray-400 group-hover:text-gray-300 transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Send me product updates and security alerts via email.
                </span>
              </label>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl font-bold text-[15px] transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2"
            >
              Continue to Sign In
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>

            <div className="mt-8 text-center">
              <a 
                href="/signin"
                className="text-[14px] text-gray-400 hover:text-white transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Already have an account? <span className="text-violet-400 font-semibold">Log in directly</span>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
