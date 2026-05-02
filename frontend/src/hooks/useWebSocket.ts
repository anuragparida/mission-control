import { useEffect, useRef, useState } from 'react';

interface UseWebSocketOptions {
  onMessage?: (data: unknown) => void;
  /** How long to wait before falling back to REST API (ms). Default 5000. */
  restFallbackDelay?: number;
}

interface UseWebSocketResult {
  data: unknown | null;
  connected: boolean;
}

/**
 * Clean WebSocket hook with proper React patterns.
 * 
 * Key behaviors:
 * - Connects to /ws relative to current location (works for any host:port combo)
 * - Sends initial snapshot immediately on connection
 * - Handles reconnection on disconnect gracefully
 * - REST fallback if WebSocket doesn't deliver data within timeout
 * - All state updates happen in useEffect, never during render
 */
export function useWebSocket({ onMessage, restFallbackDelay = 5000 }: UseWebSocketOptions = {}): UseWebSocketResult {
  const [data, setData] = useState<unknown | null>(null);
  const [connected, setConnected] = useState(false);
  
  // Refs to avoid stale closures and state-during-render issues
  const wsRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restFallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restFetchedRef = useRef(false);

  // Keep onMessage callback ref current without re-triggering effects
  onMessageRef.current = onMessage;

  useEffect(() => {
    let cancelled = false;

    function connect() {
      if (cancelled) return;

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = protocol + '//' + window.location.host + '/ws';

      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          if (cancelled) { ws.close(); return; }
          setConnected(true);
          // Schedule REST fallback in case WS never delivers
          if (!restFetchedRef.current) {
            restFallbackTimerRef.current = setTimeout(() => {
              if (!cancelled && !wsRef.current?.readyState) return;
              restFetchedRef.current = true;
              fetch('/api/snapshot')
                .then(r => r.json())
                .then(d => { if (d && typeof d === 'object') setData(d); })
                .catch(() => {});
            }, restFallbackDelay);
          }
        };

        ws.onclose = () => {
          if (cancelled) return;
          setConnected(false);
          wsRef.current = null;
          // Clean up fallback timer
          if (restFallbackTimerRef.current) {
            clearTimeout(restFallbackTimerRef.current);
            restFallbackTimerRef.current = null;
          }
          // Reconnect after 3s
          if (!cancelled) {
            reconnectTimerRef.current = setTimeout(connect, 3000);
          }
        };

        ws.onerror = () => {
          // onerror is always followed by onclose, let onclose handle cleanup
          ws.close();
        };

        ws.onmessage = (event: MessageEvent) => {
          if (cancelled) return;
          try {
            const msg = JSON.parse(event.data as string);
            if (msg.type === 'snapshot' || msg.type === 'refresh') {
              setData(msg.payload);
            }
            onMessageRef.current?.(msg.payload);
          } catch {
            // Ignore parse errors
          }
        };
      } catch {
        // Connection failed, retry after 3s
        if (!cancelled) {
          reconnectTimerRef.current = setTimeout(connect, 3000);
        }
      }
    }

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (restFallbackTimerRef.current) clearTimeout(restFallbackTimerRef.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, []); // Empty deps - connect is defined inline and only runs once

  return { data, connected };
}

export function useSnapshot() {
  return useWebSocket();
}