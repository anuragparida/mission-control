import { useSnapshot } from '@/hooks/useWebSocket';
import { Header } from '@/components/Header';
import { AgentSprite } from '@/components/AgentSprite';

const AGENT_META: Record<string, { sprite: 'odyclaw' | 'perseus' | 'apollo' | 'athena' | 'helena'; role: string; schedule: string }> = {
  main: { sprite: 'odyclaw', role: 'Orchestrator / Chief of Staff', schedule: 'Always on' },
  'code-agent': { sprite: 'perseus', role: 'Code Agent', schedule: 'Nightly 23:00 UTC' },
  'planner-agent': { sprite: 'apollo', role: 'Planner', schedule: 'Weekly Sun 20:00 UTC' },
  'creative-agent': { sprite: 'athena', role: 'Creative (Journal, Blog, LinkedIn)', schedule: 'Mon/Thu 08:00, Wed 09:00, Tue/Fri 10:00 UTC' },
  'reviewer-agent': { sprite: 'helena', role: 'Reviewer / Quality Gate', schedule: 'On-demand' },
};

function getAgentStatus(agentId: string, sessions: Record<string, any>) {
  const mainSession = Object.values(sessions).find((s: any) => s?.sessionId);
  // Simple heuristic: main session active = OdyClaw active, others check lastUpdated
  if (agentId === 'main') {
    return mainSession ? 'active' : 'idle';
  }
  return 'idle';
}

export function TeamPage() {
  const { data } = useSnapshot();

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ color: '#6b6b80' }}>
        Connecting to backend...
      </div>
    );
  }

  const { agents, sessions, cronJobs, usage } = data as any;
  const totalSpent = usage?.total_spent_eur ?? 0;
  const budget = usage?.budget_eur ?? 50;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="Team" subtitle="Agent crew and system status" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Mission statement banner */}
        <div className="card p-5 text-center" style={{ borderLeft: '2px solid #c9a84c' }}>
          <p className="text-sm italic" style={{ color: '#e8e8f0' }}>
            "Run a lean, always-on AI crew on home infrastructure that autonomously builds software, produces publishable content, and ships products — so Anurag can focus on vision while the agents handle execution within budget."
          </p>
        </div>

        {/* Agent grid */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#6b6b80' }}>
            Crew — {agents.length} agents
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {agents.map((agent: any) => {
              const meta = AGENT_META[agent.id] ?? { sprite: 'odyclaw' as const, role: agent.name ?? agent.id, schedule: 'Unknown' };
              const status = getAgentStatus(agent.id, sessions) as 'active' | 'idle' | 'offline';
              return (
                <div key={agent.id} className="card p-4 flex items-start gap-4">
                  <AgentSprite name={meta.sprite} status={status} size={64} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm" style={{ color: '#e8e8f0' }}>
                        {agent.name ?? agent.id}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full pulse-dot"
                          style={{ background: status === 'active' ? '#3ecf8e' : status === 'idle' ? '#c9a84c' : '#6b6b80' }}
                        />
                        <span className="text-xs capitalize" style={{ color: '#6b6b80' }}>{status}</span>
                      </div>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: '#7c5cbf' }}>{meta.role}</div>
                    <div className="text-xs mt-2" style={{ color: '#6b6b80' }}>
                      <span className="opacity-60">Model: </span>
                      <span className="font-mono text-xs">{agent.model ?? 'unknown'}</span>
                    </div>
                    <div className="text-xs mt-1" style={{ color: '#6b6b80' }}>
                      <span className="opacity-60">Schedule: </span>{meta.schedule}
                    </div>
                    {usage?.agents?.[agent.id] && (
                      <div className="text-xs mt-1" style={{ color: '#6b6b80' }}>
                        <span className="opacity-60">Spent: </span>
                        <span style={{ color: '#c9a84c' }}>€{usage.agents[agent.id].spent_eur.toFixed(3)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System stats row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-4" style={{ borderLeft: '2px solid #c9a84c' }}>
            <div className="text-xs uppercase tracking-wider mb-1" style={{ color: '#6b6b80' }}>Monthly Budget</div>
            <div className="text-xl font-mono font-semibold" style={{ color: '#c9a84c' }}>€{budget}</div>
          </div>
          <div className="card p-4" style={{ borderLeft: '2px solid #3ecfcf' }}>
            <div className="text-xs uppercase tracking-wider mb-1" style={{ color: '#6b6b80' }}>Spent This Month</div>
            <div className="text-xl font-mono font-semibold" style={{ color: totalSpent > budget * 0.9 ? '#cf3e5c' : '#3ecf8e' }}>
              €{totalSpent.toFixed(3)}
            </div>
          </div>
          <div className="card p-4" style={{ borderLeft: '2px solid #7c5cbf' }}>
            <div className="text-xs uppercase tracking-wider mb-1" style={{ color: '#6b6b80' }}>Active Crons</div>
            <div className="text-xl font-mono font-semibold" style={{ color: '#7c5cbf' }}>
              {cronJobs.filter((j: any) => j.enabled).length} / {cronJobs.length}
            </div>
          </div>
        </div>

        {/* Active schedules */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#6b6b80' }}>
            Active Schedules
          </h2>
          <div className="space-y-2">
            {cronJobs.filter((j: any) => j.enabled).map((job: any) => (
              <div key={job.id} className="card p-3 flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-sm font-medium" style={{ color: '#e8e8f0' }}>{job.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#6b6b80' }}>{job.description}</div>
                </div>
                <div className="text-xs font-mono text-right" style={{ color: '#3ecfcf' }}>
                  {job.schedule.expr}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}