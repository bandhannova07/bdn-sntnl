import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../../config';
import { ShieldCheck, Terminal, Workflow, Activity, RotateCcw } from 'lucide-react';
import { fetchWithRetry, parseAPIResponse } from '../../../utils/api';

interface ErrorLog {
  id: number;
  message: string;
  occurrence_count: number;
  timestamp: string;
}

interface LogEntry {
  id: number;
  level: string;
  message: string;
  timestamp: string;
}

interface TraceEntry {
  id: string;
  name: string;
  duration_ms: number;
}

export default function OverviewDashboard({ projectId }: { projectId: string }) {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [traces, setTraces] = useState<TraceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);

    try {
      const [errorsRes, logsRes, tracesRes] = await Promise.all([
        fetchWithRetry(`${API_BASE}/api/errors?projectId=${encodeURIComponent(projectId)}`, { 
          credentials: 'include',
          retries: 0,
        }),
        fetchWithRetry(`${API_BASE}/api/logs?projectId=${encodeURIComponent(projectId)}`, { 
          credentials: 'include',
          retries: 0,
        }),
        fetchWithRetry(`${API_BASE}/api/traces?projectId=${encodeURIComponent(projectId)}`, { 
          credentials: 'include',
          retries: 0,
        }),
      ]);

      const [errorsData, logsData, tracesData] = await Promise.all([
        parseAPIResponse(errorsRes),
        parseAPIResponse(logsRes),
        parseAPIResponse(tracesRes),
      ]);

      setErrors(Array.isArray(errorsData) ? errorsData.slice(0, 5) : []);
      setLogs(Array.isArray(logsData) ? logsData.slice(0, 5) : []);
      setTraces(Array.isArray(tracesData) ? tracesData.slice(0, 5) : []);
    } catch (err) {
      console.error("Failed to load overview data", err);
      setError('Failed to load overview data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      setError('Please select a project to load dashboard data.');
      setErrors([]);
      setLogs([]);
      setTraces([]);
      return;
    }

    fetchData();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-400"></div>
        <p className="text-sm text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  const errorCount = Array.isArray(errors) ? errors.reduce((acc, curr) => acc + (curr?.occurrence_count || 1), 0) : 0;
  const avgTraceTime = (Array.isArray(traces) && traces.length > 0) ? (traces.reduce((acc, curr) => acc + (curr?.duration_ms || 0), 0) / traces.length).toFixed(0) : 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] w-full mx-auto space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 text-sm p-4 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchData} className="text-red-400 hover:text-red-300 text-xl">↻ Retry</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Errors Summary Card */}
        <div className="bg-white/[0.02] border border-white/[0.06] p-5 rounded-xl hover:border-white/10 transition-colors">

          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck size={18} className="text-red-400" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Recent Errors</h3>
          </div>
          <p className="text-4xl font-extrabold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {errorCount}
          </p>
          <p className="text-sm text-gray-500">Across {Array.isArray(errors) ? errors.length : 0} unique types</p>
        </div>

        {/* Trace Summary Card */}
        <div className="bg-white/[0.02] border border-white/[0.06] p-5 rounded-xl hover:border-white/10 transition-colors">

          <div className="flex items-center gap-3 mb-4">
            <Workflow size={18} className="text-violet-400" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Avg Trace Time</h3>
          </div>
          <p className="text-4xl font-extrabold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {avgTraceTime}ms
          </p>
          <p className="text-sm text-gray-500">From recent traces</p>
        </div>

        {/* Logs Summary Card */}
        <div className="bg-white/[0.02] border border-white/[0.06] p-5 rounded-xl hover:border-white/10 transition-colors">

          <div className="flex items-center gap-3 mb-4">
            <Terminal size={18} className="text-blue-400" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Recent Logs</h3>
          </div>
          <p className="text-4xl font-extrabold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {Array.isArray(logs) ? logs.length : 0}
          </p>
          <p className="text-sm text-gray-500">Captured events</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Top Errors */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/[0.04] bg-white/[0.01]">
            <h3 className="text-base font-bold text-white tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Top Errors</h3>
          </div>
          <div className="p-4 space-y-3">
            {!Array.isArray(errors) || errors.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No recent errors</p>
            ) : (
              errors.map((error, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white/[0.01] p-3 rounded-lg border border-white/[0.03] hover:border-white/[0.06] transition-colors">
                  <p className="text-sm text-red-300 font-mono truncate mr-2" title={error?.message || ''}>{error?.message || 'Unknown error'}</p>
                  <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">{error?.occurrence_count || 1}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Logs */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/[0.04] bg-white/[0.01]">
            <h3 className="text-base font-bold text-white tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Latest Logs</h3>
          </div>
          <div className="p-4 space-y-3">
            {!Array.isArray(logs) || logs.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No recent logs</p>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="flex gap-3 items-center bg-white/[0.01] p-3 rounded-lg border border-white/[0.03] hover:border-white/[0.06] transition-colors">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${log?.level?.toLowerCase() === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`}>{log?.level || 'INFO'}</span>
                  <p className="text-sm text-gray-300 font-mono truncate">{log?.message || ''}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
