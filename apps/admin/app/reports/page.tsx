'use client';
import { Card, Button } from '@ui/index';
import { useToast } from '@ui/hooks/useToast';
import React from 'react';

const kpis = [
  { label: 'Asistencia promedio', value: '76%', trend: '+4 pts' },
  { label: 'Confirmaciones', value: '12,430', trend: '+12%' },
  { label: 'No-shows', value: '1,120', trend: '-6%' },
];

/**
 * Página de reportes con exportación PDF/CSV y métricas automáticas.
 */
export default function ReportsPage() {
  const { showToast } = useToast();

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Reportes</h1>
        <p className="text-sm text-slate-500">Exporta métricas de asistencia, confirmación y ausencias.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{kpi.label}</p>
            <p className="text-3xl font-bold text-slate-900">{kpi.value}</p>
            <p className="text-xs font-semibold text-emerald-600">{kpi.trend}</p>
          </Card>
        ))}
      </section>

      <Card className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Exportaciones</h2>
        <p className="text-sm text-slate-500">
          Genera reportes en PDF para compartir con clientes o CSV para análisis en Excel.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => showToast('Generando PDF...', 'info')}>Exportar PDF</Button>
          <Button variant="secondary" onClick={() => showToast('Archivo CSV preparado', 'success')}>
            Descargar CSV
          </Button>
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Historial de descargas</h2>
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="p-2 font-semibold">Fecha</th>
              <th className="p-2 font-semibold">Tipo</th>
              <th className="p-2 font-semibold">Evento</th>
              <th className="p-2 font-semibold text-right">Generado por</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="p-2">12/09/2024</td>
              <td className="p-2">PDF</td>
              <td className="p-2">Expo Gourmand</td>
              <td className="p-2 text-right">Laura Méndez</td>
            </tr>
            <tr>
              <td className="p-2">11/09/2024</td>
              <td className="p-2">CSV</td>
              <td className="p-2">Summit Innovación</td>
              <td className="p-2 text-right">Carlos Vega</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}
