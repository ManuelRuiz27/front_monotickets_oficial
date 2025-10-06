import { TicketQR } from '../../../components/TicketQR';
import React from 'react';

/**
 * Ticket page that displays a QR code using the glassmorphism layout.
 */
export default function TicketPage({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <header className="space-y-2 text-center">
        <p className="badge inline-flex">Pase listo</p>
        <h1 className="text-3xl font-semibold text-[var(--color-text-strong)]">Tu entrada</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Guarda el código en tu dispositivo y muéstralo en el acceso del evento.
        </p>
      </header>
      <TicketQR id={params.id} />
    </div>
  );
}
