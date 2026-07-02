import React, { useState, useEffect } from 'react';
import { Bot, Cpu, Zap, Activity, RotateCcw } from 'lucide-react';
import { API_BASE } from '../../../config';
import { fetchWithRetry, parseAPIResponse } from '../../../utils/api';

interface AgentEntry {
  id: string;
  project_id: string;
  agent_name: string;
  status: string;
  llm_calls: number;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  tools_used: string;
  error: string;
  duration_ms: number;
  timestamp: string;
}

export function AgentMonitor({ projectId }: { projectId: string }) {
  const [agents, setAgents] = useState<AgentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithRetry(`${API_BASE}/api/agents?projectId=${projectId}`, { 
        credentials: 'include',
        retries: 0,
      });
      const data = await parseAPIResponse(res);
      setAgents(Array.isArray(data) ? data : (data?.agents && Array.isArray(data.agents) ? data.agents : []));
    } catch (err) {
      console.error("Failed to fetch agents", err);
      setError('Failed to load agents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      setError('Please select a project to load agents.');
      setAgents([]);
      return;
    }
    fetchAgents();
  }, [projectId]);

  const totalTokens = agents.reduce((acc, curr) => acc + curr.total_tokens, 0);
  const totalCalls = agents.reduce((acc, curr) => acc + curr.llm_calls, 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl space-y-8">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>Telemetry and tracing specifically designed for LLM-powered autonomous agents.</p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 text-sm p-4 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 text-xl">×</button>
        </div>
      )}

      {loading && agents.length === 0 ? (
        <div className="text-center py-12 flex flex-col items-center gap-2 text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-violet-400"></div>
          <p className="text-xs">Loading agent data...</p>
        </div>
      ) : (
        <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl relative overflow-hidden hover:border-white/10 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 blur-2xl rounded-full"></div>
          <div className="flex items-center gap-3 mb-4">
            <Cpu size={18} className="text-violet-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Total Tokens Processed</h3>
          </div>
          <p className="text-4xl font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {totalTokens.toLocaleString()}
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl relative overflow-hidden hover:border-white/10 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-500/10 blur-2xl rounded-full"></div>
          <div className="flex items-center gap-3 mb-4">
            <Zap size={18} className="text-fuchsia-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Total LLM Calls</h3>
          </div>
          <p className="text-4xl font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {totalCalls.toLocaleString()}
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl relative overflow-hidden hover:border-white/10 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full"></div>
          <div className="flex items-center gap-3 mb-4">
            <Activity size={18} className="text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Active Agents</h3>
          </div>
          <p className="text-4xl font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {new Set(agents.map(a => a.agent_name)).size}
          </p>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot size={18} className="text-violet-400" />
            <h3 className="text-base font-bold text-white tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Agent Traces</h3>
          </div>
          <button onClick={fetchAgents} disabled={loading} className="p-2 text-gray-400 hover:text-white disabled:opacity-50 transition-colors">
            <RotateCcw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-gray-500 bg-white/[0.01]">
                <th className="px-6 py-4 font-bold">Agent Name</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Duration</th>
                <th className="px-6 py-4 font-bold text-right">Tokens</th>
                <th className="px-6 py-4 font-bold">Tools Used</th>
                <th className="px-6 py-4 font-bold text-right">Time</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading && agents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">Loading agent data...</td>
                </tr>
              ) : agents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">No agent runs recorded.</td>
                </tr>
              ) : (
                agents.map((agent) => (
                  <tr key={agent.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{agent.agent_name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        agent.status === 'ERROR' ? 'bg-red-500/10 text-red-400' : 
                        agent.status === 'RUNNING' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {agent.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-400 font-mono text-xs">{agent.duration_ms}ms</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-bold text-white text-xs">{(agent.total_tokens || 0).toLocaleString()} total</span>
                        <span className="text-[10px] text-gray-500">{agent.prompt_tokens} prompt / {agent.completion_tokens} comp</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400 truncate max-w-[200px]" title={agent.tools_used}>
                      {agent.tools_used || '-'}
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-gray-500">
                      {new Date(agent.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
