import { useEffect, useRef, useState, useCallback } from 'react';

export function useSnapshot() {
  const [data, setData] = useState<unknown | null>(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const restFetched = useRef(false);

  const connect = useCallback(() => {
    try {
      const wsUrl = (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host + '/ws';
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        setConnected(false);
        setTimeout(connect, 3000);
      };
      ws.onerror = () => ws.close();

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'snapshot' || msg.type === 'refresh') {
            setData(msg.payload);
          }
        } catch {
          // ignore parse errors
        }
      };
    } catch {
      setTimeout(connect, 3000);
    }
  }, []);

  // REST fallback — fetch if WS hasn't delivered data in 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!data && !restFetched.current) {
        restFetched.current = true;
        fetch('/api/snapshot')
          .then(r => r.json())
          .then(d => {
            if (d && typeof d === 'object') setData(d);
          })
          .catch(() => {});
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [data]);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
    };
  }, [connect]);

  return { data, connected };
}
