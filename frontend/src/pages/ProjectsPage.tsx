import { Header } from '@/components/Header';
import { useSnapshot } from '@/hooks/useWebSocket';
import { FolderKanban } from 'lucide-react';

export function ProjectsPage() {
  const { data } = useSnapshot();
  const projects: any[] = (data as any)?.projects ?? [];
  const tasks: any[] = (data as any)?.tasks ?? [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="Projects" subtitle="Active projects and progress" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => {
            const linkedTasks = tasks.filter(t => t.project === project.id);
            const done = linkedTasks.filter(t => t.status === 'done').length;
            const progress = linkedTasks.length ? Math.round((done / linkedTasks.length) * 100) : 0;

            return (
              <div key={project.id} className="card p-5" style={{ borderLeft: '2px solid #c9a84c' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <FolderKanban size={14} style={{ color: '#c9a84c' }} />
                      <span className="font-semibold text-sm" style={{ color: '#e8e8f0' }}>{project.name}</span>
                    </div>
                    <div className="text-xs mt-1" style={{ color: '#6b6b80' }}>{project.description}</div>
                  </div>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded capitalize"
                    style={{
                      background: project.status === 'active' ? '#3ecf8e22' : '#6b6b8022',
                      color: project.status === 'active' ? '#3ecf8e' : '#6b6b80',
                    }}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1" style={{ color: '#6b6b80' }}>
                    <span>{linkedTasks.length} tasks</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1 rounded-full" style={{ background: '#1e1e2e' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${progress}%`, background: '#c9a84c' }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {projects.length === 0 && (
            <div className="col-span-2 text-center py-16 text-sm" style={{ color: '#6b6b80' }}>
              No projects yet — add <code className="px-1 rounded" style={{ background: '#1e1e2e' }}>~/.openclaw/projects/*.json</code> files
            </div>
          )}
        </div>
      </div>
    </div>
  );
}