'use client';
import { useState } from 'react';
import { Button, Card, useToast } from '@ui/index';
import React from 'react';

/**
 * A three-step wizard for creating a new event.  Collects the event name,
 * date, and location sequentially.  In a real application you might
 * connect these steps to form state or API calls.
 */
export const EventWizard = () => {
  const [step, setStep] = useState(1);
  const [eventData, setEventData] = useState({ name: '', date: '', location: '' });
  const { showToast } = useToast();
  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  const handleFinish = () => {
    // Here you would typically send the eventData to the API
    showToast('Evento creado!', 'success');
  };

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Crear Nuevo Evento</h2>
      {step === 1 && (
        <>
          <input
            placeholder="Nombre del evento"
            className="border p-2 mb-3 w-full"
            value={eventData.name}
            onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
          />
          <Button onClick={next}>Siguiente</Button>
        </>
      )}
      {step === 2 && (
        <>
          <input
            type="date"
            aria-label="date-input"
            className="border p-2 mb-3 w-full"
            value={eventData.date}
            onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
          />
          <div className="flex justify-between">
            <Button variant="secondary" onClick={prev}>
              Atrás
            </Button>
            <Button onClick={next}>Siguiente</Button>
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <input
            placeholder="Ubicación"
            className="border p-2 mb-3 w-full"
            value={eventData.location}
            onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
          />
          <div className="flex justify-between">
            <Button variant="secondary" onClick={prev}>
              Atrás
            </Button>
            <Button onClick={handleFinish}>Finalizar</Button>
          </div>
        </>
      )}
    </Card>
  );
};
