import { useEffect, useRef, useState } from 'react';

export default function WsDebug() {
  const [status, setStatus] = useState('idle');
  const [messages, setMessages] = useState<string[]>([]);
  const [wsUrl, setWsUrl] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const url = `${protocol}//${host}/ws`;
    setWsUrl(url);

    const ws = new WebSocket(url);
    wsRef.current = ws;
    setStatus('connecting');

    ws.onopen = () => {
      setStatus('OPEN - connected!');
      setMessages(m => [...m, `[${new Date().toISOString()}] Connected!`]);
    };

    ws.onmessage = (event) => {
      setMessages(m => [...m, `[${new Date().toISOString()}] Received ${event.data.length} chars`]);
      try {
        const parsed = JSON.parse(event.data);
        setMessages(m => [...m, `  type=${parsed.type}, payload keys=${Object.keys(parsed.payload || {}).join(',')}`]);
      } catch {
        setMessages(m => [...m, `  raw: ${event.data.slice(0, 100)}`]);
      }
    };

    ws.onerror = (e) => {
      setStatus('ERROR - see console');
      setMessages(m => [...m, `[${new Date().toISOString()}] ERROR!`]);
      console.error('WS error event:', e);
    };

    ws.onclose = (e) => {
      setStatus(`CLOSED code=${e.code} reason=${e.reason || 'none'}`);
      setMessages(m => [...m, `[${new Date().toISOString()}] Closed`]);
    };

    return () => ws.close();
  }, []);

  const sendPing = () => {
    wsRef.current?.send(JSON.stringify({ type: 'ping' }));
    setMessages(m => [...m, `[${new Date().toISOString()}] Sent ping`]);
  };

  return (
    <div style={{ padding: '20px', color: '#e8e8f0', background: '#0a0a0f', minHeight: '100vh' }}>
      <h1 style={{ color: '#c9a84c' }}>WebSocket Debug</h1>
      <p>WS URL: <code style={{ color: '#3ecf8e' }}>{wsUrl}</code></p>
      <p>Status: <span style={{ color: status === 'OPEN - connected!' ? '#3ecf8e' : '#cf3e5c' }}>{status}</span></p>
      <button onClick={sendPing} style={{ padding: '8px 16px', margin: '8px 0', background: '#1e1e2e', color: '#e8e8f0' }}>
        Send Ping
      </button>
      <div style={{ marginTop: '16px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ fontFamily: 'monospace', fontSize: '12px', padding: '4px 0', borderBottom: '1px solid #1e1e2e' }}>
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}