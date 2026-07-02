/** @jsxImportSource react */
import React, { useState, useEffect, useCallback } from 'react';
import { API_BASE } from '../../../config';
import { 
  ShieldCheck, 
  Activity, 
  BrainCircuit, 
  Settings, 
  LogOut, 
  Database, 
  BellRing, 
  Check, 
  Save, 
  Clock, 
  Sparkles,
  AlertTriangle,
  Smartphone,
  Menu,
  X,
  Terminal,
  Video,
  Workflow,
  LineChart,
  Bot,
  Key,
  WifiOff
} from 'lucide-react';
import { ErrorList } from '../../errors/components/ErrorList';
import { LogViewer } from './LogViewer';
import { TraceViewer } from './TraceViewer';
import { AgentMonitor } from './AgentMonitor';
import { SessionList } from './SessionList';
import ApiKeysPanel from './ApiKeysPanel';
import ProjectSelector, { type Project } from './ProjectSelector';
import OverviewDashboard from './OverviewDashboard';
import PricingPlans from '../../billing/components/PricingPlans';
import { UserProfileView } from '../../profile/components/UserProfileView';
import { safeStorageGetItem, safeStorageSetItem, clearAllStorage } from '../../../utils/storage';
import { fetchWithRetry, parseAPIResponse, APIError } from '../../../utils/api';
import { escapeHTML, isValidWebhookUrl } from '../../../utils/security';
import { NotificationProvider, useNotification } from '../../../components/NotificationProvider';
import { useOnlineStatus } from '../../../hooks/useOnlineStatus';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture: string;
  org_name: string;
  debug?: boolean;
  plan?: string;
}

