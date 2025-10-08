import Link from 'next/link';
import { Button, Card } from '@ui/index';
import React from 'react';

const events = [
  {
    id: 'evt-1',
    name: 'Boda Martínez',
    status: 'Publicado',
    passes: ['VIP', 'General'],
    invitations: 320,
    location: 'Hacienda San José',
  },
  {
    id: 'evt-2',
    name: 'Conferencia Tech',
    status: 'Borrador',
    passes: ['General', 'Prensa'],
    invitations: 980,
    location: 'Centro Citibanamex',
  },
  {
    id: 'evt-3',
    name: 'Foro Creativo 2024',
    status: 'Archivado',
    passes: ['Backstage', 'VIP'],
    invitations: 450,
    location: 'Pepsi Center',
  },
];

/**
 * Listado de eventos con información de pases, estado y acceso a wizard.
 */
export default function EventsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Eventos</h1>
          <p className="text-sm text-slate-500">
            Gestiona estados de borrador, publicación o archivo y consulta invitaciones enviadas.
          </p>
        </div>
        <Link href="/events/new">
          <Button>+ Crear nuevo evento</Button>
        </Link>
      </header>

      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id} className="space-y-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{event.name}</h2>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{event.status}</p>
              </div>
              <div className="text-sm text-slate-500">
                <p>{event.location}</p>
                <p>{event.invitations.toLocaleString('es-MX')} invitaciones</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {event.passes.map((pass) => (
                <span key={pass} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {pass}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-slate-500">
              <Link href={`/events/${event.id}`} className="text-[var(--color-accent)] underline">
                Abrir wizard de edición
              </Link>
              <Link href="/checkin" className="text-[var(--color-accent)] underline">
                Ver check-in en vivo
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
