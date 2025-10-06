'use client';

import React from 'react';
import { Card } from '@ui/index';
import { motion } from 'framer-motion';
import { usePreserveScroll } from '@hooks/usePreserveScroll';

const events = [
  {
    id: 'aurora',
    title: 'Aurora Sessions',
    date: '15 nov 2024',
    status: 'Próximo',
    attendees: 480,
  },
  {
    id: 'summit',
    title: 'Summit Creativo 2024',
    date: '23 nov 2024',
    status: 'En curso',
    attendees: 950,
  },
  {
    id: 'classic',
    title: 'Noches Clásicas',
    date: '8 dic 2024',
    status: 'Planeado',
    attendees: 320,
  },
];

export default function EventsPage() {
  usePreserveScroll('dashboard-events');

  return (
    <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <header className="space-y-2">
        <p className="badge inline-flex">Mis eventos</p>
        <h1 className="text-3xl font-semibold text-[var(--color-text-strong)]">Gestiona tus experiencias</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Visualiza estadísticas rápidas y mantén tu posición de scroll al volver desde cualquier detalle.
        </p>
      </header>
      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id} className="flex h-full flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[var(--color-text-strong)]">{event.title}</h2>
                <p className="text-sm text-[var(--color-text-muted)]">{event.date}</p>
              </div>
              <span className="rounded-full bg-[rgba(75,163,255,0.18)] px-3 py-1 text-xs font-semibold text-[var(--color-text-strong)]">
                {event.status}
              </span>
            </div>
            <p className="text-sm text-[var(--color-text)]">Entradas confirmadas: {event.attendees.toLocaleString('es-MX')}</p>
            <div className="mt-auto flex flex-wrap gap-3 text-xs text-[var(--color-text-muted)]">
              <span>• RSVP activos con recordatorios automáticos</span>
              <span>• Check-in con QR dinámico</span>
            </div>
          </Card>
        ))}
      </div>
    </motion.section>
  );
}