function DashboardLayoutContent({ initialTab = 'overview' }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [user, setUser] = useState<UserProfile | null>(() => safeStorageGetItem('sentinel_user', null));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(() => safeStorageGetItem('sentinel_selected_project', null));

  const handleProjectChange = useCallback((project: Project) => {
    if (project && project.id && project.id !== selectedProjectId) {
      setSelectedProjectId(project.id);
      safeStorageSetItem('sentinel_selected_project', project.id);
    }
  }, [selectedProjectId]);
  const [authError, setAuthError] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // Right Sidebar for AI
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [aiContext, setAiContext] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInput, setAiInput] = useState('Summarize the current issue and suggest the most likely fix.');
  
  // Notifications and online status
  const { addNotification } = useNotification();
  const isOnline = useOnlineStatus();

  // Settings State with validation
  const [settings, setSettings] = useState({
    discord_webhook_url: '',
    slack_webhook_url: '',
    whatsapp_access_token: '',
    whatsapp_phone_number_id: '',
    whatsapp_to_number: '',
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await fetchWithRetry(`${API_BASE}/api/settings`, { 
        credentials: 'include',
        retries: 0,
      });
      const data = await parseAPIResponse(res);
      setSettings({
        discord_webhook_url: data.discord_webhook_url || '',
        slack_webhook_url: data.slack_webhook_url || '',
        whatsapp_access_token: data.whatsapp_access_token || '',
        whatsapp_phone_number_id: data.whatsapp_phone_number_id || '',
        whatsapp_to_number: data.whatsapp_to_number || '',
      });
      setSettingsError(null);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Failed to fetch settings', err);
      setSettingsError('Could not load settings. Using defaults.');
    }
  };

  useEffect(() => {
    const authenticate = async () => {
      try {
        const isDebug = safeStorageGetItem('sentinel_debug_mode', false);
        const expires = safeStorageGetItem('sentinel_token_expires', null);
        const savedUser = safeStorageGetItem('sentinel_user', null);

        if (isDebug && savedUser) {
          setUser(savedUser);
          await fetchSettings();
          return;
        }

        // If token expired beyond 7 days, log out
        if (expires && Number(expires) < Date.now()) {
          clearAllStorage('sentinel_user', 'sentinel_session_token', 'sentinel_token_expires', 'sentinel_debug_mode');
          window.location.href = '/signin';
          return;
        }

        try {
          const res = await fetchWithRetry(`${API_BASE}/api/auth/me`, { 
            credentials: 'include',
            retries: 0,
          });
          
          if (res.ok) {
            const userData = await parseAPIResponse(res);
            setUser(userData);
            safeStorageSetItem('sentinel_user', userData);
            safeStorageSetItem('sentinel_token_expires', Date.now() + 7 * 24 * 60 * 60 * 1000);
            await fetchSettings();
            return;
          }
        } catch (err) {
          if (err instanceof APIError) {
            console.error('Auth API error:', err.statusCode);
          } else {
            console.error('Auth check failed:', err);
          }
        }

        // Fallback: if valid unexpired 7-day session or debug session exists locally, continue using it
        if (savedUser && ((expires && Number(expires) > Date.now()) || isDebug)) {
          setUser(savedUser);
          await fetchSettings();
          return;
        }

        window.location.href = '/signin';
      } catch (err) {
        console.error('Fatal authentication error:', err);
        setAuthError('Failed to authenticate. Please try again.');
      }
    };

    authenticate();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isOnline) {
      addNotification('error', 'You are offline. Please check your connection.', 5000);
      return;
    }

    setSettingsLoading(true);
    setSettingsSaved(false);
    setSettingsError(null);

    const hasDiscordWebhook = settings.discord_webhook_url.trim();
    const hasSlackWebhook = settings.slack_webhook_url.trim();

    if (hasDiscordWebhook && !isValidWebhookUrl(settings.discord_webhook_url, 'discord')) {
      setSettingsError('Please enter a valid Discord webhook URL.');
      addNotification('error', 'Please enter a valid Discord webhook URL.', 5000);
      setSettingsLoading(false);
      return;
    }

    if (hasSlackWebhook && !isValidWebhookUrl(settings.slack_webhook_url, 'slack')) {
      setSettingsError('Please enter a valid Slack webhook URL.');
      addNotification('error', 'Please enter a valid Slack webhook URL.', 5000);
      setSettingsLoading(false);
      return;
    }

    try {
      const res = await fetchWithRetry(`${API_BASE}/api/settings`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
        retries: 2,
      });
      
      const data = await parseAPIResponse(res);
      
      if (data.success) {
        setSettingsSaved(true);
        setHasUnsavedChanges(false);
        addNotification('success', 'Settings saved successfully!', 3000);
        setTimeout(() => setSettingsSaved(false), 3000);
      } else {
        const errorMsg = data.error || 'Failed to save settings';
        setSettingsError(errorMsg);
        addNotification('error', `Save failed: ${errorMsg}`, 5000);
      }
    } catch (err) {
      console.error('Settings save error:', err);
      const errorMsg = err instanceof APIError 
        ? `API Error: ${err.statusCode}` 
        : 'Network error: failed to save configurations';
      setSettingsError(errorMsg);
      addNotification('error', errorMsg, 5000);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetchWithRetry(`${API_BASE}/api/auth/logout`, { 
        credentials: 'include',
        retries: 1,
      });
    } catch (err) {
      console.error('Logout request failed', err);
    }

    clearAllStorage('sentinel_session_token', 'sentinel_user', 'sentinel_token_expires', 'sentinel_debug_mode', 'sentinel_selected_project');
    window.location.href = '/signin';
  };

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // GCP-style grouped navigation
  const navSections = [
    {
      label: 'Monitoring',
      items: [
        { id: 'overview', icon: <Activity size={18} strokeWidth={1.5} />, label: 'Overview' },
        { id: 'live-errors', icon: <ShieldCheck size={18} strokeWidth={1.5} />, label: 'Live Errors' },
        { id: 'logs', icon: <Terminal size={18} strokeWidth={1.5} />, label: 'Console Logs' },
        { id: 'tracing', icon: <Workflow size={18} strokeWidth={1.5} />, label: 'Tracing' },
        { id: 'performance', icon: <LineChart size={18} strokeWidth={1.5} />, label: 'Web Vitals' },
      ]
    },
    {
      label: 'Tools',
      items: [
        { id: 'session-replay', icon: <Video size={18} strokeWidth={1.5} />, label: 'Session Replays' },
        { id: 'agent-monitoring', icon: <Bot size={18} strokeWidth={1.5} />, label: 'AI Agents' },
        { id: 'api-keys', icon: <Key size={18} strokeWidth={1.5} />, label: 'API Keys' },
      ]
    },
    {
      label: 'Configure',
      items: [
        { id: 'settings', icon: <Settings size={18} strokeWidth={1.5} />, label: 'Settings' },
      ]
    }
  ];

  const menuItems = navSections.flatMap(s => s.items);

  const handleAnalyzeAllLogs = async () => {
    if (!isOnline) {
      addNotification('error', 'You are offline. AI analysis requires an active connection.', 5000);
      return;
    }

    setIsRightSidebarOpen(true);
    setAiLoading(true);
    setAiResponse('');

    const activeMenuItem = menuItems.find(item => item.id === activeTab);
    const pageName = activeMenuItem?.label ?? 'Dashboard';
    const requestPrompt = aiInput.trim() || 'Summarize the current issue and suggest the most likely fix.';
    const contextSummary = `Active dashboard section: ${pageName}. Selected project: ${selectedProjectId || 'not selected'}.`;

    try {
      const res = await fetchWithRetry(`${API_BASE}/api/ai/explain`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_query: requestPrompt,
          message: requestPrompt,
          context: contextSummary,
          page_name: pageName,
          section_name: activeTab,
          project_id: selectedProjectId,
        }),
        retries: 2,
      });
      
      const data = await parseAPIResponse(res);
      setAiResponse(data.explanation || "Analysis complete. System is stable.");
    } catch (err) {
      console.error('AI analysis failed:', err);
      setAiResponse("Failed to connect to Sentinel AI API. Please try again.");
      addNotification('error', 'AI analysis failed. Please check your connection.', 5000);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#030303] text-white overflow-hidden font-sans">
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-violet-600/5 blur-[130px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-fuchsia-600/5 blur-[130px] rounded-full"></div>
      </div>

      {/* ═══════════ GCP-STYLE FIXED TOP BAR ═══════════ */}
      <header className="h-16 bg-[#0a0a0a]/90 border-b border-white/[0.06] flex items-center justify-between px-4 md:px-6 relative z-[200] backdrop-blur-xl shrink-0">
        {/* Left: Hamburger (mobile) + Logo + Product Name + Project Selector */}
        <div className="flex items-center gap-4">
          {/* Mobile hamburger */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-gray-400 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo + Name */}
          <a href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <img src="/favicon.ico" alt="Sentinel" className="w-8 h-8 object-contain" />
            <span className="text-lg tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 hidden sm:inline-block" style={{ fontFamily: "'Virgo 01', sans-serif" }}>
              Sentinel
            </span>
          </a>

          {/* Vertical divider */}
          <div className="hidden md:block w-px h-7 bg-white/[0.08]"></div>

          {/* Project Selector */}
          {user && (
            <div className="hidden md:block">
              <ProjectSelector 
                userId={user.id} 
                selectedProjectId={selectedProjectId} 
                onProjectChange={handleProjectChange} 
              />
            </div>
          )}
        </div>

        {/* Center: Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-8">
          <div className="w-full relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs, errors, traces..."
              className="w-full bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12] focus:border-violet-500/50 rounded-lg px-4 py-2 pl-10 text-sm text-white placeholder:text-gray-600 focus:outline-none transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </div>
        </div>

        {/* Right: Notifications + AI + User Avatar */}
        <div className="flex items-center gap-1">
          {/* Sentinel AI toggle */}
          <button 
            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            className="p-2 text-gray-400 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 rounded-lg transition-all"
            title="Sentinel AI"
          >
            <Sparkles size={18} />
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all">
            <BellRing size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0a0a0a]"></span>
          </button>

          {/* User Avatar + Dropdown */}
          <div className="relative ml-1">
            <button 
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/[0.06] transition-all"
            >
              {user?.picture ? (
                <img src={user.picture} alt="Profile" className="w-8 h-8 rounded-full border border-white/10" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-xs text-white">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'BN'}
                </div>
              )}
            </button>

            {/* Dropdown */}
            {isUserDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-[#111113] border border-white/10 rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.9)] z-[9999] overflow-hidden">
                <div className="p-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    {user?.picture ? (
                      <img src={user.picture} alt="Profile" className="w-10 h-10 rounded-full border border-white/10" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-sm text-white">
                        {user?.name ? user.name.slice(0, 2).toUpperCase() : 'BN'}
                      </div>
                    )}
                    <div className="truncate">
                      <p className="text-sm font-semibold text-white truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <button onClick={() => { setActiveTab('profile'); setIsUserDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/[0.04] transition-colors flex items-center gap-3">
                    <Activity size={16} className="text-gray-500" /> My Profile
                  </button>
                  <button onClick={() => { setActiveTab('pricing'); setIsUserDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/[0.04] transition-colors flex items-center gap-3">
                    <Sparkles size={16} className="text-gray-500" /> Upgrade Plan
                  </button>
                </div>
                <div className="border-t border-white/[0.06] py-1">
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3">
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* UI Debug Mode Banner */}
      {user?.debug && (
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 border-b border-amber-500/25 px-6 py-2 flex items-center justify-between text-amber-300 text-xs font-semibold shrink-0 z-[50]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>⚡ UI Debug Mode Active — No server auth required</span>
          </div>
          <button onClick={handleLogout} className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/40 rounded-lg text-amber-200 text-[11px] font-bold transition-colors">
            Exit
          </button>
        </div>
      )}

      {/* ═══════════ MAIN BODY: SIDEBAR + CONTENT ═══════════ */}
      <div className="flex flex-1 overflow-hidden relative z-10">

        {/* ── GCP-STYLE LEFT SIDEBAR (Desktop) ── */}
        <aside className="w-[260px] bg-[#070707]/80 border-r border-white/[0.05] flex-col relative hidden md:flex shrink-0">
          {/* Scrollable Nav */}
          <nav className="flex-1 overflow-y-auto py-3 px-3">
            {navSections.map((section, sIdx) => (
              <div key={sIdx} className={sIdx > 0 ? 'mt-4 pt-4 border-t border-white/[0.04]' : ''}>
                <p className="px-3 mb-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {section.label}
                </p>
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      aria-label={`${item.label} section`}
                      aria-current={activeTab === item.id ? 'page' : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group relative ${
                        activeTab === item.id 
                          ? 'bg-violet-500/10 text-violet-300' 
                          : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
                      }`}
                    >
                      {/* GCP-style left active indicator */}
                      {activeTab === item.id && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-violet-500 rounded-r-full"></div>
                      )}
                      <span className={`transition-colors ${activeTab === item.id ? 'text-violet-400' : 'text-gray-500 group-hover:text-gray-400'}`}>
                        {item.icon}
                      </span>
                      <span className="text-[13px] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom: Upgrade CTA */}
          <div className="p-3 border-t border-white/[0.04]">
            <button 
              onClick={() => setActiveTab('pricing')}
              className="w-full bg-gradient-to-r from-violet-600/15 to-fuchsia-600/15 hover:from-violet-500/25 hover:to-fuchsia-500/25 border border-violet-500/20 hover:border-violet-400/40 text-white rounded-lg py-2.5 px-3 flex items-center justify-center gap-2 transition-all text-sm font-semibold"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <span className="text-base">✨</span> Upgrade Plan
            </button>
          </div>
        </aside>

        {/* ── MOBILE SIDEBAR OVERLAY ── */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-[#030303]/95 z-[150] overflow-y-auto">
            <nav className="p-4 space-y-1">
              {/* Mobile project selector */}
              {user && (
                <div className="mb-4 pb-4 border-b border-white/[0.06]">
                  <ProjectSelector userId={user.id} selectedProjectId={selectedProjectId} onProjectChange={handleProjectChange} />
                </div>
              )}
              {navSections.map((section, sIdx) => (
                <div key={sIdx} className={sIdx > 0 ? 'mt-3 pt-3 border-t border-white/[0.04]' : ''}>
                  <p className="px-3 mb-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest">{section.label}</p>
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                      aria-label={`${item.label} section`}
                      aria-current={activeTab === item.id ? 'page' : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${
                        activeTab === item.id 
                          ? 'bg-violet-500/10 text-violet-300' 
                          : 'text-gray-400 hover:bg-white/[0.03]'
                      }`}
                    >
                      {item.icon}
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        )}

        {/* ── MAIN CONTENT AREA ── */}
        <main className={`flex-1 flex flex-col overflow-hidden ${isMobileMenuOpen ? 'hidden md:flex' : 'flex'}`}>
          {/* Content Header — Page title + description */}
          <div className="px-6 md:px-8 pt-6 pb-4 shrink-0">
            <h1 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {menuItems.find(i => i.id === activeTab)?.label || activeTab}
            </h1>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-8">
            {activeTab === 'overview' && (
              selectedProjectId ? (
                <OverviewDashboard projectId={selectedProjectId} />
              ) : (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 text-center text-gray-400">
                  Select a project to view your overview.
                </div>
              )
            )}

            {activeTab === 'pricing' && (
              <div className="w-full flex-1">
                <PricingPlans />
              </div>
            )}

            {activeTab === 'profile' && (
              <UserProfileView 
                user={user} 
                onUpgradePlan={() => setActiveTab('pricing')} 
                onNavigateToApiKeys={() => setActiveTab('api-keys')} 
                onLogout={handleLogout} 
              />
            )}

            {activeTab === 'live-errors' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl">
                <div className="mb-6 flex justify-between items-center">
                  <p className="text-sm text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>Real-time stream of application exceptions.</p>
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Live</span>
                  </div>
                </div>
                <ErrorList projectId={selectedProjectId || ''} />
              </div>
            )}

            {activeTab === 'logs' && (
              <LogViewer projectId={selectedProjectId || ''} />
            )}

            {activeTab === 'tracing' && (
              <TraceViewer projectId={selectedProjectId || ''} />
            )}

            {activeTab === 'performance' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl space-y-6">
                <p className="text-sm text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>Core Web Vitals reported by client SDKs.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    { name: 'Largest Contentful Paint (LCP)', value: '1.24s', rating: 'FAST', color: 'text-emerald-400', desc: 'Loading performance. Target: < 2.5s' },
                    { name: 'First Input Delay (FID)', value: '6ms', rating: 'FAST', color: 'text-emerald-400', desc: 'Page interactivity. Target: < 100ms' },
                    { name: 'Cumulative Layout Shift (CLS)', value: '0.015', rating: 'EXCELLENT', color: 'text-emerald-400', desc: 'Visual stability. Target: < 0.1' },
                  ].map((vital, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/[0.06] p-5 rounded-xl hover:border-white/10 transition-colors">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>{vital.name}</p>
                      <p className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{vital.value}</p>
                      <span className={`text-[10px] font-bold tracking-widest uppercase bg-emerald-500/10 px-2 py-0.5 rounded ${vital.color}`}>{vital.rating}</span>
                      <p className="text-xs text-gray-400 mt-3">{vital.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
                  <h3 className="text-base font-bold text-white mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Page Load Latency (LCP) — Last 24 Hours</h3>
                  <div className="relative w-full h-64 flex items-end">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d="M 0 100 Q 15 65 30 75 T 60 50 T 90 20 T 100 30 L 100 100 Z" fill="url(#chart-glow)" />
                      <path d="M 0 100 Q 15 65 30 75 T 60 50 T 90 20 T 100 30" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
                      <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                      <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                      <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                    </svg>
                    <div className="absolute left-[30%] bottom-[25%] -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-violet-400 rounded-full border-[3px] border-black shadow-[0_0_10px_#8b5cf6] animate-pulse"></div>
                    <div className="absolute left-[60%] bottom-[50%] -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-violet-400 rounded-full border-[3px] border-black shadow-[0_0_10px_#8b5cf6] animate-pulse"></div>
                    <div className="absolute left-[90%] bottom-[80%] -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-fuchsia-400 rounded-full border-[3px] border-black shadow-[0_0_10px_#ec4899] animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'session-replay' && (
              <SessionList projectId={selectedProjectId || ''} />
            )}

            {activeTab === 'agent-monitoring' && (
              <AgentMonitor projectId={selectedProjectId || ''} />
            )}

            {activeTab === 'api-keys' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] w-full">
                <ApiKeysPanel projectId={selectedProjectId || ''} userId={user?.id || ''} />
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
                <p className="text-sm text-gray-400 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>Configure webhook targets and messaging credentials.</p>

                <form onSubmit={handleSaveSettings} className="space-y-6 bg-white/[0.02] border border-white/[0.06] p-6 rounded-xl">
                  
                  {/* Discord */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/[0.04]">
                      <span className="text-base">🎮</span>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Discord</h3>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Webhook URL</label>
                      <input 
                        type="url"
                        value={settings.discord_webhook_url}
                        onChange={e => {
                          setHasUnsavedChanges(true);
                          setSettings({...settings, discord_webhook_url: e.target.value});
                        }}
                        placeholder="https://discord.com/api/webhooks/..."
                        className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Slack */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/[0.04]">
                      <span className="text-base">💬</span>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Slack</h3>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Webhook URL</label>
                      <input 
                        type="url"
                        value={settings.slack_webhook_url}
                        onChange={e => {
                          setHasUnsavedChanges(true);
                          setSettings({...settings, slack_webhook_url: e.target.value});
                        }}
                        placeholder="https://hooks.slack.com/services/..."
                        className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/[0.04]">
                      <Smartphone size={16} className="text-emerald-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>WhatsApp API</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Meta Access Token</label>
                        <input 
                          type="password"
                          value={settings.whatsapp_access_token}
                          onChange={e => {
                            setHasUnsavedChanges(true);
                            setSettings({...settings, whatsapp_access_token: e.target.value});
                          }}
                          placeholder="EAABw..."
                          className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-violet-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Phone Number ID</label>
                        <input 
                          type="text"
                          value={settings.whatsapp_phone_number_id}
                          onChange={e => {
                            setHasUnsavedChanges(true);
                            setSettings({...settings, whatsapp_phone_number_id: e.target.value});
                          }}
                          placeholder="e.g. 10488219..."
                          className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-violet-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Recipient Number</label>
                        <input 
                          type="text"
                          value={settings.whatsapp_to_number}
                          onChange={e => {
                            setHasUnsavedChanges(true);
                            setSettings({...settings, whatsapp_to_number: e.target.value});
                          }}
                          placeholder="e.g. 919876543210"
                          className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-violet-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save */}
                  <div className="pt-2 flex items-center gap-4">
                    <button 
                      type="submit"
                      disabled={settingsLoading}
                      className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 text-white rounded-lg font-semibold text-sm transition-all shadow-lg shadow-violet-500/20"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {settingsLoading ? 'Saving...' : (
                        <span className="inline-flex items-center gap-2"><Save size={16} /> Save</span>
                      )}
                    </button>
                    {settingsSaved && (
                      <span className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                        <Check size={16} /> Saved!
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>

        {/* ── SENTINEL AI RIGHT PANEL ── */}
        <aside className={`w-[420px] max-w-full bg-[#070707] border-l border-white/[0.05] flex flex-col z-40 fixed md:relative right-0 top-0 bottom-0 shadow-2xl transition-transform duration-300 transform ${isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-full'}`}>
          <div className="h-16 px-5 border-b border-white/[0.06] flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-fuchsia-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white tracking-wider uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Sentinel AI</h3>
            </div>
            <button onClick={() => setIsRightSidebarOpen(false)} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {aiLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-fuchsia-400"></div>
                <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>Processing Signals...</p>
              </div>
            ) : (
              <div className="prose prose-invert prose-sm text-gray-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                {aiResponse ? (
                  <div className="leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/[0.04] whitespace-pre-wrap">
                    {escapeHTML(aiResponse)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center mt-10 opacity-50">
                    <BrainCircuit size={40} className="mb-4 text-violet-400" />
                    <p className="text-sm">Click the button below to run AI analysis.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/[0.06] shrink-0">
            <button 
              onClick={handleAnalyzeAllLogs}
              disabled={aiLoading}
              className="w-full bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 hover:from-violet-500/30 hover:to-fuchsia-500/30 border border-violet-500/30 hover:border-violet-400/50 text-white rounded-lg py-3 px-4 flex items-center justify-center gap-2 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Bot size={16} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xs" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {aiLoading ? 'ANALYZING...' : 'ANALYZE & SIMPLIFY LOGS'}
              </span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function DashboardLayout(props: { initialTab?: string }) {
  return (
    <NotificationProvider>
      <DashboardLayoutContent {...props} />
    </NotificationProvider>
  );
}
