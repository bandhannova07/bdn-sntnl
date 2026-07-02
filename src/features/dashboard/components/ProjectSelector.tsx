import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus, Folder, AlertCircle } from 'lucide-react';
import { API_BASE } from '../../../config';
import { fetchWithRetry, parseAPIResponse } from '../../../utils/api';
import { useNotification } from '../../../components/NotificationProvider';

export interface Project {
  id: string;
  name: string;
  role: string;
  created_at: string;
}

interface Props {
  userId: string;
  selectedProjectId: string | null;
  onProjectChange: (project: Project) => void;
}

export default function ProjectSelector({ userId, selectedProjectId, onProjectChange }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { addNotification } = useNotification();
  const autoSelectedRef = useRef(false);

  useEffect(() => {
    autoSelectedRef.current = false;
    fetchProjects();
  }, [userId]);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithRetry(`${API_BASE}/api/projects?userId=${userId}`, { 
        credentials: 'include',
        retries: 0,
      });
      const data = await parseAPIResponse(res);
      const nextProjects = Array.isArray(data) ? data : [];
      setProjects(nextProjects);
      
      if (!selectedProjectId && nextProjects.length > 0 && !autoSelectedRef.current) {
        autoSelectedRef.current = true;
        onProjectChange(nextProjects[0]);
      }
    } catch (err) {
      console.error('Failed to load projects', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateProjectName = (name: string): string | null => {
    const trimmed = name.trim();
    if (!trimmed) return 'Project name cannot be empty';
    if (trimmed.length < 3) return 'Project name must be at least 3 characters';
    if (trimmed.length > 50) return 'Project name must be less than 50 characters';
    if (!/^[a-zA-Z0-9\s\-_.]+$/.test(trimmed)) return 'Project name can only contain letters, numbers, spaces, dashes, underscores, and periods';
    if (projects.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) return 'A project with this name already exists';
    return null;
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    
    const validErr = validateProjectName(newProjectName);
    if (validErr) {
      setValidationError(validErr);
      return;
    }

    try {
      setIsCreating(true);
      const res = await fetchWithRetry(`${API_BASE}/api/projects?userId=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: newProjectName.trim() }),
        retries: 1,
      });
      
      const newProject = await parseAPIResponse(res);
      setProjects([newProject, ...projects]);
      onProjectChange(newProject);
      setNewProjectName('');
      setIsCreating(false);
      setIsOpen(false);
      addNotification('success', `Project "${newProjectName}" created successfully`);
    } catch (err) {
      console.error('Failed to create project', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to create project';
      setValidationError(errorMsg);
      addNotification('error', errorMsg);
    } finally {
      setIsCreating(false);
    }
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open project picker"
        className="flex items-center gap-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
      >
        <Folder size={16} className="text-violet-400" />
        <span className="text-sm font-medium text-white max-w-[120px] truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
          {loading ? 'Loading...' : (selectedProject?.name || 'No Projects')}
        </span>
        <ChevronDown size={14} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-[#111113] border border-white/10 rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.9)] z-[9999] overflow-hidden backdrop-blur-3xl">
          {isCreating ? (
            <div className="p-4">
              <form onSubmit={handleCreateProject}>
                <label className="block text-xs text-gray-400 mb-2 font-medium">New Project Name</label>
                <input
                  type="text"
                  autoFocus
                  value={newProjectName}
                  onChange={e => {
                    setNewProjectName(e.target.value);
                    setValidationError(null);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white mb-3 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30"
                  placeholder="e.g. Production Web"
                />
                {validationError && (
                  <div className="flex items-center gap-2 px-3 py-2 mb-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertCircle size={14} className="text-red-400 shrink-0" />
                    <p className="text-xs text-red-300">{validationError}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 disabled:cursor-not-allowed text-white text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isCreating && <span className="animate-spin w-3 h-3 border border-white/30 border-t-white rounded-full"></span>}
                    {isCreating ? 'Creating...' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setValidationError(null);
                      setNewProjectName('');
                    }}
                    disabled={isCreating}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-800/50 text-gray-300 text-xs font-semibold py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="max-h-60 overflow-y-auto py-2">
                {projects.length === 0 ? (
                  <div className="px-4 py-3 text-xs text-gray-500">No projects found.</div>
                ) : (
                  projects.map(project => (
                    <button
                      key={project.id}
                      onClick={() => {
                        onProjectChange(project);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                        selectedProject?.id === project.id 
                          ? 'bg-violet-500/10 text-violet-300' 
                          : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <span className="truncate pr-2">{project.name}</span>
                      {selectedProject?.id === project.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                      )}
                    </button>
                  ))
                )}
              </div>
              <div className="border-t border-white/5 p-2 bg-[#0a0a0a]">
                <button
                  onClick={() => setIsCreating(true)}
                  className="w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white py-2 transition-colors"
                >
                  <Plus size={16} /> Create New Project
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
