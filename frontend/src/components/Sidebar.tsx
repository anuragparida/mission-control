import { NavLink } from 'react-router-dom';
import { Calendar, FolderKanban, BookOpen, FileText, Users, MonitorPlay, CheckSquare } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/memory', icon: BookOpen, label: 'Memory' },
  { to: '/docs', icon: FileText, label: 'Docs' },
  { to: '/team', icon: Users, label: 'Team' },
  { to: '/visual', icon: MonitorPlay, label: 'Visual Office' },
];

export function Sidebar() {
  return (
    <aside className="w-56 flex-shrink-0 flex flex-col h-full"
      style={{ background: '#0e0e14', borderRight: '1px solid #1e1e2e' }}
    >
      {/* Header */}
      <div className="px-4 py-5" style={{ borderBottom: '1px solid #1e1e2e' }}>
        <div className="flex items-center gap-2">
          <MonitorPlay size={18} style={{ color: '#c9a84c' }} />
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: '#e8e8f0' }}>
            Mission Control
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
          <span className="text-xs" style={{ color: '#6b6b80' }}>System Online</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                isActive
                  ? 'text-[#e8e8f0]'
                  : 'text-[#6b6b80] hover:text-[#e8e8f0]'
              )
            }
            style={({ isActive }) => ({
              background: isActive ? '#12121a' : 'transparent',
              borderLeft: isActive ? '2px solid #c9a84c' : '2px solid transparent',
            })}
          >
            <Icon size={16} style={{ color: '#6b6b80' }} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Mission statement */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid #1e1e2e' }}>
        <p className="text-xs leading-relaxed" style={{ color: '#6b6b80' }}>
          *"Run a lean, always-on AI crew on home infrastructure..."*
        </p>
      </div>
    </aside>
  );
}