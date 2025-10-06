'use client';
import { useEffect } from 'react';
import { useUI } from '../../lib/uiStore';
import React from 'react';

const gates = ['Puerta A', 'Puerta B', 'Puerta C', 'Puerta D'];
const passTypes = ['', 'VIP', 'General', 'Backstage', 'Prensa'];

/**
 * Controls for selecting the current gate and pass type.  Persisted
 * selections are loaded from localStorage and stored via zustand.
 */
export default function GateControls() {
  const { gate, passType, setGate, setPassType, load } = useUI();
  useEffect(() => {
    load();
  }, [load]);
  return (
    <div className="flex items-center gap-3 text-sm">
      <label className="opacity-70">Puerta:</label>
      <select
        aria-label="selector-puerta"
        className="bg-white/10 border border-white/10 rounded px-2 py-1"
        value={gate}
        onChange={(e) => setGate(e.target.value)}
      >
        {gates.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
      <label className="opacity-70">Tipo pase:</label>
      <select
        aria-label="selector-pase"
        className="bg-white/10 border border-white/10 rounded px-2 py-1"
        value={passType}
        onChange={(e) => setPassType(e.target.value)}
      >
        {passTypes.map((p) => (
          <option key={p} value={p}>
            {p || 'Todos'}
          </option>
        ))}
      </select>
    </div>
  );
}
