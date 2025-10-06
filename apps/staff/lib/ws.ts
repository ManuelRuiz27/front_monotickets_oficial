'use client';
import { useInside } from './insideStore';

type MsgIn =
  | { type: 'inside_snapshot'; insideCount: number }
  | { type: 'inside_incr'; delta: number; insideCount: number };

let socket: WebSocket | null = null;

export function connectWS() {
  if (socket) return socket;
  const url =
    process.env.NEXT_PUBLIC_WS_URL ||
    `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`;
  const { setSnapshot } = useInside.getState();
  socket = new WebSocket(url);
  socket.onmessage = (ev) => {
    try {
      const data = JSON.parse(ev.data) as MsgIn;
      if (data.type === 'inside_snapshot' || data.type === 'inside_incr') {
        setSnapshot(data.insideCount);
      }
    } catch {
      // ignore invalid messages
    }
  };
  socket.onclose = () => {
    socket = null;
    setTimeout(() => connectWS(), 1500);
  };
  return socket;
}
