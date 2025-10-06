'use client';

import React from 'react';
import { Card } from '@ui/index';
import { motion } from 'framer-motion';

const metrics = [
  { label: 'Ingresos en tiempo real', value: '$482,300 MXN', change: '+12% vs. semana anterior' },
  { label: 'Conversión checkout', value: '68%', change: '+4 puntos porcentuales' },
  { label: 'Reembolsos', value: '3%', change: '-1% gracias a notificaciones proactivas' },
];

export default function SalesPage() {
  return (
    <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <header className="space-y-2">
        <p className="badge inline-flex">Ventas</p>
        <h1 className="text-3xl font-semibold text-[var(--color-text-strong)]">Desempeño comercial</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Monitorea métricas clave con tarjetas glassmorphism y contrastes accesibles.
        </p>
      </header>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label} className="space-y-3">
            <p className="text-sm uppercase tracking-[0.25em] text-[var(--color-text-muted)]">{metric.label}</p>
            <p className="text-3xl font-semibold text-[var(--color-text-strong)]">{metric.value}</p>
            <p className="text-sm text-[var(--color-text)]">{metric.change}</p>
          </Card>
        ))}
      </div>
      <Card className="space-y-3">
        <h2 className="text-xl font-semibold text-[var(--color-text-strong)]">Resumen</h2>
        <p className="text-sm text-[var(--color-text)]">
          Habilita notificaciones inteligentes y guarda tu preferencia de modo para recibir alertas según el desempeño del evento.
        </p>
      </Card>
    </motion.section>
  );
}
