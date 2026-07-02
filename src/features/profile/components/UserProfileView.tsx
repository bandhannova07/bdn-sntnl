/** @jsxImportSource react */
import React from 'react';
import { User, Shield, Zap, Sparkles, Activity, Key, FileText, Lock, ExternalLink, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  org_id?: string;
  org_name?: string;
  role?: string;
}

interface UserProfileViewProps {
  user: UserProfile | null;
  onUpgradePlan: () => void;
  onNavigateToApiKeys: () => void;
  onLogout: () => void;
}

export function UserProfileView({ user, onUpgradePlan, onNavigateToApiKeys, onLogout }: UserProfileViewProps) {
  const userName = user?.name || 'BandhanNova Administrator';
  const userEmail = user?.email || 'dev@bandhannova.com';
  const userRole = user?.role || 'Platform Owner';
  const orgName = user?.org_name || 'BandhanNova Sentinel Platforms';
  const userId = user?.id || 'usr_sentinel_live_07';

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-900/40 via-fuchsia-900/20 to-black border border-white/10 p-8 md:p-10 shadow-2xl backdrop-blur-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              {user?.picture ? (
                <img src={user.picture} alt={userName} className="w-24 h-24 rounded-3xl border-2 border-violet-400/50 shadow-[0_0_25px_rgba(167,139,250,0.3)] object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_25px_rgba(167,139,250,0.4)]">
                  {userName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#09090b] shadow-lg flex items-center justify-center">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {userName}
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1">
                  <Shield size={12} /> {userRole}
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-1 flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                <span>{userEmail}</span>
                <span className="text-gray-600">•</span>
                <span className="text-violet-400 font-mono text-xs">{userId}</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Organization: <span className="text-gray-300 font-semibold">{orgName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={onNavigateToApiKeys}
              className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Key size={14} className="text-violet-400" />
              API Security
            </button>
            <button
              onClick={onLogout}
              className="px-5 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Plan Details & Limitation Usages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Current Plan Overview */}
        <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-8 backdrop-blur-2xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                <Zap size={14} /> Subscription Status
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Developer Growth Plan
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Full access to AI Root Cause Seer, real-time telemetry, and distributed distributed APM monitoring.
            </p>

            <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Billing Cycle</span>
                <span className="text-white font-semibold">Monthly Auto-Renew</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Retention Window</span>
                <span className="text-white font-semibold">30 Days Telemetry</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">AI Engine</span>
                <span className="text-fuchsia-400 font-semibold">Cerebras Llama-3.3 70B</span>
              </div>
            </div>
          </div>

          <button
            onClick={onUpgradePlan}
            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-4 px-6 rounded-2xl shadow-[0_0_25px_rgba(139,92,246,0.25)] hover:shadow-[0_0_35px_rgba(139,92,246,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
            <span className="text-sm tracking-wide">Explore Pricing & Upgrade</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Right 2 Columns: Quota Limitation & Real-time Usages */}
        <div className="lg:col-span-2 bg-white/[0.01] border border-white/5 rounded-3xl p-8 backdrop-blur-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Plan Limitations & Live Quota Usage
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Real-time telemetry usage resets on the 1st of every calendar month.</p>
            </div>
            <span className="text-xs text-gray-500 font-mono">Cycle: Jun 1 - Jun 30</span>
          </div>

          <div className="space-y-6">
            {/* Exception Quota */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300 font-medium flex items-center gap-2">
                  <Activity size={14} className="text-violet-400" /> Error Exception Ingestion
                </span>
                <span className="text-white font-mono font-semibold">14,250 <span className="text-gray-500">/ 50,000</span></span>
              </div>
              <div className="w-full h-2.5 bg-white/[0.05] rounded-full overflow-hidden p-0.5 border border-white/5">
                <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full w-[28.5%] transition-all duration-1000 shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
              </div>
              <div className="flex justify-between text-[11px] text-gray-500">
                <span>28.5% capacity consumed</span>
                <span>35,750 logs remaining</span>
              </div>
            </div>

            {/* Sentinel AI Quota */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300 font-medium flex items-center gap-2">
                  <Sparkles size={14} className="text-fuchsia-400" /> Sentinel AI Root Cause Analysis
                </span>
                <span className="text-white font-mono font-semibold">42 <span className="text-gray-500">/ 100</span></span>
              </div>
              <div className="w-full h-2.5 bg-white/[0.05] rounded-full overflow-hidden p-0.5 border border-white/5">
                <div className="h-full bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full w-[42%] transition-all duration-1000 shadow-[0_0_10px_rgba(236,72,153,0.5)]"></div>
              </div>
              <div className="flex justify-between text-[11px] text-gray-500">
                <span>42% AI compute quota utilized</span>
                <span>58 deep insights remaining</span>
              </div>
            </div>

            {/* APM Distributed Spans */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300 font-medium flex items-center gap-2">
                  <Activity size={14} className="text-cyan-400" /> Distributed APM Traces & Spans
                </span>
                <span className="text-white font-mono font-semibold">1.2M <span className="text-gray-500">/ 5.0M</span></span>
              </div>
              <div className="w-full h-2.5 bg-white/[0.05] rounded-full overflow-hidden p-0.5 border border-white/5">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-[24%] transition-all duration-1000 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
              </div>
              <div className="flex justify-between text-[11px] text-gray-500">
                <span>24% telemetry volume logged</span>
                <span>3.8M spans remaining</span>
              </div>
            </div>

            {/* Team Collaborators */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300 font-medium flex items-center gap-2">
                  <User size={14} className="text-emerald-400" /> Active Developer Seats
                </span>
                <span className="text-white font-mono font-semibold">3 <span className="text-gray-500">/ 10</span></span>
              </div>
              <div className="w-full h-2.5 bg-white/[0.05] rounded-full overflow-hidden p-0.5 border border-white/5">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[30%] transition-all duration-1000"></div>
              </div>
              <div className="flex justify-between text-[11px] text-gray-500">
                <span>3 team members assigned</span>
                <span>7 open developer invites</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Policy & Terms of Service Footer Bar */}
      <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <Lock size={16} className="text-violet-400" /> Legal Compliance & Platform Transparency
            </h4>
            <p className="text-xs text-gray-400 mt-1">
              Review how BandhanNova Sentinel isolates, encrypts, and processes your telemetry logs compliant with GDPR and SOC-2.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap w-full md:w-auto">
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-gray-200 text-xs font-semibold transition-all flex items-center justify-center gap-2 group"
            >
              <FileText size={14} className="text-violet-400 group-hover:scale-110 transition-transform" />
              Privacy Policy
              <ExternalLink size={12} className="text-gray-500" />
            </a>
            <a
              href="/tos"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-gray-200 text-xs font-semibold transition-all flex items-center justify-center gap-2 group"
            >
              <FileText size={14} className="text-fuchsia-400 group-hover:scale-110 transition-transform" />
              Terms of Service
              <ExternalLink size={12} className="text-gray-500" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
