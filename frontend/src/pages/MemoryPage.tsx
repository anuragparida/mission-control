import { useState } from 'react';
import { Header } from '@/components/Header';
import { useSnapshot } from '@/hooks/useWebSocket';
import { Search } from 'lucide-react';

export function MemoryPage() {
  const { data } = useSnapshot();
  const [query, setQuery] = useState('');

  const memoryContent: string = (data as any)?.memory ?? '';
  const lines = memoryContent.split('\n');

  const filtered = query
    ? lines.filter(l => l.toLowerCase().includes(query.toLowerCase()))
    : lines;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="Memory" subtitle="Long-term memory and daily logs" />

      <div className="px-6 py-4" style={{ borderBottom: '1px solid #1e1e2e' }}>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6b6b80' }} />
          <input
            type="text"
            placeholder="Search memory..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm card"
            style={{
              background: '#12121a',
              border: '1px solid #1e1e2e',
              color: '#e8e8f0',
              outline: 'none',
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {query ? (
          <div className="space-y-1">
            {filtered.map((line, i) => (
              <div key={i} className="text-sm py-1" style={{ color: line.startsWith('#') ? '#e8e8f0' : '#c8c8d0' }}>
                {line || '\u00A0'}
              </div>
            ))}
          </div>
        ) : (
          <div className="prose prose-sm max-w-none space-y-4">
            {lines.map((line, i) => {
              if (!line.trim()) return <div key={i} className="h-2" />;
              const isHeading = line.startsWith('#');
              const isList = line.startsWith('-');
              return (
                <div
                  key={i}
                  className="text-sm leading-relaxed"
                  style={{
                    color: isHeading ? '#e8e8f0' : '#c8c8d0',
                    fontWeight: isHeading ? 600 : 400,
                    paddingLeft: isList ? '1rem' : '0',
                  }}
                >
                  {line}
                </div>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && query && (
          <div className="text-center py-12 text-sm" style={{ color: '#6b6b80' }}>
            No results for "{query}"
          </div>
        )}
      </div>
    </div>
  );
}