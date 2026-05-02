import { useState } from 'react';
import { Header } from '@/components/Header';
import { useSnapshot } from '@/hooks/useWebSocket';
import { FileText } from 'lucide-react';

export function DocsPage() {
  const { data } = useSnapshot();
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const docs: any[] = (data as any)?.blogposts ?? [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="Docs" subtitle="Agent-produced documents and drafts" />

      <div className="flex-1 overflow-y-auto p-6">
        {docs.length === 0 ? (
          <div className="text-center py-16">
            <FileText size={32} className="mx-auto mb-3" style={{ color: '#1e1e2e' }} />
            <div className="text-sm" style={{ color: '#6b6b80' }}>
              No documents yet — blog drafts from obsidian <code className="px-1 rounded" style={{ background: '#1e1e2e' }}>07 Blogposts/</code> appear here
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {docs.map((doc: any, i: number) => (
              <div
                key={i}
                className="card p-4 cursor-pointer hover:border-[#c9a84c] transition-colors"
                style={{ borderLeft: '2px solid #7c5cbf' }}
                onClick={() => setSelectedDoc(doc)}
              >
                <div className="text-sm font-medium mb-2" style={{ color: '#e8e8f0' }}>
                  {doc.name?.replace(/\.md$/, '').replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                </div>
                <div className="text-xs line-clamp-3" style={{ color: '#6b6b80' }}>
                  {doc.content?.substring(0, 120)}...
                </div>
                {doc.updated && (
                  <div className="text-xs font-mono mt-2" style={{ color: '#3ecfcf' }}>
                    {doc.updated}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Doc modal */}
      {selectedDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-8"
          style={{ background: 'rgba(0,0,0,0.8)' }}
          onClick={() => setSelectedDoc(null)}
        >
          <div
            className="card max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
            style={{ borderLeft: '2px solid #c9a84c' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="text-lg font-semibold mb-4" style={{ color: '#e8e8f0' }}>
              {selectedDoc.name?.replace('.md', '').replace(/-/g, ' ')}
            </div>
            <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#c8c8d0' }}>
              {selectedDoc.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}