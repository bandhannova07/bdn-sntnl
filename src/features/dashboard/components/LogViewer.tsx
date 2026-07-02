import React, { useState, useEffect } from 'react';
import { Terminal, RefreshCcw, AlertTriangle, Info, ShieldAlert, RotateCcw } from 'lucide-react';
import { API_BASE } from '../../../config';
import { fetchWithRetry, parseAPIResponse } from '../../../utils/api';

interface LogEntry {
  id: number;
  project_id: string;
  level: string;
  message: string;
  metadata: string;
  timestamp: string;
}

export function LogViewer({ projectId }: { projectId: string }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000); // 5 seconds default

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithRetry(`${API_BASE}/api/logs?projectId=${projectId}`, { 
        credentials: 'include',
        retries: 0,
      });
      const data = await parseAPIResponse(res);
      setLogs(Array.isArray(data) ? data : (data?.logs && Array.isArray(data.logs) ? data.logs : []));
    } catch (err) {
      console.error("Failed to fetch logs", err);
      setError('Failed to load logs. Please try again.');
      setAutoRefresh(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      setError('Please select a project to load logs.');
      setLogs([]);
      return;
    }
    fetchLogs();
    
    let interval: ReturnType<typeof setInterval>;
    if (autoRefresh && !error) {
      interval = setInterval(fetchLogs, refreshInterval);
    }
    
    return () => clearInterval(interval);
  }, [projectId, autoRefresh, refreshInterval, error]);

  const getLevelColor = (level: string) => {
    const l = (level || 'info').toLowerCase();
    if (l.includes('error')) return 'text-red-400 bg-red-400/10 border-red-400/20';
    if (l.includes('warn')) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    if (l.includes('info')) return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    return 'text-gray-400 bg-white/5 border-white/10';
  };

  const getLevelIcon = (level: string) => {
    const l = (level || 'info').toLowerCase();
    if (l.includes('error')) return <ShieldAlert size={14} className="text-red-400" />;
    if (l.includes('warn')) return <AlertTriangle size={14} className="text-yellow-400" />;
    return <Info size={14} className="text-blue-400" />;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl h-[calc(100vh-160px)] flex flex-col gap-6">
      {/* Header with Controls */}
      <div className="space-y-4">
        <p className="text-sm text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>Live stream of structured logs from your applications.</p>
        
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${autoRefresh ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-gray-400 border-white/10'}`}
            >
              <RefreshCcw size={14} className={autoRefresh ? 'animate-spin' : ''} />
              {autoRefresh ? 'Live' : 'Paused'}
            </button>

            {autoRefresh && (
              <select 
                value={refreshInterval} 
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-violet-500 transition-colors"
              >
                <option value={1000}>1 second</option>
                <option value={3000}>3 seconds</option>
                <option value={5000}>5 seconds (default)</option>
                <option value={10000}>10 seconds</option>
                <option value={30000}>30 seconds</option>
              </select>
            )}
          </div>

          <button 
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-violet-500/30 text-violet-300 hover:border-violet-400 hover:text-violet-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <RotateCcw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 text-sm p-4 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 text-xl">×</button>
        </div>
      )}

      {/* Logs Container */}
      <div className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500"></div>
        
        <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
          <Terminal size={18} className="text-violet-400" />
          <h3 className="text-sm font-bold text-white tracking-widest uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Console Stream</h3>
          {autoRefresh && <div className="ml-auto flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></div>}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {loading && logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-violet-400"></div>
              <p className="text-xs">Loading logs...</p>
            </div>
          ) : error && logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
              <AlertTriangle size={20} className="text-amber-400" />
              <p className="text-xs text-center">Failed to load logs</p>
              <button onClick={fetchLogs} className="text-xs text-violet-400 hover:text-violet-300 underline">Try again</button>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p className="text-center">No logs found for this project yet.</p>
            </div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="flex gap-4 p-2 hover:bg-white/[0.02] rounded-lg transition-colors group">
                <div className="w-24 text-gray-600 shrink-0 text-xs mt-0.5">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div className={`shrink-0 px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-24 ${getLevelColor(log.level)}`}>
                  {getLevelIcon(log.level)}
                  {log.level}
                </div>
                <div className="text-gray-300 break-words flex-1 group-hover:text-white transition-colors flex justify-between items-start">
                  <span>{log.message}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
