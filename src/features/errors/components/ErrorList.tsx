/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../../config';
import { marked } from "marked";
import { fetchWithRetry, parseAPIResponse, APIError } from '../../../utils/api';
import { escapeHTML } from '../../../utils/security';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorLog {
  id: number;
  project_id: string;
  message: string;
  stack: string;
  metadata: string;
  ai_explanation: string;
  occurrence_count: number;
  timestamp: string;
}

export function ErrorList({ projectId }: { projectId: string }) {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchErrors = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchWithRetry(
        `${API_BASE}/api/errors?projectId=${encodeURIComponent(projectId)}`,
        { credentials: 'include', retries: 0 }
      );
      const data = await parseAPIResponse(res);
      setErrors(Array.isArray(data) ? data : (data?.errors && Array.isArray(data.errors) ? data.errors : []));
    } catch (err) {
      console.error("Failed to fetch errors", err);
      if (err instanceof APIError) {
        setError(`API Error (${err.statusCode}): Failed to load errors. Please try again.`);
      } else {
        setError('Network error: Failed to load errors. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      setError('Please select a project to load errors.');
      setErrors([]);
      return;
    }
    fetchErrors();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-400"></div>
        <p className="text-sm text-gray-400">Loading errors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <AlertCircle size={24} className="text-red-400" />
          <h3 className="text-lg font-semibold text-red-300">Failed to load errors</h3>
        </div>
        <p className="text-gray-300 text-sm mb-6">{error}</p>
        <button
          onClick={fetchErrors}
          className="bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 mx-auto"
        >
          <RotateCcw size={16} /> Try Again
        </button>
      </div>
    );
  }

  if (errors.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl text-center shadow-2xl">
        <div className="text-4xl mb-4">✨</div>
        <h3 className="text-xl font-medium text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>No errors found!</h3>
        <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>Your application is running smoothly.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {errors.map((errorItem) => {
        let metadata: Record<string, any> = {};
        try { metadata = JSON.parse(errorItem.metadata || "{}"); } catch {}
        const time = new Date(errorItem.timestamp).toLocaleString();
        
        // Escape error message to prevent XSS
        const safeMesage = escapeHTML(errorItem.message);
        const safeUrl = escapeHTML(metadata.url || "N/A");
        const safeUserAgent = escapeHTML(metadata.userAgent || "N/A");
        
        return (
          <div key={errorItem.id} className="group bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 backdrop-blur-xl border border-white/[0.06] p-6 rounded-2xl shadow-lg relative overflow-hidden">
            {/* Left Accent Bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500/80"></div>
            
            <div className="flex justify-between items-start mb-3 pl-4">
              <div className="flex items-center gap-3 flex-1">
                <h3 className="text-base font-semibold text-red-400 break-words" style={{ fontFamily: "'JetBrains Mono', monospace" }} title={safeMesage}>
                  {safeMesage}
                </h3>
                {errorItem.occurrence_count > 1 && (
                  <span className="bg-red-500/20 border border-red-500/30 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                    {errorItem.occurrence_count} Events
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 bg-black/40 px-2.5 py-1 rounded-md ml-4 whitespace-nowrap shrink-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                {time}
              </span>
            </div>

            <div className="pl-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400 mb-4">
              <div style={{ fontFamily: "'Inter', sans-serif" }}>
                <span className="text-gray-600 text-xs">URL:</span>
                <p className="truncate text-xs mt-1" title={safeUrl}>{safeUrl}</p>
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif" }}>
                <span className="text-gray-600 text-xs">User Agent:</span>
                <p className="truncate text-xs mt-1" title={safeUserAgent}>{safeUserAgent}</p>
              </div>
            </div>

            <div className="pl-4 mt-4">
              {errorItem.stack ? (
                <details className="cursor-pointer group/details">
                  <summary className="text-xs text-violet-400 hover:text-violet-300 transition-colors uppercase tracking-wider font-semibold list-none flex items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span className="mr-2 opacity-50 group-open/details:rotate-90 transition-transform">▶</span>
                    View Stack Trace
                  </summary>
                  <pre className="mt-4 p-4 bg-black/50 border border-white/5 rounded-xl text-xs text-gray-400 overflow-x-auto max-h-96" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {escapeHTML(errorItem.stack)}
                  </pre>
                </details>
              ) : (
                <p className="text-xs text-gray-500 italic">No stack trace available</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
