import React, { useState, useEffect } from 'react';
import { Workflow, CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react';
import { API_BASE } from '../../../config';
import { fetchWithRetry, parseAPIResponse } from '../../../utils/api';

interface TraceEntry {
  id: string;
  project_id: string;
  name: string;
  status: string;
  duration_ms: number;
  timestamp: string;
}

export function TraceViewer({ projectId }: { projectId: string }) {
  const [traces, setTraces] = useState<TraceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTraces = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithRetry(`${API_BASE}/api/traces?projectId=${projectId}`, { 
        credentials: 'include',
        retries: 0,
      });
      const data = await parseAPIResponse(res);
      setTraces(Array.isArray(data) ? data : (data?.traces && Array.isArray(data.traces) ? data.traces : []));
    } catch (err) {
      console.error("Failed to fetch traces", err);
      setError('Failed to load traces. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      setError('Please select a project to load traces.');
      setTraces([]);
      return;
    }
    fetchTraces();
  }, [projectId]);

  const maxDuration = traces.length > 0 ? Math.max(...traces.map(t => t.duration_ms || 100)) : 100;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>End-to-end distributed tracing across microservices.</p>
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
            <div className="p-2 bg-violet-500/10 rounded-xl">
              <Workflow size={18} className="text-violet-400" />
            </div>
            <h3 className="text-base font-bold text-white tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Trace Waterfall</h3>
          </div>
          <button onClick={fetchTraces} disabled={loading} className="p-2 text-gray-400 hover:text-white disabled:opacity-50 transition-colors">
            <RotateCcw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="p-6">
          {loading && traces.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center gap-2 text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-violet-400"></div>
              <p className="text-xs">Loading traces...</p>
            </div>
          ) : error && traces.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm mb-4">Failed to load traces</p>
              <button onClick={fetchTraces} className="text-xs text-violet-400 hover:text-violet-300 underline">Try again</button>
            </div>
          ) : traces.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No traces recorded yet.</div>
          ) : (
            <div className="space-y-4">
              {traces.map((trace) => {
                const widthPercent = Math.max((trace.duration_ms / maxDuration) * 100, 2);
                const isError = trace.status !== '200' && trace.status !== '201' && trace.status !== '204';
                
                return (
                  <div key={trace.id} className="group relative">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {isError ? (
                          <XCircle size={14} className="text-red-400" />
                        ) : (
                          <CheckCircle size={14} className="text-emerald-400" />
                        )}
                        <span className="text-xs font-bold text-gray-200" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          {trace.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                        <span>Status: {trace.status}</span>
                        <span className="flex items-center gap-1"><Clock size={12}/> {trace.duration_ms}ms</span>
                      </div>
                    </div>
                    
                    <div className="h-4 bg-white/5 rounded-full overflow-hidden w-full flex items-center">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${isError ? 'bg-red-500' : 'bg-gradient-to-r from-violet-500 to-fuchsia-500'}`}
                        style={{ width: `${widthPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
