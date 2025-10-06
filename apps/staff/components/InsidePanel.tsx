'use client';
import { useEffect } from 'react';
import { useInside } from '../lib/insideStore';
import { connectWS } from '../lib/ws';
import React from 'react';

/**
 * Displays the current occupancy inside the event and details of the last
 * person scanned.  Connects to a WebSocket to receive live updates.
 */
export default function InsidePanel() {
  const { insideCount, lastPerson } = useInside();
  useEffect(() => {
    connectWS();
  }, []);
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-1 rounded-lg border border-white/10 p-4 bg-black/20">
        <h3 className="font-semibold mb-2">Aforo dentro</h3>
        <div className="text-5xl font-extrabold text-green-400">{insideCount}</div>
        <p className="text-xs opacity-70 mt-2">Personas actualmente dentro del evento</p>
      </div>
      <div className="md:col-span-2 rounded-lg border border-white/10 p-4 bg-black/20">
        <h3 className="font-semibold mb-2">Último escaneo</h3>
        {!lastPerson ? (
          <p className="opacity-70">Aún no hay escaneos en esta sesión.</p>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="text-lg">
              <b>{lastPerson.name}</b> {lastPerson.passType ? `• ${lastPerson.passType}` : ''}
            </div>
            <div className="text-sm">
              Estado:{' '}
              {lastPerson.status === 'valid' && <span className="text-green-400">✅ válido</span>}
              {lastPerson.status === 'duplicate' && (
                <span className="text-yellow-400">⚠️ duplicado</span>
              )}
              {lastPerson.status === 'invalid' && (
                <span className="text-red-400">❌ no válido</span>
              )}
            </div>
            <div className="text-sm opacity-80">
              {lastPerson.alreadyEntered ? 'Ya había ingresado antes' : 'Primera entrada'}
              {lastPerson.lastCheckinAt
                ? ` • Último check-in: ${new Date(lastPerson.lastCheckinAt).toLocaleString()}`
                : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
