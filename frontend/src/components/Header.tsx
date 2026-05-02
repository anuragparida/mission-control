import { useSnapshot } from '@/hooks/useWebSocket';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { connected } = useSnapshot();

  return (
    <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #1e1e2e' }}>
      <div>
        <h1 className="text-lg font-semibold" style={{ color: '#e8e8f0' }}>{title}</h1>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: '#6b6b80' }}>{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: '#6b6b80' }}>
          {connected ? 'LIVE' : 'RECONNECTING'}
        </span>
        <span
          className="w-1.5 h-1.5 rounded-full pulse-dot"
          style={{ background: connected ? '#3ecf8e' : '#cf3e5c' }}
        />
      </div>
    </div>
  );
}