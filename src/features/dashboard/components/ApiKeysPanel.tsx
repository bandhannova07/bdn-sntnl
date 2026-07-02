/** @jsxImportSource react */
import { useState, useEffect } from 'react';
import { API_BASE } from '../../../config';
import { fetchWithRetry, parseAPIResponse } from '../../../utils/api';
import { maskSensitiveData } from '../../../utils/security';
import { useNotification } from '../../../components/NotificationProvider';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { Copy, Trash2, Plus } from 'lucide-react';

export default function ApiKeysPanel({ projectId, userId }: { projectId: string; userId: string }) {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [newRawKey, setNewRawKey] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Confirm dialog for delete
  const [deleteConfirm, setDeleteConfirm] = useState<{isOpen: boolean; keyId: string | null; keyName: string}>({
    isOpen: false,
    keyId: null,
    keyName: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { addNotification } = useNotification();

  useEffect(() => {
    if (!projectId || !userId) {
      setLoading(false);
      setError('Please select a project and sign in to load API keys.');
      setKeys([]);
      return;
    }
    fetchKeys();
  }, [projectId, userId]);

  const fetchKeys = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithRetry(`${API_BASE}/api/apikeys?projectId=${projectId}`, { 
        credentials: 'include',
        retries: 0,
      });
      const data = await parseAPIResponse(res);
      setKeys(Array.isArray(data) ? data : (data?.keys || []));
    } catch (err) {
      console.error('Failed to fetch API keys', err);
      setError('Failed to load API keys. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = newKeyName.trim();
    if (!trimmedName) {
      addNotification('warning', 'Please enter a key name', 4000);
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const res = await fetchWithRetry(`${API_BASE}/api/apikeys?projectId=${projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: trimmedName }),
        retries: 2,
      });
      
      const data = await parseAPIResponse(res);
      setNewRawKey(data.raw_key);
      setNewKeyName('');
      addNotification('success', 'API key created successfully!', 4000);
      fetchKeys();
    } catch (err) {
      console.error('Failed to create API key', err);
      setError('Failed to create API key. Please try again.');
      addNotification('error', 'Could not create API key', 5000);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteKeyClick = (keyId: string, keyName: string) => {
    setDeleteConfirm({
      isOpen: true,
      keyId,
      keyName,
    });
  };

  const handleDeleteKeyConfirm = async () => {
    if (!deleteConfirm.keyId) return;

    setIsDeleting(true);
    try {
      await fetchWithRetry(`${API_BASE}/api/apikeys?projectId=${projectId}&keyId=${deleteConfirm.keyId}`, {
        method: 'DELETE',
        credentials: 'include',
        retries: 2,
      });
      
      addNotification('success', 'API key revoked successfully', 4000);
      fetchKeys();
      setDeleteConfirm({ isOpen: false, keyId: null, keyName: '' });
    } catch (err) {
      console.error('Failed to delete API key', err);
      addNotification('error', 'Failed to revoke API key', 5000);
    } finally {
      setIsDeleting(false);
    }
  };

  const copyToClipboard = (text: string, label: string = 'API Key') => {
    navigator.clipboard.writeText(text).then(() => {
      addNotification('success', `${label} copied to clipboard!`, 3000);
    }).catch(() => {
      addNotification('error', 'Failed to copy to clipboard', 3000);
    });
  };

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 text-sm p-4 rounded-lg mb-6 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 text-xl">×</button>
        </div>
      )}

      <h2 className="text-2xl font-bold text-white mb-2">API Keys</h2>
      <p className="text-gray-400 text-sm mb-8">
        Use these keys to authenticate your application with the Sentinel SDK and API.
        <span className="text-red-400 font-semibold"> Keep them secret. Do not expose them in client-side code.</span>
      </p>

      {/* New Key Display */}
      {newRawKey && (
        <div className="bg-emerald-500/15 border border-emerald-500/50 rounded-lg p-6 mb-8">
          <h3 className="text-emerald-400 font-bold mb-1 flex items-center gap-2">
            <span className="text-lg">🎉</span> New API Key Created!
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            Please copy your new API key now. <span className="font-semibold text-red-400">You won't be able to see it again!</span>
          </p>
          <div className="flex gap-2 mb-4">
            <code className="flex-1 bg-black/40 border border-emerald-500/30 rounded-lg px-4 py-3 text-emerald-300 font-mono text-sm break-all">
              {newRawKey}
            </code>
            <button
              onClick={() => copyToClipboard(newRawKey, 'API Key')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 shrink-0"
            >
              <Copy size={16} /> Copy
            </button>
          </div>
          <button 
            onClick={() => setNewRawKey(null)}
            className="text-sm text-gray-400 hover:text-white underline transition-colors"
          >
            I have copied it, close this
          </button>
        </div>
      )}

      {/* Create Key Form */}
      <form onSubmit={handleCreateKey} className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          placeholder="New Key Name (e.g. Production Web)"
          maxLength={100}
          disabled={isCreating}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-violet-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        />
        <button
          type="submit"
          disabled={isCreating || !newKeyName.trim()}
          className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          {isCreating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus size={16} /> Create Key
            </>
          )}
        </button>
      </form>

      {/* Keys List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
          <span>Loading keys...</span>
        </div>
      ) : keys.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-lg">
          <p className="text-gray-500 text-sm">No API keys found. Create one to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-gray-500 bg-white/[0.01]">
                <th className="pb-3 px-4 font-semibold">Name</th>
                <th className="pb-3 px-4 font-semibold">Prefix</th>
                <th className="pb-3 px-4 font-semibold">Created</th>
                <th className="pb-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {keys.map((key) => (
                <tr key={key.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 text-gray-200 font-medium">{key.name}</td>
                  <td className="py-3 px-4 text-gray-400 font-mono text-xs">
                    {maskSensitiveData(key.prefix, 6)}
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {new Date(key.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeleteKeyClick(key.id, key.name)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-md transition-all text-xs font-semibold flex items-center gap-1.5 ml-auto"
                    >
                      <Trash2 size={14} /> Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Revoke API Key?"
        message={`This will immediately revoke the "${deleteConfirm.keyName}" API key. Any integrations using this key will stop working and this action cannot be undone.`}
        confirmText="Revoke Key"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteKeyConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, keyId: null, keyName: '' })}
      />
    </div>
  );
}
