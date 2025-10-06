import React from 'react';

interface Props {
  params: { id: string };
}

/**
 * Detail page for a specific event.  Displays the event ID from the URL
 * parameters.  In a real application, you would fetch event details based
 * on this ID.
 */
export default function EventDetailPage({ params }: Props) {
  const { id } = params;
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Detalles del Evento</h1>
      <p>ID del evento: {id}</p>
      <p className="text-gray-600 mt-4">Aquí se mostrarán los detalles del evento.</p>
    </div>
  );
}
