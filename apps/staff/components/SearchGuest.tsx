'use client';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@api/monotickets-sdk';
import React from 'react';

type Item = {
  id: string;
  name: string;
  passType?: string | null;
  entered: boolean;
  lastCheckinAt?: string | null;
};

/**
 * Component for searching guests by name.  Implements a debounce to reduce
 * API calls and displays results in a table with status and last check-in.
 */
export default function SearchGuest() {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const debounced = useDebounce(q, 300);

  useEffect(() => {
    const run = async () => {
      if (!debounced || debounced.length < 2) {
        setItems([]);
        return;
      }
      setLoading(true);
      try {
        const { data } = await api.get(`/staff/search`, { params: { query: debounced } });
        setItems(data?.items || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [debounced]);

  const statusTag = (it: Item) =>
    it.entered ? (
      <span className="text-green-400">Ingresó ✅</span>
    ) : (
      <span className="text-yellow-400">Pendiente ⏳</span>
    );

  return (
    <div className="rounded-lg border border-white/10 p-4 bg-black/20">
      <div className="flex items-center gap-3 mb-4">
        <input
          autoFocus
          placeholder="Buscar por nombre…"
          className="bg-white/10 border border-white/10 rounded px-3 py-2 w-full"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {loading && <span className="text-xs opacity-70">Buscando…</span>}
      </div>
      <div className="overflow-auto rounded-lg border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left px-3 py-2">Nombre</th>
              <th className="text-left px-3 py-2">Tipo de pase</th>
              <th className="text-left px-3 py-2">Estado</th>
              <th className="text-left px-3 py-2">Último check-in</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-4 opacity-70">
                  Sin resultados
                </td>
              </tr>
            )}
            {items.map((it) => (
              <tr key={it.id} className="border-t border-white/5">
                <td className="px-3 py-2">{it.name}</td>
                <td className="px-3 py-2">{it.passType || '-'}</td>
                <td className="px-3 py-2">{statusTag(it)}</td>
                <td className="px-3 py-2">
                  {it.lastCheckinAt ? new Date(it.lastCheckinAt).toLocaleString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs opacity-70 mt-3">
        Consejo: escribe al menos 2 caracteres para buscar. El estado se calcula desde la base del
        evento.
      </p>
    </div>
  );
}

function useDebounce<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}
