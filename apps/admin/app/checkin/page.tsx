'use client';

import React, { useMemo, useState } from 'react';
import { Button, Card } from '@ui/index';

const gates = ['Acceso principal', 'Puerta VIP', 'Backstage'];
const passTypes = ['General', 'VIP', 'Prensa'];

const timeline = [
  { hour: '18:00', total: 120 },
  { hour: '19:00', total: 210 },
  { hour: '20:00', total: 160 },
  { hour: '21:00', total: 95 },
];

/**
 * Panel de monitoreo de check-in con métricas en tiempo real y cambio de
 * vista por puerta o tipo de pase.
 */
export default function CheckinPage() {
  const [viewMode, setViewMode] = useState<'gate' | 'pass'>('gate');
  const [selected, setSelected] = useState<string>(gates[0]);

  const stats = useMemo(() => {
    if (viewMode === 'gate') {
      return {
        title: selected,
        validated: 620,
        duplicates: 18,
        rejected: 6,
      };
    }
    return {
      title: selected,
      validated: 420,
      duplicates: 4,
      rejected: 2,
    };
  }, [viewMode, selected]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Panel de check-in</h1>
        <p className="text-sm text-slate-500">
          Consulta entradas validadas, duplicados y rechazos con sincronización en vivo.
        </p>
      </header>

      <section className="flex flex-wrap gap-3">
        <Button variant={viewMode === 'gate' ? 'primary' : 'secondary'} onClick={() => setViewMode('gate')}>
          Ver por puertas
        </Button>
        <Button variant={viewMode === 'pass' ? 'primary' : 'secondary'} onClick={() => setViewMode('pass')}>
          Ver por tipo de pase
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-[1.3fr,1fr]">
        <Card className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(viewMode === 'gate' ? gates : passTypes).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSelected(item)}
                className={`rounded-full px-4 py-1 text-sm font-semibold transition ${
                  item === selected ? 'bg-[var(--color-accent)] text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="grid gap-3 rounded-2xl bg-slate-50 p-6">
            <h2 className="text-2xl font-semibold text-slate-900">{stats.title}</h2>
            <p className="text-sm text-slate-500">Validaciones en los últimos 10 minutos.</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Validados</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.validated}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Duplicados</p>
                <p className="text-2xl font-bold text-amber-600">{stats.duplicates}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Rechazados</p>
                <p className="text-2xl font-bold text-rose-600">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Historial rápido</h2>
          <ul className="space-y-3 text-sm text-slate-500">
            {timeline.map((item) => (
              <li key={item.hour} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span>{item.hour}</span>
                <span className="font-semibold text-slate-700">{item.total} accesos</span>
              </li>
            ))}
          </ul>
          <div className="rounded-2xl border border-slate-100 p-4">
            <p className="text-xs text-slate-500">
              El modo offline sincroniza automáticamente cuando la app detecta conexión estable.
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
