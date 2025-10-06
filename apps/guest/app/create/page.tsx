'use client';

import React, { useState } from 'react';
import { Button, Card } from '@ui/index';
import { motion } from 'framer-motion';

export default function CreateEventPage() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <p className="badge inline-flex">Crear evento</p>
        <h1 className="text-3xl font-semibold text-[var(--color-text-strong)]">Diseña una nueva experiencia</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Completa los datos principales y visualiza un resumen previo antes de publicar.
        </p>
      </header>
      <Card className="space-y-6">
        <form
          className="grid gap-5 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <label className="flex flex-col gap-2 text-sm font-medium">
            Nombre del evento
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-2xl border border-[var(--color-border-soft)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-[var(--color-text)] shadow-soft transition-base focus-visible:border-[var(--color-accent)]"
              placeholder="Ej. Networking Nocturno"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Fecha
            <input
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="rounded-2xl border border-[var(--color-border-soft)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-[var(--color-text)] shadow-soft transition-base focus-visible:border-[var(--color-accent)]"
            />
          </label>
          <label className="sm:col-span-2 flex flex-col gap-2 text-sm font-medium">
            Ubicación
            <input
              required
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="rounded-2xl border border-[var(--color-border-soft)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-[var(--color-text)] shadow-soft transition-base focus-visible:border-[var(--color-accent)]"
              placeholder="Dirección o formato híbrido"
            />
          </label>
          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" disabled={!name || !date || !location}>
              Guardar borrador
            </Button>
          </div>
        </form>
        {submitted && (
          <div className="rounded-3xl border border-[var(--color-border-soft)] bg-[rgba(75,163,255,0.12)] px-5 py-4 text-sm text-[var(--color-text-strong)]">
            <p className="font-semibold">¡Borrador creado!</p>
            <p className="text-[var(--color-text-muted)]">
              Revisa los detalles y activa la venta de boletos cuando estés listo. El modo oscuro permanece según tu preferencia.
            </p>
          </div>
        )}
      </Card>
    </motion.section>
  );
}
