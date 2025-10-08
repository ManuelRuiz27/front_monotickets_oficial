'use client';

import React, { useMemo, useState } from 'react';
import { Button, Card } from '@ui/index';
import { formatCurrency } from '@utils/index';

const creditHistory = [
  { id: 'tx-1', event: 'Expo Gourmand', amount: -450, concept: 'Uso de QR dinámicos', at: '2024-09-10' },
  { id: 'tx-2', event: 'Graduación Tec', amount: -320, concept: 'Envío de SMS', at: '2024-09-12' },
  { id: 'tx-3', event: 'Summit Innovación', amount: 800, concept: 'Recarga del Súper Admin', at: '2024-09-13' },
];

/**
 * Panel de créditos para organizadores: muestra saldo, consumo y bitácora.
 */
export default function CreditsPage() {
  const [balance, setBalance] = useState(3200);
  const totals = useMemo(() => {
    const consumed = creditHistory.filter((item) => item.amount < 0).reduce((acc, item) => acc + item.amount, 0);
    const recharges = creditHistory.filter((item) => item.amount > 0).reduce((acc, item) => acc + item.amount, 0);
    return { consumed, recharges };
  }, []);

  const requestRecharge = () => {
    setBalance((prev) => prev + 1000);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Créditos</h1>
        <p className="text-sm text-slate-500">Consulta tu saldo disponible, recargas y consumo por evento.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Saldo disponible</p>
          <p className="text-3xl font-bold text-slate-900">{formatCurrency(balance)}</p>
        </Card>
        <Card className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Consumo acumulado</p>
          <p className="text-3xl font-bold text-rose-600">{formatCurrency(Math.abs(totals.consumed))}</p>
        </Card>
        <Card className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Recargas recibidas</p>
          <p className="text-3xl font-bold text-emerald-600">{formatCurrency(totals.recharges)}</p>
        </Card>
      </section>

      <Card className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Bitácora de uso</h2>
            <p className="text-sm text-slate-500">Movimientos recientes por evento y concepto.</p>
          </div>
          <Button onClick={requestRecharge}>Solicitar recarga de 1,000 créditos</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="p-2 font-semibold">Evento</th>
                <th className="p-2 font-semibold">Concepto</th>
                <th className="p-2 font-semibold">Fecha</th>
                <th className="p-2 font-semibold text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {creditHistory.map((item) => (
                <tr key={item.id}>
                  <td className="p-2 font-medium text-slate-900">{item.event}</td>
                  <td className="p-2 text-slate-500">{item.concept}</td>
                  <td className="p-2 text-slate-500">{new Date(item.at).toLocaleDateString('es-MX')}</td>
                  <td className="p-2 text-right font-semibold">
                    <span className={item.amount > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                      {item.amount > 0 ? '+' : '-'}
                      {formatCurrency(Math.abs(item.amount))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
