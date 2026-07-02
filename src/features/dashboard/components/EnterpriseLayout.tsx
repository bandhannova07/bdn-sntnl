/** @jsxImportSource react */
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Network, 
  ScrollText, 
  LockKeyhole, 
  Globe2, 
  SlidersHorizontal, 
  BrainCircuit, 
  Zap, 
  LineChart, 
  Archive 
} from 'lucide-react';

const menuItems = [
  { id: 'command-center', icon: <ShieldCheck size={18} strokeWidth={1.5} />, label: 'Global Security Command Center' },
  { id: 'matrix-view', icon: <Network size={18} strokeWidth={1.5} />, label: 'Cross-Project Matrix' },
  { id: 'audit-log', icon: <ScrollText size={18} strokeWidth={1.5} />, label: 'Immutable Audit Log' },
  { id: 'rbac', icon: <LockKeyhole size={18} strokeWidth={1.5} />, label: 'Advanced RBAC Builder' },
  { id: 'data-residency', icon: <Globe2 size={18} strokeWidth={1.5} />, label: 'Data Residency & PII' },
  { id: 'quota', icon: <SlidersHorizontal size={18} strokeWidth={1.5} />, label: 'Dynamic Quota Allocation' },
  { id: 'private-ai', icon: <BrainCircuit size={18} strokeWidth={1.5} />, label: 'Private AI Tuning' },
  { id: 'runbooks', icon: <Zap size={18} strokeWidth={1.5} />, label: 'Automated Runbooks' },
  { id: 'reports', icon: <LineChart size={18} strokeWidth={1.5} />, label: 'Executive Health Reports' },
  { id: 'session-vault', icon: <Archive size={18} strokeWidth={1.5} />, label: 'Secure Session Vault' },
];

export default function EnterpriseLayout() {
  const [activeTab, setActiveTab] = useState('command-center');

  return (
    <div className="flex h-screen bg-[#030303] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-[#080808] border-r border-white/[0.04] flex flex-col">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-white/[0.04]">
          <img src="/favicon.ico?v=2" alt="Sentinel Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(167,139,250,0.5)]" />
          <span className="font-bold tracking-widest text-xl bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 drop-shadow-[0_0_2px_rgba(167,139,250,0.25)] mt-1" style={{ fontFamily: "'Virgo 01', sans-serif", letterSpacing: "2px" }}>Sentinel <span className="text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0px" }}>Enterprise</span></span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-violet-500/10 text-violet-400 shadow-[inset_2px_0_0_#8b5cf6]' 
                  : 'text-gray-400 hover:bg-white/[0.02] hover:text-gray-200'
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-[13px] font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-white/[0.04]">
          <div className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.04] flex items-center justify-between cursor-pointer hover:bg-white/[0.04] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-[12px]">ME</div>
              <div>
                <p className="text-[12px] font-medium text-white">Acme Corp</p>
                <p className="text-[10px] text-emerald-400">SOC2 Compliant</p>
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.05),transparent_50%)]">
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/[0.04] backdrop-blur-md">
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {menuItems.find(i => i.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div> System Healthy
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'command-center' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
              {/* Security Overview Cards */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'SAML SSO Policy', value: 'Enforced', color: 'text-emerald-400', sub: 'Single Sign-On configured' },
                  { label: 'Multi-Factor Auth', value: 'Required', color: 'text-emerald-400', sub: 'Zero-trust identity verification' },
                  { label: 'PII Auto-Scrubbing', value: 'Enabled', color: 'text-cyan-400', sub: 'Real-time client payload redaction' },
                  { label: 'Audit Ledger Mode', value: 'Immutable', color: 'text-violet-400', sub: 'SOC-2 compliant logging' },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.1] transition-colors">
                    <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color} mb-1`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{stat.value}</p>
                    <p className="text-[12px] text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>{stat.sub}</p>
                  </div>
                ))}
              </div>

              {/* Main Map / Matrix area */}
              <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-3xl overflow-hidden relative min-h-[500px] flex items-center justify-center p-12">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none"></div>
                <img src="/images/global_map_1782019310204.webp" alt="Global Security Map" className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-60" />
                
                <div className="relative z-20 w-full h-full flex flex-col justify-end">
                  <div className="bg-black/40 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 inline-block w-full max-w-md">
                    <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Active Policy Status</h3>
                    <div className="space-y-3">
                      {[
                        { time: 'Active', event: 'SAML 2.0 Identity Provider authentication policy enforced.', severity: 'info' },
                        { time: 'Active', event: 'Automated PII scrubbing filter operational on ingestion pipeline.', severity: 'info' },
                        { time: 'Active', event: 'Immutable audit log synchronization verified.', severity: 'info' },
                      ].map((log, i) => (
                        <div key={i} className="flex gap-3 text-[12px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                          <span className="text-gray-500 shrink-0 w-12">{log.time}</span>
                          <span className="w-1.5 h-1.5 rounded-full mt-1 shrink-0 bg-emerald-500"></span>
                          <span className="text-gray-300 leading-relaxed">{log.event}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'command-center' && (
            <div className="flex flex-col items-center justify-center h-full text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-24 h-24 mb-6 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-4xl">
                {menuItems.find(i => i.id === activeTab)?.icon}
              </div>
              <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {menuItems.find(i => i.id === activeTab)?.label}
              </h2>
              <p className="text-[14px] text-gray-400 max-w-md" style={{ fontFamily: "'Inter', sans-serif" }}>
                This enterprise feature is currently being provisioned for your organization's dedicated cluster.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
