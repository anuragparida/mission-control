import { useSnapshot } from '@/hooks/useWebSocket';
import { AgentSprite } from '@/components/AgentSprite';
import { Header } from '@/components/Header';

const AGENTS = [
  { id: 'main', name: 'OdyClaw', sprite: 'odyclaw' as const, role: 'Orchestrator' },
  { id: 'code-agent', name: 'Perseus', sprite: 'perseus' as const, role: 'Code Agent' },
  { id: 'planner-agent', name: 'Apollo', sprite: 'apollo' as const, role: 'Planner' },
  { id: 'creative-agent', name: 'Athena', sprite: 'athena' as const, role: 'Creative' },
  { id: 'reviewer-agent', name: 'Helena', sprite: 'helena' as const, role: 'Reviewer' },
];

const TICKER_ITEMS = [
  'OdyClaw: System nominal',
  'Perseus: Nightly run at 23:00 UTC',
  'Apollo: Weekly audit Sun 20:00 UTC',
  'Athena: Journal Mon/Thu 08:00 UTC',
  'Helena: On-demand review ready',
  'Budget: €50/month — €0.00 spent',
  'All agents operational',
  'Workspace: 512GB SSD available',
];

export function VisualPage() {
  const { data } = useSnapshot();
  const sessions: Record<string, any> = (data as any)?.sessions ?? {};

  // Determine status for each agent
  function getStatus(agentId: string): 'active' | 'idle' | 'offline' {
    if (agentId === 'main') {
      const mainSes = Object.values(sessions).find((s: any) => s?.sessionId);
      return mainSes ? 'active' : 'idle';
    }
    return 'idle';
  }

  const tickerRepeated = [...TICKER_ITEMS, ...TICKER_ITEMS]; // double for seamless loop

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="Visual Office" subtitle="Agent workspace — live status" />

      {/* Agent grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {AGENTS.map(agent => {
            const status = getStatus(agent.id);
            return (
              <div key={agent.id} className="card p-4 flex flex-col items-center gap-3">
                {/* Desk + sprite */}
                <div
                  className="relative w-full aspect-square flex items-center justify-center rounded"
                  style={{
                    background: status === 'active' ? '#1a1a24' : '#12121a',
                    border: `1px solid ${status === 'active' ? '#c9a84c44' : '#1e1e2e'}`,
                  }}
                >
                  <AgentSprite name={agent.sprite} status={status} size={80} />
                  {status === 'active' && (
                    <div className="absolute inset-0 rounded pointer-events-none" style={{ boxShadow: 'inset 0 0 20px #c9a84c11' }} />
                  )}
                </div>
                {/* Name + role */}
                <div className="text-center">
                  <div className="text-sm font-semibold" style={{ color: '#e8e8f0' }}>{agent.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#6b6b80' }}>{agent.role}</div>
                </div>
                {/* Status */}
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full pulse-dot"
                    style={{ background: status === 'active' ? '#3ecf8e' : status === 'idle' ? '#c9a84c' : '#6b6b80' }}
                  />
                  <span className="text-xs capitalize" style={{ color: '#6b6b80' }}>{status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scrolling ticker */}
      <div
        className="flex-none overflow-hidden py-3"
        style={{ background: '#0e0e14', borderTop: '1px solid #1e1e2e' }}
      >
        <div className="ticker-scroll flex gap-12 whitespace-nowrap">
          {tickerRepeated.map((item, i) => (
            <span key={i} className="text-xs" style={{ color: '#6b6b80' }}>
              {item}
              <span className="mx-8" style={{ color: '#1e1e2e' }}>•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}