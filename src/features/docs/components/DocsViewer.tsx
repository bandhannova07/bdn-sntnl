/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Terminal, 
  Settings, 
  Code, 
  BrainCircuit, 
  Activity, 
  Search, 
  ChevronRight, 
  Copy, 
  Check, 
  ArrowLeft,
  Network
} from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function DocsViewer() {
  const [activeSection, setActiveSection] = useState('intro');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Handle URL search parameters for navigation (e.g., ?tab=sdks)
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && sections.some(s => s.id === tab)) {
      setActiveSection(tab);
    }
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sections: DocSection[] = [
    {
      id: 'intro',
      title: 'Introduction',
      category: 'Getting Started',
      icon: <BookOpen size={16} />,
      content: (
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">Introduction to Sentinel</h1>
          <p className="text-zinc-400 leading-relaxed text-base">
            Welcome to <strong>BandhanNova Sentinel</strong>, the next-generation application performance monitoring (APM) and observability platform. 
            Sentinel is designed to offer real-time insights into your app's health, logging patterns, distributed tracing, and user sessions.
          </p>
          <div className="bg-violet-950/20 border border-violet-500/20 rounded-2xl p-6 my-6">
            <h3 className="text-violet-300 font-bold flex items-center gap-2 mb-2">
              <BrainCircuit size={18} /> Powered by Cerebras AI
            </h3>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Unlike traditional error-monitoring systems that only display stack traces, Sentinel utilizes high-performance Cerebras AI models to instantly analyze exception root causes, explain developer errors, and suggest localized drop-in code fixes in your native language.
            </p>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-['Space_Grotesk'] mt-10">Core Observability Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white/[0.02] border border-white/[0.04] p-5 rounded-2xl">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Terminal size={16} className="text-fuchsia-400" /> Real-time Logging
              </h3>
              <p className="text-zinc-400 text-sm">Intercepts console logs, errors, and unhandled exceptions instantly with Zero-Polling push technology.</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.04] p-5 rounded-2xl">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Network size={16} className="text-violet-400" /> Distributed Tracing
              </h3>
              <p className="text-zinc-400 text-sm">Correlates client-side fetch requests with backend services to visual timings, latency bottlenecks, and network failures.</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.04] p-5 rounded-2xl">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Activity size={16} className="text-cyan-400" /> Uptime Monitors
              </h3>
              <p className="text-zinc-400 text-sm">Monitors HTTP endpoints, HTTP status codes, and server heartbeats to ensure zero downtime.</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.04] p-5 rounded-2xl">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Settings size={16} className="text-emerald-400" /> Smart Alerts
              </h3>
              <p className="text-zinc-400 text-sm">Reduces alert fatigue using intelligent deduplication and instant messaging (Email, Slack, and WhatsApp).</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'quickstart',
      title: 'Creating Projects & Keys',
      category: 'Getting Started',
      icon: <Settings size={16} />,
      content: (
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">Creating Projects & API Keys</h1>
          <p className="text-zinc-400 leading-relaxed">
            Before integrating Sentinel, you need a project container and an active API Key. Follow these step-by-step instructions to get set up:
          </p>
          <div className="space-y-6 mt-8">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white shrink-0">1</div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Create a Project</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Go to your **Dashboard Overview** page. On the sidebar navigation, select **Projects**. Click on the **Create Project** button, specify a unique name (e.g. `e-commerce-prod`), and save. Copy the generated `Project ID`.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white shrink-0">2</div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Generate API Keys</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Inside your dashboard, head to **Settings** and choose the **API Keys** panel. Give your key a name (e.g. `production-web-sdk`), then click **Generate Key**. 
                </p>
                <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-4 mt-3 text-amber-300 text-xs">
                  <strong>Important:</strong> Copy your new API key now. You won't be able to see it again!
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'sdks',
      title: 'SDK Integrations',
      category: 'SDK Reference',
      icon: <Code size={16} />,
      content: (
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">SDK Setup & Initialization</h1>
          <p className="text-zinc-400 leading-relaxed">
            Sentinel provides simple, lightweight SDKs for various runtimes. Find the installation instructions for your framework below:
          </p>

          {/* HTML CDN Setup */}
          <div className="border-t border-zinc-800 pt-8 mt-10">
            <h2 className="text-2xl font-bold text-white mb-3">1. Web SDK (HTML / CDN)</h2>
            <p className="text-zinc-400 text-sm mb-4">
              Add the Sentinel SDK script tag to the <code>&lt;head&gt;</code> of your website. Make sure it loads before other script elements to catch early initialization bugs.
            </p>
            
            <div className="relative group">
              <pre className="bg-zinc-950/90 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
{`<!-- Load Sentinel SDK -->
<script src="https://sentinel.bandhannova.in/sentinel-sdk.js"></script>
<script>
  Sentinel.init({
    projectId: 'proj_your_project_id',
    endpoint: 'https://sentinel.bandhannova.in/api/ingest',
    sessionReplay: true,
    userId: 'user_active_session_id'
  });
</script>`}
              </pre>
              <button 
                onClick={() => handleCopy(`<script src="https://sentinel.bandhannova.in/sentinel-sdk.js"></script>\n<script>\n  Sentinel.init({\n    projectId: 'proj_your_project_id',\n    endpoint: 'https://sentinel.bandhannova.in/api/ingest',\n    sessionReplay: true,\n    userId: 'user_active_session_id'\n  });\n</script>`, 'cdn')}
                className="absolute right-3 top-3 p-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
              >
                {copiedId === 'cdn' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* Node.js Setup */}
          <div className="border-t border-zinc-800 pt-8 mt-10">
            <h2 className="text-2xl font-bold text-white mb-3">2. Node.js Setup</h2>
            <p className="text-zinc-400 text-sm mb-4">
              Install the package and initialize Sentinel at the top of your main server entry point:
            </p>
            
            <div className="relative group mb-4">
              <pre className="bg-zinc-950/90 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
{`npm install @bandhannova/sentinel-node`}
              </pre>
              <button 
                onClick={() => handleCopy(`npm install @bandhannova/sentinel-node`, 'npm-install')}
                className="absolute right-3 top-3 p-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
              >
                {copiedId === 'npm-install' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>

            <div className="relative group">
              <pre className="bg-zinc-950/90 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
{`const Sentinel = require('@bandhannova/sentinel-node');

Sentinel.init({
  projectId: 'proj_your_project_id',
  apiKey: 'sentinel_key_production_your_key',
  environment: 'production'
});`}
              </pre>
              <button 
                onClick={() => handleCopy(`const Sentinel = require('@bandhannova/sentinel-node');\n\nSentinel.init({\n  projectId: 'proj_your_project_id',\n  apiKey: 'sentinel_key_production_your_key',\n  environment: 'production'\n});`, 'node-init')}
                className="absolute right-3 top-3 p-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
              >
                {copiedId === 'node-init' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'logging-tracing',
      title: 'Logs & Tracing',
      category: 'Features Guide',
      icon: <Terminal size={16} />,
      content: (
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">Logging & Distributed Tracing</h1>
          
          <h2 className="text-2xl font-bold text-white mt-8">Console Interception</h2>
          <p className="text-zinc-400 leading-relaxed text-sm">
            Once initialized, the Sentinel SDK automatically hooks into standard JavaScript console output functions. Standard logging like `console.log` or `console.error` will send payloads directly to our secure ingest endpoint.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8">Custom Log Levels</h2>
          <p className="text-zinc-400 leading-relaxed text-sm">
            Sentinel groups logs by levels: `debug`, `info`, `warn`, and `error`. These levels help filter issues in the Log Viewer.
          </p>
          
          <div className="relative group">
            <pre className="bg-zinc-950/90 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
{`// Logs are sent automatically
console.info('Payment succeeded for User #1234');
console.warn('Database query took longer than expected: 340ms');
console.error('Failed to parse response body', { status: 400 });`}
            </pre>
            <button 
              onClick={() => handleCopy(`console.info('Payment succeeded for User #1234');\nconsole.warn('Database query took longer than expected: 340ms');\nconsole.error('Failed to parse response body', { status: 400 });`, 'console-log')}
              className="absolute right-3 top-3 p-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
            >
              {copiedId === 'console-log' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>

          <h2 className="text-2xl font-bold text-white mt-10">Distributed API Tracing</h2>
          <p className="text-zinc-400 leading-relaxed text-sm">
            Sentinel automatically intercepts standard window HTTP `fetch` requests. Whenever a fetch request is initiated, Sentinel generates a unique `trace_id` and records the timing metrics (`duration_ms` and HTTP response status) and streams them to your dashboard trace chart.
          </p>
        </div>
      )
    },
    {
      id: 'ai-assist',
      title: 'AI Root Cause Analysis',
      category: 'Features Guide',
      icon: <BrainCircuit size={16} />,
      content: (
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">AI Root Cause Analysis</h1>
          <p className="text-zinc-400 leading-relaxed">
            Debugging is hard. Reading structured stack traces is tedious. Sentinel solves this by offering high-performance Cerebras-powered AI analysis right next to your logs and errors.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-8">How it works</h2>
          <p className="text-zinc-400 leading-relaxed text-sm">
            When Sentinel ingests an exception payload (like a `TypeError` or database connection crash), it formats the trace, context surrounding the log, and user environmental parameters. Clicking the **"Analyze and Simplify All Logs"** button sends this payload to our backend AI module.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-8">Step-by-Step AI Diagnostics</h2>
          <ul className="space-y-4 mt-4 text-zinc-400 text-sm">
            <li className="flex gap-2">
              <ChevronRight size={18} className="text-violet-400 shrink-0" />
              <span><strong>Root Cause Breakdown</strong>: Explains exactly why the code threw an error in plain english or your selected language.</span>
            </li>
            <li className="flex gap-2">
              <ChevronRight size={18} className="text-violet-400 shrink-0" />
              <span><strong>Impact Assessment</strong>: Analyzes how the exception affects users (e.g. "Prevents users from checking out").</span>
            </li>
            <li className="flex gap-2">
              <ChevronRight size={18} className="text-violet-400 shrink-0" />
              <span><strong>Code Fix</strong>: Provides a clean copy-paste solution to avoid the crash in the future.</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'alerts',
      title: 'Metric & Uptime Monitors',
      category: 'Features Guide',
      icon: <Activity size={16} />,
      content: (
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">Uptime & Metric Monitors</h1>
          
          <h2 className="text-2xl font-bold text-white mt-8">1. Uptime Monitoring</h2>
          <p className="text-zinc-400 leading-relaxed text-sm">
            Uptime monitors repeatedly ping your backend API endpoints at configured intervals. If the endpoint returns a 500 server exception, 404 not found, or exceeds the latency threshold, Sentinel triggers an incident.
          </p>
          <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5 mt-4">
            <h4 className="text-white font-semibold mb-2">Setting up Uptime Monitoring:</h4>
            <ol className="list-decimal list-inside space-y-2 text-zinc-400 text-sm">
              <li>Navigate to **Metric Monitors** in your sidebar.</li>
              <li>Click **Add New Monitor** and select **HTTP Uptime**.</li>
              <li>Provide the target URL (e.g. `https://myapi.com/healthz`).</li>
              <li>Set validation parameters (interval, expected status code e.g. `200`).</li>
            </ol>
          </div>

          <h2 className="text-2xl font-bold text-white mt-10">2. Cron Job Heartbeats</h2>
          <p className="text-zinc-400 leading-relaxed text-sm">
            Ensure background cron tasks do not fail silently. Sentinel monitors cron heartbeats by exposing a web check-in hook URL. Just trigger a GET request at the end of your cron execution:
          </p>

          <div className="relative group">
            <pre className="bg-zinc-950/90 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
{`curl -X GET "https://sentinel.bandhannova.in/api/monitors/cron_id_123/ping?key=your_api_key"`}
            </pre>
            <button 
              onClick={() => handleCopy(`curl -X GET "https://sentinel.bandhannova.in/api/monitors/cron_id_123/ping?key=your_api_key"`, 'curl-cron')}
              className="absolute right-3 top-3 p-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
            >
              {copiedId === 'curl-cron' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      )
    }
  ];

  const filteredSections = sections.filter(
    s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
         s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeDoc = sections.find(s => s.id === activeSection) || sections[0];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#030303] text-white">
      {/* Top Header */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 backdrop-blur-md sticky top-0 bg-[#030303]/80 z-40">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-3 hover:opacity-85 transition-opacity">
            <img src="/favicon.ico?v=2" alt="Sentinel Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(167,139,250,0.5)]" />
            <span className="text-2xl tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 drop-shadow-[0_0_2px_rgba(167,139,250,0.25)] mt-1" style={{ fontFamily: "'Virgo 01', sans-serif", letterSpacing: '2px' }}>
              Sentinel
            </span>
          </a>
          <span className="text-xs bg-white/[0.04] border border-white/[0.08] text-zinc-400 px-3 py-1 rounded-full uppercase tracking-wider font-semibold font-['Space_Grotesk'] hidden sm:inline-block">Docs</span>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-64 md:w-80 hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] focus:border-violet-500/50 rounded-2xl py-2.5 pl-11 pr-4 text-sm text-zinc-300 placeholder-zinc-500 focus:outline-none transition-all"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
        </div>

        <div className="flex items-center gap-5">
          <a href="/" className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors hidden sm:inline">Home</a>
          <a href="/pricing" className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors hidden sm:inline">Pricing</a>
          <a href="/signin" className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors">Sign In</a>
          <a href="/dashboard" className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] text-white rounded-xl text-xs font-semibold tracking-wide transition-all">
            Dashboard
          </a>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-64 md:w-72 border-r border-white/5 py-8 px-6 space-y-6 hidden md:block shrink-0">
          
          {/* Mobile Search block (sidebar fallback) */}
          <div className="relative sm:hidden pb-4 border-b border-white/5">
            <Search className="absolute left-3 top-[10px] text-zinc-500" size={14} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl py-2 pl-9 pr-3 text-xs text-zinc-300 placeholder-zinc-500"
            />
          </div>

          {/* Grouped Sidebar Items */}
          {['Getting Started', 'SDK Reference', 'Features Guide'].map((category) => {
            const categoryItems = filteredSections.filter(s => s.category === category);
            if (categoryItems.length === 0) return null;

            return (
              <div key={category} className="space-y-2.5">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500 font-['Space_Grotesk']">{category}</h4>
                <div className="space-y-1">
                  {categoryItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all group ${
                        activeSection === item.id 
                          ? 'bg-violet-500/10 text-violet-300 border border-violet-500/10' 
                          : 'text-zinc-400 hover:bg-white/[0.02] hover:text-white border border-transparent'
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <span className={activeSection === item.id ? 'text-violet-400' : 'text-zinc-500 group-hover:text-zinc-300'}>
                        {item.icon}
                      </span>
                      <span>{item.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 px-6 md:px-12 py-12 overflow-y-auto max-w-3xl">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {activeDoc.content}
          </div>
        </main>
      </div>
    </div>
  );
}
