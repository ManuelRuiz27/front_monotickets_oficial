import { Card } from '@ui/index';
import React from 'react';

type DashboardCardProps = {
  title: string;
  value: string;
  description?: string;
  trendLabel?: string;
  trendDirection?: 'up' | 'down';
};

/**
 * Tarjeta de métricas enriquecida para el panel del organizador.
 * Permite mostrar descripción adicional y variaciones porcentuales.
 */
export const DashboardCard = React.memo(
  ({ title, value, description, trendLabel, trendDirection = 'up' }: DashboardCardProps) => (
    <Card className="flex flex-col gap-2 rounded-2xl bg-white/80 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">{title}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      {description && <p className="text-sm text-slate-500">{description}</p>}
      {trendLabel && (
        <p
          className={`text-xs font-semibold ${
            trendDirection === 'up' ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {trendDirection === 'up' ? '▲' : '▼'} {trendLabel}
        </p>
      )}
    </Card>
  )
);

DashboardCard.displayName = 'DashboardCard';
