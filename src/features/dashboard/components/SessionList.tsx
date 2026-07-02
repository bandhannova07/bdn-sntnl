import React, { useState, useEffect } from 'react';
import { Video, Play, Monitor, Smartphone, Globe, Clock, RotateCcw } from 'lucide-react';
import { API_BASE } from '../../../config';
import { fetchWithRetry, parseAPIResponse } from '../../../utils/api';

interface SessionEntry {
  id: string;
  project_id: string;
  user_id: string;
  browser: string;
  os: string;
  duration_ms: number;
  timestamp: string;
}

export function SessionList({ projectId }: { projectId: string }) {
  const [sessions, setSessions] = useState<SessionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithRetry(`${API_BASE}/api/sessions?projectId=${projectId}`, { 
        credentials: 'include',
        retries: 0,
      });
      const data = await parseAPIResponse(res);
      setSessions(Array.isArray(data) ? data : (data?.sessions && Array.isArray(data.sessions) ? data.sessions : []));
    } catch (err) {
      console.error("Failed to fetch sessions", err);
      setError('Failed to load sessions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      setError('Please select a project to load sessions.');
      setSessions([]);
      return;
    }
    fetchSessions();
  }, [projectId]);

  const getOsIcon = (os: string) => {
    const lower = os.toLowerCase();
    if (lower.includes('mac') || lower.includes('win') || lower.includes('linux')) return <Monitor size={14} className="text-gray-400" />;
    if (lower.includes('ios') || lower.includes('android')) return <Smartphone size={14} className="text-gray-400" />;
    return <Monitor size={14} className="text-gray-400" />;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>Watch real user sessions to understand exact reproduction steps.</p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 text-sm p-4 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 text-xl">×</button>
        </div>
      )}

      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-500/10 rounded-xl">
              <Video size={18} className="text-pink-400" />
            </div>
            <h3 className="text-base font-bold text-white tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Session Replays</h3>
          </div>
          <button onClick={fetchSessions} disabled={loading} className="p-2 text-gray-400 hover:text-white disabled:opacity-50 transition-colors">
            <RotateCcw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="divide-y divide-white/5">
          {loading && sessions.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center gap-2 text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-pink-400"></div>
              <p className="text-xs">Loading sessions...</p>
            </div>
          ) : error && sessions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm mb-4">Failed to load sessions</p>
              <button onClick={fetchSessions} className="text-xs text-pink-400 hover:text-pink-300 underline">Try again</button>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No session recordings found.</div>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className="p-6 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-6">
                  
                  {/* Play Button Thumbnail placeholder */}
                  <div className="relative w-32 h-20 bg-black/40 border border-white/5 rounded-xl overflow-hidden group-hover:border-pink-500/50 transition-colors flex items-center justify-center cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-pink-500 transition-colors z-10">
                      <Play size={14} className="text-white ml-1" />
                    </div>
                    <div className="absolute bottom-1.5 right-2 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                      {(session.duration_ms / 1000).toFixed(1)}s
                    </div>
                  </div>

                  {/* Info */}
                  <div>
                    <h4 className="text-sm font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      User: <span className="text-pink-400">{session.user_id}</span>
                    </h4>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                        <Globe size={12} className="text-blue-400"/> {session.browser}
                      </span>
                      <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                        {getOsIcon(session.os)} {session.os}
                      </span>
                      <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                        <Clock size={12} className="text-emerald-400"/> 
                        {new Date(session.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-pink-500 hover:text-white text-gray-300 text-xs font-bold transition-colors">
                  View Replay
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
