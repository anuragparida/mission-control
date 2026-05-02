import { Header } from '@/components/Header';
import { useSnapshot } from '@/hooks/useWebSocket';
import { Clock, Zap } from 'lucide-react';

function cronToHuman(expr: string): string {
  // Simple cron to human readable
  // Format: "0 20 * * 0" → "Sun at 20:00"
  const [min, hour, , , dow] = expr.split(' ');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const day = dow === '*' ? 'Daily' : days[parseInt(dow)] ?? dow;
  const h = parseInt(hour).toString().padStart(2, '0');
  const m = min.padStart(2, '0');
  return `${day} at ${h}:${m} UTC`;
}

function nextRun(expr: string): string {
  // Find next occurrence (simplified)
  const [min, hour, , , dow] = expr.split(' ');
  const now = new Date();
  const next = new Date();
  next.setUTCSeconds(0);
  next.setUTCMilliseconds(0);
  next.setUTCMinutes(parseInt(min));
  next.setUTCHours(parseInt(hour));

  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }

  if (dow !== '*') {
    const targetDow = parseInt(dow);
    let daysAhead = targetDow - next.getUTCDay();
    if (daysAhead < 0) daysAhead += 7;
    next.setUTCDate(next.getUTCDate() + daysAhead);
  }

  return next.toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
  }) + ' UTC';
}

export function CalendarPage() {
  const { data } = useSnapshot();
  const jobs: any[] = (data as any)?.cronJobs ?? [];

  const enabled = jobs.filter(j => j.enabled);
  const disabled = jobs.filter(j => !j.enabled);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="Calendar" subtitle="Scheduled jobs and system timers" />

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Upcoming */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#6b6b80' }}>
            Upcoming — {enabled.length} active
          </h2>
          <div className="space-y-2">
            {enabled.map((job) => (
              <div key={job.id} className="card p-4 flex items-start gap-4">
                <div className="p-2 rounded" style={{ background: '#1e1e2e' }}>
                  <Clock size={14} style={{ color: '#3ecfcf' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: '#e8e8f0' }}>{job.name}</span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ background: '#3ecf8e22', color: '#3ecf8e' }}
                    >
                      ACTIVE
                    </span>
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#6b6b80' }}>{job.description}</div>
                  <div className="text-xs mt-1 font-mono" style={{ color: '#c9a84c' }}>
                    {cronToHuman(job.schedule.expr)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs" style={{ color: '#6b6b80' }}>Next run</div>
                  <div className="text-xs font-mono mt-0.5" style={{ color: '#3ecfcf' }}>
                    {nextRun(job.schedule.expr)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disabled */}
        {disabled.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#6b6b80' }}>
              Disabled — {disabled.length}
            </h2>
            <div className="space-y-2 opacity-60">
              {disabled.map((job) => (
                <div key={job.id} className="card p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-sm" style={{ color: '#e8e8f0' }}>{job.name}</div>
                    <div className="text-xs font-mono mt-0.5" style={{ color: '#6b6b80' }}>
                      {job.schedule.expr}
                    </div>
                  </div>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#6b6b8022', color: '#6b6b80' }}>
                    DISABLED
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar hookup note */}
        <div className="card p-4 flex items-center gap-3" style={{ borderLeft: '2px solid #7c5cbf' }}>
          <Zap size={14} style={{ color: '#7c5cbf' }} />
          <div>
            <div className="text-sm" style={{ color: '#e8e8f0' }}>Google / Apple Calendar</div>
            <div className="text-xs mt-0.5" style={{ color: '#6b6b80' }}>
              Not yet connected — hook up after project completion
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}