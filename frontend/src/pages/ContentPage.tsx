import { useState, useMemo } from 'react';
import { useSnapshot } from '@/hooks/useWebSocket';
import { Header } from '@/components/Header';
import type { Topic } from '@/types';
import { Plus, TrendingUp, X } from 'lucide-react';

type FilterSegment = 'all' | 'make-now' | 'watch-closely';

const SEGMENTS: { id: FilterSegment; label: string; color: string }[] = [
  { id: 'make-now', label: '70+ MAKE NOW', color: '#3ecf8e' },
  { id: 'watch-closely', label: '50–69 Watch Closely', color: '#c9a84c' },
  { id: 'all', label: 'ALL', color: '#6b6b80' },
];

const SCORE_COLORS: Record<string, string> = {
  high: '#3ecf8e',
  mid: '#c9a84c',
  low: '#6b6b80',
};

function scoreColor(score: number) {
  if (score >= 70) return SCORE_COLORS.high;
  if (score >= 50) return SCORE_COLORS.mid;
  return SCORE_COLORS.low;
}

function TopicCard({ topic, onDelete }: { topic: Topic; onDelete: (id: string) => void }) {
  const col = scoreColor(topic.score);
  return (
    <div className="card p-4 flex flex-col gap-3 relative group" style={{ borderLeft: `2px solid ${col}` }}>
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold leading-snug" style={{ color: '#e8e8f0' }}>
            {topic.name}
          </div>
          {topic.notes && (
            <div className="text-xs mt-1 leading-relaxed" style={{ color: '#6b6b80' }}>
              {topic.notes}
            </div>
          )}
        </div>
        {/* Score badge */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded flex items-center justify-center font-mono text-sm font-bold"
          style={{
            background: `${col}18`,
            color: col,
            border: `1px solid ${col}44`,
          }}
        >
          {topic.score}
        </div>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {topic.tags.map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: '#1e1e2e',
                color: '#7c5cbf',
                border: '1px solid #7c5cbf33',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Tracked + delete */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <TrendingUp size={10} style={{ color: '#6b6b80' }} />
            <span className="text-xs font-mono" style={{ color: '#6b6b80' }}>
              Tracked {topic.trackedWeeks}w
            </span>
          </div>
          <button
            onClick={() => onDelete(topic.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-900/30"
            style={{ color: '#cf3e5c' }}
          >
            <X size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

function AddTopicModal({ onClose, onAdd }: { onClose: () => void; onAdd: (t: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>) => void }) {
  const [name, setName] = useState('');
  const [score, setScore] = useState('65');
  const [trackedWeeks, setTrackedWeeks] = useState('1');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      score: Math.min(100, Math.max(0, parseInt(score) || 50)),
      trackedWeeks: parseInt(trackedWeeks) || 1,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      notes: notes.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: '#0a0a0fcc' }}>
      <div className="card p-6 w-full max-w-md flex flex-col gap-4" style={{ border: '1px solid #1e1e2e' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold" style={{ color: '#e8e8f0' }}>Add Topic</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10" style={{ color: '#6b6b80' }}>
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider" style={{ color: '#6b6b80' }}>Topic Name</span>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. AI Coding Agents"
              className="input"
              required
            />
          </label>
          <div className="flex gap-3">
            <label className="flex flex-col gap-1 flex-1">
              <span className="text-xs uppercase tracking-wider" style={{ color: '#6b6b80' }}>Score (0–100)</span>
              <input
                type="number" min="0" max="100"
                value={score}
                onChange={e => setScore(e.target.value)}
                className="input"
              />
            </label>
            <label className="flex flex-col gap-1 flex-1">
              <span className="text-xs uppercase tracking-wider" style={{ color: '#6b6b80' }}>Tracked (weeks)</span>
              <input
                type="number" min="1"
                value={trackedWeeks}
                onChange={e => setTrackedWeeks(e.target.value)}
                className="input"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider" style={{ color: '#6b6b80' }}>Tags (comma-separated)</span>
            <input
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="#autonomy, #devtools"
              className="input"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider" style={{ color: '#6b6b80' }}>Notes</span>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Brief description or context..."
              rows={3}
              className="input resize-none"
            />
          </label>
          <button type="submit" className="btn btn-primary mt-1">
            Add Topic
          </button>
        </form>
      </div>
    </div>
  );
}

export function ContentPage() {
  const { data } = useSnapshot();
  const [filter, setFilter] = useState<FilterSegment>('all');
  const [showAdd, setShowAdd] = useState(false);

  const topics: Topic[] = (data as any)?.topics ?? [];

  const filtered = useMemo(() => {
    if (filter === 'make-now') return topics.filter(t => t.score >= 70);
    if (filter === 'watch-closely') return topics.filter(t => t.score >= 50 && t.score < 70);
    return topics;
  }, [topics, filter]);

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/topics/${id}`, { method: 'DELETE' });
    } catch {
      // refresh will come via WS broadcast
    }
  }

  async function handleAdd(topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(topic),
      });
      setShowAdd(false);
    } catch {
      // refresh will come via WS broadcast
    }
  }

  const makeNowCount = topics.filter(t => t.score >= 70).length;
  const watchCount = topics.filter(t => t.score >= 50 && t.score < 70).length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header
        title="Content"
        subtitle={`${topics.length} topics tracked`}
        action={
          <button onClick={() => setShowAdd(true)} className="btn btn-primary flex items-center gap-2 text-xs">
            <Plus size={14} />
            Add Topic
          </button>
        }
      />

      {/* Filter bar */}
      <div
        className="flex items-center gap-1 px-6 py-3"
        style={{ borderBottom: '1px solid #1e1e2e' }}
      >
        <span className="text-xs mr-2" style={{ color: '#6b6b80' }}>sorted by score</span>
        <div className="flex gap-1">
          {SEGMENTS.map(seg => {
            const count = seg.id === 'make-now' ? makeNowCount : seg.id === 'watch-closely' ? watchCount : topics.length;
            return (
              <button
                key={seg.id}
                onClick={() => setFilter(seg.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all"
                style={{
                  background: filter === seg.id ? `${seg.color}18` : 'transparent',
                  color: filter === seg.id ? seg.color : '#6b6b80',
                  border: `1px solid ${filter === seg.id ? seg.color + '44' : '#1e1e2e'}`,
                }}
              >
                {seg.label}
                <span
                  className="font-mono text-xs"
                  style={{ opacity: 0.7 }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-sm" style={{ color: '#6b6b80' }}>
            No topics match this filter
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(topic => (
              <TopicCard key={topic.id} topic={topic} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <AddTopicModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />
      )}
    </div>
  );
}
