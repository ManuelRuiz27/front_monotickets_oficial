import Link from 'next/link';
import { Button, Card } from '@ui/index';
import React from 'react';

/**
 * List of events with a link to create a new event.  Uses static mock data
 * for now; in a real application this would fetch from the API.
 */
export default function EventsPage() {
  const events = [
    { id: 1, name: 'Boda Martínez', status: 'Publicado' },
    { id: 2, name: 'Conferencia Tech', status: 'Borrador' },
  ];
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Eventos</h1>
        <Link href="/events/new">
          <Button>+ Crear nuevo evento</Button>
        </Link>
      </div>
      <div className="grid gap-3">
        {events.map((e) => (
          <Card key={e.id}>
            <div className="flex justify-between">
              <span>{e.name}</span>
              <span className="text-sm text-gray-500">{e.status}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
