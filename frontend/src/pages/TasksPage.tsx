import { Header } from '@/components/Header';
import { useSnapshot } from '@/hooks/useWebSocket';

type TaskStatus = 'backlog' | 'in-progress' | 'done';

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: '#6b6b80' },
  { id: 'in-progress', label: 'In Progress', color: '#c9a84c' },
  { id: 'done', label: 'Done', color: '#3ecf8e' },
];

function TaskCard({ task }: { task: any }) {
  const date = new Date(task.updated * 1000).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  });

  return (
    <div className="card p-3 mb-2" style={{ borderLeft: '2px solid #c9a84c' }}>
      <div className="text-sm font-medium leading-snug" style={{ color: '#e8e8f0' }}>
        {task.title ?? 'Untitled task'}
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs" style={{ color: '#6b6b80' }}>
          {task.agent ?? 'unassigned'}
        </span>
        <span className="text-xs font-mono" style={{ color: '#6b6b80' }}>
          {date}
        </span>
      </div>
    </div>
  );
}

export function TasksPage() {
  const { data } = useSnapshot();

  const tasks: any[] = (data as any)?.tasks ?? [];
  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => t.status === col.id);
    return acc;
  }, {} as Record<TaskStatus, any[]>);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header
        title="Tasks"
        subtitle={`${tasks.length} total — ${tasks.filter(t => t.status === 'in-progress').length} in progress`}
      />

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 p-6 h-full" style={{ minWidth: 'max-content' }}>
          {COLUMNS.map((col) => (
            <div key={col.id} className="flex flex-col w-72 flex-shrink-0">
              {/* Column header */}
              <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: `2px solid ${col.color}` }}>
                <span className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#e8e8f0' }}>
                  {col.label}
                </span>
                <span className="text-xs font-mono ml-auto" style={{ color: '#6b6b80' }}>
                  {grouped[col.id].length}
                </span>
              </div>

              {/* Tasks */}
              <div className="flex-1 overflow-y-auto pr-1">
                {grouped[col.id].length === 0 ? (
                  <div className="text-center py-8 text-xs" style={{ color: '#6b6b80' }}>
                    No tasks
                  </div>
                ) : (
                  grouped[col.id].map((task: any) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}